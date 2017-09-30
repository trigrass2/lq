var filesUrls='D:/worktwo/mes/mes-base/files/';
var urlQuerylistByPage = apiUrl + "/system/sysPageDetail/queryDetailByPage"; //查询页面信息
var urlPageId=apiUrl + "/system/sysPage/queryPageSelect"; //查询页面id
$(function(){
//	document.domain ='http://10.26.185.57';
    var mesCom=new mesComMethod();
    var $resourceId = $(window.top.document.body).find('#myTab li.active').attr('id').replace("tab_", "");
    $.ajax({
        type: "POST",
        url: urlPageId,
        data: {tsSysResourceId:$resourceId},
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        beforeSend: function(request) {
            request.setRequestHeader("token", sessionStorage.token);
            request.setRequestHeader("AUTHORIZATION", sessionStorage.token);
        },
        success: function (data) {
            if (data.code == 10000) {
            	var tsSysPageId = data.results[0].tsSysPageId;
            	var dataList = {
            		tsSysPageId:tsSysPageId
            	};
                $.ajax({
                    type: "POST",
                    url: urlQuerylistByPage,
                    data: JSON.stringify(dataList),
                    dataType: "json",
                    contentType: "application/json;charset=UTF-8",
                    beforeSend: function(request) {
                        request.setRequestHeader("token", sessionStorage.token);
                        request.setRequestHeader("AUTHORIZATION", sessionStorage.token);
                    },
                    success: function (data) {
                        console.log('----------------------------------')
                        console.log(data);
                        console.log('----------------------------------');
                        if (data.code == 10000) {
                        	var configVisualLayout = data.results;
                            for (var i = 0, j = configVisualLayout.length; i < j; i++){
                                var mouleval = configVisualLayout[i].no;
                                var left = configVisualLayout[i].pointX;
                                var top = configVisualLayout[i].pointY;
                                var width = configVisualLayout[i].width;
                                var height = configVisualLayout[i].height;
                                $('#' + mouleval).css('display','block');
								/*显示配置布局*/
                                $('#' + mouleval).wrap("<div class='visualContentPanel' style='left:"+left+"%;top:"+top+"%;width:"+width+"%;height:"+height+"%;'></div>");
                                $('#' + mouleval).wrap("<div style='padding: 5px;overflow: auto;width: 100%;height: calc(100% - 5px);box-shadow: 1px 1px 8px gray;'></div>");
                                // getOption('可视化配置面板'+mouleval,'visualContent'+mouleval); // 加载图表数据
                            }
                        } else {
                            mesCom.msgSuccess(data.message);
                        }
                    }
                });
			} else {
				mesCom.msgSuccess(data.message);
			}
        }
    });
	//搜索条件
	var tableSearchData=[];
	var mainSearchData1=[{
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
				        				//查询工艺内容
				        				 tableSearchData={'tmBasUlocId':$('#comboUloc').val(),'tmBasRouteId':results.results[0].tmBasRouteId,'tmBasPartId':results.results[0].tmBasPartId};
				        				 $('#table1').bootstrapTable('refresh');
				        				 //查询站点BOM
				        				 tableSearchData={'tmBasUlocId':$('#comboUloc').val(),'ttPpOrderId':results.results[0].ttPpOrderId};
				        				 $('#table2').bootstrapTable('refresh');
				        				//站点内容展示
				        				 tableSearchData={'tmBasUlocId':$('#comboUloc').val(),'tmBasRouteId':results.results[0].tmBasRouteId};
				          				   $('#table3').bootstrapTable('refresh');
				          				   
				        				//查询文件
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
	        				//$('#textPart').val(data[0].part_name);
	        				//查询工艺内容
	        				 tableSearchData={'tmBasUlocId':$('#comboUloc').val(),'tmBasRouteId':results.results[0].tmBasRouteId,'tmBasPartId':results.results[0].tmBasPartId};
	        				 $('#table1').bootstrapTable('refresh');
	        				//查询站点BOM
	        				 tableSearchData={'tmBasUlocId':$('#comboUloc').val(),'ttPpOrderId':results.results[0].ttPpOrderId};
	        				 $('#table2').bootstrapTable('refresh');
	        				//站点内容展示
	        				 tableSearchData={'tmBasUlocId':$('#comboUloc').val(),'tmBasRouteId':results.results[0].tmBasRouteId};
	          				   $('#table3').bootstrapTable('refresh');
	        				 //查询文件
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
	var mainSearchData=[
		{
			idName:'combo30',
			text:'工厂',
			comboUrl:'/base/plant/publicPlantSelect',
			comboId:'tmBasPlantId',
			comboText:'plant',
			field:'tmBasPlantId',
			onClick:function(data){
				Ew.selectLink({
			        comboUrl:'/base/workshop/publicWorkshopSelect',
			        comboData:JSON.stringify({tmBasPlantId:data.id}),
			        id:['combo31'],
			        comboId:'tmBasWorkshopId',
			        comboText:'workshop'
			    });
	      Ew.selectLink({
	        comboUrl:'/base/line/publicLineSelect',
	        comboData:JSON.stringify({tmBasPlantId:data.id}),
	        id:['combo32'],
	        comboId:'tmBasLineId',
	        comboText:'line'
	      });
			}
		},{
			idName:'combo31',
			text:'车间',
			comboUrl:'/base/workshop/publicWorkshopSelect',
			comboId:'tmBasWorkshopId',
			comboText:'workshop',
			field:'tmBasWorkshopId',
			onClick:function(data){
				Ew.selectLink({
			        comboUrl:'/base/line/publicLineSelect',
			        comboData:JSON.stringify({tmBasWorkshopId:data.id}),
			        id:['combo53'],
			        comboId:'tmBasLineId',
			        comboText:'line'
			    });
			}
		},{
			idName:'combo32',
			text:'产线',
			comboUrl:'/base/line/publicLineSelect',
			comboId:'tmBasLineId',
			comboText:'line',
			field:'tmBasLineId'
		},{
			idName:'text30',
			text:'工位',
			valid:['notEmpty'],
			field:'ulocNo',
			onKeyup:function(value){
				if(event.keyCode==13){
		        var data={};
		        data.type = 'N';//正常过点
		        data.sn = $('#text31').val();//SN
		        data.ulocNo = $('#text30').val();//扫描工位编号
		        data.tmBasPlantId = $('#combo30').val();//工厂id
		        
	            $.ajax({
	                url: apiUrl + '/pcontrol/throughUloc/scan',
	                type: "POST",
	                data: JSON.stringify(data),
	                contentType: "application/json; charset=gbk",
	                dataType: "JSON",
	                async: false,
	                success: function (res) {
	                    if (res.code == 10000) {
	                        mesCom.msgSuccess(res.message);
	                		$('#passQueue').bootstrapTable('refresh');
	                    } else {
	                        mesCom.msgError(res.message);
	                    }
	                }
	            });
			  }
			}
		},{
	    idName:'text31',
			text:'SN',
			field:'sn',
			onKeyup:function(value){
				if(event.keyCode==13){
		        var data={};
		        data.type = 'N';//正常过点
		        data.sn = $('#text31').val();//SN
		        data.ulocNo = $('#text30').val();//扫描工位编号
		        data.tmBasPlantId = $('#combo30').val();//工厂id
		        
	            $.ajax({
	                url: apiUrl + '/pcontrol/throughUloc/scan',
	                type: "POST",
	                data: JSON.stringify(data),
	                contentType: "application/json; charset=gbk",
	                dataType: "JSON",
	                async: false,
	                success: function (res) {
	                    if (res.code == 10000) {
	                        mesCom.msgSuccess(res.message);
	                		$('#passQueue').bootstrapTable('refresh');
	                    } else {
	                        mesCom.msgError(res.message);
	                    }
	                }
	            });
			  }
			}
		},{
	    idName:'text32',
			text:'产品',
			field:'partNo',
			disabled:true
		},{
	    idName:'text33',
			text:'订单编号',
			field:'orderNo',
			disabled:true
		}

	];
	Ew.search('.demoSearch',{
		title:'查询',
		titleNone:true,
		textValues:mainSearchData1

	});
	Ew.search('.demoSearch2',{
		title:'查询',
		titleNone:true,
		textValues:mainSearchData
	});
	
//工艺内容表格
	Ew.table('.demoTableContent',{
		btnValues:[],
		tableId:'table1',
		tableValue:{
			searchParams:tableSearchData,
			queryParams:function(){
				return tableSearchData;
			},
			nohidden:true,
			url:"/base/uloccontent/queryContent",
			columns:[{
				field:'step',
				title:'工序步骤',
				align:'center',
				sortable:true,
				 width:'120px'
			},
			{
				field:'userInstrument',
				title:'使用工具',
				align:'center',
				 width:'120px'
			},
			{
				field:'stepContent',
				title:'工序内容',
				align:'center',
				width:'120px'
			},
			{
				field:'stepRequirement',
				title:'技术要求',
				align:'center',
				width:'120px'
			},
			{
				field:'times',
				title:'次数',
				align:'center',
				width:'120px'
			},
			{
				field:'standardHour',
				title:'标准工时(分钟)',
				align:'center',
				width:'120px'
			}
			
			]
		}
	});	
	//站点BOM表格
	Ew.table('.demoTableUlocBom',{
		btnValues:[],
		tableId:'table2',
		tableValue:{
			searchParams:tableSearchData,
			queryParams:function(){
				return tableSearchData;
			},
			nohidden:true,
			url:"/order/pporderbom/queryUlocBom",
			columns:[{
				field:'rowNo',
				title:'行号',
				align:'center',
				 width:'120px'
			},{
				field:'pPartNo',
				title:'零件',
				align:'center',
				width:'120px'
			},{
				field:'pNameCn',
				title:'零件名称',
				align:'center',
				width:'120px'
			},{
				field:'qty',
				title:'用量',
				align:'center',
				width:'120px'
			}]
		}
	});
	
	//站点内容表格
	Ew.table('.demoTableRouteUloc',{
		btnValues:[],
		tableId:'table3',
		tableValue:{
			searchParams:tableSearchData,
			queryParams:function(){
				return  tableSearchData;
			},
			nohidden:true,
			url:"/base/routeuloc/queryRouteUloc",
			columns:[{
				field:'content',
				title:'站点内容',
				align:'center'
			},{
				field:'attention',
				title:'注意事项',
				align:'center'
			}
			]
		}
	});	
	
	
	setInterval(function loadData(){
	    var tmBasPlantId=$('#combo30').val();
	    var tmBasLineId=$('#combo32').val();
	    var tmBasWorkshopId=$('#combo31').val();
	    var ulocNo=$('#text30').val();
	    var data={};
	    data.tmBasPlantId = tmBasPlantId;
	    data.tmBasLineId = tmBasLineId;
	    data.tmBasWorkshopId = tmBasWorkshopId;
	    data.ulocNo = ulocNo; 
	    
	    $.ajax({
	        type: 'POST',
	        contentType: "application/json; charset=gbk",
	        dataType: 'json',
	        async: false,
	        url:  apiUrl+'/pcontrol/workShiftQuery/query',
	        data: JSON.stringify(data),
	        success: function (res) {
	        		$('#workDate').html('');
	         		$('#shiftno').html('');
	         		$('#passNum').html('');
	           		$('#planOnlineNum').html('');
	           		$('#actualOnlineNum').html('');
	        		$('#planOfflineNum').html('');
	        		$('#actualOfflineNum').html('');
	        		$('#errorMsg').html('');
	        		if(res.code != 10000){
	        			$('#errorMsg').html('<font color="red">'+res.message+"</font>");
	        		}
	            $.each(res.results, function(index, item) {
	            	$('#workDate').html(item.workDate);
	             	$('#shiftno').html(item.shiftno);
	             	$('#passNum').html(item.passNum);
	           		$('#planOnlineNum').html(item.planOnlineNum);
	           		$('#actualOnlineNum').html(item.actualOnlineNum);
	        		$('#planOfflineNum').html(item.planOfflineNum);
	        		$('#actualOfflineNum').html(item.actualOfflineNum);
	            });
	            
	        }
	    });
	    $('#tb_seq').bootstrapTable('refresh');
		$('#tb_order').bootstrapTable('refresh');
		$('#passQueue').bootstrapTable('refresh');
		
	    
	},5000);
	
	
	//生产序列表格
	Ew.table('.demoTableManufactureQueue',{
		btnValues:[],
		tableId:'tb_seq',
		tableValue:{
			searchParams:mainSearchData,
			queryParams:function(){
		  		$('#errorMsg').html('');
				return{}
			},
			onClickRow:function(item,$element){
 			},
			onLoadSuccess:function(){
				
			},
	        onErr:function (res){
	        	
	        },
			url:'/pcontrol/arrivedQueue/querySeq',
			columns:[{
          field: 'routeSeq',
          title: '序号',
  		  align:'center',
  		  sortable:true
      }, {
          field: 'route',
          title: '工艺路径',
  		  align:'center',
  		  sortable:true
      },{
          field: 'sn',
          title: 'SN',
  		  align:'center',
  		  sortable:true
      },{
          field: 'part',
          title: '产品',
  		  align:'center',
  		  sortable:true
      }, {
          field: 'orderNo',
          title: '订单编号',
  		  align:'center',
  		  sortable:true
      },{
          field: 'productDate',
          title: '过点时间',
  		  align:'center',
  		  sortable:true
      },{
          field: 'defectiveQyt',
          title: '缺陷数量',
  		  align:'center',
  		  sortable:true
      }]
	 }
	});
	
	
	//订单信息表格
	Ew.table('.demoTableOrder',{
		btnValues:[],
		tableId:'tb_order',
		tableValue:{
			searchParams:mainSearchData,
			queryParams:function(){
				return{}
			},
			onClickRow:function(item,$element){
 			}, 
			onLoadSuccess:function(){},
	        onErr:function (res){
	        	
	        },
			url:'/pcontrol/arrivedQueue/queryOrder',
			columns:[{
          field: 'route',
          title: '工艺路径',
  		  align:'center',
  		  sortable:true
      },{
          field: 'planSeq',
          title: '序号',
  		  align:'center',
  		  sortable:true
      },{
          field: 'orderNo',
          title: '订单编号',
  		  align:'center',
  		  sortable:true
      },{
          field: 'part',
          title: '产品',
  		  align:'center',
  		  sortable:true
      },{
          field: 'orderQty',
          title: '订单数量',
  		  align:'center',
  		  sortable:true
      },{
          field: 'canOnlineQty',
          title: '可上线数量',
  		  align:'center',
  		  sortable:true
      },{
          field: 'plant',
          title: '工厂',
  		  align:'center',
  		  sortable:true
      },{
          field: 'planDate',
          title: '排产上线日期',
  		  align:'center',
  		  sortable:true
      },{
          field: 'shiftno',
          title: '班次',
  		  align:'center',
  		  sortable:true,
  	      width:'120px',
	      formatter: function (value, row, index) {
	          var i = $('#shiftnoSel')[0].options.length;  
	          	  while (i--) {  
	          	  if ($('#shiftnoSel')[0].options[i].value == value) {  
	          	    return  $('#shiftnoSel')[0].options[i].text;
	          	  }  
	          }       
	      }
      }]
	 }
	});
	
	
	
	//通过队列表格
	Ew.table('.demoTablePassQueue',{
		btnValues:[],
		tableId:'table4',
		tableValue:{
			searchParams:mainSearchData,
			queryParams:function(){
		  		$('#errorMsg').html('');
				return{}
			},
			onClickRow:function(item,$element){
 			},
			onLoadSuccess:function(){
				
			},
	        onErr:function (res){
	        	
	        },
			url:'/pcontrol/passQueue/querySeq',
			columns:[ {
          field: 'route',
          title: '工艺路径',
  		  align:'center',
  		  sortable:true
      },{
          field: 'sn',
          title: 'SN',
  		  align:'center',
  		  sortable:true
      },{
          field: 'part',
          title: '产品',
  		  align:'center',
  		  sortable:true
      },{
          field: 'productDate',
          title: '过点时间',
  		  align:'center',
  		  sortable:true
      },{
		  field: 'scanType',
		  title: '过点类型',
		  align:'center',
		  sortable:true,
		  width:'120px',
		  formatter: function (value, row, index) {
		      var i = $('#scanTypeSel')[0].options.length;  
		          while (i--) {  
		          	if ($('#scanTypeSel')[0].options[i].value == value) {  
		          	  return  $('#scanTypeSel')[0].options[i].text;
		          	}  
		         }       
		      }
	  },{
          field: 'productBy',
          title: '过点人员',
  		  align:'center',
  		  sortable:true
      }, {
          field: 'orderNo',
          title: '订单编号',
  		  align:'center',
  		  sortable:true
      },{
          field: 'defectiveQyt',
          title: '缺陷数量',
  		  align:'center',
  		  sortable:true
      }]
	 }
	});
	
	
});






































function filesShow(fileUrl){
			    var pos = fileUrl.lastIndexOf(".");
				 var lastname = fileUrl.substring(pos+1,fileUrl.length);
				 var name = fileUrl.substring(0,pos);
				 if(lastname.toLowerCase()=='pdf'){
					 $("#fileList").append("<li id="+name+"></li>");
					 var  success=new PDFObject({ url:apiUrl+"/base/ulocfile/"+fileUrl,pdfOpenParams: {zoom:'100',view: 'FitV', page: '1' }}).embed(name);
					
				 }else if(lastname.toLowerCase()=='jpg'||lastname.toLowerCase()=='png'||lastname.toLowerCase()=='jpeg'||lastname.toLowerCase()=='bmp'
						 ||lastname.toLowerCase()=='gif'){
					 	$("#fileList").append("<li id="+name+"></li>");
					 var img = new Image();
					    img.src =apiUrl+"/base/ulocfile/"+fileUrl;
					    if(img.width<1200){
					    	img.width=1200;
					    }
						 	$("#"+name).append(img);
						 }
	};
	
	
	