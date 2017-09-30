/**
 * Created by Administrator on 2017/8/4.
 */
"use strict";
var regExp = /^\+?[1-9]\d*$/ //验证正整数
var cellOccupy = [] //配置过的单元格数组
var cellAvailableAll = [] //所有可用的单元格
var colNumAll = 0; //当前配置的列数
var rowNumAll = 0; //当前配置的行数
var isCheckModule = false; // 是否需要验证所属模块
// var urlResourceList=apiUrl + "/system/resource/queryResourceSelect"; //查询页面信息
var urlPageList=apiUrl + "/system/sysPage/queryPageSelect"; //查询页面信息
var urlDivList=apiUrl + "/system/sysDiv/queryDivSelect"; //查询页面信息
var urlSavaPage=apiUrl + "/system/sysPageDetail/createOrUpdate"; //保存配置布局
$(function () {
    var mesCom=new mesComMethod();
    var cellWidth = 0; //当前配置单元格宽度
    var cellHeight = 0; //当前配置单元格高度
    // var cellOccupy = []; //当前配置单元格列

    /*下拉框初始化*/
    var selectData=[
        { id: 1, text: '可视化配置面板1' },
        { id: 2, text: '可视化配置面板2' },
        { id: 3, text: '可视化配置面板3' },
        { id: 4, text: '可视化配置面板4' },
        { id: 5, text: '可视化配置面板5' },
        { id: 6, text: '可视化配置面板6' },
        { id: 7, text: '可视化配置面板7' },
        { id: 8, text: '可视化配置面板8' }];

    dropList('selectPage',urlPageList,"","tsSysPageId","tsSysResourceId","userNo");
    // dropList('selectPage',urlResourceList,"","tsSysResourceId","name","url");
    dropList('selectModule',urlDivList,"","tsSysDivId","name","no");
    
    
//    $("#selectModule").select2({
//        multiple: false,//是否多選
//        data: selectData
//    });
    /*生成可配置面板事件*/
    $('body').on('click','#generate',function () {
        $('#visualLeftHeader .position-warn').remove();
        var isSuccess = true; // 是否验证通过
        var $rowNum = $('#rowNum'); // 行数
        var $colNum = $('#colNum'); // 列数
        var $selectPage = $('#selectPage'); // 页面
        var $rowNumVal = parseInt($rowNum.val()); // 行数值
        var $colNumVal = parseInt($colNum.val()); // 列数值
        /*表单验证 begin*/
        var isNewSuccess1 = errValidate($rowNum,'行数不能为空！');
        if(isNewSuccess1 === false){
            isSuccess = false;
        }
        var isNewSuccess2 = errValidate($colNum,'列数不能为空！');
        if(isNewSuccess2 === false){
            isSuccess = false;
        }
        var isNewSuccess3 = errValidate($selectPage,'所属模块不能为空！');
        if(isNewSuccess3 === false){
            isSuccess = false;
        }
        /*表单验证 end*/
        /*数组验证通过后执行*/
        if(isSuccess === true){
            cellOccupy = []; // 生成清空配置过的单元格数组
            cellAvailableAll = []; // 还原默认数组重新赋值可用单元格数组
            /*启用配置表单*/
            $('#rowaMain').removeAttr('disabled');
            $('#colMain').removeAttr('disabled');
            $('#startPoint').removeAttr('disabled');
            $('#selectModule').removeAttr('disabled');
            $('#visualMove').removeAttr('disabled');
            $('#rowaMain').val('');
            $('#colMain').val('');
            $('#startPoint').val('');
            resetSelectAll();
            $('#visualMove').css('cursor','pointer');
            $('.visual-content-main').html('');
            var index = 1;
            /*遍历添加面板*/
            for (var i = 0; i < $rowNumVal; i++) {
                var rowMain = '';
                var rowMainHeight = 100/$rowNumVal;
                cellHeight = rowMainHeight;
                for (var a =0; a < $colNumVal; a++) {
                    cellAvailableAll.push(index); // 重新赋值可用单元格数组
                    var rowMainWidth = 100/$colNumVal;
                    cellWidth = rowMainWidth;
                    rowMain += '<div class="select-layout-panel" style="width:'+rowMainWidth+'%;">' +
                        '<div class="width-height100 angled-135 stripes font-title">面板'+index+'</div></div>';
                    index++;
                }
                var $rowDiv = '<div style="width: 100%;height: '+rowMainHeight+'%">'+rowMain+'</div>';
                $('.visual-content-main').append($rowDiv);
            }

            /*显示面板*/
            $('.visual-content-default').fadeOut(100);
            $('.visual-content-main').fadeIn(1000);
            $('#visualLeftContent').fadeIn(1000);
            mesCom.msgSuccess('生成成功！');
            rowNumAll = $rowNumVal; // 当前配置单元格行
            colNumAll = $colNumVal; // 当前配置单元格列
        }
    });
    /*移动模块到面板*/
    $('body').on('click','#visualMove',function () {
        $('#visualLeftContent .position-warn').remove(); // 先清空验证错误信息，防止重复
        $('#visualLeftContent .input-group input').removeClass('border-red');
        var isSuccess = true; // 是否验证通过
        var $rowaMain = $('#rowaMain'); // 占用行数
        var $colMain = $('#colMain'); // 占用列数
        var $startPoint = $('#startPoint'); // 起始位置
        var $selectModule = $('#selectModule'); // 所属模块
        var $rowaMainVal = parseInt($rowaMain.val()); // 占用行数值
        var $colMainVal = parseInt($colMain.val()); // 占用列数值
        var $startPointVal = parseInt($startPoint.val()); // 起始位置值
        var $selectModuleVal = $selectModule.val(); // 所属模块值
        var $selectModuleText = $('#selectModule option:selected').text(); // 所属模块文本值option:selected").text();
        var $selectPageVal = $('#selectPage').val(); // 所属页面值
        /*表单验证 begin*/
        var isNewSuccess1 = errValidate($rowaMain,'占用行数不能为空！',75);
        if(isNewSuccess1 === false){
            isSuccess = false;
        }
        var isNewSuccess2 = errValidate($colMain,'占用列数不能为空！',75);
        if(isNewSuccess2 === false){
            isSuccess = false;
        }
        var isNewSuccess3 = errValidate($startPoint,'起始位置不能为空！',75);
        if(isNewSuccess3 === false){
            isSuccess = false;
        }
        var isNewSuccess4 = errValidate($selectModule,'所属模块不能为空！',75);
        if(isNewSuccess4 === false){
            isSuccess = false;
        }
        /*表单验证 end*/
        /*表单验证成功执行事件*/Math.floor(15.77845000006 * 10000000000) / 10000000000
        if(isSuccess === true){
            $('#saveLayout').removeAttr('disabled');
            var thisCellOccupy = checkOccupy($startPointVal,$rowaMainVal,$colMainVal,colNumAll,cellOccupy);
            var newWidth = Math.floor((cellWidth * $colMainVal) * 100000000) / 100000000;
            var newHeight = Math.floor((cellHeight * $rowaMainVal) * 100000000) / 100000000;
            var newLeft = Math.floor((parseFloat('0.' + (($startPointVal - 1) / colNumAll).toString().split(".")[1]) * 100) * 100000000) / 100000000;
            var newTop = Math.floor((parseInt(($startPointVal - 1) / colNumAll) *cellHeight) * 100000000) / 100000000;
            var newCell = '<div data-startPoint='+$startPointVal+' data-left='+newLeft+' data-top='+newTop+' data-width='+newWidth+' data-height='+newHeight+' data-MouleVal='+$selectModuleVal+' data-pageval='+$selectPageVal+' data-Point='+thisCellOccupy+' class="config-content" style="left:'+newLeft+'%;top:'+newTop+'%;width:'+newWidth+'%;height:'+newHeight+'%;">' +
                '<div class="width-height100 angled-135 stripes layout-back-config font-title">'+$selectModuleText+'</div><i class="fa fa-remove remove-panels"></i></div>'
            $('.visual-content-main').append(newCell);
            removeSelectId($selectModuleVal);
            mesCom.msgSuccess('成功配置一个模块！');
        }
    });
    /*删除配置面板*/
    $('body').on('click','.remove-panels',function () {
        var _this = $(this);
        mesCom.msgConfirm('您确定要删除此配置面板吗？',function () {
            var thisCellOccupy = _this.closest('.config-content').attr('data-point');
            // var pointArray = _this.closest('.config-content').attr('data-point').toString().split('-');
            if(thisCellOccupy.toString().indexOf('-') === -1) {
                cellOccupy.removeByValue(thisCellOccupy); //删除后移除数组中指定的元素
            } else {
                var pointArray = thisCellOccupy.toString().split('-');
                for (var i = 0, j = pointArray.length; i < j; i++) {
                    cellOccupy.removeByValue(pointArray[i]); //删除后移除数组中指定的元素
                }
            }
            var $content = _this.closest('.config-content');
            $content.remove(); // 移除面板上的模块
            var $mouleVal = $content.attr('data-MouleVal');
            resetSelectId($mouleVal);
            mesCom.msgSuccess('删除成功');
        });
    });
    /*焦点进入清除错误提示*/
    $('#visualLeftHeader,#visualLeftContent').on('focus','input',function () {
        $(this).removeClass('border-red');
        var $closestDiv = $(this).closest('.input-group');
        $closestDiv.removeClass('input-group-warn');
        $closestDiv.find('.position-warn').remove();
    });
    /*生成表单焦点离开验证*/
    $('#visualLeftHeader').on('blur','input',function () {
        errValidate($(this),$(this).attr('data-msg'));
    });
    /*添加配置模块表单焦点离开验证事件*/
    $('#visualLeftContent').on('blur','input',function () {
        /*是否是起始位置项*/
        if($(this).attr('id') === 'startPoint'){
            if ($('#rowaMain').val() !== '' && $('#colMain').val() !== ''){
                var isCheckPoint = false; // 是否被占用，false未占用，true已被占用
                var $rowaMainVal = parseInt($('#rowaMain').val()); // 占用行数
                var $colMainVal = parseInt($('#colMain').val()); // 占用列数
                var $startPointVal = parseInt($('#startPoint').val()); // 起始位置
                /*isCheckAvailablePoint是否是可用范围，false可用，true不可用*/
                var isCheckAvailablePoint = checkAvailablePoint($startPointVal,$rowaMainVal,$colMainVal,colNumAll,rowNumAll);
                if (isCheckAvailablePoint === true) {
                    var $closestRow = $(this).closest('.input-group');
                    $closestRow.append('<span class="position-warn" style="left:75px;">超出可配置范围！</span>');
                    $closestRow.addClass('input-group-warn');
                    $(this).addClass('border-red');
                } else {
                    var thisCellOccupy = checkOccupy($startPointVal,$rowaMainVal,$colMainVal,colNumAll,cellOccupy,true);
                    if(thisCellOccupy.toString().indexOf('-') === -1) {
                        if(cellOccupy.indexOf(parseInt(thisCellOccupy)) !== -1) {
                            isCheckPoint = true;
                        }
                    } else {
                        var cellOccupyArray = thisCellOccupy.split('-');
                        for (var i = 0, j = cellOccupyArray.length; i < j; i++) {
                            if(cellOccupy.indexOf(parseInt(cellOccupyArray[i])) !== -1) {
                                isCheckPoint = true;
                            }
                        }
                    }
                    if(isCheckPoint === false){
                        errValidate($(this),$(this).attr('data-msg'),75);
                    } else {
                        var $closestRow = $(this).closest('.input-group');
                        $closestRow.append('<span class="position-warn" style="left:75px;">此位置有被占用的面板！</span>');
                        $closestRow.addClass('input-group-warn');
                        $(this).addClass('border-red');
                    }
                }

            } else {
                errValidate($(this),$(this).attr('data-msg'),75);
            }
        } else {
            errValidate($(this),$(this).attr('data-msg'),75);
        }
    });

    /*所属模块值改变事件*/
    $('#visualLeftContent').on('change','#selectModule',function () {
        var $closestDiv = $(this).closest('.input-group');
        $closestDiv.find('.select2-container--default .select2-selection--single').removeClass('border-red');
        $closestDiv.removeClass('input-group-warn');
        $closestDiv.find('.position-warn').remove();
        if(isCheckModule === true){
            isCheckModule = false;
        } else {
            errValidate($(this), $(this).attr('data-msg'), 75);
        }
    });

    /*所属页面值改变事件*/
    $('#visualLeftHeader').on('change','#selectPage',function () {
        var $closestDiv = $(this).closest('.input-group');
        $closestDiv.find('.select2-container--default .select2-selection--single').removeClass('border-red');
        $closestDiv.removeClass('input-group-warn');
        $closestDiv.find('.position-warn').remove();
        errValidate($(this), $(this).attr('data-msg'));
    });

    /*保存可视化配置布局事件*/
    $('#saveLayout').on('click',function () {
        var $configContent = $('.config-content');
        var configArray = [];
        $.each($configContent,function (i,v) {
            var configObj = {};
            configObj.tsSysPageId = $(v).attr('data-pageval'); //配置页面id
            configObj.tsSysDivId = $(v).attr('data-mouleval'); //配置模块id
            configObj.startPoint = $(v).attr('data-startPoint'); //模块起始位置
            configObj.pointX = parseFloat($(v).attr('data-left')); //模块左坐标
            configObj.pointY = parseFloat($(v).attr('data-top')); //模块上坐标
            configObj.width = parseFloat($(v).attr('data-width')); //模块宽度
            configObj.height = parseFloat($(v).attr('data-height')); //模块高度
            configArray.push(configObj);
        });
        // localStorage.setItem('configVisualLayout',JSON.stringify(configArray));
        var dataList = JSON.stringify(configArray);
        console.log(configArray);
        $.ajax({
            type: "POST",
            url: urlSavaPage,
            data: dataList,
            dataType: "json",
            contentType: "application/json;charset=UTF-8",
            beforeSend: function(request) {
                request.setRequestHeader("token", sessionStorage.token);
                request.setRequestHeader("AUTHORIZATION", sessionStorage.token);
            },
            success: function (data) {
                if (data.code === 10000) {
                    mesCom.msgSuccess('保存成功');
                } else {
                    mesCom.msgSuccess(data.message);
                }
            }
        });
    });
});



/*select设置指定option为不可选状态*/
function removeSelectId(id) {
    $('#selectModule option[value='+id+']').prop('disabled',true);
    isCheckModule = true;
    $('#selectModule').select2("destroy").select2();
    $('#selectModule').select2('val','0');
}
/*select恢复option为可选状态*/
function resetSelectAll() {
    $('#selectModule option').prop('disabled',false);
    isCheckModule = true;
    $('#selectModule').select2("destroy").select2();
    $('#selectModule').select2('val','0');
}
/*select设置指定option为可选状态*/
function resetSelectId(id) {
    $('#selectModule option[value='+id+']').prop('disabled',false);
    isCheckModule = true;
    $('#selectModule').select2("destroy").select2();
    $('#selectModule').select2('val','0');
}
/**
 * 检测当前配置的坐标
 * @param startPoint--起始位置
 * @param rowVal--占用行数值
 * @param colVal--占用列数值
 * @param colNum--当前配置单元格列
 * @param cellOccupy--配置过的单元格数组
 */
function checkOccupy(startPoint,rowVal,colVal,colNum,cellOccupy,isCheck) {
    var newcellOccupy = startPoint;
    var isFirst = true;
    for (var i = 0; i < rowVal; i++){
        for (var a = 0; a < colVal; a++){
            if (isFirst === true) {
                if (!isCheck) {
                    cellOccupy.push(startPoint);
                }
                isFirst = false;
            } else {
                newcellOccupy += '-' + (startPoint + a + (i*colNum));
                if (!isCheck) {
                    cellOccupy.push((startPoint + a + (i * colNum)));
                }
            }
        }
    }
    return newcellOccupy;
}
/**
 * 检测起始位置是否超出可配置范围
 * @param startPoint--起始位置
 * @param rowVal--占用行数值
 * @param colVal--占用列数值
 * @param colNum--当前配置的列数
 * @param rowNum--当前配置的行数
 */
function checkAvailablePoint(startPoint,rowVal,colVal,colNum,rowNum) {
    var isAvailablePoint = false;
    var y = Math.ceil(startPoint/colNum);
    var x = 0;
    var xPoint = startPoint%colNum;
    if (xPoint === 0) {
        x = colNum;
    } else {
        x = xPoint;
    }
    for (var i = 0; i < colVal; i++) {
        var xVal = x + i;
        if (xVal > colNum) {
            isAvailablePoint = true;
        }
    }
    for (var a = 0; a < rowVal; a++) {
        var yVal = y + a;
        if (yVal > rowNum) {
            isAvailablePoint = true;
        }
    }
    return isAvailablePoint;
}
/*数据验证*/
/**
 * 数据验证
 * @param dom--验证的demo节点
 * @param msg--验证后的提示信息
 * @param left--验证信息的相对位置left
 */
function errValidate(dom,msg,left) {
    var isNewSuccess = true;
    if (dom.val() === '') {
        isNewSuccess = false;
        var $closestRow = dom.closest('.input-group');
        if (left) {
            $closestRow.append('<span class="position-warn" style="left: ' + left + 'px;">' + msg + '</span>');
        } else {
            $closestRow.append('<span class="position-warn">' + msg + '</span>');
        }
        $closestRow.addClass('input-group-warn');
        dom.addClass('border-red');
    }
    if (dom.val() !== '' && regExp.test(dom.val()) === false) {
        if (dom.attr('id') === 'selectPage' || dom.attr('id') === 'selectModule') {
            var $selectPage = dom.val(); // 下拉框值
            if($selectPage == 0) {
                isNewSuccess = false;
                var $closestRow = dom.closest('.input-group');
                $closestRow.find('.select2-container--default .select2-selection--single').addClass('border-red');
                if (dom.attr('id') === 'selectModule') {
                    $closestRow.append('<span class="position-warn" style="left: ' + left + 'px;">请选择所属模块！</span>');
                }else {
                    $closestRow.append('<span class="position-warn">请选择页面！</span>');
                }
                $closestRow.addClass('input-group-warn');
                dom.addClass('border-red');
            }
        } else {
            isNewSuccess = false;
            var $closestRow = dom.closest('.input-group');
            if (left) {
                // if (dom.attr('id') === 'selectModule') {
                //     $closestRow.find('.select2-container--default .select2-selection--single').addClass('border-red');
                //     $closestRow.append('<span class="position-warn" style="left: ' + left + 'px;">请选择所属模块！</span>');
                // } else {
                //     $closestRow.append('<span class="position-warn" style="left: ' + left + 'px;">必须为正整数！</span>');
                // }
                $closestRow.append('<span class="position-warn" style="left: ' + left + 'px;">必须为正整数！</span>');
            } else {
                $closestRow.append('<span class="position-warn">必须为正整数！</span>');
            }
            $closestRow.addClass('input-group-warn');
            dom.addClass('border-red');
        }
    }
    if (dom.val() !== '' && regExp.test(dom.val()) === true) {
        if (dom.attr('id') === 'startPoint') {
            if ($('#rowaMain').val() !== '' && $('#colMain').val() !== ''){
                var isCheckPoint = false;
                var $rowaMainVal = parseInt($('#rowaMain').val()); // 占用行数
                var $colMainVal = parseInt($('#colMain').val()); // 占用列数
                var $startPointVal = parseInt($('#startPoint').val()); // 起始位置
                /*isCheckAvailablePoint是否是可用范围，false可用，true不可用*/
                var isCheckAvailablePoint = checkAvailablePoint($startPointVal,$rowaMainVal,$colMainVal,colNumAll,rowNumAll);
                if (isCheckAvailablePoint === true) {
                    isNewSuccess = false;
                    var $closestRow = dom.closest('.input-group');
                    $closestRow.append('<span class="position-warn" style="left:75px;">超出可配置范围！</span>');
                    $closestRow.addClass('input-group-warn');
                    dom.addClass('border-red');
                } else {
                    var thisCellOccupy = checkOccupy($startPointVal,$rowaMainVal,$colMainVal,colNumAll,cellOccupy,true);
                    if(thisCellOccupy.toString().indexOf('-') === -1) {
                        if(cellOccupy.indexOf(parseInt(thisCellOccupy)) !== -1) {
                            isCheckPoint = true;
                        }
                    } else {
                        var cellOccupyArray = thisCellOccupy.split('-');
                        for (var i = 0, j = cellOccupyArray.length; i < j; i++) {
                            if(cellOccupy.indexOf(parseInt(cellOccupyArray[i])) !== -1) {
                                isCheckPoint = true;
                            }
                        }
                    }
                    if(isCheckPoint === true) {
                        isNewSuccess = false;
                        var $closestRow = dom.closest('.input-group');
                        $closestRow.append('<span class="position-warn" style="left:75px;">此位置有被占用的面板！</span>');
                        $closestRow.addClass('input-group-warn');
                        dom.addClass('border-red');
                    }
                }
            }
        }
        if (dom.attr('id') === 'rowaMain') {
            if(dom.val() > rowNumAll) {
                isNewSuccess = false;
                var $closestRow = dom.closest('.input-group');
                $closestRow.append('<span class="position-warn" style="left:75px;">不能大于总行数！</span>');
                $closestRow.addClass('input-group-warn');
                dom.addClass('border-red');
            }
        }
        if (dom.attr('id') === 'colMain') {
            if(dom.val() > colNumAll) {
                isNewSuccess = false;
                var $closestRow = dom.closest('.input-group');
                $closestRow.append('<span class="position-warn" style="left:75px;">不能大于总列数！</span>');
                $closestRow.addClass('input-group-warn');
                dom.addClass('border-red');
            }
        }
    }
    return isNewSuccess;
}

// 初始化下拉框
function dropList(selectId,url,where,resultId,no,name){
	var datas=null;
	if(where && where != null){
		// datas=JSON.stringify(where);
	 datas=where;
	var	strs=where.split(":");
	var	param=strs[0];
	var value=strs[1];	
	if(value!=""&&value!=null){
		datas={param:value};
		datas=JSON.stringify(datas);
		}
	
	}
	$.ajax({  
		type: "POST",
		url: url,  
        data: datas,
        dataType: "json",
        contentType: "application/json;charset=UTF-8",
        beforeSend: function(request) {
        	request.setRequestHeader("token", sessionStorage.token);
        	request.setRequestHeader("AUTHORIZATION", sessionStorage.token);
        },
        success: function (data) {
            var selectData=[];
        	// $("#" + selectId).empty();
        	// $("#" + selectId).append("<option value=''>请选择</option>");
            $.each(data.results,function (index, row) {
                selectData.push({ id: row[resultId], text: row[no] + '-' +  row[name]});
                // $("#" + selectId).append("<option value="+row[resultId]+">" +row[no]+"-"+row[name] + "</option>");
            });
            $("#" + selectId).select2({
                multiple: false,//是否多選
                data: selectData
            });
        }
    });
}


/*鼠标按住选择区域*/
// document.getElementById('visualLayout-content').onmousedown = function() {
//
//     var selList = [];
//
//     var fileNodes = document.getElementsByTagName("div");
//
//     for ( var i = 0; i < fileNodes.length; i++) {
//
//         if (fileNodes[i].className.indexOf("select-layout-panel") != -1) {
//
//             fileNodes[i].className = "select-layout-panel";
//
//             selList.push(fileNodes[i]);
//
//         }
//
//     }
//
//     var isSelect = true;
//
//     var evt = window.event || arguments[0];
//
//     var startX = (evt.x || evt.clientX);
//
//     var startY = (evt.y || evt.clientY);
//
//     var selDiv = document.createElement("div");
//
//     selDiv.style.cssText = "position:absolute;width:0px;height:0px;font-size:0px;margin:0px;padding:0px;border:1px dashed #0099FF;background-color:#C3D5ED;z-index:1000;filter:alpha(opacity:60);opacity:0.6;display:none;";
//
//     selDiv.id = "selectDiv";
//
//     document.body.appendChild(selDiv);
//
//     selDiv.style.left = startX + "px";
//
//     selDiv.style.top = startY + "px";
//
//     var _x = null;
//
//     var _y = null;
//
//     clearEventBubble(evt);
//
//     document.getElementById('visualLayout-content').onmousemove = function() {
//
//         evt = window.event || arguments[0];
//
//         if (isSelect) {
//
//             if (selDiv.style.display == "none") {
//
//                 selDiv.style.display = "";
//
//             }
//
//             _x = (evt.x || evt.clientX);
//
//             _y = (evt.y || evt.clientY);
//
//             selDiv.style.left = Math.min(_x, startX) + "px";
//
//             selDiv.style.top = Math.min(_y, startY) + "px";
//
//             selDiv.style.width = Math.abs(_x - startX) + "px";
//
//             selDiv.style.height = Math.abs(_y - startY) + "px";
//
//             // ---------------- 关键算法 ---------------------
//
//             var _l = selDiv.offsetLeft - 300, _t = selDiv.offsetTop - 64;
//
//             var _w = selDiv.offsetWidth, _h = selDiv.offsetHeight;
//
//             for ( var i = 0; i < selList.length; i++) {
//
//                 var sl = selList[i].offsetWidth + selList[i].offsetLeft;
//
//                 var st = selList[i].offsetHeight + selList[i].offsetTop;
//
//                 if (sl > _l && st > _t && selList[i].offsetLeft < _l + _w && selList[i].offsetTop < _t + _h) {
//
//                     if (selList[i].className.indexOf("layout-seled") == -1) {
//
//                         selList[i].className = selList[i].className + " layout-seled";
//
//                     }
//
//                 } else {
//
//                     if (selList[i].className.indexOf("layout-seled") != -1) {
//
//                         selList[i].className = "select-layout-panel";
//
//                     }
//
//                 }
//
//             }
//
//         }
//
//         clearEventBubble(evt);
//
//     }
//
//     document.getElementById('visualLayout-content').onmouseup = function() {
//
//         isSelect = false;
//
//         if (selDiv) {
//
//             document.body.removeChild(selDiv);
//
//             showSelDiv(selList);
//
//         }
//
//         selList = null, _x = null, _y = null, selDiv = null, startX = null, startY = null, evt = null;
//
//     }
//
// }
//
// function clearEventBubble(evt) {
//
//     if (evt.stopPropagation)
//
//         evt.stopPropagation();
//
//     else
//
//         evt.cancelBubble = true;
//
//     if (evt.preventDefault)
//
//         evt.preventDefault();
//
//     else
//
//         evt.returnValue = false;
//
// }
//
// function showSelDiv(arr) {
//
//     var count = 0;
//
//     var selInfo = "";
//
//     for ( var i = 0; i < arr.length; i++) {
//
//         if (arr[i].className.indexOf("layout-seled") != -1) {
//
//             count++;
//
//             selInfo += arr[i].innerHTML + "\n";
//
//         }
//
//     }
//     // alert("共选择 " + count + " 个文件，分别是：\n" + selInfo);
// }