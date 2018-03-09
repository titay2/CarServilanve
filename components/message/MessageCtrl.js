(function() {
	'use strict';
 
	angular
		.module('app')
 		.controller('MessageCtrl', MessageCtrl)

		 MessageCtrl.$inject = ['apiService', '$scope', '$state'];

 		function MessageCtrl(apiService, $scope, $state) {
			$(document).ready(function() {

				

				 var hubUrl ="http://localhost:52273/dbChanges";
				// //var connection = $.hubConnection(hubUrl, { useDefaultPath: true});
				// var connection = $.connection(hubUrl);
				// connection.error(function(error) {
				// 	console.warn(error);
				// });
				
				// connection.start().done(function () {
				// 	console.log("Connected, transport = " + connection.transport.name);
				// 	console.log('Now connected, connection ID=' + $.connection.hub.id); 

				// });
				var connection = $.hubConnection(hubUrl, { useDefaultPath: false});
				//var connection = $.hubConnection();

				 //var LogNotifierHub = connection.createHubProxy('LogNotifierHub');
				//  connection.on('Send', (data)=> {
				// 	 console.log(data)
				//  });
				connection.start()
					.done(function(){ console.log('Now connected, connection ID=' + connection.id); })
					.fail(function(){ console.log('Could not connect!!'); });

				
					// connection.on('broadcastMessage', (name, message) => {
					// 	var liElement = document.createElement('li');
					// 	liElement.innerHTML = '<strong>' + name + '</strong>:&nbsp;&nbsp;' + message;
					// 	document.getElementById('discussion').appendChild(liElement);
					//  });
			});

			
		}
}());


