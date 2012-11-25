'use strict';
define('src/services/preset', ['src/app'], function(app) {
	app.module.service('presetService', function() {
		this.getPresetsForParameter = function(parametertype) {
			return [
				{
					expression: 'expression',
					title: 'Preset for parameter type '+parametertype
				},
				{
					expression: 'expression 2',
					title: 'Preset 2 for parameter type '+parametertype
				}
			]
		}
	});
});
