layui.use('layer',function(){
	layer=layui.layer;
});

$(function(){
	//搜索条件
	var mainSearchData=[{
		idName:'textSearchNo',
		text:'div组件编号',
		field:'no'
	},{
		idName:'textSearchName',
		text:'div组件名称',
		field:'name'
	}]

	Ew.search('.searchForm',{
		title:'查询',
		textValues:mainSearchData,
		btnValues:[{
			btnId:'btnSearch',
			text:'搜索',
			onClick:function(data){
				$('#tableSysDiv').bootstrapTable('refreshOptions',{pageNumber:1});
			}
		},{
			btnId:'btnClear',
			text:'重置',
			tableid:['tableSysDiv']
		}]
	});

	//主表格
	Ew.table('.mainTable',{
		btnValues:[{
			btnId:'btnAdd',text:'新增',onClick:function(){
				daliogShow('add');
			}
		},{
			btnId:'btnEdit',text:'编辑',otherOption:[{id:'tableSysDiv',selectNum: 1}],onClick:function(){
				daliogShow('change');
			}
		},{
			btnId:'btnDelete',text:'删除',isTrue:true,otherOption:[{id:'tableSysDiv',selMinNum: 1}],onClick:function(){
				var rows = $('#tableSysDiv').bootstrapTable('getSelections');
				ids = [];
				var flag = true;
				$.each(rows,function(index,row){
					ids.push(row.tsSysDivId);
				});
				datas = JSON.stringify({tsSysDivId : ids});
				var url = '/system/sysDiv/delete'
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#tableSysDiv').bootstrapTable('refreshOptions',{pageNumber:1});
				});
			}
		},{
			btnId:'btnExportTpl',text:'模板下载',onClick:function(){
				window.top.location.href= apiUrl +'/system/sysDiv/exportTpl'
			}
		},{
			btnId:'btnInput',text:'导入',onClick:function(){
			}
		},{
			btnId:'btnExport',text:'导出',onClick:function(){
				var No = $('#textSearchNo').val();
				var Name = $('#textSearchName').val();
				window.top.location.href= apiUrl +'/system/sysDiv/export'
			}
		}],
		tableId:'tableSysDiv',
		tableValue:{
			searchParams:mainSearchData,
			queryParams:function(){
				return{}
			},
			onClickRow:function(item,$element){

			},
			onLoadSuccess:function(){

			},
			url:'/system/sysDiv/querylistByPage',
			columns:[{
				checkbox: true
			},{
				field: 'tsSysDivId',
				title: 'id',
				align: 'center',
				sortable:true
			},{
				field: 'no',
				title: 'div组件编号',
				align: 'center',
				sortable:true
			},{
				field: 'name',
				title: 'div组件名称',
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
	var defaultTable=type=='add'?'':'tableSysDiv';
	Ew.dialog('mainFromEdit',{
		title:title,
		btnValues:[{
			btnId:'btnSave',
			text:'保存',
			formid:'form',
			onClick:function(data){
				if(type=='change'){
					data.tsSysDivId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tsSysDivId;
				}
				datas = JSON.stringify(data);
				var url = (type=='add'?'/system/sysDiv/add':'/system/sysDiv/update');
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#mainFromEdit').modal('hide');
					$('#tableSysDiv').bootstrapTable('refresh');
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
				idName:'textNo',
				text:'div组件编号',
				field:'no',
				valid:['notEmpty',{type:"string",min:0,max:200}],
				disabled:type=='add'?false:false
			},{
				idName:'textName',
				text:'div组件名称',
				field:'name',
				valid:['notEmpty',{type:"string",min:0,max:50}],
				disabled:type=='add'?false:false
			},{
				idName:'areaRemark',
				text:'备注',
				field:'remark',
				n:2,
				valid:['notEmpty',{type:"string",min:0,max:200}],
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
