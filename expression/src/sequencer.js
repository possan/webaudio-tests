
function Sequencer() {
	this.bpm = 120;
	this.shuffle = 0;
	this.timeperstep = 0;
	this.timeperstep2 = 0;
	this.supersteps = 8;
	this.halfsupersteps = this.supersteps / 2;
	this.superstep = 0;
	this.progress = 0;
	this.progresstotal = 0;
	this.tracks = [];
	this.mixer = null;
}

Sequencer.prototype.addTrack = function(track) {
	this.tracks.push(track);
}

Sequencer.prototype._subtick = function(d) {
	var st = Math.floor(this.superstep / this.supersteps);
	var ss = this.superstep % this.supersteps;
	// if (ss == 0)
	// console.log('subtick', this.superstep, st, ss, d);

	var state = {
		step: st,
		substep: ss,
		superstep: this.superstep,
		time: this.progresstotal / 1000.0
	};

	for (var i=0; i<this.tracks.length; i++) {
		this.tracks[i].step(state);
	}

	if (this.mixer)
		this.mixer.step(state);

	this.superstep += 1;
}

Sequencer.prototype.setBPM = function(bpm) {
	this.bpm = bpm;
	this._updateBPM();
}

Sequencer.prototype.setShuffle = function(shuffle) {
	this.shuffle = shuffle;
	this._updateBPM();
}

Sequencer.prototype._updateBPM = function() {
	var bps = this.bpm / 60.0 * 4.0;
	var tps =  (1000 / bps) / this.supersteps;
	var s = Math.max(-90, Math.min(90, this.shuffle))
	var st = tps * s / 200;
	this.timeperstep = tps + st;
	this.timeperstep2 = tps - st;
	// console.log('time per superstep', this.timeperstep);
}

Sequencer.prototype.play = function() {
	if (this.started)
		return;
	this.started = true;
	this._updateBPM();
	var self = this;
	var lasttick = (new Date()).getTime();
	this.progress = 0;
	this.timer = setInterval(function() {
		var t = (new Date()).getTime();
		var dt = t - lasttick;
		lasttick = t;
		self.progress += dt;
		self.progresstotal += dt;
		var ss = Math.floor(self.superstep / self.supersteps);
		// var sh = self.supersteps / 2;
		var tps = (ss % 2 < 1) ? self.timeperstep : self.timeperstep2;
		if (self.progress < tps)
			return;
		// console.log('tps='+tps);
		self.progress -= tps;
		self._subtick(self.progress);
	}, 1);
}

Sequencer.prototype.stop = function() {
	if (!this.started)
		return;
	this.started = false;
	clearInterval(this.timer);
	this.timer = 0;
}

