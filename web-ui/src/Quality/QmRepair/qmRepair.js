layui.use('layer',function(){
	layer=layui.layer;
});

$(function(){
//搜索条件
	var mainSearchData=[{
		idName:'combo51',
		text:'工厂',
		comboUrl:'/base/plant/publicPlantSelect',
		comboId:'tmBasPlantId',
		comboText:'plant',
		field:'tmBasPlantId',
		onClick:function(data){
      $('#inputCom52').val('');
			$('#inputCom53').val('');
		}
	},{
		idName:'inputCom52',
		text:'产品组',
		comboUrl:'/worktime/part/queryPartGroupSuggest',
		comboId:'tmBasPartgroupId',
		comboText:'partgroup',
		field:'partgroup',
		comboData:{
			id:['combo51'],
			field:['tmBasPlantId']
		},
		onClick:function(data){
			$('#inputCom53').val('');
		}
	},{

		idName:'inputCom53',
		text:'产品',
		comboUrl:'/worktime/part/queryPartPartGroupSuggest',
		comboData:
			{
			id:['combo51','inputCom52'],
			field:['tmBasPlantId','partgroup'],
			other:{}
			},
		comboId:'tmBasPartId',
		comboText:'part',
		field:'part',
		onSuccess:function(data){
			console.log(data)
		}


	},{
		idName:'text58',
		text:'维修类型',
		field:'type'
	},
	{
		idName:'text59',
		text:'维修步骤',
		field:'repairSteps'
	}
	]

	Ew.search('.searchForm',{
		title:'查询',
		textValues:mainSearchData,
		btnValues:[{
			btnId:'btnSearch',
			text:'搜索',
			onClick:function(data){
				$('#tableQmRepair').bootstrapTable('refresh');
				$('#tableQmRepair').bootstrapTable('refreshOptions',{pageNumber:1});

			}
		},{
			btnId:'btnClear',
			text:'重置',
			tableid:['tableQmRepair']
		}]
	});

	//主表格
	Ew.table('.mainTable',{
		btnValues:[{
			btnId:'btnAdd',text:'新增',onClick:function(){
				daliogShow('add');
			}
		},{
			btnId:'btnEdit',text:'编辑',otherOption:[{id:'tableQmRepair',selectNum: 1}],onClick:function(){
				daliogShow('change');
			}
		},{
			btnId:'btnDelete',text:'删除',isTrue:true,otherOption:[{id:'tableQmRepair',selMinNum: 1}],onClick:function(){
				var rows = $('#tableQmRepair').bootstrapTable('getSelections');
				ids = [];
				var flag = true;
				$.each(rows,function(index,row){
					ids.push(row.tmQmRepairId);
				});
				datas = JSON.stringify({tmQmRepairId : ids});
				var url = '/repair/qmRepair/delete'
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#tableQmRepair').bootstrapTable('refresh');
				});
			}
		},{
			btnId:'btnInput',text:'导入',onClick:function(){
			}
		},{
			btnId:'btnExport',text:'导出',onClick:function(){
				
				var tmBasPlantId= $("#combo51").val();
				var part= $("#inputCom53").val();
				var partgroup= $("#inputCom52").val();
				var repairSteps= $("#text59").val();
				var type= $("#text58").val();
				window.top.location.href= apiUrl +'/repair/qmRepair/export?tmBasPlantId='+tmBasPlantId+"&part="+part+"&partgroup="+partgroup+"&repairSteps="+repairSteps+"&type="+type
				
			}
		}],
		tableId:'tableQmRepair',
		tableValue:{
			searchParams:mainSearchData,
			queryParams:function(){
				return{}
			},
			onClickRow:function(item,$element){

			},
			onLoadSuccess:function(){

			},
			url:'/repair/qmRepair/querylistByPage',
			columns:[{
				checkbox: true
			},{
				field: 'plant',
				title: '工厂',
				align: 'center',
				sortable:true
			},{
				field: 'type',
				title: '维修类型',
				align: 'center',
				sortable:true
			},{
				field: 'repairSteps',
				title: '维修步骤',
				align: 'center',
				width:'180px',
				sortable:true
			},{
				field: 'partgroup',
				title: '产品组',
				align: 'center',
				sortable:true
			},{
				field: 'part',
				title: '产品',
				align: 'center',
				sortable:true
			}]
		}
	});
})

function daliogShow(type){
	var title=type=='add'?'新增':'编辑';
	var defaultTable=type=='add'?'':'tableQmRepair';
	Ew.dialog('mainFromEdit',{
		title:title,
		btnValues:[{
			btnId:'btnSave',
			text:'保存',
			formid:'form',
			onClick:function(data){
				var group =  $("#combo18").val();
				var part =  $("#combo19").val();
				if (group == null || group =='' || group == undefined){
					if (part == null || part =='' || part == undefined){
					layer.msg("产品组和产品至少选择一项");
					return;
					}
				}
				if(type=='change'){
					data.tmQmRepairId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tmQmRepairId;
				}
				datas = JSON.stringify(data);
				var url = (type=='add'?'/repair/qmRepair/add':'/repair/qmRepair/update');
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#mainFromEdit').modal('hide');
					$('#tableQmRepair').bootstrapTable('refresh');
				});
			}
		},{
			btnId:'btnCancel',
			text:'取消'
		}],
		form:{
			formId:'form',
			columnNum:2,
			listWidth:250,
			formList:[{
				idName:'combo11',
				text:'工厂',
				comboUrl:'/base/plant/publicPlantSelect',
				comboId:'tmBasPlantId',
				comboText:'plant',
				field:'tmBasPlantId',
				valid:['notEmpty'],
				disabled:type=='add'?false:true,
				comboData:type=='add'?JSON.stringify({
					enabled:1
				}):{}
				
			},{
				idName:'combo18',
				text:'产品组',
				field:'tmBasPartgroupId',
				comboUrl:'/worktime/part/queryPartGroupSuggest',
				comboId:'tmBasPartgroupId',
				comboText:'partgroup',
				disabled:type=='add'?false:true,
				isSearch:type=='add'?true:false,
				comboData:{
					id:['combo11'],
					field:['tmBasPlantId']
				},
				isSearch:true,
				onClick:function(data){
           $('#combo19').select2('val',['']);
 				}
			},{
				idName:'combo19',
				text:'产品',
				field:'tmBasPartId',
				comboUrl:'/worktime/part/queryPartPartGroupSuggest',
				comboId:'tmBasPartId',
				comboText:'part',
				disabled:type=='add'?false:true,
				isSearch:type=='add'?true:false,
				comboData:{
					id:['combo11','combo18'],
					field:['tmBasPlantId','tmBasPartgroupId']
				},
				isSearch:true
			},{
				idName:'textType',
				text:'维修类型',
				field:'type',
				valid:['notEmpty',{type:"string",min:0,max:32}],
				disabled:type=='add'?false:false
			},
			{idName:'text311',text:'版本号',field:'version',hidden:true
			},
			{
				idName:'areaRepairSteps',
				text:'维修步骤',
				field:'repairSteps',
				valid:[{type:"string",min:0,max:300}],
				disabled:type=='add'?false:false
			}],
			defaultTable:defaultTable
		}
	})
}
