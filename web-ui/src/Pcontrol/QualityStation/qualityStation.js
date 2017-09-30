var mesCom=new mesComMethod();

var tmBasUlocId=-1;
var tmBasRouteId = -1;
var qData= [];
var ttQmSnId;
  var searchData;
 var scrData=[];
 var ulocNo;
 var tmBasPlantId;
  var tableSearchData=[];
  
  
  var mainSearchData=[{
	  idName:'comboPlant',
	  text:'工厂',
	  comboUrl:'/base/plant/publicPlantSelect',
	  comboId:'tmBasPlantId',
	  comboText:'plant',
	  field:'tmBasPlantId',
	  valid:['notEmpty'],
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
					other:{ulocType:['Q']}
				},
			  id:['comboUloc'],
			  comboId:'tmBasUlocId',
			  comboText:'ulocNo'
		  });
	  }
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

	 field:'tmBasUlocId',
	  comboUrl:'/base/uloc/queryUlocSelectList',
		comboData:{
			id:['comboPlant'],
			field:['pTmBasPlantId'],
			other:{ulocType:['Q']}
		},
		comboId:'tmBasUlocId',
		comboText:'ulocNo',
		
	  valid:['notEmpty'],
	  isSearch:true
  },{
	  idName:'inputComSN',
	  text:'SN',
	  comboUrl:"/order/ppordersn/querySn",
	  comboId:'sn',
	  comboText:'sn',
	  field:'sn',
	  keyTrue:function(data){
		  if($('#comboUloc').val()==null||$('#comboUloc').val()==""){
			  Ew.layer.msg('请选择工位！',{icon:7,time:1000});
			  $('#inputComSN').val('');
			  return
		  }
		  $('#comboOrder').val('');
		  $('#textPart').val('');
		  var isOk = false;
		  var datas={};
	        datas.type = 'N';//正常过点
	        datas.sn = $('#inputComSN').val();//SN
	        datas.ulocNo = $('#comboUloc').find("option:selected").text();//扫描工位编号
	        datas.tmBasPlantId = $('#comboPlant').val();//工厂id
		  $.ajax({
              url: apiUrl + '/pcontrol/throughUloc/scan',
              type: "POST",
              data: JSON.stringify(datas),
              contentType: "application/json; charset=gbk",
              dataType: "JSON",
              async: false,
              success: function (res) {
                  if (res.code == 10000) {
                	  isOk =  true;
                	  mesCom.msgSuccess(res.message);
              	
                  } else {
                	  mesCom.msgError(res.message);
                  }
              }
          });
		  
		 
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
								  tableSearchData={'tmBasUlocId':$('#comboUloc').val(),'tmBasRouteId':results.results[0].tmBasRouteId,'tmBasPartId':results.results[0].tmBasPartId};
								  if (isOk == true) {
								  $('#table1').bootstrapTable('refresh');
								  }
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
//	  onClick:function(data){
//		  if($('#comboUloc').val()==null||$('#comboUloc').val()==""){
//			  Ew.layer.msg('请选择工位！',{icon:2,time:1000});
//			  $('#comboOrder').val('');
//			  return
//		  }
//		  $.ajax({	
//			  type:"POST",
//			  url:apiUrl+'/order/ppordersn/queryRouteAndpart',
//			  data:JSON.stringify({'ttPpOrderId':data[0].ttPpOrderId,'sn':data[0].sn}),
//			  contentType:'application/json;charset=UTF-8',
//			  success: function(results){
//				  $('#textPart').val(results.results[0].part_no);
//				  if(results.results.length>0){
//					  tmBasUlocId =$('#comboUloc').val();
//					  tmBasRouteId = results.results[0].tmBasRouteId;
//					  ttQmSnId = results.results[0].ttPpOrderSnId;
//					  tableSearchData={'tmBasUlocId':$('#comboUloc').val(),'tmBasRouteId':results.results[0].tmBasRouteId,'tmBasPartId':results.results[0].tmBasPartId};
//					  $('#table1').bootstrapTable('refresh');
//				  }
//			  }
//		  });
//	  }
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
			btnId:'btnPass',text:'合格',onClick:function(){
				var obj = qData;
				var sData = $('#table1').bootstrapTable('getData');
				if (sData.length == 0) {
					layer.msg("没有任何质检项，不能操作",{icon:7,time:1000});
					return;
				}
				for (var i=0;i<obj.length;i++) {
					if (obj[i].result == 0) {
						layer.msg("编号"+obj[i].qualityNo+"为不合格，不能做合格操作",{icon:7,time:1000})
						return;
					}
				}
				var datas = JSON.stringify(obj);
				var url = "/qualityStation/qmSnQuality/add";
//				$.ajax({
//     			   type: "POST",
//     			   url:apiUrl+url,
//     			   data:datas,
//     			   contentType:'application/json;charset=UTF-8',
//     			   success: function(results){
//	        			if(results.results==true){
//	        				layer.msg(results.message,{icon:7,time:2000});
//	        			   $("#inputComSN").val("");
//	        			   $('#comboOrder').val('');
//	        			   $('#textPart').val('');
//							  tableSearchData={'tmBasUlocId':$('#comboUloc').val(),'tmBasRouteId':-1,'tmBasPartId':-1};
//
//	        			   $('#table1').bootstrapTable('refresh');
//	        			}
// 			       }
//     			});
				
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					
        			   $("#inputComSN").val("");
        			   $("#comboOrder").select2('val',['']);
        			   $('#textPart').val('');
						  tableSearchData={'tmBasUlocId':$('#comboUloc').val(),'tmBasRouteId':-1,'tmBasPartId':-1};

        			   $('#table1').bootstrapTable('refresh');
        			   $('#table22').bootstrapTable('refresh');
        			
	             });
				
			}
		},
		{
			btnId:'btnNotPass',text:'不合格',onClick:function(){
				var sData = $('#table1').bootstrapTable('getData');
				if (sData.length == 0) {
					layer.msg("没有任何质检项，不能操作",{icon:7,time:1000});
					return;
				}
				var che = $("#table1").bootstrapTable('getSelections');
				if (che.length == 0) {
					layer.msg("请选择质检项",{icon:7,time:1000});
					return;
				}
				var obj = qData;
				var isTrue = false;
				for (var i=0;i<obj.length;i++) {
					if (obj[i].result == 0) {
						isTrue =  true;
					}
				}
				if (isTrue == false) {//没有一项是不合格的
					layer.msg("质检结果和不良记录不相符,没有不合格的记录",{icon:7,time:1000});
				} else{
					daliogShow(obj);
				}
				
			
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
				 ulocNo = $("#comboUloc").find("option:selected").text();
				if (ulocNo.indexOf("请选择") != -1) {
					ulocNo = ulocNo.replace("请选择",'');
				}
				tmBasPlantId = $("#comboPlant").val();
				var ss =  $('#table1').bootstrapTable('getData');
			  qData = $('#table1').bootstrapTable('getData').map(function(item,index,array){
				 return {
					 qualityNo:item.qualityNo,
					 result:1,
					 tmBasRouteId:tmBasRouteId,
					 tmBasUlocId:tmBasUlocId,
					 ttQmSnId:ttQmSnId,
					 qualityId:item.tmQmQualityId,				 
			         defectId:[],
			         defectNo:[],
			         defectName:[],
			         sn:$("#inputComSN").val(),
			         nextUlocId:'',
			         nextSeq:'',
			         ulocNo:ulocNo,
			         cIndex:[],
			         tmBasPlantId:tmBasPlantId,
			         orderId:$("#comboOrder").val(),
			         repairUlocNo:''
					 
				 }
			 })
        qData.forEach(function(itme,index,array){
          $('.sw'+index).bootstrapSwitch({
            onText:"合格",
            offText:"不合格",
            onColor:"success",
            offColor:"info"
          });
        })
			},
			onUncheck:function(item,$element){
				$('#table22').bootstrapTable('refresh');//或者{query:{}}直接设置查询条件
				
         },
			searchParams:mainSearchData,
			queryParams:function(){
				return tableSearchData;
			},
			onClickRow:function(item,$element){
				$('#table22').bootstrapTable('refresh',{query:{tmQmQualityId:item.tmQmQualityId}});//或者{query:{}}直接设置查询条件
				 var index = $("#table1").bootstrapTable('getSelections')[0].qStep-1;
//				 qData[index]['defectId']=[];
//				 qData[index]['defectName']=[];
				 $('.sw'+index).bootstrapSwitch('disabled',false)
//		          $('.sw'+index).bootstrapSwitch('state',true)
		          $('.sw'+index).bootstrapSwitch('disabled',true)
		      
			},
			
			url:"/qualityStation/qmSnQuality/queryList",
			columns:[{
				checkbox:true
				
			},{
				field:'qStep',
				title:'序号',
				align:'center',
				sortable:true,
				 width:'120px'
			},{
				field:'qualityNo',
				title:'编号',
				align:'center',
				sortable:true,
				 width:'120px'
			},
			{
				field:'qualityName',
				title:'质检内容',
				align:'center',
				 width:'120px'
			}
			,
			{
				field:'isOK',
				title:'是否合格',
				align:'center',
				formatter: function (value, row, index) {
		              return Ew.switchHl(1,'sw'+index,row.tmQmQualityId,true)
		            },
				 width:'120px'
			}
			
			]
		}
	});
	
	
	//子表格
//	Ew.table('.demoTable2',{
//	
//		tableId:'table2',
//		tableValue:{
//			queryParams:function(){
//				return {tmQmQualityId:aa};
//			},
//			onClickRow:function(item,$element){
//				
//			},
//			url:'/quality/qmQualityResult/querylistByPage',
//			columns:[{
//		
//				radio:true,
//
//			},{
//				field:'step',
//				title:'序号',
//				align:'center',
//				sortable:true
//			},{
//				field:'qualityresultName',
//				title:'质检结果内容',
//				align:'center',
//				sortable:true
//			},{
//				field:'isOk',
//				title:'质检结果',
////				align:'center',
////				formatter: function (value, row, index) {
////                    if (value == 1){
////                    	rodioData:[{text:'aaa',value:'1',checked:true}]
////                    	return '合格';
////                    } else if (value == 0){
////                    	return '不合格';	
////                    } else {
////                    	
////                    }
////                }
//				
//			}]
//		}
//	});
	//子表格2 iosFile
	Ew.table('.demoTable2',{

		tableId:'table22',
		tableValue:{
		pagination:false,
      singleSelect:false,
      onLoadSuccess:function(){
    	    
          if ($("#table1").bootstrapTable('getSelections').length>0) {
        	  
        	 
			  var index = $("#table1").bootstrapTable('getSelections')[0].qStep-1;
			  var idx = qData[index]['cIndex'];
			  console.log("index:"+index+",已选中的行："+idx)

			   for(var i=0;i<idx.length;i++){
				   var newIndex = idx[i];
				  $("#table22").bootstrapTable("check",newIndex);
			   }
		        
          }
      },
			queryParams:function(){
				return {tmQmQualityId:aa};
			},
			onClickRow:function(item,$element){
               var index = $("#table1").bootstrapTable('getSelections')[0].qStep-1;
               $('.sw'+index).bootstrapSwitch('disabled',false)
               $('.sw'+index).bootstrapSwitch('state',false)
               $('.sw'+index).bootstrapSwitch('disabled',true)
              qData[index]['result'] = 0;
              var da = qData[index]['cIndex'];
            
              if (da.length <$("#table22").bootstrapTable('getData').length) {
            	  if ($("#table22").bootstrapTable('getSelections').length != da.length) {
            		  if ($.inArray(item.tmQmDefectId,qData[index]['defectId']) == -1) {
            		  qData[index]['defectId'].push(item.tmQmDefectId)
            		  qData[index]['defectName'].push(item.defectName);
            		  qData[index]['defectNo'].push(item.defectId);
            		  qData[index]['cIndex'].push(item.step-1);
            		  }
            		  
            	  }
              }
              
              console.log(qData)
			},
			onUncheck:function(item,$element){
				var index = $("#table1").bootstrapTable('getSelections')[0].qStep-1;
				var len = qData[index]['defectId'];
				var rId =  item.tmQmDefectId;
				var indexsp = $.inArray(rId,len);
				if (len.length>0){
					qData[index]['defectId'].splice(indexsp,1);
					qData[index]['defectNo'].splice(indexsp,1);
					qData[index]['defectName'].splice(indexsp,1);
				}
				var cx = qData[index]['cIndex'];
				var idxsp = $.inArray(rId,cx);
				if (cx.length>0){
					qData[index]['cIndex'].splice(idxsp,1);
				}
				if(qData[index]['defectId'].length == 0){
		          $('.sw'+index).bootstrapSwitch('disabled',false)
		          $('.sw'+index).bootstrapSwitch('state',true)
		          $('.sw'+index).bootstrapSwitch('disabled',true)
		          qData[index]['result'] = 1;
		          
		          qData[index]['defectName'].forEach(function(item, index, array){
        	  
            $('#badlist>ul').remove('<li style="margin-top: 5px">原因'+(index+1)+'：'+item+'</li>');
          })
        }

        },
			url:'/qualityStation/qmSnDefect/queryDefectlist',
			columns:[{
				checkbox:true,
				field:'result'
			},
//			{title:'序号',field:'step',align:'center',sortable:true},
			{
				field:'defectId',
				title:'不良编号',
				align:'center',
				sortable:true
			},{
				field:'defectName',
				title:'问题',
				align:'center',
				 width:'150px',
				sortable:true
			}]
		}
	});
});

//第二个子标签form
function daliogShow(data){
	var nUlocId = '';
	Ew.dialog('demo',{
		title:'返修',
		btnValues:[{
			btnId:'btnSave',
			text:'提交',
			formid:'demoform',
			onClick:function(data){
				var nextUlocNo =  data.nextUlocNo;
				if (nextUlocNo !=null && nextUlocNo !='' && nextUlocNo !=undefined) {
					var nData = JSON.stringify({tmBasPlantId:tmBasPlantId,name:nextUlocNo});
					nUlocId = nextUlocNo;
					
				}
				save(data,nUlocId);
				
				  
	
			}
		},{
			btnId:'btnCancel',
			text:'取消'
		}],
		form:{
			formId:'demoform',
			columnNum:2,
			formList:[{
				idName:'combo25',
				text:'返修站点',
				comboUrl:'/qualityStation/qmSnQuality/queryUlocByRoute',
				comboId:'tmBasUlocId',
				comboText:'tmBasUlocName',
				comboData:JSON.stringify({tmBasRouteId:tmBasRouteId,tmBasUlocId:tmBasUlocId,ulocType:'R'}),
				field:'tmBasUlocId',
				onClick:function(data){
					var id =  data.id;
					var datas =  JSON.stringify({tmBasRouteId:tmBasRouteId,tmBasUlocId:id});
					if (id != '') {
						$.when(Ew.ewAjax('/qualityStation/qmSnQuality/queryUlocByRoute',datas)).done(function(results){
							$('#text26').val(results[0].nextSeq);
			             });
						$("#combo27").prop("disabled",true);
						$("#combo27").select2('val',['']);
					}else {
						$('#text26').val("");
						$("#combo27").prop("disabled",false);
					}
				}
				
			},
			{
				
				idName:'text26',
				text:'下一站顺序号',
				field:'nextSeq',
				disabled:true
			
			},
			{
				idName:'combo27',
				text:'站点编号',
				field:'nextUlocNo',
				  comboUrl:'/qualityStation/qmSnQuality/queryUlocByNo',
				  comboData:
					{
					id:['comboPlant'],
					field:['tmBasPlantId'],
					other:{}
					},
				  comboId:'tmBasUlocId',
				  comboText:'ulocNo',
				  isSearch:true
			}],
			defaultTable:'table1'
		},
    content:'<div style="float: left; margin: 20px 35px"><div style="font-size: 16px">问题汇总：</div><div id="badlist" style="margin-top: 8px"><ul></ul></div></div>',
    onLoadsucess:function(){
    	var list = qData;
    	for (var i=0;i<list.length;i++){
    		var index = $("#table1").bootstrapTable('getData')[i].qStep-1;
    		var no = $("#table1").bootstrapTable('getData')[i].qualityNo;
    		var res = list[i].result;
    		if (res == '0') {
    		var html= "<span>编号:"+no+"</span>";
    		$('#badlist>ul').append(html);
    		qData[index]['defectName'].forEach(function(item, index, array){
    			$('#badlist>ul').append('<li style="margin-top: 5px">原因'+(index+1)+'：'+item+'</li>')
    		})
    		}
    	}
    }
	})

}
//报废form
var srData;
function daliogScrap(){
	tmBasPlantId = $("#comboPlant").val();
	 ulocNo = $("#comboUloc").find("option:selected").text();
		if (ulocNo.indexOf("请选择") != -1) {
			ulocNo = ulocNo.replace("请选择",'');
		}
	Ew.dialog('demo',{
		title:'报废',
		btnValues:[
  					{
  						btnId:'btnSaveScrap',
  						text:'提交',
  						onClick:function(data){
  	        			 srData = $("#table232").bootstrapTable('getSelections');
  	        			 if (srData.length ==0) {
  	        				 layer.msg("请选择报废原因!",{icon:7,time:1000});
  	        				 return;
  	        			 }
  	        			 for(var i =0;i<srData.length;i++){
  	        				srData[i].sn = $("#inputComSN").val();
  	        				srData[i].ulocNo = ulocNo;
  	        				srData[i].tmBasUlocId = tmBasUlocId;
  	        				srData[i].ttQmSnId = ttQmSnId;
  	        				srData[i].tmBasPlantId = tmBasPlantId;
  	        				srData[i].tmBasRouteId=tmBasRouteId;
  	        				srData[i].orderId=$("#comboOrder").val();

  	        			 }
                             
//  							console.log("11112121313:"+JSON.stringify(srData));
//  							$.ajax({
//  								   type: "POST",
//  								   url:apiUrl+"/qualityStation/qmScrap/scrap",
//  								   data:JSON.stringify(srData),
//  								   contentType:'application/json;charset=UTF-8',
//  								   success: function(results){
//  						  			//if(results.results== true){
//  						  				$('#demo').modal('hide');
//  						  				layer.msg(results.message,{icon:7,time:2000});
//  						  			 $("#inputComSN").val("");
//  						  			$('#comboOrder').val('');
//  								  $('#textPart').val('');
//  						  			 tableSearchData={'tmBasUlocId':$('#comboUloc').val(),'tmBasRouteId':-1,'tmBasPartId':-1};
//  			        			   $('#table1').bootstrapTable('refresh');
//  						  			//}
//  							   }
//  								});
  							  
  							$.when(Ew.ewAjax('/qualityStation/qmScrap/scrap',JSON.stringify(srData))).done(function(results){
  								$('#demo').modal('hide');
//					  				layer.msg(results.message,{icon:7,time:2000});
					  			 $("#inputComSN").val("");
					  			$("#comboOrder").select2('val',['']);
							  $('#textPart').val('');
					  			 tableSearchData={'tmBasUlocId':$('#comboUloc').val(),'tmBasRouteId':-1,'tmBasPartId':-1};
		        			   $('#table1').bootstrapTable('refresh');
		        			   $('#table22').bootstrapTable('refresh');

  				             });
  						}
  					},{
  						btnId:'btnCancelScrap',
  						text:'取消'
  					}
  	    		],	
    content:' <div class="scrap" style="float: left; width: 100%"></div>',
    	
    onLoadsucess:function(){
    
			
    	Ew.table('.scrap',{
    		
    		tableId:'table232',
        	
    	
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

function save(data,nUlocId){
	 var index = $("#table1").bootstrapTable('getSelections')[0].qStep-1;
	   var nextSeq = $("#combo26").find("option:selected").text();
		
					  console.log("111111111111:"+data);
		var nextUlocId = data.tmBasUlocId;
		if (nextUlocId == null || nextUlocId=='' || nextUlocId== undefined) {//如果没有选择下一站点，则取输入的站点编号
//			if (nUlocId ==null || nUlocId =='' || nUlocId ==undefined) {
//				layer.msg("返修站点和站点编号至少选择一个",{icon:7,time:2000});
//				return;
//			}
			nextUlocId = nUlocId;
		}
		var nextUlocNo = $("#combo25").find("option:selected").text();
		var nUlocNo = $("#combo27 option:selected").text();
		var repairUlocNo;
		if (nextUlocNo != null  && nextUlocNo !='' && nextUlocNo !='请选择') {
			repairUlocNo = nextUlocNo
		}
		if (nUlocNo != null  && nUlocNo !='' && nUlocNo !='请选择') {
			repairUlocNo = nUlocNo
		}
	   qData[index]['nextUlocId']= nextUlocId;
	   qData[index]['repairUlocNo']= repairUlocNo;
	   
	   qData[index]['nextSeq']= nextSeq=='请选择'?'':nextSeq;
	 
	var newData = JSON.stringify(qData);
	console.log("!!!!!!!!!!!!!!!:"+newData);
	data.tmQmQualityId = $('#table1').bootstrapTable('getSelections')[0].tmQmQualityId ;
//	if (nextUlocId==null || nextUlocId=='' || nextUlocId==undefined) {
//		layer.msg("请选择返修站点或者输入站点编号，两者至少选择一个",{icon:7,time:1000});
//		return;
//	}
	datas = JSON.stringify(data);
	var url = '/qualityStation/qmSnDefect/repair';
//	$.ajax({
//		   type: "POST",
//		   url:apiUrl+url,
//		   data:newData,
//		   contentType:'application/json;charset=UTF-8',
//		   success: function(results){
//  			
//  				$('#demo').modal('hide');
//  				layer.msg(results.message,{icon:7,time:2000});
//  			
//  				 $("#inputComSN").val("");
//  				$('#comboOrder').val('');
//  			  $('#textPart').val('');
//  				 tableSearchData={'tmBasUlocId':$('#comboUloc').val(),'tmBasRouteId':-1,'tmBasPartId':-1};
//  			   $('#table1').bootstrapTable('refresh');
//	   }
//		});
	
	$.when(Ew.ewAjax(url,newData)).done(function(results){
		$('#demo').modal('hide');
//		layer.msg(results.message,{icon:7,time:2000});
		 $("#inputComSN").val("");
		 $("#comboOrder").select2('val',['']);
	  $('#textPart').val('');
		 tableSearchData={'tmBasUlocId':$('#comboUloc').val(),'tmBasRouteId':-1,'tmBasPartId':-1};
	   $('#table1').bootstrapTable('refresh');
		$('#table22').bootstrapTable('removeAll');

//		$('#table22').bootstrapTable('refresh',{query:{tmQmQualityId:-1}});//或者{query:{}}直接设置查询条件
     });
		
}


