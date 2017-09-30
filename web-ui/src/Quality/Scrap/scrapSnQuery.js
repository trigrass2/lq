layui.use('layer',function(){
	layer=layui.layer;
	
});

$(function(){
	//搜索条件
	 var mainSearchData=[{
		  idName:'comboPlant',
		  text:'工厂',
		  comboUrl:'/base/plant/publicPlantSelect',
		  comboId:'tmBasPlantId',
		  comboText:'plant',
		  field:'tmBasPlantId',
		
	  },{
		  idName:'inputComSN',
		  text:'SN',
		  comboUrl:"/order/ppordersn/querySn",
		  comboId:'sn',
		  comboText:'sn',
		  field:'sn'
		  
	  
	  },{
		  idName:'inputComOrder',
		  text:'订单编号',
		  comboUrl:"/order/ppordersn/queryOrder",
		  comboId:'ttPpOrderId',
		  comboText:'order_no',
		  contentType:true,
		  field:'orderNo'
		 
	  }];

	Ew.search('.searchForm',{
		title:'查询',
		textValues:mainSearchData,
		btnValues:[{
			btnId:'btnSearch',
			text:'搜索',
			onClick:function(data){
				$('#tableScrapSn').bootstrapTable('refresh');
				$('#tableScrapSn').bootstrapTable('refreshOptions',{pageNumber:1});

			}
		},{
			btnId:'btnClear',
			text:'重置',
			tableid:['tableScrapSn']
		}]
	});

	//主表格
	Ew.table('.table',{
		btnValues:[{
			btnId:'btnExport',text:'导出',onClick:function(){
				daliogShow('add')
			}
		}],
		tableId:'tableScrapSn',
		tableValue:{
			searchParams:mainSearchData,
			queryParams:function(){
				return{}
			},
			onClickRow:function(item,$element){
				
			},
			onLoadSuccess:function(){
				
	        },
			url:'/qualityStation/qmScrap/queryScrapSnList',
			columns:[{
				checkbox: true
			}, {
				field: 'plant',
			    title: '工厂',
				align:'center',
				sortable:true,
				width:'180px'
				
			}, {
				field: 'orderNo',
			    title: '订单',
				align:'center',
				sortable:true,
				width:'150px'
			
			},{
			    field: 'sn',
			    title: 'sn',
				align:'center',
				sortable:true,
				
			}, {
			    field: 'part',
			    title: '产品',
				align:'center',
				sortable:true
			}, {
				field: 'partGroup',
			    title: '产品组',
				align:'center',
				sortable:true
			}, {
				field: 'scrapNo',
			    title: '报废编号',
				align:'center',
				sortable:true
			}, {
				field: 'scrapName',
			    title: '报废描述',
				align:'center',
				sortable:true,
				width:'180px'
			}, {
				field: 'scrapTime',
			    title: '操作时间',
				align:'center',
				sortable:true
				
			}, {
				field: 'operator',
			    title: '操作人',
				align:'center',
				sortable:true
				
			}, {
				field: 'scrapUloc',
			    title: '操作工位',
				align:'center',
				sortable:true
				
			}]
		}
	});
})
