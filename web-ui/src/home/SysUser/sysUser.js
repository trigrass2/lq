$(function () {
  $('#Resource_tree').height($(window).height() - 80);
    layui.use(['laydate','element','laypage','layer'], function(){
        $ = layui.jquery;//jquery
      laydate = layui.laydate;//日期插件
      lement = layui.element();//面包导航
      laypage = layui.laypage;//分页
      layer = layui.layer;//弹出层
    });

    $("#statusA").bootstrapSwitch(
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

        $("#statusU").bootstrapSwitch(
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

//增加表单验证
        $('#addUserForm').bootstrapValidator({
                message: '验证不通过',
                feedbackIcons: {
                    valid: 'glyphicon glyphicon-ok',
                    invalid: 'glyphicon glyphicon-remove',
                    validating: 'glyphicon glyphicon-refresh'
                },
                fields: {
             	   noA: {
                        validators: {
                            notEmpty: {
                                message: '用户名不能为空'
         	                   }
         	               }
         	           },
                 nameA: {
                        validators: {
                            notEmpty: {
                                message: '中文名称不能为空'
         	                   }
         	               }
         	        },
                emailA: {
                         validators: {
                           emailAddress: {
                                   message: '请输入正确的邮件地址如：123@qq.com'
                               }
                           }
                       },
                 mobileA: {
                           validators: {
                                 stringLength: {
                                     min: 11,
                                     max: 11,
                                     message: '请输入11位手机号码'
                                 },
                                 regexp: {
                                     regexp: /^1[3|5|8]{1}[0-9]{9}$/,
                                     message: '请输入正确的手机号码'
                                 }
                               }
                           }


                },
                submitHandler: function (validator, form, submitButton) {
             	   alert("ok");
                }
            });

//更新表单验证
                    $('#updateUserForm').bootstrapValidator({
                            message: '验证不通过',
                            feedbackIcons: {
                                valid: 'glyphicon glyphicon-ok',
                                invalid: 'glyphicon glyphicon-remove',
                                validating: 'glyphicon glyphicon-refresh'
                            },
                            fields: {

                             nameU: {
                                    validators: {
                                        notEmpty: {
                                            message: '中文名称不能为空'
                     	                   }
                     	               }
                     	        },
                            emailU: {
                                     validators: {
                                       emailAddress: {
                                               message: '请输入正确的邮件地址如：ewininfo@ewininfo.com'
                                           }
                                       }
                                   },
                             mobileU: {
                                       validators: {
                                             stringLength: {
                                                 min: 11,
                                                 max: 11,
                                                 message: '请输入11位手机号码'
                                             },
                                             regexp: {
                                                 regexp: /^1[3|5|8]{1}[0-9]{9}$/,
                                                 message: '请输入正确的手机号码'
                                             }
                                           }
                                       }


                            },
                            submitHandler: function (validator, form, submitButton) {
                         	   alert("ok");
                            }
                        });


    //1.初始化Table
    var oTable = new TableInit();
    oTable.Init();

    //当点击查询按钮的时候执行
    $("#btn_query").bind("click", initTable);


  //重置按钮事件
    $("#btn_clear").bind("click",function(){
    	$("#formSearch")[0].reset();
    });


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

});






//定义表格
var TableInit = function () {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
    initTbType();
    initTbList(0);
    initRoleList();

};
	return oTableInit;
}

//查询按钮调用事件
function initTable(){
    $('#tb_Type').bootstrapTable('refresh');
}

//查询用户信息列表
function initTableList(tsSysUserId){
    //先销毁表格
    $('#tb_List').bootstrapTable('destroy');
    initTbList(tsSysUserId);
}

function initTbType(){
	 $('#tb_Type').bootstrapTable({
         url: apiUrl +'/system/user/querylistByPage',         //请求后台的URL（*）
         method: 'post',                      //请求方式（*）
         toolbar: '#toolbarL',                //工具按钮用哪个容器
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
                 offset: params.offset,  //页码
                 pageIndex : params.offset/params.limit+1, //当前页面,默认是上面设置的1(pageNumber)
                 no :  $("#no").val() == '' ? null : $("#no").val() ,
                 name :  $("#name").val() == '' ? null : $("#name").val(),
                 remark :  $("#remark").val() == '' ? null : $("#remark").val(),
             };
             return temp;
         },
         onClickRow: function (row) {
             //加载编码值表数据
        	 initTableList(row.tsSysUserId);
             //加载资源树
           getResourceTree(row.tsSysUserId);

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
         height: 400,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
         uniqueId: "tsSysUserId",        //每一行的唯一标识，一般为主键列
         showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
         cardView: false,                    //是否显示详细视图
         detailView: false,                   //是否显示父子表
         responseHandler:function(res){
         	 var errcode = res.code;//在此做了错误代码的判断
         	    if(errcode != 10000){
         	        alert("错误代码" + errcode);
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
         }, {
             field: 'nameEn',
             title: '英文姓名'
         }, {
             field: 'sex',
             title: '性别',
             formatter: function (value, row, index) { //处理性别的显示
                 if (value == '1') {
                     value = '保密';
                 } else if(value == '2'){
                     value = '女';
                 }else{
                   value = '男';
                 }
                 return value;
             }

         }, {
             field: 'email',
             title: '邮箱'
         },{
             field: 'mobile',
             title: '手机号'
         },{
             field: 'remark',
             title: '备注'
         },
        ]
     });
}




function initTbList(tsSysUserId){

	  $('#tb_List').bootstrapTable({
          url: apiUrl +'/system/user/queryUserRole',         //请求后台的URL（*）
          method: 'post',                      //请求方式（*）
          toolbar: '#toolbarR',                //工具按钮用哪个容器
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
                   tsSysUserId : tsSysUserId
               };
               return temp;
           },
          sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
          pageNumber:1,                       //初始化加载第一页，默认第一页
          pageSize: 10,                       //每页的记录行数（*）
          pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
          search: false,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
          strictSearch: true,
          showColumns: false,                  //是否显示所有的列
          showRefresh: false,                  //是否显示刷新按钮
          minimumCountColumns: 2,             //最少允许的列数
          clickToSelect: true,                //是否启用点击选中行
          uniqueId: "ts_sys_role_id",                     //每一行的唯一标识，一般为主键列
          showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
          cardView: false,                    //是否显示详细视图
          detailView: false,                   //是否显示父子表
          responseHandler:function(res){
         	 var errcode = res.code;//在此做了错误代码的判断
         	    if(errcode != 10000){
         	        alert("错误代码" + errcode);
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
              field: 'remark',
              title: '备注'
          }, ]
      });
  }

/*添加*/
function type_addNew(){
  $('#addUserForm').data('bootstrapValidator').resetForm();
  clearForm($('#addUserForm'));
}

//编辑
function type_edit () {
  var rows = $("#tb_Type").bootstrapTable("getSelections");
    if (rows.length < 1) {
	      layer.msg("请选择要修改的数据！");
        return;
    }
    if (rows.length > 1) {
          layer.msg("只能选择一条数据！")
        return;
    }
    var row = rows[0];
    rowId = row.tsSysUserId;

    $('#noU').val(row.no);
    $('#nameU').val(row.name);
    $('#nameEnU').val(row.nameEn);
    $('#emailU').val(row.email);
    $('#mobileU').val(row.mobile);

    $('#remarkU').val(row.remark);
     if(row.sex=='1'){
      $('#sexU').val(1);
      $('.secret').prop('checked',true);
    }else if(row.sex=='2'){
      $('#sexU').val(2);
      $('.gril').prop('checked',true);
      this.checked=true;
    }else{
      $('#sexU').val(3);
        $('.boy').prop('checked',true);
    }

    if (row.status=="1"){

    		$('#statusU').val(1);
    		if (!$("#statusU").bootstrapSwitch('state')) {
                $("#statusU").bootstrapSwitch('toggleState');
            }
    	} else {
    		$('#statusU').val(0);
    		if ($("#statusU").bootstrapSwitch('state')) {
                $("#statusU").bootstrapSwitch('toggleState');
            }
    	}


    $('#myModalUpdate').modal("show");
}



/*导入*/
function user_import(title,url,w,h){
    x_admin_show(title,url,w,h);
}

//初始密码
function user_password(title,url,id,w,h) {
    x_admin_show(title,url,w,h);
}
//角色设置
function user_role(title,url,id,w,h) {
    x_admin_show(title,url,w,h);
}



//清空文本框内容
function clearForm(form) {
// input清空
$(':input', form).each(function () {
    var type = this.type;
    var tag = this.tagName.toLowerCase(); // normalize case
    if (type == 'text' || type == 'password' || tag == 'textarea'|| type=='email')

        this.value = "";
        // 多选checkboxes清空
        // select 下拉框清空
    else if (tag == 'select')
        this.selectedIndex = -1;
    else if(tag == 'radio')
        this.value="1";
        this.checked=true;
});
};



//------------Add------
//保存/编辑信息
function save(){


  $('#addUserForm').data('bootstrapValidator').validate();
    if(!$('#addUserForm').data('bootstrapValidator').isValid()){
        return ;
    }
  var no = $('#noA').val();
  var name = $('#nameA').val();
  var nameEn = $('#nameEnA').val();
  var email = $('#emailA').val();
  var mobile = $('#mobileA').val();
  var sex = $("input[name='sexA']:checked").val();

  var remark = $('#remarkA').val();
  var status = $('#statusA').val();


  var datas= {
            no: no,
            name: name,
            nameEn : nameEn,
            email: email,
            mobile: mobile,
            sex: sex,
            remark : remark,
            status: status

      };


    datas = JSON.stringify(datas);

  $.ajax({
            type: 'POST',
            url: apiUrl +'/system/user/add',
            data: datas,
            contentType:"application/json",
            dataType: 'JSON',
            success: function (data) {
              var errcode = data.code;//在此做了错误代码的判断

              if(errcode != 10000){
                layer.msg(data.message);
                  return;
              }

              if(data.results){
                    layer.msg(data.message);
                    $('#myModal').modal("hide");
                  $('#tb_Type').bootstrapTable('refresh');

                  $('#addUserForm').data('bootstrapValidator').resetForm();
                  clearForm($('#addUserForm'));
               }

            }
        });
}



//------------Update------
//编辑信息
function update(){
  $('#updateUserForm').data('bootstrapValidator').validate();
    if(!$('#updateUserForm').data('bootstrapValidator').isValid()){
        return ;
    }

  var no = $('#noU').val();
  var name = $('#nameU').val();
  var nameEn = $('#nameEnU').val();
  var email = $('#emailU').val();
  var mobile = $('#mobileU').val();
  var sex =  $("input[name='sexU']:checked").val();
  var remark = $('#remarkU').val();
  var status = $('#statusU').val();

  var datas= {
    			tsSysUserId:rowId,
            no: no,
            name: name,
            nameEn : nameEn,
            email: email,
            mobile: mobile,
            sex: sex,
            remark : remark,
            status: status

      };


    datas = JSON.stringify(datas);

  $.ajax({
            type: 'POST',
            url: apiUrl +'/system/user/update',
            data: datas,
            contentType:"application/json",
            dataType: 'JSON',
            success: function (data) {
              var errcode = data.code;//在此做了错误代码的判断
              if(errcode != 10000){
                  layer.msg(data.message);
                  return;
              }
              if(data.results){
                    layer.msg(data.message);
                    $('#myModalUpdate').modal("hide");
                  $('#tb_Type').bootstrapTable('refresh');
                  $('#updateUserForm').data('bootstrapValidator').resetForm();
               }

            }
        });
}


//-------------delete-------
//删除多用户信息
function deleteInfo(){

	var rows = $("#tb_Type").bootstrapTable("getSelections");
    if (rows.length < 1) {
      layer.msg("没有选择的数据！")
        return;
    }

    layer.confirm('是否确认删除？', {
  	    btn: ['删除','取消'], //按钮
  		title: "提示",
  	    shade: false //不显示遮罩
  	}, function(index){

      var sid = [];
      for(var i = 0;i < rows.length; i++) {
            sid[i] = rows[i].tsSysUserId;
      }



        datas = JSON.stringify(sid);


      $.ajax({
                type: 'POST',
                url: apiUrl +'/system/user/deletemany',
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

                      $('#tb_Type').bootstrapTable('refresh');
                  }

                }
            });
  	    layer.close(index);
  	});


}


//-------------delete-------
//删除用户多角色信息
function deleteUserRole(){
	var rows = $("#tb_List").bootstrapTable("getSelections");
    if (rows.length < 1) {
      layer.msg("没有选择的数据！")
        return;
    }


    layer.confirm('是否确认删除？', {
        btn: ['删除','取消'], //按钮
      title: "提示",
        shade: false //不显示遮罩
    }, function(index){


    var sid = [];
    for(var i = 0;i < rows.length; i++) {
          sid[i] = rows[i].ts_sys_role_id;
    }



      datas = JSON.stringify(sid);


    $.ajax({
              type: 'POST',
              url: apiUrl +'/system/user/deletemanyRole',
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

                    $('#tb_List').bootstrapTable('refresh');
                }

              }
          });
            layer.close(index);
          	});
}



//------------------initPassword-------------------------

//初始化密码
function initPwd(){

	var rows = $("#tb_Type").bootstrapTable("getSelections");
    if (rows.length < 1) {
        layer.msg("没有选择的数据！")
        return;
    }
    if (rows.length > 1) {
        layer.msg("只能选择一条数据！")
        return;
    }
    var row = rows[0];

	layer.confirm('确认要初化密码吗？',function(index){
        $.ajax({
            type: 'POST',
            url: apiUrl +'/system/user/initpwd',
            data:row.tsSysUserId,
            contentType:"application/json",
            dataType: 'JSON',
            success: function (data) {
            	var errcode = data.code;
         	    if(errcode != 10000){
         	        layer.msg(data.message);
         	        return;
         	    }
         	    if(data.results){
         	    		layer.msg(data.message,{icon:1,time:1000});
                	$('#tb_Type').bootstrapTable('refresh');
         	    }

            }
        });
    });
}



//增加角色表格


function type_addRole() {
  var rows = $("#tb_Type").bootstrapTable("getSelections");
    if (rows.length < 1) {
	     layer.msg("请选择要修改的数据！");
        return;
    }
    if (rows.length > 1) {
        layer.msg("只能选择一条数据！")
        return;
    }
    var row = rows[0];
    rowId = row.tsSysUserId;

    $("#userIdHidden").val(rowId);


    $('#myModalRole').modal("show");

}

function lookRole(){
	$('#tb_roleList').bootstrapTable("refresh");
}


function initRoleList(){
	  $('#tb_roleList').bootstrapTable({
          url: apiUrl +'/system/role/querylistByPage',         //请求后台的URL（*）
          method: 'post',                      //请求方式（*）
          toolbar: '#toolbarR',                //工具按钮用哪个容器
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
                   no:  $("#noR").val() == '' ? null : $("#noR").val(),
                   name:  $("#nameR").val() == '' ? null : $("#nameR").val()
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
          uniqueId: "tsSysRoleId",                     //每一行的唯一标识，一般为主键列
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
              title: '角色编号'
          }, {
              field: 'name',
              title: '角色名称'
          }, {
              field: 'remark',
              title: '备注'
          }, ]
      });
  }


  //-------------updateUserRole-------
  //批量增加用户角色映射关系
  function updateUserRole(){

  	var rows = $("#tb_roleList").bootstrapTable("getSelections");
      if (rows.length < 1) {
        layer.msg("没有选择的数据！")
          return;
      }

      var sysRoleUsers = new Array();

      for(var i = 0;i < rows.length; i++) {
          var sysRoleUser = {tsSysRoleId:'',tsSysUserId:''};
            sysRoleUser.tsSysUserId = $("#userIdHidden").val();
            sysRoleUser.tsSysRoleId = rows[i].tsSysRoleId;
            sysRoleUsers.push(sysRoleUser);
      }

        datas = JSON.stringify(sysRoleUsers);

      $.ajax({
                type: 'POST',
                url: apiUrl +'/system/user/addBatch',
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
                      $('#myModalRole').modal("hide");
                      $('#tb_Type').bootstrapTable('refresh');
                  }

                }
            });
  }



//-------------export数据-------
//导出数据
function exportUser(){
  var no = $('#no').val();
  var name = $('#name').val();
  var remark = $('#remark').val();

   window.top.location.href= apiUrl +'/system/user/export?no='+no+'&name='+name+'&remark='+remark;

}


//-------------模板文件下载-------
//模板文件
function downFile(){

   window.top.location.href= apiUrl +'/system/user/updown';

}


//-------------模板文件上传并导入数据-------
function importInfo(){

$('#postForm')[0].reset(); 


}
//上传导入
function upFile(){

  $.ajax({
      url:  apiUrl +'/system/user/upload',
      type: 'POST',
      cache: false,
      data: new FormData($('#postForm')[0]),
       async: false,
       cache: false,
       contentType: false,
       processData: false,

       success:function (data) {
          layer.msg(data.message);
          if(data.message=='导入用户信息成功！'){
            $('#myModalInput').modal("hide");
              $('#tb_Type').bootstrapTable('refresh');
          }

       }


  });
  return false;
}




//-------------资源树-------
//资源树
function getResourceTree(tsSysUserId){

  var rows = $("#tb_Type").bootstrapTable("getSelections");
    if (rows.length < 1) {
        return;
    }


    var data =  {tsSysUserId :'1413341324'};
    JSON.stringify(data);
    $.ajax({
          type: "post",
          url: apiUrl + "/system/user/queryRoleResource",         //请求后台的URL（*）
          data:" ",
          dataType: 'JSON',
          contentType: "application/json",
          success: function (data, textStatus, jqXHR) {
            var errcode = data.code;//在此做了错误代码的判断
              if(errcode != 10000){
                  layer.msg("错误代码" + errcode);
                  return;
              }
              data=data.results[0];
              if (data.resource) {
   //                    	 var menus=[];
   //                         $.each(data.resource,function(index,item){
   //                             menus.push({
   //                                 id:item.tsSysResourceId,
   //                                 pId:item.parentId ?item.parentId:'0',
   //                                 name:item.name,
   //                                 level:item.level
   //                             });
   //                         });
   //                         var setting = {
   //                                 check: {
   //                                     enable: true,
   //                                     chkboxType: { "Y": "ps", "N": "s" }
   //                                 }
   //                             };
   //                         var nodes = [{ id: "0", name: "权限菜单", type: "root", open: true, children: menus }];
   //                         $.fn.zTree.init($("#menu_tree"), setting, nodes);
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
                  //treeObj.expandAll(true);
              }
              if (data.roleResource) {
   //                         $.each(data.roleResource, function (index, item) {
   //                             var node = treeObj.getNodeByParam("id", item.ts_sys_resource_id, null);
   //                             if (node)
   //                                 treeObj.checkNode(node, true, true);
   //                         });
              }
          }
      });
}
