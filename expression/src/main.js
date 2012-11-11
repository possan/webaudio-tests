/*global define, require
*/

console.log('in main.js');
requirejs({
  map: {
    '*': {
      'libs/angularResource': 'libs/angular-resource'
    }
  },
  shim: {
    'angular': {
      exports: 'angular'
    },
  }
}, ['app', 'bootstrap'], function(app, bootstrap) {
// }, ['app', 'bootstrap', 'controllers/gitHub', 'controllers/people', 'controllers/personDetails', 'controllers/searchHistory', 'controllers/twitter', 'directives/ngController', 'directives/tab', 'directives/tabs', 'filters/twitterfy', 'responseInterceptors/dispatcher'], function(app) {

  console.log('in main callback');
  app.config([]);
  return app.run([]);
	/*
  app.config([
    '$routeProvider', function($routeProvider) {
      return $routeProvider.when('/github/:searchTerm', {
        controller: 'gitHub',
        reloadOnSearch: true,
        resolve: {
          changeTab: [
            '$rootScope', function($rootScope) {
              return $rootScope.$broadcast('changeTab#gitHub');
            }
          ]
        }
      }).when('/people/:id', {
        controller: 'personDetails',
        reloadOnSearch: true,
        resolve: {
          changeTab: [
            '$rootScope', function($rootScope) {
              return $rootScope.$broadcast('changeTab#people');
            }
          ]
        }
      }).when('/twitter/:searchTerm', {
        controller: 'twitter',
        reloadOnSearch: true,
        resolve: {
          changeTab: [
            '$rootScope', function($rootScope) {
              return $rootScope.$broadcast('changeTab#twitter');
            }
          ]
        }
      }).otherwise({
        redirectTo: '/github/CaryLandholt'
      });
    }
  ]);
 return app.run([
    '$rootScope', '$log', function($rootScope, $log) {
      $rootScope.$on('error:unauthorized', function(event, response) {});
      $rootScope.$on('error:forbidden', function(event, response) {});
      $rootScope.$on('error:403', function(event, response) {});
      $rootScope.$on('success:ok', function(event, response) {});
      return $rootScope.$on('$routeChangeSuccess', function(event, currentRoute, priorRoute) {
        return $rootScope.$broadcast("" + currentRoute.controller + "$routeChangeSuccess", currentRoute, priorRoute);
      });
    }
  ]);
	*/
});
