'use strict';
console.log('in app.js');

var module = angular.module('app', []);
module.dummy = 'abc';

var context = new webkitAudioContext();

var machine = new Machine(context);

machine.setData(

{
  "bpm": "120",
  "shuffle": "33",
  "tracks": [
    {
      "type": "synth",
      "gate": {
        "expression": "1",
        "dynamic": true,
        "$$hashKey": "007"
      },
      "note": {
        "value": 0,
        "dynamic": true,
        "expression": "[12,24][(step>>1)%2]+[3,3,2,1,0,0,12,0][(step>>3)%8]",
        "$$hashKey": "009"
      },
      "volume": {
        "value": "50",
        "dynamic": false,
        "$$hashKey": "00F"
      },
      "speed": {
        "value": 100,
        "dynamic": false
      },
      "waveform": {
        "value": "1",
        "dynamic": false,
        "$$hashKey": "00B"
      },
      "release": {
        "value": "150",
        "dynamic": false,
        "$$hashKey": "00D"
      },
      "cutoff": {
        "value": "1000",
        "dynamic": true,
        "$$hashKey": "00H",
        "expression": "900 + 300 * Math.sin(time*5)"
      },
      "resonance": {
        "value": "2",
        "dynamic": false,
        "$$hashKey": "00J"
      },
      "send1": {
        "$$hashKey": "02Z",
        "value": "100"
      },
      "send2": {
        "$$hashKey": "031",
        "value": "100"
      },
      "$$hashKey": "004",
      "silent": false,
      "solo": false,
      "mute": false
    },
    {
      "type": "sampler",
      "gate": {
        "dynamic": true,
        "value": "1",
        "$$hashKey": "01P",
        "expression": "(step%8==4)||(step%16==14)"
      },
      "sample": {
        "dynamic": true,
        "value": 0,
        "$$hashKey": "01T",
        "expression": "3"
      },
      "volume": {
        "dynamic": false,
        "value": "100",
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
        "$$hashKey": "033",
        "value": "100"
      },
      "send2": {
        "$$hashKey": "035",
        "value": "100"
      },
      "$$hashKey": "01M",
      "silent": false,
      "solo": false,
      "mute": false
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
        "value": "300",
        "$$hashKey": "02K"
      },
      "release": {
        "dynamic": false,
        "value": "100",
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
      "$$hashKey": "029",
      "silent": false,
      "mute": false,
      "solo": false
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
        "value": "200",
        "$$hashKey": "02P"
      },
      "release": {
        "dynamic": false,
        "value": "500",
        "$$hashKey": "02N"
      },
      "speed": {
        "dynamic": false,
        "speed": 100,
        "$$hashKey": "02J",
        "value": "130"
      },
      "send1": {
        "$$hashKey": "03B",
        "value": "0"
      },
      "send2": {
        "$$hashKey": "03D",
        "value": "10"
      },
      "$$hashKey": "02E",
      "silent": false,
      "mute": false,
      "solo": false
    },
    {
      "type": "sampler",
      "title": "New sampler",
      "mute": false,
      "solo": false,
      "gate": {
        "dynamic": false,
        "value": "1",
        "$$hashKey": "02X"
      },
      "sample": {
        "dynamic": true,
        "value": 0,
        "$$hashKey": "031",
        "expression": "2"
      },
      "volume": {
        "dynamic": false,
        "value": 100,
        "$$hashKey": "035"
      },
      "release": {
        "dynamic": false,
        "value": "20",
        "$$hashKey": "033"
      },
      "speed": {
        "dynamic": true,
        "value": "300",
        "$$hashKey": "02Z",
        "expression": "250-(20*(step%4))"
      },
      "send1": {
        "dynamic": false,
        "value": "30",
        "$$hashKey": "037"
      },
      "send2": {
        "dynamic": false,
        "value": "100",
        "$$hashKey": "039"
      },
      "$$hashKey": "02U",
      "silent": false
    },
    {
      "type": "synth",
      "title": "New synth",
      "mute": false,
      "solo": false,
      "gate": {
        "dynamic": true,
        "value": "(",
        "expr": "step % 4 == 0",
        "$$hashKey": "037",
        "expression": "1"
      },
      "note": {
        "dynamic": true,
        "value": "56",
        "expr": "36 + step % 4",
        "$$hashKey": "039",
        "expression": "60+((step%3)*1)"
      },
      "volume": {
        "dynamic": false,
        "value": "30",
        "$$hashKey": "03F"
      },
      "cutoff": {
        "dynamic": false,
        "value": "5000",
        "$$hashKey": "03H"
      },
      "resonance": {
        "dynamic": false,
        "value": 0,
        "$$hashKey": "03J"
      },
      "release": {
        "dynamic": false,
        "value": "33",
        "$$hashKey": "03D"
      },
      "speed": {
        "dynamic": false,
        "value": 100
      },
      "waveform": {
        "dynamic": false,
        "value": "1",
        "$$hashKey": "03B"
      },
      "send1": {
        "dynamic": false,
        "value": "100",
        "$$hashKey": "03L"
      },
      "send2": {
        "dynamic": false,
        "value": "100",
        "$$hashKey": "03N"
      },
      "$$hashKey": "034",
      "silent": false
    }
  ],
  "buses": [
    {
      "type": "bus",
      "$$hashKey": "02T",
      "delaytime": {
        "dynamic": false,
        "value": "0.1",
        "$$hashKey": "00N"
      },
      "delayfeedback": {
        "value": 66,
        "dynamic": true,
        "expression": "99",
        "$$hashKey": "00P"
      }
    },
    {
      "type": "bus",
      "$$hashKey": "02V",
      "delaytime": {
        "dynamic": false,
        "value": "75",
        "$$hashKey": "00R"
      },
      "delayfeedback": {
        "value": "90",
        "dynamic": false,
        "expression": "40 + 30*Math.sin(time)",
        "$$hashKey": "00T"
      }
    }
  ],
  "master": {
    "type": "master",
    "$$hashKey": "02X",
    "receive1": {
      "dynamic": false,
      "value": "100",
      "$$hashKey": "01K"
    },
    "receive2": {
      "dynamic": false,
      "value": 33,
      "$$hashKey": "01M"
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

document.addEventListener('keydown', function(e) {
  // console.log(e);
  if (e.keyCode == 32 && e.srcElement.tagName != 'INPUT') {
    Machine.getInstance().togglePlay();
    e.preventDefault();
    return false;
  }
})


console.log('after app.js');
