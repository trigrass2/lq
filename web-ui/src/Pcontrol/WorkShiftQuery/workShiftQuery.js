

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
		        id:['combo53'],
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
		idName:'combo33',
		text:'工位',
		valid:['notEmpty'],
		comboUrl:'/base/uloc/queryUlocSelectList',
		comboData:{
			id:['combo30','combo31','combo32'],
			field:['pTmBasPlantId','wTmBasWorkshopId','lTmBasLineId'],
			other:{}
		},
		comboId:'ulocNo',
		comboText:'ulocNo',
		field:'ulocNo',
		isSearch:true	
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
				loadData(data);
			}
		}]
	});
	$('#search').attr('style','display:none');
    
	setInterval(function loadData(){
	    var tmBasPlantId=$('#combo30').val();
	    var tmBasLineId=$('#combo32').val();
	    var tmBasWorkshopId=$('#combo31').val();
	    var ulocNo=$('#combo33').val();

	    var data={};
	    data.tmBasPlantId = tmBasPlantId;
	    data.tmBasLineId = tmBasLineId;
	    data.tmBasWorkshopId = tmBasWorkshopId;
	    data.ulocNo = ulocNo; 
	    
	    $.ajax({
	        type: 'POST',
	        contentType: "application/json; charset=gbk",
	        dataType: 'json',
	        async: false,
	        url:  apiUrl+'/pcontrol/workShiftQuery/query',
	        data: JSON.stringify(data),
	        success: function (res) {
	        		$('#workDate').html('');
	         		$('#shiftno').html('');
	         		$('#passNum').html('');
	           		$('#planOnlineNum').html('');
	           		$('#actualOnlineNum').html('');
	        		$('#planOfflineNum').html('');
	        		$('#actualOfflineNum').html('');
	        		$('#errorMsg').html('');
	        		if(res.code != 10000){
	        			$('#errorMsg').html('<font color="red">'+res.message+"</font>");
	        		}
	            $.each(res.results, function(index, item) {
	            	$('#workDate').html(item.workDate);
	             	$('#shiftno').html(item.shiftno);
	             	$('#passNum').html(item.passNum);
	           		$('#planOnlineNum').html(item.planOnlineNum);
	           		$('#actualOnlineNum').html(item.actualOnlineNum);
	        		$('#planOfflineNum').html(item.planOfflineNum);
	        		$('#actualOfflineNum').html(item.actualOfflineNum);
	            });
	            
	        }
	    });
	},1000);
});
