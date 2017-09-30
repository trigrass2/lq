/**
 * Created by Administrator on 2017/8/14.
 */
"use strict";
$(function () {
    var mesCom=new mesComMethod();
    /*下拉框初始化*/
    var selectData=[
        { id: 1, text: 'oppo' },
        { id: 2, text: '三星' },
        { id: 3, text: '小米' },
        { id: 4, text: '华为' },
        { id: 5, text: '步步高' },
        { id: 6, text: '苹果' },
        { id: 7, text: 'vivo' },
        { id: 8, text: '中兴' },
        { id: 9, text: 'LG' },
        { id: 10, text: '魅族' }];
    $("#selectId,#selectId2").select2({
        multiple: true,//是否多选
        data: selectData,
    });
    /*启用select2 excel粘贴多条件功能*/
    mesCom.selectPaste();
    /*代码块高亮显示*/
    CodeMirror.fromTextArea(document.getElementById("CodeMirrortable"), {
        lineNumbers: true,
        keyMap: "vim",
        theme: "rubyblue"
    });
});