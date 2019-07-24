import {
    $moban,
    $number
} from './dom';
import {
    list
} from './tpl'
var utils = {
    getMoban: (id) => {
        for (let j = 0, l = list.list.length; j < l; j++) {
            if (list.list[j].id == id) {
                var moban = list.list[j].text;
                return moban;
            }
        }
    },
    loadMoban: (id, number) => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/loadMoban',
                type: 'post',
                data: {
                    id: id,
                    number: number,
                    moban: utils.getMoban(id)
                },
                success: function (data) {
                    console.log(data.wrap1)
                    resolve(data.wrap1)
                }
            })
        })

    },
    uploadImg: function (el) {
        return new Promise((resolve, reject) => {
            let formFile = new FormData();
            let moban = utils.getMoban($moban.val());
            formFile.append("file", el)
            formFile.append("moban", moban)
            formFile.append("number", $number.val())
            var d = formFile
            $.ajax({
                url: '/addImg',
                type: 'post',
                async: false,
                processData: false,
                contentType: false,
                data: d,
                success: function (data) {
                    if (data.status == 1) {
                        resolve(data.img_name);
                    }
                }
            })
        })
    },
    getNameList: () => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/getNameList',
                type: 'get',
                success: function (data) {
                    $moban.select2({
                        data: data.data,
                        placeholder: "选择落地页"
                    });
                    $moban.val(localStorage.getItem("lastgame")).trigger("change");
                    resolve(data.data);
                }
            });
        })

    },
    check: () => {
        if (!$moban.val()) {
            alert("请选择落地页")
            return false
        }
        if (!$number.val() || $number.val() <= 0) {
            alert("落地页序号不对")
            return false
        }
        return true
    }
}
export default utils;