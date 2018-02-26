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
		  				{ field: "creationdate", title: "Date", width: 200},
		 			],
        			scrollable: true,
					detailInit: detailInit
				});
			});

			function detailInit(e) {
				$("<div/>").appendTo(e.detailCell).kendoGrid({
					dataSource: {
						type: "json",
						transport: {
							read:{
								url:"http://localhost:52273/api/StandardTextMessages",
								data:{ format: "json"},
								dataType: "json",
							}
						},
						serverPaging: true,
						serverSorting: true,
						serverFiltering: true,
						pageSize: 10,
						filter: { field: "id", operator: "eq", value: e.data.id }
					},
					scrollable: false,
					sortable: true,
					pageable: true,
					columns: [
						{ field: "id", width: "110px" },
						{ field: "text", title:"text", width: "410px" },
						{ field: "creationdate", title: "date", width: "150px" }
					]
				});
			}
		}
}());