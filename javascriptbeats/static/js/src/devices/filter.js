var FilterDevice = function() {
	BaseDevice.apply(this);
	this.typeTitle = 'Filter';
	this.parameters.push({ id:'filtertype', type:'filtertype', title: 'Filter type', substep: false, default: '0' });
	this.parameters.push({ id:'cutoff', type:'cutoff', title: 'Cutoff', substep: true, default: '22050' });
	this.parameters.push({ id:'resonance', type:'resonance', title: 'Resonance', substep: true, default: '0' });
	this.parameters.push({ id:'gain', type:'gain', title: 'Gain', substep: true, default: '0' });
};

FilterDevice.prototype = new BaseDevice();

FilterDevice.prototype.create = function() {
	this.inputpin = this.machine.context.createGainNode();
	this.outputpin = this.machine.context.createGainNode();
	this.filter = this.machine.context.createBiquadFilter();
	this.inputpin.connect(this.filter);
	this.filter.connect(this.outputpin);
}

FilterDevice.prototype.destroy = function() {
	this.outputpin.disconnect();
};

FilterDevice.prototype.update = function(track, state) {
	if(track.values['filtertype'].updated) {
		var df = Math.round(track.values['filtertype'].value);
		this.filter.type = df;
	}
	if(track.values['cutoff'].updated) {
		var df = track.values['cutoff'].value;
		this.filter.frequency.value = df;
	}
	if(track.values['resonance'].updated) {
		var df = track.values['resonance'].value;
		this.filter.Q.value = df / 100.0;
	}
	if(track.values['gain'].updated) {
		var df = track.values['gain'].value;
		this.filter.gain.value = df;
	}
}
