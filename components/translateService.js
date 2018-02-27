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
       // kendo.ui.progress($("#grid"), true);
        var baseUrl = 'https://kendo.cdn.telerik.com/2018.1.221/js/messages/kendo.messages.';
        $("#lang").on('change', function (e) {
         var optionSelected = $("option:selected", this);
         var valueSelected = this.value;
          if (valueSelected === 'fi-FI') {
           $translate.use('fi');
           kendo.culture("fi-FI");

           $.getScript(baseUrl + 'fi-FI' + ".min.js", function () {
           // kendo.ui.progress($("#grid"), false);
           });
               
          } else if(valueSelected === 'en-US') {
           $translate.use('en');
           kendo.culture("en-US");
           $.getScript(baseUrl + 'en-US' + ".min.js", function () {
           // kendo.ui.progress($("#grid"), false);
           });
          }else{
           $translate.use('sw');
           kendo.culture("sv-SE");
           $.getScript(baseUrl + 'sv-SE' + ".min.js", function () {
           // kendo.ui.progress($("#grid"), false);
           });
               }
        });
       }
    }
    })();
















