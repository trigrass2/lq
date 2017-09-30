var www_version = "2017061211333";
var webPaths = "/web-ui";
seajs.config({
    paths: {
        "depPaths": webPaths + "/dep",
        "jsPaths": webPaths + "/js"
    },
    alias: {
        "jquery": "depPaths/jquery.min.js",
        "$": "depPaths/jquery.min.js",
        "template": "depPaths/template.js",
        "jCookie": "depPaths/jquery.cookie.js",
        "jAjax": "depPaths/extensions/jquery-ajax.js",
        "bootstrap": "depPaths/bootstrap/js/bootstrap.min.js",
        "bootTable": "depPaths/bootstrap-table/bootstrap-table.min.js",
        "bootTableResetView": "depPaths/extensions/bootstrap-table-resetView.js",
        "bootTableCN": "depPaths/bootstrap-table/locale/bootstrap-table-zh-CN.js",
        "toastr": "depPaths/toastr/toastr.min.js",
        "tableExport": "depPaths/bootstrap-table/extensions/export/tableExport.js",
        "bootTableExport": "depPaths/bootstrap-table/extensions/export/bootstrap-table-export.js",
        "bootEditable": "depPaths/bootstrap3-editable/js/bootstrap-editable.js",
        "bootTableEditable": "depPaths/bootstrap-table/extensions/editable/bootstrap-table-editable.min.js",
        "bootSwitch": "depPaths/bootstrap-switch/js/bootstrap-switch.min.js",
        "layui": "depPaths/layui/layui.js",
        "xLayui": "depPaths/layui/x-layui.js",
        "bootstrapValidator": "depPaths/bootstrapValidator/js/bootstrapValidator.min.js",
        "ztree": "depPaths/zTree/js/jquery.ztree.all.min.js",
        "iCheck": "depPaths/icheck-1.x/icheck.min.js",
        "select2": "depPaths/select2-4.0.3/dist/js/select2.min.js"
    },
    map: [
        [/^(.*)\.js$/i, "$1\.js?v=" + www_version]
    ],
    charset: "utf-8"
});

/**
 * @param {String}  errorMessage   错误信息
 * @param {String}  scriptURI      出错的文件
 * @param {Long}    lineNumber     出错代码的行号
 * @param {Long}    columnNumber   出错代码的列号
 * @param {Object}  errorObj       错误的详细信息，Anything
 */
window.onerror = function (errorMessage, scriptURI, lineNumber, columnNumber, errorObj) {

    console.log(errorMessage, scriptURI, lineNumber, columnNumber, errorObj);
    console.log(errorObj+"");
    return false;
};
