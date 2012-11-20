var BusDevice = function() {
	BaseDevice.apply(this);
	this.parameters.push({ id:'delaytime', type:'', substep: true, default: '75' });
	this.parameters.push({ id:'delayfeedback', type:'', substep: true, default: '66' });
	/*
	addDynamicValueTrack(t, 'delaytime', intrack.delaytime || {}, false); // volume 1
	addDynamicValueTrack(t, 'delayfeedback', intrack.delayfeedback || {}, false); // gate 0
	*/
};

BusDevice.prototype = new BaseDevice();

BusDevice.prototype.create = function() {

	this.inputpin = this.machine.context.createGainNode();

	this.outputpin = this.machine.context.createGainNode();

	this.delayfeedback = this.machine.context.createGainNode();
	this.delayfeedback.gain.value = 0.5;

	this.delay = this.machine.context.createDelayNode();
	this.delay.delayTime.value = 0.5;

	this.inputpin.connect(this.delay);

	this.delay.connect(this.delayfeedback);
	this.delayfeedback.connect(this.delay);

	this.delayfeedback.connect(this.outputpin);
}

BusDevice.prototype.destroy = function() {};

BusDevice.prototype.update = function(track, state) {
	if(track.values['delaytime'].updated) {
		// console.log('delaytime changed', track.values['delaytime']);
		var dt = track.values['delaytime'].value;
		var bpm = this.machine.sequencer.bpm;
		var bps = 1 * bpm / 60.0;
		var mspb = 1000.0 / bps;
		var msd = dt * mspb / 100.0;
		// console.log('delaytime changed, mspb',mspb,'msd',msd);
	  this.delay.delayTime.value = msd / 1000.0; // ms -> seconds
	}
	if(track.values['delayfeedback'].updated) {
		var df = track.values['delayfeedback'].value;
		// console.log('delayfeedback changed', df);
	  this.delayfeedback.gain.value = Math.min( 1.0, Math.max( 0.0, df / 100.0 ) );
	}
}
