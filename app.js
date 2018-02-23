(function() {

	'use strict';
   
	angular
	 .module('app', [
	  'ui.router',
	  'ui.bootstrap',
	  'daterangepicker',
	  'pascalprecht.translate',
	  'ngCookies',
	  'kendo.directives'
	])
	 .config(config);
   
   
	config.$inject = ['$stateProvider', '$urlRouterProvider', '$translateProvider'];

	function config($stateProvider, $urlRouterProvider, $translateProvider) {

	$translateProvider 
		.preferredLanguage('en')
		.fallbackLanguage('en')
		.useStaticFilesLoader({
			prefix:'../i18n/local-',
			suffix: '.json'
		})
		.useSanitizeValueStrategy()	
		.useCookieStorage();

	 $stateProvider
	  .state('carsinshift', {
	   url: '/carsinshift',
	   templateUrl: 'components/carsinshift/carsinshift.html',
	   controllerAs: 'vm'
	  })
   
	 .state('message', {
	   url: '/message',
	   views: {
		'': {
		 templateUrl: 'components/message/message.html',
		 controller: 'MessageCtrl',
		 controllerAs: 'vm'
		},
		'create@message': {
		 templateUrl: 'components/message/createMessage.html',
		 controller: 'CreateMessageCtrl',
		 controllerAs: 'vm'
		}
	   }
	  })
	  .state('carInfo', {
	   url: '/carInfo',
	   templateUrl: 'components/carInfo/carInfo.html',
	   controllerAs: 'vm'
   
	  })
	  .state('carWorkshift', {
	   url: '/carWorkshift',
	   views:{
		   '':{
			   templateUrl:'components/carWorkshift/carshift.html',
			   controller:'CarShiftCtrl',
			   controllerAs:'vm'
		   },
		   'change@carWorkshift':{
				templateUrl: 'components/carWorkshift/changecarshift.html',
				controller:'ChangeCarShiftCtrl',
				controllerAs: 'vm'
		   }
	   },
	  })
	  .state('dispatch', {
	   url: '/dispatch',
   
	   templateUrl: 'components/dispatch/dispatch.html',
	   controllerAs: 'vm'
   
	  })
	  .state('restriction', {
	   url: '/restriction',
   
	   templateUrl: 'components/restriction/restriction.html',
	   controllerAs: 'vm'
   
	  })
	  .state('workshiftchange', {
	   url: '/workshiftchange',
   
	   templateUrl: 'components/workshiftChange/workshiftChange.html',
	   controllerAs: 'vm'
   
	  })
	  .state('zone', {
	   url: '/zone',
   
	   templateUrl: 'components/zone/zone.html',
	   controllerAs: 'vm'
   
	  })
   
   
	 $urlRouterProvider.otherwise('/message');
   
	}
   
   })();