layui.use('layer',function(){
	layer=layui.layer;
});

$(function(){
	//搜索条件
	var mainSearchData=[{
		idName:'textName',
		text:'用户名',
		field:'name'
	},{
		idName:'comboMsgType',
		text:'消息类型',
		field:'msgType',
		comboUrl:'/system/codeList/getSelect',
		comboData:'MSG_TYPE',
		comboId:'no',
		comboText:'name'
	},{
		idName:'textTitle',
		text:'标题',
		field:'title'
	}]

	Ew.search('.searchForm',{
		title:'查询',
		textValues:mainSearchData,
		btnValues:[{
			btnId:'btnSearch',
			text:'搜索',
			onClick:function(data){
				$('#tableSysUserMsg').bootstrapTable('refresh');
			}
		},{
			btnId:'btnClear',
			text:'重置',
			tableid:['tableSysUserMsg']
		}]
	});

	//主表格
	Ew.table('.mainTable',{
		btnValues:[],
		tableId:'tableSysUserMsg',
		tableValue:{
			searchParams:mainSearchData,
			queryParams:function(){
				return{}
			},
			onClickRow:function(item,$element){

			},
			onLoadSuccess:function(){

			},
			url:'/system/sysUserMsg/querylistByPage',
			columns:[{
				checkbox: true
			},{
				field: 'msgType',
				title: '消息类型',
				align: 'center',
				sortable:true,
				formatter: function (value, row, index) {
                    if (value == "AND"){
                    	return '按灯';
                    }else if (value == "NTC"){
                    	return '通知';
                    }else if (value == "TSK"){
                    	return '任务';
                    }
            	}
			},{
				field: 'name',
				title: '用户',
				align: 'center',
				sortable:true
			},{
				field: 'no',
				title: '消息编号',
				align: 'center',
				sortable:true
			},{
				field: 'title',
				title: '消息标题',
				align: 'center',
				sortable:true
			},{
				field: 'msgStatus',
				title: '状态',
				align: 'center',
				sortable:true,
				formatter: function (value, row, index) {
                    if (value == "E"){
                    	return '过期';
                    }else if (value == "N"){
                    	return '未读';
                    }else if (value == "Y"){
                    	return '已读';
                    }
            	}
			},{
				field: 'sendType',
				title: '类型',
				align: 'center',
				sortable:true,
				formatter: function (value, row, index) {
                    if (value == "APP"){
                    	return 'APP';
                    }else if (value == "MAIL"){
                    	return '邮箱';
                    }else if (value == "WEB"){
                    	return 'WEB';
                    }else if (value == "WECHAT"){
                    	return '微信';
                    }
            	}
			},{
				field: 'readTime',
				title: '读取时间',
				align: 'center',
				sortable:true
			}]
		}
	});
})

