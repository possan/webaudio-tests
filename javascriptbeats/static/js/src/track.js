
function Track() {
	this.values = {};
	this.valueids = [];
	this.resolution = 8;
	this.deviceid = '';
	this.device = null;
	this.callback = null;
	this.silent = false;
	this.mutable = false;
}

Track.prototype.addValue = function(value, id, speedy) {
	if (this.valueids.indexOf(id) == -1) {
		this.valueids.push(id);
		this.values[id] = {
			source: value,
			highspeed: speedy,
			value: 0.0
		};
	} else {
		this.values[id].source = value;
		this.values[id].speedy = speedy;
	}
}

Track.prototype.release = function() {
}

Track.prototype.step = function(state) {
	if (this.silent)
		return;

	// console.log('Track step', state);
	var ss = state.superstep;
	// check gate, fire off sound, all values are now evaluated and ready...
	for(var i=0; i<this.valueids.length; i++) {
		var id = this.valueids[i];
		var t = this.values[id];
		t.updated = false;
		if (t.highspeed || (ss % this.resolution) == 0) {
			t.value = t.source.evalValue(state);
			// console.log('evaluate step value', t.source.expression, t.value);
			t.updated = true;
		}
	}
}

Track.prototype.setData = function(data) {
	this.solo = data.solo || false;
	this.mute = data.mute || false;
	this.silent = data.silent || false;
	this.title = data.title || '';
	for (var i=0; i<this.valueids.length; i++) {
		var id = this.valueids[i];
		var t = this.values[id];
		var input = data[id] || '';
		t.source.setExpression(input);
	}
}





