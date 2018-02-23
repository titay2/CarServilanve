(function() {

    'use strict';
   
      
    angular
    .module('app')
    .controller('CarShiftCtrl', CarShiftCtrl)
   
    CarShiftCtrl.$inject = ['apiService','translateService', '$scope', '$state','$log', ];
    function CarShiftCtrl(apiService,translateService, $scope, $state, $log) {  translateService.setLanguage();}
     
      }());