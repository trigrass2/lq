

$(function(){
	//搜索条件
	var mainSearchData=[{
		idName:'comboPlant',
		text:'工厂',
		comboUrl:'/base/plant/publicPlantSelect',
		comboId:'tmBasPlantId',
		comboText:'plant',
		field:'tmBasPlantId',
		onClick:function(data){
			$('#inputComProduct').val('');
			$('#inputComPart').val('');
			Ew.selectLink({
				comboUrl:'/worktime/part/publicProduct',
				comboData:JSON.stringify({tmBasPlantId:data.id,partType1:['S','P'],enabled:1}),
				id:['inputComProduct'],
				comboId:'tmBaspartId',
				comboText:'part'
			});
			Ew.selectLink({
				comboUrl:'/worktime/part/publicProduct',
				comboData:JSON.stringify({tmBasPlantId:data.id,partType1:[],enabled:1}),
				id:['inputComPart'],
				comboId:'tmBaspartId',
				comboText:'part'
			});
		}
	},{
		idName:'comboProduct',
		text:'产品',
		comboUrl:'/worktime/part/publicProduct',
		comboData:
      {
			id:['comboPlant'],
			field:['tmBasPlantId'],
			other:{partType1:['S','P'],enabled:1}
      },
		comboId:'tmBasPartId',
		comboText:'part',
		field:'tmBasPartId',
		isSearch:true
	},{
		idName:'comboPart',
		text:'物料',
		comboUrl:'/worktime/part/publicProduct',
		comboData:
      {
			id:['comboPlant'],
			field:['tmBasPlantId'],
			other:{partType1:[],enabled:1}
      },
		comboId:'tmBasPartId',
		comboText:'part',
		field:'tmBasPartDetailId',
		isSearch:true
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
			btnId:'btnSearch',
			text:'搜索',
			onClick:function(data){
				console.log(data)
				$('#table1').bootstrapTable('refreshOptions',{pageNumber:1});
				$('#table2').bootstrapTable('removeAll');
			}
		},{
			btnId:'btnClear',
			text:'重置',
			tableid:['table1','table2']
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
	Ew.getDictVal(['BOM_TYPE','BOM_STATUS','BASE_UNIT','PART_TYPE3'],function (re) {
		//主表格
		Ew.table('.demoTable',{
			btnValues:[{
				btnId:'btnAdd',text:'新增',onClick:function(){
					daliogShow('add')
				}
			},{
				btnId:'btnEdit',text:'编辑',otherOption:[{id:'table1',selectNum: 1}],onClick:function(){
					daliogShow('change')
				}
			},{
				btnId:'btnDelete',text:'删除',isTrue:true,otherOption:[{id:'table1',selMinNum: 1}],onClick:function(){
					var rows = $('#table1').bootstrapTable('getSelections');
					var tmBasBomIds = [];
					for ( var row in rows) {
						if(rows[row].bomStatus=='P'){
							 layer.msg("包含不可删除数据，请选择非发布状态的数据！",{icon:7,time:2000});
							 return;
						}
					}
					$.each(rows,function(index,row){

						tmBasBomIds.push(row.tmBasBomId);

					});
					datas =JSON.stringify({tmBasBomId:tmBasBomIds});
					var url = '/base/bom/delete';
					$.when(Ew.ewAjax(url,datas)).done(function(results){
						$('#table1').bootstrapTable('refreshOptions',{pageNumber:1});
		            });
				}
			},{
				btnId:'btnPub',text:'发布',isTrue:true,otherOption:[{id:'table1',selMinNum: 1}],onClick:function(){
					var rows = $('#table1').bootstrapTable('getSelections');
					var tmBasBomIds = [];
					$.each(rows,function(index,row){
						tmBasBomIds.push(row.tmBasBomId);
					});
					datas =JSON.stringify(tmBasBomIds);
					var url = '/base/bom/pub';
					$.when(Ew.ewAjax(url,datas)).done(function(results){
						$('#table1').bootstrapTable('refresh');
		             });
				}
			},{
				btnId:'btnDownload',text:'模板下载',isTrue:true,selMinNum:1,onClick:function(){

				}
			},{
				btnId:'btnImport',text:'导入',isTrue:true,selMinNum:1,onClick:function(){

				}
			},{
				btnId:'btnExport',text:'导出',isTrue:true,selMinNum:1,onClick:function(){

				}
			},{
	          btnId: 'add2', otherBtn:true, otherOption:[{id:'table1',selectNum: 1}] //控制子表按钮是否 可用
	        },{
	          btnId: 'change2', otherBtn:true,otherOption:[{id:'table1',selectNum: 1},{id:'table2',selectNum: 1}] //控制子表按钮是否 可用
	        },{
	            btnId: 'dele2', otherBtn:true,otherOption:[{id:'table1',selectNum: 1},{id:'table2',selMinNum: 1}] //控制子表按钮是否 可用
	        }
	],
			tableId:'table1',
			tableValue:{
				searchParams:mainSearchData,
				queryParams:function(){
					return{}
				},
				onClickRow:function(item,$element){
					$('#table2').bootstrapTable('refreshOptions',{pageNumber:1});
				},
				onLoadSuccess:function(){
					$('.sw').bootstrapSwitch({
						onText:"启用",
						offText:"禁用",
						onColor:"success",
						offColor:"info",
						onSwitchChange:function(event,state){
							var d = {};
							d.tmBasBomId = $(this).attr('fieldValue');
							d.enabled = state?1:0;
							datas = JSON.stringify(d);
							var url = "/base/bom/update";
							$.when(Ew.ewAjax(url,datas)).done(function(results){
								$('#table1').bootstrapTable('refresh');
				            });
						}
					});
		        },
				url:'/base/bom/querylistByPage',
				columns:[{
					checkbox:true
				},{

			        field: 'plant',
			        title: '工厂',
			        align: 'center',

					sortable:true,
	        width:'120px'
				},{

			        field: 'part',
			        title: '产品',
			        align: 'center',
					sortable:true,
					width:'120px'
				}, {
			        field: 'bomVersion',
			        title: '版本',
			        align: 'center',
			        sortable:true,
					width:'120px'
			    },{
			        field: 'bomType',
			        title: '类型',
			        align: 'center',
			        formatter: function (value, row, index) {
			        	return re.BOM_TYPE[value];
			        },

			      sortable:true,
					width:'120px'
			    },{
			        field: 'bomStatus',
			        title: '状态',
			        align: 'center',
			        formatter: function (value, row, index) {
			        	return re.BOM_STATUS[value];
			        },

			     sortable:true,
					width:'120px'
			    }, {
			        field: 'bomStartDate',
			        title: '生效日期',
			        align: 'center',
			        sortable:true,

					width:'120px'
			    }, {
			        field: 'bomEndDate',
			        title: '失效日期',
			        align: 'center',
			        sortable:true,
					width:'120px'
			    }, {
			        field: 'remark',
			        title: '备注',
			        align: 'center',
			        sortable:true,
					width:'120px'
			    }, {
			        field: 'createBy',
			        title: '创建人员',
			        align: 'center',
			        sortable:true,
					width:'120px'
			    }, {
			        field: 'createDate',
			        title: '创建日期',
			        align: 'center',
			        sortable:true,
					width:'120px'
			    }, {
			        field: 'updateBy',
			        title: '更新人员',
			        align: 'center',
			        sortable:true,
					width:'120px'
			    }, {
			        field: 'updateDate',
			        title: '更新日期',
			        align: 'center',
			        sortable:true,
					width:'120px'
			    } ]
			}
		});


	//子表格
	Ew.table('.demoTable2',{
		btnValues:[{
			btnId:'btnAddSub',text:'新增',otherOption:[{id:'table1',selectNum: 1}],onClick:function(){
				var rows = $('#table1').bootstrapTable('getSelections');
		        var row = rows[0];
		         if(row.bomStatus =='P'||row.orderSource !='undefined'){
		        	 if (row.bomStatus =='P') {
		                    layer.msg("发布状态的BOM不可编辑明细!",{icon:7,time:1000});
		                   return;
		             }
		         }
				daliogShow2('add')
			}
		},{
			btnId:'btnEditSub',text:'编辑',otherOption:[{id:'table1',selectNum: 1},{id:'table2',selectNum: 1}],selectNum:1,onClick:function(){
				var rows = $('#table1').bootstrapTable('getSelections');
		        var row = rows[0];
		         if(row.bomStatus =='P'||row.orderSource !='undefined'){
		              if (row.bomStatus =='P') {
		                    layer.msg("发布状态的BOM不可编辑明细!",{icon:7,time:1000});
		                   return;
		             }
		         }
				daliogShow2('change')
			}
		},{
			btnId:'btnDeleteSub',text:'删除',isTrue:true,otherOption:[{id:'table2',selMinNum: 1},{id:'table1',selectNum: 1}],onClick:function(){
				var rows = $('#table1').bootstrapTable('getSelections');
		        var row = rows[0];
		         if(row.bomStatus =='P'||row.orderSource !='undefined'){
		              if (row.orderStatus =='P') {
		                    layer.msg("发布状态的BOM不可删除明细!",{icon:7,time:1000});
		                   return;
		             }
		         }
				var rows = $('#table2').bootstrapTable('getSelections');
				var ids = [];
				$.each(rows,function(index,row){
					ids.push(row.tmBasBomPartId);
				});
				datas = JSON.stringify({tmBasBomPartId:ids});
				var url = '/base/bomPart/delete';
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					var rows = $('#table1').bootstrapTable('getSelections');
					$('#table2').bootstrapTable('refresh',{query:{tmBasBomId:rows[0].tmBasBomId,pageNumber:1}});
					//$('#table2').bootstrapTable('refreshOptions',{tmBasBomId:rows[0].tmBasBomId,pageNumber:1});
	            });
			}
		}],
		tableId:'table2',
		tableValue:{
			queryParams:function(){
				var id = $('#table1').bootstrapTable('getSelections')[0]?$('#table1').bootstrapTable('getSelections')[0].tmBasBomId:-1;
				return {tmBasBomId:id};
			},
			onClickRow:function(item,$element){

			},
			url:'/base/bomPart/querylistByPage',
			columns:[{
				checkbox:true
			},{
		        field: 'rowNo',
		        title: '行号',
		        align: 'center'
		    },{
		        field: 'uloc',
		        title: '工位',
		        align: 'center',
		        sortable:true,
				width:'120px'
		    },{
		        field: 'part',
		        title: '物料',
		        align: 'center',
		        sortable:true,
				width:'120px'
		    },{
		        field: 'qty',
		        title: '工位用量',
		        align: 'center',
		        sortable:true,
				width:'120px'
		    }, {
		        field: 'baseUnit',
		        title: '单位',
		        align: 'center',
		       sortable:true,
				width:'120px',
				formatter: function (value, row, index) {
 				  return re.BASE_UNIT[value]
				}
		    },{
		        field: 'bomVersion',
		        title: '物料BOM版本',
		        align: 'center',
		        sortable:true,
				width:'120px'
		    },{
		        field: 'partType3',
		        title: '追溯类型',
		        align: 'center',
		        sortable:true,
				width:'120px',
				formatter: function (value, row, index) {
					return re.PART_TYPE3[value]
				}
		    }, {
		        field: 'rate',
		        title: '损耗率%',
		        align: 'center',
		        sortable:true,
				width:'120px'
		    }, {
		        field: 'startDate',
		        title: '生效日期',
		        align: 'center',
		        sortable:true,
				width:'120px'
		    }, {
		        field: 'endDate',
		        title: '失效日期',
		        align: 'center',
		        sortable:true,
				width:'120px'
		    }, {
		        field: 'remark',
		        title: '备注',
		        align: 'center',
		        sortable:true,
				width:'120px'
		    },{
						idName:'text21311',
						text:'版本号',
						field:'version',
						hidden:true
					}]
		}
	});
	 })
})

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

function daliogShow(type){
	var title=type=='add'?'新增':'编辑';
	var defaultTable=type=='add'?'':'table1';
	Ew.dialog('demoadd',{
		title:title,
		btnValues:[{
			btnId:'btnSave',
			text:'保存',
			formid:'demoform',
			onClick:function(data){
				if(type=='change') data.tmBasBomId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tmBasBomId;
				datas = JSON.stringify(data);
				var url = (type=='add'?"/base/bom/add":"/base/bom/update");
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
				disabled:type=='add'?false:true,
				comboData:type=='add'?JSON.stringify({
					enabled:1
				}):{},
				n:1,
				onClick:function(data){
					Ew.selectLink({
					comboUrl:'/worktime/part/publicProduct',
					comboData:JSON.stringify({tmBasPlantId:data.id,partType1:['S','P'],enabled:1}),
					id:['inputComProductI'],
					comboId:'tmBaspartId',
					comboText:'part'
				});
					}
			},{
				idName:'comboProductI',
				text:'产品',
				comboUrl:'/worktime/part/publicProduct',
				comboData:
		      {
					id:['comboPlantI'],
					field:['tmBasPlantId'],
					other:{partType1:['S','P'],enabled:1}
		      },
				comboId:'tmBasPartId',
				comboText:'part',
				field:'tmBasPartId',
				valid:['notEmpty'],
				disabled:type=='add'?false:true,
				isSearch:type=='add'?true:false
			},{
				idName:'comboTypeI',
				text:'类型',
				comboUrl:'/system/codeList/getSelect',
				comboId:'no',
				comboText:'name',
				field:'bomType',
				valid:['notEmpty'],
				disabled:type=='add'?false:true,
				comboData:'BOM_TYPE',
				disabled:type=='add'?false:true,
				n:1
			},{
				idName:'textVersionI',
				text:'版本',
				field:'bomVersion',
				valid:[''],
				disabled:true,
				n:1
			},{
				idName:'dayEffective',
				field:'bomStartDate',
				format:'fulldate',
				limit:{date:'dayInvalid',type:'setStartDate'},
				valid:[],
				n:1.5,
				text:'生效日期'
			},{
			idName:'dayInvalid',
			field:'bomEndDate',
			format:'fulldate',
			limit:{date:'dayEffective',type:'setEndDate'},
			valid:[],
			n:1.5,
			text:'失效日期'
			},{
				idName:'area18',
				text:'备注',
				field:'remark',
				valid:[''],
				n:2
			},{
				idName:'textVersion',
				text:'版本',
				field:'version',
				hidden:true
			}],
			defaultTable:defaultTable
		}
	})

}


//子表格
function daliogShow2(type){
	var title=type=='add'?'新增':'编辑';
	var defaultTable=type=='add'?'':'table2';
	Ew.dialog('demoadd',{
		title:title,
		btnValues:[{
			btnId:'btnSaveSub',
			text:'保存',
			formid:'demoform2',
			onClick:function(data){
				data.tmBasBomId = $('#table1').bootstrapTable('getSelections')[0].tmBasBomId ;
				if(type=='change') data.tmBasBomPartId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tmBasBomPartId;
				datas = JSON.stringify(data);
				var url = (type=='add'?"/base/bomPart/add":"/base/bomPart/update");
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#demoadd').modal('hide');
					var rows = $('#table1').bootstrapTable('getSelections');
					$('#table2').bootstrapTable('refresh',{query:{tmBasBomId:rows[0].tmBasBomId,pageNumber:1}});
	             });
			}
		},{
			btnId:'btnCancelSub',
			text:'取消'
		}],
		form:{
			formId:'demoform2',
			columnNum:2,
			listWidth:280,
			formList:[{
				idName:'comboPlantII',
				text:'工厂',
				comboUrl:'/base/plant/publicPlantSelect',
				comboId:'tmBasPlantId',
				comboText:'plant',
				field:'tmBasPlantId',
				valid:[''],
				defaultValue:$('#table1').bootstrapTable('getSelections')[0].tmBasPlantId,
				disabled:true
			},{
				idName:'textproductII',
				text:'产品',
				comboId:'tmBasPartId',
				comboText:'tmBasPartId',
				field:'tmBasPartId',
				valid:[''],
				defaultValue:$('#table1').bootstrapTable('getSelections')[0].part,
				disabled:true
			},{

				idName:'comboTypeII',
				text:'类型',
				comboUrl:'/system/codeList/getSelect',
				comboId:'no',
				comboText:'name',
				field:'bomType',
				valid:[''],
				comboData:'BOM_TYPE',
				disabled:true,
				defaultValue:$('#table1').bootstrapTable('getSelections')[0].bomType,
				n:1

			},{

				idName:'textVersionII',
				text:'版本',
				field:'mainBomVersion',
				valid:[''],
				disabled:true,
				defaultValue:$('#table1').bootstrapTable('getSelections')[0].bomVersion,
				n:1

			},{
				idName:'comboUlocII',
				text:'工位',
				comboUrl:'/base/uloc/queryUlocSelectForInput',
				comboData:type=='add'?{
					id:['comboPlantII'],
					field:['pTmBasPlantId'],
					other:{enabled:1}
			}:{},
				comboId:'tmBasUlocId',
				comboText:'ulocNo',
				field:'tmBasUlocId',
				defaultValue:type=='add'?'':$('#table2').bootstrapTable('getSelections')[0].tmBasUlocId,
				disabled:type=='add'?false:true,
				isSearch:type=='add'?true:false,
				valid:['notEmpty']
			},{

				idName:'comboPartII',
				text:'物料',
				comboUrl:'/worktime/part/publicProduct',
				comboData:
		      {
					id:['comboPlantII'],
					field:['tmBasPlantId'],
					other:{partType1:[],enabled:1}
		      },
				comboId:'tmBasPartId',
				comboText:'part',
				field:'tmBasPartId',
				defaultValue:type=='add'?'':$('#table2').bootstrapTable('getSelections')[0].tmBasPartId,
				isSearch:type=='add'?true:false,
				disabled:type=='add'?false:true,
				valid:['notEmpty'],
				onClick:function(data){
							$('#combobomVersionII').val('');
							Ew.selectLink({
								comboUrl:'/base/bom/queryVersion',
								comboData:JSON.stringify({tmBasPartId:data.id}),
								id:['combobomVersionII'],
								comboId:'tmBasBomId',
								comboText:'bomVersion'
							});
						}

			},{

				idName:'numberUlocQty',
				text:'工位用量',
				field:'qty',
				valid:['notEmpty',{callback:{
					message: '工位用量为小于9999的正整数',
		            callback: function(value, validator) {
		            	if(value==null || value=='') return true;
		            	 if(value>=0 && value<=9999){
		            		 if(/^[1-9]\d{0,8}$/.test(value)){
		            			 return true;
		            		 }
		            		 return false;
		            	 }else{
		            		 return false;
		            	 }
		            }
				}}]

			},{
				idName:'comboUnitII',
				text:'单位',
				comboUrl:'/system/codeList/getSelect',
				comboId:'no',
				comboText:'name',
				field:'baseUnit',
				comboData:'BASE_UNIT',
				valid:['notEmpty'],
				n:1
			},{idName: 'radio11',
				text: '',
				field: 'type',
				rodioData:[{text:'默认最新版本',value:'0',checked:true},{text:'指定版本',value:'1'}],
				n:1,
				 onChange:function(state){
		              Ew.dynvalid(state,'demoform2',[{field:'bomVersion',idName:'combobomVersionII'}])
		            }
				},
			{
				idName:'combobomVersionII',
 				text:'BOM版本',
				field:'tmBasBomId',
				comboUrl:'/base/bom/queryBomSuggest',
				comboId:'tmBasBomId',
				comboText:'bomVersion',
				comboData:{
					id:['comboPartII','comboPlantII'],
					field:['tmBasPartId','tmBasPlantId']
				},
				method:'GET',
				isSearch:type=='add'?true:false,
			},{

				idName:'number17',
				text:'损耗率%',
				type:'decimals',
				field:'rate',
				valid:[{type:'number',min:0,max:100},{callback:{
					message: '损耗率为0到100的数',
		            callback: function(value, validator) {
		            	if(value==null || value=='') return true;
		            	 if(value>=0 && value<=100){
		            		 if(/^\d+(\.\d{1,2})?$/.test(value)){
		            			 return true;
		            		 }
		            		 return false;
		            	 }else{
		            		 return false;
		            	 }
		            }
				}}]

			},
//			{
//				idName:'combopartType3II',
//				text:'追溯类型',
//				comboUrl:'/system/codeList/getSelect',
//				comboId:'tsSysCodeListId',
//				comboText:'name',
//				field:'partType3',
//				comboData:'partType3',
//				n:1
//		    },
		    {
				idName:'dayEffectiveII',
				field:'startDate',
				text:'生效日期',
				format:'fulldate',
				limit:{date:'dayInvalidII',type:'setStartDate'},
				n:1.5,
				valid:[]
			},{
			idName:'dayInvalidII',
			field:'endDate',
			text:'失效日期',
			format:'fulldate',
			limit:{date:'dayInvalidII',type:'setEndDate'},
			n:1.5,
			valid:[]
			},{
				idName:'area18',
				text:'备注',
				field:'remark',
				valid:[''],
				n:2
			},{
				idName:'textSubVersion',
				text:'版本',
				field:'version',
				hidden:true
			}
			],
			defaultTable:defaultTable
		}
	})

}
