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
		 */
		function MainCtrl($scope) {

			var LOCAL_STORAGE_STATIONS_ID = 'angubixi_stations_data';

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

			this.getLocalData = getLocalData;
			this.setLocalData = setLocalData;
		}
})();
