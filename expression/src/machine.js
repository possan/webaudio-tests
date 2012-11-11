Machine = function(context) {
	this.context = context;
	this.compressor = context.createDynamicsCompressor();
	this.compressor.connect(context.destination);
	this.song = new Song();
	this.sampler = new Sampler();
	this.sequencer = new Sequencer();
	this.reset();
	window.machine = this;
}

Machine.getInstance = function() {
	return window.machine;
}

Machine.prototype.reset = function() {
	this.setData({
		bpm: 110.0,
		shuffle: 25.0,
		tracks: [
		 /*	{
				type: 'sampler',
				sample: { value: 0, dynamic: false },
				gate: { expr: 'step % 4 == 0', dynamic: true },
				volume: { value: 100, dynamic: false },
				speed: { value: 100, dynamic: false },
				release: { value: 100, dynamic: false }
			}, */
			{
				type: 'synth',
				gate: { expression: 'step % 1 == 0', dynamic: true },
				note: { value: 0, dynamic: true, expression: '24 + step % 5' },
				volume: { value: 100, dynamic: false },
				speed: { value: 100, dynamic: false },
				waveform: { value: 1, dynamic: false },
				release: { value: 100, dynamic: false },
				cutoff: { value: 10000, dynamic: false },
				resonance: { value: 1, dynamic: false }
			}
		]
	});
}


Machine.prototype.load = function(data) {
	this.song.load(data);
}

Machine.prototype.save = function() {
	return this.song.save();
}

Machine.prototype.play = function() {
	this.sequencer.play();
}

Machine.prototype.stop = function() {
	this.sequencer.stop();
}

Machine.prototype.createSamplerTrackCallback = function() {
	var self = this;
	return function(t2, state) {
		// console.log('sample track step', state);
		// console.log('gate=', t2.values[0].value);
		// console.log('vol=', t2.values[1].value);
		// console.log('speed=', t2.values[2].value);
		// console.log('sample=', t2.values[3].value);
		// console.log('release=', t2.values[4].value);
		if (t2.values[0].updated && t2.values[0].value > 0.0) {
			// if (state.superstep % 8 == 0) {
			// console.log('trigger sample.', t2, state);

			// gateindicator.className = 'indicator on';
			var source = self.context.createBufferSource();
			var w = Math.floor(t2.values[3].value);
  	  source.buffer = self.sampler.buffers[w % self.sampler.buffers.length];
  	  source.playbackRate.value = t2.values[2].value / 100.0;
			source.loop = false;

			var release = 1.0 * t2.values[4].value;
			var gainNode = self.context.createGainNode();
    	gainNode.gain.setValueAtTime(t2.values[1].value / 100.0, context.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.0, context.currentTime + release / 1000.0);
			source.connect(gainNode);

			gainNode.connect(self.compressor);

			source.noteOn(0.0);
			setTimeout(function() {
				source.noteOff(0);
			}, 1000);
		}
		//	else
		//		gateindicator.className = 'indicator';
	};
}


Machine.prototype.createSynthTrackCallback = function() {
	var self = this;

	var filter = context.createBiquadFilter();
	filter.type = 0;
  filter.frequency.value = 0.0;
	filter.connect(self.compressor);

	return function(t2, state) {
		/*
		console.log('synth track step', state);
		console.log('gate=', t2.values[0].value);
		console.log('note=', t2.values[1].value);
		console.log('cut=', t2.values[2].value);
		console.log('rez=', t2.values[3].value);
		console.log('release=', t2.values[4].value);
		console.log('vol=', t2.values[5].value);
		console.log('waveform=', t2.values[6].value);
		*/
		if(t2.values[2].updated) {
			// console.log('cut='+t2.values[2].value);
		  filter.frequency.value = t2.values[2].value;
		  filter.Q.value = t2.values[3].value;
		}

		if (t2.values[0].updated &&
			t2.values[0].value > 0.0) {
			var note = Math.round(t2.values[1].value);
			var freq = 440.0*Math.pow(2.0, (note-49.0)/12.0);
			// console.log('note='+note+', freq='+freq);

			// console.log('trigger synth.', t2, state);

			var source = self.context.createOscillator();
			source.type = t2.values[6].value;
			source.frequency.value = freq;

			var release = 1.0 * t2.values[4].value;
			var gainNode = self.context.createGainNode();
    	gainNode.gain.setValueAtTime(t2.values[5].value / 100.0, context.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.0, context.currentTime + release / 1000.0);
			source.connect(gainNode);

			gainNode.connect(filter);

 			// gateindicator.className = 'indicator on';
			source.noteOn(0);
			setTimeout(function() {
	 			// gateindicator.className = 'indicator';
				source.noteOff(0);
			}, release);
		}
	};
}

Machine.prototype.setData = function(data) {

	var addDynamicValueTrack = function(target, input, speedy) {
		console.log('addDynamicValueTrack', input);
		var value = new DynamicValue(input.value || 0.0);
		value.value = input.value || 0.0;
		if (input.dynamic && input.expression)
			value.setExpression(input.expression);
		target.addValue(value, speedy);
	}

	this.song.data = data;
	this.sequencer.setBPM(this.song.data.bpm);
	this.sequencer.setShuffle(this.song.data.shuffle);

	for (var i=0; i<this.sequencer.tracks.length; i++) {
		this.sequencer.tracks[i].release();
	}

	this.sequencer.tracks = [];

	if (data.tracks) {
		for (var i=0; i<data.tracks.length; i++) {
			console.log('migrate track #'+i, data.tracks[i]);
			var intrack = data.tracks[i];
			if (intrack.type === 'synth') {
				var t = new Track();
				addDynamicValueTrack(t, intrack.gate || {}, false); // gate 0
				addDynamicValueTrack(t, intrack.note || {}, false); // note 1
				addDynamicValueTrack(t, intrack.cutoff || {}, true); // cutoff 2
				addDynamicValueTrack(t, intrack.resonance || {}, true); // resonance 3
				addDynamicValueTrack(t, intrack.release || {}, false); // release 4
				addDynamicValueTrack(t, intrack.volume || {}, false); // volume 5
				addDynamicValueTrack(t, intrack.waveform || {}, false); // wave 6
				t.callback = this.createSynthTrackCallback();
				this.sequencer.tracks.push(t);
			} else if (intrack.type === 'sampler' ) {
				var t = new Track();
				addDynamicValueTrack(t, intrack.gate || {}, false); // gate 0
				addDynamicValueTrack(t, intrack.volume || {}, false); // volume 1
				addDynamicValueTrack(t, intrack.speed || {}, false); // playback speed 2
				addDynamicValueTrack(t, intrack.sample || {}, false); // sample 3
				addDynamicValueTrack(t, intrack.release || {}, false); // release 4
				t.callback = this.createSamplerTrackCallback();
				this.sequencer.tracks.push(t);
			}
		}
	}
}