var mod_flag=0;
var currentRow = null;

$(function () {
	initDropList();

	$(".pickertime").datetimepicker({
        format: "hh:ii",//时间格式选择时分
        startView:0,//初始化从分钟开始选
        autoclose: true,
        todayBtn: false,
        pickerPosition: "bottom-left",
        minuteStep:1,//分钟间隔为1分钟
        language: "zh-CN"
    }).on('hide',function(e) {
    	if(e.target.name=='startTime' || e.target.name == 'endTime'){
    		$('#formEdit').data('bootstrapValidator')  
    		.updateStatus(e.target.name, 'NOT_VALIDATED',null)  
    		.validateField(e.target.name);
    	}
    	if(e.target.name=='restStartTime' || e.target.name == 'restEndTime'){
    		$('#formRestEdit').data('bootstrapValidator')  
    		.updateStatus(e.target.name, 'NOT_VALIDATED',null)  
    		.validateField(e.target.name);
    	}
	});
	
    //1.初始化Table
	initTimetpl();
	initTimetpl_Rest();
	
    layui.use(['element','laypage','layer'], function(){
      layer = layui.layer;//弹出层
    });
    
    $("#enabled").bootstrapSwitch(
	{
        onText:"启用",
        offText:"禁用",
        onColor:"success",
        offColor:"danger",
        size:"small",  
        onSwitchChange:function(event,state){  
            if(state==true){  
                $(this).val("1");  
            }else{  
                $(this).val("0");  
            }  
        }  
    });
    
    $('#formEdit').bootstrapValidator({
        message: '验证不通过',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            no: {
                validators: {
                    notEmpty: {
                        message: '编号不能为空'
                    },
                    stringLength: {
                        min: 1,
                        max: 20,
                        message: '编号长度不能超过20'
                    }
                }
            },
            type: {
                validators: {
                	notEmpty: {
                        message: '工作时间类型不能为空'
                    }
                }
            },
            jph: {
                validators: {
                	stringLength: {
                        min: 1,
                        max: 5,
                        message: 'jph长度不能超过5'
                    },
                	numeric: {
                		message: 'jph只能输入数字'
                	} 
                }
            },
            planNum: {
                validators: {
                	stringLength: {
                		min: 1,
                        max: 5,
                        message: '计划上线数长度不能超过5'
                	},
                	numeric: {
                		message: '计划上线数只能输入数字'
                	} 
                }
            },
            shiftno: {
                validators: {
                	notEmpty: {
                        message: '班次不能为空'
                    }
                }
            },
            startTime: {
                validators: {
                	notEmpty: {
                        message: '开始时间不能为空'
                    }
                }
            },
            endTime: {
                validators: {
                	notEmpty: {
                        message: '结束时间不能为空'
                    }
                }
            }
        }
    });
    
    $('#formRestEdit').bootstrapValidator({
        message: '验证不通过',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
        	restStartTime: {
                validators: {
                    notEmpty: {
                        message: '休息开始时间不能为空'
                    }
                }
            },
            restEndTime: {
                validators: {
                	notEmpty: {
                        message: '休息结束时间不能为空'
                    }
                }
            }
        }
    });
});

function initTimetpl(){
	$('#tb_worktimetpl').bootstrapTable({
	    url: apiUrl + "/worktime/workschedule/query",         //请求后台的URL（*）
	    method: 'post',                      //请求方式（*）
	    toolbar: '#toolbarl',                //工具按钮用哪个容器
	    showExport: false,                     //是否显示导出
	    exportDataType: "all",              //basic', 'all', 'selected'.
	    striped: true,                      //是否显示行间隔色
	    cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
	    pagination: true,                   //是否显示分页（*）
	    dataField: "data",					//这是返回的json数组的key.默认好像是"rows".这里只有前后端约定好就行
	    sortable: true,                     //是否启用排序
	    sortOrder: "asc",                   //排序方式
	    queryParams:function queryParams(params) {   //设置查询参数
			var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
				pageSize: params.limit,   //页面大小
	            pageIndex : params.offset/params.limit+1, //当前页面,默认是上面设置的1(pageNumber)
	            type :  $("#search_type").val() == '' ? null : $("#search_type").val() ,
	            shiftno  :  $("#search_shiftno").val() == '' ? null : $("#search_shiftno").val() ,
	            tmBasLineId  :  $("#search_tmBasLineId").val() == '' ? null : $("#search_tmBasLineId").val() ,
	            tmBasStorageId  :  $("#search_tmBasStorageId").val() == '' ? null : $("#search_tmBasStorageId").val() ,
	            tmBasEquipmentId  :  $("#search_tmBasEquipmentId").val() == '' ? null : $("#search_tmBasEquipmentId").val() ,
	            enabled  :  $("#search_enabled").val() == '' ? null : $("#search_enabled").val()
	        };
	        return temp;
	    },
	    onClickRow: function (row) {
	    	currentRow = row;
        	$('#tb_worktimetpl_rest').bootstrapTable("refresh");
        	$('#tb_worktimetpl_rest').bootstrapTable("refreshOptions",{pageNumber:1});
        },
        sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
        pageNumber:1,                       //初始化加载第一页，默认第一页
        pageSize: 10,                       //每页的记录行数（*）
        pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
        search: true,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        strictSearch: true,
        showColumns: false,                  //是否显示所有的列
        showRefresh: false,                  //是否显示刷新按钮
        minimumCountColumns: 2,             //最少允许的列数
        clickToSelect: false,                //是否启用点击选中行
        height: 500,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "tmBasWorkscheduleId",        //每一行的唯一标识，一般为主键列
        showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                   //是否显示父子表
        responseHandler:function(res){
        	var errcode = res.code;//在此做了错误代码的判断
    	    if(errcode != 10000){
    	        layer.msg(res.message,{icon:2,time:1000});
    	        return;
    	    }
    	    //如果没有错误则返回数据，渲染表格
    	    return {
    	        total : res.count, //总页数,前面的key必须为"total"
    	        data : res.results //行数据，前面的key要与之前设置的dataField的值一致.
    	    };
        },
        columns: [{
        	checkbox: true
	        },{
	            field: 'no',
	            title: '编号'
	        }, {
	            field: 'type',
	            title: '工作时间类型',
                formatter: function (value, row, index) {
                    if (value == "10"){
                    	return '产线';
                    }else if (value == "20"){
                    	return '仓库';
                    }else if (value == "30"){
                    	return '设备';	
                    }
                }
	        }, {
	            field: 'tmBasLineId',
	            title: '产线id'
	        }, {
	            field: 'line_name',
	            title: '产线'
	        }, {
	            field: 'tmBasStorageId',
	            title: '仓库id'
	        }, {
	            field: 'storage_name',
	            title: '仓库'
	        }, {
	            field: 'tmBasEquipmentId',
	            title: '设备id'	
	        }, {
	            field: 'equipment_name',
	            title: '设备'
	        }, {
	            field: 'shiftno',
	            title: '班次',
	            formatter: function (value, row, index) {
                    if (value == "1"){
                    	return '早班';
                    }else if (value == "2"){
                    	return '中班';
                    }else if (value == "3"){
                    	return '晚班';	
                    }
                }
	        }, {
	            field: 'startTime',
	            title: '开始时间'
	        }, {
	            field: 'endTime',
	            title: '结束时间'
	        }, {
	            field: 'mon',
	            title: '星期一',
	            formatter: function (value, row, index) {
                    if (value == 1){
                    	return '√';
                    } else {
                    	return '';	
                    }
                }
	        }, {
	            field: 'tue',
	            title: '星期二',
	            formatter: function (value, row, index) {
                    if (value == 1){
                    	return '√';
                    } else {
                    	return '';	
                    }
                }
	        }, {
	            field: 'wed',
	            title: '星期三',
	            formatter: function (value, row, index) {
                    if (value == 1){
                    	return '√';
                    } else {
                    	return '';	
                    }
                }
	        }, {
	            field: 'thu',
	            title: '星期四',
	            formatter: function (value, row, index) {
                    if (value == 1){
                    	return '√';
                    } else {
                    	return '';	
                    }
                }
	        }, {
	            field: 'fri',
	            title: '星期五',
	            formatter: function (value, row, index) {
                    if (value == 1){
                    	return '√';
                    } else {
                    	return '';	
                    }
                }
	        }, {
	            field: 'sat',
	            title: '星期六',
	            formatter: function (value, row, index) {
                    if (value == 1){
                    	return '√';
                    } else {
                    	return '';	
                    }
                }
	        }, {
	            field: 'sun',
	            title: '星期日',
	            formatter: function (value, row, index) {
                    if (value == 1){
                    	return '√';
                    } else {
                    	return '';	
                    }
                }
	        }, {
	            field: 'jph',
	            title: '参考JPH'
	        }, {
	            field: 'planNum',
	            title: '计划上线数'
	        }, {
	            field: 'actNum',
	            title: '计划下线数'
	        }, {
	            field: 'tmBasPlantId',
	            title: '工厂id'
	        }, {
	            field: 'plant_name',
	            title: '工厂'
	        }, {
	            field: 'tmBasWorkshopId',
	            title: '车间id'
	        }, {
	            field: 'workshop_name',
	            title: '车间'
	        }, {
	            field: 'enabled',
	            title: '启用',
	            formatter: function (value, row, index) {
                    if (value == 1){
                        return '<div class="bootstrap-switch bootstrap-switch-wrapper bootstrap-switch-on bootstrap-switch-small bootstrap-switch-animate" style="width: 90px;"><div class="bootstrap-switch-container" style="width: 132px; margin-left: 0px;"><span class="bootstrap-switch-handle-on bootstrap-switch-success" style="width: 44px;">启用</span><span class="bootstrap-switch-label" style="width: 44px;"></div></div>'
                    } else {
                        return '<div class="bootstrap-switch bootstrap-switch-wrapper bootstrap-switch-on bootstrap-switch-small bootstrap-switch-animate" style="width: 90px;"><div class="bootstrap-switch-container" style="width: 132px; margin-left: 0px;"><span class="bootstrap-switch-label" style="width: 44px;">&nbsp;</span><span class="bootstrap-switch-handle-off bootstrap-switch-danger" style="width: 44px;">禁用</span><span class="bootstrap-switch-label" style="width: 44px;"></div></div>'
                    }
                }
	        }
	    ]
    });
	$('#tb_worktimetpl').bootstrapTable('hideColumn', 'tmBasLineId');
    $('#tb_worktimetpl').bootstrapTable('hideColumn', 'tmBasStorageId');
    $('#tb_worktimetpl').bootstrapTable('hideColumn', 'tmBasEquipmentId');
    $('#tb_worktimetpl').bootstrapTable('hideColumn', 'tmBasPlantId');
    $('#tb_worktimetpl').bootstrapTable('hideColumn', 'tmBasWorkshopId');
}

function initTimetpl_Rest(){
	$('#tb_worktimetpl_rest').bootstrapTable({
	    url: apiUrl + "/worktime/workschedulerest/queryAll",         //请求后台的URL（*）
	    method: 'post',                      //请求方式（*）
	    toolbar: '#toolbarR',                //工具按钮用哪个容器
	    showExport: false,                     //是否显示导出
	    exportDataType: "all",              //basic', 'all', 'selected'.
	    striped: true,                      //是否显示行间隔色
	    cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
	    pagination: true,                   //是否显示分页（*）
	    dataField: "data",					//这是返回的json数组的key.默认好像是"rows".这里只有前后端约定好就行
	    sortable: true,                     //是否启用排序
	    sortOrder: "asc",                   //排序方式
	    queryParams:function queryParams(params) {   //设置查询参数
			var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
				pageSize: params.limit,   //页面大小
	            pageIndex : params.offset/params.limit+1, //当前页面,默认是上面设置的1(pageNumber)
	            tmBasWorkscheduleId :  currentRow == null ? 0 : currentRow.tmBasWorkscheduleId
	        };
	        return temp;
	    },
        sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
        pageNumber:1,                       //初始化加载第一页，默认第一页
        pageSize: 10,                       //每页的记录行数（*）
        pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
        search: true,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        strictSearch: true,
        showColumns: false,                  //是否显示所有的列
        showRefresh: false,                  //是否显示刷新按钮
        minimumCountColumns: 2,             //最少允许的列数
        clickToSelect: false,                //是否启用点击选中行
        height: 500,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "tmBasWorkscheduleRestId",        //每一行的唯一标识，一般为主键列
        showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                   //是否显示父子表
        responseHandler:function(res){
        	var errcode = res.code;//在此做了错误代码的判断
    	    if(errcode != 10000){
    	        layer.msg(res.message,{icon:2,time:1000});
    	        return;
    	    }
    	    //如果没有错误则返回数据，渲染表格
    	    return {
    	        total : res.count, //总页数,前面的key必须为"total"
    	        data : res.results //行数据，前面的key要与之前设置的dataField的值一致.
    	    };
        },
        columns: [{
        	checkbox: true
	        },{
	            field: 'restStartTime',
	            title: '休息开始时间'
	        }, {
	            field: 'restEndTime',
	            title: '休息结束时间'
	        }
	    ]
    });
}

function queryInfo(){
	$('#tb_worktimetpl').bootstrapTable("refresh");
	currentRow = null;
}

function initDropList(){
	getDictionary('WORKTIME_TYPE','search_type');
	getDictionary('WORKTIME_TYPE','type');
	getDictionary('SHIFT_NO','search_shiftno');
	getDictionary('SHIFT_NO','shiftno');
	
	$("#type").change(selectOnchang_type);
	$("#tmBasPlantId").change(selectOnchang_type);
	$("#tmBasWorkshopId").change(selectOnchang_type);
	
	dorpList('search_tmBasLineId',apiUrl + "/worktime/workschedule/selectLine",{namecn:null});
	dorpList('search_tmBasStorageId',apiUrl + "/worktime/workschedule/selectStorage",{namecn:null});
	dorpList('tmBasPlantId',apiUrl + "/worktime/workschedule/selectFlant",{namecn:null});
	dorpList('tmBasWorkshopId',apiUrl + "/worktime/workschedule/selectWorkshop",{namecn:null});
	dorpList('tmBasLineId',apiUrl + "/worktime/workschedule/selectLine",{namecn:null});
	dorpList('tmBasStorageId',apiUrl + "/worktime/workschedule/selectStorage",{namecn:null});
}

function selectOnchang_type(){
	var id=this.id;
	var val=$(this).children('option:selected').val();
	//工作时间类型 改变处理
	change_Type(id,val);
	
	if(id=="tmBasPlantId"){
		var where={"tmBasPlantId":val};
		dorpList('tmBasWorkshopId',apiUrl + "/worktime/workschedule/selectWorkshop",where);
		dorpList('tmBasLineId',apiUrl + "/worktime/workschedule/selectLine",where);
	}
	if(id=="tmBasWorkshopId"){
		var where={"tmBasWorkshopId":val};
		dorpList('tmBasLineId',apiUrl + "/worktime/workschedule/selectLine",where);
	}
}

function change_Type(id,val){
	if(id=="type"){
		if(!val){
			$(".class_plant").attr("disabled",true);
			$(".class_storage").attr("disabled",true);
			$(".class_equipment").attr("disabled",true);
		}
		if(val=="10"){
			$(".class_plant").attr("disabled",false);
			$(".class_storage").attr("disabled",true);
			$(".class_equipment").attr("disabled",true);
			clearControl('tmBasStorageId','tmBasEquipmentId');
		}
		if(val=="20"){
			$(".class_plant").attr("disabled",true);
			$(".class_storage").attr("disabled",false);
			$(".class_equipment").attr("disabled",true);
			clearControl('tmBasPlantId','tmBasWorkshopId','tmBasLineId','jph','planNum','actNum','tmBasEquipmentId');
		}
		if(val=="30"){
			$(".class_plant").attr("disabled",true);
			$(".class_storage").attr("disabled",true);
			$(".class_equipment").attr("disabled",false);
			clearControl('tmBasPlantId','tmBasWorkshopId','tmBasLineId','jph','planNum','actNum','tmBasStorageId');
		}
	}
}

$("#addModal").on("hidden.bs.modal", function() {
	var form = $("#formEdit");
	$(this).removeData("bs.modal");
	form[0].reset();
	form.data('bootstrapValidator').resetForm();  
	dorpList('tmBasPlantId',apiUrl + "/worktime/workschedule/selectFlant",{namecn:null});
	dorpList('tmBasWorkshopId',apiUrl + "/worktime/workschedule/selectWorkshop",{namecn:null});
	dorpList('tmBasLineId',apiUrl + "/worktime/workschedule/selectLine",{namecn:null});
	dorpList('tmBasStorageId',apiUrl + "/worktime/workschedule/selectStorage",{namecn:null});
});

$("#addModalRest").on("hidden.bs.modal", function() {
	var form = $("#formRestEdit");
	$(this).removeData("bs.modal");
	form[0].reset();
	form.data('bootstrapValidator').resetForm();  
});

//打开新增窗口
function openAddWin(){
	change_Type('type');
	mod_flag=0;
	$('#tpl_mod').html('<span class="dot"></span>新增');
	$('#enabled').val(1);
	if (!$("#enabled").bootstrapSwitch('state')) { 
        $("#enabled").bootstrapSwitch('toggleState');
    }
	$('#addModal').modal({backdrop: 'static',keyboard: false});
}

//打开新增窗口
function openAddRestWin(){
	if(currentRow==null){
		layer.msg("请先选择一条数据！",{icon:7,time:1000});
		return;
	}
	$('#tpl_no').val(currentRow.no);
	mod_flag=0;
	$('#tpl_rest_mod').html('<span class="dot"></span>新增');
	$('#addModalRest').modal({backdrop: 'static',keyboard: false});
}

//打开编辑窗口
function openEditWin () {
	var rows = $("#tb_worktimetpl").bootstrapTable("getSelections");
    if (rows.length < 1) {
    	layer.msg("没有选择的数据！",{icon:7,time:1000});
        return;
    }
    if (rows.length > 1) {
    	layer.msg("只能选择一条数据编辑！",{icon:7,time:1000});
        return;
    }
    mod_flag=1;
    $('#tpl_mod').html('<span class="dot"></span>编辑');
    if (rows[0].enabled=="1"){
    	$('#enabled').val(1);
    	if (!$("#enabled").bootstrapSwitch('state')) { 
            $("#enabled").bootstrapSwitch('toggleState');
        }
	} else {
		$('#enabled').val(0);
		if ($("#enabled").bootstrapSwitch('state')) { 
            $("#enabled").bootstrapSwitch('toggleState'); 
        }
	}
    setFormValueChk($("#formEdit"),rows[0]);
	change_Type('type',rows[0].type);
	dorpList('tmBasWorkshopId',apiUrl + "/worktime/workschedule/selectWorkshop",{"tmBasPlantId":$("#tmBasPlantId").val()},'id','name',rows[0].tmBasWorkshopId);
	dorpList('tmBasLineId',apiUrl + "/worktime/workschedule/selectLine",{"tmBasWorkshopId":$("#tmBasWorkshopId").val()},'id','name',rows[0].tmBasLineId);
	$('#addModal').modal({backdrop: 'static',keyboard: false});
}

//打开编辑窗口
function openEditRestWin () {
	var rows = $("#tb_worktimetpl_rest").bootstrapTable("getSelections");
    if (rows.length < 1) {
    	layer.msg("没有选择的数据！",{icon:7,time:1000});
        return;
    }
    if (rows.length > 1) {
    	layer.msg("只能选择一条数据编辑！",{icon:7,time:1000});
        return;
    }
    mod_flag=1;
    $('#tpl_rest_mod').html('<span class="dot"></span>编辑');
    $('#tpl_no').val(currentRow.no);
    setFormValueChk($("#addModalRest"),rows[0]);
	$('#addModalRest').modal({backdrop: 'static',keyboard: false});
}

//保存日历
function saveInfo(){
	$('#formEdit').data('bootstrapValidator').validate();  
    if(!$('#formEdit').data('bootstrapValidator').isValid()){  
        return;  
    }
	var data=$('#formEdit').serializeObject();
	if(data.type=="10"){
		if(!data.tmBasPlantId){layer.msg('请选择工厂!',{icon:7,time:1000}); return;}
		if(!data.tmBasWorkshopId){layer.msg('请选择车间!',{icon:7,time:1000}); return;}
		if(!data.tmBasLineId){layer.msg('请选择产线!',{icon:7,time:1000}); return;}
		clearObjAttr(data,'tmBasStorageId','tmBasEquipmentId');
	}
	if(data.type=="20"){
		if(!data.tmBasStorageId){layer.msg('请选择仓库!',{icon:7,time:1000}); return;}
		clearObjAttr(data,'tmBasPlantId','tmBasWorkshopId','tmBasLineId','jph','planNum','actNum','tmBasEquipmentId');
	}
	if(data.type=="30"){
		if(!data.tmBasEquipmentId){layer.msg('请选择设备!',{icon:7,time:1000}); return;}
		clearObjAttr(data,'tmBasPlantId','tmBasWorkshopId','tmBasLineId','jph','planNum','actNum','tmBasStorageId');
	}
	if(data.jph < 0){layer.msg('参考JPH不能为负数!',{icon:7,time:1000}); return;}
	if(data.planNum < 0){layer.msg('计划上线数不能为负数!',{icon:7,time:1000}); return;}
	if(data.actNum < 0){layer.msg('计划下线数不能为负数!',{icon:7,time:1000}); return;}
	if(data.shiftno=='1'){
		if(!diff_time(data.startTime,data.endTime,'开始时间不能大于结束时间!')){
			return;
		}
	}
	data=JSON.stringify(data);
	if (mod_flag == 0){
		url = apiUrl + "/worktime/workschedule/add";
	} else {
		url = apiUrl + "/worktime/workschedule/update";
	}
	
	$.ajax({
        type: 'POST',
        url: url,
        data: data,
        dataType: 'json',
        contentType: "application/json",
        success: function (data, textStatus, jqXHR) {
        	var errcode = data.code;//在此做了错误代码的判断
    	    if(errcode != 10000){
    	    	layer.msg(data.message,{icon:2,time:1000});
    	        return;
    	    }
        	$('#addModal').modal('hide');
        	$('#tb_worktimetpl').bootstrapTable("refresh");
            layer.msg('保存成功!',{icon:1,time:1000});
        }
    });
}

//保存日历修改时间
function saveRestInfo(){
	$('#formRestEdit').data('bootstrapValidator').validate();  
    if(!$('#formRestEdit').data('bootstrapValidator').isValid()){  
        return;  
    }
	var data=$('#formRestEdit').serializeObject();
	if(!diff_time(data.restStartTime,data.restEndTime,'休息开始时间不能大于休息结束时间!')){
		return;
	}
	if(!diff_time(currentRow.startTime,data.restStartTime,'休息开始时间不能小于工作开始时间!')){
		return;
	}
	if(!diff_time(data.restStartTime,currentRow.endTime,'休息开始时间不能大于工作结束时间!')){
		return;
	}
	if(!diff_time(currentRow.startTime,data.restEndTime,'休息结束时间不能小于工作开始时间!')){
		return;
	}
	if(!diff_time(data.restEndTime,currentRow.endTime,'休息结束时间不能大于工作结束时间!')){
		return;
	}
	data["tmBasWorkscheduleId"]=currentRow.tmBasWorkscheduleId;
	data=JSON.stringify(data);
	if (mod_flag == 0){
		url = apiUrl + "/worktime/workschedulerest/add";
	} else {
		url = apiUrl + "/worktime/workschedulerest/update";
	}
	
	$.ajax({
        type: 'POST',
        url: url,
        data: data,
        dataType: 'json',
        contentType: "application/json",
        success: function (data, textStatus, jqXHR) {
        	var errcode = data.code;//在此做了错误代码的判断
    	    if(errcode != 10000){
    	    	layer.msg(data.message,{icon:7,time:1000});
    	        return;
    	    }
        	$("#addModalRest").on("hidden.bs.modal", function() {
        		$(this).removeData("bs.modal");
        		clearForm($('#addModalRest'));
        	});
        	$('#addModalRest').modal('hide');
        	$('#tb_worktimetpl_rest').bootstrapTable("refresh");
            layer.msg('保存成功!',{icon:1,time:1000});
        }
    });
}

//删除日历
function deleteInfo(){
	var rows = $("#tb_worktimetpl").bootstrapTable("getSelections");
    if (rows.length < 1) {
    	layer.msg("没有选择的数据！",{icon:7,time:1000});
        return;
    }
	layer.confirm('删除数据不可恢复，确定删除吗？',{icon: 3, title:'信息提示'},function(index){
		var rowid = [];
        $.each(rows, function (index, row) {
        	rowid.push(row.tmBasWorkscheduleId);
        });
        data={tmBasWorkscheduleId:rowid}
        $.ajax({
            type: "POST",
            url: apiUrl + "/worktime/workschedule/delete",
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json",
            success: function (data) {
            	var errcode = data.code;//在此做了错误代码的判断
        	    if(errcode != 10000){
        	    	alert("错误消息: " + data.message);
        	        return;
        	    }
        	    currentRow=null;
        	    $("#tb_worktimetpl").bootstrapTable("refresh");
                $("#tb_worktimetpl").bootstrapTable("refreshOptions",{pageNumber:1});
                $("#tb_worktimetpl_rest").bootstrapTable("refresh");
                $("#tb_worktimetpl_rest").bootstrapTable("refreshOptions",{pageNumber:1});
                layer.msg('删除成功!',{icon:1,time:1000});
            }
        });
    });
}

//删除日历修改时间
function deleteRestInfo(){
	var rows = $("#tb_worktimetpl_rest").bootstrapTable("getSelections");
    if (rows.length < 1) {
    	layer.msg("没有选择的数据！",{icon:7,time:1000});
        return;
    }
	layer.confirm('删除数据不可恢复，确定删除吗？',{icon: 3, title:'信息提示'},function(index){
		var rowid = [];
        $.each(rows, function (index, row) {
        	rowid.push(row.tmBasWorkscheduleRestId);
        });
        data={tmBasWorkscheduleRestId:rowid}
        $.ajax({
            type: "POST",
            url: apiUrl + "/worktime/workschedulerest/delete",
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json",
            success: function (data) {
            	var errcode = data.code;//在此做了错误代码的判断
        	    if(errcode != 10000){
        	    	alert("错误消息: " + data.message);
        	        return;
        	    }
        	    $("#tb_worktimetpl_rest").bootstrapTable("refresh");
        	    $("#tb_worktimetpl_rest").bootstrapTable("refreshOptions",{pageNumber:1});
                layer.msg('删除成功!',{icon:1,time:1000});
            }
        });
    });
	
	
}
function creWork(){

	var rows = $("#tb_worktimetpl").bootstrapTable("getSelections");
    if (rows.length < 1) {
    	layer.msg("没有选择的数据！",{icon:7,time:1000});
        return;
    }
		var rowid = new Array();
//        $.each(rows, function (index, row) {
//        	rowid.push(row.tmBasWorkscheduleId);
//        });
        for (var i=0;i<rows.length;i++) {
        	rowid[i] = rows[i].tmBasWorkscheduleId;
        }
        $.ajax({
            type: "POST",
            url: apiUrl + "/worktime/workschedule/createWorkingTemplate",
            data: JSON.stringify(rowid),
            dataType: "json",
            contentType: "application/json",
            success: function (data) {
            	var errcode = data.code;//在此做了错误代码的判断
        	    if(errcode != 10000){
        	    	alert("错误消息: " + data.message);
        	        return;
        	    }
        	 
               
            }
        });
   
}