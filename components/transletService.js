(function() {
    'use strict';
   
    angular
     .module('app')
     .factory('transletService', transletService);
   
     transletService.$inject = ['$translate'];
   
    /* @ngInject */
    function transletService($translate, $q) {
     var service = {
      get: get,
      post: post,
     };
   
    }
   })();