var CompressorDevice = function() {
	BaseDevice.apply(this);
	this.typeTitle = 'Compressor';
	this.parameters.push({ id:'threshold', type:'threshold', title: 'Threshold', substep: false, default: '24' });
	this.parameters.push({ id:'knee', type:'knee', title: 'Knee', substep: false, default: '30' });
	this.parameters.push({ id:'ratio', type:'ratio', title: 'Ratio', substep: false, default: '12' });
	this.parameters.push({ id:'reduction', type:'reduction', title: 'Reduction', substep: true, default: '0' });
	this.parameters.push({ id:'attack', type:'attack', title: 'Attack', substep: true, default: '3' });
	this.parameters.push({ id:'release', type:'release', title: 'Release', substep: true, default: '250' });
};

CompressorDevice.prototype = new BaseDevice();

CompressorDevice.prototype.create = function() {
	this.inputpin = this.machine.context.createGainNode();
	this.outputpin = this.machine.context.createGainNode();
	this.comp = this.machine.context.createDynamicsCompressor();
	this.inputpin.connect(this.comp);
	this.comp.connect(this.outputpin);
}

CompressorDevice.prototype.destroy = function() {
	this.outputpin.disconnect();
};

CompressorDevice.prototype.update = function(track, state) {
	if(track.values['threshold'].updated) {
		var df = track.values['treshold'].value;
		this.filter.threshold = -df;
	}
	if(track.values['knee'].updated) {
		var df = track.values['knee'].value;
		this.filter.knee.value = df;
	}
	if(track.values['ratio'].updated) {
		var df = track.values['ratio'].value;
		this.filter.ratio.value = df;
	}
	if(track.values['reduction'].updated) {
		var df = track.values['reduction'].value;
		this.filter.reduction.value = -df;
	}
	if(track.values['attack'].updated) {
		var df = track.values['attack'].value;
		this.filter.attack.value = df / 1000.0;
	}
	if(track.values['release'].updated) {
		var df = track.values['release'].value;
		this.filter.release.value = df / 1000.0;
	}
}
