

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
		field:'partGroupName',
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
		field:'qualityNo',
		text:'质检编号'
	},{
		idName:'text6',
		field:'qualityName',
		text:'质检内容'
	},
	{
		idName:'combo7',
		field:'type',
		text:'质检类型',
		comboUrl:'/system/codeList/getSelect',
		comboId:'no',
		comboText:'name',
		comboData:'QUALITY_TYPE'
	}];
	//搜索11

	/*
	*搜索框函数
	*
	*el：为html标签
	*
	*option（参数设置）：
	*@title搜索框标题名称
	*@listWidth搜索条件的宽度默认250px
	*@textValues为弹出框中搜索条件设置为数组[]
	*text：为页面显示的条件名称，
	*field：为当前条件的字段名称，取决后台需求，
	*idName：为input的id，input的类型取决于id名包含字段，
	*包含text，为输入文本框，
	*包含combo，为下拉框，
	*下拉数据调用后台方法
	*comboUrl为接口地址，comboData为接口条件，comboId接口id字段，comboText接口text字段
	*下拉数据调用本地方法，
	*comboData：[{id:1,text:'2222'}],内容为写死的json
	*
	*包含day为时间控件年月日
	*
	*
	*@btnValues为按钮设置为数组[]
	*btnId:为按钮id
	*text：为按钮名称
	*onClick：为点击事件默认有个data为搜索条件[{他的field：他的值},......]
	*如果text为清空自动生成点击事件把搜索条件全部清空
	*
	*
	*
	*
	*
	*/

	Ew.search('.demoSearch',{
		title:'查询',
		textValues:mainSearchData,
		btnValues:[{
			btnId:'btnSearch',
			text:'搜索',
			onClick:function(data){
				console.log(data)
				$('#tableQuality').bootstrapTable('refresh');
				$('#tableQuality').bootstrapTable('refreshOptions',{pageNumber:1});
				$('#tableQualitySub').bootstrapTable('removeAll');
			}
		},{
			btnId:'btnClear',
			text:'重置',
      tableid:['tableQuality','tableQualitySub']
		}]
	});

	/*
	*表格
	*
	*el：为html标签
	*option(参数设置)：
	*@btnValues为控制表格的按钮
	*selectNum为只能选取的条数
	*selMinNum为最少选择的条数
	*@tableId为table的id
	*@tableValue为table参数值
	*searchParams：搜索的条件为搜索里的textValues值格式[{idName:'text1',field:'wain'},{......},......]
	*queryParams:为默认想要添加的条件为函数function(){return{key：value}}return一个对象用keyvalue值传入
	*onClickRow为点击事件为函数function(item,$element){},item为点击那行的参数$element为选择器
	*url：为获取表格的后台接口
	*columns：为表格的参数值
	*
	*
	**/

	//主表格
	Ew.table('.demoTable',{
		btnValues:[{
			btnId:'btnAdd',text:'新增',onClick:function(){
				daliogShow('add')
			}
		},{
			btnId:'btnEdit',text:'编辑',otherOption:[{id:'tableQuality',selectNum: 1}],onClick:function(){
				daliogShow('change')
			}
		},{
			btnId:'btnDelete',text:'删除',isTrue:true,otherOption:[{id:'tableQuality',selMinNum: 1}],onClick:function(){
				var rows = $('#tableQuality').bootstrapTable('getSelections');
				var ids = [];
				$.each(rows,function(index,row){
					ids.push(row.tmQmQualityId);
				});
				datas = JSON.stringify({tmQmQualityId:ids});
				var url = '/quality/qmQuality/delete';
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#tableQuality').bootstrapTable('refresh');
					$('#tableQuality').bootstrapTable('refreshOptions',{pageNumber:1});
	             });
			}
		},{
			btnId:'btnImport',text:'导入',isTrue:true,url:'/qualityStation/qmSnQuality/mobileDefectSave',tableId:'tableQuality'
		},{
			btnId:'btnExport',text:'导出',isTrue:true,selMinNum:1,onClick:function(){

			}
		},{
          btnId: 'btnAddSub', otherBtn:true, otherOption:[{id:'tableQuality',selectNum: 1}] //控制子表按钮是否 可用
        },{
          btnId: 'btnEditSub', otherBtn:true,otherOption:[{id:'tableQuality',selectNum: 1},{id:'tableQualitySub',selectNum: 1}] //控制子表按钮是否 可用
        }],
		tableId:'tableQuality',
		tableValue:{
			searchParams:mainSearchData,
			queryParams:function(){
				return{}
			},
			onClickRow:function(item,$element){
				$('#tableQualitySub').bootstrapTable('refresh',{query:{tmQmQualityId:item.tmQmQualityId}});//或者{query:{}}直接设置查询条件
//				$('#tableQualitySub').bootstrapTable('refreshOptions',{pageNumber:1});//或者{query:{}}直接设置查询条件
			},
			onLoadSuccess:function(){
				$('.sw').bootstrapSwitch({
					onText:"启用",
					offText:"禁用",
					onColor:"success",
					offColor:"info",
					onSwitchChange:function(event,state){
						var d = {};
						d.tmQmQualityId = $(this).attr('fieldValue');
						d.enabled = state?1:0;
						datas = JSON.stringify(d);
						var url = '/quality/qmQuality/doEnabled';
						$.when(Ew.ewAjax(url,datas)).done(function(results){
							$('#tableQuality').bootstrapTable('refresh');
			            });
					}
				});
	        },
			url:'/quality/qmQuality/querylistByPage',
			columns:[{
				checkbox:true
			},{
				field: 'plant',
				title: '工厂',
				align: 'center',
				sortable:true,
			    width:'180px'
			},{
				field: 'qualityNo',
				title: '质检编号',
				align: 'center',
				width:'150px',
				sortable:true
			},{
				field: 'qualityName',
				title: '质检内容',
				align: 'center',
				width:'180px',
				sortable:true
			},{
				field: 'type',
				title: '质检类型',
				align: 'center',
				formatter: function (value, row, index) {
                  if (value == 'M'){
                  	return '原材料';
                  } else if (value == 'S'){
                  	return '半成品';	
                  } else if (value == 'P'){
                	  return '成品';	
                  }else {
                	  
                  }
              },
              width:'120px',
				sortable:true
			},{
				field: 'partGroupName',
				title: '产品组',
				align: 'center',
				sortable:true,
				width:'150px'
			},{
				field: 'part',
				title: '产品',
				align: 'center',
				sortable:true,
				  width:'180px',
			},{
				field: 'qualityComments',
				title: '备注',
				align: 'center',
				sortable:true
			},
//			{
//				field: 'isManualinput',
//				title: '人工输入检查结果',
//				align: 'center',
//				sortable:true,
//				formatter: function (value, row, index) {
//                    if (value == 1){
//                    	return '是';
//                    } else if (value == 0){
//                    	return '否';	
//                    } else {
//                    	
//                    }
//                },
//				 width:'150px',
//			},{
//				field: 'isMultiple',
//				title: '是否可多选',
//				align: 'center',
//				sortable:true,
//				formatter: function (value, row, index) {
//                    if (value == 1){
//                    	return '是';
//                    } else if (value == 0){
//                    	return '否';	
//                    } else {
//                    	
//                    }
//                },
//                width:'120px',
//			},
			{
				field:'enabled',
				title:'启用',
				align:'center',
        width:'120px',
				formatter: function (value, row, index) {
	              return Ew.switchHl(value,'sw',row.tmQmQualityId)
	            }
			}]
		}
	});
	var aa=-1;
	//子表格
//	Ew.table('.quality',{
//		btnValues:[
//		           {
//			btnId:'addQuality',text:'新增',otherOption:[{id:'tableQuality',selectNum: 1}],onClick:function(){
//				daliogShow2('add');
//			}
//		},{
//			btnId:'changeQuality',text:'编辑',otherOption:[{id:'tableQuality',selectNum: 1},{id:'table2',selectNum: 1}],selectNum:1,onClick:function(){
//				daliogShow2('change');
//			}
//		},{
//			btnId:'deleQuality',text:'删除',isTrue:true,otherOption:[{id:'table2',selMinNum: 1}],onClick:function(){
//				var rows = $('#table2').bootstrapTable('getSelections');
//				var ids = [];
//				$.each(rows,function(index,row){
//					ids.push(row.tmQmQualityresultId);
//				});
//				datas = JSON.stringify({tmQmQualityresultId:ids});
//				var url = '/quality/qmQualityResult/delete';
//				$.when(Ew.ewAjax(url,datas)).done(function(results){
//					$('#table2').bootstrapTable('refreshOptions',{pageNumber:1});
//					$('#table2').bootstrapTable('refresh');
//	            });
//			}
//		}
//		],
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
//				checkbox:true
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
//			}]
//		}
//	});
	
	//子表格2 iosFile
	Ew.table('.iosFile',{
		btnValues:[
		           {
			btnId:'btnAddSub',text:'新增',otherOption:[{id:'tableQuality',selectNum: 1}],onClick:function(){
				daliogShow22('add')
			}
		},{
			btnId:'btnEditSub',text:'编辑',otherOption:[{id:'tableQualitySub',selectNum: 1}],onClick:function(){
				daliogShow22('change')
			}
		},{
			btnId:'btnDeleteSub',text:'删除',isTrue:true,otherOption:[{id:'tableQualitySub',selMinNum: 1}],onClick:function(){
				var rows = $('#tableQualitySub').bootstrapTable('getSelections');
				var ids = [];
				$.each(rows,function(index,row){
					ids.push(row.tmQmDefectId);
				});
				datas = JSON.stringify({tmQmDefectId:ids});
				var url = '/quality/qmQualityDefect/delete';
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#tableQualitySub').bootstrapTable('refresh');
					$('#tableQualitySub').bootstrapTable('refreshOptions',{pageNumber:1});
	             });
			}
		}
		],
		tableId:'tableQualitySub',
		tableValue:{
			queryParams:function(){
				var id = $('#tableQuality').bootstrapTable('getSelections')[0]?$('#tableQuality').bootstrapTable('getSelections')[0].tmQmQualityId:-1;

				return {tmQmQualityId:id};
			},
			onClickRow:function(item,$element){

			},
			url:'/quality/qmQualityDefect/querylistByPage',
			columns:[{
				checkbox:true
			},{
				field:'defectId',
				title:'缺陷编号',
				align:'center',
				sortable:true
			},{
				field:'defectName',
				title:'缺陷名称',
				align:'center',
				 width:'150px',
				sortable:true
			}]
		}
	});
})

/*
*
*弹出框
*el：为html标签
*
*option(参数设置)：
*@title为弹出框标题
*@btnValues为弹出框最底下的按钮
*btnId为按钮id
*text为按钮名称
*如果text为重置，会自动重置formid的表单
*如果text为取消，自动关闭弹出框
*formid为点击时候需要验证form表单的form的id
*onClick为点击事件为函数function(data){}为form表单里的{field:value,......}
*
*@form如果有form自动内部加载form表单form表单参数详见Ew.form函数
**/

/*
*
*表单form及验证
*el：为html标签
*
*option(参数设置)：
*@formid为form表单id
*@columnNum为列数
*@formList表单条件参数
*text：为页面显示的条件名称，
*field：为当前条件的字段名称，取决后台需求，
*idName：为input的id，input的类型取决于id名包含字段，
*包含text，为输入文本框，
*包含combo，为下拉框，
*下拉数据调用后台方法
*comboUrl为接口地址，comboData为接口条件，comboId接口id字段，comboText接口text字段
*下拉数据调用本地方法，
*comboData：[{id:1,text:'2222'}],内容为写死的json
*包含day为时间控件年月日
*
*valid为验证条件，如果有触发验证信息，为数组
*notEmpty为必填，如果为对象直接验证对象里的信息
*{callback:{
message:'对',
callback:function(value,validator){
returnvalue==100||value=='';
}
}}
callback为自定义验证message为验证错误文字显示callback为函数value为框里的值return返回条件为false为错true为对

更多详见getInputhl
*
*
**/

function daliogShow(type){
	var title=type=='add'?'新增':'编辑';
	var defaultTable=type=='add'?'':'tableQuality';
	var planId = "";
	Ew.dialog('demoadd',{
		title:title,
		btnValues:[{
			btnId:'btnSave',
			text:'保存',
			formid:'demoform',
			onClick:function(data){
				var gValue = $("#combo11").val();
				
				var pValue = $("#combo12").val();
			
				if ((gValue == null || gValue == '') && (pValue == null ||pValue == '') ){
					layer.msg ("产品组和产品至少选择一个");
					return;
				}
				if(type=='change') data.tmQmQualityId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tmQmQualityId;
				datas = JSON.stringify(data);
				var url = (type=='add'?'/quality/qmQuality/add':'/quality/qmQuality/update');
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#demoadd').modal('hide');
					$('#tableQuality').bootstrapTable('refresh');
	             });
			}
		},{
			btnId:'btnCancel',
			text:'取消'
		}],
		form:{
			formId:'demoform',
			columnNum:2,
//			listWidth:350,
			formList:[{
				idName:'combo10',
				text:'工厂',
				comboUrl:'/base/plant/publicPlantSelect',
				comboId:'tmBasPlantId',
				comboText:'plant',
				field:'tmBasPlantId',
				valid:['notEmpty',{type:"string",min:0,max:32}],
				disabled:type=='add'?false:true,
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
				comboData:{
					id:['combo10','combo11'],
					field:['tmBasPlantId','tmBasPartgroupId']
				},
				isSearch:true
			},{
				idName:'combo14',
				text:'质检类型',
				field:'type',
				defaultValue:type=='add'?'1':'',
						comboUrl:'/system/codeList/getSelect',
						comboId:'no',
						comboText:'name',
						comboData:'QUALITY_TYPE',
				valid:[{type:"string",min:0,max:32}],
				disabled:type=='add'?false:true
			},{
				idName:'text13',
				text:'质检编号',
				field:'qualityNo',
				valid:[{type:"string",min:0,max:20},'notEmpty'],
				disabled:type=='add'?false:true
			},{
				idName:'area15',
				text:'质检内容',
				n:2,
				field:'qualityName',
				valid:['notEmpty',{type:"string",min:0,max:300}],
			},{
				idName:'area16',
				text:'备注',
				n:2,
				field:'qualityComments',
				valid:[{type:"string",min:0,max:300}],
			}
//			,{
//				idName:'switch11',
//				text:'人工输入结果',
//				field:'isManualinput',
//				ontext:'是',
//				offtext:'否'
//			},{
//				idName:'switch12',
//				text:'结果可多选',
//				field:'isMultiple',
//				ontext:'是',
//				offtext:'否'
//			}
			,{idName:'text311',text:'版本号',field:'version',hidden:true},

			{   defaultValue:type=='add'?1:'',
				idName:'switch13',
				text:'启用',
				field:'enabled',
				ontext:'启用',
				offtext:'禁用'
			}],
			defaultTable:defaultTable
		}
	})

}


//子表格
//function daliogShow2(type){
//	var title=type=='add'?'新增':'编辑';
//	var defaultTable=type=='add'?'':'table2';
//	Ew.dialog('demoadd',{
//		title:title,
//		btnValues:[{
//			btnId:'btnSave',
//			text:'保存',
//			formid:'demoform',
//			onClick:function(data){
//				data.tmQmQualityId = $('#tableQuality').bootstrapTable('getSelections')[0].tmQmQualityId ;
//				if(type=='change') data.tmQmQualityresultId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tmQmQualityresultId;
//				datas = JSON.stringify(data);
//				var url = (type=='add'?'/quality/qmQualityResult/add':'/quality/qmQualityResult/update');
//				$.when(Ew.ewAjax(url,datas)).done(function(results){
//					$('#demoadd').modal('hide');
//					$('#table2').bootstrapTable('refresh');
//	             });
//			}
//		},{
//			btnId:'bbbb',
//			text:'取消'
//		}],
//		form:{
//			formId:'demoform',
//			columnNum:2,
//			listWidth:280,
//			formList:[{
//				idName:'number25',
//				text:'序号',
//				field:'step',
//				valid:['notEmpty']
//			},
//			{
//				idName:'text26',
//				text:'质检结果',
//				field:'qualityresultName',
//				valid:['notEmpty']
//			},
//			{
//				idName:'switch27',
//				text:'启用',
//				field:'isOk',
//				ontext:'合格',
//				offtext:'不合格'
//			
//			}],
//			defaultTable:defaultTable
//		}
//	})
//
//}
//第二个子标签form
function daliogShow22(type){
	var title=type=='add'?'新增':'编辑';
	var defaultTable=type=='add'?'':'tableQualitySub';
	Ew.dialog('demoadd',{
		title:title,
		btnValues:[{
			btnId:'btnSaveSub',
			text:'保存',
			formid:'demoform',
			onClick:function(data){
				data.tmQmQualityId = $('#tableQuality').bootstrapTable('getSelections')[0].tmQmQualityId ;
				if(type=='change') data.tmQmDefectId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tmQmDefectId;
				datas = JSON.stringify(data);
				var url = (type=='add'?'/quality/qmQualityDefect/add':'/quality/qmQualityDefect/update');
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#demoadd').modal('hide');
					$('#tableQualitySub').bootstrapTable('refresh');
	             });
			}
		},{
			btnId:'benCancelSub',
			text:'取消'
		}],
		form:{
			formId:'demoform',
			columnNum:2,
			listWidth:280,
			formList:[{
				idName:'text25',
				text:'缺陷编号',
				field:'defectId',
				valid:['notEmpty',{type:"string",min:0,max:20}],
				disabled:type=='add'?false:true
				

			},	        
			{idName:'text311',text:'版本号',field:'version',hidden:true},

			{
				idName:'text26',
				text:'缺陷名称',
				field:'defectName',
				valid:['notEmpty',{type:"string",min:0,max:200}]
			}],
			defaultTable:defaultTable
		}
	})

}
