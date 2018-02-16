(function() {
    'use strict';
   
    angular
     .module('app')
     .factory('transletService', transletService);
   
     transletService.$inject = ['$translate', '$translatePartialLoader','$translateProvider'];
   
    /* @ngInject */
    function transletService($translate, $translatePartialLoader, $translateProvider ) {
        $translateProvider.translations('en', {
			car: 'auto'
		  });
		  //$translateProvider.translations('en'.translations);
		  $translateProvider.preferredLanguage('en');
		  console.log("en");
    }
   })();