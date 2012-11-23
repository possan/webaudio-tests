'use strict';
console.log('in studio.js');

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
	console.log('create buzz');

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
		}
	];

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

	var _hidelines = function() {
		$('.workspace canvas').hide();
		$('.workspace .connections').hide();
	}

	var _showlines = function() {
		$('.workspace canvas').show();
		$('.workspace .connections').show();
	}

	$scope.connections = [
		{id: 'ca', index: 0, from:'block1', to:'block2'},
		{id: 'cb', index: 1, from:'block2', to:'block3'},
	];

	$scope.props = [
	];

	$scope.title = 'Buxx?';

	var _scope = $scope;

	var _findblock = function(id) {
		for (var i=0; i<_scope.blocks.length; i++)
			if (_scope.blocks[i].id == id)
				return _scope.blocks[i];
		return undefined;
	}

	var _renderconnections = function() {
		console.log('render connections');
		var ws = $('.workspace');
		var canvas = $('#arrows')[0];
		canvas.width = ws.width();
		canvas.height = ws.height();
		console.log(canvas.width, canvas.height);
		var ctx = canvas.getContext('2d');
		ctx.fillColor = '#ddd';
		ctx.fillRect(0, 0, ctx.width, ctx.height);
		for (var i=0; i<_scope.connections.length; i++) {
			var c = _scope.connections[i];
			console.log('draw connection', c);
			var a = _findblock(c.from);
			var b = _findblock(c.to);
			console.log('from', a);
			console.log('to', b);
			ctx.strokeColor = '#ff0000';
			ctx.moveTo(a.x, a.y);
			ctx.lineTo(b.x, b.y);
			ctx.stroke();
			c.x = (a.x + b.x) / 2;
			c.y = (a.y + b.y) / 2;
		}
		$scope.$apply();
	}

	$scope.selected = '';

	setTimeout(function() {
   	_renderconnections();
   	$( '.workspace' ).click(function(b) {
   		console.log('clicked workspace');
	   	$( 'ul.blocks li' ).removeClass('selected');
	   	$( 'ul.connections li' ).removeClass('selected');
    	$scope.selected = '';
   		$scope.$apply();
   	});
   	$( 'ul.blocks li' ).click(function(event) {
 	   	event.stopPropagation();
			if (!$(this).hasClass('dragging')) {
		   	event.preventDefault();
     		console.log('clicked block 2', this);
     		if ($scope.selected != this.dataset.id) {
			   	$( 'ul.blocks li' ).removeClass('selected');
			   	$( 'ul.connections li' ).removeClass('selected');
		   		$(this).addClass('selected');
		    	$scope.selected = this.dataset.id;
     		} else {
		   		$(this).removeClass('selected');
		   		$scope.selected = '';
     		}
     		$scope.$apply();
		  }
   	});
   	$( 'ul.connections li' ).click(function(event) {
	   	event.preventDefault();
	   	event.stopPropagation();
   		console.log('clicked connection 2', this);
   		if ($scope.selected != this.dataset.id) {
		   	$( 'ul.blocks li' ).removeClass('selected');
		   	$( 'ul.connections li' ).removeClass('selected');
		   	$(this).addClass('selected');
	    	$scope.selected = this.dataset.id;
	    } else {
     		$(this).removeClass('selected');
	   		$scope.selected = '';
     	}
   		 _scope.$apply();
   	});
		$( "ul.blocks li" ).draggable({
      start: function() {
      	// hide canvas
        $(this).addClass('dragging');
      	console.log('start drag', this);
      	_hidelines();
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
      	_renderconnections();
      	_showlines();
      }
    });
	}, 100);
};

module.controller('BuzzController', BuzzController);
