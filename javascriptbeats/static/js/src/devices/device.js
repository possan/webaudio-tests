var BaseDevice = function() {
	this.id = 'dev'+Math.floor(Math.random() * 10000000);
	this.parameters = [];
	this.inputpin = null;
	this.receivepin1 = null;
	this.receivepin1 = null;
	this.outputpin = null;
	this.sendpin1 = null;
	this.sendpin2 = null;
	this.machine = null;
}

BaseDevice.prototype.create = function(machine) {
}

BaseDevice.prototype.update = function(track, state) {
}
