(function() {
  'use strict';

  angular.module('app.landingPage')
    .config(['$stateProvider', function($stateProvider) {
      $stateProvider.state('app.landingPage', {
        url: '/landing',
        views: {
          'childViewContent': {
            templateUrl: 'components/LandingPage/LandingPage.html',
            controller: 'LandingPageController',
            controllerAs: 'landingVm'
          }
        }
      });
    }]);
})();
