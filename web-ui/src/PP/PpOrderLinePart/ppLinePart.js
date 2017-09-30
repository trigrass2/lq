

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
			Ew.selectLink({
		        comboUrl:'/base/workshop/publicWorkshopSelect',
		        comboData:JSON.stringify({tmBasPlantId:data.id}),
		        id:['combo52'],
		        comboId:'tmBasWorkshopId',
		        comboText:'workshop'
		    });
      Ew.selectLink({
        comboUrl:'/base/line/publicLineSelect',
        comboData:JSON.stringify({tmBasPlantId:data.id}),
        id:['combo53'],
        comboId:'tmBasLineId',
        comboText:'line'
      });
		}
	},{
		idName:'combo52',
		text:'车间',
		comboUrl:'/base/workshop/publicWorkshopSelect',
		comboId:'tmBasWorkshopId',
		comboText:'workshop',
		field:'tmBasWorkshopId',
		onClick:function(data){
			Ew.selectLink({
		        comboUrl:'/base/line/publicLineSelect',
		        comboData:JSON.stringify({tmBasWorkshopId:data.id}),
		        id:['combo53'],
		        comboId:'tmBasLineId',
		        comboText:'line'
		    });
		}
	},{
		idName:'combo53',
		text:'产线',
		comboUrl:'/base/line/publicLineSelect',
		comboId:'tmBasLineId',
		comboText:'line',
		field:'tmBasLineId'
	},{
		idName:'inputCom55',
		text:'产品',
		comboUrl:'/worktime/part/publicProduct',
		comboData:
      {
			id:['combo51'],
			field:['tmBasPlantId'],
      other:{}
      },
		comboId:'tmBasPartId',
		comboText:'part',
		field:'part',
    onSuccess:function(data){
		  console.log(data)
    }
	},{
		idName:'combo54',
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
			btnId:'search',
			text:'搜索',
			onClick:function(data){
				console.log(data)
				$('#table1').bootstrapTable('refresh');
			}
		},{
			btnId:'clear',
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
			btnId:'add',text:'新增',onClick:function(){
				daliogShow('add')
			}
		},{
			btnId:'change',text:'编辑',otherOption:[{id:'table1',selectNum: 1}],onClick:function(){
				daliogShow('change')
			}
		},{
			btnId:'dele',text:'删除',isTrue:true,otherOption:[{id:'table1',selMinNum: 1},{id:'table1',noselect:[{title:'productTime',nolist:[12,1]}]}],onClick:function(){
				var rows = $('#table1').bootstrapTable('getSelections');
				var ids = [];
				$.each(rows,function(index,row){
					ids.push(row.trPpLinePartId);
				});
				datas = JSON.stringify({trPpLinePartId:ids});
				var url = '/order/ppLinePart/delete';
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
		},{
          btnId: 'add2', otherBtn:true, otherOption:[{id:'table1',selectNum: 1}] //控制子表按钮是否 可用
        },{
          btnId: 'change2', otherBtn:true,otherOption:[{id:'table1',selectNum: 1},{id:'table2',selectNum: 1}] //控制子表按钮是否 可用
        },
      {
        btnId: 'dele2', otherBtn:true,otherOption:[{id:'table1',selectNum: 1},{id:'table2',selMinNum: 1}] //控制子表按钮是否 可用
      }],
		tableId:'table1',
		tableValue:{
			searchParams:mainSearchData,
			queryParams:function(){
				return{}
			},
			onClickRow:function(item,$element){
				$('#table2').bootstrapTable('refresh',{query:{trPpLinePartId:item.trPpLinePartId}});//或者{query:{}}直接设置查询条件
			},
			onLoadSuccess:function(){
				$('.sw').bootstrapSwitch({
					onText:"启用",
					offText:"禁用",
					onColor:"success",
					offColor:"info",
					onSwitchChange:function(event,state){
						var d = {};
						d.trPpLinePartId = $(this).attr('fieldValue');
						d.enabled = state?1:0;
						datas = JSON.stringify(d);
						var url = '/order/ppLinePart/doEnabled';
						$.when(Ew.ewAjax(url,datas)).done(function(results){
							$('#table1').bootstrapTable('refresh');
			            });
					}
				});
	        },
			url:'/order/ppLinePart/querylistByPage',
			columns:[{
				checkbox:true
			},{
				field:'plant',
				title:'工厂',
				align:'center',
				sortable:true,
        width:'120px'
			},{
				field:'workshop',
				title:'车间',
				align:'center',
				sortable:true,
        width:'120px'
			},{
				field:'line',
				title:'产线',
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
				field:'productTime',
				title:'单个产品加工时间（分钟）',
				align:'center',
				sortable:true,
        width:'300px'
			},{
				field:'intervalTime',
				title:'间隔下线时间（分钟）',
				align:'center',
				sortable:true,
        width:'240px'
			},{
				field:'seq',
				title:'优先级',
				align:'center',
				sortable:true,
        width:'120px'
			},{
				field:'scrapRate',
				title:'报废率',
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
	              return Ew.switchHl(value,'sw',row.trPpLinePartId)
	            }
			}]
		}
	});
	var aa=-1;
	//子表格
	Ew.table('.demoTable2',{
		btnValues:[{
			btnId:'add2',text:'新增',otherOption:[{id:'table1',selectNum: 1}],onClick:function(){
				daliogShow2('add')
			}
		},{
			btnId:'change2',text:'编辑',otherOption:[{id:'table1',selectNum: 1},{id:'table2',selectNum: 1}],selectNum:1,onClick:function(){
				daliogShow2('change')
			}
		},{
			btnId:'dele2',text:'删除',isTrue:true,otherOption:[{id:'table2',selMinNum: 1},{id:'table1',selectNum: 1}],onClick:function(){
				var rows = $('#table2').bootstrapTable('getSelections');
				var ids = [];
				$.each(rows,function(index,row){
					ids.push(row.trPpLinePartTurnId);
				});
				datas = JSON.stringify({trPpLinePartTurnId:ids});
				var url = '/order/ppLinePartTurn/delete';
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#table2').bootstrapTable('refreshOptions',{pageNumber:1});
					$('#table2').bootstrapTable('refresh');
	            });
			}
		}],
		tableId:'table2',
		tableValue:{
			queryParams:function(){
				return {trPpLinePartId:aa};
			},
			onClickRow:function(item,$element){

			},
			url:'/order/ppLinePartTurn/querylistByPage',
			columns:[{
				checkbox:true
			},{
				field:'part',
				title:'换型产品',
				align:'center',
				sortable:true
			},{
				field:'turnTime',
				title:'换型时间（分钟）',
				align:'center',
				sortable:true
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
			btnId:'aaaa',
			text:'保存',
			formid:'demoform',
			onClick:function(data){
				if(type=='change') data.trPpLinePartId = $('#'+defaultTable).bootstrapTable('getSelections')[0].trPpLinePartId;
				datas = JSON.stringify(data);
				var url = (type=='add'?'/order/ppLinePart/add':'/order/ppLinePart/update');
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#demoadd').modal('hide');
					$('#table1').bootstrapTable('refresh');
	             });
			}
		},{
			btnId:'bbbb',
			text:'取消'
		}],
		form:{
			formId:'demoform',
			columnNum:2,
			listWidth:350,
			formList:[{
				idName:'combo11',
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
				        comboUrl:'/base/workshop/publicWorkshopSelect',
				        comboData:JSON.stringify({tmBasPlantId:data.id,enabled:1}),
				        id:['combo12','combo13','combo14'],
				        comboId:'tmBasWorkshopId',
				        comboText:'workshop'
				    });
				}
			},{
				idName:'combo12',
				text:'车间',
				comboUrl:'/base/workshop/publicWorkshopSelect',
				comboId:'tmBasWorkshopId',
				comboText:'workshop',
				field:'tmBasWorkshopId',
				valid:['notEmpty'],
				disabled:type=='add'?false:true,
				comboData:type=='add'?JSON.stringify({
					enabled:1
				}):{},
				onClick:function(data){
					Ew.selectLink({
				        comboUrl:'/base/line/publicLineSelect',
				        comboData:JSON.stringify({tmBasWorkshopId:data.id,enabled:1}),
				        id:['combo13'],
				        comboId:'tmBasLineId',
				        comboText:'line'
				    });
				}
			},{
				idName:'combo13',
				text:'产线',
				comboUrl:'/base/line/publicLineSelect',
				comboId:'tmBasLineId',
				comboText:'line',
				field:'tmBasLineId',
				valid:['notEmpty'],
				disabled:type=='add'?false:true,
				comboData:type=='add'?JSON.stringify({
					enabled:1
				}):{},
			},{
				idName:'combo14',
				text:'产品',
				comboUrl:'/worktime/part/publicProduct',
				comboData:type=='add'?{
					id:['combo11'],
					field:['tmBasPlantId'],
					other:{partType1:['S','P'],enabled:1}
				}:{},
				comboId:'tmBasPartId',
				comboText:'part',
				field:'tmBasPartId',
				valid:['notEmpty'],
				disabled:type=='add'?false:true,
				isSearch:type=='add'?true:false
			},{
				idName:'number15',
				text:'单个产品加工时间（分钟）',
				field:'productTime',
				valid:['notEmpty','number']
			},{
				idName:'number16',
				text:'间隔下线时间（分钟）',
				field:'intervalTime',
				valid:['notEmpty']
			},{
				idName:'number11',
				text:'优先级',
				field:'seq'
			},{
				idName:'number17',
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
				n:2
			},{
				idName:'switch11',
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
			btnId:'aaaa',
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
			btnId:'bbbb',
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
					id:['combo21'],
					field:['tmBasPlantId'],
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
