

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
	
	
	
	//生产序列表格
	Ew.table('.demoTable',{
		btnValues:[],
		tableId:'tb_seq',
		tableValue:{
			searchParams:mainSearchData,
			queryParams:function(){
		  		$('#errorMsg').html('');
				return{}
			},
			onClickRow:function(item,$element){
 			},
			onLoadSuccess:function(){
				
			},
	        onErr:function (res){
        		if(res.code != 10000){
        			$('#errorMsg').html('<font color="red">'+res.message+"</font>");
        		}
	        },
			url:'/pcontrol/arrivedQueue/querySeq',
			columns:[{
          field: 'routeSeq',
          title: '序号',
  		  align:'center',
  		  sortable:true,
	      width:'120px',
          formatter: function (value, row, index) {  
      	   	return index + 1;
        }  
      }, {
          field: 'route',
          title: '工艺路径',
  		  align:'center',
  		  sortable:true
      },{
          field: 'sn',
          title: 'SN',
  		  align:'center',
  		  sortable:true
      },{
          field: 'part',
          title: '产品',
  		  align:'center',
  		  sortable:true
      }, {
          field: 'orderNo',
          title: '订单编号',
  		  align:'center',
  		  sortable:true
      },{
          field: 'productDate',
          title: '过点时间',
  		  align:'center',
  		  sortable:true
      },{
          field: 'defectiveQyt',
          title: '缺陷数量',
  		  align:'center',
  		  sortable:true
      }]
	 }
	});
	
	
	//订单信息表格
	Ew.getDictVal(['SHIFT_NO'], function (re) {	
	Ew.table('.demoTable2',{
		btnValues:[],
		tableId:'tb_order',
		tableValue:{
			searchParams:mainSearchData,
			queryParams:function(){
				return{}
			},
			onClickRow:function(item,$element){
 			}, 
			onLoadSuccess:function(){},
	        onErr:function (res){
	     		$('#errorMsg').html('');
        		if(res.code != 10000){
        			$('#errorMsg').html('<font color="red">'+res.message+"</font>");
        		}
	        },
			url:'/pcontrol/arrivedQueue/queryOrder',
			columns:[{
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
          field: 'part',
          title: '产品',
  		  align:'center',
  		  sortable:true
      },{
          field: 'orderQty',
          title: '订单数量',
  		  align:'center',
  		  sortable:true
      },{
          field: 'canOnlineQty',
          title: '可上线数量',
  		  align:'center',
  		  sortable:true
      },{
          field: 'plant',
          title: '工厂',
  		  align:'center',
  		  sortable:true
      },{
          field: 'planDate',
          title: '排产上线日期',
  		  align:'center',
  		  sortable:true
      },{
          field: 'shiftno',
          title: '班次',
  		  align:'center',
  		  sortable:true,
	      formatter: function (value, row, index) {
	        return re.SHIFT_NO[value];       
	      }
      }]
	 }
	});
 }) 
    
	setInterval(function loadData(){
		$("#tb_seq").bootstrapTable('refreshOptions', {pagination:false});
		$("#tb_order").bootstrapTable('refreshOptions', {pagination:false});
	},5000);

});
