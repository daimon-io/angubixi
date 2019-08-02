'use strict';

describe('Controller: MainCtrl', function() {
  beforeEach(module('AnguBixi'));

  var MainCtrl,
    scope;

	beforeEach(inject(function($controller, $rootScope) {
		scope = $rootScope.$new();
		MainCtrl = $controller('MainCtrl', {
			$scope: scope
		});
	}));

	describe('Methods', function() {
		describe('getLocalData()', function() {
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

		describe('setLocalData()', function() {
			it('to return the proper stored object', function() {
				var mockedStoredDataStringified = '[{"some":"testItem"}]',
					mockedStoredDataParsed = [ { some: 'testItem' } ],
				
					// We assume localStorage will always store the data
					setItemSpyer = spyOn(localStorage, 'setItem')
						.and.returnValue(1);
				
				MainCtrl.setLocalData(mockedStoredDataParsed);

				expect(setItemSpyer)
					.toHaveBeenCalledWith('angubixi_stations_data', mockedStoredDataStringified);
			});
		});
	});
});
