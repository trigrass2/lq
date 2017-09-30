layui.use('layer',function(){
	layer=layui.layer;
});
$(function(){
	//搜索条件
	var mainSearchData=[{
		idName:'textSN',
		text:'SN',
		comboId:'sn',
		comboText:'sn',
		field:'newSn'
	}]

	Ew.search('.searchForm',{
		title:'查询',
		textValues:mainSearchData,
		btnValues:[{
			btnId:'btnSearch',
			text:'搜索',
			onClick:function(data){
				console.log(data)
				$('#tableQmTrace').bootstrapTable('refreshOptions',{pageNumber:1});
			}
		},{
			btnId:'btnClear',
			text:'重置',
      tableid:['tableQmTrace']
		}]
	});
	//主表格
	Ew.table('.mainTable',{
		tableId:'tableQmTrace',
		tableValue:{
			searchParams:mainSearchData,
			queryParams:function(){
				return{}
			},
			onClickRow:function(item,$element){

			},
			onLoadSuccess:function(){},
			url:'/system/qmTrace/queryBySn',
			columns:[{
				checkbox: true
			},{
				field: 'sn',
				title: '产品SN',
				align: 'center',
				sortable:true
			},{
				field: 'traceType',
				title: '关键件类型',
				align: 'center',
				sortable:true
			},{
				field: 'part',
				title: '零件',
				align: 'center',
				sortable:true
			},{
				field: 'ttQmSnNo',
				title: '关键件SN',
				align: 'center',
				sortable:true
			},{
				field: 'qty',
				title: '需求数量',
				align: 'center',
				sortable:true
			},{
				field: 'matchQty',
				title: '已匹配数量',
				align: 'center',
				sortable:true
			},{
				field: 'partType3',
				title: '追溯属性',
				align: 'center',
				sortable:true
			}]
		}
	});
})
