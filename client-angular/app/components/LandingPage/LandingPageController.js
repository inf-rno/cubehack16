(function() {
  'use strict';

  angular.module('app.landingPage')

  .controller('LandingPageController', LandingPageController);

  LandingPageController.$inject = ['Products', '$scope'];

  function LandingPageController(Products, $scope) {
    var vm = this;

    vm.requestOutput = 'In Progress';
    vm.products = [];
    var sampleProduct = {
      name: 'Product',
      createdAt: new Date()
    };

    /*
     * BOILERPLATE-DEMO Can be deleted along all other code with the same comment
     */
    // Make request to the database for Products model (to test database connection)
    Products.add(sampleProduct, function(data) {
      vm.requestOutput = 'Success!';
      Products.get(function(data) {
        vm.products = data;
      }, function(err) {
        vm.products = [];
      });
    }, function(err) {
      vm.requestOutput = 'Failure! error message: ' + err.data.error.message;
    });
  }
})();
