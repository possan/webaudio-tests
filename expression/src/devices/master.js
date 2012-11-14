var MasterDevice = function() {
	BaseDevice.apply(this);
	this.parameters.push({ id:'receive1', type:'', substep: true });
	this.parameters.push({ id:'receive2', type:'', substep: true });
	this.parameters.push({ id:'compression', type:'', substep: true });
	this.parameters.push({ id:'comprelease', type:'', substep: true });
	this.parameters.push({ id:'comptreshold', type:'', substep: true });
};

MasterDevice.prototype = new BaseDevice();

MasterDevice.prototype.create = function() {

	this.inputpin = this.machine.context.createGainNode();

	this.receive1 = this.machine.context.createGainNode();
	this.receive1.gain.value = 0;

	this.receive2 = this.machine.context.createGainNode();
	this.receive2.gain.value = 0;

	this.compressor = this.machine.context.createDynamicsCompressor();

	this.inputpin.connect(this.compressor);
	this.receive1.connect(this.compressor);
	this.receive2.connect(this.compressor);

	this.outputpin = this.machine.context.createGainNode();

	this.compressor.connect(this.outputpin);

}

MasterDevice.prototype.update = function(track, state) {

	if(track.values['receive1'].updated) {
	  this.receive1.gain.value = track.values['receive1'].value / 1000.0;
	}

	if(track.values['receive2'].updated) {
	  this.receive2.gain.value = track.values['receive2'].value / 100.0;
	}

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
