'use strict';
console.log('in app.js');

var module = angular.module('app', []);
module.dummy = 'abc';

var context = new webkitAudioContext();

var machine = new Machine(context);

machine.sampler.load([
	{ url: '808kick3.mp3', name: '808 Kick' },
	{ url: '808snare1.mp3', name: '808 Snare' },
	{ url: '808chh1.mp3', name: '808 Closed Hihat' },
	{ url: '808clap.mp3', name: '808 Clap' },
	{ url: '808kick1.mp3', name: '808 Kick 2' }
]);


console.log('after app.js');
