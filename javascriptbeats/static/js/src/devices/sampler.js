var SamplerDevice = function() {
	BaseDevice.apply(this);
	this.mutable = true;
	this.typeTitle = 'Sampler';
	this.parameters.push({ id:'gate', type:'gate', title: 'Gate', substep: false, default: '0' });
	this.parameters.push({ id:'volume', type:'volume', title: 'Volume', substep: false, default: '100' });
	this.parameters.push({ id:'speed', type:'playbackspeed', title: 'Playback speed', substep: false, default: '100' });
	this.parameters.push({ id:'sample', type:'sample', title: 'Sample number', substep: false, default: '0' });
	this.parameters.push({ id:'release', type:'ms-release', title: 'Release', substep: false, default: '2000' });
};

SamplerDevice.prototype = new BaseDevice();

SamplerDevice.prototype.create = function() {
	var self = this;

	this.outputpin = self.machine.context.createGainNode();
	this.outputpin.gain.value = 1.0;
}

SamplerDevice.prototype.destroy = function() {
	this.outputpin.disconnect();
};

SamplerDevice.prototype.update = function(track, state) {
	// console.log('update sampler #'+track.id, track, state);
	var self = this;

	if (track.values['gate'].updated && track.values['gate'].value > 0.0) {
		// if (state.superstep % 8 == 0) {
		// console.log('trigger sample.', t2, state);

		// gateindicator.className = 'indicator on';
		var w = Math.floor(track.values['sample'].value);
		if (w >= 0 && w < self.machine.sampler.buffers.length) {
			var source = self.machine.context.createBufferSource();
		  source.buffer = self.machine.sampler.buffers[w % self.machine.sampler.buffers.length];
		  source.playbackRate.value = track.values['speed'].value / 100.0;
			source.loop = false;

			var release = 1.0 * track.values['release'].value;
			var gainNode = self.machine.context.createGainNode();
	  	gainNode.gain.setValueAtTime(track.values['volume'].value / 100.0, this.machine.context.currentTime);
	    gainNode.gain.linearRampToValueAtTime(0.0, this.machine.context.currentTime + release / 1000.0);
			source.connect(gainNode);

			gainNode.connect(self.outputpin);

			source.noteOn(0.0);
			setTimeout(function() {
				source.noteOff(0);
			}, 1000);
		}
	}
	//	else
	//		gateindicator.className = 'indicator';
}
