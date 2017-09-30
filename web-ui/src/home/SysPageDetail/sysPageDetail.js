layui.use('layer',function(){
	layer=layui.layer;
});

$(function(){
	//搜索条件
	var mainSearchData=[{
		idName:'textSearchUserNo',
		text:'页面',
		field:'tsSysPageId'
	}]

	Ew.search('.searchForm',{
		title:'查询',
		textValues:mainSearchData,
		btnValues:[{
			btnId:'btnSearch',
			text:'搜索',
			onClick:function(data){
				$('#tableSysPageDetail').bootstrapTable('refresh');
			}
		},{
			btnId:'btnClear',
			text:'重置',
			tableid:['tableSysPageDetail']
		}]
	});

	//主表格
	Ew.table('.mainTable',{
		btnValues:[{
			btnId:'BtnAdd',text:'新增',onClick:function(){
				daliogShow('add');
			}
		},{
			btnId:'BtnEdit',text:'编辑',otherOption:[{id:'tableSysPageDetail',selectNum: 1}],onClick:function(){
				daliogShow('change');
			}
		},{
			btnId:'BtnDelete',text:'删除',isTrue:true,otherOption:[{id:'tableSysPageDetail',selMinNum: 1}],onClick:function(){
				var rows = $('#tableSysPageDetail').bootstrapTable('getSelections');
				ids = [];
				var flag = true;
				$.each(rows,function(index,row){
					ids.push(row.tsSysPageDetailId);
				});
				datas = JSON.stringify({tsSysPageDetailId : ids});
				var url = '/system/sysPageDetail/delete'
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#tableSysPageDetail').bootstrapTable('refresh');
				});
			}
		},{
			btnId:'BtnExportTpl',text:'模板下载',onClick:function(){
				window.top.location.href= apiUrl +'/system/sysPageDetail/exportTpl'
			}
		},{
			btnId:'BtnInput',text:'导入',onClick:function(){
			}
		},{
			btnId:'BtnExport',text:'导出',onClick:function(){
				window.top.location.href= apiUrl +'/system/sysPageDetail/export'
			}
		}],
		tableId:'tableSysPageDetail',
		tableValue:{
			searchParams:mainSearchData,
			queryParams:function(){
				return{}
			},
			onClickRow:function(item,$element){

			},
			onLoadSuccess:function(){

			},
			url:'/system/sysPageDetail/querylistByPage',
			columns:[{
				checkbox: true
			},{
				field: 'tsSysPageDetailId',
				title: 'id',
				align: 'center',
				sortable:true
			},{
				field: 'tsSysPageId',
				title: '页面设置id',
				align: 'center',
				sortable:true
			},{
				field: 'tsSysDivId',
				title: 'div组件id',
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
				field: 'pointX',
				title: 'x坐标',
				align: 'center',
				sortable:true
			},{
				field: 'pointY',
				title: 'y坐标',
				align: 'center',
				sortable:true
			},{
				field: 'startPoint',
				title: '起始坐标位置',
				align: 'center',
				sortable:true
			},{
				field: 'leftPoint',
				title: '左边坐标位置',
				align: 'center',
				sortable:true
			},{
				field: 'top',
				title: '上边坐标位置',
				align: 'center',
				sortable:true
			},{
				field: 'width',
				title: '面板宽度百分比',
				align: 'center',
				sortable:true
			},{
				field: 'height',
				title: '面板高度百分比',
				align: 'center',
				sortable:true
			}]
		}
	});
})

function daliogShow(type){
	var title=type=='add'?'新增':'编辑';
	var defaultTable=type=='add'?'':'tableSysPageDetail';
	Ew.dialog('mainFromEdit',{
		title:title,
		btnValues:[{
			btnId:'btnSave',
			text:'保存',
			formid:'form',
			onClick:function(data){
				if(type=='change'){
					data.tsSysPageDetailId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tsSysPageDetailId;
				}
				datas = JSON.stringify(data);
				var url = (type=='add'?'/system/sysPageDetail/add':'/system/sysPageDetail/update');
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#mainFromEdit').modal('hide');
					$('#tableSysPageDetail').bootstrapTable('refresh');
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
				idName:'textTsSysPageId',
				text:'页面设置id',
				field:'tsSysPageId',
				valid:['notEmpty',{type:"string",min:0,max:200}],
				disabled:type=='add'?false:true
			},{
				idName:'textTsSysDivId',
				text:'div组件id',
				field:'tsSysDivId',
				valid:['notEmpty',{type:"string",min:0,max:200}],
				disabled:type=='add'?false:false
			},{
				idName:'numberProw',
				text:'行',
				field:'prow',
				valid:['notEmpty',{type:"number",min:0,max:99}],
				disabled:type=='add'?false:false
			},{
				idName:'numberPcolumn',
				text:'列',
				field:'pcolumn',
				valid:['notEmpty',{type:"number",min:0,max:99}],
				disabled:type=='add'?false:false
			},{
				idName:'numberPointX',
				text:'x坐标',
				field:'pointX',
				valid:['notEmpty',{type:"number",min:0,max:99}],
				disabled:type=='add'?false:false
			},{
				idName:'numberPointY',
				text:'y坐标',
				field:'pointY',
				valid:['notEmpty',{type:"number",min:0,max:99}],
				disabled:type=='add'?false:false
			},{
				idName:'numberStartPoint',
				text:'起始坐标位置',
				field:'startPoint',
				valid:['notEmpty',{type:"number",min:0,max:99}],
				disabled:type=='add'?false:false
			},{
				idName:'numberLeftPoint',
				text:'左边坐标位置',
				field:'leftPoint',
				valid:['notEmpty',{type:"number",min:0,max:99}],
				disabled:type=='add'?false:false
			},{
				idName:'numberTop',
				text:'上边坐标位置',
				field:'top',
				valid:['notEmpty',{type:"string",min:0,max:50}],
				disabled:type=='add'?false:false
			},{
				idName:'numberWidth',
				text:'面板宽度百分比',
				field:'width',
				valid:['notEmpty',{type:"string",min:0,max:50}],
				disabled:type=='add'?false:false
			},{
				idName:'numberHeight',
				text:'面板高度百分比',
				field:'height',
				valid:['notEmpty',{type:"string",min:0,max:50}],
				disabled:type=='add'?false:false
			}],
			defaultTable:defaultTable
		}
	})
}
