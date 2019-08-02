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

	describe('Methods', function () {
		describe('getLocalData()', function () {
			it('to return the proper stored object', function() {
				var mockedLocalStorageStringified = '[{"some":"testItem"}]',
					mockedLocalStorageParsed = [ { some: 'testItem' } ],
					localData;
				
				spyOn(localStorage, 'getItem')
					.and.returnValue(mockedLocalStorageStringified);
				
				localData = MainCtrl.getLocalData();
				
				expect(localData)
					.toEqual(mockedLocalStorageParsed);
			});
		});
	});
});
