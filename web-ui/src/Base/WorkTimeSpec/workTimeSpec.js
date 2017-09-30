layui.use('layer',function(){
	layer=layui.layer;

});

$(function(){
	//搜索条件
	var mainSearchData=[{
		idName:'day51',
		text:'日期',
		field:'specialDate'
	},{
		idName:'combo52',
		text:'类型',
		comboUrl:'/system/codeList/getSelect',
		comboData:'SPECIALDATE_TYPE',
		comboId:'no',
		comboText:'name',
		field:'type'
	}];

	Ew.search('.demoSearch',{
		title:'查询',
		textValues:mainSearchData,
		btnValues:[{
			btnId:'search',
			text:'搜索',
			onClick:function(data){
				$('#tableWorkTimeSpec').bootstrapTable('refresh');
				$('#tableWorkTimeSpec').bootstrapTable('refreshOptions',{pageNumber:1});
			}
		},{
			btnId:'btnClear',
			text:'重置',
			tableid:['tableWorkTimeSpec']
		}]
	});

	//主表格
	Ew.table('.demoTable',{
		btnValues:[{
			btnId:'btnAdd',text:'新增',onClick:function(){
				daliogShow('add')
			}
		},{
			btnId:'btnEdit',text:'编辑',otherOption:[{id:'tableWorkTimeSpec',selectNum: 1}],onClick:function(){
				daliogShow('change')
			}
		},{
			btnId:'btnDelete',text:'删除',isTrue:true,otherOption:[{id:'tableWorkTimeSpec',selMinNum: 1}],onClick:function(){
				var rows = $('#tableWorkTimeSpec').bootstrapTable('getSelections');
				var ids = [];
				$.each(rows,function(index,row){
					ids.push(row.tmBasSpecialdateId);
				});
				datas = JSON.stringify({tmBasSpecialdateId:ids});
				var url = '/worktime/specialdate/delete';
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#tableWorkTimeSpec').bootstrapTable('refresh');
					$('#tableWorkTimeSpec').bootstrapTable('refreshOptions',{pageNumber:1});

	            });
			}
		}],
		tableId:'tableWorkTimeSpec',
		tableValue:{
			searchParams:mainSearchData,
			queryParams:function(){
				return{}
			},
			onClickRow:function(item,$element){
				
			},
			onLoadSuccess:function(){
				
	        },
			url:'/worktime/specialdate/queryAll',
			columns:[{
				checkbox: true
			},{
			    field: 'specialDate',
			    title: '日期',
				align:'center',
				sortable:true
			}, {
			    field: 'week',
			    title: '星期',
				align:'center',
				sortable:true
			}, {
			    field: 'type',
			    title: '类型',
				align:'center',
				sortable:true,
				width:'120px',
			    formatter: function (value, row, index) {
			        if (value == "10"){
			        	return '工作';
			        } else {
			        	return '休息';	
			        }
			    }
			}, {
			    field: 'referDate',
			    title: '参考日期',
				align:'center',
				sortable:true
			},

			{
			    field: 'remark',
			    title: '备注',
				align:'center',
				sortable:true
			}]
		}
	});
})


function daliogShow(type){
	var title=type=='add'?'新增':'编辑';
	var defaultTable=type=='add'?'':'tableWorkTimeSpec';
	Ew.dialog('demoadd',{
		title:title,
		btnValues:[{
			btnId:'btnSave',
			text:'保存',
			formid:'demoform',
			onClick:function(data){
				if (checkEndTime() == false) {
					layer.msg("参考日期不能大于等于选择日期");
					return;
				}
				if(type=='change') data.tmBasSpecialdateId = $('#'+defaultTable).bootstrapTable('getSelections')[0].tmBasSpecialdateId;
				datas = JSON.stringify(data);
				var url = (type=='add'?'/worktime/specialdate/add':'/worktime/specialdate/update');
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#demoadd').modal('hide');
					$('#tableWorkTimeSpec').bootstrapTable('refresh');
	             });
			}
		},{
			btnId:'btnCancal',
			text:'取消'
		}],
		form:{
			formId:'demoform',
			columnNum:2,
			listWidth:350,
			formList:[{
				idName:'day11',
				text:'日期',
				field:'specialDate',
				valid:['notEmpty'],
				disabled:type=='add'?false:true,
				onClick:function(data){
					var week=DayToWeek(data);
					$('#text12').val(week);
				}
			},{
				idName:'text12',
				text:'星期',
				field:'week',
				valid:['notEmpty'],
				disabled:true
			},{
				idName:'combo13',
				text:'类型',
				comboUrl:'/system/codeList/getSelect',
				comboId:'no',
				comboText:'name',
				field:'type',
				valid:['notEmpty'],
				comboData:'SPECIALDATE_TYPE',
				onClick:function(data){
				   if (data.id != 10 ) {
					  $("#day14").prop("disabled",true);  
				   }
				}
			},{
				idName:'day14',
				text:'参考日期',
				field:'referDate',
			},	       
			{idName:'text311',text:'版本号',field:'version',hidden:true},
			{
				idName:'area18',
				text:'备注',
				field:'remark',
				valid:[{type:"string",min:0,max:200}],
				n:2
			}],
			defaultTable:defaultTable
		}
	})

}

function checkEndTime(){  
    var startTime=$("#day11").val();  
    var start=new Date(startTime.replace("-", "/").replace("-", "/"));  
    var endTime=$("#day14").val();  
    var end=new Date(endTime.replace("-", "/").replace("-", "/"));  
    if(end>=start){  
        return false;  
    }  
    return true;  
}

