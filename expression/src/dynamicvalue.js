

function DynamicValue(defaultvalue, interval) {
	this.value = defaultvalue;
	this.expression = '';
	this.fun = null;
	this.interval = interval;
}

DynamicValue.prototype.setFixedValue = function(fix) {
	this.value = fix;
	this.fun = null;
}

DynamicValue.prototype.getFixedValue = function() {
	return this.value;
}

DynamicValue.prototype.setExpression = function(expr) {
	//
	// expr:
	// step % 4 == 0
	//
	// code:
	// function (step, substep, superstep, time) {
	// return (step % 4 == 0)
	// }
	//
	// console.log('setExpression', expr);
	this.fun = 0;
	this.expression = expr;
	try {
		var c = 'return ('+expr+');';
		// console.log('Compiling code: '+c);
		var f = new Function(['step', 'substep', 'superstep', 'time'], c);
		// try to run it once too...
		var t = f(1,2,3,4);
		this.fun = f;
	}	catch(e) {
		console.error('Compilation error', e);
	}
}

DynamicValue.prototype.evalValue = function(state) {
	if (this.fun) {
		// console.log('calling function', state);
		return this.fun(state.step, state.substep, state.superstep, state.time);
	}
	return this.value;
}


