
$(function(){
	//搜索条件
	var mainSearchData=[{
		idName:'combo51',
		text:'工厂',
		comboUrl:'/base/plant/publicPlantSelect',
		comboId:'tmBasPlantId',
		comboText:'plant',
		field:'tmBasPlantId',
		onClick:function(data){
      $('#inputCom52').val('');
			$('#inputCom53').val('');
		  $('#inputCom54').val('');
		}
	},{
		idName:'inputCom52',
		text:'产品组',
		comboUrl:'/worktime/part/queryPartGroupSuggest',
		comboId:'tmBasPartgroupId',
		comboText:'partgroup',
		field:'partgroup',
		comboData:{
			id:['combo51'],
			field:['tmBasPlantId']
		},
		onClick:function(data){
			$('#inputCom53').val('');
		}
	},{

		idName:'inputCom53',
		text:'产品',
		comboUrl:'/worktime/part/queryPartPartGroupSuggest',
		comboData:
			{
			id:['combo51','inputCom52'],
			field:['tmBasPlantId','partgroup'],
			other:{}
			},
		comboId:'tmBasPartId',
		comboText:'part',
		field:'part',
		onClick:function(data){
 			$('#inputCom54').val('');
		},
		onSuccess:function(data){
			console.log(data)
		}


	},{
		idName:'inputCom54',
		text:'工艺路径',
		comboUrl:'/base/route/queryBasRouteSuggest',
		comboData:
			{
			id:['combo51','inputCom53'],
			field:['tmBasPlantId','part'],
			other:{}
			},
		comboId:'tmBasRouteId',
		comboText:'route',
		field:'route',
		onSuccess:function(data){
			console.log(data)
		}

	},{
		idName:'combo55',
		field:'routeStatus',
		text:'状态',
		comboUrl:'/system/codeList/getSelect',
		comboData:'ROUTE_STATUS',
		comboId:'no',
		comboText:'name'
	}];
	//搜索11


	Ew.search('.demoSearch',{
		title:'查询',
		listWidth:'272px',
		textValues:mainSearchData,
		btnValues:[{
			btnId:'btnSearch',
			text:'搜索',
			onClick:function(data){
				$('#table1').bootstrapTable('refreshOptions',{pageNumber:1});
			}
		},{
			btnId:'btnClear',
			text:'重置',
			tableid:['table1']
		}]
	});




Ew.getDictVal(['ROUTE_STATUS', 'ROUTE_TYPE','CREATE_SN_TYPE'], function (re) {
	//主表格
	Ew.table('.demoTable',{
		btnValues:[{
			btnId:'btnAdd',text:'新增',onClick:function(){
				daliogShow('add')
			}
		},{
			btnId:'btnEdit',text:'编辑',otherOption:[{id:'table1',selectNum: 1}],onClick:function(){
							 var rows = $('#table1').bootstrapTable('getSelections');
							 var row = rows[0];
							 if (rows.length > 1) {
										 layer.msg("只能选择一条数据编辑！")
									 return;
							 }
 							 var ids = [];
							 $.each(rows,function(index,row){
								 ids.push(row.tmBasRouteId);
							 });
							 datas = JSON.stringify(ids);
							 var ewRoute = 0;
							 var url = '/base/routeuloc/queryPpWip';

							 $.when(Ew.ewAjax(url,datas,'','',true)).done(function(results){
		                   if(results.length>0){
												 layer.msg("当前工艺路径正在使用中，不允许做编辑，请确认");
											 }else{
													 if(row.routeStatus=='P'){
															var urlSeq = '/base/routeuloc/queryPpOrderSeq';
														$.when(Ew.ewAjax(urlSeq,datas,'','',true)).done(function(results){
																				if(results.length>0){
																					 layer.msg("订单序列表中有数据，不允许做编辑，请确认");
																				}else{
																					 daliogShow('change');
																				}
																	 });
													   }else{
																 daliogShow('change');
														 }
											 }
									});
 			}
		},{
			btnId:'btnIssue',text:'发布',isTrue:true,otherOption:[{id:'table1',selMinNum: 1}],onClick:function(){

							 var rows = $('#table1').bootstrapTable('getSelections');
							 var row = rows[0];
 							 var ids = [];
							 $.each(rows,function(index,row){
								 ids.push(row.tmBasRouteId);
							 });
							 datas = JSON.stringify(ids);
							 var url = '/base/route/issueRoute';
							 $.when(Ew.ewAjax(url,datas)).done(function(results){
								 $('#table1').bootstrapTable('refresh');
											});
			}
		},{
			btnId:'btnExport',text:'导出',isTrue:true,selMinNum:1,onClick:function(){
				var tmBasPlantId = $('#combo11').val();
				var workshopNo = $('#workshopNoL').val();
				var nameCn = $('#nameCnL').val();
				window.top.location.href= apiUrl +'/base/route/export?tmBasPlantId='+tmBasPlantId+'&workshopNo='+workshopNo+'&nameCn='+nameCn;
			}
		},{
			btnId:'btnCopyRoute',text:'复制工艺路径',isTrue:true,selMinNum:1,onClick:function(){

			}
		},{
			btnId:'btnShowImageRoute',text:'图形展示工艺路径',onClick:function(){
                var tsSysResourceIdIframe=ewData.ResourceId.processGraphics;
                var resourceIcoIframe='';
                var nameIframe='工艺路径图形化展示';
                var urlIframe="../Base/basRouteGraphical/basRouteGraphical.html";
                var mesCom=new mesComMethod();
                mesCom.openNewPage(tsSysResourceIdIframe,resourceIcoIframe,nameIframe,urlIframe,true);
			}
		},{
			btnId:'btnPrint',text:' 打印文件',isTrue:true,selMinNum:1,onClick:function(){

			}
		}],
		tableId:'table1',
		tableValue:{
			searchParams:mainSearchData,
			queryParams:function(){
				return{}
			},
			onClickRow:function(item,$element){

			},
			onLoadSuccess:function(){

	        },
			url:'/base/route/querylistByPage',
			columns:[{
	             checkbox: true
	         },{
	             field: 'plant',
	             title: '工厂',
	             sortable:true,
	             width:'120px'
	         },{
	             field: 'routeNo',
	             title: '工艺路径编号',
	             formatter: function (value, row, index) { //处理状态的显示
	                  return '<a class="route-href" href="javascript:void(0)" onclick="showRouteUloc(\'' + row.plant +'\',\''+ row.tmBasPlantId+'\',\''+ row.routeNo +'\',\''+ row.name +'\',\''+ row.partgroup +'\',\''+ row.part +'\',\''+ row.routeVersion +'\',\''+ row.routeStatus +'\',\''+ row.tmBasRouteId + '\')"><font>' + row.routeNo + '</font></a>';
	                //  return '<a href="../BasRouteUloc/basRouteUloc.html" target="xxl"><font>' + row.routeNo + '</font></a>';
	             },
	             sortable:true,
	             width:'120px'
	         },{
	             field: 'name',
	             title: '工艺路径名称',
	             sortable:true,
	             width:'120px'

	         },{
	             field: 'routeVersion',
	             title: '版本',
	             sortable:true,
	             width:'120px'
	         }, {
	             field: 'workshop',
	             title: '车间',
	             sortable:true,
	             width:'120px'
	        //  },{
	        //      field: 'line',
	        //      title: '产线',
	        //      sortable:true,
	        //      width:'120px'
	         },{
	             field: 'partgroup',
	             title: '产品组',
	             sortable:true,
	             width:'120px'
	         },{
	             field: 'part',
	             title: '产品',
	             sortable:true,
	             width:'120px'
	         },{
	             field: 'routeType',
	             title: '类型',
							 sortable:true,
							 width:'120px',
							 formatter: function (value, row, index) {
		             return re.ROUTE_TYPE[value]
		           }
	         },{
	             field: 'routeStatus',
	             title: '状态',
							 sortable:true,
							 width:'120px',
							 formatter: function (value, row, index) {
		             return re.ROUTE_STATUS[value]
		           }

				   },{
						 field: 'creatSnType',
						 title: 'SN生成模式',
						 sortable:true,
						 width:'120px',
						 formatter: function (value, row, index) {
							 return re.CREATE_SN_TYPE[value]
						 }
					 },{
							 field: 'orderSnQty',
							 title: '生成订单个数',
							 sortable:true,
							 width:'160px'
	         },{
							 field: 'maxSnQty',
							 title: '最大SN生成数量',
							 sortable:true,
							 width:'160px'
					 },{
							 field: 'minSnQty',
							 title: '最小SN缓冲数量',
							 sortable:true,
							 width:'160px'
	         },{
	             field: 'routeStartDate',
	             title: '生效日期',
	             sortable:true,
	             width:'120px'
	         },{
	             field: 'routeEndDate',
	             title: '失效日期',
	             sortable:true,
	             width:'120px'
	         },{
	             field: 'remark',
	             title: '备注',
	             sortable:true,
	             width:'120px'
	         },{
	             field: 'createBy',
	             title: '创建人员',
	             sortable:true,
	             width:'120px'
	         },{
	             field: 'createDate',
	             title: '创建日期',
	             sortable:true,
	             width:'120px'
	         },{
	             field: 'updateBy',
	             title: '更新人员',
	             sortable:true,
	             width:'120px'
	         },{
	             field: 'updateDate',
	             title: '更新日期',
	             sortable:true,
	             width:'120px'
	         }
				 ]
		}
	});
 })
})



function daliogShow(type){
	var title=type=='add'?'新增':'编辑';
	var defaultTable=type=='add'?'':'table1';
	Ew.dialog('demoadd',{
		title:title,
		btnValues:[{
			btnId:'btnSave',
			text:'保存',
			formid:'demoform',
			onClick:function(data){
				var snType = $('#combo305').val();
				var orderSnQty = $('#number113').val();
				var maxSnQtys = $('#number111').val();
				var minSnQtys = $('#number112').val();
				if(snType=='ORD'){
            if(orderSnQty==''){
							layer.msg("生成模式选择为ORD-按订单生成，生成订单个数必填");
								return;
						}
				}else if(snType=='BUF'){
					if(maxSnQtys==''||minSnQtys==''){
						layer.msg("生成模式选择为BUF-按缓冲数量生成，最大SN生成数量、最小SN缓冲数量必填");
							return;
					}
				}else{

				}

				if((minSnQtys-maxSnQtys)>0){
 					layer.msg("最大SN生成数量小于最小SN缓冲数量");
 						return;
				}
				if(type=='change') data.tmBasRouteId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tmBasRouteId;
				datas = JSON.stringify(data);
				var url = (type=='add'?'/base/route/add':'/base/route/update');
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#demoadd').modal('hide');
					$('#table1').bootstrapTable('refresh');
	             });
			}
		},{
			btnId:'btnCancel',
			text:'取消'
		}],
		form:{
			formId:'demoform',
			columnNum:2,
			listWidth:350,
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
				        comboUrl:'/base/workshop/publicWorkshopSelect',
				        comboData:JSON.stringify({tmBasPlantId:data.id,enabled:1}),
				        id:['combo12'],
				        comboId:'tmBasWorkshopId',
				        comboText:'workshop'
				    });
						Ew.selectLink({
									comboUrl:'/base/line/publicLineSelect',
									comboData:JSON.stringify({tmBasPlantId:data.id,enabled:1}),
									id:['combo13'],
									comboId:'tmBasLineId',
									comboText:'line'
							});

						  $('#combo18').select2('val',['']);
	            $('#combo19').select2('val',['']);
				}
			},{
				idName:'combo12',
				text:'车间',
				comboUrl:'/base/workshop/publicWorkshopSelect',
				comboId:'tmBasWorkshopId',
				comboText:'workshop',
				field:'tmBasWorkshopId',

				comboData:type=='add'?JSON.stringify({
					enabled:1
				}):JSON.stringify({
					enabled:1,
					tmBasPlantId:$('#table1').bootstrapTable('getSelections')[0].tmBasPlantId
				}),
				onClick:function(data){
					// Ew.selectLink({
				  //       comboUrl:'/base/line/publicLineSelect',
				  //       comboData:JSON.stringify({tmBasWorkshopId:data.id,enabled:1}),
				  //       id:['combo13'],
				  //       comboId:'tmBasLineId',
				  //       comboText:'line'
				  //   });
				}
			// },{
			// 	idName:'combo13',
			// 	text:'产线',
			// 	comboUrl:'/base/line/publicLineSelect',
			// 	comboId:'tmBasLineId',
			// 	comboText:'line',
			// 	field:'tmBasLineId',
 		// 		comboData:type=='add'?JSON.stringify({
			// 		enabled:1
			// 	}):JSON.stringify({
			// 		enabled:1,
			// 		tmBasPlantId:$('#table1').bootstrapTable('getSelections')[0].tmBasPlantId,
			// 		tmBasWorkshopId:$('#table1').bootstrapTable('getSelections')[0].tmBasWorkshopId
			// 	}),
			},{
				idName:'text14',
				text:'版本',
				field:'routeVersion',
				disabled:true
			},{
				idName:'text15',
				text:'编号',
				field:'routeNo',
				valid:['notEmpty'],
				disabled:type=='add'?false:true,
			},{
				idName:'combo16',
				text:'类型',
				field:'routeType',
			  valid:['notEmpty'],
				comboUrl:'/system/codeList/getSelect',
				comboData:'ROUTE_TYPE',
				comboId:'no',
				comboText:'name'
			},{
				idName:'text17',
				text:'名称',
				field:'name',
				valid:['notEmpty']
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
				isSearch:true,
				onClick:function(data){
           $('#combo19').select2('val',['']);
 				}
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
				idName:'combo305',
				text:'SN生成模式',
				field:'creatSnType',
				comboUrl:'/system/codeList/getSelect',
				comboData:'CREATE_SN_TYPE',
				comboId:'no',
				comboText:'name',
				onClick:function(data){
 							if(data.id=='ORD'){
								$('#number111').attr('disabled', true);
                $('#number112').attr('disabled', true);
								$('#number113').attr('disabled', false);
							}else if(data.id=='BUF'){
								 $('#number111').attr('disabled', false);
								 $('#number112').attr('disabled', false);
								 $('#number113').attr('disabled', true);
							}else{
								$('#number111').attr('disabled', true);
								$('#number112').attr('disabled', true);
								$('#number113').attr('disabled', true);
							}
				}
			},{
				idName:'number113',
				text:'生成订单个数',
				field:'orderSnQty',
				defaultValue:type=='add'?'1':$('#table1').bootstrapTable('getSelections')[0].orderSnQty,
			  valid:['',{type:'number',min:0,max:1000}]
			},{
				idName:'number111',
				text:'最大SN生成数量',
				field:'maxSnQty',
				defaultValue:type=='add'?'1':$('#table1').bootstrapTable('getSelections')[0].maxSnQty,
				valid:['',{type:'number',min:0,max:1000}]
			},{
				idName:'number112',
				text:'最小SN缓冲数量',
				field:'minSnQty',
				defaultValue:type=='add'?'1':$('#table1').bootstrapTable('getSelections')[0].minSnQty,
			  valid:['',{type:'number',min:0,max:1000}]
			},{

				idName:'day113',
				text:'生效日期',
				valid:[],
				field:'routeStartDate',
			  valid:['notEmpty'],
			  minDate:Ew.getNowday(),
			  limit:{date:'day114',type:'setStartDate',otherField:'routeEndDate'},
        defaultValue:type=='add'?Ew.getNowday():$('#table1').bootstrapTable('getSelections')[0].routeStartDate
 			},{
				idName:'day114',
				text:'失效日期',
				valid:[],
				minDate:Ew.getNowday(),
				field:'routeEndDate',
				valid:['notEmpty'],
				limit:{date:'day113',type:'setEndDate',otherField:'routeStartDate'},
				defaultValue:type=='add'?'2099-12-31':$('#table1').bootstrapTable('getSelections')[0].routeEndDate
 			},{
				idName:'text113',
				text:'备注',
				field:'remark',
			},{
				idName:'text114',
				text:'版本号',
				field:'version',
				hidden:true
			}
		 ],
			defaultTable:defaultTable
		}
	})


			if(type=='add'){

			}else{
				var flag=$('#table1').bootstrapTable('getSelections')[0].creatSnType;
             console.log(flag+'flag');
								 if(flag=='ORD'){
								 $('#number111').attr('disabled', true);
									$('#number112').attr('disabled', true);
								 $('#number113').attr('disabled', false);
							 }else if(flag=='BUF'){
									$('#number111').attr('disabled', false);
									$('#number112').attr('disabled', false);
									$('#number113').attr('disabled', true);
							 }else{
								 $('#number111').attr('disabled', true);
								 $('#number112').attr('disabled', true);
								 $('#number113').attr('disabled', true);
							 }
			}


}

function showRouteUloc(plant,tmBasPlantId,routeNo,name,partgroup,part,routeVersion,routeStatus,tmBasRouteId){
    var tsSysResourceIdIframe=ewData.ResourceId.processMaintenance;
    var resourceIcoIframe='';
    var nameIframe='工艺路径站点维护';
    var urlIframe="../Base/BasRouteUloc/basRouteUloc.html?plant="+plant+"&tmBasPlantId="+tmBasPlantId+"&routeNo="+routeNo+"&name="+name+"&partgroup="+partgroup+"&part="+part+"&routeVersion="+routeVersion+"&routeStatus="+routeStatus+"&tmBasRouteId="+tmBasRouteId;
    var mesCom=new mesComMethod();
    mesCom.openNewPage(tsSysResourceIdIframe,resourceIcoIframe,nameIframe,urlIframe,true);
   // window.location.href = "../BasRouteUloc/basRouteUloc.html?plant="+plant+"&tmBasPlantId="+tmBasPlantId+"&routeNo="+routeNo+"&name="+name+"&partgroup="+partgroup+"&part="+part+"&routeVersion="+routeVersion+"&routeStatus="+routeStatus+"&tmBasRouteId="+tmBasRouteId;
}
