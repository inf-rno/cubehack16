angular.module('app.landingPage', ['ui.router'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('app.landingPage', {
        url: '/landing',
        templateUrl: 'components/LandingPage/LandingPage.html',
        controller: 'LandingPageController'
      });
}]);
