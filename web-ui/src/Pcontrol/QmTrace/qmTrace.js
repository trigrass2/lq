layui.use('layer',function(){
	layer=layui.layer;
});
var lock=false;
var passPointFlag=0;
var textTtPpOrderSnId='';
var textTmBasRouteId='';

$(function(){
	//搜索条件
	var tableSearchData=[];
	var mainSearchData=[{
		idName:'comboPlant',
		text:'工厂',
		comboUrl:'/base/plant/publicPlantSelect',
		comboId:'tmBasPlantId',
		comboText:'plant',
		valid:['notEmpty'],
		field:'tmBasPlantId',
		onClick:function(data){
			$('#comboWorkshop').val();
			$('#comboLine').val();
			$('#comboUloc').val();
			Ew.selectLink({
		        comboUrl:'/base/workshop/publicWorkshopSelect',
		        comboData:JSON.stringify({tmBasPlantId:data.id}),
		        id:['comboWorkshop'],
		        comboId:'tmBasWorkshopId',
		        comboText:'workshop'
		    });
			Ew.selectLink({
				comboUrl:'/base/line/publicLineSelect',
				comboData:JSON.stringify({tmBasPlantId:data.id}),
				id:['comboLine'],
				comboId:'tmBasLineId',
				comboText:'line'
			});
			Ew.selectLink({
				comboUrl:'/base/uloc/queryUlocSelectForInputWithLineId',
				comboData:JSON.stringify({pTmBasPlantId:data.id}),
				id:['comboUloc'],
				comboId:'tmBasUlocId',
				comboText:'ulocNo'
			});
		}
	},{
		idName:'comboWorkshop',
		text:'车间',
		comboUrl:'/base/workshop/publicWorkshopSelect',
		comboId:'tmBasWorkshopId',
		comboText:'workshop',
		field:'tmBasWorkshopId',
		onClick:function(data){
			Ew.selectLink({
		        comboUrl:'/base/line/publicLineSelect',
		        comboData:JSON.stringify({tmBasWorkshopId:data.id}),
		        id:['comboLine'],
		        comboId:'tmBasLineId',
		        comboText:'line'
		    });
			Ew.selectLink({
				comboUrl:'/base/uloc/queryUlocSelectForInputWithLineId',
				comboData:JSON.stringify({wTmBasWorkshopId:data.id}),
				id:['comboUloc'],
				comboId:'tmBasUlocId',
				comboText:'ulocNo'
			});
		}
	},{
		idName:'comboLine',
		text:'产线',
		comboUrl:'/base/line/publicLineSelect',
		comboId:'tmBasLineId',
		comboText:'line',
		field:'tmBasLineId',
		onClick:function(data){
			Ew.selectLink({
				comboUrl:'/base/uloc/queryUlocSelectForInputWithLineId',
				comboData:JSON.stringify({lTmBasLineId:data.id}),
				id:['comboUloc'],
				comboId:'tmBasUlocId',
				comboText:'ulocNo'
			});
		}
	
	},{
		idName:'comboUloc',
		text:'工位',
		comboUrl:'/base/uloc/queryUlocSelectForInputWithLineId',
		comboData:{
			id:['comboPlant','comboWorkshop','comboLine'],
			field:['pTmBasPlantId','wTmBasWorkshopId','lTmBasLineId'],
			other:{}
		},
		comboId:'tmBasUlocId',
		comboText:'ulocNo',
		field:'tmBasUlocId',
		valid:['notEmpty'],
		isSearch:true
	},{
		idName:'textSN',
		text:'SN',
		comboId:'sn',
		comboText:'sn',
		field:'sn',
		keyTrue:function(value){
			$('#textOrder').val('');
			$("#textPart").val('');
			$("#SN").val('');
			textTtPpOrderSnId='';
			textTmBasRouteId='';
			if($('#comboPlant').val()==null||$('#comboPlant').val()==""){
				Ew.layer.msg('请选择工厂！',{icon:7,time:1000});
				$('#textSN').val('');
				return
			}
			if($('#comboUloc').val()==null||$('#comboUloc').val()==""){
				Ew.layer.msg('请选择工位！',{icon:7,time:1000});
				$('#textSN').val('');
				return
			}
			var sn=$("#textSN").val();
			var flag=false;
			var datas={};
			datas.ulocNo = $('#comboUloc').find("option:selected").text();//扫描工位编号
			datas = JSON.stringify(datas);
			var url = '/system/qmTrace/querySeq';
			$.when(Ew.ewAjax(url,datas)).done(function(results){
				for(var i=0;i<results.length;i++){
					if(sn==results[i].sn){
						$('#textPart').val(results[i].part);
						$('#textOrder').val(results[i].orderNo);
						textTtPpOrderSnId=results[i].ttPpOrderSnId;
						textTmBasRouteId=results[i].tmBasRouteId;
						passPointFlag=1;
			        		  //查询内容
			        		    tableSearchData={'tmBasUlocId':$('#comboUloc').val(),'ttPpOrderSnId':textTtPpOrderSnId,'tmBasRouteId':textTmBasRouteId};
		        				 var opt = {
		        						      url:apiUrl+'/system/qmTrace/queryBomTracePartlist',
		        						      silent: true,
		        						      query:tableSearchData
		        						    };
		        					$('#tableQmTrace').bootstrapTable('refresh',opt);
						flag=true;
					}
				}
				if(!flag){
					layer.msg("该产品不在本工位的到达序列上！请扫描其他产品！",{icon:2,time:2000});
					 $("#textSN").select();
//					$('#textOrder').val('');
//					$("#textPart").val('');
//					$("#SN").val('');
//					textTtPpOrderSnId='';
//					textTmBasRouteId='';
//					$('#tableQmTrace').bootstrapTable('refresh');
//					return;
				}
			});
		}
	},{
		idName:'textOrder',
		text:'订单编号',
		disabled:true
	},{
		idName:'textPart',
		text:'产品',
		disabled:true
	}]

	Ew.search('.searchForm',{
		title:'查询',
		textValues:mainSearchData,
		btnValues:[{
			btnId:' ',
			text:''
		}]
	});
	//主表格
Ew.getDictVal(['PART_TYPE3','SN_LABEL_PROPERTY'], function (re) {	
	Ew.table('.mainTable',{
		btnValues:[{
			btnId:'btnBatchMerger',text:'批次合并',isTrue:true,otherOption:[{id:'tableQmTrace',selectNum: 1}],onClick:function(){
				var row= $('#tableQmTrace').bootstrapTable('getSelections')[0];
				if(row.partType3=="A"){
					 layer.msg("精确追溯的零件不可进行批次合并！",{icon:7,time:2000});
					return;
				}
				if(row.qty<=2){
					 layer.msg("需求数量小于2的零件不可进行批次合并！",{icon:7,time:2000});
						return;
				}
				if(row.sn==null||row.sn==""){
					layer.msg("该零件尚未绑定sn，不可进行批次合并！",{icon:7,time:2000});
					return;
				}
				if(row.sn!=null&row.sn!=""){
					var singleSn=row.sn.split(",");
					if(singleSn.length>=row.qty){
						layer.msg("该零件绑定sn数量已经达到最大值，不可再进行批次合并！",{icon:7,time:2000});
						return;
					}
					}
				daliogShowBatchMerger(row.sn);
				}
		},{
			btnId:'btnRebind',text:'重新绑定开关',otherOption:[{}],onClick:function(){
				lock=!lock;
				if(lock){
					$("#btnRebind").css("background","green");
				}else{
					$("#btnRebind").css("background","#337ab7");
				}
			}
	},{
		btnId:'butForcePass',text:'完成',isTrue:true,otherOption:[{}],onClick:function(){
			var  flag=true;
			passPoint(flag);
			if(flag){
				$("#textSN").val('');
				$('#textOrder').val('');
				$("#textPart").val('');
				$("#SN").val('');
				textTtPpOrderSnId='';
				textTmBasRouteId='';
				 tableSearchData={'tmBasUlocId':$('#comboUloc').val(),'ttPpOrderSnId':textTtPpOrderSnId,'tmBasRouteId':textTmBasRouteId};
				var opt = {
						      url:apiUrl+'/system/qmTrace/onlyQueryBomTracePartlist',
						      silent: true,
						      query:tableSearchData
						    };
					$('#tableQmTrace').bootstrapTable('refresh',opt);
			}
		}
	}],
		tableId:'tableQmTrace',
		tableValue:{
			searchParams:tableSearchData,
			queryParams:function(){
				return{}
			},
			onClickRow:function(item,$element){

			},
			onLoadSuccess:function(){
				var sn=$("#SN").val();
				var allTableData = $('#tableQmTrace').bootstrapTable('getData');//获取表格的所有内容行  
				var flag = true; 
				var match=1;
				if(allTableData!=null&allTableData!=""){
				for( i=0;i<allTableData.length;i++){  
				    var row=allTableData[i];
				    if(row.qty>row.matchQty){
				    	flag=false;
				    }
				    if(row.matchQty<=0){
				    	match=row.matchQty
				    }
				}  
				if(flag&&match>0){
					if(passPointFlag==1){
						 passPoint(flag);
						 $("#textSN").select();
						 if(flag){
						 $("#SN").val('');
						}
					}
					
				}
				}
				passPointFlag=0;
			},
			url:'/system/qmTrace/queryBomTracePartlist',
			columns:[{
				checkbox: true
			},{
				field: 'tracetype',
				title: '类型',
				align: 'center',
				sortable:true
			},{
				field: 'part',
				title: '零件',
				align: 'center',
				sortable:true
			},{
				field: 'qty',
				title: '需求数量',
				align: 'center',
				sortable:true
			},{
				field: 'matchQty',
				title: '已匹配数量',
				align: 'center',
				sortable:true
			},{
				field: 'partType3',
				title: '追溯属性',
				align: 'center',
				formatter: function (value, row, index) {
			           return re.PART_TYPE3[value];
		          },
				sortable:true
			},{
				field: 'sn',
				title: 'SN',
				align: 'center',
				formatter:function (value, row, index) {
					if(row.sn!=null&row.sn!=""){
					var singleSn=row.sn.split(",");
					var disPlayText="";
					if(singleSn.length>1){
					for(i=0;i<singleSn.length-1;i++){
						disPlayText+='<a class="route-href" href="javascript:void(0)" onclick="rebinding(\'' + row.part +'\',\''+row.tmBasPartId +'\',\''+row.ttPpOrderSnId+'\',\''+  singleSn[i]+'\')"><font>' + singleSn[i]+ '</font></a>'+',';
					}
					}
					var snLength=singleSn.length;
					disPlayText+='<a class="route-href" href="javascript:void(0)" onclick="rebinding(\'' + row.part +'\',\''+row.tmBasPartId +'\',\''+row.ttPpOrderSnId +'\',\''+ singleSn[snLength-1] +'\')"><font>' + singleSn[snLength-1]+ '</font></a>'
	                  return disPlayText;
					}
	             },
				sortable:true
			},{
				field: 'remind',
				title: '提示',
				align: 'center',
				sortable:true
			}]
		}
	});   });
})
//批次合并窗口
function daliogShowBatchMerger(sn){
	var title='批次合并绑定';
	var defaultTable='tableQmTrace';
	Ew.dialog('fromSn',{
		title:title,
		btnValues:[{
			btnId:'btnSaveSub',
			text:'确定批次合并',
			formid:'demoformBatchMerger',
			onClick:function(data){
				var row= $('#tableQmTrace').bootstrapTable('getSelections')[0];
				data.tmBasUlocId=$('#comboUloc').val();
				var singleSn=sn.split(",");
				for(var i=0;i<singleSn.length;i++){
					if(data.newSn==singleSn[i]){
						 layer.msg("新旧sn重复，请勿重复！",{icon:7,time:2000});
						return;
					}
					}
				datas = JSON.stringify(data);
				var url = '/system/qmTrace/batchMerger'
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#fromSn').modal('hide');
					passPointFlag=0;
					 tableSearchData={'tmBasUlocId':$('#comboUloc').val(),'ttPpOrderSnId':textTtPpOrderSnId,'tmBasRouteId':textTmBasRouteId};
					  var opt = {
							      url:apiUrl+'/system/qmTrace/onlyQueryBomTracePartlist',
							      silent: true,
							      query:tableSearchData
							    };
						$('#tableQmTrace').bootstrapTable('refresh',opt);
	             });
			}
		},{
			btnId:'btnCancelSub',
			text:'取消'
		}],
		form:{
			formId:'demoformBatchMerger',
			columnNum:2,
			listWidth:280,
			formList:[{
				idName:'textpartI',
				text:'零件',
				comboId:'part',
				comboText:'part',
				field:'part',
				valid:[''],
				defaultValue:$('#tableQmTrace').bootstrapTable('getSelections')[0].part,
				disabled:true
			
		   },{
				idName:'textTmBasPartIdI',
				text:'零件id',
				comboId:'tmBasPartId',
				field:'tmBasPartId',
				valid:[''],
				defaultValue:$('#tableQmTrace').bootstrapTable('getSelections')[0].tmBasPartId,
				disabled:true,
				hidden:true
		   },{
				idName:'textTtPpOrderIdI',
				text:'订单id',
				comboId:'ttPpOrderSnId',
				field:'ttPpOrderSnId',
				valid:[''],
				disabled:true,
				hidden:true
		   },{
				idName:'textSnI',
				text:'批次合并SN',
				comboId:'sn',
				comboText:'sn',
				field:'batchMerger',
				defaultValue:$('#tableQmTrace').bootstrapTable('getSelections')[0].sn,
				disabled:true
			
		   },{
				idName:'textNewSnI',
				text:'请扫描新的SN',
				comboId:'newSn',
				comboText:'newSn',
				field:'newSn',
				valid:['notEmpty']
		   }
			],
			defaultTable:defaultTable
		}
	})

}
//重新绑定窗口
function daliogShowRedind(part,tmBasPartId,ttPpOrderSnId,sn){
	var title='重新绑定';
	var defaultTable='tableQmTrace';
	Ew.dialog('fromSn',{
		title:title,
		btnValues:[{
			btnId:'btnSaveSub',
			text:'确定重新绑定',
			formid:'demoform',
			onClick:function(data){
				
				data.tmBasUlocId=$('#comboUloc').val();
				var singleSn=sn.split(",");
				for(var i=0;i<singleSn.length;i++){
					if(data.newSn==singleSn[i]){
						 layer.msg("新旧sn重复，请勿重复！",{icon:7,time:2000});
						return;
					}
					}
				datas = JSON.stringify(data);
				var url ='/system/qmTrace/rebinding';
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					
					if(results<0){
						$("#textnewSnII").focus(function(){
							  this.select();
						 });
							 layer.msg("绑定失败：请重新扫描正确sn",{icon:2,time:2000});
								return;
						}
					$('#fromSn').modal('hide');
					passPointFlag=0;
					 tableSearchData={'tmBasUlocId':$('#comboUloc').val(),'ttPpOrderSnId':textTtPpOrderSnId,'tmBasRouteId':textTmBasRouteId};
					  var opt = {
							      url:apiUrl+'/system/qmTrace/onlyQueryBomTracePartlist',
							      silent: true,
							      query:tableSearchData
							    };
						$('#tableQmTrace').bootstrapTable('refresh',opt);
	             });
			}
		},{
			btnId:'btnCancelSub',
			text:'取消'
		}],
		form:{
			formId:'demoform',
			columnNum:2,
			listWidth:280,
			formList:[{
				idName:'textpartII',
				text:'零件',
				comboId:'part',
				comboText:'part',
				field:'part',
				valid:[''],
				defaultValue:part,
				disabled:true
		   },{
				idName:'textTmBasPartIdII',
				text:'零件id',
				comboId:'tmBasPartId',
				field:'tmBasPartId',
				valid:[''],
				defaultValue:tmBasPartId,
				disabled:true,
				hidden:true
		   },{
				idName:'textTtPpOrderSnIdII',
				text:'订单id',
				comboId:'ttPpOrderSnId',
				field:'ttPpOrderSnId',
				valid:[''],
				defaultValue:ttPpOrderSnId,
				disabled:true,
				hidden:true
		   },{
				idName:'textSnII',
				text:'解绑SN',
				comboId:'ttQmSnNo',
				field:'ttQmSnNo',
				defaultValue:sn,
				disabled:true
		   },{
				idName:'textnewSnII',
				text:'请扫描新的SN',
				comboId:'newSn',
				field:'newSn',
				defaultValue:' ',
				valid:['notEmpty']
		   }
			],
			defaultTable:defaultTable
		}
	})
}

		$("#SN").keydown(function(e){
			var curKey = e.which; 
			if(curKey == 13){ 
				var sn=$("#SN").val();
				var data={'tmBasUlocId':$('#comboUloc').val(),'ttPpOrderSnId':textTtPpOrderSnId,'tmBasRouteId':textTmBasRouteId,'tmBasRouteId':textTmBasRouteId,"ttQmSnNo":sn};
				var datas=JSON.stringify(data);
				var url="/system/qmTrace/traceOption";
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$("#SN").select();
					passPointFlag=1;
					 tableSearchData={'tmBasUlocId':$('#comboUloc').val(),'ttPpOrderSnId':textTtPpOrderSnId,'tmBasRouteId':textTmBasRouteId};
					var opt = {
							    url:apiUrl+'/system/qmTrace/onlyQueryBomTracePartlist',
							    silent: true,
							    query:tableSearchData
							  };
					$('#tableQmTrace').bootstrapTable('refresh',opt);
					
				})
			}
		})
		
function rebinding(part,tmBasPartId,ttPpOrderSnId,singleSn){
	if(!lock){
		 layer.msg("请先获取重新绑定权限,点击重新绑定开关按钮！",{icon:7,time:2000});
			return;
	}
	daliogShowRedind(part,tmBasPartId,ttPpOrderSnId,singleSn);
}

var passPoint=function(flag){
	 var datas={};
     datas.type = 'N';//正常过点
     datas.sn = $('#textSN').val();//SN
     datas.ulocNo = $('#comboUloc').find("option:selected").text();//扫描工位编号
     datas.tmBasPlantId = $('#comboPlant').val();//工厂id
	  $.ajax({
      url: apiUrl + '/pcontrol/throughUloc/scan',
      type: "POST",
      data: JSON.stringify(datas),
      contentType: "application/json; charset=gbk",
      dataType: "JSON",
      async: false,
      success: function (res) {
          if (res.code==10000) {
        	  layer.msg(res.message,{icon:1,time:2000});
        	  flag=true
          } else {
        	  layer.msg(res.message,{icon:2,time:2000});
        	  flag=false;
          }
      }
  });
};