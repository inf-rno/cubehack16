'use strict';

angular.module('app.config')
  .constant('SERVER_URL', 'http://api.boilerangularloop-stage.b48ddcd9.svc.dockerapp.io:3000/')
  .factory('SERVER_API_URL', function(SERVER_URL) {
    return SERVER_URL + 'api/';
  });
