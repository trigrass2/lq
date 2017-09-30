layui.use('layer',function(){
	layer=layui.layer;
});

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
			$('#combotraceType').val('');
			$('#comboPart').val('');
			Ew.selectLink({
				comboUrl:'/quality/qmTraceType/querylistByPage',
				comboData:JSON.stringify({tmBasPlantId:data.id}),
				id:['combotraceType'],
				comboId:'tsSysTracetypeId',
				comboText:'typeName'
			});
			Ew.selectLink({
				comboUrl:'/worktime/part/publicProduct',
				comboData:JSON.stringify({tmBasPlantId:data.id,partType1:[],enabled:1}),
				id:['comboPart'],
				comboId:'tmBaspartId',
				comboText:'part'
			});
		}
	},{
		idName:'comboPart',
		text:'物料',
		comboUrl:'/worktime/part/publicProduct',
		comboData:
      {
			id:['comboPlant'],
			field:['tmBasPlantId'],
			other:{partType1:[],enabled:1}
      },
		comboId:'tmBasPartId',
		comboText:'part',
		field:'tmBasPartId',
		isSearch:true
	},{
		idName:'combotraceType',
		text:'关键件类型',
		comboUrl:'/quality/qmTraceType/querylistByPage',
		comboData:JSON.stringify({id:['comboPlant'],field:['tmBasPlantId']}),
		comboId:'tsSysTracetypeId',
		comboText:'typeName',
		field:'tsSysTracetypeId',
	}]

	Ew.search('.searchForm',{
		title:'查询',
		textValues:mainSearchData,
		btnValues:[{
			btnId:'btnSearch',
			text:'搜索',
			onClick:function(data){
				$('#tableQmTraceSetting').bootstrapTable('refreshOptions',{pageNumber:1});
			}
		},{
			btnId:'btnClear',
			text:'重置',
			tableid:['tableQmTraceSetting']
		}]
	});

	//主表格
	 Ew.getDictVal(['PART_TYPE3','SN_LABEL_PROPERTY'], function (re) {
	Ew.table('.mainTable',{
		btnValues:[{
			btnId:'btnAdd',text:'新增',onClick:function(){
				daliogShow('add');
			}
		},{
			btnId:'btnEdit',text:'编辑',otherOption:[{id:'tableQmTraceSetting',selectNum: 1}],onClick:function(){
				daliogShow('change');
			}
		},{
			btnId:'btnDelete',text:'删除',isTrue:true,otherOption:[{id:'tableQmTraceSetting',selMinNum: 1}],onClick:function(){
				var rows = $('#tableQmTraceSetting').bootstrapTable('getSelections');
				ids = [];
				var flag = true;
				$.each(rows,function(index,row){
					ids.push(row.tmQmTraceSettingId);
				});
				datas = JSON.stringify({tmQmTraceSettingId : ids});
				var url = '/quality/qmTraceSetting/delete'
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#tableQmTraceSetting').bootstrapTable('refreshOptions',{pageNumber:1});
				});
			}
		},{
			btnId:'btnExportTpl',text:'模板下载',onClick:function(){
				window.top.location.href= apiUrl +'/quality/qmTraceSetting/exportTpl'
			}
		},{
			btnId:'btnInput',text:'导入', url:'',tableId:'tableQmTraceSetting',onClick:function(){
			}
		},{
			btnId:'btnExport',text:'导出',onClick:function(){
				window.top.location.href= apiUrl +'/quality/qmTraceSetting/export'
			}
		}],
		tableId:'tableQmTraceSetting',
		tableValue:{
			searchParams:mainSearchData,
			queryParams:function(){
				return{}
			},
			onClickRow:function(item,$element){
				$('#tableQmTraceDetail').bootstrapTable('refresh',{query:{tmQmTraceSettingId:item.tmQmTraceSettingId}});//或者{query:{}}直接设置查询条件
			},
			onLoadSuccess:function(){

			},
			url:'/quality/qmTraceSetting/querylistByPage',
			columns:[{
				checkbox: true
			},{
				field: 'plant',
				title: '工厂',
				align: 'center',
		        width:'120px',
				sortable:true
			},{
				field: 'partgroup',
				title: '物料组',
				align: 'center',
				sortable:true,
		        width:'120px'
			},{
				field: 'part',
				title: '物料',
				align: 'center',
				sortable:true,
		        width:'120px'
			},{
				field: 'tracetype',
				title: '关键件类型',
				align: 'center',
				sortable:true,
		        width:'120px'
			},{
				field: 'barcode',
				title: '产品编码规则',
				align: 'center',
				sortable:true,
		        width:'120px'
			},{
				field: 'uloc',
				title: '工位',
				align: 'center',
				sortable:true,
		        width:'120px'
			},{
				field: 'partType3',
				title: '追溯类型',
				align: 'center',
				sortable:true,
				formatter: function (value, row, index) {
			           return re.PART_TYPE3[value];
		          },
		        width:'120px'
			},{
				field: 'lotQty',
				title: '批次数量',
				align: 'center',
				sortable:true,
		        width:'120px'
			}]
		}
	});
	Ew.table('.subTable',{
		tableTitleSub:'追溯规则明细',
		btnValues:[{
			btnId:'btnAddSub',text:'新增',otherOption:[{id:'tableQmTraceSetting',selectNum: 1}],onClick:function(){
				daliogShow2('add');
			}
		},{
			btnId:'btnEditSub',text:'编辑',otherOption:[{id:'tableQmTraceDetail',selectNum: 1}],selectNum:1,onClick:function(){
				daliogShow2('change');
			}
		},{

			btnId:'btnDeleteSub',text:'删除',isTrue:true,otherOption:[{id:'tableQmTraceDetail',selMinNum: 1}],onClick:function(){
				var rows = $('#tableQmTraceDetail').bootstrapTable('getSelections');
				ids = [];
				var flag = true;
				$.each(rows,function(index,row){
					ids.push(row.tmQmTraceDetailId);
				});
				datas = JSON.stringify({tmQmTraceDetailId : ids});
				var url = '/quality/qmTraceDetail/delete'
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#tableQmTraceSetting').bootstrapTable('refreshOptions',{pageNumber:1});
					$('#tableQmTraceDetail').bootstrapTable('removeAll');
				});
			}
		
		}],
		tableId:'tableQmTraceDetail',
		tableValue:{
			queryParams:function(){
				var getSelection = $('#tableQmTraceSetting').bootstrapTable('getSelections')[0];
				var id = getSelection?getSelection.tmQmTraceSettingId:-1;
				return {tmQmTraceSettingId:id};
			},
			onClickRow:function(item,$element){

			},
			onLoadSuccess:function(){

			},
			url:'/quality/qmTraceDetail/querylistByPage',
			columns:[{
				checkbox: true
			},{
				field: 'sectionSeq',
				title: '分段序号',
				align: 'center',
				sortable:true,
		        width:'120px'
			},{
				field: 'sectionBit',
				title: '位数',
				align: 'center',
				sortable:true,
		        width:'120px'
			},{
				field: 'label',
				title: '标识',
				align: 'center',
				formatter: function (value, row, index) {
			           return re.SN_LABEL_PROPERTY[value];
		          },
				sortable:true,
		        width:'120px'
			},{
				field: 'isValidate',
				title: '是否校验 ',
				align: 'center',
				formatter: function (value, row, index) {
		        	var text='';
		               switch (value) {
					case 0:
						text='不校验'
						break;
					case 1:
						text='校验'
						break;
					default:
						break;
					}
		               return text;
		            },
				sortable:true,
		        width:'120px'
			},{
				field: 'validateRule',
				title: '校验方式',
				align: 'center',
				formatter: function (value, row, index) {
		        	var text='';
		               switch (value) {
					case 0:
						text='规则校验'
						break;
					case 1:
						text='数值校验'
						break;
					default:
						break;
					}
		               return text;
		            },
				sortable:true,
		        width:'120px'
			},{
				field: 'value',
				title: '数值',
				align: 'center',
				sortable:true,
		        width:'120px'
			},{
				field: 'value2',
				title: '数值2',
				align: 'center',
				sortable:true,
		        width:'120px'
			},{
				field: 'value3',
				title: '数值3',
				align: 'center',
				sortable:true,
		        width:'120px'
			}]
		}
	});
	
	});
})

function daliogShow(type){
	var title=type=='add'?'新增':'编辑';
	var defaultTable=type=='add'?'':'tableQmTraceSetting';
	Ew.dialog('mainFromEdit',{
		title:title,
		btnValues:[{
			btnId:'btnSave',
			text:'保存',
			formid:'form',
			onClick:function(data){
				if(type=='change'){
					data.tmQmTraceSettingId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tmQmTraceSettingId;
				}
			if((data.tmBasPartgroupId==null||data.tmBasPartgroupId=='')&&(data.tmBasPartId==null||data.tmBasPartId=='')){
				layer.msg("产品组和产品至少选择一项");
				return
			}	
			
				datas = JSON.stringify(data);
				var url = (type=='add'?'/quality/qmTraceSetting/add':'/quality/qmTraceSetting/update');
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#mainFromEdit').modal('hide');
					$('#tableQmTraceSetting').bootstrapTable('refresh');
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
				idName:'comboPlantI',
				text:'工厂',
				comboUrl:'/base/plant/publicPlantSelect',
				comboId:'tmBasPlantId',
				comboText:'plant',
				field:'tmBasPlantId',
				valid:['notEmpty',{type:"string",min:0,max:50}],
				disabled:type=='add'?false:true,
				onClick:function(data){
//					$('#comboComPartgroupI').select2('val',[' ']);
//					$('#comboComPartI').select2('val',[' ']);
//					$('#comboUlocI').select2('val',[' ']);
//					$('#combotraceTypeI').select2('val',[' ']);
//					$('#comboBarcode').select2('val',[' ']);
					Ew.selectLink({
						comboUrl:'/base/uloc/queryUlocSelectForInputWithLineId2',
						comboId:'tmBasUlocId',
						comboData:JSON.stringify({tmBasPlantId:data.id}),
						id:['comboUlocI'],
						comboText:'ulocNo'
					});
					Ew.selectLink({
						comboUrl:'/plantlayout/basPartgroup/queryPartgroupList',
						comboId:'tmBasPartgroupId',
						comboData:JSON.stringify({tmBasPlantId:data.id}),
						id:['comboComPartgroupI'],
						comboText:'partgroup'
					});
					Ew.selectLink({
						comboUrl:'/worktime/part/queryPartPartGroupSuggestAll',
						comboId:'tmBasPartId',
						comboData:JSON.stringify({tmBasPlantId:data.id}),
						id:['comboComPartI'],
						comboText:'part'
					});
					Ew.selectLink({
						comboUrl:'/systemconfig/sysBarcode/queryBarcodeSelect',
						comboId:'tsSysBarcodeId',
						comboData:JSON.stringify({ptmBasPlantId:data.id}),
						id:['comboBarcode'],
						comboText:'barcode'
					});
					Ew.selectLink({
						comboUrl:'/quality/qmTraceType/querylistByPage',
						comboId:'tsSysTracetypeId',
						comboData:JSON.stringify({tmBasPlantId:data.id}),
						id:['combotraceTypeI'],
						comboText:'tracetype'
					});
				}
			},{
				idName:'combotraceTypeI',
				text:'关键件类型',
				comboUrl:'/quality/qmTraceType/querylistByPage',
				comboData:JSON.stringify({id:['comboPlantI'],field:['tmBasPlantId']}),
				comboId:'tsSysTracetypeId',
				comboText:'tracetype',
				field:'tsSysTracetypeId',
				valid:['notEmpty',{type:"string",min:0,max:50}],
				disabled:type=='add'?false:true
	},{
				idName:'comboComPartgroupI',
				text:'物料组',
				comboUrl:'/plantlayout/basPartgroup/queryPartgroupList',
				comboId:'tmBasPartgroupId',
				comboText:'partgroup',
				field:'tmBasPartgroupId',
				valid:[{type:"string",min:0,max:50}],
				disabled:type=='add'?false:true,
				isSearch:type=='add'?true:false,
				comboData:{
					id:['comboPlantI'],
					field:['tmBasPlantId']
				}
			},{
				idName:'comboComPartI',
				text:'物料',
				comboUrl:'/worktime/part/queryPartPartGroupSuggestAll',
				comboId:'tmBasPartId',
				comboText:'part',
				field:'tmBasPartId',
				otherValue:type=='add'?'partType3':null,
				valid:[{type:"string",min:0,max:50}],
				comboData:
					{
					id:['comboPlantI','comboComPartgroupI'],
					field:['tmBasPlantId','tmBasPartgroupId']
					},
					isSearch:type=='add'?true:false,
					disabled:type=='add'?false:true,
					onClick:function(data){
						var partType3=data.id.split(',')[1]
						$('#combo_modal_part_type3').select2('val',[partType3]);
						if(partType3=='B'){
							$('#numberLotQty').parent('div').parent('li').css('display','block');
							$('#form').data('bootstrapValidator').enableFieldValidators('numberLotQty', true);
						}else{
							$('#numberLotQty').parent('div').parent('li').css('display','none');
							$('#form').data('bootstrapValidator').enableFieldValidators('numberLotQty', false);
						}
					}
					},{
				idName:'comboBarcode',
				text:'编码规则',
				field:'tsSysBarcodeId',
				comboUrl:'/systemconfig/sysBarcode/barcodeSelectByName',
				comboData:{other:{}},
				comboId:'tsSysBarcodeId',
				comboText:'barcode',
				isSearch:true,
				valid:['notEmpty',{type:"string",min:0,max:50}],
				disabled:type=='add'?false:true
			},{
				idName:'comboUlocI',
				text:'工位',
				field:'tmBasUlocId',
				comboUrl:'/base/uloc/queryUlocSelectForInputWithLineId',
				comboData:{id:['comboPlantI'],field:['pTmBasPlantId']},
				comboId:'tmBasUlocId',
				comboText:'uloc',
				isSearch:true,
				valid:['notEmpty',{type:"string",min:0,max:50}],
				disabled:type=='add'?false:false
			},{
				idName:'combo_modal_part_type3',
				text:'追溯类型',
				field:'partType3',
				comboUrl:'/system/codeList/getSelect',
				comboData:'PART_TYPE3',
				comboId:'no',
				comboText:'name',
				disabled:true
			},{
				idName:'numberLotQty',
				text:'批次数量',
				field:'lotQty',
				hidden:type=='add'?true:false,
				defaultValue:type=='add'?1:null,
				valid:['notEmpty',{type:"number",min:0,max:999999}]
			},{
		        idName:'textVersion',
				text:'版本号',
				field:'version',
				hidden:true
			}],
			defaultTable:defaultTable
		}
	})
};
	function daliogShow2(type){
	var title=type=='add'?'新增':'编辑';
	var defaultTable=type=='add'?'':'tableQmTraceDetail';
	Ew.dialog('mainFromEdit',{
		title:title,
		btnValues:[{
			btnId:'btnSave',
			text:'保存',
			formid:'form2',
			onClick:function(data){
				data.tmQmTraceSettingId = $('#tableQmTraceSetting').bootstrapTable('getSelections')[0].tmQmTraceSettingId;
				if(type=='change'){
					data.tmQmTraceDetailId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tmQmTraceDetailId;
				}
				datas = JSON.stringify(data);
				var url = (type=='add'?'/quality/qmTraceDetail/add':'/quality/qmTraceDetail/update');
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#mainFromEdit').modal('hide');
					$('#tableQmTraceDetail').bootstrapTable('refresh');
				});
			}
		},{
			btnId:'btnCancel',
			text:'取消'
		}],
		form:{
			formId:'form2',
			columnNum:2,
			listWidth:250,
			formList:[{
				idName:'comboSectionSeq',
				text:'分段序号',
				comboUrl:'/systemconfig/sysBarcodeDetail/querylistByPage',
				comboData:JSON.stringify({tsSysBarcodeId:$('#tableQmTraceSetting').bootstrapTable('getSelections')[0].tsSysBarcodeId}),
				comboId:'sectionSeq',
				comboText:'sectionSeq',
				field:'sectionSeq',
				n:2,
				otherValue:'sectionBit',
				//defaultValue:type=='add'?'':$('#'+defaultTable).bootstrapTable('getSelections')[0].sectionSeq,// 编辑时不能带出是因为othervalue的问题；
				valid:['notEmpty',{type:"number",min:0,max:999}],
				disabled:type=='add'?false:true,
				onClick:function(data){
					var sectionBit=data.id.split(",")[1];
					$('#numberSectionBit').val(sectionBit);
				}
			},{
				idName:'numberSectionBit',
				text:'位数',
				field:'sectionBit',
				valid:['notEmpty',{type:"number",min:0,max:999}],
				disabled:true
			},{
				idName:'comboLabel',
				text:'标识',
				field:'label',
				comboUrl:'/system/codeList/getSelect',
				comboData:'SN_LABEL_PROPERTY',
				comboId:'no',
				comboText:'name',
				valid:[{type:"string",min:0,max:50}],
				disabled:type=='add'?false:false
			},{
				idName: 'radioIsValidate',
				text: '是否校验', 
				field: 'isValidate',
				rodioData:[{text:'是',value:'1',checked:true},{text:'否',value:'0'}], 
				n:1,
				 onChange:function(state){
				
		              Ew.dynvalid(state==1?true:false,'form2',[{field:'value',idName:'textValue'}])
		              
		            }
				},
			{idName: 'radioValidateRule',
				text: '校验规则', 
				field: 'validateRule',
				rodioData:[{text:'规则校验',value:'0'},{text:'固定值校验',value:'1',checked:true}],
				n:1,
				 onChange:function(state){
		              Ew.dynvalid(state==1?true:false,'form2',[{field:'value',idName:'textValue'}])
		              
		            }
				},{
				idName:'textValue',
				text:'固定值1',
				field:'value',
				valid:['notEmpty',{type:"string",min:0,max:50}],
				disabled:type=='add'?false:false
			},{
				idName:'textValue2',
				text:'固定值2',
				field:'value2',
				valid:[{type:"string",min:0,max:50}],
				disabled:type=='add'?false:false
			},{
				idName:'textValue3',
				text:'固定值3',
				field:'value3',
				valid:[{type:"string",min:0,max:50}],
				disabled:type=='add'?false:false
			},{
		        idName:'textVersion',
				text:'版本号',
				field:'version',
				hidden:true
			}],
			defaultTable:defaultTable
		}
	})
	};
