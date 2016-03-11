(function() {
  'use strict';

  angular.module('app')

  .config(['$stateProvider', function($stateProvider) {

    $stateProvider.state('app', {
      url: '/app',
      views: {
        'rootViewContent': {
          templateUrl: 'components/base/MenuView.html',
          abstract: true,
          controller: 'MenuViewController',
          controllerAs: 'menuViewVm'
        }
      }
    });
  }]);
})();
