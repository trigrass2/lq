$(function (){
	 
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
    
    layui.use(['laydate','element','laypage','layer'], function(){
      $ = layui.jquery;//jquery
      laydate = layui.laydate;//日期插件
      lement = layui.element();//面包导航
      laypage = layui.laypage;//分页
      layer = layui.layer;//弹出层
    });
    
});
    //当点击查询按钮的时候执行
	//  $("#btn_query").bind("click", initTable);
	
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
	        beforeSend: function(request) {
	        	request.setRequestHeader("token", sessionStorage.token);
	        },
	        success: function (data) {
	        	$("#" + listId).empty();
	        	$("#" + listId).append("<option value=''>请选择</option>");
	            $.each(data.results, function (index, row) {  
	                $("#" + listId).append("<option value="+ row[keyId]+">" + row[name] + "</option>");  
	            });  
	        }
	    });  
	}
	
	//查询工厂列表
	searchList('tmBasPlantId', apiUrl + "/base/plant/queryPlantSelect", '', 'tmBasPlantId', 'plant');
	//searchList('storageId', apiUrl + "/base/basStorage/getAllStorage", '', 'tmBasStorageId', 'name');
	


var mod_flag=0;

//定义表格
var TableInit = function () {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#tb_basbom').bootstrapTable({
            url: apiUrl + "/base/bom/queryAllBomTree",         //请求后台的URL（*）
            method: 'post',                      //请求方式（*）
            toolbar: "#toolbar",
            treeView: true,
            treeId: "tmBasPartId",
            treeField: "part",
            treeRootLevel: 1,
            dataField: "data",					//这是返回的json数组的key.默认好像是"rows".这里只有前后端约定好就行
//          height: $(window).height(),
            height: 400,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            idField: "tmBasPartId",
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
                field: 'part',
                title: '物料'
            }, {
                field: 'plant',
                title: '工厂'
            }, {
                field: 'bomVersion',
                title: 'BOM版本'
            }, {
                field: 'uloc',
                title: '工位'
            }, {
                field: 'qty',
                title: '工位用量'
            }, {
                field: 'unit',
                title: '单位'
            }, {
                field: 'rate',
                title: '损耗率'
            }, {
                field: 'remark',
                title: '备注'
            }
            ]
        });
    };
    
    //得到查询的参数
    oTableInit.queryParams = function (params) {
        var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
        	pageSize: params.limit,   //页面大小
            pageIndex: params.offset,  //页码
            tmBasPlantId: $("#tmBasPlantId").val(),  
            partNameOrNo: $("#partNameOrNo").val(),     
            bomVersion: $("#bomVersion").val()       
        };
        return temp;
    };
    return oTableInit;
};

function queryInfo(){
	$('#tb_basbom').bootstrapTable("refresh");
}

function clearInfo(){
	$("#tmBasPlantId").val("");

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