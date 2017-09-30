

$(function(){
	//搜索条件
	var mainSearchData=[{
		idName:'text_dock_no',
		text:'道口编号',
//		comboUrl:'/base/plant/publicPlantSelect',
//		comboId:'tmBasPlantId',
//		comboText:'plant',
		field:'dockNo'
//		onClick:function(data){
//			Ew.selectLink({
//		        comboUrl:'/base/workshop/publicWorkshopSelect',
//		        comboData:JSON.stringify({tmBasPlantId:data.id}),
//		        id:['combo52','combo53'],
//		        comboId:'tmBasWorkshopId',
//		        comboText:'workshop'
//		    });
//		}
	},{
		idName:'text_dock_name',
		text:'道口名称',
//		comboUrl:'/base/plant/publicPlantSelect',
//		comboId:'tmBasPlantId',
//		comboText:'plant',
		field:'name'
//		onClick:function(data){
//			Ew.selectLink({
//		        comboUrl:'/base/workshop/publicWorkshopSelect',
//		        comboData:JSON.stringify({tmBasPlantId:data.id}),
//		        id:['combo52','combo53'],
//		        comboId:'tmBasWorkshopId',
//		        comboText:'workshop'
//		    });
//		}
//	},{
//		idName:'inputCom55',
//		text:'产品',
//		comboUrl:'/worktime/part/publicProduct',
//		comboData:
//    {
//			id:['combo51'],
//			field:['tmBasPlantId'],
//    other:{}
//    },
//		comboId:'tmBasPartId',
//		comboText:'part',
//		field:'part',
//		isSearch:true
	},{
		idName:'combo_dock_enabled',
		field:'enabled',
		text:'启用',
		comboData:[{
			id:1,
			text:'是'
		},{
			id:0,
			text:'否'
		}]
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

	Ew.search('.dockSearchClass',{
		title:'查询',
		textValues:mainSearchData,
		btnValues:[{
			btnId:'search',
			text:'搜索',
			onClick:function(data){
				console.log(data)
				$('#table1').bootstrapTable('refresh');
			}
		},{
			btnId:'clear',
			text:'重置',
			tableid:['table1']
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
	Ew.table('.dockTableClass',{
		btnValues:[{
			btnId:'add',text:'新增',onClick:function(){
				daliogShow('add')
			}
		},{
			btnId:'change',text:'编辑',otherOption:[{id:'table1',selectNum: 1}],onClick:function(){
				daliogShow('change')
			}
		},{
			btnId:'dele',text:'删除',isTrue:true,otherOption:[{id:'table1',selMinNum: 1}],onClick:function(){
				var rows = $('#table1').bootstrapTable('getSelections');
				var ids = [];
				$.each(rows,function(index,row){
					ids.push(row.tmBasDockId);
				});
				datas = JSON.stringify(ids);
				var url = '/base/basDock/deleteBatch';
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#table1').bootstrapTable('refresh');
	             });
			}
		},{
			btnId:'temdow',text:'模板下载',isTrue:true,selMinNum:1,onClick:function(){

			}
		},{
			btnId:'imp',text:'导入',isTrue:true,selMinNum:1,onClick:function(){

			}
		},{
			btnId:'exp',text:'导出',isTrue:true,selMinNum:1,onClick:function(){

			}
		}],
		tableId:'table1',
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
						d.tmBasDockId = $(this).attr('fieldValue');
						d.enabled = state?1:0;
						datas = JSON.stringify(d);
						var url = '/base/basDock/update';
						$.when(Ew.ewAjax(url,datas)).done(function(results){
							$('#table1').bootstrapTable('refresh');
			            });
					}
				});
	        },
			url:'/base/basDock/querylistByPage',
			columns:[{
				checkbox:true
			},{
				field:'dockNo',
				title:'道口编号',
				align:'center',
				sortable:true,
        		width:'120px'
			},{
				field:'name',
				title:'道口名称',
				align:'center',
				sortable:true,
        		width:'120px'
			},{
				field:'addr',
				title:'地址',
				align:'center',
				sortable:true,
        		width:'120px'
			},{
				field:'contact',
				title:'联系人',
				align:'center',
				sortable:true,
        		width:'120px'
			},{
				field:'telNo',
				title:'电话号码',
				align:'center',
				sortable:true,
        		width:'120px'
			},{
				field:'mobileNo',
				title:'手机号码',
				align:'center',
				sortable:true,
        		width:'120px'
			},{
				field:'faxNo',
				title:'传真号码',
				align:'center',
				sortable:true,
        		width:'120px'
			},{
				field:'email',
				title:'邮件地址',
				align:'center',
				sortable:true,
        		width:'120px'
			},{
				field:'remark',
				title:'备注',
				align:'center',
				sortable:true,
        		width:'120px'
			},{
				field:'enabled',
				title:'启用',
				align:'center',
        		width:'120px',
				formatter: function (value, row, index) {
	              return Ew.switchHl(value,'sw',row.tmBasDockId)
	            }
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
	var defaultTable=type=='add'?'':'table1';
	Ew.dialog('modalAddEdit',{
		title:title,
		btnValues:[{
			btnId:'btnSaveInfo',
			text:'保存',
			formid:'fromAddEdit',
			onClick:function(data){
				if(type=='change') data.tmBasDockId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tmBasDockId;
				datas = JSON.stringify(data);
				var url = (type=='add'?'/base/basDock/add':'/base/basDock/update');
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#modalAddEdit').modal('hide');
					$('#table1').bootstrapTable('refresh');
	             });
			}
		},{
			btnId:'btnCancel',
			text:'取消'
		}],
		form:{
			formId:'fromAddEdit',
			columnNum:2,
			listWidth:350,
			formList:[{
				idName:'text_modal_dock_no',
				text:'道口编号',
				field:'dockNo',
				defaultValue:type=='add'?null:$('#table1').bootstrapTable('getSelections')[0].dockNo,
				valid:['notEmpty',{type:'string',min:1,max:50},{callback:{
					message: '只能是数字、字母、_(下划线)、-(中划线)、\(斜杠)、/(反斜杠)',
		            callback: function(value, validator) {
		            		 if(/^[a-zA-Z0-9_\.\\/-]+$/.test(value)){
		            			 return true;
		            		 }
		            		 return false;
		            	 }
		            
				}}],
				disabled:type=='add'?false:true,
				n:2
			},{
				idName:'text_modal_dock_name',
				text:'道口名称',
				field:'name',
				defaultValue:type=='add'?null:$('#table1').bootstrapTable('getSelections')[0].name,
				valid:['notEmpty',{type:'string',min:1,max:50}],
				n:2
			},{
				idName:'text_modal_dock_addr',
				text:'地址',
				field:'addr',
				defaultValue:type=='add'?null:$('#table1').bootstrapTable('getSelections')[0].addr,
				valid:[{type:'string',min:0,max:50}],
				n:2
			},{
				idName:'text_modal_dock_contact',
				text:'联系人',
				field:'contact',
				defaultValue:type=='add'?null:$('#table1').bootstrapTable('getSelections')[0].contact,
				valid:[{type:'string',min:0,max:50}]
			},{
				idName:'text_modal_dock_telNo',
				text:'电话号码',
				field:'telNo',
				defaultValue:type=='add'?null:$('#table1').bootstrapTable('getSelections')[0].telNo,
				valid:[{type:'string',min:0,max:12},{callback:{
					message: '请输入正确的固定电话号码:0XX(X)-XXXXXXX(X)',
		            callback: function(value, validator) {
		            		 if(/\d{4}-\d{6,8}|\d{3}-\d{6,8}/.test(value)||value==''){
		            			 return true;
		            		 }
		            		 return false;
		            	 }
		            
				}}]
			},{
				idName:'text_modal_dock_mobileNo',
				text:'手机号码',
				field:'mobileNo',
				defaultValue:type=='add'?null:$('#table1').bootstrapTable('getSelections')[0].mobileNo,
				valid:[{type:'string',min:0,max:50},{callback:{
					message: '请输入正确的手机号码',
		            callback: function(value, validator) {
		            		 if(/^1[3|5|8]{1}[0-9]{9}$/.test(value)||value==''){
		            			 return true;
		            		 }
		            		 return false;
		            	 }
		            
				}}]
			},{
				idName:'text_modal_dock_faxNo',
				text:'传真号码',
				field:'faxNo',
				defaultValue:type=='add'?null:$('#table1').bootstrapTable('getSelections')[0].faxNo,
				valid:[{type:'string',min:0,max:12},{callback:{
					message: '请输入正确的传真号码',
		            callback: function(value, validator) {
		            		 if(/\d{4}-\d{6,8}|\d{3}-\d{6,8}/.test(value)||value==''){
		            			 return true;
		            		 }
		            		 return false;
		            	 }
		            
				}}]
			},{
				idName:'text_modal_dock_email',
				text:'邮件地址',
				field:'email',
				defaultValue:type=='add'?null:$('#table1').bootstrapTable('getSelections')[0].email,
				valid:[{type:'string',min:0,max:50},{callback:{
					message: '请输入正确的邮件地址如：123@qq.com',
		            callback: function(value, validator) {
		            		 if(/^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(value)||value==''){
		            			 return true;
		            		 }
		            		 return false;
		            	 }
		            
				}}]
			},{
				idName:'area_modal_dock_remark',
				text:'备注',
				field:'remark',
				defaultValue:type=='add'?null:$('#table1').bootstrapTable('getSelections')[0].remark,
				valid:[{type:'string',min:0,max:50}],
				n:2

			},{
				idName:'switch_modal_dock_enabled',
				text:'启用',
				field:'enabled',
				defaultValue:type=='add'?null:$('#table1').bootstrapTable('getSelections')[0].enabled,
				ontext:'启用',
				offtext:'禁用'
			}],
			defaultTable:defaultTable
		}
	})

}

