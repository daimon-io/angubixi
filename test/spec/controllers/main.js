'use strict';

describe('Controller: MainCtrl', function () {
  beforeEach(module('AnguBixi'));

  var MainCtrl,
    scope;

  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('to return true', function () {
    expect(true).toBe(true);
  });
});
