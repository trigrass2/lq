/**
 * Created by Administrator on 2017/6/29.
 */
$(function () {
    /*初始化切换开关*/
    var elem = document.querySelector('#js-switch1');
    var switchery = new Switchery(elem, {
        color: '#1AB394'
    });
    var elem_2 = document.querySelector('#js-switch_2');
    var switchery_2 = new Switchery(elem_2, {
        color: '#ED5565'
    });
    var elem_3 = document.querySelector('#js-switch_3');
    var switchery_3 = new Switchery(elem_3, {
        color: '#1AB394'
    });

    /*获取切换开关的值*/
    var changeCheckbox1 = document.querySelector('#js-switch1');
    var changeCheckbox2 = document.querySelector('#js-switch_2');
    var changeCheckbox3 = document.querySelector('#js-switch_3');
    $('#l-switch1').text('  状态→'+changeCheckbox1.checked);
    $('#l-switch2').text('  状态→'+changeCheckbox2.checked);
    $('#l-switch3').text('  状态→'+changeCheckbox3.checked);
    changeCheckbox1.onchange = function() {
        $('#l-switch1').text('  状态→'+changeCheckbox1.checked);
    };
    changeCheckbox2.onchange = function() {
        $('#l-switch2').text('  状态→'+changeCheckbox2.checked);
    };
    changeCheckbox3.onchange = function() {
        $('#l-switch3').text('  状态→'+changeCheckbox3.checked);
    };

    /*常用设置*/
    var elem4 = document.querySelector('#js-switch4');
    var switchery4 = new Switchery(elem4, {
        color: '#1AB394'
    });
    switchery4.disable();//默认禁用
    /*设置禁用*/
    document.querySelector('#btn-off4').addEventListener('click', function() {
        switchery4.disable();
    });
    /*设置启用*/
    document.querySelector('#btn-on4').addEventListener('click', function() {
        switchery4.enable();
    });

    /*
    * 颜色设置
    * color---true状态下背景色
    * jackColor---true状态下原点色
    * jackSecondaryColor---false状态下原点色
    * secondaryColor---false状态下背景色
    * */
    var elem5 = document.querySelector('#js-switch5');
    var switchery5 = new Switchery(elem5, { color: '#473fe9', secondaryColor: '#e93f67', jackColor: '#3fe977', jackSecondaryColor: '#b73fe9' });

    /*
    * 大小设置
    * small小开关
    * large大开关
    * */
    var elem6 = document.querySelector('#js-switch6');
    var switchery6 = new Switchery(elem6, { size: 'small' });
    var elem7 = document.querySelector('#js-switch7');
    var switchery7 = new Switchery(elem7);
    var elem8 = document.querySelector('#js-switch8');
    var switchery8 = new Switchery(elem8, { size: 'large' });

    /*代码块高亮显示*/
    CodeMirror.fromTextArea(document.getElementById("codeSwitch1"), {
        lineNumbers: true,
        keyMap: "vim",
        theme: "rubyblue"
    });
    CodeMirror.fromTextArea(document.getElementById("codeSwitch2"), {
        lineNumbers: true,
        keyMap: "vim",
        theme: "rubyblue"
    });
});