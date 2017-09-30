(function ($) {
    var _ajax = $.ajax;
    $.ajax = function (options) {
        var fn = {
            error: function (XMLHttpRequest, textStatus) {
                //if (XMLHttpRequest.responseText && textStatus != "canceled")
                //    window.top.toastr.error(XMLHttpRequest.responseText, '错误消息', { closeButton: true, timeOut: 0 });
            },
            success: function (data, textStatus) {
            },
            beforeSend: function (XHR) { },
            complete: function (XHR, TS) { }
        }
        if (options.error) {
            fn.error = options.error;
        }
        if (options.success) {
            fn.success = options.success;
        }
        if (options.beforeSend) {
            fn.beforeSend = options.beforeSend;
        }
        if (options.complete) {
            fn.complete = options.complete;
        }
        var _options = $.extend(options, {
            error: function (XMLHttpRequest, textStatus) {
                if (XMLHttpRequest.status != 200 && XMLHttpRequest.status != 0 && XMLHttpRequest.status != 400 && XMLHttpRequest.status != 404 && XMLHttpRequest.status != 409) {
                    var Tempdata = XMLHttpRequest.responseText;
                    if (Tempdata.indexOf("出现错误") > 0) {
                        var dataTemp = eval("(" + Tempdata + ")")
                        if (dataTemp.ExceptionType == "System.InvalidOperationException") {
                            window.top.toastr.error("与服务接口入参不匹配,与对应开发人员联系！", '错误消息', { closeButton: true, timeOut: 0 });
                        }
                        return;
                    }
//                  window.top.$.modal({
//                      method: 'get',
//                      title: "反馈信息",
//                      url: "/EwinException/DealException/Index",
//                      data: { message: Tempdata }
//                  });
                }
                else {
                    if (XMLHttpRequest.status == 409) {
                        window.top.toastr.error(XMLHttpRequest.responseText, '错误消息', { closeButton: true, timeOut: 0 });
                    }
                }
                //fn.error(XMLHttpRequest,textStatus);
            },
            success: function (data, textStatus) {
                fn.success(data, textStatus);
            },
            beforeSend: function (XHR) {
                XHR.setRequestHeader("Authorization", sessionStorage.getItem('token'));
                fn.beforeSend(XHR);
            },
            complete: function (XHR, TS) {
                fn.complete(XHR, TS);
            }
        });
        return _ajax(_options);
    };
})(jQuery);