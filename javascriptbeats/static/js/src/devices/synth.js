var SynthDevice = function() {
	BaseDevice.apply(this);
	this.mutable = true;
	this.parameters.push({ id:'gate', type:'', substep: false });
	this.parameters.push({ id:'note', type:'', substep: false });
	this.parameters.push({ id:'cutoff', type:'', substep: true });
	this.parameters.push({ id:'resonance', type:'', substep: true });
	this.parameters.push({ id:'release', type:'', substep: false });
	this.parameters.push({ id:'volume', type:'', substep: false });
	this.parameters.push({ id:'waveform', type:'', substep: false });
};

SynthDevice.prototype = new BaseDevice();

SynthDevice.prototype.create = function() {
	this.outputpin = this.machine.context.createGainNode();
	this.filter = this.machine.context.createBiquadFilter();
	this.filter.type = 0;
  this.filter.frequency.value = 0.0;
	this.filter.connect(this.outputpin);
}

SynthDevice.prototype.destroy = function() {};

SynthDevice.prototype.update = function(track, state) {
	if(track.values['cutoff'].updated) {
	  this.filter.frequency.value = track.values['cutoff'].value;
	  this.filter.Q.value = track.values['resonance'].value / 100.0;
	}

	if (track.values['gate'].updated && track.values['gate'].value > 0.0) {
		var note = Math.round(track.values['note'].value);
		var freq = 440.0*Math.pow(2.0, (note-49.0)/12.0);
		// console.log('note='+note+', freq='+freq);

		// console.log('trigger synth.', t2, state);

		var source = this.machine.context.createOscillator();
		source.type = track.values['waveform'].value;
		source.frequency.value = freq;

		var release = 1.0 * track.values['release'].value;

		var gainNode = this.machine.context.createGainNode();
  	gainNode.gain.setValueAtTime(track.values['volume'].value / 100.0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.0, context.currentTime + release / 1000.0);
		source.connect(gainNode);

		gainNode.connect(this.filter);

			// gateindicator.className = 'indicator on';
		source.noteOn(0);
		setTimeout(function() {
 			// gateindicator.className = 'indicator';
			source.noteOff(0);
		}, release);
	}
}

