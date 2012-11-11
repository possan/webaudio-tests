/*global define
*/

console.log('in studiocontroller.js');

define(['controllers/controllers'], function(controllers) {
  'use strict';
  /*
  return controllers.controller('gitHub', [
    '$scope', '$rootScope', '$location', 'gitHub', function($scope, $rootScope, $location, service) {
      $scope.searchTerm = '';
      $scope.repos = service.repos;
      $scope.search = function(searchTerm) {
        return $location.path("/github/" + searchTerm);
      };
      return $scope.onRouteChange = function(routeParams) {
        $scope.searchTerm = routeParams.searchTerm;
        return service.get($scope.searchTerm);
      };
    }
  ]);*/
  console.log('in studiocontroller callback 1');
	return controllers.controller('test', ['$scope', function($scope) {
	  console.log('in studiocontroller callback 2');
	  $scope.dummy = 'test12345';
	}]);
});