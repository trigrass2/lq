$(function () {
	 
    //1.初始化Table
    var oTable = new TableInit();
    oTable.Init();
    
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
  	
  	$("#statusAreaA").bootstrapSwitch(
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
  	
  	$("#statusLocA").bootstrapSwitch(
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
    
    $('#formStorage').bootstrapValidator({
        message: '验证不通过',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            storageNo: {
                validators: {
                    notEmpty: {
                        message: '仓库编号不能为空'
                    },
                    stringLength: {
                        min: 1,
                        max: 20,
                        message: '仓库编号长度不能超过20'
                    },
                    regexp: {/* 只需加此键值对，包含正则表达式，和提示 */
                        regexp: /^[a-zA-Z0-9_\\/-]+$/,
                        message: '只能是数字、字母、_(下划线)、-(中划线)、\(斜杠)、/(反斜杠)'
                    },
                    remote: {
                    	type: "POST",
                    	dataType: "json",           //接受数据格式    
                    	contentType: "application/json",
                    	url: apiUrl + "/base/basStorage/findByParam",
                        message: '仓库编码已存在。',
                        data: function(validator) {
	                        return {
//	                        	tmBasStorageId: $("#tmBasStorageId").val(),
	                        	storageNo: $("#storageNo").val()
	                        };
                        },
                        delay: 1000
                    }
                }
            },
            name: {
                validators: {
                    notEmpty: {
                        message: '仓库名称不能为空'
                    },
                    stringLength: {
                        min: 1,
                        max: 200,
                        message: '仓库名称长度不能超过200'
                    }
                }
            },
            storageType: {
                validators: {
                    notEmpty: {
                        message: '仓库类型必须选择'
                    }
                }
            },
            sapNo: {
                validators: {
                	stringLength: {
                		min: 0,
                        max: 200,
                        message: 'SAP库存地点长度不能超过200'
                	}
                }
            },              
            contact: {
                validators: {
                	stringLength: {
                		min: 0,
                        max: 50,
                        message: '联系人长度不能超过50'
                	}
                }
            },              
            addr: {
                validators: {
                	stringLength: {
                		min: 0,
                        max: 200,
                        message: '地址长度不能超过200'
                	}
                }
            },              
            telNo: {
                validators: {
                    stringLength: {
                        min: 0,
                        max: 50,
                        message: '电话号码长度不能超过50'
                    },
                    regexp: {/* 只需加此键值对，包含正则表达式，和提示 */
                        regexp: /^(0\d{2}-\d{8}(-\d{1,4})?)|(0\d{3}-\d{7,8}(-\d{1,4})?)$/,
                        message: '电话号码格式不正确(例如：021-12345678-[111])'
                    }
                }
            },              
            mobileNo: {
                validators: {
                    stringLength: {
                        min: 0,
                        max: 11,
                        message: '手机号码长度不能超过11'
                    },
                    regexp: {/* 只需加此键值对，包含正则表达式，和提示 */
                        regexp: /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/,
                        message: '手机号码格式不正确'
                    }
                }
            },                          
            remark: {
                validators: {
                	stringLength: {
                		min: 1,
                        max: 200,
                        message: '备注长度不能超过200'
                	}
                }
            }
        }
    });

    $('#formArea').bootstrapValidator({
        message: '验证不通过',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            storageNo: {
                validators: {
                    notEmpty: {
                        message: '库区编号不能为空'
                    },
                    stringLength: {
                        min: 1,
                        max: 20,
                        message: '库区编号长度不能超过20'
                    },
                    regexp: {/* 只需加此键值对，包含正则表达式，和提示 */
                        regexp: /^[a-zA-Z0-9_\\/-]+$/,
                        message: '只能是数字、字母、_(下划线)、-(中划线)、\(斜杠)、/(反斜杠)'
                    },
                    remote: {
                    	type: "POST",
                    	dataType: "json",           //接受数据格式    
                    	contentType: "application/json",
                    	url: apiUrl + "/base/basStorage/findByParam",
                        message: '库区编码已存在。',
                        data: function(validator) {
	                        return {
//	                        	tmBasStorageId: $("#tmBasStorageId").val(),
	                        	storageNo: $("#areaNo").val()
	                        };
                        },
                        delay: 1000
                    }
                }
            },
            name: {
                validators: {
                    notEmpty: {
                        message: '库区名称不能为空'
                    },
                    stringLength: {
                        min: 1,
                        max: 200,
                        message: '库区名称长度不能超过200'
                    }
                }
            },            
            remark: {
                validators: {
                	stringLength: {
                		min: 1,
                        max: 200,
                        message: '备注长度不能超过200'
                	}
                }
            }
        }
    });

    $('#formLoc').bootstrapValidator({
        message: '验证不通过',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            storageNo: {
                validators: {
                    notEmpty: {
                        message: '库位编号不能为空'
                    },
                    stringLength: {
                        min: 1,
                        max: 20,
                        message: '库位编号长度不能超过20'
                    },
                    regexp: {/* 只需加此键值对，包含正则表达式，和提示 */
                        regexp: /^[a-zA-Z0-9_\\/-]+$/,
                        message: '只能是数字、字母、_(下划线)、-(中划线)、\(斜杠)、/(反斜杠)'
                    },
                    remote: {
                    	type: "POST",
                    	dataType: "json",           //接受数据格式    
                    	contentType: "application/json",
                    	url: apiUrl + "/base/basStorage/findByParam",
                        message: '库区编码已存在。',
                        data: function(validator) {
	                        return {
	                        	storageNo: $("#locNo").val()
	                        };
                        },
                        delay: 1000
                    }
                }
            },
            name: {
                validators: {
                    notEmpty: {
                        message: '库位名称不能为空'
                    },
                    stringLength: {
                        min: 1,
                        max: 200,
                        message: '库位名称长度不能超过200'
                    }
                }
            },
            length: {
                validators: {
                    stringLength: {
                        min: 0,
                        max: 3,
                        message: '长度不能超过3'
                    }
                }
            },
            width: {
                validators: {
                    stringLength: {
                        min: 0,
                        max: 3,
                        message: '长度不能超过3'
                    }
                }
            },
            hight: {
                validators: {
                    stringLength: {
                        min: 0,
                        max: 3,
                        message: '长度不能超过3'
                    }
                }
            }
        }
    });

//	getDictionary('BOM_TYPE','bomType',$("#formSearch,#formEdit,#formEditList"));//BOM类型
	getDictionary('STORAGE_TYPE','storageType');//仓库类型
	
	optionSearchList('storageId', apiUrl + "/base/basStorage/getAllStorage/1", '', 'tmBasStorageId', 'storageNo', 'name');
	optionSearchList('areaId', apiUrl + "/base/basStorage/getAllStorage/2", '', 'tmBasStorageId', 'storageNo', 'name');
	optionSearchList('locId', apiUrl + "/base/basStorage/getAllStorage/3", '', 'tmBasStorageId', 'storageNo', 'name');
	
	var selectorDefaultComment = "<option value = ''></option>";
	//仓库下拉框内容发生更改时触发
	$("#storageId").change(function () {
		if ($("#storageId").val() != '') {
			$("#areaId").html(selectorDefaultComment);
	    	$("#locId").html(selectorDefaultComment);
			optionSearchList('areaId', apiUrl + "/base/basStorage/findByParentId/" + $("#storageId").val(), '', 'tmBasStorageId', 'storageNo', 'name');
		}
		if($('#storageId option:selected').val() == ""){
			optionSearchList('areaId', apiUrl + "/base/basStorage/getAllStorage/2", '', 'tmBasStorageId', 'storageNo', 'name');
			optionSearchList('locId', apiUrl + "/base/basStorage/getAllStorage/3", '', 'tmBasStorageId', 'storageNo', 'name');
		}
	});
	if($('#storageId option:selected').val() == ""){
		optionSearchList('areaId', apiUrl + "/base/basStorage/getAllStorage/2", '', 'tmBasStorageId', 'storageNo', 'name');
		optionSearchList('locId', apiUrl + "/base/basStorage/getAllStorage/3", '', 'tmBasStorageId', 'storageNo', 'name');
	}
	   
	//库区下拉框内容发生更改时触发
	$("#areaId").change(function () {
	    $("#locId").html(selectorDefaultComment);
		if ($("#areaId").val() != '') {
			optionSearchList('locId', apiUrl + "/base/basStorage/findByParentId/" + $("#areaId").val(), '', 'tmBasStorageId', 'storageNo', 'name');
		}
		if ($("#areaId").val() == '' && $("#storageId").val() == '') {
			optionSearchList('locId', apiUrl + "/base/basStorage/getAllStorage/3", '', 'tmBasStorageId', 'storageNo', 'name');
		} 
	});
//	if($('#areaId option:selected').val() == ""){
//		searchList('locId', apiUrl + "/base/basStorage/getAllStorage/3", '', 'tmBasStorageId', 'name');
//	}

});

var mod_flag=0;

//定义表格
var TableInit = function () {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#tb_basStorage').bootstrapTable({
            url: apiUrl + "/base/basStorage/querylistByPage",         //请求后台的URL（*）
            method: 'post',                      //请求方式（*）
            toolbar: "#toolbar",
            treeView: true,
            treeCollapseAll: true,//是否全部展开
            treeId: "tmBasStorageId",
            treeField: "storageNo",
            treeRootLevel: 1,
            dataField: "data",					//这是返回的json数组的key.默认好像是"rows".这里只有前后端约定好就行
//          height: $(window).height(),
            height: 400,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            idField: "tmBasStorageId",
            sortName: "Sort",
            showRefresh: false,
            search: true,
            striped: true,
            ajaxOptions:{
            	headers: {
            		token:sessionStorage.token
            	}
            },
            queryParams: oTableInit.queryParams,//传递参数（*）
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
            },
            columns: [{
                checkbox: true
            }, {
                field: 'storageNo',
                title: '编号'
            }, {
                field: 'name',
                title: '名称'
            }, {
                field: 'plant',
                title: '工厂'
            }, {
                field: 'workshop',
                title: '车间'
            }, {
                field: 'attr1',
                title: '属性1'
            }, {
                field: 'attr2',
                title: '属性2'
            }, {
                field: 'attr3',
                title: '属性3'
            }, {
                field: 'attr4',
                title: '属性4'
            }, {
                field: 'attr5',
                title: '属性5'
            }, {
                field: 'remark',
                title: '备注'
            }, {
                field: 'enabled',
				title: '启用',
				formatter: function (value, row, index) {
				if (value == '1')
					return '<div class="bootstrap-switch bootstrap-switch-wrapper bootstrap-switch-on bootstrap-switch-small bootstrap-switch-animate" style="width: 90px;"><div class="bootstrap-switch-container" style="width: 132px; margin-left: 0px;"><span class="bootstrap-switch-handle-on bootstrap-switch-success" style="width: 44px;">启用</span><span class="bootstrap-switch-label" style="width: 44px;"></div></div>'
				else if (value == '0')
					return '<div class="bootstrap-switch bootstrap-switch-wrapper bootstrap-switch-on bootstrap-switch-small bootstrap-switch-animate" style="width: 90px;"><div class="bootstrap-switch-container" style="width: 132px; margin-left: 0px;"><span class="bootstrap-switch-label" style="width: 44px;">&nbsp;</span><span class="bootstrap-switch-handle-off bootstrap-switch-danger" style="width: 44px;">禁用</span><span class="bootstrap-switch-label" style="width: 44px;"></div></div>'
				else {
					return '';
				}
             }
            }
            ]
        });
    };
    
    //得到查询的参数
    oTableInit.queryParams = function (params) {
        var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
        	pageSize: params.limit,   //页面大小
            pageIndex: params.offset,  //页码
            attr1: $("#storageId").val(),  //三级联动的仓库id
            attr2: $("#areaId").val(),     //三级联动的库区id
            attr3: $("#locId").val()       //三级联动的库位id
        };
        return temp;
    };
    return oTableInit;
};

function queryInfo(){
	$('#tb_basStorage').bootstrapTable("refresh");
}

function clearInfo(){
	$("#storageId").val("");
	$("#areaId").val("");
	$("#locId").val("");
	optionSearchList('areaId', apiUrl + "/base/basStorage/getAllStorage/2", '', 'tmBasStorageId', 'storageNo', 'name');
	optionSearchList('locId', apiUrl + "/base/basStorage/getAllStorage/3", '', 'tmBasStorageId', 'storageNo', 'name');
}

//新增仓库业务的工厂、车间、承运商的查询
function baseDataSel(){
	$("#plantId").html("<option value = ''></option>");
	$("#workshopId").html("<option value = ''></option>");
	$("#dunitId").html("<option value = ''></option>");
	searchList('plantId', apiUrl +'/base/basStorage/queryPlantSelect', '', 'tmBasPlantId', 'plant');
	searchList('dunitId', apiUrl +'/base/basStorage/queryDunitSelect', '', 'tmBasDunitId', 'dunit');   
	
    $("#plantId").change(function(){
    	var plant = $('#plantId option:selected').val();
    	//判断省份这个下拉框选中的值是否为空
    	if (plant == "") {
        	return;
    	}
        searchList('workshopId', apiUrl +'/base/basStorage/queryWorkshopSelect', {"pTmBasPlantId" : plant}, 'tmBasWorkshopId', 'workshop');
    })
}

//打开新增仓库窗口
function openAddStorageWin(title,w,h){
    $('#storageNo').attr("disabled",false); 
	$('#addOrEditS').html("新增仓库"); 
	clearForm($('#addStorageModal'));
	$('#formStorage').data('bootstrapValidator').resetForm();
	hideMenu();
	$('#addStorageModal').modal("show");
	mod_flag=0;
	$('#addOrEditType').val("");
	

	baseDataSel();
    
    $('#statusA').val(1);
	if (!$("#statusA").bootstrapSwitch('state')) {
        $("#statusA").bootstrapSwitch('toggleState');
	}
}

//打开新增窗口
function openAddWin(title,w,h){
	var rows = $("#tb_basStorage").bootstrapTable("getSelections");
    if (rows.length < 1) {
	      layer.msg("请选择一条数据！");
        return;
    }
    if (rows.length > 1) {
          layer.msg("只能选择一条数据！")
        return;
    }
    $('#addOrEditType').val("");
    
    var row = rows[0];
    if (row.type == '1'){
    	$('#storageNameA').attr("disabled",true); 
    	$('#areaNo').attr("disabled",false); 
		$('#addOrEdit').html("新增库区"); 
    	$('#arealevelAdd').show();
    	$('#loclevelAdd').hide();
    	$('#formArea').data('bootstrapValidator').resetForm();
		clearForm($('#addModal'));
		hideMenu();
		$('#addModal').modal("show");
		mod_flag=0;
		
		$('#storageNameA').val(row.storageNo + "-" + row.name);
	    $('#areaParentId').val(row.tmBasStorageId);
	    $('#areaStorageType').val(row.storageType);
	    $('#addOrEditType').val("2");
		$('#statusAreaA').val(1);
		if (!$("#statusAreaA").bootstrapSwitch('state')) {
	        $("#statusAreaA").bootstrapSwitch('toggleState');
		}
    } else if (row.type == '2') {
    	$('#storageNameL').attr("disabled",true); 
    	$('#areaNameL').attr("disabled",true); 
    	$('#locNo').attr("disabled",false); 
    	$('#addOrEdit').html("新增库位"); 
    	
    	searchList('dockId', apiUrl +'/base/basStorage/queryDockSelect', '', 'tmBasDockId', 'dock');
		$.ajax({  
	        type: 'POST',
	        url:apiUrl + "/base/basStorage/findById/" + row.parentId,  
	        dataType: 'json',
	        contentType: "application/json",
	        beforeSend: function(request) {
	        	request.setRequestHeader("token", sessionStorage.token);
	        },
	        success: function (data) {
	            if(data != null){
	                $('#storageNameL').val(data.storageNo + "-" +data.name);
	            }	        	
	        }
		}); 
		
		$('#loclevelAdd').show();
    	$('#arealevelAdd').hide();
		clearForm($('#addModal'));
		$('#formLoc').data('bootstrapValidator').resetForm();
		hideMenu();
		$('#addModal').modal("show");
		mod_flag=0;	
		
		$('#areaNameL').val(row.storageNo + "-" + row.name);
	    $('#locParentId').val(row.tmBasStorageId);
	    $('#locStorageType').val(row.storageType);
	    $('#addOrEditType').val("3");
	    $('#statusLocA').val(1);
		if (!$("#statusLocA").bootstrapSwitch('state')) {
	        $("#statusLocA").bootstrapSwitch('toggleState');
		}
    } else {
    	layer.msg("无法为库位新增数据！");
        return;
    }

}

//打开编辑窗口
function openEditWin (title,id,w,h) {
	var rows = $("#tb_basStorage").bootstrapTable("getSelections");
    if (rows.length < 1) {
    	layer.msg("没有选择数据！");
        return;
    }
    if (rows.length > 1) {
    	layer.msg("只能选择一条数据编辑！");
        return;
    }
    mod_flag=1;
    $('#addOrEditType').val("");
    
    if (rows[0].type == "1") {
    	$('#storageNo').attr("disabled",true); 
		$('#addOrEditS').html("编辑仓库"); 
		$('#formStorage').data('bootstrapValidator').resetForm();
		baseDataSel();
		
		$('#storageNo').val(rows[0].storageNo);
		$('#name').val(rows[0].name);
		$('#plantId option:selected').val(rows[0].tmBasPlantId);
		$('#workshopId option:selected').val(rows[0].tmBasWorkshopId);
		$('#dunitId option:selected').val(rows[0].tmBasDunitId);
		$('#plantId option:selected').html(rows[0].plant);
		$('#workshopId option:selected').html(rows[0].workshop);
		$('#dunitId option:selected').html(rows[0].dunit);
		$('#storageType').val(rows[0].storageType);
		$('#sapNo').val(rows[0].sapNo);
		$('#contact').val(rows[0].contact);
		$('#addr').val(rows[0].addr);
		$('#telNo').val(rows[0].telNo);
		$('#mobileNo').val(rows[0].mobileNo);
		$('#remarkS').val(rows[0].remark);
		$('#storageIdForS').val(rows[0].tmBasStorageId);
	    if (rows[0].enabled == "1"){
    		$('#statusA').val(1);
    		if (!$("#statusA").bootstrapSwitch('state')) {
                $("#statusA").bootstrapSwitch('toggleState');
            }
    	} else {
    		$('#statusA').val(0);
    		if ($("#statusA").bootstrapSwitch('state')) {
                $("#statusA").bootstrapSwitch('toggleState');
            }
    	}
		
    	$('#addStorageModal').modal("show");
    }else if (rows[0].type == "2") {
    	$('#arealevelAdd').show();
    	$('#loclevelAdd').hide();
    	$('#storageNameA').attr("disabled",true); 
    	$('#areaNo').attr("disabled",true); 
		$('#addOrEdit').html("编辑库区"); 
		$('#formArea').data('bootstrapValidator').resetForm();
		
		$.ajax({  
	        type: 'POST',
	        url:apiUrl + "/base/basStorage/findById/" + rows[0].parentId,  
	        dataType: 'json',
	        contentType: "application/json",
	        beforeSend: function(request) {
	        	request.setRequestHeader("token", sessionStorage.token);
	        },
	        success: function (data) {
	            if(data != null){
	                $('#storageNameA').val(data.storageNo + "-" + data.name);
	            }	        	
	        }
		}); 

		$('#areaNo').val(rows[0].storageNo);
		$('#areaName').val(rows[0].name);		
		$('#remark').val(rows[0].remark);
//		$('#statusAreaA').val(rows[0].enabled);
		$('#areaParentId').val(rows[0].parentId);
	    $('#basStorageIdA').val(rows[0].tmBasStorageId);
	    $('#areaStorageType').val(rows[0].storageType);
	    $('#addOrEditType').val("2");
	   	if (rows[0].enabled == "1"){
    		$('#statusAreaA').val(1);
    		if (!$("#statusAreaA").bootstrapSwitch('state')) {
                $("#statusAreaA").bootstrapSwitch('toggleState');
            }
    	} else {
    		$('#statusAreaA').val(0);
    		if ($("#statusAreaA").bootstrapSwitch('state')) {
                $("#statusAreaA").bootstrapSwitch('toggleState');
            }
    	}
    	$('#addModal').modal("show");    	
    }else if (rows[0].type == "3") {
    	$('#loclevelAdd').show();
    	$('#arealevelAdd').hide();
    	$('#storageNameL').attr("disabled",true); 
    	$('#areaNameL').attr("disabled",true); 
    	$('#locNo').attr("disabled",true); 
    	$('#addOrEdit').html("编辑库位"); 
    	$('#formLoc').data('bootstrapValidator').resetForm();
    	searchList('dockId', apiUrl +'/base/basStorage/queryDockSelect', '', 'tmBasDockId', 'dock');   
		$('#dockId option:selected').val(rows[0].tmBasDockId);
		$('#dockId option:selected').html(rows[0].dock);
		
    	$.ajax({  
	        type: 'POST',
	        url:apiUrl + "/base/basStorage/findById/" + rows[0].parentId,  
	        dataType: 'json',
	        contentType: "application/json",
	        beforeSend: function(request) {
	        	request.setRequestHeader("token", sessionStorage.token);
	        },
	        success: function (data) {
	            if(data != null){
	                $('#areaNameL').val(data.storageNo + "-" + data.name);
	            }	        	
	        }
		}); 
		
		$.ajax({  
	        type: 'POST',
	        url:apiUrl + "/base/basStorage/findGrandById/" + rows[0].parentId,  
	        dataType: 'json',
	        contentType: "application/json",
	        beforeSend: function(request) {
	        	request.setRequestHeader("token", sessionStorage.token);
	        },
	        success: function (data) {
	            if(data != null){
	                $('#storageNameL').val(data.storageNo + "-" + data.name);
	            }	        	
	        }
		});
    	
    	$('#locNo').val(rows[0].storageNo);
		$('#locName').val(rows[0].name);		
		$('#length').val(rows[0].length);
		$('#width').val(rows[0].width);
		$('#hight').val(rows[0].hight);
//		$('#statusLocA').val(rows[0].enabled);
		$('#locStorageType').val(rows[0].storageType);
		$('#locParentId').val(rows[0].parentId);
	    $('#basStorageIdL').val(rows[0].tmBasStorageId);
	    $('#addOrEditType').val("3");
		if (rows[0].enabled == "1"){
    		$('#statusLocA').val(1);
    		if (!$("#statusLocA").bootstrapSwitch('state')) {
                $("#statusLocA").bootstrapSwitch('toggleState');
            }
    	} else {
    		$('#statusLocA').val(0);
    		if ($("#statusLocA").bootstrapSwitch('state')) {
                $("#statusLocA").bootstrapSwitch('toggleState');
            }
    	}
    	$('#addModal').modal("show"); 
    }
}

//保存信息
function saveInfo(type){
	if ($('#addOrEditType').val() != null && $('#addOrEditType').val() != "") {
		type = $('#addOrEditType').val();
	}

	if (type == 1) {
		$('#formStorage').data('bootstrapValidator').validate();  
	    if(!$('#formStorage').data('bootstrapValidator').isValid()){  
	        return ;  
	    }
		var data=$('#formStorage').serializeObject();
		data.enabled = $('#statusA').val();
		data.storageNo = $('#storageNo').val();
		data.tmBasPlantId = $('#plantId option:selected').val();
		data.tmBasWorkshopId = $('#workshopId option:selected').val();
		data.tmBasDunitId = $('#dunitId option:selected').val();
	} else if (type == 2) {
		$('#formArea').data('bootstrapValidator').validate();  
	    if(!$('#formArea').data('bootstrapValidator').isValid()){  
	        return ;  
	    }
		var data=$('#formArea').serializeObject();
		data.enabled = $('#statusAreaA').val();
	} else if (type == 3) {
		$('#formLoc').data('bootstrapValidator').validate();  
	    if(!$('#formLoc').data('bootstrapValidator').isValid()){  
	        return ;  
	    }
		var data=$('#formLoc').serializeObject();
		data.enabled = $('#statusLocA').val();
	}
	
	data=JSON.stringify(data);
	if (mod_flag == 0){
		url = apiUrl + "/base/basStorage/add";
	} else {
		url = apiUrl + "/base/basStorage/update";
	}
	
	$.ajax({
        type: 'POST',
        url: url,
        data: data,
        dataType: 'json',
        contentType: "application/json",
        beforeSend: function(request) {
        	request.setRequestHeader("token", sessionStorage.token);
        },
        success: function (data, textStatus, jqXHR) {
        	var errcode = data.code;//在此做了错误代码的判断
    	    if(errcode != 10000){
    	    	layer.msg(data.message);
    	        return;
    	    }
    	    if (type == 1) {
	        	$("#addStorageModal").on("hidden.bs.modal", function() {
	        		$(this).removeData("bs.modal");
	        		clearForm($('#addStorageModal'));
	        	});
	        	$('#addStorageModal').modal('hide');    	    	
    	    } else if (type == 2 || type == 3) {
	        	$("#addModal").on("hidden.bs.modal", function() {
	        		$(this).removeData("bs.modal");
	        		clearForm($('#addModal'));
	        	});
	        	$('#addModal').modal('hide');    	    	
    	    }

        	$('#tb_basStorage').bootstrapTable("refresh");
            layer.msg('保存成功!',{icon:1,time:1000});
        }
    });		

}

//删除
function deleteInfo(){
	var rows = $("#tb_basStorage").bootstrapTable("getSelections");
    if (rows.length < 1) {
    	layer.msg("没有选择数据！");
        return;
    }
    
    layer.confirm('是否确认删除所选数据？', {
  	    btn: ['删除','取消'], //按钮
  		title: "提示",
  	    shade: false //不显示遮罩
  	}, function(index){

      var sid = [];
      for(var i = 0;i < rows.length; i++) {
            sid[i] = rows[i].tmBasStorageId + "|" + rows[i].type;
      }

      data = JSON.stringify(sid);
      $.ajax({
                type: 'POST',
                url: apiUrl +'/base/basStorage/batchDelete',
                data: data,
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

                      $('#tb_basStorage').bootstrapTable('refresh');
                  }

                }
            });
  	    layer.close(index);
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

function hideMenu() {
    $("#menuContent").fadeOut("fast");
    $(".modal-body").unbind("mousedown", onBodyDown);
}

function onBodyDown(event) {
    if (!(event.target.id == "menuBtn" || event.target.id == "ParentMenu" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
        hideMenu();
    }
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
	
	function optionSearchList(listId,url,where,keyId,no,name){
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
	                $("#" + listId).append("<option value="+ row[keyId]+">" + row[no] + "-"+ row[name] + "</option>");  
	            });  
	        }
	    });  
	}	
