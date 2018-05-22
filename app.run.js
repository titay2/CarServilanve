(function() {
  "use strict";

  angular.module("app").run(run);

  run.$inject = ["$rootScope", "HelloService"];

  function run($rootScope, HelloService, apiService) {
    //       // Put the authService on $rootScope so its methods
    //       // can be accessed from the nav bar
    $rootScope.HelloService = HelloService;
  }
})();
