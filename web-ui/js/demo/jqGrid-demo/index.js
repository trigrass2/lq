/**
 * Created by Administrator on 2017/7/31.
 */
// ../../../css/images下的图片是分页和+号的图标
var index6 = '',
    index1 = '',
    index2 = '',
    index3 = '',
    index4 = '',
    index5 = '',
    arr = [{OrderID:'',RequiredDate:'',ShipName:'',ShipCity:'',Freight:''}];
$(document).ready(function () {
    // 父表
    $("#jqGrid").jqGrid({
        url: '../../../js/demo/jqGrid-demo/data.json',
        mtype: "GET",
        datatype: "json",
        colModel: [
            { label: 'ID', name: 'CustomerID', key: true, width: 75 },
            { label: 'Company Name', name: 'CompanyName', width: 150 },
            { label: 'Contact Name', name: 'ContactName', width: 150 },
            { label: 'Phone', name: 'Phone', width: 150 },
            { label: 'City', name: 'City', width: 150 }
        ],
        loadonce : true,
        width: 780,
        height: 230,
        multiselect : true,// 多选
        // cellEdit: true, // 点击单元格跟点击多选框触发不同事件
        rowNum: 10,
        subGrid: true, // 首先必须将jqGrid的subGrid选项设置为true，默认为false；当此项设为true的时候，Grid表格的最左边将会添加一列，里面有一个“+”图标，用于展开子格；
        subGridRowExpanded: showChildGrid, // 当点击“+”展开子表格时，将触发此选项定义的事件方法；
        subGridOptions : {
            // 设置为false，展开时仅加载一次数据，随后的点击图标点击操作只是显示或者隐藏子表格，而不会再发送ajax重新获取数据
            reloadOnExpand :true,
            // 点击展开是否选中一行
            // selectOnExpand : true
        },
        pager: "#jqGridPager"
    });
});
function showChildGrid(parentRowID, parentRowKey) {
    var childGridID = parentRowID + "_table";
    var childGridPagerID = parentRowID + "_pager";

    // 获取子表数据
    $.getJSON('../../../js/demo/jqGrid-demo/subdata.json',function (data) {
        for(key in data){
            var keyVal = key;
            var val = data[keyVal];
            var arr1 = []
            for(var i = 0; i< val.length; i ++){
                if(val[i].OrderID === parentRowKey){
                    index1 = val[i].OrderID;
                    index2 = val[i].RequiredDate;
                    index3 = val[i].ShipName;
                    index4 = val[i].ShipCity;
                    index5 = val[i].Freight;
                    arr = [{OrderID:index1,RequiredDate:index2,ShipName:index3,ShipCity:index4,Freight:index5}];
                    arr1.push(arr)
                }
            }
        }
        // 子表格数据显示，用addRowData
        for ( var i = 0; i < arr1.length; i++){
            jQuery("#" + childGridID).jqGrid('addRowData', i + 1, arr1[i]);
        }
    })

    // 子表格追加到父级表格下
    $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class=scroll></div>');

    // 子表
    $("#" + childGridID).jqGrid({
        datatype:'local',
        // page: 1,
        colNames : [ 'OrderID', 'RequiredDate', 'ShipName', 'ShipCity', 'Freight'],
        colModel: [
            { label: 'Order ID', name: 'OrderID',index: 'OrderID', key: true, width: 75 },
            { label: 'Required Date', name: 'RequiredDate',index: 'RequiredDate',width: 100 },
            { label: 'Ship Name', name: 'ShipName',index: 'ShipName', width: 100 },
            { label: 'Ship City', name: 'ShipCity',index: 'ShipCity', width: 100 },
            { label: 'Freight', name: 'Freight',index: 'Freight', width: 75 }
        ],
        loadonce: true,
        width: 500,
        height: '100%',
        // pager: "#" + childGridPagerID
    });
}

$(function () {
    /*代码块高亮显示*/
    // CodeMirror.commands.save = function(){alert("Saving");};
    CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
        keyMap: "vim",
        theme: "rubyblue"
    });
});