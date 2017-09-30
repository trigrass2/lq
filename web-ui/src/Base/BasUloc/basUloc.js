var tmBasPlantIds,tmBasWorkshopIds,tmBasLineIds;
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
		        contentType: "application/json",
		        id:['combo31'],
		        comboId:'tmBasWorkshopId',
		        comboText:'workshop'
		    });
      Ew.selectLink({
        comboUrl:'/base/line/publicLineSelect',
        comboData:JSON.stringify({tmBasPlantId:data.id}),
        contentType: "application/json",
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
		        contentType: "application/json",
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
		idName:'combo33',
		field:'enabled',
		text:'启用',
		comboUrl:'/system/codeList/getSelect',
		comboData:'ENABLE',
		comboId:'no',
		comboText:'name'
	},{
    idName:'text30',
		text:'工位编号',
		field:'ulocNo'
	},{
    idName:'text31',
		text:'工位名称',
		field:'name'
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
	Ew.getDictVal(['ULOC_TYPE','YESORNO'],function (re) {
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
					var ids = [];
					$.each(rows,function(index,row){
						ids.push(row.tmBasUlocId);
					});
					datas = JSON.stringify(ids);
					var url = '/base/uloc/deleteMore';
					$.when(Ew.ewAjax(url,datas)).done(function(results){
						$('#table1').bootstrapTable('refreshOptions',{pageNumber:1});
		             });
				}
			},{
				btnId:'btnDownload',text:'模板下载',isTrue:true,selMinNum:1,onClick:function(){
					var  url = '/base/uloc/down';
					window.top.location.href = Ew.apiUrl +url;
				}
			},{
				btnId:'btnImport',text:'导入',selMinNum:1,url:'/base/uloc/import',tableId:'table1'

			},{
				btnId:'btnExport',text:'导出',isTrue:true,selMinNum:1,onClick:function(){
					var tmBasPlantId = $('#combo30').val();
					var tmBasPartId = $('#inputCom30').val();
					var orderType = $('#combo32').val();
					var orderStatus = $('#combo33').val();
					var orderNo = $('#text30').val();
					var planStartDate = $('#day30').val();
					var planEndDate = $('#day31').val();

				window.top.location.href= apiUrl +'/base/uloc/export?tmBasPlantId='+tmBasPlantId+'&tmBasPartId='+tmBasPartId+'&orderType='+orderType +'&orderStatus='+orderStatus+'&orderNo='+orderNo+'&planStartDate='+planStartDate+'&planEndDate='+planEndDate;

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
					$('.sw').bootstrapSwitch({
						onText:"启用",
						offText:"禁用",
						onColor:"success",
						offColor:"info",
						onSwitchChange:function(event,state){
							var d = {};
							d.tmBasUlocId = $(this).attr('fieldValue');
							d.enabled = state?1:0;
							datas = JSON.stringify(d);
							var url = '/base/uloc/doEnabled';
							$.when(Ew.ewAjax(url,datas)).done(function(results){
								    $('#table1').bootstrapTable('refresh');
				            });
						}
					});
		        },
				url:'/base/uloc/querylistByPage',
				columns:[{
					checkbox:true
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
	      },{
	          field: 'ulocNo',
	          title: '工位编号',
	  				align:'center',
	  				sortable:true
	      }, {
	          field: 'name',
	          title: '工位名称',
	  				align:'center',
	  				sortable:true
	      },{
	          field: 'previousUloc',
	          title: '前工位',
	  				align:'center',
	  				sortable:true
	      },{
	          field: 'seq',
	          title: '工位顺序号',
	  				align:'center',
	  				sortable:true
	      },{
	          field: 'ulocType',
	          title: '工位类型',
	  				align:'center',
	  				sortable:true,
	          formatter: function (value, row, index) {
	              return re.ULOC_TYPE[value];
	          }
	      },{
	          field: 'ulocIco',
	          title: '图标',
	  				align:'center',
	  				sortable:true,
	          formatter: function (value, row, index) {
	                 return "<span class=\"fa " + value + "\">";
	          }
	      },{
				field:'isOnline',
				title:'是否上线计数点',
				align:'center',
				width:'120px',
				formatter: function (value) {
					return re.YESORNO[value];
		        }
					},{
			field:'isOffline',
			title:'是否下线计数点',
			align:'center',
			width:'120px',
			formatter: function (value) {
	            return re.YESORNO[value];
	        }
				},{
					field:'enabled',
					title:'启用',
					align:'center',
	        width:'120px',
					formatter: function (value, row, index) {
		              return Ew.switchHl(value,'sw',row.tmBasUlocId)
		            }
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
	if(type!='add'){
		var tmBasPlantIds = $('#table1').bootstrapTable('getSelections')[0].tmBasPlantId;
		var tmBasWorkshopIds = $('#table1').bootstrapTable('getSelections')[0].tmBasWorkshopId;
		var tmBasLineIds = $('#table1').bootstrapTable('getSelections')[0].tmBasLineId;
	}

	var title=type=='add'?'新增':'编辑';
	var defaultTable=type=='add'?'':'table1';
	Ew.dialog('demoadd',{
		title:title,
		btnValues:[{
			btnId:'btnSave',
			text:'保存',
			formid:'demoform',
			onClick:function(data){
				if(type=='change') data.tmBasUlocId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tmBasUlocId;
				datas = JSON.stringify(data);
				var url = (type=='add'?'/base/uloc/add':'/base/uloc/update');
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
			formList:[{
				idName:'combo300',
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
				onClick:function(data){
					Ew.selectLink({
				        comboUrl:'/base/workshop/publicWorkshopSelect',
				        contentType: "application/json",
				        comboData:JSON.stringify({tmBasPlantId:data.id,enabled:1}),
				        id:['combo301'],
				        comboId:'tmBasWorkshopId',
				        comboText:'workshop'
				    });
					Ew.selectLink({
								comboUrl:'/base/line/publicLineSelect',
								comboData:JSON.stringify({tmBasPlantId:data.id,enabled:1}),
								id:['combo302'],
								comboId:'tmBasLineId',
								comboText:'line'
						});
					Ew.selectLink({
				        comboUrl:'/base/uloc/queryUlocSelectForInputWithLineId2',
				        comboData:JSON.stringify({tmBasPlantId:data.id,enabled:1}),
				        id:['combo303'],
				        comboId:'tmBasUlocId',
				        comboText:'ulocNo'
				    });
				}
			},{
				idName:'combo301',
				text:'车间',
				comboUrl:'/base/workshop/publicWorkshopSelect',
				comboId:'tmBasWorkshopId',
				comboText:'workshop',
				field:'tmBasWorkshopId',
				valid:['notEmpty'],
				disabled:type=='add'?false:true,
				comboData:type=='add'?JSON.stringify({
					enabled:1
				}):{},
				onClick:function(data){
					Ew.selectLink({
				        comboUrl:'/base/line/publicLineSelect',
				        comboData:JSON.stringify({tmBasWorkshopId:data.id,enabled:1}),
				        id:['combo302'],
				        comboId:'tmBasLineId',
				        comboText:'line'
				    });
					Ew.selectLink({
				        comboUrl:'/base/uloc/queryUlocSelectForInputWithLineId2',
				        comboData:JSON.stringify({tmBasWorkshopId:data.id,enabled:1}),
				        id:['combo303'],
				        comboId:'tmBasUlocId',
				        comboText:'ulocNo'
				    });
				}
			},{
				idName:'combo302',
				text:'产线',
				comboUrl:'/base/line/publicLineSelect',
				comboId:'tmBasLineId',
				comboText:'line',
				field:'tmBasLineId',
				valid:['notEmpty'],
				disabled:type=='add'?false:true,
				comboData:type=='add'?JSON.stringify({
					enabled:1
				}):{},
				onClick:function(data){
					Ew.selectLink({
				        comboUrl:'/base/uloc/queryUlocSelectForInputWithLineId2',
				        comboData:JSON.stringify({tmBasLineId:data.id,enabled:1}),
				        id:['combo303'],
				        comboId:'tmBasUlocId',
				        comboText:'ulocNo'
				    });
				}
			},{
        idName:'text300',
        text:'工位编号',
        field:'ulocNo',
        disabled:type=='add'?false:true,
		valid:['notEmpty',{callback:{
			message: '只能是数字、字母、_(下划线)、-(中划线)、\(斜杠)、/(反斜杠)',
            callback: function(value, validator) {
            		 if(/^[a-zA-Z0-9_\.\\/-]+$/.test(value)){
            			 return true;
            		 }
            		 return false;
            	 }

		}},{type:'string',min:0,max:20}]
			},{
        idName:'text301',
        text:'工位名称',
        field:'name',
				valid:['notEmpty',{type:'string',min:0,max:200}],
				n:2
			},{
				idName:'combo303',
				text:'前工位',
				comboUrl:'/base/uloc/queryUlocSelectForInputWithLineIdUloc',
				comboData:type=='add'?{
					id:['combo300','combo301','combo302'],
					field:['tmBasPlantId','tmBasWorkshopId','tmBasLineId']
				}:{tmBasPlantId:tmBasPlantIds,tmBasWorkshopId:tmBasWorkshopIds,tmBasLineId:tmBasLineIds},
				comboId:'tmBasUlocId',
				comboText:'uloc',
				isSearch:type=='add'?true:false,
				field:'previousUloc',
				valid:[''],
				defaultValue:type=='add'?null:$('#table1').bootstrapTable('getSelections')[0].previousUlocId,
			  method:'GET',
			},{
		        idName:'combo304',
		        text:'工位类型',
		        field:'ulocType',
		        n:1,
		        comboUrl:'/system/codeList/getSelect',
				comboData:'ULOC_TYPE',
				comboId:'no',
				comboText:'name',
						valid:['notEmpty']
					},{
        idName:'number',
        text:'工位顺序号',
        field:'seq',
        valid:[{type:"number",min:0,max:4}]
			},{
				idName:'text302',
				text:'工位图标',
				n:1,
				field:'ulocIco'
			},{idName:'checkbox1',text:'',field:'isOnline',checkboxData:[{text:'产线上线计数点',checked:false,value:1}],n:1},
			  {idName:'checkbox2',text:'',field:'isOffline',checkboxData:[{text:'产线下线计数点',checked:false,value:1}],n:1},
			{
				idName:'switch11',
				text:'启用',
				field:'enabled',
				ontext:'启用',
				offtext:'禁用'
			},{
				idName:'text311',
				text:'版本号',
				field:'version',
				hidden:true
			}],
			defaultTable:defaultTable
		}
	})

}
