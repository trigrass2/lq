layui.use('layer',function(){
	layer=layui.layer;
});

$(function(){
	//搜索条件
	var mainSearchData=[{
		idName:'comboFactory',
		text:'工厂',
		field:'tmBasPlantId',
		comboUrl:'/base/ulocSiteContent/queryPlantSelect',
		comboId:'tmBasPlantId',
		comboText:'plant',
		onClick:function(data){
     		 $('#inputCom23').val('');
			$('#inputCom43').val('');
			$('#textContentRemark').val('');
		}
	},{
		idName:'inputCom23',
		text:'工艺路径',
		comboUrl:'/base/ulocSiteContent/queryRounteSelect',
		comboId:'tmBasRouteId',
		comboText:'route',
		field:'tmBasRouteId',
		comboData:{
			id:['comboFactory'],
			field:['tmBasPlantId']
		},
	},{
		idName:'comboType',
		text:'类型',
		field:'routeType',
		comboUrl:'/system/codeList/getSelect',
		comboData:'ROUTE_TYPE',
		comboId:'no',
		comboText:'name'
	},{
		idName:'comboStatus',
		text:'状态',
		field:'status',
		comboUrl:'/system/codeList/getSelect',
		comboData:'ROUTE_STATUS',
		comboId:'no',
		comboText:'name'
	},{
		idName:'inputCom43',
		text:'当前站点',
		field:'tmBasRouteUlocId',
		comboUrl:'/base/ulocSiteContent/queryUlocId',
		comboId:'ulocid',
		comboText:'ulocName',
		comboData:{
			id:['comboFactory','inputCom23'],
			field:['tmBasPlantId','tmBasRouteId']
		}
	},{
		idName:'comboType2',
		text:'服务类型',
		field:'type',
		comboUrl:'/system/codeList/getSelect',
		comboData:'SERVICE_TYPE',
		comboId:'no',
		comboText:'name'
	},{
		idName:'textContentRemark',
		text:'后台服务',
		field:'service'
	}]

	Ew.search('.searchForm',{
		title:'查询',
		textValues:mainSearchData,
		btnValues:[{
			btnId:'btnSearch',
			text:'搜索',
			onClick:function(data){
				$('#tableBasUlocService').bootstrapTable('refreshOptions',{pageNumber:1});
			}
		},{
			btnId:'btnClear',
			text:'重置',
			tableid:['tableBasUlocService']
		}]
	});

	//主表格
	Ew.getDictVal(['ROUTE_TYPE', 'ROUTE_STATUS','SERVICE_TYPE'], function (re) {
		Ew.table('.mainTable',{
			btnValues:[{
				btnId:'btnAdd',text:'新增',onClick:function(){
					daliogShow('add');
				}
			},{
				btnId:'btnEdit',text:'编辑',otherOption:[{id:'tableBasUlocService',selectNum: 1}],onClick:function(){
					var rows = $('#tableBasUlocService').bootstrapTable('getSelections');
					var flag = true;
					$.each(rows,function(index,row){
							if(!(row.routeStatus== 'N' || row.routeStatus== 'M')){
								flag = false;
							}
						});
					if(flag){
						daliogShow('change');
					}else{
						layer.msg("只有工艺路径状态为新建和维护，才可以做新增、编辑、删除等操作");
					}
				}
			},{
				btnId:'btnDelete',text:'删除',isTrue:true,otherOption:[{id:'tableBasUlocService',selMinNum: 1}],onClick:function(){
					var rows = $('#tableBasUlocService').bootstrapTable('getSelections');
					ids = [];
					var flag = true;
					
					$.each(rows,function(index,row){
						if(!(row.routeStatus== 'N' || row.routeStatus== 'M')){
								flag = false;
							}
						ids.push(row.tmBasUlocServiceId);
					});
					
						if(flag){
							datas = JSON.stringify(ids);
							var url = '/bas/basUlocService/delete'
							$.when(Ew.ewAjax(url,datas)).done(function(results){
								$('#tableBasUlocService').bootstrapTable('refreshOptions',{pageNumber:1});
							});
					
						}else{
							layer.msg("只有工艺路径状态为新建和维护，才可以做新增、编辑、删除等操作");
						}
				}
			},{
				btnId:'btnDownload',text:'模板下载',isTrue:true,selMinNum:1,onClick:function(){
					
					window.top.location.href= Ew.apiUrl +'/bas/basUlocService/downLoad'
				}
			},{
				//btnId:'imp',text:'导入',selMinNum:1,url:'/order/pporder/import',tableId:'table1'
				btnId:'btnImport',text:'导入',selMinNum:1,url:'/bas/basUlocService/import',tableId:'tableBasUlocService'
				
			},{
				btnId:'btnExport',text:'导出',onClick:function(){
					var tmBasPlantId = $('#comboFactory').val();
					var tmBasRouteId = $('#inputCom23').val();
					var routeType = $('#comboType').val();
					var status = $('#comboStatus').val();
					var ulocId = $('#inputCom43').val();
					var type = $('#comboType2').val();
					var service = $('#textContentRemark').val();
					window.top.location.href= apiUrl +'/bas/basUlocService/export?tmBasPlantId='+tmBasPlantId+'&tmBasRouteId='+tmBasRouteId+'&routeType='+routeType+'&status='+status+'&ulocId='+ulocId+'&type='+type+'&service='+service;
				}
			}],
			tableId:'tableBasUlocService',
			tableValue:{
				searchParams:mainSearchData,
				queryParams:function(){
					return{}
				},
				onClickRow:function(item,$element){
	
				},
				onLoadSuccess:function(){
	
				},
				url:'/bas/basUlocService/querylistByPage',
				columns:[{
					checkbox: true
				},{
					field: 'plant',
					title: '工厂',
					align: 'center',
					sortable:true
				},{
					field: 'routeName',
					title: '工艺路径',
					align: 'center',
					sortable:true
				},{
					field: 'routeType',
					title: '类型',
					align: 'center',
					sortable:true,
					formatter: function (value, row, index) {
			           	return re.ROUTE_TYPE[value]
			        }
				},{
					field: 'routeStatus',
					title: '状态',
					align: 'center',
					sortable:true,
					formatter: function (value, row, index) {
			           	return re.ROUTE_STATUS[value]
			        }
				},{
					field: 'ulocName',
					title: '当前站点',
					align: 'center',
					sortable:true
				},{
					field: 'ulocSeq',
					title: '站点顺序',
					align: 'center',
					sortable:true
				},{
					field: 'partgroup',
					title: '产品组',
					align: 'center',
					sortable:true
				},{
					field: 'part',
					title: '产品',
					align: 'center',
					sortable:true
				},{
					field: 'serviceType',
					title: '类型',
					align: 'center',
					sortable:true,
					formatter: function (value, row, index) {
			           	return re.SERVICE_TYPE[value]
			        }
				},{
					field: 'service',
					title: '服务名称',
					align: 'center',
					sortable:true
				}]
			}
		});
	})	
})

function daliogShow(type){
	var title=type=='add'?'新增':'编辑';
	var defaultTable=type=='add'?'':'tableBasUlocService';
	Ew.dialog('mainFromEdit',{
		title:title,
		btnValues:[{
			btnId:'btnSave',
			text:'保存',
			formid:'form',
			onClick:function(data){
				if(type=='change'){
					data.tmBasUlocServiceId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tmBasUlocServiceId;
				}
				datas = JSON.stringify(data);
				var url = (type=='add'?'/bas/basUlocService/add':'/bas/basUlocService/update');
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#mainFromEdit').modal('hide');
					$('#tableBasUlocService').bootstrapTable('refresh');
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
				idName:'combo11',
				text:'工厂',
				comboUrl:'/base/plant/publicPlantSelect',
				comboId:'tmBasPlantId',
				comboText:'plant',
				field:'tmBasPlantId',
				valid:['notEmpty'],
				disabled:type=='add'?false:true,
				comboData:type=='add'?JSON.stringify({
					enabled:1
				}):{},
				onClick:function(data){
					Ew.selectLink({
				        comboUrl:'/base/ulocSiteContent/queryUlocStep',
				        comboData:JSON.stringify({tmBasPlantId:data.id}),
				        id:['combo13'],
				        comboId:'ulocSeq',
				        comboText:'ulocSeq'
				    });
					Ew.selectLink({
				        comboUrl:'/base/ulocSiteContent/queryUlocIdBySeq',
				        comboData:JSON.stringify({tmBasPlantId:data.id}),
				        id:['combo14'],
				        comboId:'tmBasRouteUlocId',
				        comboText:'ulocName'
				    });

						   $('#combo13').html('');
							 $('#combo14').html('');
							  $('#combo12').html('');
							  $('#combo18').html('');
							$('#combo19').html('');
							$("#combo19").prop('disabled',false);
							$("#combo18").prop('disabled',false);

				}

			},{
				idName:'combo12',
				text:'工艺路径',
				comboUrl:'/base/ulocSiteContent/queryRouteByStatusSelect',
				comboData:
		        {
					id:['combo11'],
					field:['tmBasPlantId']
		        },
				comboId:'tmBasRouteId',
				comboText:'routeName',
				field:'tmBasRouteId',
				valid:['notEmpty'],
				onClick:function(data){
					$("#combo19").prop('disabled',false);
					$("#combo18").prop('disabled',false);
					
					$('#combo18').html('');
					$('#combo19').html('');
					
					Ew.selectLink({
				        comboUrl:'/base/ulocSiteContent/queryUlocIdBySeq',
				        comboData:JSON.stringify({tmBasRouteId:data.id,tmBasPlantId:$("#combo11").val()}),
				        id:['combo14'],
				        comboId:'tmBasRouteUlocId',
				        comboText:'ulocName'
				    });
				    
				    Ew.selectLink({
				        comboUrl:'/base/ulocSiteContent/queryUlocStep',
				        comboData:JSON.stringify({tmBasRouteId:data.id}),
				        id:['combo13'],
				        comboId:'ulocSeq',
				        comboText:'ulocSeq'
				    });
				    
				    $.post(apiUrl+"/base/ulocSiteContent/queryPartsAndPart",{tmBasRouteId:data.id},function(result){
    					
    					var partgroupId = result["results"][0].tmBasPartgroupId;
    					var partId = result["results"][0].tmBasPartId;
    					var tmBasPlantIds = result["results"][0].tmBasPlantId;
    					//产品组判断
    					if(partId != null && typeof(partId) != 'undefined'){
    						Ew.selectLink({
						        comboUrl:'/base/ulocSiteContent/queryPartgroup',
						        comboData:JSON.stringify({tmBasRouteId:data.id,tmBasPlantId:$("#combo11").val()}),
						        id:['combo18'],
						        comboId:'tmBasPartgroupId',
						        comboText:'partgroup'
						    });
						    
						    Ew.selectLink({
						        comboUrl:'/base/ulocSiteContent/queryPartgroup',
						        comboData:JSON.stringify({tmBasRouteId:data.id,tmBasPlantId:$("#combo11").val(),tmBasPartgroupId:partgroupId}),
								id:['combo19'],
								comboId:'tmBasPartId',
						        comboText:'part'
						    });
    						$("#combo19").prop('disabled',true);
							$("#combo18").prop('disabled',true);
    						
    					} else if(partgroupId != null && typeof(partgroupId) != 'undefined'){
    						Ew.selectLink({
						        comboUrl:'/base/ulocSiteContent/queryPartgroup',
						        comboData:JSON.stringify({tmBasRouteId:data.id,tmBasPlantId:$("#combo11").val(),tmBasPartgroupId:partgroupId}),
						        id:['combo18'],
						        comboId:'tmBasPartgroupId',
						        comboText:'partgroup'
						    });
    						$("#combo18").prop('disabled',true);
    					}
    					
					});
				},
				disabled:type=='add'?false:true,
				isSearch:type=='add'?true:false
			},{
				idName:'combo13',
				text:'站点顺序号',
				field:'ulocSeq',
				comboUrl:'/base/ulocSiteContent/queryUlocStep',
				comboId:'ulocSeq',
				comboText:'ulocSeq',
				comboData:type=='add'?JSON.stringify({
					enabled:1,
				}):JSON.stringify({
					enabled:1,
					tmBasPlantId:$('#tableBasUlocFile').bootstrapTable('getSelections')[0].tmBasPlantId,
					tmBasRouteId:$('#tableBasUlocFile').bootstrapTable('getSelections')[0].tmBasRouteId,
					tmBasRouteUlocId:$('#tableBasUlocFile').bootstrapTable('getSelections')[0].tmBasRouteUlocId
				}),
				valid:['notEmpty',{type:"string",min:0,max:32}],
				disabled:type=='add'?false:true,
				onClick:function(data){
				    Ew.selectLink({
				        comboUrl:'/base/ulocSiteContent/queryUlocIdBySeq',
				        comboData:JSON.stringify({ulocSeq:data.id,tmBasPlantId:$("#combo11").val(),tmBasRouteId:$("#combo12").val()}),
				        id:['combo14'],
				        comboId:'tmBasRouteUlocId',
				        comboText:'ulocName'
				    });
				}
				/*isSearch:type=='add'?true:false*/
			},{
				idName:'combo14',
				text:'当前站点',
				field:'tmBasRouteUlocId',
				comboUrl:'/base/ulocSiteContent/queryUlocIdBySeq',
				comboId:'tmBasRouteUlocId',
				comboText:'ulocName',
				comboData:type=='add'?JSON.stringify({
					enabled:1,
				}):JSON.stringify({
					enabled:1,
					tmBasPlantId:$('#tableBasUlocFile').bootstrapTable('getSelections')[0].tmBasPlantId,
					tmBasRouteId:$('#tableBasUlocFile').bootstrapTable('getSelections')[0].tmBasRouteId,
					ulocSeq:$('#tableBasUlocFile').bootstrapTable('getSelections')[0].ulocSeq
				}),
				valid:['notEmpty',{type:"string",min:0,max:32}],
				disabled:type=='add'?false:true,
				onClick:function(data){
				    Ew.selectLink({
				        comboUrl:'/base/ulocSiteContent/queryUlocStep',
				        comboData:JSON.stringify({tmBasRouteUlocId:data.id,tmBasPlantId:$("#combo11").val(),tmBasRouteId:$("#combo12").val()}),
				        id:['combo13'],
				        comboId:'ulocSeq',
				        comboText:'ulocSeq'
				    });
				}
				/*isSearch:type=='add'?true:false*/
			},{
				idName:'combo18',
				text:'产品组',
				field:'tmBasPartgroupId',
				comboUrl:'/worktime/part/queryPartGroupSuggest',
				comboId:'tmBasPartgroupId',
				comboText:'partgroup',
				disabled:type=='add'?false:true,
				isSearch:type=='add'?true:false,
				comboData:{
					id:['combo11'],
					field:['tmBasPlantId']
				},
				isSearch:true
			},{
				idName:'combo19',
				text:'产品',
				field:'tmBasPartId',
				comboUrl:'/worktime/part/queryPartPartGroupSuggest',
				comboId:'tmBasPartId',
				comboText:'part',
				disabled:type=='add'?false:true,
				isSearch:type=='add'?true:false,
				comboData:{
					id:['combo11','combo18'],
					field:['tmBasPlantId','tmBasPartgroupId']
				},
				isSearch:true
			},{
				idName:'comboType222',
				text:'类型',
				field:'type',
				valid:['notEmpty'],
				comboUrl:'/system/codeList/getSelect',
				comboData:'SERVICE_TYPE',
				comboId:'no',
				comboText:'name'
			},{
				idName:'number218',
				text:'服务名称',
				valid:['notEmpty'],
				field:'service',
			},{
	        	idName:'text311',
				text:'版本号',
				field:'version',
				hidden:true
			}],
			defaultTable:defaultTable
		}
	})
}
