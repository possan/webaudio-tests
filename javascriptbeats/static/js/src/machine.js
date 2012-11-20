Machine = function(context) {
	this.context = context;

	this.song = new Song();
	this.mixer = new Mixer();
	this.sampler = new Sampler();
	this.sequencer = new Sequencer();
	this.sequencer.mixer = this.mixer;

	this.devices = [];
	this.devicemap = {};
	this.connections = [];
	this.connectionmap = {};

	// device output busses
	this.bus1 = context.createGainNode();
	this.bus2 = context.createGainNode();
	this.drybus = context.createGainNode();

	// master receive mixers
	this.receive1 = context.createGainNode();
	this.receive2 = context.createGainNode();

	// master track
	this.mixer.mastertrack = this.createDevice({type:'master'});
	this.mixer.mastertrack.device.outputpin.connect(context.destination);
	this.receive1.connect(this.mixer.mastertrack.device.receive1);
	this.receive2.connect(this.mixer.mastertrack.device.receive2);
	this.drybus.connect(this.mixer.mastertrack.device.inputpin);

	// bus 1
	this.mixer.bustrack1 = this.createDevice({type:'bus'});
	this.bus1.connect(this.mixer.bustrack1.device.inputpin);
	this.mixer.bustrack1.device.outputpin.connect(this.receive1);

	// bus 2
	this.mixer.bustrack2 = this.createDevice({type:'bus'});
	this.bus2.connect(this.mixer.bustrack2.device.inputpin);
	this.mixer.bustrack2.device.outputpin.connect(this.receive2);

	this.reset();
	window.machine = this;
}

Machine.getInstance = function() {
	return window.machine;
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
		item[p.id] = p.default;
		value.setExpression(p.default);
		target.addValue(value, p.id, p.substep);
	}
}

Machine.prototype.createTrackDeviceWrapper = function(device, intrack, set) {
	var t = new Track();
	t.device = device;
	t.device.machine = this;
	t.device.create();
	addDynamicValueTracks(t, intrack);
	t.silent = intrack.silent || false;
	if (t.device.createCallback)
		t.callback = t.device.createCallback();
	return t;
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
	var d = {
		id: newid,
		type: type,
		title: 'New '+type
	};
	d._device = this.createDeviceByType(type);
	d._device.machine = this;
	d._device.create();
	d._track = new Track();
	addDefaultValueTracks(d._device, d._track, d);
	d._track.silent = false;
	this.devicemap[newid] = d;
	this.devices.push(newid);
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
		if (this.devicemap[id]._device)
			this.devicemap[id]._device.destroy();
		delete this.devicemap[id];
	}
	return true;
}








Machine.prototype.connectDevices = function(fromid, toid) {
	var newid = this.generateId();
	this.connectionmap.push({id:newid, from:fromid, to:toid, amount:'100'});
	this.connections.push(newid);
	return newid;
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
	var idx = this.connections.indexOf(id);
	if (idx != -1)
		this.connections.splice(idx, 1);
	if (this.connectionmap[id])
		delete this.connectionmap[id];
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








Machine.prototype.createDeviceByType = function(type) {
	if (type === 'synth')
		return new SynthDevice();

	if (type === 'sampler')
		return new SamplerDevice();

	if (type === 'bus')
		return new BusDevice();

	if (type === 'master')
		return new MasterDevice();

	return undefined;
}

Machine.prototype.createDevice = function(intrack) {
	var device = this.createDeviceByType(intrack.type);
	if (device)
		return this.createTrackDeviceWrapper(device, intrack, true);
	return undefined;
}

Machine.prototype.setData = function(data) {

	this.song.data = data;
	this.sequencer.setBPM(data.bpm);
	this.sequencer.setShuffle(data.shuffle);

	for (var i=0; i<this.sequencer.tracks.length; i++) {
		this.sequencer.tracks[i].release();
	}

	this.sequencer.tracks = [];

	if (data.tracks) {
		for (var i=0; i<data.tracks.length; i++) {
			console.log('migrate track #'+i, data.tracks[i]);
			var intrack = data.tracks[i] || {};
			var t = this.createDevice(intrack);
			this.sequencer.tracks.push(t);
		}
	}

	if (this.mixer.bustrack1 && data.buses)
		this.mixer.bustrack1.setData(data.buses[0] || {});

	if (this.mixer.bustrack2 && data.buses)
		this.mixer.bustrack2.setData(data.buses[1] || {});

	if (this.mixer.mastertrack && data.master)
		this.mixer.mastertrack.setData(data.master || {});
}