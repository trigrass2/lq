

$(function(){
	//搜索条件
	var mainSearchData=[{
		idName:'combo51',
		text:'工作时间类型',
		field:'type',
		comboUrl:'/system/codeList/getSelect',
		comboId:'no',
		comboText:'name',
		comboData:'WORKTIME_TYPE'
	},{
		idName:'combo52',
		text:'班次',
		field:'shiftno',
		comboUrl:'/system/codeList/getSelect',
		comboData:'SHIFT_NO',
		comboId:'no',
		comboText:'name'
	},{
		idName:'combo53',
		text:'产线',
		comboUrl:'/base/line/publicLineSelect',
		comboId:'tmBasLineId',
		comboText:'line',
		field:'tmBasLineId'
	},{
		idName:'combo54',
		text:'仓库',
		comboUrl:'/worktime/workschedule/selectStorage',
		comboId:'id',
		comboText:'name',
		field:'tmBasStorageId',
		comboData:JSON.stringify({namecn:null})
	},{
		idName:'combo55',
		text:'设备  ',
		field:'tmBasEquipmentId',
		comboData:[{
			id:1,
			text:'设备一'
		},{
			id:2,
			text:'设备二'
		},{
			id:3,
			text:'设备三'
		}]
	},{
		idName:'day56',
		field:'workdate_from',
		text:'日期从'
	},{
		idName:'day57',
		field:'workdate_to',
		text:'日期到'
	}];
	//搜索11


	Ew.search('.demoSearch',{
		title:'查询',
		listWidth:'270px',
		textValues:mainSearchData,
		btnValues:[{
			btnId:'search',
			text:'搜索',
			onClick:function(data){
				$('#tableWorkTime').bootstrapTable('refresh');
				$('#tableWorkTime').bootstrapTable('refreshOptions',{pageNumber:1});
				$('#tableWorkTime').bootstrapTable('removeAll');
			}
		},{
			btnId:'btnClear',
			text:'重置',
			tableid:['tableWorkTime','tableWorkTimeSub']
		}]
	});


	//主表格
	Ew.table('.demoTable',{
		btnValues:[{
			btnId:'btnAdd',text:'新增',onClick:function(){
				daliogShow('add')
			}
		},{
			btnId:'btnEdit',text:'编辑',otherOption:[{id:'tableWorkTime',selectNum: 1}],onClick:function(){
				daliogShow('change')
			}
		},{
			btnId:'btnDelete',text:'删除',isTrue:true,otherOption:[{id:'tableWorkTime',selMinNum: 1}],onClick:function(){
				var rows = $('#tableWorkTime').bootstrapTable('getSelections');
				var ids = [];
				$.each(rows,function(index,row){
					ids.push(row.tmBasWorktimeId);
				});
				datas = JSON.stringify({tmBasWorktimeId:ids});
				var url = '/worktime/worktime/delete';
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#tableWorkTime').bootstrapTable('refresh');
					$('#tableWorkTime').bootstrapTable('refreshOptions',{pageNumber:1});
	            });
			}
		},{
			btnId:'btnDowload',text:'模板下载',isTrue:true,selMinNum:1,onClick:function(){

			}
		},{
			btnId:'btnImport',text:'导入',isTrue:true,selMinNum:1,onClick:function(){

			}
		},{
			btnId:'btnExport',text:'导出',isTrue:true,selMinNum:1,onClick:function(){

			}
		},{
          btnId: 'btnAddSub', otherBtn:true, otherOption:[{id:'tableWorkTime',selectNum: 1}] //控制子表按钮是否 可用
        },{
          btnId: 'btnEditSub', otherBtn:true,otherOption:[{id:'tableWorkTime',selectNum: 1},{id:'tableWorkTimeSub',selectNum: 1}] //控制子表按钮是否 可用
        }],
		tableId:'tableWorkTime',
		tableValue:{
			searchParams:mainSearchData,
			queryParams:function(){
				return{}
			},
			onClickRow:function(item,$element){
				$('#tableWorkTimeSub').bootstrapTable('refresh',{query:{tmBasWorktimeId:item.tmBasWorktimeId}});//或者{query:{}}直接设置查询条件
			},
			onLoadSuccess:function(){
				
	        },
			url:'/worktime/worktime/query',
			columns:[{
				checkbox:true
			},{
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
                },
				align:'center',
				sortable:true,
				width:'120px'
			},/*{
				field:'tmBasLineId',
				title:'产线id',
				align:'center',
				sortable:true,
				width:'120px'
			},*/{
				field:'line_name',
				title:'产线',
				align:'center',
				sortable:true,
				width:'120px'
			},/*{
				field:'tmBasStorageId',
				title:'仓库id',
				align:'center',
				sortable:true,
				width:'120px'
			},*/{
				field:'storage_name',
				title:'仓库',
				align:'center',
				sortable:true,
				width:'150px'
			},{
				field: 'equipment_name',
	            title: '设备',
				align:'center',
				sortable:true,
				width:'120px',
				formatter: function (value, row, index) {
                    if (value == 1){
                    	return '设备一';
                    } else if (value == 2){
                    	return '设备二';	
                    } else if(value ==3){
                    	return '设备三'
                    }else{
                    	return ''
                    }
                }
			},{
				field: 'shiftno',
	            title: '班次',
				align:'center',
				sortable:true,
				width:'120px',
				formatter: function (value, row, index) {
                    if (value == "1"){
                    	return '早班';
                    }else if (value == "2"){
                    	return '中班';
                    }else if (value == "3"){
                    	return '晚班';	
                    }
                }
			},{
				field:'workdate',
				title:'工作日期',
				align:'center',
				sortable:true,
				width:'120px'
			},{
				field:'startTime',
				title:'开始时间',
				align:'center',
				sortable:true,
				width:'120px'
			},{
				field:'endTime',
				title:'结束时间',
				align:'center',
				sortable:true,
				width:'120px'
			},{
				field:'week',
				title:'星期',
				align:'center',
				width:'120px'
			},/*{
				field:'workdate',
				title:'工作日期',
				align:'center',
				width:'120px'
			},*/{
				field:'jph',
				title:'参考JPH',
				align:'center',
				width:'120px'
			},{
				field: 'planNum',
	            title: '计划上线数',
				align:'center',
				width:'120px'
			},{
				field: 'actNum',
	            title: '计划下线数',
				align:'center',
				width:'120px'
			},/*{
				field: 'tmBasPlantId',
	            title: '工厂id',
				align:'center',
				width:'120px'
			},*/{
				field: 'plant_name',
	            title: '工厂',
				align:'center',
				width:'120px'
			},/*{
				field: 'tmBasWorkshopId',
	            title: '车间id',
				align:'center',
				width:'120px'
			},*/{
				field: 'workshop_name',
	            title: '车间',
				align:'center',
				width:'120px'
			}]
		}
	});
	//子表格
	Ew.table('.demoTable2',{
		btnValues:[{
			btnId:'btnAddSub',text:'新增',otherOption:[{id:'tableWorkTime',selectNum: 1}],onClick:function(){
				daliogShow2('add')
			}
		},{
			btnId:'btnEditSub',text:'编辑',otherOption:[{id:'tableWorkTime',selectNum: 1},{id:'tableWorkTimeSub',selectNum: 1}],selectNum:1,onClick:function(){
				daliogShow2('change')
			}
		},{
			btnId:'btnDeleteSub',text:'删除',isTrue:true,otherOption:[{id:'tableWorkTimeSub',selMinNum: 1}],onClick:function(){
				var rows = $('#tableWorkTimeSub').bootstrapTable('getSelections');
				var ids = [];
				$.each(rows,function(index,row){
					ids.push(row.tmBasWorktimeRestId);
				});
				datas = JSON.stringify({tmBasWorktimeRestId:ids});
				var url = '/worktime/worktimerest/delete';
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#tableWorkTimeSub').bootstrapTable('refreshOptions',{pageNumber:1});
					$('#tableWorkTimeSub').bootstrapTable('refresh');
	            });
			}
		}],
		tableId:'tableWorkTimeSub',
		tableValue:{
			queryParams:function(){
				return {tmBasWorktimeId:$('#tableWorkTime').bootstrapTable('getSelections')[0]?$('#tableWorkTime').bootstrapTable('getSelections')[0].tmBasWorktimeId:-1};
			},
			onClickRow:function(item,$element){

			},
			url:'/worktime/worktimerest/queryAll',
			columns:[{
				checkbox:true
			},{
				field: 'restStartTime',
	            title: '休息开始时间',
				align:'center',
				sortable:true
			},{
				field: 'restEndTime',
	            title: '休息结束时间',
				align:'center',
				sortable:true
			}]
		}
	});
})


function daliogShow(type){
	var title=type=='add'?'新增':'编辑';
	var defaultTable=type=='add'?'':'tableWorkTime';
	Ew.dialog('demoadd',{
		title:title,
		btnValues:[{
			btnId:'btnSave',
			text:'保存',
			formid:'demoform',
			onClick:function(data){
				if(type=='change') data.tmBasWorktimeId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tmBasWorktimeId;
				datas = JSON.stringify(data);
				var url = (type=='add'?'/worktime/worktime/add':'/worktime/worktime/update');
				$.when(Ew.ewAjax(url,datas)).done(function(results){
						$('#demoadd').modal('hide');
						$('#tableWorkTime').bootstrapTable('refresh');
					
	             });
			}
		},{
			btnId:'btnCancel',
			text:'取消'
		}],
		form:{
			formId:'demoform',
			columnNum:2,
			listWidth:350,
			formList:[{
				idName:'combo10',
				text:'工作时间类型',
				field:'type',
				valid:['notEmpty'],
				disabled:type=='add'?false:true,
				comboUrl:'/system/codeList/getSelect',
				comboId:'no',
				comboText:'name',
				comboData:'WORKTIME_TYPE',
				onClick:function(data){
					var type = data.id;
					checkDis(type);
				}
			},{
				idName:'combo11',
				text:'工厂',
				comboUrl:'/base/plant/publicPlantSelect',
				comboId:'tmBasPlantId',
				comboText:'plant',
				field:'tmBasPlantId',
				disabled:type=='add'?false:true,
				comboData:type=='add'?JSON.stringify({
					enabled:1
				}):{},
				onClick:function(data){
					Ew.selectLink({
				        comboUrl:'/base/workshop/publicWorkshopSelect',
				        comboData:JSON.stringify({tmBasPlantId:data.id,enabled:1}),
				        id:['combo12','combo13'],
				        comboId:'tmBasWorkshopId',
				        comboText:'workshop'
				    });
				}
			},{
				idName:'combo12',
				text:'车间',
				comboUrl:'/base/workshop/publicWorkshopSelect',
				comboId:'tmBasWorkshopId',
				comboText:'workshop',
				field:'tmBasWorkshopId',
				disabled:type=='add'?false:true,
				comboData:type=='add'?JSON.stringify({
					enabled:1
				}):{},
				onClick:function(data){
					Ew.selectLink({
				        comboUrl:'/base/line/publicLineSelect',
				        comboData:JSON.stringify({tmBasWorkshopId:data.id,enabled:1}),
				        id:['combo13'],
				        comboId:'tmBasLineId',
				        comboText:'line'
				    });
				}
			},{
				idName:'combo13',
				text:'产线',
				comboUrl:'/base/line/publicLineSelect',
				comboId:'tmBasLineId',
				comboText:'line',
				field:'tmBasLineId',
				disabled:type=='add'?false:true,
				comboData:type=='add'?JSON.stringify({
					enabled:1
				}):{},
			},{
				idName:'number14',
				text:'参考JPH',
				field:'jph'
//				disabled:type=='add'?false:true,
			},{
				idName:'number15',
				text:'计划上线数',
				field:'planNum',
			},{
				idName:'number16',
				text:'计划下线数',
				field:'actNum',
			},{
				idName:'combo17',
				text:'仓库',
				field:'tmBasStorageId',
				comboUrl:'/worktime/workschedule/selectStorage',
				comboId:'id',
				comboText:'name',
				disabled:type=='add'?false:true,
				comboData:JSON.stringify({namecn:null})
			},{
				idName:'combo18',
				text:'设备',
				field:'tmBasEquipmentId',
				disabled:type=='add'?false:true,
				comboData:[{
					id:1,
					text:'设备一'
				},{
					id:2,
					text:'设备二'
				},{
					id:3,
					text:'设备三'
				}]
			},{
				idName:'combo19',
				text:'班次',
				field:'shiftno',
				valid:['notEmpty'],
//				disabled:type=='add'?false:true,
				comboUrl:'/system/codeList/getSelect',
				comboData:'SHIFT_NO',
				comboId:'no',
				comboText:'name'
			},{
				idName:'day111',
				text:'日期',
				field:'workdate',
				valid:['notEmpty'],
				onClick:function(data){
					var week=DayToWeek(data);
					$('#text112').val(week);
				}
			},{
				idName:'text112',
				text:'星期:',
				field:'week',
				disabled:true
			},{
				idName:'day113',
				text:'开始时间',
				valid:['notEmpty'],
				field:'startTime',
				format:'fulldate',limit:{date:'day114',type:'setStartDate'}
			},
	        {idName:'text311',text:'版本号',field:'version',hidden:true},

			{
				idName:'day114',
				text:'结束时间',
				valid:['notEmpty'],
				field:'endTime',
				format:'fulldate',limit:{date:'day113',type:'setEndDate'}
			}],
			defaultTable:defaultTable
		}
	})
if (type =='change') {
	var types =  $('#'+defaultTable).bootstrapTable('getSelections')[0].type;
	 checkDis(types);
	}
}


//子表格
function daliogShow2(type){
	var title=type=='add'?'新增':'编辑';
	var defaultTable=type=='add'?'':'tableWorkTimeSub';
	Ew.dialog('demoadd',{
		title:title,
		btnValues:[{
			btnId:'btnSaveSub',
			text:'保存',
			formid:'demoform2',
			onClick:function(data){
				if (checkTime()==true){
			
				data.tmBasWorktimeId = $('#tableWorkTime').bootstrapTable('getSelections')[0].tmBasWorktimeId ;
				if(type=='change') data.tmBasWorktimeRestId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tmBasWorktimeRestId;
				datas = JSON.stringify(data);
				var url = (type=='add'?'/worktime/worktimerest/add':'/worktime/worktimerest/update');
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#demoadd').modal('hide');
					$('#tableWorkTimeSub').bootstrapTable('refreshOptions',{pageNumber:1});

					$('#tableWorkTimeSub').bootstrapTable('refresh');
	             });
			}
			}
		},{
			btnId:'btnCancelSub',
			text:'取消'
		}],
		form:{
			formId:'demoform2',
			columnNum:2,
			listWidth:280,
			formList:[{
				idName:'day21',
				text:'工作开始时间',
				field:'start_time',
				defaultValue:$('#tableWorkTime').bootstrapTable('getSelections')[0].startTime,
				format:'fulldate',
				disabled:true,
			},{
				idName:'day22',
				text:'工作结束时间',
				field:'end_time',
				defaultValue:$('#tableWorkTime').bootstrapTable('getSelections')[0].endTime,
				format:'fulldate',
				disabled:true,
			},{
				idName:'day23',
				text:'休息开始时间',
				field:'restStartTime',
				valid:['notEmpty'],
				format:'fulldate'
			},
	        {idName:'text311',text:'版本号',field:'version',hidden:true},

			{
				idName:'day24',
				text:'休息结束时间',
				field:'restEndTime',
				valid:['notEmpty'],
				format:'fulldate'
			}],
			defaultTable:defaultTable
		}
	})
}


function  checkTime(){
	var restStartTime =  $('#day23').val();
	var restEndTime =  $('#day24').val();
	var time1 =   $('#tableWorkTime').bootstrapTable('getSelections')[0].startTime ;
	var time2 =   $('#tableWorkTime').bootstrapTable('getSelections')[0].endTime ;
	if (!checkDifTime(restStartTime,restEndTime)){
		layer.msg('休息开始时间不能大于或等于休息结束时间',{icon:7,time:1000});
		return false;
	}
	if (!checkDifTime(time1,restStartTime)){
		layer.msg('休息开始时间不能小于或等于工作开始时间',{icon:7,time:1000});
		return false;
	}
	if (!checkDifTime(restStartTime,time2)){
		layer.msg('休息开始时间不能大于或等于工作结束时间',{icon:7,time:1000});
		return false;
	}
	if (!checkDifTime(time1,restEndTime)){
		layer.msg('休息结束时间不能小于或等于工作开始时间',{icon:7,time:1000});
		return false;
	}
	
	if (!checkDifTime(restEndTime,time2)){
		layer.msg('休息结束时间不能大于工作结束时间',{icon:7,time:1000});
		return false;
	}
	else{
		
		return true;
	}
}
function checkDifTime(time1,time2){
	
	var start=new Date(time1.replace("-", "/").replace("-", "/"));
	
	var end=new Date(time2.replace("-", "/").replace("-", "/"));
	if(end<=start){
	return false;
	}
	return true;
	}

function checkDis(type){
	if (type == 10) {
		$("#combo17").prop("disabled",'disabled');
		$("#combo18").prop("disabled",'disabled');
		$("#combo17").val('');
		$("#combo18").val('');
		
		$("#combo11").removeAttr("disabled");
		$("#combo12").removeAttr("disabled");
		$("#combo13").removeAttr("disabled");
		$("#number14").removeAttr("disabled");
		$("#number15").removeAttr("disabled");
		$("#number16").removeAttr("disabled");
		
	} else if (type == 20){
		$("#combo11,#combo12,#combo13,#combo18").select2('val',['']);

		$("#combo11").prop("disabled",'disabled');
		$("#combo12").prop("disabled",'disabled');
		$("#combo13").prop("disabled",'disabled');
		$("#number14").prop("disabled",'disabled');
		$("#number15").prop("disabled",'disabled');
		$("#number16").prop("disabled",'disabled');
		$("#combo18").prop("disabled",'disabled');

		$("#number14,#number15,#number16").val("");
		$("#combo17").removeAttr("disabled");  
	
	}else if (type == 30) {
		$("#combo18").removeAttr("disabled");
		$("#combo11,#combo12,#combo13,#combo17").select2('val',['']);
		$("#combo11").prop("disabled",'disabled');
		$("#combo12").prop("disabled",'disabled');
		$("#combo13").prop("disabled",'disabled');
		$("#combo17").prop("disabled",'disabled');
		$("#number14").prop("disabled",'disabled');
		$("#number15").prop("disabled",'disabled');
		$("#number16").prop("disabled",'disabled');
		
		$("#number14,#number15,#number16").val("");

	}
}






//时间比较
function diff_time(start, end ,msg) {
  var arr_start = start.split(":");
  var arr_end = end.split(":");
  if(start==end){
  	layer.msg(msg,{icon:7,time:1000});
  	return false;
  }
  if(parseInt(arr_start[0])>parseInt(arr_end[0])){
  	layer.msg(msg,{icon:7,time:1000});
  	return false;
  }
  if(parseInt(arr_start[0])==parseInt(arr_end[0])){
  	if(parseInt(arr_start[1])>parseInt(arr_end[1])){
  		layer.msg(msg,{icon:7,time:1000});
      	return false;
      }
  }
  return true;
}
































/*

var mod_flag=0;
var tmp_row=null;

$(function () {
	
	initDropList();
	
	$(".pickerdate").datetimepicker({
		format: "yyyy-mm-dd",//时间格式显示年月日
        autoclose: true,
        todayBtn: true,
        pickerPosition: "bottom-left",
        minView: "month", //选择日期后，不会再跳转去选择时分秒
        language: "zh-CN"
	});
	
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
	
	$('#workdate').datetimepicker().on('changeDate', function(){
		var week=DayToWeek($('#workdate').val());
		$('#week').val(week);
	});
	 
    //1.初始化Table
	initTimetpl();
	initTimetpl_Rest();
	
	layui.use(['layer'], function(){
		layer = layui.layer;//弹出层
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
	$('#tb_worktime').bootstrapTable({
	    url: apiUrl + "/worktime/worktime/query",         //请求后台的URL（*）
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
	            workdate_from : $("#search_work_date_from").val() == '' ? null : $("#search_work_date_from").val() ,
	            workdate_to : $("#search_work_date_to").val() == '' ? null : $("#search_work_date_to").val()
	        };
	        return temp;
	    },
	    onClickRow: function (row) {
	    	tmp_row=row;
        	$('#tb_worktime_rest').bootstrapTable("refresh");
        	$('#tb_worktime_rest').bootstrapTable("refreshOptions",{pageNumber:1});
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
        clickToSelect: true,                //是否启用点击选中行
        height: 400,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "tmBasWorktimeId",        //每一行的唯一标识，一般为主键列
        showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                   //是否显示父子表
        responseHandler:function(res){
        	var errcode = res.code;//在此做了错误代码的判断
    	    if(errcode != 10000){
    	        layer.msg(res.message);
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
	        }, {
	            class: 'bootstrap-table-col-class',
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
	        	class: 'bootstrap-table-col-class',
	        	field: 'tmBasLineId',
	            title: '产线id'
	        }, {
	        	class: 'bootstrap-table-col-class',
	        	field: 'line_name',
	            title: '产线'
	        }, {
	        	class: 'bootstrap-table-col-class',
	        	field: 'tmBasStorageId',
	            title: '仓库id'
	        }, {
	        	class: 'bootstrap-table-col-class',
	        	field: 'storage_name',
	            title: '仓库'
	        }, {
	        	class: 'bootstrap-table-col-class',
	        	field: 'tmBasEquipmentId',
	            title: '设备id'	
	        }, {
	        	class: 'bootstrap-table-col-class',
	        	field: 'equipment_name',
	            title: '设备'
	        }, {
	        	class: 'bootstrap-table-col-class',
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
	        	class: 'bootstrap-table-col-class',
	        	field: 'startTime',
	            title: '开始时间'
	        }, {
	        	class: 'bootstrap-table-col-class',
	        	field: 'endTime',
	            title: '结束时间'
	        }, {
	        	class: 'bootstrap-table-col-class',
	        	field: 'week',
	            title: '星期'
	        }, {
	        	class: 'bootstrap-table-col-class',
	        	field: 'workdate',
	            title: '工作日期'
	        }, {
	        	class: 'bootstrap-table-col-class',
	        	field: 'jph',
	            title: '参考JPH'
	        }, {
	        	class: 'bootstrap-table-col-class',
	        	field: 'planNum',
	            title: '计划上线数'
	        }, {
	        	class: 'bootstrap-table-col-class',
	        	field: 'actNum',
	            title: '计划下线数'
	        }, {
	        	class: 'bootstrap-table-col-class',
	        	field: 'tmBasPlantId',
	            title: '工厂id'
	        }, {
	        	class: 'bootstrap-table-col-class',
	        	field: 'plant_name',
	            title: '工厂'
	        }, {
	        	class: 'bootstrap-table-col-class',
	        	field: 'tmBasWorkshopId',
	            title: '车间id'
	        }, {
	        	class: 'bootstrap-table-col-class',
	        	field: 'workshop_name',
	            title: '车间'
	        }
	    ]
    });
	$('#tb_worktime').bootstrapTable('hideColumn', 'tmBasLineId');
    $('#tb_worktime').bootstrapTable('hideColumn', 'tmBasStorageId');
    $('#tb_worktime').bootstrapTable('hideColumn', 'tmBasEquipmentId');
    $('#tb_worktime').bootstrapTable('hideColumn', 'tmBasPlantId');
    $('#tb_worktime').bootstrapTable('hideColumn', 'tmBasWorkshopId');
    $('#tb_worktime').bootstrapTable('hideColumn', 'workdate');
}

function initTimetpl_Rest(){
	$('#tb_worktime_rest').bootstrapTable({
	    url: apiUrl + "/worktime/worktimerest/queryAll",         //请求后台的URL（*）
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
	            tmBasWorktimeId :  tmp_row == null ? 0 : tmp_row.tmBasWorktimeId 
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
        clickToSelect: true,                //是否启用点击选中行
        height: 400,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "tmBasWorktimeRestId",        //每一行的唯一标识，一般为主键列
        showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                   //是否显示父子表
        responseHandler:function(res){
        	var errcode = res.code;//在此做了错误代码的判断
    	    if(errcode != 10000){
    	        layer.msg(res.message);
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
	$('#tb_worktime').bootstrapTable("refresh");
	tmp_row=null;
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
	$('#addModal').modal({backdrop: 'static',keyboard: false});
}

//打开新增窗口
function openAddRestWin(){
	if(tmp_row==null){
		layer.msg("请先选择一条数据！");
		return;
	}
	if(tmp_row.type=='10'){
		$('#tmp_input').html("产线");
		$('#tpl_no').val(tmp_row.line_name);
	}
	if(tmp_row.type=='20'){
		$('#tmp_input').html("仓库");
		$('#tpl_no').val(tmp_row.storage_name);
	}
	if(tmp_row.type=='30'){
		$('#tmp_input').html("设备");
		$('#tpl_no').val(tmp_row.equipment_name);
	}
	$('#startTime_disp').val(tmp_row.start_time);
	$('#endTime_disp').val(tmp_row.end_time);
	mod_flag=0;
	$('#tpl_rest_mod').html('<span class="dot"></span>新增');
	$('#addModalRest').modal({backdrop: 'static',keyboard: false});
}

//打开编辑窗口
function openEditWin () {
	var rows = $("#tb_worktime").bootstrapTable("getSelections");
    if (rows.length < 1) {
    	layer.msg("没有选择的数据！");
        return;
    }
    if (rows.length > 1) {
    	layer.msg("只能选择一条数据编辑！");
        return;
    }
    mod_flag=1;
    $('#tpl_mod').html('<span class="dot"></span>编辑');
    setFormValueChk($("#formEdit"),rows[0]);
	change_Type('type',rows[0].type);
	dorpList('tmBasWorkshopId',apiUrl + "/worktime/workschedule/selectWorkshop",{"tmBasPlantId":$("#tmBasPlantId").val()},'id','name',rows[0].tmBasWorkshopId);
	dorpList('tmBasLineId',apiUrl + "/worktime/workschedule/selectLine",{"tmBasWorkshopId":$("#tmBasWorkshopId").val()},'id','name',rows[0].tmBasLineId);
	$('#addModal').modal({backdrop: 'static',keyboard: false});
}

//打开编辑窗口
function openEditRestWin () {
	var rows = $("#tb_worktime_rest").bootstrapTable("getSelections");
    if (rows.length < 1) {
    	layer.msg("没有选择的数据！");
        return;
    }
    if (rows.length > 1) {
    	layer.msg("只能选择一条数据编辑！");
        return;
    }
    mod_flag=1;
    $('#tpl_rest_mod').html('<span class="dot"></span>编辑');
    if(tmp_row.type=='10'){
		$('#tmp_input').html("产线");
		$('#tpl_no').val(tmp_row.line_name);
	}
	if(tmp_row.type=='20'){
		$('#tmp_input').html("仓库");
		$('#tpl_no').val(tmp_row.storage_name);
	}
	if(tmp_row.type=='30'){
		$('#tmp_input').html("设备");
		$('#tpl_no').val(tmp_row.equipment_name);
	}
	$('#startTime_disp').val(tmp_row.startTime);
	$('#endTime_disp').val(tmp_row.endTime);
	setFormValueChk($("#addModalRest"),rows[0]);
	$('#addModalRest').modal("show");
}


//保存信息
function saveInfo(){
	$('#formEdit').data('bootstrapValidator').validate();  
    if(!$('#formEdit').data('bootstrapValidator').isValid()){  
        return ;  
    }
	var data=$('#formEdit').serializeObject();
	if(data.type=="10"){
		if(!data.tmBasPlantId){layer.msg('请选择工厂!',{icon:1,time:1000}); return;}
		if(!data.tmBasWorkshopId){layer.msg('请选择车间!',{icon:1,time:1000}); return;}
		if(!data.tmBasLineId){layer.msg('请选择产线!',{icon:1,time:1000}); return;}
		clearObjAttr(data,'tmBasStorageId','tmBasEquipmentId');
	}
	if(data.type=="20"){
		if(!data.tmBasStorageId){layer.msg('请选择仓库!',{icon:1,time:1000}); return;}
		clearObjAttr(data,'tmBasPlantId','tmBasWorkshopId','tmBasLineId','jph','planNum','actNum','tmBasEquipmentId');
	}
	if(data.type=="30"){
		if(!data.tmBasEquipmentId){layer.msg('请选择设备!',{icon:1,time:1000}); return;}
		clearObjAttr(data,'tmBasPlantId','tmBasWorkshopId','tmBasLineId','jph','planNum','actNum','tmBasStorageId');
	}
	if(data.jph < 0){layer.msg('参考JPH不能为负数!',{icon:7,time:1000}); return;}
	if(data.planNum < 0){layer.msg('计划上线数不能为负数!',{icon:7,time:1000}); return;}
	if(data.actNum < 0){layer.msg('计划下线数不能为负数!',{icon:7,time:1000}); return;}
	if(data.shiftno=='1'){
		if(!diff_time(data.startTime,data.endTime)){
			return;
		}
	}
	data=JSON.stringify(data);
	if (mod_flag == 0){
		url = apiUrl + "/worktime/worktime/add";
	} else {
		url = apiUrl + "/worktime/worktime/update";
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
        	$('#tb_worktime').bootstrapTable("refresh");
            layer.msg('保存成功!',{icon:1,time:1000});
        }
    });
}

//保存信息
function saveRestInfo(){
	$('#formRestEdit').data('bootstrapValidator').validate();  
    if(!$('#formRestEdit').data('bootstrapValidator').isValid()){  
        return ;  
    }
	var data=$('#formRestEdit').serializeObject();
	if(!diff_time(data.restStartTime,data.restEndTime,'休息开始时间不能大于休息结束时间!')){
		return;
	}
	if(!diff_time(tmp_row.startTime,data.restStartTime,'休息开始时间不能小于工作开始时间!')){
		return;
	}
	if(!diff_time(data.restStartTime,tmp_row.endTime,'休息开始时间不能大于工作结束时间!')){
		return;
	}
	if(!diff_time(tmp_row.startTime,data.restEndTime,'休息结束时间不能小于工作开始时间!')){
		return;
	}
	if(!diff_time(data.restEndTime,tmp_row.endTime,'休息结束时间不能大于工作结束时间!')){
		return;
	}
	data["tmBasWorktimeId"]=tmp_row.tmBasWorktimeId;
	data=JSON.stringify(data);
	if (mod_flag == 0){
		url = apiUrl + "/worktime/worktimerest/add";
	} else {
		url = apiUrl + "/worktime/worktimerest/update";
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
        	$('#addModalRest').modal('hide');
        	$('#tb_worktime_rest').bootstrapTable("refresh");
            layer.msg('保存成功!',{icon:1,time:1000});
        }
    });
}

//删除
function deleteInfo(){
	var rows = $("#tb_worktime").bootstrapTable("getSelections");
    if (rows.length < 1) {
    	layer.msg("没有选择的数据！");
        return;
    }
	layer.confirm('删除数据不可恢复，确定删除吗？',{icon: 3, title:'信息提示'},function(index){
		var rowid = [];
        $.each(rows, function (index, row) {
        	rowid.push(row.tmBasWorktimeId);
        });
        data={tmBasWorktimeId:rowid}
        $.ajax({
            type: "POST",
            url: apiUrl + "/worktime/worktime/delete",
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json",
            success: function (data) {
            	var errcode = data.code;//在此做了错误代码的判断
        	    if(errcode != 10000){
        	    	layer.msg(data.message,{icon:2,time:1000});
        	        return;
        	    }
        	    tmp_row=null;
        	    $("#tb_worktime").bootstrapTable("refresh");
                $("#tb_worktime").bootstrapTable("refreshOptions",{pageNumber:1});
                $("#tb_worktime_rest").bootstrapTable("refresh");
                $("#tb_worktime_rest").bootstrapTable("refreshOptions",{pageNumber:1});
                layer.msg('删除成功!',{icon:1,time:1000});
            }
        });
    });
}

//删除
function deleteRestInfo(){
	var rows = $("#tb_worktime_rest").bootstrapTable("getSelections");
    if (rows.length < 1) {
    	layer.msg("没有选择的数据！");
        return;
    }
	layer.confirm('删除数据不可恢复，确定删除吗？',{icon: 3, title:'信息提示'},function(index){
		var rowid = [];
        $.each(rows, function (index, row) {
        	rowid.push(row.tmBasWorktimeRestId);
        });
        data={tmBasWorktimeRestId:rowid}
        $.ajax({
            type: "POST",
            url: apiUrl + "/worktime/worktimerest/delete",
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json",
            success: function (data) {
            	var errcode = data.code;//在此做了错误代码的判断
        	    if(errcode != 10000){
        	    	layer.msg(data.message,{icon:2,time:1000});
        	        return;
        	    }
        	    $("#tb_worktime_rest").bootstrapTable("refresh");
        	    $("#tb_worktime_rest").bootstrapTable("refreshOptions",{pageNumber:1});
                layer.msg('删除成功!',{icon:1,time:1000});
            }
        });
    });
}*/