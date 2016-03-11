(function() {
  'use strict';

  angular.module('app')

  .config(['$urlRouterProvider', function($urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    // Redirects to default state which is app.landing => app/landing
    $urlRouterProvider.when('/', '/app/landing');
  }]);
})();
