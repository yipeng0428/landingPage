export const head = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no">
    <meta name="HandheldFriendly" content="true">
    <meta name="format-detection" content="telephone=no">
    <title>title</title>
    <style type="text/css">
        body, p, div{margin: 0;padding: 0;vertical-align: middle;}
        body {background: #000;-webkit-user-select: none;-webkit-text-size-adjust: none;}
        a {text-decoration: none;}
        .pr {position: relative;}
        .none {display: none}
        .wrap {width: 100%;max-width: 640px;margin: 0 auto;overflow: hidden;position: relative;}
        .com_box {position: fixed;top: 0;width: 100%;max-width: 640px;margin: 0 auto;z-index: 9;}
        .img {display: block;width: 100%}
        .c_btn {position: absolute;height: 100%;top: 0;}
        .foot {color:#aaa;text-align: center;padding:20px 0;background-color: #000; max-width: 640px; margin: 0 auto;}
    </style>
    <script language="JavaScript">
        var dwn_url = "{$data.downurl}";
        var isWeiXin = {$data.isWeixin};
        var id = {$data.id};
        var mode = {$data.download_mode};
        if (mode == 1) {
            setTimeout('gourl()', 3000);
        }
    </script>
</head>
<body>
<div class="none">{$data.header}</div>
<if condition="$data.download_mode eq 3 ">
`;
export const footer = `
</a>
</if>
<img id='myimg' style="display:none" src='' />
<script src="__PUBLIC__/LandingPage/common.js"></script>
<div class="none">{$data.footer}</div>
</body>
</html>
`;
export let list = {
    list: []
};