'use strict';
console.log('in studio.js');

var module = angular.module('app', []);
module.dummy = 'abc2';



function StudioController($scope) {

  $scope.dummy = 'stydio12345';
	$scope.dataset = Machine.getInstance().song.data;

	if (typeof($scope.dataset.buses) === 'undefined')
		$scope.dataset.buses = [];

	if ($scope.dataset.buses.length < 1)
		$scope.dataset.buses.push({});

	if ($scope.dataset.buses.length < 2)
		$scope.dataset.buses.push({});

	$scope.dataset.buses[0].type = 'bus';
	$scope.dataset.buses[1].type = 'bus';

	if (typeof($scope.dataset.master) === 'undefined')
		$scope.dataset.master = {};

	$scope.dataset.master.type = 'master';

	$scope.play = function() {
		$scope._updateMutes();
		$scope.updatePlayback();
		console.log('play!');
		Machine.getInstance().play();
	}

	$scope.stop = function() {
		console.log('stop!');
		Machine.getInstance().stop();
	}

	$scope.updatePlayback =function() {
		$scope.saveMyModel();
	}

	$scope.getItemTemplate = function(x) {
		return 'editor-'+x.type+'.html';
	}

	$scope.saveMyModel = function() {
		$scope.dataset_json = JSON.stringify($scope.dataset, undefined, 2);
		Machine.getInstance().setData($scope.dataset);
	}

	$scope.addSynth = function() {
		console.log('addSynth', $scope);
		$scope.dataset.tracks.push({
			type: 'synth',
			title: 'New synth',
			mute: false,
			solo: false,
			gate: { dynamic: false, value: 0, expr: 'step % 4 == 0'},
			note: { dynamic: false, value: 24, expr: '36 + step % 4'},
			volume: { dynamic: false, value: 100 },
			cutoff: { dynamic: false, value: 10000 },
			resonance: { dynamic: false, value: 0 },
			release: { dynamic: false, value: 80 },
			speed: { dynamic: false, value: 100 },
			waveform: { dynamic: false, value: 1 },
			send1: { dynamic: false, value: 0 },
			send2: { dynamic: false, value: 0 },
		});
		// $scope.saveMyModel();
	}

	$scope.addSampler = function() {
		console.log('addSampler', $scope);
		$scope.dataset.tracks.push({
			type: 'sampler',
			title: 'New sampler',
			mute: false,
			solo: false,
			gate: { dynamic: false, value: 0 },
			sample: { dynamic: true, value: 0 },
			volume: { dynamic: false, value: 100 },
			release: { dynamic: false, value: 80 },
			speed: { dynamic: false, value: 100 },
			send1: { dynamic: false, value: 0 },
			send2: { dynamic: false, value: 0 },
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

	$scope._updateMutes = function() {
		var nsolo = 0;
		$scope.dataset.tracks.forEach(function(track) {
			if (track.solo) nsolo ++;
		});
		$scope.dataset.tracks.forEach(function(track) {
			track.silent = false;
			if (nsolo > 0) {
				track.silent = !track.solo;
			} else {
				track.silent = track.mute;
			}
		});
	}

	$scope.muteTrack = function(track) {
		track.mute = !track.mute;
		$scope._updateMutes();
		$scope.saveMyModel();
	}

	$scope.soloTrack = function(track) {
		track.solo = !track.solo;
		$scope._updateMutes();
		$scope.saveMyModel();
	}

	$scope.json_changed = function() {
		$scope.dataset = JSON.parse($scope.dataset_json);
		$scope.saveMyModel();
	}

	console.log($scope.dataset);
	$scope._updateMutes();
	$scope.saveMyModel();
};

module.controller('StudioController', StudioController);

console.log('after app.js');




