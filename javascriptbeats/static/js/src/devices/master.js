var MasterDevice = function() {
	BaseDevice.apply(this);
 	/*
 	this.parameters.push({ id:'receive1', type:'', substep: true, default: '50' });
	this.parameters.push({ id:'receive2', type:'', substep: true, default: '50' });
	*/
	this.parameters.push({ id:'compression', type:'', substep: true, default: '100' });
	this.parameters.push({ id:'comprelease', type:'', substep: true, default: '100' });
	this.parameters.push({ id:'comptreshold', type:'', substep: true, default: '80' });
};

MasterDevice.prototype = new BaseDevice();

MasterDevice.prototype.create = function() {
	console.error('Created master!');
	this.inputpin = this.machine.context.createGainNode();
	this.compressor = this.machine.context.createDynamicsCompressor();
	this.inputpin.connect(this.compressor);
	this.compressor.connect(this.machine.context.destination);
}

MasterDevice.prototype.destroy = function() {};

MasterDevice.prototype.update = function(track, state) {
	/*
	if(track.values['receive1'].updated) {
	  this.receive1.gain.value = track.values['receive1'].value / 1000.0;
	}

	if(track.values['receive2'].updated) {
	  this.receive2.gain.value = track.values['receive2'].value / 100.0;
	}
	*/
	/*
	if(track.values['compression'].updated) {
	  this.compressor.gain.value = track.values['compression'].value / 100.0;
	}

	if(track.values['comprelease'].updated) {
	  this.compressor.gain.value = track.values['comprelease'].value / 100.0;
	}

	if(track.values['comptreshold'].updated) {
	  this.compressor.gain.value = track.values['comptreshold'].value / 100.0;
	}
	*/
}
