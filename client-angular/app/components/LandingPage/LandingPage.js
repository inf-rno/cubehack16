'use strict';

angular.module('app.landingPage')
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('app.landingPage', {
      url: '/landing',
      views: {
        'content': {
          templateUrl: 'components/LandingPage/LandingPage.html',
          controller: 'LandingPageController',
          controllerAs: 'landing'
        }
      }
    });
  }]);
