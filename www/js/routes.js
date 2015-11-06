angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
      
        
    .state('tabsController.currentLocation', {
      url: '/page2',
      views: {
        'tab1': {
          templateUrl: 'templates/currentLocation.html',
          controller: 'currentLocationCtrl'
        }
      }
    })
        
      
    
      
        
    .state('tabsController.historyLocation', {
      url: '/page3',
      views: {
        'tab2': {
          templateUrl: 'templates/historyLocation.html',
          controller: 'historyLocationCtrl'
        }
      }
    })
        
      
    
      
        
    .state('tabsController.setting', {
      url: '/page4',
      views: {
        'tab3': {
          templateUrl: 'templates/setting.html',
          controller: 'settingCtrl'
        }
      }
    })
        
      
    
      
    .state('tabsController', {
      url: '/page1',
      abstract:true,
      templateUrl: 'templates/tabsController.html'
    })
      
    ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/page1/page2');

});