﻿$(function () {
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
                $("#" + item.id).find(".fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down")
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
    //定义菜单
    var menuData =[
    {
        "Id": "108962021b1b4ddaab31082de3ea511d",
        "Text": "系统管理",
        "Url": null,
        "Icon": "fa fa-cog",
        "Children": [
            {
                "Id": "4b8efae412d04904a6cf3729deafa660",
                "Text": "数据字典",
                "Url": "SysCodeType/sysCodeType.html",
                "Icon": "fa fa-",
                "Children": null,
                "data": {
                    "IsTab": true
                }
            },
            {
                "Id": "4ccc20ae47814171ac607e6436a5fa79",
                "Text": "系统参数",
                "Url": "SysParameter/sysParameter.html",
                "Icon": "fa fa-",
                "Children": null,
                "data": {
                    "IsTab": true
                }
            },
            {
                "Id": "81ea2111079e4d92937a3e7603ab5d48",
                "Text": "资源信息",
                "Url": "SysResource/sysResource.html",
                "Icon": "fa ",
                "Children": null,
                "data": {
                    "IsTab": true
                }
            },{
                "Id": "6c1e2b799a53466b9778c831c7d51cc4",
                "Text": "操作日志",
                "Url": "SysLog/sysLog.html",
                "Icon": "fa fa-",
                "Children": null,
                "data": {
                    "IsTab": true
                }
            }
        ],
        "data": {
            "IsTab": true
        }
    },
    {
        "Id": "108962021b1b4ddaab31082de3ea51sd",
        "Text": "用户管理",
        "Url": null,
        "Icon": "fa fa-clipboard",
        "Children": [
            {
                "Id": "4b8efae412d04904a6cf3729deafa260",
                "Text": "用户信息",
                "Url": "SysUser/sysUser.html",
                "Icon": "fa fa-",
                "Children": null,
                "data": {
                    "IsTab": true
                }
            },
            {
                "Id": "4ccc20ae47814171ac607e6436a4fa79",
                "Text": "角色信息",
                "Url": "Role/role.html",
                "Icon": "fa fa-",
                "Children": null,
                "data": {
                    "IsTab": true
                }
            },
            {
                "Id": "4ccc20ae47814171ac607e6436a4fa79",
                "Text": "工作日历模板",
                "Url": "WorkTimeTpl/workTimeTpl.html",
                "Icon": "fa fa-",
                "Children": null,
                "data": {
                    "IsTab": true
                }
            }
        ],
        "data": {
            "IsTab": true
        }
    },
		{
				"Id": "108962021b1b4ddaab31082de3ea51sd",
				"Text": "基础数据",
				"Url": null,
				"Icon": "fa  fa-sitemap",
				"Children": [
						{
								"Id": "4b8efae412d04904a6cf3739deafa260",
								"Text": "工厂布局",
								"Url": null,
								"Icon": "fa fa-",
								"Children":  [
				            {
				                "Id": "4b8efae412d049054acf3729deafa260",
				                "Text": "工厂",
				                "Url": "../Base/BasPlant/basPlant.html",
				                "Icon": "fa fa-",
				                "Children": null,
				                "data": {
				                    "IsTab": true
				                }
				            },
				            {
				                "Id": "4ccc20ae47814171ac607e643644fa79",
				                "Text": "车间",
				                "Url": "../Base/BasWorkShop/basWorkshop.html",
				                "Icon": "fa fa-",
				                "Children": null,
				                "data": {
				                    "IsTab": true
				                }
				            },
				            {
				                "Id": "4ccc20ae47814171ac607e6436a4fa72",
				                "Text": "产线",
				                "Url": "../Base/BasLine/basLine.html",
				                "Icon": "fa fa-",
				                "Children": null,
				                "data": {
				                    "IsTab": true
				                }
				            },
										{
												"Id": "4ccc20ae47814171ac607e6436a4fa37",
												"Text": "工位",
												"Url": "../Base/BasUloc/basUloc.html",
												"Icon": "fa fa-",
												"Children": null,
												"data": {
														"IsTab": true
												}
										}
				        ],
								"data": {
										"IsTab": true
								}
						},{
							"Id": "3c0efae412d04904a6cf3739deafa260",
							"Text": "客户供应商信息",
							"Url": null,
							"Icon": "fa fa-",
							"Children":  [
			            {
			                "Id": "3c1efae412d04904a6cf3739deafa260",
			                "Text": "客户信息",
			                "Url": "../Base/BasCustom/basCustom.html",
			                "Icon": "fa fa-",
			                "Children": null,
			                "data": {
			                    "IsTab": true
			                }
			            },
			            {
			                "Id": "3c2c20ae47814171ac607e643644fa79",
			                "Text": "供应商信息",
			                "Url": "../Base/BasSuppl/basSuppl.html",
			                "Icon": "fa fa-",
			                "Children": null,
			                "data": {
			                    "IsTab": true
			                }
			            }
			        ],
							"data": {
									"IsTab": true
							}
					}
				],
				"data": {
						"IsTab": true
				}
		}
	];

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
    $.ajax({
        type: "POST",
        async: false,
        url: apiUrl + "/system/user/getMenu",
        contentType:"application/json",
        data: null,
        dataType: "JSON",
        success: function (data, textStatus, jqXHR) {
            var root = $(".nav-list");
            $.each(data.results, function (index, item) {
                var li = $("<li></li>");
                li.addClass("");
                li.appendTo(root)

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

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        $(".nav-list").find("li").removeClass("active");
    })

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
        li.appendTo(root)

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
            ul.addClass("submenu");
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
                a.attr('target', '_blank')
            }
        }
    });
}

var onClickMenu = function (e) {
    $(".nav-list").find("li").removeClass("active");
    $(this).parents("li:eq(0)").addClass("active");
    var item = $(this).data("item");
    addTab(item);
}

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
            var icon = $("<i></i>")
            icon.addClass("ace-icon bigger-120 fa ");
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
    }
    tabs.find("li").removeClass("active");
    contents.find("div").removeClass("in active");
    $("#tab_" + item.tsSysResourceId).addClass("active");
    $("#content_" + item.tsSysResourceId).addClass("in active");
    drop();
}

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
    )

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
}

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
}

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
}

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
                    var tr = "<tr><td>" + (i + 1) + "</td><td>" + v.LineName + "</td><td>" + v.UlocName + "</td><td>" + v.AlarmBeginTime + "</td><td>" + v.AlarmEndTime + "</td></tr>"
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
}
