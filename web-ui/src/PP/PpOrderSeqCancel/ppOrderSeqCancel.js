$(function(){
	/*公用方法*/
	var mesCom=new mesComMethod();

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
            $('#inputCom31').val('');
		}
	},{
    idName:'inputCom30',
		text:'产品',
		comboUrl:'/worktime/part/publicProduct',
		comboData:
      {
			id:['combo30'],
			field:['tmBasPlantId'],
			other:{partType1:['S','P'],enabled:1}
      },
		comboId:'tmBasPartId',
		comboText:'part',
		field:'tmBasPartId',
    onSuccess:function(data){
		  console.log(data)
    }
	},{
		idName:'combo33',
		text:'订单类型',
		comboUrl:'/system/codeList/getSelect',
		comboId:'no',
		comboText:'name',
		field:'orderType',
		comboData:'ORDER_TYPE',
		n:1
	},{
    idName:'inputCom31',
		text:'工艺路径',
		comboUrl:'/base/route/queryRoute',
		comboData:
      {
			id:['combo30'],
			field:['tmBasPlantId'],
      other:{}
      },
		comboId:'tmBasRouteId',
		comboText:'route',
		field:'tmBasRouteId',
    onSuccess:function(data){
		  console.log(data)
    }
	},{
    idName:'text30',
		text:'订单编号',
		field:'orderNo'
	},{
		idName: 'day30',
		text: '排产上线日期',
		field: 'planDate'
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
    Ew.getDictVal(['ORDER_TYPE', 'ORDER_SOURCE', 'YESORNO','SHIFT_NO', 'ORDER_STATUS'], function (re) {
	Ew.table('.demoTable',{
		btnValues:[{
			btnId:'btnCancel',text:'撤排',isTrue:false,selMinNum:1,onClick:function(){
			    var schedulingData={};
			    var ppOrderSeqsArry=[];
				var rows = $("#table1").bootstrapTable('getSelections');
				
				if(rows.length == 0){
			        mesCom.msgWarning('请先选择需要撤排的数据！');
			        return;
				}
				
			    for(var i=0;i<rows.length;i++){
			        ppOrderSeqsArry.push({
			        	planDate : rows[i].planDate,
			        	shiftno : rows[i].shiftno,
			        	tmBasRouteId : rows[i].tmBasRouteId,
			        	planSeq : rows[i].planSeq,
			        	ttPpOrderSeqId : rows[i].ttPpOrderSeqId,
			            orderNo : rows[i].orderNo
			        });
			    }
			    schedulingData.ppOrderSeqs=ppOrderSeqsArry;
				
			    $.ajax({
			        type: 'POST',
			        url: apiUrl +'/base/pporderseq/cancelSeqs',
			        data: JSON.stringify(schedulingData),
			        contentType:"application/json",
			        dataType: 'JSON',
			        traditional: true,
			        success: function (data) {
			          var errcode = data.code;//在此做了错误代码的判断
			          if(errcode != 10000){
			              mesCom.msgError(data.message);
			              return;
			          }
			          if(data.results){
			              mesCom.msgSuccess(data.message);
			              $('#table1').bootstrapTable('refreshOptions',{pageNumber:1});
			          }

			        }
			    });
			}
		},{
			btnId:'btnActive',text:'激活',isTrue:false,selMinNum:1,onClick:function(){
			    var schedulingData={};
			    var ppOrderSeqsArry=[];
				var rows = $("#table1").bootstrapTable('getSelections');
				
				if(rows.length == 0){
			        mesCom.msgWarning('请先选择需要激活的数据！');
			        return;
				}
				
			    for(var i=0;i<rows.length;i++){
			        ppOrderSeqsArry.push({
			        	planDate : rows[i].planDate,
			        	shiftno : rows[i].shiftno,
			        	tmBasRouteId : rows[i].tmBasRouteId,
			        	planSeq : rows[i].planSeq,
			        	ttPpOrderSeqId : rows[i].ttPpOrderSeqId,
			            orderNo : rows[i].orderNo
			        });
			    }
			    schedulingData.ppOrderSeqs=ppOrderSeqsArry;
				
			    $.ajax({
			        type: 'POST',
			        url: apiUrl +'/base/pporderseq/activeSeqs',
			        data: JSON.stringify(schedulingData),
			        contentType:"application/json",
			        dataType: 'JSON',
			        traditional: true,
			        success: function (data) {
			          var errcode = data.code;//在此做了错误代码的判断
			          if(errcode != 10000){
			              mesCom.msgError(data.message);
			              return;
			          }
			          if(data.results){
			              mesCom.msgSuccess(data.message);
			              $('#table1').bootstrapTable('refresh');
			          }

			        }
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
			onLoadSuccess:function(data){
				var $thAll = $('#table1 thead th');
		        var $th = $('#table1 thead th[data-field="isUrgent"]');
		        var $index = $thAll.index($th);
		        var $tr = $('#table1 tbody tr');
		        $.each($tr,function (i,v) {
		        	var $td = $(v).find('td')[''+$index+''];
		        	if($td){
		        		var $tdText = $($td).html().substr(0,1);
		                if ($tdText === '0') { // 正常
		                } else if ($tdText === '1') { // 紧急
		    				console.log(112);
		                    $(v).css('color','#FF0000');
		                }
		        	}
		        });	    
            },
			url:'/base/pporderseq/querylistByPage',
			columns:[{
		        checkbox: true
		    },{
		        field: 'planDate',
		        title: '排产上线日期',
				align:'center',
  				sortable:true
		    },{
		        field: 'shift',
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
		        field: 'planSeq',
		        title: '序号',
				align:'center',
  				sortable:true
		    },{
		        field: 'orderNo',
		        title: '订单编号',
				align:'center',
  				sortable:true
		    },{
		        field: 'plant',
		        title: '工厂',		
		        align:'center',
  				sortable:true
		    }, {
		        field: 'part',
		        title: '产品',
				align:'center',
  				sortable:true
		    }, {
		        field: 'canOnlineQty',
		        title: '可上线数量',
				align:'center',
  				sortable:true
		    },{
		        field: 'orderStatus',
		        title: '订单状态',
				align:'center',
  				sortable:true,
			    width:'120px',
		        formatter: function (value, row, index) {
		            return re.ORDER_STATUS[value];     
		     }
		    }, {
		        field: 'orderQty',
		        title: '订单数量',
				align:'center',
  				sortable:true
		    },{
		        field: 'tmBasCustomId',
		        title: '客户',
				align:'center',
  				sortable:true
		    }, {
		        field: 'workshop',
		        title: '车间',
				align:'center',
  				sortable:true
		    }, {
		        field: 'planStartDate',
		        title: '预计上线日期',
				align:'center',
  				sortable:true
		    }, {
		        field: 'planEndDate',
		        title: '预计下线日期',
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
		    }, {
		        field: 'isUrgent',
		        title: '紧急状态',
				align:'center',
  				sortable:true,
			    width:'120px',
		        formatter: function (value, row, index) {
		            return re.YESORNO[value];       
		        }
		    }, {
		        field: 'orderSource',
		        title: '来源',
				align:'center',
  				sortable:true,
			    width:'120px',
		        formatter: function (value, row, index) {
		        	  return re.ORDER_SOURCE[value];          
		     }
		    }, {
		        field: 'tmBasBomId',
		        title: 'BOM版本号',
				align:'center',
  				sortable:true
		    }]
		}
	});
    })
});


