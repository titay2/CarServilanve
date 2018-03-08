(function() {
	'use strict';
 
	angular
		.module('app')
 		.controller('MessageCtrl', MessageCtrl)

		 MessageCtrl.$inject = ['apiService', '$scope', '$state'];

 		function MessageCtrl(apiService, $scope, $state) {
			$(document).ready(function() {

				

				// var hubUrl = "https://demos.telerik.com/kendo-ui/service/signalr/hubs";
				// var connection = $.hubConnection(hubUrl, { useDefaultPath: false});
				
				// connection.start().done(function () {
				// 	console.log("Connected, transport = " + connection.transport.name);
				// 	console.log('Now connected, connection ID=' + $.connection.hub.id); 

				// });



			});

			
		}
}());