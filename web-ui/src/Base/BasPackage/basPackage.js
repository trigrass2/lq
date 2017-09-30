//layui.use('layer',function(){
//	layer=layui.layer;
//	
//});

$(function(){
	//搜索条件
	var mainSearchData=[{
		idName:'text_package_no',
		text:'包装编号',
		field:'packageNo'
	},{
		idName:'text_package_name',
		text:'包装名称',
		field:'name'
	},{
		idName:'combo_package_enabled',
		field:'enabled',
		text:'启用',
		comboUrl:'/system/codeList/getSelect',
		comboData:'ENABLE',
		comboId:'no',
		comboText:'name'
	}];

	Ew.search('.searchForm',{
		title:'查询',
		textValues:mainSearchData,
		btnValues:[{
			btnId:'btnSearch',
			text:'搜索',
			onClick:function(data){
				$('#tablePackage').bootstrapTable('refreshOptions',{pageNumber:1});
			}
		},{
			btnId:'btnClear',
			text:'重置',
			tableid:['tablePackage']
		}]
	});
	
	Ew.getDictVal(['YESORNO'],function (re) {
		//主表格
		Ew.table('.table',{
			btnValues:[{
				btnId:'btnAdd',text:'新增',onClick:function(){
					daliogShow('add')
				}
			},{
				btnId:'btnEdit',text:'编辑',otherOption:[{id:'tablePackage',selectNum: 1}],onClick:function(){
					daliogShow('change')
				}
			},{
				btnId:'btnDelete',text:'删除',isTrue:true,otherOption:[{id:'tablePackage',selMinNum: 1}],onClick:function(){
					var rows = $('#tablePackage').bootstrapTable('getSelections');
					var ids = [];
					var flag = true;
					$.each(rows,function(index,row){
						ids.push(row.tmBasPackageId);
					});
					datas = JSON.stringify(ids);
					var url = '/base/baspackage/deletemany';
					$.when(Ew.ewAjax(url,datas)).done(function(results){
						$('#tablePackage').bootstrapTable('refreshOptions',{pageNumber:1});
		            });
				}
			}],
			tableId:'tablePackage',
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
							d.tmBasPackageId = $(this).attr('fieldValue');
							d.enabled = state?1:0;
							datas = JSON.stringify(d);
							var url = '/base/baspackage/update';
							$.when(Ew.ewAjax(url,datas)).done(function(results){
								$('#tablePackage').bootstrapTable('refresh');
				            });
						}
					});
		        },
				url:'/base/baspackage/querylistByPage',
				columns:[{
					checkbox: true
				}, {
					field: 'packageNo',
				    title: '包装编号',
					align:'center',
					sortable:true,
	        		width:'120px'
				}, {
					field: 'name',
				    title: '包装名称',
					align:'center',
					sortable:true,
	        		width:'120px'
				}, {
					field: 'packageType',
				    title: '包装类型',
					align:'center',
					sortable:true,
	        		width:'120px'
				}, {
					field: 'plant',
				    title: '工厂',
					align:'center',
					sortable:true,
	        		width:'120px'
				}, {
					field: 'length',
				    title: '长(cm)',
					align:'center',
					sortable:true,
	        		width:'120px'
				}, {
					field: 'width',
				    title: '宽(cm)',
					align:'center',
					sortable:true,
	        		width:'120px'
				}, {
					field: 'hight',
				    title: '高(cm)',
					align:'center',
					sortable:true,
	        		width:'120px'
				},{
					field: 'isJis',
					title: '是否排序料架',
					align:'center',
					sortable:true,
					formatter: function (value, row, index) {
			        	return re.YESORNO[value];
			        },
		        	width:'120px'
				}, {
					field: 'prow',
				    title: '行',
					align:'center',
					sortable:true,
	        		width:'120px'	
				},{
				    field: 'pcolumn',
				    title: '列',
					align:'center',
					sortable:true,
	        		width:'120px'
				}, {
				    field: 'ptier',
				    title: '层',
					align:'center',
					sortable:true,
	        		width:'120px'
				},{
					field: 'remark',
				    title: '备注',
					align:'center',
					sortable:true,
					width:'120px'
				}, {
					field:'enabled',
					title:'启用',
					align:'center',
	        		width:'120px',
					formatter: function (value, row, index) {
		            	return Ew.switchHl(value,'sw',row.tmBasPackageId)
		            }
				}]
			}
		});
	})
	
})

function daliogShow(type){
	var title=type=='add'?'新增':'编辑';
	var defaultTable=type=='add'?'':'tablePackage';
	Ew.dialog('fromadd',{
		title:title,
		btnValues:[{
			btnId:'btnSave',
			text:'保存',
			formid:'form',
			onClick:function(data){
				if(type=='change'){
				data.tmBasPackageId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tmBasPackageId;
				}
				datas = JSON.stringify(data);
				var url = (type=='add'?'/base/baspackage/add':'/base/baspackage/update');
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#fromadd').modal('hide');
					$('#tablePackage').bootstrapTable('refresh');
	             });
				
			}
		},{
			btnId:'btnCancel',
			text:'取消'
		}],
		form:{
			formId:'form',
			columnNum:3,
			listWidth:250,
			formList:[{
				idName:'text_modal_package_no',
				text:'包装编号',
				field:'packageNo',
				valid:['notEmpty',{callback:{
					message: '只能是数字、字母、_(下划线)、-(中划线)、\(斜杠)、/(反斜杠)',
		            callback: function(value, validator) {
		            		 if(/^[a-zA-Z0-9_\.\\/-]+$/.test(value)){
		            			 return true;
		            		 }
		            		 return false;
		            	 }
		            
				}},{type:'string',min:1,max:20}],
				disabled:type=='add'?false:true,
				n:3
			},{
				idName:'text_modal_package_name',
				text:'中文名称',
				field:'name',
				valid:['notEmpty',{type:'string',min:1,max:200}],
				n:3
			},{
				idName:'combo_modal_package_type',
				text:'包装类型',
				comboUrl:'/system/codeList/getSelect',
				comboId:'tsSysCodeListId',
				comboText:'name',
				field:'packageType',
				comboData:'PACKAGE_TYPE',
				defaultValue:type=='add'?'':$('#'+defaultTable).bootstrapTable('getSelections')[0].tsSysCodeListId,
				valid:['notEmpty'],
				n:1.5
			},{
				idName:'combo_modal_package_plant',
				text:'工厂',
				comboUrl:'/base/plant/publicPlantSelect',
				comboId:'tmBasPlantId',
				comboText:'plant',
				field:'tmBasPlantId',
				valid:[],
				comboData:type=='add'?JSON.stringify({
					enabled:1
				}):{},
				n:1.5
			},{
				idName:'number_modal_package_length',
				text:'长(cm)',
				field:'length',
				valid:[{type:'number',min:0,max:999}],
				n:1
			},{
				idName:'number_modal_package_width',
				text:'宽(cm)',
				field:'width',
				valid:[{type:'number',min:0,max:999}],
				n:1
			},{
				idName:'number_modal_package_hight',
				text:'高(cm)',
				field:'hight',
				valid:[{type:'number',min:0,max:999}],
				n:1
			},{
				idName:'switch_modal_dock_isJis',
				text:'是否排序料架',
				field:'isJis',
				ontext:'是',
				offtext:'否',
				//defaultValue:type=='add'?'0':$('#tablePackage').bootstrapTable('getSelections')[0].isJis,
				n:3,
				onChange:function(state){
	            	Ew.dynvalid(state==1?true:false,'form',[{field:'prow',idName:'number_modal_package_prow'},{field:'pcolumn',idName:'number_modal_package_pcolumn'},{field:'ptier',idName:'number_modal_package_ptier'}])
				
				}
			},{
				idName:'number_modal_package_prow',
				text:'行',
				field:'prow',
				n:1,
				valid:['notEmpty',{type:'number',min:0,max:999}]
			},{
				idName:'number_modal_package_pcolumn',
				text:'列',
				field:'pcolumn',
				n:1,
				valid:['notEmpty',{type:'number',min:0,max:999}]
			},{
				idName:'number_modal_package_ptier',
				text:'层',
				field:'ptier',
				n:1,
				valid:['notEmpty',{type:'number',min:0,max:999}]
			},{
				idName:'text_modal_package_remark',
				text:'备注',
				field:'remark',
				valid:[{type:'string',min:1,max:200}],
				n:3
			},{
				idName:'switch_modal_package_enabled',
				text:'启用',
				field:'enabled',
				defaultValue:type=='add'?1:$('#tablePackage').bootstrapTable('getSelections')[0].enabled,
				ontext:'启用',
				offtext:'禁用'
			},{
				idName:'text311',
				text:'版本号',
				field:'version',
				hidden:true		
			}],
			defaultTable:defaultTable
		}
	})
	if(type=='add'){
		 $('#form').data('bootstrapValidator').enableFieldValidators('prow', false);
		 $('#form').data('bootstrapValidator').enableFieldValidators('pcolumn', false);
		 $('#form').data('bootstrapValidator').enableFieldValidators('ptier', false);
		 $('#number_modal_package_prow').parent('div').siblings('i').css('display','none');
		 $('#number_modal_package_pcolumn').parent('div').siblings('i').css('display','none');
		 $('#number_modal_package_ptier').parent('div').siblings('i').css('display','none');
	}else{
		var flag=$('#tablePackage').bootstrapTable('getSelections')[0].isJis==1;
		 $('#form').data('bootstrapValidator').enableFieldValidators('prow', flag);
		 $('#form').data('bootstrapValidator').enableFieldValidators('pcolumn', flag);
		 $('#form').data('bootstrapValidator').enableFieldValidators('ptier', flag);
		if(flag){
				$('#number_modal_package_prow').parent('div').siblings('i').css('display','block');
				$('#number_modal_package_pcolumn').parent('div').siblings('i').css('display','block');
				$('#number_modal_package_ptier').parent('div').siblings('i').css('display','block');
		 }else{
			 $('#number_modal_package_prow').parent('div').siblings('i').css('display','none');
			 $('#number_modal_package_pcolumn').parent('div').siblings('i').css('display','none');
			 $('#number_modal_package_ptier').parent('div').siblings('i').css('display','none');
		 }
	}
}

