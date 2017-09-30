layui.use('layer',function(){
	layer=layui.layer;
});

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
		onSuccess:function(data){
			console.log(data)
		}


	},{
		idName:'combo4',
		field:'enabled',
		text:'启用',
		comboUrl:'/system/codeList/getSelect',
		comboId:'no',
		comboText:'name',
		comboData:'ENABLE'
	},{
		idName:'text5',
		field:'scrapNo',
		text:'编号'
	},{
		idName:'text6',
		field:'scrapName',
		text:'名称'
	}]

	Ew.search('.searchForm',{
		title:'查询',
		textValues:mainSearchData,
		btnValues:[{
			btnId:'btnSearch',
			text:'搜索',
			onClick:function(data){
				$('#tableQsScrap').bootstrapTable('refresh');
				$('#tableQsScrap').bootstrapTable('refreshOptions',{pageNumber:1});
			}
		},{
			btnId:'btnClear',
			text:'重置',
			tableid:['tableQsScrap']
		}]
	});

	//主表格
	Ew.table('.mainTable',{
		btnValues:[{
			btnId:'btnAdd',text:'新增',onClick:function(){
				daliogShow('add');
			}
		},{
			btnId:'btnEdit',text:'编辑',otherOption:[{id:'tableQsScrap',selectNum: 1}],onClick:function(){
				daliogShow('change');
			}
		},{
			btnId:'btnDelete',text:'删除',isTrue:true,otherOption:[{id:'tableQsScrap',selMinNum: 1}],onClick:function(){
				var rows = $('#tableQsScrap').bootstrapTable('getSelections');
				ids = [];
				var flag = true;
				$.each(rows,function(index,row){
					ids.push(row.tmQsScrapId);
				});
				datas = JSON.stringify({tmQsScrapId : ids});
				var url = '/system/qsScrap/delete'
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#tableQsScrap').bootstrapTable('refresh');
					$('#tableQsScrap').bootstrapTable('refreshOptions',{pageNumber:1});

				});
			}
		},{
			btnId:'btnInput',text:'导入',onClick:function(){
			}
		},{
			btnId:'btnExport',text:'导出',onClick:function(){
				var Scrap_no = $('#textSearchScrap_no').val();
				var Scrap_name = $('#textSearchScrap_name').val();
				window.top.location.href= apiUrl +'/system/qsScrap/export'
			}
		}],
		tableId:'tableQsScrap',
		tableValue:{
			searchParams:mainSearchData,
			queryParams:function(){
				return{}
			},
			onClickRow:function(item,$element){

			},
			onLoadSuccess:function(){
				$('.sw').bootstrapSwitch({
					onText:"启用",
					offText:"禁用",
					onColor:"success",
					offColor:"info",
					onSwitchChange:function(event,state){
						var d = {};
						d.tmQsScrapId = $(this).attr('fieldValue');
						d.enabled = state?1:0;
						datas = JSON.stringify(d);
						var url = '/system/qsScrap/doEnabled';
						$.when(Ew.ewAjax(url,datas)).done(function(results){
							$('#tableQsScrap').bootstrapTable('refresh');
			            });
					}
				});
	        },
			url:'/system/qsScrap/querylistByPage',
			columns:[{
				checkbox: true
			},{
				field: 'plant',
				title: '工厂',
				align: 'center',
				sortable:true,
			    width:'150px'
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
				field: 'type',
				title: '报废类型',
				align: 'center',
				formatter: function (value, row, index) {
                  if (value == 'IS'){
                  	return '工废';
                  } else if (value == 'MS'){
                  	return '料废';	
                  }else {
                	  
                  }
              },
              width:'120px',
				sortable:true
			},{
				field: 'scrapNo',
				title: '编号',
				align: 'center',
				sortable:true
			},{
				field: 'scrapName',
				title: '名称',
				align: 'center',
				sortable:true
			},{
				field: 'scrapComments',
				title: '备注',
				align: 'center',
				sortable:true
			},{
				field:'enabled',
				title:'启用',
				align:'center',
        width:'120px',
				formatter: function (value, row, index) {
	              return Ew.switchHl(value,'sw',row.tmQsScrapId)
	            }
			}]
		}
	});
})

function daliogShow(type){
	var title=type=='add'?'新增':'编辑';
	var defaultTable=type=='add'?'':'tableQsScrap';
	Ew.dialog('mainFromEdit',{
		title:title,
		btnValues:[{
			btnId:'btnSave',
			text:'保存',
			formid:'form',
			onClick:function(data){
				var gValue = $("#combo11").val();
				var pValue = $("#combo12").val();
				if ((gValue == null || gValue == '') && (pValue == null ||pValue == '') ){
					layer.msg ("产品组和产品至少选择一个");
					return;
				}
				if(type=='change'){
					data.tmQsScrapId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tmQsScrapId;
				}
				datas = JSON.stringify(data);
				var url = (type=='add'?'/system/qsScrap/add':'/system/qsScrap/update');
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#mainFromEdit').modal('hide');
					$('#tableQsScrap').bootstrapTable('refresh');
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
				idName:'combo10',
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

			    $('#combo11').select2('val',['']);
	            $('#combo12').select2('val',['']);
				}
			},{
				idName:'combo11',
				text:'产品组',
				field:'tmBasPartgroupId',
				comboUrl:'/worktime/part/queryPartGroupSuggest',
				comboId:'tmBasPartgroupId',
				comboText:'partgroup',
				disabled:type=='add'?false:true,
				isSearch:type=='add'?true:false,
				comboData:{
					id:['combo10'],
					field:['tmBasPlantId']
				},
				isSearch:true,
				onClick:function(data){
           $('#combo12').select2('val',['']);
 				}
			},{
				idName:'combo12',
				text:'产品',
				field:'tmBasPartId',
				comboUrl:'/worktime/part/queryPartPartGroupSuggest',
				comboId:'tmBasPartId',
				comboText:'part',
				disabled:type=='add'?false:true,
				isSearch:type=='add'?true:false,
				comboData:{
					id:['combo10','combo11'],
					field:['tmBasPlantId','tmBasPartgroupId']
				},
				isSearch:true
			},{
				idName:'text13',
				text:'编号',
				field:'scrapNo',
				valid:['notEmpty',{type:"string",min:0,max:20}],
				disabled:type=='add'?false:true
			},{
				idName:'combo14',
				text:'报废类型',
				field:'type',
				comboUrl:'/system/codeList/getSelect',
				comboId:'no',
				comboText:'name',
				comboData:'SCRAP_TYPE',
				valid:[{type:"string",min:0,max:32}],
				disabled:type=='add'?false:true
			},{
				idName:'text15',
				text:'名称',
				field:'scrapName',
				valid:['notEmpty',{type:"string",min:0,max:300}],
			},{
				idName:'area16',
				text:'备注',
				field:'scrapComments',
				valid:[{type:"string",min:0,max:300}],
			},
			{idName:'text311',text:'版本号',field:'version',hidden:true
			},{
				idName:'switch17',
				text:'启用',
				field:'enabled',
				ontext:'启用',
				offtext:'禁用'
			}],
			defaultTable:defaultTable
		}
	})
}
