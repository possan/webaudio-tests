var BusDevice = function() {
	BaseDevice.apply(this);
	this.parameters.push({ id:'delaytime', type:'', substep: true });
	this.parameters.push({ id:'delayfeedback', type:'', substep: true });
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

BusDevice.prototype.update = function(track, state) {
	if(track.values['delaytime'].updated) {
		// console.log('delaytime changed', track.values['delaytime']);
		var bpm = this.machine.sequencer.bpm;
		var bps = 1 * bpm / 60.0;
		var mspb = 1000.0 / bps;
		var msd = track.values['delaytime'].value * mspb / 100.0;
	//	console.log('mspb',mspb,'msd',msd);
	  this.delay.delayTime.value = msd / 1000.0; // ms -> seconds
	}
	if(track.values['delayfeedback'].updated) {
		// console.log('delayfeedback changed', track.values['delayfeedback']);
	  this.delayfeedback.gain.value = Math.min( 1.0, Math.max( 0.0, track.values['delayfeedback'].value / 100.0 ) );
	}
}
