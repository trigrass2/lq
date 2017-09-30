

$(function(){
	//搜索条件
	var mainSearchData=[{
		idName:'combo_part_plantSelect',
		text:'工厂',
		comboUrl:'/base/plant/publicPlantSelect',
		comboId:'tmBasPlantId',
		comboText:'plant',
		field:'tmBasPlantId'
	},{
		idName:'text_part_no',
		text:'物料编号',
		field:'partNo'
	},{
		idName:'text_part_name',
		text:'物料名称',
		field:'nameCn'
	},{
		idName:'combo_part_enabled',
		field:'enabled',
		text:'启用',
		comboUrl:'/system/codeList/getSelect',
		comboData:'ENABLE',
		comboId:'no',
		comboText:'name'
	},{
		idName:'combo_part_type1',
		text:'物料属性1',
		field:'partType1',
		comboUrl:'/system/codeList/getSelect',
		comboData:'PART_TYPE1',
		comboId:'no',
		comboText:'name'
	},{
		idName:'combo_part_type2',
		text:'物料属性2',
		field:'partType2',
		comboUrl:'/system/codeList/getSelect',
		comboData:'PART_TYPE2',
		comboId:'no',
		comboText:'name'
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

	Ew.search('.partSearchClass',{
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
    Ew.getDictVal(['PART_TYPE1', 'PART_TYPE2', 'PART_TYPE3'], function (re) {
	Ew.table('.partTableClass',{
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
					ids.push(row.tmBasPartId);
				});
				datas = JSON.stringify(ids);
				var url = '/worktime/part/delete';
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#table1').bootstrapTable('refreshOptions',{pageNumber:1});
	             });
			}
		},{
			btnId:'btnDownload',text:'模板下载',isTrue:true,selMinNum:1,onClick:function(){
				var  url = '/worktime/part/down';
           		window.top.location.href = Ew.apiUrl +url;
			}
		},{
			btnId:'btnImport',text:'导入',selMinNum:1,url:'/worktime/part/import',tableId:'table1'
		},{
			btnId:'btnExport',text:'导出',isTrue:true,selMinNum:1,onClick:function(){
				var tmBasPlantId = $('#combo_part_plantSelect').val();
				var partNo = $('#text_part_no').val();
				var nameCn = $('#text_part_name').val();
				var enabled = $('#combo_part_enabled').val();
				var partType1 = $('#combo_part_type1').val();
				var partType2 = $('#combo_part_type2').val();
				window.top.location.href= apiUrl +'/worktime/part/export?partNo='+partNo+'&nameCn='+nameCn+'&enabled='+enabled+'&partType1='+partType1+'&partType2='+partType2+'&tmBasPlantId='+tmBasPlantId
			}
		}],
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
						d.tmBasPartId = $(this).attr('fieldValue');
						d.enabled = state?1:0;
						datas = JSON.stringify(d);
						var url = '/worktime/part/update';
						$.when(Ew.ewAjax(url,datas)).done(function(results){
							$('#table1').bootstrapTable('refresh');
			            });
					}
				});
	        },
			url:'/worktime/part/querylistByPage',
			columns:[{
				checkbox:true
			},{
				field:'plant',
				title:'工厂',
				align:'center',
				sortable:true,
        		width:'120px'
			},{
				field:'partNo',
				title:'物料编号',
				align:'center',
				sortable:true,
        		width:'120px'
			},{
				field:'nameCn',
				title:'物料名称',
				align:'center',
				sortable:true,
        		width:'120px'
			},{
				field:'code',
				title:'3位简码',
				align:'center',
				sortable:true,
        		width:'100px'
			},{
				field:'nameEn',
				title:'英文名称',
				align:'center',
				sortable:true,
        		width:'120px'
			},{
				field:'nameCnS',
				title:'中文简称',
				align:'center',
				sortable:true,
        		width:'120px'
			},{
				field:'nameEnS',
				title:'英文简称',
				align:'center',
				sortable:true,
        		width:'120px'
			},{
				field:'partType1',
				title:'物料属性1',
				align:'center',
				sortable:true,
				formatter: function (value, row, index) {
		               return re.PART_TYPE1[value];
		            },
        		width:'120px'
			},{
				field:'partType2',
				title:'物料属性2',
				align:'center',
				sortable:true,
				formatter: function (value, row, index) {
		             return re.PART_TYPE2[value];
		        },
        		width:'120px'
			},{
				field:'partType3',
				title:'物料属性3',
				align:'center',
				sortable:true,
				formatter: function (value, row, index) {
		             return re.PART_TYPE3[value];
		            },
        		width:'120px'
			},{
				field:'packages',
				title:'包装',
				align:'center',
				sortable:true,
        		width:'120px'
			},{
				field:'packageQty',
				title:'单包装数量',
				align:'center',
				sortable:true,
        		width:'120px'
			},{
				field:'baseUnit',
				title:'标准单位',
				align:'center',
				sortable:true,
        		width:'120px'
			},{
				field:'pictureAddr',
				title:'图片地址',
				align:'center',
				sortable:true,
        		width:'120px'
			},{
				field:'enabled',
				title:'启用',
				align:'center',
        		width:'120px',
				formatter: function (value, row, index) {
	              return Ew.switchHl(value,'sw',row.tmBasPartId)
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
	var title=type=='add'?'新增':'编辑';
	var defaultTable=type=='add'?'':'table1';
	Ew.dialog('modalAddEdit',{
		title:title,
		btnValues:[{
			btnId:'btnSave',
			text:'保存',
			formid:'fromAddEdit',
			onClick:function(data){
				if(type=='change') data.tmBasPartId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tmBasPartId;
				datas = JSON.stringify(data);
				var url = (type=='add'?'/worktime/part/add':'/worktime/part/update');
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#modalAddEdit').modal('hide');
					$('#table1').bootstrapTable('refresh');
	             });
			}
		},{
			btnId:'btnCancel',
			text:'取消'
		}],
		form:{
			formId:'fromAddEdit',
			columnNum:2,
			listWidth:350,
			formList:[{
				idName:'combo_modal_part_plant',
				text:'工厂',
				comboUrl:'/base/plant/publicPlantSelect',
				comboId:'tmBasPlantId',
				comboText:'plant',
				field:'tmBasPlantId',
				valid:['notEmpty'],
				disabled:type=='add'?false:true,
				comboData:type=='add'?JSON.stringify({
					enabled:1
				}):{}
			},{
				idName:'text_modal_part_no',
				text:'物料编号',
				field:'partNo',
				valid:['notEmpty',{type:'string',min:1,max:50},{callback:{
					message: '只能是数字、字母、_(下划线)、-(中划线)、\(斜杠)、/(反斜杠)',
		            callback: function(value, validator) {
		            		 if(/^[a-zA-Z0-9_\.\\/-]+$/.test(value)){
		            			 return true;
		            		 }
		            		 return false;
		            	 }
		            
				}}],
				disabled:type=='add'?false:true,
			},{
				idName:'text_modal_part_code',
				text:'3位简码',
				field:'code',
				valid:[{type:'string',min:0,max:3}]
			},{
				idName:'text_modal_part_nameCn',
				text:'中文名称',
				field:'nameCn',
				valid:['notEmpty',{type:'string',min:0,max:50}]
			},{
				idName:'text_modal_part_nameCns',
				text:'中文简称',
				field:'nameCnS',
				valid:[{type:'string',min:0,max:50}]
			},{
				idName:'text_modal_part_nameEn',
				text:'英文名称',
				field:'nameEn',
				valid:[{type:'string',min:0,max:50}]
			},{
				idName:'text_modal_part_nameEnS',
				text:'英文简称',
				field:'nameEnS',
				valid:[{type:'string',min:0,max:50}]
			},{
				idName:'combo_modal_part_type1',
				text:'物料属性1',
				field:'partType1',
				comboUrl:'/system/codeList/getSelect',
				comboData:'PART_TYPE1',
				comboId:'no',
				comboText:'name',
				valid:[]
			},{
				idName:'combo_modal_part_type2',
				text:'物料属性2',
				field:'partType2',
				comboUrl:'/system/codeList/getSelect',
				comboData:'PART_TYPE2',
				comboId:'no',
				comboText:'name',
				valid:[]
			},{
				idName:'combo_modal_part_type3',
				text:'物料属性3',
				field:'partType3',
				comboUrl:'/system/codeList/getSelect',
				comboData:'PART_TYPE3',
				comboId:'no',
				comboText:'name',
				valid:[]
			},{
				idName:'combo_modal_part_package',
				text:'包装',
				comboUrl:'/base/baspackage/queryPackageSelect',
				comboData:{
					other:{enabled:1}
				},
				comboId:'tmBasPackageId',
				comboText:'name',
				field:'tmBasUlocId',
				valid:[],
				isSearch:true
			},{
				idName:'combo_modal_part_baseUnit',
				text:'标准单位',
				field:'baseUnit',
				comboUrl:'/system/codeList/getSelect',
				comboData:'testunit',
				comboId:'no',
				comboText:'name',
				valid:[]
			},{
				idName:'text_modal_dock_packageQty',
				text:'单包装数量',
				field:'packageQty',
				valid:[{type:'number',min:0,max:999999999999}]
			},{
				idName:'switch_modal_dock_enabled',
				text:'启用',
				field:'enabled',
				ontext:'启用',
				offtext:'禁用'
			},{
				idName:'text_version',
				text:'版本号',
				field:'version',
				hidden:true
			}],
			defaultTable:defaultTable
		}
	})

}

