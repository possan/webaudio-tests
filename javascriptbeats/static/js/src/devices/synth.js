var SynthDevice = function() {
	BaseDevice.apply(this);
	this.parameters.push({ id:'gate', type:'', substep: false });
	this.parameters.push({ id:'note', type:'', substep: false });
	this.parameters.push({ id:'cutoff', type:'', substep: true });
	this.parameters.push({ id:'resonance', type:'', substep: true });
	this.parameters.push({ id:'release', type:'', substep: false });
	this.parameters.push({ id:'volume', type:'', substep: false });
	this.parameters.push({ id:'waveform', type:'', substep: false });
	this.parameters.push({ id:'send1', type:'', substep: false });
	this.parameters.push({ id:'send2', type:'', substep: false });
};

SynthDevice.prototype = new BaseDevice();

SynthDevice.prototype.create = function() {
	this.outputpin = this.machine.context.createGainNode();
	this.outputpin.connect(this.machine.drybus)

	this.filter = this.machine.context.createBiquadFilter();
	this.filter.type = 0;
  this.filter.frequency.value = 0.0;
	this.filter.connect(this.outputpin);

	this.send1Node = this.machine.context.createGainNode();
	this.send1Node.gain.value = 1.0;
	this.filter.connect(this.send1Node);
	this.send1Node.connect(this.machine.bus1);

	this.send2Node = this.machine.context.createGainNode();
	this.send2Node.gain.value = 1.0;
	this.filter.connect(this.send2Node);
	this.send2Node.connect(this.machine.bus2);
}

SynthDevice.prototype.destroy = function() {};

SynthDevice.prototype.update = function(track, state) {
	if(track.values['cutoff'].updated) {
		// console.log('cut='+track.values[2].value);
	  this.filter.frequency.value = track.values['cutoff'].value;
	  this.filter.Q.value = track.values['resonance'].value / 100.0;
	}

	if(track.values['send1'].updated) {
		// console.log('send1='+track.values[7].value);
	  this.send1Node.gain.value = track.values['send1'].value / 100.0;
	}

	if(track.values['send2'].updated) {
		// console.log('send2='+track.values[8].value);
	  this.send2Node.gain.value = track.values['send2'].value / 100.0;
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

