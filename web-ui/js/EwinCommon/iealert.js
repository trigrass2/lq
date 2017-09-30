/*
 * IE Alert! jQuery plugin
 * version 1
 * author: David Nemes http://nmsdvid.com
 * http://nmsdvid.com/iealert/
 */

(function($){

function initialize($obj, support, title, text,isIE){

		var panel = "<span>"+ title +"</span>"
				  + "<p> "+ text +"</p>"
			      + "<div class='browser'>"
			      + "<ul>"
			      + "<li><a class='chrome' href='https://www.google.com/chrome/' target='_blank'></a></li>"
			      + "<li><a class='firefox' href='http://www.mozilla.org/en-US/firefox/new/' target='_blank'></a></li>"
			      + "<li><a class='ie9' href='http://windows.microsoft.com/en-US/internet-explorer/downloads/ie/' target='_blank'></a></li>"
			      + "<li><a class='safari' href='http://www.apple.com/safari/download/' target='_blank'></a></li>"
			      + "<li><a class='opera' href='http://www.opera.com/download/' target='_blank'></a></li>"
			      + "<ul>"
			      + "</div>"; 

		var overlay = $("<div id='ie-alert-overlay'></div>");
		var iepanel = $("<div id='ie-alert-panel'>"+ panel +"</div>");

		var docHeight = $(document).height();

		overlay.css("height", docHeight + "px");


		if (support === "ie8") { 			// shows the alert msg in IE8, IE7, IE6
		
			if (parseInt(myBrowser().substr(2)) < 10) {
				$obj.prepend(iepanel);
				$obj.prepend(overlay);

			}

			if ( parseInt(myBrowser().substr(2)) === 6) {

				
				$("#ie-alert-panel").css("background-position","-626px -116px");
				$obj.css("margin","0");
  
			}
			if(parseInt(myBrowser().substr(2)) >= 10){

      }


		} else if (support === "ie7") { 	// shows the alert msg in IE7, IE6
			
			if ( parseInt(myBrowser()) < 8) {
				
				$obj.prepend(iepanel);
				$obj.prepend(overlay);
			}
			
			if ( parseInt(myBrowser()) === 6) {
				
				$("#ie-alert-panel").css("background-position","-626px -116px");
				$obj.css("margin","0");
  
			}
			
		} else if (support === "ie6") { 	// shows the alert msg only in IE6
			
			if (isIE  && parseInt($.browser.version, 10) < 7) {
				
				$obj.prepend(iepanel);
				$obj.prepend(overlay);
				
  				$("#ie-alert-panel").css("background-position","-626px -116px");
				$obj.css("margin","0");
				
			}
		}

}; //end initialize function


	$.fn.iealert = function(options){
		var defaults = { 
			support: "ie8",  // ie8 (ie6,ie7,ie8), ie7 (ie6,ie7), ie6 (ie6)
			title: "\u4F60\u77E5\u9053\u4F60\u7684Internet Explorer\u662F\u8FC7\u65F6\u4E86\u5417?", // title text
			text: "\u4E3A\u4E86\u5F97\u5230\u6211\u4EEC\u7F51\u7AD9\u6700\u597D\u7684\u4F53\u9A8C\u6548\u679C,\u6211\u4EEC\u5EFA\u8BAE\u60A8\u5347\u7EA7\u5230\u6700\u65B0\u7248\u672C\u7684Internet Explorer\u6216\u9009\u62E9\u53E6\u4E00\u4E2Aweb\u6D4F\u89C8\u5668.\u4E00\u4E2A\u5217\u8868\u6700\u6D41\u884C\u7684web\u6D4F\u89C8\u5668\u5728\u4E0B\u9762\u53EF\u4EE5\u627E\u5230.<br /><br />"
		};
		
		
		var option = $.extend(defaults, options);
			return this.each(function(){
			  if(myBrowser()){
          if ( myBrowser().toString().indexOf('IE') > -1) {
            var $this = $(this);
            initialize($this, option.support, option.title, option.text);
          } //if ie
          else{

          }
        }
        else{

        }
			});
	};

  function myBrowser(){
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
    var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
    var isSafari = userAgent.indexOf("Safari") > -1; //判断是否Safari浏览器
    if (isIE) {
      var IE5 = IE55 = IE6 = IE7 = IE8 = IE9 = false;
      var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
      reIE.test(userAgent);
      var fIEVersion = parseFloat(RegExp["$1"]);
      IE55 = fIEVersion == 5.5;
      IE6 = fIEVersion == 6.0;
      IE7 = fIEVersion == 7.0;
      IE8 = fIEVersion == 8.0;
      IE9 = fIEVersion == 9.0;
      if (IE55) {
        return "IE5";
      }
      if (IE6) {
        return "IE6";
      }
      if (IE7) {
        return "IE7";
      }
      if (IE8) {
        return "IE8";
      }
      if (IE9) {
        return "IE9";
      }
    }//isIE end
    if (isFF) {
      return "FF";
    }
    if (isOpera) {
      return "Opera";
    }
  }
})(jQuery);
