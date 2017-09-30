$(function () {
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        $(".nav-list").find("li").removeClass("active");
    });


    var root = $(".nav-list");
    var jsonData = {
        data: [
           { "Id": "1", "Url": "/Admin/ExceptionReport/Index", "BgImage": "/img/Admin/4.png", "Icon": "ace-icon bigger-120 fa fa-arrows", "Text": "异常分析", "Children": false, "IsTab": true, "IsClose": false },
           { "Id": "2", "Url": "/Admin/ExceptionMetadata/Index", "BgImage": "/imgAdmin/7.png", "Icon": "ace-icon bigger-120 fa fa-arrows", "Text": "异常元数据配置", "Children": false, "IsTab": true, "IsClose": true },
       { "Id": "3", "Url": "/Admin/Cache/Index", "BgImage": "/imgAdmin/2.png", "Icon": "ace-icon bigger-120 fa fa-arrows", "Text": "缓存管理", "Children": false, "IsTab": true, "IsClose": true },
        { "Id": "4", "Url": "/Admin/ExceptionReport/Index", "BgImage": "/imgAdmin/1.png", "Icon": "ace-icon bigger-120 fa fa-arrows", "Text": "部门配置", "Children": false, "IsTab": true, "IsClose": true },
        { "Id": "5", "Url": "/Admin/Versions/Index", "BgImage": "/imgAdmin/6.png", "Icon": "ace-icon bigger-120 fa fa-arrows", "Text": "版本配置", "Children": false, "IsTab": true, "IsClose": true },
        { "Id": "6", "Url": "/Admin/NetMonitor/Index", "BgImage": "/imgAdmin/5.png", "Icon": "ace-icon bigger-120 fa fa-arrows", "Text": "CS端网络监控", "Children": false, "IsTab": true, "IsClose": true }
        ]
    };

    initMenu(root, jsonData.data);
    $(".nav-list").find("li").removeClass("active");
    $(".nav-list").find("li:eq(0)").addClass("active");
    var item = $(".nav-list").find("li:eq(0)").find("a").data("item");
    addTab(item);
});


var initMenu = function (root, data) {
    $.each(data, function (index, item) {
        var li = $("<li style='background: #20335d;'></li>");
        li.addClass("");
        li.attr("id", item.Id);
        li.appendTo(root)

        var a = $("<a></a>");
        a.attr("href", "#");
        a.css({ "height": "48px", "margin": "0", "padding-top": "15px" });
        a.css({ "cursor:": "pointer" });
        a.appendTo(li);
        a.data("item", item);

        var img = $("<img />");
        img.appendTo(a);
        img.css({ "width": "28px", "height": "24px", "margin-left": "20px", "margin-top": "-5px" });
        img.attr("src", item.BgImage);

        var span = $("<span></span>");
        span.appendTo(a);
        span.html(item.Text);
        span.css({ "margin-left": "19px" });
        span.append("");

        var i = $("<i></i>");
        i.addClass("menu-icon");
        i.addClass(item.Icon);
        i.css({ "display": "none" });
        i.appendTo(a);

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
        else {
            if (item.IsTab) {
                a.on("click", onClickMenu);
            }
            else {
                a.attr('href', item.Url);
                a.attr('title', item.Text);
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
    if (!$("#tab_" + item.Id)[0]) {
        var tab = $("<li></li>");
        tab.attr("id", "tab_" + item.Id);
        var text = $("<a></a>");
        text.attr("data-toggle", "tab");
        text.attr("href", "#content_" + item.Id);

        if (item.Icon) {
            var icon = $("<i></i>")
            icon.addClass("ace-icon bigger-120");
            icon.addClass(item.Icon);
            text.append(icon);
        }
        text.append(item.Text);
        if (item.IsClose) {
            var close = $("<i></i>");
            close.addClass("fa fa-times-circle close-tab");
            close.attr("title", "关闭");
            text.append(close);
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
        content.attr("id", "content_" + item.Id);
        var iframe = $("<iframe></iframe>");
        iframe.attr("frameborder", "0");
        iframe.attr("src", item.Url);
        iframe.css({ "width": "100%", "height": "100%" });
        content.append(iframe);
        contents.append(content);
    }
    tabs.find("li").removeClass("active");
    contents.find("div").removeClass("in active");
    $("#tab_" + item.Id).addClass("active");
    $("#content_" + item.Id).addClass("in active");
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
            if (this.offsetTop > 6 || element.width() - $(this).position().left - $(this).width() < 53) {
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

