layui.use('layer',function(){
	layer=layui.layer;
});

$(function(){
	//搜索条件
	var mainSearchData=[{
		idName:'comboPlant',
		text:'工厂',
		comboUrl:'/base/plant/publicPlantSelect',
		comboId:'tmBasPlantId',
		comboText:'plant',
		field:'tmBasPlantId'
			},{
				idName:'textSearchTypeNo',
				text:'类型编码',
				field:'tracetypeNo'
			},{
		idName:'textSearchTypeName',
		text:'类型名称',
		field:'typeName'
	}]

	Ew.search('.searchForm',{
		title:'查询',
		textValues:mainSearchData,
		btnValues:[{
			btnId:'btnSearch',
			text:'搜索',
			onClick:function(data){
				$('#tableQmTraceType').bootstrapTable('refreshOptions',{pageNumber:1});
			}
		},{
			btnId:'btnClear',
			text:'重置',
			tableid:['tableQmTraceType']
		}]
	});

	//主表格
	Ew.table('.mainTable',{
		btnValues:[{
			btnId:'btnAdd',text:'新增',onClick:function(){
				daliogShow('add');
			}
		},{
			btnId:'btnEdit',text:'编辑',otherOption:[{id:'tableQmTraceType',selectNum: 1}],onClick:function(){
				daliogShow('change');
			}
		},{
			btnId:'btnDelete',text:'删除',isTrue:true,otherOption:[{id:'tableQmTraceType',selMinNum: 1}],onClick:function(){
				var rows = $('#tableQmTraceType').bootstrapTable('getSelections');
				ids = [];
				var flag = true;
				$.each(rows,function(index,row){
					ids.push(row.tsSysTracetypeId);
				});
				datas = JSON.stringify({tsSysTracetypeId : ids});
				var url = '/quality/qmTraceType/delete'
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#tableQmTraceType').bootstrapTable('refreshOptions',{pageNumber:1});
				});
			}
		},{
			btnId:'btnExportTpl',text:'模板下载',onClick:function(){
				window.top.location.href= apiUrl +'/quality/qmTraceType/exportTpl'
			}
		},{
			btnId:'btnInput',text:'导入',url:'/quality/qmTraceType/import',tableId:'tableQmTraceType'
		},{
			btnId:'btnExport',text:'导出',onClick:function(){
				var typeName = $('#textSearchType_name').val();
				var tmBasPlantId = $('#comboPlant').val();
				window.top.location.href= apiUrl +'/quality/qmTraceType/export?tmBasPlantId='+tmBasPlantId+'&typeName='+typeName;
			}
		}],
		tableId:'tableQmTraceType',
		tableValue:{
			searchParams:mainSearchData,
			queryParams:function(){
				return{}
			},
			onClickRow:function(item,$element){

			},
			onLoadSuccess:function(){

			},
			url:'/quality/qmTraceType/querylistByPage',
			columns:[{
				checkbox: true
			},{
				field: 'plant',
				title: '工厂',
				align: 'center',
				sortable:true
			},{
				field: 'tracetypeNo',
				title: '类型编码',
				align: 'center',
				sortable:true
			
			},{
				field: 'typeName',
				title: '类型名称',
				align: 'center',
				sortable:true
			},{
				field: 'remark',
				title: '备注',
				align: 'center',
				sortable:true
			}]
		}
	});
})

function daliogShow(type){
	var title=type=='add'?'新增':'编辑';
	var defaultTable=type=='add'?'':'tableQmTraceType';
	Ew.dialog('mainFromEdit',{
		title:title,
		btnValues:[{
			btnId:'btnSave',
			text:'保存',
			formid:'form',
			onClick:function(data){
				if(type=='change'){
					data.tsSysTracetypeId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tsSysTracetypeId;
				}
				datas = JSON.stringify(data);
				var url = (type=='add'?'/quality/qmTraceType/add':'/quality/qmTraceType/update');
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#mainFromEdit').modal('hide');
					$('#tableQmTraceType').bootstrapTable('refresh');
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
				idName:'comboPlantI',
				text:'工厂',
				comboUrl:'/base/plant/publicPlantSelect',
				comboId:'tmBasPlantId',
				comboText:'plant',
				field:'tmBasPlantId',
				valid:['notEmpty',{type:"string",min:0,max:32}],
				defaultValue:type=='add'?null:$('#'+defaultTable).bootstrapTable('getSelections')[0].tmBasPlantId,
				disabled:type=='add'?false:true
			},{
				idName:'textTypeNo',
				text:'类型编码',
				field:'tracetypeNo',
				valid:['notEmpty',{type:"string",min:0,max:32}],
				disabled:type=='add'?false:true
			},{
				idName:'textTypeName',
				text:'类型名称',
				field:'typeName',
				valid:['notEmpty',{type:"string",min:0,max:32}],
				disabled:false
			},{
				idName:'areaRemark',
				text:'备注',
				field:'remark',
				valid:[{type:"string",min:0,max:300}],
				n:2,
				disabled:type=='add'?false:false
			},{
		        idName:'textVersion',
				text:'版本号',
				field:'version',
				hidden:true
			}],
			defaultTable:defaultTable
		}
	})
}
