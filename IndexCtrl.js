(function () {

	'use strict';

	angular
		.module('app')
		.controller('IndexCtrl', IndexCtrl);

     IndexCtrl.$inject = [ '$scope', '$state'];

    function IndexCtrl( $scope) {

    console.log("loadded");
    }
      
    

     var root  = "http://localhost:59910/api/";
     


     findCallCenter();
     findArea();

     let val = ''

    
    
     //fetch all call centers
     function findCallCenter() {
        $.ajax({
            url: root + "OperatingCompanies" ,
            method: "GET",
            dataType: "json", 
            success: function (data) {
               ;
                $(data).each(function () {
                  var callCenter = "<option value=\"" + this.name + "\">" + this.name + "</option>";
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