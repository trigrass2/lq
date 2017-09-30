var filesUrls='D:/worktwo/mes/mes-base/files/';
$(function(){
	//搜索条件
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
				comboUrl:'/base/uloc/queryUlocSelectForInputWithLineId',
				comboData:JSON.stringify({pTmBasPlantId:data.id}),
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
		comboUrl:'/base/uloc/queryUlocSelectForInputWithLineId',
		comboData:{
			id:['comboPlant','comboWorkshop','comboLine'],
			field:['pTmBasPlantId','wTmBasWorkshopId','lTmBasLineId'],
			other:{}
		},
		comboId:'tmBasUlocId',
		comboText:'ulocNo',
		field:'tmBasUlocId',
		valid:['notEmpty'],
		isSearch:true
	},{
		idName:'inputComSN',
		text:'SN',
		comboUrl:"/order/ppordersn/querySn",
		comboId:'sn',
		comboText:'sn',
		field:'sn',
		onClick:function(data){
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
		        	}else if(data.length==1){
		        		$('#textPart').val(data[0].part_name);
		        		$.ajax({
		        			   type: "POST",
		        			   url:apiUrl+'/order/ppordersn/queryRouteAndpart',
		        			   data:JSON.stringify({'ttPpOrderId':data[0].ttPpOrderId,'sn':data[0].sn}),
		        			   contentType:'application/json;charset=UTF-8',
		        			   success: function(results){
				        			if(results.results.length>0){
				        				$.ajax({
				        					   type: "POST",
				        					   url: apiUrl+"/base/ulocfile/queryFiles",
				        					   data:JSON.stringify({'tmBasUlocId':$('#comboUloc').val(),'tmBasRouteId':results.results[0].tmBasRouteId,'tmBasPartId':results.results[0].tmBasRouteId}),
				        					   contentType:'application/json;charset=UTF-8',
				        					   success: function(results1){
				        						   $("#fileList").find("li").remove();
				        						   $("#filesDisplay").find("em").remove();
				        						   if(results1.results.length>0){
						  		        				$.each(results1.results,function (index,domEle){
						  		        					filesShow(domEle.fileAddr);
						  		        				});
						  		        				$("#filesDisplay").slider({
						  		        					effect:'horizontal',
						  		        					sliderBar: true
						  		        				});
						  		        			}
				        					   }
				        					});
				        				
				        				
				        			}else{
				        				Ew.layer.msg('未查询到数据！',{icon:2,time:1000});
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
		onClick:function(data){
			if($('#comboUloc').val()==null||$('#comboUloc').val()==""){
				$('#comboOrder').val('');
				Ew.layer.msg('请选择工位！',{icon:2,time:1000});
				return
			}
    		$.ajax({
    			   type: "POST",
    			   url: apiUrl+'/order/ppordersn/queryRouteAndpart',
    			   data: {'ttPpOrderId':data.id,'sn':$('#inputComSN').val()},
    			   success: function(results){
	        			if(results.length>0){
	        				$('#textPart').val(results.results[0].part);
	        				$.ajax({
	        					   type: "POST",
	        					   url: apiUrl+"/base/ulocfile/queryFiles",
	        					   data: {'tmBasUlocId':$('#comboUloc').val(),'tmBasRouteId':results[0].tmBasRouteId,'tmBasPartId':results[0].tmBasRouteId},
	        					   success: function(result1){
	        						   if(results1.length>0){
	        							  $("#fileList").find("li").remove();
			  		        				$.each(d,function (index,domEle){
			  		        					filesShow(domEle.fileAddr);
			  		        				});
			  		        				$("#filesDisplay").slider({
			  		        					effect:'horizontal',
			  		        					sliderBar: true
			  		        					
			  		        				});
			  		        			}
	        					   }
	        					});
	        				
	        				
	        			}else{
	        				Ew.layer.msg('未查询到数据！',{icon:2,time:1000});
	        			}
	        		  }
    			});
    		}
	},{
		idName:'textPart',
		text:'产品',
		disabled:true
	}];
	
	Ew.search('.demoSearch',{
		title:'查询',
		textValues:mainSearchData
		
	});

});

function filesShow(fileUrl){
				var seperate=fileUrl.lastIndexOf("/");
				var fileName=fileUrl.substring(seperate+1,fileUrl.length);
				var filePath=fileUrl.substring(0,seperate);
			    var pos = fileUrl.lastIndexOf(".");
				 var lastname = fileUrl.substring(pos+1,fileUrl.length);
				 var name = fileUrl.substring(seperate+1,pos);
				 if(lastname.toLowerCase()=='pdf'){
					 $("#fileList").append("<li id="+name+"></li>");
					 var  success=new PDFObject({ url:apiUrl+"/base/ulocfile/fileView?fileName="+fileName+'&filePath='+filePath,pdfOpenParams: {zoom:'100',view: 'FitV', page: '1' }}).embed(name);
					
				 }else if(lastname.toLowerCase()=='jpg'||lastname.toLowerCase()=='png'||lastname.toLowerCase()=='jpeg'||lastname.toLowerCase()=='bmp'
						 ||lastname.toLowerCase()=='gif'){
					 	$("#fileList").append("<li id="+name+"></li>");
					 var img = new Image();
					    img.src =apiUrl+"/base/ulocfile/fileView?fileName="+fileName+'&filePath='+filePath;
					    if(img.width<1200){
					    	img.width=1200;
					    }
						 	$("#"+name).append(img);
						 }
	};
	
	
	