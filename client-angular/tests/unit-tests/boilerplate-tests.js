'use strict';

describe('boilerplate', function() {
  //Load the app base module, so that all our base dependencies are satisfied (see $translate error otherwise)
  beforeEach(module('app'));

  var $controller;
  //Get the controller loader in case we wanna test some controllers later
  beforeEach(inject(function(_$controller_) {
    $controller = _$controller_;
  }));

  describe('Base Controller Presence', function() {
    it('should have BaseViewController defined', function() {
      var controller = $controller('BaseViewController');
      expect(controller).toBeDefined();
    });

  });
});
