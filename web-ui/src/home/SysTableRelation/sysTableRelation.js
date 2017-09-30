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
		idName:'textSearchColumnNo',
		text:'字段名',
		field:'columnNo'
	},{
		idName:'textSearchPTableNo',
		text:'关联表名',
		field:'ppTableNo'
	},{
		idName:'textSearchPColumnNo',
		text:'关联字段名',
		field:'ppColumnNo'		
	}]

	Ew.search('.searchForm',{
		title:'查询',
		textValues:mainSearchData,
		btnValues:[{
			btnId:'btnSearch',
			text:'搜索',
			onClick:function(data){
				$('#tableSysTableRelation').bootstrapTable('refreshOptions',{pageNumber:1});
			}
		},{
			btnId:'btnClear',
			text:'重置',
			tableid:['tableSysTableRelation']
		}]
	});

	//主表格
	Ew.table('.mainTable',{
		btnValues:[{
			btnId:'btnAdd',text:'新增',onClick:function(){
				daliogShow('add');
			}
		},{
			btnId:'btnDelete',text:'删除',isTrue:true,otherOption:[{id:'tableSysTableRelation',selMinNum: 1}],onClick:function(){
				var rows = $('#tableSysTableRelation').bootstrapTable('getSelections');
				ids = [];
				var flag = false;
				$.each(rows,function(index,row){
					if (row.isEdit==1){
						ids.push(row.tsSysTableRelationId);
					} else {
						flag = true;
					}
				});
				if(flag){
					layer.alert('有不能编辑的数据,不能删除！', {icon: 7});
					return;
				}
				datas = JSON.stringify({tsSysTableRelationId : ids});
				var url = '/system/sysTableRelation/delete'
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#tableSysTableRelation').bootstrapTable('refreshOptions',{pageNumber:1});
				});
			}
		},{
			btnId:'btnExportTpl',text:'模板下载',onClick:function(){
				  var  url ='/system/sysTableRelation/exportTpl';
		           window.top.location.href = Ew.apiUrl +url;
			}
		},{
			btnId:'imp',text:'导入',url:'/system/sysTableRelation/import',tableId:'tableSysTableRelation'
				},{
			btnId:'btnExport',text:'导出',onClick:function(){
				var tableNo = $('#textSearchTableNo').val();
				var columnNo = $('#textSearchColumnNo').val();
				var ppTableNo = $('#textSearchPTableNo').val();
				var ppColumnNo = $('#textSearchPColumnNo').val();
				window.top.location.href= apiUrl +'/system/sysTableRelation/export?tableNo='+tableNo+'&columnNo='+columnNo+'&ppTableNo='+ppTableNo+'&ppColumnNo='+ppColumnNo;
			}
		}],
		tableId:'tableSysTableRelation',
		tableValue:{
			searchParams:mainSearchData,
			queryParams:function(){
				return{}
			},
			onClickRow:function(item,$element){

			},
			onLoadSuccess:function(){

			},
			url:'/system/sysTableRelation/querylistByPage',
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
				field: 'ppTableNo',
				title: '关联表名',
				align: 'center',
				sortable:true,
				width:'120px'
			},{
				field: 'ppTableName',
				title: '关联表注释',
				align: 'center',
				sortable:true,
				width:'120px'
			},{
				field: 'ppColumnNo',
				title: '关联字段名',
				align: 'center',
				sortable:true,
				width:'120px'
			},{
				field: 'ppColumnName',
				title: '关联字段注释',
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
	var defaultTable=type=='add'?'':'tableSysTableRelation';
	var isEdit=type=='add'?'1':$('#'+defaultTable).bootstrapTable('getSelections')[0].isEdit;
	Ew.dialog('mainFromEdit',{
		title:title,
		btnValues:[{
			btnId:'btnSave',
			text:'保存',
			formid:'form',
			onClick:function(data){
				if(type=='change'){
					data.tsSysTableRelationId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tsSysTableRelationId;
				}
				datas = JSON.stringify(data);
				var url = (type=='add'?'/system/sysTableRelation/add':'/system/sysTableRelation/update');
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#mainFromEdit').modal('hide');
					$('#tableSysTableRelation').bootstrapTable('refresh');
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
			formList:[{
				idName:'comboTableNo',
				text:'表名',
				field:'tableNo',
				isSearch:type=='add'?true:false,
				comboUrl:'/system/sysTable/queryTableNoSelect',
				comboId:'tableNo',
				comboText:'tableNo',
				valid:['notEmpty'],
				disabled:isEdit=='1'?false:true,
				contentType:true,
			    onClick:function(data){
			    	datas = JSON.stringify({name:$('#comboTableNo').val()});
			    	$.when(Ew.ewAjax('/system/sysTable/queryTableNoSelect',datas,'','',true)).done(function(results){
			    		$('#textTableName').val(results[0].tableName);
					});
			    }
			},{
				idName:'textTableName',
				text:'表名注释',
				field:'tableName',
				disabled:type=='add'?true:true
			},{
				idName:'comboColumnNo',
				text:'字段名',
				field:'columnNo',
				comboUrl:'/system/sysTable/queryColumnNoSelect',
				comboData:
				{
					id:['comboTableNo'],
					field:['tableName']
				},
				comboId:'columnNo',
				comboText:'columnNo',
				valid:['notEmpty'],
				contentType:true,
				isSearch:type=='add'?true:false,
				disabled:isEdit=='1'?false:true,
				onClick:function(data){
					datas = JSON.stringify({name:$('#comboColumnNo').val(),tableName:$('#comboTableNo').val()});
			    	$.when(Ew.ewAjax('/system/sysTable/queryColumnNoSelect',datas,'','',true)).done(function(results){
			    		$('#textColumnName').val(results[0].columnName);
					});
			    }
			},{
				idName:'textColumnName',
				text:'字段名注释',
				field:'columnName',
				disabled:type=='add'?true:true
			},{
				idName:'comboPTableNo',
				text:'关联表名',
				field:'ppTableNo',
				comboUrl:'/system/sysTable/queryTableNoSelect',
				comboId:'tableNo',
				comboText:'tableNo',
				valid:['notEmpty'],
				contentType:true,
				isSearch:type=='add'?true:false,
				disabled:isEdit=='1'?false:true,
				onClick:function(data){
					datas = JSON.stringify({name:$('#comboPTableNo').val()});
			    	$.when(Ew.ewAjax('/system/sysTable/queryTableNoSelect',datas,'','',true)).done(function(results){
			    		$('#textPTableName').val(results[0].tableName);
					});
			    }
			},{
				idName:'textPTableName',
				text:'关联表名注释',
				field:'ppTableName',
				disabled:type=='add'?true:true
			},{
				idName:'comboPColumnNo',
				text:'关联字段名',
				field:'ppColumnNo',
				comboUrl:'/system/sysTable/queryColumnNoSelect',
				comboData:
				{
					id:['comboPTableNo'],
					field:['tableName']
				},
				comboId:'columnNo',
				comboText:'columnNo',
				valid:['notEmpty'],
				contentType:true,
				isSearch:type=='add'?true:false,
				disabled:isEdit=='1'?false:true,
				onClick:function(data){
					datas = JSON.stringify({name:$('#comboPColumnNo').val(),tableName:$('#comboPTableNo').val()});
			    	$.when(Ew.ewAjax('/system/sysTable/queryColumnNoSelect',datas,'','',true)).done(function(results){
			    		$('#textPColumnName').val(results[0].columnName);
					});
			    }
			},{
				idName:'textPColumnName',
				text:'关联字段名注释',
				field:'ppColumnName',
				disabled:type=='add'?true:true
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
