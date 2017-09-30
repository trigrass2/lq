layui.use('layer',function(){
	layer=layui.layer;
});

$(function(){
	//搜索条件
	var mainSearchData=[{
		idName:'comboFactory',
		text:'工厂',
		field:'tmBasPlantId',
		comboUrl:'/base/ulocSiteContent/queryPlantSelect',
		comboId:'tmBasPlantId',
		comboText:'plant',
		onClick:function(data){
      		$('#inputComgroupPart').val('');
			$('#inputComPart').val('');
			$('#comboUloc').html('');
			$('#inputCom234').val('');
		}
	},{
		idName:'comboUloc',
		text:'使用工位',
		field:'tmBasUlocId',
		comboUrl:'/base/uloc/queryUlocSelectList',
		comboId:'tmBasUlocId',
		comboText:'uloc',
		comboData:{
			id:['comboFactory'],
			field:['pTmBasPlantId']
		},
		isSearch:true
	},{
		idName:'inputComgroupPart',
		text:'组合零件',
		field:'partgroup',
		comboUrl:'/worktime/part/queryPartGroupSuggestAll',
		comboId:'tmBasPartgroupId',
		comboText:'partgroup',
		/*disabled:type=='add'?false:true,*/
		comboData:{
			id:['comboFactory'],
			field:['tmBasPlantId'],
			other:{type:'M'}
		},
		isSearch:true
	},{
		idName:'inputComPart',
		text:'零件',
		field:'part',
		comboUrl:'/worktime/part/queryPartPartGroupSuggestAll',
		comboId:'tmBasPartId',
		comboText:'part',
		comboData:{
			id:['comboFactory'],
			field:['tmBasPlantId']
		},
		isSearch:true
	},{
		idName:'inputCom234',
		text:'暗灯号',
		field:'tmMmAndonNo',
		comboUrl:'/andon/ttMmAndon/queryAndonNo',
		comboId:'tmMmAndonNo',
		comboText:'tmMmAndonNo',
		comboData:{
			id:['comboFactory'],
			field:['tmBasPlantId']
		},
		isSearch:true
	},{
		idName:'comboandonStatus',
		text:'暗灯状态',
		field:'andonStatus',
		comboUrl:'/system/codeList/getSelect',
		comboData:'ANDON_STATUS',
		comboId:'no',
		comboText:'name',
	},{
		idName: 'day30',
		text: '需求时间从',
		field: 'requestTimeStart',
		defaultValue:Ew.getNowday('')+' 00:00:00',
		format:'fulldate',
		limit:{date:'day31',type:'setStartDate'}
	},{
		idName: 'day31',
		text: '需求时间到',
		field: 'requestTimeEnd',
		defaultValue:Ew.getNowday('')+' 23:59:59',
		format:'fulldate',
		limit:{date:'day30',type:'setEndDate'}
	}]

	Ew.search('.searchForm',{
		title:'查询',
		textValues:mainSearchData,
		btnValues:[{
			btnId:'btnSearch',
			text:'搜索',
			onClick:function(data){
				$('#tableMmAndon').bootstrapTable('refreshOptions',{pageNumber:1});
			}
		},{
			btnId:'btnClear',
			text:'重置',
			tableid:['tableMmAndon'],
			onClick:function(data){
				$("#comboandonStatus").val();
			}
		}]
	});

	//主表格
	Ew.getDictVal(['ANDON_STATUS'], function (re) {
		Ew.table('.mainTable',{
			btnValues:[
		/*	{
				btnId:'BtnAdd',text:'新增',onClick:function(){
					daliogShow('add');
				}
			},{
				btnId:'BtnEdit',text:'编辑',otherOption:[{id:'tableMmAndon',selectNum: 1}],onClick:function(){
					daliogShow('change');
				}
			},{
				btnId:'BtnDelete',text:'删除',isTrue:true,otherOption:[{id:'tableMmAndon',selMinNum: 1}],onClick:function(){
					var rows = $('#tableMmAndon').bootstrapTable('getSelections');
					ids = [];
					var flag = true;
					$.each(rows,function(index,row){
						ids.push(row.tmMmAndonId);
					});
					datas = JSON.stringify(ids);
					var url = '/andon/mmAndon/delete'
					$.when(Ew.ewAjax(url,datas)).done(function(results){
						$('#tableMmAndon').bootstrapTable('refresh');
					});
				}
			},{
					btnId:'BtnExportTpl',text:'模板下载',isTrue:true,selMinNum:1,onClick:function(){
					var  url = '/andon/mmAndon/exportTpl';
	           		window.top.location.href = Ew.apiUrl +url;
				}
				
			},{
				btnId:'BtnInput',text:'导入',selMinNum:1,url:'/andon/mmAndon/import',tableId:'tableMmAndon'
			},*/{
				btnId:'BtnExport',text:'导出',onClick:function(){
					var tmBasPlantId = $('#comboFactory').val();
					var uloc = $('#comboUloc').val();
					var partgroup = $('#combogroupPart').val();
					var part = $('#comboPart').val();
					var andonNo = $('#combo234').val();
					var andonStatus = $('#comboandonStatus').val();
					
					window.top.location.href= apiUrl +'/andon/ttMmAndon/export?tmBasPlantId='+tmBasPlantId+'&uloc='+uloc+'&partgroup='+partgroup+'&part='+part+'&andonNo='+andonNo+'&andonStatus='+andonStatus;
				}
			}],
			tableId:'tableMmAndon',
			tableValue:{
				searchParams:mainSearchData,
				queryParams:function(){
					return{}
				},
				noSearch:true,
				onClickRow:function(item,$element){
	
				},
				onLoadSuccess:function(){
				},
				url:'/andon/ttMmAndon/querylistByPage',
				columns:[{
					checkbox: true
				},{
					field: 'plant',
					title: '工厂',
					align: 'center',
					sortable:true
				},{
					field: 'tmMmAndonNo',
					title: '暗灯号',
					align: 'center',
					sortable:true
				},{
					field: 'partgroup',
					title: '组合零件',
					align: 'center',
					sortable:true
				},{
					field: 'part',
					title: '零件',
					align: 'center',
					sortable:true
				},{
					field: 'requiredQty',
					title: '需求数量',
					align: 'center',
					sortable:true
				},{
					field: 'andonStatus',
					title: '暗灯状态',
					align: 'center',
					width:'100px',
					sortable:true,
					formatter: function (value, row, index) {
			           	return re.ANDON_STATUS[value]
			        }
				},{
					field: 'uloc',
					title: '使用工位',
					align: 'center',
					sortable:true
				},{
					field: 'requestTime',
					title: '需求时间',
					align: 'center',
					sortable:true
				},{
					field: 'responseTime1',
					title: '响应时间(分)',
					align: 'center',
					sortable:true
				},{
					field: 'responseTime',
					title: '实际响应时间',
					align: 'center',
					sortable:true
				},{
					field: 'responseBy',
					title: '响应人',
					align: 'center',
					sortable:true
				},{
					field: 'sendTime1',
					title: '送货时间(分)',
					align: 'center',
					sortable:true
				},{
					field: 'sendTime',
					title: '实际送货时间',
					align: 'center',
					sortable:true
				},{
					field: 'user', 
					title: '送货人员',
					align: 'center',
					sortable:true
				},{
					field: 'onlineQty',
					title: '上线数量',
					align: 'center',
					sortable:true
				},{
					field: 'cancelTime',
					title: '取消时间',
					align: 'center',
					sortable:true
				},{
					field: 'cancelBy',
					title: '取消人员',
					align: 'center',
					sortable:true
				}]
			}
		});
	})
})	

function daliogShow(type){
	var title=type=='add'?'新增':'编辑';
	var defaultTable=type=='add'?'':'tableMmAndon';
	Ew.dialog('mainFromEdit',{
		title:title,
		btnValues:[{
			btnId:'btnSave',
			text:'保存',
			formid:'form',
			onClick:function(data){
				if(type=='change'){
					data.tmMmAndonId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tmMmAndonId;
				}
				datas = JSON.stringify(data);
				var url = (type=='add'?'/andon/mmAndon/add':'/andon/mmAndon/update');
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#mainFromEdit').modal('hide');
					$('#tableMmAndon').bootstrapTable('refresh');
				});
			}
		},{
			btnId:'btnCancel',
			text:'取消'
		}],
		form:{
			formId:'form',
			columnNum:3,
			listWidth:300,
			formList:[
			{
				idName:'combo11',
				text:'工厂',
				comboUrl:'/base/plant/publicPlantSelect',
				comboId:'tmBasPlantId',
				comboText:'plant',
				field:'tmBasPlantId',
				valid:['notEmpty'],
				/*disabled:type=='add'?false:true,*/
				comboData:type=='add'?JSON.stringify({
					enabled:1
				}):{},
				onClick:function(data){
					Ew.selectLink({
				        comboUrl:'/base/workshop/publicWorkshopSelect',
				        comboData:JSON.stringify({tmBasPlantId:data.id,enabled:1}),
				        id:['combo12'],
				        comboId:'tmBasWorkshopId',
				        comboText:'workshop'
				    });
						Ew.selectLink({
									comboUrl:'/base/line/publicLineSelect',
									comboData:JSON.stringify({tmBasPlantId:data.id,enabled:1}),
									id:['combo13'],
									comboId:'tmBasLineId',
									comboText:'line'
							});

						  $('#combo18').select2('val',['']);
	            $('#combo19').select2('val',['']);
				}
			},{
				idName:'combo12',
				text:'车间',
				comboUrl:'/base/workshop/publicWorkshopSelect',
				comboId:'tmBasWorkshopId',
				comboText:'workshop',
				field:'tmBasWorkshopId',
				comboData:type=='add'?JSON.stringify({
					enabled:1
				}):JSON.stringify({
					enabled:1,
					tmBasPlantId:$('#tableMmAndon').bootstrapTable('getSelections')[0].tmBasPlantId
				}),
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
 				comboData:type=='add'?JSON.stringify({
					enabled:1
				}):JSON.stringify({
					enabled:1,
					tmBasPlantId:$('#tableMmAndon').bootstrapTable('getSelections')[0].tmBasPlantId,
					tmBasWorkshopId:$('#tableMmAndon').bootstrapTable('getSelections')[0].tmBasWorkshopId
				})
			},{
				idName:'combo14',
				text:'使用工位',
				field:'tmBasUlocId',
				comboUrl:'/base/uloc/queryUlocSelectList',
				comboId:'tmBasUlocId',
				comboText:'uloc',
				comboData:{
					id:['combo11'],
					field:['pTmBasPlantId']
				},
				clearBoth:true,
				valid:['notEmpty',{type:"string",min:0,max:32}],
				/*disabled:type=='add'?false:true,*/
				isSearch:true
			},{
				idName:'combo15',
				text:'投料工位',
				field:'tmBasUlocId2',
				comboUrl:'/base/uloc/queryUlocSelectList',
				comboId:'tmBasUlocId',
				comboText:'uloc',
				comboData:{
					id:['combo11'],
					field:['pTmBasPlantId']
				},
				valid:['notEmpty',{type:"string",min:0,max:32}],
				isSearch:true
			},{
				idName:'textTmMmAndonNo',
				text:'暗灯号',
				field:'tmMmAndonNo',
				valid:['notEmpty']
			},{
				idName:'combopartType',
				text:'物料属性',
				field:'partType',
				comboUrl:'/system/codeList/getSelect',
				comboData:'ANDON_PART_TYPE',
				comboId:'no',
				comboText:'name',
				onClick:function(data){
					$('#combo18').html('');
					$('#combo19').html('');
					if(data.id == 'P'){
						$("#combo19").prop('disabled',false);
						$("#combo18").prop('disabled',true);
					}else if(data.id == 'G'){
						$("#combo18").prop('disabled',false);
						$("#combo19").prop('disabled',true);
					}else{
						$("#combo18").prop('disabled',true);
						$("#combo19").prop('disabled',true);
					}
				}
			},{
				idName:'combo18',
				text:'组合零件',
				field:'tmBasPartgroupId',
				comboUrl:'/worktime/part/queryPartGroupSuggest',
				comboId:'tmBasPartgroupId',
				comboText:'partgroup',
				disabled:true,
				isSearch:true,
				comboData:{
					id:['combo11'],
					field:['tmBasPlantId']
				}
			},{
				idName:'combo19',
				text:'零件',
				field:'tmBasPartId',
				comboUrl:'/worktime/part/queryPartPartGroupSuggest',
				comboId:'tmBasPartId',
				comboText:'part',
				disabled:true,
				comboData:{
					id:['combo11'],
					field:['tmBasPlantId']
				},
				isSearch:true
			},{
				idName:'numberThumbQty',
				text:'拇指数',
				field:'thumbQty',
				valid:['notEmpty']
			},{
				idName:'numberLotQty',
				text:'拉动批量',
				field:'lotQty',
				valid:['notEmpty']
			},{
				idName:'textArea',
				text:'送货区域',
				field:'area',
			},{
				idName:'comboSend',
				text:'送货组',
				comboUrl:'/system/role/queryRoles',
				comboId:'tsSysRoleId',
				comboText:'role',
				field:'sendgroup',
				isSearch:true
			},{
				idName:'combo445',
				text:'送货人员',
				field:'sendBy',
				comboUrl:'/system/user/queryUsers',
				comboId:'tsSysUserId',
				comboText:'user',
				isSearch:true
				
			},{
				idName:'number218',
				text:'送料相应时间（分）',
				field:'responseTime',
				valid:['notEmpty']
			},{
				idName:'number218',
				text:'送料到达时间（分）',
				field:'arriveTime',
				valid:['notEmpty']
			},{
				idName:'switch11',
				text:'启用',
				field:'enabled',
				ontext:'启用',
				offtext:'禁用'
			}],
			defaultTable:defaultTable
		}
	})
}
