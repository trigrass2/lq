layui.use('layer',function(){
	layer=layui.layer;
	
});

$(function(){
	//搜索条件
	var mainSearchData=[{
		idName:'textUserNo',
		text:'操作人员',
		field:'userNo'
	},{
		idName:'comboType',
		text:'操作类型',
		field:'type',
		comboUrl:'/system/codeList/getSelect',
		comboData:'OPERATION_TYPE',
		comboId:'no',
		comboText:'name'
	},{
		idName:'textSearchResourceName',
		text:'操作对象',
		field:'resourceName'
	},{
		idName:'textSearchOperationDetail',
		text:'操作明细',
		field:'operationDetail'
	},{
		idName:'daySearchOperationTimeStart',
		text:'开始时间',
		field:'operationTimeStart',
		format:'year',
		limit:{date:'daySearchOperationTimeEnd',type:'setStartDate'}
	},{
		idName:'daySearchOperationTimeEnd',
		text:'结束时间',
		field:'operationTimeEnd',
		format:'year',
		limit:{date:'daySearchOperationTimeStart',type:'setEndDate'}
	}];

	Ew.search('.searchForm',{
		title:'查询',
		textValues:mainSearchData,
		listWidth:'350px',
		btnValues:[{
			btnId:'btnSearch',
			text:'搜索',
			onClick:function(data){
				$('#tableSysLog').bootstrapTable('refreshOptions',{pageNumber:1});
			}
		},{
			btnId:'btnClear',
			text:'重置',
			tableid:['tableSysLog']
		}]
	});

	//主表格
	Ew.getDictVal(['OPERATION_TYPE'], function (re) {
	Ew.table('.table',{
		btnValues:[{
			btnId:'btnExport',text:'导出',onClick:function(){
				var userNo = $('#textUserNo').val();
				var type = $('#comboType').val();
				var resourceName = $('#textSearchResourceName').val();
				var operationDetail = $('#textSearchOperationDetail').val();
				var operationTimeStart = $('#daySearchOperationTimeStart').val();
				var operationTimeEnd = $('#daySearchOperationTimeEnd').val();
				window.top.location.href= apiUrl +'/system/log/export?userNo='+userNo+'&type='+type+'&resourceName='+resourceName
				 +'&operationDetail='+operationDetail+'&operationTimeStart='+operationTimeStart+'&operationTimeEnd='+operationTimeEnd;
			}
		}],
		tableId:'tableSysLog',
		tableValue:{
			searchParams:mainSearchData,
			queryParams:function(){
				return{}
			},
			onClickRow:function(item,$element){
				
			},
			onLoadSuccess:function(){
				
	        },
			url:'/system/log/querylistByPage',
			columns:[{
				checkbox: true
			},{
			    field: 'operationTime',
			    title: '操作时间',
				align:'center',
				sortable:true,
				width:'80px'
			}, {
			    field: 'userNo',
			    title: '操作人员',
				align:'center',
				sortable:true,
				width:'50px'
			}, {
				field: 'type',
			    title: '操作类型',
				align:'center',
				sortable:true,
				formatter: function (value, row, index) {
		            return re.OPERATION_TYPE[value];
		        },
				width:'50px'
			}, {
				field: 'resourceName',
			    title: '操作对象',
				align:'center',
				sortable:true,
				width:'70px'
			}, {
				field: 'operationDetail',
			    title: '操作明细',
				align:'center',
				sortable:true,
				width:'420px'
			}, {
				field: 'ip',
			    title: 'IP',
				align:'center',
				sortable:true,
				width:'70px'
			}, {
				field: 'hostName',
			    title: '主机名',
				align:'center',
				sortable:true,
				width:'70px'
			}]
		}
	});
	});
})

