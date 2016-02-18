'use strict';

angular.module('app.factories')

.factory('Products', function($resource, SERVER_URL) {
  console.log(SERVER_URL);
  return $resource(SERVER_URL + 'Products', {}, {
    add: {
      method: 'POST',
      isArray: false
    },
    get: {
      method: 'GET',
      isArray: true
    }
  });
});
