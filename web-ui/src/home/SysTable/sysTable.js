layui.use('layer',function(){
	layer=layui.layer;
});

$(function(){
	//搜索条件
	var mainSearchData=[{
		idName:'textSearchTableNo',
		text:'表名',
		field:'tableNo'
	},{
		idName:'textSearchTableName',
		text:'表名注释',
		field:'tableName'
	},{
		idName:'textSearchColumnNo',
		text:'字段名',
		field:'columnNo'
	},{
		idName:'textSearchColumnName',
		text:'字段名注释',
		field:'columnName'
	}]

	Ew.search('.searchForm',{
		title:'查询',
		textValues:mainSearchData,
		btnValues:[{
			btnId:'btnSearch',
			text:'搜索',
			onClick:function(data){
				$('#tableSysTable').bootstrapTable('refreshOptions',{pageNumber:1});
			}
		},{
			btnId:'btnClear',
			text:'重置',
			tableid:['tableSysTable']
		}]
	});

	//主表格
	Ew.table('.mainTable',{
		btnValues:[{
			btnId:'btnAdd',text:'新增',onClick:function(){
				daliogShow('add');
			}
		},{
			btnId:'btnEdit',text:'编辑',otherOption:[{id:'tableSysTable',selectNum: 1}],onClick:function(){
				daliogShow('change');
			}
		},{
			btnId:'btnDelete',text:'删除',isTrue:true,otherOption:[{id:'tableSysTable',selMinNum: 1}],onClick:function(){
				var rows = $('#tableSysTable').bootstrapTable('getSelections');
				ids = [];
				var flag = false;
				$.each(rows,function(index,row){
					if (row.isEdit==1){
						ids.push(row.tsSysTableId);
					} else {
						flag = true;
					}
				});
				if(flag){
					layer.alert('有不能编辑的数据,不能删除！', {icon: 7});
					return;
				}
				datas = JSON.stringify({tsSysTableId : ids});
				var url = '/system/sysTable/delete'
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#tableSysTable').bootstrapTable('refreshOptions',{pageNumber:1});
				});
			}
		},{
			btnId:'btnDownload',text:'模板下载',onClick:function(){
				  var  url ='/system/sysTable/exportTpl';
		           window.top.location.href = Ew.apiUrl +url;
			}
		},{
			btnId:'btnImport',text:'导入',url:'/system/sysTable/import',tableId:'tableSysTable'
				},{
			btnId:'btnExport',text:'导出',onClick:function(){
				var tableNo = $('#textSearchTableNo').val();
				var tableName = $('#textSearchTableName').val();
				var columnNo = $('#textSearchColumnNo').val();
				var columnName = $('#textSearchColumnName').val();
				window.top.location.href= apiUrl +'/system/sysTable/export?tableNo='+tableNo+'&tableName='+tableName+'&columnNo='+columnNo+'&columnName='+columnName;
			}
		}],
		tableId:'tableSysTable',
		tableValue:{
			searchParams:mainSearchData,
			queryParams:function(){
				return{}
			},
			onClickRow:function(item,$element){
				
			},
			onLoadSuccess:function(){
				
			},
			url:'/system/sysTable/querylistByPage',
			columns:[{
				checkbox: true
			},{
				field: 'tableNo',
				title: '表名',
				align: 'center',
				sortable:true,
				width:'120px'
			},{
				field: 'tableName',
				title: '表名注释',
				align: 'center',
				sortable:true,
				width:'120px'
			},{
				field: 'columnNo',
				title: '字段名',
				align: 'center',
				sortable:true,
				width:'120px'
			},{
				field: 'columnName',
				title: '字段名注释',
				align: 'center',
				sortable:true,
				width:'120px'
			},{
				field: 'remark',
				title: '备注',
				align: 'center',
				sortable:true,
				width:'120px'
			},{
				field: 'isEdit',
				title: '前台编辑',
				align: 'center',
				sortable:true,
				width:'120px',
				formatter: function (value, row, index) {
                    if (value == 0){
                    	return '否';
                    }else if (value == 1){
                    	return '是';
                    }
                }
			}]
		}
	});
})

function daliogShow(type){
	var title=type=='add'?'新增':'编辑';
	var defaultTable=type=='add'?'':'tableSysTable';
	var isEdit=type=='add'?'1':$('#'+defaultTable).bootstrapTable('getSelections')[0].isEdit;
	Ew.dialog('mainFromEdit',{
		title:title,
		btnValues:[{
			btnId:'btnSave',
			text:'保存',
			formid:'form',
			onClick:function(data){
				if(type=='change'){
					data.tsSysTableId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tsSysTableId;
				}
				datas = JSON.stringify(data);
				var url = (type=='add'?'/system/sysTable/add':'/system/sysTable/update');
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#mainFromEdit').modal('hide');
					$('#tableSysTable').bootstrapTable('refresh');
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
				idName:'textTableNo',
				text:'表名',
				field:'tableNo',
				valid:['notEmpty',{type:"string",min:0,max:50}],
				symbolLimitYES:'yes',
				disabled:type=='add'?false:true
			},{
				idName:'textTableName',
				text:'表名注释',
				field:'tableName',
				valid:['notEmpty',{type:"string",min:0,max:200}],
				disabled:isEdit=='1'?false:true
			},{
				idName:'textColumnNo',
				text:'字段名',
				field:'columnNo',
				valid:['notEmpty',{type:"string",min:0,max:50}],
				symbolLimitYES:'yes',
				disabled:type=='add'?false:true
			},{
				idName:'textColumnName',
				text:'字段名注释',
				field:'columnName',
				valid:['notEmpty',{type:"string",min:0,max:200}],
				disabled:isEdit=='1'?false:true
			},{
				idName:'areaRemark',
				text:'备注',
				field:'remark',
				n:2,
				valid:[{type:"string",min:0,max:200}],
				disabled:isEdit=='1'?false:true
			},{
				idName:'switchIsEdit',
				text:'可前台编辑',
				field:'isEdit',
				ontext:'是',
				offtext:'否',
				disabled:isEdit=='1'?false:true
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
