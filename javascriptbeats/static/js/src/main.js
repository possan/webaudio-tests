'use strict';
// console.log('in main.js');
requirejs({
  baseUrl: '/static/js',
  map: { '*': { 'libs/angularResource': 'libs/angular-resource' } },
  shim: { 'angular': { exports: 'angular' } }
}, [
  'lib/angular',
  'src/app',
  'src/controllers/buzz'
], function( angular, app ) {
  // console.log('in bootstrap() callback');
  app.bootstrap();
});
