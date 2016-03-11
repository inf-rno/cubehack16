(function() {
  'use strict';

  angular.module('app.config')
    .constant('SERVER_URL', 'http://localhost:3000/')
    .factory('SERVER_API_URL', function(SERVER_URL) {
      return SERVER_URL + 'api/';
    });
})();
