//----------------------------------pageinit页面初始化  start-----------------------------------------
//初始化
$(function () {
     layui.use(['laydate','element','laypage','layer'], function(){
        $ = layui.jquery;//jquery
      laydate = layui.laydate;//日期插件
      lement = layui.element();//面包导航
      laypage = layui.laypage;//分页
      layer = layui.layer;//弹出层
    });


	getDictionary('testunit','pBaseUnit');//标准单位
	getDictionary('BOM_TYPE','bomType');//BOM类型
	getDictionary('BOM_STATUS','bomStatus');//BOM状态
	
	plantSelect();
//---------------Table -----------------
//表格初始化

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
//----------------------------------pageinit页面初始化  end-----------------------------------------

var mod_flag = 0;     //新增、修改的标志    0：新增  1：修改
//定义表格
var TableInit = function () {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
	    initTbType();
	};
	return oTableInit;
}

//查询按钮调用事件
function initTable(){
    $('#tb_bomSearch').bootstrapTable('refresh');
}


//---------------table表格展示----------------
function initTbType(){
	 $('#tb_bomSearch').bootstrapTable({
         url: apiUrl +'/base/bomSearch/querylistByPage',         //请求后台的URL（*）
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
                pageIndex : params.offset/params.limit + 1, //当前页面,默认是上面设置的1(pageNumber)
                level : $('#level option:selected').val() == '' ? null : $('#level option:selected').val(),
                plantId :  $('#plantId option:selected').val() == '' ? null : $('#plantId option:selected').val(),
                partId :  $("#partId").val() == '' ? null : $("#partId").val(),
                version :  $("#bomVersion").val() == '' ? null : $("#bomVersion").val(),
                pPartId :  $("#pPartId").val() == '' ? null : $("#pPartId").val(),
                pUlocId :  $("#ulocId").val() == '' ? null : $("#ulocId").val()
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
         height: 400,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
         uniqueId:"bomId",        //每一行的唯一标识，一般为主键列
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
             field: 'level',
             title: '层级'
         }, {
             field: 'plant',
             title: '工厂'
         },{
             field: 'part',
             title: '产品'
         },{
             field: 'bomVersion',
             title: '版本'
         }, {
             field: 'bomType',
             title: '类型',
	        formatter: function (value, row, index) {
	         	var i = $('#bomType')[0].options.length;  
	     	    while (i--) {  
	     	        if ($('#bomType')[0].options[i].value == value) {  
	     	        	return  $('#bomType')[0].options[i].text;
	     	        }  
	     	    }       
	    	}            
         }, {
             field: 'bomStatus',
             title: '维护状态',
	        formatter: function (value, row, index) {
	         	var i = $('#bomStatus')[0].options.length;  
	     	    while (i--) {  
	     	        if ($('#bomStatus')[0].options[i].value == value) {  
	     	        	return  $('#bomStatus')[0].options[i].text;
	     	        }  
	     	    }       
	    	}
         }, {
             field: 'bomStartdate',
             title: 'BOM生效日期'
         }, {
             field: 'bomEnddate',
             title: 'BOM失效日期'
         }, {
             field: 'remark',
             title: '备注'
         }, {
             field: 'pType',
             title: '物料类型'
         }, {
             field: 'uloc',
             title: '工位'
         }, {
             field: 'pPart',
             title: '物料'
         }, {
             field: 'pQty',
             title: '工位用量'
         }, {
             field: 'pBaseUnit',
             title: '单位',
	        formatter: function (value, row, index) {
	         	var i = $('#baseUnit')[0].options.length;  
	     	    while (i--) {  
	     	        if ($('#baseUnit')[0].options[i].value == value) {  
	     	        	return  $('#baseUnit')[0].options[i].text;
	     	        }  
	     	    }       
	    	}
         }, {
             field: 'pBomVersion',
             title: '物料BOM版本'
         }, {
             field: 'pRate',
             title: '损耗率%'
         }, {
             field: 'pStartdate',
             title: '物料生效日期'
         }, {
             field: 'pEnddate',
             title: '物料失效日期'
         }, {
             field: 'pRemark',
             title: '明细备注'
         }
        ]
     });
}



//------------------clear公共清空验证-------------------
function clearForm(form) {
//input清空
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


/*添加清空*/
function addNew(){
	mod_flag = 0;
	$('#formAddEdit').data('bootstrapValidator').resetForm();
	clearForm($('#formAddEdit'));
	$('#enabledM').val(1);
	if (!$("#enabledM").bootstrapSwitch('state')) {
        $("#enabledM").bootstrapSwitch('toggleState');
	}

	$('#modalAddEditLabel').html("新增");
//	$('#modalAddEdit').modal("show");
}

/*编辑*/
function edit() {
	mod_flag = 1;
	$('#formAddEdit').data('bootstrapValidator').resetForm();
	var rows = $("#tb_dock").bootstrapTable("getSelections");
	if (rows.length < 1) {
		layer.msg("请选择要修改的数据！");
		return;
    }
    if (rows.length > 1) {
		layer.msg("只能选择一条数据！")
        return;
    }
    var row = rows[0];
    
//  $('#plantU option:selected').html(row.plant);
	$('#tmBasDockIdM').val(row.tmBasDockId);
    $('#dockNoM').val(row.dockNo);
    $('#nameM').val(row.name);
    $('#addrM').val(row.addr);
    $('#contactM').val(row.contact);
    $('#telNoM').val(row.telNo);
    $('#mobileNoM').val(row.mobileNo);
    $('#faxNoM').val(row.faxNo);
    $('#emailM').val(row.email);
    $('#remarkM').val(row.remark);

    if (row.enabled=="1"){
    	$('#enabledM').val(1);
    	if (!$("#enabledM").bootstrapSwitch('state')) {
            $("#enabledM").bootstrapSwitch('toggleState');
        }
    } else {
    	$('#enabledM').val(0);
    	if ($("#enabledM").bootstrapSwitch('state')) {
            $("#enabledM").bootstrapSwitch('toggleState');
        }
    }
    $('#modalAddEditLabel').html("编辑");
    $('#modalAddEdit').modal("show");
}


function save(){
	$('#formAddEdit').data('bootstrapValidator').validate();
    if(!$('#formAddEdit').data('bootstrapValidator').isValid()){
        return ;
    }

//var tmBasPlantId = $('#plantA option:selected').val();
	var tmBasDockId = $('#tmBasDockIdM').val();
	var dockNo =  $('#dockNoM').val();
	var name =  $('#nameM').val();
	var addr =  $('#addrM').val();
	var contact =  $('#contactM').val();
	var telNo =  $('#telNoM').val();
	var mobileNo =  $('#mobileNoM').val();
	var faxNo =  $('#faxNoM').val();
	var email =  $('#emailM').val();
	var remark =  $('#remarkM').val();
	var enabled = $('#enabledM').val();

	var datas= {
		tmBasDockId : tmBasDockId,
		dockNo: dockNo,
        name: name,
        addr: addr,
        contact: contact,
        telNo: telNo,
        mobileNo: mobileNo,
        faxNo: faxNo,
        email: email,
        remark: remark,
        enabled: enabled
    };

	datas = JSON.stringify(datas);
	if (mod_flag == 0){
		url = apiUrl + "/base/basDock/add";
	} else {
		url = apiUrl + "/base/basDock/update";
	}
	
	$.ajax({
		type: 'POST',
        url: url,
        data: datas,
        contentType: "application/json",
        dataType: 'JSON',
        success: function (data) {
	        var errcode = data.code;//在此做了错误代码的判断
	        if(errcode != 10000){
	            layer.msg(data.message);
	            return;
	        }
	
	        if(data.results){
	            layer.msg(data.message);
	            $('#modalAddEdit').modal("hide");
	            $('#tb_dock').bootstrapTable('refresh');
	
	            $('#formAddEdit').data('bootstrapValidator').resetForm();
	            clearForm($('#formAddEdit'));
	        }
	    }
    });
}


function batchDelete(){
	var rows = $("#tb_dock").bootstrapTable("getSelections");
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
            sid[i] = rows[i].tmBasDockId;
      }

      datas = JSON.stringify(sid);
      $.ajax({
                type: 'POST',
                url: apiUrl +'/base/basDock/batchDelete',
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
                      $('#tb_dock').bootstrapTable('refresh');
                  }
                }
            });
  	    layer.close(index);
  	});

}

/*导入清空*/
function importInfo(){
	$('#postForm')[0].reset();
}


function panelDownload(){
   window.top.location.href= apiUrl +'/base/basDock/download';
}

function importFile(){
  $.ajax({
      url:  apiUrl +'/base/basDock/import',
      type: 'POST',
      cache: false,
      data: new FormData($('#postForm')[0]),
       async: false,
       cache: false,
       contentType: false,
       processData: false,

       success:function (data) {
          layer.msg(data.message);
          if(data.message=='导入成功！'){
            $('#modalImport').modal("hide");
            $('#tb_Type').bootstrapTable('refresh');
          }

       }
  });
  return false;
}

function exportFile(){
  var tmBasPlantId = $('#selectpickersA option:selected').val();
  var lineNo = $('#lineNoL').val();
  var nameCn = $('#nameCnL').val();

   window.top.location.href= apiUrl +'/base/basDock/export?tmBasPlantId='+tmBasPlantId+'&lineNo='+lineNo+'&nameCn='+nameCn;
}

/*工厂*/
function plantSelect() {
    //清空下拉数据
    $("#plantId").html("");
    var str = "<option></option>";
    $.ajax({
        url:  apiUrl +'/base/plant/queryPlantSelect',
        type: "POST",
        data: { "parentiD": "" },
        dataType: "JSON",
        async: false,
        success: function (data) {
            //从服务器获取数据进行绑定
            $.each(data.results, function (i, item) {
                str += "<option value=" + item.tmBasPlantId + ">" + item.plant + "</option>";
            })
            //将数据添加到省份这个下拉框里面
            $("#plantId").append(str);
        },
        error: function () { alert("Error"); }
    });
}

