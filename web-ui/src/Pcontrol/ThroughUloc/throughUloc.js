/*公用方法*/
var mesCom=new mesComMethod();

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
    		$("#tb_seq").bootstrapTable('refreshOptions', {pagination:false});
    		$("#tb_order").bootstrapTable('refreshOptions', {pagination:false});
    		$("#passQueue").bootstrapTable('refreshOptions', {pagination:false});
		}
	},{
    idName:'text31',
		text:'SN',
		field:'sn',
		keyTrue:function(value){		
	        var data={};
	        data.type = 'N';//正常过点
	        data.sn = $('#text31').val();//SN
	        data.ulocNo = $('#inputCom31').val();//扫描工位编号
	        data.tmBasPlantId = $('#combo30').val();//工厂id

			if(data.ulocNo == ''){
				  mesCom.msgError('扫描工位不能为空');
				  return;
			}
	        
			if($('.inputCom ul li').length == 0){
				  mesCom.msgError('输入的工位有误,请确认');
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
                		$("#tb_seq").bootstrapTable('refreshOptions', {pagination:false});
                		$("#passQueue").bootstrapTable('refreshOptions', {pagination:false});
                    } else {
                        mesCom.msgError(res.message);
                    }
                }
            });
		}
	},{
    idName:'text32',
		text:'产品',
		field:'partNo',
		disabled:true
	},{
    idName:'text33',
		text:'订单编号',
		field:'orderNo',
		disabled:true
	}
];
	
	Ew.search('.demoSearch',{
		title:'查询',
		textValues:mainSearchData,
		btnValues:[]
	});
	
	
	
	//生产序列表格
	Ew.getDictVal(['SHIFT_NO','SCAN_TYPE'], function (re) {	
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
	        	
	        },
			url:'/pcontrol/arrivedQueue/querySeq',
			columns:[
	      {
           title: '序号',
 		   align:'center',
  		   sortable:true,
 	       width:'120px',
           formatter: function (value, row, index) {  
        	   	return index + 1;
          }  
       },{
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
  	      width:'120px',
	      formatter: function (value, row, index) {
	          return re.SHIFT_NO[value];  
	      }
      }]
	 }
	});
	
	
	
	
	//通过队列表格
	Ew.table('.demoTable3',{
		btnValues:[],
		tableId:'passQueue',
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
	        	
	        },
			url:'/pcontrol/passQueue/querySeq',
			columns:[ {
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
          title: '过点人员',
  		  align:'center',
  		  sortable:true
      }, {
          field: 'orderNo',
          title: '订单编号',
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
}) 	
   
	setInterval(function loadData(){
		$("#tb_seq").bootstrapTable('refreshOptions', {pagination:false});
		$("#tb_order").bootstrapTable('refreshOptions', {pagination:false});
		$("#passQueue").bootstrapTable('refreshOptions', {pagination:false});
        $.ajax({
            url: apiUrl + '/order/ppordersn/queryOrderAndPartBySn',
            type: "POST",
            data: JSON.stringify({'sn' : $('#text31').val()}),
            contentType: "application/json; charset=gbk",
            dataType: "JSON",
            async: false,
            success: function (res) {
            	$('#text32').val('');
         		$('#text33').val('');
                if (res.code == 10000) {
                	if(res.results.length == 1){
                		$('#text32').val(res.results[0].part_no+"-"+res.results[0].part_name);
                 		$('#text33').val(res.results[0].order_no);
                	}
                }
            }
        });
		
	},5000);
});
