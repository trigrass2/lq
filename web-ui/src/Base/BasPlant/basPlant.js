

$(function(){
	//搜索条件
	var mainSearchData=[{
    idName:'text30',
		text:'工厂编号',
		field:'plantNo'
	},{
    idName:'text31',
		text:'工厂名称',
		field:'nameCn'
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

	//主表格
	Ew.table('.demoTable',{
		btnValues:[
    {
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
					ids.push(row.tmBasPlantId);
				});
				datas = JSON.stringify(ids);
				var url = '/base/plant/deleteMore';
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#table1').bootstrapTable('refreshOptions',{pageNumber:1});
	             });
			}
		},{
			btnId:'btnDownload',text:'模板下载',isTrue:true,selMinNum:1,onClick:function(){
				var  url = '/base/plant/down';
           		window.top.location.href = Ew.apiUrl +url;

			}
		},{
			btnId:'btnImport',text:'导入',isTrue:true,selMinNum:1,url:'/base/plant/import',tableId:'table1'
		},{
			btnId:'btnExport',text:'导出',isTrue:true,selMinNum:1,onClick:function(){
						var plantNo = $('#text30').val();
						var nameCn = $('#text31').val();
 
          		window.top.location.href= apiUrl +'/base/plant/export?plantNo='+plantNo+'&nameCn='+nameCn;
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
//				$('#table2').bootstrapTable('refresh',{query:{tmBasPlantId:item.tmBasPlantId}});//或者{query:{}}直接设置查询条件
			},
			onLoadSuccess:function(){
				$('.sw').bootstrapSwitch({
					onText:"启用",
					offText:"禁用",
					onColor:"success",
					offColor:"info",
					onSwitchChange:function(event,state){
						var d = {};
						d.tmBasPlantId = $(this).attr('fieldValue');
						d.enabled = state?1:0;
 						datas = JSON.stringify(d);
						var url = '/base/plant/doEnabled';
						$.when(Ew.ewAjax(url,datas)).done(function(results){
							   $('#table1').bootstrapTable('refresh');
			            });
					}
				});
	        },
			url:'/base/plant/querylistByPage',
			columns:[{
				checkbox:true
			},{
					field: 'plantNo',
					title: '工厂编号',
					align:'center',
					sortable:true
			}, {
					field: 'nameCn',
					title: '中文名称',
					align:'center',
					sortable:true
			},{
					field: 'nameEn',
					title: '英文名称',
					align:'center',
					sortable:true
			},{
					field: 'nameCnS',
					title: '中文简称',
					align:'center',
					sortable:true
			}, {
					field: 'nameEnS',
					title: '英文简称',
					align:'center',
					sortable:true
			},{
					field: 'addrCn1',
					title: '中文地址1',
					align:'center',
					sortable:true
			},{
					field: 'addrCn2',
					title: '中文地址2',
					align:'center',
					sortable:true
			},{
					field: 'addrEn1',
					title: '英文地址1',
					align:'center',
					sortable:true
			},{
					field: 'addrEn2',
					title: '英文地址2',
					align:'center',
					sortable:true
			},{
				field:'enabled',
				title:'启用',
				align:'center',
				width:'120px',
				formatter: function (value, row, index) {
	              return Ew.switchHl(value,'sw',row.tmBasPlantId)
	            }
			}]
		}
	});
	var aa=-1;

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
				if(type=='change') data.tmBasPlantId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tmBasPlantId;
				datas = JSON.stringify(data);
				var url = (type=='add'?'/base/plant/add':'/base/plant/update');
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

			formList:[
				{
	        idName:'text300',
	        text:'编号',
	        field:'plantNo',
				valid:['notEmpty',{type:'string',min:1,max:20},{callback:{
					message: '只能是数字、字母、_(下划线)、-(中划线)、\(斜杠)、/(反斜杠)',
								callback: function(value, validator) {
										 if(/^[a-zA-Z0-9_\.\\/-]+$/.test(value)){
											 return true;
										 }
										 return false;
									 }

				}}],
			disabled:type=='add'?false:true
				},{
	        idName:'text301',
	        text:'中文名称',
	        field:'nameCn',
					valid:['notEmpty',{type:'string',min:0,max:200}]
				},{
	        idName:'text302',
	        text:'中文简称',
	        field:'nameCnS',
					valid:['notEmpty',{type:'string',min:0,max:50}]
				},{
	        idName:'text303',
	        text:'英文名称',
	        field:'nameEn',
	        valid:[{type:'string',min:0,max:200}]
				},{
	        idName:'text304',
	        text:'英文简称',
	        field:'nameEnS',
	        valid:[{type:'string',min:0,max:50}]
	 			},{
	        idName:'text305',
	        text:'中文地址1',
	        field:'addrCn1',
	        valid:[{type:'string',min:0,max:200}],
					n:2
	 			},{
	        idName:'text306',
	        text:'中文地址2',
	        field:'addrCn2',
	        valid:[{type:'string',min:0,max:200}],
						n:2
	 			},{
	        idName:'text307',
	        text:'英文地址1',
	        field:'addrEn1',
	        valid:[{type:'string',min:0,max:200}],
						n:2
	 			},{
	        idName:'text308',
	        text:'英文地址2',
	        field:'addrEn2',
	        valid:[{type:'string',min:0,max:200}],
						n:2
	 			},{
	        idName:'switch300',
					text:'启用',
					field:'enabled',
					ontext:'启用',
					offtext:'禁用',
					defaultValue:type=='add'?0:$('#table1').bootstrapTable('getSelections')[0].enabled
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
