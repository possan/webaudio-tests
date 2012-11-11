'use strict';
console.log('in studio.js');

var module = angular.module('app', []);
module.dummy = 'abc2';



function StudioController($scope) {

  $scope.dummy = 'stydio12345';
	$scope.dataset = Machine.getInstance().song.data;
	/*
	 {
		bpm: 120,
		shuffle: 30,
		tracks: [
			{
				type: 'sampler',
				title: 'Balle',
				gate: { dynamic: true, expr: 'step % 4 == 0'},
				sample: { dynamic: true, expr: '36 + step % 4'},
				volume: { dynamic: false, value: 100 },
				release: { dynamic: false, value: 80 },
				speed: { dynamic: false, speed: 100 },
			}, 
			{
				type: 'synth',
				title: 'Balle 3',
				note: { dynamic: true, expr: '36 + step % 4' },
				gate: { dynamic: true, expr: 'step % 4 != 1' },
				waveform: { dynamic: false, value: 1 },
				vol: { dynamic: false, value: 100 },
				release: { dynamic: false, value: 100 },
				cutoff: { dynamic: false, value: 10000 },
				resonance: { dynamic: false, value: 0 },
			}
		]
	}; 
	*/
	$scope.play = function() {
		$scope.updatePlayback();
		console.log('play!');
		machine.play();
	}

	$scope.stop = function() {
		console.log('stop!');
		machine.stop();
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
		Machine.getInstance().setData($scope.dataset);
	}

	$scope.addSynth = function() {
		console.log('addSynth', $scope);
		$scope.dataset.tracks.push({ type: 'synth',
			gate: { dynamic: false, value: 0, expr: 'step % 4 == 0'},
			note: { dynamic: false, value: 24, expr: '36 + step % 4'},
			volume: { dynamic: false, value: 100 },
			cutoff: { dynamic: false, value: 10000 },
			resonance: { dynamic: false, value: 0 },
			release: { dynamic: false, value: 80 },
			speed: { dynamic: false, speed: 100 },
		});
		// $scope.saveMyModel();
	}

	$scope.addSampler = function() {
		console.log('addSampler', $scope);
		$scope.dataset.tracks.push({
			type: 'sampler',
			gate: { dynamic: false, value: 0 },
			sample: { dynamic: true, value: 0 },
			volume: { dynamic: false, value: 100 },
			release: { dynamic: false, value: 80 },
			speed: { dynamic: false, speed: 100 },
	 	});
		// $scope.saveMyModel();
	}

	$scope.deleteTrack = function(track) {
		var idx = $scope.dataset.tracks.indexOf(track);
		if (idx == -1)
			return;
		$scope.dataset.tracks.splice(idx, 1);
		$scope.saveMyModel();
	}

	$scope.json_changed = function() {
		$scope.dataset = JSON.parse($scope.dataset_json);
		$scope.saveMyModel();
	}

	console.log($scope.dataset);
	$scope.saveMyModel();
};

module.controller('StudioController', StudioController);

console.log('after app.js');




