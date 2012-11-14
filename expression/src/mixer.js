

function Mixer() {
	this.bustrack1 = null;
	this.bustrack2 = null;

	this.mastertrack = null;
}

Mixer.prototype.addInput = function(input) {
}

Mixer.prototype.step = function(state) {
	if (this.bustrack1 != null)
		this.bustrack1.step(state);

	if (this.bustrack2 != null)
		this.bustrack2.step(state);

	if (this.mastertrack != null)
		this.mastertrack.step(state);
}



