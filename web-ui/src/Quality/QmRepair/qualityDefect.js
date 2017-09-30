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

			idName:'inputComPart',
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
			idName:'textDefectName',
			field:'defectName',
			text:'缺陷内容'
		},{
			idName:'textQualityName',
			field:'qualityName',
			text:'质检内容'
		},{
			idName:'dayStartTime',
			text:'质检时间从',
			field:'startTime',
			format:'fulldate',
			defaultValue:nDate+"00:00:00",
			limit:{date:'dayEndTime',type:'setStartDate'}
		},{
			idName:'dayEndTime',
			text:'质检时间到',
			field:'endTime',
			format:'fulldate',
			defaultValue:nDate+"23:59:59",
			limit:{date:'dayStartTime',type:'setEndDate'}
		}];

	Ew.search('.searchForm',{
		title:'查询',
		textValues:mainSearchData,
		btnValues:[{
			btnId:'btnSearch',
			text:'搜索',
			onClick:function(data){
				$('#tableQualityDefect').bootstrapTable('refresh');
				$('#tableQualityDefect').bootstrapTable('refreshOptions',{pageNumber:1});

			}
		},{
			btnId:'btnClear',
			text:'重置',
			tableid:['tableQualityDefect']
		}]
	});

	//主表格
	Ew.table('.table',{
		btnValues:[{
			btnId:'btnExport',text:'导出',onClick:function(){
				var tmBasPlantId= $("#comboPlant").val();
				var sn= $("#inputComSN option:selected").text();
				var orderNo= $("#inputComOrder option:selected").text();
				var part= $("#inputComPart option:selected").text();
				var qualityName= $("#textQualityName").val();
				var defectName= $("#textDefectName").val();
				var startTime = $("#dayStartTime").val();
				var endTime =  $("#dayEndTime").val();
				window.top.location.href= apiUrl +'/qualityStation/qmSnDefect/export?tmBasPlantId='+tmBasPlantId+"&part="+part+"&sn="+sn+"&orderNo="+orderNo+"&qualityName="+qualityName+"&startTime="+startTime+
				"&endTime="+endTime+"&defectName="+defectName
			}
		}],
		tableId:'tableQualityDefect',
		tableValue:{
			searchParams:mainSearchData,
			queryParams:function(){
				return{}
			},
			onClickRow:function(item,$element){
				
			},
			onLoadSuccess:function(){
				
	        },
			url:'/qualityStation/qmSnDefect/queryDefectResList',
			columns:[{
				checkbox: true
			}, {
				field: 'plant',
			    title: '工厂',
				align:'center',
				width:'180px',
				sortable:true
			}, {
				field: 'orderNo',
			    title: '订单',
				align:'center',
				width:'180px',
				sortable:true	
			},{
			    field: 'sn',
			    title: 'SN',
				align:'center',
				width:'180px',
				sortable:true,
				
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
				sortable:true
			}, {
				field: 'qualityName',
			    title: '质检内容',
			    width:'180px',
				align:'center',
				sortable:true
			}, {
				field: 'qualityUloc',
			    title: '质检工位',
				align:'center',
				sortable:true
				
			}, {
				field: 'qualityTime',
			    title: '质检时间',
				align:'center',
				width:'150px',
				sortable:true
				
			}, {
				field: 'defectNo',
			    title: '缺陷编号',
				align:'center',
				sortable:true,
				
			}, {
				field: 'defectName',
			    title: '缺陷名称',
				align:'center',
				width:'180px',
				sortable:true,
				
			}, {
				field: 'operator',
			    title: '操作人',
				align:'center',
				sortable:true
				
			}, {
				field: 'assignedUloc',
			    title: '指定工位',
				align:'center',
				sortable:true
				
			}, {
				field: 'repairUloc',
			    title: '维修工位',
				align:'center',
				sortable:true
				
			}, {
				field: 'repairResult',
			    title: '维修结果',
				align:'center',
				width:'120px',
				formatter: function (value, row, index) {
	                  if (value == 1){
	                  	return '正常';
	                  }else {
	                	  return '';
	                  }
	              },
				sortable:true,
				
				
			}, {
				field: 'repairSteps',
			    title: '维修步骤',
				align:'center',
				width:'180px',
				sortable:true
				
			}, {
				field: 'repairDate',
			    title: '维修时间',
				align:'center',
				width:'150px',
				sortable:true
				
			}, {
				field: 'repairBy',
			    title: '操作人',
				align:'center',
				sortable:true
				
			}]
		}
	});
})
