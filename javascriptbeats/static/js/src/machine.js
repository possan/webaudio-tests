Machine = function(context) {
	this.context = context;

	this.song = new Song();
	this.mixer = new Mixer();

	this.sampler = new Sampler();
	this.sampler.machine = this;

	this.sequencer = new Sequencer();
	this.sequencer.mixer = this.mixer;

	var self = this;
	this.sequencer.tickcallback = function(state) { self._tickcallback(state); };

	this.tracks = [];
	this.trackmap = {};

	this.devices = [];
	this.devicemap = {};

	this.connections = [];
	this.connectionmap = {};

	this.reset();
	window.machine = this;
}

Machine.getInstance = function() {
	return window.machine;
}

Machine.prototype._tickcallback = function(state) {
	for (var i=0; i<this.tracks.length; i++) {
		var id = this.tracks[i];
		if (this.trackmap[id]) {
			// console.log('track', id);
			this.trackmap[id].step(state);
			this.devicemap[id].update(this.trackmap[id], state);
		}
	}

	for (var i=0; i<this.connections.length; i++) {
		var id = this.connections[i];
		if (this.connectionmap[id]) {
			this.connectionmap[id].step(state);
			// this.devicemap[id].update(this.trackmap[id], state);
		}
	}

	if (this.mixer)
		this.mixer.step(state);
}

Machine.prototype.reset = function() {
	this.setData({
		bpm: 110.0,
		shuffle: 25.0,
		tracks: [
		]
	});
}

Machine.prototype.generateId = function() {
	return '_'+Math.floor(Math.random() * 10000000);
}

Machine.prototype.load = function(data) {
	this.song.load(data);
}

Machine.prototype.save = function() {
	return this.song.save();
}

Machine.prototype.play = function() {
	this.sequencer.play();
}

Machine.prototype.stop = function() {
	this.sequencer.stop();
}

Machine.prototype.togglePlay = function() {
	this.sequencer.togglePlay();
}

Machine.prototype.isPlaying = function() {
	return this.sequencer.isPlaying();
}

Machine.prototype.updateMutes = function() {
	var nsolo = 0;
	for(var i=0; i<this.tracks.length; i++) {
		var id = this.tracks[i];
		var track = this.trackmap[id];
		if (track.solo)
			nsolo ++;
	}
	for(var i=0; i<this.tracks.length; i++) {
		var id = this.tracks[i];
		var track = this.trackmap[id];
		var silent = false;
		if (nsolo > 0) {
			silent = !(track.solo || false);
		} else {
			silent = (track.mute || false);
		}
		console.log('set track #'+i+' ('+id+') to silent='+silent);
		track.setData({ silent: silent });
	}
}

var addDynamicValueTracks = function(target, intrack) {
	for (var i=0; i<target.device.parameters.length; i++) {
		var p = target.device.parameters[i];
		var input = intrack[p.id];
		console.log(p, input);
		if (typeof(input) === 'undefined')
			input = '';
		if (typeof(input) === 'object') {
			input = input.expression;
			intrack[p.id] = '' + input;
		}
		var value = new DynamicValue(0.0);
		value.setExpression(input);
		target.addValue(value, p.id, p.substep);
	}
}

var addDefaultValueTracks = function(device, track, item) {
	for (var i=0; i<device.parameters.length; i++) {
		var p = device.parameters[i];
		var value = new DynamicValue(0.0);
		if (item)
			item[p.id] = p.default;
		value.setExpression(p.default);
		if (track)
			track.addValue(value, p.id, p.substep);
	}
}

Machine.prototype.createTrackDeviceWrapper = function(device, intrack, set) {
	var t = new Track();
	t.device = device;
	t.device.machine = this;
	t.device.create();
	addDynamicValueTracks(t, intrack);
	t.silent = intrack.silent || false;
	return t;
}



Machine.prototype.getData = function() {
	var m = this;
	var newdata = {
		bpm: m.sequencer.bpm,
		shuffle: m.sequencer.shuffle,
		title: m.song.title,
		tracks: [],
		connections: []
	};
	for (var i=0; i<m.numConnections(); i++) {
		var id = m.getConnectionId(i);
		var conn = m.getConnectionById(id);
		var newconn = {};
		newconn.id = conn.id;
		newconn.from = conn.from;
		newconn.to = conn.to;
		newconn.amount = conn.values['amount'].source.expression;
		newdata.connections.push(newconn);
	}
	for (var i=0; i<m.numTracks(); i++) {
		var id = m.getTrackId(i);
		var trk = m.getTrackById(id);
		var newtrk = {};
		newtrk.id = trk.id;
		newtrk.x = trk.x;
		newtrk.y = trk.y;
		newtrk.type = trk.type;
		newtrk.title = trk.title;
		newtrk.solo = trk.solo;
		newtrk.mute = trk.mute;
		newtrk.silent = trk.silent;
		for (var j=0; j<trk.valueids.length; j++) {
			var id2 = trk.valueids[j];
			newtrk[id2] = trk.values[id2].source.expression;
		}
		newdata.tracks.push(newtrk);
	}
	console.log(newdata);
	return newdata;
}



Machine.prototype.numDevices = function() {
	return this.devices.length;
}

Machine.prototype.getDeviceId = function(index) {
	if (index >= 0 && index < this.devices.length)
		return this.devices[index];
	return undefined;
}

Machine.prototype.getDeviceById = function(id) {
	return this.devicemap[id];
}

Machine.prototype.addDevice = function(type) {
	var newid = this.generateId();
	var newdevice = this.createDeviceByType(type);
	if (newdevice) {
		newdevice.id = newid;
		newdevice.machine = this;
		newdevice.create();
		var newtrack = new Track();
		newtrack.id = newid;
		newtrack.type = type;
		newtrack.silent = false;
		addDefaultValueTracks(newdevice, newtrack, undefined);
		this.devices.push(newid);
		this.devicemap[newid] = newdevice;
		this.tracks.push(newid);
		this.trackmap[newid] = newtrack;
	}

	return newid;
}

Machine.prototype.deviceExists = function(id) {
	return this.devices.indexOf(id) != -1;
}

Machine.prototype.removeDevice = function(id) {
	var idx = this.devices.indexOf(id);
	if (idx != -1)
		this.devices.splice(idx, 1);
	if (this.devicemap[id]) {
		this.devicemap[id].destroy();
		delete this.devicemap[id];
	}
	return true;
}










Machine.prototype.connectDevices = function(fromid, toid) {
	var newid = this.generateId();
	var conn = new Connection();
	conn.id = newid;
	conn.machine = this;
	this.connectionmap[newid] = conn;
	this.connections.push(newid);
	conn.setData({
		from: fromid,
		to: toid,
		volume: '100'
	});
	return newid;
}

Machine.prototype._reconnectEverything = function() {
	for (var i=0; i<this.numConnections(); i++) {
		var id = this.getConnectionId(i);
		var conn = this.getConnectionById(id);
		conn.release();
	}
	for (var i=0; i<this.numConnections(); i++) {
		var id = this.getConnectionId(i);
		var conn = this.getConnectionById(id);
		conn.setData({ _forcereconnect: true });
	}
}


Machine.prototype.disconnectDevice = function(deviceid) {
	var conns = [];
	for (var i=0; i<this.connections.length; i++) {
		var c = this.connectionmap[this.connections[i]];
		if (c.from === deviceid || c.to === deviceid)
			conns.push(c.id);
	}
	for (var i=0; i<conns.length; i++)
		this.removeConnection(conns[i]);
}

Machine.prototype.removeConnection = function(id) {
	console.log('remove connection', id);
	var idx = this.connections.indexOf(id);
	if (idx != -1)
		this.connections.splice(idx, 1);
	if (this.connectionmap[id]) {
		this.connectionmap[id].release();
		delete this.connectionmap[id];
	}
	this._reconnectEverything();
	return true;
}

Machine.prototype.numConnections = function() {
	return this.connections.length;
}

Machine.prototype.getConnectionId = function(index) {
	if (index >= 0 && index < this.connections.length)
		return this.connections[index];
	return undefined;
}

Machine.prototype.getConnectionById = function(id) {
	return this.connectionmap[id];
}

Machine.prototype.connectionExists = function(id) {
	return this.connections.indexOf(id) != -1;
}







Machine.prototype.createTrack = function(id) {
	this.tracks.push(id);
	this.trackmap[id] = {};
	return id;
}

Machine.prototype.trackExists = function(id) {
	return this.tracks.indexOf(id) != -1;
}

Machine.prototype.removeTrack = function(id) {
	var idx = this.tracks.indexOf(id);
	if (idx != -1)
		this.tracks.splice(idx, 1);
	if (this.trackmap[id]) {
		this.trackmap[id].release();
		delete this.trackmap[id];
	}
	return true;
}

Machine.prototype.numTracks = function() {
	return this.tracks.length;
}

Machine.prototype.getTrackId = function(index) {
	return this.tracks[index];
}

Machine.prototype.getTrackById = function(id) {
	return this.trackmap[id];
}







Machine.prototype.createDeviceByType = function(type) {
	if (type === 'synth')
		return new SynthDevice();

	if (type === 'sampler')
		return new SamplerDevice();

	if (type === 'delay')
		return new DelayDevice();

	if (type === 'master')
		return new MasterDevice();

	if (type === 'filter')
		return new FilterDevice();

	if (type === 'gain')
		return new GainDevice();

	if (type === 'compressor')
		return new CompressorDevice();

	if (type === 'connection') // hack
		return new Connection();

	return undefined;
}

Machine.prototype.createDevice = function(intrack) {
	var device = this.createDeviceByType(intrack.type);
	if (device)
		return this.createTrackDeviceWrapper(device, intrack, true);
	return undefined;
}

Machine.prototype.createAndAddDevice = function(intrack) {
	var id = this.generateId();
	var newdevice = this.createDeviceByType(intrack.type);
	if (newdevice) {
		newdevice.id = id;
		newdevice.machine = this;
		newdevice.create();
		var newtrack = new Track();
		newtrack.id = id;
		newtrack.type = intrack.type;
		newtrack.silent = false;
		addDefaultValueTracks(newdevice, newtrack, undefined);
		this.devices.push(id);
		this.devicemap[id] = newdevice;
		this.tracks.push(id);
		this.trackmap[id] = newtrack;
		newtrack.setData(intrack);
		console.log('created ', newdevice, newtrack, intrack);
	}
}

Machine.prototype.setData = function(data) {

	if (data.title)
		this.song.title = data.title;

	if (data.bpm)
		this.sequencer.setBPM(data.bpm);

	if (data.shuffle)
		this.sequencer.setShuffle(data.shuffle);

	if (data.tracks && data.connections) {

		if (data.bpm)
			this.song.data = data;

		var datatracks = {};
		var datatrackids = [];
		var dataconnections = {};
		var dataconnectionids = [];
		if (data.tracks) {
			for (var i=0; i<data.tracks.length; i++) {
				if (data.tracks[i]) {
					datatrackids.push(data.tracks[i].id);
					datatracks[data.tracks[i].id] = data.tracks[i];
				}
			}
		}
		if (data.connections) {
			for (var i=0; i<data.connections.length; i++) {
				if (data.connections[i]) {
					dataconnectionids.push(data.connections[i].id);
					dataconnections[data.connections[i].id] = data.connections[i];
				}
			}
		}

		// disconnect everything?!

		var removetrackids = [];
		var removeconnectionids = [];
		var newtracks = [];
		var newdevices = [];
		var newconnections = [];
		// kolla om vi behöver ta bort connections?
		for (var i=0; i<this.numConnections(); i++) {
			var id = this.getConnectionId(i);
			if (dataconnectionids.indexOf(id) == -1 ) {
				// console.log('remove connection', id);
				// previously created track not in new list of tracks...
				this.removeConnection(id);
				// removeconnections.push(id);
			}
		}
		// kolla om vi behöver deleta tracks+devices?
		for (var i=0; i<this.numTracks(); i++) {
			var id = this.getTrackId(i);
			if (datatrackids.indexOf(id) == -1 ) {
				// console.log('remove track', id);
				// previously created track not in new list of tracks...
				var oldtrack = this.getTrackById(id);
				if (oldtrack)
					oldtrack.release();
				var olddevice = this.getDeviceById(id)
				if (olddevice)
					oldtrack.release();
				// removetracks.push(id);
				this.disconnectDevice(id);
				this.removeDevice(id);
				this.removeTrack(id);
			}
		}
		// adda nya devices och tracks
		for (var i=0; i<datatrackids.length; i++) {
			var id = datatrackids[i];
			if (!this.deviceExists(id) && !this.trackExists(id)) {
				// console.log('new track', id);
				var intrack = datatracks[id];
				newdevices.push(dataconnections[id]);
				newtracks.push(datatracks[id]);
				var newdevice = this.createDeviceByType(intrack.type);
				if (newdevice) {
					newdevice.id = id;
					newdevice.machine = this;
					newdevice.create();
					var newtrack = new Track();
					newtrack.id = id;
					newtrack.type = intrack.type;
					newtrack.silent = false;
					addDefaultValueTracks(newdevice, newtrack, undefined);
					this.devices.push(id);
					this.devicemap[id] = newdevice;
					this.tracks.push(id);
					this.trackmap[id] = newtrack;
					// console.log('created ', newdevice, newtrack, intrack);
				}
			}
		}
		// adda nya connections
		for (var i=0; i<dataconnectionids.length; i++) {
			var id = dataconnectionids[i];
			// console.log('ensure connection', id);
			if (!this.connectionExists(id)) {
				this.connections.push(id);
				var c = new Connection();
				c.id = id;
				c.machine = this;
				this.connectionmap[id] = c;
			}
		}

		// uppdatera alla tracks med nya expressions!
		for (var i=0; i<datatrackids.length; i++) {
			var id = datatrackids[i];
			var track = this.getTrackById(id);
			// console.log('get track', id, track);
			if (track)
				track.setData(datatracks[id]);
		}

		// uppdatera alla connections med nya expressions!
		for (var i=0; i<dataconnectionids.length; i++) {
			var id = dataconnectionids[i];
			var conn = this.getConnectionById(id);
			// console.log('get track', id, track);
			if (conn)
				conn.setData(dataconnections[id]);
		}
	}
}