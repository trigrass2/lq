/**
 * Created by Administrator on 2017/7/4.
 */
/*公共变量*/
var notReadNTC;
/*日期格式化*/
Date.prototype.Format = function(formatStr) {

    if (this.getFullYear().toString() == "1") {
        return "";
    }
    var str = formatStr;
    var Week = ['日', '一', '二', '三', '四', '五', '六'];

    str = str.replace(/yyyy|YYYY/, this.getFullYear());
    str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100));
    var month = this.getMonth() + 1;
    str = str.replace(/MM/, month > 9 ? month.toString() : '0' + month);
    str = str.replace(/M/g, month);

    str = str.replace(/w|W/g, Week[this.getDay()]);

    str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
    str = str.replace(/d|D/g, this.getDate());

    str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
    str = str.replace(/h|H/g, this.getHours());
    str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
    str = str.replace(/m/g, this.getMinutes());

    str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
    str = str.replace(/s|S/g, this.getSeconds());

    return str;
};
/**
 * 日期推算扩展
 * @param state--需要推算的日期周期（nexMonth下个月，nexWeek下一周，nexDay明天）
 */
Date.prototype.Reckoning = function(state) {
    var date1 = this;
    var date2 = new Date(date1);
    if (state === 'nexMonth') {
        var month = date2.getMonth() + 2;
    } else if (state === 'nexWeek') {
        date2.setDate(date1.getDate() + 6);
        var month = date2.getMonth() + 1;
    } else if (state === 'nexDay') {
        date2.setDate(date1.getDate() + 1);
        var month = date2.getMonth() + 1;
    }
    var day = date2.getDate();
    var hours = date2.getHours();
    var minutes = date2.getMinutes();
    var seconds = date2.getSeconds();
    var times = date2.getFullYear() + '-' + this.Appendzero(month) + '-' + this.Appendzero(day) + ' ' + this.Appendzero(hours) + ':' + this.Appendzero(minutes) + ':' + this.Appendzero(seconds);
    return times;
}
// 小于10首位数加零
Date.prototype.Appendzero = function(obj) {
    if (obj < 10) {
        return '0' + '' + obj;
    } else {
        return obj;
    }
}
/*移除数组指定元素*/
Array.prototype.removeByValue = function(val) {
    for(var i=0; i<this.length; i++) {
        if(this[i] == val) {
            this.splice(i, 1);
            break;
        }
    }
}

/*系统枚举数据列表*/
var ewData={};
/*ResourceId*/
ewData.ResourceId = {
    /// <summary>
    /// 工艺路径站点维护ResourceId
    /// </summary>
    processMaintenance: '52fc5de097f24cbf99769c73bada0db',
    /// <summary>
    /// 工艺路径图形化展示
    /// </summary>
    processGraphics: '52fc5d962suie9bf99769c73bada0db',
    /// <summary>
    /// 通知编辑ResourceId
    /// </summary>
    notificationEditor: '4feaae358031470aab6085a23e1f721b',
    /// <summary>
    /// 通知查询ResourceId
    /// </summary>
    notificationQuery: '4e88e6caefab494a877bebf6d2379684',
    userNewsQuery: '56d5671e4cf841d9ba8579409c3b2d1f',
};
/*共用函数*/
function mesComMethod(){}
/**
 * iframe节点操作主页面打开新标签
 * @param tsSysResourceIdIframe--ResourceId唯一标识，用来判断是否已经打开此标签页
 * @param resourceIcoIframe--图标id，可传空字符串
 * @param nameIframe--标题名字，显示在上方的tab标签文字
 * @param urlIframe--url需要打开的新标签路径
 * @param isRefresh--是否刷新已经打开的标签，true---刷新；false---不刷新
 */
mesComMethod.prototype.openNewPage=function (tsSysResourceIdIframe,resourceIcoIframe,nameIframe,urlIframe,isRefresh) {
    var tabs = $(window.parent.document.body).find(".tabbable>.nav-tabs");
    var contents = $(window.parent.document.body).find(".tabbable>.tab-content");
    if (!$(window.parent.document.body).find("#tab_" + tsSysResourceIdIframe)[0]) {
        var tab = $("<li></li>");
        tab.attr("id", "tab_" + tsSysResourceIdIframe);
        var text = $("<a></a>");
        text.attr("data-toggle", "tab");
        text.attr("href", "#content_" + tsSysResourceIdIframe);

        if (resourceIcoIframe.length > 0) {
            var icon = $("<i></i>");
            icon.addClass("bigger-120 fa ");
            icon.addClass(resourceIcoIframe);
            text.append(icon);
        }
        text.append(nameIframe);
        var close = $("<i></i>");
        close.addClass("fa fa-times-circle close-tab");
        close.attr("title", "关闭");
        text.append(close);
        tab.append(text);
        tabs.append(tab);
        text.on('shown.bs.tab', function (e) {
            var related = $("#" + $(e.relatedTarget).parent().attr("id").replace("tab_", ""));
            var li = $("#" + $(e.target).parent().attr("id").replace("tab_", ""));
            if (!li.parents("li:eq(0)").hasClass("open")) {
                related.parents("li:eq(0)").removeClass("open");
                //related.parent().removeClass("nav-show").slideUp(500);
                related.parent().removeClass("nav-show").css("display", "none");
                li.parents("li:eq(0)").addClass("open");
                li.parent().addClass("nav-show").slideDown(500);
            }
            related.removeClass("active");
            li.addClass("active");
        });
        var content = $("<div></div>");
        content.addClass("tab-pane fade");
        content.attr("id", "content_" + tsSysResourceIdIframe);
        var iframe = $("<iframe></iframe>");
        iframe.attr("frameborder", "0");
        iframe.attr("src", urlIframe);
        iframe.css({ "width": "100%", "height": "100%" });
        content.append(iframe);
        contents.append(content);
        close.on("click", function (e) {
            var li = $(this).parent().parent();
            var id = li.attr("id").replace("tab_", "");
            var $prevId = li.prev().attr("id").replace("tab_", "");
            $("#" + id).removeClass("active");
            if (li.hasClass("active")) {
                if (li.prev().attr("id")) {
                    $("#" + li.prev().attr("id").replace("tab_", "")).addClass("active");
                }
                li.prev().addClass('active');
                // if(window.parent){
                //     $(window.parent.document.body).find("#content_" + id).prev().addClass('in active');
                // }
            }
            // li.closest('.tabbable').find('#content_' + id).prev().addClass('in active');
            li.closest('.tabbable').find('#content_' + $prevId).addClass('in active');
            li.closest('.tabbable').find('#content_' + id).remove();
            li.remove();
            // if(window.parent) {
            //     $(window.parent.document.body).find("#content_" + id).remove();
            // }
            dropNewPage();

        });
    }else {
        if(isRefresh && isRefresh != undefined) {
            if (isRefresh == true) {
                contents.find("#content_" + tsSysResourceIdIframe).remove();
                var content = $("<div></div>");
                content.addClass("tab-pane fade");
                content.attr("id", "content_" + tsSysResourceIdIframe);
                var iframe = $("<iframe></iframe>");
                iframe.attr("frameborder", "0");
                iframe.attr("src", urlIframe);
                iframe.css({"width": "100%", "height": "100%"});
                content.append(iframe);
                contents.append(content);
                // $(window.parent.document.body).find("#content_" + tsSysResourceIdIframe).load();
            }
        }
    }
    tabs.find("li").removeClass("active");
    contents.find("div").removeClass("in active");
    $(window.parent.document.body).find("#tab_" + tsSysResourceIdIframe).addClass("active");
    $(window.parent.document.body).find("#content_" + tsSysResourceIdIframe).addClass("in active");
    dropNewPage();
};

var dropNewPage = function () {
    var element = $(".tabbable .nav-tabs");
    //创建下拉标签
    var dropdown = $('<li>', {
        'class': 'dropdown pull-right hide tabdrop'
    }).append(
        $('<a>', {
            'class': 'dropdown-toggle',
            'data-toggle': 'dropdown',
            'href': '#'
        }).append(
            $('<i>', { 'class': "glyphicon glyphicon-align-justify" })
        ).append(
            $('<b>', { 'class': 'caret' })
        )
    ).append(
        $('<ul>', { 'class': "dropdown-menu" })
    );

    //检测是否已增加
    if (!$('.tabdrop').html()) {
        dropdown.prependTo(element);
    } else {
        dropdown = element.find('.tabdrop');
    }
    //检测是否有下拉样式
    if (element.parent().is('.tabs-below')) {
        dropdown.addClass('dropup');
    }
    var collection = 0;
    //检查超过一行的标签页
    element.append(dropdown.find('li'))
        .find('>li')
        .not('.tabdrop')
        .each(function () {
            if (this.offsetTop > 7 || element.width() - $(this).position().left - $(this).width() < 53) {
                dropdown.find('ul').append($(this));
                collection++;
            }
        });
    //如果有超出的，显示下拉标签
    if (collection > 0) {
        dropdown.removeClass('hide');
        if (dropdown.find('.active').length == 1) {
            dropdown.addClass('active');
        } else {
            dropdown.removeClass('active');
        }
    } else {
        dropdown.addClass('hide');
    }
};
/*警告提示信息*/
mesComMethod.prototype.msgWarning=function (msg) {
    layer.msg(msg,{icon:7,shade: 0.3,shadeClose: true,time:2000});
}
/*成功提示信息*/
mesComMethod.prototype.msgSuccess=function (msg) {
    layer.msg(msg,{
        icon:1
    });
}
/*错误提示信息*/
mesComMethod.prototype.msgError=function (msg) {
    layer.msg(msg,{icon:2,shade: 0.3,
        shadeClose: true,time:5000});
}
/*确认框信息*/
mesComMethod.prototype.msgConfirm=function (msg,callback1,callback2) {
    layer.confirm(msg, {
        btn: ['确认','取消'] //按钮
    }, function(){
        //确认
        if (callback1) {
            callback1();
        }
    }, function(){
        //取消
        if (callback2) {
            callback2();
        }
    });
}
/*可拖动面板封装*/
mesComMethod.prototype.initDraggablePanels=function (optionData,callback) {
    var optionDefaut={
        containment:true,
        panelsList:[]
    }
    var _this=this;
    var option=$.extend({},optionDefaut,optionData);
    var panelsList = option.panelsList;
    var panelsLnegth = option.panelsList.length;
    for (var i = 0; i < panelsLnegth; i++) {
        if (panelsList[i].colNum === 1) {
            var bodyHtml = panelsList[i].colValue[0].html();
            var $colBefore = _this.panels(1,panelsList[i].title[0])
            panelsList[i].colValue[0].replaceWith('<div class="row">' + $colBefore + bodyHtml + '</div></div></div></div>')
        } else if (panelsList[i].colNum === 2) {
            var $colBefore1 = _this.panels(2,panelsList[i].title[0]);
            var $colBefore2 = _this.panels(2,panelsList[i].title[1]);
            var bodyHtml1 = panelsList[i].colValue[0].html();
            var bodyHtml2 = panelsList[i].colValue[1].html();
            panelsList[i].colValue[0].before('<div class="row"></div>');
            panelsList[i].colValue[0].prev('.row').append($colBefore1 + bodyHtml1 + '</div></div></div>');
            panelsList[i].colValue[0].prev('.row').append($colBefore2 + bodyHtml2 + '</div></div></div>');
            panelsList[i].colValue[0].remove();
            panelsList[i].colValue[1].remove();
            // panelsList[i].colValue[0].replaceWith($colBefore1 + bodyHtml1 + '</div></div></div>')
            // panelsList[i].colValue[1].replaceWith($colBefore2 + bodyHtml2 + '</div></div></div>')
        } else if (panelsList[i].colNum === 3) {
            var $colBefore1 = _this.panels(3,panelsList[i].title[0]);
            var $colBefore2 = _this.panels(3,panelsList[i].title[1]);
            var $colBefore3 = _this.panels(3,panelsList[i].title[2]);
            var bodyHtml1 = panelsList[i].colValue[0].html();
            var bodyHtml2 = panelsList[i].colValue[1].html();
            var bodyHtml3 = panelsList[i].colValue[2].html();
            panelsList[i].colValue[0].before('<div class="row"></div>');
            panelsList[i].colValue[0].prev('.row').append($colBefore1 + bodyHtml1 + '</div></div></div>');
            panelsList[i].colValue[0].prev('.row').append($colBefore2 + bodyHtml2 + '</div></div></div>');
            panelsList[i].colValue[0].prev('.row').append($colBefore3 + bodyHtml3 + '</div></div></div>');
            panelsList[i].colValue[0].remove();
            panelsList[i].colValue[1].remove();
            panelsList[i].colValue[2].remove();
            // panelsList[i].colValue[0].replaceWith($colBefore1 + bodyHtml1 + '</div></div></div>')
            // panelsList[i].colValue[1].replaceWith($colBefore2 + bodyHtml2 + '</div></div></div>')
            // panelsList[i].colValue[2].replaceWith($colBefore3 + bodyHtml3 + '</div></div></div>')
        }
    }
    _this.WinMove(option.containment)
    if (callback) {
        callback()
    }
}
/*拖动面板div*/
mesComMethod.prototype.panels=function (colNum,title) {
    var col = 'col-sm-6';
    if (colNum ===1){
        col = 'col-sm-12';
    } else if (colNum === 2) {
        col = 'col-sm-6';
    } else if (colNum === 3) {
        col = 'col-sm-4';
    }
    var $colBefore = '<div class='+col+'>'+
        '<div class="ibox float-e-margins panel panel-default">'+
        '<div class="ibox-title panel-heading" style="border: none; border-bottom: 1px solid #ddd">'+
        '<span class="dot"></span>'+ title +
        '<span class="closeBtn" style="background: url(../../img/icons/close_btn.png) no-repeat;"></span>'+
        '</div>'+
        '<div class="panel-body">'
    return $colBefore
}
/*启动可拖动面板  isContainment是否限制拖动范围*/
mesComMethod.prototype.WinMove = function (isContainment) {
    var element = "[class*=col]";
    var handle = ".ibox-title";
    // var connect = "[class*=col]";
    var connect = ".ui-sortable";
    if(isContainment === true) {
        $(element).sortable({
            handle: handle,//如果设定了此参数,那么拖动会在对象内指定的元素上开始.
            connectWith: connect,//列表中的项目需被连接的另一个 sortable 元素的选择器。这是一个单向关系，如果您想要项目被双向连接，必须在两个 sortable 元素上都设置 connectWith 选项。
            containment: ".draggablePanels",//定义一个边界，限制拖动范围在指定的DOM元素内。
            tolerance: 'pointer',//指定用于测试项目被移动时是否覆盖在另一个项目上的模式
            forcePlaceholderSize: true,//如果为true, 强迫占位符（placeholder）有一个尺寸大小。
            // items: 'div',//指定元素内的哪一个项目应是 sortable。
            dropOnEmpty:true,//如果为false，这个sortable中项不能拖动到一个空的sortable中。
            opacity: 0.8,//当排序时助手（helper）的不透明度。从0.01 到 1。
            revert:true,//sortable 项目是否使用一个流畅的动画还原到它的新位置。
            scroll:true,//如果设置为 true，当到达边缘时页面会滚动。
        });
    } else {
        $(element).sortable({
            handle: handle,//如果设定了此参数,那么拖动会在对象内指定的元素上开始.
            connectWith: connect,//列表中的项目需被连接的另一个 sortable 元素的选择器。这是一个单向关系，如果您想要项目被双向连接，必须在两个 sortable 元素上都设置 connectWith 选项。
            tolerance: 'pointer',//指定用于测试项目被移动时是否覆盖在另一个项目上的模式
            forcePlaceholderSize: true,//如果为true, 强迫占位符（placeholder）有一个尺寸大小。
            dropOnEmpty:true,//如果为false，这个sortable中项不能拖动到一个空的sortable中。
            opacity: 0.8,//当排序时助手（helper）的不透明度。从0.01 到 1。
            revert:true,//sortable 项目是否使用一个流畅的动画还原到它的新位置。
            scroll:true,//如果设置为 true，当到达边缘时页面会滚动。
        });
    }
}

/*select2 excel粘贴多条件功能*/
mesComMethod.prototype.selectPaste = function () {
    $('body').on('paste','.select2 input.select2-search__field', function() {
        var _this = $(this);
        setTimeout(function () {
            var $selectMessage = $('.select2-results__message');
            if ($selectMessage.length > 0){
                $selectMessage.css('display','none');
            }
        },1)
        setTimeout(function () {
            var pasteArray = $.trim(_this.val()).split(' ');
            var idArray = [];
            _this.val('');
            var closestSelect = _this.closest('span.select2').prev('select.select2')
            for(var i = 0, j = pasteArray.length;i < j; i++) {
                var $thisSelect = closestSelect.find("option:contains("+pasteArray[i]+")").val();
                if ($thisSelect && $thisSelect != undefined){
                    idArray.push($thisSelect);
                    // closestSelect.select2('val',$thisSelect)
                }
            }
            if (idArray.length > 0){
                _this.attr('disabled',true);
                var $li = _this.closest('li').siblings('li');
                if ($li.length > 0) {
                    for(var i = 0, j = $li.length;i < j; i++) {
                        var $thisLi = $li[i];
                        var $title = $($thisLi).attr('title');
                        if (pasteArray.indexOf($title) === -1) {
                            var $thisSelect = closestSelect.find("option:contains("+$title+")").val();
                            if ($thisSelect && $thisSelect != undefined){
                                idArray.push($thisSelect);
                            }
                        }
                    }
                }
                closestSelect.val(idArray).trigger('change');
                closestSelect.select2("close");
                _this.attr('disabled',false);
            } else {
                closestSelect.select2("close");
            }
        }, 100);
    });
}
/**
 * 日期推算逻辑
 * @param dateTime--需要推算的日期
 * @param state--需要推算的日期周期（nexMonth下个月，nexWeek下一周，nexDay明天）
 */
mesComMethod.prototype.nexDate = function (dateTime,state) {
    var date1 = new Date(dateTime);
    var date2 = new Date(date1);
    if (state === 'nexMonth') {
        var month = date2.getMonth() + 2;
    } else if (state === 'nexWeek') {
        date2.setDate(date1.getDate() + 6);
        var month = date2.getMonth() + 1;
    } else if (state === 'nexDay') {
        date2.setDate(date1.getDate() + 1);
        var month = date2.getMonth() + 1;
    }
    var day = date2.getDate();
    var hours = date2.getHours();
    var minutes = date2.getMinutes();
    var seconds = date2.getSeconds();
    var times = date2.getFullYear() + '-' + this.Appendzero(month) + '-' + this.Appendzero(day) + ' ' + this.Appendzero(hours) + ':' + this.Appendzero(minutes) + ':' + this.Appendzero(seconds);
    return times;
}
// 小于10首位数加零
mesComMethod.prototype.Appendzero = function (obj) {
    if (obj < 10) {
        return '0' + '' + obj;
    } else {
        return obj;
    }
}
// 粘贴事件监控
$.fn.pasteEvents = function( delay ) {
    if (delay == undefined) delay = 10;
    return $(this).each(function() {
        var $el = $(this);
        $el.on("paste", function() {
            $el.trigger("prepaste");
            setTimeout(function() { $el.trigger("postpaste"); }, delay);
        });
    });
};
$(function () {
    /*拖动面板收缩*/
    $('body').on('click','.closeBtn',function () {
        var next=$(this).parent('div').next('div')
        if (next.css('display')=='none') {
            next.slideDown(500);
            $(this).css('background','url(../../img/icons/close_btn.png) no-repeat')
        }else{
            next.slideUp(500);
            $(this).css('background','url(../../img/icons/open_btn.png) no-repeat')
        }
    });
    //单击移动区域外的关闭处理
    // var $menuRight = $(".ew-menu-right");
    // $(document).click(function(e) {
    //     var e = e || window.event;
    //     if ($menuRight.css('display') == 'block') {
    //         //e.preventDefault();
    //         if ($(e.target).hasClass('menu-toggle')) {
    //
    //         } else {
    //             $menuRight.css('display','none');
    //         }
    //     }
    // });
});
//拖动面板
function WinMove() {
    var element = "[class*=col]";
    var handle = ".ibox-title";
    // var connect = "[class*=col]";
    var connect = ".ui-sortable";
    $(element).sortable({
        handle: handle,//如果设定了此参数,那么拖动会在对象内指定的元素上开始.
        connectWith: connect,//列表中的项目需被连接的另一个 sortable 元素的选择器。这是一个单向关系，如果您想要项目被双向连接，必须在两个 sortable 元素上都设置 connectWith 选项。
        containment: ".draggablePanels",//定义一个边界，限制拖动范围在指定的DOM元素内。
        tolerance: 'pointer',//指定用于测试项目被移动时是否覆盖在另一个项目上的模式
        forcePlaceholderSize: true,//如果为true, 强迫占位符（placeholder）有一个尺寸大小。
        // items: 'div',//指定元素内的哪一个项目应是 sortable。
        dropOnEmpty:true,//如果为false，这个sortable中项不能拖动到一个空的sortable中。
        opacity: 0.8,//当排序时助手（helper）的不透明度。从0.01 到 1。
        revert:true,//sortable 项目是否使用一个流畅的动画还原到它的新位置。
        scroll:true,//如果设置为 true，当到达边缘时页面会滚动。
    });
    // $(element).disableSelection();
    // /*当一个 sortable 项目移动到一个 sortable 列表时触发该事件。*/
    // $(element).on("sortover", function(event, ui) {
    //     console.log('sortover')
    // });
    //$(element).sortable("cancel");
    // /*在排序期间触发该事件，除了当 DOM 位置改变时。*/
    // $(element).on("sortchange", function(event, ui) {
    //     console.log('sortchange')
    // });
    // /*当用户停止排序且 DOM 位置改变时触发该事件。*/
    // $(element).on("sortupdate", function(event, ui) {
    //     $(element).sortable( "cancel" );
    // });
};

var mesCom=new mesComMethod();