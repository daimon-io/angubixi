'use strict';

(function() {
	angular.module('AnguBixi')
		.filter('distance', function() {
			return function(item) {
				if (item > 500) {
					return (item / 1000).toFixed(2) + ' km';
				}
				else {
					return item + ' m';
				}
			};
		})
		.controller('MainCtrl', MainCtrl);

		/**
		 * @ngdoc function
		 * @name AnguBixi.controller:MainCtrl
		 * @description
		 * # MainCtrl
		 * Controller of the AnguBixi
		 * @requires $scope
		 * @requires $resource
		 * @requires $timeout
		 */
		function MainCtrl($scope, $resource, $timeout, $q) {

			var LOCAL_STORAGE_STATIONS_ID = 'angubixi_stations_data',
				BIXI_API_URL = 'https://api-core.bixi.com/gbfs/fr/',

				defaultPosition = {
					latitude: 45.506318,
					longitude: -73.569021
				};

			$scope.stations = [];
			$scope.maxDistance = 500;
			$scope.filterDistance = filterDistance;
			$scope.filterDistanceChoices = [ 250, 500, 1000, 1500, 2000, 2500 ];

			/**
			 * @ngdoc function
			 * @name AnguBixi.controller:MainCtrl.getLocalData
			 * @description
			 * Get the data stored from local storage for more data persistence.
			 */
			function getLocalData() {
				return $q(function(resolve, reject) {
					var localData = JSON.parse(localStorage.getItem(LOCAL_STORAGE_STATIONS_ID));
					if (localData) {
						$scope.stations = localData;
						resolve(localData);
					}
					else {
						getRemoteData()
							.then(function () {
								getStationStatuses();
								refreshDistanceFromStations(defaultPosition);
							})
							.catch(function(error) {
								// Error handler
							});
					}
				});
			}

			/**
			 * @ngdoc function
			 * @name AnguBixi.controller:MainCtrl.setLocalData
			 * @description
			 * Set the data stored in local storage.
			 */
			function setLocalData(obj) {
				localStorage.setItem(LOCAL_STORAGE_STATIONS_ID, JSON.stringify(obj));
			}

			/**
			 * @ngdoc function
			 * @name AnguBixi.controller:MainCtrl.getRemoteData
			 * @description
			 * Fetching the remote data from Bixi API (stations list).
			 */
			function getRemoteData() {
				var Stations = $resource(BIXI_API_URL + 'station_information.json');

				return Stations.get().$promise
					.then(getRemoteDataSuccessHandler, getRemoteDataErrorHandler);
			}

			function getRemoteDataSuccessHandler(response) {
				var stations = response.data.stations;

				$scope.stations = stations;
				setLocalData(stations);
			}

			function getRemoteDataErrorHandler(error) {
				// Error Handler
			}


			/**
			 * @ngdoc function
			 * @name AnguBixi.controller:MainCtrl.getStationStatuses
			 * @description
			 * Fetching live the stations status and bike availability
			 */
			function getStationStatuses() {
				var Stations = $resource(BIXI_API_URL + 'station_status.json');

				return Stations.get().$promise
					.then(getStationStatusesSuccessHandler, getStationStatusesErrorHandler);
			}

			function getStationStatusesSuccessHandler(response) {
				refreshStationStatuses(response.data.stations)
					.then(function() {
						// Will recall the API at next refresh
						$timeout(getStationStatuses, response.ttl * 1000);
					})
					.catch(function (err) {
						// Error handler
					});
			}

			function getStationStatusesErrorHandler(error) {
				// Error Handler
			}


			/**
			 * @ngdoc function
			 * @name AnguBixi.controller:MainCtrl.refreshStationStatuses
			 * @description
			 * Refresh the whole station statuses with bikes available.
			 */
			function refreshStationStatuses(statuses) {
				return $q(function(resolve, reject) {
					if(!statuses || !$scope.stations) {
						reject('Station statuses or station store are undefined.');
					}

					_.each(statuses, function(status) {
						var station = _.filter($scope.stations, function(st) {
							return st.station_id === status.station_id;
						})[0];

						if(!station) {
							reject('The station is undefined.')
						}

						station.num_bikes_available = status.num_bikes_available;
					});

					resolve();
				});
			}

			/**
			 * @ngdoc function
			 * @name AnguBixi.controller:MainCtrl.refreshDistanceFromStations
			 * @description
			 * Refresh the distances of each station from my position.
			 * Using that method because we could improve the app and gives the live position
			 */
			function refreshDistanceFromStations(position) {
				return $q(function(resolve, reject) {
					if(!position || !position.latitude || !position.longitude || !$scope.stations) {
						reject('Geo coords or station store are undefined.');
					}

					_.each($scope.stations, function(station) {
						station.distanceFrom = geolib.getDistance(position, {
							latitude: station.lat,
							longitude: station.lon });
					});

					resolve();
				});
			}

			
			function filterDistance(maxDistance) {
				return function(item) {
					return item.distanceFrom <= maxDistance;
				};
			}

			function init() {
				getLocalData()
					.then(function () {
						getStationStatuses();
						refreshDistanceFromStations(defaultPosition);
					})
					.catch(function(error) {
						// Error handler
					});
			}


			this.getLocalData = getLocalData;
			this.setLocalData = setLocalData;
			this.getRemoteData = getRemoteData;
			this.getStationStatuses = getStationStatuses;
			this.refreshStationStatuses = refreshStationStatuses;
			this.$onInit = init;
		}
})();



