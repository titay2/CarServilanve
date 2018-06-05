(function() {
  //'use strict';

  angular.module("app").controller("DispatchCtrl", DispatchCtrl);
  // DispatchCtrl.$inject = ["$scope", " $state", " $rootScope"];
  function DispatchCtrl(
    apiService,
    translateService,
    $scope,
    $state,
    $translate,
    HelloService,
    jwtHelper,
    $rootScope
  ) {
    translateService.setLanguage();

    helloInitialize();
    $scope.login = HelloService.login;
    $scope.logout = helloLogout;

    // Web Login and Logout using hello
    function helloInitialize() {
      HelloService.initialize()
        .then(function(authResponse) {
          displayUserDetails(getUserData(authResponse));
        })
        .catch(function(error) {
          console.log(error + "Not logged in!");
        });
    }

    function helloLogout() {
      $("#inputCenter").val("");
      $("#inputArea").val("");
      $("#propertyInput").val("");
      $("#vihecle").val("");
      HelloService.logout();
    }

    // Decode decode the token and diaplay the user details
    function getUserData(response) {
      var user = {};
      user.token = response.access_token || response.token;
      var data = jwtHelper.decodeToken(user.token);
      user.expires_in = new Date(response.expires * 1000) || response.expiresOn;
      user.name = data.name;
      user.email = data.emails ? data.emails[0] : "";
      user.id = data.sub;
      return user;
    }

    function displayUserDetails(user) {
      $scope.user = user;
      $rootScope.user = user;
    }
  }
})();
