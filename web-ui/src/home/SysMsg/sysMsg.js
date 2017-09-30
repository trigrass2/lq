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
		idName:'textSearchMsg',
		text:'提示信息',
		field:'msg'
	},{
		idName:'textSearchRemark',
		text:'备注',
		field:'remark'		
	}]

	Ew.search('.searchForm',{
		title:'查询',
		textValues:mainSearchData,
		btnValues:[{
			btnId:'btnSearch',
			text:'搜索',
			onClick:function(data){
				$('#tableSysMsg').bootstrapTable('refreshOptions',{pageNumber:1});
			}
		},{
			btnId:'btnClear',
			text:'重置',
			tableid:['tableSysMsg']
		}]
	});
	Ew.getDictVal(['LANGUAGE_INSTALL'],function (re) {	
		//主表格
		Ew.table('.mainTable',{
			btnValues:[{
				btnId:'btnAdd',text:'新增',onClick:function(){
					daliogShow('add');
				}
			},{
				btnId:'btnEdit',text:'编辑',otherOption:[{id:'tableSysMsg',selectNum: 1}],onClick:function(){
					daliogShow('change');
				}
			},{
				btnId:'btnDelete',text:'删除',isTrue:true,otherOption:[{id:'tableSysMsg',selMinNum: 1}],onClick:function(){
					var rows = $('#tableSysMsg').bootstrapTable('getSelections');
					ids = [];
					var flag = true;
					$.each(rows,function(index,row){
						ids.push(row.tsSysMsgId);
					});
					datas = JSON.stringify({tsSysMsgId : ids});
					var url = '/system/sysMsg/delete'
					$.when(Ew.ewAjax(url,datas)).done(function(results){
						$('#tableSysMsg').bootstrapTable('refreshOptions',{pageNumber:1});
					});
				}
			},{
				btnId:'btnDownload',text:'模板下载',onClick:function(){
					var  url ='/system/sysMsg/exportTpl';
			        window.top.location.href = Ew.apiUrl +url;
				}
			},{
				btnId:'btnImport',text:'导入',url:'/system/sysMsg/import',tableId:'tableSysMsg'
					},{
				btnId:'btnExport',text:'导出',onClick:function(){
					var no = $('#textSearchNo').val();
					var msg = $('#textSearchMsg').val();
					var remark = $('#textSearchRemark').val();
					window.top.location.href= apiUrl +'/system/sysMsg/export?no='+no+'&msg='+msg+'&remark='+remark;
				}
			}],
			tableId:'tableSysMsg',
			tableValue:{
				searchParams:mainSearchData,
				queryParams:function(){
					return{}
				},
				onClickRow:function(item,$element){
	
				},
				onLoadSuccess:function(){
	
				},
				url:'/system/sysMsg/querylistByPage',
				columns:[{
					checkbox: true
				},{
					field: 'no',
					title: '编号',
					align: 'center',
					width:'120px',
					sortable:true
				},{
					field: 'languageType',
					title: '语言',
					align: 'center',
					sortable:true,
					width:'120px',
					formatter: function (value, row, index) {
	                    return re.LANGUAGE_INSTALL[value];
	                }
				},{
					field: 'msg',
					title: '提示信息',
					align: 'center',
					sortable:true,
					width:'120px'
				},{
					field: 'remark',
					title: '备注',
					align: 'center',
					width:'120px',
					sortable:true
				}]
			}
		});
	});
})

function daliogShow(type){
	var title=type=='add'?'新增':'编辑';
	var defaultTable=type=='add'?'':'tableSysMsg';
	Ew.dialog('mainFromEdit',{
		title:title,
		btnValues:[{
			btnId:'btnSave',
			text:'保存',
			formid:'form',
			onClick:function(data){
				if(type=='change'){
					data.tsSysMsgId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tsSysMsgId;
				}
				datas = JSON.stringify(data);
				var url = (type=='add'?'/system/sysMsg/add':'/system/sysMsg/update');
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#mainFromEdit').modal('hide');
					/*$('#tableSysMsg').bootstrapTable('refresh');*/
					$('#tableSysMsg').bootstrapTable('refreshOptions',{pageNumber:1});
				});
			}
		},{
			btnId:'btnCancel',
			text:'取消'
		}],
		form:{
			formId:'form',
			columnNum:1,
			listWidth:250,
			formList:[{
				idName:'textNo',
				text:'编号',
				field:'no',
				valid:['notEmpty',{type:"string",min:0,max:50}],
				disabled:type=='add'?false:true
			},{
				idName:'comboLanguage_type',
				text:'语言',
				field:'languageType',
				comboUrl:'/system/codeList/getSelect',
				comboData:'LANGUAGE_INSTALL',
				comboId:'no',
				comboText:'name',
				valid:['notEmpty'],
				disabled:type=='add'?false:false
			},{
				idName:'textMsg',
				text:'提示信息',
				field:'msg',
				valid:['notEmpty',{type:"string",min:0,max:200}],
				disabled:type=='add'?false:false
			},{
				idName:'textRemark',
				text:'备注',
				field:'remark',
				valid:[{type:"string",min:0,max:200}],
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
