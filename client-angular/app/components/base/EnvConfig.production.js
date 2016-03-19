(function() {
  'use strict';

  angular.module('app.config')
    .factory('SERVER_URL', function($location) {
      return $location.protocol() + '://' + $location.host() + '/';
    })
    .factory('SERVER_API_URL', function(SERVER_URL) {
      return SERVER_URL + 'api/';
    });
})();
