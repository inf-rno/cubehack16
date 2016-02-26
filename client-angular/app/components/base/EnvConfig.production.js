'use strict';

angular.module('app.config')
  .constant('SERVER_URL', 'http://api.boilerangularloop.34ea9151.svc.dockerapp.io:3000/')
  .factory('SERVER_API_URL', function(SERVER_URL) {
    return SERVER_URL + 'api/';
  });
