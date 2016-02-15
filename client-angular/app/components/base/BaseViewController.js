'use strict';

var injections = ['Config'];
angular.module('app')

.controller('BaseViewController', ['AppConfig', '$state', function(Config, $state) {
  //wootwoot
  $state.go('app.landingPage');
}]);
