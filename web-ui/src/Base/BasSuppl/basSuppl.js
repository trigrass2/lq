//layui.use('layer',function(){
//	layer=layui.layer;
//	
//});

$(function(){
	//搜索条件
	var mainSearchData=[{
		idName:'text_suppl_no',
		text:'供应商编号',
		field:'supplNo'
	},{
		idName:'text_suppl_name',
		text:'供应商名称',
		field:'nameCn'
	},{
		idName:'combo_suppl_enabled',
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
				$('#tableSuppl').bootstrapTable('refresh');
			}
		},{
			btnId:'btnClear',
			text:'重置',
			tableid:['tableSuppl']
		}]
	});

	//主表格
	Ew.table('.table',{
		btnValues:[{
			btnId:'btnAdd',text:'新增',onClick:function(){
				daliogShow('add')
			}
		},{
			btnId:'btnEdit',text:'编辑',otherOption:[{id:'tableSuppl',selectNum: 1}],onClick:function(){
				daliogShow('change')
			}
		},{
			btnId:'btnDelete',text:'删除',isTrue:true,otherOption:[{id:'tableSuppl',selMinNum: 1}],onClick:function(){
				var rows = $('#tableSuppl').bootstrapTable('getSelections');
				var ids = [];
				var flag = true;
				$.each(rows,function(index,row){
					ids.push(row.tmBasSupplId);
				});
//				var tmBasCustomId = {tmBasCustomId:ids};
				datas = JSON.stringify(ids);
				var url = '/worktime/suppl/delete';
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#tableSuppl').bootstrapTable('refresh');
	            });
			}
		},{
			btnId:'btnExport',text:'导出',isTrue:true,selMinNum:1,onClick:function(){

			}
		}],
		tableId:'tableSuppl',
		tableValue:{
			searchParams:mainSearchData,
			queryParams:function(){
				return{}
			},
			onClickRow:function(item,$element){
				
			},
			onLoadSuccess:function(){$('.sw30').bootstrapSwitch({
				onText:"启用",
				offText:"禁用",
				onColor:"success",
				offColor:"info",
				onSwitchChange:function(event,state){
					var d = {};
					d.tmBasCustomId = $(this).attr('fieldValue');
					d.isDunit = state?1:0;
					datas = JSON.stringify(d);
					var url = "/worktime/custom/update";
					$.when(Ew.ewAjax(url,datas)).done(function(results){
						$('#tableSuppl').bootstrapTable('refresh');
		            });
				}
			});
        
			
			$('.sw31').bootstrapSwitch({
				onText:"启用",
				offText:"禁用",
				onColor:"success",
				offColor:"info",
				onSwitchChange:function(event,state){
					var d = {};
					d.tmBasCustomId = $(this).attr('fieldValue');
					d.isSubcontract = state?1:0;
					datas = JSON.stringify(d);
					var url = "/worktime/custom/update";
					$.when(Ew.ewAjax(url,datas)).done(function(results){
						$('#tableSuppl').bootstrapTable('refresh');
					});
				}
			});
			
			
			$('.sw32').bootstrapSwitch({
				onText:"启用",
				offText:"禁用",
				onColor:"success",
				offColor:"info",
				onSwitchChange:function(event,state){
					var d = {};
					d.tmBasCustomId = $(this).attr('fieldValue');
					d.enabled = state?1:0;
					datas = JSON.stringify(d);
					var url = "/worktime/custom/update";
					$.when(Ew.ewAjax(url,datas)).done(function(results){
						$('#tableSuppl').bootstrapTable('refresh');
					});
				}
			});
			},
			url:'/worktime/suppl/querylistByPage',
			columns:[{
				checkbox: true
			}, {
				field: 'supplNo',
			    title: '供应商编号',
				align:'center',
				sortable:true
			}, {
				field: 'nameCn',
			    title: '供应商名称',
				align:'center',
				sortable:true	
			}, {
				field: 'nameEn',
			    title: '英文名称',
				align:'center',
				sortable:true	
			}, {
				field: 'nameCnS',
			    title: '中文简称',
				align:'center',
				sortable:true	
			}, {
				field: 'nameEnS',
			    title: '英文简称',
				align:'center',
				sortable:true	
			}, {
				field: 'addrCn',
			    title: '中文地址',
				align:'center',
				sortable:true	
			}, {
				field: 'addrEn',
			    title: '英文地址',
				align:'center',
				sortable:true	
			}, {
				field: 'contact1',
			    title: '联系人1',
				align:'center',
				sortable:true	
			}, {
				field: 'telNo1',
			    title: '电话号码1',
				align:'center',
				sortable:true	
			}, {
				field: 'mobileNo1',
			    title: '手机号码1',
				align:'center',
				sortable:true	
			}, {
				field: 'faxNo1',
			    title: '传真号码1',
				align:'center',
				sortable:true	
			}, {
				field: 'email1',
			    title: '邮件地址1',
				align:'center',
				sortable:true	
			}, {
				field: 'contact2',
			    title: '联系人2',
				align:'center',
				sortable:true	
			}, {
				field: 'telNo2',
			    title: '电话号码2',
				align:'center',
				sortable:true	
			}, {
				field: 'mobileNo2',
			    title: '手机号码2',
				align:'center',
				sortable:true	
			}, {
				field: 'faxNo2',
			    title: '传真号码2',
				align:'center',
				sortable:true	
			}, {
				field: 'email2',
			    title: '邮件地址2',
				align:'center',
				sortable:true	
			}, {
				field: 'remark',
			    title: '备注',
				align:'center',
				sortable:true	
			}, {
				field:'isDunit',
				title:'是否承运商',
				align:'center',
        		width:'120px',
				formatter: function (value, row, index) {
	            	return Ew.switchHl(value,'sw30',row.tmBasSupplId)
	            }
			}, {
				field:'isSubcontract',
				title:'是否委外加工商',
				align:'center',
        		width:'120px',
				formatter: function (value, row, index) {
	            	return Ew.switchHl(value,'sw31',row.tmBasSupplId)
	            }
			}, {
				field:'enabled',
				title:'启用',
				align:'center',
        		width:'120px',
				formatter: function (value, row, index) {
	            	return Ew.switchHl(value,'sw32',row.tmBasSupplId)
	            }
			}]
		}
	});
})


function daliogShow(type){
	var title=type=='add'?'新增':'编辑';
	var defaultTable=type=='add'?'':'tableSuppl';
	Ew.dialog('fromadd',{
		title:title,
		btnValues:[{
			btnId:'btnSave',
			text:'保存',
			formid:'form',
			onClick:function(data){
				if(type=='change'){
					data.tmBasSupplId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tmBasSupplId;
				}
				datas = JSON.stringify(data);
				var url = (type=='add'?'/worktime/suppl/add':'/worktime/suppl/update');
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#fromadd').modal('hide');
					$('#tableSuppl').bootstrapTable('refresh');
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
				idName:'text_modal_suppl_no',
				text:'客户编号',
				field:'supplNo',
				valid:['notEmpty',{type:'string',min:0,max:50}],
				disabled:type=='add'?false:true,
				n:2
			},{
				idName:'text_modal_suppl_nameCn',
				text:'中文名称',
				field:'nameCn',
				valid:['notEmpty',{type:'string',min:0,max:50}],
				n:2
			},{
				idName:'text_modal_suppl_nameEn',
				text:'英文名称',
				field:'nameEn',
				valid:[{type:'string',min:0,max:50}],
				n:2
			},{
				idName:'text_modal_suppl_nameCnS',
				text:'中文名称缩写',
				field:'nameCnS',
				valid:[{type:'string',min:0,max:50}],
				n:1
			},{
				idName:'text_modal_suppl_nameEnS',
				text:'英文名称缩写',
				field:'nameEnS',
				valid:[{type:'string',min:0,max:50}],
				n:1
			},{
				idName:'text_modal_suppl_addrCn',
				text:'中文地址',
				field:'addrCn',
				valid:[{type:'string',min:0,max:100}],
				n:2
			},{
				idName:'text_modal_suppl_addrEn',
				text:'英文地址',
				field:'addrEn',
				valid:[{type:'string',min:0,max:100}],
				n:2
			},{
				idName:'text_modal_suppl_contact1',
				text:'联系人1',
				field:'contact1',
				valid:[{type:'string',min:0,max:50}],
				n:1
			},{
				idName:'text_modal_suppl_contact2',
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
			},{
				idName:'switch_modal_suppl_isDunit',
				text:'承运商',
				field:'isDunit',
				ontext:'是',
				offtext:'否',
				n:1
			},{
				idName:'switch_modal_suppl_isSubcontract',
				text:'委外加工商',
				field:'isSubcontract',
				ontext:'是',
				offtext:'否',
				n:1
			},{
				idName:'switch_modal_suppl_enabled',
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

