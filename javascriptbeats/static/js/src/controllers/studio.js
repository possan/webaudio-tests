'use strict';

var module = angular.module('app', []);

function StudioController($scope, $http) {
	$scope.dataset = {
		title: '',
		bpm: '',
		shuffle: '',
		tracks: [],
		connections: [],
	};
	// Machine.getInstance().song.data;
	$scope.playing = false;
	$scope.state = '';

	$scope.id = window.appDocumentId;
	$scope.can_share = false;
	$scope.can_save = window.appCanSave;
	$scope.can_fork = window.appCanFork;
	$scope.can_create = window.appCanCreate;

	machine.sampler.load([
		{ url: '/static/audio/808kick3.mp3', name: '808 Kick' },
		{ url: '/static/audio/808snare1.mp3', name: '808 Snare' },
		{ url: '/static/audio/808chh1.mp3', name: '808 Closed Hihat' },
		{ url: '/static/audio/808clap.mp3', name: '808 Clap' },
		{ url: '/static/audio/808kick1.mp3', name: '808 Kick 2' }
	]);

	document.addEventListener('keydown', function(e) {
	  // console.log(e);
	  if (e.keyCode == 32 && e.srcElement.tagName != 'INPUT') {
	    Machine.getInstance().togglePlay();
	    e.preventDefault();
	    return false;
	  }
	});

	$scope.play = function() {
		$scope._updateMutes();
		$scope.updatePlayback();
		console.log('play!');
		Machine.getInstance().play();
		$scope.playing = Machine.getInstance().started;
	}

	$scope.stop = function() {
		console.log('stop!');
		Machine.getInstance().stop();
		$scope.playing = Machine.getInstance().started;
	}

	$scope.updatePlayback =function() {
		$scope.saveMyModel();
		$scope.playing = Machine.getInstance().started;
	}

	$scope.getItemTemplate = function(x) {
		return '/static/tmpl/editor-'+x.type+'.html';
	}

	$scope.getConnectionTemplate = function(x) {
		return '/static/tmpl/connection.html';
	}

	$scope.saveMyModel = function() {
		// $scope.dataset_json = JSON.stringify($scope.dataset, undefined, 2);
		// Machine.getInstance().setData($scope.dataset);
	}

	$scope.saveWork = function() {
		// post to /blob/ID/save
		var cfg = { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'} };
		var data = 'data='+encodeURIComponent($scope.dataset_json);
    $http.post('/blob/'+$scope.id+'/save', data, cfg).success(function (data) {
      console.log('post result', data);
    });
	}

	$scope.forkWork = function() {
		// post to /blob/ID/fork
		var cfg = { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'} };
		var data = 'data='+encodeURIComponent($scope.dataset_json);
    $http.post('/blob/'+$scope.id+'/fork', data, cfg).success(function (data) {
      console.log('post result', data);
      if (data.success) {
      	location = data.url;
      }
    });
	}

	$scope.createWork = function() {
		// post to /blob/
		var cfg = { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'} };
		var data = 'data='+encodeURIComponent($scope.dataset_json);
    $http.post('/blob', data, cfg).success(function (data) {
      console.log('post result', data);
      if (data.success) {
      	location = data.url;
      }
    });
	}

	var _markDirty = function() {
		$scope.dataset_json = JSON.stringify(machine.getData(), undefined, 2);
	}

	var _updateViewFromModel = function(connection) {
		var newdata = machine.getData();
		$scope.dataset = newdata;
		_markDirty();
	}

	$scope.addDevice = function(type) {
		// var con = { from: '', to: '', amount: 100 };
		machine.addDevice(type);
		_updateViewFromModel();
	}

	$scope.addConnection = function() {
		var con = { from: '', to: '', amount: 100 };
		machine.connectDevices('', '');
		_updateViewFromModel();
	}

	$scope.deleteConnection = function(connection) {
		machine.removeConnection(connection.id);
		_updateViewFromModel();
	}

	$scope.deleteTrack = function(track) {
		machine.removeTrack(track.id);
		_updateViewFromModel();
	}

	$scope._updateMutes = function() {
		var nsolo = 0;
		if ($scope.dataset.tracks) {
			$scope.dataset.tracks.forEach(function(track) {
				if (track.solo) nsolo ++;
			});
			$scope.dataset.tracks.forEach(function(track) {
				track.silent = false;
				if (nsolo > 0) {
					track.silent = !track.solo;
				} else {
					track.silent = track.mute;
				}
				var trackobj = machine.getTrackById(track.id);
				if (trackobj)
					trackobj.setData(track);
			});
		}
	}

	$scope.muteTrack = function(track) {
		track.mute = !(track.mute || false);
		$scope._updateMutes();
		_markDirty();
		// $scope.saveMyModel();
	}

	$scope.soloTrack = function(track) {
		track.solo = !(track.solo || false);
		$scope._updateMutes();
		_markDirty();
		// $scope.saveMyModel();
	}

	$scope.json_changed = function() {
		// $scope.dataset = JSON.parse($scope.dataset_json);
		// $scope.saveMyModel();
	}

	$scope.updateConnection = function(connection) {
		console.log('update connect', connection);
		var conn = machine.getConnectionById(connection.id);
		if (conn)
			conn.setData(connection);
		_markDirty();
	}

	$scope.updateDevice = function(device) {
		console.log('update device', device);
		var track = machine.getTrackById(device.id);
		if (track)
			track.setData(device);
		// $scope.saveMyModel();
		_markDirty();
	}

	$scope.saveMeta = function() {
		machine.sequencer.setBPM(parseFloat($scope.dataset.bpm));
		machine.sequencer.setShuffle(parseFloat($scope.dataset.shuffle));
		machine.song.title = $scope.dataset.title;
		_markDirty();
	}

	// console.log($scope.dataset);
	// $scope._updateMutes();
	// $scope.saveMyModel();

	// ladda model osv...

	var _setDoc = function(doc) {
	  machine.reset();
	 	machine.setData(doc);
		// $scope.dataset = doc;
		// $scope.$apply();
		// $scope._updateMutes();
	  // machine.reset();
	 	// machine.setData($scope.dataset);
	 	_updateViewFromModel();
		// $scope.saveMyModel();
	}

	var _resetDoc = function() {
	 	console.log('reset doc.');
	 	var doc = 	{
  "bpm": 100,
  "shuffle": 33,
  "title": "hejsan",
  "tracks": [
    {
      "id": "device1",
      "type": "synth",
      "title": "Bass",
      "solo": false,
      "mute": false,
      "silent": false,
      "gate": "1",
      "note": "[12,3,48,26][(step>>0)%4]+[3,3,2,1,0,0,12,0][(step>>3)%8]",
      "cutoff": "900 + 300 * Math.sin(time*5)",
      "resonance": "2",
      "release": "150",
      "volume": "50",
      "waveform": "1"
    },
    {
      "id": "device2",
      "type": "sampler",
      "title": "Snare",
      "solo": false,
      "mute": false,
      "silent": false,
      "gate": "(step%8==4)||(step%16==14)",
      "volume": "100",
      "speed": "100",
      "sample": "3",
      "release": "200"
    },
    {
      "id": "delay1",
      "type": "bus",
      "title": "Echo1",
      "solo": false,
      "mute": false,
      "silent": false,
      "delaytime": "75",
      "delayfeedback": "70"
    },
    {
      "id": "bus1",
      "type": "bus",
      "title": "Bus 1",
      "solo": false,
      "mute": false,
      "silent": false,
      "delaytime": "25",
      "delayfeedback": "70"
    },
    {
      "id": "bus2",
      "type": "bus",
      "title": "Bus 2",
      "solo": false,
      "mute": false,
      "silent": false,
      "delaytime": "100",
      "delayfeedback": "90"
    },
    {
      "id": "master",
      "type": "master",
      "title": "Master",
      "solo": false,
      "mute": false,
      "silent": false,
      "compression": "",
      "comprelease": "",
      "comptreshold": ""
    },
    {
      "id": "_314837",
      "type": "sampler",
      "title": "kic",
      "solo": false,
      "mute": false,
      "silent": false,
      "gate": "(step % 4) == 0",
      "volume": "400",
      "speed": "100",
      "sample": "0",
      "release": "200"
    }
  ],
  "connections": [
    {
      "id": "_03",
      "from": "device2",
      "to": "bus1",
      "amount": "33"
    },
    {
      "id": "_04",
      "from": "device2",
      "to": "bus2",
      "amount": "33"
    },
    {
      "id": "_05",
      "from": "device2",
      "to": "master",
      "amount": "100"
    },
    {
      "id": "_06",
      "from": "device1",
      "to": "delay1",
      "amount": "100"
    },
    {
      "id": "_07",
      "from": "delay1",
      "to": "master",
      "amount": "100"
    },
    {
      "id": "_08",
      "from": "delay1",
      "to": "bus1",
      "amount": "50"
    },
    {
      "id": "_09",
      "from": "delay1",
      "to": "bus2",
      "amount": "50"
    },
    {
      "id": "_18",
      "from": "bus1",
      "to": "master",
      "amount": "50"
    },
    {
      "id": "_19",
      "from": "bus2",
      "to": "master",
      "amount": "50"
    },
    {
      "id": "_9745937",
      "from": "_314837",
      "to": "bus1",
      "amount": "50"
    },
    {
      "id": "_8795615",
      "from": "_314837",
      "to": "master",
      "amount": "100"
    }
  ]
}

	  _setDoc(doc);
	};


	if (window.appDocument) {
	  try {
	    var data = window.appDocument;
	    if (data) {
	    	console.log('load json doc.');
	    	_setDoc(data);
			} else {
		  	_resetDoc();
			}
	  } catch (e) {
	  	_resetDoc();
	  }
	}
	else {
	 	_resetDoc();
	}

};

module.controller('StudioController', StudioController);
















































function BuzzController($scope, $http) {

	$scope.state = '';
	$scope.props = [];
	$scope.title = 'Buxx?';
	$scope.selected = '';
	$scope.blocks = [
		{
			id: 'block1',
			index: 0,
			title: 'Block 1',
			x: 100,
			y: 50
		},
		{
			id: 'block2',
			index: 1,
			title: 'Block 2',
			x: 200,
			y: 100
		},
		{
			id: 'block3',
			index: 2,
			title: 'Block 3',
			x: 180,
			y: 250
		},
		{
			id: 'block4',
			index: 3,
			title: 'Block 4',
			x: 110,
			y: 250
		},
		{
			id: 'bloc5k',
			index: 4,
			title: 'Block 5',
			x: 130,
			y: 300
		}
	];

	$scope.connections = [
		{id: 'ca', index: 0, from:'block1', to:'block2'},
		{id: 'cb', index: 1, from:'block2', to:'block3'},
	];

	var _makeDraggable = function() {
   	$( 'ul.blocks li' ).unbind('click');
		$( 'ul.connections li' ).unbind('click');

   	$( 'ul.blocks li' ).click(function(event) {
 	   	event.stopPropagation();
			if (!$(this).hasClass('dragging')) {
		   	event.preventDefault();
     		console.log('clicked block 2', this, addEventListener);
     		if ($scope.selected != this.dataset.id) {
     			if ($scope.selected != '' && (event.shiftKey || event.altKey)) {
     				// connect block shortcut, select one, shift-click the destination..
     				$scope.connectBlocks($scope.selected, this.dataset.id);
     			} else {
			   		$scope.setSelection(this.dataset.id);
	   			}
	   		} else {
		     	$scope.setSelection('');
     		}
     		$scope.$apply();
		  }
   	});
   	$( 'ul.connections li' ).click(function(event) {
	   	event.preventDefault();
	   	event.stopPropagation();
   		console.log('clicked connection 2', this);
   		if ($scope.selected != this.dataset.id) {
		   	$scope.setSelection(this.dataset.id);
	    } else {
		   	$scope.setSelection('');
     	}
   		_scope.$apply();
   	});
   	try {
	   	$('ul.blocks li').draggable("destroy");
	  } catch(e) {
	  }
		$('ul.blocks li').draggable({
      start: function() {
      	// hide canvas
        $(this).addClass('dragging');
      	console.log('start drag', this);
      	_hidelines();
      },
      drag: function() {
      	var idx = parseInt(this.dataset.index);
      	var x = parseFloat(this.style.left);
      	var y = parseFloat(this.style.top);
      	_scope.blocks[idx].x = x+25;
      	_scope.blocks[idx].y = y+25;
      	_renderconnections();
      },
      stop: function() {
      	// save position
      	// redraw canvas
		   	$(this).removeClass('dragging');
      	var idx = parseInt(this.dataset.index);
      	var x = parseFloat(this.style.left);
      	var y = parseFloat(this.style.top);
      	console.log('stop drag' ,this);
      	console.log('idx:' ,idx);
      	console.log('data:',this.dataset);
      	console.log('x:',x);
      	console.log('y:',y);
      	_scope.blocks[idx].x = x+25;
      	_scope.blocks[idx].y = y+25;
      	_showlines();
      	_renderconnections();
      }
    });
	}

	$scope.getBlockPosition = function(block) {
		return {
			left: (block.x-25) + 'px',
			top: (block.y-25) + 'px'
		}
	}

	$scope.getConnectionPosition = function(conn) {
		return {
			left: (conn.x-12) + 'px',
			top: (conn.y-12) + 'px'
		}
	}

	$scope.createConnectionPanel = false;
	$scope.createBlockPanel = false;

	$scope.connectBlocks = function(from, to) {
		var newid =	machine.generateId();
		var idx = $scope.connections.length;
		$scope.connections.push({
			'id': newid,
			'index': idx,
			'from': from,
			'to': to,
			'amount': '100'
		});
		_renderconnections();
		console.log('connections', $scope.connections);
		_makeDraggable();
 		$scope.state = '';
		$scope.selected = '';
		$scope.sidebarPanel = false;
	}

	$scope.setSelection = function(id) {
 		if ($scope.state == 'create-connection') {
 			if (id != '') {
 				console.log('connect from', id);
 				$scope.connectFrom = id;
 				$scope.state = 'create-connection-2';
	   		_setHelp('Click the block to connect to');
 			}
 		} else if ($scope.state == 'create-connection-2') {
 			if (id != '' && id != $scope.connectFrom) {
 				console.log('connect to', id);
 				$scope.connectTo = id;
 				$scope.state = '';
				$scope.connectBlocks($scope.connectFrom, $scope.connectTo);
	   		_setHelp('');
 			}
 		} else {
  	 	$( 'ul.blocks li' ).removeClass('selected');
	   	$( 'ul.connections li' ).removeClass('selected');
	   	if (id != '') {
  	 		$( 'ul.blocks li[data-id='+id+']' ).addClass('selected');
	   		$( 'ul.connections li[data-id='+id+']' ).addClass('selected');
	   		_setHelp('Shift click the second block to connect them, click delete to delete the selected object');
	   	} else {
	   		_setHelp('');
	   	}
			$scope.selected = id;
			$scope.sidebarPanel = (id != '');
  		// $scope.$apply();
 		}
		_renderconnections();
 	}

	$scope.beginAddSomething = function() {
		$scope.setSelection('');
		$scope.sidebarPanel = true;
	 	_setHelp('');//Click the block to connect to');
	}

	$scope.beginAddBlock = function() {
		$scope.setSelection('');
		$scope.createBlockPanel = true;
		_setHelp('Click the type of block you want to add');
	}

	$scope._deleteBlock = function(id) {
		if (id == '')
			return;
		for (var i=$scope.blocks.length-1; i>=0; i--) {
			if ($scope.blocks[i].id == id)
				$scope.blocks.splice(i, 1);
		}
		for (var i=$scope.connections.length-1; i>=0; i--) {
			if ($scope.connections[i].from == id || $scope.connections[i].to == id)
				$scope.connections.splice(i, 1);
		}
		for (var i=0; i<$scope.blocks.length; i++) {
			$scope.blocks[i].index = i;
		}
		for (var i=0; i<$scope.connections.length; i++) {
			$scope.connections[i].index = i;
		}
	}

	$scope.helpvisible = false;
	$scope.helptext = '';

	var _setHelp = function(html) {
		$scope.helphtml = html;
	}

	_setHelp('');

	$scope.deleteBlock = function() {
		var id = $scope.selected;
		if (id == '')
			return;
		$scope._deleteBlock(id);
		$scope.$apply();
		_renderconnections();
		_makeDraggable();
		_setHelp('');
	}

	$scope._deleteConnection = function(id) {
		if (id == '')
			return;
		for (var i=$scope.connections.length-1; i>=0; i--) {
			if ($scope.connections[i].id == id)
				$scope.connections.splice(i, 1);
		}
	}

	$scope.deleteBlockOrConnection = function() {
		var id = $scope.selected;
		if (id == '')
			return;
		$scope._deleteBlock(id);
		$scope._deleteConnection(id);
		$scope.$apply();
		_renderconnections();
		_makeDraggable();
		_setHelp('');
	}

	$scope.deleteConnection = function() {
		var id = $scope.selected;
		if (id == '')
			return;
		$scope._deleteConnection(id);
		$scope.$apply();
		_renderconnections();
		_makeDraggable();
		_setHelp('');
	}

	$scope.beginAddConnection = function() {
		$scope.connectFrom = '';
		$scope.connectTo = '';
		$scope.setSelection('');
		_setHelp('Click on the block you want to connect from...');
		$scope.state = 'create-connection';
		$scope.sidebarPanel = false;
		$scope.createConnectionPanel = true;
	}

	$scope.createConnection = function() {
		$scope.createConnectionPanel = false;
		$scope.sidebarPanel = false;
   	_makeDraggable();
	}

	$scope.createBlock = function(type) {
		var newid =	machine.generateId();
		var idx = $scope.blocks.length;
		var b = _getBounds();
		$scope.blocks.push({
			'id': 'block'+idx,
			'type': type,
			'index': idx,
			'x': b.x1-50,
			'y': b.cy
		});
		$scope.createBlockPanel = false;
		$scope.sidebarPanel = false;
		$scope.$apply();
   	_makeDraggable();
	}

	var _scope = $scope;

	var _findblock = function(id) {
		for (var i=0; i<_scope.blocks.length; i++)
			if (_scope.blocks[i].id == id)
				return _scope.blocks[i];
		return undefined;
	}

	var _hidelines = function() {
		_linesVisible = true;
		$('.workspace canvas').hide();
		//$('.workspace .connections').hide();
	}

	var _showlines = function() {
		_linesVisible = true;
		$('.workspace canvas').show();
		//$('.workspace .connections').show();
	}

	var _getBounds = function() {
		var b_x1 = 9999;
		var b_x2 = -9999;
		var b_y1 = 9999;
		var b_y2 = -9999;

		for (var i=0; i<_scope.blocks.length; i++) {
			var b = _scope.blocks[i];
			if (b.x < b_x1) b_x1 = b.x;
			if (b.y < b_y1) b_y1 = b.y;
			if (b.x > b_x2) b_x2 = b.x;
			if (b.y > b_y2) b_y2 = b.y;
		}

		console.log('block bounds:', b_x1,b_y1, b_x2,b_y2);

		var b_cx = 0;
		var b_cy = 0;
		if (b_x2 >= b_x1 && b_y2 >= b_y1) {
			b_cx = Math.floor((b_x2 + b_x1) / 2);
			b_cy = Math.floor((b_y2 + b_y1) / 2);
		}

		console.log('block center', b_cx, b_cy);

		return {
			x1: b_x1,
			x2: b_x2,
			y1: b_y1,
			y2: b_y2,
			cx: b_cx,
			cy: b_cy
		}
	}

	$scope.centerView = function() {
		// center viewport. viewport
		var ws = $(document);

		var w = ws.width();
		var h = ws.height();

		var bounds = _getBounds();

		for (var i=0; i<_scope.blocks.length; i++) {
			var b = _scope.blocks[i];
			b.x -= bounds.cx;
			b.y -= bounds.cy;
			b.x += Math.floor(w * 0.4); // a little bit to the left
			b.y += Math.floor(h * 0.5);
		}

		$('.workspace').css({
			left:'0px',
			top:'0px'
		});

		_renderconnections();
		$scope.$apply();
	}

	var _linesVisible = true;

	var _renderconnections = function() {
		if (!_linesVisible)
			return;
		console.log('render connections');
		var ws = $(document);
		var canvas = $('#arrows')[0];
		canvas.width = ws.width();
		canvas.height = ws.height();
		var ctx = canvas.getContext('2d');
		ctx.fillStyle = '#fff';
		ctx.fillRect(0, 0, ctx.width, ctx.height);
		for (var i=0; i<_scope.connections.length; i++) {
			var c = _scope.connections[i];
			var color = (c.id === _scope.selected) ? '#3c3' : '#888';
			console.log('draw connection', c.id, _scope.selected, color);
			var a = _findblock(c.from);
			var b = _findblock(c.to);
			c.x = Math.round((a.x + b.x) / 2);
			c.y = Math.round((a.y + b.y) / 2);
			ctx.lineWidth = 2;
			ctx.strokeStyle = color;
			var dx = b.x - a.x;
			var dy = b.y - a.y;
			var d = Math.sqrt(dx*dx + dy*dy);
			dx /= d;
			dy /= d;
			ctx.beginPath();
			ctx.moveTo(a.x, a.y);
			ctx.lineTo(b.x, b.y);
			ctx.stroke();
			ctx.moveTo(b.x, b.y);
			var rr = 12;
			var rr2 = 1;
			var ox = c.x-dx*rr;
			var oy = c.y-dy*rr;
			var ox2 = c.x+dx*rr;
			var oy2 = c.y+dy*rr;
			ctx.fillStyle = color;
			ctx.beginPath();
			ctx.moveTo(ox-dy*rr, oy+dx*rr);
			ctx.lineTo(ox+dy*rr, oy-dx*rr);
			ctx.lineTo(ox2+dy*rr2, oy2-dx*rr2);
			ctx.lineTo(ox2-dy*rr2, oy2+dx*rr2);
			ctx.fill();
		}
		$scope.$apply();
	}

	setTimeout(function() {
   	_renderconnections();
		$('.workspace').draggable({
      start: function() {},
      drag: function() {},
      stop: function() {}
    });
   	$( '.workspace' ).click(function(b) {
   		console.log('clicked workspace', b, b.target);
   		if (b.target.className === 'workspace' ||
   			b.target.tagName === 'CANVAS') {
		   	$scope.setSelection('');
		   	$scope.$apply();
	   	}
   	});
   	_makeDraggable();
   	$scope.centerView();
		_setHelp('');
	}, 10);

	$(window).keyup(function(event) {
		console.log('key up', event, event.keyCode, 46, 8);
		if (event.keyCode == 46) {
			$scope.deleteBlockOrConnection();
		}
		return false;
	});
};

module.controller('BuzzController', BuzzController);
