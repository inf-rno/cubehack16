(function() {
  'use strict';

  angular.module('app.landingPage')

  .controller('LandingPageController', ['$scope','SERVER_URL', '$http', LandingPageController]);

  LandingPageController.$inject = ['$scope'];

  function LandingPageController($scope, url, $http) {
    var vm = this;

    vm.requestOutput = url;
  }
})();
