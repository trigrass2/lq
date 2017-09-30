/**
 * Created by Administrator on 2017/6/27.
 */
$(function () {
    /*通过json详细数据绑定含图标的jstree树形菜单*/
    $('#jstree_json').jstree({
        'core': {
            'data': [
                'Empty Folder',
                {
                    'text': 'Resources',
                    'state': {
                        'opened': true
                    },
                    'children': [
                        {
                            'text': 'css',
                            'children': [
                                {
                                    'text': 'animate.css',
                                    'icon': 'none'
                                },
                                {
                                    'text': 'bootstrap.css',
                                    'icon': 'none'
                                },
                                {
                                    'text': 'main.css',
                                    'icon': 'none'
                                },
                                {
                                    'text': 'style.css',
                                    'icon': 'none'
                                }
                            ],
                            'state': {
                                'opened': true
                            }
                        },
                        {
                            'text': 'js',
                            'children': [
                                {
                                    'text': 'bootstrap.js',
                                    'icon': 'none'
                                },
                                {
                                    'text': 'hplus.min.js',
                                    'icon': 'none'
                                },
                                {
                                    'text': 'jquery.min.js',
                                    'icon': 'none'
                                },
                                {
                                    'text': 'jsTree.min.js',
                                    'icon': 'none'
                                },
                                {
                                    'text': 'custom.min.js',
                                    'icon': 'none'
                                }
                            ],
                            'state': {
                                'opened': false
                            }
                        },
                        {
                            'text': 'html',
                            'children': [
                                {
                                    'text': 'layout.html',
                                    'icon': 'none'
                                },
                                {
                                    'text': 'navigation.html',
                                    'icon': 'none'
                                },
                                {
                                    'text': 'navbar.html',
                                    'icon': 'none'
                                },
                                {
                                    'text': 'footer.html',
                                    'icon': 'none'
                                },
                                {
                                    'text': 'sidebar.html',
                                    'icon': 'none'
                                }
                            ],
                            'state': {
                                'opened': false
                            }
                        }
                    ]
                },
                'Fonts',
                'Images',
                'Scripts',
                'Templates',
            ]
        }
    });
    /*普通json数据绑定树形菜单*/
    $('#jstree_json2').jstree({ 'core' : {
        'data' : [
            { "id" : "ajson1", "parent" : "#", "text" : "Simple root node" },
            { "id" : "ajson2", "parent" : "#", "text" : "Root node 2" },
            { "id" : "ajson3", "parent" : "ajson2", "text" : "Child 1" },
            { "id" : "ajson4", "parent" : "ajson2", "text" : "Child 2" },
        ]
    } });

    /*树形菜单事件绑定*/
    var $jstree3=$('#jstree_json3');
    $jstree3.jstree({ 'core' : {
        'data' : [
            { "id" : "ajson1", "parent" : "#", "text" : "Simple root node" },
            { "id" : "ajson2", "parent" : "#", "text" : "Root node 2" },
            { "id" : "ajson3", "parent" : "ajson2", "text" : "Child 1" },
            { "id" : "ajson4", "parent" : "ajson2", "text" : "Child 2" },
        ]
    } });
    $jstree3
    // 事件列表
        .on('changed.jstree', function (e, data) {//改变值事件
            var i, j, r = [];
            for(i = 0, j = data.selected.length; i < j; i++) {
                r.push(data.instance.get_node(data.selected[i]).text);
            }
            $('#jstree3_result').html('已选中:text →' + r.join(', ') + '，id →' + data.instance.get_node(data.selected[0]).id);
        });
    /*带多选框的树形菜单*/
    var $checkboxjstree=$('#checkboxjstree_json');
    $checkboxjstree.jstree({
        "checkbox" : {
            "keep_selected_style" : false
        },
        "plugins" : [ "checkbox"],
        "core": {
            "check_callback": true,
            'data': [
                { "id" : "ajson1", "parent" : "#", "text" : "Simple root node" },
                { "id" : "ajson2", "parent" : "#", "text" : "Root node 2" },
                { "id" : "ajson3", "parent" : "ajson2", "text" : "Child 1" },
                { "id" : "ajson4", "parent" : "ajson2", "text" : "Child 2" },
            ]
        }
    });
    /*设置选中整行变色去掉连线与图标
    * wholerow去掉连线与平铺整行
    * types去掉图标
    * */
    var $wholerowjstree_json=$('#wholerowjstree_json');
    $wholerowjstree_json.jstree({
        "types" : {
            "default" : {
                "icon" : false
            }
        },
        "plugins" : [ "wholerow","types" ],
        "core": {
            'data': [
                { "id" : "ajson1", "parent" : "#", "text" : "Simple root node" },
                { "id" : "ajson2", "parent" : "#", "text" : "Root node 2" },
                { "id" : "ajson3", "parent" : "ajson2", "text" : "Child 1" },
                { "id" : "ajson4", "parent" : "ajson2", "text" : "Child 2" },
            ]
        }
    });
    /*代码块高亮显示*/
    CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
        keyMap: "vim",
        theme: "rubyblue"
    });
    CodeMirror.fromTextArea(document.getElementById("codeJstree"), {
        lineNumbers: true,
        keyMap: "vim",
        theme: "rubyblue"
    });
    CodeMirror.fromTextArea(document.getElementById("codeJstree3"), {
        lineNumbers: true,
        keyMap: "vim",
        theme: "rubyblue"
    });
    CodeMirror.fromTextArea(document.getElementById("codecheckboxjstree"), {
        lineNumbers: true,
        keyMap: "vim",
        theme: "rubyblue"
    });
    CodeMirror.fromTextArea(document.getElementById("codewholerowjstree"), {
        lineNumbers: true,
        keyMap: "vim",
        theme: "rubyblue"
    });
});