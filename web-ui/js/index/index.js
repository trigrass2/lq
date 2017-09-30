;
// 右键的全局变量
var selectTabs = '',
    isSpecial = false,
    isActive = false;
// 接口的全局变量
var notRead = 0,ntcIndex = 0,andIndex = 0,tskIndex = 0;
$(function () {
    // 监听右上角通知的改变
    useAjax();

    var name = sessionStorage.getItem('name');
	$('#userName').html(name);
    var widgets = $.cookie("sortable");
    if (widgets) {
        widgets.sort(function (x, y) { return x.index - y.index; });
        var container = $('<div></div>');
        var column = 0;
        $.each(widgets, function (index, item) {
            if (item.column > column) {
                var row = $('<div class="row"></div>');
                container.append(row);
                column = 12;
            }
            var row = container.find(".row:last");
            var col = $('<div class="col-xs-12 col-sm-' + item.column + ' widget-container-col"></div>');
            if (item.collapse) {
                $("#" + item.id).addClass("collapsed");
                $("#" + item.id).find(".widget-body").hide();
                $("#" + item.id).find(".fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
            }
            col.append($("#" + item.id)[0].outerHTML);
            row.append(col);
            column = (column - item.column) > 0 ? column - item.column : 0;
        });
        $("#container").html(container[0].innerHTML);
    }
    $('.widget-container-col').sortable({
        connectWith: '.widget-container-col',
        items: '> .widget-box',
        handle: ace.vars['touch'] ? '.widget-header' : false,
        cancel: '.fullscreen',
        opacity: 0.8,
        revert: true,
        forceHelperSize: true,
        placeholder: 'widget-placeholder',
        forcePlaceholderSize: true,
        tolerance: 'pointer',
        start: function (event, ui) {
            ui.item.parent().css({ 'min-height': ui.item.height() });
        },
        update: function (event, ui) {
            ui.item.parent({ 'min-height': '' });
            var widgets = [];
            $('.widget-container-col > .widget-box').each(function (index, target) {
                var id = $(target).attr("id");
                if (id) {
                    var c = $(target).parent().attr("class").split(" ");
                    $.each(c, function (i, v) {
                        if (v.indexOf("col-sm") > -1) {
                            var column = v.replace("col-sm-", "");
                            widgets.push({
                                id: id,
                                index: index,
                                collapse: $(target).hasClass("collapsed"),
                                column: Number(column)
                            });
                        }
                    });
                }
            });
            $.cookie("sortable", widgets);
        }
    });

    /*var root = $(".nav-list");
    $.each(menuData, function (index, item) {
        var li = $("<li></li>");
        li.addClass("");
        li.appendTo(root)

        var a = $("<a></a>");
        a.attr("href", item.Url);
        a.appendTo(li);

        var i = $("<i></i>");
        i.addClass("menu-icon");
        i.addClass(item.Icon);
        i.appendTo(a);

        var span = $("<span></span>");
        span.addClass("menu-text");
        span.text(item.Text);
        span.appendTo(a);

        var b = $("<b></b>");
        b.addClass("arrow");
        b.appendTo(li);

        if (item.Children) {
            a.addClass("dropdown-toggle");
            var arrow = $("<b></b>");
            arrow.addClass("arrow fa fa-angle-down");
            arrow.appendTo(a);

            var ul = $("<ul></ul>");
            ul.addClass("submenu");
            ul.appendTo(li);
            initMenu(ul, item.Children);
        }
    });*/
   	var datas = JSON.stringify({"name":''});
    $.ajax({
        type: "POST",
        async: false,
        url: apiUrl + "/system/user/getMenu",
        contentType:"application/json",
        data:datas,
        dataType: "JSON",
        success: function (data, textStatus, jqXHR) {
            var root = $(".nav-list");
            $.each(data.results, function (index, item) {
                var li = $("<li></li>");
                li.addClass("");
                li.appendTo(root);

                var a = $("<a></a>");
                a.attr("href", item.url);
                a.appendTo(li);

                var i = $("<i></i>");
                i.addClass("menu-icon fa ");
                i.addClass(item.resourceIco);
                i.appendTo(a);

                var span = $("<span></span>");
                span.addClass("menu-text");
                span.text(item.name);
                span.appendTo(a);

                var b = $("<b></b>");
                b.addClass("arrow");
                b.appendTo(li);

                if (item.children) {
                    a.addClass("dropdown-toggle");
                    var arrow = $("<b></b>");
                    arrow.addClass("arrow fa fa-angle-down");
                    arrow.appendTo(a);

                    var ul = $("<ul></ul>");
                    ul.addClass("submenu yanse1");
                    ul.appendTo(li);
                    initMenu(ul, item.children);
                }
            });
        }
    });


    $('.btn-ew').keyup(function(ev){
      $(".nav-list").empty()
      $.ajax({
        type: "POST",
        async: false,
        url: apiUrl + "/system/user/getMenu",
        contentType:"application/json",
        data:JSON.stringify({'name':this.value}),
        dataType: "JSON",
        success: function (data, textStatus, jqXHR) {
          var root = $(".nav-list");
          $.each(data.results, function (index, item) {
            var li = $("<li></li>");
            li.addClass("");
            li.appendTo(root);

            var a = $("<a></a>");
            a.attr("href", item.url);
            a.appendTo(li);

            var i = $("<i></i>");
            i.addClass("menu-icon fa ");
            i.addClass(item.resourceIco);
            i.appendTo(a);

            var span = $("<span></span>");
            span.addClass("menu-text");
            span.text(item.name);
            span.appendTo(a);

            var b = $("<b></b>");
            b.addClass("arrow");
            b.appendTo(li);

            if (item.children) {
              a.addClass("dropdown-toggle");
              var arrow = $("<b></b>");
              arrow.addClass("arrow fa fa-angle-down");
              arrow.appendTo(a);

              var ul = $("<ul></ul>");
              ul.addClass("submenu");
              ul.appendTo(li);
              initMenu(ul, item.children);
            }
          });
        }
      });
    })

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        $(".nav-list").find("li").removeClass("active");
    });

    //取用户待办数据
//  getUserTodo();

//  $("#alarminfo").svgPanZoom();
//
//  var chat = $.connection.chatHub;
//  $.connection.hub.start().done(function () {
//      toastr.success('OPC连接成功！');
//  });
//  chat.client.alarm = function (tag, value) {
//      var tag = SVG.get(tag);
//      if (value == "0") {
//          tag.stroke({ color: "none" });
//      }
//      else {
//          tag.stroke({ color: "#ff0000" });
//      }
//  };
//  lineAlarm();
    // 调用连接
    connect();
});
//var myChart;
//var option = {
//    series: [{
//        type: 'map',
//        mapType: 'baiduBuilding',
//        roam: true,
//        data: [],
//        geoCoord: {
//            'S1': [106, 65],
//            'S2': [196, 65],
//            'S3': [286, 65],
//            'S4': [376, 65],
//            'S5': [466, 65],
//            'S6': [106, 155],
//            'S7': [196, 155],
//            'S8': [286, 155],
//            'S9': [376, 155]
//        }
//    }, {
//        type: 'map',
//        mapType: 'baiduBuilding',
//        data: [],
//        markPoint: {
//            symbol: 'emptyCircle',
//            symbolSize: 15,
//            effect: {
//                show: true,
//                color: 'red'
//            },
//            data: []
//        }
//    }]
//};
//require.config({
//    paths: {
//        'echarts': '../Content/echarts'
//    }
//});
//require([
//    'echarts',
//    'echarts/chart/map'
//], function (ec) {
//    require('echarts/util/mapData/params').params.baiduBuilding = {
//        getGeoJson: function (callback) {
//            $.ajax({
//                url: "../Content/svg/method-draw-image.svg",
//                dataType: 'xml',
//                success: function (xml) {
//                    callback(xml)
//                }
//            });
//        }
//    }
//    myChart = ec.init(document.getElementById('mainchart'));
//    myChart.setOption(option);
//});

var initMenu = function (root, data) {
    $.each(data, function (index, item) {
        var li = $("<li></li>");
        li.addClass("");
        li.attr("id", item.tsSysResourceId);
        li.appendTo(root);

        var a = $("<a></a>");
        a.attr("href", "#");
        a.appendTo(li);
        a.data("item", item);

        var i = $("<i></i>");
        i.addClass("menu-icon fa ");
        i.addClass(item.resourceIco);
        i.appendTo(a);

        a.append(item.name);

        var b = $("<b></b>");
        b.addClass("arrow");
        b.appendTo(li);

        if (item.children) {
            a.addClass("dropdown-toggle");
            var arrow = $("<b></b>");
            arrow.addClass("arrow fa fa-angle-down");
            arrow.appendTo(a);

            var ul = $("<ul></ul>");
            ul.addClass("submenu yanse2");
            ul.appendTo(li);
            initMenu(ul, item.children);
        }
        else {
//      	alert(item.openType);
            if (item.openType == 2 || item.openType == 1) {
                a.on("click", onClickMenu);
            }
            else {
                a.attr('href', item.url);
                a.attr('title', item.name);
                a.attr('target', '_blank');
            }
        }
    });
};

var onClickMenu = function (e) {
    $(".nav-list").find("li").removeClass("active");
    $(this).parents("li:eq(0)").addClass("active");
    var item = $(this).data("item");
    addTab(item);
};

var addTab = function (item) {
    //var item = $(this).data("item");
    var tabs = $(".tabbable>.nav-tabs");
    var contents = $(".tabbable>.tab-content");
    if (!$("#tab_" + item.tsSysResourceId)[0]) {
        var tab = $("<li></li>");
        tab.attr("id", "tab_" + item.tsSysResourceId);
        var text = $("<a></a>");
        text.attr("data-toggle", "tab");
        text.attr("href", "#content_" + item.tsSysResourceId);

        if (item.resourceIco) {
            var icon = $("<i></i>");
            icon.addClass("bigger-120 fa ");
            icon.addClass(item.resourceIco);
            text.append(icon);
        }
        text.append(item.name);
        var close = $("<i></i>");
        close.addClass("fa fa-times-circle close-tab");
        close.attr("title", "关闭");
        text.append(close);
        tab.append(text);
        tabs.append(tab);
        text.on('shown.bs.tab', function (e) {
            var related = $("#" + $(e.relatedTarget).parent().attr("id").replace("tab_", ""));
            var li = $("#" + $(e.target).parent().attr("id").replace("tab_", ""));
          // alert($(e.relatedTarget).parent().attr("id").replace("tab_", ""))
          // alert($(e.target).parent().attr("id").replace("tab_", ""))
          if (li.parents("li:eq(0)").parents("li:eq(0)")) {
            if (li.parents("li:eq(0)").parents("li:eq(0)").children('ul').css('display') == 'none') {
              li.parents("li:eq(0)").parents("li:eq(0)").children('a').click();
            }
            if (li.parents("li:eq(0)").children('ul').css('display') == 'none') {
              setTimeout(function () {
                li.parents("li:eq(0)").children('a').click();
              }, 500)
            }
          }
            else if(li.parents("li:eq(0)").children('ul').css('display') == 'none'){
                li.parents("li:eq(0)").children('a').click();
            }
           // else if (!li.parents("li:eq(0)").hasClass("open")) {11
           //     // related.parents("li:eq(0)").removeClass("open");
           //    li.parents("li:eq(0)").children('a').click();
           //      //related.parent().removeClass("nav-show").slideUp(500);
           //     // related.parent().removeClass("nav-show").css("display", "none");
           //     //  li.parents("li:eq(0)").addClass("open");
           //     //  li.parent().addClass("nav-show").slideDown(500);
           //  }
            related.removeClass("active");
            li.addClass("active");
        });
        var content = $("<div></div>");
        content.addClass("tab-pane fade");
        content.attr("id", "content_" + item.tsSysResourceId);
        var iframe = $("<iframe></iframe>");
        iframe.attr("frameborder", "0");
        iframe.attr("src", item.url);
        iframe.css({ "width": "100%", "height": "100%" });
        content.append(iframe);
        contents.append(content);
        close.on("click", function (e) {
            var li = $(this).parent().parent();
            var id = li.attr("id").replace("tab_", "");
            $("#" + id).removeClass("active");
            if (li.hasClass("active")) {
                if (li.prev().attr("id")) {
                    $("#" + li.prev().attr("id").replace("tab_", "")).addClass("active");
                }
                li.prev().addClass('active');
                $("#content_" + id).prev().addClass('in active');
            }
            li.remove();
            $("#content_" + id).remove();
            drop();
        });

        $('#myTab').contextmenu({
            target: '#context-menu2',
            before: function (e) {
                e.preventDefault();
                if (e.target.id == 'no_right' || e.target.id == 'myTab') {
                    e.preventDefault();
                    this.closemenu();
                    return false;
                }
                return true;
            }
        });
    }
    tabs.find("li").removeClass("active");
    contents.find("div").removeClass("in active");
    $("#tab_" + item.tsSysResourceId).addClass("active");
    $("#content_" + item.tsSysResourceId).addClass("in active");
    drop();
};

// 监听右键事件
$('body').on('mousedown','li[id^="tab_"]',function (e) {
    if(e.which === 3){
        selectTabs = $(this);
        // 只有两个默认标签的情况
        if ($('#myTab li').length === 2 && $('#myTab li')[1].id === 'home_page') {
            $('#home_page').addClass('active in');
        } else if ($('#myTab li').length === 3){
            // 只有三个标签的时候，关闭右侧和其他标签禁用
            $('#context-menu2 li').removeClass('menu_cls');
            $('#close_other').addClass('menu_cls');
            $('#close_right').addClass('menu_cls');
        } else if ($('#myTab li').length > 3 && $('#myTab li')[$('#myTab li').length - 1].id === selectTabs.attr('id')) {
            isSpecial = false;
            // 大于三个标签并且选择最右侧标签的时候，关闭右侧标签不可用
            $('#context-menu2 li').removeClass('menu_cls');
            $('#close_right').addClass('menu_cls');
        } else if($('#myTab li').length > 3 && isActive) {
            $('#context-menu2 li').removeClass('menu_cls');
        } else {
            isSpecial = true;
            // 关闭当前、右侧、其他、所有均可用
            $('#context-menu2 li').removeClass('menu_cls');
        };
        if($(this).hasClass('active')){
            isActive = true;
        } else {
            isActive = false;
            $('#full-page').addClass('menu_cls');
        }
    }
})

// 关闭当前标签
$('body').on('click','#close_current',function (e) {
    var li = selectTabs;
    var id = li.attr("id").replace("tab_", "");
    $("#" + id).removeClass("active");
    if (li.hasClass("active")) {
        if (li.prev().attr("id")) {
            $("#" + li.prev().attr("id").replace("tab_", "")).addClass("active");
        }
        li.prev().addClass('active');
        $("#content_" + id).prev().addClass('in active');
    }
    selectTabs.remove();
    $("#content_" + id).remove();
    drop();
})
// 关闭所有标签
$('body').on('click','#close_all', function (e) {
    $("li[id^='tab_']").remove();
    $("div[id^='content_']").remove();
    $('#myTab li').addClass("active")
    $('#home').addClass('active in')
})
// 关闭右侧标签
$('body').on('click', '#close_right', function (e) {
    if(isSpecial) {
        var $tabs = selectTabs.attr('id').slice(4);
        selectTabs.addClass('active');
        selectTabs.prevAll().removeClass('active');
        selectTabs.nextAll().removeClass('active');
        selectTabs.nextAll().remove();
        $('#content_'+$tabs).addClass('active in');
        $('#content_'+$tabs).nextAll().removeClass('active in');
        $('#content_'+$tabs).nextAll().remove();
    } else {
        return;
    }
});
// 关闭其他标签页
$('body').on('click', '#close_other', function (e) {
    var allTabs = $("li[id^='tab_']");
    $.each(allTabs, function (i,v) {
        var tab = $(v).attr('id').slice(4);
        if ($(v).attr('id')  === selectTabs.attr('id')) {
            $(v).addClass('active');
            $('#content_'+tab).addClass('active in');
        } else {
            $('#content_'+tab).removeClass('active in');
            $('#content_'+tab).remove();
            $(v).removeClass('active');
            $(v).remove();
        }
    })
});


// 全屏
$('body').on('click','#full-page',function (e) {
    if(isActive) {
        toggleFullscreen();
    } else {
        return;
    }
})

var toggleFullscreen = function(){
    if(document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement){
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }else{
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (document.body.msRequestFullscreen) {
            document.body.msRequestFullscreen();
        }
    }
    //更新iframe定位
    update_iframe_pos();
}

//退出全屏时恢复全屏按钮、iframe的定位方式
var update_iframe_pos = function(){
    if(document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement){
        $('body iframe').width(window.screen.width);
        $('body iframe').height(window.screen.height);
        $('body iframe').addClass('full_page');
    }else{
        $('body iframe').css('width','100%');
        $('body iframe').css('height','100%');
        $('body iframe').removeClass('full_page');
    }
    if(typeof document.msFullscreenElement === 'object'){
        alert('IE不支持全屏,请更换浏览器');
    }
}

//添加退出全屏时的监听事件
window.addEventListener("fullscreenchange", function(e) {
    update_iframe_pos();
});
window.addEventListener("mozfullscreenchange", function(e) {
    update_iframe_pos();
});
window.addEventListener("webkitfullscreenchange", function(e) {
    update_iframe_pos();
});
window.addEventListener("msfullscreenchange", function(e) {
    update_iframe_pos();
});

var drop = function () {
    var element = $(".nav-tabs");
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

//用户待办查看详情
var showDetail = function (that) {
    var name = $(that).parent().find("p").text();
    var arr = $(".nav-list").find("a");
    for (var i = 0; i < arr.length; i++) {
        if ($(arr[i]).text() == name) {
            var item = $(arr[i]).data("item");
            addTab(item);
            return;
        }
    }
};

var getUserTodo = function () {
    $.ajax({
        type: "GET",
        url: ApiUrl + "/api/WorkFlowApprove",
        //data: { userId: UserId },
        dataType: "JSON",
        success: function (data, textStatus, jqXHR) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].NAME == "myapprove")
                    $("#myapprove").text(data[i].ITEMCOUNT);
                else if (data[i].NAME == "myapply")
                    $("#myapply").text(data[i].ITEMCOUNT);
                else if (data[i].NAME == "myapprovehistory")
                    $("#myapprovehistory").text(data[i].ITEMCOUNT);
                else if (data[i].NAME == "myinfo")
                    $("#myinfo").text(data[i].ITEMCOUNT);
            }
        }
    });
};

var lineAlarm = function () {
    $.getJSON(ApiUrl + "/api/AlarmInfo", { workDay: "2016-10-10" }, function (response, status, xhr) {
        var series = [];
        $.each(response.type, function (i, v) {
            series.push({
                name: v, type: "bar"
            });
        });
        series.push({
            name: '告警类型占比',
            type: 'pie',
            center: ['85%', '20%'],
            radius: '28%',
            pieToggleSelect: function () {
                alert(1);
            }
        });
        var option = {
            baseOption: {
                timeline: {
                    axisType: 'category',
                    autoPlay: true,
                    playInterval: 2000,
                    data: response.lines
                },
                tooltip: {},
                legend: {
                    data: response.type
                },
                calculable: true,
                grid: {
                    left: '5%',
                    top: 60,
                    right: '5%',
                    bottom: 80
                },
                xAxis: [{
                    'type': 'category',
                    'axisLabel': { 'interval': 0 },
                    splitLine: { show: false }
                }],
                yAxis: [{
                    type: 'value',
                    name: '告警次数',
                    minInterval: 1
                }],
                series: series
            },
            options: response.options
        };
        var myChart = echarts.init(document.getElementById('charts1'));
        myChart.setOption(option);
        myChart.on('click', function (e) {
            if (e.seriesType == "pie") {
                var title = myChart.getOption().title[0].text;
                var info = $.grep(response.info, function (n, i) {
                    return n.LineName == title && n.AlarmTypeName == e.name;
                });
                $("#myModal").find("#myModalLabel").text(e.name);
                var tbody = $("#myModal").find("tbody");
                tbody.empty();
                $.each(info, function (i, v) {
                    var tr = "<tr><td>" + (i + 1) + "</td><td>" + v.LineName + "</td><td>" + v.UlocName + "</td><td>" + v.AlarmBeginTime + "</td><td>" + v.AlarmEndTime + "</td></tr>";
                    tbody.append(tr);
                });
                $('#myModal').modal('show');
            }
        });
    });
};

//取异常数据
var getExceptionData = function (errorData) {
    if (errorData.InnerException) {
        return getExceptionData(errorData.InnerException);
    }
    else {
        return errorData.ExceptionMessage;
    }
};

function changePassword() {
	$('#noId').html(sessionStorage.getItem('name'));
	$('#addModal').modal("show");
}

function editPassword(){
	
    var newPassword = $('#newPassword').val();
    if(newPassword == ""){
    	layer.msg("新密码不允许为空！",{icon:1,time:1500});
    	return;
    }
    var confirmPassword = $('#confirmPassword').val();
    if(confirmPassword == ""){
    	layer.msg("确认密码不允许为空！",{icon:1,time:1500});
    	return;
    }
    
    if(newPassword != confirmPassword){
    	layer.msg("两次密码输入不一致！",{icon:1,time:1500});
    	return;
    }
    var datas = {   
            password : newPassword
 	};
    datas = JSON.stringify(datas);
     
	$.ajax({
            type: 'POST',
            url: apiUrl+"/system/user/updatePassword",
            data: datas,
            contentType:"application/json",
            dataType: 'JSON',
            success: function (data) {
            	var errcode = data.code;//在此做了错误代码的判断
         	    if(errcode == "10000"){
         	    	layer.msg(data.message,{icon:1,time:1000});
         	   		$('#addModal').modal("hide");
         	    }
            }
        });
}


$('#addModal').on('hide.bs.modal',function(){
    $('#newPassword').val("");
    $('#confirmPassword').val("");
});

// 建立连接
function connect() {
    var accountId = sessionStorage.getItem('userId');
    var socket = new SockJS(apiUrl + '/endpoint');
    stompClient = Stomp.over(socket);
    stompClient.connect({accountId:accountId}, function(frame) {
        console.log('Connected: ' + frame);
        stompClient.subscribe('/user/' + accountId + '/getMessage', function(respnose){
            if (JSON.parse(respnose.body).count === 1) {
                var resMsg = JSON.parse(respnose.body).results;
                layer.open({
                    type: 1,
                    title: false,
                    shade: [0],
                    area: ['340px', '215px'],
                    offset: 'rb', //右下角弹出
                    anim: 2,
                    content: '<div class="newsBomb"><p class="newsTitle"><span>标题：'+resMsg+'</span></p><p><a onclick="goToUserNewsQuery();">查看详细信息</a></p></div>',
                    success: function(layero, index){
                        useAjax();
                    }
                });
            } else {
                useAjax();
            }
        });
    });
}

// 跳转至用户消息查询页面
function goToUserNewsQuery(){
    var tsNotiQueryResourceIdIframe=ewData.ResourceId.userNewsQuery;
    var resourceIcoIframe='';
    var nameIframe='用户消息查询';
    var urlIframe="../home/UserNewsQuery/userNewsQuery.html";
    var mesCom=new mesComMethod();
    mesCom.openNewPage(tsNotiQueryResourceIdIframe,resourceIcoIframe,nameIframe,urlIframe,true);
    $('#layui-layer1').remove();
}

// 点击消息显示所有消息
$('body').on('click','#newMsg',function () {
    goToUserNewsQuery();
});
$('body').on('click','#tskMore',function () {
    goToUserNewsQuery();
});

// $('body').on('click','#showMsg',function () {
//     layer.open({
//         type: 1,
//         title: false,
//         shade: [0],
//         area: ['340px', '215px'],
//         offset: 'rb', //右下角弹出
//         anim: 2,
//         content: '<div class="newsBomb"><p class="newsTitle"><span>标题：消息</span></p><p><a onclick="goToUserNewsQuery();">查看详细信息</a></p></div>',
//         success: function(layero, index){
//             notRead = 0;
//             ntcIndex = 0;
//             andIndex = 0;
//             tskIndex = 0;
//             useAjax();
//         }
//     });
// })

// 调用接口
function useAjax() {
    notRead = 0;
    ntcIndex = 0;
    andIndex = 0;
    tskIndex = 0;
    dataPage = {pageSize:-1};
    $.ajax({
        type: 'POST',
        url: apiUrl + "/system/sysUserMsg/queryUserMsgs",
        data: JSON.stringify(dataPage),
        contentType: 'application/json',
        success: function (data) {
            dataResult = data.results;
            for (var i = 0, j = data.results.length; i < j; i++) {
                if (dataResult[i].msgType === 'NTC' && dataResult[i].msgStatus === 'N') {
                    notRead++;
                } else if (dataResult[i].msgType === 'TSK' && dataResult[i].msgStatus === 'N') {
                    tskIndex++;
                } else if (dataResult[i].msgType === 'AND' && dataResult[i].msgStatus === 'N') {
                    andIndex++;
                }
            }
            // 未读消息
            $('#notReadNotice').html(notRead);

            // 通知消息个数
            $('#ntcId').html(notRead);

            // 按灯消息个数
            $('#andId').html(andIndex);

            // 任务消息个数
            $('#tskId').html(tskIndex);

            $('#allId').html(andIndex + tskIndex);
        }
    });
}

// 任务消息点击
$('body').on('click','#tskNews',function () {
    var allNum = $('#allId').html();
    var tskNum = $('#tskNews #tskId').html();
    if ($('#tskNews #tskId').html() === '0'){
        return;
    } else {
        $('#tskNews #tskId').html('0');
        $('#allId').html(allNum - tskNum);
        goToUserNewsQuery();
    }
})

// 暗灯消息点击
$('body').on('click','#andNews',function () {
    var allNum = $('#allId').html();
    var andNum = $('#andNews #andId').html();
    if ($('#andNews #andId').html() === '0'){
        return;
    } else {
        $('#andNews #andId').html('0');
        $('#allId').html(allNum - andNum);
        goToUserNewsQuery();
    }
})

// 通知消息点击
$('body').on('click','#ntcNews',function () {
    if ($('#ntcNews #notReadNotice').html() === '0'){
        return;
    } else {
        $('#ntcNews #notReadNotice').html('0');
        $('#ntcId').html('0');
        goToUserNewsQuery();
    }
})