var MasterDevice = function() {
	BaseDevice.apply(this);
	this.typeTitle = 'Master';
	// this.parameters.push({ id:'compression', title: 'Compression', type: 'compression', substep: true, default: '100' });
	// this.parameters.push({ id:'comprelease', title: 'Comp. release', type: '', substep: true, default: '100' });
	// this.parameters.push({ id:'comptreshold', title: 'Comp. treshold', type: '', substep: true, default: '80' });
};

MasterDevice.prototype = new BaseDevice();

MasterDevice.prototype.create = function() {
	this.inputpin = this.machine.context.createGainNode();
	this.compressor = this.machine.context.createDynamicsCompressor();
	this.inputpin.connect(this.compressor);
	this.compressor.connect(this.machine.context.destination);
}

MasterDevice.prototype.destroy = function() {
	this.compressor.disconnect();
};

MasterDevice.prototype.update = function(track, state) {
}
