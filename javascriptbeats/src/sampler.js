

function Sampler() {
	this.buffers = [];
	this.names = [];
}

Sampler.prototype.load = function(data) {
	var self = this;
	var b = new BufferLoader(
		context,
		data.map(function(item) { return item.url; }),
		function(all) {
			console.log('all loaded.', all);
			self.buffers = all;
		}
	);
	b.load();
	data.forEach(function(item) {
		self.names.push(item.name);
	})
}


