layui.use('layer',function(){
	layer=layui.layer;
});

var noticeId,notiNo,notiTitle,notiText,notiState,notiSentWay,notiSentTime,notiSentDate,notiApp,notiMail,notiWeb,notiWechat,notisendObject,notiTargetIds;
$(function(){
	//搜索条件
	var mainSearchData=[{
		idName:'textNo',
		text:'通知编号',
		field:'no'
	},{
		idName:'textTitle',
		text:'标题',
		field:'title'
	},{
		idName:'textContent',
		text:'正文',
		field:'content'
	}]

	Ew.search('.searchForm',{
		title:'查询',
		textValues:mainSearchData,
		btnValues:[{
			btnId:'btnSearch',
			text:'搜索',
			onClick:function(data){
				$('#tableSysNotice').bootstrapTable('refresh');
			}
		},{
			btnId:'btnClear',
			text:'重置',
			tableid:['tableSysNotice']
		}]
	});

	//主表格
	Ew.table('.mainTable',{
		btnValues:[{
			btnId:'btnAdd',text:'新增',onClick:function(){
                addToNotiPage();
			}
		},{
			btnId:'btnEdit',text:'编辑',otherOption:[{id:'tableSysNotice',selectNum: 1},{id:'tableSysNotice',noselect:[{title:'noticeStatus',nolist:['C','D','P']}]}],onClick:function(){
                var rows = $('#tableSysNotice').bootstrapTable('getSelections');
                $.each(rows,function (index,row) {
                    noticeId = row.tsSysNoticeId;
                    notiNo = row.no;
                    notiTitle = row.title;
                    notiText = row.content;
                    notiState = row.noticeStatus;
                    notiSentWay = row.isTxi;
                    notiSentTime = row.timingTime;
                    notiSentDate = row.noticeEndTime;
                    notiApp = row.isSendApp;
                    notiMail = row.isSendMail;
                    notiWeb = row.isSendWeb;
                    notiWechat = row.isSendWechat;
                    notisendObject = row.sendObject;
                    notiTargetIds = row.targetIds;
                });
                editToNotiPage(noticeId,notiNo,notiTitle,notiText, notiState,notiSentWay,notiSentTime,notiSentDate,notiApp,notiMail,notiWeb,notiWechat,notisendObject,notiTargetIds);
            }
		},{
			btnId:'btnDelete',text:'删除',isTrue:true,otherOption:[{id:'tableSysNotice',selMinNum: 1},{id:'tableSysNotice',noselect:[{title:'noticeStatus',nolist:['C','D','P']}]}],onClick:function(){
				var rows = $('#tableSysNotice').bootstrapTable('getSelections');
				ids = [];
				var flag = true;
				$.each(rows,function(index,row){
					ids.push(row.tsSysNoticeId);
				});
				datas = JSON.stringify({tsSysNoticeId : ids});
				var url = '/system/sysNotice/delete'
				$.when(Ew.ewAjax(url,datas)).done(function(results){
					$('#tableSysNotice').bootstrapTable('refresh');
				});
			}
		},{
			btnId:'btnCopy',text:'复制通知',onClick:function(){
                // window.top.location.href= apiUrl +'/system/sysNotice/exportTpl'
                var copyRows = $('#tableSysNotice').bootstrapTable('getSelections');
                var noticeTitle,noticeSendText,noticeSendObj,noticeSendApp,noticeSendMail,noticeSendWeb,noticeSendWeChat,noticeSendNow,noticeNo,notiSentEndTime,notiTargetId,notiSentTimingTime,noticeId;
                $.each(copyRows, function (index,val) {
                    noticeTitle = val.title;
                    noticeSendText = val.content;
                    noticeSendObj = val.sendObject;
                    noticeSendApp = val.isSendApp;
                    noticeSendMail = val.isSendMail;
                    noticeSendWeb = val.isSendWeb;
                    noticeSendWeChat = val.isSendWechat;
                    noticeSendNow = val.isTxi;
                    noticeNo = val.no;
                    notiSentEndTime = val.noticeEndTime;
                    notiSentTimingTime = val.timingTime;
                    noticeId = val.tsSysNoticeId;
                    notiTargetId = noticeId;
                });
                data = {title:noticeTitle,content:noticeSendText,sendObject:noticeSendObj,isSendApp:noticeSendApp,isSendMail:noticeSendMail,isSendWeb:noticeSendWeb,isSendWechat:noticeSendWeChat,isTxi:noticeSendNow,no:noticeNo,noticeEndTime:notiSentEndTime,targetIds:[notiTargetId],timingTime:notiSentTimingTime,tsSysNoticeId:noticeId};
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
                        } else {
                            layer.msg(data.message,{icon:2,time:1000});
                            return;
                        }
                    }
                });
            }
		},{
			btnId:'btnRecall',text:'撤回',onClick:function(){
				
			}
		}],
		tableId:'tableSysNotice',
		tableValue:{
			searchParams:mainSearchData,
			queryParams:function(){
				return{}
			},
			onClickRow:function(item,$element){

            },
			onLoadSuccess:function(){

            },
			url:'/system/sysNotice/querylistByPage',
			columns:[{
				checkbox: true
			},{
				field: 'no',
				title: '编号',
				align: 'center',
				sortable:true
			},{
				field: 'title',
				title: '标题',
				align: 'center',
				sortable:true
			},{
				field: 'content',
				title: '正文',
				align: 'center',
				sortable:true
			},{
				field: 'noticeStatus',
				title: '状态',
				align: 'center',
				sortable:true,
				formatter: function (value, row, index) {
                    if (value == "C"){
                    	return '完成';
                    }else if (value == "D"){
                    	return '删除';
                    }else if (value == "P"){
                    	return '发布';
                    }else if (value == "W"){
                    	return '等待发布';
                    }
            	}
			},{
				field: 'isTxi',
				title: '发送类型',
				align: 'center',
				sortable:true,
				formatter: function (value, row, index) {
                    if (value == 0){
                    	return '定时';
                    }else if (value == 1){
                    	return '即时';
                    }
            	}
			},{
				field: 'timingTime',
				title: '定时发送时间',
				align: 'center',
				sortable:true
			},{
				field: 'noticeEndTime',
				title: '有效时间从',
				align: 'center',
				sortable:true
			}]
		}
	});
})

// 新增跳转至通知编辑页面
function addToNotiPage() {
    var tsNotiQueryResourceIdIframe=ewData.ResourceId.notificationEditor;
    var resourceIcoIframe='';
    var nameIframe='通知编辑';
    var urlIframe="../home/NotiEdit/notiEdit.html";
    var mesCom=new mesComMethod();
    mesCom.openNewPage(tsNotiQueryResourceIdIframe,resourceIcoIframe,nameIframe,urlIframe,true);
}

// 编辑跳转至通知编辑页面
function editToNotiPage(tsSysNoticeId,no,title,content,noticeStatus,isTxi,timingTime,noticeEndTime,isSendApp,isSendMail,isSendWeb,isSendWechat,sendObject,targetIds) {
    var tsNotiQueryResourceIdIframe=ewData.ResourceId.notificationEditor;
    var resourceIcoIframe='';
    var nameIframe='通知编辑';
    var urlIframe="../home/NotiEdit/notiEdit.html?"+"&tsSysNoticeId="+tsSysNoticeId+"&no="+no+"&title="+title+"&content="+content+"&noticeStatus="+noticeStatus+"&isTxi="+isTxi+"&timingTime="+timingTime+"&noticeEndTime="+noticeEndTime+"&isSendApp="+isSendApp+"&isSendMail="+isSendMail+"&isSendWeb="+isSendWeb+"&isSendWechat="+isSendWechat+"&sendObject="+sendObject+"&targetIds="+targetIds;
    var mesCom=new mesComMethod();
    mesCom.openNewPage(tsNotiQueryResourceIdIframe,resourceIcoIframe,nameIframe,urlIframe,true);
}
