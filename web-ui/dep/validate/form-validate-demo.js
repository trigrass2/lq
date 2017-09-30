//以下为修改jQuery Validation插件兼容Bootstrap的方法，没有直接写在插件中是为了便于插件升级
$.validator.setDefaults({
    highlight: function (element) {
        $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
    },
    success: function (element) {
        element.closest('.form-group').removeClass('has-error').addClass('has-success');
    },
    errorElement: "span",
    errorPlacement: function (error, element) {
        if (element.is(":radio") || element.is(":checkbox")) {
            error.appendTo(element.parent().parent().parent());
        } else {
            error.appendTo(element.parent());
        }
    },
    errorClass: "help-block m-b-none",
    validClass: "help-block m-b-none"


});
//检测手机号是否正确
jQuery.validator.addMethod("isMobile", function(value, element) {
    var length = value.length;
    var regPhone = /^1([3578]\d|4[57])\d{8}$/;
    return this.optional(element) || ( length == 11 && regPhone.test( value ) );
}, "请正确填写您的手机号码");
//字母数字
jQuery.validator.addMethod("isAlNum", function(value, element) {
    return this.optional(element) || /^[a-zA-Z0-9]+$/.test(value);
},"只能包括英文字母和数字");
//检测邮政编码
jQuery.validator.addMethod("isZipCode", function(value, element) {
    var tel = /^[0-9]{6}$/;
    return this.optional(element) || (tel.test(value));
}, "请正确填写您的邮政编码");
//检测用户姓名是否为汉字
jQuery.validator.addMethod("isChar", function(value, element) {
    var length = value.length;
    var regName = /[^\u4e00-\u9fa5]/g;
    return this.optional(element) || !regName.test( value );
}, "请正确格式的姓名(暂支持汉字)");
// 编号允许输入英文、数字、中划线-、下环线_、和反斜杠\、/
jQuery.validator.addMethod('isWordChar',function (value,element) {
    var text = /^[a-zA-Z0-9_\\/-]+$/;
    return this.optional(element) || (text.test(value));
},'请输入英文、数字、_、-、/、\\')

//以下为官方示例
$().ready(function () {
    // validate the comment form when it is submitted
    $("#commentForm").validate();

    // validate signup form on keyup and submit
    var icon = "<i class='fa fa-times-circle'></i> ";
    $("#signupForm").validate({
        rules: {
            firstname: "required",
            lastname: "required",
            username: {
                required: true,
                minlength: 2
            },
            password: {
                required: true,
                minlength: 5
            },
            confirm_password: {
                required: true,
                minlength: 5,
                equalTo: "#password"
            },
            email: {
                required: true,
                email: true
            },
            topic: {
                required: "#newsletter:checked",
                minlength: 2
            },
            agree: "required"
        },
        messages: {
            firstname: icon + "请输入你的姓",
            lastname: icon + "请输入您的名字",
            username: {
                required: icon + "请输入您的用户名",
                minlength: icon + "用户名必须两个字符以上"
            },
            password: {
                required: icon + "请输入您的密码",
                minlength: icon + "密码必须5个字符以上"
            },
            confirm_password: {
                required: icon + "请再次输入密码",
                minlength: icon + "密码必须5个字符以上",
                equalTo: icon + "两次输入的密码不一致"
            },
            email: {
                required: icon + "请输入您的E-mail",
                email: icon + "必须输入正确格式的电子邮件"
            },
            // email: icon + "请输入您的E-mail",
            agree: {
                required: icon + "必须同意协议后才能注册",
                element: '#agree-error'
            }
        }
    });

    // propose username by combining first- and lastname
    $("#username").focus(function () {
        var firstname = $("#firstname").val();
        var lastname = $("#lastname").val();
        if (firstname && lastname && !this.value) {
            this.value = firstname + "." + lastname;
        }
    });

    /*通用验证*/
    var validateList={
        rules: {
            requiredForm: "required",
            digitsForm: {
                required: true,
                digits: true
            },
            numberForm: {
                required: true,
                number: true
            },
            isMobileForm: {
                required: true,
                isMobile:true
            },
            isAlNumForm: {
                required: true,
                isAlNum:true
            },
            isWordCharForm: {
                required: true,
                isWordChar:true
            },
            firstname: "required",
            lastname: "required",
            username: {
                required: true,
                minlength: 2
            },
            gPassword: {
                required: true,
                minlength: 5
            },
            gConfirm_password: {
                required: true,
                minlength: 5,
                equalTo: "#gPassword"
            },
            email: {
                required: true,
                email: true
            },
            topic: {
                required: "#newsletter:checked",
                minlength: 2
            },
            agree: "required"
        },
        messages: {
            requiredForm:  icon + "必填",
            digitsForm: {
                required: icon + "必填",
                digits: icon + "请输入整数"
            },
            numberForm: {
                required: icon + "必填",
                number: icon + "请输入合法的正负数包含小数点"
            },
            isMobileForm:{
                required:icon + "请填写手机号码",
                isMobile:icon + "请填写11位的手机号码"
            },
            isAlNumForm: {
                required:icon +  "必填",
                isAlNum:icon + "请填写数字或字母"
            },
            isWordCharForm: {
                required:icon +  "必填",
                isWordChar:icon + "请输入英文、数字、_、-、/、\\"
            },
            firstname: icon + "请输入你的姓",
            lastname: icon + "请输入您的名字",
            username: {
                required: icon + "请输入您的用户名",
                minlength: icon + "用户名必须两个字符以上"
            },
            gPassword: {
                required: icon + "请输入您的密码",
                minlength: icon + "密码必须5个字符以上"
            },
            gConfirm_password: {
                required: icon + "请再次输入密码",
                minlength: icon + "密码必须5个字符以上",
                equalTo: icon + "两次输入的密码不一致"
            },
            email: {
                required: icon + "请输入您的E-mail",
                email: icon + "必须输入正确格式的电子邮件"
            },
            // email: icon + "请输入您的E-mail",
            agree: {
                required: icon + "必须同意协议后才能注册",
                element: '#agree-error'
            }
        }
    };
    var $globalForm=$('form[id^="globalForm"]');
    $globalForm.validate(validateList);

    var $globalFormChild=$('form[id^="globalFormChild"]');
    $globalFormChild.validate(validateList);

    var $globalForm1=$('form[id^="globalForm1"]');
    $globalForm1.validate(validateList);
    var $globalForm2=$('form[id^="globalForm2"]');
    $globalForm2.validate(validateList);
    var $globalForm3=$('form[id^="globalForm3"]');
    $globalForm3.validate(validateList);


});
