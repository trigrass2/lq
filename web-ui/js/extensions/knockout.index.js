
(function ($) {
    ko.bindingViewModel = function (data) {

        var self = this;

        this.queryCondition = ko.mapping.fromJS(data.search);
        this.defaultQueryParams = {
            queryParams: function (param) {
                var params = $.extend({}, param, self.queryCondition || {});
                return params;
            }
        };        

        var tableParams = $.extend({}, this.defaultQueryParams, data.bootstrapTable || {});
        tableParams.url = data.url;

        this.bootstrapTable = new ko.bootstrapTableViewModel(tableParams);
        
        //清空事件
        this.clearClick = function () {
            $.each(self.queryCondition, function (key, value) {
                //只有监控属性才清空
                if (typeof (value) == "function") {
                    this(''); //value('');
                }
            });
            self.bootstrapTable.refresh();
        };

        //查询事件
        this.queryClick = function () {
            self.bootstrapTable.refresh();
        };

        //新增事件
        this.addClick = function () {
            var addDefault = {
                title: "新增",
                refresh: function () {
                    self.bootstrapTable.refresh();
                },
                hidden: function () {
                    //关闭弹出框的时候清除绑定(这个清空包括清空绑定和清空注册事件)
                    ko.cleanNode(window.top.document.getElementById("formEdit"));
                },
                show: function (event) {

                }
            };
            var params = $.extend({}, addDefault, data.add || {});
            window.top.$.modal(params);
        };

        //编辑事件
        this.editClick = function () {
            var rows = self.bootstrapTable.getSelections();
            if (rows.length < 1) {
                window.top.toastr.info("没有选择的数据！")
                return;
            }
            if (rows.length > 1) {
                window.top.toastr.warning("只能选择一条数据！");
                return;
            }
            var editDefault = {
                title: "编辑",
                data: rows[0],
                refresh: function () {
                    self.bootstrapTable.refresh();
                },
                hidden: function () {
                    //关闭弹出框的时候清除绑定(这个清空包括清空绑定和清空注册事件)
                    ko.cleanNode(window.top.document.getElementById("formEdit"));
                },
                show: function (event) {
                }
            };
            var params = $.extend({}, editDefault, data.edit || {});
            window.top.$.modal(params);
        };

        //删除事件
        this.deleteClick = function () {
            var rows = arrselectedData = self.bootstrapTable.getSelections();
            if (rows.length < 1) {
                window.top.toastr.info("没有选择的数据！");
                return;
            }

            var defaultOk = function () {
                var ids = [];
                $.each(rows, function (index, row) {
                    ids.push(row[data.idField]);
                });
                $.ajax({
                    type: "DELETE",
                    url: data.url,
                    data: JSON.stringify(ids),
                    contentType: "application/json",
                    success: function (data) {
                        self.bootstrapTable.refresh();

                        window.top.swal({
                            title: "删除成功！",
                            text: "数据已经删除。",
                            type: "success",
                            confirmButtonText: "关闭",
                            confirmButtonClass: "btn-success"
                        });
                    },
                    error: function (e) {
                        window.top.swal({
                            title: "删除失败！",
                            text: "该数据已被使用.",
                            type: "error",
                            confirmButtonText: "关闭",
                            confirmButtonClass: "btn-danger"
                        });
                    }
                });
            };
            if (data.del && data.del.ok) {
                defaultOk = data.del.ok;
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
            }, defaultOk);
        };

        if(data.domEvent){
            $.each(data.domEvent, function (key, value) {
                self[key] = value;
            });
        }

        if (data.bindId) {
            ko.applyBindings(self,document.getElementById(data.bindId));
        }
        else {
            ko.applyBindings(self);
        }
    };

    
})(jQuery);