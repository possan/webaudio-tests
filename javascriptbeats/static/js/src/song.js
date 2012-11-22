

function Song() {
	this.title = '';
	this.data = {
		tracks: [],
		meta: {
			name: '',
			author: '',
		},
		sequencer: {
			bpm: 130,
			shuffle: 50
		}
	};
	this.dirty = true;
}

Song.prototype.load = function(def) {
	this.data = def;
	this.dirty = false;
}

Song.prototype.save = function() {
	return this.data;
}
