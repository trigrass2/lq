var mainSearchData = [{
	idName: 'comboGroup',
	text: '业务权限组',
	field: 'name',
	comboUrl: '/system/sysGroup/selectGroupList',
	comboId: 'tsSysGroupId',
	comboText: 'noAndName',
	valid: ['notEmpty']
}];


$(function () {
	var _results;
	//查询
	Ew.search('.demoSearch', {
		title: '查询',
		textValues: mainSearchData,
		listWidth: '300px',
		btnValues: [{
				btnId: 'btnSearch',
				text: '搜索',
				onClick: function (data) {
					$('#tableUser').bootstrapTable('refreshOptions', {
						pageNumber: 1
					});
					var datas = {};
					datas.tsSysGroupId = $('#comboGroup').val();
					var url = '/system/sysGroupPermission/queryAllPermission'; // 权限设置查询路径
					$.when(Ew.ewAjax(url, JSON.stringify(datas))).done(function (results) {
						$('#gc_list_bg, #cj_list_bg, #cx_list_bg, #gw_list_bg').empty();
						_results = results;
						var gcCheckboxs = '';
						var plant = results.plant;
						for (var i = 0; i < plant.length; i++) {
							if (plant[i].flag === 1) {
								gcCheckboxs += '<label style="margin-right:15px;"><input id="' + plant[i].tm_bas_plant_id + '" type="checkbox" value="' + plant[i].name_cn + '" checked />' + plant[i].name_cn + '</label>';
							} else {
								gcCheckboxs += '<label style="margin-right:15px;"><input id="' + plant[i].tm_bas_plant_id + '" type="checkbox" value="' + plant[i].name_cn + '"/>' + plant[i].name_cn + '</label>';
							}
						}
						$('#gc_list_bg').html(gcCheckboxs);

						showDetails('gc_list_bg', 'cj_list_bg', 'workshop', 'tm_bas_plant_id', 'tm_bas_workshop_id');
						showDetails('cj_list_bg', 'cx_list_bg', 'line', 'tm_bas_workshop_id', 'tm_bas_line_id');
						showDetails('cx_list_bg', 'gw_list_bg', 'uloc', 'tm_bas_line_id', 'tm_bas_uloc_id');

						function showDetails(groupId, nextGroupId, groupName, tmBasId, nextTmBasId) {
							var divClass;
							var box;
							var name;
							var group = results[groupName];
							var groChecked = $('#' + groupId + ' input:checked');
							for (var i = 0; i < groChecked.length; i++) {
								divClass = groChecked[i].id;
								box = '<div class="' + divClass + '" style="padding:10px"></div>';
								$('#' + nextGroupId).append(box);
								var checkBoxs = '';
								for (var j = 0; j < group.length; j++) {
									if (group[j][tmBasId] === groChecked[i].id) {
										name = group[j].name_cn ? group[j].name_cn : group[j].name;
										if (group[j].flag === 1) {
											checkBoxs += '<label style="margin-right:15px;"><input id="' + group[j][nextTmBasId] + '" type="checkbox" checked />' + name + '</label>';
										} else {
											checkBoxs += '<label style="margin-right:15px;"><input id="' + group[j][nextTmBasId] + '" type="checkbox" />' + name + '</label>';
										}
									}
								}
								$('#' + nextGroupId + ' .' + divClass).html(checkBoxs);
								if (!$("#" + nextGroupId + ' .' + divClass).html()) {
									$("#" + nextGroupId + ' .' + divClass).remove();
								}
							}
						}
					});
				}
			},
			{
				btnId: 'btnClear',
				text: '重置',
				tableid: ['table1']
			}
		]
	});

	$('body').on('click', 'input[type="checkbox"]', function () {
		var groupIdArr = ['gc_list_bg', 'cj_list_bg', 'cx_list_bg', 'gw_list_bg'];
		var nowGroupId = $(this).parent().parent().parent().attr('id') ? $(this).parent().parent().parent().attr('id') : $(this).parent().parent().attr('id');
		var idIndex = groupIdArr.indexOf(nowGroupId);
		var nextGroupId = groupIdArr[idIndex + 1];
		var tmBasIdArr = ['tm_bas_plant_id', 'tm_bas_workshop_id', 'tm_bas_line_id', 'tm_bas_uloc_id'];
		var nowTmBasId = tmBasIdArr[idIndex];
		var nextTmBasId = tmBasIdArr[idIndex + 1];
		var groupNameArr = ['workshop', 'line', 'uloc'];
		var groupName = groupNameArr[idIndex];
		var clsName = $(this).attr('id');
		var name;
		var group;
		var checkeds = $('#' + nowGroupId + ' input:checked');
		if (idIndex < 3) {
			if (checkeds.length === 0) {
				//清空
				$('#' + nextGroupId).empty();
			} else if ($(this).is(':checked')) {
				group = _results[groupName];
				var box;
				box = '<div class="' + clsName + '" style="padding:10px"></div>';
				$('#' + nextGroupId).append(box);
				var checkBoxs = '';
				for (var j = 0; j < group.length; j++) {
					if (group[j][nowTmBasId] == clsName) {
						name = group[j].name_cn ? group[j].name_cn : group[j].name;
						checkBoxs += '<label style="margin-right:15px;"><input id="' + group[j][nextTmBasId] + '" type="checkbox" />' + name + '</label>';
					}
				}
				$('#' + nextGroupId + ' .' + clsName).html(checkBoxs);
				if (!$("#" + nextGroupId + ' .' + clsName).html()) {
					$("#" + nextGroupId + ' .' + clsName).remove();
				}

			} else {
				$("#" + nextGroupId + ' .' + clsName).remove();
			}
		}

		if (!$("#" + nextGroupId).html()) {
			switch (idIndex) {
				case 0:
					$('#' + groupIdArr[idIndex + 2]).empty();
					$('#' + groupIdArr[idIndex + 3]).empty();
					break;
				case 1:
					$('#' + groupIdArr[idIndex + 2]).empty();
					break;
			}
		}
	});

	// 保存
	$('.btn').on('click', function () {
		if ($(this).html() == '保存') {
			var datas = {};
			datas.tsSysGroupId = $('#comboGroup').val();
			datas.tmBasPlantId = [];
			datas.tmBasWorkshopId = [];
			datas.tmBasLineId = [];
			datas.tmBasUlocId = [];
			$('#gc_list_bg').find('input:checked').each(function () {
				datas.tmBasPlantId.push($(this).attr('id'));
			});

			$('#cj_list_bg').find('input:checked').each(function () {
				datas.tmBasWorkshopId.push($(this).attr('id'));
			});

			$('#cx_list_bg').find('input:checked').each(function () {
				datas.tmBasLineId.push($(this).attr('id'));
			});

			$('#gw_list_bg').find('input:checked').each(function () {
				datas.tmBasUlocId.push($(this).attr('id'));
			});

			var url = '/system/sysGroupPermission/add';
			$.when(Ew.ewAjax(url, JSON.stringify(datas))).done(function (results) {
				console.log('success');
			});
		}
	});

	// panel
	Ew.panel('.gc_bg', {
		title: '工厂',
		panelType: 'right',
		content: '<div id="gc_list_bg" style="float:left; width:100%;height: 440px; overflow-y:scroll;padding:10px"></div>',
		onLoadsucess: function () {}
	})

	// panel  
	Ew.panel('.cj_bg', {
		title: '车间',
		panelType: 'right',
		content: '<div id="cj_list_bg" class="menuContent" style=" width:100%;height: 440px; overflow-y:scroll;"></div>',
	})

	// panel
	Ew.panel('.cx_bg', {
		title: '产线',
		panelType: 'right',
		content: '<div id="cx_list_bg" class="menuContent" style=" width:100%;height: 440px; overflow-y:scroll;"></div>',
	})

	// panel
	Ew.panel('.gw_bg', {
		title: '工位',
		panelType: 'none',
		content: '<div id="gw_list_bg" class="menuContent" style=" width:100%;height: 440px; overflow-y:scroll;"></div>',
	})



	//表格
	Ew.table('.demoTable', {
		tableId: 'tableUser',
		tableTitle: '用户信息',
		panelType: 'left',
		tableValue: {
			searchParams: mainSearchData,
			queryParams: function () {
				id = $('#comboGroup').val() ? $('#comboGroup').val() : -1;
				return {
					tsSysGroupId: id
				};
			},
			url: '/system/sysGroupUser/query',
			columns: [{
				checkbox: true
			}, {
				field: 'no',
				title: '用户名',
				align: 'center',
				sortable: true
			}, {
				field: 'name',
				title: '中文姓名',
				align: 'center',
				sortable: true
			}, {
				field: 'name_en',
				title: '英文姓名',
				align: 'center',
				sortable: true
			}, {
				field: 'mail',
				title: '邮箱',
				align: 'center',
				sortable: true
			}, {
				field: 'mobile',
				title: '手机号',
				align: 'center',
				sortable: true
			}, {
				field: 'status',
				title: '状态',
				align: 'center',
				sortable: true
			}]
		}
	});
});