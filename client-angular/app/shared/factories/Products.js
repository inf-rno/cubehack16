'use strict';

/*
 * BOILERPLATE-DEMO Can be deleted along all other code with the same comment
 * NOTE Remove Product from server-node/server/model-config.json to remove model from server
 */
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
