Machine = function(context) {
	this.context = context;

	this.song = new Song();
	this.mixer = new Mixer();
	this.sampler = new Sampler();
	this.sequencer = new Sequencer();
	this.sequencer.mixer = this.mixer;

	this.devices = [];
	this.devicemap = {};

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
		 	/*	{
			type: 'sampler',
			sample: { value: 0, dynamic: false },
			gate: { expr: 'step % 4 == 0', dynamic: true },
			volume: { value: 100, dynamic: false },
			speed: { value: 100, dynamic: false },
			release: { value: 100, dynamic: false }
			}, */
			{
				type: 'synth',
				gate: { expression: 'step % 1 == 0', dynamic: true },
				note: { value: 0, dynamic: true, expression: '24 + step % 5' },
				volume: { value: 100, dynamic: false },
				speed: { value: 100, dynamic: false },
				waveform: { value: 1, dynamic: false },
				release: { value: 100, dynamic: false },
				cutoff: { value: 10000, dynamic: false },
				resonance: { value: 1, dynamic: false }
			}
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

var addDynamicValueTrack = function(target, id, input, speedy) {
	console.log('addDynamicValueTrack', input);
	var value = new DynamicValue(input.value || 0.0);
	value.value = input.value || 0.0;
	if (input.dynamic && input.expression)
		value.setExpression(input.expression);
	target.addValue(value, id, speedy);
}

var addDynamicValueTracks = function(target, intrack) {
	for (var i=0; i<target.device.parameters.length; i++) {
		var p = target.device.parameters[i];
		var input = intrack[p.id] || {};
		var value = new DynamicValue(input.value || 0.0);
		value.value = input.value || 0.0;
		if (input.dynamic && input.expression)
			value.setExpression(input.expression);
		target.addValue(value, p.id, p.substep);
	}
}

Machine.prototype.createTrackDeviceWrapper = function(device, intrack) {
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

Machine.prototype.createDevice = function(intrack) {
	if (intrack.type === 'synth')
		return this.createTrackDeviceWrapper(new SynthDevice(), intrack);

	if (intrack.type === 'sampler')
		return this.createTrackDeviceWrapper(new SamplerDevice(), intrack);

	if (intrack.type === 'bus')
		return this.createTrackDeviceWrapper(new BusDevice(), intrack);

	if (intrack.type === 'master')
		return this.createTrackDeviceWrapper(new MasterDevice(), intrack);

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

	if (this.mixer.mastertrack)
		this.mixer.mastertrack.setData(data.master || {});
}