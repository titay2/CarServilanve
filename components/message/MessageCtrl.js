(function() {
	'use strict';
 
	angular
		.module('app')
 		.controller('MessageCtrl', MessageCtrl);

		 MessageCtrl.$inject = ['apiService', 'translateService', '$scope', '$state', '$translate'];

 		function MessageCtrl(apiService, translateService, $scope, $state, $translate) {
			//translateService.setLanguage();

			$(document).ready(function() {

				// var nom = "tehetena"
				// var msg= "hello"
				
			    // var hubUrl ="http://127.0.0.1:8088/";
				
				// var connection = $.hubConnection(hubUrl, { useDefaultPath: true});
				// var hub = connection.createHubProxy("MyHub");

				// hub.on('addMessage', function(name, message){
				// 	console.log( name + ' said ' + message)
				// })
				
				
				// connection.start()
				
				// 	//.done(function(){ console.log(' connected!! connection ID=' + connection.id); })
				// 	.done(function (){
				// 		hub.invoke('Send',nom, msg )
				// 	})
					
				// 	.fail(function(error){ console.log('Could not connect!!' + error); });

				const connection = new signalR.HubConnection('http://localhost:52273/logNotifierHub');
				const button = document.getElementById("startStreaming");
			
				function startStreaming() {
					connection.stream("StartStreaming").subscribe({
						next: onStreamReceived,
						err: function (err) {
							Console.log(err);
						},
						complete: function () {
							console.log("Finished streeming");
						}
					});
				}
				connection.on("streamStarted", function () {
					startStreaming();
				});
			
				button.addEventListener("click", event => {
					connection.invoke("sendStreamInit");
				});
			
				function onStreamReceived(data) {
					console.log("received: " + data);
					const liElement = document.createElement('li');
					liElement.innerHTML = '<strong>' + "received" + '</strong>:&nbsp;&nbsp;' + data;
					document.getElementById('messages').appendChild(liElement);
				}
			
				connection.start({ jsonp: true })




		
			});

			
		}
}());


