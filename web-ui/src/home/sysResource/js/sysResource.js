$(function () {
	 
    //1.初始化Table
   var oTable = new TableInit();
   oTable.Init();
    
    layui.use(['layer'], function(){
      $ = layui.jquery;//jquery
      layer = layui.layer;//弹出层
    });
    
    $('#formEdit').bootstrapValidator({
        message: '验证不通过',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            name: {
                validators: {
                    notEmpty: {
                        message: '菜单名称不能为空'
                    },
                    stringLength: {
                        min: 1,
                        max: 50,
                        message: '菜单名称长度不能超过50'
                    }
                }
            },
            url: {
                validators: {
                	stringLength: {
                		min: 1,
                        max: 200,
                        message: 'url长度不能超过200'
                	} 
                }
            },
            resourceType: {
                validators: {
                	notEmpty: {
                		message: '菜单类型不能为空'
                	} 
                }
            },
            seq: {
                validators: {
                	notEmpty: {
                		message: '顺序号不能为空'
                	},
                	stringLength: {
                		min: 1,
                        max: 2,
                        message: '顺序号长度不能超过2'
                	},
                	numeric: {
                		message: '顺序号只能输入数字'
                	} 
                }
            },
            remark: {
                validators: {
                	stringLength: {
                		min: 1,
                        max: 200,
                        message: '顺序号长度不能超过200'
                	}
                }
            }
        }
    });
    
    $('#tb_sysResource').bootstrapTable('hideColumn', 'level');
    $('#tb_sysResource').bootstrapTable('hideColumn', 'parent_name');
});

var mod_flag=0

//定义表格
var TableInit = function () {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#tb_sysResource').bootstrapTable({
            url: apiUrl + "/system/resource/query",         //请求后台的URL（*）
            method: 'post',                      //请求方式（*）
            toolbar: "#toolbar",
            treeView: true,
            treeCollapseAll: true,//是否全部展开
            treeId: "tsSysResourceId",
            treeField: "name",
            treeRootLevel: 1,
            dataField: "data",					//这是返回的json数组的key.默认好像是"rows".这里只有前后端约定好就行
            height: $(window).height(),
            idField: "tsSysResourceId",
            sortName: "Sort",
            showRefresh: false,
            search: true,
            striped: true,
            queryParams: oTableInit.queryParams,//传递参数（*）
            clickToSelect: true,
            responseHandler:function(res){
            	var errcode = res.code;//在此做了错误代码的判断
        	    if(errcode != 10000){
        	        alert("错误消息: " + data.message);
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
            }, {
                field: 'name',
                title: '菜单名称'
            }, {
                field: 'resourceType',
                title: '类型',
                formatter: function (value, row, index) {
                    if (value == '1')
                        return 'WEB主节点';
                    else if (value == '2')
                        return '菜单';
                    else if (value == '3')
                        return '页面';
                    else if (value == '4')
                        return '按钮';
                    else {
                        return '';
                    }
                }
                	
            }, {
                field: 'url',
                title: 'URL'
            }, {
                field: 'seq',
                title: '顺序号'
            }, {
                field: 'resourceIco',
                title: '图标',
            	formatter: function (value, row, index) {
                    return "<span class=\"fa " + value + "\">";
                }	
            }, {
                field: 'openType',
                title: '打开方式',
                formatter: function (value, row, index) {
                    if (value == '1')
                        return '新页签打开';
                    else if (value == '2')
                        return '当前页签打开';
                    else {
                        return '';
                    }
                }
            }, {
                field: 'remark',
                title: '备注'
            }, {
                field: 'level',
                title: '层级'
            }, {
                field: 'parent_name',
                title: '父菜单'
            }
            ]
        });
    };
    
    //得到查询的参数
    oTableInit.queryParams = function (params) {
        var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
        	pageSize: params.limit,   //页面大小
            pageIndex: params.offset,  //页码
            name: $("#txt_search_name").val(),
            url: $("#txt_search_url").val()
        };
        return temp;
    };
    return oTableInit;
};

function queryInfo(){
	$('#tb_sysResource').bootstrapTable("refresh");
	$('#tb_sysResource').bootstrapTable("refresh").collapseAll();
}

//打开新增窗口
function openAddWin(){
	clearForm($('#addModal'));
	hideMenu();
	$('#resourceIco').children("i").attr("class","");
	$('#addModal').modal("show");
	mod_flag=0;
	$('.modal-title').html('新增');
}

//打开编辑窗口
function openEditWin () {
	var rows = $("#tb_sysResource").bootstrapTable("getSelections");
    if (rows.length < 1) {
    	layer.msg("没有选择的数据！");
        return;
    }
    if (rows.length > 1) {
    	layer.msg("只能选择一条数据编辑！");
        return;
    }
    mod_flag=1;
    $('#tsSysResourceId').val(rows[0].tsSysResourceId);
	$('#name').val(rows[0].name);
	$('#resourceType').val(rows[0].resourceType);
	$('#url').val(rows[0].url);
	$('#seq').val(rows[0].seq);
	$('#openType').val(rows[0].openType);
	$('#parentId').val(rows[0].parentId);
	$('#level').val(rows[0].level);
	$('#resourceIco').attr("data-icon","fa " + rows[0].resourceIco);
	$('#resourceIco').children("i").attr("class","fa " + rows[0].resourceIco);
	$('#remark').val(rows[0].remark);
	$('#level').val(rows[0].level);
	$('#ParentMenu').val(rows[0].parent_name);
	$('.modal-title').html('编辑');
    $('#addModal').modal("show");
}

//保存信息
function saveInfo(){
	$('#formEdit').data('bootstrapValidator').validate();  
    if(!$('#formEdit').data('bootstrapValidator').isValid()){  
        return ;  
    }
	var data=$('#formEdit').serializeObject();
	data=JSON.stringify(data);
	if (mod_flag == 0){
		url = apiUrl + "/system/resource/add";
	} else {
		url = apiUrl + "/system/resource/update";
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
        		clearForm($('#addModal'));
        		$('#resourceIco').children("i").attr("class","");
        	});
        	$('#addModal').modal('hide');
        	$('#tb_sysResource').bootstrapTable("refresh");
            layer.msg('保存成功!',{icon:1,time:1000});
        }
    });
}

//删除
function deleteInfo(){
	var rows = $("#tb_sysResource").bootstrapTable("getSelections");
    if (rows.length < 1) {
    	layer.msg("没有选择的数据！");
        return;
    }
	layer.confirm('删除数据不可恢复，确定删除吗？',function(index){
		var rowid = [];
        $.each(rows, function (index, row) {
        	rowid.push(row.tsSysResourceId);
        });
        data={tsSysResourceId:rowid}
        $.ajax({
            type: "POST",
            url: apiUrl + "/system/resource/del",
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json",
            success: function (data) {
            	var errcode = data.code;//在此做了错误代码的判断
        	    if(errcode != 10000){
        	    	alert("错误消息: " + data.message);
        	        return;
        	    }
                $("#tb_sysResource").bootstrapTable("refresh");
                layer.msg('删除成功!',{icon:1,time:1000});
            }
        });
    });
}

$.fn.serializeObject = function()    
{    
   var o = {};    
   var a = this.serializeArray();    
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

function showMenu() {
	if ($("#resourceType").val()==null){
		layer.msg("请先选择菜单类型");
		return;
	}
	var data={pageIndex:"-1"};
	data=JSON.stringify(data);
	$.ajax({
        type: "POST",
        async: false,
        data: data,
        url: apiUrl + "/system/resource/query",
        dataType: 'JSON',
        contentType: "application/json",
        success: function (data, textStatus, jqXHR) {
        	var errcode = data.code;//在此做了错误代码的判断
    	    if(errcode != 10000){
    	        alert("错误消息: " + data.message);
    	        return;
    	    }
            var menus=[];
            var root={
                id:'0',
                pId:'-1',
                name:'菜单',
                open:true,
                level:0
            };
            menus.push(root);
            $.each(data.results,function(index,item){
                menus.push({
                    id:item.tsSysResourceId,
                    pId:item.parentId ?item.parentId:'0',
                    name:item.name,
                    level:item.level
                });
            });
            $.fn.zTree.init($("#treeMenu"), {
                check: {
                    enable: true,
                    chkStyle: "radio",
                    radioType: "all"
                },
                view: {
                    dblClickExpand: false
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    onClick: function (e, treeId, treeNode) {
                        var zTree = $.fn.zTree.getZTreeObj("treeMenu");
                        zTree.checkNode(treeNode, !treeNode.checked, null, true);
                        return false;
                    },
                    onCheck: function (e, treeId, treeNode) {
                        var zTree = $.fn.zTree.getZTreeObj("treeMenu"),
                        nodes = zTree.getCheckedNodes(true);
                        $("#ParentMenu").val(nodes[0].name);
                        $("#parentId").val(nodes[0].id);
                        $("#level").val(nodes[0].level + 1);
                        hideMenu();
                    }
                }
            }, menus);
            var id=$('#parentId').val();
            var ztree=$.fn.zTree.getZTreeObj("treeMenu");
            if(id.length>0){
                var node = ztree.getNodeByParam('id', id, null);
                ztree.checkNode(node,true,false,true);
            }
            else{
                var node = ztree.getNodeByParam('id', '0', null);
                ztree.checkNode(node,true,false,true);
            }
        }
    });
    var parentMenu = $("#ParentMenu");
    var offset = parentMenu.offset();
    $("#menuContent").slideDown("fast");
    $(".modal-body").bind("mousedown", onBodyDown);
}

function hideMenu() {
    $("#menuContent").fadeOut("fast");
    $(".modal-body").unbind("mousedown", onBodyDown);
}

function onBodyDown(event) {
    if (!(event.target.id == "menuBtn" || event.target.id == "ParentMenu" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
        hideMenu();
    }
}