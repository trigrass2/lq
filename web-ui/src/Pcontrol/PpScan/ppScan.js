layui.use('layer', function() {
	layer = layui.layer;
});

$(function() {
	//搜索条件
	var mainSearchData = [{
		idName: 'combo30',
		text: '工厂',
		comboUrl: '/base/plant/publicPlantSelect',
		comboId: 'tmBasPlantId',
		comboText: 'plant',
		field: 'tmBasPlantId',
		onClick: function(data) {

		}
	}, {
		idName: 'inputCom30',
		text: '产品',
		comboUrl: '/worktime/part/publicProduct',
		comboData: {
			id: ['combo30'],
			field: ['tmBasPlantId'],
			other: {}
		},
		comboId: 'tmBasPartId',
		comboText: 'part',
		field: 'tmBasPartId',
		onSuccess: function(data) {
			console.log(data)
		}
	}, {
		idName: 'text30',
		text: '订单编号',
		field: 'orderNo'
	}, {
		idName: 'combo32',
		text: '当前站点',
		comboUrl: '/base/uloc/queryUlocSelectList',
		comboData: {
			id: ['combo30'],
			field: ['pTmBasPlantId'],
			other: {}
		},
		comboId: 'tmBasUlocId',
		comboText: 'ulocNo',
		field: 'tmBasUlocId',
		isSearch: true
	}, {
		idName: 'text31',
		text: 'SN',
		field: 'sn'
	}, {
		idName: 'combo33',
		text: '生产状态',
		comboUrl: '/system/codeList/getSelect',
		comboId: 'no',
		comboText: 'name',
		field: 'wipStatus',
		comboData: 'SN_STATUS',
		n: 1
	}, {
		idName: 'inputComRoute',
		text: '工艺路径',
		comboUrl: '/base/route/queryRoute',
		comboData: {
			id: ['comboPlant'],
			field: ['tmBasPlantId'],
			other: {}
		},
		comboId: 'tmBasRouteId',
		comboText: 'route',
		field: 'tmBasRouteId',
		onSuccess: function(data) {
			console.log(data)
		}
	}, {

		idName: 'combo34',
		text: '班次',
		comboUrl: '/system/codeList/getSelect',
		comboId: 'no',
		comboText: 'name',
		field: 'shiftno',
		comboData: 'SHIFT_NO',
		n: 1
	}, {
		idName: 'day30',
		text: '过点时间从',
		field: 'productStartDate',
		defaultValue: Ew.getNowday('') + ' 00:00:00',
		format: 'fulldate',
		limit: {
			date: 'day31',
			type: 'setStartDate'
		}
	}, {
		idName: 'day31',
		text: '过点时间到',
		field: 'productEndDate',
		defaultValue: Ew.getNowday('') + ' 23:59:59',
		format: 'fulldate',
		limit: {
			date: 'day30',
			type: 'setEndDate'
		}
	},
	{
		idName: 'day33',
		text: '工作日历',
		field: 'workDate',
		defaultValue: Ew.getNowday(''),
		format: 'Date'
	
	},{
		idName: 'switch01',
		text: '日历为空',
		field: 'workDateNull',
		defaultValue:'1'
		
	},{
		idName: 'switch02',
		text: '班次为空',
		field: 'shiftnoNull',
		defaultValue:'1'
		
	}
	
	];

	Ew.search('.searchForm', {
		title: '查询',
		textValues: mainSearchData,
		btnValues: [{
			btnId: 'btnSearch',
			text: '搜索',
			onClick: function(data) {
				$('#tablePpScan').bootstrapTable('refresh');
			}
		}, {
			btnId: 'btnClear',
			text: '重置',
			tableid: ['tablePpScan']
		}]
	});
	Ew.getDictVal(['ORDER_TYPE', 'SN_STATUS', 'SHIFT_NO', 'SCAN_TYPE'], function(re) {
		//主表格
		Ew.table('.mainTable', {
			btnValues: [{
				btnId: 'BtnEdit',
				text: '工作日期班次变更',
				otherOption: [{
					id: 'tablePpScan',
					selectNum: 1
				}],
				onClick: function() {
					daliogShow('change');
				}
			}],
			tableId: 'tablePpScan',
			tableValue: {
				searchParams: mainSearchData,
				queryParams: function() {
					return {}
				},
				onClickRow: function(item, $element) {

				},
				onLoadSuccess: function() {

				},
				url: '/execute/ppScan/querylistByPage',
				columns: [{
					checkbox: true
				}, {
					field: 'orderNo',
					title: '订单编号',
					align: 'center',
					sortable: true
				}, {
					field: 'sn',
					title: 'SN',
					align: 'center',
					sortable: true
				}, {
					field: 'wipStatus',
					title: '生产状态',
					align: 'center',
					sortable: true,
					width: '120px',
					formatter: function(value, row, index) {
						return re.SN_STATUS[value];
					}
				}, {
					field: 'part',
					title: '产品',
					align: 'center',
					sortable: true
				}, {
					field: 'scanType',
					title: '过点类型',
					align: 'center',
					sortable: true,
					width: '120px',
					formatter: function(value, row, index) {
						return re.SCAN_TYPE[value];
					}
				}, {
					field: 'ulocNo',
					title: '当前站点',
					align: 'center',
					sortable: true
				}, {
					field: 'routeSeq',
					title: '站点顺序',
					align: 'center',
					sortable: true
				}, {
					field: 'productDate',
					title: '过点时间',
					align: 'center',
					sortable: true
				}, {
					field: 'productBy',
					title: '操作人员',
					align: 'center',
					sortable: true
				}, {
					field: 'workDate',
					title: '工作日历',
					align: 'center',
					sortable: true
				}, {
					field: 'shiftno',
					title: '班次',
					align: 'center',
					sortable: true,
					width: '120px',
					formatter: function(value, row, index) {
						return re.SHIFT_NO[value];
					}
				}, {
					field: 'route',
					title: '工艺路径',
					align: 'center',
					sortable: true
				}, {
					field: 'orderType',
					title: '订单类型',
					align: 'center',
					sortable: true,
					width: '120px',
					formatter: function(value, row, index) {
						return re.ORDER_TYPE[value];
					}
				}, {
					field: 'defectiveQyt',
					title: '缺陷数量',
					align: 'center',
					sortable: true
				}, {
					field: 'plant',
					title: '工厂',
					align: 'center',
					sortable: true
				}, {
					field: 'workshop',
					title: '车间',
					align: 'center',
					sortable: true
				}]
			}
		});
	})

})

function daliogShow(type) {
	debugger;
	var title = type == 'add' ? '新增' : '编辑';
	var defaultTable = type == 'add' ? '' : 'tablePpScan';
	Ew.dialog('mainFromEdit', {
		title: title,
		btnValues: [{
			btnId: 'btnSave',
			text: '保存',
			formid: 'form',
			onClick: function(data) {
				if (type == 'change') {
					data.ttPpScanId = $('#' + defaultTable).bootstrapTable('getSelections')[0].ttPpScanId;
				}
				datas = JSON.stringify(data);
				var url = (type == 'add' ? '/execute/ppScan/add' : '/execute/ppScan/update');
				$.when(Ew.ewAjax(url, datas)).done(function(results) {
					$('#mainFromEdit').modal('hide');
					$('#tablePpScan').bootstrapTable('refresh');
				});
			}
		}, {
			btnId: 'btnCancel',
			text: '取消'
		}],
		form: {
			formId: 'form',
			columnNum: 2,
			listWidth: 250,
			formList: [

				{
					idName: 'day113',
					text: '工作日历',
					valid: ['notEmpty'],
					field: 'workDate'

				}, {
					idName: 'combo445',
					text: '班次',
					field: 'shiftno',
					comboUrl: '/system/codeList/getSelect',
					comboId: 'no',
					comboText: 'name',
					comboData: 'SHIFT_NO',
					valid: ['notEmpty']
				}
			],
			defaultTable: defaultTable
		}
	})
}