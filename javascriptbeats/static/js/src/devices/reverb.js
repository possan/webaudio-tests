var ReverbDevice = function() {
	BaseDevice.apply(this);
	this.typeTitle = 'Reverb';
	this.parameters.push({ id:'waveform', type:'sample', title: 'Impulse response', substep: false, default: '20' });
	// this.parameters.push({ id:'cutoff', type:'cutoff', title: 'Cutoff', substep: true, default: '22050' });
	// this.parameters.push({ id:'resonance', type:'resonance', title: 'Resonance', substep: true, default: '0' });
	// this.parameters.push({ id:'feedback', type:'delayfeedback', title: 'Feedback', substep: true, default: '25' });
};

ReverbDevice.prototype = new BaseDevice();

ReverbDevice.prototype.create = function() {
	this.inputpin = this.machine.context.createGainNode();
	this.outputpin = this.machine.context.createGainNode();
	this.filter = this.machine.context.createConvolver();
	this.filter.normalize = true;
	this.lastsample = -1;
	this.inputpin.connect(this.filter);
	this.filter.connect(this.outputpin);
}

ReverbDevice.prototype.destroy = function() {
	this.outputpin.disconnect();
};

ReverbDevice.prototype.update = function(track, state) {
	if(track.values['waveform'].updated) {
		var w = Math.round(track.values['waveform'].value);
		if (w != this.lastsample) {
			this.lastsample = w;
			this.filter.buffer = self.machine.sampler.buffers[w % self.machine.sampler.buffers.length];
			// this.filter.type = df;
		}
	}
}
