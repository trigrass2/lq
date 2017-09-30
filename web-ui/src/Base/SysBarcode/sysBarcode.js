$(function(){
	//搜索条件
	var mainSearchData=[{
		idName:'text51',
		text:'模板编号',
		field:'barcodeNo'
	},{
		idName:'text52',
		text:'模板名称',
		field:'name'
	},{
		idName:'combo53',
		text:'类型',
		comboUrl:'/system/codeList/getSelect',
		comboId:'no',
		comboText:'name',
		field:'type',
		comboData:'CODE_MODE_TYPE'
	}];
	

	Ew.search('.demoSearch',{
		title:'查询',
		textValues:mainSearchData,
		btnValues:[{
			btnId:'btnSearch',
			text:'搜索',
			onClick:function(data){
				$('#table1').bootstrapTable('refreshOptions',{pageNumber:1});
				$('#table2').bootstrapTable('removeAll');
			}
		},{
			btnId:'btnClear',
			text:'重置',
			tableid:['table1','table2']
		}]
	});

	Ew.getDictVal(['CODE_MODE_TYPE'],function (re) {
		//主表格
		Ew.table('.demoTable',{
			btnValues:[{
				btnId:'btnAdd',text:'新增',onClick:function(){
					daliogShow('add')
				}
			},{
				btnId:'btnEdit',text:'编辑',otherOption:[{id:'table1',selectNum: 1}],onClick:function(){
					daliogShow('change')
				}
			},{
				btnId:'btnDelete',text:'删除',isTrue:true,otherOption:[{id:'table1',selMinNum: 1}],onClick:function(){
					var rows = $('#table1').bootstrapTable('getSelections');
					var ids = [];
					$.each(rows,function(index,row){
						ids.push(row.tsSysBarcodeId);
					});
					datas = JSON.stringify({tsSysBarcodeId:ids});
					var url = '/systemconfig/sysBarcode/delete';
					$.when(Ew.ewAjax(url,datas)).done(function(results){
						$('#table1').bootstrapTable('refreshOptions',{pageNumber:1});
		            });
				}
			}],
			tableId:'table1',
			tableValue:{
				searchParams:mainSearchData,
				queryParams:function(){
					return{}
				},
				onClickRow:function(item,$element){
					$('#table2').bootstrapTable('refreshOptions',{pageNumber:1});//或者{query:{}}直接设置查询条件
				},
				onLoadSuccess:function(){
					
		        },
				url:'/systemconfig/sysBarcode/querylistByPage',
				columns:[{
			        checkbox: true
			    },{
					field: 'barcodeNo',
					title: '条形码模板编号',
					align: 'center',
					sortable:true,
					width:'130px'
				},{
					field: 'name',
					title: '条形码模板名称',
					align: 'center',
					sortable:true,
					width:'130px'
				},{
					field: 'type',
					title: '类型',
					align: 'center',
					formatter: function (value, row, index) {
		                return re.CODE_MODE_TYPE[value];
		            },
					sortable:true,
					width:'70px'
				},{
					field: 'tableNoAndName',
					title: '默认表名',
					align: 'center',
					sortable:true,
					width:'130px'
				},{
					field: 'columnNoAndName',
					title: '默认字段',
					align: 'center',
					sortable:true,
					width:'130px'		
				},{
					field: 'remark',
					title: '备注',
					align: 'center',
					sortable:true
				}]
			}
		});
    })
	
    Ew.getDictVal(['CODE_SECTION_TYPE','CODE_FILL_TYPE','CODE_CUT_TYPE','CODE_SEQ_TYPE','CODE_DATE_TYPE'],function (re) {
		//子表格
		Ew.table('.demoTable2',{
			btnValues:[{
				btnId:'btnAddSub',text:'新增',otherOption:[{id:'table1',selectNum: 1}],onClick:function(){
					daliogShow2('add')
				}
			},{
				btnId:'btnEditSub',text:'编辑',otherOption:[{id:'table1',selectNum: 1},{id:'table2',selectNum: 1}],selectNum:1,onClick:function(){
					daliogShow2('change')
				}
			},{
				btnId:'btnDeleteSub',text:'删除',isTrue:true,otherOption:[{id:'table1',selectNum: 1},{id:'table2',selMinNum: 1}],onClick:function(){
					var rows = $('#table2').bootstrapTable('getSelections');
					var ids = [];
					$.each(rows,function(index,row){
						ids.push(row.tsSysBarcodeDetailId);
					});
					datas = JSON.stringify({tsSysBarcodeDetailId:ids});
					var url = '/systemconfig/sysBarcodeDetail/delete';
					$.when(Ew.ewAjax(url,datas)).done(function(results){
						$('#table2').bootstrapTable('refreshOptions',{pageNumber:1});
		            });
				}
			}],
			tableId:'table2',
			tableValue:{
				queryParams:function(){
					var id = $('#table1').bootstrapTable('getSelections')[0]?$('#table1').bootstrapTable('getSelections')[0].tsSysBarcodeId:-1;
					return {tsSysBarcodeId:id};
				},
				onClickRow:function(item,$element){
	
				},
				url:'/systemconfig/sysBarcodeDetail/querylistByPage',
				columns:[{
					checkbox: true
				},{
					field: 'sectionSeq',
					title: '分段序号',
					align: 'center',
					sortable:true,
					width:'100px'
				},{
					field: 'sectionBit',
					title: '位数',
					align: 'center'
				},{
					field: 'sectionType',
					title: '分段类型',
					align: 'center',
					formatter: function (value, row, index) {
		                return re.CODE_SECTION_TYPE[value];
		            },
					sortable:true,
					width:'100px'
				},{
					field: 'tableNoAndName',
					title: '表名',
					align: 'center',
					sortable:true,
					width:'100px'
				},{
					field: 'columnNoAndName',
					title: '字段名',
					align: 'center',
					sortable:true,
					width:'100px'
				},{
					field: 'seqType',
					title: '流水号类型',
					align: 'center',
					sortable:true,
					width:'100px',
					formatter: function (value, row, index) {
		                return re.CODE_SEQ_TYPE[value];
		            }
				},{
					field: 'startNum',
					title: '起始值',
					align: 'center',
					sortable:true,
					width:'100px'
				},{
					field: 'stepNum',
					title: '增量值',
					align: 'center',
					sortable:true,
					width:'100px'
				},{
					field: 'dateType',
					title: '日期类型',
					align: 'center',
					sortable:true,
					width:'100px',
					formatter: function (value, row, index) {
		                return re.CODE_DATE_TYPE[value];
		            }
				},{
					field: 'fixNo',
					title: '固定值',
					align: 'center',
					sortable:true,
					width:'100px'
				},{
					field: 'fillType',
					title: '补位方式',
					align: 'center',
					sortable:true,
					width:'100px',
					formatter: function (value, row, index) {
		                return re.CODE_FILL_TYPE[value];
		            },
				},{
					field: 'fillNo',
					title: '补位字符',
					align: 'center',
					sortable:true,
					width:'100px'
				},{
					field: 'cutType',
					title: '截取方式',
					align: 'center',
					sortable:true,
					width:'100px',
					formatter: function (value, row, index) {
		                return re.CODE_CUT_TYPE[value];
		            },
				},{
					field: 'remark',
					title: '备注',
					align: 'center',
					sortable:true,
					width:'100px'
				}]
			}
		});
    })
});


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
				if(type=='change') data.tsSysBarcodeId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tsSysBarcodeId;
				datas = JSON.stringify(data);
				var url = (type=='add'?'/systemconfig/sysBarcode/add':'/systemconfig/sysBarcode/update');
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
				idName:'text11',
				text:'条形码模板编号',
				field:'barcodeNo',
				valid:['notEmpty',{type:'string',min:0,max:20}],
				disabled:type=='add'?false:true
			},{
				idName:'text12',
				text:'条形码模板名称',
				field:'name',
				valid:['notEmpty',{type:'string',min:0,max:200}]
			},{
				idName:'combo13',
				text:'类型',
				comboUrl:'/system/codeList/getSelect',
				comboId:'no',
				comboText:'name',
				field:'type',
				comboData:'CODE_MODE_TYPE'
			},{
				idName:'combo14',
				text:'默认表名',
				field:'tableNo',
				comboUrl:'/system/sysTable/queryTableNoSelect',
				comboId:'tableNo',
				comboText:'tableNoAndName',
				valid:['notEmpty'],
				contentType:true,
				isSearch:true,
				onClick:function(data){
					Ew.selectLink({
						comboUrl:'/system/sysTable/queryColumnNoSelect',
				        comboData:JSON.stringify({tableName:data.id}),
				        id:['combo15'],
				        comboId:'columnNo',
				        comboText:'columnName'
				    });
				}
			},{
				idName:'combo15',
				text:'默认字段名',
				field:'columnNo',
				comboUrl:'/system/sysTable/queryColumnNoSelect',
				comboId:'columnNo',
				comboText:'columnNoAndName',
				valid:['notEmpty'],
				contentType:true,
				isSearch:true,
				comboData:{
					id:['combo14'],
					field:['tableName']
				},
			},{
				idName:'area16',
				text:'备注',
				field:'remark',
				valid:[{type:'string',min:0,max:200}],
				n:2
			},{
				idName:'textVersion',
				text:'版本',
				field:'version',
				hidden:true	
			}],
			defaultTable:defaultTable
		}
	})

}


//子表格
function daliogShow2(type){
	var title=type=='add'?'新增':'编辑';
	var defaultTable=type=='add'?'':'table2';
	if(type=='change'){
		var sectionType=$('#'+defaultTable).bootstrapTable('getSelections')[0].sectionType;
	} else {
		var sectionType='';
	}
	Ew.dialog('demoadd',{
		title:title,
		btnValues:[{
			btnId:'btnSaveSub',
			text:'保存',
			formid:'demoform',
			onClick:function(data){
				if($('#combo25').val() == 'FIX'){
					if($('#number24').val() != $('#text28').val().length){
						mesCom.msgError("位数与固定值得位数不一致,请修改");
						return;
					}
				}
				if($('#combo25').val() == 'DAT'){
					if($('#combo213').val() == 'yyMMdd'){
						if($('#number24').val() != '6'){
							mesCom.msgError("位数应该为6,请修改");
							return;
						}
					}
					if($('#combo213').val() == 'yyyyMMdd'){
						if($('#number24').val() != '8'){
							mesCom.msgError("位数应该为8,请修改");
							return;
						}
					}
				}
				if($('#combo25').val() == 'TES'){
					if($('#number24').val() != 1){
						mesCom.msgError("校验码位数只有一位,请修改");
						return;
					}
				}
				data.tsSysBarcodeId = $('#table1').bootstrapTable('getSelections')[0].tsSysBarcodeId ; //主表ID
				if(type=='change') {
					data.tsSysBarcodeDetailId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tsSysBarcodeDetailId; //子表ID
				}
				datas = JSON.stringify(data);
				var url = (type=='add'?'/systemconfig/sysBarcodeDetail/add':'/systemconfig/sysBarcodeDetail/update');
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#demoadd').modal('hide');
					$('#table2').bootstrapTable('refresh');
	             });
			}
		},{
			btnId:'btnCancelSub',
			text:'取消'
		}],
		form:{
			formId:'demoform',
			columnNum:2,
			listWidth:280,
			formList:[{
				idName:'text21',
				text:'模板名称',
				field:'modelname',
				valid:[''],
				defaultValue:$('#table1').bootstrapTable('getSelections')[0].name,
				disabled:true
			},{
				idName:'text22',
				text:'模板类型',
				field:'modeltyle',
				valid:[''],
				defaultValue:$('#table1').bootstrapTable('getSelections')[0].type=='MM'?'物料':($('#table1').bootstrapTable('getSelections')[0].type=='PP'?'生产':($('#table1').bootstrapTable('getSelections')[0].type=='QT'?'质量':'')),
				disabled:true
			},{
				idName:'number23',
				text:'分段序号',
				field:'sectionSeq',
				valid:['notEmpty',{type:'string',min:0,max:3}],
				disabled:type=='add'?false:true
			},{
				idName:'number24',
				text:'位数',
				field:'sectionBit',
				valid:['notEmpty',{type:'number',max:999,min:0}],
			},{
				idName:'combo25',
				text:'类型',
				field:'sectionType',
				comboUrl:'/system/codeList/getSelect',
				comboId:'no',
				comboText:'name',
				comboData:'CODE_SECTION_TYPE',
				valid:['notEmpty'],
				onClick:function(data){
					var type = data.id;
					changeDis(type);
				}
			},{
				idName:'combo26',
				text:'表名',
				field:'tableNo',
				comboUrl:'/system/sysTable/queryTableNoSelect',
				comboId:'tableNo',
				comboText:'tableNoAndName',
				contentType:true,
				isSearch:true,
				valid:['notEmpty'],
				disabled:sectionType=='COL'?false:true,
				onClick:function(data){
					Ew.selectLink({
						comboUrl:'/system/sysTable/queryColumnNoSelect',
				        comboData:JSON.stringify({tableName:data.id}),
				        id:['combo27'],
				        comboId:'columnNo',
				        comboText:'columnName'
				    });
				}
			},{
				idName:'combo27',
				text:'字段名',
				field:'columnNo',
				comboUrl:'/system/sysTable/queryColumnNoSelect',
				comboId:'columnNo',
				comboText:'columnNoAndName',
				contentType:true,
				isSearch:true,
				valid:['notEmpty'],
				disabled:sectionType=='COL'?false:true,
				comboData:{
					id:['combo26'],
					field:['tableName']
				},
			},{
				idName:'text28',
				text:'固定值',
				field:'fixNo',
				valid:['notEmpty'],
				disabled:sectionType=='FIX'?false:true,
			},{
				idName:'combo29',
				text:'流水号类型',
				field:'seqType',
				comboUrl:'/system/codeList/getSelect',
				comboId:'no',
				comboText:'name',
				comboData:'CODE_SEQ_TYPE',
				valid:['notEmpty'],
				disabled:sectionType=='SEQ'?false:true
			},{
				idName:'text211',
				text:'起始值',
				field:'startNum',
				valid:['notEmpty'],
				disabled:sectionType=='SEQ'?false:true
				
			},{
				idName:'text212',
				text:'增量值',
				field:'stepNum',
				valid:['notEmpty'],
				disabled:sectionType=='SEQ'?false:true
			},{
				idName:'combo213',
				text:'日期类型',
				field:'dateType',
				comboUrl:'/system/codeList/getSelect',
				comboId:'no',
				comboText:'name',
				comboData:'CODE_DATE_TYPE',
				valid:['notEmpty'],
				disabled:sectionType=='DAT'?false:true
			},{
				idName:'combo214',
				text:'补位方式',
				field:'fillType',
				comboUrl:'/system/codeList/getSelect',
				comboId:'no',
				comboText:'name',
				comboData:'CODE_FILL_TYPE',
				disabled:sectionType=='SEQ'?true:false
			},{
				idName:'text216',
				text:'补位字符',
				field:'fillNo',
			},{
				idName:'combo217',
				text:'截取方式',
				field:'cutType',
				comboUrl:'/system/codeList/getSelect',
				comboId:'no',
				comboText:'name',
				comboData:'CODE_CUT_TYPE',
				disabled:sectionType=='SEQ'?true:false
			},{
				idName:'area218',
				text:'备注',
				field:'remark',
				n:2
			},{
				idName:'textVersionSub',
				text:'版本',
				field:'version',
				hidden:true
			}],
			defaultTable:defaultTable
		}
	})
}

function changeDis(type){
	$("#combo214").attr("disabled",false);
	$("#combo217").attr("disabled",false);
	if (type == 'COL') {
		$("#combo26").attr("disabled",false);
		$("#combo27").attr("disabled",false);
		
		$("#text28").attr("disabled",true);
		$("#text28").val("");
		
		$("#combo29").attr("disabled",true);
		$("#text211").attr("disabled",true);
		$("#text212").attr("disabled",true);
		$("#combo29").select2('val',['']);
		$("#text211").val("");
		$("#text212").val("");
		
		$("#combo213").attr("disabled",true);
		$("#combo213").select2('val',['']);
	} else if (type == 'FIX'){
		$("#combo26").attr("disabled",true);
		$("#combo27").attr("disabled",true);
		$("#combo26").select2('val',['']);
		$("#combo27").select2('val',['']);
		
		$("#text28").attr("disabled",false);
		
		$("#combo29").attr("disabled",true);
		$("#text211").attr("disabled",true);
		$("#text212").attr("disabled",true);
		$("#combo29").select2('val',['']);
		$("#text211").val("");
		$("#text212").val("");
		
		$("#combo213").attr("disabled",true);
		$("#combo213").select2('val',['']);
	}else if (type == 'DAT') {
		$("#combo26").attr("disabled",true);
		$("#combo27").attr("disabled",true);
		$("#combo26").select2('val',['']);
		$("#combo27").select2('val',['']);
		
		$("#text28").attr("disabled",true);
		$("#text28").val("");
		
		$("#combo29").attr("disabled",true);
		$("#text211").attr("disabled",true);
		$("#text212").attr("disabled",true);
		$("#combo29").select2('val',['']);
		$("#text211").val("");
		$("#text212").val("");
		
		$("#combo213").attr("disabled",false);
	}else if (type == 'SEQ') {
		$("#combo26").attr("disabled",true);
		$("#combo27").attr("disabled",true);
		$("#combo26").select2('val',['']);
		$("#combo27").select2('val',['']);
		
		$("#text28").attr("disabled",true);
		$("#text28").val("");
		
		$("#combo29").attr("disabled",false);
		$("#text211").attr("disabled",false);
		$("#text212").attr("disabled",false);
		
		$("#combo213").attr("disabled",true);
		$("#combo213").select2('val',['']);
		
		$("#combo214").attr("disabled",true);
		$("#combo217").attr("disabled",true);
	}else if (type == 'TES') {
		$("#combo26").attr("disabled",true);
		$("#combo27").attr("disabled",true);
		$("#combo26").select2('val',['']);
		$("#combo27").select2('val',['']);
		
		$("#text28").attr("disabled",true);
		$("#text28").val("");
		
		$("#combo29").attr("disabled",true);
		$("#text211").attr("disabled",true);
		$("#text212").attr("disabled",true);
		$("#combo29").select2('val',['']);
		$("#text211").val("");
		$("#text212").val("");
		
		$("#combo213").attr("disabled",true);
		$("#combo213").select2('val',['']);
	}
}