var resourceType = '';
function showMenu() {
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
                        $("#text10").val(nodes[0].name);
                        $("#text22").val(nodes[0].id);
                        $("#text32").val(nodes[0].level + 1);
                        hideMenu();
                    }
                }
            }, menus);
            var id=$('#text22').val();
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
    var parentMenu = $("#text10");
    var offset = parentMenu.offset();
    $("#menuContent").slideDown("fast");
    $(".modal-body").bind("mousedown", onBodyDown);
}

function hideMenu() {
    $("#menuContent").fadeOut("fast");
    $(".modal-body").unbind("mousedown", onBodyDown);
}

function onBodyDown(event) {
    if (!(event.target.id == "menuBtn" || event.target.id == "text10" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
        hideMenu();
    }
}

function getBtn(){
	var rows = $("#table1").bootstrapTable("getSelections");
    if (rows.length < 1) {
    	layer.msg("没有选择的数据！",{icon:7,time:1000});
        return;
    }
    if (rows.length > 1) {
    	layer.msg("只能选择一条数据编辑！",{icon:7,time:1000});
        return;
    }
    if (rows[0].resourceType != '3'){
    	layer.msg("只能选择页面！",{icon:7,time:1000});
        return;
    }
    if (rows[0].url == null){
    	layer.msg("url不能为空！",{icon:7,time:1000});
        return;
    }
    
    for(x=0 ; x<rows.length ; x++){
    	row=rows[x];
    	if(row.resourceType != '3'){
    		continue;
    	}
    	if(row.url.indexOf("html") == 0){
    		continue;
    	}
    	var seq = 1;
    	var oBtns=[];
    	$.get('../' + row.url,function(data){
    	    $(data).find('.btn').each(function(i){  
    	        var id=$(this).attr('id');  
    	        var name=$(this).html()
    	        name = name.replace(/^\s+|\s+$/g,"");
    	        var type=$(this).attr('type');  
    	        var btn;
    	        if(type=='button' || type=='reset'){
    	        	btn = { 
    	        		name:name,
    	        		parentId: row.tsSysResourceId,   
    	        		resourceType: "4",  
    	        		seq : seq, 
    	        		level : row.level + 1,
    	        		url :  id
    	         	};
    	        	seq=seq+1;
    	        	oBtns.push(btn);
    	        }
    	    });
    	})
        
        fileName = row.url.substr(0,row.url.lastIndexOf(".")) + ".js";
        $.get('../' + fileName,function(data){
        	var fileData = [];
        	fileData = data.split("\r\n");
        	var seq = 1;
        	var btns=[];
        	btns[seq]={id:"-1",name:"-1"};
        	for(var i=0;i<fileData.length;i++){
        		if(fileData[i].indexOf("btnId") > 0 ){
        			var rowInfo = fileData[i].split(",");
        			var part = [];
        			for(var j=0;j<rowInfo.length;j++){
        				if(("　" + rowInfo[j]).indexOf("btnId") > 0 ){
        					part = rowInfo[j].split(":");
        					id = part[1].trim();
        					btns[seq].id = id;
        				}
        				if(("　" + rowInfo[j]).indexOf("text") > 0 ){
        					part = rowInfo[j].split(":");
        					name = part[1].trim();
        					btns[seq].name = name;
        				}
        			}
        		}
        		if(btns[seq].id != "-1" && btns[seq].name != "-1"){
        			seq = seq + 1;
        			btns[seq]={id:"-1",name:"-1"};
        		} else {
        			if(btns[seq].id != "-1" && fileData[i].indexOf("text") > 0 ){
        				var rowInfo = fileData[i].split(",");
            			var part = [];
            			for(var j=0;j<rowInfo.length;j++){
            				if(("　" + rowInfo[j]).indexOf("text") > 0 ){
            					part = rowInfo[j].split(":");
            					name = part[1].trim();
            					btns[seq].name = name;
            				}
            			}
            			seq = seq + 1;
            			btns[seq]={id:"-1",name:"-1"};
    				}
        		}
        	}
        	var seq = 1;
        	var iBtns = [];
        	for(var i=0;i<fileData.length;i++){
        		if(btns[seq].id != "-1" && btns[seq].name != "-1"){
        			btn = {
        				name:btns[seq].name.replace("'","").replace("'",""),
        				parentId: row.tsSysResourceId,
        				resourceType: "4",  
        				seq : seq, 
        				level : row.level + 1,
        				url :  btns[seq].id.replace("'","").replace("'","")
        			};
        			seq=seq+1;
        			iBtns.push(btn);
        		}
        	}
        	
        	if(oBtns.length==0){
        		data={tsSysResourceId:row.tsSysResourceId,sysResource:iBtns};
        	} else {
        		data={tsSysResourceId:row.tsSysResourceId,sysResource:oBtns};
        	}
        	
        	$.ajax({
        		type: 'POST',
        		url: apiUrl + "/system/resource/addBtn",
        		data: JSON.stringify(data),
        		dataType: 'json',
        		contentType: "application/json",
        		success: function (data, textStatus, jqXHR) {
        			var errcode = data.code;//在此做了错误代码的判断
        			if(errcode != 10000){
        				layer.msg(data.message);
        				return;
        			}
//        			$('#table1').bootstrapTable("refresh");
        			layer.msg('保存成功!',{icon:1,time:1000});
        		}
        	});
        });  
    }
}


//新界面----------------------------------------------------------------------------------------------------------------------------------------------------

var mainSearchData = [
  {idName: 'text1', text: '菜单名称', field: 'name'},
  {idName: 'text2', text: 'URL', field: 'url'}
]


$(function () {
  //查询
//  Ew.search('.demoSearch',
//    {
//      title: '查询',
//      textValues: mainSearchData,
//      btnValues: [{
//        btnId: 'btnSearch', text: '搜索', onClick: function (data) {
//          $('#table1').bootstrapTable('refresh');
//        }
//      },
//        {btnId: 'btnClear', text: '重置', tableid: ['table1']}
//      ]
//    }
//  );

  loadTable(true)
})
//弹出框
function daliogShow(type) {
	var title = type == 'add' ? '新增' : '编辑';
	var defaultTable = type == 'add' ? '' : 'table1';
	if(type=='change'){
		resourceType=$('#'+defaultTable).bootstrapTable('getSelections')[0].resourceType;
	} else {
		resourceType='';
	}
  Ew.dialog('demoadd', {
    title: title,
    btnValues: [{
      btnId: 'btnSave',
      text: '保存',
      formid: 'demoform',
      onClick: function (data) {
        if (type == 'change') {
          data.tsSysResourceId = $('#' + defaultTable).bootstrapTable('getSelections')[0].tsSysResourceId;
        }
        datas = JSON.stringify(data);
        var url = (type == 'add' ? '/system/resource/add' : '/system/resource/update');
        $.when(Ew.ewAjax(url, datas)).done(function (results) {
          $('#demoadd').modal('hide');
          $('#table1').bootstrapTable('refresh');
        });
      }
    }, {
      btnId: 'btnCancel',
      text: '取消'
    }],
    form: {
      formId: 'demoform',
      columnNum: 2,
      formList: [{
        idName: 'combo1',
        text: '菜单类型',
        comboData: [{id: 1, text: 'WEB主节点'}, {id: 2, text: '菜单'}, {id: 3, text: '页面'}, {id: 4, text: '按钮'}],
        field: 'resourceType',
        valid: ['notEmpty'],
		onClick:function(data){
			var type = data.id;
			changeDis(type);
		},
		disabled:type=='add'?false:true
      }, {
        idName: 'text10',
        text: '父级菜单',
        field: 'parent_name',
        valid: ['notEmpty'],
        onLoadsuccess: function () {
          $('#text10').after(
            '<div id="menuContent" class="menuContent" style="display:none; position: absolute;width:95%; top:30px;background-color:#fff;border:1px solid rgb(170,170,170);z-index:10;">' +
            '<ul id="treeMenu" class="ztree" style="margin-top:0; height: 300px; overflow-y:scroll; overflow-x:auto;"></ul>' +
            '</div>'
          )
        },
        readonly: true,
        onClick: function () {
          if (resourceType != '1') {
        	showMenu()
          }
        },
        disabled:resourceType=='1'?true:false
      }, {
        idName: 'text44',
        text: '菜单名称',
        field: 'name',
        valid: ['notEmpty']
      }, {
        idName: 'number1',
        text: '顺序号',
        field: 'seq',
        valid: ['notEmpty']
      }, {
        idName: 'iconshow1',
        text: '图标',
        field: 'resourceIco'
      }, {
        idName: 'text5',
        text: 'URL',
        n: 2,
        field: 'url',
        valid: ['notEmpty'],
        disabled:(resourceType=='1' || resourceType=='2')?true:false
      }, {
        idName: 'area1',
        text: '备注',
        n: 2,
        field: 'remark'
      }, {
          idName: 'text22',
          text: '父节点id',
          field: 'parentId',
          hidden: true
      }, {
          idName: 'text32',
          text: '层级',
          field: 'level',
          hidden: true
        }],
      defaultTable: defaultTable
    }
  })
  if(type=='add'){
	var selection = $('#table1').bootstrapTable('getSelections')[0];
	if (selection){
		$("#text10").val(selection.name);
        $("#text22").val(selection.tsSysResourceId);
        $("#text32").val(selection.level + 1);
	}
  }
}


function loadTable(isExpen){
  $('.demoTable').empty();
  //表格
  Ew.table('.demoTable',
    {
      btnValues: [
        {
          btnId: 'btnAdd', text: '新增', onClick: function () {
          daliogShow('add')
        }
        },
        {
          btnId: 'btnEdit', text: '编辑', otherOption: [{id: 'table1', selectNum: 1}], onClick: function () {
          daliogShow('change')
        }
        },
        {
          btnId: 'btnDelete', text: '删除', otherOption: [{id: 'table1', selMinNum: 1}], isTrue: true, onClick: function () {
          var rows = $('#table1').bootstrapTable('getSelections');
          var ids = [];
          $.each(rows, function (index, row) {
            ids.push(row.tsSysResourceId);
          });
          datas = JSON.stringify({tsSysResourceId: ids});
          var url = '/system/resource/del';
          $.when(Ew.ewAjax(url, datas)).done(function (results) {
            $('#table1').bootstrapTable('refresh');
          });
        }
        },
        {
          btnId: 'btnGetBtn', text: '获取页面按钮', onClick: function () {
          getBtn()
        }
        },
        {
          btnId: 'btnAllExpend', text: isExpen?'全部展开':'全部收缩', onClick: function () {
          if(isExpen){
            loadTable(false)
          }
          else{
            loadTable(true)
          }
        }
        }
      ],
      tableId: 'table1',
      tableValue: {
        pagination: false,
        treeView: true,
        treeCollapseAll: isExpen,//是否全部展开
        treeId: "tsSysResourceId",
        treeField: "name",
        treeRootLevel: 1,
        searchParams: mainSearchData,
        queryParams: function () {
          return {}
        },
        url: '/system/resource/query',
        columns: [{
          checkbox: true
        }, {
          field: 'name',
          title: '菜单名称',
          width:'200px'
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
          },
          width:'70px'
        }, {
          field: 'url',
          title: 'URL',
          width:'300px'
        }, {
          field: 'seq',
          title: '顺序号',
          width:'70px'
        }, {
          field: 'resourceIco',
          title: '图标',
          formatter: function (value, row, index) {
            return "<span class=\"fa " + value + "\">";
          },
          width:'70px'
        }, {
          field: 'remark',
          title: '备注',
          width:'70px'
        }
        ]
      }
    }
  );
}


function changeDis(type){
	resourceType = type;
	if (type == '1') {
		$("#text10").val(" ");
		$("#text10").attr("disabled",true);
		$("#text5").attr("disabled",true);
		$("#text5").val("");
		$("#text22").val("");
		$("#text32").val(1);
		Ew.dynvalid(false,'demoform',[{field:'parent_name',idName:'text10'},{field:'url',idName:'text5'}])
	} else if (type == '2'){
		$("#text10").val("");
		$("#text10").attr("disabled",false);
		$("#text5").val("");
		$("#text5").attr("disabled",true);
		$("#text22").val("");
		$("#text32").val("");
		Ew.dynvalid(false,'demoform',[{field:'url',idName:'text5'}])
	}else if (type == '3') {
		$("#text10").attr("disabled",false);
		$("#text5").attr("disabled",false);
	}else if (type == '4') {
		$("#text10").attr("disabled",false);
		$("#text5").attr("disabled",false);
	}
}