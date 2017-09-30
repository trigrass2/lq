

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
			$('#comboRoute').select2('val',['']);
            $('#comboProduct').select2('val',['']);
		}
	},{
		idName:'comboRoute',
		text:'工艺路径',
		comboUrl:'/base/route/queryRoute',
		comboData:
      {
			id:['comboPlant'],
			field:['tmBasPlantId'],
			other:{}
      },
		comboId:'tmBasRouteId',
		comboText:'route',
		field:'tmBasRouteId',
		isSearch : true,
		onSuccess:function(data){
		  console.log(data)
		},
		onClick:function(data){
            $('#comboProduct').val('');
    		Ew.selectLink({
				comboUrl:'/worktime/part/routeProduct',
				comboData:JSON.stringify({partType1:['S','P'],enabled:1,tmBasPlantId:$('#comboPlant').val(),tmBasRouteId:$('#comboRoute').val()}),
		        id:['comboProduct'],
				comboId:'tmBasPartId',
				comboText:'part'
		    });
		}
	},{
		idName:'comboProduct',
		text:'产品',
		comboUrl:'/worktime/part/routeProduct',
		comboData:JSON.stringify({partType1:['S','P'],enabled:1,tmBasPlantId:$('#comboPlant').val(),tmBasRouteId:$('#comboRoute').val()}),
		comboId:'tmBasPartId',
		comboText:'part',
		field:'tmBasPartId'
	},{
		idName:'comboEnabled',
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
				$('#table1').bootstrapTable('refresh');
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
	Ew.table('.demoTable',{
		btnValues:[{
			btnId:'btnAdd',text:'新增',onClick:function(){
				$('#comboPlantI').val('');
				$('#comboRouteI').val('');
				daliogShow('add')
			}
		},{
			btnId:'btnEdit',text:'编辑',otherOption:[{id:'table1',selectNum: 1}],onClick:function(){
				$('#comboPlantI').val('');
				$('#comboRouteI').val('');
				$('#comboProductI').val('');
				daliogShow('change')
			}
		},{
			btnId:'btnDelete',text:'删除',isTrue:true,otherOption:[{id:'table1',selMinNum: 1}],onClick:function(){
				var rows = $('#table1').bootstrapTable('getSelections');
				var ids = [];
				$.each(rows,function(index,row){
					ids.push(row.trPpRoutePartId);					
				});
				datas =JSON.stringify({trPpRoutePartId:ids});
				var url = '/order/ppRoutePart/delete';
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#table1').bootstrapTable('refresh');
	             });
			}
		},{
			btnId:'btnDownload',text:'模板下载',isTrue:true,selMinNum:1,onClick:function(){
				var  url = '/order/ppRoutePart/exportTpl';
           		window.top.location.href = Ew.apiUrl +url;
			}
		},{
			btnId:'btnImport',text:'导入',selMinNum:1,url:'/order/ppRoutePart/import',onClick:function(){

			}
		},{
			btnId:'btnExport',text:'导出',isTrue:true,selMinNum:1,onClick:function(){
				var tmBasPlantId = $('#comboPlant').val();
				var tmBasRouteId = $('#comboRoute').val();
				var tmBasPartId = $('#comboProduct').val();
				var enabled = $('#comboEnabled').val();
				window.top.location.href= apiUrl +'/order/ppRoutePart/export?tmBasPlantId='+tmBasPlantId+'&tmBasRouteId='+tmBasRouteId+'&tmBasPartId='+tmBasPartId+'&enabled='+enabled;
			}
		},{
          btnId: 'btnAddSub', otherBtn:true, otherOption:[{id:'table1',selectNum: 1}] //控制子表按钮是否 可用
        },{
          btnId: 'btnEditSub', otherBtn:true,otherOption:[{id:'table1',selectNum: 1},{id:'table2',selectNum: 1}] //控制子表按钮是否 可用
        },{
            btnId: 'btnDeleteSub', otherBtn:true,otherOption:[{id:'table1',selectNum: 1},{id:'table2',selMinNum: 1}] //控制子表按钮是否 可用
        }
],
		tableId:'table1',
		tableValue:{
			searchParams:mainSearchData,
			queryParams:function(){
				return{}
			},
			onClickRow:function(item,$element){
				$('#table2').bootstrapTable('refresh',{query:{trPpRoutePartId:item.trPpRoutePartId}});//或者{query:{}}直接设置查询条件
			},
			onLoadSuccess:function(){
				$('.sw').bootstrapSwitch({
					onText:"启用",
					offText:"禁用",
					onColor:"success",
					offColor:"info",
					onSwitchChange:function(event,state){
						var d = {};
						d.tmBasBomId = $(this).attr('fieldValue');
						d.enabled = state?1:0;
						datas = JSON.stringify(d);
						var url = "/base/bom/update";
						$.when(Ew.ewAjax(url,datas)).done(function(results){
							$('#table1').bootstrapTable('refresh');
			            });
					}
				});
	        },
			url:'/order/ppRoutePart/querylistByPage',
			columns:[{
				checkbox:true
			},{
		        field:'trPpRoutePartId',
				width:'0px'
			},{
		        field: 'plant',
		        title: '工厂',
		        align: 'center',
				sortable:true,
				width:'120px'
			},{
		        field: 'route',
		        title: '工艺路径',
		        align: 'center',
				sortable:true,
				width:'120px'
			},{
		        field: 'part',
		        title: '产品',
		        align: 'center',
				sortable:true,
				width:'120px'
			},{
		        field: 'seq',
		        title: '优先级',
		        align: 'center',
				sortable:true,
				width:'120px'
			}, {
		        field: 'prepareTime',
		        title: '准备时间(分钟)',
		        align: 'center',
		        sortable:true,
				width:'120px'
		    }, {
		        field: 'productTime',
		        title: '单个产品加工时间(分钟)',
		        align: 'center',
		        sortable:true, 
				width:'120px'
		    }, {
		        field: 'intervalTime',
		        title: '间隔下线时间(分钟)',
		        align: 'center',
		        sortable:true,
				width:'120px'
		    }, {
		        field: 'scrapRate',
		        title: '报废率',
		        align: 'center',
		        sortable:true,
				width:'120px'
		    } , {
		        field: 'remark',
		        title: '备注',
		        align: 'center',
		        sortable:true,
				width:'120px'
		    },{
				field:'enabled',
				title:'启用',
				align:'center',
				width:'120px',
				formatter: function (value, row, index) {
	              return Ew.switchHl(value,'sw',row.trPpLinePartId)
	            }
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
			btnId:'btnDeleteSub',text:'删除',isTrue:true,otherOption:[{id:'table2',selMinNum: 1},{id:'table1',selectNum: 1}],onClick:function(){
				var rows = $('#table2').bootstrapTable('getSelections');
				var ids = [];
				$.each(rows,function(index,row){
					ids.push(row.trPpRoutePartTurnId);
				});
				datas = JSON.stringify({trPpRoutePartTurnId:ids});
				var url = '/order/ppRoutePartTurn/delete';
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					var rows = $('#table1').bootstrapTable('getSelections');
					$('#table2').bootstrapTable('refresh',{query:{trPpRoutePartId:rows[0].trPpRoutePartId,pageNumber:1}});
					//$('#table2').bootstrapTable('refreshOptions',{tmBasBomId:rows[0].tmBasBomId,pageNumber:1});
	            });
			}
		}],
		tableId:'table2',
		tableValue:{
			queryParams:function(){
				return {trPpRoutePartId:-1};
			},
			onClickRow:function(item,$element){

			},
			url:'/order/ppRoutePartTurn/querylistByPage',
			columns:[{
				checkbox:true
			}, {
		        field: 'part',
		        title: '换型产品',
		        align: 'center',
		        sortable:true,
				width:'120px'
		    }, {
		        field: 'turnTime',
		        title: '换型时间(分钟)',
		        align: 'center',
		        sortable:true,
				width:'120px'
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
	Ew.dialog('demoadd',{
		title:title,
		btnValues:[{
			btnId:'btnSave',
			text:'保存',
			formid:'demoform',
			onClick:function(data){
				if(type=='change') data.trPpRoutePartId = $('#'+defaultTable).bootstrapTable('getSelections')[0].trPpRoutePartId;
				datas = JSON.stringify(data);
				var url = (type=='add'?"/order/ppRoutePart/add":"/order/ppRoutePart/update");
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
				onClick:function(data){
					$('#comboRouteI').select2('val',['']);
					$('#comboProductI').select2('val',['']);
				}
			},{
				idName:'comboRouteI',
				text:'工艺路径',
				comboUrl:'/base/route/queryRoute',
				comboData:
		       {
					id:['comboPlantI'],
					field:['tmBasPlantId'],
					other:{routeStatus: 'P'}
		       },
				comboId:'tmBasRouteId',
				comboText:'route',
				field:'tmBasRouteId',
				valid:['notEmpty'],
				disabled:type=='add'?false:true,
				isSearch:type=='add'?true:false,
				onSuccess:function(data){
				  console.log(data)
				},
				onClick:function(data){
					$('#comboProductI').select2('val',['']);
					Ew.selectLink({
						comboUrl:'/worktime/part/routeProduct',
						comboData:JSON.stringify({partType1:['S','P'],enabled:1,tmBasPlantId:$('#comboPlantI').val(),tmBasRouteId:$('#comboRouteI').val()}),
				        id:['comboProductI'],
						comboId:'tmBasPartId',
						comboText:'part'
				    });
				}
			},{
				idName:'comboProductI',
				text:'产品',
				comboUrl:'/worktime/part/routeProduct',
				comboData:JSON.stringify({partType1:['S','P'],enabled:1,tmBasPlantId:$('#comboPlantI').val(),tmBasRouteId:$('#comboRouteI').val()}),
				comboId:'tmBasPartId',
				comboText:'part',
				field:'tmBasPartId',
				valid:['notEmpty'],
				disabled:type=='add'?false:true
			},{
				idName:'number9',
				text:'优先级',
				field:'seq',
				valid:[{type:'number',min:-1,max:1000}]
			},{
				idName:'number10',
				text:'准备时间(分钟)',
				field:'prepareTime',
				valid:[{type:'number',min:-1,max:1000}]
			},{
				idName:'number11',
				text:'单个产品加工时间(分钟)',
				field:'productTime',
				valid:['notEmpty',{type:'number',min:-1,max:1000}]
			},{
				idName:'number12',
				text:'间隔下线时间(分钟)',
				field:'intervalTime',
				valid:['notEmpty',{type:'number',min:-1,max:1000}]
			},{
				idName:'text13',
				text:'报废率',
				field:'scrapRate',
				valid:[{callback:{
					message: '报废率为0到1的两位小数',
		            callback: function(value, validator) {
		            	if(value==null || value=='') return true;
		            	 if(value>=0 && value<=1){
		            		 if(/^\d+(\.\d{1,2})?$/.test(value)){
		            			 return true;
		            		 }
		            		 return false;
		            	 }else{
		            		 return false;
		            	 }
		            }
				}}]	
			},{
				idName:'area18',
				text:'备注',
				field:'remark',
				valid:[''],
				valid:[{type:'string',min:0,max:100}],
				n:1
			},{
				idName:'switch11',
				text:'启用',
				field:'enabled',
				ontext:'启用',
				offtext:'禁用',
				defaultValue:1
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
			formid:'demoform2',
			onClick:function(data){
				data.trPpRoutePartId = $('#table1').bootstrapTable('getSelections')[0].trPpRoutePartId ;
				if(type=='change') data.trPpRoutePartTurnId = $('#table2').bootstrapTable('getSelections')[0].trPpRoutePartTurnId;
				datas = JSON.stringify(data);
				var url = (type=='add'?"/order/ppRoutePartTurn/add":"/order/ppRoutePartTurn/update");
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#demoadd').modal('hide');
					var rows = $('#table1').bootstrapTable('getSelections');
					$('#table2').bootstrapTable('refresh',{query:{trPpRoutePartId:rows[0].trPpRoutePartId,pageNumber:1}});
	             });
			}
		},{
			btnId:'btnCancelSub',
			text:'取消'
		}],
		form:{
			formId:'demoform2',
			columnNum:2,
			listWidth:280,
			formList:[{
				idName:'comboPlantII',
				text:'工厂',
				comboUrl:'/base/plant/publicPlantSelect',
				comboId:'tmBasPlantId',
				comboText:'plant',
				field:'tmBasPlantId',
				defaultValue:$('#table1').bootstrapTable('getSelections')[0].tmBasPlantId,
				disabled:true,
				comboData:{}
			},{
				idName:'comboRouteII',
				text:'工艺路径',
				comboUrl:'/base/route/queryRoute',
				comboId:'tmBasRouteId',
				comboText:'route',
				field:'tmBasRouteId',
				defaultValue:$('#table1').bootstrapTable('getSelections')[0].tmBasRouteId,
				disabled:true,
				comboData:{}
			},{
				idName:'textProductII',
				text:'产品',
				field:'tmBasPartId',
				defaultValue:$('#table1').bootstrapTable('getSelections')[0].part,
				disabled:true
			},{
				idName:'comboProductII',
				text:'换型产品',
				comboUrl:'/worktime/part/routeProduct',
				comboData:JSON.stringify({trPpRoutePartId:$('#table1').bootstrapTable('getSelections')[0].trPpRoutePartId,partType1:['S','P'],enabled:1,tmBasPlantId:$('#table1').bootstrapTable('getSelections')[0].tmBasPlantId,tmBasRouteId:$('#table1').bootstrapTable('getSelections')[0].tmBasRouteId,tmBasPartId:$('#table1').bootstrapTable('getSelections')[0].tmBasPartId}),
				comboId:'tmBasPartId',
				comboText:'part',
				field:'tmBasPartId',
				valid:['notEmpty'],
				disabled:type=='add'?false:true
			},{
				idName:'numberTurnTime',
				text:'换型时间(分钟)',
				field:'turnTime',
				valid:['notEmpty',{type:'number',min:-1,max:1000}]
			}],
			defaultTable:defaultTable
		}
	})

}
