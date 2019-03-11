/**
 * Copyright 2019, Liwei Wang <daveywang@live.com>.
 * All rights reserved. 
 * Author: Liwei Wang
 * Date: 02/2019
 *
 */
 
var app = angular.module('restDemoApp', []);

app.run(function($rootScope) {
	$rootScope.webSocket = null;
	window.WebSocket = window.WebSocket || window.MozWebSocket;
	
	if (!window.WebSocket) {
		$('#msg_container').html('WebSocket is not supported in your browser.').show();
		return;
	}
	
	$rootScope.webSocket = new WebSocket('ws://localhost:8081/webSocket');
	
	$rootScope.webSocket.onopen = () => {
		$('#message_button').show();	
	};
	
	$rootScope.webSocket.onmessage = (messageEvent) => {
		//$('#data_container').html(messageEvent.data).show();	
		//$('#msg_container').hide();	
		popupMessage(messageEvent.data);
	};
	
	$rootScope.webSocket.onerror = (errEvent) => {
		$('#msg_container').html(JSON.stringify(errEvent)).show();
	};	
	
	$rootScope.sendMessage = () => {
		if ($rootScope.webSocket.readyState === $rootScope.webSocket.OPEN) {
			$rootScope.webSocket.send('ALERT: This is WebSocket demo. All online users will see this message.');
		}
		else {
			$('#msg_container').html('WebSocket is not open.').show();
		}	
	}

	var timer = null;

	function popupMessage(message) {
		if (message == null || message == 'null' || message == '') return;
		var showTime = 10 * 1000;
		if (showTime == 0 || message == null || message == 'null' || message == '') return;
		
		var popupMsg = document.getElementById('popup_message');	
		if (popupMsg == null) {
			popupMsg = document.createElement('div');
			popupMsg.style.display = 'none';
			popupMsg.setAttribute('id', 'popup_message');
			document.body.appendChild(popupMsg);
		}
		
		popupMsg.innerHTML = message;
		$("#popup_message").fadeIn(2000);
		
		/* clear previous timer first then setup a new timer */
		if (timer != null) clearTimeout(timer);
		timer = setTimeout(removePopupMessage, showTime);
	}
	
	function removePopupMessage() {
		var popupMsg = document.getElementById('popup_message');
		
		if (popupMsg != null) {
			 $("#popup_message").fadeOut(3000);
			/*document.body.removeChild(popupMsg);*/
		}
	}
});





















































