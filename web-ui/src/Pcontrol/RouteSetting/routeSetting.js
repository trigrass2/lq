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
		valid:['notEmpty'],
		onClick:function(data){
			$('#inputComRoute').val('');
			$('#combo31').select2('val',['']);
		}
	},{
    idName:'combo31',
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
		isSearch:true,
    onSuccess:function(data){
		  console.log(data)
    }
	},{
    idName:'text30',
		text:'订单编号',
		field:'orderNo'
	},{
		idName:'combo32',
		text:'当前站点',
		comboUrl:'/base/uloc/queryUlocSelectList',
		comboData:{
			id:['combo30'],
			field:['pTmBasPlantId'],
			other:{}
		},
		comboId:'tmBasUlocId',
		comboText:'ulocNo',
		field:'tmBasUlocId',
		isSearch:true
	},{
		idName:'text31',
		text:'SN',
		field:'sn'
	},{
		idName:'combo33',
		text:'生产状态',
		comboUrl:'/system/codeList/getSelect',
		comboId:'no',
		comboText:'name',
		field:'wipStatus',
		comboData:'SN_STATUS',
		n:1
	},{
		idName:'inputComRoute',
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
		isSearch : true,
		onSuccess:function(data){
		  console.log(data)
		},
		onClick:function(data){
			$('#combo31').select2('val',['']);
		}
	},{
		idName:'combo34',
		text:'过点类型',
		comboUrl:'/system/codeList/getSelect',
		comboId:'no',
		comboText:'name',
		field:'offlineType',
		comboData:'SCAN_TYPE',
		n:1
	},{
		idName: 'day30',
		text: '过点时间从',
		field: 'productStartDate',
		defaultValue:Ew.getNowday('')+' 00:00:00',
		format:'fulldate',
		limit:{date:'day31',type:'setStartDate'}
	},{
		idName: 'day31',
		text: '过点时间到',
		field: 'productEndDate',
		defaultValue:Ew.getNowday('')+' 23:59:59',
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
	Ew.getDictVal(['ORDER_TYPE','SN_STATUS','SHIFT_NO','SCAN_TYPE'], function (re) {	
	Ew.table('.demoTable',{
		btnValues:[{
			btnId:'btnRouteEdit',text:'工艺路径变更',otherOption:[{id:'table1',selectNum: 1}],onClick:function(){
				daliogShow();
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
			url:'/pcontrol/manufacturing/queryMap',
			columns:[{
				checkbox: true
			},{
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
				field: 'scanType',
				title: '过点类型',
				align:'center',
				sortable:true,
			    width:'120px',
		        formatter: function (value, row, index) {
		        	   return re.SCAN_TYPE[value];       
		        }
			  },{
				field: 'ulocNo',
				title: '当前站点',
				align:'center',
				sortable:true
			  },{
				field: 'routeSeq',
				title: '站点顺序',
				align:'center',
				sortable:true
			  },{
				field: 'productDate',
				title: '过点时间',
				align:'center',
				sortable:true
			  },{
				field: 'productBy',
				title: '操作人员',
				align:'center',
				sortable:true
			  },{
				field: 'workDate',
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
				field: 'nextUlocNo',
				title: '下一站点',
				align:'center',
				sortable:true
			  },{
				field: 'nextSeq',
				title: '下一站点顺序',
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
		      }
			]
		}
	});
  }) 
});


/*
*
*弹出框
*el：为html标签
*
*option(参数设置)：
*@title为弹出框标题
*@btnValues为弹出框最底下的按钮
*btnId为按钮id
*text为按钮名称
*如果text为重置，会自动重置formid的表单
*如果text为取消，自动关闭弹出框
*formid为点击时候需要验证form表单的form的id
*onClick为点击事件为函数function(data){}为form表单里的{field:value,......}
*
*@form如果有form自动内部加载form表单form表单参数详见Ew.form函数
**/

/*
*
*表单form及验证
*el：为html标签
*
*option(参数设置)：
*@formid为form表单id
*@columnNum为列数
*@formList表单条件参数
*text：为页面显示的条件名称，
*field：为当前条件的字段名称，取决后台需求，
*idName：为input的id，input的类型取决于id名包含字段，
*包含text，为输入文本框，
*包含combo，为下拉框，
*下拉数据调用后台方法
*comboUrl为接口地址，comboData为接口条件，comboId接口id字段，comboText接口text字段
*下拉数据调用本地方法，
*comboData：[{id:1,text:'2222'}],内容为写死的json
*包含day为时间控件年月日
*
*valid为验证条件，如果有触发验证信息，为数组
*notEmpty为必填，如果为对象直接验证对象里的信息
*{callback:{
message:'对',
callback:function(value,validator){
returnvalue==100||value=='';
}
}}
callback为自定义验证message为验证错误文字显示callback为函数value为框里的值return返回条件为false为错true为对

更多详见getInputhl
*
*
**/

function daliogShow(){
	var title='工艺路径变更';
	var defaultTable='table1';
	Ew.dialog('demoadd',{
		title:title,
		btnValues:[{
			btnId:'btnSave',
			text:'保存',
			formid:'demoform',
			onClick:function(data){		
				datas = JSON.stringify(data);
				var url = "/pcontrol/routeSetting/updateRoute";
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#demoadd').modal('hide');
					$('#table1').bootstrapTable('refresh');
	             });
			}
		},{
			btnId:'btnCancel',
			text:'取消'
		}],
		form:{
			formId:'demoform',
			columnNum:2,
			listWidth:400,
			formList:[{
				idName:'comboPlantI',
				text:'工厂',
				comboUrl:'/base/plant/publicPlantSelect',
				comboId:'tmBasPlantId',
				comboText:'plant',
				field:'tmBasPlantId',
				valid:['notEmpty'],
				disabled:true,
				defaultValue:$('#table1').bootstrapTable('getSelections')[0].tmBasPlantId,
				hidden:true	,
				onClick:function(data){
		
				}
			},{
				idName:'comboRouteI',
				text:'工艺路径',
				comboUrl:'/base/route/queryRoute',
				comboData:
		       {
					id:['comboPlantI'],
					field:['tmBasPlantId'],
					other:{routeStatus: 'P'}
		       },
				comboId:'tmBasRouteId',
				comboText:'route',
				field:'tmBasRouteId',
				valid:['notEmpty'],
				isSearch:true,
				onSuccess:function(data){
				  console.log(data)
				},
				onClick:function(data){
					$('#comboUlocI').select2('val',['']);
					Ew.selectLink({
						comboUrl:'/base/routeuloc/queryUloc',
						comboData:JSON.stringify({type:'1',tmBasRouteId:$('#comboRouteI').val()}),
				        id:['comboUlocI'],
						comboId:'tmBasUlocId',
						comboText:'uUlocNo'
				    });
				}
			},{
				idName:'textRouteName',
				text:'工艺路径名称',
				field:'routeName',
				defaultValue:$('#table1').bootstrapTable('getSelections')[0].route,
				disabled:true
			},{
				idName:'comboUlocI',
				text:'当前站点',
				comboUrl:'/base/routeuloc/queryUloc',
				comboData:JSON.stringify({type:'1',tmBasRouteId:$('#comboRouteI').val()}),
				comboId:'tmBasUlocId',
				comboText:'uUlocNo',
				field:'tmBasUlocId',
				valid:['notEmpty'],
				onSuccess:function(data){
				  console.log(data)
				},
				onClick:function(data){
					$('#comboUlocSeqI').select2('val',['']);
					$('#comboNextUlocI').select2('val',['']);
					$('#comboNextSeqI').select2('val',['']);
					
					Ew.selectLink({
						comboUrl:'/base/routeuloc/queryUloc',
						comboData:JSON.stringify({type:'2',tmBasUlocId:$('#comboUlocI').val(),tmBasRouteId:$('#comboRouteI').val()}),
				        id:['comboUlocSeqI'],
						comboId:'ulocSeq',
						comboText:'ulocSeq',
						onSuccess:function(data){
							if(data.length == 1){
								Ew.selectLink({
									comboUrl:'/base/routeuloc/queryUloc',
									comboData:JSON.stringify({type:'3',tmBasUlocId:$('#comboUlocI').val(),tmBasRouteId:$('#comboRouteI').val(),ulocSeq:data[0].ulocSeq}),
							        id:['comboNextUlocI'],
									comboId:'nextUlocId',
									comboText:'nextUlocNo',
									onSuccess:function(data){
										if(data.length == 1){
											if(data[0].nextSeq != '' && data[0].nextSeq != undefined){
							            		$('#comboNextSeqI').parent().parent("li:first").attr('style','clear:none; width:400px;');
							            		$('#comboNextSeqII').parent().parent("li:first").attr('style','clear:none; width:400px;display:none');
							              		Ew.selectLink({
													comboUrl:'/base/routeuloc/queryUloc',
													comboData:JSON.stringify({type:'4',tmBasUlocId:$('#comboUlocI').val(),tmBasRouteId:$('#comboRouteI').val(),ulocSeq:data[0].ulocSeq,nextUlocId:data[0].nextUlocId}),
											        id:['comboNextSeqI'],
													comboId:'nextSeq',
													comboText:'nextSeq'
											    });
							            	}else{
							            		$('#comboNextSeqI').parent().parent("li:first").attr('style','clear:none; width:400px;display:none');
							            		$('#comboNextSeqII').parent().parent("li:first").attr('style','clear:none; width:400px;');
							            	}
										}				 
									}
							    });		
							}
						}
				    });
					
				
					
			
				}
			},{
				idName:'comboUlocSeqI',
				text:'当前顺序号',
				comboUrl:'/base/routeuloc/queryUloc',
				comboData:JSON.stringify({type:'2',tmBasUlocId:$('#comboUlocI').val(),tmBasRouteId:$('#comboRouteI').val()}),
				comboId:'ulocSeq',
				comboText:'ulocSeq',
				field:'ulocSeq',
				valid:['notEmpty'],
				onSuccess:function(data){
				  console.log(data)
				},
				onClick:function(data){
					$('#comboNextUlocI').select2('val',['']);
					$('#comboNextSeqI').select2('val',['']);
					Ew.selectLink({
						comboUrl:'/base/routeuloc/queryUloc',
						comboData:JSON.stringify({type:'3',tmBasUlocId:$('#comboUlocI').val(),tmBasRouteId:$('#comboRouteI').val(),ulocSeq:$('#comboUlocSeqI').val()}),
				        id:['comboNextUlocI'],
						comboId:'nextUlocId',
						comboText:'nextUlocNo'
				    });
				}
			},{
				idName:'comboNextUlocI',
				text:'下一站点',
				comboUrl:'/base/routeuloc/queryUloc',
				comboData:JSON.stringify({type:'3',tmBasUlocId:$('#comboUlocI').val(),tmBasRouteId:$('#comboRouteI').val(),ulocSeq:$('#comboUlocSeqI').val()}),
				comboId:'nextUlocId',
				comboText:'nextUlocNo',
				field:'nextUlocId',
				valid:['notEmpty'],
				onSuccess:function(data){
				  console.log(data)
				},
				onClick:function(data){
    				$('#comboNextSeqI').select2('val',['']);
    				$('#comboNextSeqI').select2('val',['']);
					if(data.id != ''){
				        $.ajax({
				            url: apiUrl + '/base/routeuloc/queryUloc',
				            data: JSON.stringify({type:'4',tmBasUlocId:$('#comboUlocI').val(),tmBasRouteId:$('#comboRouteI').val(),ulocSeq:$('#comboUlocSeqI').val(),nextUlocId:$('#comboNextUlocI').val()}),
				            type: "POST",
				            contentType: "application/json; charset=gbk",
				            dataType: "JSON",
				            async: false,
				            success: function (res) {
				            	if(res.results[0].nextSeq != '' && res.results[0].nextSeq != undefined){
				            		$('#comboNextSeqI').parent().parent("li:first").attr('style','clear:none; width:400px;');
				            		$('#comboNextSeqII').parent().parent("li:first").attr('style','clear:none; width:400px;display:none');
				              		Ew.selectLink({
										comboUrl:'/base/routeuloc/queryUloc',
										comboData:JSON.stringify({type:'4',tmBasUlocId:$('#comboUlocI').val(),tmBasRouteId:$('#comboRouteI').val(),ulocSeq:$('#comboUlocSeqI').val(),nextUlocId:$('#comboNextUlocI').val()}),
								        id:['comboNextSeqI'],
										comboId:'nextSeq',
										comboText:'nextSeq'
								    });
				            	}else{
				            		$('#comboNextSeqI').parent().parent("li:first").attr('style','clear:none; width:400px;display:none');
				            		$('#comboNextSeqII').parent().parent("li:first").attr('style','clear:none; width:400px;');
				            	}
				            }
				        });
					}
				}
			},{
				idName:'comboNextSeqI',
				text:'下一站点顺序号',
				comboUrl:'/base/routeuloc/queryUloc',
				comboData:JSON.stringify({type:'4',tmBasUlocId:$('#comboUlocI').val(),tmBasRouteId:$('#comboRouteI').val(),ulocSeq:$('#comboUlocSeqI').val(),nextUlocId:$('#comboNextUlocI').val()}),
				comboId:'nextSeq',
				comboText:'nextSeq',
				field:'nextUlocSeq',
				valid:['notEmpty'],
				hidden:true,
				onSuccess:function(data){
				  console.log(data)
				},
				onClick:function(data){
				  console.log(data)
				}
			},{
				idName:'comboNextSeqII',
				text:'下一站点顺序号',
				comboUrl:'/base/routeuloc/queryUloc',
				comboData:JSON.stringify({type:'4',tmBasUlocId:$('#comboUlocI').val(),tmBasRouteId:$('#comboRouteI').val(),ulocSeq:$('#comboUlocSeqI').val(),nextUlocId:$('#comboNextUlocI').val()}),
				comboId:'nextSeq',
				comboText:'nextSeq',
				field:'nextUlocSeq2',
				hidden:true,
				onSuccess:function(data){
				  console.log(data)
				},
				onClick:function(data){
				  console.log(data)
				}
			},{
				idName:'text_orderNo',
				text:'订单编号',
				hidden:true,
				field:'orderNo'
			},{
				idName:'text_sn',
				text:'SN',
				hidden:true,
				field:'sn'
			}],
			defaultTable:defaultTable
		}
	})

}




