layui.use('layer',function(){
	layer=layui.layer;
});

$(function(){
	//搜索条件
	var mainSearchData=[{
		idName:'textSearchJobName',
		text:'定时器名称',
		field:'jobName'
	},{
		idName:'comboJobGroup',
		text:'定时器组',
		field:'jobGroup',
		comboUrl:'/system/codeList/getSelect',
		comboData:'JOB_GROUP',
		comboId:'no',
		comboText:'name'
	},{
		idName:'daySearchStartTime',
		text:'开始时间',
		field:'startTime',
		format:'year',
		limit:{date:'daySearchEndTime',type:'setStartDate'}
	},{
		idName:'daySearchEndTime',
		text:'结束时间',
		field:'endTime',
		format:'year',
		limit:{date:'daySearchStartTime',type:'setEndDate'}
	}]

	Ew.search('.searchForm',{
		title:'查询',
		textValues:mainSearchData,
		btnValues:[{
			btnId:'btnSearch',
			text:'搜索',
			onClick:function(data){
				$('#tableSysJobLog').bootstrapTable('refreshOptions',{pageNumber:1});
			}
		},{
			btnId:'btnClear',
			text:'重置',
			tableid:['tableSysJobLog']
		}]
	});

	//主表格
	Ew.getDictVal(['JOB_GROUP'], function (re) {
	Ew.table('.mainTable',{
		btnValues:[{
			btnId:'btnExport',text:'导出',onClick:function(){
//				var No = $('#textSearchNo').val();
//				window.top.location.href= apiUrl +'/system/sysMsg/export'
			}
		}],
		tableId:'tableSysJobLog',
		tableValue:{
			searchParams:mainSearchData,
			queryParams:function(){
				return{}
			},
			onClickRow:function(item,$element){

			},
			onLoadSuccess:function(){

			},
			url:'/job/sysJobLog/querylistByPage',
			columns:[{
				checkbox: true
			},{
				field: 'jobGroup',
				title: '定时器组',
				align: 'center',
				sortable:true,
				formatter: function (value, row, index) {
		            return re.JOB_GROUP[value];
		        }
			},{
				field: 'jobName',
				title: '定时器名称',
				align: 'center',
				sortable:true
			},{
				field: 'className',
				title: '类名',
				align: 'center',
				sortable:true
			},{
				field: 'runTime',
				title: '运行时间',
				align: 'center',
				sortable:false
			},{
				field: 'jobTime',
				title: '运行时长（秒）',
				align: 'center',
				sortable:false,
				formatter: function (value, row, index) {
                    return value/1000;
                }
			},{
				field: 'jobLog',
				title: '日志',
				align: 'center',
				sortable:false
			}]
		}
	});
	});
})


