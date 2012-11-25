var DelayDevice = function() {
	BaseDevice.apply(this);
	this.typeTitle = 'Delay';
	this.parameters.push({ id:'delaytime', type:'delaytime', title: 'Delay time', substep: true, default: '75' });
	this.parameters.push({ id:'delayfeedback', type:'delayfeedback', title: 'Feedback', substep: true, default: '66' });
};

DelayDevice.prototype = new BaseDevice();

DelayDevice.prototype.create = function() {

	this.inputpin = this.machine.context.createGainNode();

	this.outputpin = this.machine.context.createGainNode();

	this.delay = this.machine.context.createDelayNode();
	this.delay.delayTime.value = 0.5;

	this.delayfeedback = this.machine.context.createGainNode();
	this.delayfeedback.gain.value = 0.5;

	this.inputpin.connect(this.delay);

	this.delay.connect(this.delayfeedback);
	this.delayfeedback.connect(this.delay);

	this.delayfeedback.connect(this.outputpin);
}

DelayDevice.prototype.destroy = function() {
	this.outputpin.disconnect();
};

DelayDevice.prototype.update = function(track, state) {
	if(track.values['delaytime'].updated) {
		var dt = track.values['delaytime'].value;
		var bpm = this.machine.sequencer.bpm;
		var bps = 1 * bpm / 60.0;
		var mspb = 1000.0 / bps;
		var msd = dt * mspb / 100.0;
	  this.delay.delayTime.value = msd / 1000.0; // ms -> seconds
	}
	if(track.values['delayfeedback'].updated) {
		var df = track.values['delayfeedback'].value;
		// console.log(this.id, 'delayfeedback changed', df);
	  this.delayfeedback.gain.value = Math.min( 1.0, Math.max( 0.0, df / 100.0 ) );
	}
}
