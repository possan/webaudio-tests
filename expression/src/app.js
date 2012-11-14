'use strict';
console.log('in app.js');

var module = angular.module('app', []);
module.dummy = 'abc';

var context = new webkitAudioContext();

var machine = new Machine(context);

machine.setData(




{
  "bpm": 110,
  "shuffle": 25,
  "tracks": [
    {
      "type": "synth",
      "gate": {
        "expression": "step % 1 == 0",
        "dynamic": true,
        "$$hashKey": "007"
      },
      "note": {
        "value": 0,
        "dynamic": true,
        "expression": "16 - (step % 3) * 3",
        "$$hashKey": "009"
      },
      "volume": {
        "value": 100,
        "dynamic": false,
        "$$hashKey": "00F"
      },
      "speed": {
        "value": 100,
        "dynamic": false
      },
      "waveform": {
        "value": 1,
        "dynamic": false,
        "$$hashKey": "00B"
      },
      "release": {
        "value": 100,
        "dynamic": false,
        "$$hashKey": "00D"
      },
      "cutoff": {
        "value": "1000",
        "dynamic": true,
        "$$hashKey": "00H",
        "expression": "1000 + 500 * Math.sin(time)"
      },
      "resonance": {
        "value": "10",
        "dynamic": false,
        "$$hashKey": "00J"
      },
      "send1": {
        "$$hashKey": "02Z",
        "value": "40"
      },
      "send2": {
        "$$hashKey": "031",
        "value": "22"
      },
      "$$hashKey": "004"
    },
    {
      "type": "sampler",
      "gate": {
        "dynamic": true,
        "value": "1",
        "$$hashKey": "01P",
        "expression": "step % 8 == 4"
      },
      "sample": {
        "dynamic": true,
        "value": 0,
        "$$hashKey": "01T",
        "expression": "3"
      },
      "volume": {
        "dynamic": false,
        "value": "200",
        "$$hashKey": "01X"
      },
      "release": {
        "dynamic": false,
        "value": "200",
        "$$hashKey": "01V"
      },
      "speed": {
        "dynamic": false,
        "speed": 100,
        "$$hashKey": "01R"
      },
      "send1": {
        "$$hashKey": "033"
      },
      "send2": {
        "$$hashKey": "035"
      },
      "$$hashKey": "01M"
    },
    {
      "type": "sampler",
      "gate": {
        "dynamic": true,
        "value": 0,
        "$$hashKey": "02C",
        "expression": "step % 4 == 0"
      },
      "sample": {
        "dynamic": true,
        "value": 0,
        "$$hashKey": "02G",
        "expression": "4"
      },
      "volume": {
        "dynamic": false,
        "value": "400",
        "$$hashKey": "02K"
      },
      "release": {
        "dynamic": false,
        "value": "50",
        "$$hashKey": "02I"
      },
      "speed": {
        "dynamic": false,
        "speed": 100,
        "$$hashKey": "02E",
        "value": "100"
      },
      "send1": {
        "$$hashKey": "037",
        "value": "0"
      },
      "send2": {
        "$$hashKey": "039",
        "value": "10"
      },
      "$$hashKey": "029"
    },
    {
      "type": "sampler",
      "gate": {
        "dynamic": true,
        "value": 0,
        "$$hashKey": "02H",
        "expression": "step % 4 == 0"
      },
      "sample": {
        "dynamic": true,
        "value": 0,
        "$$hashKey": "02L",
        "expression": "0"
      },
      "volume": {
        "dynamic": false,
        "value": "400",
        "$$hashKey": "02P"
      },
      "release": {
        "dynamic": false,
        "value": "200",
        "$$hashKey": "02N"
      },
      "speed": {
        "dynamic": false,
        "speed": 100,
        "$$hashKey": "02J"
      },
      "send1": {
        "$$hashKey": "03B"
      },
      "send2": {
        "$$hashKey": "03D",
        "value": "10"
      },
      "$$hashKey": "02E"
    }
  ],
  "buses": [
    {
      "type": "bus",
      "$$hashKey": "02T",
      "delaytime": {
        dynamic: false,
        value: 90
      },
      "delayfeedback": {
        value: 66,
        dynamic: true,
        expression: '40 + 30*Math.sin(time)'
      }
    },
    {
      "type": "bus",
      "$$hashKey": "02V",
      "delaytime": {
        dynamic: false,
        value: 250
      },
      "delayfeedback": {
        value: 66,
        dynamic: false,
        expression: '40 + 30*Math.sin(time)'
      }
    }
  ],
  "master": {
    "type": "master",
    "$$hashKey": "02X",
    "receive1": {
      dynamic: false,
      value: 25
    },
    "receive2": {
      dynamic: false,
      value: 33
    }
  }
}





);

machine.sampler.load([
	{ url: '808kick3.mp3', name: '808 Kick' },
	{ url: '808snare1.mp3', name: '808 Snare' },
	{ url: '808chh1.mp3', name: '808 Closed Hihat' },
	{ url: '808clap.mp3', name: '808 Clap' },
	{ url: '808kick1.mp3', name: '808 Kick 2' }
]);


console.log('after app.js');
