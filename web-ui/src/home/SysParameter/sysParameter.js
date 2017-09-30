layui.use('layer',function(){
	layer=layui.layer;
	
});

$(function(){
	//搜索条件
	var mainSearchData=[{
		idName:'textSearchNo',
		text:'编号',
		field:'no'
	},{
		idName:'textSearchName',
		text:'名称',
		field:'name'
	},{
		idName:'textSearchRemark',
		text:'备注',
		field:'remark'		
	}];

	Ew.search('.searchForm',{
		title:'查询',
		textValues:mainSearchData,
		btnValues:[{
			btnId:'btnSearch',
			text:'搜索',
			onClick:function(data){
				$('#tableSysParameter').bootstrapTable('refreshOptions',{pageNumber:1});
			}
		},{
			btnId:'btnClear',
			text:'重置',
			tableid:['tableSysParameter']
		}]
	});
	
	Ew.getDictVal(['YESORNO'], function (re) {
		//主表格
		Ew.table('.table',{
			btnValues:[{
				btnId:'btnAdd',text:'新增',onClick:function(){
					daliogShow('add')
				}
			},{
				btnId:'btnEdit',text:'编辑',otherOption:[{id:'tableSysParameter',selectNum: 1}],onClick:function(){
					daliogShow('change')
				}
			},{
				btnId:'btnDelete',text:'删除',isTrue:true,otherOption:[{id:'tableSysParameter',selMinNum: 1}],onClick:function(){
					var rows = $('#tableSysParameter').bootstrapTable('getSelections');
					var ids = [];
					var flag = false;
					$.each(rows,function(index,row){
						if (row.isEdit==1){
							ids.push(row.tsSysSettingId);
						} else {
							flag = true;
						}
					});
					if(flag){
						mesCom.msgWarning('有不能编辑的数据,不能删除！');
						return;
					}
					datas = JSON.stringify(ids);
					var url = '/system/setting/delete';
					$.when(Ew.ewAjax(url,datas)).done(function(results){
						$('#tableSysParameter').bootstrapTable('refreshOptions',{pageNumber:1});
		            });
				}
			}],
			tableId:'tableSysParameter',
			tableValue:{
				searchParams:mainSearchData,
				queryParams:function(){
					return{}
				},
				onClickRow:function(item,$element){
					
				},
				onLoadSuccess:function(){
					
		        },
				url:'/system/setting/querylistByPage',
				columns:[{
					checkbox: true
				},{
				    field: 'no',
				    title: '编号',
					align:'center',
					width:'150px',
					sortable:true
				}, {
				    field: 'name',
				    title: '名称',
					align:'center',
					width:'150px',
					sortable:true
				}, {
					field: 'value',
				    title: '对应值',
					align:'center',
					width:'120px',
					sortable:true
				}, {
					field: 'defaultValue',
					title: '系统默认值',
					align:'center',
					width:'120px',
					sortable:true
				}, {
					field: 'remark',
				    title: '备注',
					align:'center',
					width:'120px',
					sortable:true
				}, {
					field: 'isEdit',
				    title: '可编辑',
					align:'center',
					width:'60px',
					sortable:true,
					formatter: function (value, row, index) {
	                    return re.YESORNO[value];
	                }
				}]
			}
		});
	});
})


function daliogShow(type){
	var title=type=='add'?'新增':'编辑';
	var defaultTable=type=='add'?'':'tableSysParameter';
	var isEdit=type=='add'?'1':$('#'+defaultTable).bootstrapTable('getSelections')[0].isEdit;
	Ew.dialog('fromadd',{
		title:title,
		btnValues:[{
			btnId:'btnSave',
			text:'保存',
			formid:'form',
			onClick:function(data){
				if(type=='change'){
					if(isEdit!='0'){
						mesCom.msgWarning('该条数据不可修改');
						$('#fromadd').modal('hide');
						return
					}
					data.tsSysSettingId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tsSysSettingId;
				}
				datas = JSON.stringify(data);
				var url = (type=='add'?'/system/setting/add':'/system/setting/update');
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#fromadd').modal('hide');
					$('#tableSysParameter').bootstrapTable('refresh');
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
				text:'编号',
				field:'no',
				valid:['notEmpty',{type:"string",min:0,max:20}],
				n:2,
				disabled:type=='add'?false:true
			},{
				idName:'textName',
				text:'名称',
				field:'name',
				valid:['notEmpty',{type:"string",min:0,max:50}],
				n:2,
				disabled:isEdit=='1'?false:true
			},{
				idName:'textValue',
				text:'对应值',
				field:'value',
				valid:['notEmpty',{type:"string",min:0,max:20}],
				disabled:isEdit=='1'?false:true
			},{
				idName:'textdefaultValue',
				text:'系统默认值',
				field:'defaultValue',
				valid:['',{type:"string",min:0,max:20}],
				disabled:type=='add'?false:true
			},{
				idName:'areaRemark',
				text:'备注',
				field:'remark',
				valid:[''],
				n:2,
				disabled:isEdit=='1'?false:true
			},{
				idName:'switchIsEdit',
				text:'可编辑',
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

