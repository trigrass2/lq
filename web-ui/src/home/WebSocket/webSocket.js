var stompClient = null;

$(function(){
//    if ('WebSocket' in window) {
//        alert("WebSocket");
//        websocket = new WebSocket("ws://localhost:8081/veg");
//    } else if ('MozWebSocket' in window) {
//        alert("MozWebSocket");
//        websocket = new MozWebSocket("ws://veg");
//    } else {
//        alert("SockJS");
//        websocket = new SockJS("http://localhost:8081/com/veg");
//    }
//    websocket.onopen = function (evnt) {
//        $("#opcServer").html("连接服务器成功!")
//         send();
//    };
//    websocket.onmessage = function (evnt) {
//        $("#opcServer").html($("#opcServer").html() + "<br/>" + evnt.data);
//    };
//    websocket.onerror = function (evnt) {
//    };
//    websocket.onclose = function (evnt) {
//        $("#opcServer").html("与服务器断开了链接!")
//    }
//    function send(){
//        if (websocket != null) {
//            websocket.send("客户端请求");
//        } else {
//            alert('未与服务器链接.');
//        }
//    }
//    var websocket = new SockJS(apiUrl + "/websocket");
//  websocket.onopen = function (evnt) {
//  $("#opcServer").html("连接服务器成功!")
//   send();
//};
//websocket.onmessage = function (evnt) {
//  $("#opcServer").html($("#opcServer").html() + "<br/>" + evnt.data);
//};
//websocket.onerror = function (evnt) {
//};
//websocket.onclose = function (evnt) {
//  $("#opcServer").html("与服务器断开了链接!")
//}
//function send(){
//  if (websocket != null) {
//      websocket.send("客户端请求");
//  } else {
//      alert('未与服务器链接.');
//  }
//}
});

function setConnected(connected) {
    document.getElementById('connect').disabled = connected;
    document.getElementById('disconnect').disabled = !connected;
    document.getElementById('conversationDiv1').style.visibility = connected ? 'visible' : 'hidden';
    document.getElementById('conversationDiv2').style.visibility = connected ? 'visible' : 'hidden';
    $('#response').html();
}

function connect() {
	var accountId = sessionStorage.getItem('userId');
//	alert(accountId);
	var socket = new SockJS(apiUrl + '/endpoint');
//	var socket = new SockJS(apiUrl + '/topic/getMessage');
    stompClient = Stomp.over(socket);
    stompClient.connect({accountId:accountId}, function(frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
//      stompClient.subscribe('/topic/getMessage', function(respnose){
//          showResponse(JSON.parse(respnose.body).results);
//      });
         stompClient.subscribe('/user/' + accountId + '/getMessage', function(respnose){
            showResponse(JSON.parse(respnose.body).results);
        });
    });
}

function disconnect() {
    if (stompClient != null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function StrtOpc() {
    stompClient.send("/OpcAuto", {}, "start");
}

function EndOpc() {
    stompClient.send("/OpcAuto", {}, "end");
}

function sendName() {
    var name = $('#name').val();
    stompClient.send("/welcome", {}, JSON.stringify({ 'name': name }));
}

function showResponse(message) {
      var response = $("#responseOpc");
      response.append("<p>" + message + "</p>");
}