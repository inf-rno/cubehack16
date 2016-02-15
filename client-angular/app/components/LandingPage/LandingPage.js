'use strict';

angular.module('app.landingPage', [
    //Internal Modules:
    //Lib Modules:
    'ui.router'
    ])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('app.landingPage', {
        url: '/landing',
        templateUrl: 'components/LandingPage/LandingPage.html',
        controller: 'LandingPageController'
      });
}]);
