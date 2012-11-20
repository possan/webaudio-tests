'use strict';
console.log('in studio.js');

var module = angular.module('app', []);
module.dummy = 'abc2';



function StudioController($scope, $http) {

  $scope.dummy = 'stydio12345';
	$scope.dataset = Machine.getInstance().song.data;
	$scope.playing = false;

	$scope.id = window.appDocumentId;
	$scope.can_share = false;
	$scope.can_save = window.appCanSave;
	$scope.can_fork = window.appCanFork;
	$scope.can_create = window.appCanCreate;




	machine.sampler.load([
		{ url: '/static/audio/808kick3.mp3', name: '808 Kick' },
		{ url: '/static/audio/808snare1.mp3', name: '808 Snare' },
		{ url: '/static/audio/808chh1.mp3', name: '808 Closed Hihat' },
		{ url: '/static/audio/808clap.mp3', name: '808 Clap' },
		{ url: '/static/audio/808kick1.mp3', name: '808 Kick 2' }
	]);

	document.addEventListener('keydown', function(e) {
	  // console.log(e);
	  if (e.keyCode == 32 && e.srcElement.tagName != 'INPUT') {
	    Machine.getInstance().togglePlay();
	    e.preventDefault();
	    return false;
	  }
	});






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

	$scope.saveWork = function() {
		// post to /blob/ID/save
		var cfg = { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'} };
		var data = 'data='+encodeURIComponent($scope.dataset_json);
    $http.post('/blob/'+$scope.id+'/save', data, cfg).success(function (data) {
      console.log('post result', data);
    });
	}

	$scope.forkWork = function() {
		// post to /blob/ID/fork
		var cfg = { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'} };
		var data = 'data='+encodeURIComponent($scope.dataset_json);
    $http.post('/blob/'+$scope.id+'/fork', data, cfg).success(function (data) {
      console.log('post result', data);
      if (data.success) {
      	location = data.url;
      }
    });
	}

	$scope.createWork = function() {
		// post to /blob/
		var cfg = { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'} };
		var data = 'data='+encodeURIComponent($scope.dataset_json);
    $http.post('/blob', data, cfg).success(function (data) {
      console.log('post result', data);
      if (data.success) {
      	location = data.url;
      }
    });
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

	// ladda model osv...

	var _setDoc = function(doc) {
		$scope.dataset = doc;
		$scope._updateMutes();
	  machine.reset();
	 	machine.setData($scope.dataset);
		$scope.saveMyModel();
	}

	var _resetDoc = function() {
	 	console.log('reset doc.');
	 	var doc = 		  {
	    "title": "My awesome low-fi track",
	    "bpm": "120",
	    "shuffle": "33",
	    "tracks": [
	      {
	      	"id": "device1",
	        "type": "synth",
	        "title": "Bass",
	        "gate": "1",
	        "note": "[12,24][(step>>1)%2]+[3,3,2,1,0,0,12,0][(step>>3)%8]",
	        "volume": "50",
	        "speed": 100,
	        "waveform": "1",
	        "release": "150",
	        "cutoff": "900 + 300 * Math.sin(time*5)",
	        "resonance": "2",
	        "send1": "100",
	        "send2": "100",
	        "silent": false,
	        "solo": false,
	        "mute": false
	      },
	      {
	      	"id": "device2",
	      	"title": "Snare",
	        "type": "sampler",
	        "gate": "(step%8==4)||(step%16==14)",
	        "sample": "3",
	        "volume": "100",
	        "release": "200",
	        "speed": "100",
	        "send1": "100",
	        "send2": "100",
	        "silent": false,
	        "solo": false,
	        "mute": false
	      },
	      {
	        "type": "sampler",
	        "id": "device3",
	      	"title": "Kickdrum",
	        "gate": "step % 4 == 0",
	        "sample": "4",
	        "volume": "300",
	        "release": "100",
	        "speed": "100",
	        "send1": "0",
	        "send2": "10",
	        "silent": false,
	        "mute": false,
	        "solo": false
	      },
	      {
	        "type": "sampler",
	       "id": "device4",
	       "title": "Kickdrum 2",
	        "gate": "step % 4 == 0",
	        "sample": "0",
	        "volume": "200",
	        "release": "500",
	        "speed": "130",
	        "send1": "0",
	        "send2": "10",
	        "silent": false,
	        "mute": false,
	        "solo": false
	      },
	      {
	      	"id": "device5",
	        "type": "sampler",
	        "title": "New sampler",
	        "mute": false,
	        "solo": false,
	        "gate": "1",
	        "sample": "2",
	        "volume": "100",
	        "release": "20",
	        "speed": "250-(20*(step%4))",
	        "send1": "30",
	        "send2": "100",
	        "silent": false
	      },
	      {
	      	"id": "device6",
	      	"title": "High synth",
	        "type": "synth",
	        "mute": false,
	        "solo": false,
	        "gate": "1",
	        "note": "60+((step%3)*1)",
	        "volume": "30",
	        "cutoff": "5000",
	        "resonance": "0",
	        "release": "33",
	        "speed": 100,
	        "waveform": "1",
	        "send1": "100",
	        "send2": "100",
	        "silent": false
	      }
	    ],
	    "buses": [
	      {
	      	"id": "bus1",
	      	"title": "Bus 1",
	        "type": "bus",
	        "delaytime": "0.1",
	        "delayfeedback": "77"
	      },
	      {
	      	"id": "bus2",
	      	"title": "Bus 2",
	        "type": "bus",
	        "delaytime": "75",
	        "delayfeedback": "40 + 30*Math.sin(time)"
	      }
	    ],
	    "connections": [
	    	{ from: 'device1', to: 'bus1', amount: '100' },
	    	{ from: 'device1', to: 'bus2', amount: '100' },
	    	{ from: 'device1', to: 'master', amount: '100' },

	    	{ from: 'device2', to: 'bus1', amount: '100' },
	    	{ from: 'device2', to: 'bus2', amount: '100' },
	    	{ from: 'device2', to: 'master', amount: '100' },

	    	{ from: 'device3', to: 'bus1', amount: '100' },
	    	{ from: 'device3', to: 'bus2', amount: '100' },
	    	{ from: 'device3', to: 'master', amount: '100' },

	    	{ from: 'device4', to: 'bus1', amount: '100' },
	    	{ from: 'device4', to: 'bus2', amount: '100' },
	    	{ from: 'device4', to: 'master', amount: '100' },

	    	{ from: 'device5', to: 'bus1', amount: '100' },
	    	{ from: 'device5', to: 'bus2', amount: '100' },
	    	{ from: 'device5', to: 'master', amount: '100' },

	    	{ from: 'device6', to: 'bus1', amount: '100' },
	    	{ from: 'device6', to: 'bus2', amount: '100' },
	    	{ from: 'device6', to: 'master', amount: '100' },

	    	{ from: 'bus1', to: 'master', amount: '100' },
	    	{ from: 'bus2', to: 'master', amount: '100' }
	    ],
	    "master": {
	     	"id": "master",
	     	"title": "Master",
	      "type": "master",
	      "receive1": "100",
	      "receive2": "33"
	    }
	  };
	  _setDoc(doc);
	};


	if (window.appDocumentId != '') {
	  try {
	    var data = JSON.parse(window.appDocument);
	    if (data) {
	    	console.log('load json doc.');
	    	_setDoc(data);
			} else {
		  	_resetDoc();
			}
	  } catch (e) {
	  	_resetDoc();
	  }
	}
	else {
	 	_resetDoc();
	}

};

module.controller('StudioController', StudioController);
console.log('after app.js');

