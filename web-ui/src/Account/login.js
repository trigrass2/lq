var aa= 0

$(function () {
  var dhlength = $('.dh_bg').size();
  setInterval(function(){
    $('.dh_bg').css('display','none');
    if(aa == (dhlength-1)){
      aa = 0
    }
    else{
      aa = aa + 1
    }
    $($('.dh_bg')[aa]).css('display','block');
  },2000)
  // for(var i = 0 ;i<200; i++){
  //   if(i%2 ==0){
  //     $('body').append('<div class="dh" style="float:left;width: 100px; height: 100px"></div>')
  //   }
  //   else{
  //     $('body').append('<div class="dh1" style="float:left;width: 100px; height: 100px"></div>')
  //   }
  // }
  $('#no').val(localStorage.getItem('loginUser'))
    if(localStorage.getItem('loginPass')){
      $('#password').val(localStorage.getItem('loginPass'))
    }
    $(".logingTable").css("height", $(window).height() + "px");
    window.onresize = function () {
        $(".logingTable").css("height", $(window).height() + "px");
    }
    $("#no").focus().select();
    $("#no").keydown(function (event) {
        if (event.keyCode == 13) {
            $("#no").blur();
            $('#btnLogin').trigger('click');
        }
    });
    $("#password").keydown(function (event) {
        if (event.keyCode == 13) {
            $("#password").blur();
            $('#btnLogin').trigger('click');
        }
    });
    $("#no").focus(function () {
        $("#no").select();
    });
    $("#password").focus(function () {
        $("#password").select();
    });

   toastr.options = {
        closeButton: false,
        debug: false,
        progressBar: false,
        positionClass: "toast-bottom-right",
        onclick: null,
        showDuration: "300",
        hideDuration: "1000",
        timeOut: "2000",
        extendedTimeOut: "1000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut"
    };

});

//用户登录
function login(){

	var loginUrl = apiUrl + "/system/user/login";

	var userName = $('#no').val();
	if(userName == ""){
	  $('#connount_tip').css('display','inline-block')
		// toastr.info("用户名不允许为空！");
	}
	else{
    $('#connount_tip').css('display','none')
  }
	var password = $('#password').val();
	if(password == ""){
    $('#password_tip').css('display','inline-block')
		//toastr.info("密码不允许为空！");
	}
	else{
    $('#password_tip').css('display','none')
  }

  if(password != "" && userName != ""){
    var datas={no:userName,password:password};
    datas = JSON.stringify(datas);

    $.ajax({
      type: 'POST',
      url: loginUrl,
      data: datas,
      contentType:"application/json",
      dataType: 'JSON',
      success: function (data) {
        var errcode = data.code;//在此做了错误代码的判断
        if(errcode != 10000){
          toastr.warning(data.message);
          return;
        }
//       	    alert(data.results.token);
//       	    $.cookie('token',data.results.token);
//       	    $.cookie('user',data.results);
//
//       	    alert('ddd'+$.cookie('access_token'));
        sessionStorage.setItem("token", data.results.token);
        sessionStorage.setItem("name", data.results.name);
        sessionStorage.setItem("userId", data.results.tsSysUserId);
        localStorage.setItem('loginUser',data.results.no);
        if($('#remeberMe').prop('checked') == true){
          localStorage.setItem('loginPass',$('#password').val())
        }
        else{
          localStorage.setItem('loginPass','')
        }
        //刷新订单列表
        window.location.href= "../home/Index.html";

      }
    });
  }
}
