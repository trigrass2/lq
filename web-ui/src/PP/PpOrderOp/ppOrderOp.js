$(function(){
	//搜索条件
	var mainSearchData=[
 {
    idName:'text30',
		text:'订单编号',
		field:'oOrderNo'
	},{
		idName: 'day30',
		text: '操作时间从',
		field: 'planStartDate',
		format:'fulldate',
		limit:{date:'day31',type:'setStartDate'}
	},{
		idName: 'day31',
		text: '操作时间到',
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

	//主表格
	Ew.table('.demoTable',{
		btnValues:[ {
			btnId:'btnExport',text:'导出',selMinNum:1,onClick:function(){
						var oOrderNo = $('#text30').val();
						var planStartDate = $('#day30').val();
						var planEndDate = $('#day31').val();

          window.top.location.href= apiUrl +'/base/pporderop/export?oOrderNo='+oOrderNo+'&planStartDate='+planStartDate+'&planEndDate='+planEndDate;

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

	     },
			url:'/base/pporderop/querylistByPage',
			columns:[{
				checkbox:true
      },{
          field: 'oOrderNo',
          title: '订单编号',
  				align:'center',
  				sortable:true,
          width:'180px',
      },{
          field: 'part',
          title: '产品',
  				align:'center',
  				sortable:true,
          width:'120px'
      },{
          field: 'operationTime',
          title: '操作时间',
  				align:'center',
  				sortable:true,
          width:'120px'
      },{
          field: 'userNo',
          title: '操作人员',
  				align:'center',
  				sortable:true,
          width:'120px'
      }, {
          field: 'orderOpType',
          title: '操作类型',
  				align:'center',
  				sortable:true,
          width:'120px'
      }, {
          field: 'operationDetail',
          title: '操作明细',
  				align:'center',
  				sortable:true,
          width:'120px'
      }, {
          field: 'ip',
          title: 'IP',
  				align:'center',
  				sortable:true,
          width:'120px'
      }, {
          field: 'hostName',
          title: '主机名',
  				align:'center',
  				sortable:true,
          width:'120px'
      }
     ]
		}
	});

})
