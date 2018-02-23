(function() {
    'use strict';
   
    angular
     .module('app')
     .factory('translateService', translateService);

     translateService.$inject = ['$translate']
     function translateService( $translate) {
         var service = {
            setLanguage: setLanguage,
         }
         return service;

     function setLanguage() {
         
        $("#lang").on('change', function (e) {
         var optionSelected = $("option:selected", this);
         var valueSelected = this.value;
          if (valueSelected === 'fi') {
           $translate.use('fi');
          } else if(valueSelected === 'en') {
           $translate.use('en');
          }else{
           $translate.use('sw');
               }
        });
       }
    }
    })();
















