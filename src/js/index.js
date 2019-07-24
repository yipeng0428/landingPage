import config from '../../config';
import utils from './utils';
import {
    head,
    footer,
    list
} from './tpl'
import {
    $wrap1,
    $wrap2,
    $copy,
    $number,
    $moban,
    $changePic,
    $deletePic,
    $clear,
    $down,
    $up,
    $marginTop,
    $addPicBtn,
    $deleteBtn,
    $addPic,
    $changePicBtn,
    $submit,
    $load,
    $addSwiper,
    $controls
} from './dom';
import "@/css/init.css";
import "@/css/index.scss";

var $current_btn, $current_img,
    $pr, moban, action = 'new',
    picAction;
var handle = {
    init: () => {
        var startX = 0,
            startY = 0,
            flag = false,
            a_width = 0,
            a_height = 0,
            i = 0, // btn id计数
            a;

        //localStorage.getItem("lastwrap") && $wrap1.html(localStorage.getItem("lastwrap"));
        //localStorage.getItem("lastnumber") && $number.val(localStorage.getItem("lastnumber"));
        /* 获取落地页名称列表 */
        if ($("input:radio[name=action]").val() == 'modify') {
            $load.show()
        }
        async function getNameList() {
            list.list = await utils.getNameList();
            moban = utils.getMoban($moban.val())
        }
        getNameList();

        $wrap1.on('mousedown', '.img', function (e) {
            e.preventDefault();
            $current_img = $(e.target);
            $pr = $(e.target).closest('.pr')
            $(".pr").removeClass('choose');
            $pr.addClass("choose");
        });
        $wrap1.on('mousedown', function (e) {
            if (!$pr) {
                return
            }
            flag = true;
            startX = e.pageX - $pr.offset().left;
            startY = e.pageY - $pr.offset().top;
            a = document.createElement('a');
            a.className = "c_btn border";
            a.id = `a${i}`;
            a.href = "javascript:gourl()";
            $pr.append(a);
            $current_btn = $(`#a${i}`);
            $current_btn.css({
                "left": startX / $pr.width() * 100 + '%',
                "top": startY / $pr.height() * 100 + '%'
            });
            i++;
            a_width = 0;
            a_height = 0;
        });
        $wrap1.on("mousemove", function (e) {
            if (flag == false) {
                return
            }
            a_width = Math.abs(startX - e.pageX + $pr.offset().left);
            a_height = Math.abs(startY - e.pageY + $pr.offset().top);
            $current_btn.css({
                'width': a_width / $pr.width() * 100 + '%',
                'height': a_height / $pr.height() * 100 + '%'
            })
        })
        $wrap1.on('mouseup', function (e) {
            flag = false;
            if (!$pr) return
            if (a_height < 30 || a_width < 60) {
                $current_btn.remove()
            }
        });
    },
    listener: () => {
        var fileArr = [];
        let current_swiper_div;

        $controls.on('click', '.addSwiperPic', function(){
            current_swiper_div = $(this).closest(".swiper_div")[0];
            $addPic.click();
            picAction = '';
        });
        $controls.on('click', '.submitSwiper', function(){
            current_swiper_div = $(this).closest(".swiper_div")[0];
        })
        $addPic.change(function (e) {
            fileArr = []
            var files = this.files;
            for (let i = 0, l = files.length; i < l; i++) {
                let file = files[i];
                fileArr.push(file)
            }
            var j = 0;
            var n = $(".swiper_div").length;
            if (picAction == 'addSwiper') {
                n++
                current_swiper_div = document.createElement("div");
                current_swiper_div.className = 'swiper_div';
                let h4 = document.createElement("h4");
                h4.innerHTML = `轮播${n}`;
                let button = document.createElement("button");
                let div = document.createElement("div");
                div.style="margin-bottom: 20px;"
                button.type = "button";
                button.innerHTML = '添加图片';
                button.className = "addSwiperPic";
                button.style="margin-right: 30px;"
                let button1 = document.createElement("button");
                button1.className = 'submitSwiper';
                button1.innerHTML = '提交swiper'
                current_swiper_div.appendChild(h4);
                div.appendChild(button);
                div.appendChild(button1);
                current_swiper_div.appendChild(div)
            }
            $.each(fileArr, async function (index, el) {
                let img_name = await utils.uploadImg(el);
                if (picAction == 'addPic') {
                    let div = document.createElement("div");
                    div.className = "pr";
                    let img = document.createElement("img");
                    img.src = config.hostUrl + 'html/' + moban + "/" + $number.val() + '/' + img_name
                    img.className = "img";
                    div.appendChild(img)
                    $wrap1.append(div);
                    if (j++ == files.length - 1) {
                        $copy.click();
                    }
                } else {
                    let div = document.createElement('div');
                    div.style = "position: relative; float: left; margin-right: 20px;"
                    let img = document.createElement("img");
                    img.src = config.hostUrl + 'html/' + moban + "/" + $number.val() + '/' + img_name;
                    let span = document.createElement('span');
                    span.className = "delSwiperPic"
                    span.style="position: absolute; right: -18px; top: -10px; width:20px;height: 13px;cursor:pointer;background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYBAMAAAASWSDLAAAAFVBMVEUAAAD/Sy7/Syz/Si3/Siz/Sy3/Sy1XPY9sAAAAB3RSTlMA+2FnXdvh+TfhHAAAAFtJREFUGNM9zsEJhAAMBdHPbgdiAXqwAA/eLcIK7L8IGT6ZnBIeDMkb58q+zf5f81vmOO9AA4EESICEUqFUGAIkQBJIEfQrgn5FcICgQDACJEBCqVAqSID0xDk+OgwKK5ty+NMAAAAASUVORK5CYII=') no-repeat center center";
                    div.appendChild(span)
                    div.appendChild(img)
                    current_swiper_div.appendChild(div);
                    $controls.append(current_swiper_div);
                }
            })
        });
        $controls.on("click", ".delSwiperPic", function() {
            $(this).closest("div").remove()
        })
        $("input:radio[name=action]").change(function () {
            if ($(this).val() == 'new') {
                action = 'new';
                $load.hide()
            } else {
                action = 'modify';
                $load.show()
            }
        });
        $load.on('click', async function () {
            if (!$moban.val()) {
                alert('选择落地页');
                return
            }
            if (!$number.val()) {
                alert("填落地页序号!");
                return
            }
            var loadHTML = await utils.loadMoban($moban.val(), $number.val());
            $wrap1.html(loadHTML)
        })
        $("input:radio[name=top]").change(function () {
            if (!$pr) {
                alert("没有选中图片");
                return
            }
            var val = $("input:radio[name=top]:checked").val();
            if (val == 0) {
                $pr.removeClass('com_box');
            } else if (val == 1) {
                $pr.addClass('com_box');
            }
        });
        $marginTop.change(function () {
            if ($pr) {
                $pr.css('marginTop', $(this).val() + '%')
            }
        });
        $submit.on('click', function () {
            if (!utils.check()) {
                return
            }
            $(".com_box").removeClass("choose");
            $(".pr").removeClass("choose");
            $copy.click(); //防止修改后忘记复制
            //localStorage.setItem("lastwrap", $wrap1.html());
            localStorage.setItem("lastgame", $moban.val());
            //localStorage.setItem("lastnumber", $number.val());

            var txt = head + $wrap1[0].outerHTML +
                `<p class="foot">{$data.copyright}</p><else/><a href="javascript:gourl();">` +
                $wrap2[0].outerHTML +
                `<p class="foot">{$data.copyright}</p>` +
                footer;

            txt = txt.replace(/(\<.*?\>)/gi, '$1\r\n');
            /*             txt = txt.replace(/(\<img.*?\>)/gi, '    $1')
                        txt = txt.replace(/(\<a.*?\>)/gi, '    $1')
                        txt = txt.replace(/(\<\/a.*?\>)/gi, '    $1')
             */
            $.ajax({
                url: 'moban',
                type: 'post',
                data: {
                    txt: txt,
                    moban: $moban.val(),
                    number: $number.val()
                },
                success: function (data) {
                    if (data.status == 1) {
                        $("#top_0").prop('checked', true);
                        $number.val('')
                        console.log("模板更新成功！")
                    } else if (data.status == 0) {
                        console.log(data.msg)
                    }
                }
            })
        })
        $moban.change(function () {
            moban = utils.getMoban($moban.val());
        });

        $addPicBtn.on("click", function () {
            if (!utils.check()) {
                return
            }
            picAction = 'addPic'
            $addPic.click()
        })
        $addSwiper.on("click", function() {
            if (!$moban.val()){
                alert('请选择落地页!');
                return;
            }
            if (!$number.val()) {
                alert('填写落地页序号')
            }
            picAction = 'addSwiper'
            $addPic.click();
        })
        $changePicBtn.on('click', function () {
            if (!$pr) {
                alert("请选择要修改的图")
                return
            }
            $changePic.click()
        })
        $changePic.change(async function () {
            var img_name = await utils.uploadImg(this.files[0])
            $pr.find('a').remove();
            $current_img.attr('src', config.hostUrl + 'html/' + moban + "/" + $number.val() + '/' + img_name);
            $copy.click()
        })
        $copy.on('click', function () {
            $wrap2.html($wrap1.html());
            $(".com_box").removeClass("choose");
            $(".pr").removeClass("choose");
            $(".wrap2 a").remove()
        })
        $clear.on("click", function () {
            $wrap1.html('');
            $wrap2.html('')
        });
        $down.on("click", function () {
            if (!$pr) {
                alert("选择图片")
                return
            }
            $pr.insertAfter($pr.next());
            $copy.click()
        });
        $up.on("click", function () {
            if (!$pr) {
                alert("选择图片")
                return
            }
            $pr.insertBefore($pr.prev());
            $copy.click()
        });
        $deletePic.on('click', function () {
            if (!$pr) {
                alert("选择要删除的图片!")
            } else {
                $pr.remove();
                $copy.click();
                $pr = null;
            }

        });
        $deleteBtn.on("click", function () {
            if (!$pr) {
                alert("选择图片!")
            } else {
                $pr.find('a').remove();
            }
        });
        $copy.click();
    }
}
handle.init();
handle.listener();