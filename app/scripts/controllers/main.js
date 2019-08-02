'use strict';

(function() {
	angular.module('AnguBixi')
		.controller('MainCtrl', MainCtrl);

		/**
		 * @ngdoc function
		 * @name AnguBixi.controller:MainCtrl
		 * @description
		 * # MainCtrl
		 * Controller of the AnguBixi
		 * @requires $scope
		 * @requires $resource
		 */
		function MainCtrl($scope, $resource) {

			var LOCAL_STORAGE_STATIONS_ID = 'angubixi_stations_data',
				BIXI_API_URL = 'https://api-core.bixi.com/gbfs/fr/';

			$scope.stations = [];

			/**
			 * @ngdoc function
			 * @name AnguBixi.controller:MainCtrl.getLocalData
			 * @description
			 * Get the data stored from local storage for more data persistence.
			 */
			function getLocalData() {
				return JSON.parse(localStorage.getItem(LOCAL_STORAGE_STATIONS_ID));
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

			this.getLocalData = getLocalData;
			this.setLocalData = setLocalData;
			this.getRemoteData = getRemoteData;
		}
})();
