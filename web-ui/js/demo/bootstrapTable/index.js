/**
 * Created by Administrator on 2017/6/27.
 */
//多列表格
buildTable($('#exampleTableLargeColumns'), 50, 50);
function buildTable($el, cells, rows) {
    var i, j, row,
        columns = [{
            checkbox: true
        }],
        data = [];

    for (i = 0; i < cells; i++) {
        columns.push({
            class:'bootstrap-table-col-class',
            field: '字段' + i,
            title: '单元' + i,
            valign: 'middle',
            align:'center',
            width: 120
        });
    }
    for (i = 0; i < rows; i++) {
        row = {};
        for (j = 0; j < cells; j++) {
            row['字段' + j] = 'Row-' + i + '-' + j;
        }
        data.push(row);
    }
    $el.bootstrapTable('destroy').bootstrapTable({
        columns: columns,
        data: data,
        iconSize: 'outline',
        icons: {
            columns: 'glyphicon-list'
        }
    });
}

//分页table
(function() {
    $('#exampleTableEvents').bootstrapTable({
        url: "../../js/demo/bootstrapTable/bootstrap_table_test.json",
        search: true,//是否启用搜索
        pagination: true,//是否启用分页
        showRefresh: true,//是否启用刷新
        showToggle: false,//切换
        showColumns: false,//显示隐藏列
        height:300,
        // sidePagination: "server",//表格分页的位置
        clickToSelect: true,//点击行即可选中单选/复选框
        striped: true,     //使表格带有条纹
        sortOrder:'desc',
        iconSize: 'outline',
        toolbar: '#exampleTableEventsToolbar',
        columns:[{
            align: 'center',
            checkbox:true,
            width:'30',
            valign: 'middle'
        },{
            field: 'name',
            title: '用户名',
            align: 'center',
            width:'100',
            valign: 'middle'
        },{
            field: 'price',
            title: '价格',
            sortable:true,
            width:'300',
            align: 'center',
            valign: 'middle'
        },{
            field: 'column1',
            title: '列1',
            width:300,
            align: 'center',
            valign: 'middle'
        },{
            field: 'column2',
            title: '列2',
            width:300,
            align: 'center',
            valign: 'middle'
        },{
            field: 'column3',
            title: '列3',
            width:300,
            align: 'center',
            valign: 'middle'
        },{
            field: 'status',
            title: '状态',
            width:500,
            align: 'center',
            valign: 'middle',
            formatter:function(value,rowData,rowIndex){
                if(value==1||value=='1'){
                    return '有效';
                }else{
                    return '无效';
                }
            }
        }],
        icons: {
            refresh: 'glyphicon-repeat',//配置刷新图标
            toggle: 'glyphicon-list-alt',//配置切换图标
            columns: 'glyphicon-list'//配置显示隐藏列图标
        }
    });

    var $result = $('#examplebtTableEventsResult');

    $('#exampleTableEvents').on('all.bs.table', function(e, name, args) {
        console.log('Event:', name, ', data:', args);
    })
        .on('click-row.bs.table', function(e, row, $element) {
            $result.text('Event: click-row.bs.table');
        })
        .on('dbl-click-row.bs.table', function(e, row, $element) {
            $result.text('Event: dbl-click-row.bs.table');
        })
        .on('sort.bs.table', function(e, name, order) {
            $result.text('Event: sort.bs.table');
        })
        .on('check.bs.table', function(e, row) {
            $result.text('Event: check.bs.table');
        })
        .on('uncheck.bs.table', function(e, row) {
            $result.text('Event: uncheck.bs.table');
        })
        .on('check-all.bs.table', function(e) {
            $result.text('Event: check-all.bs.table');
        })
        .on('uncheck-all.bs.table', function(e) {
            $result.text('Event: uncheck-all.bs.table');
        })
        .on('load-success.bs.table', function(e, data) {
            $result.text('Event: load-success.bs.table');
        })
        .on('load-error.bs.table', function(e, status) {
            $result.text('Event: load-error.bs.table');
        })
        .on('column-switch.bs.table', function(e, field, checked) {
            $result.text('Event: column-switch.bs.table');
        })
        .on('page-change.bs.table', function(e, size, number) {
            $result.text('Event: page-change.bs.table');
        })
        .on('search.bs.table', function(e, text) {
            $result.text('Event: search.bs.table');
        });
})();

// 固定表格的列
/*
* 1.固定表格的列，不能设置高度，否则显示会有影响
* 2.使用修改后的bootstrap-table-fixed-columns.js和bootstrap-table-fixed-columns.css
* 3.增加fixedColumns:true,fixedNumber:4,(固定多少列)属性
* 4.注意固定后的样式是否有问题
* */
(function() {
    $('#exampleTableEventsFixed').bootstrapTable({
        url: "../../js/demo/bootstrapTable/bootstrap_table_test.json",
        search: true,//是否启用搜索
        pagination: true,//是否启用分页
        showRefresh: true,//是否启用刷新
        showToggle: false,//切换
        showColumns: false,//显示隐藏列
        // height:300,
        // sidePagination: "server",//表格分页的位置
        fixedColumns:true,
        fixedNumber:4,
        clickToSelect: true,//点击行即可选中单选/复选框
        striped: true,     //使表格带有条纹
        sortOrder:'desc',
        iconSize: 'outline',
        toolbar: '#exampleTableEventsToolbar',
        columns:[{
            align: 'center',
            checkbox:true,
            width:'30',
            valign: 'middle'
        },{
            field: 'name',
            title: '用户名',
            align: 'center',
            width:'100',
            valign: 'middle'
        },{
            field: 'price',
            title: '价格',
            sortable:true,
            width:'300',
            align: 'center',
            valign: 'middle'
        },{
            field: 'column1',
            title: '列1',
            width:300,
            align: 'center',
            valign: 'middle'
        },{
            field: 'column2',
            title: '列2',
            width:300,
            align: 'center',
            valign: 'middle'
        },{
            field: 'column3',
            title: '列3',
            width:300,
            align: 'center',
            valign: 'middle'
        },{
            field: 'status',
            title: '状态',
            width:500,
            align: 'center',
            valign: 'middle',
            formatter:function(value,rowData,rowIndex){
                if(value==1||value=='1'){
                    return '有效';
                }else{
                    return '无效';
                }
            }
        }],
        icons: {
            refresh: 'glyphicon-repeat',//配置刷新图标
            toggle: 'glyphicon-list-alt',//配置切换图标
            columns: 'glyphicon-list'//配置显示隐藏列图标
        }
    });
})();



$(function () {
    /*代码块高亮显示*/
    // CodeMirror.commands.save = function(){alert("Saving");};
    CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
        keyMap: "vim",
        theme: "rubyblue"
    });
    CodeMirror.fromTextArea(document.getElementById("CodeMirrortable"), {
        lineNumbers: true,
        keyMap: "vim",
        theme: "rubyblue"
    });
    CodeMirror.fromTextArea(document.getElementById("codeFixed"), {
        lineNumbers: true,
        keyMap: "vim",
        theme: "rubyblue"
    });
});