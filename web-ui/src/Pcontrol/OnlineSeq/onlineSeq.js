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
		field:'tmBasPartId',
    onSuccess:function(data){
		  console.log(data)
    }
	},{
    idName:'text30',
		text:'订单编号',
		field:'orderNo'
	},{
		idName:'text31',
		text:'SN',
		field:'sn'
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
		listWidth:'300px',
		textValues:mainSearchData,
		btnValues:[{
			btnId:'btnSearch',
			text:'搜索',
			onClick:function(data){
				console.log(data)
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
	Ew.getDictVal(['ORDER_TYPE','SN_STATUS','SHIFT_NO'], function (re) {	
	Ew.table('.demoTable',{
		btnValues:[{
			btnId:'btnExport',text:'导出',isTrue:true,selMinNum:1,onClick:function(){
				var tmBasPlantId = $('#combo30').val();
				var tmBasPartId = $('#inputCom30').val();
				var orderNo = $('#text30').val();
				var sn = $('#text31').val();
				window.top.location.href= apiUrl +'/pcontrol/onlineSeq/export?tmBasPlantId='+tmBasPlantId+'&tmBasPartId='+tmBasPartId+'&orderNo='+orderNo +'&sn='+sn;
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
			url:'/pcontrol/onlineSeq/queryMap',
			columns:[{
				field: 'orderNo',
				title: '订单编号',
  				align:'center',
  				sortable:true
			  },{
				field: 'sn',
				title: 'SN',
	  			align:'center',
	  			sortable:true
			  },{
				field: 'wipStatus',
				title: '生产状态',
		  		align:'center',
		  		sortable:true,
			    width:'120px',
		        formatter: function (value, row, index) {
		            return re.SN_STATUS[value];       
		        }
			  },{
				field: 'part',
				title: '产品',
			  	align:'center',
			  	sortable:true
			  },{
				field: 'planDate',
				title: '工作日历',
				align:'center',
				sortable:true
			  },{
				field: 'shiftno',
				title: '班次',
				align:'center',
				sortable:true,
			    width:'120px',
		        formatter: function (value, row, index) {
		            return re.SHIFT_NO[value];         
		        }
			  },{
				field: 'route',
				title: '工艺路径',
				align:'center',
				sortable:true
			  },{
				field: 'orderType',
				title: '订单类型',
				align:'center',
				sortable:true,
			    width:'120px',
		        formatter: function (value, row, index) {
		            return re.ORDER_TYPE[value];        
		        }
		      },{
		        field: 'plant',
		        title: '工厂',
		  		align:'center',
		  		sortable:true
		      }, {
		        field: 'workshop',
		        title: '车间',
		  		align:'center',
		  		sortable:true
		      }
			]
		}
	});
	})  
});





