'use strict';
console.log('in app.js');

var module = angular.module('app', []);

var context = new webkitAudioContext();

var machine = new Machine(context);

console.log('after app.js');
