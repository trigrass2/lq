var tmQsQualityId;


//子表格5 质检内容
Ew.table('.quality',{
	btnValues:[{
		btnId:'btnAddQualitySub',text:'新增',onClick:function(){
			daliogShowQuality('add')
		}
	},{
		btnId:'btnEditQualitySub',text:'编辑',otherOption:[{id:'tableQuality',selectNum: 1}],onClick:function(){
			daliogShowQuality('change')
		}
	},{
		btnId:'btnDeleteQualitySub',text:'删除',isTrue:true,otherOption:[{id:'tableQuality',selMinNum: 1}],onClick:function(){
			var rows = $('#tableQuality').bootstrapTable('getSelections');
			var ids = [];
			$.each(rows,function(index,row){
				ids.push(row.tmBasUlocQualityId);
			});
			datas = JSON.stringify({tmBasUlocQualityId:ids});
			var url = '/bas/basUlocQuality/delete';


			$.when(Ew.ewAjax(url,datas)).done(function(results){
				tmBasRouteUlocId =  $('#table1').bootstrapTable('getSelections')[0].tmBasRouteUlocId ;
				$('#tableQuality').bootstrapTable('refresh');
             });
		}
	}],
	tableId:'tableQuality',
	tableValue:{
		queryParams:function(){
			return {tmBasRouteId:tmBasRouteId==null?-1:tmBasRouteId,
                 tmBasRouteUlocId:tmBasRouteUlocId}
		},
		onClickRow:function(item,$element){

		},
		url:'/bas/basUlocQuality/querylistByPage',
		columns:[{
             checkbox: true
         },{
             field: 'partGroupName',
             title: '产品组',
             sortable:true,
             width:'120px'
         }, {
             field: 'part',
             title: '产品',
             sortable:true,
             width:'150px'
         },{
             field: 'step',
             title: '序号',
             sortable:true,
             width:'100px'
         },{
             field: 'qualityNo',
             title: '质检编号',
             sortable:true,
             width:'100px'
         },{
             field: 'qualityName',
             title: '质检内容',
             sortable:true,
             width:'100px'
         },{
             field: 'qualityComments',
             title: '备注',
             sortable:true,
             width:'100px'
         },{
             field: 'part',
             title: '工具',
             sortable:true,
             width:'100px'
         },{
             field: 'testTimes',
             title: '次数',
             sortable:true,
             width:'100px'
         },{
             field: 'standardHour',
             title: '标准工时',
             sortable:true,
             width:'100px'
         }]
	}
});

//子表格6 报废
Ew.table('.scrap',{
	btnValues:[{
		btnId:'btnAddScrapSub',text:'新增',onClick:function(){
			daliogShowScrap('add')
		}
	},{
		btnId:'btnEditScrapSub',text:'编辑',otherOption:[{id:'tableScrap',selectNum: 1}],onClick:function(){
			daliogShowScrap('change')
		}
	},{
		btnId:'btnDeleteScrapSub',text:'删除',isTrue:true,otherOption:[{id:'tableScrap',selMinNum: 1}],onClick:function(){
			var rows = $('#tableScrap').bootstrapTable('getSelections');
			var ids = [];
			$.each(rows,function(index,row){
				ids.push(row.tmBasUlocScrapId);
			});
			datas = JSON.stringify({tmBasUlocScrapId:ids});
			var url = '/bas/basUlocScrap/delete';
			$.when(Ew.ewAjax(url,datas)).done(function(results){
				tmBasRouteUlocId =  $('#table1').bootstrapTable('getSelections')[0].tmBasRouteUlocId ;
				$('#tableScrap').bootstrapTable('refresh');
             });
		}
	}],
	tableId:'tableScrap',
	tableValue:{
		queryParams:function(){
			return {tmBasRouteId:tmBasRouteId==null?-1:tmBasRouteId,
                 tmBasRouteUlocId:tmBasRouteUlocId}
		},
		onClickRow:function(item,$element){

		},
		url:'/bas/basUlocScrap/querylistByPage',
		columns:[{
             checkbox: true
         },{
             field: 'partGroupName',
             title: '产品组',
             sortable:true,
             width:'120px'
         }, {
             field: 'part',
             title: '产品',
             sortable:true,
             width:'150px'
         },{
             field: 'step',
             title: '序号',
             sortable:true,
             width:'100px'
         },{
             field: 'scrapNo',
             title: '报废编号',
             sortable:true,
             width:'100px'
         },{
             field: 'scrapName',
             title: '报废标准',
             sortable:true,
             width:'100px'
         },{
             field: 'scrapComments',
             title: '备注',
             sortable:true,
             width:'100px'
         }]
	}
});

//子表格增加 质检
function daliogShowQuality(type){
	var title=type=='add'?'新增':'编辑';
	var defaultTable=type=='add'?'':'tableQuality';

	var qUrl = "/bas/basUlocQuality/queryPartByRoute";
	var qData = JSON.stringify({tmBasRouteId:tmBasRouteId});
	$.when(Ew.ewAjax(qUrl,qData)).done(function(results){
		var pId = results.tmBasPartId;

			  Ew.dialog('demoadd',{
					title:title,
					btnValues:[{
						btnId:'btnSaveQualitySub',
						text:'保存',
						formid:'demoform',
						onClick:function(data){
							var group =  $("#combo251").val();
							var part =  $("#combo252").val();
							if (group == null || group =='' || group == undefined){
								if (part == null || part =='' || part == undefined){
								layer.msg("产品组和产品至少选择一项");
								return;
								}
							}
							data.tmBasRouteUlocId = $('#table1').bootstrapTable('getSelections')[0].tmBasRouteUlocId ;
							data.tmBasRouteId = $('#table1').bootstrapTable('getSelections')[0].tmBasRouteId ;
							data.tmQsQualityId = tmQsQualityId;
							if(type=='change') data.tmBasUlocQualityId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tmBasUlocQualityId;
							datas = JSON.stringify(data);
							var url = (type=='add'?'/bas/basUlocQuality/add':'/bas/basUlocQuality/update');
							$.when(Ew.ewAjax(url,datas)).done(function(results){
								tmBasRouteUlocId =  $('#table1').bootstrapTable('getSelections')[0].tmBasRouteUlocId ;
								tmBasRouteId = data.tmBasRouteId;
								$('#demoadd').modal('hide');
								$('#tableQuality').bootstrapTable('refresh');
				             });
						}
					},{
						btnId:'btnSaveCancelSub',
						text:'取消'
					}],
					form:{
						formId:'demoform',
						columnNum:2,
						listWidth:280,
						formList:[{
							idName:'combo251',
							text:'产品组',
							comboUrl:'/plantlayout/basPartgroup/queryPartgroupList',
							comboId:'tmBasPartgroupId',
							comboText:'name',
							field:'tmBasPartgroupId',
							valid:[{type:"string",min:0,max:32}],
							defaultValue:results.tmBasPartgroupId,
							disabled:pId == undefined?false:true,
									disabled:type=='add'?false:true,

									onClick:function(data){
										$("#combo252").html("");
									}
						}
						,
						{
							idName:'combo252',
							text:'产品',
							defaultValue:pId,
							comboUrl:'/bas/basUlocQuality/queryPart',
							comboData:type=='add'?{
								id:['combo251'],
								field:['tmBasPartgroupId'],
								other:{enabled:1}
							}:{},
							comboId:'tmBasPartId',
							comboText:'part',
							field:'tmBasPartId',

							isSearch:pId == undefined?true:false,
							disabled:pId == undefined?false:true,
							disabled:type=='add'?false:true
						},{
							idName:'text253',
							text:'序号',
							field:'step',
							valid:['notEmpty','number'],
							disabled:type=='add'?false:true,
						},{
							idName:'combo254',
							text:'工具',
							field:'qualityUserinstrument',
							comboUrl:'/worktime/part/publicProduct',
							comboData:{},
							comboId:'tmBasPartId',
							comboText:'part',

						},{
							idName:'combo255',
							text:'质检编号',
							comboUrl:'/quality/qmQuality/getQualityNo',
							comboId:'qualityNo',
							comboText:'qualityNo',
							field:'qualityNo',
								comboData:{},
								disabled:type=='add'?false:true,
							valid:['notEmpty'],
							onClick:function(data){
							  $.when(Ew.ewAjax('/quality/qmQuality/getQualityInfo',JSON.stringify({qualityNo:data.id}))).done(function(results){
								  tmQsQualityId = results[0].tmQmQualityId;
								$("#area256").val(results[0].qualityName);
								$("#area257").val(results[0].qualityComments);

				             });
							}
						},{
							idName:'area256',
							text:'质检内容',
							valid:['notEmpty'],
							field:'qualityName',
							disabled:true

						},
						{
							idName:'area257',
							text:'备注',

							field:'qualityComments',
							disabled:true

						},{
							idName:'text258',
							text:'次数',
							field:'testTimes',
							valid:['number']
						},{
							idName:'text253',
							text:'标准工时',
							field:'standardHour',
							valid:['number']
						}],
						defaultTable:defaultTable
					}
				});

	});






}

//子表格增加 报废
function daliogShowScrap(type){
	var title=type=='add'?'新增':'编辑';
	var defaultTable=type=='add'?'':'tableScrap';
	var qUrl = "/bas/basUlocQuality/queryPartByRoute";
	var qData = JSON.stringify({tmBasRouteId:tmBasRouteId});
	$.when(Ew.ewAjax(qUrl,qData)).done(function(results){
		var pId = results.tmBasPartId;
	Ew.dialog('demoadd',{
		title:title,
		btnValues:[{
			btnId:'btnSaveScrapSub',
			text:'保存',
			formid:'demoform',
			onClick:function(data){
				var group =  $("#combo261").val();
				var part =  $("#combo262").val();
				if (group == null || group =='' || group == undefined){
					if (part == null || part =='' || part == undefined){
					layer.msg("产品组和产品至少选择一项");
					return;
					}
				}
				data.tmBasRouteUlocId = $('#table1').bootstrapTable('getSelections')[0].tmBasRouteUlocId ;
				data.tmBasRouteId = $('#table1').bootstrapTable('getSelections')[0].tmBasRouteId ;
				data.scrapId = scrapId;
				if(type=='change') data.tmBasUlocScrapId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tmBasUlocScrapId;
				datas = JSON.stringify(data);
				var url = (type=='add'?'/bas/basUlocScrap/add':'/bas/basUlocScrap/update');
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					tmBasRouteUlocId =  $('#table1').bootstrapTable('getSelections')[0].tmBasRouteUlocId ;
					$('#demoadd').modal('hide');
					$('#tableScrap').bootstrapTable('refresh');
	             });
			}
		},{
			btnId:'btnCancelScrapSub',
			text:'取消'
		}],
		form:{
			formId:'demoform',
			columnNum:2,
			listWidth:280,
			formList:[{
				idName:'combo261',
				text:'产品组',
				comboUrl:'/plantlayout/basPartgroup/queryPartgroupList',
				comboId:'tmBasPartgroupId',
				comboText:'name',
				field:'tmBasPartgroupId',
				valid:[{type:"string",min:0,max:32}],
				defaultValue:results.tmBasPartgroupId,
				disabled:pId == undefined?false:true,
						onClick:function(data){
							$("#combo262").html("");
						}
			},
			{
				idName:'combo262',
				defaultValue:pId,
				text:'产品',
				comboUrl:'/bas/basUlocQuality/queryPart',
				comboData:type=='add'?{
					id:['combo261'],
					field:['tmBasPartgroupId'],
					other:{enabled:1}
				}:{},
				comboId:'tmBasPartId',
				comboText:'part',
				field:'tmBasPartId',
				isSearch:pId == undefined?true:false,
				disabled:pId == undefined?false:true,

			},{
				idName:'text263',
				text:'序号',
				field:'step',
				valid:['notEmpty','number'],
				disabled:type=='add'?false:true,
			},{
				idName:'combo265',
				text:'报废编号',
				comboUrl:'/system/qsScrap/getScrapNo',
				comboId:'scrapNo',
				comboText:'scrapNo',
				field:'scrapNo',
				valid:['notEmpty'],
					comboData:{},
//					disabled:type=='add'?false:true,
				onClick:function(data){

				  $.when(Ew.ewAjax('/system/qsScrap/getScrapInfo',JSON.stringify({scrapNo:data.id}))).done(function(results){
					  scrapId = results[0].tmQmScrapId;
					$("#area266").val(results[0].scrapName);
					$("#area267").val(results[0].scrapComments);

	             });
				}
			},{
				idName:'area266',
				text:'报废标准',
				field:'scrapName',
				valid:['notEmpty'],

				disabled:true

			},
			{
				idName:'area267',
				text:'备注',

				field:'scrapComments',
				disabled:true

			}],
			defaultTable:defaultTable
		}
	});
	});
}
