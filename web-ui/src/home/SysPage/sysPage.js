layui.use('layer',function(){
	layer=layui.layer;
});

$(function(){
	//搜索条件
	var mainSearchData=[{
		idName:'textSearchUserNo',
		text:'用户',
		field:'userNo'
	}]

	Ew.search('.searchForm',{
		title:'查询',
		textValues:mainSearchData,
		btnValues:[{
			btnId:'btnSearch',
			text:'搜索',
			onClick:function(data){
				$('#tableSysPage').bootstrapTable('refreshOptions',{pageNumber:1});
			}
		},{
			btnId:'btnClear',
			text:'重置',
			tableid:['tableSysPage']
		}]
	});

	//主表格
	Ew.table('.mainTable',{
		btnValues:[{
			btnId:'btnAdd',text:'新增',onClick:function(){
				daliogShow('add');
			}
		},{
			btnId:'btnEdit',text:'编辑',otherOption:[{id:'tableSysPage',selectNum: 1}],onClick:function(){
				daliogShow('change');
			}
		},{
			btnId:'btnDelete',text:'删除',isTrue:true,otherOption:[{id:'tableSysPage',selMinNum: 1}],onClick:function(){
				var rows = $('#tableSysPage').bootstrapTable('getSelections');
				ids = [];
				var flag = true;
				$.each(rows,function(index,row){
					ids.push(row.tsSysPageId);
				});
				datas = JSON.stringify({tsSysPageId : ids});
				var url = '/system/sysPage/delete'
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#tableSysPage').bootstrapTable('refreshOptions',{pageNumber:1});
				});
			}
		},{
			btnId:'btnExportTpl',text:'模板下载',onClick:function(){
				window.top.location.href= apiUrl +'/system/sysPage/exportTpl'
			}
		},{
			btnId:'btnInput',text:'导入',onClick:function(){
			}
		},{
			btnId:'btnExport',text:'导出',onClick:function(){
				var User_no = $('#textSearchUser_no').val();
				window.top.location.href= apiUrl +'/system/sysPage/export'
			}
		}],
		tableId:'tableSysPage',
		tableValue:{
			searchParams:mainSearchData,
			queryParams:function(){
				return{}
			},
			onClickRow:function(item,$element){

			},
			onLoadSuccess:function(){

			},
			url:'/system/sysPage/querylistByPage',
			columns:[{
				checkbox: true
			},{
				field: 'tsSysPageId',
				title: 'id',
				align: 'center',
				sortable:true
			},{
				field: 'userNo',
				title: '用户',
				align: 'center',
				sortable:true
			},{
				field: 'tsSysResourceId',
				title: '资源id',
				align: 'center',
				sortable:true
			},{
				field: 'prow',
				title: '行',
				align: 'center',
				sortable:true
			},{
				field: 'pcolumn',
				title: '列',
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
	var defaultTable=type=='add'?'':'tableSysPage';
	Ew.dialog('mainFromEdit',{
		title:title,
		btnValues:[{
			btnId:'btnSave',
			text:'保存',
			formid:'form',
			onClick:function(data){
				if(type=='change'){
					data.tsSysPageId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tsSysPageId;
				}
				datas = JSON.stringify(data);
				var url = (type=='add'?'/system/sysPage/add':'/system/sysPage/update');
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#mainFromEdit').modal('hide');
					$('#tableSysPage').bootstrapTable('refresh');
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
				idName:'textUserNo',
				text:'用户',
				field:'userNo',
				valid:['notEmpty',{type:"string",min:0,max:32}],
				disabled:type=='add'?false:true
			},{
				idName:'textTsSysResourceId',
				text:'资源id',
				field:'tsSysResourceId',
				valid:['notEmpty',{type:"string",min:0,max:32}],
				disabled:type=='add'?false:false
			},{
				idName:'numberProw',
				text:'行',
				field:'prow',
				valid:['notEmpty',{type:"number",min:0,max:3}],
				disabled:type=='add'?false:false
			},{
				idName:'numberPcolumn',
				text:'列',
				field:'pcolumn',
				valid:['notEmpty',{type:"number",min:0,max:3}],
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
