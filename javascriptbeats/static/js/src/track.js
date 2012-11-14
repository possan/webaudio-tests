
function Track() {
	this.values = {};
	this.valueids = [];
	this.resolution = 8;
	this.deviceid = '';
	this.device = null;
	this.callback = null;
	this.silent = false;
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
			// console.log('evaluate step, value #', i, state);
			t.value = t.source.evalValue(state);
			t.updated = true;
		}
	}

	if (this.callback)
		this.callback(this, state);

	if (this.device != null)
		this.device.update(this, state);
}

Track.prototype.setData = function(data) {
	for (var i=0; i<this.valueids.length; i++) {
		var id = this.valueids[i];
		var t = this.values[id];
		var input = data[id] || {};
		var newvalue = input.value || 0.0;
		t.updated = false;
		if (newvalue != t.source.value) {
			t.source.value = newvalue;
			t.updated = true;
		}
		if (input.dynamic && input.expression)
			t.source.setExpression(input.expression);
	}
}




