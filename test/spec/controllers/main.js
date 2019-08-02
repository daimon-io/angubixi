'use strict';

describe('Controller: MainCtrl', function() {
  beforeEach(module('AnguBixi'));

  var MainCtrl,
    scope,
		$httpBackend;

	beforeEach(inject(function($controller, $rootScope, _$httpBackend_) {
		scope = $rootScope.$new();
		$httpBackend = _$httpBackend_;

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

		describe('getRemoteData()', function() {
			it('to retrieve the proper data from BIXI API', function() {
				var stationsList = [
					{ name: 'station 1' },
					{ name: 'station 2' },
					{ name: 'station 3' },
					{ name: 'station 4' },
					{ name: 'station 5' }
				];

				$httpBackend.expect('GET', 'https://api-core.bixi.com/gbfs/fr/station_information.json')
					.respond(200, { data: { stations: stationsList } });
				
				MainCtrl.getRemoteData();
				$httpBackend.flush();

				expect(scope.stations)
					.toEqual(stationsList);
			});
		});
	});
});
