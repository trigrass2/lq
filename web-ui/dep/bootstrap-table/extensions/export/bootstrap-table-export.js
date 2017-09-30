/**
 * @author zhixin wen <wenzhixin2010@gmail.com>
 * extensions: https://github.com/kayalshri/tableExport.jquery.plugin
 */

(function ($) {
    'use strict';
    var sprintf = $.fn.bootstrapTable.utils.sprintf;

    var TYPE_NAME = {
        json: 'JSON',
        xml: 'XML',
        png: 'PNG',
        csv: 'CSV',
        txt: 'TXT',
        sql: 'SQL',
        doc: 'MS-Word',
        excel: 'MS-Excel',
        xlsx: 'MS-Excel (OpenXML)',
        powerpoint: 'MS-Powerpoint',
        pdf: 'PDF'
    };

    $.extend($.fn.bootstrapTable.defaults, {
        showExport: false,
        exportDataType: 'basic', // basic, all, selected
        // 'json', 'xml', 'png', 'csv', 'txt', 'sql', 'doc', 'excel', 'powerpoint', 'pdf'
        exportTypes: ['json', 'xml', 'csv', 'txt', 'sql', 'excel'],
        exportOptions: {}
    });

    $.extend($.fn.bootstrapTable.defaults.icons, {
       export: 'glyphicon-export icon-share'
    });

    $.extend($.fn.bootstrapTable.locales, {
        formatExport: function () {
            return 'Export data';
        }
    });
    $.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales);

    var BootstrapTable = $.fn.bootstrapTable.Constructor,
        _initToolbar = BootstrapTable.prototype.initToolbar;

    BootstrapTable.prototype.initToolbar = function () {
        this.showToolbar = this.options.showExport;   //判断是否显示table自带工具栏  如需显示 取消注释即可
        var exportButton = this.options.exportButton;
        _initToolbar.apply(this, Array.prototype.slice.apply(arguments)); //判断是否显示table自带工具栏  如需显示 取消注释即可

        if (this.options.showExport) {
            var that = this,
                $btnGroup = this.$toolbar.find('>.btn-group'),
                $export = $btnGroup.find('div.export');//

            if (this.options.initExport){ //判断是否需要注册导出按钮click 事件
            	exportButton.click(function(){
                	var type = "excel",//$(this).data('type'),  默认excel
                    doExport = function () {
                        that.$el.tableExport($.extend({}, that.options.exportOptions, {
                            type: type,
                            escape: false
                        }));
                    };
	                if (that.options.exportDataType === 'all' && that.options.pagination) {
	                    that.$el.one(that.options.sidePagination === 'server' ? 'post-body.bs.table' : 'page-change.bs.table', function () {
	                        doExport();
	                        that.togglePagination();
	                    });
	                    that.togglePagination();
	                } else if (that.options.exportDataType === 'selected') {
	                    var data = that.getData(),
	                        selectedData = that.getAllSelections();
	
	                    if (that.options.sidePagination === 'server') {
	                        data = {total: that.options.totalRows};
	                        data[that.options.dataField] = that.getData();
	
	                        selectedData = {total: that.options.totalRows};
	                        selectedData[that.options.dataField] = that.getAllSelections();
	                    }
	
	                    that.load(selectedData);
	                    doExport();
	                    that.load(data);
	                } else {
	                    doExport();
	                }
                });
            }        
        }
    };
})(jQuery);