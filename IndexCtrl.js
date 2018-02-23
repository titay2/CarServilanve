(function () {

	'use strict';

	angular
		.module('app')
		.controller('IndexCtrl', IndexCtrl);

     IndexCtrl.$inject = [ '$scope', '$state','$translate'];

    function IndexCtrl( $scope,$translate) {

    console.log("loadded");
    }
      
    

     var root  = "http://localhost:52273/api/";
     

  
     findCallCenter();
     findArea();

    
     //fetch all call centers
     function findCallCenter() {
        $.ajax({
            url: root + "OperatingCompanies" ,
            method: "GET",
            dataType: "json", 
            success: function (data) {
               ;
                $(data).each(function () {
                  var callCenter = "<option id= \"" + this.operatingCompanyId + "\"  value=\"" + this.name + "\">" + this.name + "</option>";

                    $("#callcenter").append(callCenter);
                });
    
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("error: " + textStatus + ": " + errorThrown);
            }
        });
    
    }

    //fetch all areas 
	function findArea(){
        $.ajax({
            url: root + "Postings" ,
             method: "GET",
             dataType: "json", 
             success: function (data) {
                
                 $(data).each(function () {
                   var  postingArea = "<option value=\"" + this.postingName + "\">" + this.postingName + "</option>";
                     $("#area").append(postingArea);
                 });
     
             },
             error: function (jqXHR, textStatus, errorThrown) {
                 alert("error: " + textStatus + ": " + errorThrown);
             }
         });
    }

	function IndexCtrl(apiService, $scope, $state) {
		var vm = this;
		
	}
}());