

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
		text:'组合零件',
		comboUrl:'/plantlayout/basGroupParts/queryPartGroupSuggestAll',
		comboId:'tmBasPartgroupId',
		comboText:'partgroup',
		field:'partgroup',
		comboData:{
			id:['combo51'],
			field:['tmBasPlantId']
		},
		onClick:function(data){
			$('#inputCom53').val('');
		}
	},{

		idName:'inputCom53',
		text:'零件',
		comboUrl:'/worktime/part/queryPartPartGroupSuggest',
		comboData:
			{
			id:['combo51','inputCom52'],
			field:['tmBasPlantId','partgroup'],
			other:{}
			},
		comboId:'tmBasPartId',
		comboText:'part',
		field:'partgroupPart',
		onClick:function(data){
 			$('#inputCom54').val('');
		},
		onSuccess:function(data){
			console.log(data)
		}


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

	Ew.search('.demoSearch',{
		title:'查询',
		textValues:mainSearchData,
		btnValues:[{
			btnId:'btnSearch',
			text:'搜索',
			onClick:function(data){
				console.log(data)
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

	//主表格
	Ew.getDictVal([''], function (re) {
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
					var tmBasPartgroupIds = [];
					$.each(rows,function(index,row){
						tmBasPartgroupIds.push(row.tmBasPartgroupId);
					});
					datas =JSON.stringify({tmBasPartgroupId:tmBasPartgroupIds});
					var url = '/plantlayout/basGroupParts/delete';
					$.when(Ew.ewAjax(url,datas)).done(function(results){
						$('#table1').bootstrapTable('refreshOptions',{pageNumber:1});
		             });
				}
			},{
				btnId:'btnDownload',text:'模板下载',isTrue:true,selMinNum:1,onClick:function(){
					var  url = '/plantlayout/basGroupParts/down';
	           		window.top.location.href = Ew.apiUrl +url;
				}
			},{
				btnId:'btnImport',text:'导入',isTrue:true,selMinNum:1,url:'/plantlayout/basGroupParts/import',tableId:'table1'
			},{
				btnId:'btnExport',text:'导出',onClick:function(){
					var tmBasPlantId = $('#combo51').val();
					var partgroup = $('#inputCom52').val();
					var partgroupPart = $('#inputCom53').val();
	
	          		window.top.location.href= apiUrl +'/plantlayout/basGroupParts/export?tmBasPlantId='+tmBasPlantId+'&partgroup='+partgroup+'&partgroupPart='+partgroupPart;
				}
			},{
	          btnId: 'btnAddSub', otherBtn:true, otherOption:[{id:'table1',selectNum: 1}] //控制子表按钮是否 可用
	        },{
	          btnId: 'btnEditSub', otherBtn:true,otherOption:[{id:'table1',selectNum: 1},{id:'table2',selectNum: 1}] //控制子表按钮是否 可用
	        },{
	          btnId: 'btnDeleteSub', otherBtn:true,otherOption:[{id:'table1',selectNum: 1},{id:'table2',selectNum: 1}] //控制子表按钮是否 可用
	        }],
			tableId:'table1',
			tableValue:{
				searchParams:mainSearchData,
				queryParams:function(){
					return{}
				},
				onClickRow:function(item,$element){
					$('#table2').bootstrapTable('refresh',{query:{tmBasPartgroupId:item.tmBasPartgroupId}});//或者{query:{}}直接设置查询条件
				},
				onLoadSuccess:function(){
					$('.sw').bootstrapSwitch({
						onText:"启用",
						offText:"禁用",
						onColor:"success",
						offColor:"info",
						onSwitchChange:function(event,state){
							var d = {};
							d.tmBasPartgroupId = $(this).attr('fieldValue');
							d.enabled = state?1:0;
							datas = JSON.stringify(d);
							var url = "/plantlayout/basGroupParts/update";
							$.when(Ew.ewAjax(url,datas)).done(function(results){
								$('#table1').bootstrapTable('refresh');
				            });
						}
					});
		        },
				url:'/plantlayout/basGroupParts/querylistByPage',
				columns:[{
					checkbox:true
				},{
					field:'plant',
					title:'工厂',
					align:'center',
					sortable:true,
	        width:'120px'
				},{
					 field: 'partgroupNo',
				        title: '编号',
				        align: 'center',
					sortable:true,
	        width:'120px'
				},{
					field: 'name',
			        title: '组合零件名称',
			        align: 'center',
					sortable:true,
	        width:'120px'
				},{
					field:'enabled',
					title:'启用',
					align:'center',
	        width:'120px',
					formatter: function (value, row, index) {
		              return Ew.switchHl(value,'sw',row.tmBasPartgroupId)
		            }
				},{
					field: 'remark',
			        title: '备注',
			        align: 'center',
					sortable:true,
	       			width:'120px'
				}]
			}
		});
		
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
				btnId:'btnDeleteSub',text:'删除',isTrue:true,otherOption:[{id:'table2',selMinNum: 1}],onClick:function(){
					var rows = $('#table2').bootstrapTable('getSelections');
					var ids = [];
					$.each(rows,function(index,row){
						ids.push(row.tmBasPartgroupPartId);
					});
					datas = JSON.stringify({tmBasPartgroupPartId:ids});
					var url = '/plantlayout/basPartgroupPart/deleteParts';
					$.when(Ew.ewAjax(url,datas)).done(function(results){
						$('#table2').bootstrapTable('refreshOptions',{pageNumber:1});
						$('#table2').bootstrapTable('refresh');
		            });
				}
			}],
			tableId:'table2',
			tableValue:{
				queryParams:function(){
					var	ttId =	$('#table1').bootstrapTable('getSelections')[0]?$('#table1').bootstrapTable('getSelections')[0].tmBasPartgroupId:-1;
					var tpId = ttId?ttId:-1;
					return {tmBasPartgroupId:tpId};
				},
				onClickRow:function(item,$element){
	
				},
				url:'/plantlayout/basPartgroupPart/queryPartslistByPage',
				columns:[{
					checkbox:true
				},{
					field: 'partNo',
			        title: '零件编码',
			        align: 'center',
					sortable:true
				},{
					field: 'nameCn',
			        title: '零件名称',
			        align: 'center',
					sortable:true
				},{
					field: 'qty',
			        title: '数量',
			        align: 'center',
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
	Ew.dialog('demoadd',{
		title:title,
		btnValues:[{
			btnId:'btnSave',
			text:'保存',
			formid:'demoform',
			onClick:function(data){
				if(type=='change') data.tmBasPartgroupId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tmBasPartgroupId;
				datas = JSON.stringify(data);
				var url = (type=='add'?"/plantlayout/basGroupParts/add":"/plantlayout/basGroupParts/update");
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
			listWidth:400,
			formList:[{
				idName:'comboPlantI',
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
				n:2
			},{
				idName:'textPartgroupNoI',
				text:'编号',
				field:'partgroupNo',
				disabled:type=='add'?false:true,
				valid:['notEmpty',{callback:{
					message: '只能是数字、字母、_(下划线)、-(中划线)、\(斜杠)、/(反斜杠)',
		            callback: function(value, validator) {
		            		 if(/^[a-zA-Z0-9_\.\\/-]+$/.test(value)){
		            			 return true;
		            		 }
		            		 return false;
		            	 }
		            
				}}]
			},{
				idName:'textPartgroupNameI',
				text:'名称',
				field:'name',
				valid:['notEmpty'],
			},{
				idName:'area18',
				text:'备注',
				field:'remark',
				valid:[''],
				n:2
			},{
				idName:'switch11',
				text:'启用',
				field:'enabled',
				ontext:'启用',
				offtext:'禁用'
			},{
	        	idName:'text311',
				text:'版本号',
				field:'version',
				hidden:true
			}
			],
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
				data.tmBasPartgroupId = $('#table1').bootstrapTable('getSelections')[0].tmBasPartgroupId ;
				if(type=='change') data.tmBasPartgroupPartId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tmBasPartgroupPartId;
				datas = JSON.stringify(data);
				var url = (type=='add'?"/plantlayout/basPartgroupPart/addParts":"/plantlayout/basPartgroupPart/updateParts");
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#demoadd').modal('hide');
					/*$('#table2').bootstrapTable('refresh');*/
					$('#table2').bootstrapTable('refresh',{query:{tmBasPartgroupId:data.tmBasPartgroupId}});//或者{query:{}}直接设置查询条件
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
				idName:'comboPlantII',
				text:'工厂',
				comboUrl:'/base/plant/publicPlantSelect',
				comboId:'tmBasPlantId',
				comboText:'plant',
				field:'tmBasPlantId',
				valid:['notEmpty'],
				defaultValue:$('#table1').bootstrapTable('getSelections')[0].tmBasPlantId,
				disabled:true
			},{
				idName:'textPartgroupNoII',
				text:'组合零件',
				field:'partgroupNo',
				valid:['notEmpty'],
				defaultValue:$('#table1').bootstrapTable('getSelections')[0].partgroup,
				disabled:true
			},{
				idName:'comboPartII',
				text:'零件',
				comboUrl:'/worktime/part/publicProduct',
				comboData:type=='add'?{
					id:['comboPlantII'],
					field:['tmBasPlantId'],
					other:{enabled:1}
				}:{},
				comboId:'tmBasPartId',
				comboText:'part',
				field:'tmBasPartId',
				valid:['notEmpty'],
				disabled:type=='add'?false:false,
				isSearch:type=='add'?true:false
			},{
				idName:'number12',
				text:'数量',
				field:'qty',
				type:'decimals',
				valid:['notEmpty',{min:0,max:1000}]
			},{
	        	idName:'text312',
				text:'版本号',
				field:'version',
				hidden:true
			}],
			defaultTable:defaultTable
		}
	})

}
