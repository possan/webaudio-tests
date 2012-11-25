
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
	// console.log('Track step #'+this.id, state);
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
	if (typeof(data.solo) !== 'undefined')
		this.solo = data.solo || false;

	if (typeof(data.mute) !== 'undefined')
		this.mute = data.mute || false;

	if (typeof(data.x) !== 'undefined')
		this.x = data.x || 0;

	if (typeof(data.y) !== 'undefined')
		this.y = data.y || 0;

	if (typeof(data.silent) !== 'undefined')
		this.silent = data.silent || false;

	if (data.title)
		this.title = data.title;

	for (var i=0; i<this.valueids.length; i++) {
		var id = this.valueids[i];
		if (data[id]) {
			var input = data[id] || '';
			var t = this.values[id];
			t.source.setExpression(input);
		}
	}
}





