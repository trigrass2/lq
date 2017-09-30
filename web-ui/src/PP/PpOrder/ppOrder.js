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
		format:'year',
		limit:{date:'day31',type:'setStartDate'}
	},{
		idName: 'day31',
		text: '预计上线日期到',
		field: 'planEndDate',
		format:'year',
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

		textValues:mainSearchData,
		btnValues:[{
			btnId:'btnSearch',
			text:'搜索',
			onClick:function(data){
				$('#table1').bootstrapTable('refreshOptions',{pageNumber:1});
 			}
		},{
			btnId:'btnClear',
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
	*columns：为表格的参 数值
	*
	*
	**/
Ew.getDictVal(['ORDER_TYPE', 'ORDER_STATUS', 'YESORNO'], function (re) {
	//主表格
	Ew.table('.demoTable',{
		btnValues:[{
			btnId:'btnAdd',text:'新增',onClick:function(){
				daliogShow('add')
			}
		},{
			btnId:'btnEdit',text:'编辑',otherOption:[{id:'table1',selectNum: 1}],onClick:function(){
				var rows = $('#table1').bootstrapTable('getSelections');
        var row = rows[0];
				if (row.orderStatus !='10'||row.orderSource !='MES') {
							layer.msg("只允许修改状态为未排产,来源为MES数据的订单！")
							return;
				}
				daliogShow('edit')
			}
		},{
			btnId:'btnDelete',text:'删除',isTrue:true,otherOption:[{id:'table1',selMinNum: 1}],onClick:function(){
				var rows = $('#table1').bootstrapTable('getSelections');
        var row = rows[0];
         if(row.orderStatus !='undefined'||row.orderSource !='undefined'){
             if (row.orderStatus !='10'||row.orderSource !='MES'||row.onlineQty!=0) {
                   layer.msg("只允许修改状态为未排产,来源为MES数据且上线数量为0的订单！")
                   return;
             }
         }
				var ids = [];
				$.each(rows,function(index,row){
					ids.push(row.ttPpOrderId);
				});
				datas = JSON.stringify(ids);
				var url = '/order/pporder/updateMore';
				$.when(Ew.ewAjax(url,datas)).done(function(results){
                  $('#table1').bootstrapTable('refreshOptions',{pageNumber:1});
	             });
			}
		},{
      btnId:'btnClose',text:'关闭',isTrue:true,otherOption:[{id:'table1',selMinNum: 1}],onClick:function(){
				var rows = $('#table1').bootstrapTable('getSelections');
        var row = rows[0];
         if(row.orderStatus !='undefined'||row.orderSource !='undefined'){
              if (row.orderStatus !='10'&& row.orderStatus !='20'&& row.orderStatus !='50'&&row.orderStatus !='60') {
                    layer.msg("只允许状态为未排产，已排产，线下报交，完全入库状态的订单进行关闭!")
                   return;
             }
         }
				var ids = [];
				$.each(rows,function(index,row){
					ids.push(row.ttPpOrderId);
				});
				datas = JSON.stringify(ids);
				var url = '/order/pporder/closeMore';
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#table1').bootstrapTable('refresh');
	             });
			}
		},{
			  btnId:'btnTwoOrder',text:'生成二级订单',isTrue:true,otherOption:[{id:'table1',selMinNum: 1}],onClick:function(){
           var rows = $('#table1').bootstrapTable('getSelections');
          var row = rows[0];
          if (rows.length < 1) {
            layer.msg("没有选择的数据！")
              return;
          }
          if (rows.length > 1) {
                layer.msg("只能选择一条数据！")
              return;
          }
          var data = {
            ttPpOrderId:row.ttPpOrderId,
            bBomVersion:row.bBomVersion,
          };
  				datas = JSON.stringify(data);
  				var url ='/order/pporder/genTwoOrder';
  				$.when(Ew.ewAjax(url,datas)).done(function(results){
  					$('#table1').bootstrapTable('refresh');
  	             });
  			}

		},{
			btnId:'btnDecompose',text:'分解',isTrue:true,otherOption:[{id:'table1',selMinNum: 1}],onClick:function(){
 					var rows = $('#table1').bootstrapTable('getSelections');
	        var row = rows[0];
	        if (rows.length < 1) {
	          layer.msg("没有选择的数据！")
	            return;
	        }
	        if (rows.length > 1) {
	              layer.msg("只能选择一条数据！")
	            return;
	        }
	         if(row.isSplit=='1'){
							if(row.orderStatus=='10'){
		                 if(row.isHold=='1'){
											    if(row.orderSource=='MES'){
		                              if((row.orderQty - row.onlineQty)>1){
		                                  	daliogShowDecompose();
																	}else{
																		Ew.layer.alert("可分解数量(订单数量-已上线数量)必须大于1，请确认！", {icon: 2});
																	}
													}else{
                              Ew.layer.alert("只允许订单来源为MES的订单进行操作,请确认！", {icon: 2});
													}
										 }else{

                       Ew.layer.alert("该订单未HOLD，不允许进行分解操作，请确认！", {icon: 2});
										 }
							}else{
								 		 Ew.layer.alert("只允许订单状态为未排产的订单进行操作，请确认！", {icon: 2});
							}
	          }else{
				       Ew.layer.alert("是否允许拆分状态为不允许", {icon: 2});
	          }
			}
		},{
			btnId:'btnMerge',text:'合并',isTrue:true,otherOption:[{id:'table1',selMinNum: 1}],onClick:function(){
        var rows = $('#table1').bootstrapTable('getSelections');
        var row = rows[0];
        if (rows.length < 1) {
          layer.msg("没有选择的数据！")
            return;
        }
        if (rows.length > 1) {
              layer.msg("只能选择一条数据！")
            return;
        }
        var data = { ttPpOrderId:row.ttPpOrderId};
				datas = JSON.stringify(data);
				var url ='/order/pporder/merge';
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#table1').bootstrapTable('refresh');
	             });
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
      btnId:'btnRoute',text:'匹配工艺路径',isTrue:true,otherOption:[{id:'table1',selMinNum: 1}],onClick:function(){
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
						var url = '/order/pporder/matchingRoute';
						$.when(Ew.ewAjax(url,datas)).done(function(results){
							$('#table1').bootstrapTable('refresh');
			             });

			}
		},{
			btnId:'btnDownload',text:'模板下载',isTrue:true,selMinNum:1,onClick:function(){
           var  url = '/order/pporder/down';
           window.top.location.href = Ew.apiUrl +url;
			}
		},{
			btnId:'btnImport',text:'导入',selMinNum:1,url:'/order/pporder/import',tableId:'table1'
		},{
			btnId:'btnExport',text:'导出',selMinNum:1,onClick:function(){
            var tmBasPlantId = $('#combo30').val();
						var tmBasPartId = $('#inputCom30').val();
						var orderType = $('#combo32').val();
						var orderStatus = $('#combo33').val();
						var orderNo = $('#text30').val();
						var planStartDate = $('#day30').val();
						var planEndDate = $('#day31').val();

          window.top.location.href= apiUrl +'/order/pporder/export?tmBasPlantId='+tmBasPlantId+'&tmBasPartId='+tmBasPartId+'&orderType='+orderType +'&orderStatus='+orderStatus+'&orderNo='+orderNo+'&planStartDate='+planStartDate+'&planEndDate='+planEndDate;

			}
		}
  ],
		tableId:'table1',
		tableValue:{
			searchParams:mainSearchData,
			queryParams:function(){
				return{}
			},
			onClickRow:function(item,$element){

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
          width:'180px',
      },{
          field: 'plant',
          title: '工厂',
  				align:'center',
  				sortable:true,
          width:'120px'
      }, {
          field: 'part',
          title: '产品',
  				align:'center',
  				sortable:true,
          width:'120px'
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
          width:'120px',
					formatter: function (value, row, index) {
            return re.YESORNO[value]
          }
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

  if(type!='add'){
		var tmBasPlantIds = $('#table1').bootstrapTable('getSelections')[0].tmBasPlantId;
		var tmBasPartIds = $('#table1').bootstrapTable('getSelections')[0].tmBasPartId;
		var orderTypes = $('#table1').bootstrapTable('getSelections')[0].orderType;
	}
	var title=type=='add'?'新增':'编辑';
	var defaultTable=type=='add'?'':'table1';
	Ew.dialog('demoadd',{
		title:title,
		btnValues:[{
			btnId:'btnSave',
			text:'保存',
			formid:'demoform',
			onClick:function(data){
 				if(type=='edit') data.ttPpOrderId = $('#'+defaultTable).bootstrapTable('getSelections')[0].ttPpOrderId;
				datas = JSON.stringify(data);
				var url = (type=='add'?'/order/pporder/add':'/order/pporder/update');
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
			listWidth:333,
			formList:[
        {
          idName:'text300',
          text:'订单编号',
          field:'orderNo',
          disabled:type=='add'?false:true,
					hidden:type=='add'?true:false,
        },{
				idName:'combo300',
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
				        id:['combo303'],
				        comboId:'tmBasWorkshopId',
				        comboText:'workshop'
				    });
					// Ew.selectLink({
				  //       comboUrl:'/base/line/publicLineSelect',
				  //       comboData:JSON.stringify({tmBasPlantId:data.id,enabled:1}),
				  //       id:['combo304'],
				  //       comboId:'tmBasLineId',
				  //       comboText:'line'
				  //   });


						   $('#combo301').html('');
							 $('#combo302').html('');
							 $('#combo306').html('');

				}
			},{
				idName:'combo301',
				text:'产品',
				comboUrl:'/worktime/part/queryPartSuggest',
				comboData:type=='add'?{
					id:['combo300'],
					field:['tmBasPlantId']

				}:{},
				comboId:'tmBasPartId',
				comboText:'part',
				field:'tmBasPartId',
				valid:['notEmpty'],
				disabled:type=='add'?false:true,
				isSearch:type=='add'?true:false,
				onClick:function(data){
							 $('#combo302').html('');
							 $('#combo306').html('');
							 $('#combo308').html('');
				}
			},{
        idName:'number300',
				text:'数量',
				field:'orderQty',
				valid:['notEmpty']
			},{
				idName:'combo302',
        text:'客户',
				field:'cTmBasCustomId',
				comboUrl:'/worktime/partCustom/queryCoustomSuggest',
				comboId:'cTmBasCustomId',
				comboText:'custom',
				comboData:type=='add'?{
          id:['combo301'],
					field:['tmBasPartId']
				}:{tmBasPartId:tmBasPartIds},
        isSearch:type=='add'?true:false,
				method:'GET',
			},{
        idName:'combo303',
				text:'车间',
				comboUrl:'/base/workshop/publicWorkshopSelect',
				comboId:'tmBasWorkshopId',
				comboText:'workshop',
				field:'tmBasWorkshopId',
				comboData:type=='add'?JSON.stringify({
					enabled:1,
				}):JSON.stringify({
					enabled:1,
					tmBasPlantId:$('#table1').bootstrapTable('getSelections')[0].tmBasPlantId
				}),
				// onClick:function(data){
				// 	Ew.selectLink({
				//         comboUrl:'/base/line/publicLineSelect',
				//         comboData:JSON.stringify({tmBasWorkshopId:data.id,enabled:1}),
				//         id:['combo304'],
				//         comboId:'tmBasLineId',
				//         comboText:'line'
				//     });
				// }
			// },{
			// 	idName:'combo304',
			// 	text:'产线',
			// 	comboUrl:'/base/line/publicLineSelect',
			// 	comboId:'tmBasLineId',
			// 	comboText:'line',
			// 	field:'tmBasLineId',
      //   disabled:false,
			// 	comboData:type=='add'?JSON.stringify({
			// 		enabled:1
			// 	}):JSON.stringify({
			// 		enabled:1,
			// 		tmBasPlantId:$('#table1').bootstrapTable('getSelections')[0].tmBasPlantId,
			// 		tmBasWorkshopId:$('#table1').bootstrapTable('getSelections')[0].tmBasWorkshopId
			// 	}),
			},{
				idName: 'day300',
				text: '预计上线日期',
				field: 'planStartDate',
        minDate:Ew.getNowday(),
				limit:{date:'day301',type:'setStartDate',otherField:'planEndDate'},
				valid:['notEmpty']
			},{
				idName: 'day301',
				text: '预计下线日期',
				field: 'planEndDate',
		    minDate:Ew.getNowday(),
				limit:{date:'day300',type:'setEndDate',otherField:'planStartDate'},
				valid:['notEmpty']
			},{
				idName:'combo305',
				text:'订单类型',
				field:'orderType',
        valid:['notEmpty'],
				comboUrl:'/system/codeList/getSelect',
				comboData:'ORDER_TYPE',
				comboId:'no',
				comboText:'name',
        disabled:type=='add'?false:true
			},{
        idName:'switch300',
				text:'是否紧急',
				field:'isUrgent',
				ontext:'是',
				offtext:'否',
				defaultValue:0
			},{
				idName:'combo308',
				text:'上一级订单',
				field:'parentOrder',
				comboUrl:'/order/pporder/queryParentOrderSuggest',
				comboId:'parentOrder',
				comboText:'parentOrder',
				comboData:type=='add'?{
					id:['combo301'],
					field:['tmBasPartId']
				}:{tmBasPartId:tmBasPartIds},
				method:'GET',
				isSearch:type=='add'?true:false,
			},{
				idName:'number301',
				text:'预计生产时间',
				field:'planProductTime'
			},{
        idName:'combo306',
        text:'BOM版本',
				field:'tmBasBomId',
				comboUrl:'/base/bom/queryBomSuggest',
				comboId:'tmBasBomId',
				comboText:'bomVersion',
				comboData:type=='add'?{
          id:['combo300','combo301','combo305'],
					field:['tmBasPlantId','tmBasPartId','orderType']
				}:{tmBasPlantId:tmBasPlantIds,tmBasPartId:tmBasPartIds,orderType:orderTypes},
				method:'GET',
        isSearch:type=='add'?true:false,

			},
			// {
      //   idName:'combo307',
			// 	text:'工艺路径',
			// 	comboUrl:'/worktime/part/publicProduct',
			// 	comboData:type=='add'?{
			// 		id:['combo300','combo301'],
			// 		field:['tmBasPlantId','tmBasPartId']
			//
			// 	}:{},
			// 	comboId:'tmBasRouteId',
			// 	comboText:'route',
			// 	field:'tmBasRouteId',
 		// 		disabled:type=='add'?false:true,
			// 	isSearch:true
			// },
			{
				idName:'text',
				text:'备注',
				field:'remark',
        n :2
			},{
        idName:'switch301',
				text:'是否允许拆分',
				field:'isSplit',
				offtext:'否',
				ontext:'是',
				defaultValue:0

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





/*** 分解  ***/
function daliogShowDecompose(){
	var orderQty = $('#table1').bootstrapTable('getSelections')[0].orderQty;
	var onlineQty = $('#table1').bootstrapTable('getSelections')[0].onlineQty;
	var dec = orderQty-onlineQty;

	var title='分解';
	var defaultTable='table1';
	Ew.dialog('demoadd',{
		title:title,
		btnValues:[{
			btnId:'btnDecomposeSaveDal',
			text:'保存',
			formid:'demoDecomposeform',
			onClick:function(data){
				data.ttPpOrderId = $('#'+defaultTable).bootstrapTable('getSelections')[0].ttPpOrderId;
				var number3000 = $('#number3000').val();
				var number3001 = $('#number3001').val();
			 	var number3002 = $('#number3002').val();
		  	var number3003 = $('#number3003').val();
				if(((number3002*number3003)>(number3000-number3001))||((number3002*number3003)==(number3000-number3001))){
					layer.msg("分解数量*分解订单数 应小于订单数量-上线数量")
						return;
				}
				/**获取已生成SN数量**/
				var dataSn = {ttPpOrderId:data.ttPpOrderId};
				dataSns  =  JSON.stringify(dataSn);
				$.when(Ew.ewAjax('/order/ppordersn/queryOrderSnCount',dataSns,'','',true)).done(function(resultsSN){
 							if(((number3002*number3003)>(number3000-resultsSN))||((number3002*number3003)==(number3000-resultsSN))){
								layer.msg("分解数量*分解订单数 应小于订单数量-已生成SN数量")
									return;
							}
							/**请求订单分解后台逻辑**/
							datas = JSON.stringify(data);
							var url ='/order/pporder/decompose';
							$.when(Ew.ewAjax(url,datas)).done(function(results){
								$('#demoadd').modal('hide');
								$('#table1').bootstrapTable('refresh');
							 });

				});



			}
		},{
			btnId:'btnDecomposeCancelDal',
			text:'取消'
		}],
		form:{
			formId:'demoDecomposeform',
			columnNum:2,
			listWidth:333,
			formList:[
        {
          idName:'number3000',
          text:'订单数量',
          field:'orderQty',
          disabled:true
        },{
					idName:'number3001',
          text:'上线数量',
          field:'onlineQty',
          disabled:true
			},{
				idName:'number3002',
				text:'分解数量',
				field:'decomposeNum',
				valid:['notEmpty',{type:'number',min:0,max:dec}]

			},{
        idName:'number3003',
				text:'分解订单数',
				field:'decomposeOrderNum',
		    valid:['notEmpty'],
				defaultValue:1

			}
     ],
			defaultTable:defaultTable
		}
	})

}



/*** 导入  ***/



function daliogShowImport(){
	var title='导入';
	var defaultTable='table1';
	Ew.dialog('demoimport',{
		title:title,
		btnValues:[{
			btnId:'btnImportDal',
			text:'导入',
			formid:'demoImportform',
			onClick:function(data){
 			  data.ttPpOrderId = $('#'+defaultTable).bootstrapTable('getSelections')[0].ttPpOrderId;
				datas = JSON.stringify(data);
				var url ='/order/pporder/import';
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#demoimport').modal('hide');
					$('#table1').bootstrapTable('refresh');
	             });
			}
		},{
			btnId:'btnImportCancelDal',
			text:'取消'
		}],
		form:{
			formId:'demoImportform',
			columnNum:2,
			listWidth:333,
			formList:[
        {
          idName:'text300',
          text:'订单文件',
          field:'orderQty',
          disabled:true,
				}
     ],
			defaultTable:defaultTable
		}
	})

}
