layui.use('layer',function(){
	layer=layui.layer;
	
});

$(function(){
	  var mydate = new Date();
	   var nDate = "" + mydate.getFullYear() + "-";
	   var mm = (mydate.getMonth()+1);
	   
	   if (mm<10) {
		   mm = "0"+mm;
	   }
	   nDate += mm + "-"; 
	   nDate += mydate.getDate()+" ";
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
		 
	  },{

			idName:'inputCom53',
			text:'产品',
			comboUrl:'/worktime/part/queryPartPartGroupSuggest',
			comboData:
				{
				id:['comboPlant'],
				field:['tmBasPlantId'],
				other:{}
				},
			comboId:'tmBasPartId',
			comboText:'part',
			field:'part'
			


		},{
			idName:'text5',
			field:'qualityName',
			text:'质检内容'
		},{
			idName:'day55',
			text:'质检时间从',
			field:'startTime',
			format:'fulldate',
			defaultValue:nDate+"00:00:00",
			limit:{date:'day56',type:'setStartDate'}
		},{
			idName:'day56',
			text:'质检时间到',
			field:'endTime',
			format:'fulldate',
			defaultValue:nDate+"23:59:59",
			limit:{date:'day55',type:'setEndDate'}
		}];

	Ew.search('.searchForm',{
		title:'查询',
		textValues:mainSearchData,
		btnValues:[{
			btnId:'btnSearch',
			text:'搜索',
			onClick:function(data){
				$('#tableQualityResult').bootstrapTable('refresh');
				$('#tableQualityResult').bootstrapTable('refreshOptions',{pageNumber:1});

			}
		},{
			btnId:'btnClear',
			text:'重置',
			tableid:['tableQualityResult']
		}]
	});

	//主表格
	Ew.table('.table',{
		btnValues:[{
			btnId:'btnExport',text:'导出',onClick:function(){
				var tmBasPlantId= $("#combo51").val();
				var sn= $("#inputComSN option:selected").text();
				var orderNo= $("#inputComOrder option:selected").text();
				var part= $("#inputCom53 option:selected").text();
				var qualityName= $("#text5").val();
				var startTime = $("#day55").val();
				var endTime =  $("#day56").val();
				window.top.location.href= apiUrl +'/qualityStation/qmSnQuality/export?tmBasPlantId='+tmBasPlantId+"&part="+part+"&sn="+sn+"&orderNo="+orderNo+"&qualityName="+qualityName+"&startTime="+startTime+
				"&endTime="+endTime
				
			}
		}],
		tableId:'tableQualityResult',
		tableValue:{
			searchParams:mainSearchData,
			queryParams:function(){
				return{}
			},
			onClickRow:function(item,$element){
				
			},
			onLoadSuccess:function(){
				
	        },
			url:'/qualityStation/qmSnQuality/queryQualityResList',
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
			    title: 'SN',
				align:'center',
				sortable:true,
				width:'180px'
			}, {
			    field: 'part',
			    title: '产品',
				align:'center',
				width:'180px',
				sortable:true
			}, {
				field: 'qualityNo',
			    title: '质检编号',
				align:'center',
				width:'150px',
				sortable:true
			}, {
				field: 'qualityName',
			    title: '质检内容',
				align:'center',
				sortable:true,
				width:'180px'
			}, {
				field: 'qualityType',
			    title: '质检类型',
				align:'center',
				sortable:true,
				width:'120px',
				formatter: function (value, row, index) {
	                  if (value == 'M'){
	                  	return '原材料';
	                  } else if (value == 'S'){
	                  	return '半成品';	
	                  } else if (value == 'P'){
	                	  return '成品';	
	                  }else {
	                	  
	                  }
	              }
			}, {
				field: 'qualityResult',
			    title: '质检结果',
				align:'center',
				sortable:true,
				width:'120px',
				formatter: function (value, row, index) {
	                  if (value == 1){
	                  	return '合格';
	                  }else if(value==0){
	                	  return '不合格';
	                  }else {
	                	  
	                  }
	              }
			}, {
				field: 'qualityUloc',
			    title: '质检工位',
				align:'center',
				sortable:true,
				width:'150px'
				
			}, {
				field: 'qualityTime',
			    title: '质检时间',
				align:'center',
				sortable:true
				
			}, {
				field: 'operator',
			    title: '操作人',
				align:'center',
				sortable:true
				
			}]
		}
	});
})
