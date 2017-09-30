layui.use('layer',function(){
	layer=layui.layer;
});

$(function(){
	//搜索条件
	var mainSearchData=[{
		idName:'comboSearchPlant',
		text:'工厂',
		field:'tmBasPlantId',
		comboUrl:'/base/plant/publicPlantSelect',
		comboId:'tmBasPlantId',
		comboText:'plant',
		onClick:function(data){
			Ew.selectLink({
		        comboUrl:'/base/workshop/publicWorkshopSelect',
		        comboData:JSON.stringify({tmBasPlantId:data.id}),
		        id:['combo52'],
		        comboId:'tmBasWorkshopId',
		        comboText:'workshop'
		    });
		}
	},{
		idName:'inputComSearchPart',
		text:'产品',
		field:'tmBasPartId',
		comboUrl:'/worktime/part/publicProduct',
		comboData:
		{
			id:['comboSearchPlant'],
			field:['tmBasPlantId'],
			other:{}
	    },
		comboId:'tmBasPartId',
		comboText:'part'
	},{
		idName:'comboSearchOrderType',
		text:'类型',
		field:'orderType',
		comboUrl:'/system/codeList/getSelect',
		comboData:'ORDER_TYPE',
		comboId:'no',
		comboText:'name'
	},{
		idName:'comboSearchOrderStatus',
		text:'状态',
		field:'orderStatus',
		comboUrl:'/system/codeList/getSelect',
		comboData:'ORDER_STATUS',
		comboId:'no',
		comboText:'name'
	},{
		idName:'textSearchOrderNo',
		text:'订单编号',
		field:'orderNo'
	},{
		idName:'textSearchSn',
		text:'SN',
		field:'sn'
	}]

	Ew.search('.searchForm',{
		title:'查询',
		textValues:mainSearchData,
		btnValues:[{
			btnId:'btnSearch',
			text:'搜索',
			onClick:function(data){
				$('#tablePpOrder').bootstrapTable('refreshOptions',{pageNumber:1});
				$('#tablePpOrderSn').bootstrapTable('removeAll');
			}
		},{
			btnId:'btnClear',
			text:'重置',
			tableid:['tablePpOrder','tablePpOrderSn']
		}]
	});

	Ew.getDictVal(['ORDER_TYPE', 'ORDER_STATUS', 'SN_TYPE', 'SN_STATUS'], function (re) {
		//主表格
		Ew.table('.mainTable',{
			btnValues:[{
				btnId:'btnCreateSn',text:'生成SN',onClick:function(){
					var rows = $('#tablePpOrder').bootstrapTable('getSelections');
					ids = [];
					var flag = true;
					$.each(rows,function(index,row){
						ids.push(row.ttPpOrderId);
					});
					datas = JSON.stringify({ttPpOrderId : ids,isRebuild : '0'});
					var url = '/order/ppordersn/createOrderSn';
					$.when(Ew.ewAjax(url,datas,'','',true)).done(function(results){
						if(results == -1){
							layer.confirm('是否重新生成SN？', {
							    time: 0 //不自动关闭
							    ,btn: ['是', '否','取消']
							    ,yes: function(index){
							        layer.close(index);
							        datas = JSON.stringify({ttPpOrderId : ids,isRebuild : '1'});
				    				var url = '/order/ppordersn/createOrderSn';
				    				$.when(Ew.ewAjax(url,datas)).done(function(results){
				    					$('#tablePpOrderSn').bootstrapTable('refresh');
				    				});
							    }
								,btn2: function(index){
							        layer.close(index);
							        datas = JSON.stringify({ttPpOrderId : ids,isRebuild : '2'});
				    				var url = '/order/ppordersn/createOrderSn';
				    				$.when(Ew.ewAjax(url,datas)).done(function(results){
				    					$('#tablePpOrderSn').bootstrapTable('refresh');
				    				});
							    }
							});
						}
						if(results == 0){
							layer.msg('生成SN成功！', {
					            icon: 1,
					            time: 1000
					        })
						}
						$('#tablePpOrderSn').bootstrapTable('refresh');
					});
				}
			}],
			tableId:'tablePpOrder',
			tableValue:{
				searchParams:mainSearchData,
				queryParams:function(){
					return{}
				},
				onClickRow:function(item,$element){
					$('#tablePpOrderSn').bootstrapTable('refreshOptions',{pageNumber:1});//或者{query:{}}直接设置查询条件
				},
				onLoadSuccess:function(){

				},
				url:'/order/ppordersn/queryOrder',
				columns:[{
					checkbox: true
				},{
					field: 'order_no',
					title: '订单编号',
					align: 'center',
					sortable:true
				},{
					field: 'plant_name',
					title: '工厂',
					align: 'center',
					sortable:true
				},{
					field: 'part_name',
					title: '产品',
					align: 'center',
					sortable:true
				},{
					field: 'order_qty',
					title: '数量',
					align: 'center',
					sortable:true
				},{
					field: 'custom_name',
					title: '客户',
					align: 'center',
					sortable:true
				},{
					field: 'workshop',
					title: '车间',
					align: 'center',
					sortable:true
				// },{
				// 	field: 'line_name',
				// 	title: '产线',
				// 	align: 'center',
				// 	sortable:true
				},{
					field: 'plan_start_date',
					title: '预计上行日期',
					align: 'center',
					sortable:true
				},{
					field: 'plan_end_date',
					title: '预计下线日期',
					align: 'center',
					sortable:true
				},{
					field: 'order_type',
					title: '订单类型',
					align: 'center',
					sortable:true,
					width:"120px",
					formatter: function (value, row, index) {
						return re.ORDER_TYPE[value]
					}

				},{
					field: 'order_status',
					title: '订单状态',
					align: 'center',
					sortable:true,
					width:'120px',
					formatter: function (value, row, index) {
						return re.ORDER_STATUS[value]
					}
				},{
					field: 'is_urgent',
					title: '紧急状态',
					align: 'center',
					sortable:true
				},{
					field: 'order_source',
					title: '来源',
					align: 'center',
					sortable:true
				},{
					field: 'bom_version',
					title: 'BOM版本号',
					align: 'center',
					sortable:true
				},{
					field: 'route_name',
					title: '工艺路径',
					align: 'center',
					sortable:true
				},{
					field: 'is_hold',
					title: 'HOLD状态',
					align: 'center',
					sortable:true
				},{
					field: 'hold_notes',
					title: 'HOLD理由',
					align: 'center',
					sortable:true
				},{
					field: 'online_qty',
					title: '已上线数量',
					align: 'center',
					sortable:true
				},{
					field: 'offline_qty',
					title: '已下线数量',
					align: 'center',
					sortable:true
				},{
					field: 'inbound_qty',
					title: '入库数量',
					align: 'center',
					sortable:true
				},{
					field: 'outbound_qty',
					title: '出库数量',
					align: 'center',
					sortable:true
				},{
					field: 'online_date',
					title: '实际上线时间',
					align: 'center',
					sortable:true
				},{
					field: 'offline_date',
					title: '实际下线时间',
					align: 'center',
					sortable:true
				},{
					field: 'fact_product_time',
					title: '实际生产时间（分钟）',
					align: 'center',
					sortable:true
				},{
					field: 'parent_order',
					title: '上一级订单',
					align: 'center',
					sortable:true
				},{
					field: 'is_split',
					title: '是否允许订单拆分',
					align: 'center',
					sortable:true
				}]
			}
		});

		//字表格
		Ew.table('.subTable',{
			btnValues:[{
				btnId:'btnAddSub',text:'增加',otherOption:[{id:'tablePpOrder',selMinNum: 1,seleMaxNum: 1}],onClick:function(){
					var ids = [];
					var id = $('#tablePpOrder').bootstrapTable('getSelections')[0]?$('#tablePpOrder').bootstrapTable('getSelections')[0].ttPpOrderId:-1;
					if(id == '-1'){
						layer.msg('请先选择一条数据！', {
				            icon: 2,
				            time: 1000
				        })
						return;
					} else {
						var orderStatus = $('#tablePpOrder').bootstrapTable('getSelections')[0].order_status;
						if(!(orderStatus == 20 || orderStatus == 30)){
							layer.msg('不是已排产或已激活状态,不能生成SN！', {
					            icon: 2,
					            time: 1000
					        })
							return;
						}
					}
					ids.push(id);
					var order_type = $('#tablePpOrder').bootstrapTable('getSelections')[0].order_type;
					var order_qty = $('#tablePpOrder').bootstrapTable('getSelections')[0].order_qty;
					datas = JSON.stringify({ttPpOrderId : ids,orderType : order_type,orderQty : order_qty});
					var url = '/order/ppordersn/chkOrderSn';
					$.when(Ew.ewAjax(url,datas,'','',true)).done(function(results){
						if(results == 1){
							layer.msg('订单不允许手工添加SN！', {
					            icon: 2,
					            time: 1000
					        })
							return;
						}
						if(results == 2){
							layer.msg('订单SN的数量等于订单数量，不能手工添加SN！', {
					            icon: 2,
					            time: 1000
					        })
							return;
						}
						subDaliogShow('add');
					});
				}
			},{
				btnId:'btnDeleteSub',text:'删除',otherOption:[{id:'tablePpOrder',selMinNum: 1},{id:'tablePpOrderSn',selMinNum: 1}],onClick:function(){
					var rows = $('#tablePpOrderSn').bootstrapTable('getSelections');
					ids = [];
					var flag = false;
					$.each(rows,function(index,row){
						if (row.snStatus=='N'){
							ids.push(row.ttPpOrderSnId);
						} else {
							flag = true;
						}
					});
					if(flag){
						layer.alert('有SN状态不是新增的数据,不能删除！', {icon: 7});
						return;
					}
					datas = JSON.stringify({ttPpOrderSnId : ids});
					var url = '/order/ppordersn/delete'
					$.when(Ew.ewAjax(url,datas)).done(function(results){
						$('#tablePpOrderSn').bootstrapTable('refresh');
					});
				}
			},{
				btnId:'btnDownloadSub',text:'模板下载',otherOption:[{id:'tablePpOrder',selMinNum: 1}],onClick:function(){
					var url ='/order/ppordersn/exportTpl';
			        window.top.location.href = apiUrl +url;
				}
			},{
				btnId:'btnImportSub',text:'导入',onClick:function(){

				}
			},{
				btnId:'btnExportSub',text:'导出',otherOption:[{id:'tablePpOrder',selMinNum: 1}],onClick:function(){
					var ttPpOrderId = $('#tablePpOrder').bootstrapTable('getSelections')[0].ttPpOrderId;
					window.top.location.href= apiUrl +'/order/ppordersn/export?ttPpOrderId='+ttPpOrderId;
				}
			},{
				btnId:'btnPrintSub',text:'打印',otherOption:[{id:'tablePpOrder',selMinNum: 1},{id:'tablePpOrderSn',selMinNum: 1}],onClick:function(){
					var partNo = $('#tablePpOrder').bootstrapTable('getSelections')[0].part_no;
					var partName = $('#tablePpOrder').bootstrapTable('getSelections')[0].part_name;
					var orderNo = $('#tablePpOrder').bootstrapTable('getSelections')[0].order_no;
					var orderType = $('#tablePpOrder').bootstrapTable('getSelections')[0].order_type;
					var rows = $('#tablePpOrderSn').bootstrapTable('getSelections');
					$('#print').children('table').remove();
					$.each(rows,function(index,row){
						var strHTML = "";
						var barcode = row.sn;
						if(index != 0){
							strHTML = strHTML + '<br/>';
						}
						strHTML = strHTML + '<table style=" border:1px solid #F00;" >';
						strHTML = strHTML + '	<tr>';
						strHTML = strHTML + '		<td colspan="4" style=" text-align:center;width:100px;border:1px solid #F00">SN打印</td>';
						strHTML = strHTML + '	</tr>';
						strHTML = strHTML + '	<tr>';
						strHTML = strHTML + '		<td style=" text-align:center;width:100px;border:1px solid #F00">产品编号</td>';
						strHTML = strHTML + '		<td style=" text-align:center;width:100px;border:1px solid #F00">' + partNo + '</td>';
						strHTML = strHTML + '		<td colspan="2" rowspan="4" id="twoBarcode' + index + '" style=" text-align:center;width:100px;border:1px solid #F00"></td>';
						strHTML = strHTML + '	</tr>';
						strHTML = strHTML + '	<tr>';
						strHTML = strHTML + '		<td style=" text-align:center;width:100px;border:1px solid #F00">产品名称</td>';
						strHTML = strHTML + '		<td style=" text-align:center;width:100px;border:1px solid #F00">' + partName + '</td>';
						strHTML = strHTML + '	</tr>';
						strHTML = strHTML + '	<tr>';
						strHTML = strHTML + '		<td style=" text-align:center;width:100px;border:1px solid #F00">订单号</td>';
						strHTML = strHTML + '		<td style=" text-align:center;width:100px;border:1px solid #F00">' + orderNo + '</td>';
						strHTML = strHTML + '	</tr>';
						strHTML = strHTML + '		<td style=" text-align:center;width:100px;border:1px solid #F00">订单类型</td>';
						strHTML = strHTML + '		<td style=" text-align:center;width:100px;border:1px solid #F00">' + orderType + '</td>';
						strHTML = strHTML + '	</tr>';
						strHTML = strHTML + '	</tr>';
						strHTML = strHTML + '		<td style=" text-align:center;width:100px;border:1px solid #F00">SN</td>';
						strHTML = strHTML + '		<td style=" text-align:center;width:100px;border:1px solid #F00">' + barcode + '</td>';
						strHTML = strHTML + '		<td style=" text-align:center;width:100px;border:1px solid #F00">打印时间</td>';
						strHTML = strHTML + '		<td style=" text-align:center;width:100px;border:1px solid #F00">' + '' + '</td>';
						strHTML = strHTML + '	</tr>';
						strHTML = strHTML + '	</tr>';
						strHTML = strHTML + '		<td colspan="4" id="barcode' + index + '" style=" text-align:center;width:100px;border:1px solid #F00"></td>';
						strHTML = strHTML + '	</tr>';
						strHTML = strHTML + '</table>';
						$('#print').append(strHTML);
						jQuery('#twoBarcode' + index).qrcode({
						    text: barcode,
						    width: 40,
						    height: 40
						});
						var canvas = $('#twoBarcode' + index + ' canvas');
						var img = canvas[0].toDataURL("image/png")
						$('#twoBarcode' + index).html("<img src='" + img + "'>")
	//					new QRCode(document.getElementById('twoBarcode' + index), barcode);
						$("#barcode" + index).barcode(barcode, "code128",{
					          output:'css',       //渲染方式 css/bmp/svg/canvas
					          barWidth: 2,        //单条条码宽度
					          barHeight: 30,     //单体条码高度
					          addQuietZone: true  //是否添加空白区（内边距）
					    });
					});
					$("#print").jqprint();
					$('#print').children('table').remove();
				}
			}],
			tableId:'tablePpOrderSn',
			tableValue:{
				queryParams:function(){
					var id = $('#tablePpOrder').bootstrapTable('getSelections')[0]?$('#tablePpOrder').bootstrapTable('getSelections')[0].ttPpOrderId:-1;
					return{ttPpOrderId:id}
				},
				onClickRow:function(item,$element){

				},
				onLoadSuccess:function(){

				},
				url:'/order/ppordersn/queryOrderSN',
				columns:[{
					checkbox: true
				},{
					field: 'sn',
					title: 'SN',
					align: 'center',
					sortable:true,
					width:'120px'
				},{
					field: 'snStatus',
					title: '状态',
					align: 'center',
					sortable:true,
				  width:'120px',
					formatter: function (value, row, index) {
						return re.SN_STATUS[value]
					}
				},{
					field: 'createDate',
					title: '生成时间',
					align: 'center',
					sortable:true,
			     width:'120px'
				},{
					field: 'createBy',
					title: '人员',
					align: 'center',
					sortable:true,
					width:'120px'
				},{
					field: 'type',
					title: '类型',
					align: 'center',
					sortable:true,
					width:'120px',
					formatter: function (value, row, index) {
						return re.SN_TYPE[value]
					}
				}]
			}
		});
	})
})

//子表格
function subDaliogShow(type){
	var title=type=='add'?'新增':'编辑';
	var defaultTable=type=='add'?'':'table2';
	Ew.dialog('subFromEdit',{
		title:title,
		btnValues:[{
			btnId:'btnSaveSub',
			text:'保存',
			formid:'demoform',
			onClick:function(data){
				data.ttPpOrderId = $('#tablePpOrder').bootstrapTable('getSelections')[0].ttPpOrderId ;
				datas = JSON.stringify(data);
				var url = (type=='add'?'/order/ppordersn/add':'/order/ppordersn/update');
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#subFromEdit').modal('hide');
					$('#tablePpOrderSn').bootstrapTable('refresh');
	            });
			}
		},{
			btnId:'btnCancelSub',
			text:'取消'
		}],
		form:{
			formId:'demoform',
			columnNum:1,
			listWidth:250,
			formList:[{
				idName:'textSn',
				text:'SN',
				field:'sn',
				valid:['notEmpty',{type:"string",min:0,max:32}],
				disabled:type=='add'?false:true
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
