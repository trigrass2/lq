/**
 * Created by Administrator on 2017/6/28.
 */
$(function () {
    /*加载中遮罩层效果*/
    //一秒后关闭
    $('body').on('click','#loading1s',function () {
        $.loadMsg();
        setTimeout(function () {
            layer.closeAll('loading');
        },1000);
    });
    //三秒后关闭
    $('body').on('click','#loading3s',function () {
        $.loadMsg('加载中...');
        setTimeout(function () {
            layer.closeAll('loading');
        },3000);
    });
    //弹出加载中
    $('body').on('click','#loadingstart',function () {
        $.loadMsg();
        $("#stopLoading").css('display','block');
    });
    //手动关闭加载中
    $('body').on('click','#stopLoading',function () {
        layer.closeAll('loading');
        $("#stopLoading").css('display','none');
    });
    /*代码块高亮显示*/
    CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
        keyMap: "vim",
        theme: "rubyblue"
    });
});