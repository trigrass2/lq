
//本系统里面的搜索折叠功能

var searchCondition = {
    strBodyno: '',
    strEndBodyno: '',
    strVin: '',
    strEndVin: '',
    strOrderno: '',
    strEngincode: '',
    strOrderstatus: '',
    strTranscode: '',
    strVms: '',
    strEndVms: '',
    strCarcode: '',
    strImportStartdate: '',
    strImportEnddate: '',
    strSendStartdate: '',
    strSendEnddate: '',
    strPlanStartdate: '',
    strPlanEnddate: '',
    strOrdertype: '',
    strOrderstage: ''
};
$(function () {

    //搜索栏查询收起点击事件
    $("#btn_condition").click(function () {
        //if ($(this).text() == "收起") {
        //    $(this).html('查询<label class="glyphicon glyphicon-menu-down"></label>');
        //    $("#div_more_search").collapse('hide');
        //}
        //else {
        //    $(this).html('收起<label class="glyphicon glyphicon-menu-up"></label>');
        //    $("#div_more_search").collapse('show')
        //}
        //$("#QueryModal").modal();
        var url = $("#input_hidden").length > 0 ? "/APS/Order/SearchCondition" : "/APS/Order/SearchCondition2";
        window.top.$.modal({
            title: "查询条件",
            url: url,
            size: "large",
            backdrop: true,
            data: searchCondition,
            refresh: function (param) {
                debugger;
                var target = $(param);
                searchCondition.strBodyno = $(target).find("#txt_search_bodynumber").val();
                searchCondition.strVin = $(target).find("#txt_search_vinnumber").val();
                searchCondition.strOrderno = $(target).find("#txt_search_ordernumber").val();
                //searchCondition.strEngincode = $(target).find("#txt_search_engin_code").val();
                searchCondition.strOrderstatus = $(target).find("#sel_search_orderstatus").val();
                //searchCondition.strTranscode = $(target).find("#txt_search_trans_code").val();
                searchCondition.strVms = $(target).find("#txt_search_VMSnumber").val();
                searchCondition.strCarcode = $(target).find("#txt_search_carcode").val();
                searchCondition.strImportStartdate = $(target).find("#txt_search_import_startdate").val();
                searchCondition.strImportEnddate = $(target).find("#txt_search_import_enddate").val();
                searchCondition.strSendStartdate = $(target).find("#txt_search_send_startdate").val();
                searchCondition.strSendEnddate = $(target).find("#txt_search_send_enddate").val();
                searchCondition.strPlanStartdate = $(target).find("#txt_search_plan_startdate").val();
                searchCondition.strPlanEnddate = $(target).find("#txt_search_plan_enddate").val();
                searchCondition.strOrdertype = $(target).find("#sel_search_ordertype").val();
                searchCondition.strOrderstage = $(target).find("#sel_search_orderstage").val();
                searchCondition.strEndBodyno = $(target).find("#txt_search_Endbodynumber").val();
                searchCondition.strEndVin = $(target).find("#txt_search_Endvinnumber").val();
                searchCondition.strEndVms = $(target).find("#txt_search_EndVMSnumber").val();
                $("#tb_order").bootstrapTable("refresh", {
                    query: searchCondition
                });
            }
        });
    });
})