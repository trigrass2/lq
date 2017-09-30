//layui.use('layer',function(){
//	layer=layui.layer;
//	
//});

$(function(){
	//搜索条件
	var mainSearchData=[{
		idName:'text_custom_no',
		text:'客户编号',
		field:'customNo'
	},{
		idName:'text_custom_name',
		text:'客户名称',
		field:'nameCn'
	},{
		idName:'combo_custom_enabled',
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
				$('#tableCustom').bootstrapTable('refreshOptions',{pageNumber:1});
			}
		},{
			btnId:'btnClear',
			text:'重置',
			tableid:['tableCustom']
		}]
	});

	//主表格
	Ew.table('.table',{
		btnValues:[{
			btnId:'btnAdd',text:'新增',onClick:function(){
				daliogShow('add')
			}
		},{
			btnId:'btnEdit',text:'编辑',otherOption:[{id:'tableCustom',selectNum: 1}],onClick:function(){
				daliogShow('change')
			}
		},{
			btnId:'btnDelete',text:'删除',isTrue:true,otherOption:[{id:'tableCustom',selMinNum: 1}],onClick:function(){
				var rows = $('#tableCustom').bootstrapTable('getSelections');
				var ids = [];
				var flag = true;
				$.each(rows,function(index,row){
					ids.push(row.tmBasCustomId);
				});
//				var tmBasCustomId = {tmBasCustomId:ids};
				datas = JSON.stringify(ids);
				var url = '/worktime/custom/delete';
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#tableCustom').bootstrapTable('refreshOptions',{pageNumber:1});
	            });
			}
		},{
			btnId:'btnDownload',text:'模板下载',isTrue:true,selMinNum:1,onClick:function(){
				var  url = '/worktime/custom/down';
           		window.top.location.href = Ew.apiUrl +url;
			}
		},{
			btnId:'btnImport',text:'导入',selMinNum:1,url:'/worktime/custom/import',tableId:'tableCustom'
		},{
			btnId:'btnExport',text:'导出',isTrue:true,selMinNum:1,onClick:function(){
				var customNo = $('#text_custom_no').val();
				var nameCn = $('#text_custom_name').val();
				var enabled = $('#combo_custom_enabled').val();
				window.top.location.href= apiUrl +'/worktime/custom/export?customNo='+customNo+'&nameCn='+nameCn+'&enabled='+enabled
			}
		}],
		tableId:'tableCustom',
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
						d.tmBasCustomId = $(this).attr('fieldValue');
						d.enabled = state?1:0;
						datas = JSON.stringify(d);
						var url = "/worktime/custom/update";
						$.when(Ew.ewAjax(url,datas)).done(function(results){
							$('#tableCustom').bootstrapTable('refresh');
			            });
					}
				});
	        
	        
	        },
			url:'/worktime/custom/querylistByPage',
			columns:[{
				checkbox: true
			}, {
				field: 'customNo',
			    title: '客户编号',
				align:'center',
				sortable:true
			}, {
				field: 'nameCn',
			    title: '客户名称',
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
				field:'enabled',
				title:'启用',
				align:'center',
        		width:'120px',
				formatter: function (value, row, index) {
	            	return Ew.switchHl(value,'sw',row.tmBasCustomId)
	            }
			}]
		}
	});
})


function daliogShow(type){
	var title=type=='add'?'新增':'编辑';
	var defaultTable=type=='add'?'':'tableCustom';
	Ew.dialog('fromadd',{
		title:title,
		btnValues:[{
			btnId:'btnSave',
			text:'保存',
			formid:'form',
			onClick:function(data){
				if(type=='change'){
					data.tmBasCustomId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tmBasCustomId;
				}
				datas = JSON.stringify(data);
				var url = (type=='add'?'/worktime/custom/add':'/worktime/custom/update');
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#fromadd').modal('hide');
					$('#tableCustom').bootstrapTable('refresh');
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
				idName:'text_modal_custom_no',
				text:'客户编号',
				field:'customNo',
				valid:[{type:'string',min:0,max:20},'notEmpty'],
				disabled:type=='add'?false:true,
				n:2
			},{
				idName:'text_modal_custom_nameCn',
				text:'中文名称',
				field:'nameCn',
				valid:[{type:'string',min:0,max:200},'notEmpty'],
				n:2
			},{
				idName:'text_modal_custom_nameEn',
				text:'英文名称',
				field:'nameEn',
				valid:[{type:'string',min:0,max:200}],
				n:2
			},{
				idName:'text_modal_custom_nameCnS',
				text:'中文名称缩写',
				field:'nameCnS',
				valid:[{type:'string',min:0,max:50}],
				n:1
			},{
				idName:'text_modal_custom_nameEnS',
				text:'英文名称缩写',
				field:'nameEnS',
				valid:[{type:'string',min:0,max:50}],
				n:1
			},{
				idName:'text_modal_custom_addrCn',
				text:'中文地址',
				field:'addrCn',
				valid:[{type:'string',min:0,max:200}],
				n:2
			},{
				idName:'text_modal_custom_addrEn',
				text:'英文地址',
				field:'addrEn',
				valid:[{type:'string',min:0,max:200}],
				n:2
			},{
				idName:'text_modal_custom_contact1',
				text:'联系人1',
				field:'contact1',
				valid:[{type:'string',min:0,max:50}],
				n:1
			},{
				idName:'text_modal_custom_contact2',
				text:'联系人2',
				field:'contact2',
				valid:[{type:'string',min:0,max:50}],
				n:1
			},{
				idName:'text_modal_custom_telNo1',
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
				idName:'text_modal_custom_telNo2',
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
				idName:'text_modal_custom_mobileNo1',
				text:'手机号码1',
				field:'mobileNo1',
				valid:[{type:'string',min:0,max:11},{callback:{
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
				idName:'text_modal_custom_mobileNo2',
				text:'手机号码2',
				field:'mobileNo2',
				valid:[{type:'string',min:0,max:11},{callback:{
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
				idName:'text_modal_custom_faxNo1',
				text:'传真号码1',
				field:'faxNo1',
				valid:[{callback:{
					message: '请输入正确的传真号码',
		            callback: function(value, validator) {
		            		 if(/^[\d\-]*$/.test(value)||value==''){
		            			 return true;
		            		 }
		            		 return false;
		            	 }
		            
				}},{type:'string',min:0,max:50},],
				n:1
			},{
				idName:'text_modal_custom_faxNo2',
				text:'传真号码2',
				field:'faxNo2',
				valid:[{callback:{
					message: '请输入正确的传真号码',
		            callback: function(value, validator) {
		            		 if(/^[\d\-]*$/.test(value)||value==''){
		            			 return true;
		            		 }
		            		 return false;
		            	 }
		            
				}},{type:'string',min:0,max:50}],
				n:1
			},{
				idName:'text_modal_custom_email1',
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
				idName:'text_modal_custom_email2',
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
				idName:'text_modal_custom_remark',
				text:'备注',
				field:'remark',
				valid:[{type:'string',min:0,max:200}],
				n:2
			},{
				idName:'switch_modal_custom_enabled',
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

