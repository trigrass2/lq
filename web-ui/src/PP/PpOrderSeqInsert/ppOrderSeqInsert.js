/**
 * Created by Administrator on 2017/7/12.
 */
"use strict";
var queryTbTypeUrl = apiUrl + '/base/pporderseq/queryOrdersByPage';
var queryTbSubUrl = apiUrl + '/base/pporderseq/querylistByPage';
/*公用方法*/
var mesCom=new mesComMethod();
/*表格搜索条件*/
var keyword='';//关键字搜索
var tmBasPlantId='';//工厂
var tmBasPartId='';//产品
var orderType='';//类型
var tmBasRouteId='';//工艺路径
var orderNo='';//订单编号
var planStartDate='';//订单计划上线日期
var planEndDate='';//订单计划下线日期
var tmBasPlantId='';//工厂
var currentPlanDate = '';//当前查询列表的排产日期
var currentRoute = '';//当前查询列表的工艺路径
var currentShift = '';//当前查询列表的班次
var count = 0;
var sortOrder = 'asc';
var sortName = 'order_no';

$(function () {
	
Ew.getDictVal(['ORDER_TYPE', 'ORDER_SOURCE','YESORNO','SHIFT_NO'], function (re) {	
    var colModel = [{
        label: "ttPpOrderId",
        name: "ttPpOrderId",
        index: "ttPpOrderId",
        hidden: true
    }, {
        label: "订单编号",
        name: "orderNo",
        index: "orderNo",
        key: true,
        sortable: true,
        width: 110
    }, {
        label: "工厂",
        name: "plant",
        index: "plant",
        sortable: false,
        width: 110
    }, {
        label: "产品",
        name: "part",
        index: "part",
        sortable: false,
        width: 130
    }, {
        label: "数量",
        name: "orderQty",
        index: "orderQty",
        sortable: true,
        width: 90
    }, {
        label: "客户",
        name: "custom",
        index: "custom",
        sortable: false,
        width: 150
    }, {
        label: "车间",
        name: "workshop",
        index: "workshop",
        sortable: false,
        width: 110
    }, {
        label: "预计上线日期",
        name: "planStartDate",
        index: "planStartDate",
        sortable: false,
        width: 110
    }, {
        label: "预计下线日期",
        name: "planEndDate",
        index: "planEndDate",
        sortable: false,
        width: 110
    },{
        label: "订单类型",
        name: "orderType",
        index: "orderType",
        sortable: false,
        width: 90,
        formatter: function (value, row, index) {
            return re.ORDER_TYPE[value];     
     }
    },{
        label: "紧急状态",
        name: "isUrgent",
        index: "isUrgent",
        sortable: false,
        width: 90,
        formatter: function (value, row, index) {
            return re.YESORNO[value];    
     }
    },{
        label: "来源",
        name: "orderSource",
        index: "orderSource",
        sortable: false,
        width: 90,
        formatter: function (value, row, index) {
            return re.ORDER_SOURCE[value];      
     }
    },{
        label: "BOM版本号",
        name: "bBomVersion",
        index: "bBomVersion",
        sortable: false,
        width: 90
    },{
        label: "工艺路径",
        name: "route",
        index: "route",
        sortable: false,
        width: 150
    },{
        label: "已上线数量",
        name: "onlineQty",
        index: "onlineQty",
        sortable: true,
        width: 110
    },{
        label: "已下线数量",
        name: "offlineQty",
        index: "offlineQty",
        sortable: true,
        width: 110
    }];
    
    var colModelSub = [{
        label: "ttPpOrderId",
        name: "ttPpOrderId",
        index: "ttPpOrderId",
        key: true,
        hidden: true
    },{
        label: "isUrgent",
        name: "isUrgent",
        index: "isUrgent",
        hidden: true,
        formatter: function (value, row, index) {
        	if(re.YESORNO[value] == undefined){
        		return value;
        	}
            return re.YESORNO[value];    
        }
    }, {
        label: "排产上线日期",
        name: "planDate",
        index: "planDate",
        sortable: false,
        width: 90
    }, {
        label: "班次",
        name: "shiftno",
        index: "shiftno",
        sortable: false,
        width: 90,
        formatter: function (value, row, index) {
        	if(value == ''){
        		return '';
        	}
            return re.SHIFT_NO[value];      
        }
    },{
        label: "工艺路径",
        name: "route",
        index: "route",
        sortable: false,
        width: 150
    }, {
        label: "序号",
        name: "planSeq",
        index: "planSeq",
        sortable: true,
        width: 90
    }, {
        label: "订单编号",
        name: "orderNo",
        index: "orderNo",
        sortable: true,
        width: 130
    }, {
        label: "工厂",
        name: "plant",
        index: "plant",
        sortable: false,
        width: 110
    }, {
        label: "产品",
        name: "part",
        index: "part",
        sortable: false,
        width: 130
    }, {
        label: "可上线数量",
        name: "canOnlineQty",
        index: "canOnlineQty",
        sortable: true,
        width: 90
    }];
    
    //初始化grid表格
    initGrid(colModel);
    initEmptyGrid(colModelSub);
})   
    
    
    /*浏览器窗口改变时重新适应表格大小*/
    $(window).bind('resize', function() {
        var childWidth = $('#dataList').closest('.jqGrid_wrapper').width();
        var width = $('#dataListChild').closest('.jqGrid_wrapper').width();
        $('#dataList').setGridWidth(width);
        $('#dataListChild').setGridWidth(childWidth);
    });
    /*移动行选项*/
    $('body').on('click','.menu-toggle',function () {
        var $tr=$("#dataListChild tbody > tr");
        if($tr.length > 1){
            $(this).next('.ew-menu-right').fadeToggle(300);
            var ids = $("#dataListChild").getDataIDs();
            var mainIds=$("#dataList").jqGrid("getGridParam","selarrrow");//获取总行数    
            var rowData = $("#dataListChild").jqGrid("getRowData",ids[0]);
            if(mainIds.length >0){ 	
                var mainData = $("#dataList").jqGrid("getRowData",mainIds[0]);
                if(rowData.plant != mainData.plant){
                   	mesCom.msgWarning('工厂不一致,不能进行插单操作！');
                    return;
                }
            }
        }else {
            var ids = $("#dataListChild").getDataIDs();
            if(ids.length == 0){
             	mesCom.msgWarning('没有排产数据,不能进行插单操作！');
                 return;
            }
        }

    });
    /*moveTableUp移动到指定行上方事件*/
    $('body').on('click','#moveTableUp',function () {
        var idsChild=$("#dataListChild").jqGrid("getGridParam","selarrrow");
        if(idsChild.length == 0){
            mesCom.msgWarning('请先选择将要被插入的行');
            return;
        }
        if(idsChild.length > 1){
            mesCom.msgWarning('被插入的行数据不能大于1！');
            return;
        }
        var $tr=$("#dataListChild tbody > tr");
        if($tr.length > 1){
            $(this).next('.ew-menu-right').fadeToggle(300);
            var ids = $("#dataListChild").getDataIDs();
            var mainIds=$("#dataList").jqGrid("getGridParam","selarrrow");//获取总行数    
            var rowData = $("#dataListChild").jqGrid("getRowData",ids[0]);
            if(mainIds.length >0){ 	
                var mainData = $("#dataList").jqGrid("getRowData",mainIds[0]);
                if(rowData.plant != mainData.plant){
                   	mesCom.msgWarning('工厂不一致,不能进行插单操作！');
                    return;
                }
            }
            addRowData("before","dataList","dataListChild");
        }else {
            var ids = $("#dataListChild").getDataIDs();
            if(ids.length == 0){
             	mesCom.msgWarning('没有排产数据,不能进行插单操作！');
                 return;
            }
        } 
    });
    /*moveTableDown移动到指定行下方事件*/
    $('body').on('click','#moveTableDown',function () {
        var idsChild=$("#dataListChild").jqGrid("getGridParam","selarrrow");
        if(idsChild.length == 0){
            mesCom.msgWarning('请先选择将要被插入的行');
            return;
        }
        if(idsChild.length > 1){
            mesCom.msgWarning('被插入的行数据不能大于1！');
            return;
        }
        var $tr=$("#dataListChild tbody > tr");
        if($tr.length > 1){
            $(this).next('.ew-menu-right').fadeToggle(300);
            var ids = $("#dataListChild").getDataIDs();
            var mainIds=$("#dataList").jqGrid("getGridParam","selarrrow");//获取总行数    
            var rowData = $("#dataListChild").jqGrid("getRowData",ids[0]);
            if(mainIds.length >0){ 	
                var mainData = $("#dataList").jqGrid("getRowData",mainIds[0]);
                if(rowData.plant != mainData.plant){
                   	mesCom.msgWarning('工厂不一致,不能进行插单操作！');
                    return;
                }
            }
            addRowData("after","dataList","dataListChild");
        }else {
            var ids = $("#dataListChild").getDataIDs();
            if(ids.length == 0){
             	mesCom.msgWarning('没有排产数据,不能进行插单操作！');
                 return;
            }
        } 
    });
    /*moveRowUp行上移事件*/
    $('body').on('click','#moveRowUp',function () {
        var idsChild=$("#dataListChild").jqGrid("getGridParam","selarrrow");
        if(idsChild.length == 0){
            mesCom.msgWarning('请先选择需要调整的数据！');
        } else {
            var $tr = $("#dataListChild #" + idsChild[0]);
            if (idsChild.length > 1) {
                var idsIndex = [],
                    selectIds = [],
                    setObj = {};
                for (var a = 0, b = $('#dataListChild tr').length; a < b; a++) {
                    if ($($('#dataListChild tr')[a]).hasClass('success')) {
                        idsIndex.push(a);
                        selectIds.push($($('#dataListChild tr')[a]).attr('id'));
                    }
                }
                idsIndex.sort(sortByOrder);
                var firstId = $($('#dataListChild tr')[idsIndex[0]]);
                for (var i = 0, j = idsChild.length; i < j; i++) {
                    $tr = $("#dataListChild #" + idsChild[i]);
                    var $td = idsIndex[i];
                    setObj['' + $td + ''] = idsChild[i];
                }
                var idsArr = [],
                    trIds = [];
                for (var m = 0, n = idsIndex.length; m < n; m++) {
                    idsArr.push($("#dataListChild #" + setObj['' + idsIndex[m] + '']).attr('id'));
                    trIds.push($('#dataListChild tr')[m + 1].id)
                }
                if (firstId.prev().before().attr('id') === undefined) {
                    if (trIds.toString() === selectIds.toString()) {
                        mesCom.msgWarning('不好意思，已经是最顶部了！');
                    } else {
                        firstId.fadeOut().fadeIn();
                        for (var a = 0, b = idsIndex.length, c = idsIndex.length; a < b; a++) {
                            $tr = $("#dataListChild #" + setObj['' + idsIndex[1] + '']);
                            var otherIds = $("#dataListChild #" + selectIds[c--]);
                            otherIds.fadeOut().fadeIn();
                            firstId.after($tr);
                            firstId.after(otherIds);
                        }
                    }
                } else {
                    firstId.fadeOut().fadeIn();
                    firstId.prev().before(firstId);
                    var otherId;
                    for (var k = 0, l = idsIndex.length, m = idsIndex.length; k < l; k++) {
                        otherId = $("#dataListChild #" + selectIds[m--]);
                        otherId.fadeOut().fadeIn();
                        firstId.after(otherId);
                    }
                }
            } else {
                if ($tr.prev().before().attr('id') === undefined) {
                    mesCom.msgWarning('不好意思，已经是最顶部了！');
                } else {
                    $tr.fadeOut().fadeIn();
                    $tr.prev().before($tr);
                }
            }
        }
    });
    /*moveRowDown行下移事件*/
    $('body').on('click','#moveRowDown',function () {
        var idsChild=$("#dataListChild").jqGrid("getGridParam","selarrrow");
        if(idsChild.length == 0){
            mesCom.msgWarning('请先选择需要调整的数据！');
        } else {
            var $tr = $("#dataListChild #"+idsChild[0]);// 点击的第一个
            if (idsChild.length > 1) {
                var idsIndex = [],
                    selectIds = [],
                    setObj = {};
                for (var a = 0, b = $('#dataListChild tr').length; a < b; a++) {
                    if ($($('#dataListChild tr')[a]).hasClass('success')) {
                        idsIndex.push(a);
                        selectIds.push($($('#dataListChild tr')[a]).attr('id'));
                    }
                }
                idsIndex.sort(sortByOrder);
                for (var i = 0, j = idsChild.length; i < j; i++) {
                    $tr = $("#dataListChild #"+idsChild[i]);
                    var $td = idsIndex[i];
                    setObj[''+$td+''] = idsChild[i];
                }
                var lastId = $($('#dataListChild tr')[idsIndex[idsIndex.length - 1]]);
                if (lastId.next().after().attr('id') === undefined) {
                    var idsArr = [],
                        trIds = [];
                    for (var m = 0, n = idsIndex.length; m < n; m++) {
                        idsArr.push($("#dataListChild #" + setObj['' + idsIndex[m] + '']).attr('id'));
                        var trLens = $('#dataListChild tr').length -n;
                        trIds.push($('#dataListChild tr')[trLens + m].id);
                    }
                    if (trIds.toString() === selectIds.toString()) {
                        mesCom.msgWarning('不好意思，已经是最底部了！');
                    } else {
                        var otherIds;
                        for (var a = 0,b = idsIndex.length,c = idsIndex.length -1; a < b; a++) {
                            otherIds = $("#dataListChild #" + selectIds[a]);
                            otherIds.fadeOut().fadeIn();
                            lastId.before(otherIds);
                        }
                    }
                } else {
                    lastId.next().after(lastId);
                    for (var k = 0, l = idsIndex.length; k < l; k++) {
                        var otherId = $("#dataListChild #" + selectIds[k]);
                        otherId.fadeOut().fadeIn();
                        lastId.before(otherId);
                    }
                }
            } else {
                if ($tr.next().after().attr('id') == undefined) {
                    mesCom.msgWarning('不好意思，已经是最底部了！');
                } else {
                    $tr.fadeOut().fadeIn();
                    $tr.next().after($tr);
                }
            }
        }
    });
    /*delRow删除行*/
    $('body').on('click','#delRow',function () {
        addRowData("after","dataListChild","dataList");
    });

    // 排序
    function sortByOrder(a, b) {
        return a - b;
    }
});


/**移动行处理事件
 *@param position移动到指定行前，行后
 *@param tableId取数据的表格
 *@param moveTableId移到后的新表格
 * $("#dataListChild").jqGrid("addRowData", getMaxRow(), rowData, "after",idsChild[0]);
 *@param [first,last,before,after], 为后两者是需要指定相对的行ID
 *@param addRowData--新增一行
 *@param getMaxRow设置新行号
 *@param rowData填充的行数据
 *@param idsChild[0]添加到哪一行的指定位置
 * */
function addRowData(position,tableId,moveTableId) {

    var ids=$("#"+tableId).jqGrid("getGridParam","selarrrow");//获取总行数
    if(tableId == 'dataList' && moveTableId == 'dataListChild'){
    	ids.sort();
    }
    var idsChild=$("#"+moveTableId).jqGrid("getGridParam","selarrrow");
    if(ids.length == 0){
        mesCom.msgWarning('请先选择需要移动的数据！');
    }else if (ids.length == 1){
        var rowData = $("#"+tableId).jqGrid("getRowData",ids[0]);
        rowData.shiftno = $('#combo34').val();//班次
        rowData.planDate = $('#day32').val();//排产上线日期
        rowData.canOnlineQty = rowData.orderQty - rowData.onlineQty ;//可上线数量
        if(idsChild.length == 0){
            $("#"+moveTableId).jqGrid("addRowData", rowData.ttPpOrderId, rowData, "last");
            delRow(tableId);
        }else if(idsChild.length == 1) {
            $("#"+moveTableId).jqGrid("addRowData", rowData.ttPpOrderId, rowData, position,idsChild[0]);
            delRow(tableId);
        }else if(idsChild.length > 1){
            mesCom.msgWarning('不能指定多好插入位置的数据！');
        }
    }else if(ids.length > 1){
        if(idsChild.length == 0){
            for(var i=0,j=ids.length;i<j;i++){
                var rowData = $("#"+tableId).jqGrid("getRowData",ids[i]);
                $("#"+moveTableId).jqGrid("addRowData", rowData.ttPpOrderId, rowData, "last");
            }
            delRow(tableId);
        }else if(idsChild.length == 1) {
            for(var i=0,j=ids.length;i<j;i++){
                var rowData = $("#"+tableId).jqGrid("getRowData",ids[i]);
                $("#"+moveTableId).jqGrid("addRowData", rowData.ttPpOrderId, rowData, position,idsChild[0]);
            }
            delRow(tableId);
        }else if(idsChild.length > 1){
            mesCom.msgWarning('不能指定多好插入位置的数据！');
        }

    }
    
    $("#dataList").trigger("reloadGrid");
    $('.ew-menu-right').css('display','none');
}
/*删除行事件*/
function delRow(tableId) {
    var selectedRowIds =$("#"+tableId).jqGrid("getGridParam","selarrrow");
    var len = selectedRowIds.length;
    if(len == 0){
        mesCom.msgWarning('请先选择需要移除的数据！');
    }else {
        for(var i = 0;i < len ;i ++) {
            $("#"+tableId).jqGrid("delRowData", selectedRowIds[0]);
        }
    }
}
//重新获取行号
function getMaxRow(tableId) {
    var newrowid=1;
    //获取所有行号
    var idsAll = $("#"+tableId).jqGrid('getDataIDs');
    if(idsAll.length < 1){
        newrowid=1;
    }else {
        var rowidMax = Math.max.apply(Math, idsAll);
        newrowid = rowidMax+1;
    }
    return newrowid;
}
/*表格搜索数据*/
var getSearchPostDataModel = function () {
	var postData = {};
	postData.tmBasPlantId = $('#combo30').val();
	postData.orderType = $('#combo33').val();
	postData.tmBasRouteId = $("#inputCom31").val();
	postData.planStartDate = $('#day30').val();
	postData.planEndDate = $('#day31').val();
	postData.orderNo = $('#text30').val();
	postData.tmBasPartId = $('#inputCom30').val();
	postData.orderIds = $("#dataListChild").jqGrid('getDataIDs');
    postData.pageSize = 10;
    postData.offset = 1;
    postData.pageIndex = 1;
    return postData;
};

/*表格搜索数据(右侧表格)*/
var getSearchTableModel = function () {
    var postData = {};
	postData.planDate = $("#day32").val();
	postData.tmBasRouteId = $('#combo35').val();
	postData.shiftno = $('#combo34').val();
    postData.pageSize = 10;
    postData.offset = 1;
    postData.pageIndex = 1;
    return postData;
};

/*表格ajax请求*/
var ajaxGridOptions = {
    contentType: "application/json; charset=gbk",
    type: 'POST',
    // dataType: 'json',
    // type: 'POST',
    // contentType: 'application/json',
    // crossDomain: true, //如需跨域
    // xhrFields: {
    //     withCredentials: true
    // },
    error: function(error) {
        if (error.status == 401) {
        }
    }
};
/*初始化主表数据*/
var initGrid = function (colModel) {
    $.jgrid.defaults.styleUI = 'Bootstrap';
    $("#dataList").jqGrid({
        url: queryTbTypeUrl,
        postData: getSearchPostDataModel(),//此数组内容直接赋值到url上，参数类型：{name1:value1…}
        ajaxGridOptions: ajaxGridOptions,//对ajax参数进行全局设置，可以覆盖ajax事件
        datatype: "json",//从服务器端返回的数据类型，默认xml。可选类型：xml，local，json，jsonnp，script，xmlstring，jsonstring，clientside
        mtype: "POST",//ajax提交方式。POST或者GET，默认GET
        colModel: colModel,
        loadonce: false,//如果为ture则数据只从服务器端抓取一次，之后所有操作都是在客户端执行，翻页功能会被禁用
        viewrecords: true,//是否要显示总记录数信息
        altRows:true,//隔行变色
        altclass:"ui-widget-content-altclass",//隔行变色样式
        shrinkToFit: false,////当为ture时，调整列宽度不会改变表格的宽度。当shrinkToFit 为false时，此属性会被忽略
        autoScroll: true,
        height: 320,//表格高度，可以是数字，像素值或者百分比
        rowNum: 10,//设置表格可以显示的记录数
        rowList: [10, 30, 50],//一个下拉选择框，用来改变显示记录数，当选择时会覆盖rowNum参数传递到后台
        // rownumbers: true,//如果为ture则会在表格左边新增一列，显示行顺序号，从1开始递增。此列名为'rn'
        // rownumWidth: 25,
        multiselect: true,//定义是否可以多选
        // sortable: true,//是否可排序
        // sortname:"orderQty",
        // sortorder:"asc",
        refresh: false,//是否启用刷新按钮，当点击刷新按钮时会触发trigger(“reloadGrid”)事件，而且会清空搜索条件值
        pager: "#dataListPage",//定义翻页用的导航栏，必须是有效的html元素。翻页工具栏可以放置在html页面任意位置
        scroll: 1,//创建一个动态滚动的表格，当为true时，翻页栏被禁用，使用垂直滚动条加载数据，且在首次访问服务器端时将加载所有数据到客户端。当此参数为数字时，表格只控制可见的几行，所有数据都在这几行中加载
        beforeRequest: function (t) {//向服务器端发起请求之前触发此事件但如果datatype是一个function时例外
           	if(count == 0){
        		count++;
        		return;
        	}
            var model = getSearchPostDataModel();
            model.sortName = sortName;
            model.sortOrder = sortOrder;
            model.pageIndex = $("#dataList").jqGrid("getGridParam", "page");
            model.pageSize = $("#dataList").jqGrid("getGridParam", "rowNum");
            $("#dataList").jqGrid("setGridParam", {
                postData: JSON.stringify(model)
            });

        },
        regional: 'cn',
        jsonReader: {//描述json 数据格式的数组
            root: function (obj) {//Json数据
                // $.each(obj.results, function (index, item) {
                //     item.operatorInfo = '<a href="#">查看</a> ';
                //     // item.dataCreated = item.dataCreated.Format("yyyy-MM-dd");
                // });
                return obj.results;
            },
            page: function (obj) {//当前页
                var page = $("#dataList").jqGrid("getGridParam", "page");
                return page;
            },
            total: function (obj) {//总页数
                var rows = $("#dataList").jqGrid("getGridParam", "rowNum");
                var count = obj.count;
                return Math.ceil(count / rows);
            },
            records: function (obj) {//总记录数
                return obj.count;
            },
            repeatitems: false//以name匹配
        },
        // autowidth: true,
        onPaging: function (pgButton) {//点击翻页按钮填充数据之前触发此事件，同样当输入页码跳转页面时也会触发此事件
        },
        onSortCol: function (index, colindex, sortorder){
        	sortOrder = sortorder;
          	sortName = index;
		},
        loadComplete: function (data) {//当从服务器返回响应时执行，xhr：XMLHttpRequest 对象
        },
        gridComplete: function () {//当表格所有数据都加载完成而且其他的处理也都完成时触发此事件，排序，翻页同样也会触发此事件
            // var graduateIds = $("#dataList").jqGrid('getDataIDs');
            // for (var i = 0; i < graduateIds.length; i++) {
            //     var cl = graduateIds[i];
            //     var operatorInfoHtml =
            //     $("#dataList").jqGrid('setRowData', cl, {operatorInfo: operatorInfoHtml});
            // }
            var ids = $("#dataList").getDataIDs();

            for(var i=0;i<ids.length;i++){  
            	var rowData = $("#dataList").getRowData(ids[i]);
                if(rowData.isUrgent.indexOf('是') > -1 ){//紧急订单显示红色
                    $('#'+ids[i]).find("td").addClass("SelectBG");
                }
            }
        	
            var width = $('#dataList').closest('.jqGrid_wrapper').width();
            $('#dataList').setGridWidth(width);
        }
    });
    // $("#dataList").jqGrid('gridDnD',{connectWith:'#dataListChild'});
};


/*初始化子表数据*/
var initEmptyGrid = function (colModel) {
    $.jgrid.defaults.styleUI = 'Bootstrap';
    $("#dataListChild").jqGrid({
        url: queryTbSubUrl,
        postData: getSearchTableModel(),//此数组内容直接赋值到url上，参数类型：{name1:value1…}
        ajaxGridOptions: ajaxGridOptions,//对ajax参数进行全局设置，可以覆盖ajax事件
        datatype: "json",//从服务器端返回的数据类型，默认xml。可选类型：xml，local，json，jsonnp，script，xmlstring，jsonstring，clientside
        mtype: "POST",//ajax提交方式。POST或者GET，默认GET
        loadonce: false,//如果为ture则数据只从服务器端抓取一次，之后所有操作都是在客户端执行，翻页功能会被禁用
        cellsubmit : 'rclientArray',
        colModel: colModel,
        viewrecords: true,//是否要显示总记录数信息
        altRows:true,//隔行变色
        altclass:"ui-widget-content-altclass",//隔行变色样式
        shrinkToFit: false,////当为ture时，调整列宽度不会改变表格的宽度。当shrinkToFit 为false时，此属性会被忽略
        autoScroll: true,
        height: 320,//表格高度，可以是数字，像素值或者百分比
        // rownumbers: true,//如果为ture则会在表格左边新增一列，显示行顺序号，从1开始递增。此列名为'rn'
        // rownumWidth: 25,
        multiselect: true,//定义是否可以多选
        beforeRequest: function (t) {//向服务器端发起请求之前触发此事件但如果datatype是一个function时例外
            var model = getSearchTableModel();
         
            var planDate=$('#day32').val();
            var tmBasRouteId=$('#combo35').val();
            if((planDate != '' && planDate != undefined) && (tmBasRouteId != '' && tmBasRouteId != undefined)) {
            	
            }else {
                if(planDate == '' || planDate == undefined){
                    return;
                }
                if (tmBasRouteId == '' || tmBasRouteId == undefined){
                    return;
                }
            }
         
            model.pageIndex = 1;
            model.pageSize = 999999;
            $("#dataListChild").jqGrid("setGridParam", {
                postData: JSON.stringify(model)
            });
        },
        regional: 'cn',
        jsonReader: {//描述json 数据格式的数组
            root: function (obj) {//Json数据
                // $.each(obj.results, function (index, item) {
                //     item.operatorInfo = '<a href="#">查看</a> ';
                //     // item.dataCreated = item.dataCreated.Format("yyyy-MM-dd");
                // });
                return obj.results;
            },
            records: function (obj) {//总记录数
                return obj.count;
            },
            repeatitems: false//以name匹配
        },
        gridComplete: function () {//当表格所有数据都加载完成而且其他的处理也都完成时触发此事件，排序，翻页同样也会触发此事件
            var ids = $("#dataListChild").getDataIDs();
            for(var i=0;i<ids.length;i++){
                var rowData = $("#dataListChild").getRowData(ids[i]);
                if(rowData.isUrgent.indexOf('是') > -1){//紧急订单显示红色
                    $('#'+ids[i]).find("td").addClass("SelectBG");
                }
            }
        	
            var width = $('#dataListChild').closest('.jqGrid_wrapper').width();
            $('#dataListChild').setGridWidth(width);
        }
    });
    // $("#dataListChild").jqGrid('gridDnD',{connectWith:'#dataList'});
    $("#dataListChild").jqGrid('sortableRows');
};

$(function(){
	//搜索条件
	var mainSearchData=[{
		idName:'combo30',
		text:'工厂',
		comboUrl:'/base/plant/publicPlantSelect',
		comboId:'tmBasPlantId',
		comboText:'plant',
		field:'tmBasPlantId',
  		valid:['notEmpty'],
		onClick:function(data){
	        $('#inputCom30').val('');
            $('#inputCom31').val('');
		}
	},{
    idName:'inputCom30',
		text:'产品',
		comboUrl:'/worktime/part/publicProduct',
		comboData:
      {
			id:['combo30'],
			field:['tmBasPlantId'],
			other:{partType1:['S','P'],enabled:1}
      },
		comboId:'tmBasPartId',
		comboText:'part',
		field:'tmBasPartId',
    onSuccess:function(data){
		  console.log(data)
    }
	},{
		idName:'combo33',
		text:'订单类型',
		comboUrl:'/system/codeList/getSelect',
		comboId:'no',
		comboText:'name',
		field:'orderType',
		comboData:'ORDER_TYPE',
		n:1
	},{
    idName:'inputCom31',
		text:'工艺路径',
		comboUrl:'/base/route/queryRoute',
		comboData:
      {
			id:['combo30'],
			field:['tmBasPlantId'],
      other:{}
      },
		comboId:'tmBasRouteId',
		comboText:'route',
		field:'tmBasRouteId',
    onSuccess:function(data){
		  console.log(data)
    }
	},{
    idName:'text30',
		text:'订单编号',
		field:'orderNo'
	},{
		idName: 'day30',
		text: '预计上线日期从',
		field: 'planStartDate'
	},{
		idName: 'day31',
		text: '预计上线日期到',
		field: 'planEndDate'
	}];
	
	
	
	//搜索条件
	var mainSearchData2=[{
		idName:'combo35',
		text:'工艺路径',
		comboUrl:'/base/route/queryRoute',
		comboData:
		{
		id:['combo30'],
		field:['tmBasPlantId'],
		other:{routeStatus: 'P'}
		},
		comboId:'tmBasRouteId',
		comboText:'route',
		valid:['notEmpty'],
		field:'tmBasRouteId',
		isSearch:true,
		onSuccess:function(data){
		  console.log(data)
    	}
	},{
		idName: 'day32',
		text: '排产日期',
		valid:['notEmpty'],
		field: 'planDate'
	},{
	
		idName:'combo34',
		text:'班次',
		comboUrl:'/system/codeList/getSelect',
		comboId:'no',
		comboText:'name',
		field:'shiftno',
		comboData:'SHIFT_NO',
		n:1
	}];
	
	
	
	Ew.search('.demoSearch2',{
		title:'插单',
		listWidth:'300px',
		textValues:mainSearchData2,
		btnValues:[{
			btnId:'btnInsertSearch',text:'搜索',onClick:function(){
		        var planDate=$('#day32').val();
		        var tmBasRouteId=$('#combo35').val();
		        
		        if(tmBasRouteId == ''){
				    mesCom.msgError('工艺路径不能为空');
				    return;			
		        }
		        
		        if(planDate == ''){
				    mesCom.msgError('排产日期不能为空');
				    return;			
		        }
		        
		        if((planDate != '' && planDate != undefined) && (tmBasRouteId != '' && tmBasRouteId != undefined)) {
		              $("#dataListChild").trigger("reloadGrid");
		              currentPlanDate = planDate;
		              currentRoute = $('#combo35').val();
		              currentShift = $('#combo34').val();
		        }
				}
			},{
			btnId:'btnInsert',text:'插单',onClick:function(){
		        var planDate=$('#day32').val();
		        var shiftno=$('#combo34').val();
		        var route=$('#combo35').val();
		        
		        if(route == ''){
				    mesCom.msgError('工艺路径不能为空');
				    return;			
		        }
		        
		        if(planDate == ''){
				    mesCom.msgError('排产日期不能为空');
				    return;			
		        }

		        // var shiftnoText=$('#selectShift option:selected').text();
		        var schedulingData={};
		        var ppOrderSeqsArry=[];
		        var ids = $("#dataListChild").jqGrid('getDataIDs');//获取总行数
		        for(var i=0,j=ids.length;i<j;i++){
		            var rowData = $("#dataListChild").jqGrid("getRowData",ids[i]);
		            ppOrderSeqsArry.push({
		                ttPpOrderId : rowData.ttPpOrderId,
		                orderNo : rowData.orderNo,
		                planSeq : rowData.planSeq,
		                shiftno : rowData.shiftno
		            });
		        }
		        schedulingData.ppOrderSeqs=ppOrderSeqsArry;
		        schedulingData.planDate=planDate;
		        schedulingData.shiftno=shiftno;
		        schedulingData.tmBasRouteId=route;
		        if((planDate != '' && planDate != undefined) && (route != '' && route != undefined)) {
		        	if(planDate != currentPlanDate || route != currentRoute || shiftno != currentShift){
		                mesCom.msgWarning('查询列表中的数据与查询条件选择的不一致,请修改！');
		        		return;
		        	}
		        	
		        	if(planDate < (new Date().Format("yyyy-MM-dd"))){
		        	    mesCom.msgWarning('排产日期不能小于当前日期!');
		        		return;
		        	}
		        	
		            $.ajax({
		                url: apiUrl + '/base/pporderseq/insert',
		                type: "POST",
		                data: JSON.stringify(schedulingData),
		                contentType: "application/json; charset=gbk",
		                dataType: "JSON",
		                async: false,
		                success: function (res) {
		                    if (res.code == 10000) {
		                        //从服务器获取数据进行绑定
		                        mesCom.msgSuccess('插单成功');
		                        $("#dataListChild").trigger("reloadGrid");
		                    } else {
		                        mesCom.msgError(res.message);
		                    }
		                }
		            });
		        }
		    
			}
		}]
	});

	//搜索11

	/*
	*搜索框函数
	*
	*el：为html标签
	*
	*option（参数设置）：
	*@title搜索框标题名称
	*@listWidth搜索条件的宽度默认250px
	*@textValues为弹出框中搜索条件设置为数组[]
	*text：为页面显示的条件名称，
	*field：为当前条件的字段名称，取决后台需求，
	*idName：为input的id，input的类型取决于id名包含字段，
	*包含text，为输入文本框，
	*包含combo，为下拉框，
	*下拉数据调用后台方法
	*comboUrl为接口地址，comboData为接口条件，comboId接口id字段，comboText接口text字段
	*下拉数据调用本地方法，
	*comboData：[{id:1,text:'2222'}],内容为写死的json
	*
	*包含day为时间控件年月日
	*
	*
	*@btnValues为按钮设置为数组[]
	*btnId:为按钮id
	*text：为按钮名称
	*onClick：为点击事件默认有个data为搜索条件[{他的field：他的值},......]
	*如果text为清空自动生成点击事件把搜索条件全部清空
	*
	*
	*
	*
	*
	*/

	Ew.search('.demoSearch',{
		title:'查询',
		listWidth:'300px',
		textValues:mainSearchData,
		btnValues:[{
			btnId:'btnSearch',
			text:'搜索',
			onClick:function(data){
		        var tmBasPlantId = $('#combo30').val().trim();
		        if(tmBasPlantId == '' || tmBasPlantId == undefined){
		            mesCom.msgWarning('工厂不能为空');
		            return;
		        }	
		        $("#dataList").trigger("reloadGrid");
		        $("#dataListChild").jqGrid("clearGridData");//清空表格数据
			}
		},
            {
			btnId:'btnClear',
			text:'重置',
			onClick:function(data){
		        $("#combo30").select2('val','');//工厂
		        $('#inputCom30').val('');//产品
		        $("#orderType").select2('val','');//类型
		        $('#tableBasRouteId').attr('data-id','');//工艺路径
		        $('#tableBasRouteId').attr('alt','');//工艺路径
		        $('#tableBasRouteId').val('');//工艺路径
		        $("#text30").val('');//订单编号
		        $('#day30').find('input').val('');//订单计划上线日期
		        $('#day31').find('input').val('');//订单计划下线日期
		        $("#dataList").trigger("reloadGrid");
		        partSuggest();//更新产品智能文本框
		        routeSuggest('tmBasRouteId');//更新工艺路径智能文本框
		        routeSuggest('tableBasRouteId');//更新工艺路径智能文本框

                // $('#combo35').select2('val','');
                // $('#day32').find('input').val(''); //排产日期
                // $('#combo34').select2('val','');
                // $('#combo35').select2("destroy").select2(); //排产工艺路径
                // $('#combo35').select2('val','0');
                // $('#day32').val(''); //排产日期
                // $('#combo34').select2("destroy").select2(); //班次
                // $('#combo34').select2('val','0');

                // $('#combo30').select2("destroy").select2();
                //     $('#combo30').select2('val','0');
                //     $('#inputCom30').val('');//产品
                //     $('#combo33').select2("destroy").select2();
                //     $('#combo33').select2('val','0');
                //     $('#inputCom31').val('');//工艺路径
                //     $("#text30").val('');//订单编号
                //     $('#day30').val('');//订单计划上线日期
                //     $('#day31').val('');//订单计划下线日期
                //     $("#dataList").jqGrid("clearGridData");//清空表格数据
                //     $("#dataListChild").jqGrid("clearGridData");//清空表格数据
		    }
		}
		]
	});
	
});