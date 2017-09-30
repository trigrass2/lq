$(function () {
	$('#Resource_tree').height($(window).height() - 80);
	
	$("#status").bootstrapSwitch(
		{  
	        onText:"启用",  
	        offText:"禁用",  
	        onColor:"success",  
	        offColor:"danger",  
	        size:"small",  
	        onSwitchChange:function(event,state){  
	            if(state==true){  
	                $(this).val("1");  
	            }else{  
	                $(this).val("0");  
	            }  
	        }  
	    });
	
	layui.use(['laydate','element','laypage','layer'], function(){
        $ = layui.jquery;//jquery
      laydate = layui.laydate;//日期插件
      lement = layui.element();//面包导航
      laypage = layui.laypage;//分页
      layer = layui.layer;//弹出层
    });

    //1.初始化Table
    var oTable = new TableInit();
    oTable.Init();

    //2.初始化Button的点击事件
    /*var oButtonInit = new ButtonInit();
    oButtonInit.Init();*/
   toastr.options = {
        closeButton: false,
        debug: false,
        progressBar: false,
        positionClass: "toast-bottom-right",
        onclick: null,
        showDuration: "300",
        hideDuration: "1000",
        timeOut: "1500",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut"
    };
   
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
                       message: '角色编号不能为空'
	                   }
	               }
	           },
           name: {
               validators: {
                   notEmpty: {
                       message: '角色名称不能为空'
	                   }
	               }
	           }
       },
       submitHandler: function (validator, form, submitButton) {
    	   alert("ok");
       }
   });
});

var mod_flag=0

//定义表格
var TableInit = function () {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
    initTbRole();
    initTbRoleUser("");
    initTbUser("");
};
	return oTableInit;
}

//查询按钮调用事件
function initTable(){
    //先销毁表格
    $('#tb_Type').bootstrapTable('destroy');
    initTbType();
}

function initTbRole(){
	 $('#tb_role').bootstrapTable({
         url: apiUrl + "/system/role/querylistByPage",         //请求后台的URL（*）
         method: 'post',                      //请求方式（*）
         toolbar: '#toolbar',                //工具按钮用哪个容器
         showExport: false,                     //是否显示导出
         exportDataType: "all",              //basic', 'all', 'selected'.
         striped: true,                      //是否显示行间隔色
         cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
         pagination: true,                   //是否显示分页（*）
         dataField: "data",					//这是返回的json数组的key.默认好像是"rows".这里只有前后端约定好就行
         sortable: true,                     //是否启用排序
         sortOrder: "asc",                   //排序方式
         queryParams:function queryParams(params) {   //设置查询参数
     		var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
     			 pageSize: params.limit,   //页面大小
                 pageIndex : params.offset/params.limit+1, //当前页面,默认是上面设置的1(pageNumber)
                 no :  $("#txt_search_no").val() == '' ? null : $("#txt_search_no").val() ,
                 name  :  $("#txt_search_name").val() == '' ? null : $("#txt_search_name").val(),
                 remark  :  $("#txt_search_remark").val() == '' ? null : $("#txt_search_remark").val()
             };
             return temp;
         },
         onCheck: function (row) {
        	 $('#tb_user').bootstrapTable("refresh");
        	 $('#tb_user').bootstrapTable("refreshOptions",{pageNumber:1});
        	 var param={ tsSysRoleId: row.tsSysRoleId };
        	 $.ajax({
                 type: "post",
                 url: apiUrl + "/system/role/queryRoleResource",         //请求后台的URL（*）
                 data: JSON.stringify(param),
                 dataType: 'JSON',
                 contentType: "application/json",
                 success: function (data, textStatus, jqXHR) {
                	 var errcode = data.code;//在此做了错误代码的判断
              	     if(errcode != 10000){
              	         layer.msg(data.message);
              	         return;
              	     }
              	     data=data.results[0];
                     if (data.resource) {
                    	 var menus=[];
                         var root={
                             id:'0',
                             pId:'-1',
                             name:'菜单',
                             open:true,
                             level:0
                         };
                         menus.push(root);
                         $.each(data.resource,function(index,item){
                             menus.push({
                                 id:item.tsSysResourceId,
                                 pId:item.parentId ?item.parentId:'0',
                                 name:item.name,
                                 level:item.level
                             });
                         });
                         $.fn.zTree.init($("#menu_tree"), {
                        	 data:{  
                                 simpleData:{  
                                     enable:true  
                                 }  
                             },  
                             check: {    
                                 enable: true  
                             }
                         }, menus);
                         var treeObj = $.fn.zTree.getZTreeObj("menu_tree");
                         treeObj.checkAllNodes(false);
                         treeObj.expandAll(true);
                     }
                     if (data.roleResource) {
                         $.each(data.roleResource, function (index, item) {
                             var node = treeObj.getNodeByParam("id", item.ts_sys_resource_id, null);
                             if (node)
                                 treeObj.checkNode(node, true, false);
                         });
                     }
                 }
             });
         },
         sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
         pageNumber:1,                       //初始化加载第一页，默认第一页
         pageSize: 10,                       //每页的记录行数（*）
         pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
         search: true,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
         strictSearch: true,
         showColumns: false,                  //是否显示所有的列
         showRefresh: false,                  //是否显示刷新按钮
         minimumCountColumns: 2,             //最少允许的列数
         clickToSelect: true,                //是否启用点击选中行
         //height: 400,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
         uniqueId: "tsSysRoleId",        //每一行的唯一标识，一般为主键列
         showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
         cardView: false,                    //是否显示详细视图
         detailView: false,                   //是否显示父子表
         responseHandler:function(res){
         	var errcode = res.code;//在此做了错误代码的判断
     	    if(errcode != 10000){
     	        layer.msg(res.message);
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
             title: '角色编号'
         }, {
             field: 'name',
             title: '角色名称'
         }, {
             field: 'status',
             title: '状态',
             formatter: function (value, row, index) {
                 if (value == '启用')
                  return '<div class="bootstrap-switch bootstrap-switch-wrapper bootstrap-switch-on bootstrap-switch-small bootstrap-switch-animate" style="width: 90px;"><div class="bootstrap-switch-container" style="width: 132px; margin-left: 0px;"><span class="bootstrap-switch-handle-on bootstrap-switch-success" style="width: 44px;">启用</span><span class="bootstrap-switch-label" style="width: 44px;"></div></div>'
                 else if (value == '停用')
                  return '<div class="bootstrap-switch bootstrap-switch-wrapper bootstrap-switch-on bootstrap-switch-small bootstrap-switch-animate" style="width: 90px;"><div class="bootstrap-switch-container" style="width: 132px; margin-left: 0px;"><span class="bootstrap-switch-label" style="width: 44px;">&nbsp;</span><span class="bootstrap-switch-handle-off bootstrap-switch-danger" style="width: 44px;">禁用</span><span class="bootstrap-switch-label" style="width: 44px;"></div></div>'
                 else {
                     return '';
                 }
             }
         }, {
             field: 'remark',
             title: '备注'
         }
        ]
     });
}

function initTbUser(){
	  $('#tb_user').bootstrapTable({
          url: apiUrl + "/system/role/queryRoleUser",         //请求后台的URL（*）
          method: 'post',                      //请求方式（*）
          showExport: false,                     //是否显示导出
          toolbar: '#toolbar_user',           //工具按钮用哪个容器
          exportDataType: "all",              //basic', 'all', 'selected'.
          striped: true,                      //是否显示行间隔色
          cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
          pagination: true,                   //是否显示分页（*）
          dataField: "data",					//这是返回的json数组的key.默认好像是"rows".这里只有前后端约定好就行
          sortable: false,                     //是否启用排序
          sortOrder: "asc",                   //排序方式
          queryParams:function queryParams(params) {   //设置查询参数
        	  var tsSysRoleId='';
         	  var rows = $("#tb_role").bootstrapTable("getSelections");
         	  if (rows.length > 0){
         		  tsSysRoleId = rows[0].tsSysRoleId;
         	  }
       		  var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
       			  pageSize: params.limit,   //页面大小
                  pageIndex : params.offset/params.limit+1, //当前页面,默认是上面设置的1(pageNumber)
                  tsSysRoleId : tsSysRoleId
              };
              return temp;
          },
          sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
          pageNumber:1,                       //初始化加载第一页，默认第一页
          pageSize: 10,                       //每页的记录行数（*）
          pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
          search: true,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
          strictSearch: true,
          showColumns: false,                  //是否显示所有的列
          showRefresh: false,                  //是否显示刷新按钮
          minimumCountColumns: 2,             //最少允许的列数
          clickToSelect: true,                //是否启用点击选中行
          uniqueId: "ts_sys_user_id",            //每一行的唯一标识，一般为主键列
          showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
          cardView: false,                    //是否显示详细视图
          detailView: false,                   //是否显示父子表
          responseHandler:function(res){
         	var errcode = res.code;//在此做了错误代码的判断
     	    if(errcode != 10000){
     	        layer.msg(res.message);
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
              field: 'name_en',
              title: '英文姓名'
          }, {
              field: 'email',
              title: '邮箱'
          }, {
              field: 'mobile',
              title: '手机号'
          }, {
              field: 'status',
              title: '状态',
              formatter: function (value, row, index) {
                  if (value == '1')
                 	 return '<div class="bootstrap-switch bootstrap-switch-wrapper bootstrap-switch-on bootstrap-switch-small bootstrap-switch-animate" style="width: 90px;"><div class="bootstrap-switch-container" style="width: 132px; margin-left: 0px;"><span class="bootstrap-switch-handle-on bootstrap-switch-success" style="width: 44px;">启用</span><span class="bootstrap-switch-label" style="width: 44px;"></div></div>'
                  else if (value == '0')
                 	 return '<div class="bootstrap-switch bootstrap-switch-wrapper bootstrap-switch-on bootstrap-switch-small bootstrap-switch-animate" style="width: 90px;"><div class="bootstrap-switch-container" style="width: 132px; margin-left: 0px;"><span class="bootstrap-switch-label" style="width: 44px;">&nbsp;</span><span class="bootstrap-switch-handle-off bootstrap-switch-danger" style="width: 44px;">禁用</span><span class="bootstrap-switch-label" style="width: 44px;"></div></div>'
                  else {
                      return '';
                  }
              }
          }]
      });
  }

function initTbRoleUser(){
	  $('#tb_role_user').bootstrapTable({
        url: apiUrl + "/system/role/queryRoleUserAdd",         //请求后台的URL（*）
        method: 'post',                      //请求方式（*）
        showExport: false,                     //是否显示导出
        exportDataType: "all",              //basic', 'all', 'selected'.
        striped: true,                      //是否显示行间隔色
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                   //是否显示分页（*）
        dataField: "data",					//这是返回的json数组的key.默认好像是"rows".这里只有前后端约定好就行
        sortable: false,                     //是否启用排序
        sortOrder: "asc",                   //排序方式
        queryParams:function queryParams(params) {   //设置查询参数
        	var tsSysRoleId='';
       	    var rows = $("#tb_role").bootstrapTable("getSelections");
       	    if (rows.length > 0){
       		    tsSysRoleId = rows[0].tsSysRoleId;
       	    }
 		    var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
	 			pageSize: params.limit,   //页面大小
	            pageIndex : params.offset/params.limit+1, //当前页面,默认是上面设置的1(pageNumber)
	            tsSysRoleId : tsSysRoleId,
	            no :  $("#txt_search_user_no").val(),
                name :  $("#txt_search_user_name").val()
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
        uniqueId: "tsSysUserId",                     //每一行的唯一标识，一般为主键列
        showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                   //是否显示父子表
        responseHandler:function(res){
       	var errcode = res.code;//在此做了错误代码的判断
   	    if(errcode != 10000){
   	        layer.msg(res.message);
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

//打开新增窗口
function openAddWin(title,w,h){
	$('#no').attr("disabled",false); 
	$('#status').val(1);
	if (!$("#status").bootstrapSwitch('state')) { 
        $("#status").bootstrapSwitch('toggleState');
    }
	clearForm($('#addModal'));
	$('#addModal').modal("show");
	mod_flag=0;
	$('#modal-title').html("新增");
}

//打开编辑窗口
function openEditWin (title,id,w,h) {
	var rows = $("#tb_role").bootstrapTable("getSelections");
    if (rows.length < 1) {
    	layer.msg("没有选择的数据！");
        return;
    }
    if (rows.length > 1) {
    	layer.msg("只能选择一条数据编辑！");
        return;
    }
    $('#no').attr("disabled",true); 
    $('#tsSysRoleId').val(rows[0].tsSysRoleId);
	$('#no').val(rows[0].no);
	$('#name').val(rows[0].name);
	$('#remark').val(rows[0].remark);
	if (rows[0].status=="启用"){
		$('#status').val(1);
		if (!$("#status").bootstrapSwitch('state')) { 
            $("#status").bootstrapSwitch('toggleState');
        }
	} else {
		$('#status').val(0);
		if ($("#status").bootstrapSwitch('state')) { 
            $("#status").bootstrapSwitch('toggleState'); 
        }
	}
	$('#modal-title').html("编辑");
	mod_flag=1;
    $('#addModal').modal("show");
}

//删除
function deleteInfo(){
	var rows = $("#tb_role").bootstrapTable("getSelections");
    if (rows.length < 1) {
    	layer.msg("没有选择的数据！");
        return;
    }
    var rowid = [];
    $.each(rows, function (index, row) {
    	rowid.push(row.tsSysRoleId);
    });
    data={tsSysRoleId:rowid}
	layer.confirm('删除数据不可恢复，确定删除吗？',function(index){
        $.ajax({
            type: "POST",
            url: apiUrl + "/system/role/delete",
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: "application/json",
            success: function (data) {
            	var errcode = data.code;//在此做了错误代码的判断
         	    if(errcode != 10000){
         	        layer.msg(data.message);
         	        return;
         	    }
         	    $('#tb_role').bootstrapTable("refresh");
                $("#tb_role").bootstrapTable("refreshOptions",{pageNumber:1});
                layer.msg('删除成功!',{icon:1,time:1000});
            }
        });
    });
}

function queryInfo(){
	$('#tb_role').bootstrapTable("refresh");
	$('#tb_role').bootstrapTable("refreshOptions",{pageNumber:1});
}

function clearInfo(){
	$("#txt_search_no").val("");
    $("#txt_search_name").val("");
    $("#txt_search_remark").val("");
}

function queryUser(){
	$('#tb_role_user').bootstrapTable("refresh");
	$('#tb_role_user').bootstrapTable("refreshOptions",{pageNumber:1});
}

function clearUser(){
	$("#txt_search_user_no").val("");
    $("#txt_search_user_name").val("");
}

function clearForm(form) {
    // input清空
    $(':input', form).each(function () {
        var type = this.type;
        var tag = this.tagName.toLowerCase(); // normalize case
        if (type == 'text' || type == 'password' || tag == 'textarea')
            this.value = "";
            // 多选checkboxes清空
            // select 下拉框清空
        else if (tag == 'select')
            this.selectedIndex = -1;
    });
};

//保存信息
function saveInfo(){
	$('#formEdit').data('bootstrapValidator').validate();  
    if(!$('#formEdit').data('bootstrapValidator').isValid()){  
        return ;  
    }
	var data=JSON.stringify($('#formEdit').serializeObject());
	if (mod_flag == 0){
		url = apiUrl + "/system/role/add";
	} else {
		url = apiUrl + "/system/role/update";
	}
	
	$.ajax({
        type: 'POST',
        url: url,
        data: data,
        dataType: 'json',
        contentType: "application/json",
        success: function (data, textStatus, jqXHR) {
        	var errcode = data.code;//在此做了错误代码的判断
     	    if(errcode != 10000){
     	        layer.msg(data.message);
     	        return;
     	    }
        	$("#addModal").on("hidden.bs.modal", function() {
        		$(this).removeData("bs.modal");
        		clearForm($('#formEdit'));
        	});
        	$('#addModal').modal('hide');
        	$('#tb_role').bootstrapTable("refresh");
        	$('#tb_role').bootstrapTable("refreshOptions",{pageNumber:1});
            layer.msg('保存成功!',{icon:1,time:1000});
        }
    });
}

function saveRoleUser(){
	var rows = $("#tb_role_user").bootstrapTable("getSelections");
    if (rows.length < 1) {
    	layer.msg("没有选择的数据！");
        return;
    }
    var rowid = [];
    $.each(rows, function (index, row) {
    	rowid.push(row.tsSysUserId);
    });
    var tmp_tsSysRoleId = $("#tb_role").bootstrapTable("getSelections")[0].tsSysRoleId;
    data={tsSysUserId:rowid,tsSysRoleId:tmp_tsSysRoleId}
    $.ajax({
        type: 'POST',
        url: apiUrl + "/system/role/addRoleUser",
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function (data) {
        	var errcode = data.code;//在此做了错误代码的判断
     	    if(errcode != 10000){
     	        layer.msg(data.message);
     	        return;
     	    }
     	    $('#addUser').modal('hide');
     	    $("#tb_user").bootstrapTable("refresh");
    	    $("#tb_user").bootstrapTable("refreshOptions",{pageNumber:1});
    	    $("#tb_role_user").bootstrapTable("refresh");
     	    $('#tb_role_user').bootstrapTable("refreshOptions",{pageNumber:1});
     	    layer.msg('保存成功!',{icon:1,time:1000});
        }
    });
}

$.fn.serializeObject = function()    
{    
   var o = {};    
   var a = this.ewin_serializeArray();    
   $.each(a, function() {    
       if (o[this.name]) {    
           if (!o[this.name].push) {    
               o[this.name] = [o[this.name]];    
           }    
           o[this.name].push(this.value || '');    
       } else {    
           o[this.name] = this.value || '';    
       }    
   });    
   return o;    
};  

$.fn.ewin_serializeArray = function () {
    var a = this.serializeArray();
    var $radio = $('input[type=radio],input[type=checkbox]', this);
    var temp = {};
    $.each($radio, function () {
        if (!temp.hasOwnProperty(this.name)) {
            if ($("input[name='" + this.name + "']:checked").length == 0) {
                temp[this.name] = this.value;
                a.push({name: this.name, value: this.value});
            }
        }
    });
    return a;
};

function saveRoleResource(){
	var rows = $('#tb_role').bootstrapTable('getSelections');
    if (rows.length < 1) {
    	layer.msg("没有选择的数据！");
        return;
    }
    var tmp_tsSysRoleId=rows[0].tsSysRoleId
    var tmp_tsSysResourceId=[];
    var treeObj = $.fn.zTree.getZTreeObj("menu_tree");
    if (treeObj.getCheckedNodes(true).length != 0) {
		var nodes = treeObj.getCheckedNodes(true);
		$.each(nodes, function (index, item) {
			if (item.id!=0){
				tmp_tsSysResourceId.push(item.id);
			}
		});
    }
    var data={ tsSysRoleId : tmp_tsSysRoleId ,tsSysResourceId : tmp_tsSysResourceId };
    $.ajax({
        type: 'POST',
        url: apiUrl + "/system/role/addRoleResource",
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function (data) {
        	var errcode = data.code;//在此做了错误代码的判断
     	    if(errcode != 10000){
     	        layer.msg(data.message);
     	        return;
     	    }
     	    layer.msg('保存成功!',{icon:1,time:1000});
        }
    });
}

//角色设置
function role_user() {
	var rows = $("#tb_role").bootstrapTable("getSelections");
    if (rows.length < 1) {
    	layer.msg('没有选择的数据！',{icon:1,time:1000});
        return;
    }
    if (rows.length > 1) {
    	layer.msg('只能选择一条数据！',{icon:1,time:1000});
        return;
    }
    $('#tb_role_user').bootstrapTable("refresh");
    $('#tb_role_user').bootstrapTable("refreshOptions",{pageNumber:1});
	$('#addUser').modal("show");
}

//删除用户
function deleteUser(){
	var rows = $("#tb_user").bootstrapTable("getSelections");
    if (rows.length < 1) {
    	layer.msg("没有选择的数据！");
        return;
    }
	layer.confirm('删除数据不可恢复，确定删除吗？',function(index){
		var rowid = [];
	    $.each(rows, function (index, row) {
	    	rowid.push(row.ts_sys_user_id);
	    });
	    var tmp_tsSysRoleId = $("#tb_role").bootstrapTable("getSelections")[0].tsSysRoleId;
	    data={tsSysUserId:rowid,tsSysRoleId:tmp_tsSysRoleId}
        $.ajax({
            type: "POST",
            url: apiUrl + "/system/role/delRoleUser",
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: "application/json",
            success: function (data) {
            	var errcode = data.code;//在此做了错误代码的判断
         	    if(errcode != 10000){
         	        layer.msg(data.message);
         	        return;
         	    }
         	    $('#tb_user').bootstrapTable("refresh");
                $("#tb_user").bootstrapTable("refreshOptions",{pageNumber:1});
                layer.msg('删除成功!',{icon:1,time:1000});
            }
        });
    });
}
