(function() {
    'use strict';
  
    angular
        .module('app')
        .factory('loginService', loginService);
  
      //  loginService.$inject = ['HelloService']
  
    function loginService($cookies, HelloService, jwtHelper, $rootScope  ) {
        var service = {
            helloInitialize: helloInitialize,
        }
        return service;

        function helloInitialize() {
            HelloService.initialize().then(function(authResponse) {
                displayUserDetails(getUserData(authResponse))
            });
          
        }
        function getUserData(response) {
            var user = {};
            user.token = response.access_token || response.token;
            var data = jwtHelper.decodeToken(user.token);
            user.expires_in = new Date(response.expires * 1000) || response.expiresOn;
            user.name = data.name;
            user.email = data.emails ? data.emails[0] : '';
            user.id = data.sub;
          
            return user;
        };
       
        function displayUserDetails(user) {
             $rootScope.user = user;
           
        }
       
    }
  })();
  
  
  
  