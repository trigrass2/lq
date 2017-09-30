/**
 * Created by Administrator on 2017/6/21.
 */
"use strict";
$(function () {
    /*下拉框初始化*/
    var selectData=[{ id: 0, text: 'iPhone' },
        { id: 1, text: 'oppo' },
        { id: 2, text: '三星三星三星三星三星三星三星三星三星' },
        { id: 3, text: '小米' },
        { id: 4, text: '華為' },
        { id: 5, text: '魅族' }];
    $("#selectId").select2({
        multiple: false,//是否多選
        minimumResultsForSearch: -1,//去掉搜索框
        data: selectData
    });
    $("#selectId2").select2({
        multiple: false,//是否多選
        data: selectData
    });

    /*代码块高亮显示*/
    CodeMirror.fromTextArea(document.getElementById("CodeMirrortable"), {
        lineNumbers: true,
        keyMap: "vim",
        theme: "rubyblue"
    });
    CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
        keyMap: "vim",
        theme: "rubyblue"
    });
});