(function() {
  "use strict";

  angular
    .module("app", [
      "ui.router",
      "ui.bootstrap",
      "daterangepicker",
      "pascalprecht.translate",
      "ngCookies",
      "kendo.directives",
      "ngHello",
      "angular-jwt"
    ])
    .config(config);

  config.$inject = [
    "$stateProvider",
    "$urlRouterProvider",
    "$translateProvider",
    "$locationProvider"
  ];

  function config(
    $stateProvider,
    $urlRouterProvider,
    $translateProvider,
    $locationProvider
  ) {
    // $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix("");
    $translateProvider
      .preferredLanguage("en-GB")
      .fallbackLanguage("en-GB")
      .useStaticFilesLoader({
        prefix: "assets/i18n/local-",
        suffix: ".json"
      })
      .useSanitizeValueStrategy()
      .useCookieStorage();
    $stateProvider
      .state("carsinshift", {
        url: "/carsinshift",
        templateUrl: "components/carsinshift/carsinshift.html",
        controller: "CarShiftCtrl",
        controllerAs: "vm"
      })

      .state("message", {
        url: "/message",
        views: {
          "": {
            templateUrl: "components/message/message.html",
            controller: "MessageCtrl",
            controllerAs: "vm"
          },
          "create@message": {
            templateUrl: "components/message/createMessage.html",
            controller: "CreateMessageCtrl",
            controllerAs: "vm"
          }
        }
      })
      .state("carInfo", {
        url: "/carInfo",
        templateUrl: "components/carInfo/carInfo.html",
        controller: "CarInfoCtrl",
        controllerAs: "vm"
      })
      .state("carWorkshift", {
        url: "/carWorkshift",
        controller: "ChangeCarShiftCtrl",
        templateUrl: "components/carWorkshift/changecarshift.html",
        controllerAs: "vm"
      })
      .state("dispatch", {
        url: "/dispatch",
        templateUrl: "components/dispatch/dispatch.html",
        controller: "DispatchCtrl",
        controllerAs: "vm"
      })
      .state("restriction", {
        url: "/restriction",
        templateUrl: "components/restriction/restriction.html",
        controllerAs: "vm"
      })
      .state("groupworkshift", {
        url: "/groupworkshift",
        templateUrl: "components/groupworkshift/groupworkshift.html",
        controller: "GroupWorkShiftCtrl",
        controllerAs: "vm"
      })
      .state("zone", {
        url: "/zone",
        templateUrl: "components/zone/zone.html",
        controller: "ZoneCtrl",
        controllerAs: "vm"
      });
    $urlRouterProvider.otherwise("/dispatch");
  }
})();
