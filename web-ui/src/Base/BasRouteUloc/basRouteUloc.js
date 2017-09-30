
//---------------------------------------全局变量-----------------------------------------------------
var tmBasRouteId,tmBasRouteUlocId,tmBasPlantId;

$(function(){
	//搜索条件
	var mainSearchData=[{
		idName:'text51',
		text:'工厂',
		field:'routeNo',
		disable:true
	},{
		idName:'text52',
		text:'工艺路径',
		field:'routeNo',
		disable:true
	},{
		idName:'text53',
		text:'产品/产品组',
		field:'routeNo',
		disable:true
	},{
		idName:'text54',
		text:'版本',
		field:'routeNo',
		disable:true,
		moreSearch:true
	},{
		idName:'text55',
		text:'状态',
		field:'routeNo',
		disable:true
	},{
		idName:'text56',
		text:'工艺路径Id',
		field:'tmBasRouteId',
		disable:true,
	  moreSearch:true
	}];

	Ew.search('.demoSearch',{
		title:'查询',
		textValues:mainSearchData,
		btnValues:[]
	});
	$("input[id^=text5]").attr('readonly',true);
	//搜索11
	var plant=UrlParm.parm("plant");
    tmBasPlantId=UrlParm.parm("tmBasPlantId");
    var routeNo=UrlParm.parm("routeNo");
    var name=UrlParm.parm("name");
    var partgroup=UrlParm.parm("partgroup");
    var part=UrlParm.parm("part");
    var routeStatus=UrlParm.parm("routeStatus");
    var routeVersion=UrlParm.parm("routeVersion");
    tmBasRouteId=UrlParm.parm("tmBasRouteId");

    var urlRefresh = '/base/route/selectRouteOne';
		var datasRefresh ={tmBasRouteId:tmBasRouteId};
		datasRefreshs = JSON.stringify(datasRefresh);


    $("#text51").val(plant);
    $("#text52").val(routeNo+'-'+name);
		if(part!='undefined'&&partgroup!='undefined'){
			    $("#text53").val(part+'/'+partgroup);
		}else if(part=='undefined'&&partgroup!='undefined'){
			    $("#text53").val(partgroup);
		}else if(part!='undefined'&&partgroup=='undefined'){
			    $("#text53").val(part);
		}

    $("#text54").val(routeVersion);
		$("#text56").val(tmBasRouteId);

    if (routeStatus == 'N') {
        routeStatus = '新建';
    } else if(routeStatus == 'M'){
        routeStatus = '维护中';
    }else if(routeStatus == 'P'){
        routeStatus = '发布';
    }else{
        routeStatus='失效';
    }
    $("#text55").val(routeStatus);

Ew.getDictVal(['SERVICE_TYPE'], function (re) {
	//主表格
	Ew.table('.demoTable',{
		btnValues:[{
			btnId:'btnAdd',text:'新增',onClick:function(){
				$.when(Ew.ewAjax(urlRefresh,datasRefreshs,'','',true)).done(function(resultsRefresh){
 							 if (resultsRefresh == 'N'||resultsRefresh == 'M') {
										daliogShow('add')
							 }else{
								 layer.msg("只有工艺路径状态为新建和维护，才可以做新增、编辑、删除等操作");
							 }
		 		});



			}
		},{
			btnId:'btnEdit',text:'编辑',otherOption:[{id:'table1',selectNum: 1}],onClick:function(){
 				$.when(Ew.ewAjax(urlRefresh,datasRefreshs,'','',true)).done(function(resultsRefresh){
							 if (resultsRefresh == 'N'||resultsRefresh == 'M') {
										     	daliogShow('change')
							 }else{
								 layer.msg("只有工艺路径状态为新建和维护，才可以做新增、编辑、删除等操作");
							 }
				});


			}
		},{
			btnId:'btnDelete',text:'删除',otherOption:[{id:'table1',selMinNum: 1}],onClick:function(){
     $.when(Ew.ewAjax(urlRefresh,datasRefreshs,'','',true)).done(function(resultsRefresh){
       if (resultsRefresh == 'N'||resultsRefresh == 'M') {
					var rows = $('#table1').bootstrapTable('getSelections');
					var ids = [];
					$.each(rows,function(index,row){
						ids.push(row.tmBasRouteUlocId);
					});
					datas = JSON.stringify(ids);
					var url = '/base/routeuloc/deleteMore';
					$.when(Ew.ewAjax(url,datas)).done(function(results){
					    	$('#table1').bootstrapTable('refreshOptions',{pageNumber:1});
							});
				}else{
					layer.msg("只有工艺路径状态为新建和维护，才可以做新增、编辑、删除等操作");
				}
				});
			}
		},{
			btnId:'btnDownload',text:'模板下载',isTrue:true,selMinNum:1,onClick:function(){

			}
		},{
			btnId:'btnImport',text:'导入',isTrue:true,selMinNum:1,onClick:function(){

			}
		},{
			btnId:'btnExport',text:'导出',isTrue:true,selMinNum:1,onClick:function(){

			}
		},{
       btnId: 'btnHomeAddSub', otherBtn:true, otherOption:[{id:'table1',selectNum: 1}] //控制子表按钮是否 可用

    },{
       btnId: 'btnHomeEditSub', otherBtn:true,otherOption:[{id:'table1',selectNum: 1},{id:'table21',selectNum: 1}] //控制子表按钮是否 可用
    },{
       btnId: 'btnFileAddSub', otherBtn:true, otherOption:[{id:'table1',selectNum: 1}] //控制子表按钮是否 可用
    },{
       btnId: 'btnFileEditSub', otherBtn:true,otherOption:[{id:'table1',selectNum: 1},{id:'table22',selectNum: 1}] //控制子表按钮是否 可用
    },{
       btnId: 'btnServiceAddSub', otherBtn:true, otherOption:[{id:'table1',selectNum: 1}] //控制子表按钮是否 可用
    },{
       btnId: 'btnServiceEditSub', otherBtn:true,otherOption:[{id:'table1',selectNum: 1},{id:'table23',selectNum: 1}] //控制子表按钮是否 可用
    },{
       btnId: 'btnAddQuality', otherBtn:true, otherOption:[{id:'table1',selectNum: 1}] //控制子表按钮是否 可用
    },{
       btnId: 'btnEditQuality', otherBtn:true,otherOption:[{id:'table1',selectNum: 1},{id:'tableQuality',selectNum: 1}] //控制子表按钮是否 可用
    },{
       btnId: 'btnAddScrap', otherBtn:true, otherOption:[{id:'table1',selectNum: 1}] //控制子表按钮是否 可用
    },{
       btnId: 'btnEditScrap', otherBtn:true,otherOption:[{id:'table1',selectNum: 1},{id:'tableScrap',selectNum: 1}] //控制子表按钮是否 可用
    }

		],
		tableId:'table1',
		tableValue:{
			searchParams:mainSearchData,
			queryParams:function(){
				return {  }
			},
			onClickRow:function(item,$element){
				$('#table21').bootstrapTable('refresh',{query:{tmBasRouteUlocId:item.tmBasRouteUlocId}});//或者{query:{}}直接设置查询条件
				$('#table22').bootstrapTable('refresh',{query:{tmBasRouteUlocId:item.tmBasRouteUlocId}});//或者{query:{}}直接设置查询条件
				$('#table23').bootstrapTable('refresh',{query:{tmBasRouteUlocId:item.tmBasRouteUlocId}});//或者{query:{}}直接设置查询条件
				$('#tableQuality').bootstrapTable('refresh',{query:{tmBasRouteUlocId:item.tmBasRouteUlocId}});//或者{query:{}}直接设置查询条件
				$('#tableScrap').bootstrapTable('refresh',{query:{tmBasRouteUlocId:item.tmBasRouteUlocId}});//或者{query:{}}直接设置查询条件
			},
			onLoadSuccess:function(){
		           $("#add").prop("disabled",true);
 							 $('.sw36').bootstrapSwitch({
								 onText:"是",
								 offText:"否",
								 onColor:"success",
								 offColor:"info",
								 onSwitchChange:function(event,state){
									 var d = {};
									 d.tmBasRouteUlocId = $(this).attr('fieldValue');
									 d.isKey = state?1:0;
									 datas = JSON.stringify(d);
									 var url = '/base/routeuloc/doEnabled';
									 $.when(Ew.ewAjax(url,datas)).done(function(results){
										 		  $('#table1').bootstrapTable('refresh');
												 });
										  $('#table1').bootstrapTable('refresh');

								 }
							 });
	        },
			url:'/base/routeuloc/querylistByPage',
			columns:[{
	             checkbox: true
	         },{
	             field: 'ulocSeq',
	             title: '站点顺序',
	             sortable:true,
	             width:'120px',
							 align:'center',
	         }, {
	             field: 'uloc',
	             title: '当前站点',
	             sortable:true,
							 align:'center',
	             width:'180px'
	        //  },{
	        //      field: 'type',
	        //      title: '类型',
	        //      sortable:true,
	        //      width:'120px',
          //      formatter: function (value, row, index) { //处理状态的显示
          //          if (value == '0') {
          //              value = '顺序';
          //          } else if(value == '1'){
          //              value = '条件';
          //          }else{
          //              value='';
          //          }
          //          return value;
          //      }
	        //  },{
	            //  field: 'routeCondition',
	            //  title: '条件',
	            //  sortable:true,
	            //  width:'120px',
 	         }, {
	             field: 'nextSeq',
	             title: '下一站点顺序号',
							 align:'center',
	             sortable:true,
	             width:'160px'
	         }, {
	             field: 'ulocnext',
	             title: '下一站点',
							 align:'center',
	             sortable:true,
	             width:'180px'
	         },{
	             field: 'standardHour',
	             title: '标准工时',
        			 align:'center',
	             sortable:true,
	             width:'120px'
	        //  },{
	        //      field: 'ulocrl',
	        //      title: '左右工位',
	        //      sortable:true,
	        //      width:'120px',
					// 		 hidden:false
	         },{
	             field: 'content',
	             title: '站点内容',
							 align:'center',
	             sortable:true,
	             width:'120px'
	         },{
	             field: 'attention',
	             title: '注意事项',
							 align:'center',
	             sortable:true,
	             width:'120px'
	         },{
	             field: 'remark',
	             title: '备注',
							 align:'center',
	             sortable:true,
	             width:'120px'
	         },{
						 field: 'isKey',
						 title: '关键工位',
					   align:'center',
						 width:'120px',
						formatter: function (value, row, index) {
										return Ew.switchHl(value,'sw36',row.tmBasRouteUlocId)
									}
					 }
				 ]
		}
	});


	//子表格1 home
	Ew.table('.home',{
		btnValues:[{
			btnId:'btnHomeAddSub',text:'新增',onClick:function(){
     $.when(Ew.ewAjax(urlRefresh,datasRefreshs,'','',true)).done(function(resultsRefresh){
       if (resultsRefresh == 'N'||resultsRefresh == 'M') {
									//	$("#add21").prop("disabled:true");
			    	daliogShow21('add')
				}else{
					layer.msg("只有工艺路径状态为新建和维护，才可以做新增、编辑、删除等操作");
				}

			 });

			}
		},{
			btnId:'btnHomeEditSub',text:'编辑',otherOption:[{id:'table21',selectNum: 1}],onClick:function(){

     $.when(Ew.ewAjax(urlRefresh,datasRefreshs,'','',true)).done(function(resultsRefresh){
       if (resultsRefresh == 'N'||resultsRefresh == 'M') {
				daliogShow21('change')
				}else{
					layer.msg("只有工艺路径状态为新建和维护，才可以做新增、编辑、删除等操作");
				}
   		});
			}
		},{
			btnId:'btnHomeDeleteSub',text:'删除',isTrue:true,otherOption:[{id:'table21',selMinNum: 1}],onClick:function(){
      $.when(Ew.ewAjax(urlRefresh,datasRefreshs,'','',true)).done(function(resultsRefresh){
       if (resultsRefresh == 'N'||resultsRefresh == 'M') {

									var rows = $('#table21').bootstrapTable('getSelections');
									var ids = [];
									$.each(rows,function(index,row){
										ids.push(row.tmBasUlocContentId);
									});
									datas = JSON.stringify(ids);
									var url = '/base/uloccontent/deleteMore';
									$.when(Ew.ewAjax(url,datas)).done(function(results){
										$('#table21').bootstrapTable('refresh');
						             });
				}else{
					layer.msg("只有工艺路径状态为新建和维护，才可以做新增、编辑、删除等操作");
				}
				});
			}
		}],
		tableId:'table21',
		tableValue:{
			queryParams:function(){
				return {}
			},
			onClickRow:function(item,$element){

			},
			url:'/base/uloccontent/querylistByPage',
			columns:[{
	             checkbox: true
	         },{
	             field: 'partgroup',
	             title: '产品组',
	             sortable:true,
	             width:'100px'
	         }, {
	             field: 'part',
	             title: '产品',
	             sortable:true,
	             width:'100px'
	         },{
	             field: 'step',
	             title: '序号',
	             sortable:true,
	             width:'100px'
	         },{
	             field: 'userInstrument',
	             title: '工具',
	             sortable:true,
	             width:'100px'
	         },{
	             field: 'stepContent',
	             title: '工序内容',
	             sortable:true,
	             width:'120px'
	         },{
	             field: 'stepRequirement',
	             title: '技术要求',
	             sortable:true,
	             width:'120px'
	         },{
	             field: 'times',
	             title: '次数',
	             sortable:true,
	             width:'100px'
	         },{
	             field: 'standardHour',
	             title: '标准工时(分钟)',
	             sortable:true,
	             width:'120px'
	         }]
		}
	});

	//子表格2 iosFile
	Ew.table('.iosFile',{
		btnValues:[{
			btnId:'btnFileAddSub',text:'新增',onClick:function(){
      $.when(Ew.ewAjax(urlRefresh,datasRefreshs,'','',true)).done(function(resultsRefresh){
       if (resultsRefresh == 'N'||resultsRefresh == 'M') {
						daliogShow22('add')
				}else{
					layer.msg("只有工艺路径状态为新建和维护，才可以做新增、编辑、删除等操作");
				}
				});
			}
		},{
			btnId:'btnFileEditSub',text:'编辑',otherOption:[{id:'table22',selectNum: 1}],onClick:function(){
    $.when(Ew.ewAjax(urlRefresh,datasRefreshs,'','',true)).done(function(resultsRefresh){
       if (resultsRefresh == 'N'||resultsRefresh == 'M') {
						daliogShow22('change')
				}else{
					layer.msg("只有工艺路径状态为新建和维护，才可以做新增、编辑、删除等操作");
				}
   		});
			}
		},{
			btnId:'btnFileDeleteSub',text:'删除',isTrue:true,otherOption:[{id:'table22',selMinNum: 1}],onClick:function(){

        $.when(Ew.ewAjax(urlRefresh,datasRefreshs,'','',true)).done(function(resultsRefresh){
       if (resultsRefresh == 'N'||resultsRefresh == 'M') {
					var rows = $('#table22').bootstrapTable('getSelections');
					var ids = [];
					$.each(rows,function(index,row){
						ids.push(row.tmBasUlocFileId);
					});
					datas = JSON.stringify(ids);
					var url = '/base/ulocfile/deleteMore';
					$.when(Ew.ewAjax(url,datas)).done(function(results){
						$('#table22').bootstrapTable('refresh');
								 });
				}else{
					layer.msg("只有工艺路径状态为新建和维护，才可以做新增、编辑、删除等操作");
				}
				});

			}
		}],
		tableId:'table22',
		tableValue:{
			queryParams:function(){
				return {tmBasRouteId:tmBasRouteId,
	                 tmBasRouteUlocId:'27180fdc8a8b4753a9814c80cea40e49'}
			},
			onClickRow:function(item,$element){

			},
			url:'/base/ulocfile/querylistByPage',
			columns:[{
	             checkbox: true
	         },{
	             field: 'partgroup',
	             title: '产品组',
	             sortable:true,
	             width:'100px'
	         }, {
	             field: 'part',
	             title: '产品',
	             sortable:true,
	             width:'100px'
	         },{
	             field: 'step',
	             title: '序号',
	             sortable:true,
	             width:'100px'
	         },{
	             field: 'fileType',
	             title: '文件类型',
	             sortable:true,
	             width:'100px'
	         },{
	             field: 'fileAddr',
	             title: '文件',
	             sortable:true,
	             width:'100px'
	         },{
	             field: 'displayTime',
	             title: '显示时间(S)',
	             sortable:true,
	             width:'100px'
	         }]
		}
	});


	//子表格3 iosFile
	Ew.table('.iosService',{
		btnValues:[{
			btnId:'btnServiceAddSub',text:'新增',onClick:function(){

$.when(Ew.ewAjax(urlRefresh,datasRefreshs,'','',true)).done(function(resultsRefresh){
       if (resultsRefresh == 'N'||resultsRefresh == 'M') {
				 daliogShow23('add')
				}else{
					$("#add23").prop("disabled:true");
					layer.msg("只有工艺路径状态为新建和维护，才可以做新增、编辑、删除等操作");
				}
								});
			}
		},{
			btnId:'btnServiceEditSub',text:'编辑',otherOption:[{id:'table23',selectNum: 1}],onClick:function(){
$.when(Ew.ewAjax(urlRefresh,datasRefreshs,'','',true)).done(function(resultsRefresh){
       if (resultsRefresh == 'N'||resultsRefresh == 'M') {
				 daliogShow23('change')
				}else{
					layer.msg("只有工艺路径状态为新建和维护，才可以做新增、编辑、删除等操作");
				}
								});
 			}
		},{
			btnId:'btnServiceDeleteSub',text:'删除',isTrue:true,otherOption:[{id:'table23',selMinNum: 1}],onClick:function(){
       $.when(Ew.ewAjax(urlRefresh,datasRefreshs,'','',true)).done(function(resultsRefresh){
       if (resultsRefresh == 'N'||resultsRefresh == 'M') {
					var rows = $('#table23').bootstrapTable('getSelections');
					var ids = [];
					$.each(rows,function(index,row){
						ids.push(row.tmBasUlocServiceId);
					});
					datas = JSON.stringify(ids);
					var url = '/base/ulocservice/deleteMore';
					$.when(Ew.ewAjax(url,datas)).done(function(results){
						$('#table23').bootstrapTable('refresh');
		             });
				}else{
					layer.msg("只有工艺路径状态为新建和维护，才可以做新增、编辑、删除等操作");
				}
				});

			}
		}],
		tableId:'table23',
		tableValue:{
			queryParams:function(){
				return {tmBasRouteId:tmBasRouteId,
	                 tmBasRouteUlocId:tmBasRouteUlocId}
			},
			onClickRow:function(item,$element){

			},
			url:'/base/ulocservice/querylistByPage',
			columns:[{
	             checkbox: true
	         },{
	             field: 'partgroup',
	             title: '产品组',
	             sortable:true,
	             width:'100px'
	         }, {
	             field: 'part',
	             title: '产品',
	             sortable:true,
	             width:'100px'
	         },{
	             field: 'type',
	             title: '类型',
	             sortable:true,
	             width:'100px',
							 formatter: function (value, row, index) {
									return re.SERVICE_TYPE[value]
								}

	         },{
	             field: 'service',
	             title: '服务名称',
	             sortable:true,
	             width:'100px'
	         }]
		}
	});

 })

});

//主表格
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

        var number11 = $('#number11').val();
				var combo301 = $('#combo301').val();
				var combo16 = $('#combo16').val();
				var combo17 = $('#combo17').val();
				var switch301 = $('#switch301').val();

				if(number11==1){
            if(switch301!=1){
							layer.msg("关键工位必须为选中状态")
								return;
						}
				}

				if(combo16==''){
						if(switch301!=1){
							layer.msg("关键工位必须为选中状态")
								return;
						}
				}

				if(combo301==combo16||combo301==combo17||combo16==combo17){
					if(combo16==''&&combo17==''){
					}else{
					layer.msg("当前站点、下一站点不能相等")
						return;
						}
				}
				data.tmBasRouteId = $('#text56').val();
				if(type=='change') data.tmBasRouteUlocId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tmBasRouteUlocId;
				datas = JSON.stringify(data);
				var url = (type=='add'?'/base/routeuloc/add':'/base/routeuloc/update');
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
				idName:'number11',
				text:'站点顺序',
				valid:['notEmpty'],
				field:'ulocSeq',
				disabled:type=='add'?false:true
			},{
				idName:'combo301',
				text:'当前站点',
				comboUrl:'/base/route/queryUlocSuggest',
				comboData:{
					id:['text56'],
					field:['tmBasRouteId'],
				},
				comboId:'tmBasUlocId',
				comboText:'uloc',
				field:'tmBasUlocId',
				valid:['notEmpty'],
 				disabled:type=='add'?false:true,
				isSearch:true
			},{
				idName:'combo13',
				text:'类型',
				field:'type',
				comboData:[
 					{id:0,text:'顺序'},
					{id:1,text:'条件'}
				],
				hidden:true,
			},{
				idName:'number14',
				text:'标准工时',
				field:'standardHour'
			},{
				idName:'text15',
				text:'条件',
				field:'routeCondition',
				hidden:true
			},{
				idName:'number318',
				text:'下一站点顺序号',
				field:'nextSeq'
			},{
   			idName:'combo16',
				text:'下一站点',
 				comboUrl:'/base/route/queryUlocSuggest',
				comboData:{
					id:['text56'],
					field:['tmBasRouteId'],
				},
				comboId:'tmBasUlocId',
				comboText:'uloc',
				field:'nextUlocId',
				searchText:'ulocnext',
 				isSearch:true
			},{
				idName:'combo17',
				text:'左右工位',
				comboUrl:'/base/route/queryUlocSuggest',
				comboData:{
					id:['text56'],
					field:['tmBasRouteId'],
				},
				comboId:'tmBasUlocId',
				comboText:'uloc',
				field:'rlUlocId',
				searchText:'ulocrl',
 				isSearch:true,
				hidden:true,
			},{
				idName:'text18',
				text:'站点内容',
				field:'content'
			},{
				idName:'text19',
				text:'注意事项',
				field:'attention'
			},{
				idName:'area111',
				text:'备注',
				field:'remark',
				n:2
			},{
				idName:'switch301',
				text:'关键工位',
				field:'isKey',
				offtext:'否',
				ontext:'是',
				defaultValue:type=='add'?1:$('#table1').bootstrapTable('getSelections')[0].isKey,
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

//子表格1 站点内容
function daliogShow21(type){
	var title=type=='add'?'新增':'编辑';
	var tmBasPlantIds = tmBasPlantId;
	var defaultTable=type=='add'?'':'table21';
	Ew.dialog('demoadd',{
		title:title,
		btnValues:[{
			btnId:'btnHomeSaveSub',
			text:'保存',
			formid:'demoform',
			onClick:function(data){
 				data.tmBasRouteId = $('#table1').bootstrapTable('getSelections')[0].tmBasRouteId;
				data.tmBasRouteUlocId = $('#table1').bootstrapTable('getSelections')[0].tmBasRouteUlocId;
        if(type=='change') data.tmBasUlocContentId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tmBasUlocContentId;
				datas = JSON.stringify(data);
				var url = (type=='add'?'/base/uloccontent/add':'/base/uloccontent/update');
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#demoadd').modal('hide');
					$('#table21').bootstrapTable('refresh');
	             });
			}
		},{
			btnId:'btnHomeCancelSub',
			text:'取消'
		}],
		form:{
			formId:'demoform',
			columnNum:2,
			listWidth:280,
			formList:[
				{
        idName:'combo18',
        text:'产品组',
        field:'tmBasPartgroupId',
        comboUrl:'/worktime/part/queryPartGroupSuggest',
        comboId:'tmBasPartgroupId',
        comboText:'partgroup',
        disabled:type=='add'?false:true,
        isSearch:type=='add'?true:false,
        comboData:{
					      other:{tmBasPlantId:tmBasPlantIds}
				},
        isSearch:true,
        onClick:function(data){
           $('#combo19').select2('val',['']);
					 $('#combo214').select2('val',['']);
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
					id:['combo18'],
					field:['tmBasPartgroupId'],
					other:{tmBasPlantId:tmBasPlantIds}
				},
				isSearch:true
			},{
				idName:'number213',
				text:'序号',
				field:'step',
				valid:['notEmpty'],
				disabled:type=='add'?false:true,
			},{
				idName:'text215',
				text:'工序内容',
				field:'stepContent',
				valid:['notEmpty'],
			},{
				idName:'combo214',
				text:'工具',
				field:'pauTmBasPartId',
				comboUrl:'/worktime/part/queryPartPartGroupuserInstrumentSuggest',
				comboId:'pauTmBasPartId',
				comboText:'userInstrument',
				comboData:{
					other:{tmBasPlantId:tmBasPlantIds}
				},
				isSearch:true

			},{
				idName:'text216',
				text:'技术要求',
				field:'stepRequirement',
			},{
				idName:'number217',
				text:'次数',
				field:'times',
			},{
				idName:'number218',
				text:'标准工时(秒)',
				field:'standardHour',
			},{
					idName:'text21311',
					text:'版本号',
					field:'version',
					hidden:true
				}],
			defaultTable:defaultTable
		}
	});
}



//子表格2 工艺文件
function daliogShow22(type){
	var title=type=='add'?'新增':'编辑';
	var tmBasPlantIds = tmBasPlantId;
	var defaultTable=type=='add'?'':'table22';
	Ew.dialog('demoadd',{
		title:title,
		btnValues:[{
			btnId:'btnFileSaveSub',
			text:'保存',
			formid:'demoformFile',
			onClick:function(data){
				var url = (type=='add'?'/base/ulocfile/add':'/base/ulocfile/update');
				var formData = new FormData($( "#demoformFile" )[0]);
				formData.append('tmBasRouteId', $('#table1').bootstrapTable('getSelections')[0].tmBasRouteId);
			  formData.append('tmBasRouteUlocId', $('#table1').bootstrapTable('getSelections')[0].tmBasRouteUlocId);
				if(type=='change'){formData.append('tmBasUlocFileId',$('#'+defaultTable).bootstrapTable('getSelections')[0].tmBasUlocFileId);}
				$.ajax({
			         url: apiUrl+url,
							 type: 'POST',
		           data: formData,
		           async: false,
		           cache: false,
		           contentType: false,
		           processData: false,
			         success:function (data) {
								 var errcode = data.code;
								   layer.msg(data.message);
	          	    if(errcode != 10000){
	          	        return;
	          	    }
                 tmBasRouteUlocId = $('#table1').bootstrapTable('getSelections')[0].tmBasRouteUlocId;
								 console.log(tmBasRouteUlocId);
								 $('#demoadd').modal('hide');
								 $('#table22').bootstrapTable('refresh');

			         },

			       })
						 .done(function(data) {    //上传成功
 									if(data.status == true){
											console.log("success");
									}else{
											console.log(data.errMsg);
									}
							})
							.fail(function() {
 									console.log("GG,failed");
							})
							.always(function() {
 									console.log("complete");
							});
			 }

		},{
			btnId:'btnFileCancelSub',
			text:'取消'
		}],
		form:{
			formId:'demoformFile',
			columnNum:2,
			listWidth:280,
			formList:[
				{
				idName:'combo220',
				text:'产品组',
				field:'tmBasPartgroupId',
				comboUrl:'/worktime/part/queryPartGroupSuggest',
				comboId:'tmBasPartgroupId',
				comboText:'partgroup',
				disabled:type=='add'?false:true,
				isSearch:type=='add'?true:false,
				comboData:{
								other:{tmBasPlantId:tmBasPlantIds}
				},
				isSearch:true,
				onClick:function(data){
					 $('#combo222').select2('val',['']);
				}
			},{
				idName:'combo222',
				text:'产品',
				field:'tmBasPartId',
				comboUrl:'/worktime/part/queryPartPartGroupSuggest',
				comboId:'tmBasPartId',
				comboText:'part',
				disabled:type=='add'?false:true,
				isSearch:type=='add'?true:false,
				comboData:{
					id:['combo220'],
					field:['tmBasPartgroupId'],
					other:{tmBasPlantId:tmBasPlantIds}
				},
				isSearch:true
			},{
				idName:'number223',
				text:'序号',
				field:'step',
			  valid:['notEmpty',{type:'number',min:0,max:999}]
			},{
				idName:'number224',
				text:'显示时间',
				field:'displayTime',
		 		valid:['',{type:'number',min:0,max:999}]
			},
			{
				idName:'file',
				text:'文件',
				field:'fileAddr',
				valid:['notEmpty']
			},{
					idName:'text22311',
					text:'版本号',
					field:'version',
					hidden:true
				}],
			defaultTable:defaultTable
		}
	});
}



//子表格3 后台服务
function daliogShow23(type){
	var title=type=='add'?'新增':'编辑';
		var tmBasPlantIds = tmBasPlantId;
	var defaultTable=type=='add'?'':'table23';
	Ew.dialog('demoadd',{
		title:title,
		btnValues:[{
			btnId:'btnServiceSaveSub',
			text:'保存',
			formid:'demoform',
			onClick:function(data){
				data.tmBasRouteId = $('#table1').bootstrapTable('getSelections')[0].tmBasRouteId;
				data.tmBasRouteUlocId = $('#table1').bootstrapTable('getSelections')[0].tmBasRouteUlocId;
				if(type=='change') data.tmBasUlocServiceId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tmBasUlocServiceId;
				datas = JSON.stringify(data);
				var url = (type=='add'?'/base/ulocservice/add':'/base/ulocservice/update');
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#demoadd').modal('hide');
					$('#table23').bootstrapTable('refresh');
	             });
			}
		},{
			btnId:'btnServiceCancelSub',
			text:'取消'
		}],
		form:{
			formId:'demoform',
			columnNum:2,
			listWidth:280,
			formList:[{

        idName:'combo231',
        text:'产品组',
        field:'tmBasPartgroupId',
        comboUrl:'/worktime/part/queryPartGroupSuggest',
        comboId:'tmBasPartgroupId',
        comboText:'partgroup',
        disabled:type=='add'?false:true,
        isSearch:type=='add'?true:false,
         comboData:{
					other:{tmBasPlantId:tmBasPlantIds}
        },
        isSearch:true,
        onClick:function(data){
           $('#combo232').select2('val',['']);
        }
			},{
        idName:'combo232',
				text:'产品',
				field:'tmBasPartId',
				comboUrl:'/worktime/part/queryPartPartGroupSuggest',
				comboId:'tmBasPartId',
				comboText:'part',
				disabled:type=='add'?false:true,
				isSearch:type=='add'?true:false,
 				comboData:{
					id:['combo231'],
					field:['tmBasPartgroupId'],
					other:{tmBasPlantId:tmBasPlantIds}
				},
				isSearch:true

			},{
				idName:'combo305',
				text:'类型',
				valid:['notEmpty'],
				field:'type',
				comboUrl:'/system/codeList/getSelect',
				comboData:'SERVICE_TYPE',
				comboId:'no',
				comboText:'name',
			},{
				idName:'text234',
				text:'服务',
				valid:['notEmpty'],
				field:'service'
			},{
					idName:'text23311',
					text:'版本号',
					field:'version',
					hidden:true
				}],
			defaultTable:defaultTable
		}
	});
}



//--------------------------------------URL传值方法------------------------------------------------------
UrlParm = function() { // url参数
	var data, index;
	(function init() {
		data = [];
		index = {};
		var u = window.location.search.substr(1);
		if (u != '') {
			var parms = decodeURIComponent(u).split('&');
			for (var i = 0, len = parms.length; i < len; i++) {
				if (parms[i] != '') {
					var p = parms[i].split("=");
					if (p.length == 1 || (p.length == 2 && p[1] == '')) {// p |
																			// p=
						data.push([ '' ]);
						index[p[0]] = data.length - 1;
					} else if (typeof (p[0]) == 'undefined' || p[0] == '') { // =c |
																				// =
						data[0] = [ p[1] ];
					} else if (typeof (index[p[0]]) == 'undefined') { // c=aaa
						data.push([ p[1] ]);
						index[p[0]] = data.length - 1;
					} else {// c=aaa
						data[index[p[0]]].push(p[1]);
					}
				}
			}
		}
})();
return {
		// 获得参数,类似request.getParameter()
		parm : function(o) { // o: 参数名或者参数次序
			try {
				return (typeof (o) == 'number' ? data[o][0] : data[index[o]][0]);
			} catch (e) {
			}
		},
		// 获得参数组, 类似request.getParameterValues()
		parmValues : function(o) { // o: 参数名或者参数次序
			try {
				return (typeof (o) == 'number' ? data[o] : data[index[o]]);
			} catch (e) {
			}
		},
		// 是否含有parmName参数
		hasParm : function(parmName) {
			return typeof (parmName) == 'string' ? typeof (index[parmName]) != 'undefined'
					: false;
		},
		// 获得参数Map ,类似request.getParameterMap()
		parmMap : function() {
			var map = {};
			try {
				for ( var p in index) {
					map[p] = data[index[p]];
				}
			} catch (e) {
			}
			return map;
		}
	}
}();
