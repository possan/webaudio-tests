var SynthDevice = function() {
	BaseDevice.apply(this);
	this.mutable = true;
	this.typeTitle = 'Synthesizer';
	this.parameters.push({ id:'gate', type:'gate', title:'Gate', substep: false, default: '0' });
	this.parameters.push({ id:'note', type:'note', title:'Note', substep: false, default: '24' });
	this.parameters.push({ id:'cutoff', type:'hz', title: 'Cutoff', substep: true, default: '10000' });
	this.parameters.push({ id:'resonance', type:'percent', title: 'Resonance', substep: true, default: '0' });
	this.parameters.push({ id:'release', type:'ms-release', title: 'Release', substep: false, default: '150' });
	this.parameters.push({ id:'volume', type:'volume', title: 'Volume', substep: false, default: '100' });
	this.parameters.push({ id:'waveform', type:'waveform', title: 'Waveform', substep: false, default: '1' });
	this.parameters.push({ id:'filterenv', type:'filterenv', title: 'Filter env', substep: false, default: '0' });
	this.parameters.push({ id:'waveform2', type:'waveform', title: 'Osc 2 Waveform', substep: false, default: '0' });
	this.parameters.push({ id:'speed2', type:'speed', title: 'Osc 2 Speed', substep: false, default: '0' });
	this.parameters.push({ id:'mix2', type:'', title: 'Osc 2 Ringmod', substep: false, default: '0' });
};

SynthDevice.prototype = new BaseDevice();

SynthDevice.prototype.create = function() {
	this.outputpin = this.machine.context.createGainNode();
	this.filter = this.machine.context.createBiquadFilter();
	this.filter.type = 0;
  this.filter.frequency.value = 0.0;
	this.filter.connect(this.outputpin);
}

SynthDevice.prototype.destroy = function() {
	this.outputpin.disconnect();
};

SynthDevice.prototype.update = function(track, state) {
	// console.log('update synth #'+track.id, track, state);
	if(track.values['cutoff'].updated) {
		var fenv = Math.round(track.values['filterenv'].value);
		if (fenv != 0) {

		} else {
		  this.filter.frequency.value = track.values['cutoff'].value;
		}
	  this.filter.Q.value = track.values['resonance'].value / 100.0;
	}

	if (track.values['gate'].updated && track.values['gate'].value > 0.0) {
		var note = Math.round(track.values['note'].value);
		var freq = 440.0*Math.pow(2.0, (note-49.0)/12.0);
		// console.log('note='+note+', freq='+freq);

		var source = this.machine.context.createOscillator();
		source.type = track.values['waveform'].value;
		source.frequency.value = freq;

		var source2 = this.machine.context.createOscillator();
		source2.type = track.values['waveform2'].value;
		source2.frequency.value = freq * track.values['speed2'].value;

		var s2gain = this.machine.context.createGainNode();
		s2gain.gain.value = track.values['mix2'].value;
		source2.connect(s2gain);

		var ringmod = this.machine.context.createGainNode();
		source.connect(ringmod);
		s2gain.connect(ringmod.gain);
		ringmod.gain.value = 1 - track.values['mix2'].value;

		var release = 1.0 * track.values['release'].value;
		var fenv = Math.round(track.values['filterenv'].value);
		if (fenv != 0)
		{
			var f0 = track.values['cutoff'].value;
	  	this.filter.frequency.setValueAtTime(f0, this.machine.context.currentTime);
	    this.filter.frequency.linearRampToValueAtTime(f0 + fenv, this.machine.context.currentTime + release / 1000.0);
		}

		var gainNode = this.machine.context.createGainNode();
  	gainNode.gain.setValueAtTime(track.values['volume'].value / 100.0, this.machine.context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.0, this.machine.context.currentTime + release / 1000.0);
		ringmod.connect(gainNode);

		gainNode.connect(this.filter);

			// gateindicator.className = 'indicator on';
		source.noteOn(0);
		source2.noteOn(0);
		setTimeout(function() {
 			// gateindicator.className = 'indicator';
			source.noteOff(0);
			source2.noteOff(0);
		}, release);
	}
}

