/**
 * Created by Administrator on 2017/7/5.
 */
"use strict";
$(document).ready(function () {
    /*日期初始化*/
    $("#Date1,#startDate,#endDate,#startDaterange,#endDaterange,#Date2").datetimepicker({
        format: "yyyy-mm-dd hh:ii:ss",//时间格式显示年月日时分秒
        autoclose: true,
        todayBtn: true,
        pickerPosition: "bottom-left",
        minuteStep:1,//分钟间隔为1分钟
        language: "zh-CN"
    });
    $("#yearDate").datetimepicker({
        format: "yyyy-mm-dd",//时间格式显示年月日
        autoclose: true,
        todayBtn: true,
        pickerPosition: "bottom-left",
        minView: "month", //选择日期后，不会再跳转去选择时分秒
        language: "zh-CN"
    });
    $("#hourDate").datetimepicker({
        format: "hh:ii:ss",//时间格式选择时分秒
        startView:0,//初始化从分钟开始选
        autoclose: true,
        todayBtn: true,
        pickerPosition: "bottom-left",
        minuteStep:1,//分钟间隔为1分钟
        language: "zh-CN"
    });

    $("#Date1").find('input').val('2017-09-02 15:51:27');//设置日期初始值
    $("#startDaterange,#endDaterange").val(new Date().Format("yyyy-MM-dd hh:mm:ss"));//设置日期初始值
    $("#yearDate").find('input').val(new Date().Format("yyyy-MM-dd"));//设置日期初始值
    $("#hourDate").find('input').val(new Date().Format("hh:mm:ss"));//设置日期初始值
    $("#Date2").datetimepicker('setStartDate',new Date().Format("yyyy-MM-dd"));//设置可选开始时间

    /*代码块高亮显示*/
    CodeMirror.fromTextArea(document.getElementById("codeDatapicker"), {
        lineNumbers: true,
        keyMap: "vim",
        theme: "rubyblue"
    });
});