
var userStompClient = null;

//用户订阅
function setUserConnected(connected) {
    document.getElementById('connectUser').disabled = connected;
    document.getElementById('disconnectUser').disabled = !connected;
}

function connectUser() {
	var sendUser = $('#sendUser').val();
	if(sendUser == ''){
		alert('发件人不能为空！');
		return;
	}
	var socket = new SockJS(apiUrl + '/endpoint');
	userStompClient = Stomp.over(socket);
	userStompClient.connect({user:sendUser}, function(frame) {
		setUserConnected(true);
        console.log('Connected: ' + frame);
        userStompClient.subscribe('/user/topic/greetings', function(respnose){
        	showUserResponse(JSON.parse(respnose.body).results);
        });
    });
}

function disconnectUser() {
    if (userStompClient != null) {
    	userStompClient.disconnect();
    }
    setUserConnected(false);
    console.log("Disconnected");
}

function sendUser() {
    var receiveUser = $('#receiveUser').val();
    var msg = $('#msg').val();
    userStompClient.send("/msg/getUserMsg", {}, JSON.stringify({'receiveUser':receiveUser,'msg':msg}));
}

function showUserResponse(message) {
    var response = $("#responseUser");
    response.append("<p>" + message + "</p>");
}

setUserConnected(false);
