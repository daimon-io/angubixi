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

			/**
			 * @ngdoc function
			 * @name AnguBixi.controller:MainCtrl.getLocalData
			 * @description
			 * Get the data stored from local storage for more data persistence.
			 */
			function getLocalData() {
				return JSON.parse(localStorage.getItem('angubixi_data'));
			}
			
			this.getLocalData = getLocalData;
		}
})();
