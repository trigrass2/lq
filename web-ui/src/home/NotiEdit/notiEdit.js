/**
 * Created by Administrator on 2017/9/7.
 */
var isSearch = true; // 是否第一次触发下拉框改变事件true是false否
var noticeId = '';
var isEdit = false;
$(function(){
    // 显示通知查询的数据
    noticeId= UrlParm.parm("tsSysNoticeId");
    notiTargetId = UrlParm.parm("targetIds");
    noticeNo = UrlParm.parm("no");
    var notiTitle = UrlParm.parm("title");
    var notiText = UrlParm.parm("content");
    var notiState = UrlParm.parm("noticeStatus");
    var notiSentWay = UrlParm.parm("isTxi");
    notiSentTimingTime = UrlParm.parm("timingTime");
    notiSentEndTime = UrlParm.parm("noticeEndTime");
    var notiApp = UrlParm.parm("isSendApp");
    var notiMail = UrlParm.parm("isSendMail");
    var notiWeb = UrlParm.parm("isSendWeb");
    var notiWechat = UrlParm.parm("isSendWechat");
    notiSendObject = UrlParm.parm("sendObject");

    isEdit = noticeNo ? true : false;

    var notargetId = [];
    dataId = noticeId;
    $.ajax({
        type: 'POST',
        url: apiUrl +'/system/sysNoticeObject/queryByNoticeId',
        data: dataId,
        contentType:"application/json",
        dataType: 'JSON',
        success: function (data) {
            var errcode = data.code;//在此做了错误代码的判断
            if (errcode === '10000') {
                var codeVal = '';
                $.each(data.results, function (index,val) {
                    codeVal = val.objectId;
                    notargetId.push(codeVal);
                })
            } else {
                return;
            }
        }
    });
    notiTargetId = notargetId;

    $('#notiTitle').val(notiTitle);
    $('#summernote').text(notiText);
    //推送形式
    if (notiApp === '1') {
        $('#sentApp').prop('checked',true);
    } else {
        $('#sentApp').prop('checked',false);
    }
    if (notiMail === '1') {
        $('#sendMail').prop('checked',true);
    } else {
        $('#sendMail').prop('checked',false);
    }
    if (notiWeb === '1') {
        $('#sendWeb').prop('checked',true);
    } else {
        $('#sendWeb').prop('checked',false);
    }
    if (notiWechat === '1') {
        $('#sendWeChat').prop('checked',true);
    } else {
        $('#sendWeChat').prop('checked',false);
    }

    // 发送对象
    if (notiSendObject === 'ALL') {
        $('#sel_list').select2("destroy").select2();
        $('#sel_list').select2('val','0');
    } else if (notiSendObject === 'ROLE') {
        $('#sel_list').select2("destroy").select2();
        $('#sel_list').select2('val','1');
        $('.sel_query').css('display','inline-block');
        isSearch = false;
    } else if (notiSendObject === 'GROUP') {
        $('#sel_list').select2("destroy").select2();
        $('#sel_list').select2('val','2');
        $('.sel_query').css('display','inline-block');
        isSearch = false;
    } else if (notiSendObject === 'USER') {
        $('#sel_list').select2("destroy").select2();
        $('#sel_list').select2('val','3');
        $('.sel_query').css('display','inline-block');
        isSearch = false;
    } else {
        $('#sel_list').select2("destroy").select2();
        $('#sel_list').select2('val','0');
    }

    var elem = document.querySelector('#sentNow');
    new Switchery(elem, { size: 'small' });

    Ew.getInputhl('sent_time',{idName: 'day13',format:'fulldate',minDate:Ew.getNowday()});

    Ew.getInputhl('otherTimeDate',{idName: 'day14',format:'fulldate',minDate:Ew.getNowday()});

    // 是否立即发送
    if (notiSentWay === '1') {
        $('#sentNow').prop('checked',true);
        $('.con_sent span').css('background-color','rgb(100, 189, 99)');
        $('.con_sent small').css('left','13px');
        $('.con_sent small').css('background-color','rgb(255,255,255)');
        $('.sent_time').css('display','none');
    } else {
        $('.sent_time').css('display','inline-block');
        $('.sent_time #day13').val(notiSentTimingTime);
    }

    // 消息有效期
    $('#otherTime').attr('checked','true');
    $('.otherTimeDate').css('display','inline-block');
    $('.otherTimeDate #day14').val(notiSentEndTime);

    // 文本框
    $('#summernote').summernote();

    // 初始化表格
    var oTable = new TableInit();
    oTable.Init();

    // 是否从编辑页面打开
    if(notiSendObject) { // 从查询页面打开
        $('body').on('change','#sel_list',function () {
            changePeople();
        });
    } else {
        isSearch = false;
        $('body').on('change','#sel_list',function () {
            changePeople();
        });
    }

    $('#tb_role').on('load-success.bs.table', function(data) {
        getSelected('#tb_role');
    });
    $('#tb_group').on('load-success.bs.table', function(data) {
        getSelected('#tb_group');
    });
    $('#tb_user').on('load-success.bs.table', function(data) {
        getSelected('#tb_user');
    });

});

function getSelected(id) {
    data = noticeId;
    $.ajax({
        type: 'POST',
        url: apiUrl +'/system/sysNoticeObject/queryByNoticeId',
        data: data,
        contentType:"application/json",
        dataType: 'JSON',
        success: function (data) {
            if (data.code = '10000') {
                $.each(data.results, function (index,val) {
                    $(id + ' tbody tr[data-uniqueid='+val.objectId+']').addClass('selected');
                    $(id + ' tbody tr[data-uniqueid='+val.objectId+']'+' td input').attr('checked','true');
                })
            } else {
                layer.msg(data.message,{icon:2,time:1000});
                return;
            }

        }
    })
}
// 发送对象
var seleData = [
    {id:0,text:'全部用户'},
    {id:1,text:'按角色'},
    {id:2,text:'业务权限组设置'},
    {id:3,text:'用户'},
];
$('#sel_list').select2({
    multiple:false,
    minimumResultsForSearch:-1,
    data:seleData
});

//定义弹出框表格
var TableInit = function () {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        initTbUser(); // 初始化用户弹框表格
        initTbRole(); // 初始化角色弹框表格
        initTbGroup(); // 初始化角色权限组设置弹框表格
    };
    return oTableInit;
};

// 立即发送
$('body').on('change','#sentNow',function () {
    if ($('#sentNow').prop('checked') === true) {
        $('.sent_time').css('display','none');
    } else {
        $('.sent_time').css('display','inline-block');
        $('.sent_time #day13').val(notiSentTimingTime);
    }
});

// 发送对象下拉框改变事件
function changePeople() {
    if(isSearch === true) {
        return false;
    } else {
        var $selectId = $('#sel_list').val();
        if ($selectId === '1') {
            $('#tb_role').bootstrapTable("refresh");
            $('#tb_role').bootstrapTable("refreshOptions",{pageNumber:1});
            $('#setRole').modal("show");
            $('.sel_query').css('display','inline-block');
        } else if ($selectId === '2') {
            $('#tb_group').bootstrapTable("refresh");
            $('#tb_group').bootstrapTable("refreshOptions",{pageNumber:1});
            $('#setGroup').modal("show");
            $('.sel_query').css('display','inline-block');
        } else if ($selectId === '3') {
            $('#tb_user').bootstrapTable("refresh");
            $('#tb_user').bootstrapTable("refreshOptions",{pageNumber:1});
            $('#setUser').modal("show");
            $('.sel_query').css('display','inline-block');
        } else {
            $('.sel_query').css('display','none');
        }
    }
}
// 查看
$('body').on('click','.sel_query',function () {
    var $queryId = $('#sel_list').val();
    if ($queryId === '1') {
        $('#tb_role').bootstrapTable("refresh");
        $('#tb_role').bootstrapTable("refreshOptions",{pageNumber:1});
        $('#setRole').modal("show");
    } else if ($queryId === '2') {
        $('#tb_group').bootstrapTable("refresh");
        $('#tb_group').bootstrapTable("refreshOptions",{pageNumber:1});
        $('#setGroup').modal("show");
    } else if ($queryId === '3') {
        $('#tb_user').bootstrapTable("refresh");
        $('#tb_user').bootstrapTable("refreshOptions",{pageNumber:1});
        $('#setUser').modal("show");
    }
});

// 按用户弹框
function initTbUser(){
    $('#tb_user').bootstrapTable({
        url: apiUrl + "/system/role/queryRoleUserAdd",         //请求后台的URL（*）
        method: 'post',                      //请求方式（*）
        showExport: false,                     //是否显示导出
        toolbar: '#toolbarR',                //工具按钮用哪个容器
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
                no:  $("#txt_search_user_no").val(),
                name:  $("#txt_search_user_name").val()
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

// 用户弹框查询
function queryUser(){
    $('#tb_user').bootstrapTable("refresh");
    $('#tb_user').bootstrapTable("refreshOptions",{pageNumber:1});
}

// 业务权限组设置
function initTbGroup() {
    $('#tb_group').bootstrapTable({
        url: apiUrl + "/system/sysGroup/querylistByPage",         //请求后台的URL（*）
        method: 'post',                      //请求方式（*）
        showExport: false,                     //是否显示导出
        toolbar: '#toolbarGroup',                //工具按钮用哪个容器
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
                no:  $("#txt_search_group_no").val(),
                name:  $("#txt_search_group_name").val(),
                remark:  $("#txt_search_group_remark").val()
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

// 业务权限组弹框查询
function queryGroup() {
    $('#tb_group').bootstrapTable("refresh");
    $('#tb_group').bootstrapTable("refreshOptions",{pageNumber:1});
}

// 按角色
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
                no:  $("#txt_search_no").val() == '' ? null : $("#txt_search_no").val() ,
                name:  $("#txt_search_name").val() == '' ? null : $("#txt_search_name").val(),
                remark:  $("#txt_search_remark").val() == '' ? null : $("#txt_search_remark").val()
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
        height: 460,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "tsSysRoleId",        //每一行的唯一标识，一般为主键列
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

// 角色弹框查询
function queryInfo(){
    $('#tb_role').bootstrapTable("refresh");
    $('#tb_role').bootstrapTable("refreshOptions",{pageNumber:1});
}

// 消息有效期
$(document).ready(function () {
    $('.i-checks').iCheck({
        checkboxClass:'icheckbox_minimal-grey',
        radioClass:'iradio_minimal-grey'
    })
});
// 消息有效期选择
$('body').on('click','#otherTime',function () {
    $('.otherTimeDate').css('display','none');
    if ($('#otherTime').prop('checked')) {
        $('.otherTimeDate').css('display','inline-block');
    } else {
        $('.otherTimeDate').css('display','none');
    }
});
$('body').on('click','#oneMonth',function () {
    $('.otherTimeDate').css('display','none');
});
$('body').on('click','#oneWeek',function () {
    $('.otherTimeDate').css('display','none');
});
$('body').on('click','#oneDay',function () {
    $('.otherTimeDate').css('display','none');
});


// 角色设置保存
function saveRole(){
    var selectIds = [];
    notiTargetId = [];
    for (var i = 0, j = $('#tb_role tbody tr').length; i < j; i++) {
        if ($($('#tb_role tbody tr')[i]).hasClass('selected')) {
            selectIds.push($($('#tb_role tbody tr')[i]).attr('data-uniqueid'));
        }
    }
    notiTargetId = selectIds;
    $('#setRole').modal("hide");
}
// 用户设置保存
function saveUser() {
    var selectIds = [];
    notiTargetId = [];
    for (var i = 0, j = $('#tb_user tbody tr').length; i < j; i++) {
        if ($($('#tb_user tbody tr')[i]).hasClass('selected')) {
            selectIds.push($($('#tb_role tbody tr')[i]).attr('data-uniqueid'));
        }
    }
    notiTargetId = selectIds;
    $('#setUser').modal("hide");
}
// 权限设置组保存
function saveGroup() {
    var selectIds = [];
    notiTargetId = [];
    for (var i = 0, j = $('#tb_group tbody tr').length; i < j; i++) {
        if ($($('#tb_group tbody tr')[i]).hasClass('selected')) {
            selectIds.push($($('#tb_role tbody tr')[i]).attr('data-uniqueid'));
        }
    }
    notiTargetId = selectIds;
    $('#setGroup').modal("hide");
}

// 保存后跳转回通知查询页面
function saveEdit(){
    var noticeTitle = $('#notiTitle').val();
    var noticeSendObj = $('#sel_list').val();
    var noticeSendNow = $('#sentNow').prop('checked');
    var noticeSendApp = $('#sentApp').prop('checked');
    var noticeSendWeb = $('#sendWeb').prop('checked');
    var noticeSendMail = $('#sendMail').prop('checked');
    var noticeSendWeChat = $('#sendWeChat').prop('checked');
    var noticeSendText = $('.note-editable').text();

    // 選擇對象
    if (noticeSendObj === '0') {
        noticeSendObj = 'ALL';
    } else if (noticeSendObj === '1') {
        noticeSendObj = 'ROLE';
    } else if (noticeSendObj === '2') {
        noticeSendObj = 'GROUP';
    } else if (noticeSendObj === '3') {
        noticeSendObj = 'USER';
    } else {
        // notiTargetId = noticeId;
    }
    // 推送形式
    if (noticeSendApp) {
        noticeSendApp = '1';
    } else {
        noticeSendApp = '0';
    }
    if (noticeSendWeb) {
        noticeSendWeb = '1';
    } else {
        noticeSendWeb = '0';
    }
    if (noticeSendMail) {
        noticeSendMail = '1';
    } else {
        noticeSendMail = '0';
    }
    if (noticeSendWeChat) {
        noticeSendWeChat = '1';
    } else {
        noticeSendWeChat = '0';
    }
    // 是否現在發送
    if (noticeSendNow) {
        noticeSendNow = '1';
        var nowTime = new Date();
        var year = nowTime.getFullYear();
        var month = nowTime.getMonth() + 1;
        var day = nowTime.getDate();
        var hours = nowTime.getHours();
        var minutes = nowTime.getMinutes();
        var seconds = nowTime.getSeconds();
        var times = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day) + ' ' + (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
        notiSentTimingTime = times;
    } else {
        noticeSendNow = '0';
        notiSentTimingTime = $('.sent_time #day13').val();
    }
    // 消息有效期
    if ($('#otherTime').prop('checked')) {
        notiSentEndTime = $('.otherTimeDate #day14').val();
    } else if ($('#oneMonth').prop('checked')) {
        notiSentEndTime = mesCom.nexDate(notiSentTimingTime,'nexMonth');
    } else if ($('#oneWeek').prop('checked')) {
        notiSentEndTime = mesCom.nexDate(notiSentTimingTime,'nexWeek');
    } else if ($('#oneDay').prop('checked')) {
        notiSentEndTime = mesCom.nexDate(notiSentTimingTime,'nexDay');
    }

    data = {title:noticeTitle,content:noticeSendText,sendObject:noticeSendObj,isSendApp:noticeSendApp,isSendMail:noticeSendMail,isSendWeb:noticeSendWeb,isSendWechat:noticeSendWeChat,isTxi:noticeSendNow,no:noticeNo,noticeEndTime:notiSentEndTime,targetIds:notiTargetId,timingTime:notiSentTimingTime,tsSysNoticeId:noticeId};
    if (noticeTitle && noticeSendText && notiTargetId && (noticeSendApp === '1' || noticeSendMail === '1' || noticeSendWeb === '1' || noticeSendWeChat === '1') && (noticeSendNow === '1'?noticeSendNow:notiSentTimingTime) && notiSentEndTime) {
            if (isEdit) {
            $.ajax({
                type: 'POST',
                url: apiUrl + "/system/sysNotice/update",
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (data) {
                    var errcode = data.code;//在此做了错误代码的判断
                    if(errcode == 10000){
                        $("#tableSysNotice").bootstrapTable("refresh");
                        $("#tableSysNotice").bootstrapTable("refreshOptions",{pageNumber:1});
                        layer.msg('保存成功!',{icon:1,time:1000});
                        setTimeout(function () {
                            var tsNotiQueryResourceIdIframe=ewData.ResourceId.notificationQuery;
                            var resourceIcoIframe='';
                            var nameIframe='通知查询';
                            var urlIframe="../home/SysNotice/sysNotice.html";
                            var mesCom=new mesComMethod();
                            mesCom.openNewPage(tsNotiQueryResourceIdIframe,resourceIcoIframe,nameIframe,urlIframe,true);
                            clearPage();
                        },1000);
                    } else {
                        layer.msg(data.message,{icon:2,time:1000});
                        return;
                    }
                }
            });
        } else {
            $.ajax({
                type: 'POST',
                url: apiUrl + "/system/sysNotice/add",
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (data) {
                    var errcode = data.code;//在此做了错误代码的判断
                    if(errcode == 10000){
                        $("#tableSysNotice").bootstrapTable("refresh");
                        $("#tableSysNotice").bootstrapTable("refreshOptions",{pageNumber:1});
                        layer.msg('保存成功!',{icon:1,time:1000});
                        setTimeout(function () {
                            var tsNotiQueryResourceIdIframe=ewData.ResourceId.notificationQuery;
                            var resourceIcoIframe='';
                            var nameIframe='通知查询';
                            var urlIframe="../home/SysNotice/sysNotice.html";
                            var mesCom=new mesComMethod();
                            mesCom.openNewPage(tsNotiQueryResourceIdIframe,resourceIcoIframe,nameIframe,urlIframe,true);
                            clearPage();
                        },1000);
                    } else {
                        layer.msg(data.message,{icon:2,time:1000});
                        return;
                    }
                }
            });
        }
    } else if (noticeTitle === '') {
        layer.msg('请填写标题！',{icon:2,time:1000});
    } else if (notiTargetId[0] === undefined) {
        layer.msg('请选择发送对象！',{icon:2,time:1000});
    } else if (noticeSendNow === '0' && notiSentTimingTime === '') {
        layer.msg('请选择发送时间！',{icon:2,time:1000});
    } else if (notiSentEndTime === '') {
        layer.msg('请选择消息有效期！',{icon:2,time:1000});
    } else if (noticeSendApp === '0' && noticeSendMail === '0' && noticeSendWeb === '0' && noticeSendWeChat === '0') {
        layer.msg('请选择推送形式！',{icon:2,time:1000});
    } else if (noticeSendText === '') {
        layer.msg('请填写正文！',{icon:2,time:1000});
    }
};

// 取消设置，返回通知查询页面
function cancelEdit(){
    var tsNotiQueryResourceIdIframe=ewData.ResourceId.notificationQuery;
    var resourceIcoIframe='';
    var nameIframe='通知查询';
    var urlIframe="../home/SysNotice/sysNotice.html";
    var mesCom=new mesComMethod();
    mesCom.openNewPage(tsNotiQueryResourceIdIframe,resourceIcoIframe,nameIframe,urlIframe,true);
    clearPage();
}

// 清空页面
function clearPage() {
    $('#notiTitle').val('');
    $('.con_sent span').css('background-color','rgb(255, 255, 255)');
    $('.con_sent span').css('box-shadow','rgb(223, 223, 223) 0px 0px 0px 0px inset');
    $('.con_sent span').css('border-color','rgb(223, 223, 223)');
    $('.con_sent small').css('left','0');
    $('.con_sent small').css('background-color','rgb(255,255,255)');
    $('.sent_time').css('display','inline-block');
    $('#sel_list').val('');
    $('#sentNow').prop('checked',false);
    $('#sentApp').prop('checked',false);
    $('#sendWeb').prop('checked',false);
    $('#sendMail').prop('checked',false);
    $('#sendWeChat').prop('checked',false);
    $('.note-editable').text('');
    $('#otherTime').prop('checked',false);
    $('.otherTimeDate #day14').val('');
    $('#oneMonth').prop('checked',false);
    $('#oneWeek').prop('checked',false);
    $('#oneDay').prop('checked',false);
    $('.sent_time #day13').val('');
    $('#sel_list').select2("destroy").select2();
    $('#sel_list').select2('val','0');

}

function resetPage() {
    window.location.reload();
}


//--------------------------------------URL传值方法------------------------------------------------------
UrlParm = function() { // url参数
    var data, index;
    (function init() {
        data = [];
        index = {};
        var u = window.location.search.substr(1);
        if (u != '') {
            var parms = decodeURIComponent(u).split('&');
            for (var i = 0, len = parms.length; i < len; i++) {
                if (parms[i] != '') {
                    var p = parms[i].split("=");
                    if (p.length == 1 || (p.length == 2 && p[1] == '')) {// p |
                        // p=
                        data.push([ '' ]);
                        index[p[0]] = data.length - 1;
                    } else if (typeof (p[0]) == 'undefined' || p[0] == '') { // =c |
                        // =
                        data[0] = [ p[1] ];
                    } else if (typeof (index[p[0]]) == 'undefined') { // c=aaa
                        data.push([ p[1] ]);
                        index[p[0]] = data.length - 1;
                    } else {// c=aaa
                        data[index[p[0]]].push(p[1]);
                    }
                }
            }
        }
    })();
    return {
        // 获得参数,类似request.getParameter()
        parm : function(o) { // o: 参数名或者参数次序
            try {
                return (typeof (o) == 'number' ? data[o][0] : data[index[o]][0]);
            } catch (e) {
            }
        },
        // 获得参数组, 类似request.getParameterValues()
        parmValues : function(o) { // o: 参数名或者参数次序
            try {
                return (typeof (o) == 'number' ? data[o] : data[index[o]]);
            } catch (e) {
            }
        },
        // 是否含有parmName参数
        hasParm : function(parmName) {
            return typeof (parmName) == 'string' ? typeof (index[parmName]) != 'undefined'
                : false;
        },
        // 获得参数Map ,类似request.getParameterMap()
        parmMap : function() {
            var map = {};
            try {
                for ( var p in index) {
                    map[p] = data[index[p]];
                }
            } catch (e) {
            }
            return map;
        }
    }
}();
