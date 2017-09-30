/*! layer Plugin */
! function (a) {
    "function" == typeof define && define.amd ? define(["jquery", "layer"], a) : a(jQuery)
}(function (a) {
    $.extend({
        loadMsg: function(message) {
            layer.load(2, {content:message,shade : [0.5 , '#000' , true],success: function(layero){
                layero.find('.layui-layer-content').css({'padding-top':'10px','padding-left':'40px','color':'#f0f0f0','width':'auto'});
            }});
        }
    });
});