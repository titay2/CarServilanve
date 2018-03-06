(function() {
	'use strict';
 
	angular
		.module('app')
 		.controller('MessageCtrl', MessageCtrl)

		 MessageCtrl.$inject = ['apiService', '$scope', '$state'];

 		function MessageCtrl(apiService, $scope, $state) {
			$(document).ready(function() {
 				$("#grid").kendoGrid({
					dataSource:{
						transport:{
							read:{
								url:"http://localhost:52273/api/StandardTextMessages",
								data:{ format: "json"},
								dataType: "json",
							}
						},
						schema: {
							model: {
								id:"id",
								fields: {
					  			id: { type :"text"},
					  			text: {type : "text" },
					  			creationdate: {type: "date" }
								}
							}
						}
					},
					columns:[	
		  				{ field: "id", title: "ID", width: 60}, 
		  				{ field: "text", title: "Text", width: 600}, 
		  				{ field: "creationdate", title: "Date", format:"{0: dd/MM/yyyy h:mm}"},
		 			],
        			scrollable: true,
					detailInit: detailInit,
					resizable: true,
					sortable:true
				});
			});

			function detailInit(e) {
				$("<div/>").appendTo(e.detailCell).kendoGrid({
					
					dataSource: {
						transport: {
							read:{
								url:"http://localhost:52273/api/StandardTextMessages/"+ e.data.id ,
								data:{ format: "json"},
								dataType: "json",
							}
						},
						schema: {
							model: {
								id:"id",
								fields: {
					  			id: { type :"text"},
					  			text: {type : "text" },
					  			creationdate: {type: "date" }
								}
							}
						}
						//serverPaging: true,
						//serverSorting: true,
						//serverFiltering: true,
					
						//filter: { field: "id", operator: "eq", value: e.data.id }
					},
					scrollable: false,
					sortable: true,
					pageable: false,
					toolbar: ['create'],
					columns: [
						{ field: "id", title:"id"}, 
		  				{ field: "text",title:"vehicle"}, 
		  				{ field: "creationdate",title:"send time", format: "{0: dd/MM/yyyy h:mm}"},
		  				{ command:  ["edit", "destroy"], title: "&nbsp;"}
						
					]
				});
			}
		}
}());