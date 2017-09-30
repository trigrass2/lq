
(function ($) {
    ko.bindingEditViewModel = function (viewModel) {

        var that = {};

        that.editModel = ko.mapping.fromJS(viewModel.data);

        that.default = {
            message: '验证不通过',
            fields: { },
            submitHandler: function (validator, form, submitButton) {
                var arrselectedData = ko.toJS(that.editModel);
                $.ajax({
                    url: viewModel.url,
                    type: viewModel.type,
                    data: arrselectedData,
                    dataType: 'JSON',
                    success: function (data, status) {
                        $.modal('refresh');
                        toastr.success('保存成功！')
                    },
                    error: function (request, status, thrown) {
                        var errorData = JSON.parse(request.responseText);
                        var message = getExceptionData(errorData);
                        toastr.error(message);
                    }
                });
            }
        };
        that.params = $.extend({}, that.default, viewModel.validator || {});

        $('#formEdit').bootstrapValidator(that.params);

        ko.applyBindings(that, document.getElementById(viewModel.formId));
    };


})(jQuery);