'use strict';
console.log('in studio.js');

var module = angular.module('app', []);
module.dummy = 'abc2';



function StudioController($scope) {

  $scope.dummy = 'stydio12345';
	$scope.dataset = Machine.getInstance().song.data;
	$scope.playing = false;

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
		$scope.playing = Machine.getInstance().started;
	}

	$scope.stop = function() {
		console.log('stop!');
		Machine.getInstance().stop();
		$scope.playing = Machine.getInstance().started;
	}

	$scope.updatePlayback =function() {
		$scope.saveMyModel();
		$scope.playing = Machine.getInstance().started;
	}

	$scope.getItemTemplate = function(x) {
		return '/static/tmpl/editor-'+x.type+'.html';
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
			gate: 'step % 4 == 0',
			note: '36 + step % 4',
			volume: 100,
			cutoff: 15000,
			resonance: 0,
			release: 100,
			waveform: 1,
			send1: 0,
			send2: 0,
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
			gate: 'step % 4 == 0',
			sample: 0,
			volume: 100,
			release: 500,
			speed: 100,
			send1: 0,
			send2: 0,
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
		track.mute = !(track.mute || false);
		$scope._updateMutes();
		$scope.saveMyModel();
	}

	$scope.soloTrack = function(track) {
		track.solo = !(track.solo || false);
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




