(function () {

    'use strict';
  
    angular
      .module('app')
      .run(run);
  
    run.$inject = ['$rootScope', 'HelloService'];
  
    function run($rootScope, HelloService) {
//       // Put the authService on $rootScope so its methods
//       // can be accessed from the nav bar
      $rootScope.HelloService = HelloService;
  
//       // Register the authentication listener that is
//       // set up in auth.service.js
     // authService.registerAuthenticationListener();
  
//       // Register the synchronous hash parser
//      // lock.interceptHash();
          
//   //		console.log(localStorage.id_token);
    }
  
  })();
  