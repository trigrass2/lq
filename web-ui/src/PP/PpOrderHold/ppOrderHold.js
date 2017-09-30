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
		comboUrl:'/worktime/part/publicProduct',
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
	},{
		idName:'text333333',
		text:'HOLD状态',
		field:'holdStatus',
		defaultValue:0,
		moreSearch:true
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
	*columns：为表格的参数值
	*
	*
	**/
Ew.getDictVal(['ORDER_TYPE', 'ORDER_STATUS', 'YESORNO'], function (re) {
	//主表格
	Ew.table('.demoTable',{
		btnValues:[{
	    idName:'text3033',
			text:'<span style="color:red;margin-left:20px;">*</span>HOLD理由',
			field:'holdNotes'
		},{
			btnId:'btnHoldOrder',text:'HOLD',otherOption:[{id:'table1',selMinNum: 1},{textId:'text3033'}],onClick:function(){
				var rows = $('#table1').bootstrapTable('getSelections');
				var ids = [];
				$.each(rows,function(index,row){
					ids.push(row.ttPpOrderId);
				});

				ids.push($('#text3033').val());
				datas = JSON.stringify(ids);
				var url = '/order/pporder/orderHold';
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					     $('#text3033').val('');
					     $('#table1').bootstrapTable('refresh');
							 });
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

	     },
			url:'/order/pporder/querylistHoldByPage',
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
			},{
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
      },{
          field: 'route',
          title: '工艺路径',
  				align:'center',
  				sortable:true,
          width:'120px'
      }
     ]
		}
	});
 })
})
