layui.use('layer',function(){
	layer=layui.layer;
	
});

$(function(){
	//搜索条件
	var mainSearchData=[{
		idName:'textSearchSeqNo',
		text:'序列名',
		field:'seqNo'
	},{
		idName:'textSearchSeqName',
		text:'序列名称',
		field:'seqName'
	}];

	Ew.search('.searchForm',{
		title:'查询',
		textValues:mainSearchData,
		btnValues:[{
			btnId:'btnSearch',
			text:'搜索',
			onClick:function(data){
				$('#tableSysSeq').bootstrapTable('refreshOptions',{pageNumber:1});
			}
		},{
			btnId:'btnClear',
			text:'重置',
			tableid:['tableSysSeq']
		}]
	});

	//主表格
	Ew.getDictVal(['CODE_SEQ_TYPE', 'YESORNO'], function (re) {
	Ew.table('.table',{
		btnValues:[{
			btnId:'btnAdd',text:'新增',onClick:function(){
				daliogShow('add')
			}
		},{
			btnId:'btnEdit',text:'编辑',otherOption:[{id:'tableSysSeq',selectNum: 1}],onClick:function(){
				daliogShow('change')
			}
		},{
			btnId:'btnDelete',text:'删除',isTrue:true,otherOption:[{id:'tableSysSeq',selMinNum: 1}],onClick:function(){
				var rows = $('#tableSysSeq').bootstrapTable('getSelections');
				var ids = [];
				var flag = false;
				$.each(rows,function(index,row){
					if (row.isEdit==1){
						ids.push(row.tsSysSeqId);
					} else {
						flag = true;
					}
				});
				if(flag){
					mesCom.msgWarning('存在不可编辑的数据,不能删除！');
					return;
				}
				var tsSysSeqId = {tsSysSeqId:ids};
				datas = JSON.stringify(tsSysSeqId);
				var url = '/system/seq/delete';
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#tableSysSeq').bootstrapTable('refreshOptions',{pageNumber:1});
	            });
			}
		}],
		tableId:'tableSysSeq',
		tableValue:{
			searchParams:mainSearchData,
			queryParams:function(){
				return{}
			},
			onClickRow:function(item,$element){
				
			},
			onLoadSuccess:function(){
				
	        },
			url:'/system/seq/queryAll',
			columns:[{
				checkbox: true
			}, {
				field: 'seqNo',
			    title: '序列名',
				align:'center',
				sortable:true,
				width:'120px'
			}, {
				field: 'seqName',
			    title: '序列名称',
				align:'center',
				sortable:true,
				width:'120px'
			},{
			    field: 'type',
			    title: '类型',
				align:'center',
				sortable:true,
				formatter: function (value, row, index) {
                    return re.CODE_SEQ_TYPE[value];
                },
				width:'70px'
			}, {
			    field: 'prefix',
			    title: '前缀',
				align:'center',
				sortable:true,
				width:'70px'
			}, {
				field: 'initValue',
			    title: '当前流水号',
				align:'center',
				sortable:true,
				width:'120px'
			}, {
				field: 'nextValue',
			    title: '下一流水号',
				align:'center',
				sortable:true,
				width:'120px'
			}, {
				field: 'maxValue',
			    title: '最大流水号',
				align:'center',
				sortable:true,
				width:'120px'
			}, {
				field: 'step',
			    title: '间隔',
				align:'center',
				sortable:true,
				width:'70px'
			}, {
				field: 'cycle',
			    title: '是否循环',
				align:'center',
				sortable:true,
				formatter: function (value, row, index) {
                    return re.YESORNO[value];
                },
				width:'70px'
			}, {
				field: 'isEdit',
			    title: '前端编辑',
				align:'center',
				sortable:true,
				formatter: function (value, row, index) {
                    return re.YESORNO[value];
                },
				width:'70px'
			}]
		}
	});
	});
})

function daliogShow(type){
	var title=type=='add'?'新增':'编辑';
	var defaultTable=type=='add'?'':'tableSysSeq';
	var isEdit=type=='add'?'1':$('#'+defaultTable).bootstrapTable('getSelections')[0].isEdit;
	Ew.dialog('fromadd',{
		title:title,
		btnValues:[{
			btnId:'btnSave',
			text:'保存',
			formid:'form',
			onClick:function(data){
				if(type=='change'){
					if(isEdit=='0'){
					    mesCom.msgWarning('该数据不可编辑！');
					    $('#fromadd').modal('hide');
						return;
					}
					data.tsSysSeqId = $('#tableSysSeq').bootstrapTable('getSelections')[0].tsSysSeqId;
				}
				datas = JSON.stringify(data);
				var url = (type=='add'?'/system/seq/add':'/system/seq/update');
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#fromadd').modal('hide');
					$('#tableSysSeq').bootstrapTable('refresh');
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
			formList:[
			  {
				idName:'comboType',
				text:'类型',
				field:'type',
				comboUrl:'/system/codeList/getSelect',
				comboData:'CODE_SEQ_TYPE',
				comboId:'no',
				comboText:'name',
				valid:['notEmpty'],
				disabled:type=='add'?false:true
			},{
				idName:'textPrefix',
				text:'前缀',
				field:'prefix',
				disabled:type=='add'?false:true,
				valid:[{type:'string',min:0,max:3}],
				symbolLimitYES:'yes'
			},{
				idName:'textseqNo',
				text:'序列名',
				field:'seqNo',
				valid:['notEmpty',{type:'string',min:0,max:50}],
				symbolLimitYes:'yes',
				disabled:type=='add'?false:true
			},{
				idName:'textSeqName',
				text:'序列名称',
				field:'seqName',
				valid:['notEmpty',{type:'string',min:0,max:50}],
				disabled:isEdit=='1'?false:true
			},{
				idName:'numberInitValue',
				text:'当前流水号',
				field:'initValue',
				valid:['notEmpty',{type:'number',min:0,max:99999999999999999999}],
				disabled:type=='add'?false:true
			},{
				idName:'numberNextValue',
				text:'下一流水号',
				field:'nextValue',
				valid:['notEmpty',{type:'number',min:0,max:99999999999999999999}],
				disabled:isEdit=='1'?false:true
			},{
				idName:'numberMaxValue',
				text:'最大流水号',
				field:'maxValue',
				valid:['notEmpty',{type:'number',min:0,max:99999999999999999999}],
				disabled:isEdit=='1'?false:true
			},{
				idName:'numberStep',
				text:'间隔',
				field:'step',
				valid:['notEmpty',{type:'number',min:0,max:9999999999}],
				disabled:isEdit=='1'?false:true
			},{
				idName:'switchCycle',
				text:'是否循环',
				field:'cycle',
				ontext:'是',
				offtext:'否',
				disabled:isEdit=='1'?false:true
			},{
				idName:'switchIsEdit',
				text:'前端编辑',
				field:'isEdit',
				ontext:'是',
				offtext:'否',
				disabled:isEdit=='1'?false:true
			},{
	        	idName:'textVersion',
					text:'版本号',
					field:'version',
					hidden:true
				}],
			defaultTable:defaultTable
		}
	})
}

