var broadcostStompClient = null;
var userStompClient = null;
var opcStompClient = null;

//广播订阅
function setBroadcostConnected(connected) {
    document.getElementById('connectBroadcost').disabled = connected;
    document.getElementById('disconnectBroadcost').disabled = !connected;
    document.getElementById('conversationDiv1').style.visibility = connected ? 'visible' : 'hidden';
    $('#responseBroadcost').html('');
}
function connectBroadcost() {
	var socket = new SockJS(apiUrl + '/endpoint');
	broadcostStompClient = Stomp.over(socket);
	broadcostStompClient.connect('', '', function(frame) {
		setBroadcostConnected(true);
        console.log('Connected: ' + frame);
        broadcostStompClient.subscribe('/topic/getMessage', function(respnose){
        	showBroadcostResponse(JSON.parse(respnose.body).results);
        });
    });
}
function disconnectBroadcost() {
    if (broadcostStompClient != null) {
    	broadcostStompClient.disconnect();
    }
    setBroadcostConnected(false);
    $('#name').val('');
    console.log("Disconnected");
}
function sendBroadcost() {
    var name = $('#name').val();
    broadcostStompClient.send("/broadcostMsg", {}, JSON.stringify({ 'name': name }));
}
function showBroadcostResponse(message) {
    var response = $("#responseBroadcost");
    response.append("<p>" + message + "</p>");
}

//用户订阅
function setUserConnected(connected) {
    document.getElementById('connectUser').disabled = connected;
    document.getElementById('disconnectUser').disabled = !connected;
    document.getElementById('conversationDiv2').style.visibility = connected ? 'visible' : 'hidden';
    $('#responseUser').html('');
}
function connectUser() {
	var sendUser = $('#sendUser').val();
	if(sendUser == ''){
		alert('发件人不能为空！');
		return;
	}
	var socket = new SockJS(apiUrl + '/endpoint');
	userStompClient = Stomp.over(socket);
	userStompClient.connect({accountId:sendUser}, function(frame) {
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
    $('#receiveUser').val('');
    $('#msg').val('');
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

//Opc采集
function setOpcConnected(connected) {
    document.getElementById('connectOpc').disabled = connected;
    document.getElementById('disconnectOpc').disabled = !connected;
    document.getElementById('conversationDiv3').style.visibility = connected ? 'visible' : 'hidden';
    $('#responseOpc').html('');
}
function connectOpc() {
	var socket = new SockJS('http://127.0.0.1:8081/ewap-auth' + '/endpoint');
	opcStompClient = Stomp.over(socket);
	opcStompClient.connect('', '', function(frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        opcStompClient.subscribe('/opc/getItemMessage', function(respnose){
        	showOpcResponse(JSON.parse(respnose.body).results);
        });
    });
}
function disconnectOpc() {
    if (opcStompClient != null) {
    	opcStompClient.disconnect();
    }
    setConnectedOpc(false);
    console.log("Disconnected");
}
function StartOpc() {
	opcStompClient.send("/OpcAuto", {}, "start");
}
function EndOpc() {
	opcStompClient.send("/OpcAuto", {}, "end");
}
function showOpcResponse(message) {
    var response = $("#responseOpc");
    response.append("<p>" + message + "</p>");
}

setBroadcostConnected(false);
setUserConnected(false);
setOpcConnected(false);
