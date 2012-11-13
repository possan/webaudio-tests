
function Track() {
	this.values = [];
	this.resolution = 8;
	this.callback = null;
	this.silent = false;
}

Track.prototype.addValue = function(value, speedy) {
	this.values.push({
		source: value,
		highspeed: speedy,
		value: 0.0,
	});
}

Track.prototype.setResolution = function(res) {
	this.resolution = res;
}

Track.prototype.getResolution = function() {
	return this.resolution;
}

Track.prototype.release = function() {
}

Track.prototype.step = function(state) {
	if (this.silent)
		return;
	// console.log('Track step', state);
	var ss = state.superstep;
	// check gate, fire off sound, all values are now evaluated and ready...
	for(var i=0; i<this.values.length; i++) {
		var t = this.values[i];
		t.updated = false;
		if (t.highspeed || (ss % this.resolution) == 0) {
			// console.log('evaluate step, value #', i, state);
			t.value = t.source.evalValue(state);
			t.updated = true;
		}
	}
	if (this.callback)
		this.callback(this, state);
}





