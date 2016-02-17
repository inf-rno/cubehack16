'use strict';

angular.module('app')
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    $stateProvider.state('app', {
      url: '/app',
      templateUrl: 'components/base/AppBase.html',
      abstract: true,
      controller: 'BaseViewController'
    });

    $urlRouterProvider.otherwise('/landing');
  }]);
