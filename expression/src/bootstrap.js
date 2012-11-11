/*global define
*/

console.log('in bootstrap.js');
define(['require', 'angular'], function(require, angular) {
	'use strict';
  console.log('in bootstrap callback', angular);
	require(['app', 'controllers/controllers'], function(app, c) {
		console.log('in bootstrap callback 2 ',app, c);
		return require(['domReady!'], function(document) {
		  console.log('in bootstrap domready callback');
		  var injector = angular.injector(['ng', 'app'])
		  console.log('inj', injector);
			var m =  angular.module('app');
	    console.log('m', m);
	  	var c = m.controller('test');
	  	console.log('c', c);
	    angular.bootstrap(document, []);
		});
	});
});
