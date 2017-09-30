$(function () {
    $('#tb_BOM').bootstrapTable('refresh', { url: ApiUrl + '/api/Bom/Find' });
    $('#tb_BOM').on('check.bs.table', function (row) {
        if ($('#tb_BOM').bootstrapTable('getSelections').length == 1) {
            var arrTr = $("#tb_BOM").find("tr");
            for (var i = 0; i < arrTr.length; i++) {
                $(arrTr[i]).find("input[type=checkbox]").attr("disabled", true);
                $(arrTr[i]).attr("title", "请等待BOM加载");
            }
            $('#tb_BOMDetail').bootstrapTable('refresh', { url: ApiUrl + '/api/BomDetail/FindByBOMId' });
        }
        else {
            $('#tb_BOMDetail').bootstrapTable('removeAll');
        }
    });
    $('#tb_BOM').on('uncheck.bs.table', function (row) {
        if ($('#tb_BOM').bootstrapTable('getSelections').length == 1) {
            $('#tb_BOMDetail').bootstrapTable('refresh', { url: ApiUrl + '/api/BomDetail/FindByBOMId' });
        }
        else {
            $('#tb_BOMDetail').bootstrapTable('removeAll');
        }
    });
    $('#tb_BOMDetail').on('load-success.bs.table', function (data) {
        var arrTr = $("#tb_BOM").find("tr");
        for (var i = 0; i < arrTr.length; i++) {
            $(arrTr[i]).find("input[type=checkbox]").attr("disabled", false);
            $(arrTr[i]).attr("title", "请等待BOM加载");
        }
    });
    
    $('#btn_Add1').on('click', function () {
        window.top.$.modal({
            title: '新增',
            url: '/BOM/Bom/Edit',
            refresh: function () {
                $('#tb_BOM').bootstrapTable('refresh');
            }

        });
    });
    $('#btn_Edit1').on('click', function () {
        var rows = $('#tb_BOM').bootstrapTable('getSelections');
        if (rows.length < 1) {
            window.top.toastr.info('没有选择的数据！')
            return;
        }
        if (rows.length > 1) {
            window.top.toastr.warning('只能选择一条数据！')
            return;
        }
        window.top.$.modal({
            title: '编辑',
            url: '/BOM/Bom/Edit',
            data: rows[0],
            refresh: function () {
                $('#tb_BOM').bootstrapTable('refresh');
            }
        });
    });
    $('#btn_Delete1').on('click', function () {
        var rows = $("#tb_BOM").bootstrapTable("getSelections");
        if (rows.length < 1) {
            window.top.toastr.info("没有选择的数据！");
            return;
        }
        window.top.swal({
            title: "操作提示",
            text: "确定删除吗？",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "确定删除！",
            confirmButtonClass: "btn-danger",
            cancelButtonText: "取消",
            cancelButtonClass: "btn-info",
            closeOnConfirm: false
        }, function () {
            var ids = [];
            $.each(rows, function (index, row) {
                ids.push(row.TM_BOM_ID);
            });
            $.ajax({
                type: "DELETE",
                url: ApiUrl + '/api/Bom/Delete',
                data: JSON.stringify(ids),
                contentType: "application/json",
                success: function (data) {
                    $("#tb_BOM").bootstrapTable("refresh");
                    window.top.swal({
                        title: "删除成功！",
                        text: "数据已经删除。",
                        type: "success",
                        confirmButtonText: "确定",
                        confirmButtonClass: "btn-success"
                    });
                }
            });
        });

        //var rows = $('#tb_BOM').bootstrapTable('getSelections');
        //if (rows.length < 1) {
        //    window.top.toastr.info('没有选择的数据！');
        //    return;
        //}
        //Ewin.confirm({ message: "确认要删除选择的数据吗？" }).on(function (e) {
        //    if (e) {
        //        //var keys = [];
        //        //$.each(rows, function (index, row) {
        //        //    keys.push(row.TM_BOM_ID);
        //        //});
        //        $.ajax({
        //            type: 'post',
        //            url: ApiUrl + '/api/Bom/Delete',
        //            data: { postList: rows, userId: NowUserId },
        //            //contentType: 'application/json',
        //            success: function (data) {
        //                if (data == 0) {
        //                    toastr.warning('请先删除物料信息！');
        //                    return;
        //                }
        //                $('#tb_BOM').bootstrapTable('refresh');
        //                toastr.success('删除成功！');
        //            }
        //        });
        //    }
        //});
    });
    $('#btn_Add2').on('click', function () {
        var rows = $('#tb_BOM').bootstrapTable('getSelections');
        if (rows.length != 1) {
            window.top.toastr.info('请选择一项BOM！')
            return;
        }
        
        window.top.$.modal({
            title: '新增',
            url: '/BOM/Bom/Edit2',
            data: { TM_BOM_ID: rows[0].TM_BOM_ID },
            refresh: function () {
                $('#tb_BOM').bootstrapTable('refresh');
            }
        });
    });
    $('#btn_Edit2').on('click', function () {

        var bomrows = $('#tb_BOM').bootstrapTable('getSelections');
        if (bomrows.length != 1) {
            window.top.toastr.info('请选择一项BOM！')
            return;
        }
        var rows = $('#tb_BOMDetail').bootstrapTable('getSelections');
        if (rows.length < 1) {
            window.top.toastr.info('没有选择的数据！')
            return;
        }
        if (rows.length > 1) {
            window.top.toastr.info('只能选择一条数据！')
            return;
        }
        window.top.$.modal({
            title: '编辑',
            url: '/BOM/Bom/Edit2',
            data: rows[0],
            refresh: function () {
                $('#tb_BOMDetail').bootstrapTable('refresh');
            }
            
        });
    });
    $('#btn_Delete2').on('click', function () {
        var rows = $("#tb_BOMDetail").bootstrapTable("getSelections");
        if (rows.length < 1) {
            window.top.toastr.info("没有选择的数据！");
            return;
        }
        window.top.swal({
            title: "操作提示",
            text: "确定删除吗？",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "确定删除！",
            confirmButtonClass: "btn-danger",
            cancelButtonText: "取消",
            cancelButtonClass: "btn-info",
            closeOnConfirm: false
        }, function () {
            var ids = [];
            $.each(rows, function (index, row) {
                ids.push(row.TM_BOM_DETAIL_ID);
            });
            $.ajax({
                type: "DELETE",
                url: ApiUrl + '/api/BomDetail/Delete',
                data: JSON.stringify(ids),
                contentType: "application/json",
                success: function (data) {
                    $("#tb_BOMDetail").bootstrapTable("refresh");
                    window.top.swal({
                        title: "删除成功！",
                        text: "数据已经删除。",
                        type: "success",
                        confirmButtonText: "确定",
                        confirmButtonClass: "btn-success"
                    });
                }
            });
        });
    });
    //导出
    $("#btn_export").on('click', function () {
        var arrbom = $("#tb_BOM").bootstrapTable('getSelections');
        if (arrbom.length < 1) {
            window.top.toastr.warning("请选择BOM数据");
            return;
        }
        // $("#pop").css('display', 'block');
        //ZENG.msgbox.show('正在导出，请稍后···', 6, 300000);
        //$("#btn_export").attr("disabled", true);


        var ids = [];
        $.each(arrbom, function (index, row) {
            ids.push(row.TM_BOM_ID);
        });
        $.fileDownload(ApiUrl + '/api/Bom/ExportBOM', {
            data: { "boms": JSON.stringify(ids) },
            successCallback: function (url) {
                //$("#btn_export").attr('disabled', false);
            },
            failCallback: function (html, url) {
                //$("#btn_export").attr('disabled', false);
            }
        });
        //$.ajax({
        //    type: "Post",
        //    url: ApiUrl + '/api/Bom/ExportBOM',
        //    dataType: "JSON",
        //    data: { "boms": JSON.stringify(arrbom) },
        //    success: function (data, status) {
        //        if (status == "success") {
        //            //if (data.bRes) {
        //            //    document.location.href = data.filePath;
        //            //}
        //        }
        //    },
        //    error: function (e) {
        //        toastr.warning('Error');
        //    },
        //    complete: function () {
        //        //ZENG.msgbox.hide();
        //        //$("#pop").css('display', 'none');
        //        $("#btn_export").attr('disabled', false);
        //    }
        //});
    });
    //导出问题
    $("#btn_export_error").on('click', function () {
        //var arrSelection = $("#tb_bom_import").bootstrapTable('getData');
        //$.ajax({
        //    type: "Post",
        //    url: ApiUrl + '/api/Bom/BomDetail/ExportError',
        //    dataType: "JSON",
        //    data: { "": JSON.stringify(arrSelection) },
        //    success: function (data, status) {
        //        if (status == "success") {
        //            if (data.bRes) {
        //                document.location.href = data.filePath;
        //            }
        //        }
        //    },
        //    error: function (e) {
        //        toastr.warning('Error:' + e);
        //    },
        //    complete: function () {

        //    }
        //});
    });
    //导入
    $("#btn_import").on('click', function () {
        $('#import_modal').modal({ backdrop: 'static', keyboard: false });
    });
    //导入
    $("#btn_start_import").on('click', function () {
        var arrSelection = $("#tb_bom_import").bootstrapTable('getData');
        for (var i = 0; i < arrSelection.length; i++) {
            if (arrSelection[i].IMPORT_STATUS == "failed") {
                window.top.toastr.warning('存在不可导入的编码，请处理后再导入');
                return;
            }
        }
        $("#pop").css('display', 'block');
        ZENG.msgbox.show('正在导入，请稍后···', 6, 300000);
        $.ajax({
            type: "post",
            url: ApiUrl + '/api/BOMDetail/StartImport',
            //contentType:"application/json",
            dataType: "json",
            data: { "":JSON.stringify(arrSelection)},
            success: function (data, status) {
                if (status == "success") {
                    window.top.toastr.success(data.Message);
                    $('#tb_bom_import').bootstrapTable("destroy");
                    $("#divImports").show();
                    $("#div_startimport").hide();
                    $("#toolbarI").hide();
                    $('#import_file').fileinput('clear');
                    $("#import_modal").modal('hide');
                    $("#tb_BOM").bootstrapTable('refresh');
                }
            },
            error: function (e) {
                window.top.toastr.error('Error:' + JSON.stringify(e));
            },
            complete: function () {
                ZENG.msgbox.hide();
                $("#pop").css('display', 'none');
                $("#btn_plantowms").attr("disabled", false);
            }
        });
    });
    //取消导入
    $("#btn_cancel_import").on('click', function () {
        $('#tb_bom_import').bootstrapTable("destroy");
        $("#divImports").show();
        $("#div_startimport").hide();
        $("#toolbarI").hide();
        $('#import_file').fileinput('clear');
        $("#import_modal").modal('hide');
    });
    //初始化fileinput
    var oFileInput = new FileInput();
    oFileInput.Init("import_file", ApiUrl + '/api/BOMDetail/ImportBOMDetail');

    $('#Search_TM_ULOC_ID').selectpicker({
        url: ApiUrl + '/api/Uloc/Get',
        textField: 'No',
        valueField: 'Id',
        liveSearch: true
    });
});
var queryParams = function (params) {
    var rows = $('#tb_BOM').bootstrapTable('getSelections');
    if (rows.length == 1) {
        params.id = rows[0].TM_BOM_ID;
    }
    else {
        params.id = '';
    }
    return params;
}
var bomQueryParams = function (params) {
    var part_no = $('#Search_PartNO').val();
    if (part_no) {
        params.part_no = part_no;
    }
    else {
        params.part_no = '';
    }
    var uloc_no = $('#Search_UlocNO').val();
    if (uloc_no) {
        params.uloc_no = uloc_no;
    }
    else {
        params.uloc_no = '';
    }
    return params;
}


//初始化fileinput
var FileInput = function () {
    var oFile = new Object();
    //初始化fileinput控件（第一次初始化）
    oFile.Init = function (ctrlName, uploadUrl) {
        var control = $('#' + ctrlName);

        //初始化上传控件的样式
        control.fileinput({
            language: 'zh', //设置语言
            uploadUrl: uploadUrl, //上传的地址
            allowedFileExtensions: ['xls', 'xlsx'],//接收的文件后缀
            //showUpload: false, //是否显示上传按钮
            showCaption: false,//是否显示标题
            browseClass: "btn btn-primary", //按钮样式             
            previewFileIcon: "<i class='glyphicon glyphicon-king'></i>"
        });

        //导入文件上传完成之后的事件
        control.on("fileuploaded", function (event, data, previewId, index) {
            //$("#myModal").modal("hide");
            data = data.response.lstImport;
            if (data == undefined) {
                window.top.toastr.error('文件格式类型不正确');
                return;
            }
            //1.初始化表格
            var oTable = new ImpTableInit();
            oTable.Init(data);
            $("#divImports").hide();
            $("#div_startimport").show();
            $("#toolbarI").show();
        });
    }
    return oFile;
};
//初始化导入表格
var ImpTableInit = function () {
    var oTableInit = new Object();
    oTableInit.Init = function (arrData) {
        $('#tb_bom_import').bootstrapTable("destroy");
        $('#tb_bom_import').bootstrapTable({
            height: 400,
            //url: ApiUrl + '/api/Order/OrderApi/Get',
            data: arrData,
            method: 'get',
            toolbar: '#toolbarI',
            striped: true,
            cache: false,
            pagination: true,
            sortable: true,
            queryParams: oTableInit.queryParams,
            queryParamsType: "limit",
            //ajaxOptions: { departmentname: "", statu: "" },
            //sidePagination: "client",
            pageSize: 10,
            pageList: [10, 25, 50, 100, 200, "ALL"],
            search: true,
            strictSearch: true,
            showColumns: true,
            showRefresh: true,
            minimumCountColumns: 2,
            clickToSelect: true,
            uniqueId: "IMPORT_INDEX",
            rowStyle: function (row, index) {
                var classes = [];
                if (row.IMPORT_STATUS == "failed") {
                    classes = ['danger'];
                }
                else {
                    classes = ['success'];
                    //这里的else不能省，否则报异常
                }
                return { classes: classes[0] }
            },
            columns: [
            {
                field: 'INT_NO',
                title: '序号'
            },
            {
                field: 'UlocNo',
                title: '工位'
            }, {
                field: 'PartNO',
                title: '零件编号'
            }, {
                field: 'PartName',
                title: '零件名称'
            }, {
                field: 'QTY',
                title: '工位用量'
            },
            {
                field: 'IMPORT_MESSAGE',
                title: '导入状态'
            }
            ]
        });
    };

    oTableInit.queryParams = function (params) {  //配置参数
        var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            limit: params.limit,   //页面大小
            offset: params.offset  //页码

        };
        return temp;
    };

    return oTableInit;
};