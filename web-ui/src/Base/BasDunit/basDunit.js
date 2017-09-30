//layui.use('layer',function(){
//	layer=layui.layer;
//	
//});

$(function(){
	//搜索条件
	var mainSearchData=[{
		idName:'text_dunit_no',
		text:'承运商编号',
		field:'dunitNo'
	},{
		idName:'text_dunit_name',
		text:'承运商名称',
		field:'nameCn'
	},{
		idName:'combo_dunit_enabled',
		field:'enabled',
		text:'启用',
		comboData:[{
			id:1,
			text:'启用'
		},{
			id:0,
			text:'禁用'
		}]
	}];

	Ew.search('.searchForm',{
		title:'查询',
		textValues:mainSearchData,
		btnValues:[{
			btnId:'btnSearch',
			text:'搜索',
			onClick:function(data){
				$('#tableDunit').bootstrapTable('refresh');
			}
		},{
			btnId:'btnClear',
			text:'重置',
			tableid:['tableDunit']
		}]
	});

	//主表格
	Ew.table('.table',{
		btnValues:[{
			btnId:'btnAdd',text:'新增',onClick:function(){
				daliogShow('add')
			}
		},{
			btnId:'btnEdit',text:'编辑',otherOption:[{id:'tableDunit',selectNum: 1}],onClick:function(){
				daliogShow('change')
			}
		},{
			btnId:'btnDelete',text:'删除',isTrue:true,otherOption:[{id:'tableDunit',selMinNum: 1}],onClick:function(){
				var rows = $('#tableDunit').bootstrapTable('getSelections');
				var ids = [];
				var flag = true;
				$.each(rows,function(index,row){
					ids.push(row.tmBasDunitId);
				});
//				var tmBasCustomId = {tmBasCustomId:ids};
				datas = JSON.stringify(ids);
				var url = '/worktime/dunit/delete';
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#tableDunit').bootstrapTable('refresh');
	            });
			}
		},{
			btnId:'btnExport',text:'导出',isTrue:true,selMinNum:1,onClick:function(){

			}
		}],
		tableId:'tableDunit',
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
						d.tmBasDunitId = $(this).attr('fieldValue');
						d.enabled = state?1:0;
						datas = JSON.stringify(d);
						var url = "/worktime/dunit/update";
						$.when(Ew.ewAjax(url,datas)).done(function(results){
							$('#tableDunit').bootstrapTable('refresh');
			            });
					}
				});
	        
	        },
			url:'/worktime/dunit/querylistByPage',
			columns:[{
				checkbox: true
			}, {
				field: 'dunitNo',
			    title: '承运商编号',
				align:'center',
				width:'120px',
				sortable:true
			}, {
				field: 'nameCn',
			    title: '承运商名称',
				align:'center',
				sortable:true,
				width:'120px'	
			}, {
				field: 'dunitType',
			    title: '类型',
				align:'center',
			 formatter: function (value, row, index) {
			        	var text='';
			               switch (value) {
						case '3PL':
							text='第三方物流'
							break;
						case 'WS':
							text='仓库'
							break;
						case 'SUP':
							text='供应商'
							break;
						default:
							break;
						}
			               return text;
			            },
				sortable:true,
				width:'120px'	
			}, {
				field: 'nameEn',
			    title: '英文名称',
				align:'center',
				sortable:true,
				width:'120px'	
			}, {
				field: 'nameCnS',
			    title: '中文简称',
				align:'center',
				sortable:true,
				width:'120px'	
			}, {
				field: 'nameEnS',
			    title: '英文简称',
				align:'center',
				sortable:true,
				width:'120px'	
			}, {
				field: 'addrCn',
			    title: '中文地址',
				align:'center',
				sortable:true,
				width:'120px'	
			}, {
				field: 'addrEn',
			    title: '英文地址',
				align:'center',
				sortable:true,
				width:'120px'	
			}, {
				field: 'contact1',
			    title: '联系人1',
				align:'center',
				sortable:true,
				width:'120px'	
			}, {
				field: 'telNo1',
			    title: '电话号码1',
				align:'center',
				sortable:true,
				width:'120px'	
			}, {
				field: 'mobileNo1',
			    title: '手机号码1',
				align:'center',
				sortable:true,
				width:'120px'	
			}, {
				field: 'faxNo1',
			    title: '传真号码1',
				align:'center',
				sortable:true,
				width:'120px'	
			}, {
				field: 'email1',
			    title: '邮件地址1',
				align:'center',
				sortable:true,
				width:'120px'	
			}, {
				field: 'contact2',
			    title: '联系人2',
				align:'center',
				sortable:true,
				width:'120px'	
			}, {
				field: 'telNo2',
			    title: '电话号码2',
				align:'center',
				sortable:true,
				width:'120px'	
			}, {
				field: 'mobileNo2',
			    title: '手机号码2',
				align:'center',
				sortable:true,
				width:'120px'	
			}, {
				field: 'faxNo2',
			    title: '传真号码2',
				align:'center',
				sortable:true,
				width:'120px'	
			}, {
				field: 'email2',
			    title: '邮件地址2',
				align:'center',
				sortable:true,
				width:'120px'	
			}, {
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
	            	return Ew.switchHl(value,'sw',row.tmBasDunitId)
	            }
			}]
		}
	});
})


function daliogShow(type){
	var title=type=='add'?'新增':'编辑';
	var defaultTable=type=='add'?'':'tableDunit';
	Ew.dialog('fromadd',{
		title:title,
		btnValues:[{
			btnId:'btnSave',
			text:'保存',
			formid:'form',
			onClick:function(data){
				if(type=='change'){
					data.tmBasDunitId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tmBasDunitId;
				}
				datas = JSON.stringify(data);
				var url = (type=='add'?'/worktime/dunit/add':'/worktime/dunit/update');
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#fromadd').modal('hide');
					$('#tableDunit').bootstrapTable('refresh');
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
				idName:'text_modal_dunit_no',
				text:'编号',
				field:'dunitNo',
				valid:['notEmpty',{type:'string',min:0,max:50}],
				disabled:type=='add'?false:true,
				n:1
			},{
				idName:'combo_modal_dunit_dunitType',
				text:'类型',
				field:'dunitType',
				comboUrl:'/system/codeList/getSelect',
				comboData:'DUNIT_TYPE',
				comboId:'no',
				comboText:'name',
				valid:['notEmpty',{type:'string',min:0,max:50}],
				n:1
			},{
				idName:'text_modal_dunit_nameCn',
				text:'中文名称',
				field:'nameCn',
				valid:['notEmpty',{type:'string',min:0,max:50}],
				n:2
			},{
				idName:'text_modal_dunit_nameEn',
				text:'英文名称',
				field:'nameEn',
				valid:[{type:'string',min:0,max:50}],
				n:2
			},{
				idName:'text_modal_dunit_nameCnS',
				text:'中文简称',
				field:'nameCnS',
				valid:[,{type:'string',min:0,max:50}],
				n:1
			},{
				idName:'text_modal_dunit_nameEnS',
				text:'英文简称',
				field:'nameEnS',
				valid:[{type:'string',min:0,max:50}],
				n:1
			},{
				idName:'text_modal_dunit_addrCn',
				text:'中文地址',
				field:'addrCn',
				valid:[{type:'string',min:0,max:50}],
				n:2
			},{
				idName:'text_modal_dunit_addrEn',
				text:'英文地址',
				field:'addrEn',
				valid:[{type:'string',min:0,max:50}],
				n:2
			},{
				idName:'text_modal_dunit_contact1',
				text:'联系人1',
				field:'contact1',
				valid:[{type:'string',min:0,max:50}],
				n:1
			},{
				idName:'text_modal_dunit_contact2',
				text:'联系人2',
				field:'contact2',
				valid:[{type:'string',min:0,max:50}],
				n:1
			},{
				idName:'text_modal_suppl_telNo1',
				text:'电话号码1',
				field:'telNo1',
				valid:[{type:'string',min:0,max:50},{callback:{
					message: '请输入正确的固定电话号码:0XX(X)-XXXXXXX(X)',
		            callback: function(value, validator) {
		            		 if(/\d{4}-\d{6,8}|\d{3}-\d{6,8}/.test(value)||value==''){
		            			 return true;
		            		 }
		            		 return false;
		            	 }
		            
				}}],
				n:1
			},{
				idName:'text_modal_suppl_telNo2',
				text:'电话号码2',
				field:'telNo2',
				valid:[{type:'string',min:0,max:50},{callback:{
					message: '请输入正确的固定电话号码:0XX(X)-XXXXXXX(X)',
		            callback: function(value, validator) {
		            		 if(/\d{4}-\d{6,8}|\d{3}-\d{6,8}/.test(value)||value==''){
		            			 return true;
		            		 }
		            		 return false;
		            	 }
		            
				}}],
				n:1
			},{
				idName:'text_modal_suppl_mobileNo1',
				text:'手机号码1',
				field:'mobileNo1',
				valid:[{type:'string',min:0,max:50},{callback:{
					message: '请输入正确的手机号码',
		            callback: function(value, validator) {
		            		 if(/^1[3|5|8]{1}[0-9]{9}$/.test(value)||value==''){
		            			 return true;
		            		 }
		            		 return false;
		            	 }
		            
				}}],
				n:1
			},{
				idName:'text_modal_suppl_mobileNo2',
				text:'手机号码2',
				field:'mobileNo2',
				valid:[{type:'string',min:0,max:50},{callback:{
					message: '请输入正确的手机号码',
		            callback: function(value, validator) {
		            		 if(/^1[3|5|8]{1}[0-9]{9}$/.test(value)||value==''){
		            			 return true;
		            		 }
		            		 return false;
		            	 }
		            
				}}],
				n:1
			},{
				idName:'text_modal_suppl_faxNo1',
				text:'传真号码1',
				field:'faxNo1',
				valid:[{type:'string',min:0,max:50},{callback:{
					message: '请输入正确的传真号码',
		            callback: function(value, validator) {
		            		 if(/\d{4}-\d{6,8}|\d{3}-\d{6,8}/.test(value)||value==''){
		            			 return true;
		            		 }
		            		 return false;
		            	 }
		            
				}}],
				n:1
			},{
				idName:'text_modal_suppl_faxNo2',
				text:'传真号码2',
				field:'faxNo2',
				valid:[{type:'string',min:0,max:50},{callback:{
					message: '请输入正确的传真号码',
		            callback: function(value, validator) {
		            		 if(/\d{4}-\d{6,8}|\d{3}-\d{6,8}/.test(value)||value==''){
		            			 return true;
		            		 }
		            		 return false;
		            	 }
		            
				}}],
				n:1
			},{
				idName:'text_modal_suppl_email1',
				text:'邮件地址1',
				field:'email1',
				valid:[{type:'string',min:0,max:50},{callback:{
					message: '请输入正确的邮件地址如：123@qq.com',
		            callback: function(value, validator) {
		            		 if(/^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(value)||value==''){
		            			 return true;
		            		 }
		            		 return false;
		            	 }
		            
				}}],
				n:1
			},{
				idName:'text_modal_suppl_email2',
				text:'邮件地址2',
				field:'email2',
				valid:[{type:'string',min:0,max:50},{callback:{
					message: '请输入正确的邮件地址如：123@qq.com',
		            callback: function(value, validator) {
		            		 if(/^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(value)||value==''){
		            			 return true;
		            		 }
		            		 return false;
		            	 }
		            
				}}],
				n:1
			},{
				idName:'text_modal_suppl_remark',
				text:'备注',
				field:'remark',
				valid:[{type:'string',min:0,max:200}],
				n:2
			},{	idName:'switch_modal_dunit_enabled',
				text:'启用',
				field:'enabled',
				ontext:'启用',
				offtext:'禁用'
			},{
				idName:'text_version',
				text:'版本号',
				field:'version',
				hidden:true
			}],
			defaultTable:defaultTable
		}
	})
}

