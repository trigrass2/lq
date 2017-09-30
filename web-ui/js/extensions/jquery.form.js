//表单扩展
(function ($) {
    //序列化表单元素，返回JSON结构数据
    $.fn.serializeJson = function () {
        var data = {};
        var array = this.serializeArray();
        $(array).each(function () {
            if (data[this.name]) {
                if ($.isArray(data[this.name])) {
                    data[this.name].push(this.value);
                } else {
                    data[this.name] = [data[this.name], this.value];
                }
            } else {
                data[this.name] = this.value;
            }
        });
        return data;
    };
    //设置表单元素的值
    $.fn.value = function (data) {
        var target = this;
        $.each(data, function (name, value) {
            var $input = target.find("input[name=" + name + "]");
            if ($input.attr("type") == "radio" || $input.attr("type") == "checkbox") {
                $input.each(function () {
                    if ($(this).val() == value)
                        $(this).attr("checked", "checked");
                });
            } else {
                target.find("[name=" + name + "]").val(value);
            }
        });
    };
})(jQuery);