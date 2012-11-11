'use strict';
console.log('in app.js');
define(['angular', 'controllers/controllers', 'controllers/studio'], function(angular, c, sc) {
  console.log('in app callback', c, sc);
	var module = angular.module('app', ['controllers']);
	module.dummy = 'abc';
	console.log('defined app', module);
  return module;
});
