(function ($) {
	"use strict";

	$.fn.select = function (options, param) {
		if (typeof options == 'string') {
			return $.fn.select.methods[options](this, param);
		}
		options = $.extend({}, $.fn.select.defaults, options || {});
		var target = $(this);
		if (!target.hasClass("selectpicker")) target.addClass("selectpicker");
		if (options.placeholder) target.attr("title", options.placeholder);
		if (options.multiple) target.attr("multiple", "multiple");
		if (options.url) {
			$.ajax({
				type: options.type,
				url: options.url,
				data: options.data,
				dataType: "JSON",
				success: function (data, textStatus, jqXHR) {
				    target.empty();
				    if (options.emptyValue) {
				        var option = $("<option></option>");
				        option.attr("value", "");
				        option.text(options.placeholder);
				        target.append(option);
				    }
					$.each(data, function (i, item) {
						var option = $("<option></option>");
						option.attr("value", item[options.value]);
						option.text(item[options.text]);
						target.append(option);
					});
					target.selectpicker(options).selectpicker("refresh");
					if (options.defaultValue) {
						target.selectpicker("val", options.defaultValue).trigger("change");
					}
				}
			});
		}
		else {
			target.selectpicker();
		}
		return target;
	};

	$.fn.select.methods = {
		data: function (target, data) {
			target.empty();
			$.each(data, function (i, item) {
				var option = $("<option></option>");
				option.attr("value", item["value"]);
				option.text(item["text"]);
				target.append(option);
			});
			target.selectpicker("refresh");
		}
	};

	$.fn.select.defaults = {
		type: "GET",
		url: null,
		data: {},
		value: "value",
		text: "text",
		defaultValue: null,
		placeholder: "请选择",
		multiple: false,
		emptyValue: false  //表示空的选择项
	};
	$(".selectpicker").each(function () {
		var target = $(this);
		target.attr("title", $.fn.select.defaults.placeholder);
		target.selectpicker();
	});
})(jQuery);