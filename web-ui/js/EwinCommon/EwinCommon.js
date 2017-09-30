
//封装通用方法
(function ($) {

    $.Ewin = {};

    $.Ewin.Validate = {};
    /**
    * 发送get请求
    * strUrl, oParams, funCallback
    */
    $.Ewin.AjaxGet = function (strUrl, oParams, funCallback) {
        $.get(strUrl, oParams, funCallback);
    };

    /**
    * 发送post请求
    * strUrl, oParams, funSuccessCallback, funErrorCallback
    */
    $.Ewin.AjaxPost = function (strUrl, oParams, funSuccessCallback, funErrorCallback, funFinishCallback) {
        //var strJsonParams = $.toJSON(oParams);
        $.ajax({
            type: "POST",
            url: strUrl,
            data: oParams,
            //contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: funSuccessCallback,
            error: funErrorCallback,
            complete: funFinishCallback

        });
    };


    /**
    * 发送Sync post请求。阻塞请求的Ajax
    * strUrl, oParams, funSuccessCallback, funErrorCallback
    */
    $.Ewin.AsyncAjaxPost = function (strUrl, oParams, funSuccessCallback, funErrorCallback, funFinishCallback) {
        //var strJsonParams = $.toJSON(oParams);
        $.ajax({
            type: "POST",
            async: false,
            url: strUrl,
            data: oParams,
            //contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: funSuccessCallback,
            error: funErrorCallback,
            complete: funFinishCallback

        });
    };

    /**
    * 发送post请求(包含List数据时用)
    * strUrl, oParams, funSuccessCallback, funErrorCallback
    */
    $.Ewin.AjaxPostWithList = function (strUrl, oParams, funSuccessCallback, funErrorCallback) {
        var strJsonParams = $.toJSON(oParams);
        $.ajax({
            type: "POST",
            url: strUrl,
            data: strJsonParams,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: funSuccessCallback,
            error: funErrorCallback
        });
    };

    //格式化字符串
    $.Ewin.Format = function (source, params) {
        if (arguments.length == 1)
            return function () {
                var args = $.makeArray(arguments);
                args.unshift(source);
                return $.format.apply(this, args);
            };
        if (arguments.length > 2 && params.constructor != Array) {
            params = $.makeArray(arguments).slice(1);
        }
        if (params.constructor != Array) {
            params = [params];
        }
        $.each(params, function (i, n) {
            source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
        });
        return source;
    }

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

    //motai
    $.Ewin.ModalDialog = function (id) {
        $('#' + id).modal({ backdrop: true, keyboard: true, show: true });
    };

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

Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}

////////////////////////////////////////////////////////////////////////////////////////////
//计算两个日期天数差的函数，通用
////////////////////////////////////////////////////////////////////////////////////////////
function DateDiff(sDate1, sDate2) {  //sDate1和sDate2是yyyy-MM-dd格式

    var aDate, oDate1, oDate2, iDays;
    aDate = sDate1.split("-");
    oDate1 = new Date(aDate[1] + '/' + aDate[2] + '/' + aDate[0]);  //转换为yyyy-MM-dd格式
    aDate = sDate2.split("-");
    oDate2 = new Date(aDate[1] + '/' + aDate[2] + '/' + aDate[0]);
    iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数

    return iDays;  //返回相差天数
}