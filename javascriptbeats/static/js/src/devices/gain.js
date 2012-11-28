var GainDevice = function() {
	BaseDevice.apply(this);
	this.typeTitle = 'Gain';
	this.parameters.push({ id:'volume', type:'volume', title: 'Volume', substep: true, default: '100' });
};

GainDevice.prototype = new BaseDevice();

GainDevice.prototype.create = function() {
	this.inputpin = this.machine.context.createGainNode();
	this.outputpin = this.machine.context.createGainNode();
	this.inputpin.connect(this.outputpin);
}

GainDevice.prototype.destroy = function() {
	this.outputpin.disconnect();
};

GainDevice.prototype.update = function(track, state) {
	if(track.values['volume'].updated) {
		var df = track.values['volume'].value;
	  this.outputpin.gain.value = df / 100.0;
	}
}
