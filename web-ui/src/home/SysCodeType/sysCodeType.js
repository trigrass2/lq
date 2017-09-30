layui.use('layer',function(){
	layer=layui.layer;
});

$(function(){
	//搜索条件
	var mainSearchData=[{
		idName:'textSearchNo',
		text:'编码类型',
		field:'no'
	},{
		idName:'textSearchName',
		text:'类型名称',
		field:'name'
	},{
		idName:'textlistNo',
		text:'编码值',
		field:'detailNo'
	},{
		idName:'textlistName',
		text:'编码值名称',
		field:'detailName',
		symbolLimit:'no',
	}]

	Ew.search('.searchForm',{
		title:'查询',
		textValues:mainSearchData,
		btnValues:[{
			btnId:'btnSearch',
			text:'搜索',
			onClick:function(data){
				$('#tableSysCodeType').bootstrapTable('refreshOptions',{pageNumber:1});
				$('#tableSysCodeList').bootstrapTable('removeAll');
			}
		},{
			btnId:'btnClear',
			text:'重置',
			tableid:['tableSysCodeType','tableSysCodeList']
		}]
	});
	
	Ew.getDictVal(['YESORNO'],function (re) {
		//主表格
		Ew.table('.mainTable',{
			btnValues:[{
				btnId:'btnAdd',text:'新增',onClick:function(){
					daliogShow('add');
				}
			},{
				btnId:'btnEdit',text:'编辑',otherOption:[{id:'tableSysCodeType',selectNum: 1,seleMaxNum: 1}],onClick:function(){
					daliogShow('change');
				}
			},{
				btnId:'btnDelete',text:'删除',isTrue:true,otherOption:[{id:'tableSysCodeType',selMinNum: 1}],onClick:function(){
					var rows = $('#tableSysCodeType').bootstrapTable('getSelections');
					var flag = false;
					var ids = [];
					$.each(rows,function(index,row){
						if (row.isEdit==1){
							ids.push(row.tsSysCodeTypeId);
						} else {
							flag = true;
						}
					});
					if(flag){
						mesCom.msgWarning('存在不可编辑的数据,不能删除！');
						return;
					}
					datas = JSON.stringify(ids);
					var url = '/system/codeType/delete'
					$.when(Ew.ewAjax(url,datas)).done(function(results){
						$('#tableSysCodeType').bootstrapTable('refreshOptions',{pageNumber:1});
					});
				}
			},{
				btnId: 'btnAddSub', otherBtn:true, otherOption:[{id:'tableSysCodeType',selectNum: 1}] //控制子表按钮是否 可用
			},{
				btnId: 'btnEditSub', otherBtn:true,otherOption:[{id:'tableSysCodeType',selectNum: 1},{id:'tableSysCodeList',selectNum: 1}] //控制子表按钮是否 可用
			},{
				btnId: 'btnDeleteSub', otherBtn:true,otherOption:[{id:'tableSysCodeType',selectNum: 1},{id:'tableSysCodeList',selMinNum: 1}] //控制子表按钮是否 可用
			}],
			tableId:'tableSysCodeType',
			tableValue:{
				searchParams:mainSearchData,
				queryParams:function(){
					return{}
				},
				onClickRow:function(item,$element){
					$('#tableSysCodeList').bootstrapTable('refreshOptions',{pageNumber:1});//或者{query:{}}直接设置查询条件
				},
				onLoadSuccess:function(){
	
				},
				url:'/system/codeType/querylistByPage',
				columns:[{
					checkbox: true
				},{
					field: 'no',
					title: '编码类型',
					align: 'center',
					sortable:true,
					width:'120px'
				},{
					field: 'name',
					title: '名称',
					align: 'center',
					sortable:true,
					width:'120px'
				},{
					field: 'isEdit',
					title: '可前台编辑',
					align: 'center',
					sortable:true,
					width:'70px',
					formatter: function (value, row, index) {
	                    return re.YESORNO[value];
	                }
				},{
					field: 'remark',
					title: '备注',
					align: 'center',
					sortable:true,
					width:'70px'
				}]
			}
		});
	
		//子表格
		Ew.table('.subTable',{
			tableTitleSub:'编码值',
			btnValues:[{
				btnId:'btnAddSub',text:'新增',otherOption:[{id:'tableSysCodeType',selectNum: 1}],onClick:function(){
					var isEdit=$('#tableSysCodeType').bootstrapTable('getSelections')[0].isEdit;
					if(isEdit=='0'){
					    mesCom.msgWarning('该数据不可编辑！');
						return;
					}
					daliogShow_sub('add');
				}
			},{
				btnId:'btnEditSub',text:'编辑',otherOption:[{id:'tableSysCodeType',selectNum: 1},{id:'tableSysCodeList',selectNum: 1}],onClick:function(){
					var isEdit=$('#tableSysCodeType').bootstrapTable('getSelections')[0].isEdit;
					if(isEdit=='0'){
					    mesCom.msgWarning('该数据不可编辑！');
						return;
					}
					daliogShow_sub('change');
				}
			},{
				btnId:'btnDeleteSub',text:'删除',isTrue:true,otherOption:[{id:'tableSysCodeList',selMinNum: 1}],onClick:function(){
					var rows = $('#tableSysCodeList').bootstrapTable('getSelections');
					var isEdit=$('#tableSysCodeType').bootstrapTable('getSelections')[0].isEdit;
					if(isEdit=='0'){
					    mesCom.msgWarning('该数据不可编辑！');
						return;
					}
					var ids = [];
					var flag = true;
					$.each(rows,function(index,row){
						ids.push(row.tsSysCodeListId);
					});
					datas = JSON.stringify(ids);
					var url = '/system/codeList/delete'
					$.when(Ew.ewAjax(url,datas)).done(function(results){
						$('#tableSysCodeList').bootstrapTable('refreshOptions',{pageNumber:1});
						
					});
				}
			}],
			tableId:'tableSysCodeList',
			tableValue:{
				queryParams:function(){
					var getSelection = $('#tableSysCodeType').bootstrapTable('getSelections')[0];
					id = getSelection?(getSelection.hasOwnProperty('tsSysCodeTypeId')?getSelection.tsSysCodeTypeId:-1):-1;
					return {tsSysCodeTypeId:id};
				},
				onClickRow:function(item,$element){
					
				},
				onLoadSuccess:function(){
	
				},
				url:'/system/codeList/querylistByPage',
				columns:[{
					checkbox: true
				},{	
					field: 'listSeq',
					title: '顺序号',
					align: 'center',
					sortable:true,
					width:'60px'
				},{
					field: 'no',
					title: '编码值',
					align: 'center',
					sortable:true,
					width:'120px'
				},{
					field: 'name',
					title: '编码值名称',
					align: 'center',
					sortable:true,
					width:'120px'
				},{
					field: 'enable',
					title: '是否启用',
					align: 'center',
					sortable:true,
					formatter: function (value, row, index) {
	                    return re.YESORNO[value];
	                },
					width:'60px'
				},{
					field: 'remark',
					title: '备注',
					align: 'center',
					sortable:true,
					width:'60px'
				}]
			}
		});
	});
})

function daliogShow(type){
	var title=type=='add'?'新增':'编辑';
	var defaultTable=type=='add'?'':'tableSysCodeType';
	var isEdit=type=='add'?'1':$('#'+defaultTable).bootstrapTable('getSelections')[0].isEdit;
	Ew.dialog('mainFromEdit',{
		title:title,
		btnValues:[{
			btnId:'btnSave',
			text:'保存',
			formid:'form',
			onClick:function(data){
				if(type=='change'){
					if(isEdit=='0'){
					    mesCom.msgWarning('该数据不可编辑！');
					    $('#mainFromEdit').modal('hide');
						return;
					}
					data.tsSysCodeTypeId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tsSysCodeTypeId;
				}
				datas = JSON.stringify(data);
				var url = (type=='add'?'/system/codeType/add':'/system/codeType/update');
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#mainFromEdit').modal('hide');
					$('#tableSysCodeType').bootstrapTable('refresh');
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
				text:'编码类型',
				field:'no',
				valid:['notEmpty',{type:"string",min:0,max:20}],
				disabled:type=='add'?false:true
			},{
				idName:'textName',
				text:'类型名称',
				field:'name',
				valid:['notEmpty',{type:"string",min:0,max:50}],
				disabled:isEdit=='1'?false:true
			},{
				idName:'areaRemark',
				text:'备注',
				field:'remark',
				n:2,
				valid:['notEmpty',{type:"string",min:0,max:200}],
				disabled:isEdit=='1'?false:true
			},{
				idName:'switchIsEdit',
				text:'前端编辑',
				field:'isEdit',
				ontext:'是',
				offtext:'否',
				disabled:isEdit=='1'?false:true,
				defaultValue:1
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

function daliogShow_sub(type){
	var title=type=='add'?'新增':'编辑';
	var defaultTable=type=='add'?'':'tableSysCodeList';
	var isEdit=$('#tableSysCodeType').bootstrapTable('getSelections')[0].isEdit;
	Ew.dialog('mainFromEdit',{
		title:title,
		btnValues:[{
			btnId:'btnSaveSub',
			text:'保存',
			formid:'form1',
			onClick:function(data){
				if(type=='change'){
					data.tsSysCodeListId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tsSysCodeListId;
				}
				data.tsSysCodeTypeId = $('#tableSysCodeType').bootstrapTable('getSelections')[0].tsSysCodeTypeId;
				datas = JSON.stringify(data);
				var url = (type=='add'?'/system/codeList/add':'/system/codeList/update');
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#mainFromEdit').modal('hide');
					$('#tableSysCodeList').bootstrapTable('refresh');
				});
			}
		},{
			btnId:'btnCancelSub',
			text:'取消'
		}],
		form:{
			formId:'form1',
			columnNum:2,
			listWidth:250,
			formList:[{
				idName:'textNo',
				text:'编码类型',
				field:'codeno',
				valid:['notEmpty',{type:"string",min:0,max:50}],
				defaultValue:$('#tableSysCodeType').bootstrapTable('getSelections')[0].no,
				disabled:true
			},{
				idName:'textName',
				text:'类型名称',
				field:'codename',
				valid:['notEmpty',{type:"string",min:0,max:50}],
				defaultValue:$('#tableSysCodeType').bootstrapTable('getSelections')[0].name,
				disabled:true
			},{
				idName:'textListNo',
				text:'编码值',
				field:'no',
				valid:['notEmpty',{type:"string",min:0,max:20}],
				disabled:type=='change'?true:false
			},{
				idName:'textListName',
				text:'编码值名称',
				field:'name',
				valid:['notEmpty',{type:"string",min:0,max:50}],
				symbolLimit:'no',
			},{
				idName:'numberlistSeq',
				text:'顺序号',
				field:'listSeq',
				valid:['notEmpty',{type:'number',min:0,max:999}]
			},{
				idName:'areaRemark',
				text:'备注',
				field:'remark',
				n:2,
				valid:[{type:"string",min:0,max:200}]
			},{
				idName:'switchEnable',
				text:'是否启用',
				field:'enable',
				ontext:'是',
				offtext:'否',
				defaultValue:1
			},{
	        	idName:'textVersionSub',
				text:'版本号',
				field:'version',
				hidden:true
			}],
			defaultTable:defaultTable
		}
	})
}
