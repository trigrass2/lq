/**
 * Created by Administrator on 2017/7/31.
 */
"use strict";
$(document).ready(function () {
    /*可拖动面板初始化*/
    var $panelBody1 = $('.panelBody1')//可拖动元素1
    var $panelBody2 = $('.panelBody2')//可拖动元素2
    var $panelBody3 = $('.panelBody3')//可拖动元素3
    var $panelBody4 = $('.panelBody4')//可拖动元素4
    var $panelBody5 = $('.panelBody5')//可拖动元素5
    var $panelBody6 = $('.panelBody6')//可拖动元素6
    var $panelBody7 = $('.panelBody7')//可拖动元素7
    var $panelBody8 = $('.panelBody8')//可拖动元素8
    var mesCom=new mesComMethod();
    /**
     * 可拖动面板初始化方法
     * @param containment--是否限制拖动范围，true限制，false不限制
     * @param panelsList可拖动元素
     * @param colNum--一行显示几个可拖动面板
     * @param title--拖动面板标题
     * @param colValue--colValue可拖动面板元素
     */
    mesCom.initDraggablePanels({
        containment:true,
        panelsList:[{
            colNum:1,
            title:['可拖动面板1'],
            colValue:[$panelBody1]
        },{
            colNum:2,
            title:['可拖动面板2','可拖动面板3'],
            colValue:[$panelBody2,$panelBody3]
        },{
            colNum:2,
            title:['可拖动面板4','可拖动面板5'],
            colValue:[$panelBody4,$panelBody5]
        },{
            colNum:3,
            title:['可拖动面板6','可拖动面板7','可拖动面板8'],
            colValue:[$panelBody6,$panelBody7,$panelBody8]
        }]
    },function () {
        // 拖动面板初始化完成的回调函数
        console.log('可拖动面板初始化完成');
    });
    /*代码块高亮显示*/
    CodeMirror.fromTextArea(document.getElementById("CodeMirrortable"), {
        lineNumbers: true,
        keyMap: "vim",
        theme: "rubyblue"
    });
});
// //拖动面板
// function WinMove() {
//     var element = "[class*=col]";
//     var handle = ".ibox-title";
//     // var connect = "[class*=col]";
//     var connect = ".ui-sortable";
//     $(element).sortable({
//         handle: handle,//如果设定了此参数,那么拖动会在对象内指定的元素上开始.
//         connectWith: connect,//列表中的项目需被连接的另一个 sortable 元素的选择器。这是一个单向关系，如果您想要项目被双向连接，必须在两个 sortable 元素上都设置 connectWith 选项。
//         containment: ".draggablePanels",//定义一个边界，限制拖动范围在指定的DOM元素内。
//         tolerance: 'pointer',//指定用于测试项目被移动时是否覆盖在另一个项目上的模式
//         forcePlaceholderSize: true,//如果为true, 强迫占位符（placeholder）有一个尺寸大小。
//         // items: 'div',//指定元素内的哪一个项目应是 sortable。
//         dropOnEmpty:true,//如果为false，这个sortable中项不能拖动到一个空的sortable中。
//         opacity: 0.8,//当排序时助手（helper）的不透明度。从0.01 到 1。
//         revert:true,//sortable 项目是否使用一个流畅的动画还原到它的新位置。
//         scroll:true,//如果设置为 true，当到达边缘时页面会滚动。
//     });
//     // $(element).disableSelection();
//     // /*当一个 sortable 项目移动到一个 sortable 列表时触发该事件。*/
//     // $(element).on("sortover", function(event, ui) {
//     //     console.log('sortover')
//     // });
//     //$(element).sortable("cancel");
//     // /*在排序期间触发该事件，除了当 DOM 位置改变时。*/
//     // $(element).on("sortchange", function(event, ui) {
//     //     console.log('sortchange')
//     // });
//     // /*当用户停止排序且 DOM 位置改变时触发该事件。*/
//     // $(element).on("sortupdate", function(event, ui) {
//     //     $(element).sortable( "cancel" );
//     // });
// };
// $(document).ready(function () {
//     WinMove();
// });