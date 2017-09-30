/**
 * Created by Administrator on 2017/9/6.
 */

$(function() {
    initCalendar('');
    //下拉
    $('#combo1').select2({minimumResultsForSearch: -1});
    $("#combo1").on("select2:select", function (e) {
        if ($(this).val() == '1') {
            $("#treeDemo").css('display', 'block');
            $("#table").css('display', 'none');
            $(".title_input").css('display', 'none');
            $(".product_line").css('display', 'block');
        }
        else if ($(this).val() == '2') {
            $("#treeDemo").css('display', 'none');
            $("#table").css('display', 'block');
            $(".title_input").css('display', 'block');
            $(".product_line").css('display', 'none');
        } else if ($(this).val() == '3') {
            $("#treeDemo").css('display', 'none');
            $("#table").css('display', 'none');
            $("#tableEquip").css('display', 'block');
            $(".title_input").css('display', 'block');
            $(".product_line").css('display', 'none');
        } else {
            $("#treeDemo").css('display', 'none');
            $("#table").css('display', 'none');
            $("#tableEquip").css('display', 'none');
            $(".title_input").css('display', 'block');
            $(".product_line").css('display', 'none');
        }
    });
})

// 设置树形结构
var setting = {
    check: {
        enable: true
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    callback: {
        onCheck: zTreeOnCheck
    },
    view: {
        selectedMulti: false
    }
};

var zNodes =[
    { id:1, pId:0, name:"随意勾选 1", open:true},
    { id:11, pId:1, name:"随意勾选 1-1", open:true},
    { id:111, pId:11, name:"随意勾选 1-1-1"},
    { id:112, pId:11, name:"随意勾选 1-1-2"},
    { id:12, pId:1, name:"随意勾选 1-2", open:true},
    { id:121, pId:12, name:"随意勾选 1-2-1"},
    { id:122, pId:12, name:"随意勾选 1-2-2"},
    { id:2, pId:0, name:"随意勾选 2", checked:true, open:true},
    { id:21, pId:2, name:"随意勾选 2-1"},
    { id:22, pId:2, name:"随意勾选 2-2", open:true},
    { id:221, pId:22, name:"随意勾选 2-2-1", checked:true},
    { id:222, pId:22, name:"随意勾选 2-2-2"},
    { id:23, pId:2, name:"随意勾选 2-3"}
];

// 勾选的状态
var checked = false
function zTreeOnCheck(event, treeId, treeNode) {
    checked = treeNode.checked;
    // console.log((treeNode?treeNode.name:"root") + "checked " +(checked?"true":"false"));
    // console.log(treeNode);
    // lineId = treeNode.name
};

$(document).ready(function(){
    $.fn.zTree.init($("#treeDemo"), setting, zNodes);
});

// Ew.tree({
//     id:'treeDemo',//放入树的id
//     data:{},//传ajax的值
//     url: picWorkLnQuery,//url
//     type:'radio', //radio单选  checkbox为多选
//     root:{ //为需要新增的根节点 不需要就没有root
//         id:'0',
//         pId:'-1',
//         name:'菜单',
//         open:true,
//         level:0
//     },
//     treeField:['treeDemo','menuContent','name',''],//tsSysResourceId为id名 parentId父节点id名 name名称 level等级
//
// })


//表格
Ew.table('#table',
    {
        btnValues: [],
        tableId: 'table1',
        tableValue: {
            queryParams: function () {
                return {}
            },
            onClickRow: function (item) {
                console.log(item)
            },
            url: '/worktime/part/querylistByPage',
            columns: [{
                checkbox: true
            }, {
                field: 'tmBasPlantId',
                title: '仓库编号',
                align: 'center',
                sortable: true
            }, {
                field: 'partNo',
                title: '仓库名称',
                align: 'center',
                sortable: true
            }]
        }
    }
);

// 设备
Ew.table('#tableEquip',
    {
        btnValues: [],
        tableId: 'table1',
        tableValue: {
            queryParams: function () {
                return {}
            },
            onClickRow: function (item) {
                console.log(item)
            },
            url: '/worktime/part/querylistByPage',
            columns: [{
                checkbox: true
            }, {
                field: 'tmBasPlantId',
                title: '设备编号',
                align: 'center',
                sortable: true
            }, {
                field: 'partNo',
                title: '设备名称',
                align: 'center',
                sortable: true
            }]
        }
    }
);

//产线
Ew.form('.product_line',
    {
        formId:'demoform',
        columnNum:1,
        formList:[
            {idName:'combo10',text:'工厂',field:'wain',comboData: [{id: 1, text: '2222'},{id: 2, text: '333'}]},
            {idName:'combo11',text:'车间',comboData: [{id: 1, text: '2222'},{id: 2, text: '333'}],field:'ngng'}
        ]
    })

// 初始化日历
var isHover = false;
function initCalendar() {
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    var currentLangCode = 'zh-cn';
    $('#calendar').fullCalendar({
        header: {
            left: 'prev today',
            center: 'title',
            right: 'next'
        },
        height:($(window).height() - 12),
        //defaultDate: '2016-05-12',
        selectable: true,
        lang: currentLangCode,
        displayEventTime: false,
        selectHelper: true,
        timeFormat: 'H:mm',
        axisFormat: 'H:mm',
        select: function(start, end, e) {
            $("#cal_edit").css("left", e.pageX + "px").css("top", e.pageY + "px").css("display", "block");
            date1 = start._d;
            date2 = end._d;
            var str1 = date1.toString();
            var str2 = date2.toString();
            var dt1 = str1.substr(7,3);
            var dt2 = str2.substr(7,3);
            if (dt2 - dt1 === 1) {
                console.log(1);
                // $("#liEdit").css("display", "block");
            } else {
                // $("#liEdit").css("display", "none");
                console.log(0);
            }
        },
        unselect: function(a, b, c) {
            if (!isHover) $("#cal_edit").css("display", "none");
        },
        editable: false,
        eventLimit: true,
        events: [
            {
                end: "2017/9/6 11:00:00",
                id: "9ae3d0cc868b4d8a8cb4cc97af5ecaee",
                start: "2017/9/6 11:00:00",
                title: "早班：00:00-08:20"
            },
            {
                end: "2017/9/6 11:00:00",
                id: "9ae3d0cc868b4d8a8cb4cc97af5ecaee",
                start: "2017/9/6 11:00:00",
                title: "中班：9:00-13:00"
            },
            {
                end: "2017/9/6 11:00:00",
                id: "9ae3d0cc868b4d8a8cb4cc97af5ecaee",
                start: "2017/9/6 11:00:00",
                title: "晚班：16:00-20:20"
            }
        ]
        // events: function(start, end, timezone, callback) {
            // if (lineId == "") {
            //     callback(Workdata);
            // } else {
            //     $.ajax({
            //         type: "get",
            //         url: ApiUrl + "/Calendar/GetWorkData",
            //         dataType:"json",
            //         data: { strLineId: lineId, starTime: start._d.format("yyyy-MM-dd"), endTime: end._d.format("yyyy-MM-dd") },
            //         success: function(data, status) {
            //             if (status) {
            //                 debugger;
            //                 callback(data);
            //             }
            //         },
            //         error: function() {
            //             window.top.toastr.error("error");
            //         },
            //         complete: function() {
            //             //window.top.toastr.warning("complete");
            //         }
            //     });
            // }
        // }
    });
}
// 鼠标离开
function chkIn() {
    isHover = true;
}

function chkOut() {
    isHover = false;
}

// 点击编辑按钮
function colEdit() {
    $('#calendar').fullCalendar('unselect');
    $("#cal_edit").css("display", "none");

    // if (lineId == "") {
    //     window.top.toastr.warning("请先选择产线");
    //     return;
    // }
    InitTimeSlider();
    $('#myModal').modal();
}

// 编辑的保存按钮
function SaveEdit() {
    // if (lineId == "") {
    //     window.top.toastr.warning("请先选择产线");
    //     return;
    // }
    // var workValues = $('#txtWorkDate').attr("value");
    // var zaoValues = $('#txtZhao').attr("value");
    // var zhongValues = $('#txtZhong').attr("value");
    // var wanValues = $('#txtWan').attr("value");
    // var planNum = $("#txt_zhaoPlanNum").text() + "," + $("#txt_zhongPlanNum").text() + "," + $("#txt_wanPlanNum").text();
    // var actNum = $("#txt_zhaoActNum").text() + "," + $("#txt_zhongActNum").text() + "," + $("#txt_wanActNum").text();
    // $.ajax({
    //     url: ApiUrl + '/Calendar/GetSaveWorkDate',
    //     contentType: "application/json; charset=utf-8",
    //     data: {
    //         strLineId: lineId,
    //         date1: date1,
    //         workValues: workValues,
    //         zaoValues: zaoValues,
    //         zhongValues: zhongValues,
    //         wanValues: wanValues,
    //         planNum: planNum,
    //         actNum: actNum
    //     },
    //     success: function (data, status) {
    //         if (data == "0") {
    //             window.top.toastr.success("保存成功");
    //             $('#calendar').fullCalendar('refetchEvents');
    //             $('#myModal').modal('hide');
    //         }
    //
    //     },
    //     error: function() {
    //         window.top.toastr.error("Error");
    //     }
    // });
}

// 按照模板设置
function copyModel() {
    $('#calendar').fullCalendar('unselect');
    $("#cal_edit").css("display", "none");
    // if (lineId == "") {
    //     window.top.toastr.warning("请先选择产线");
    //     return;
    // }

    // $.ajax({
    //     url: ApiUrl + '/Calendar/CopyWorkDate',
    //     contentType: "application/json; charset=utf-8",
    //     data: { strLineId: lineId, selectDate1: date1, selectDate2: date2 },
    //     success: function (data, status) {
    //         if (data == "1") {
    //             window.top.toastr.success("设置成功");
    //             $('#calendar').fullCalendar('refetchEvents');
    //         }
    //     },
    //     error: function() {
    //         window.top.toastr.error("Error");
    //     }
    // });
}

// 编辑框时间设置
var setTimeArray = [{
    start:0,
    end:60,
    name:'早班',
    state:0
},
    {
        start:118,
        end:207,
        name:'中班',
        state:0
    },
    {
        start:311,
        end:439,
        name:'晚班',
        state:0
    }
];
var setMornArr = [
    {
        start:0,
        end:10,
        name:'早班',
        state:0
    },
];
var setNoonArr = [
    {
        start:120,
        end:130,
        name:'中班',
        state:0
    },
];
var setEvenArr = [
    {
        start:320,
        end:330,
        name:'晚班',
        state:0
    },
];
var setTime = '',
    setMornTime = '',
    setNoonTime = '',
    setEvenTime = '';
// var setTime = '0/60/早班/0,118/207/中班/0,311/439/晚班/0',
// 设置上班时间
function setTimeFun() {
    // 设置上班时间
    for (var i = 0, j = setTimeArray.length; i < j; i++) {
        if (i === j - 1){
            setTime +=setTimeArray[i].start + '/' + setTimeArray[i].end + '/' + setTimeArray[i].name + '/' + setTimeArray[i].state;
        } else {
            setTime +=setTimeArray[i].start + '/' + setTimeArray[i].end + '/' + setTimeArray[i].name + '/' + setTimeArray[i].state + ',';
        }
    };
    // 设置早班休息时间
    for (var i = 0, j = setMornArr.length; i < j; i++) {
        if (i === j - 1){
            setMornTime +=setMornArr[i].start + '/' + setMornArr[i].end + '/' + setMornArr[i].name + '/' + setMornArr[i].state;
        } else {
            setMornTime +=setMornArr[i].start + '/' + setMornArr[i].end + '/' + setMornArr[i].name + '/' + setMornArr[i].state + ',';
        }
    };
    // 设置中班休息时间
    for (var i = 0, j = setNoonArr.length; i < j; i++) {
        if (i === j - 1){
            setNoonTime +=setNoonArr[i].start + '/' + setNoonArr[i].end + '/' + setNoonArr[i].name + '/' + setNoonArr[i].state;
        } else {
            setNoonTime +=setNoonArr[i].start + '/' + setNoonArr[i].end + '/' + setNoonArr[i].name + '/' + setNoonArr[i].state + ',';
        }
    };
    // 设置晚班休息时间
    for (var i = 0, j = setEvenArr.length; i < j; i++) {
        if (i === j - 1){
            setEvenTime +=setEvenArr[i].start + '/' + setEvenArr[i].end + '/' + setEvenArr[i].name + '/' + setEvenArr[i].state;
        } else {
            setEvenTime +=setEvenArr[i].start + '/' + setEvenArr[i].end + '/' + setEvenArr[i].name + '/' + setEvenArr[i].state + ',';
        }
    };

};

// 初始化时间
function InitTimeSlider() {
    setTime = '';
    setMornTime = '';
    setNoonTime = '';
    setEvenTime = '';
    setTimeFun();
    // if (lineId == "") {
    //     layer.msg('请先选择产线',{icon:7,shade: 0.3,shadeClose: true,time:2000});
    //     return;
    // }

    $('.timeSlider').width(576);
    // var dataList = {};
    // $.ajax({
    //     url:picWorkTmQuery,
    //     data: JSON.stringify(dataList),
    //     type:'post',
    //     dataType: "json",
    //     contentType: "application/json;charset=UTF-8",
    //     success: function (data, status) {
    //         console.log(data.results);
    //         var zaoTimeStart = data.results[0].startTime;
    //         // console.log(zaoTimeStart);
    //         // $('#txtWorkDate').attr("value", data.WorkValue);
    //         // $('#txtZhao').attr("value", data.ZhaoValue);
    //         // $('#txtZhong').attr("value", data.ZhongValue);
    //         // $('#txtWan').attr("value", data.WanValue);
    //         // $('#txt_zhaoPlanNum').text(data.ZhaoPlanNum);
    //         // $('#txt_zhaoActNum').text(data.ZhaoActNum);
    //         // $('#txt_zhongPlanNum').text(data.ZhongPlanNum);
    //         // $('#txt_zhongActNum').text(data.ZhongActNum);
    //         // $('#txt_wanPlanNum').text(data.WanPlanNum);
    //         // $('#txt_wanActNum').text(data.WanActNum);
    //         // InitWork();
    //         // InitWorkMenu();
    //     },
    //     error: function () {
    //         layer.msg('请先选择产线',{icon:7,shade: 0.3,shadeClose: true,time:2000});
    //     }
    // })

    $('#setWorkDate').attr("value", setTime);
    $('#txtZhao').attr("value", setMornTime);
    $('#txtZhong').attr("value", setNoonTime);
    $('#txtWan').attr("value", setEvenTime);

    InitWork();
}

// 设置拖动条
function InitWork() {
    $('#setWorkDate').jRange({
        from: 0,
        to: 576,
        step: 1,
        scale: [0, 576],
        format: '%s',
        //width: "90%",
        showLabels: true,
        isRange: true
    });

    var strVal = $('#setWorkDate').attr("value");
    for (var i = 0; i < strVal.split(',').length; i++) {
        InitRest(strVal.split(',')[i].split('/'), "setWorkDate");
    }
}

// 时间拖动条设置
function InitRest(values, id) {
    if (id == "setWorkDate") {
        var state = values[3];
        var targetId = "";
        var barColor = "#a1fad0";
        if (values[2] == "早班") {
            targetId = "txtZhao";
            barColor = "#3CC4C4";
        } else if (values[2] == "中班") {
            targetId = "txtZhong";
            barColor = "#E6BD1A";
        } else if (values[2] == "晚班") {
            targetId = "txtWan";
            barColor = "#E66ECD";
        }
        if (state == "1") {
            $('#' + targetId).next().html("");
            return;
        }
        $('#' + targetId).jRange({
            from: values[0],
            to: values[1],
            step: 1,
            scale: [values[0], values[1]],
            format: '%s',
            //width: "90%",
            showLabels: true,
            isRange: true,
            barColor: barColor
        });
    }
}

// 上班时间设置增加班数
$('body').on('click', '#time_plus', function () {
    $('.time_shift_plus').css('display','block');
    $('.time_shift_minus').css('display','none');
    var textArr = ['早班','中班','晚班'],
        setArr = [];
    $('.time_shift_plus span').removeClass('time_gray');
    for (var i = 0,j = setTimeArray.length; i < j;i++) {
        setArr.push(setTimeArray[i].name)
    }
    for (var k = 0,l = textArr.length; k < l;k ++) {
        if (setArr.indexOf(textArr[k]) < 0) {
            // console.log($('.time_shift_plus span')[k]);
        } else {
            $($('.time_shift_plus span')[k]).addClass('time_gray')
        }
    }
})

// 早班增加
$('body').on('click','.time_morn', function () {
    var morn = {
        start:0,
        end: 60,
        name: '早班',
        state: 0
    };
    if(!$('.time_shift_plus .time_morn').hasClass('time_gray')) {
        setTimeArray.unshift(morn)
        InitTimeSlider();
    } else {
        return
    }
    $('.time_shift_plus').css('display','none');
});

// 中班增加
$('body').on('click','.time_noon', function () {
    var noon = {
        start:118,
        end: 207,
        name: '中班',
        state: 0
    };
    if (!$('.time_shift_plus .time_noon').hasClass('time_gray')&& !$('.time_shift_plus .time_noon').hasClass('time_gray')) {
        setTimeArray.push(noon)
        InitTimeSlider();
    } else if (!$('.time_shift_plus .time_noon').hasClass('time_gray')&& $('.time_shift_plus .time_noon').hasClass('time_gray')) {
        setTimeArray.push(noon)
        InitTimeSlider();
    }else {
        return
    }
    $('.time_shift_plus').css('display','none');
});

// 晚班增加
$('body').on('click','.time_even', function () {
    var even = {
        start:311,
        end: 439,
        name: '晚班',
        state: 0
    };
    if (!$('.time_shift_plus .time_even').hasClass('time_gray')) {
        setTimeArray.push(even)
        InitTimeSlider();
    }else {
        return
    }
    $('.time_shift_plus').css('display','none');
});

// 上班时间设置减少
$('body').on('click', '#time_minus', function (e) {
    $('.time_shift_minus').css('display','block');
    $('.time_shift_plus').css('display','none');
    var textArr = ['早班','中班','晚班'],
        setArr = [];
    $('.time_shift_minus span').removeClass('time_gray');
    for (var i = 0,j = setTimeArray.length; i < j;i++) {
        setArr.push(setTimeArray[i].name)
    }
    for (var k = 0,l = textArr.length; k < l;k ++) {
        if (setArr.indexOf(textArr[k]) < 0) {
            $($('.time_shift_minus span')[k]).addClass('time_gray');
        } else {
            // console.log($('.time_shift_minus span')[k]);
        }
    }
});

// 早班减少
$('body').on('click','.minus_morn', function () {
    setMornArr = [];
    InitTimeSlider();
    if (!$('.time_shift_minus .minus_morn').hasClass('time_gray')) {
        setTimeArray.shift();
        InitTimeSlider();
    } else {
        return
    }
    $('.time_shift_minus').css('display','none');
});

// 中班减少
$('body').on('click','.minus_noon', function () {
    setNoonArr = [];
    InitTimeSlider();
    if (!$('.time_shift_minus .minus_noon').hasClass('time_gray') && $('.time_shift_minus .minus_morn').hasClass('time_gray')) {
        setTimeArray.shift();
        InitTimeSlider();
    } else if (!$('.time_shift_minus .minus_noon').hasClass('time_gray') && !$('.time_shift_minus .minus_morn').hasClass('time_gray')) {
        setTimeArray.splice(1,1);
        InitTimeSlider();
    } else {
        return
    }
    $('.time_shift_minus').css('display','none');
});

// 晚班减少
$('body').on('click','.minus_even', function () {
    setEvenArr = [];
    InitTimeSlider();
    if (!$('.time_shift_minus .minus_even').hasClass('time_gray')) {
        setTimeArray.pop();
        InitTimeSlider();
    } else {
        return
    }
    $('.time_shift_minus').css('display','none');
});

// 早班休息时间增加
$('body').on('click','#morn_plus', function () {
    var mornRest = {
        start: 20,
        end: 20,
        name: '早班',
        state: 0
    };
    mornRest.start = 30 + setMornArr.length * 4;
    mornRest.end = 32 + setMornArr.length * 4;
    setMornArr.push(mornRest);
    InitTimeSlider();
});

// 早班休息时间减少
$('body').on('click','#morn_minus', function () {
    setMornArr.pop();
    InitTimeSlider();
});

// 中班休息时间增加
$('body').on('click','#noon_plus', function () {
    var noonRest = {
        start: 140,
        end: 160,
        name: '中班',
        state: 0
    };
    noonRest.start = 180 + setNoonArr.length * 4;
    noonRest.end = 182 + setNoonArr.length * 4;
    setNoonArr.push(noonRest);
    InitTimeSlider();
});

// 中班休息时间减少
$('body').on('click','#noon_minus', function () {
    setNoonArr.pop();
    InitTimeSlider();
});

// 晚班休息时间增加
$('body').on('click','#even_plus', function () {
    var evenRest = {
        start: 336,
        end: 338,
        name: '晚班',
        state: 0
    };
    evenRest.start = 338 + setEvenArr.length * 4;
    evenRest.end = 340 + setEvenArr.length * 4;
    setEvenArr.push(evenRest);
    InitTimeSlider();
});

// 晚班休息时间减少
$('body').on('click','#even_minus', function () {
    setEvenArr.pop();
    InitTimeSlider();
});
