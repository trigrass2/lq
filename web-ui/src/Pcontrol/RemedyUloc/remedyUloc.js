$(function(){
	/*公用方法*/
	var mesCom=new mesComMethod();
	
	//搜索条件
	var mainSearchData=[
	{
		idName:'text31',
		valid:['notEmpty'],
		text:'SN',
		field:'sn'
	}
];
	
	//搜索条件
	var mainSearchData2=[
{
	idName:'combo30',
	text:'工厂',
	comboUrl:'/base/plant/publicPlantSelect',
	comboId:'tmBasPlantId',
	comboText:'plant',
	field:'tmBasPlantId',
	onClick:function(data){
		Ew.selectLink({
	        comboUrl:'/base/workshop/publicWorkshopSelect',
	        comboData:JSON.stringify({tmBasPlantId:data.id}),
	        id:['combo31'],
	        comboId:'tmBasWorkshopId',
	        comboText:'workshop'
	    });
  Ew.selectLink({
    comboUrl:'/base/line/publicLineSelect',
    comboData:JSON.stringify({tmBasPlantId:data.id}),
    id:['combo32'],
    comboId:'tmBasLineId',
    comboText:'line'
  });
	}
},{
	idName:'combo31',
	text:'车间',
	comboUrl:'/base/workshop/publicWorkshopSelect',
	comboId:'tmBasWorkshopId',
	comboText:'workshop',
	field:'tmBasWorkshopId',
	onClick:function(data){
		Ew.selectLink({
	        comboUrl:'/base/line/publicLineSelect',
	        comboData:JSON.stringify({tmBasWorkshopId:data.id}),
	        id:['combo32'],
	        comboId:'tmBasLineId',
	        comboText:'line'
	    });
	}
},{
	idName:'combo32',
	text:'产线',
	comboUrl:'/base/line/publicLineSelect',
	comboId:'tmBasLineId',
	comboText:'line',
	field:'tmBasLineId'
},{
	idName:'inputCom31',
	text:'工位',
	valid:['notEmpty'],
	comboUrl:'/base/uloc/queryUlocSelectList',
	comboData:{
		id:['combo30'],
		field:['pTmBasPlantId'],
		other:{ulocType:['N','P','S']}
	},
	comboId:'tmBasUlocId',
	comboText:'ulocNo',
	field:'ulocNo',
	isSearch:true,
	keyTrue:function(value){
	        var data={};
	        data.type = 'A';//补过点
	        data.sn = $('#text31').val();//SN
	        data.ulocNo = $('#inputCom31').val();//扫描工位编号
	        data.tmBasPlantId = $('#combo30').val();//工厂id
	        data.scanPerson = $('#text32').val();//过点人员
	        data.scanTime = $('#day30').val();//过点时间
	        
			if(data.ulocNo == ''){
				  mesCom.msgError('扫描工位不能为空');
				  return;
			}    
			if($('.inputCom ul li').length == 0){
				  mesCom.msgError('输入的工位有误,请确认');
				  return;
			}
			if($('#day30').val() == ''){
			    mesCom.msgError('过点时间不能为空');
			    return;
			}
			if($('#text32').val() == ''){
			    mesCom.msgError('过点人员不能为空');
			    return;
			}	
    
	        $.ajax({
	            url: apiUrl + '/pcontrol/throughUloc/scan',
	            type: "POST",
	            data: JSON.stringify(data),
	            contentType: "application/json; charset=gbk",
	            dataType: "JSON",
	            async: false,
	            success: function (res) {
	                if (res.code == 10000) {
	                    mesCom.msgSuccess(res.message);
	    				$('#table1').bootstrapTable('refresh');
	                } else {
	                    mesCom.msgError(res.message);
	                }
	            }
	        });
	}
},{
	idName: 'day30',
	text: '过点时间',
	field: 'productDate',
	valid:['notEmpty'],
	format:'fulldate',
	limit:{date:'day31',type:'setStartDate'}
},{
	idName:'text32',
	valid:['notEmpty'],
	text:'过点人员',
	field:'productBy'
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
		listWidth:'300px',
		textValues:mainSearchData,
		btnValues:[{
			btnId:'btnSearch',
			text:'搜索',
			onClick:function(data){
				$('#table1').bootstrapTable('refresh');
			}
		},{
			btnId:'btnClear',
			text:'重置',
      tableid:['table1']
		}]
	});

	Ew.search('.demoSearch2',{
		title:'补过点',
		listWidth:'300px',
		textValues:mainSearchData2,
		btnValues:[{
			btnId:'btnScan',text:'过点',isTrue:true,selMinNum:1,onClick:function(){	
		        var data={};
		        data.type = 'A';//补过点
		        data.sn = $('#text31').val();//SN
		        data.ulocNo = $('#inputCom31').val();//扫描工位编号
		        data.tmBasPlantId = $('#combo30').val();//工厂id
		        data.scanPerson = $('#text32').val();//过点人员
		        data.scanTime = $('#day30').val();//过点时间
		        
				if(data.ulocNo == ''){
					  mesCom.msgError('扫描工位不能为空');
					  return;
				}    
				if($('.inputCom ul li').length == 0){
					  mesCom.msgError('输入的工位有误,请确认');
					  return;
				}
				if($('#day30').val() == ''){
				    mesCom.msgError('过点时间不能为空');
				    return;
				}
				if($('#text32').val() == ''){
				    mesCom.msgError('过点人员不能为空');
				    return;
				}	
		        
		        $.ajax({
		            url: apiUrl + '/pcontrol/throughUloc/scan',
		            type: "POST",
		            data: JSON.stringify(data),
		            contentType: "application/json; charset=gbk",
		            dataType: "JSON",
		            async: false,
		            success: function (res) {
		                if (res.code == 10000) {
		                    mesCom.msgSuccess(res.message);
		    				$('#table1').bootstrapTable('refresh');
		                } else {
		                    mesCom.msgError(res.message);
		                }
		            }
		        });
			}
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
	Ew.getDictVal(['ORDER_TYPE','SCAN_TYPE'], function (re) {	
	Ew.table('.demoTable',{
		btnValues:[{
			btnId:'btnDownload',text:'模版下载',isTrue:true,selMinNum:1,onClick:function(){
			
			}
		},{
			btnId:'btnImport',text:'导入',isTrue:true,selMinNum:1,onClick:function(){
					
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
			url:'/pcontrol/mProcess/queryMap',
			columns:[
			  {
				field: 'part',
				title: '产品',
			  	align:'center',
			  	sortable:true
			  },{
				field: 'ulocNo',
				title: '当前站点',
				align:'center',
				sortable:true
			  },{
				field: 'productDate',
				title: '过点时间',
				align:'center',
				sortable:true
			  },{
				field: 'scanType',
				title: '过点类型',
				align:'center',
				sortable:true,
				width:'120px',
			    formatter: function (value, row, index) {
			        return re.SCAN_TYPE[value];  
			    }
			  },{
				field: 'productBy',
				title: '操作人员',
				align:'center',
				sortable:true
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
		        field: 'defectiveQyt',
		        title: '缺陷数量',
		  		align:'center',
		  		sortable:true
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
		      },{
		        field: 'line',
		        title: '产线',
		  		align:'center',
		  		sortable:true
		      }
			]
		}
	});
  }) 	
});

