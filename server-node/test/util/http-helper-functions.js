/*
Helper Functions for making HTTP requests and error

sendAPIRequest Function paramters
  - host: the location of the host
      - if testing with a NodeJS server, send require('<FILE PATH>') 
        with the path to the entry main js file
      - if testing with a URL , send the host name/ip i.e. http://0.0.0.0:3000
  - httpMethod: the HTTP method type
      - use constants defined below
      - use the allowed strings ('get','post','put','del','patch','head')
  - url: the path in the host to call
      - i.e. /api/remoteMethod
  - data: data to send in JSON format
      - i.e. {one:"two",three:4}
  - expectedStatus: the expected HTTP code
      - i.e. 200, 401, 500
  - cb: callback to invoke afterwards


checkForErrorResponse Function paramters
  - result: the actual error object to compare
  - expectedErr: the expected error
  - cb: callback to invoke afterwards
*/


var should = require('should');
var request = require('supertest');

function isMethodValid(httpMethod) {
  return ['get','post','put','del','patch','head'].some(function(expType) {
          return expType === httpMethod;
        });
}

module.exports = {
  GET:'get',
  POST:'post',
  PUT:'put',
  DELETE:'del',
  PATCH:'patch',
  HEAD:'head',

  //send either 'get','post','put' requests
  sendAPIRequest: function(host, httpMethod, url, data, expectedStatus, cb){
    if(httpMethod && url && expectedStatus && cb){
      if( isMethodValid(httpMethod) ) {
        request(host)[httpMethod](url)
          .send(data)
          .expect(expectedStatus)
          .end(function(err, result){
            if (err) return cb(err);
            return cb(null,result);
          });
      }
      else{
        return cb(new Error('HTTP method not valid'),null);
      }
    }
    else{
      return cb(new Error('Not all arguments are met'),null);
    }

  },


  //Helper function to check if the error is the one expected
  checkForErrorResponse: function(result, expectedErr, cb){
    var actualErr = result.res.body.error;

    should.equal(actualErr.status, expectedErr.status);
    should.equal(actualErr.statusCode, expectedErr.statusCode);

    return cb();
  },

};
