'use strict';

angular.module('app')
.controller('BaseViewController', BaseViewController);

BaseViewController.$inject = ['$state'];

function BaseViewController($state) {
  var vm = this;

  $state.go('app.landingPage');
}
