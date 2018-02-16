(function() {

	'use strict';
   
	angular
	 .module('app', [
	  'ui.router',
	  'ui.bootstrap',
	  'daterangepicker',
	  'pascalprecht.translate',
	 
	 ])
	 .config(config);
   
   
	config.$inject = ['$stateProvider', '$urlRouterProvider', '$translateProvider'];

	function config($stateProvider, $urlRouterProvider, $translateProvider) {
		$translateProvider.useStaticFilesLoader({
			 prefix:'../i18n/local-',
			 suffix: '.json'
		});
			$translateProvider .preferredLanguage('en')
			$translateProvider.fallbackLanguage('en');

	 $stateProvider
	  .state('home', {
	   url: '/home',
   
	   templateUrl: 'components/home/home.html',
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
   
	   templateUrl: 'components/carWorkshift/carworkshift.html',
	   controllerAs: 'vm'
   
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
   
   
	 $urlRouterProvider.otherwise('/home');
   
	}
   
   })();