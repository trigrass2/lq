
$(function(){
	//搜索条件
	var mainSearchData=[{
		idName:'combo30',
		text:'工厂',
		comboUrl:'/base/plant/publicPlantSelect',
		comboId:'tmBasPlantId',
		comboText:'plant',
		field:'tmBasPlantId',
		onClick:function(data){
       $('#inputCom30').val('');
		}
	},{
    idName:'inputCom30',
		text:'产品',
		comboUrl:'/worktime/part/queryPartSuggest',
		comboData:
      {
			id:['combo30'],
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
    idName:'combo32',
		field:'orderType',
		text:'类型',
		comboUrl:'/system/codeList/getSelect',
		comboData:'ORDER_TYPE',
		comboId:'no',
		comboText:'name'
	},{
    idName:'combo33',
		field:'orderStatus',
		text:'订单状态',
		comboUrl:'/system/codeList/getSelect',
		comboData:'ORDER_STATUS',
		comboId:'no',
		comboText:'name'
	},{
    idName:'text30',
		text:'订单编号',
		field:'orderNo'
	},{
		idName: 'day30',
		text: '预计上线日期从',
		field: 'planStartDate',
		format:'fulldate',
		limit:{date:'day31',type:'setStartDate'}
	},{
		idName: 'day31',
		text: '预计上线日期到',
		field: 'planEndDate',
		format:'fulldate',
		limit:{date:'day30',type:'setEndDate'}
	}
];
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
    listWidth:'272px',
		formLeft:'-40px',
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
Ew.getDictVal(['ORDER_TYPE', 'ORDER_STATUS', 'YESORNO', 'ORDER_BOM_TYPE','BASE_UNIT'], function (re) {
	//主表格
	Ew.table('.demoTable',{
		btnValues:[{
      btnId:'btnProduct',text:'生成备料单',otherOption:[{id:'table1',selectNum: 1}],onClick:function(){
 			}
		},{
      btnId:'btnMerge',text:'合并备料',isTrue:true,otherOption:[{id:'table1',selMinNum: 1}],onClick:function(){

 			}
		},{
			btnId:'btnBom',text:'匹配BOM',isTrue:true,otherOption:[{id:'table1',selMinNum: 1}],onClick:function(){
        var rows = $('#table1').bootstrapTable('getSelections');
        var row = rows[0];
        if (rows.length < 1) {
          layer.msg("没有选择的数据！")
            return;
        }
				var ids = [];
				$.each(rows,function(index,row){
					ids.push(row.ttPpOrderId);
				});
				datas = JSON.stringify(ids);
				var url = '/order/pporder/matchingBom';
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#table1').bootstrapTable('refresh');
	             });
			}
		},{
      btnId:'btnBomversion',text:'修改BOM版本',isTrue:true,otherOption:[{id:'table1',selMinNum: 1}],onClick:function(){
				var rows = $('#table1').bootstrapTable('getSelections');
				var row = rows[0];
				var orderBOMS = $('#table1').bootstrapTable('getSelections').map(function(item){return item.tmBasPartId});

				if (rows.length < 1) {
					layer.msg("没有选择的数据！")
						return;
				}else if(rows.length>1){
					  orderBOMS.sort();
			      var indexFlag = 0;
 	 						 for(var i=0;i<rows.length-1;i++){
								   for(var j=rows.length-1;j>i;j--){
											 if (orderBOMS[j]==orderBOMS[i]){
												 indexFlag++;
											 }
									 }

 								}
 						 if(indexFlag>=1){
							 layer.msg("选中的订单不为同一产品，无法进行修改BOM版本操作，请确认！");
							 						return;
						 }
								for(var i=0;i<rows.length-1;i++){
										 if(rows[i].orderStatus=='10'||rows[i].orderStatus=='20'){
												 if(rows[i].onlineQty=='0'){
													 daliogShowBomVersion(rows[i].orderType,rows[i].tmBasPartId,rows[i].ttPpOrderId,rows[i].tmBasPlantId);
												 }else{
													 layer.msg("此订单已部分上线，不允许进行修改BOM操作，请确认！");
													 						return;
												 }
											 }else{
												layer.msg("只允许订单状态为未排产或已排产的订单进行操作，请确认！");
																		return;
											 }

								 }


				 }else{
						 if(rows[0].orderStatus=='10'||rows[0].orderStatus=='20'){
								 if(rows[0].onlineQty=='0'){
 									 daliogShowBomVersion(rows[0].orderType,rows[0].tmBasPartId,rows[0].ttPpOrderId,rows[0].tmBasPlantId);
								 }else{
									 layer.msg("此订单已部分上线，不允许进行修改BOM操作，请确认！");
									 						return;
								 }
							 }else{
								layer.msg("只允许订单状态为未排产或已排产的订单进行操作，请确认！");
														return;
							 }
				 }
			 }
 		},{
          btnId: 'btnAddSub', otherBtn:true, otherOption:[{id:'table1',selectNum: 1},{id:'table1',noselect:[{title:'orderStatus',nolist:[90,99]}]}] //控制子表按钮是否 可用
        },{
          btnId: 'btnEditSub', otherBtn:true,otherOption:[{id:'table1',selectNum: 1},{id:'table1',noselect:[{title:'orderStatus',nolist:[90,99]}]}] //控制子表按钮是否 可用
        }],
		tableId:'table1',
		tableValue:{
			searchParams:mainSearchData,
			queryParams:function(){
				return{}
			},
			onClickRow:function(item,$element){
				//$('#table2').bootstrapTable('refresh',{query:{ttPpOrderId:item.ttPpOrderId}});//或者{query:{}}直接设置查询条件
				$('#table2').bootstrapTable('refreshOptions',{pageNumber:1});
			},
      onLoadSuccess:function(){
				$('.sw30').bootstrapSwitch({
					onText:"是",
					offText:"否",
					onColor:"success",
					offColor:"info",
					onSwitchChange:function(event,state){
						var d = {};
						d.ttPpOrderId = $(this).attr('fieldValue');
						d.isUrgent = state?1:0;
						datas = JSON.stringify(d);
						var url = '/order/pporder/doEnabled';
						$.when(Ew.ewAjax(url,datas)).done(function(results){
							  $('#table1').bootstrapTable('refresh');
			            });
					}
				});
        $('.sw31').bootstrapSwitch({
          onText:"是",
          offText:"否",
          onColor:"success",
          offColor:"info",
          onSwitchChange:function(event,state){
            var d = {};
            d.ttPpOrderId = $(this).attr('fieldValue');
            d.isSplit = state?1:0;
            datas = JSON.stringify(d);
            var url = '/order/pporder/doEnabled';
            $.when(Ew.ewAjax(url,datas)).done(function(results){
                    $('#table1').bootstrapTable('refresh');
                  });
          }
        });
	     },
			url:'/order/pporder/querylistByPage',
			columns:[{
				checkbox:true
      },{
          field: 'orderNo',
          title: '订单编号',
  				align:'center',
  				sortable:true,
          width:'180px'
      },{
          field: 'plant',
          title: '工厂',
  				align:'center',
  				sortable:true,
          width:'180px'
      }, {
          field: 'part',
          title: '产品',
  				align:'center',
  				sortable:true,
          width:'180px'
      },{
          field: 'orderQty',
          title: '数量',
  				align:'center',
  				sortable:true,
          width:'120px'
      },{
          field: 'custom',
          title: '客户',
  				align:'center',
  				sortable:true,
          width:'120px'
      }, {
          field: 'workshop',
          title: '车间',
  				align:'center',
  				sortable:true,
          width:'120px'
      // }, {
      //     field: 'line',
      //     title: '产线',
  		// 		align:'center',
  		// 		sortable:true,
      //     width:'120px'
      }, {
          field: 'planStartDate',
          title: '预计上线日期',
  				align:'center',
  				sortable:true,
          width:'120px'
      }, {
          field: 'planEndDate',
          title: '预计下线日期',
  				align:'center',
  				sortable:true,
          width:'120px'
      }, {
          field: 'orderType',
          title: '订单类型',
  				align:'center',
  				sortable:true,
          width:'120px',
					formatter: function (value, row, index) {
            return re.ORDER_TYPE[value]
          }
      }, {
          field: 'orderStatus',
          title: '订单状态',
  				align:'center',
  				sortable:true,
          width:'120px',
					formatter: function (value, row, index) {
            return re.ORDER_STATUS[value]
          }
      }, {
          field: 'isUrgent',
          title: '紧急状态',
  				align:'center',
          width:'120px',
  				formatter: function (value, row, index) {
  	              return Ew.switchHl(value,'sw30',row.ttPpOrderId)
  	            }
      }, {
          field: 'parentOrder',
          title: '上一级订单',
  				align:'center',
  				sortable:true,
          width:'120px'
      }, {
          field: 'planProductTime',
          title: '预计生产时间',
  				align:'center',
  				sortable:true,
          width:'120px'
      }, {
          field: 'orderSource',
          title: '来源',
  				align:'center',
  				sortable:true,
          width:'120px'
      }, {
          field: 'bBomVersion',
          title: 'BOM版本号',
  				align:'center',
  				sortable:true,
          width:'120px'
      }, {
          field: 'route',
          title: '工艺路径',
  				align:'center',
  				sortable:true,
          width:'120px'
      }, {
          field: 'isHold',
          title: 'HOLD状态',
  				align:'center',
  				sortable:true,
          width:'120px'
      }, {
          field: 'holdNotes',
          title: 'HOLD理由',
  				align:'center',
  				sortable:true,
          width:'120px'
      }, {
          field: 'onlineQty',
          title: '已上线数量',
  				align:'center',
  				sortable:true,
          width:'120px'
      },{
          field: 'offlineQty',
          title: '已下线数量',
  				align:'center',
  				sortable:true,
          width:'120px'
      },{
          field: 'scrapQty',
          title: '报废数量',
  				align:'center',
  				sortable:true,
          width:'120px'
      }, {
          field: 'inboundQty',
          title: '入库数量',
  				align:'center',
  				sortable:true,
          width:'120px'
      }, {
          field: 'outboundQty',
          title: '出库数量',
  				align:'center',
  				sortable:true,
          width:'120px'
      }, {
          field: 'onlineDate',
          title: '实际上线时间',
  				align:'center',
  				sortable:true,
          width:'120px'
      }, {
          field: 'offlineDate',
          title: '实际下线时间',
  				align:'center',
  				sortable:true,
          width:'120px'
      }, {
          field: 'factProductTime',
          title: '实际生产时间(分钟)',
  				align:'center',
  				sortable:true,
          width:'120px'
      }, {
          field: 'isLeafOrder',
          title: '是否生成二级订单',
          width:'120px',
					formatter: function (value, row, index) {
            return re.YESORNO[value]
          }
      }, {
          field: 'isSplit',
          title: '是否允许订单拆分',
  				align:'center',
          width:'120px',
  				formatter: function (value, row, index) {
  	              return Ew.switchHl(value,'sw31',row.ttPpOrderId)
  	            }

			}
     ]
		}
	});

	var aa=-1;
	//子表格
	Ew.table('.demoTable2',{
		btnValues:[{
			btnId:'btnAddSub',text:'新增',otherOption:[{id:'table1',selectNum: 1},{id:'table2',noselect:[{title:'oOrderStatus',nolist:[90,99]}]},{id:'table1',noselect:[{title:'orderStatus',nolist:[90,99]}]}],onClick:function(){
				daliogShow2('add')
			}
		},{
			btnId:'btnEditSub',text:'编辑',otherOption:[{id:'table1',selectNum: 1},{id:'table2',selectNum: 1},{id:'table2',noselect:[{title:'oOrderStatus',nolist:[90,99]}]},{id:'table1',noselect:[{title:'orderStatus',nolist:[90,99]}]}],selectNum:1,onClick:function(){
				var rows = $('#table2').bootstrapTable('getSelections');
			  var row = rows[0];
				if (row.type !='M') {
							layer.msg("只允许修改类型为M-手工增加的BOM数据")
						 return;
			 }
				daliogShow2('change')
			}
		},{
			btnId:'btnDeleteSub',text:'删除',isTrue:true,otherOption:[{id:'table2',selMinNum: 1},{id:'table2',noselect:[{title:'oOrderStatus',nolist:[90,99]}]},{id:'table1',noselect:[{title:'orderStatus',nolist:[90,99]}]}],onClick:function(){
				var rows = $('#table2').bootstrapTable('getSelections');
			  var row = rows[0];
				var ids = [];
				if (row.type !='M') {
							layer.msg("只允许修改类型为M-手工增加的BOM数据")
						 return;
			 }
				$.each(rows,function(index,row){
					ids.push(row.ttPpOrderBomId);
				});
				datas = JSON.stringify(ids);
				var url = '/order/pporderbom/deleteMore';
				$.when(Ew.ewAjax(url,datas)).done(function(results){
								$('#table2').bootstrapTable('refreshOptions',{pageNumber:1});
								$('#table2').bootstrapTable('refresh');
	            });
			}
		}],
		tableId:'table2',
		tableValue:{
			queryParams:function(){
				var	ttId =	$('#table1').bootstrapTable('getSelections')[0]?$('#table1').bootstrapTable('getSelections')[0].ttPpOrderId:-1;
				return {ttPpOrderId:ttId};
			},
			onClickRow:function(item,$element){

				if(item.oOrderStatus=='99'){

					 $('#dele2').prop('disabled',false);
				}else{
								 $('#dele2').prop('disabled',false);
				}

			},
			url:'/order/pporderbom/querylistByPage',
			columns:[{
				checkbox:true
      },{
          field: 'rowNo',
          title: '行号',
  				align:'center',
  				sortable:true,
          width:'120px'
      },{
          field: 'uloc',
          title: '工位',
  				align:'center',
  				sortable:true,
          width:'120px'
      }, {
          field: 'part',
          title: '物料',
  				align:'center',
  				sortable:true,
          width:'120px'
      }, {
          field: 'qty',
          title: '单位用量',
  				align:'center',
  				sortable:true,
          width:'120px'
      }, {
          field: 'baseUnit',
          title: '单位',
  				align:'center',
  				sortable:true,
          width:'120px'
      }, {
          field: 'rate',
          title: '损耗率%',
  				align:'center',
  				sortable:true,
          width:'120px'
      }, {
          field: 'orderQty',
          title: '订单计划用量',
  				align:'center',
  				sortable:true,
          width:'120px'
      }, {
          field: 'receiveQty',
          title: '领料数量',
  				align:'center',
  				sortable:true,
          width:'120px'
      }, {
          field: 'outboundQty',
          title: '反冲数量',
  				align:'center',
  				sortable:true,
          width:'120px'
      }, {
          field: 'type',
          title: '类型',
  				align:'center',
  				sortable:true,
          width:'120px',
					formatter: function (value, row, index) {
            return re.ORDER_BOM_TYPE[value]
          }
			}
    ]
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
				data.ttPpOrderId = $('#table1').bootstrapTable('getSelections')[0].ttPpOrderId ;
				//data.tmBasPartId =  $('#table1').bootstrapTable('getSelections')[0].tmBasPartId;

				if(type=='change') data.ttPpOrderBomId = $('#'+defaultTable).bootstrapTable('getSelections')[0].ttPpOrderBomId;
				datas = JSON.stringify(data);
				var url = (type=='add'?'/order/pporderbom/add':'/order/pporderbom/update');
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#demoadd').modal('hide');
					$('#table2').bootstrapTable('refresh');
	             });
			}
		},{
			btnId:'btnClearSub',
			text:'取消'
		}],
		form:{
			formId:'demoform',
			columnNum:2,
			listWidth:280,
			formList:[
        {
          idName:'text600',
          text:'订单编号',
          comboUrl:'',
          comboId:'orderNo',
          comboText:'orderNo',
          field:'orderNo',
          valid:[''],
          defaultValue:$('#table1').bootstrapTable('getSelections')[0].orderNo,
          disabled:true
      },{
				idName:'combo600',
				text:'工厂',
				comboUrl:'/base/plant/publicPlantSelect',
				comboId:'tmBasPlantId',
				comboText:'plant',
				field:'tmBasPlantId',
				valid:[''],
				defaultValue:$('#table1').bootstrapTable('getSelections')[0].tmBasPlantId,
 				disabled:type=='add'?false:true,
				onClick:function(data){
					Ew.selectLink({
								comboUrl:'/base/workshop/publicWorkshopSelect',
								comboData:JSON.stringify({tmBasPlantId:data.id,enabled:1}),
								id:['combo601'],
								comboId:'tmBasWorkshopId',
								comboText:'workshop'
						});
					// Ew.selectLink({
					// 			comboUrl:'/base/line/publicLineSelect',
					// 			comboData:JSON.stringify({tmBasPlantId:data.id,enabled:1}),
					// 			id:['combo602'],
					// 			comboId:'tmBasLineId',
					// 			comboText:'line'
					// 	});

						Ew.selectLink({
									comboUrl:'/base/uloc/queryUlocSelectForInputWithLineId',
									comboData:JSON.stringify({tmBasPlantId:data.id,enabled:1}),
									id:['combo603'],
									comboId:'tmBasUlocId',
									comboText:'ulocNo'
							});


							 $('#combo604').html('');


				}
			},{
				idName:'combo601',
				text:'车间',
				comboUrl:'/base/workshop/publicWorkshopSelect',
				comboId:'tmBasWorkshopId',
				comboText:'workshop',
				field:'tmBasWorkshopId',
				valid:[''],
				defaultValue:$('#table1').bootstrapTable('getSelections')[0].tmBasWorkshopId,
				comboData:type=='add'?JSON.stringify({
					enabled:1,
				}):JSON.stringify({
					enabled:1,
					tmBasPlantId:$('#table1').bootstrapTable('getSelections')[0].tmBasPlantId
				}),
				disabled:false,
				onClick:function(data){

					// Ew.selectLink({
					// 			comboUrl:'/base/line/publicLineSelect',
					// 			comboData:JSON.stringify({tmBasWorkshopId:data.id,enabled:1}),
					// 			id:['combo602'],
					// 			comboId:'tmBasLineId',
					// 			comboText:'line'
					// 	});

						Ew.selectLink({
									comboUrl:'/base/uloc/queryUlocSelectForInputWithLineId',
									comboData:JSON.stringify({wTmBasWorkshopId:data.id,enabled:1}),
									id:['combo603'],
									comboId:'tmBasUlocId',
									comboText:'ulocNo'
							});
				}
			// },{
			// 	idName:'combo602',
			// 	text:'产线',
			// 	comboUrl:'/base/line/publicLineSelect',
			// 	comboId:'tmBasLineId',
			// 	comboText:'line',
			// 	field:'tmBasLineId',
			// 	valid:[''],
			// 	defaultValue:$('#table1').bootstrapTable('getSelections')[0].tmBasLineId,
			// 	disabled:false,
			// 	onClick:function(data){
			//
   	// 				Ew.selectLink({
			// 						comboUrl:'/base/uloc/queryUlocSelectForInputWithLineId',
			// 						comboData:JSON.stringify({lTmBasLineId:data.id,enabled:1}),
			// 						id:['combo603'],
			// 						comboId:'tmBasUlocId',
			// 						comboText:'ulocNo'
			// 				});
			// 	}
			},{
				idName:'combo603',
				text:'工位',
				comboUrl:'/base/uloc/queryUlocSelectForInputWithLineId',
				comboData:{
					id:['combo600','combo601'],
					field:['pTmBasPlantId','wTmBasWorkshopId'],
					other:{}
				},
				comboId:'tmBasUlocId',
				comboText:'ulocNo',
				field:'tmBasUlocId',
				valid:['notEmpty'],
 				isSearch:type=='add'?true:false

			},{
				idName:'combo604',
				text:'物料',
				comboUrl:'/worktime/part/publicProduct',
				comboData:type=='add'?{
					id:['combo600'],
					field:['tmBasPlantId']

				}:{},
				comboId:'tmBasPartId',
				comboText:'part',
				field:'tmBasPartId',
				valid:['notEmpty'],
 				isSearch:type=='add'?true:false

			},{
        idName:'number600',
				text:'单位用量',
				field:'qty',
				valid:['notEmpty'],
				onKeyup:function(data){
				    //订单用量系统默认进行计算=订单数量*单位用量*（1+损耗率）
					var orderQty = $('#table1').bootstrapTable('getSelections')[0].orderQty;//订单数量
					var rate = $('#number603').val();
					if(rate==''){
						$('#number604').val(0);
					}else{
						$('#number604').val(orderQty*data*(1+rate/100));
					}
				}
			},{
				idName:'comboUnitII',
				text:'单位',
				comboUrl:'/system/codeList/getSelect',
				comboId:'no',
				comboText:'name',
				field:'baseUnit',
				valid:['notEmpty'],
				comboData:'BASE_UNIT',
				n:1
			},{
        idName:'number603',
				text:'损耗率%',
				field:'rate',
				valid:['notEmpty'],
				onKeyup:function(data){
				    //订单用量系统默认进行计算=订单数量*单位用量*（1+损耗率）
					var orderQty = $('#table1').bootstrapTable('getSelections')[0].orderQty;//订单数量
					var qty = $('#number600').val();
					if(qty==''){
						$('#number604').val(0);
					}else{
						$('#number604').val(orderQty*qty*(1+data/100));
					}
				}
			},{
        idName:'number604',
				text:'订单用量',
				field:'orderQty',
				valid:['notEmpty']
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









/*** 修改BOM版本  ***/
function daliogShowBomVersion(bomType,tmBasPartId,ttPpOrderId,tmBasPlantId){
	var title='修改BOM版本';
	var defaultTable='table1';
	Ew.dialog('demobomversion',{
		title:title,
		btnValues:[{
			btnId:'btnBomversionSaveSubDal',
			text:'保存',
			formid:'demoBomVersionform',
			onClick:function(data){
				data.orderType = bomType;
 			  data.tmBasPartId =tmBasPartId;
				data.ttPpOrderId = ttPpOrderId;
				data.tmBasPlantId = tmBasPlantId;

				datas = JSON.stringify(data);
				var url ='/order/pporderbom/matchingBomVersion';
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#demobomversion').modal('hide');
					$('#table1').bootstrapTable('refresh');
	             });
			}
		},{
			btnId:'btnBomversionClearSubDal',
			text:'取消'
		}],
		form:{
			formId:'demoBomVersionform',
			columnNum:2,
			listWidth:333,
			formList:[
        {
					idName:'combo306',
	        text:'BOM版本',
					field:'tmBasBomId',
					comboUrl:'/base/bom/queryBomSuggest',
					comboId:'tmBasBomId',
					comboText:'bomVersion',
					searchText:'bBomVersion',
					comboData:{
 						other:{orderType:bomType,tmBasPartId:tmBasPartId,tmBasPlantId:tmBasPlantId}
					},
					method:'GET',
					isSearch:true
        }
     ],
			defaultTable:defaultTable
		}
	})

}
