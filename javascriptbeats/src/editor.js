'use strict'
define(['./angular'], function(angular) {
	console.log('editor ready.', angular);
	/*
	var module = angular.module('Beat', []);

	module.directive('valueeditor', function() {
	  return {
	    restrict: 'C',
	    replace: true,
	    transclude: false,
	    scope: { title: '@', property: '@', expr: '@', dynamic: '@', value: '@'  },
	    templateUrl: 'prop-generic.html',
	   	compile: function(element, attrs, transclude) {
	   		var scope = element.scope();
	   		console.log('in compile', this);
	   		console.log('element', element);
	   		console.log('element scope', scope);
	   		console.log('parent scope dynamic', scope.dynamic);
	   		console.log('parent scope value', scope.value);
	   		console.log('parent scope expr', scope.expr);
	   		console.log('parent scope bpm', scope.bpm);
	   		console.log('attrs', attrs);
	   		console.log('transclude', transclude);
	    	return function(scope, element, attrs) {
	    		console.log('id=',scope.$id);
	    		console.log('p=',scope.$parent);
	    		console.log('p p=',scope.$parent.$parent);
	    		console.log('scope2=',element.scope());

	  	 		scope.test = 'x'+Math.round(Math.random()*10000);
	  	 		scope.save = function() {
	  	 			console.log('save called..', scope);
			    	console.log('in link');
						console.log('dynamic', scope.dynamic );
						console.log('value', scope.value );
						console.log('expr', scope.expr );
						// scope.$digest();
	  	 		}
	    	}
	    },
	    zzzlink: function(scope, element, attrs) {
	    	console.log('in link');
				console.log('scope', scope );
				console.log('element', element );
				console.log('attrs', attrs );

	   // 	scope.$apply();
	    
	    }
	  }
	});

	function ValueEditor($scope) {
	  $scope.title = 'Lorem Ipsum';
	}

	$scope.StudioController = function($scope) {

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

	}

	function SynthController($scope) {
		$scope.test = 'hej';
	}

	function hack($scope) {
		$scope.$apply();
	}



	*/
	return {
	};
});