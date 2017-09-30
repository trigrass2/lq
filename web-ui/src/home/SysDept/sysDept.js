var mod_flag = 0;
var currentDept = null;
var queryDeptUrl = apiUrl + "/system/sysDept/querylistByPage";
var queryDeptUserUrl = apiUrl + "/system/sysDeptUser/querylistByPage";

$(function () {
	//getDictionary('SPECIALDATE_TYPE','search_type'); //数据字典下拉
//	initTable();
	validForm();
	layui.use(['layer'], function(){
		layer = layui.layer;//弹出层
	});
	
	//1.初始化Table
    var oTable = new TableInit();
    oTable.Init();
	
    //当点击查询按钮的时候执行  
    $("#btn_query").bind("click", initTable);  
    
	//重置按钮事件  
    $("#btn_clear").bind("click",function(){  
    	$("#formSearch")[0].reset();
    	initTable();
    });
});

//定义表格
var TableInit = function () {
	var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
	    initDept();
	    initDeptUser();
	    initUser();
	};
	return oTableInit;
}

//查询按钮调用事件
function initTable(){
	currentDept = null;
	initTableDept();
	initTableDeptUser();
}

//查询部门信息主表
function initTableDept(){  
	var datas = $('#formSearch').serializeObject();     
	$("#tb_dept").bootstrapTable('refreshOptions', {
        url: queryDeptUrl,         //请求后台的URL（*）
        method: 'post',                      //请求方式（*）
        toolbar: "#toolbarL",
        treeView: true,
        treeCollapseAll: true,//是否全部展开
        treeId: "tsSysDeptId",
        treeField: "no",
        treeRootLevel: 1,
        clickToSelect: true,                //是否启用点击选中行
        dataField: "data",					//这是返回的json数组的key.默认好像是"rows".这里只有前后端约定好就行
//          height: $(window).height(),
        height: 400,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        idField: "tsSysDeptId",
        sortName: "no",
        showRefresh: false,
        search: true,
        striped: true,
        ajaxOptions:{
        	headers: {
        		token:sessionStorage.token
        	}
        },
        queryParams:function queryParams(params) {   //设置查询参数
       		var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                pageSize: params.limit,   //页面大小
                offset: params.offset,  //页码
                pageIndex : params.offset / params.limit + 1,
                no : $("#deptNoS").val() == '' ? null : $("#deptNoS").val(),
                name : $("#deptNameS").val() == '' ? null : $("#deptNameS").val()
            };
        	temp = addParams(datas,temp);
            return temp;
        },
        clickToSelect: true,
        responseHandler:function(res){
        	var errcode = res.code;//在此做了错误代码的判断
    	    if(errcode != 10000){
    	        alert("错误消息: " + errcode);
    	        return;
    	    }
    	    //如果没有错误则返回数据，渲染表格
    	    return {
    	        total : res.count, //总页数,前面的key必须为"total"
    	        data : res.results //行数据，前面的key要与之前设置的dataField的值一致.
    	    };
        }        
	});
}

//查询部门用户从表
function initTableDeptUser(){  
	$("#tb_dept_user").bootstrapTable('refreshOptions', {
        url: queryDeptUserUrl, 
        pagination: true,                   //是否显示分页（*）
        pageNumber: 1,
        queryParams: function queryParams(params) {   // 设置查询参数
     		var temp = {   // 这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                pageSize: params.limit,   //页面大小
                offset: params.offset,  //页码
                pageIndex : params.offset/params.limit+1,
//              trSysGroupConditionId : $('#trSysGroupConditionId').val(),
                tsSysDeptId : currentDept == null ? 0 : currentDept.tsSysDeptId
            };
            return temp;                 
        }
    });
}

function initDept(){
	var datas = $('#formSearch').serializeObject();
	
	var columns =  [{
		checkbox: true
	},{
		field: 'no',
		title: '部门编号',
		align: 'center'
	},{
		field: 'name',
		title: '部门名称',
		align: 'center'
	},{
		field: 'manager',
		title: '负责人',
		align: 'center'
	},{
		field: 'seq',
		title: '顺序号',
		align: 'center'
	}];

	var conditionObj = {};
    conditionObj.cTSelect = false;
	inittreetable(queryDeptUrl,datas,"tb_dept","tsSysDeptId","toolbarL",onClickRow,columns,"no","asc",conditionObj,"no");
}

function onClickRow(row, tr) {
    //加载编码值表数据
	 currentDept = row;
	 initTableDeptUser();
}

function initDeptUser(){
	var datas = {
		pageSize: 10,   //页面大小
        tsSysDeptId : 0
	};
	var columns = [{
        checkbox: true
    },{
        field: 'no',
        title: '用户名',
        align: 'center'
    }, {
        field: 'name',
        title: '中文名称',
        align: 'center'
    }, {
        field: 'remark',
        title: '备注',
        align: 'center'
//      formatter: function (value, row, index) {
//       	var i = $('#operator')[0].options.length;  
//       	while (i--) {  
//       	    if ($('#operator')[0].options[i].value == value) {  
//       		   	return  $('#operator')[0].options[i].text;
//       	    }  
//       	}       
//      }
    }];
	initbstable(queryDeptUserUrl,datas,"tb_dept_user","trSysDeptUserId","toolbarR",null,columns,"no","asc");
}

function initUser(){
	  $('#tb_userList').bootstrapTable({
        url: apiUrl + "/system/sysDeptUser/queryDeptUserAdd",         //请求后台的URL（*）
        method: 'post',                      //请求方式（*）
        showExport: false,                     //是否显示导出
        toolbar: '#toolbar',                //工具按钮用哪个容器
        exportDataType: "all",              //basic', 'all', 'selected'.
        striped: true,                      //是否显示行间隔色
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                   //是否显示分页（*）
        dataField: "data",					//这是返回的json数组的key.默认好像是"rows".这里只有前后端约定好就行
        sortable: false,                     //是否启用排序
        sortOrder: "asc",                   //排序方式
        queryParams:function queryParams(params) {   //设置查询参数
 		    var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
	 			pageSize: params.limit,   //页面大小
	            pageIndex : params.offset/params.limit+1, //当前页面,默认是上面设置的1(pageNumber)
	            tsSysDeptId : currentDept == null ? 0 : currentDept.tsSysDeptId,
	            no:  $("#noR").val(),
                name:  $("#nameR").val()
	        };
	        return temp;
        },
        sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
        pageNumber:1,                       //初始化加载第一页，默认第一页
        pageSize: 10,                       //每页的记录行数（*）
        pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
        search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        strictSearch: false,
        showColumns: false,                  //是否显示所有的列
        showRefresh: false,                  //是否显示刷新按钮
        minimumCountColumns: 2,             //最少允许的列数
        clickToSelect: false,                //是否启用点击选中行
        height: 400,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "tsSysUserId",                     //每一行的唯一标识，一般为主键列
        showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                   //是否显示父子表
        responseHandler:function(res){
       	var errcode = res.code;//在此做了错误代码的判断
   	    if(errcode != 10000){
   	        layer.msg(res.message,{icon:2,time:1000});
   	        return;
   	    }
   	    //如果没有错误则返回数据，渲染表格
   	    return {
   	        total : res.count, //总页数,前面的key必须为"total"
   	        data : res.results //行数据，前面的key要与之前设置的dataField的值一致.
   	    };
       },
        columns: [{
            checkbox: true
        },{
            field: 'no',
            title: '用户名'
        }, {
            field: 'name',
            title: '中文姓名'
        }, {
            field: 'remark',
            title: '备注'
        }]
    });
}

function userSearch(){
	$('#tb_userList').bootstrapTable("refresh");
}

function openUserAddWin() {
	var rows = $("#tb_dept").bootstrapTable("getSelections");
    if (rows.length < 1) {
	     layer.msg("请选择部门数据！");
        return;
    }
    if (rows.length > 1) {
        layer.msg("只能选择一条数据！")
        return;
    }
    var row = rows[0];
    rowId = row.tsSysDeptId;
//	rowId = currentDept.tsSysDeptId;
    $("#deptIdHidden").val(rowId);
    $('#deptUserModal').modal("show");
}

//批量增加部门用户映射关系
function saveUserInfos(){
	var rows = $("#tb_userList").bootstrapTable("getSelections");
    if (rows.length < 1) {
        layer.msg("没有选择的数据！")
        return;
    }
    var sysDeptUsers = new Array();
    for(var i = 0; i < rows.length; i++) {
    	var sysDeptUser = {tsSysDeptId:'',tsSysUserId:''};
        sysDeptUser.tsSysDeptId = $("#deptIdHidden").val();
        sysDeptUser.tsSysUserId = rows[i].tsSysUserId;
        sysDeptUsers.push(sysDeptUser);
    }
    datas = JSON.stringify(sysDeptUsers);
    $.ajax({
		type: 'POST',
		url: apiUrl +'/system/sysDeptUser/addBatch',
		data: datas,
		contentType:"application/json",
		dataType: 'JSON',
		traditional: true,
		success: function (data) {
			var errcode = data.code;//在此做了错误代码的判断
			if(errcode != 10000){
				layer.msg(data.message);
				return;
			}
			if(data.results){
				layer.msg(data.message);
				$('#deptUserModal').modal("hide");
				$('#tb_dept_user').bootstrapTable('refresh');
			}
		}
	});
}


function validForm(){
	$('#formEdit').bootstrapValidator({
		message: '验证不通过',
		feedbackIcons: {
			valid: 'glyphicon glyphicon-ok',
			invalid: 'glyphicon glyphicon-remove',
			validating: 'glyphicon glyphicon-refresh'
		},
		fields: {
			no: {
				validators: {
					notEmpty: {
						message: '部门编号不能为空'
					},
					stringLength: {
						min: 1,
						max: 20,
						message: '部门编号长度不能超过20'
					}
				}
			},
			name: {
				validators: {
					notEmpty: {
						message: '部门名称不能为空'
					},
					stringLength: {
						min: 1,
						max: 50,
						message: '部门名称长度不能超过50'
					}
				}
			},
			manager: {
				validators: {
					stringLength: {
						min: 0,
						max: 32,
						message: '负责人长度不能超过32'
					}
				}
			},
			seq: {
				validators: {
					stringLength: {
						min: 0,
						max: 2,
						message: '顺序号长度不能超过2'
					}
				}
			},
			remark: {
				validators: {
					stringLength: {
						min: 0,
						max: 200,
						message: '备注长度不能超过200'
					}
				}
			}
		}
	});
};


$("#addModal").on("hidden.bs.modal", function() {
	var form = $("#formEdit");
	$(this).removeData("bs.modal");
	form[0].reset();
	form.data('bootstrapValidator').resetForm();  
});

//打开新增窗口
function openAddWin(){
	mod_flag = 0;
	$("#titleId").html('新增');
	clearForm($('#addModal'));
	$('#formEdit').data('bootstrapValidator').resetForm();
	var rows = $("#tb_dept").bootstrapTable('getSelections');
	if (rows.length > 1) {
		layer.msg("只能选择一条数据！",{icon:7,time:1000});
		return;
	}
	if (rows.length < 1) {
		$('#level').val(1);
		$('#parentId').val(null);
	}else if (rows.length = 1) {
		var row = rows[0];
		$('#level').val(row.level + 1);
		$('#parentId').val(row.tsSysDeptId);
	}
	
	$('#addModal').modal("show");
}

//打开编辑窗口
function openEditWin(){
	var form = $("#formEdit");
	var rows = $("#tb_dept").bootstrapTable('getSelections');
	if (rows.length < 1) {
		layer.msg("没有选择的数据！",{icon:7,time:1000});
		return;
	}
	if (rows.length > 1) {
		layer.msg("只能选择一条数据！",{icon:7,time:1000});
		return;
		}
	var row = rows[0];
	setFormValue(form,row);
	$("#titleId").html('编辑');
	mod_flag = 1;
	$('#addModal').modal("show");
}

//保存信息
function saveInfo(){
	var form = $('#formEdit');
	form.data('bootstrapValidator').validate();
	if(!form.data('bootstrapValidator').isValid()){
		return;
	}
	var data=$('#formEdit').serializeObject();
	data=JSON.stringify(data);
	if (mod_flag == 0){
		url = apiUrl + "/system/sysDept/add";
	} else {
		url = apiUrl + "/system/sysDept/update";
	}
	
    save(url,data,"addModal",initTableDept);
}

//删除部门
function deleteInfo(){
	var rows = $("#tb_dept").bootstrapTable("getSelections");
	if (rows.length < 1) {
		layer.msg("没有选择的数据！",{icon:2,time:1000});
		return;
	}
	
	var ids = new Array();
	for(var i = 0; i < rows.length; i++){
		ids[i] =  rows[i].tsSysDeptId;
	} 
	deleteBatch(apiUrl + "/system/sysDept/deleteBatch",  ids, initTableDept);
}

//删除部门用户
function deleteUserInfo(){
	var rows = $("#tb_dept_user").bootstrapTable("getSelections");
	if (rows.length < 1) {
		layer.msg("没有选择的数据！",{icon:2,time:1000});
		return;
	}
	
	var ids = new Array();
	for(var i = 0; i < rows.length; i++){
		ids[i] =  rows[i].trSysDeptUserId;
	} 
	deleteBatch(apiUrl + "/system/sysDeptUser/delete",  {trSysDeptUserId : ids}, initTableDeptUser);
}



/*初始化表格*/
function inittreetable(url,datas,tableid,uniqueId,toolbar,onClickRow,columns,sortName,sortOrder,conditionObj,treeField){
	if(onClickRow == null){
		onClickRow = onClickRowEvent;
	}
	var cTSelect=true;
	if(conditionObj && conditionObj != undefined){
		cTSelect=conditionObj.cTSelect;
	}
	var table = $('#'+tableid).bootstrapTable({
		url: url,         //请求后台的URL（*）
        method: 'post',                      //请求方式（*）
        toolbar: '#'+toolbar,                //工具按钮用哪个容器
        striped: true,                      //是否显示行间隔色
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
//      pagination: true,                   //是否显示分页（*）
        treeView: true,
        treeCollapseAll: true,//是否全部展开
        treeId: uniqueId,
        treeField: treeField,
        treeRootLevel: 1,
        idField: uniqueId,
        sortable: true,                     //是否启用排序
        sortOrder: sortOrder,                   //排序方式
        sortName: sortName,                 //排序字段
        queryParams:function queryParams(params) {   //设置查询参数
       		var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            	pageSize: params.limit,   //页面大小
            	offset: params.offset,  //页码
            	pageIndex : params.offset/params.limit+1,
            	keyword:params.search,//搜索
            	sortOrder: params.order,//排序
            	sortName: params.sort//排序字段
            };
       		temp = addParams(datas,temp);
            return temp;
        },
        onClickRow:onClickRow,
        dataField: "data",					//这是返回的json数组的key.默认好像是"rows".这里只有前后端约定好就行
//       sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
//       pageNumber:1,                       //初始化加载第一页，默认第一页
//       pageSize: 10,                       //每页的记录行数（*）
//       pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
        search: true,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        strictSearch: false,
        showColumns: false,                  //是否显示所有的列
        showRefresh: false,                  //是否显示刷新按钮
        minimumCountColumns: 2,             //最少允许的列数
        clickToSelect: cTSelect,                //是否启用点击选中行
        uniqueId: uniqueId,        //每一行的唯一标识，一般为主键列
        showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                   //是否显示父子表
		responseHandler:responseHandler,
		height: 480,
        columns: columns,
        onLoadSuccess: function (data) {
            showBox("#"+tableid+" > tbody td","#showbox");
            return false;
        }
     });
   return table;
}
