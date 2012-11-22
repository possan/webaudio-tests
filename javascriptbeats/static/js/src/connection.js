	
function Connection() {
	this.values = {};
	this.machine = null;
	this.valueids = [];
	this.lastfrom = 'xxxxx';
	this.lastto = 'xxxxx';
	this.gainnode = null;
	this.from = '';
	this.to = ''
	this.addValue(new DynamicValue(100.0), 'amount', true);
}

Connection.prototype.addValue = function(value, id, speedy) {
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

Connection.prototype.release = function() {
}

Connection.prototype.step = function(state) {
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

	if (this.gainnode) {
		var amt = this.values['amount'];
		if (amt.updated) {
			this.gainnode.gain.value = amt.value / 100.0;
		}
	}
}

Connection.prototype.setData = function(data) {
	this.from = data.from || '';
	this.to = data.to || '';
	for (var i=0; i<this.valueids.length; i++) {
		var id = this.valueids[i];
		var t = this.values[id];
		var input = data[id] || '';
		t.source.setExpression(input);
	}
	if (this.from != this.lastfrom ||
		this.to != this.lastto) {
		console.log('recreate connection.', this.from, this.to, this.gainnode);
		if (this.gainnode) {
			delete(this.gainnode);
			this.gainnode = null;
		}

		var fromdevice = this.machine.getDeviceById(this.from);
		var todevice = this.machine.getDeviceById(this.to);
		console.log('devices', fromdevice, todevice);
		if (fromdevice && todevice) {
			console.log('pins', fromdevice.outputpin, todevice.inputpin);
			if (fromdevice.outputpin && todevice.inputpin) {
				console.log('all ok, connect!');
				this.gainnode = this.machine.context.createGainNode();
				// var amt = this.values['amount'];
				// this.gainnode.gain.value = amt.value / 100.0;
				fromdevice.outputpin.connect(this.gainnode);
				this.gainnode.connect(todevice.inputpin);
				this.lastfrom = this.from;
				this.lastto = this.to;
			}
		}
	}
}





