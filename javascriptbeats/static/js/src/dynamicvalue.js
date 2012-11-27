

function DynamicValue(defaultvalue, interval) {
	this.value = defaultvalue;
	this.expression = '';
	this.lastexpression = '<INVALID>';
	this.fun = null;
	this.interval = interval;
	this.setExpression(''+defaultvalue);
}

DynamicValue.prototype.setFixedValue = function(fix) {
	this.value = fix;
	this.fun = null;
}

DynamicValue.prototype.getFixedValue = function() {
	return this.value;
}

DynamicValue.prototype.setExpression = function(expr) {
	this.expression = (''+(expr || '')).trim();
	if (this.expression == this.lastexpression) return;
	// console.log('Trying to compile: '+this.expression);
	this.fun = null;
	this.lastexpression = this.expression;
	if (this.expression == '') return;
	try {
		var c = 'return (' + this.expression + ');';
		var f = new Function(['step', 'substep', 'superstep', 'time'], c);
		var t = f(1,2,3,4);
		this.fun = f;
	}	catch(e) {
		console.error('Compilation error', e);
	}
}

DynamicValue.prototype.evalValue = function(state) {
	if (this.fun) {
		return this.fun(state.step, state.substep, state.superstep, state.time);
	}
	return 0.0;
}


