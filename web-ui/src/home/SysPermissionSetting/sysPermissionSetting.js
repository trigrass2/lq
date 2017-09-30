var currentDeptUser = null;
var queryDeptUrl = apiUrl + "/system/sysDeptUser/queryAllDeptUser";
var queryUserConditionUrl = apiUrl + "/system/sysUserCondition/querylistByPage";
var queryUserGroupUrl = apiUrl + "/system/sysUserCondition/queryGroupInfo";
var queryGroupListUrl = apiUrl + "/system/sysGroup/queryPermissionAdd";

$(function () {
	getDictionary('OPERATOR_TYPE','operator'); //数据字典下拉
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

function querySelect(){
	searchList('tableId', apiUrl +'/system/sysGroupCondition/queryTableSelect', '', 'table', 'table');
	searchList('columnId', apiUrl +'/system/sysGroupCondition/queryColumnSelect', '', 'column', 'column');
    $("#tableId").change(function(){
    	var table = $('#tableId option:selected').val();
    	if (table == "") {
        	searchList('columnId', apiUrl +'/system/sysGroupCondition/queryColumnSelect', '', 'column', 'column');
    	}else {
    		searchList('columnId', apiUrl +'/system/sysGroupCondition/queryColumnByTableSelect/' + table.split("-")[0], '', 'column', 'column');
    	}
    })	
}

//定义表格
var TableInit = function () {
	var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
	    initDeptUser();
	    initUserGroup();
	    initUserCondition();
//	    initPermissionList();
	};
	return oTableInit;
}

//查询按钮调用事件
function initTable(){
	currentDeptUser = null;
	initTableDeptUser();
	initTableUserCondition();
}

//查询部门用户信息
function initTableDeptUser(){  
	var datas = $('#formSearch').serializeObject();     
	$("#tb_deptUser").bootstrapTable('refreshOptions', {
        url: queryDeptUrl, 
//      pagination: true,                   //是否显示分页（*）
        pageNumber:1,
        treeView: true,
        treeCollapseAll: true,//是否全部展开
        treeId: "tsSysDeptId",
        treeField: "no",
        treeRootLevel: 1,
        clickToSelect: true,   
        idField: "tsSysDeptId",
        queryParams:function queryParams(params) {   //设置查询参数
       		var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                pageSize: params.limit,   //页面大小
                offset: params.offset,  //页码
                pageIndex : params.offset/params.limit+1,
                no : $('#deptS').val(),
                name : $('#userS').val()
            };
        	temp = addParams(datas,temp);
            return temp;
        }
	});
}

//查询业务权限从表
function initTableUserCondition(){
	$("#tb_userGroup").bootstrapTable('refreshOptions', {
        url: queryUserGroupUrl, 
        pagination: true,                   //是否显示分页（*）
        pageNumber:1,
        queryParams: function queryParams(params) {   // 设置查询参数
     		var temp = {   // 这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                pageSize: params.limit,   //页面大小
                offset: params.offset,  //页码
                pageIndex : params.offset/params.limit+1,
//              tsSysGroupId : $('#tsSysGroupId').val(),
                tsSysUserId : currentDeptUser == null ? 0 : currentDeptUser.tsSysDeptId,
                flag : currentDeptUser == null ? 0 : currentDeptUser.flag
            };
            return temp;                 
        }
    });
	
	$("#tb_userCondition").bootstrapTable('refreshOptions', {
        url: queryUserConditionUrl, 
        pagination: true,                   //是否显示分页（*）
        pageNumber:1,
        queryParams: function queryParams(params) {   // 设置查询参数
     		var temp = {   // 这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                pageSize: params.limit,   //页面大小
                offset: params.offset,  //页码
                pageIndex : params.offset/params.limit+1,
//              tsSysGroupId : $('#tsSysGroupId').val(),
                tsSysUserId : currentDeptUser == null ? 0 : currentDeptUser.tsSysDeptId,
                flag : currentDeptUser == null ? 0 : currentDeptUser.flag
            };
            return temp;                 
        }
    });
}

function initDeptUser(){
	var datas = $('#formSearch').serializeObject();
	
	var columns =  [{
		checkbox: true
	},{
		field: 'no',
		title: '部门编号'
	},{
		field: 'name',
		title: '部门名称',
		align: 'center'
	},{
		field: 'manager',
		title: '负责人',
		align: 'center'
	}];

	var conditionObj = {};
    conditionObj.cTSelect = false;
	inittreetable(queryDeptUrl,datas,"tb_deptUser","tsSysDeptId","toolbarL",onClickRow,columns,"no","asc",conditionObj);
}

function onClickRow(row, tr) {
    //加载编码值表数据
	 currentDeptUser = row;
	 initTableUserCondition();
}

function initUserGroup(){
	var datas = {
		pageSize: 10,   //页面大小
        tsSysUserId : 0,
        flag : 0
	};
	var columns = [{
        checkbox: true
    },{
        field: 'groupNo',
        title: '业务权限编号',
        align: 'center'
    }, {
        field: 'groupName',
        title: '业务权限名称',
        align: 'center'
    }, {
        field: 'groupRemark',
        title: '备注',
        align: 'center'
    }];
	initbstable(queryUserGroupUrl,datas,"tb_userGroup","trSysUserConditionId","toolbarR",null,columns,"groupNo","asc");
}

function initUserCondition(){
	var datas = {
		pageSize: 10,   //页面大小
        tsSysUserId : 0,
        flag : 0
	};
	var columns = [{
        checkbox: true
    },{
        field: 'tableName',
        title: '业务表名',
        align: 'center'
    }, {
        field: 'rowName',
        title: '业务字段名',
        align: 'center'
    }, {
        field: 'operator',
        title: '关系运算符',
        align: 'center',
        formatter: function (value, row, index) {
         	var i = $('#operator')[0].options.length;  
         	while (i--) {  
         	    if ($('#operator')[0].options[i].value == value) {  
         		   	return  $('#operator')[0].options[i].text;
         	    }  
         	}       
        }
    }, {
        field: 'value',
        title: '数值',
        align: 'center'
    }, {
        field: 'groupNo',
        title: '权限组',
        align: 'center'
    }];
	initbstable(queryUserConditionUrl,datas,"tb_userCondition","trSysUserConditionId","toolbarR",null,columns,"no","asc");
}

function openPermissionSetting() {
	var rows = $("#tb_deptUser").bootstrapTable("getSelections");
    if (rows.length < 1) {
	    layer.msg("请选择要修改的数据！");
        return;
    }
    if (rows.length > 1) {
        layer.msg("只能选择一条数据！")
        return;
    }
    var row = rows[0];
    rowId = row.tsSysDeptId;
    $("#tsSysDeptIdG").val(rowId);
    $("#flagG").val(row.flag);
	$("#tb_groupList").bootstrapTable('destroy'); 
	initPermissionList();
    $('#groupModal').modal("show");
}

function groupSearch(){
	$('#tb_groupList').bootstrapTable("refresh");
}

function initPermissionList(){
	$('#tb_groupList').bootstrapTable({
        url: queryGroupListUrl,         //请求后台的URL（*）
        method: 'post',                      //请求方式（*）
        toolbar: '#toolbar',                //工具按钮用哪个容器
        showExport: false,                     //是否显示导出
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
	            offset: params.offset,  //页码
	            pageIndex : params.offset/params.limit+1, //当前页面,默认是上面设置的1(pageNumber)
	            tsSysDeptId : $("#tsSysDeptIdG").val() == '' ? null : $("#tsSysDeptIdG").val(),
	            flag : $("#flagG").val() == '' ? null : $("#flagG").val(),
	            no:  $("#noG").val() == '' ? null : $("#noG").val(),
	            name:  $("#nameG").val() == '' ? null : $("#nameG").val()
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
        clickToSelect: true,                //是否启用点击选中行
        height: 400,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "tsSysGroupId",                     //每一行的唯一标识，一般为主键列
        showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                   //是否显示父子表
        responseHandler:function(res){
         	var errcode = res.code;//在此做了错误代码的判断
         	if(errcode != 10000){
         	    layer.msg("错误代码" + errcode);
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
            title: '业务权限编号'
        }, {
            field: 'name',
            title: '业务权限名称'
        }, {
            field: 'remark',
            title: '备注'
        }]
    });
}

//批量增加用户权限映射关系
function saveGroupUser(){
	var rows = $("#tb_groupList").bootstrapTable("getSelections");
    if (rows.length < 1) {
        layer.msg("没有选择的数据！")
        return;
    }
    var sysGroupUsers = new Array();
    for(var i = 0; i < rows.length; i++) {
        var sysGroupUser = {tsSysDeptId : '', tsSysUserId : '', tsSysGroupId : ''};
        if($("#flagG").val() == '0'){
        	sysGroupUser.tsSysDeptId = $("#tsSysDeptIdG").val();
        }
        if($("#flagG").val() == '1'){
        	sysGroupUser.tsSysUserId = $("#tsSysDeptIdG").val();
        }        
        sysGroupUser.tsSysGroupId = rows[i].tsSysGroupId;
        sysGroupUsers.push(sysGroupUser);
    }
    datas = JSON.stringify(sysGroupUsers);

    $.ajax({
        type: 'POST',
        url: apiUrl + '/system/sysUserCondition/addBatch',
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
                $('#groupModal').modal("hide");
                $('#tb_deptUser').bootstrapTable('refresh');
            }
        }
    });
}

//打开条件设置窗口
function openConditionSetting(){
	var rows = $("#tb_deptUser").bootstrapTable("getSelections");
	if (rows.length < 1) {
		layer.msg("没有选择的数据！",{icon:2,time:1000});
		return;
	}
	if (rows.length > 1) {
		layer.msg("只能选择一条数据！",{icon:2,time:1000});
		return;
	}
	if (rows[0].flag == '0'){
		layer.msg('不能给部门进行条件设置！', {icon:7});
    	return;
	}

	querySelect();
	$("#deptC").val(rows[0].parentId);
	$("#userC").val(rows[0].no);
	$("#tsSysUserId", $("#formCondition")).val(rows[0].tsSysDeptId);
	$("#tsSysDeptId", $("#formCondition")).val(rows[0].parentId);
	$('#conditionModal').modal({backdrop: 'static', keyboard: false});
}


//打开条件设置窗口
function openConditionAdd(){
	if (currentDeptUser == null) {
    	layer.msg('没有选择的数据！', {icon:7});
    	return;
	}
	if (currentDeptUser.flag == '0'){
		layer.msg('不能给部门进行条件设置！', {icon:7});
    	return;
	}
	querySelect();
	$("#deptC").val(currentDeptUser.parentId);
	$("#userC").val(currentDeptUser.no);
	$("#tsSysUserId", $("#formCondition")).val(currentDeptUser.tsSysDeptId);
	$("#tsSysDeptId", $("#formCondition")).val(currentDeptUser.parentId);
	$('#conditionModal').modal({backdrop: 'static', keyboard: false});
}

//保存条件设置信息
function saveConditionInfo(){
	var form = $('#formCondition');
	form.data('bootstrapValidator').validate();  
    if(!form.data('bootstrapValidator').isValid()){  
        return;  
    }
	var datas = form.serializeObject();
	if(datas.table != null){
		datas.tableNo = datas.table.split("-")[0];
		datas.tableName = datas.table.substring(datas.tableNo.length + 1);
	}else{
		datas.tableNo = "";
		datas.tableName = "";
	}
	if(datas.column != null){
		datas.columnNo = datas.column.split("-")[0];
		datas.rowName = datas.column.substring(datas.columnNo.length + 1);
	}else{
		datas.columnNo = "";
		datas.rowName = "";
	}	
	var url = apiUrl + "/system/sysUserCondition/add";
    datas = JSON.stringify(datas);
    save(url,datas,"conditionModal",initTableUserCondition);
}

function validForm(){
	$('#formCondition').bootstrapValidator({
		message: '验证不通过',
		feedbackIcons: {
			valid: 'glyphicon glyphicon-ok',
			invalid: 'glyphicon glyphicon-remove',
			validating: 'glyphicon glyphicon-refresh'
		},
		fields: {
			column: {
				validators: {
					notEmpty: {
						message: '业务字段名不能为空'
					}
				}
			},
			operator: {
				validators: {
					notEmpty: {
						message: '关系运算符不能为空'
					}
				}
			},
			value: {
				validators: {
					notEmpty: {
						message: '数值不能为空'
					},
					stringLength: {
						min: 1,
						max: 50,
						message: '数值长度不能超过50'
					}
				}
			}
		}
	});	
};

$("#conditionModal").on("hidden.bs.modal", function() {
	var form = $("#formCondition");
	$(this).removeData("bs.modal");
	form[0].reset();
	form.data('bootstrapValidator').resetForm();  
});


//删除
function deleteConditionInfo(){
	var rows = $("#tb_userCondition").bootstrapTable("getSelections");
	if (rows.length < 1) {
		layer.msg("没有选择的数据！",{icon:2,time:1000});
		return;
	}

	var ids = new Array();
	for(var i = 0; i < rows.length; i++){
		ids[i] =  rows[i].trSysUserConditionId;
	} 
	deleteBatch(apiUrl + "/system/sysUserCondition/delete",  {trSysUserConditionId : ids}, initTableUserCondition);
}

function searchList(listId,url,where,keyId,name){
	data = {};
	if(where && where != null){
		data=JSON.stringify(where);
	}
	$.ajax({  
		type: "POST",
		url: url,  
        data: data,
        dataType: "json",
        contentType: "application/json",
        async:false,
//	        contentType: "application/x-www-form-urlencoded",
        beforeSend: function(request) {
        	request.setRequestHeader("token", sessionStorage.token);
        },
        success: function (data) {
        	$("#" + listId).empty();
        	$("#" + listId).append("<option value=''></option>");
            $.each(data.results, function (index, row) {  
                $("#" + listId).append("<option value="+ row[keyId]+">" + row[name] + "</option>");  
            });  
        }
    });  
}

/*初始化表格*/
function inittreetable(url,datas,tableid,uniqueId,toolbar,onClickRow,columns,sortName,sortOrder,conditionObj){
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
//       pagination: true,                   //是否显示分页（*）
        treeView: true,
        treeCollapseAll: true,//是否全部展开
        treeId: uniqueId,
        treeField: "no",
        treeRootLevel: 1,
        clickToSelect: true,   
        idField: uniqueId,
         sortable: true,                     //是否启用排序
         sortOrder: sortOrder,                   //排序方式
         sortName: sortName,                 //排序字段
         queryParams:function queryParams(params) {   //设置查询参数
       		var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
//                   pageSize: params.limit,   //页面大小
//                   offset: params.offset,  //页码
//                   pageIndex : params.offset/params.limit+1,
                     keyword:params.search,//搜索
                     sortOrder: params.order,//排序
                     sortName: params.sort//排序字段
              };
       		temp = addParams(datas,temp);
            return temp;
         },
         onClickRow:onClickRow,
         dataField: "data",					//这是返回的json数组的key.默认好像是"rows".这里只有前后端约定好就行
         sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
         pageNumber:1,                       //初始化加载第一页，默认第一页
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
         columns: columns,
         onLoadSuccess: function (data) {
             showBox("#"+tableid+" > tbody td","#showbox");
        	 return false;
         }
     });
   return table;
}