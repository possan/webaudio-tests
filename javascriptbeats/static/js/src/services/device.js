'use strict';

define('src/services/device', ['src/app'], function(app) {
	app.module.service('deviceService', function() {

		this.getAvailableDevices = function() {
			return [
				{ type: 'synth', title: 'Synthesizer' },
				{ type: 'sampler', title: 'Sampler' },
				{ type: 'delay', title: 'Delay' },
			//	{ type: 'reverb', title: 'Reverb' },
			//	{ type: 'waveshaper', title: 'Waveshaper' },
			//	{ type: 'filter', title: 'Filter' },
			//	{ type: 'compressor', title: 'Compressor' },
			];
		}

		this.getParametersForType = function(type) {
			return [
				{
					title: '',
				}
			]
		}

	});
});