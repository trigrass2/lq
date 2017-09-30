(function ($) {
    'use strict';

    var BootstrapTree = function (element, options) {
        var $this = this;
        if (!$(element).hasClass('bootstrap-tree')) $(element).addClass('bootstrap-tree');
        $this.element = $(element);
        $(element).append('<div class="bootstrap-tree-loading">正在努力地加载数据中，请稍候……</div>');
        $(element).find('.bootstrap-tree-loading').show();
        $this.options = options;

        this.getSelected = BootstrapTree.prototype.getSelected;
        this.getChecked = BootstrapTree.prototype.getChecked;
        this.collapseAll = BootstrapTree.prototype.collapseAll;
        this.expandAll = BootstrapTree.prototype.expandAll;
        this.checkNode = BootstrapTree.prototype.checkNode;
        if (options.data.length > 0) {
            $this.init(options.data);
        }
        if (options.url) {
            $.ajax({
                type: options.type,
                data: options.params,
                url: options.url,
                success: function (data) {
                    $this.init(data);
                }
            });
        }
    };

    BootstrapTree.defaults = {
        type: 'GET',
        url: '',
        params: {},
        data: [],
        checkbox: false,
        collapseAll: true,
        iconLeaf: 'icon-desktop',
        iconExpand: 'icon-chevron-down',
        iconCollapse: 'icon-chevron-right',
        onSelect: function (node) { },
        onCheck: function () { },
        onLoad: function () { }
    };

    BootstrapTree.prototype = {
        constructor: BootstrapTree,
        init: function (data) {
            var $this = this;
            $this.render($this.element, data);
            $this.element.find('.bootstrap-tree-loading').hide();
            $this.onSelect();
            $($this.element).find("input[type=checkbox]").on("click", function (e) {
                e.stopPropagation();

                $this.onCheckParent($(this));
                $this.onCheckChildren($(this));
                $this.options['onCheck'].call($(this));
            });
            $this.options["onLoad"].call($this);
        },
        render: function (element, data, collapse) {
            var $this = this;
            var root = $('<ul></ul>');
            $.each(data, function (index, item) {
                var node = $('<li></li>');
                var icon = $('<i></i>');
                var span = $('<span></span>');
                if (item.Children && item.Children.length > 0) {
                    node.addClass('parent').find(' > span').attr('title', '折叠');
                    icon.addClass(item.Icon || $this.options.iconCollapse);
                }
                else {
                    icon.addClass(item.Icon || $this.options.iconLeaf);
                }
                if ($this.options.checkbox) {
                    var check = $('<input type="checkbox" />');
                    span.append(check);
                }
                span.append(icon).append(item.Text);
                node.attr('id', item.Id);

                node.append(span);
                if (item.Children && item.Children.length > 0) {
                    $this.render(node, item.Children, $this.options.collapseAll);
                }
                node.data('node.data', item.data);
                if (collapse) node.css('display', 'none');
                root.append(node);
            });
            element.append(root);
            $this.element.trigger('rendered.bs.bootstrap-tree');
        },
        onSelect: function () {
            var $this = this;
            $this.element.find('li>span').on('click', function (e) {
                e.stopPropagation();

                if (!$this.options.checkbox) {
                    $this.element.find('li>span').removeClass('badge');
                    $(this).addClass('badge');
                }
                var node = $(this).parent('li');
                var children = node.children('ul').find('>li');
                if (children.length > 0) {
                    if (children.is(':visible')) {
                        children.hide('fast');
                        $(this).attr('title', '折叠').find('>i').removeClass($this.options.iconExpand).addClass($this.options.iconCollapse);
                    } else {
                        children.show('fast');
                        $(this).attr('title', '展开').find('>i').removeClass($this.options.iconCollapse).addClass($this.options.iconExpand);
                    }
                }
                else {
                    var checkbox = $(this).find("input[type = checkbox]");
                    checkbox.prop('checked', !checkbox.is(":checked"));
                    $this.onCheckParent(checkbox);
                    $this.onCheckChildren(checkbox);
                    $this.options['onCheck'].call(checkbox);
                }
                var data = {
                    id: node.attr('id'),
                    text: $(this).text(),
                    isLeaf: !node.hasClass('parent'),
                    data: node.data('node.data')
                };
                $this.options['onSelect'].call($this, data);
                $this.element.trigger('select.bs.bootstrap-tree', data);
            });
        },
        checkNode: function (target) {
            var $this = $(this).data("bootstrap.tree");
            var checkbox = $(target).find("input[type = checkbox]");
            checkbox.prop('checked', true);
            $this.onCheckParent(checkbox);
            $this.onCheckChildren(checkbox);
            $this.options['onCheck'].call(checkbox);
        },
        onCheckParent: function (target) {
            var parent = target.parents('ul:eq(0)').parents('li:eq(0)');
            if (parent.length) {
                var checked = target.is(':checked');
                var lis = target.parents('li:eq(0)').siblings();
                $.each(lis, function (index, item) {
                    var checkbox = $(item).find('input[type=checkbox]:eq(0)');
                    if (!checkbox.is(':checked')) {
                        checked = false;
                        return false;
                    }
                });
                var checkbox = parent.find('input[type="checkbox"]:eq(0)');
                checkbox.prop('checked', checked);
                this.onCheckParent(checkbox);
            }
        },
        onCheckChildren: function (target) {
            var childrens = $('ul li input[type=checkbox]', target.parents('li:eq(0)'));
            if (childrens.length) childrens.prop('checked', target.is(':checked'));
        },
        getChecked: function () {
            var checkbox = $(this).find('input[type=checkbox]:checked');
            var nodes = [];
            $.each(checkbox, function (index, item) {
                var li = $(item).parents('li:eq(0)');
                var parent;
                if (li.parents('li:eq(0)').length > 0) {
                    parent = {
                        id: li.parents('li:eq(0)').attr("id"),
                        text: li.parents('li:eq(0)').children("span").text(),
                        data: li.parents('li:eq(0)').data('node.data'),
                    };
                }
                nodes.push({
                    id: li.attr("id"),
                    text: li.children("span").text(),
                    icon: li.children("span").children("i").attr("class"),
                    data: li.data('node.data'),
                    parent: parent
                });
            });
            return nodes;
        },
        getSelected: function () {
            var element = $(this).find('.badge');
            var node = element.parents('li:eq(0)');
            return {
                id: node.attr('id'),
                text: element.text(),
                isLeaf: !node.hasClass('parent'),
                data: node.data('node.data')
            };
        },
        expandAll: function () {
            $(this).find('li:hidden').show('fast');
        },
        collapseAll: function () {
            $(this).find('ul>li li').hide('fast');
        }
    };

    function Plugin(option, param) {
        var value,
            args = Array.prototype.slice.call(arguments, 1);
        this.each(function () {
            var $this = $(this),
                data = $this.data('bootstrap.tree'),
                options = $.extend({}, BootstrapTree.defaults, $this.data(),
                    typeof option === 'object' && option);
            if (!data) {
                $this.data('bootstrap.tree', (data = new BootstrapTree(this, options)));
            }
            if (typeof option === 'string') value = data[option].call($this, param);

        });
        return typeof value === 'undefined' ? this : value;
    }

    var old = $.fn.bootstrapTree;
    $.fn.bootstrapTree = Plugin;
    $.fn.bootstrapTree.Constructor = BootstrapTree;

    $.fn.bootstrapTree.noConflict = function () {
        $.fn.bootstrapTree = old;
        return this;
    };

    $(window).on('load.bs.bootstrap-tree.data-api', function () {
        $('.bootstrap-tree').each(function () {
            var $boostraptree = $(this);
            Plugin.call($boostraptree, $boostraptree.data());
        })
    });
})(jQuery);