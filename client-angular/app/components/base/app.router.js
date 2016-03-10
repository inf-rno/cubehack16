'use strict';

angular.module('app')

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  $stateProvider.state('app', {
    url: '/app',
    views: {
      'rootViewContent': {
        templateUrl: 'components/base/MenuView.html',
        abstract: true,
        controller: 'MenuViewController',
        controllerAs: 'MenuView'
      }
    }
  });

  $urlRouterProvider.otherwise('/');

  // Redirects to default state which is app.landing => app/landing
  $urlRouterProvider.when('/', '/app/landing');
}]);
