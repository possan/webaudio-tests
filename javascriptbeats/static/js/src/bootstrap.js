console.log('in bootstrap.js');

function bootstrap() {
	console.log('in bootstrap()');
	requirejs({
		baseUrl: "/static/js",
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
	}, [ 'lib/angular', 'src/app' ],
	function(angular, app) {
	  console.log('in bootstrap() callback');
	  app.bootstrap();
	});
};


