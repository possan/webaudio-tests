var SamplerDevice = function() {
	BaseDevice.apply(this);
	this.parameters.push({ id:'gate', type:'', substep: false });
	this.parameters.push({ id:'volume', type:'', substep: false });
	this.parameters.push({ id:'speed', type:'', substep: false });
	this.parameters.push({ id:'sample', type:'', substep: false });
	this.parameters.push({ id:'release', type:'', substep: false });
	this.parameters.push({ id:'send1', type:'', substep: false });
	this.parameters.push({ id:'send2', type:'', substep: false });
};

SamplerDevice.prototype = new BaseDevice();

SamplerDevice.prototype.create = function() {
	var self = this;

	this.output = self.machine.context.createGainNode();
	this.output.gain.value = 1.0;
	this.output.connect(self.machine.drybus);

	this.send1Node = self.machine.context.createGainNode();
	this.send1Node.gain.value = 1.0;
	this.output.connect(this.send1Node);
	this.send1Node.connect(self.machine.bus1);

	this.send2Node = self.machine.context.createGainNode();
	this.send2Node.gain.value = 1.0;
	this.output.connect(this.send2Node);
	this.send2Node.connect(self.machine.bus2);
}

SamplerDevice.prototype.destroy = function() {};

SamplerDevice.prototype.update = function(track, state) {
	var self = this;
	// console.log('sample track step', state);
	// console.log('gate=', track.values[0].value);
	// console.log('vol=', track.values[1].value);
	// console.log('speed=', track.values[2].value);
	// console.log('sample=', track.values[3].value);
	// console.log('release=', track.values[4].value);
	// console.log('send1=', track.values[5].value);
	// console.log('send2=', track.values[6].value);

	if(track.values['send1'].updated) {
		// console.log('send1='+track.values[5].value);
	  self.send1Node.gain.value = track.values['send1'].value / 100.0;
	}

	if(track.values['send2'].updated) {
		// console.log('send2='+track.values[6].value);
	  self.send2Node.gain.value = track.values['send2'].value / 100.0;
	}

	if (track.values['gate'].updated && track.values['gate'].value > 0.0) {
		// if (state.superstep % 8 == 0) {
		// console.log('trigger sample.', t2, state);

		// gateindicator.className = 'indicator on';
		var source = self.machine.context.createBufferSource();
		var w = Math.floor(track.values['sample'].value);
	  source.buffer = self.machine.sampler.buffers[w % self.machine.sampler.buffers.length];
	  source.playbackRate.value = track.values['speed'].value / 100.0;
		source.loop = false;

		var release = 1.0 * track.values['release'].value;
		var gainNode = self.machine.context.createGainNode();
  	gainNode.gain.setValueAtTime(track.values['volume'].value / 100.0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.0, context.currentTime + release / 1000.0);
		source.connect(gainNode);

		gainNode.connect(self.output);

		source.noteOn(0.0);
		setTimeout(function() {
			source.noteOff(0);
		}, 1000);
	}
	//	else
	//		gateindicator.className = 'indicator';
}
