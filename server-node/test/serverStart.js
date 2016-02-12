/*
Integration testing that sends HTTP requests to the server
*/

var helperTest = require('./util/http-helper-functions');
var assert = require('assert');
var app = require('../server/server.js');

var SUCCESS_OK = {status:200,statusCode:200,code:'OK'};
var ERROR_UNAUTH = {status:401,statusCode:401,code:'AUTHORIZATION_REQUIRED'};
var ERROR_NOT_FOUND = {status:404,statusCode:404,code:'MODEL_NOT_FOUND'};

describe('Server starts', function() {
  'use strict';

  //Method that executes before each test
  beforeEach(function () {
  });

  //Method that executes after each test
  afterEach(function (done) {
    done();
  });

  describe('API Entry point', function() {

    it('Should retrun time', function(done) {
      helperTest.sendAPIRequest(app, helperTest.GET, '/', {}, SUCCESS_OK.status,
                                function(err, result) {
        if (err) return done(err);
        
        var body = result.res.body;

        assert(body, 'Body is undefined');
        assert(body.started, 'Start time is undefined');
        done();
      });
    });

    it('Should return 404', function(done) {
      helperTest.sendAPIRequest(app, helperTest.GET, '/api/BadURL', {},
                                ERROR_NOT_FOUND.status,
                                function(err, result) {
        if (err) return done(err);

        helperTest.checkForErrorResponse(result, ERROR_NOT_FOUND, function() {
          var body = result.res.body;
          assert(body.error.stack, 'Dev and stage should return the error stack');
          done();
        });
      });
    });

    // Dev and stage should have the API explorer
    it('Should have the explorer', function(done) {
      helperTest.sendAPIRequest(app, helperTest.GET, '/explorer/', {},
                                SUCCESS_OK.status,
                                function(err, result) {
        if (err) return done(err);

        done();
      });
    });

  });//end describe

}); //end describe

