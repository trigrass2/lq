

$(function(){
	//搜索条件
	var mainSearchData=[{
		idName:'combo_partSetting_plant',
		text:'工厂',
		comboUrl:'/base/plant/publicPlantSelect',
		comboId:'tmBasPlantId',
		comboText:'plant',
		field:'tmBasPlantId',
		comboData:JSON.stringify({
//			enabled:1
		}),
		onClick:function(data){
			Ew.selectLink({
		        comboUrl:'/worktime/part/publicProduct',
		        comboData:{
					id:['combo_partSetting_plant'],
					field:['tmBasPlantId'],
					other:{partType1:['P','S']}
				},
		        id:['inputCompartSetting'],
		        comboId:'tmBasPartId',
		        comboText:'part'
		    });
	    }
	},{
		idName:'inputCompartSetting',
		text:'产品',
		field:'part',
		comboUrl:'/worktime/part/publicProduct',
		comboData:{
			id:['combo_partSetting_plant'],
			field:['tmBasPlantId'],
			other:{partType1:['P','S']}
		},
		comboId:'tmBasPartId',
		comboText:'part',
		isSearch:true
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

	Ew.search('.partSettingSearch',{
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
	Ew.getDictVal(['ORDER_TYPE'], function (re) {
		//主表格
		Ew.table('.partSettingTableClass',{
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
						ids.push(row.tmPpPartSettingId);
					});
					datas = JSON.stringify({tmPpPartSettingId:ids});
					var url = '/order/ppPartSetting/delete';
					$.when(Ew.ewAjax(url,datas)).done(function(results){
						$('#table1').bootstrapTable('refresh');
		             });
				}
			},{
	          btnId: 'btnAddSub', otherBtn:true, otherOption:[{id:'table1',selectNum: 1}] //控制子表按钮是否 可用
	        },{
	          btnId: 'btnEditSub', otherBtn:true,otherOption:[{id:'table1',selectNum: 1},{id:'table2',selectNum: 1}] //控制子表按钮是否 可用
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
					$('.sw').bootstrapSwitch({
						onText:"启用",
						offText:"禁用",
						onColor:"success",
						offColor:"info",
						onSwitchChange:function(event,state){
							var d = {};
							d.tmPpPartSettingId = $(this).attr('fieldValue');
							d.enabled = state?1:0;
							datas = JSON.stringify(d);
							var url = '/order/ppPartSetting/update';
							$.when(Ew.ewAjax(url,datas)).done(function(results){
								$('#table1').bootstrapTable('refresh');
				            });
						}
					});
		        },
				url:'/order/ppPartSetting/querylistByPage',
				columns:[{
					checkbox:true
				},{
					field:'plant',
					title:'工厂',
					align:'center',
					sortable:true,
	        		width:'120px'
				},{
					field:'part',
					title:'产品',
					align:'center',
					sortable:true,
	        		width:'120px'
				},{
					field:'orderType',
					title:'订单类型',
					align:'center',
					sortable:true,
					width:'120px',
					formatter: function (value, row, index) {
						return re.ORDER_TYPE[value]
					}
				},{
					field:'barcode',
					title:'条码模板',
					align:'center',
					sortable:true,
	        		width:'120px'
				},{
					field:'bufferQty',
					title:'撤排缓冲数量',
					align:'center',
					sortable:true,
	        		width:'100px'
				},{
					field:'enabled',
					title:'启用',
					align:'center',
	        		width:'120px',
					formatter: function (value, row, index) {
		              return Ew.switchHl(value,'sw',row.tmPpPartSettingId)
		            }
				}]
			}
		});
	})
	
	Ew.getDictVal(['CODE_SECTION_TYPE','CODE_FILL_TYPE','CODE_CUT_TYPE','CODE_SEQ_TYPE','CODE_DATE_TYPE'], function (re) {
		//子表格
		Ew.table('.partSettingPartTableClass',{
			btnValues:[],
			tableId:'table2',
			tableValue:{
				queryParams:function(){
					var id = $('#table1').bootstrapTable('getSelections')[0]?$('#table1').bootstrapTable('getSelections')[0].tsSysBarcodeId:-1;				
					return {tsSysBarcodeId:id};
				},
				onClickRow:function(item,$element){
	
				},
//				url:'/systemconfig/sysBarcode/queryDetailListByPage',
				url:'/systemconfig/sysBarcodeDetail/querylistByPage',
				columns:[{
					checkbox:true
				},{
					field:'sectionSeq',
					title:'分段序号',
					align:'center',
					sortable:true
				},{
					field:'sectionBit',
					title:'位数',
					align:'center',
					sortable:true
				},{
					field:'sectionType',
					title:'类型',
					align:'center',
					sortable:true,
					formatter: function (value, row, index) {
		                return re.CODE_SECTION_TYPE[value];
		            },
					width:'100px'
				},{
					field:'tableNoAndName',
					title:'表名',
					align:'center',
					sortable:true
				},{
					field:'columnNoAndName',
					title:'字段名',
					align:'center',
					sortable:true
				},{
					field:'seqType',
					title:'流水号类型',
					align:'center',
					sortable:true,
					formatter: function (value, row, index) {
		                return re.CODE_SEQ_TYPE[value];
		            },
					width:'100px'
				},{
					field:'startNum',
					title:'流水号起始值',
					align:'center',
					sortable:true
				},{
					field:'stepNum',
					title:'流水号增量值',
					align:'center',
					sortable:true
				},{
					field:'dateType',
					title:'日期类型',
					align:'center',
					sortable:true,
					formatter: function (value, row, index) {
		                return re.CODE_DATE_TYPE[value];
		            },
					width:'100px'
				},{
					field:'fillType',
					title:'补位方式',
					align:'center',
					sortable:true,
					formatter: function (value, row, index) {
		                return re.CODE_FILL_TYPE[value];
		            },
					width:'100px'
				},{
					field:'fillNo',
					title:'补位字符',
					align:'center',
					sortable:true
				},{
					field:'cutType',
					title:'截取方式',
					align:'center',
					sortable:true,
					formatter: function (value, row, index) {
		                return re.CODE_CUT_TYPE[value];
		            },
					width:'100px'
				},{
					field:'detailRemark',
					title:'备注',
					align:'center',
					sortable:true
				}]
			}
		});
	})
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
			btnId:'btnSave',
			text:'保存',
			formid:'formAddEdit',
			onClick:function(data){
				if(type=='change') data.tmPpPartSettingId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tmPpPartSettingId;
				datas = JSON.stringify(data);
				var url = (type=='add'?'/order/ppPartSetting/add':'/order/ppPartSetting/update');
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
			formId:'formAddEdit',
			columnNum:2,
			listWidth:350,
			formList:[{
				idName:'combo_modal_partSetting_plant',
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
					Ew.selectLink({
				        comboUrl:'/worktime/part/publicProduct',
				        comboData:{
							id:['combo_modal_partSetting_plant'],
							field:['tmBasPlantId'],
							other:{partType1:['P','S'],enabled:1}
		      			},
				        id:['combo_modal_partSetting_pro'],
				        comboId:'tmBasPartId',
				        comboText:'part'
				    });
			    }
			},{
				idName:'combo_orderType',
				text:'订单类型',
				field:'orderType',
				valid:['notEmpty'],
				comboUrl:'/system/codeList/getSelect',
				comboData:'ORDER_TYPE',
				comboId:'no',
				comboText:'name'
			},{
				idName:'combo_modal_partSetting_pro',
				text:'产品',
				comboUrl:'/worktime/part/publicProduct',
				comboData:{
					id:['combo_modal_partSetting_plant'],
					field:['tmBasPlantId'],
					other:{partType1:['P','S'],enabled:1}
      			},
				comboId:'tmBasPartId',
				comboText:'part',
				clearBoth:true,
				valid:['notEmpty'],
				disabled:type=='add'?false:true,
				field:'tmBasPartId',
				isSearch:type=='add'?true:false
			},{
				idName:'combo_modal_partSetting_barcode',
				text:'条码模板',
				comboUrl:'/systemconfig/sysBarcode/queryBarcodeSelect',
				comboId:'tsSysBarcodeId',
				comboText:'barcode',
				field:'tsSysBarcodeId',
				valid:['notEmpty']
			},{
				idName:'number_modal_partSetting_bufferQty',
				text:'撤排缓冲数量',
				field:'bufferQty',
				valid:[{type:"number",min:0,max:100}]
			},{
				idName:'switchEnabled',
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
function daliogShow2(type){
	var title=type=='add'?'新增':'编辑';
	var defaultTable=type=='add'?'':'table2';
	Ew.dialog('demoadd',{
		title:title,
		btnValues:[{
			btnId:'btnSaveSub',
			text:'保存',
			formid:'demoform',
			onClick:function(data){
				data.trPpLinePartId = $('#table1').bootstrapTable('getSelections')[0].trPpLinePartId ;
				if(type=='change') data.trPpLinePartTurnId = $('#'+defaultTable).bootstrapTable('getSelections')[0].trPpLinePartTurnId;
				datas = JSON.stringify(data);
				var url = (type=='add'?'/order/ppLinePartTurn/add':'/order/ppLinePartTurn/update');
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
				idName:'combo21',
				text:'工厂',
				comboUrl:'/base/plant/publicPlantSelect',
				comboId:'tmBasPlantId',
				comboText:'plant',
				field:'tmBasPlantId',
				valid:[''],
				defaultValue:$('#table1').bootstrapTable('getSelections')[0].tmBasPlantId,
				disabled:true
			},{
				idName:'combo22',
				text:'车间',
				comboUrl:'/base/workshop/publicWorkshopSelect',
				comboId:'tmBasWorkshopId',
				comboText:'workshop',
				field:'tmBasWorkshopId',
				valid:[''],
				defaultValue:$('#table1').bootstrapTable('getSelections')[0].tmBasWorkshopId,
				disabled:true
			},{
				idName:'combo23',
				text:'产线',
				comboUrl:'/base/line/publicLineSelect',
				comboId:'tmBasLineId',
				comboText:'line',
				field:'tmBasLineId',
				valid:[''],
				defaultValue:$('#table1').bootstrapTable('getSelections')[0].tmBasLineId,
				disabled:true
			},{
				idName:'combo24',
				text:'换型产品',
				comboUrl:'/worktime/part/publicProduct',
				comboData:type=='add'?{
					id:'combo21',
					field:'tmBasPlantId',
					other:{partType1:['S','P'],enabled:1}
				}:{},
				comboId:'tmBasPartId',
				comboText:'part',
				field:'tmBasPartId',
				valid:['notEmpty'],
				disabled:type=='add'?false:true,
				isSearch:type=='add'?true:false
			},{
				idName:'text25',
				text:'换型时间(分钟）',
				field:'turnTime',
				valid:['notEmpty','number']
			}],
			defaultTable:defaultTable
		}
	})

}
