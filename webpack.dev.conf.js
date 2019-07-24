'use strict'
const webpack = require('webpack')
const path = require('path')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const portfinder = require('portfinder')
const AssetsPlugin = require('assets-webpack-plugin');
const config = require("./config");

const resolve = (dir) => path.join(__dirname, dir);
const assetsPath = (_path) => path.posix.join('/static/landingpage', _path)
const devWebpackConfig = {
    entry: {
        index: './src/js/index.js'
    },
    output: {
        path: '/dist',
        publicPath: '/static/landingpage',
        filename: '[name].js',
    },
    resolve: {
        extensions: ['.js', '.css', '.scss'],
        alias: {
            '@': resolve('src')
        }
    },
    module: {
        rules: [{
                test: /\.(css|scss)$/,
                exclude: /^node_modules$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1
                            }
                        },
                        {
                            loader: 'sass-loader'
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: function () {
                                    return [
                                        require('postcss-import')(),
                                        require('autoprefixer')({
                                            browsers: ['last 5 versions']
                                        })
                                    ]
                                }
                            }
                        }
                    ]
                }),
            }, {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src'), resolve('node_modules/webpack-dev-server/client')]
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: assetsPath('media/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    },
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new ExtractTextPlugin("[name].css"),
        new AssetsPlugin({filename: './source-map.json', prettyPrint: true})
    ],
    devServer: {
        port: 8082,
        host: 'localhost',
        quiet: true, // necessary for FriendlyErrorsPlugin
        hot: true,
        proxy: {
            '/addImg':{
                target: config.proxyUrl,
                changeOrigin: true,
                secure: false
            },
            '/html':{
                target: config.proxyUrl,
                changeOrigin: true,
                secure: false
            },
            '/getNameList':{
                target: config.proxyUrl,
            },
            '/moban': {
                target: config.proxyUrl
            },
            "/loadMoban": {
                target: config.proxyUrl
            }
        }
    }
}

module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = process.env.PORT || 8082
    portfinder.getPort((err, port) => {
        if (err) {
            reject(err)
        } else {
            // publish the new Port, necessary for e2e tests
            process.env.PORT = port
            // add port to devServer config
            devWebpackConfig.devServer.port = port

            // Add FriendlyErrorsPlugin
            devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
                compilationSuccessInfo: {
                    messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
                },

            }))

            resolve(devWebpackConfig)
        }
    })
})