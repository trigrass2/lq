

$(function(){
	//搜索条件
	var mainSearchData=[{
		idName:'combo51',
		text:'工作时间类型',
		comboUrl:'/system/codeList/getSelect',
		comboId:'no',
		comboText:'name',
		field:'type',
		comboData:'WORKTIME_TYPE'
	     
	},{
		idName:'combo52',
		text:'班次',
		field:'shiftno',
		comboUrl:'/system/codeList/getSelect',
		comboId:'no',
		comboText:'name',
		comboData:'SHIFT_NO'
		
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
	    comboData:JSON.stringify({namecn:null}),
		comboId:'id',
		comboText:'name',
		field:'tmBasStorageId'
		
	},{
		idName:'combo55',
		text:'设备',
		field:'tmBasEquipmentId',
	    comboData:[{id:'1',text:'设备一'},{id:'2',text:'设备二'},{id:'3',text:'设备三'}]
		
	},{
		idName:'combo56',
		field:'enabled',
		text:'启用',
		comboUrl:'/system/codeList/getSelect',
		comboId:'no',
		comboText:'name',
		comboData:'ENABLE'
	}];
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
		textValues:mainSearchData,
		listWidth:'270px',
		btnValues:[{
			btnId:'btnSearch',
			text:'搜索',
			onClick:function(data){
				console.log(data)
				$('#tableWorkTpl').bootstrapTable('refresh');
				$('#tableWorkTpl').bootstrapTable('refreshOptions',{pageNumber:1});
				$('#tableWorkTplSub').bootstrapTable('removeAll');
			}
		},{
			btnId:'btnClear',
			text:'重置',
      tableid:['tableWorkTpl','tableWorkTplSub']
		}]
	});

	/*
	*表格
	*
	*el：为html标签
	*option(参数设置)：
	*@btnValues为控制表格的按钮
	*selectNum为只能选取的条数
	*selMinNum为最少选择的条数
	*@tableId为table的id
	*@tableValue为table参数值
	*searchParams：搜索的条件为搜索里的textValues值格式[{idName:'text1',field:'wain'},{......},......]
	*queryParams:为默认想要添加的条件为函数function(){return{key：value}}return一个对象用keyvalue值传入
	*onClickRow为点击事件为函数function(item,$element){},item为点击那行的参数$element为选择器
	*url：为获取表格的后台接口
	*columns：为表格的参数值
	*
	*
	**/

	//主表格
	Ew.table('.demoTable',{
		btnValues:[{
			btnId:'btnAdd',text:'新增',onClick:function(){
				daliogShow('add')
			}
		},{
			btnId:'btnEdit',text:'编辑',otherOption:[{id:'tableWorkTpl',selectNum: 1}],onClick:function(){
				daliogShow('change')
			}
		},{
			btnId:'btnDelete',text:'删除',isTrue:true,otherOption:[{id:'tableWorkTpl',selMinNum: 1}],onClick:function(){
				var rows = $('#tableWorkTpl').bootstrapTable('getSelections');
				var ids = [];
				$.each(rows,function(index,row){
					ids.push(row.tmBasWorkscheduleId);
				});
				datas = JSON.stringify({tmBasWorkscheduleId:ids});
		
				var url = '/worktime/workschedule/delete';
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#tableWorkTpl').bootstrapTable('refresh');
					$('#tableWorkTpl').bootstrapTable('refreshOptions',{pageNumber:1});

	             });
			}
		},{
			btnId:'btnDownload',text:'模板下载',isTrue:true,selMinNum:1,onClick:function(){

			}
		},{
			btnId:'btnImport',text:'导入',isTrue:true,selMinNum:1,onClick:function(){

			}
		},{
			btnId:'btnExport',text:'导出',isTrue:true,selMinNum:1,onClick:function(){

			}
		},{
			btnId:'btnCreateWork',text:'生成工作日历',isTrue:true,selMinNum:1,onClick:function(){
                     creWork();
			}
		},{
          btnId: 'btnAddSub', otherBtn:true, otherOption:[{id:'tableWorkTpl',selectNum: 1}] //控制子表按钮是否 可用
        },{
          btnId: 'btnEditSub', otherBtn:true,otherOption:[{id:'tableWorkTpl',selectNum: 1},{id:'tableWorkTplSub',selectNum: 1}] //控制子表按钮是否 可用
        }],
		tableId:'tableWorkTpl',
		tableValue:{
			searchParams:mainSearchData,
			queryParams:function(){
				return{}
			},
			onClickRow:function(item,$element){
				$('#tableWorkTplSub').bootstrapTable('refresh',{query:{tmBasWorkscheduleId:item.tmBasWorkscheduleId}});//或者{query:{}}直接设置查询条件
			},
			onLoadSuccess:function(){
				$('.sw').bootstrapSwitch({
					onText:"启用",
					offText:"禁用",
					onColor:"success",
					offColor:"info",
					onSwitchChange:function(event,state){
						var d = {};
						d.tmBasWorkscheduleId = $(this).attr('fieldValue');
						d.enabled = state?1:0;
						datas = JSON.stringify(d);
						var url = '/worktime/workschedule/doEnabled';
						$.when(Ew.ewAjax(url,datas)).done(function(results){
							//$('#tableWorkTpl').bootstrapTable('refresh');
			            });
					}
				});
	        },
			url:'/worktime/workschedule/query',
			columns:[{
				checkbox:true
			},{
				field:'no',
				title:'编号',
				align:'center', 
				sortable:true,
        width:'80px'
			},{
				field:'type',
				title:'工作时间类型',
				align:'center',
				sortable:true,
				 formatter: function (value, row, index) {
	                    if (value == "10"){
	                    	return '产线';
	                    }else if (value == "20"){
	                    	return '仓库';
	                    }else if (value == "30"){
	                    	return '设备';	
	                    }
	                },
        width:'150px'
			},
//			{
//				field:'tmBasLineId',
//				title:'产线id',
//				align:'center',
//				sortable:true,
//        width:'80px'
//			},
			{
				field:'line_name',
				title:'产线',
				align:'center',
				sortable:true,
        width:'180px'
			},
//			{
//				field:'tmBasStorageId',
//				title:'仓库id',
//				align:'center',
//				sortable:true,
//        width:'100px'
//			},
			{
				field:'storage_name',
				title:'仓库',
				align:'center',
				sortable:true,
        width:'180px'
			},
//			{
//				field:'tmBasEquipmentId',
//				title:'设备id',
//				align:'center',
//				sortable:true,
//        width:'120px'
//			},
			{
				field:'equipment_name',
				title:'设备',
				align:'center',
				sortable:true,
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
                },
        width:'120px'
			},{
				field:'shiftno',
				title:'班次',
				align:'center',
				sortable:true,
				  formatter: function (value, row, index) {
	                    if (value == 1){
	                    	return '早班';
	                    } else if (value == 2){
	                    	return '中班';	
	                    } else {
	                    	return '晚班'
	                    }
	                },
        width:'80px'
			},
			{
				field:'startTime',
				title:'开始时间',
				align:'center',
				sortable:true,
        width:'120px'
			},
			{
				field:'endTime',
				title:'结束时间',
				align:'center',
				sortable:true,
        width:'120px'
			},
			 {
	            field: 'mon',
	            title: '星期一',
	            formatter: function (value, row, index) {
                    if (value == 1){
                    	return '√';
                    } else {
                    	return '';	
                    }
                },
			align:'center',
			sortable:true,
    width:'80px'
	        }, {
	            field: 'tue',
	            title: '星期二',
	            formatter: function (value, row, index) {
                    if (value == 1){
                    	return '√';
                    } else {
                    	return '';	
                    }
                },
    			align:'center',
    			sortable:true,
    			 width:'80px'
	        }, {
	            field: 'wed',
	            title: '星期三',
	            formatter: function (value, row, index) {
                    if (value == 1){
                    	return '√';
                    } else {
                    	return '';	
                    }
                },
    			align:'center',
    			sortable:true,
    			 width:'80px'
	        }, {
	            field: 'thu',
	            title: '星期四',
	            formatter: function (value, row, index) {
                    if (value == 1){
                    	return '√';
                    } else {
                    	return '';	
                    }
                },
    			align:'center',
    			sortable:true,
    			 width:'80px'
	        }, {
	            field: 'fri',
	            title: '星期五',
	            formatter: function (value, row, index) {
                    if (value == 1){
                    	return '√';
                    } else {
                    	return '';	
                    }
                },
    			align:'center',
    			sortable:true,
    			 width:'80px'
	        }, {
	            field: 'sat',
	            title: '星期六',
	            formatter: function (value, row, index) {
                    if (value == 1){
                    	return '√';
                    } else {
                    	return '';	
                    }
                },
    			align:'center',
    			sortable:true,
    			 width:'80px'
	        }, {
	            field: 'sun',
	            title: '星期日',
	            formatter: function (value, row, index) {
                    if (value == 1){
                    	return '√';
                    } else {
                    	return '';	
                    }
                },
    			align:'center',
    			sortable:true,
    			 width:'80px'
	        }, {
	            field: 'jph',
	            title: '参考JPH',
    			align:'center',
    			sortable:true,
    			 width:'120px'
	        }, {
	            field: 'planNum',
	            title: '计划上线数',
    			align:'center',
    			sortable:true,
    			 width:'120px'
	        }, {
	            field: 'actNum',
	            title: '计划下线数',
    			align:'center',
    			sortable:true,
    			 width:'120px'
	        }, {
	            field: 'plant_name',
	            title: '工厂',
    			align:'center',
    			sortable:true,
    			 width:'180px'
	        }, {
	            field: 'workshop_name',
	            title: '车间',
    			align:'center',
    			sortable:true,
    			 width:'180px'
	        },
			{
				field:'enabled',
				title:'启用',
				align:'center',
        width:'120px',
				formatter: function (value, row, index) {
	              return Ew.switchHl(value,'sw',row.tmBasWorkscheduleId)
	            }
			}]
		}
	});
	var aa=-1;
	//子表格
	Ew.table('.demoTable2',{
		btnValues:[{
			btnId:'btnAddSub',text:'新增',otherOption:[{id:'tableWorkTpl',selectNum: 1}],onClick:function(){
				daliogShow2('add')
			}
		},{
			btnId:'btnEditSub',text:'编辑',otherOption:[{id:'tableWorkTpl',selectNum: 1},{id:'tableWorkTplSub',selectNum: 1}],selectNum:1,onClick:function(){
				daliogShow2('change')
	
			}
		},{
			btnId:'btnDeleteSub',text:'删除',isTrue:true,otherOption:[{id:'tableWorkTplSub',selMinNum: 1}],onClick:function(){
				var rows = $('#tableWorkTplSub').bootstrapTable('getSelections');
				var ids = [];
				$.each(rows,function(index,row){
					ids.push(row.tmBasWorkscheduleRestId);
				});
				datas = JSON.stringify({tmBasWorkscheduleRestId:ids});
				var url = '/worktime/workschedulerest/delete';
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#tableWorkTplSub').bootstrapTable('refreshOptions',{pageNumber:1});
					$('#tableWorkTplSub').bootstrapTable('refresh');
	            });
			}
		}],
		tableId:'tableWorkTplSub',
		tableValue:{
			queryParams:function(){
				return {tmBasWorkscheduleId: $('#tableWorkTpl').bootstrapTable('getSelections')[0]?$('#tableWorkTpl').bootstrapTable('getSelections')[0].tmBasWorkscheduleId:-1};
			},
			onClickRow:function(item,$element){

			},
			url:'/worktime/workschedulerest/queryAll',
			columns:[{
				checkbox:true
			},{
				field:'restStartTime',
				title:'休息开始时间',
				align:'center',
				sortable:true
			},{
				field:'restEndTime',
				title:'休息结束时间',
				align:'center',
				sortable:true
			}]
		}
	});
})

/*
*
*弹出框
*el：为html标签
*
*option(参数设置)：
*@title为弹出框标题
*@btnValues为弹出框最底下的按钮
*btnId为按钮id
*text为按钮名称
*如果text为重置，会自动重置formid的表单
*如果text为取消，自动关闭弹出框
*formid为点击时候需要验证form表单的form的id
*onClick为点击事件为函数function(data){}为form表单里的{field:value,......}
*
*@form如果有form自动内部加载form表单form表单参数详见Ew.form函数
**/

/*
*
*表单form及验证
*el：为html标签
*
*option(参数设置)：
*@formid为form表单id
*@columnNum为列数
*@formList表单条件参数
*text：为页面显示的条件名称，
*field：为当前条件的字段名称，取决后台需求，
*idName：为input的id，input的类型取决于id名包含字段，
*包含text，为输入文本框，
*包含combo，为下拉框，
*下拉数据调用后台方法
*comboUrl为接口地址，comboData为接口条件，comboId接口id字段，comboText接口text字段
*下拉数据调用本地方法，
*comboData：[{id:1,text:'2222'}],内容为写死的json
*包含day为时间控件年月日
*
*valid为验证条件，如果有触发验证信息，为数组
*notEmpty为必填，如果为对象直接验证对象里的信息
*{callback:{
message:'对',
callback:function(value,validator){
returnvalue==100||value=='';
}
}}
callback为自定义验证message为验证错误文字显示callback为函数value为框里的值return返回条件为false为错true为对

更多详见getInputhl
*
*
**/


function daliogShow(type){
	var title=type=='add'?'新增':'编辑';
	var defaultTable=type=='add'?'':'tableWorkTpl';
	
	Ew.dialog('demoadd',{
		title:title,
		btnValues:[{
			btnId:'btnSave',
			text:'保存',
			formid:'demoform',
			onClick:function(data){
			
				if(type=='change') {
					var tid = $('#'+defaultTable).bootstrapTable('getSelections')[0].tmBasWorkscheduleId;
					data.tmBasWorkscheduleId = tid;
				}
				datas = JSON.stringify(data);		
				var url = (type=='add'?'/worktime/workschedule/add':'/worktime/workschedule/update');
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#demoadd').modal('hide');
					$('#tableWorkTpl').bootstrapTable('refresh');
					
					
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
			formList:[
			     {
				idName:'text9',
				text:'编号',
				field:'no',
				valid:['notEmpty'],
				disabled:type=='add'?false:true,	
			     },{
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
				comboData:JSON.stringify({namecn:null}),
				disabled:type=='add'?false:true,
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
				comboId:'no',
				comboText:'name',
				comboData:'SHIFT_NO'
			},{
				idName:'day113',
				text:'开始时间',
				valid:['notEmpty'],
				field:'startTime',
				format:'time'
			},{
				idName:'day114',
				text:'结束时间',
				valid:['notEmpty'],
				field:'endTime',
				format:'time'

			},{
				field:'enabled',
				defaultValue:type=='add'?1:'',
					idName:'switch28',
					text:'启用',
					ontext:'启用',
					offtext:'禁用'
				
			},
	        {idName:'text311',text:'版本号',field:'version',hidden:true},

			{idName:'checkbox1',text:'',field:'mon',checkboxData:[{text:'星期一',checked:true,value:1}],n:0.3},
			{idName:'checkbox2',text:'',field:'tue',checkboxData:[{text:'星期二',checked:true,value:1}],n:0.3},
			{idName:'checkbox3',text:'',field:'wed',checkboxData:[{text:'星期三',checked:true,value:1}],n:0.3},
			{idName:'checkbox4',text:'',field:'thu',checkboxData:[{text:'星期四',checked:true,value:1}],n:0.3},
			{idName:'checkbox5',text:'',field:'fri',checkboxData:[{text:'星期五',checked:true,value:1}],n:0.3},
			{idName:'checkbox6',text:'',field:'sat',checkboxData:[{text:'星期六',checked:true,value:1}],n:0.3},
			{idName:'checkbox7',text:'',field:'sun',checkboxData:[{text:'星期日',checked:true,value:1}],n:0.3}
			
			],
			defaultTable:defaultTable
		}
	})
if (type =='change') {
	var types =  $('#'+defaultTable).bootstrapTable('getSelections')[0].type;
	 checkDis(types);
	}
}
function creWork(){

	var rows = $("#tableWorkTpl").bootstrapTable("getSelections");
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
        	    }else {
        	    	layer.msg(data.message);
        	    }
        	 
               
            }
        });
   
}

//子表格
function daliogShow2(type){
	var title=type=='add'?'新增':'编辑';
	var defaultTable=type=='add'?'':'tableWorkTplSub';
	Ew.dialog('demoadd',{
		title:title,
		btnValues:[{
			btnId:'btnSaveSub',
			text:'保存',
			formid:'demoform',
			onClick:function(data){
				if (checkTime()==true){
				data.tmBasWorkscheduleId = $('#tableWorkTpl').bootstrapTable('getSelections')[0].tmBasWorkscheduleId ;
				if(type=='change') data.tmBasWorkscheduleRestId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tmBasWorkscheduleRestId;
				datas = JSON.stringify(data);
				var url = (type=='add'?'/worktime/workschedulerest/add':'/worktime/workschedulerest/update');
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#demoadd').modal('hide');
					$('#tableWorkTplSub').bootstrapTable('refreshOptions',{pageNumber:1});

					$('#tableWorkTplSub').bootstrapTable('refresh');
	             });
			}
			}
		},{
			btnId:'btnCancelSub',
			text:'取消'
		}],
		form:{
			formId:'demoform',
			columnNum:2,
			listWidth:280,
			formList:[{
				idName:'text30',
				text:'编号',
				field:'no',
				defaultValue:$('#tableWorkTpl').bootstrapTable('getSelections')[0].no,
				valid:['notEmpty']
			    
			},{
				idName:'day31',
				text:'开始时间',
				field:'restStartTime',
				valid:['notEmpty'],
				format:'time'
			
			
			},{
				idName:'day32',
				text:'结束时间',
				field:'restEndTime',
				valid:['notEmpty'],
				format:'time'
			
			},
	        {idName:'text311',text:'版本号',field:'version',hidden:true}

			],
			defaultTable:defaultTable
		}
	})
}

function  checkTime(){
	var restStartTime =  $('#day31').val();
	var restEndTime =  $('#day32').val();
	var time1 =   $('#tableWorkTpl').bootstrapTable('getSelections')[0].startTime ;
	var time2 =   $('#tableWorkTpl').bootstrapTable('getSelections')[0].endTime ;
	if(!diff_time(restStartTime,restEndTime,'休息开始时间不能大于或等于休息结束时间!')){
		return false;
	}
	if(!diff_time(time1,restStartTime,'休息开始时间不能小于或等于工作开始时间!')){
		return false;
	}
	if(!diff_time(restStartTime,time2,'休息开始时间不能大于或等于工作结束时间!')){
		return false;
	}
	if(!diff_time(time1,restEndTime,'休息结束时间不能小于或等于工作开始时间!')){
		return false;
	}
	if(!diff_time(restEndTime,time2,'休息结束时间不能大于工作结束时间!')){
		return false;
	}
	else {
		return true;
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

function checkDis(type){
	if (type == 10) {
		$("#combo17").prop("disabled",'disabled');
		$("#combo18").prop("disabled",'disabled');
		$("#combo17").val('');
		$("#combo18").val('');
		$("#combo17,#combo18").select2('val',['']);

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
