/**
 * Created by Administrator on 2017/9/21.
 */
var msgType= '',msgStatus = '',msgTitle,msgNewsId,andData;
var isOneTbale = true,isFirstFresh = true,updateStatus = true,dataResult,overNews = 0,hadRead= 0,notRead = 0,ntcIndex = 0,tskIndex = 0,andIndex = 0;
$(function () {
    useAjax();
    // 通知消息的数量
    $('body').on('click','#all',function () {
        msgType = '';
        msgStatus = '';
        $("#tableUserMsg").bootstrapTable("refresh");
    });
    $('body').on('click','#task',function () {
        msgType = 'TSK';
        msgStatus = '';
        $("#tableUserMsg").bootstrapTable("refresh");
    });
    $('body').on('click','#notice',function () {
        msgType = 'NTC';
        msgStatus = '';
        $("#tableUserMsg").bootstrapTable("refresh");
    });
    $('body').on('click','#AND',function () {
        msgType = 'AND';
        msgStatus = '';
        $("#tableUserMsg").bootstrapTable("refresh");
    });

    // 全部消息
    $('body').on('click','#allNews',function () {
        msgType = '';
        msgStatus = '';
        $("#tableUserMsg").bootstrapTable("refresh");
    });
    // 未读消息
    $('body').on('click','#notRead',function () {
        msgType = '';
        msgStatus = 'N';
        $("#tableUserMsg").bootstrapTable("refresh");
    });
    // 已读消息
    $('body').on('click','#readyRead',function () {
        msgType = '';
        msgStatus = 'Y';
        $("#tableUserMsg").bootstrapTable("refresh");
    });
    // 过期消息
    $('body').on('click','#overNews',function () {
        msgType = '';
        msgStatus = 'E';
        $("#tableUserMsg").bootstrapTable("refresh");
    });

    // 全部类型表格
    Ew.table('.allTable',{
        tableId:'tableUserMsg',
        btnValues:[{
            btnId:'btnDelete',text:'删除',isTrue:true,otherOption:[{id:'tableUserMsg',selMinNum: 1}],onClick:function(){
                var rows = $('#tableUserMsg').bootstrapTable('getSelections');
                ids = [];
                var flag = true;
                $.each(rows,function(index,row){
                    ids.push(row.tsSysUserMsgId);
                });
                datas = JSON.stringify({tsSysUserMsgId : ids});
                var url = '/system/sysUserMsg/delete';
                $.when(Ew.ewAjax(url,datas)).done(function(results){
                    useAjax();
                    $('#tableUserMsg').bootstrapTable('refresh');
                });
            }
        },{
            btnId:'hadRead',text:'标为已读',otherOption:[{id:'tableUserMsg',selMinNum: 1},{id:'tableUserMsg',noselect:[{title:'msgStatus',nolist:['E','Y']}]}],onClick: function () {
                isOneTbale = true;
                isFirstFresh = true;
                updateStatus = true;
                var rows = $('#tableUserMsg').bootstrapTable('getSelections');
                ids = [];
                var flag = true;
                $.each(rows,function(index,row){
                    ids.push(row.tsSysUserMsgId);
                });
                datas = JSON.stringify({tsSysUserMsgId : ids});
                var url = '/system/sysUserMsg/updateReadStatus';
                $.when(Ew.ewAjax(url,datas)).done(function(results){
                    useAjax();
                    $('#tableUserMsg').bootstrapTable('refresh');
                });
            }
        }],
        tableValue:{
            queryParams:function queryParams(params) {   //设置查询参数
                var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                    // pageSize: params.limit,   //页面大小
                    // offset: params.offset,  //页码
                    // pageIndex : params.offset / params.limit + 1,
                    name : '',
                    title : '',
                    msgStatus: msgStatus,
                    msgType:msgType,
                    msgId:msgNewsId
                };
                return temp;
            },
            onClickRow:function(value,index){

            },
            onLoadSuccess:function(){

            },
            url:'/system/sysUserMsg/queryUserMsgs',
            columns:[{
                checkbox: true
            },{
                field: 'msgType',
                title: '消息类型',
                align: 'center',
                sortable:true,
                formatter: function (value, row, index) {
                    if (value === "AND"){
                        return '暗灯';
                    }else if (value === "NTC"){
                        return '通知';
                    }else if (value === "TSK"){
                        return '任务';
                    }
                }
            },{
                field: 'name',
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
            },
                {
                    field: '',
                    title: '查看',
                    align: 'center',
                    sortable:true,
                    formatter: function (value, row, index) {
                        msgTitle = row.title;
                        return '<a class="route-href" href="javascript:void(0)" onclick="showDetailMsg(\'' + row.msgType +'\',\''+ row.tsSysUserMsgId+'\')">查看详情</a>'
                    }
                }
            ]
        }
    });
});

// 调用接口
function useAjax() {
    notRead = 0;
    ntcIndex = 0;
    overNews = 0;
    hadRead= 0;
    tskIndex = 0;
    andIndex = 0;
    dataPage = {pageSize:-1};
    $.ajax({
        type: 'POST',
        url: apiUrl + "/system/sysUserMsg/queryUserMsgs",
        data: JSON.stringify(dataPage),
        contentType: 'application/json',
        success: function (data) {
            dataResult = data.results;
            for (var i = 0, j = data.results.length; i < j; i++) {
                if (dataResult[i].msgStatus === 'N'){
                    notRead++;
                } else if (dataResult[i].msgStatus === 'Y') {
                    hadRead++;
                } else if (dataResult[i].msgStatus === 'E') {
                    overNews++;
                }
                if (dataResult[i].msgType === 'NTC') {
                    ntcIndex++;
                } else if (dataResult[i].msgType === 'TSK') {
                    tskIndex++;
                } else if (dataResult[i].msgType === 'AND') {
                    andData = dataResult[i].taskUrl;
                    andIndex++;
                }
            }
            // 未读消息
            var notReadNum = '('+ notRead +')';
            $('#notRead span').html(notReadNum);
            // 通知消息个数
            var noticeNum = '('+ ntcIndex +')';
            $('#notice span').html(noticeNum);
            // 已读消息个数
            var hadReadNum = '('+ hadRead +')';
            $('#readyRead span').html(hadReadNum);
            // 过期消息个数
            var overNewsNum = '('+ overNews +')';
            $('#overNews span').html(overNewsNum);

            // 暗灯消息个数
            var andNum = '('+ andIndex +')';
            $('#AND span').html(andNum);

            // 任务消息个数
            var taskNum = '('+ tskIndex +')';
            $('#task span').html(taskNum);

        }
    });
}

// 查看详情信息
function showDetailMsg(type,id) {
    var msgNewsIds = [];
    msgNewsId = id;
    $.ajax({
        type: 'POST',
        url: apiUrl + "/system/sysUserMsg/queryMsgDetail",
        data: msgNewsId,
        contentType: 'application/json',
        success: function (data) {
            if (type==='NTC') {
                if (data.code === '10000') {
                    layer.open({
                        type: 1,
                        title:'通知消息',
                        skin: 'layui-layer-rim', //加上边框
                        area: ['420px', '240px'], //宽高
                        content: '<div class="ntcNews"><p class="newsTitle">标题：'+data.results.title+'</p><p>内容：'+data.results.content+'</p></div>'
                    });
                    msgNewsIds.push(msgNewsId);
                    datas = JSON.stringify({tsSysUserMsgId : msgNewsIds});
                    $.ajax({
                        type: 'POST',
                        url: apiUrl + "/system/sysUserMsg/updateReadStatus",
                        data: datas,
                        contentType: 'application/json',
                        success: function (data) {
                            if (data.results) {
                                useAjax();
                                $('#tableUserMsg').bootstrapTable('refresh');
                            } else {
                                layer.msg(data.message,{icon:2,time:1000});
                            }
                        }
                    });
                } else {
                    layer.msg(data.message,{icon:2,time:1000});
                }
            } else if (type==='AND') {
                msgNewsIds.push(msgNewsId);
                datas = JSON.stringify({tsSysUserMsgId : msgNewsIds});
                $.ajax({
                    type: 'POST',
                    url: apiUrl + "/system/sysUserMsg/updateReadStatus",
                    data: datas,
                    contentType: 'application/json',
                    success: function (data) {
                        if (data.results) {
                            useAjax();
                            $('#tableUserMsg').bootstrapTable('refresh');
                            setTimeout(function () {
                                var tsSysResourceIdIframe=andData;
                                var resourceIcoIframe='';
                                var nameIframe='暗灯响应';
                                var urlIframe="../Quality/MmAndonTe/mmAndonTe.html?";
                                var mesCom=new mesComMethod();
                                mesCom.openNewPage(tsSysResourceIdIframe,resourceIcoIframe,nameIframe,urlIframe,true);
                            },500);
                        } else {
                            layer.msg(data.message,{icon:2,time:1000});
                        }
                    }
                });
            } else if (type==='TSK') {

            }
        }
    });
}


