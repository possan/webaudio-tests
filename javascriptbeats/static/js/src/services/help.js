'use strict';
define('src/services/help', ['src/app'], function(app) {
	app.module.service('helpService', function() {

		var props = {
			'gate': 'Gate controls wether the note is triggered or not, 1 = trigger note, 0 = don\'t trigger',
			'volume': 'Volume is set from 0 to 100 in percent, 100% = full volume (you can go higher if you want)',
			'note': 'Note is specified as midi key number with 0 beeing first C on the keyboard (C-0), middle C, 36 is a good starting value',
			'waveform': 'Specifies the oscillator waveform, 0 = sine, 1 = saw, 2 = square, 3 = triangle',
			'sample': 'Specifies which sample is used, 0 beeing the first sample, check presets to get a list of available samples.',
			'ms-release': 'Release time specifies how long the note is in milliseconds, it\'s a linear decrease from when the note is triggered.',
			'playbackspeed': 'Speed of sample playback, 100% = normal speed.',
			'cutoff': 'Specifies the filter cutoff point in hertz, from 0 to 22050',
			'resonance': 'Specifies the filter resonance amount, in percent, 100% beeing max',
			'delaytime': 'Delay time in percent, 100% = one beat',
			'delayfeedback': 'Delay feedback in percent',
		};

		var samples = [];
		for (var i=0; i<app.machine.sampler.names.length; i++)
			samples.push({ title: app.machine.sampler.names[i], expression: ''+i });

		samples.push({ title: 'Simple beat sequencer', expression: '[0,99,2,99,1,99,2,99,0,99,2,99,1,3,2,1][step%16]' });


		var presets = {
			'volume': [
				{ title: 'Zero', expression: '0' },
				{ title: 'Full', expression: '100' },
				{ title: '200%', expression: '200' },
				{ title: 'Falling in beat', expression: '100 - (20*(step%4))' },
				{ title: 'Raising in beat', expression: '25 + (20*(step%4))' },
			],
			'gate': [
				{ title: 'Never', expression: '0' },
				{ title: 'Always', expression: '1' },
				{ title: 'Every beat', expression: '(step % 4) == 0' },
				{ title: 'Every third', expression: '(step % 3) == 0' },
				{ title: 'Every second', expression: '(step % 2) == 0' },
				{ title: '0 - Sine', expression: '0' },
			],
			'note': [
				{ title: 'Middle C', expression: '36' },
				{ title: 'Step sequencing example', expression: '0' },
				{ title: 'Random octave + note', expression: 'Math.round(Math.random()*6)*12 + 0' },
				{ title: 'Random note in low octave', expression: 'Math.round(Math.random()*12) + 12' },
			],
			'waveform': [
				{ title: '0 - Sine', expression: '0' },
				{ title: '1 - Square', expression: '1' },
				{ title: '2 - Saw', expression: '2' },
				{ title: '3 - Triangle', expression: '3' },
				// { title: '4 - Custom', expression: '3' },
				{ title: 'Random', expression: 'Math.floor(Math.random() * 4)' },
			],
			'sample': samples,
			/*
				{ title: '00 - 808 Kick', expression: '0' },
				{ title: '01 - 808 Snare', expression: '1' },
				{ title: '02 - 808 Closed hat', expression: '2' },
				{ title: '03 - 808 Clap', expression: '3' },
				{ title: '04 - 808 Kick 2', expression: '4' },
			//	{ title: '05 - 808 Kick', expression: '05' },
			//	{ title: '06 - 808 Kick', expression: '06' },
			//	{ title: '07 - 808 Kick', expression: '07' },
			//	{ title: '08 - 808 Kick', expression: '08' },
			//	{ title: '09 - 808 Kick', expression: '09' },
			//	{ title: '10 - 808 Kick', expression: '10' },
				{ title: 'Random', expression: 'Math.floor(Math.random() * 10)' },
				{ title: 'Simple beat sequencer', expression: '[0,99,2,99,1,99,2,99,0,99,2,99,1,3,2,1][step%16]' },
			], */
			'cutoff': [
				{ title: 'No cutoff', expression: '22050' },
				{ title: '1000 hz', expression: '1000' },
				{ title: '4000 hz', expression: '4000' },
				{ title: '10000 hz', expression: '10000' },
				{ title: 'Slow sweep', expression: '5000 + 3500 * Math.sin(time / 5.0)' },
				{ title: 'Fast sweep', expression: '5000 + 3500 * Math.cos(time * 0.3)' },
			],
			'resonance': [
				{ title: 'No resonance', expression: '0' },
				{ title: 'Full resonance', expression: '100' },
			],
			'delaytime': [
			  { title: '1/4th beat', expression:'25' },
			  { title: '1/2th beat', expression:'50' },
			  { title: '3/4th beat', expression:'75' },
			  { title: 'full beat', expression:'100' },
			  { title: 'full bar', expression:'400' },
			  { title: 'Slow whine', expression:'0.6 + 0.2 * Math.sin(time)' },
			  { title: 'Fast echo mayhem', expression: '1.6 + 1.2 * Math.sin(time * 15)' }
			],
			'filtertype': [
				{ title: 'Lowpass', expression: '0' },
				{ title: 'Highpass', expression: '1' },
				{ title: 'Bandpass', expression: '2' },
				{ title: 'Lowshelf', expression: '3' },
				{ title: 'Highshelf', expression: '4' },
				{ title: 'Peaking', expression: '5' },
				{ title: 'Notch', expression: '6' },
				{ title: 'Allpass', expression: '7' }
			]
		}

		this.getDeviceHelp = function(devicetype) {
			return "Lorem ipsum helptext for device "+devicetype;
		}

		this.getParameterPresets = function(parametertype) {
			if (presets[parametertype])
				return presets[parametertype];
			return [];
		}

		this.getParameterHelp = function(parametertype) {
			if (props[parametertype])
				return props[parametertype];
			return '';
		}

	});
});
