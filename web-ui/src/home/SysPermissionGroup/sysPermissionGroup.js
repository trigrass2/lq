layui.use('layer',function(){
	layer=layui.layer;
});
var row='';
$(function(){
	//搜索条件
	var mainSearchData=[{
		idName:'textSearchNo',
		text:'业务权限编号',
		field:'no'
	},{
		idName:'textSearchName',
		text:'业务权限名称',
		field:'name'
	},{
		idName:'textSearchUserNo',
		text:'用户名',
		field:'userNo'
	},{
		idName:'textSearchUserName',
		text:'中文姓名',
		field:'userName'
	}]

	Ew.search('.searchForm',{
		title:'查询',
		textValues:mainSearchData,
		listWidth:270,
		btnValues:[{
			btnId:'btnSearch',
			text:'搜索',
			onClick:function(data){
				$('#tableSysGroup').bootstrapTable('refreshOptions',{pageNumber:1});
			}
		},{
			btnId:'btnClear',
			text:'重置',
			tableid:['tableSysGroup','tableSysGroupCondition']
		}]
	});

	//主表格
	Ew.table('.mainTable',{
		btnValues:[{
			btnId:'btnAdd',text:'新增',onClick:function(){
				daliogShow('add');
			}
		},{
			btnId:'btnEdit',text:'编辑',otherOption:[{id:'tableSysGroup',selectNum: 1}],onClick:function(){
				daliogShow('change');
			}
		},{
			btnId:'btnDelete',text:'删除',isTrue:true,otherOption:[{id:'tableSysGroup',selMinNum: 1}],onClick:function(){
				var rows = $('#tableSysGroup').bootstrapTable('getSelections');
				ids = [];
				var flag = true;
				$.each(rows,function(index,row){
					ids.push(row.tsSysGroupId);
				});
				datas = JSON.stringify({tsSysGroupId : ids});
				var url = '/system/sysGroup/delete'
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#tableSysGroup').bootstrapTable('refreshOptions',{pageNumber:1});
				});
			}
		},{
			btnId:'btnExportTpl',text:'模板下载',onClick:function(){
				window.top.location.href= apiUrl +'/system/sysGroup/exportTpl'
			}
		},{
			btnId:'btnInput',text:'导入',onClick:function(){
			}
		},{
			btnId:'btnExport',text:'导出',onClick:function(){
				var No = $('#textSearchNo').val();
				var Name = $('#textSearchName').val();
				window.top.location.href= apiUrl +'/system/sysGroup/export'
			}
		},{
			btnId: 'btnAddSub', otherBtn:true, otherOption:[{id:'tableSysGroup',selectNum: 1}] //控制子表按钮是否 可用
		},{
			btnId: 'btnEditSub', otherBtn:true,otherOption:[{id:'tableSysGroup',selectNum: 1},{id:'tableSysGroupCondition',selectNum: 1}] //控制子表按钮是否 可用
		}],
		tableId:'tableSysGroup',
		tableValue:{
			searchParams:mainSearchData,
			queryParams:function(){
				return{}
			},
			onClickRow:function(item,$element){
				$('#tableSysGroupCondition').bootstrapTable('refreshOptions',{pageNumber:1});//或者{query:{}}直接设置查询条件
			},
			onLoadSuccess:function(){

			},
			url:'/system/sysGroup/querylistByPage',
			columns:[{
				checkbox: true
			},{
				field: 'no',
				title: '业务权限编号',
				align: 'center',
				sortable:true
			},{
				field: 'name',
				title: '业务权限名称',
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
	
	//子表格
	Ew.table('.subTable',{
		btnValues:[{
			btnId:'btnAddSub',text:'新增',otherOption:[{id:'tableSysGroup',selectNum: 1}],onClick:function(){
				daliogShowSub('add');
			}
		},{
			btnId:'btnDeleteSub',text:'删除',isTrue:true,otherOption:[{id:'tableSysGroupCondition',selMinNum: 1}],onClick:function(){
				var rows = $('#tableSysGroupCondition').bootstrapTable('getSelections');
				ids = [];
				var flag = true;
				$.each(rows,function(index,row){
					ids.push(row.trSysGroupUserId);
				});
				datas = JSON.stringify({trSysGroupUserId : ids});
				var url = '/system/sysGroupUser/deleteBatch'
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#tableSysGroupCondition').bootstrapTable('refreshOptions',{pageNumber:1});
				});
			}
		}],
		tableId:'tableSysGroupCondition',
		tableValue:{
			queryParams:function(){
				id = $('#tableSysGroup').bootstrapTable('getSelections')[0]?$('#tableSysGroup').bootstrapTable('getSelections')[0].tsSysGroupId:-1;
				return {tsSysGroupId:id};
			},
			onClickRow:function(item,$element){

			},
			onLoadSuccess:function(){

			},
			url:'/system/sysGroupUser/query',
			columns:[{
				checkbox: true
			},{	
				field: 'no',
				title: '用户名',
				align: 'center',
				sortable:true
			},{
				field: 'name',
				title: '中文姓名',
				align: 'center',
				sortable:true
			},{
				field: 'name_en',
				title: '英文姓名',
				align: 'center',
				sortable:true
			},{
				field: 'mail',
				title: '邮箱',
				align: 'center',
				sortable:true
			},{
				field: 'mobile',
				title: '手机号',
				align: 'center',
				sortable:true
			},{
				field: 'status',
				title: '状态',
				align: 'center',
				sortable:true
			}]
		}
	});
	
})

function daliogShow(type){
	var title=type=='add'?'新增':'编辑';
	var defaultTable=type=='add'?'':'tableSysGroup';
	Ew.dialog('mainFromEdit',{
		title:title,
		btnValues:[{
			btnId:'btnSave',
			text:'保存',
			formid:'form',
			onClick:function(data){
				if(type=='change'){
					data.tsSysGroupId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tsSysGroupId;
				}
				datas = JSON.stringify(data);
				var url = (type=='add'?'/system/sysGroup/add':'/system/sysGroup/update');
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#mainFromEdit').modal('hide');
					$('#tableSysGroup').bootstrapTable('refresh');
				});
			}
		},{
			btnId:'btnCancel',
			text:'取消'
		}],
		form:{
			formId:'form',
			columnNum:2,
			listWidth:270,
			formList:[{
				idName:'textNo',
				text:'业务权限编号',
				field:'no',
				valid:['notEmpty',{type:"string",min:0,max:20}],
				disabled:type=='add'?false:true
			},{
				idName:'textName',
				text:'业务权限名称',
				field:'name',
				valid:['notEmpty',{type:"string",min:0,max:50}],
				disabled:type=='add'?false:false
			},{
				idName:'areaRemark',
				text:'备注',
				field:'remark',
				n:2,
				valid:[{type:"string",min:0,max:200}],
				disabled:type=='add'?false:false
			}],
			defaultTable:defaultTable
		}
	})
}

function daliogShowSub(type){
	var title='用户设置';
	var defaultTable=type=='add'?'':'tableSysGroupCondition';
	Ew.dialog('mainFromEdit',{
		title:title,
		width:840,
		height:640,
		btnValues:[{
			btnId:'btnSaveUser',
			text:'保存',
//			formid:'form',
			onClick:function(){
				var data = {};
				data.tsSysGroupId = $('#tableSysGroup').bootstrapTable('getSelections')[0].tsSysGroupId;
				var rows = $('#tableSysUser').bootstrapTable('getSelections');
				ids = [];
				$.each(rows,function(index,row){
					ids.push(row.tsSysUserId);
				});
				data.tsSysUserId = ids
				datas = JSON.stringify(data);
				var url = (type=='add'?'/system/sysGroupUser/addDataGroupUser':'/system/sysGroupCondition/update');
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#mainFromEdit').modal('hide');
					$('#tableSysGroupCondition').bootstrapTable('refresh');
				});
			}
		},{
			btnId:'btnCancelUser',
			text:'取消'
		}],
		content:'<div class="panel panel-default searchUserForm" ></div><div class="userTable" style="float: left; width: 800px"></div>',
		onLoadsucess:function(){
			//搜索条件
			var userSearchData=[{
				idName:'textSubSearchUserNo',
				text:'用户名',
				field:'no'
			},{
				idName:'textSubSearchUserName',
				text:'中文名称',
				field:'name'
			}];

			Ew.search('.searchUserForm',{
				title:'查询',
				textValues:userSearchData,
				listWidth:290,
				btnValues:[{
					btnId:'btnSearchUser',
					text:'搜索',
					onClick:function(data){
						$('#tableSysUser').bootstrapTable('refreshOptions',{pageNumber:1});
					}
				},{
					btnId:'btnClearUser',
					text:'重置',
					tableid:['tableSysUser']
				}]
			});
			
			Ew.table('.userTable',{
				btnValues:[],
				tableId:'tableSysUser',
				tableValue:{
					height:'500px',
					searchParams:userSearchData,
					queryParams:function(){
						id = $('#tableSysGroup').bootstrapTable('getSelections')[0]?$('#tableSysGroup').bootstrapTable('getSelections')[0].tsSysGroupId:-1;
						return {tsSysRoleId:id};
					},
					onClickRow:function(item,$element){
						
					},
					onLoadSuccess:function(){

					},
					url:'/system/sysGroupUser/queryDataGroupUserAdd',
					columns:[{
						checkbox: true
					},{
						field: 'no',
						title: '用户名',
						align: 'center',
						sortable:true
					},{
						field: 'name',
						title: '中文名称',
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
		}
	})
}

