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

	return controllers.controller('studio', ['$scope'], function($scope) {
	  console.log('in studiocontroller callback 2');

	  $scope.dummy = 'stydio12345';

		$scope.dataset = {
			bpm: 120,
			shuffle: 30,
			items: [
				{
					type: 'sampler',
					title: 'Balle',
					gate: { dynamic: true, expr: 'step % 4 == 0'},
					samp: { dynamic: true, expr: '36 + step % 4'},
					vol: { dynamic: false, value: 100 },
					rel: { dynamic: false, value: 80 },
					speed: { dynamic: false, speed: 100 },
				}, 
				{
					type: 'synth',
					title: 'Balle 3',
					note: { dynamic: true, expr: '36 + step % 4' },
					gate: { dynamic: true, expr: 'step % 4 != 1' },
					wave: { dynamic: false, value: 1 },
					vol: { dynamic: false, value: 100 },
					rel: { dynamic: false, value: 100 },
					cutoff: { dynamic: false, value: 10000 },
					reso: { dynamic: false, value: 0 },
				}
			]
		};

		$scope.play =function() {
			$scope.updatePlayback();
			console.log('play!');
		}

		$scope.stop =function() {
			console.log('stop!');
		}

		$scope.updatePlayback =function() {
			console.log('update playback!');
		}

		$scope.getItemTemplate = function(x) {
			return 'editor-'+x.type+'.html';
		}

		$scope.saveMyModel = function() {
			$scope.dataset_json = JSON.stringify($scope.dataset);
			console.log('x', JSON.stringify($scope.dataset));
		}

		$scope.addSynth = function() {
			$scope.dataset.items.push({ type: 'synth',
				gate: { dynamic: false, value: 0, expr: 'step % 4 == 0'},
				note: { dynamic: false, value: 24, expr: '36 + step % 4'},
				vol: { dynamic: false, value: 100 },
				cutoff: { dynamic: false, value: 10000 },
				reso: { dynamic: false, value: 0 },
				rel: { dynamic: false, value: 80 },
				speed: { dynamic: false, speed: 100 },
			});
			$scope.saveMyModel();
		}

		$scope.addSampler = function() {
			$scope.dataset.items.push({
				type: 'sampler',
				gate: { dynamic: false, value: 0 },
				samp: { dynamic: true, value: 0 },
				vol: { dynamic: false, value: 100 },
				rel: { dynamic: false, value: 80 },
				speed: { dynamic: false, speed: 100 },
		 	});
			// $scope.resetDevices();
			$scope.saveMyModel();
		}

		$scope.json_changed = function() {
			$scope.dataset = JSON.parse($scope.dataset_json);
		}

		console.log($scope.dataset);
		$scope.saveMyModel();


	});

});



 
function ValueEditor($scope) {
  $scope.title = 'Lorem Ipsum';
}



function SynthController($scope) {
	$scope.test = 'hej';
}

function hack($scope) {
	$scope.$apply();
}

