/**
 * Created by Administrator on 2017/7/4.
 */
"use strict";
$(document).ready(function () {
    /*日期初始化*/
    $("#Date1 .input-group.date," +
        "#startDate .input-group.date," +
        "#endDate .input-group.date," +
        "#Date2 .input-group.date").datepicker({
        format: "yyyy-mm-dd",
        weekStart: 1,
        autoclose: true,
        todayBtn: "linked",
        language: "zh-CN"
    }).on("changeDate", function (ev) {
    });

    $("#startDate .input-group.date").datepicker("setDate", '2017-07-04');//设置日期初始值
    $("#endDate .input-group.date").datepicker("setDate", new Date().Format("yyyy-MM-dd"));//设置日期初始值
    $("#Date2 .input-group.date").datepicker("setDate", new Date().Format("yyyy-MM-dd"));//设置日期初始值
    $("#Date2 .input-group.date").datepicker('setStartDate',new Date().Format("yyyy-MM-dd"));//设置可选开始时间
    $("#Date3 .input-group.date").datepicker("setDate", new Date().Format("yyyy-MM-dd"));//设置日期初始值


    $('#yearDate .input-group.date').datepicker({
        format: "yyyy-mm-dd hh:ii:ss",
        weekStart: 1,
        autoclose: true,
        todayBtn: "linked",
        language: "zh-CN"
    });
    $("#yearDate .input-group.date").datepicker("setDate", new Date().Format("yyyy-MM-dd"));//设置日期初始值
    // $("#yearDate").datepicker({
    //     format: "yyyy-mm-dd",
    //     weekStart: 1,
    //     autoclose: true,
    //     todayBtn: "linked",
    //     language: "zh-CN"
    // }).on("changeDate", function(ev) {
    //
    // });

    //
    // $("#houreDate").datepicker({
    //     format: "hh:mm:ss",
    //     weekStart: 1,
    //     autoclose: true,
    //     todayBtn: "linked",
    //     language: "zh-CN"
    // }).on("changeDate", function (ev) {
    // });
    //
    // $("#yhDate").datepicker({
    //     format: "yyyy-mm-dd",
    //     weekStart: 1,
    //     autoclose: true,
    //     todayBtn: "linked",
    //     language: "zh-CN"
    // }).on("changeDate", function (ev) {
    // });
    /*代码块高亮显示*/
    CodeMirror.fromTextArea(document.getElementById("codeDatapicker"), {
        lineNumbers: true,
        keyMap: "vim",
        theme: "rubyblue"
    });
});