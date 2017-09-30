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
		idName:'comboJobStatus',
		text:'状态',
		field:'jobStatus',
		comboUrl:'/system/codeList/getSelect',
		comboData:'JOB_STATUS',
		comboId:'no',
		comboText:'name'
	}]

	Ew.search('.searchForm',{
		title:'查询',
		textValues:mainSearchData,
		btnValues:[{
			btnId:'btnSearch',
			text:'搜索',
			onClick:function(data){
				$('#tableSysJob').bootstrapTable('refresh');
			}
		},{
			btnId:'btnClear',
			text:'重置',
			tableid:['tableSysJob']
		}]
	});

	//主表格
  Ew.getDictVal(['JOB_STATUS', 'JOB_GROUP'], function (re) {
    Ew.table('.mainTable', {
      btnValues: [{
        btnId: 'btnAdd', text: '新增', onClick: function () {
          daliogShow('add');
        }
      }, {
        btnId: 'btnEdit', text: '编辑', otherOption: [{id: 'tableSysJob', selectNum: 1}], onClick: function () {
          daliogShow('change');
        }
      }, {
        btnId: 'btnStop',
        text: '暂停',
        isTrue: true,
        otherOption: [{id: 'tableSysJob', selectNum: 1}],
        onClick: function () {
          var rows = $('#tableSysJob').bootstrapTable('getSelections');
          ids = [];
          var flag = true;

          datas = JSON.stringify(rows[0]);
          var url = '/job/sysJob/stopJob'
          $.when(Ew.ewAjax(url, datas)).done(function (results) {
            $('#tableSysJob').bootstrapTable('refreshOptions',{pageNumber:1});
          });
        }
      }, {
        btnId: 'btnStart',
        text: '启动',
        isTrue: true,
        otherOption: [{id: 'tableSysJob', selectNum: 1}],
        onClick: function () {
          var rows = $('#tableSysJob').bootstrapTable('getSelections');
          ids = [];
          var flag = true;

          datas = JSON.stringify(rows[0]);
          var url = '/job/sysJob/startJob'
          $.when(Ew.ewAjax(url, datas)).done(function (results) {
            $('#tableSysJob').bootstrapTable('refreshOptions',{pageNumber:1});
          });
        }
      }, {
        btnId: 'btnExecute',
        text: '执行',
        isTrue: true,
        otherOption: [{id: 'tableSysJob', selectNum: 1}],
        onClick: function () {
          var rows = $('#tableSysJob').bootstrapTable('getSelections');
          ids = [];
          var flag = true;

          datas = JSON.stringify(rows[0]);
          var url = '/job/sysJob/executeJob'
          $.when(Ew.ewAjax(url, datas)).done(function (results) {
            $('#tableSysJob').bootstrapTable('refreshOptions',{pageNumber:1});
          });
        }
      }],
      tableId: 'tableSysJob',
      tableValue: {
        searchParams: mainSearchData,
        queryParams: function () {
          return {}
        },
        onClickRow: function (item, $element) {

        },
        onLoadSuccess: function () {

        },
        url: '/job/sysJob/querylistByPage',
        columns: [{
          checkbox: true
        }, {
          field: 'jobGroup',
          title: '定时器组',
          align: 'center',
          sortable: true,
          formatter: function (value, row, index) {
            return re.JOB_GROUP[value];
          }
        }, {
          field: 'jobName',
          title: '定时器名称',
          align: 'center',
          sortable: true
        }, {
          field: 'className',
          title: '类名',
          align: 'center',
          sortable: true
        }, {
          field: 'timeExpression',
          title: '时间表达式',
          align: 'center',
          sortable: false
        }, {
          field: 'startTime',
          title: '开始时间',
          align: 'center',
          sortable: true
        }, {
          field: 'beforeTime',
          title: '上次运行时间',
          align: 'center',
          sortable: true
        }, {
          field: 'nextTime',
          title: '下次运行时间',
          align: 'center',
          sortable: true
        }, {
          field: 'jobStatus',
          title: '定时器状态',
          align: 'center',
          sortable: false,
          formatter: function (value, row, index) {
           return re.JOB_STATUS[value];
          }
        }, {
          field: 'jobOvertime',
          title: '超时时间',
          align: 'center',
          sortable: false
        }]
      }
    });
  })
})

function daliogShow(type){
	var title=type=='add'?'新增':'编辑';
	var defaultTable=type=='add'?'':'tableSysJob';
	Ew.dialog('mainFromEdit',{
		title:title,
		btnValues:[{
			btnId:'btnSave',
			text:'保存',
			formid:'form',
			onClick:function(data){
				if(type=='change'){
					data.tsSysJobId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tsSysJobId;
				}
				datas = JSON.stringify(data);
				var url = (type=='add'?'/job/sysJob/add':'/job/sysJob/update');
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#mainFromEdit').modal('hide');
					$('#tableSysJob').bootstrapTable('refresh');
				});
			}
		},{
			btnId:'btnCancel',
			text:'取消'
		}],
		form:{
			formId:'form',
			columnNum:2,
			listWidth:250,
			formList:[{
				idName:'comboJobGroup1',
				text:'定时器组',
				field:'jobGroup',
				comboUrl:'/system/codeList/getSelect',
				comboData:'JOB_GROUP',
				comboId:'no',
				comboText:'name',
				valid:['notEmpty']
//				disabled:type=='add'?false:true
			},{
				idName:'textJobName1',
				text:'定时器名称',
				field:'jobName',
				valid:['notEmpty',{type:"string",min:0,max:50}]
//				disabled:type=='add'?false:true
			},{
				idName:'textClassName1',
				text:'类名',
				field:'className',
				valid:['notEmpty',{type:"string",min:0,max:200}],
				disabled:type=='add'?false:true
			},{
				idName:'textTimeExpression1',
				text:'时间表达式',
				field:'timeExpression',
				valid:['notEmpty',{type:"string",min:0,max:200}]
//				disabled:type=='add'?false:true
			},{
				idName:'numberJobOvertime1',
				text:'超时时间',
				field:'jobOvertime',
				valid:['notEmpty']
//				disabled:type=='add'?false:true
			},{
				idName:'textVersion',
				text:'版本号',
				field:'version',
				hidden:true
			}],
			defaultTable:defaultTable
		}
	})
}
