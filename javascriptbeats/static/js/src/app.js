'use strict';

console.log('in app.js');

define('src/app', ['lib/angular'], function(angularPlaceholder) {

	console.log('in app.js callbakc');

	var app = {};

	app.module = angular.module('app', []);

	var context = new webkitAudioContext();

	app.machine = new Machine(context);

	app.machine.sampler.load([
		{ url: '/static/audio/808kick3.mp3', name: '808 Kick' },
		{ url: '/static/audio/808snare1.mp3', name: '808 Snare' },
		{ url: '/static/audio/808chh1.mp3', name: '808 Closed Hihat' },
		{ url: '/static/audio/808clap.mp3', name: '808 Clap' },
		{ url: '/static/audio/808kick1.mp3', name: '808 Kick 2' }
	]);


	var _setDoc = function(doc) {
	  app.machine.reset();
	 	app.machine.setData(doc);
	}

	var _resetDoc = function() {
	 	console.log('reset doc.');
	 	var doc = {
		  "bpm": 100,
		  "shuffle": 33,
		  "title": "hejsan",
		  "tracks": [
		    {
		      "id": "device1",
		      "x": 0,
		      "y": 0,
		      "type": "synth",
		      "title": "Bass",
		      "solo": false,
		      "mute": false,
		      "silent": false,
		      "gate": "1",
		      "note": "[12,3,48,26][(step>>0)%4]+[3,3,2,1,0,0,12,0][(step>>3)%8]",
		      "cutoff": "900 + 300 * Math.sin(time*5)",
		      "resonance": "2",
		      "release": "150",
		      "volume": "50",
		      "waveform": "1"
		    },
		    {
		      "id": "device2",
		      "x": 200,
		      "y": 0,
		      "type": "sampler",
		      "title": "Snare",
		      "solo": false,
		      "mute": false,
		      "silent": false,
		      "gate": "(step%8==4)||(step%16==14)",
		      "volume": "100",
		      "speed": "100",
		      "sample": "3",
		      "release": "200"
		    },
		    {
		      "id": "delay1",
		      "x": 400,
		      "y": 0,
		      "type": "delay",
		      "title": "Delay 1",
		      "solo": false,
		      "mute": false,
		      "silent": false,
		      "delaytime": "75",
		      "delayfeedback": "70"
		    },
		    {
		      "id": "bus1",
		      "x": 100,
		      "y": 100,
		      "type": "delay",
		      "title": "Delay 2",
		      "solo": false,
		      "mute": false,
		      "silent": false,
		      "delaytime": "25",
		      "delayfeedback": "70"
		    },
		    {
		      "id": "bus2",
		      "x": 300,
		      "y": 100,
		      "type": "delay",
		      "title": "Delay 3",
		      "solo": false,
		      "mute": false,
		      "silent": false,
		      "delaytime": "100",
		      "delayfeedback": "90"
		    },
		    {
		      "id": "master",
		      "x": 150,
		      "y": 200,
		      "type": "master",
		      "title": "Master",
		      "solo": false,
		      "mute": false,
		      "silent": false,
		      "compression": "",
		      "comprelease": "",
		      "comptreshold": ""
		    },
		    {
		      "id": "_314837",
		      "x": 600,
		      "y": 0,
		      "type": "sampler",
		      "title": "kic",
		      "solo": false,
		      "mute": false,
		      "silent": false,
		      "gate": "(step % 4) == 0",
		      "volume": "400",
		      "speed": "100",
		      "sample": "0",
		      "release": "200"
		    }
		  ],
		  "connections": [
		    {
		      "id": "_03",
		      "from": "device1",
		      "to": "master",
		      "amount": "33"
		    },
		  	{
		      "id": "_04",
		      "from": "device2",
		      "to": "master",
		      "amount": "33"
		    },
		    {
		      "id": "_03",
		      "from": "device2",
		      "to": "bus1",
		      "amount": "33"
		    },
		    {
		      "id": "_04",
		      "from": "device2",
		      "to": "bus2",
		      "amount": "33"
		    },
		    {
		      "id": "_05",
		      "from": "device2",
		      "to": "master",
		      "amount": "100"
		    },
		    {
		      "id": "_06",
		      "from": "device1",
		      "to": "delay1",
		      "amount": "100"
		    },
		    {
		      "id": "_07",
		      "from": "delay1",
		      "to": "master",
		      "amount": "100"
		    },
		    {
		      "id": "_08",
		      "from": "delay1",
		      "to": "bus1",
		      "amount": "50"
		    },
		    {
		      "id": "_09",
		      "from": "delay1",
		      "to": "bus2",
		      "amount": "50"
		    },
		    {
		      "id": "_18",
		      "from": "bus1",
		      "to": "master",
		      "amount": "50"
		    },
		    {
		      "id": "_19",
		      "from": "bus2",
		      "to": "master",
		      "amount": "50"
		    },
		    {
		      "id": "_9745937",
		      "from": "_314837",
		      "to": "bus1",
		      "amount": "50"
		    },
		    {
		      "id": "_8795615",
		      "from": "_314837",
		      "to": "master",
		      "amount": "100"
		    }
		  ]
		};
	  _setDoc(doc);
	};

	_resetDoc();
  app.bootstrap = function() {
  	angular.bootstrap(document, ['app']);
	}

	return app;
});