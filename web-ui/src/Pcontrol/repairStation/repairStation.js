var tmBasUlocId=-1;
var tmBasRouteId = -1;
var qData= [];
var ttQmSnId;
 var ulocNo;
 var tmBasPlantId;
  var tableSearchData=[];
  var defectId = [];
  var notRepairDefectIds = [];
  var allDefectIds = [];
  var rForm = [{
		idName:'combo35',
		n:1.5,
		text:'维修结果',
		comboData:[
		           {
		       			id:'1',
		       			text:'正常'
		       		}
		           ],
	valid:['notEmpty']
	},
	{
		
		idName:'combo36',
		n:1.5,
		text:'维修类型',
		field:'repairType',
		comboUrl:'/repair/qmRepair/queryRepairInfo',
		comboData:JSON.stringify({
			tmQmRepairId:''
		}),
		
		comboId:'tmQmRepairId',
		comboText:'type',
		valid:['notEmpty'],
		onClick:function(data){
			if (data.id!=null && data.id!='') {
				$.when(Ew.ewAjax('/repair/qmRepair/queryRepairInfo',JSON.stringify({tmQmRepairId:data.id}))).done(function(results){
					
					$("#area37").val(results[0].repairSteps);
					
					
				});
				
			}else{
				$("#area37").val('');
			}
		}
	},
{
		
		idName:'area37',
		n:1.5,
		text:'维修步骤',
		field:'repairSteps',
	    disabled:true
	
	},
	{
		idName:'area38',
		n:1.5,
		text:'描述',
		field:'repairComments'
	}
	]
  
  var mainSearchData=[{
	  idName:'comboPlant',
	  text:'工厂',
	  comboUrl:'/base/plant/publicPlantSelect',
	  comboId:'tmBasPlantId',
	  comboText:'plant',
	  field:'tmBasPlantId',
	  onClick:function(data){
		  $('#comboWorkshop').val();
		  $('#comboLine').val();
		  $('#comboUloc').val();
		  Ew.selectLink({
			  comboUrl:'/base/workshop/publicWorkshopSelect',
			  comboData:JSON.stringify({tmBasPlantId:data.id}),
			  id:['comboWorkshop'],
			  comboId:'tmBasWorkshopId',
			  comboText:'workshop'
		  });
		  Ew.selectLink({
			  comboUrl:'/base/line/publicLineSelect',
			  comboData:JSON.stringify({tmBasPlantId:data.id}),
			  id:['comboLine'],
			  comboId:'tmBasLineId',
			  comboText:'line'
		  });
		  Ew.selectLink({
			  comboUrl:'/base/uloc/queryUlocSelectList',
			  comboData:{
				  id:['comboPlant'],
				  field:['pTmBasPlantId'],
				  other:{ulocType:['R']}
			  },
			  id:['comboUloc'],
			  comboId:'tmBasUlocId',
			  comboText:'ulocNo'
		  });
	  },
	  valid:['notEmpty']
  },{
	  idName:'comboWorkshop',
	  text:'车间',
	  comboUrl:'/base/workshop/publicWorkshopSelect',
	  comboId:'tmBasWorkshopId',
	  comboText:'workshop',
	  field:'tmBasWorkshopId',
	  onClick:function(data){
		  Ew.selectLink({
			  comboUrl:'/base/line/publicLineSelect',
			  comboData:JSON.stringify({tmBasWorkshopId:data.id}),
			  id:['comboLine'],
			  comboId:'tmBasLineId',
			  comboText:'line'
		  });
		  Ew.selectLink({
			  comboUrl:'/base/uloc/queryUlocSelectForInputWithLineId',
			  comboData:JSON.stringify({wTmBasWorkshopId:data.id}),
			  id:['comboUloc'],
			  comboId:'tmBasUlocId',
			  comboText:'ulocNo'
		  });
	  }
  },{
	  idName:'comboLine',
	  text:'产线',
	  comboUrl:'/base/line/publicLineSelect',
	  comboId:'tmBasLineId',
	  comboText:'line',
	  field:'tmBasLineId',
	  onClick:function(data){
		  Ew.selectLink({
			  comboUrl:'/base/uloc/queryUlocSelectForInputWithLineId',
			  comboData:JSON.stringify({lTmBasLineId:data.id}),
			  id:['comboUloc'],
			  comboId:'tmBasUlocId',
			  comboText:'ulocNo'
		  });
	  }
  
  },{
	  idName:'comboUloc',
	  text:'工位',
	  comboUrl:'/base/uloc/queryUlocSelectList',
	  comboData:{
		  id:['comboPlant'],
		  field:['pTmBasPlantId'],
		  other:{ulocType:['R']}
	  },
	  comboId:'tmBasUlocId',
	  comboText:'ulocNo',
	  field:'tmBasUlocId',
	  valid:['notEmpty'],
	  isSearch:true
	 
  },{
	  idName:'inputComSN',
	  text:'SN',
	  comboUrl:"/qualityStation/qmSnDefect/querySn",
	  comboId:'ttQmSnId',
	  comboText:'sn',
	  field:'ttQmSnId',
	 
	  keyTrue:function(data){
		  if($('#comboUloc').val()==null||$('#comboUloc').val()==""){
			  Ew.layer.msg('请选择工位！',{icon:7,time:1000});
			  $('#inputComSN').val('');
			  return
		  }
		  $('#comboOrder').val('');
		  $('#textPart').val('');
		  Ew.selectLink({
			  comboUrl:"/order/ppordersn/queryOrder",
			  comboData:JSON.stringify({sn:data}),
			  id:['comboOrder'],
			  comboId:'ttPpOrderId',
			  comboText:'order_no',
			  onSuccess:function(data){
				  if(data.length<1){
					  Ew.layer.msg('未查询到数据！',{icon:7,time:1000});
					  return;
				  }else {
					  $('#textPart').val(data[0].part_name);
					  $.ajax({
						  type: "POST",
						  url:apiUrl+'/order/ppordersn/queryRouteAndpart',
						  data:JSON.stringify({'ttPpOrderId':data[0].ttPpOrderId,'sn':$("#inputComSN").val()}),
						  contentType:'application/json;charset=UTF-8',
						  success: function(results){
							  if(results.results.length>0){
								  tmBasUlocId =$('#comboUloc').val();
								  tmBasRouteId =results.results[0].tmBasRouteId;
								  ttQmSnId = results.results[0].ttPpOrderSnId;
								  tableSearchData={'tmBasUlocId':$('#comboUloc').val(),'tmBasRouteId':results.results[0].tmBasRouteId,'tmBasPartId':results.results[0].tmBasPartId,'ttQmSnId':ttQmSnId,'tmBasPlantId':$("#comboPlant").val()};
								  $('#table1').bootstrapTable('refresh');
								  
							  }
						  }
					  });
				  }
			  }
		  });
	  }
  
  },{
	  idName:'comboOrder',
	  text:'订单编号',
	  comboUrl:"",
	  comboId:'ttPpOrderId',
	  comboText:'order',
	  field:'ttPpOrderId',
	  disabled:true
  },{
	  idName:'textPart',
	  text:'产品',
	  disabled:true
  }];
$(function(){
	//搜索条件

	

	
	Ew.search('.demoSearch',{
		title:'查询',
		textValues:mainSearchData
		
	});
	
	var aa=-1;
//主表格
	Ew.table('.demoTable',{
		btnValues:[{
			btnId:'btnPass',text:'完成维修',onClick:function(){
				daliogRepair();
				
				
			}
		},
		{
			btnId:'btnScrap',text:'报废',onClick:function(){
				daliogScrap();
				
			
			}
		}],
		tableId:'table1',
		
		tableValue:{
			pagination:false,
			onLoadSuccess:function(){
				tmBasPlantId = $("#comboPlant").val();
				 ulocNo = $("#comboUloc").find("option:selected").text();
				
				 var aData = $('#table1').bootstrapTable('getData');
				 for(var i=0;i<aData.length;i++){
					 var indx =  $.inArray(aData[i].ttQmDefectId,allDefectIds);
					 var idx =  $.inArray(aData[i].ttQmDefectId,notRepairDefectIds);
					 if (indx == -1) {
					 allDefectIds.push(aData[i].ttQmDefectId);
					 }
					 if (idx == -1) {
					 notRepairDefectIds.push(aData[i].ttQmDefectId);
					 }
					 
				 }
			console.log("ssssssssssss:"+notRepairDefectIds);
			},
			onUncheck:function(item,$element){
				
         },
			searchParams:mainSearchData,
			queryParams:function(){
				return tableSearchData;
			},
			onClickRow:function(item,$element){
				$("#tj").prop("disabled",false);
		
				
				$('。demoTable2').bootstrapTable('refresh');//或者{query:{}}直接设置查询条件
				
				
			},
			
			url:"/qualityStation/qmSnDefect/queryRepairList",
			columns:[{
				checkbox:true
				
			},{
				field:'qStep',
				title:'序号',
				align:'center',
				sortable:true,
				 width:'120px'
			},
			{
				field:'defectName',
				title:'问题列表',
				align:'center',
				 width:'120px'
			},
			{
				field:'repairResult',
				title:'维修结果',
				align:'center',
				 width:'120px',
				 formatter: function (value, row, index) {
	                  if (value == 0){
	                  	return '未维修';
	                  } else if (value == 1){
	                  	return '正常维修';	
	                  } else {
	                	  
	                  }
	              }
			}
			
			
			]
		}
	});
	
	
	//子表格2 iosFile
	Ew.form('.demoTable2',{
		listWidth:280,

			formId:'demoform',
			columnNum:1,
			formList:rForm
		
	});
	Ew.getBtnhl($('.sub'),{
		btnId:'btnSaveSub',
		text:'提交',
		formid:'demoform',
		onClick:function(data){
		  save();
			
			  

		}
	},rForm)
});

//报废form
function daliogScrap(){
	var srData;
	tmBasPlantId = $("#comboPlant").val();

	Ew.dialog('demo',{
		title:'报废',
		btnValues:[
  					{
  						btnId:'btnScrapSub',
  						text:'提交',
  						onClick:function(data){
  	        			 srData = $("#table23").bootstrapTable('getSelections');
  	        			 if (srData.length ==0) {
  	        				 layer.msg("请选择报废原因!");
  	        				 return;
  	        			 }
  	        			 for(var i =0;i<srData.length;i++){
  	        				srData[i].sn = $("#inputComSN").val();
  	        				srData[i].ulocNo = ulocNo;
  	        				srData[i].tmBasUlocId = tmBasUlocId;
  	        				srData[i].ttQmSnId = ttQmSnId;
  	        				srData[i].tmBasPlantId = tmBasPlantId;
  	        				srData[i].tmBasRouteId = tmBasRouteId;
  	        				srData[i].orderId = $("#comboOrder").val();
  	        				
  	        			 }
                             
  							console.log("11112121313:"+JSON.stringify(srData));
//  							$.ajax({
//  								   type: "POST",
//  								   url:apiUrl+"/qualityStation/qmScrap/scrap",
//  								   data:JSON.stringify(srData),
//  								   contentType:'application/json;charset=UTF-8',
//  								   success: function(results){
//  						  			//if(results.results== true){
//  						  				$('#demo').modal('hide');
//  						  				layer.msg(results.message);
//  						  			
//  						  			//}
//  							   }
//  								});
  							$.when(Ew.ewAjax('/qualityStation/qmScrap/scrap',JSON.stringify(srData))).done(function(results){
  								$('#demo').modal('hide');	
  								 $("#inputComSN").val("");
  					  			$("#comboOrder").select2('val',['']);
  							  $('#textPart').val('');
  					  			 tableSearchData={'tmBasUlocId':$('#comboUloc').val(),'tmBasRouteId':-1,'tmBasPartId':-1};
  		        			   $('#table1').bootstrapTable('refresh');
  				             });  
  					
  						}
  					},{
  						btnId:'btnCancelSub',
  						text:'取消'
  					}
  	    		],	
    content:' <div class="scrap" style="float: left; width: 100%"></div>',
    	
    onLoadsucess:function(){
    
			
    	Ew.table('.scrap',{
    		
    		tableId:'table23',
        	
    	
    		tableValue:{
    			pagination:false,
    			searchParams:mainSearchData,
    			queryParams:function(){
    				return tableSearchData;
    			},
    			onLoadSuccess:function(){
       		
        		},
    			onClickRow:function(item,$element){

    			},
    			url:'/qualityStation/qmScrap/queryList',
    			columns:[{
    				checkbox:true
    			},{
    				field:'qStep',
    				title:'序号',
    				align:'center',
    				sortable:true
    			},{
    				field:'scrapName',
    				title:'报废原因',
    				align:'center',
    				sortable:true
    			}]
    		}
    	});
    	
 

    }
	})


}
function daliogRepair(){
	var nUlocId = '';
	Ew.dialog('demo',{
		title:'维修',
		btnValues:[{
			btnId:'btnRepair',
			text:'提交',
			formid:'demoF',
			onClick:function(data){
			    var nextUlocId = data.ulocNo;
			
				var nextSeq =  $("#combo26").find("option:selected").text();
				if (nextSeq == '请选择') {
					nextSeq = "";
					}
				var uId = $("#combo25").val();
				if (uId != null && uId !=''){
					var sq = $("#combo26").val();
					if (sq==null || sq == ''){
						layer.msg("请选择站点顺序号",{icon:7,time:2000});
						return;
					}
				}
				 var a = [{}];
//				var obj={};
//			    obj.sn = $("#inputComSN").val();
//				obj.ulocNo = $("#comboUloc").find("option:selected").text();
//				obj.ttQmSnId=ttQmSnId;
//				obj.nextSeq =  nextSeq;
//				obj.tmBasUlocId =  data.tmBasUlocId;
//				obj.nextUlocId = nextUlocId;
//				obj.tmBasPlantId =tmBasPlantId;
			
				qData = $.map(a,function(s){
					return {
						 sn : $("#inputComSN").val(),
						ulocNo : $("#comboUloc").find("option:selected").text(),
						ttQmSnId:ttQmSnId,
						nextSeq :  nextSeq,
						tmBasUlocId :  data.tmBasUlocId,
						nextUlocId :nextUlocId,
						tmBasPlantId :tmBasPlantId,
						ttQmDefectIds:allDefectIds,
						orderId:$("#comboOrder").val(),
						notRepairDefectIds:notRepairDefectIds
					
					}
				})
				var da = JSON.stringify(qData);
				console.log("repData:"+da);
				var url = "/qualityStation/qmSnDefect/repairFinish";
//				$.ajax({
//     			   type: "POST",
//     			   url:apiUrl+url,
//     			   data:da,
//     			   contentType:'application/json;charset=UTF-8',
//     			   success: function(results){
//     				  $('#demo').modal('hide');
//	        				layer.msg(results.message);
//	        			
// 			       }
//     			});
				$.when(Ew.ewAjax(url,da)).done(function(results){
						$('#demo').modal('hide');	
						 $("#inputComSN").val("");
				  			$("#comboOrder").select2('val',['']);
						  $('#textPart').val('');
						  tmBasRouteId = -1;
						  notRepairDefectIds =[];
						  ttQmDefectIds = [];
				  			 tableSearchData={'tmBasUlocId':$('#comboUloc').val(),'tmBasRouteId':-1,'tmBasPartId':-1};
	        			   $('#table1').bootstrapTable('refresh');
		             });  
				  
	
			}
		},{
			btnId:'btnCancelRepair',
			text:'取消'
		}],
		form:{
			formId:'demoF',
			columnNum:1,
			content:' <div style="float: left; margin: 20px 35px" >已完成维修</div>',
			formList:[
			      {
			    	  idName:'',
			    	   text:'已完成维修:'
				},
				
						
			    {
				idName:'combo25',
				text:'工艺路径站点',
				comboUrl:'/qualityStation/qmSnQuality/queryUlocByRouteId',
				comboId:'tmBasUlocId',
				comboText:'tmBasUlocName',
				comboData:JSON.stringify({tmBasRouteId:tmBasRouteId}),
				field:'tmBasUlocId',
				
				onClick:function(data){
					Ew.selectLink({
				        comboUrl:'/qualityStation/qmSnQuality/queryUlocByRouteId',
				        comboData:JSON.stringify({tmBasRouteId:tmBasRouteId,tmBasUlocId:data.id}),
				        id:['combo26'],
				        comboId:'ulocId',
				        comboText:'ulocSeq'
				    });
					if (data.id !=''){
						$("#combo27").prop("disabled",true);
						$("#combo27").select2('val',['']);
					}else {
						$("#combo27").prop("disabled",false);
						
					}
				}
				
			},
			{
				
				idName:'combo26',
				text:'站点顺序号',
				field:'ulocSeq',
				
				comboId:'ulocSeq',
				comboText:'ulocSeq',
			
				onClick:function(data){
					var uId  = $("#combo25").val();
					if (uId == null ||uId == '' ){
						layer.msg("请选择返修站点!");
						$("#combo26").val('');
						$("#combo26").html('');
						return;
					}
					
					
				}
			},
			 {
		    	  idName:'',
		    	   text:'未完成维修:'
		    	   
			},
			{
				idName:'combo27',
				text:'下一维修站点',
				comboUrl:'/qualityStation/qmSnQuality/queryUlocSelectList',
				  comboData:{
					  id:['comboPlant'],
					  field:['qTmBasPlantId'],
					  other:{ulocId:$("#comboUloc").val(),ulocType:['R']}
					  
				  },
				  isSearch:true,
				  comboId:'tmBasUlocId',
				  comboText:'ulocNo',
				  field:'ulocNo',
			}]
		},
	})

}
function save(){
	var check = $("#table1").bootstrapTable('getSelections');
	if (check.length == 0) {
		layer.msg("请选择维修项");
		return;
	}
	var res = $("#combo35").val();
	if (res ==null || res =='' || res==undefined){
		layer.msg("请选择维修结果");
		return;
	}
	var tp = $("#combo36").val();
	if (tp ==null || tp =='' || tp==undefined){
		layer.msg("请选择维修类型");
		return;
	}
	var ttQmDefectId = $("#table1").bootstrapTable('getSelections')[0].ttQmDefectId;
	
	 var data= {};
	 
	  data.ttQmDefectId =  ttQmDefectId;
	  data.repairResult = 1;
	  data.repairType = $("#combo36").find("option:selected").text();
	  data.repairSteps = $("#area37").val();
	  data.repairComments = $("#area38").val();
	  data.tmBasUlocId =  $("#comboUloc").val();
	var nData = JSON.stringify(data);
	console.log("dddd:"+nData);
	var url = '/qualityStation/qmSnDefect/repairUpdate';
//	$.ajax({
//		   type: "POST",
//		   url:apiUrl+url,
//		   data:nData,
//		   contentType:'application/json;charset=UTF-8',
//		   success: function(results){
//	      defectId.push(ttQmDefectId);
//	      console.log("defectid:"+defectId);
//			   var index = $("#table1").bootstrapTable('getSelections')[0].qStep-1;
//				 $("#table1").bootstrapTable('updateCell', {
//					    index : index,
//					    field: 'repairResult',
//					    value: 1
//					});
//  				layer.msg(results.message);
//  			$("#tj").prop("disabled",true);
//  		  $('#demoTable2').bootstrapTable('refresh');
//  		$("#combo35").select2('val',['']);
//  		$("#combo36").select2('val',['']);
//  			$("#area37").val("");
//  			$("#area38").val("");
//	   }
//		});
	$.when(Ew.ewAjax(url,nData)).done(function(results){
		defectId.push(ttQmDefectId);
		if (ttQmDefectId !=null && ttQmDefectId !='' && ttQmDefectId!=undefined ) {
		var indexsp = $.inArray(ttQmDefectId,notRepairDefectIds);
		notRepairDefectIds.splice(indexsp,1);
		}
	      console.log("defectid:"+defectId);
			   var index = $("#table1").bootstrapTable('getSelections')[0].qStep-1;
				 $("#table1").bootstrapTable('updateCell', {
					    index : index,
					    field: 'repairResult',
					    value: 1
					});
			$("#tj").prop("disabled",true);
		  $('#demoTable2').bootstrapTable('refresh');
		$("#combo35").select2('val',['']);
		$("#combo36").select2('val',['']);
			$("#area37").val("");
			$("#area38").val("");	  				
       });  
}
