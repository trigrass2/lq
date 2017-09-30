//全局变量API服务URL
//  var apiUrl = 'http://127.0.0.1:8088/ewap-auth';
 var apiUrl = 'http://127.0.0.1:8088/ewap-auth';// 测试环境
 //var apiUrl = 'http://10.16.1.23:8088/ewap-auth';
$(function(){
	var pathName=window.document.location.pathname;
//	alert(pathName);
	if(pathName.indexOf("Login.html") < 1){
		var token = sessionStorage.getItem('token');
		if(token ==undefined ||token == '' || token == null){
			var rootPath = getRootPath();
			window.location.href= "../../src/Account/Login.html";
		}
	}

	layui.use(['laydate','element','laypage','layer'], function(){
      layer = layui.layer;//弹出层
    });

    var index = pathName.lastIndexOf("/");
  	var pageName = pathName.substring(index + 1);
  	$('.btn').attr("disabled", false);
  	$.ajax({
          type: 'POST',
          url: apiUrl + "/system/user/getBtn",
          data: pageName,
          dataType: 'json',
          contentType: "application/json",
          success: function (data, textStatus, jqXHR) {
          	var errcode = data.code;//在此做了错误代码的判断
      	    if(errcode != 10000){
//    	    	layer.msg(data.message);
      	        return;
      	    }
      	    all_btn=data.results;
      	    data.results.forEach(function(btn){
      	    	if(btn){
      	    		$('#' + btn.url).attr("disabled", false);
      	    	}
      	    });
          }
      });
});

//获取项目根路径
function getRootPath(){
    //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
    var curWwwPath=window.document.location.href;
    //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
    var pathName=window.document.location.pathname;
    var pos=curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8083
    var localhostPaht=curWwwPath.substring(0,pos);
    //获取带"/"的项目名，如：/uimcardprj
    var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
    return(localhostPaht+projectName);
}

// 各页面查询右侧的下拉、收缩功能
function closeBtn() {
    $('#formSearch').slideUp(400);
    $('.closeBtn').css('display','none');
    $('.openBtn').css('display','block');
}
function openBtn() {
    $('#formSearch').slideDown(400);
    $('.openBtn').css('display','none');
    $('.closeBtn').css('display','block');
}


//获取数据字典下拉列表
function getDictionary(type,sel) {
	var sel = $('#'+sel);
	$.ajax({
        type: 'POST',
        contentType: "application/json; charset=gbk",
        dataType: 'json',
        async: false,
        url:  apiUrl+'/system/codeList/getSelect',
        data: type,
        success: function (res) {
        	sel.empty();
        	sel.append("<option value=''></option>");//默认值
        	for(var i=0; i<res.results.length; i++){
        		sel.append("<option value='"+res.results[i].no +"'>"+res.results[i].name +"</option>");
        	}
        }
    });
}

//多个表单加载同一个数据字典
function getDictionary(type,sel,form) {
	var sel = $('#'+sel,form);
	$.ajax({
        type: 'POST',
        contentType: "application/json; charset=gbk",
        dataType: 'json',
        async: false,
        url:  apiUrl+'/system/codeList/getSelect',
        data: type,
        success: function (res) {
        	sel.empty();
        	sel.append("<option value=''></option>");//默认值
        	for(var i=0; i<res.results.length; i++){
        		sel.append("<option value='"+res.results[i].no +"'>"+res.results[i].name +"</option>");
        	}
        }
    });
}

//获取当前日期
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

/*定义日期控件（开始日期和结束日期）*/
function layuiDateCombos(startDateId,endDateId){
	    var start = {
				istime : true,
				istoday : false,
				choose : function(datas) {			
			        var startVal = document.getElementById(startDateId).value;
		            var endVal = document.getElementById(endDateId).value;
				    if(startVal != '' && endVal != '' && startVal > endVal){
		                layer.msg('开始日期不能大于结束日期', {icon:7});
		                document.getElementById(startDateId).value = '';
		             }    
					end.min = datas; // 开始日选好后，重置结束日的最小日期
					end.start = datas // 将结束日的初始值设定为开始日	
				},clear : function(){
					end.min = null;
					end.start = null;
				}
			};
			var end = {
				istime : true,
				istoday : false,
				choose : function(datas) {
	                var startVal = document.getElementById(startDateId).value;
	                var endVal = document.getElementById(endDateId).value;     
					if(startVal != '' && endVal != '' && startVal > endVal){
	                    layer.msg('开始日期不能大于结束日期', {icon:7});
	                    document.getElementById(endDateId).value = '';
	                }       
					start.max = datas; // 结束日选好后，重置开始日的最大日期
				},clear : function(){
					start.max = null;
				}
			};
			document.getElementById(startDateId).onchange = function() {
				if (this.value == '') {
					end.min = null;
					end.start = null;
				} 
			}
			document.getElementById(endDateId).onchange = function() {
				if (this.value == '') {
					start.max = null;
				}
			}
            document.getElementById(startDateId).onclick = function() {
            	var startVal = document.getElementById(startDateId).value;
                start.elem = this;
                laydate(start);
                if(startVal == ''){
                    document.getElementById(startDateId).value = '';
                }
            }
            document.getElementById(endDateId).onclick = function() {
                var endVal = document.getElementById(endDateId).value;
                end.elem = this;
                laydate(end);
                if(endVal == ''){
                    document.getElementById(endDateId).value = '';
                }
            }
}

/*批量删除 */
function deleteBatch(url,ids,func){
    layer.confirm('是否确认删除？', {
        btn: ['删除','取消'], //按钮
        title: "提示",
        shade: false, //不显示遮罩
        icon:7,
        area: ['287px'],
        btnAlign: 'c'
    }, function(index){
        $.ajax({
            type: 'POST',
            contentType: "application/json; charset=gbk",
            dataType: 'json',
            async: false,
            url:  url,
            data: JSON.stringify(ids),
            success: function (text) {
               	if(text.code == '10000'){
            		layer.msg(text.message,{icon:1,time:1000});
            	}else{
            		layer.msg(text.message,{icon:2});
            	}
                func();
            }
        });
        layer.close(index);
    });
}

/*批量操作 */
function operationBatch(url,ids,func){
    layer.confirm('是否确认操作？', {
        btn: ['确认','取消'], //按钮
        title: "提示",
        shade: false, //不显示遮罩
        icon:7,
        area: ['287px'],
        btnAlign: 'c'
    }, function(index){
        $.ajax({
            type: 'POST',
            contentType: "application/json; charset=gbk",
            dataType: 'json',
            async: false,
            url:  url,
            data: JSON.stringify(ids),
            success: function (text) {
            	if(text.code == '10000'){
            		layer.msg(text.message,{icon:1,time:1000});
            	}else{
            		layer.msg(text.message,{icon:2});
            	}
                func();
            }
        });
        layer.close(index);
    });
}



/*保存 */
function save(url,datas,id,func){
	$.ajax({
        type: 'POST',
        url: url,
        data: datas,
        contentType:"application/json",
        dataType: 'JSON',
        success: function (data) {
        	var errcode = data.code;//在此做了错误代码的判断
     	    if(errcode != 10000){
     	    	layer.msg(data.message,{icon:2});
     	        return;
     	    }
        	$('#'+id).modal('hide');
        	func();
            layer.msg('保存成功!',{icon:1,time:1000});
        }
    });
}

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

$.fn.serializeObject = function()
{
   var o = {};
   var a = this.ewin_serializeArray();
   $.each(a, function() {
       if (o[this.name]) {
           if (!o[this.name].push) {
               o[this.name] = [o[this.name]];
           }
           o[this.name].push(this.value || null);
       } else {
           o[this.name] = this.value || null;
       }
   });
   return o;
};

/*初始化表格*/
function initbstable(url,datas,tableid,uniqueId,toolbar,onClickRow,columns,sortName,sortOrder,conditionObj){
   if(onClickRow == null){
	   onClickRow = onClickRowEvent;
   }
    var cTSelect=true;
    if(conditionObj && conditionObj != undefined){
        cTSelect=conditionObj.cTSelect;
    }
   var table = $('#'+tableid).bootstrapTable({
         url: url,         //请求后台的URL（*）
         method: 'post',                      //请求方式（*）
         toolbar: '#'+toolbar,                //工具按钮用哪个容器
         striped: true,                      //是否显示行间隔色
         cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
         pagination: true,                   //是否显示分页（*）
         sortable: true,                     //是否启用排序
         sortOrder: sortOrder,                   //排序方式
         sortName: sortName,                 //排序字段
         queryParams:function queryParams(params) {   //设置查询参数
       		var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                     pageSize: params.limit,   //页面大小
                     offset: params.offset,  //页码
                     pageIndex : params.offset/params.limit+1,
                     keyword:params.search,//搜索
                     sortOrder: params.order,//排序
                     sortName: params.sort//排序字段
              };
       		temp = addParams(datas,temp);
            return temp;
         },
         onClickRow:onClickRow,
         dataField: "data",					//这是返回的json数组的key.默认好像是"rows".这里只有前后端约定好就行
         sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
         pageNumber:1,                       //初始化加载第一页，默认第一页
         pageSize: 10,                       //每页的记录行数（*）
         pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
         search: true,                       //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
         strictSearch: false,
         showColumns: false,                  //是否显示所有的列
         showRefresh: false,                  //是否显示刷新按钮
         minimumCountColumns: 2,             //最少允许的列数
         clickToSelect: cTSelect,                //是否启用点击选中行
         uniqueId: uniqueId,        //每一行的唯一标识，一般为主键列
         showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
         cardView: false,                    //是否显示详细视图
         detailView: false,                   //是否显示父子表
		 responseHandler:responseHandler,
		 height: 480,
         columns: columns,
         onLoadSuccess: function (data) {
             showBox("#"+tableid+" > tbody td","#showbox");
             return false;
         }
     });
   return table;
}

// 判断字数有多少个，超过100个字用...代替
function operateOpinionFormatter(value,row,index) {
    if(value.length > 20){
        return "<span title='"+ value+ "'>" + value.substring(0,20) + "..." + "</span>";
    } else {
        return "<span title='"+ value +"'>" + value.substring(0,value.length) + "</span>";
    }
}

// 鼠标经过显示表格单元内容
// function formatTableUnit(value,row,index) {
//     console.log(0);
//     return {
//         css:{
//             "overflow":'hidden',
//             'text-overflow':'ellipsis',
//             'white-space':'nowrap'
//         }
//     }
// }

function onClickRowEvent(){

}

function showBox(obj,box){
    var timer = null;
    $(obj).on("mouseover", function (e) {
        clearTimeout(timer);
        var clientX = e.clientX;
        var clientY = e.clientY;
        var txt = $(this).text();
        timer = setTimeout(function () {
            $(box).css("left", clientX).css("top", clientY);
            if (txt == "") {
                $(box).hide();
            } else {
                $(box).show();
                $(box).html(txt);
            }
        }, 1000);
    });
    $(obj).on("mouseout",function(){
        clearTimeout(timer);
        $(box).hide();
    });
}

function addParams(p, c) {
	var n = {};
	for ( var i in p) {
		n[i] = p[i];
	}
	for ( var k in c) {
		n[k] = c[k];
	}
	return n;
}


function responseHandler(res){
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
}

function setFormValue(el,data){
	 for (var p in data){
		$('#'+p,el).val(data[p]);
	 }
}

function setFormValueChk(el,data){
	for (var p in data){
		if($('#'+p,el).attr('type')=='checkbox'){
			if(data[p]==1 || data[p]=='1'){
				$('#'+p).prop('checked',true);
			}else{
				$('#'+p).prop('checked',false);
			}
		}else{
			$('#'+p,el).val(data[p]);
		}
	}
}

function clearControl(){
	for( var i = 0; i < arguments.length; i++ ){
		$('#'+arguments[i]).val('');
    }
}

function clearObjAttr(){
	var data = arguments[0];
	for( var i = 1; i < arguments.length; i++ ){
		data[arguments[i]]=null;
    }
}

//根据日期返回星期
function DayToWeek(day){
	var array= new Array();
	array=day.split('-');     //日期为输入日期，格式为 2013-3-10
    var date=new Date(array[0],parseInt(array[1]-1),array[2]);
    var weekArray = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
    var week = weekArray[date.getDay()];
    return week;
}

//下拉框
function dorpList(listId,url,where,id,name,value){
	if(where && where != null){
		data=JSON.stringify(where);
	}
	if(!id){
		id='id';
	}
	if(!name){
		name='name';
	}
	$.ajax({
		type: "POST",
		url: url,
        data: data,
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
        	$("#" + listId).empty();
        	$("#" + listId).append("<option value=''></option>");
            $.each(data.results, function (index, row) {
                $("#" + listId).append("<option value="+row[id]+">" + row[name] + "</option>");
            });
            if(value){
            	$("#" + listId).val(value);
            }
        }
    });
}

//时间比较
function diff_time(start, end ,msg) {
    var arr_start = start.split(":");
    var arr_end = end.split(":");
    if(start==end){
    	layer.msg(msg,{icon:7,time:1000});
    	return false;
    }
    if(parseInt(arr_start[0])>parseInt(arr_end[0])){
    	layer.msg(msg,{icon:7,time:1000});
    	return false;
    }
    if(parseInt(arr_start[0])==parseInt(arr_end[0])){
    	if(parseInt(arr_start[1])>parseInt(arr_end[1])){
    		layer.msg(msg,{icon:7,time:1000});
        	return false;
        }
    }
    return true;
}