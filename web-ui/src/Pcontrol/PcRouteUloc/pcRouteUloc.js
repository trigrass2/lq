var filesUrls='D:/worktwo/mes/mes-base/files/';
$(function(){
	//搜索条件
	var tableSearchData=[];
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
		        		Ew.layer.msg('未查询到数据!！',{icon:7,time:1000});
		        		return;
		        	}else if(data.length==1){
		        		$('#textPart').val(data[0].part_name);
		        		$.ajax({
		      			   type: "POST",
		      			   url:apiUrl+'/order/ppordersn/queryRouteAndpart',
		      			   data:JSON.stringify({'ttPpOrderId':data[0].ttPpOrderId,'sn':$("#inputComSN").val()}),
		      			   contentType:'application/json;charset=UTF-8',
		      			   success: function(results){
		          				 tableSearchData={'tmBasUlocId':$('#comboUloc').val(),'tmBasRouteId':results.results[0].tmBasRouteId};
		          				var opt = {
		    							    url:apiUrl+'/base/routeuloc/queryRouteUloc',
		    							    silent: true,
		    							    query:tableSearchData
		    							  };
		    					$('#table1').bootstrapTable('refresh',opt);
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
				Ew.layer.msg('请选择工位！',{icon:7,time:1000});
				$('#comboOrder').val('');
				return
			}
    		$.ajax({
 			   type: "POST",
 			   url:apiUrl+'/order/ppordersn/queryRouteAndpart',
 			   data:JSON.stringify({'ttPpOrderId':data.id,'sn':$("#inputComSN").val()}),
 			   contentType:'application/json;charset=UTF-8',
 			   success: function(results){
 		    		$('#textPart').val(results.results[0].part);
     				 tableSearchData={'tmBasUlocId':$('#comboUloc').val(),'tmBasRouteId':results.results[0].tmBasRouteId};
     				var opt = {
							    url:apiUrl+'/base/routeuloc/queryRouteUloc',
							    silent: true,
							    query:tableSearchData
							  };
					$('#table1').bootstrapTable('refresh',opt);
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

	
////站点内容
//	Ew.table('.demoTable',{
//		btnValues:[],
//		tableId:'table1',
//		tableValue:{
//			searchParams:tableSearchData,
//			queryParams:function(){
//				return  tableSearchData;
//			},
//			nohidden:true,
//			url:"/base/routeuloc/queryRouteUloc",
//			columns:[{
//				field:'content',
//				title:'站点内容',
//				align:'center',
//				width:'120px'
//			},{
//				field:'attention',
//				title:'注意事项',
//				align:'center',
//				width:'120px'
//			}]
//		}
//	});
//	
	Ew.table('.demoTable',{
		btnValues:[{},{}],
		tableId:'table1',
		tableValue:{
			searchParams:tableSearchData,
			queryParams:function(){
				return {}
			},
			url:"/base/routeuloc/queryRouteUloc",
			columns:[{
				field:'content',
				title:'站点内容',
				align:'center',
				width:'120px'
			},{
				field:'attention',
				title:'注意事项',
				align:'center',
				width:'120px'
			}]
	 }
	});
	
	
});
	