/**
 * Created by Administrator on 2017/6/30.
 */
"use strict";
$(function () {
    /*绑定文本框*/
    var $test_data=$("#test_data,#test_data2");
    var testdataBsSuggest = $test_data.bsSuggest({
        idField: "id",//每组数据的哪个字段作为 data-id，优先级高于 indexId 设置（推荐）
        keyField: "name",//每组数据的哪个字段作为输入框内容，优先级高于 indexKey 设置（推荐）
        /* 搜索相关 */
        allowNoKeyword: false,//是否允许无关键字时请求数据
        effectiveFields: ["name","address"],//有效显示于列表中的字段，非有效字段都会过滤，默认全部。
        // effectiveFieldsAlias: {"name":'名字',"address":"个人主页"},//有效字段的别名对象，用于 header 的显示
        // searchFields: [],//有效搜索字段，从前端搜索过滤数据时使用，但不一定显示在列表中。effectiveFields 配置字段也会用于搜索过滤
        twoWayMatch: false,// 是否双向匹配搜索。为 true 即输入关键字包含或包含于匹配字段均认为匹配成功，为 false 则输入关键字包含于匹配字段认为匹配成功
        // multiWord: false,//以分隔符号分割的多关键字支持
        // separator: ',',//多关键字支持时的分隔符，默认为半角逗号
        // delay: 300,//搜索触发的延时时间间隔，单位毫秒
        /* UI */
        autoDropup: true,//选择菜单是否自动判断向上展开。设为 true，则当下拉菜单高度超过窗体，且向上方向不会被窗体覆盖，则选择菜单向上弹出
        autoMinWidth: false,//是否自动最小宽度，设为 false 则最小宽度不小于输入框宽度
        showHeader: false,//是否显示选择列表的 header。为 true 时，有效字段大于一列则显示表头
        showBtn: true,//是否显示下拉按钮
        inputWarnColor: "#f6f6f6", //输入框内容不是下拉列表选择时的警告色
        listStyle: {
            'overflow': 'auto',
            'color':'#666'
        },//列表的样式控制
        listAlign: 'left',//提示列表对齐位置，left/right/auto
        listHoverStyle: 'background: #07d; color:#fff', //提示框列表鼠标悬浮的样式
        clearable: true,// 是否可清除已输入的内容
        data: {
            'value': [
                {
                    'id': '0',
                    'name': '张三',
                    'address': '上海市浦东新区'
                },
                {
                    'id': '1',
                    'name': '李四',
                    'address': '上海市黄浦区'
                },
                {
                    'id': '2',
                    'name': '王五',
                    'address': '长沙市岳麓区'
                },
                {
                    'id': '3',
                    'name': '赵六',
                    'address': '长沙市芙蓉区'
                },
                {
                    'id': '4',
                    'name': 'jason',
                    'address': '美国洛杉矶'
                },
                {
                    'id': '5',
                    'name': 'jack',
                    'address': '美国纽约'
                }
            ]
        }
    });
    /*
     * onSetSelectValue：当从下拉菜单选取值时触发，并传回设置的数据到第二个参数
     * onUnsetSelectValue：当设置了 idField，且自由输入内容时触发（与背景警告色显示同步）*/
    $test_data
        .on('onSetSelectValue', function (e, keyword) {
            console.log('onSetSelectValue: ', keyword);
            $("#sugText").text('id→'+keyword.id+';       value→'+keyword.key+';');
        })
        .on('onUnsetSelectValue', function (e) {
            // console.log('onUnsetSelectValue');
        });
    $('.btnSuggest').unbind('click');
    $('body').on('click','.btnSuggest',function () {
       var $SuggestI=$(this).find('i');
       var $taMulti=$(this).closest('.suggestMain').next('.taMulti');
       var $suggestMain=$(this).closest('.suggestMain');
       var $suggestText=$(this).closest('.suggestBody').find('.suggestText');
       if($SuggestI.hasClass('fa-angle-double-right') === true){//展开
           $suggestText.removeAttr('data-id');
           $suggestText.removeAttr('alt');
           $suggestText.val('');
           $SuggestI.removeClass('fa-angle-double-right');
           $SuggestI.addClass('fa-angle-double-left');
           $taMulti.removeClass('hide');
           $taMulti.addClass('show');
           $suggestMain.removeClass('col-lg-12');
           $suggestMain.addClass('col-lg-6');
       }else if($SuggestI.hasClass('fa-angle-double-left') === true){//收缩
           $suggestText.removeAttr('data-id');
           $suggestText.removeAttr('alt');
           $suggestText.val('');
           $SuggestI.removeClass('fa-angle-double-left');
           $SuggestI.addClass('fa-angle-double-right');
           $taMulti.removeClass('show');
           $taMulti.addClass('hide');
           $suggestMain.removeClass('col-lg-6');
           $suggestMain.addClass('col-lg-12');
       }
    });
    $('body').on('focus','.taMulti',function () {
       console.log('123');
    });
    $(".taMulti").on("postpaste", function() {

    }).pasteEvents();
    /*代码块高亮显示*/
    CodeMirror.fromTextArea(document.getElementById("codeText"), {
        lineNumbers: true,
        keyMap: "vim",
        theme: "rubyblue"
    });
});