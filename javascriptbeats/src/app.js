'use strict';
console.log('in app.js');

var module = angular.module('app', []);
module.dummy = 'abc';

var context = new webkitAudioContext();

var machine = new Machine(context);

machine.setData(

{
  "title": "My awesome low-fi track",
  "bpm": "120",
  "shuffle": "33",
  "tracks": [
    {
      "type": "synth",
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
      "type": "synth",
      "title": "New synth",
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
      "type": "bus",
      "delaytime": "0.1",
      "delayfeedback": "77"
    },
    {
      "type": "bus",
      "delaytime": "75",
      "delayfeedback": "40 + 30*Math.sin(time)"
    }
  ],
  "master": {
    "type": "master",
    "receive1": "100",
    "receive2": "33"
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
