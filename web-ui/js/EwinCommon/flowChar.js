/**
 * Created by Administrator on 2017/9/8.
 */

//封装通用方法
(function ($) {

    $.Ewin = {};

    $.Ewin.Validate = {};

    //封装dialog
    $.Ewin.Dialog = function (id, title, funcloseCallback, funcancelCallback, funokCallback) {
        $("#" + id).dialog({
            title: title,
            autoOpen: false,
            width: 350,
            height: 180,
            draggable: false,
            resizable: false,
            close: funcloseCallback,
            buttons: {
                "取消": funcancelCallback,
                "确定": funokCallback
            }
        });
    }

    //通用的draggable
    $.Ewin.Draggable = function (selector, containment, helper, scope, funcstart, funcdrag, funcstop) {
        var containmentdefault = containment == null || containment == undefined ? "parent" : containment;
        $(selector).draggable({
            containment: containmentdefault,
            helper: helper,
            scope: scope,
            start: funcstart,
            drag: funcdrag,
            stop: funcstop
        });
    };

    //通用的droppable
    $.Ewin.Droppable = function (selector, scope, funcdrop) {
        $(selector).droppable({
            scope: scope,
            drop:funcdrop
        });
    };

    //通用的resizable
    $.Ewin.Resizable = function (selector, funcresize,funcstop) {
        $(selector).resizable({
            resize: funcresize,
            stop: funcstop
        });
    };


})(jQuery);