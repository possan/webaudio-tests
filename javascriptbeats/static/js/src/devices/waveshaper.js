var WaveshaperDevice = function() {
	BaseDevice.apply(this);
	this.mutable = true;
	this.typeTitle = 'Waveshaper';
	this.parameters.push({ id:'curve0', type:'volume', title: 'Curve point 1', substep: false, default: '0' });
	this.parameters.push({ id:'curve1', type:'volume', title: 'Curve point 2', substep: false, default: '25' });
	this.parameters.push({ id:'curve2', type:'volume', title: 'Curve point 3', substep: false, default: '50' });
	this.parameters.push({ id:'curve3', type:'volume', title: 'Curve point 4', substep: false, default: '75' });
	this.parameters.push({ id:'curve4', type:'volume', title: 'Curve point 5', substep: false, default: '100' });
};

WaveshaperDevice.prototype = new BaseDevice();

WaveshaperDevice.prototype.create = function() {
	var self = this;

	this.inputpin = self.machine.context.createGainNode();

	this.shaper = self.machine.context.createWaveShaper();

	this.outputpin = self.machine.context.createGainNode();
	this.outputpin.gain.value = 1.0;

	this.inputpin.connect(this.shaper);
	this.shaper.connect(this.outputpin);
}

WaveshaperDevice.prototype.destroy = function() {
	this.outputpin.disconnect();
};

WaveshaperDevice.prototype.update = function(track, state) {
	if (track.values['curve0'].updated ||
		track.values['curve1'].updated ||
		track.values['curve2'].updated ||
		track.values['curve3'].updated ||
		track.values['curve4'].updated) {

	 	var samples = 2048;
    var curve = new Float32Array(samples);

		var _interp = function(n0, n1, v0, v1) {
			var l = n1-n0;
			for (var n=0; n<l; n++) {
				var v = v0 + (((v1-v0)*n)/l);
				curve[n0+n] = v;
			}
		}

		var v0 = (track.values['curve0'].value / 50.0) - 1.0;
		var v1 = (track.values['curve1'].value / 50.0) - 1.0;
		var v2 = (track.values['curve2'].value / 50.0) - 1.0;
		var v3 = (track.values['curve3'].value / 50.0) - 1.0;
		var v4 = (track.values['curve4'].value / 50.0) - 1.0;

		_interp( 0, 512, v0, v1 );
		_interp( 512, 1024, v1, v2 );
		_interp( 1024, 1536, v2, v3 );
		_interp( 1536, 2048, v3, v4 );

		this.shaper.curve = curve;
	}
}
