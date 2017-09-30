
//页面初始化完成之后注册事件
$(function () {
    //0.注册元素的mouseenter事件
    $(".window").mouseenter(function (event) {
        var strHtml = "<div style='border:solid;width:100px;height:100px;position:absolute;left:" + event.clientX + "px;top:" + event.clientY + "px;'></div>";

        $("body").append(strHtml);
    });
});

//function InitMenu() {
//    var menu1 = {
//        width: 120, items:
//                [
//                { text: '新建', click: itemclick },
//                { text: '打开', click: itemclick },
//                { text: '保存', click: itemclick },
//                { line: true },
//                { text: '导出XML', click: itemclick },
//                { text: '导出图片', click: itemclick },
//                { text: '退出', click: itemclick }
//                ]
//    };

//    var menu2 = {
//        width: 120, items:
//            [
//            { text: '撤消', click: itemclick, img: '../../Content/img/undo.png' },
//            { text: '重做', click: itemclick, img: '../../Content/img/redo.png' },
//            { line: true },
//            { text: '剪切', click: itemclick },
//            { text: '复制', click: itemclick, img: '../../Content/img/copy.png' },
//            { text: '粘贴', click: itemclick, img: '../../Content/img/paste.png' },
//            { text: '粘贴格式', click: itemclick, img: '../../Content/img/paintformat.png' },
//            { line: true },
//            { text: '全选', click: itemclick },
//            { text: '不选', click: itemclick },
//            { text: '删除选择', click: itemclick }
//            ]
//    };
//    var menu3 = {
//        width: 120, items:
//            [
//            { text: '粗体', click: itemclick, img: '../../Content/img/bold.png' },
//            { text: '斜体', click: itemclick, img: '../../Content/img/italic.png' },
//            { line: true },
//            { text: '文字居左', click: itemclick, img: '../../Content/img/text_align_left.png' },
//            { text: '文字居中', click: itemclick, img: '../../Content/img/text_align_center.png' },
//            { text: '文字居右', click: itemclick, img: '../../Content/img/text_align_right.png' },
//            { text: '文字均分', click: itemclick, img: '../../Content/img/text_align_justify.png' },
//            { line: true },
//            { text: '图元置顶', click: itemclick, img: '../../Content/img/tofront.png' },
//            { text: '图元置底', click: itemclick, img: '../../Content/img/toback.png' }
//            ]
//    };
//    var menu4 = {
//        width: 120, items:
//                [
//                { text: '左对齐', click: itemclick, img: '../../Content/img/align_left.png' },
//                { text: '居中对齐', click: itemclick, img: '../../Content/img/align_center.png' },
//                { text: '右对齐', click: itemclick, img: '../../Content/img/align_right.png' },
//                { text: '上对齐', click: itemclick, img: '../../Content/img/align_top.png' },
//                { text: '垂直居中', click: itemclick, img: '../../Content/img/align_middle.png' },
//                { text: '下对齐', click: itemclick, img: '../../Content/img/align_bottom.png' },
//                { line: true },
//                { text: '顺时针45°旋转', click: itemclick, img: '../../Content/img/rotate_clockwise.png' },
//                { text: '逆时针45°旋转', click: itemclick, img: '../../Content/img/rotate_anticlockwise.png' },
//                { text: '组合', click: itemclick, img: '../../Content/img/group.png' },
//                { text: '分散组合', click: itemclick, img: '../../Content/img/ungroup.png' }
//                ]
//    };

//    var menu5 = {
//        width: 120, items:
//                [
//                { text: '关于', click: itemclick }
//                ]
//    };
//    $("#divMenu").ligerMenuBar({
//        items: [
//                    { text: '文件', menu: menu1 },
//                    { text: '编辑', menu: menu2 },
//                    { text: '格式', menu: menu3 },
//                    { text: '图元', menu: menu4 },
//                    { text: '帮助', menu: menu5 }
//        ]
//    });
//    $("#divButton1").ligerToolBar({
//        items: [
//            { text: '撤销', click: itemclick, img: '../../Content/img/undo.png' },
//            { text: '重做', click: itemclick, img: '../../Content/img/redo.png' },
//            { line: true },
//            { text: '移动', click: itemclick, img: '../../Content/img/move.png' },
//            { line: true }
//        ]
//    });
//    $("#divButton2").ligerToolBar({
//        items: [
//            { text: '图元置顶', click: itemclick, img: '../../Content/img/tofront.png' },
//            { text: '图元置底', click: itemclick, img: '../../Content/img/toback.png' },
//            { line: true },
//            { text: '左对齐', click: itemclick, img: '../../Content/img/align_left.png' },
//            { text: '居中对齐', click: itemclick, img: '../../Content/img/align_center.png' },
//            { text: '右对齐', click: itemclick, img: '../../Content/img/align_right.png' },
//            { text: '上对齐', click: itemclick, img: '../../Content/img/align_top.png' },
//            { text: '垂直居中', click: itemclick, img: '../../Content/img/align_middle.png' },
//            { text: '下对齐', click: itemclick, img: '../../Content/img/align_bottom.png' },
//            { line: true },
//            { text: '顺时针', click: itemclick, img: '../../Content/img/rotate_clockwise.png' },
//            { text: '逆时针', click: itemclick, img: '../../Content/img/rotate_anticlockwise.png' },
//            { text: '组合', click: itemclick, img: '../../Content/img/group.png' },
//            { text: '解散', click: itemclick, img: '../../Content/img/ungroup.png' }
//        ]
//    });
//}
