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
		}
		/*isSearch:true*/
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
			tableid:['tableMmAndon']
		}]
	});

	//主表格
	Ew.getDictVal(['ANDON_STATUS'], function (re) {
		Ew.table('.mainTable',{
			btnValues:[
			{
				btnId:'btnResponse',text:'响应',otherOption:[{id:'tableMmAndon',selectNum: 1}],onClick:function(){
					var rows = $('#tableMmAndon').bootstrapTable('getSelections');
						var flag = true;
						$.each(rows,function(index,row){
								if(!(row.andonStatus== 'N')){
									flag = false;
								}
							});
						
						if(flag){
							daliogShow('response');
						}else{
							layer.msg("只有暗灯状态为新建才可进行响应操作！");
						}
						
				}
			},{
				btnId:'btnUp',text:'上料',otherOption:[{id:'tableMmAndon',selectNum: 1}],onClick:function(){
					
					var rows = $('#tableMmAndon').bootstrapTable('getSelections');
						var flag = true;
						$.each(rows,function(index,row){
								if(!(row.andonStatus== 'R')){
									flag = false;
								}
						});
						
						if(flag){
							daliogShow1('up');
						}else{
							layer.msg("只有暗灯状态为响应才可进行上料操作！");
						}
				}
			},{
				
				btnId:'btnCancelResponse',text:'取消',otherOption:[{id:'tableMmAndon',selectNum: 1}],isTrue:true,onClick:function(){
						/*data = $('#tableMmAndon').bootstrapTable('getSelections')[0];*/
						
						var rows = $('#tableMmAndon').bootstrapTable('getSelections');
						
						datas = JSON.stringify(rows[0]);
							var url = '/andon/mmAndonTe/responseCancel';
							$.when(Ew.ewAjax(url,datas)).done(function(results){
								$('#tableMmAndon').bootstrapTable('refreshOptions',{pageNumber:1});
						});
						
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
				url:'/andon/mmAndonTe/querylistByPage',
				columns:[{
					checkbox: true
				},{
					field: 'tmMmAndonNo',
					title: '暗灯号',
					align: 'center',
					sortable:true
				},{
					field: 'andonStatus',
					title: '状态',
					align: 'center',
					sortable:true,
					formatter: function (value, row, index) {
			           	return re.ANDON_STATUS[value]
			        }
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
					field: 'uloc',
					title: '使用工位',
					align: 'center',
					sortable:true
				},{
					field: 'uloc2',
					title: '投料工位',
					align: 'center',
					sortable:true
				},{
					field: 'requiredQty',
					title: '需求数量',
					align: 'center',
					sortable:true
				},{
					field: 'responseQty',
					title: '响应数量',
					align: 'center',
					sortable:true
				}/*,{
					field: 'onlineQty',
					title: '上线数量',
					align: 'center',
					sortable:true
				}*/,{
					field: 'requestTime',
					title: '需求时间',
					align: 'center',
					sortable:true
				},{
					field: 'responseTime',
					title: '响应时间',
					align: 'center',
					sortable:true
				},{
					field: 'responseBy',
					title: '响应人员',
					align: 'center',
					sortable:true
				}/*,{
					field: 'sendTime',
					title: '送货时间',
					align: 'center',
					sortable:true
				},{
					field: 'user',
					title: '送货人员',
					align: 'center',
					sortable:true
				}*/]
			}
		});
	})	
})

function daliogShow(type){
	var title='响应';
	var value = $('#tableMmAndon').bootstrapTable('getSelections')[0].andonStatus;
	var defaultTable='tableMmAndon';
	Ew.dialog('mainFromEdit',{
		title:title,
		btnValues:[{
			btnId:'btnSave',
			text:'保存',
			formid:'form',
			onClick:function(data){
				data.teMmAndonId = $('#'+defaultTable).bootstrapTable('getSelections')[0].teMmAndonId;
				datas = JSON.stringify(data);
				var url = '/andon/mmAndonTe/responseUpdate';
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
			columnNum:2,
			listWidth:300,
			listInputWidth:200,
			formList:[
			{
				idName:'txt21',
				text:'零件：',
				field:'part',
				defaultValue:$('#tableMmAndon').bootstrapTable('getSelections')[0].part
			},{
				idName:'txt22',
				text:'组合零件：',
				field:'partgroup',
				defaultValue:$('#tableMmAndon').bootstrapTable('getSelections')[0].partgroup
			},{
				idName:'txt23',
				text:'使用工位：',
				field:'uloc',
				defaultValue:$('#tableMmAndon').bootstrapTable('getSelections')[0].uloc
			},{
				idName:'txt24',
				text:'投料工位：',
				field:'uloc2',
				defaultValue:$('#tableMmAndon').bootstrapTable('getSelections')[0].uloc2
			},{
				idName:'combo305',
				text:'状态：',
				field:'andonStatus',
				disabled:true,
				valid:[''],
	            comboData:[
				     	{id:'N',text:'新建'},
				      	{id:'R',text:'已响应'},
				      	{id:'ON',text:'已上线'},
				      	{id:'CA',text:'取消'},
				      	{id:'FA',text:'出库失败'},
				      	{id:'SU',text:'出库成功'}
        			] 
			},{
				idName:'number201',
				text:'需求数量',
				field:'requiredQty',
				disabled:true
			},{
				idName:'number2187',
				text:'响应数量',
				field:'responseQty',
				defaultValue:$('#tableMmAndon').bootstrapTable('getSelections')[0].requiredQty
			}],
			defaultTable:defaultTable
		}
	})
}	
	
function daliogShow1(type){
	var title='上料';
	var defaultTable='tableMmAndon';
	Ew.dialog('mainFromEdit',{
		title:title,
		btnValues:[{
			btnId:'btnSave',
			text:'保存',
			formid:'form',
			onClick:function(data){
				data1 = $('#'+defaultTable).bootstrapTable('getSelections')[0];
				data1.onlineQty = data.onlineQty;
				datas = JSON.stringify(data1);
				var url = '/andon/mmAndonTe/updateFeed';
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
			columnNum:2,
			listWidth:300,
			listInputWidth:200,
			formList:[
			{
				idName:'txt2183',
				text:'零件：',
				field:'part',
				defaultValue:$('#tableMmAndon').bootstrapTable('getSelections')[0].part
			},{
				idName:'txt213',
				text:'组合零件：',
				field:'partgroup',
				defaultValue:$('#tableMmAndon').bootstrapTable('getSelections')[0].partgroup
			},{
				idName:'txt217',
				text:'使用工位：',
				field:'uloc',
				defaultValue:$('#tableMmAndon').bootstrapTable('getSelections')[0].uloc
			},{
				idName:'txt214',
				text:'投料工位：',
				field:'uloc2',
				defaultValue:$('#tableMmAndon').bootstrapTable('getSelections')[0].uloc2
			},{
				idName:'combo215',
				text:'状态：',
				field:'andonStatus',
				valid:[''],
				disabled:true,
	            comboData:[
				     	{id:'N',text:'新建'},
				      	{id:'R',text:'已响应'},
				      	{id:'ON',text:'已上线'},
				      	{id:'CA',text:'取消'},
				      	{id:'FA',text:'出库失败'},
				      	{id:'SU',text:'出库成功'}
        			] 
			},{
				idName:'number218',
				text:'需求数量',
				field:'requiredQty',
				disabled:true
			},{
				idName:'number2180',
				text:'响应数量',
				field:'responseQty',
				disabled:true
			},{
				idName:'number2181',
				text:'上线数量',
				field:'onlineQty',
				defaultValue:$('#tableMmAndon').bootstrapTable('getSelections')[0].responseQty
			}/*,{
				idName:'combo445',
				text:'送货人员',
				field:'sendBy',
				comboUrl:'/system/user/queryUsers',
				comboId:'tsSysUserId',
				comboText:'user',
				isSearch:true
			}*/,{
	        	idName:'text311',
				text:'版本号',
				field:'version',
				hidden:true
			}],
			defaultTable:defaultTable
		}
	})
}
