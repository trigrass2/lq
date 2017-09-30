/**
 * Created by Administrator on 2017/8/22.
 */
var picWorkLnQuery = '/worktime/workschedule/picWorkLineQuery',
    picWorkTmQuery = 'http://10.188.2.43:8088/ewap-auth/worktime/workschedule/picWorkTplQuery';

$(function() {
    // InitTree();
    //下拉
    $('#combo1').select2({minimumResultsForSearch: -1});
    $("#combo1").on("select2:select", function (e) {
        if ($(this).val() == '1') {
            $("#treeDemo").css('display', 'block');
            $("#table").css('display', 'none');
            $(".title_input").css('display', 'none');
            $(".product_line").css('display', 'block');
            $('.work_box .plan_line').css('display','block');
        }
        else if ($(this).val() == '2') {
            $("#treeDemo").css('display', 'none');
            $("#table").css('display', 'block');
            $(".title_input").css('display', 'block');
            $(".product_line").css('display', 'none');
            $('.work_box .plan_line').css('display','none');
        } else if ($(this).val() == '3') {
            $("#treeDemo").css('display', 'none');
            $("#table").css('display', 'none');
            $("#tableEquip").css('display', 'block');
            $(".title_input").css('display', 'block');
            $(".product_line").css('display', 'none');
            $('.work_box .plan_line').css('display','none');
        } else {
            $("#treeDemo").css('display', 'none');
            $("#table").css('display', 'none');
            $("#tableEquip").css('display', 'none');
            $(".title_input").css('display', 'block');
            $(".product_line").css('display', 'none');
            $('.work_box .plan_line').css('display','none');
        }
    });
})

    // 选择树形节点，显示时间拖动条
    var lineId = "";
    var WeekIndex = 1;
    $(function () {
        lineId = "";
        WeekIndex = 1;
        $(".mes_nav .btn").click(function () {
            $(".modal-body").css("display", "none");
            $(".btn").attr("class", "btn btn-primary");
            $(this).attr("class", "btn btn-primary chooseBtn");
            WeekIndex = parseInt($(this).attr("name"));
            InitTimeSlider();
            setTimeout(showRight, 100);
            var _thisText = $(this).text();
            for (var i = 0, j = $('.week_date label').length; i < j; i++){
                var weekText = $($('.week_date label')[i]).text();
                if (_thisText === weekText) {
                    $($('.week_date')[i]).css('display','none');
                } else {
                    $($('.week_date')[i]).css('display','block');
                }
            }
        });

    });

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
    lineId = treeNode.name
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

    function showRight() {
        // console.log(1);
        $(".modal-body").css("display", "block");
    }

// 设置时间拖动条
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
        if (lineId == "") {
            layer.msg('请先选择产线',{icon:7,shade: 0.3,shadeClose: true,time:2000});
            return;
        }

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

// 选择工作日
$('body').on('click','.week_day', function () {
    for (var i = 0, j = $('.week_date label').length; i < j; i++){
        var chooseWeekDay = $($('.week_date label')[i]).text();
        if (chooseWeekDay === '星期六' || chooseWeekDay ==='星期日') {
            $($('.week_date input')[i]).prop('checked',false)
        } else {
            $($('.week_date input')[i]).prop('checked',true)
        }
    }
});

// 全选按钮
$('body').on('click','.week_all',function () {
    for (var i = 0, j = $('.week_date label').length; i < j; i++){
        $($('.week_date input')[i]).prop('checked',true)
    }
});

// 清空按钮
$('body').on('click','.clear_all',function () {
    for (var i = 0, j = $('.week_date label').length; i < j; i++){
        $($('.week_date input')[i]).prop('checked',false)
    }
});





//拖拽
    var index,maxLeft;
    $(function(){
        //range值提示
        // $(".f-hk").mouseenter(function(){
        //   $(this).find(".f-range-tips").css("display","block");
        // });
        // $(".f-hk").mouseleave(function(){
        //   $(this).find(".f-range-tips").css("display","none");
        // });

        //拖动开始X值
        var startX,preLeft,minLeft;
        var handle = false;
        var avge=2880/$(".f-hk").parent('div').width();//总时间/总长
        $(".f-hk").mousedown(function(e){
            //拖动开始的X坐标
            startX = e.pageX;
            //判断是否拖动的变量
            handle = true;
            index = $(".f-hk").index(this);
            //获取滑块下标
            preLeft = parseInt($(".f-hk").eq(index).css("left"));
            //获取滑块最左的值
            minLeft = parseInt($(".f-hk").eq(index-1).css("left"))
        })

        $(document).mousemove(function(e){
            e.stopPropagation();
            //是否点击滑块
            if(handle){
                //显示提示值
                $(".f-hk").eq(index).find(".f-range-tips").css("display","block");
                //是否第一个
                if(index==0){
                    //是否最后一个
                    if(index != $(".f-hk").length-1){
                        maxLeft = parseInt(  $(".f-hk").eq(index+1).css("left")  )
                    }else{
                        maxLeft = $(".f-hk").parent('div').width();
                    }

                    var newLeft =e.pageX-startX+preLeft;
                    //设置边界
                    if(newLeft>maxLeft){
                        newLeft = maxLeft;
                    }
                    if(newLeft<0){
                        newLeft=0;
                    }


                    //执行拖动
                    $(".f-hk").eq(index).css("left",newLeft);
                    //动态改变提示的值
                    //var myVal = parseInt( (1- (parseFloat($(".f-hk").eq(index).css("left"))-8*(index) ) /(500-8*(index+($(".f-hk ").length-index-1) ) ))*100 ) +"%" ;
                    $(".f-hk").eq(index).find(".f-range-tips").html(setdate(newLeft*avge));
                    //改变 信息表最小值
                    $(".f-range-msg").eq(index).find(".f-valMin").html(newLeft);
                    //改变信息表最大值
                    if(index != $(".f-hk ").length-1){
                        var max = $(".f-range-msg").eq(index+1).find(".f-valMax").html(newLeft) ;
                    }
                }else{
                    //是否最后一个
                    if(index != $(".f-hk").length-1){
                        maxLeft = parseFloat(  $(".f-hk").eq(index+1).css("left")  )
                    }else{
                        maxLeft = $(".f-hk").parent('div').width();
                    }

                    var newLeft =e.pageX-startX+preLeft;
                    //设置边界
                    if(newLeft>maxLeft){
                        newLeft = maxLeft;
                    }
                    if(newLeft<minLeft){
                        newLeft=minLeft;
                    }

                    //执行拖动
                    $(".f-hk").eq(index).css("left",newLeft);
                    //动态改变提示的值
                    //var myVal = parseInt( (1- (parseFloat($(".f-hk").eq(index).css("left"))-8*(index) ) /(500-8*(index+($(".f-hk ").length-index-1) ) ))*100 ) +"%" ;
                    $(".f-hk").eq(index).find(".f-range-tips").html(setdate(newLeft*avge));
                    //改变信息表最小值
                    $(".f-range-msg").eq(index).find(".f-valMin").html(newLeft );
                    //改变信息表最大值
                    if(index != $(".f-hk ").length-1){
                        var max = $(".f-range-msg").eq(index+1).find(".f-valMax").html(newLeft) ;
                    }
                }

                if(index%2==0){
                    $('.content'+(index)).css({
                        left:(newLeft+8)+'px',
                        width:(parseInt($(".f-hk").eq(index+1).css("left"))-newLeft-8)+'px'
                    });
                    // if($('.content'+(index)).width()<30){
                    //   $('.content'+(index)).find('span').css('display','none')
                    // }
                    // else{
                    //   $('.content'+(index)).find('span').css('display','block')
                    // }
                }
                else{
                    $('.content'+Number(index-1)).css({
                        left:(parseInt($(".f-hk").eq(index-1).css("left"))+8)+'px',
                        width:(newLeft-parseInt($(".f-hk").eq(index-1).css("left"))-8)+'px'
                    })
                    // if($('.content'+Number(index-1)).width()<30){
                    //   $('.content'+Number(index-1)).find('span').css('display','none')
                    // }
                    // else{
                    //   $('.content'+Number(index-1)).find('span').css('display','block')
                    // }
                }
            }
        })
        $(document).mouseup(function(){
            handle = false;
            //隐藏值
            // $(".f-range-tips").css("display","none");
        })

        //初始化
        for(i=0;i<$(".f-hk").length;i++){
            var avge=2880/$(".f-hk").parent('div').width();//总时间/总长
            //获取百分比
            var getVal = parseInt($(".f-hk").eq(i).find(".f-range-tips").html());
            // var totalWidth =  500-8*(i+4-1-i);
            // var setLeft = parseInt ((1-getVal/100) * (totalWidth))+8*(i);
            //初始化left值
            $(".f-hk").eq(i).css("left",getVal);
            //初始化最小值
            $(".f-range-msg").eq(i).find(".f-valMin").html(getVal+"%");
            //初始化最大值
            if(i != $(".f-hk").length-1){
                $(".f-range-msg").eq(i+1).find(".f-valMin").html(getVal+"%");
            }
            if(i%2==1){
                $('.content'+(i-1)).css({
                    left:(parseInt($(".f-hk").eq(i-1).css("left"))+8)+'px',
                    width:(parseInt($(".f-hk").eq(i).css("left"))-parseInt($(".f-hk").eq(i-1).css("left"))-8)+'px'
                })
            }
        }
    })


// })

function setdate(date){
    var mintu=parseInt(date%60);
    var scend=Math.floor(date/60);
    return scend+':'+mintu
}

function setleft(date){


    var mintu=parseInt(date%60);
    var scend=Math.floor(date/60);
    return scend+':'+mintu

}