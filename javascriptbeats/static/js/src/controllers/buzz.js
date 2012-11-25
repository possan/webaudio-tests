define( 'src/controllers/buzz',
	[
		'src/app',
		'src/popupmenu',
		'src/services/help',
		'src/services/editor',
		'src/services/device',
		'src/services/preset',
	], function(app, popupmenu) {

	'use strict';

	app.module.controller(
		'BuzzController',
	function(
		$scope,
		$http,
		editorService,
		presetService,
		helpService,
		deviceService
	) {

		$scope.state = '';
		$scope.props = [];
		$scope.title = '';
		$scope.selected = '';

		$scope.blocks = [];
		$scope.connections = [];

		$scope.editParametersPanel = false;
		$scope.createBlockPanel = false;
		$scope.helpPanel = false;

		var _renderconnections = function() {
			if (!_linesVisible)
				return;
			// console.log('render connections');
			var ws = $(document);
			var canvas = $('#arrows')[0];
			canvas.width = ws.width() - 250;
			canvas.height = ws.height();
			var ctx = canvas.getContext('2d');
			ctx.fillStyle = '#fff';
			ctx.fillRect(0, 0, ctx.width, ctx.height);
			for (var i=0; i<editorService.numConnections(); i++) {
				var id = editorService.getConnection(i);
				var c = editorService.getConnectionById(id);
				var color = (c.id === _scope.selected) ? '#9c2' : '#aaa';
				// console.log('draw connection', c.id, _scope.selected, color);
				var a = editorService.getBlockById(c.from);
				var b = editorService.getBlockById(c.to);
				if (a && b) {
					c.x = Math.round((a.x + b.x) / 2);
					c.y = Math.round((a.y + b.y) / 2);
					editorService.updateConnection(c);
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
			}
			$scope.$apply();
		}

		var _makeDraggable = function() {
			$( 'ul.blocks li' ).unbind('click');
			$( 'ul.connections li' ).unbind('click');
			$( 'ul.blocks li' ).bind('contextmenu', function(event) {
				console.log('mousedown', this, event);
				console.log('right clicked.');
				event.preventDefault();
				event.stopPropagation();
				$scope.setSelection(this.dataset.id);	
				_showBlockPopupMenu(event, this.dataset.id);
				return false;
			});
			$( 'ul.blocks li' ).click(function(event) {
				event.stopPropagation();
				if (!$(this).hasClass('dragging')) {
					event.preventDefault();
					console.log('clicked block 2', this, event);
					if ($scope.selected != this.dataset.id) {
						if ($scope.selected != '' && (event.shiftKey || event.altKey)) {
							// connect block shortcut, select one, shift-click the destination..
							editorService.connectBlocks($scope.selected, this.dataset.id);
							_reloadView();
						} else {
							$scope.setSelection(this.dataset.id);
						}
					} else {
						$scope.setSelection('');
					}
					$scope.$apply();
				}
			});
			$( 'ul.connections li' ).bind('contextmenu', function(event) {
				console.log('mousedown', this, event);
				console.log('right clicked.');
				event.preventDefault();
				event.stopPropagation();
				$scope.setSelection(this.dataset.id);
				_showBlockPopupMenu(event, this.dataset.id);
				return false;
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
				},
				stop: function() {
					// save position
					// redraw canvas
					$(this).removeClass('dragging');
					var idx = parseInt(this.dataset.index);
					var x = parseFloat(this.style.left);
					var y = parseFloat(this.style.top);
					var blk = editorService.getBlockById(this.dataset.id);
					blk.x = x+25;
					blk.y = y+25;
					_reloadView();
					_showlines();
				}
			});
		}
		var _reloadView = function() {
			var newblocks = [];
			for (var i=0; i<editorService.numBlocks(); i++) {
				var id = editorService.getBlock(i);
				var block = editorService.getBlockById(id);
				newblocks.push(block);
			}
			$scope.blocks = newblocks;
			var newconns = [];
			for (var i=0; i<editorService.numConnections(); i++) {
				var id = editorService.getConnection(i);
				var conn = editorService.getConnectionById(id);
				newconns.push(conn);
			}
			$scope.connections = newconns
			_renderconnections();
			_makeDraggable();
		}

		_reloadView();

		var _lastSidebarView = 'xxxx';

		var _setSidebar = function(name) {
			if (name == _lastSidebarView)
				return;
			$scope.editParametersPanel = (name == 'device' || name == 'song');
			$scope.createBlockPanel = (name == 'create');
			$scope.helpPanel = (name == 'help');
			$scope.aboutPanel = (name == 'song');
			$scope.bigaboutPanel = (name == 'about');
			$scope.sharePanel = (name == 'song');
			$scope.sharePanel2 = (name == 'song');
			if (name == 'song') {
				// bind song property editor
				var set = {
					type: 'song',
					title: 'Song',
					info: '',
					deletable: false,
					properties: [
						{
							name: 'title',
							type: '',
							title: 'Song name',
							expression: app.machine.song.title,
							has_presets: false,
							help: ''
						},
						{
							name: 'bpm',
							type: '',
							title: 'BPM',
							expression: ''+app.machine.sequencer.bpm,
							has_presets: false,
							help: ''
						},
						{
							name: 'shuffle',
							type: '',
							title: 'Shuffle',
							expression: ''+app.machine.sequencer.shuffle,
							has_presets: false,
							help: ''
						},
					]
				}
				$scope.showPropertyEditor(set);
			}
			_lastSidebarView = name;
		}

		$scope.showPresets = function(e, index, type) {
			console.log('showPresets');
			console.log('e', e);
			console.log('type', type);
			console.log('index', index);
			var pres = helpService.getParameterPresets(type);
			popupmenu.show({
				x: event.pageX,
				y: event.pageY,
				callback: function(_item) {
					console.log('clicked preset', _item);
					console.log('old prop', $scope.propertyeditor.properties[index]);
					console.log('set value', _item.expression);
					$scope.propertyeditor.properties[index].expression = _item.expression;
					$scope.$apply();
					$scope.savePropertyEditor();
				},
				items: pres
			});
		}

		var _showBlockPopupMenu = function(event, id) {
			var items = [{
				id: '0',
				title: 'Delete block'
			}];
			popupmenu.show({
				x: event.pageX,
				y: event.pageY,
				callback: function(item) {
					console.log('clicked block popup menu item', item);
				},
				items: items
			});
		}



		$scope.getBlockPosition = function(block) {
			var ret = {
				left: (block.x-25) + 'px',
				top: (block.y-25) + 'px'
			}
			// console.log('getBlockPosition', block, ret);
			return ret;
		}

		$scope.getConnectionPosition = function(conn) {
			var ret = {
				left: (conn.x-12) + 'px',
				top: (conn.y-12) + 'px'
			}
			// console.log('getConnectionPosition', conn, ret);
			return ret;
		}

		$scope.connectBlocks = function(from, to) {
			var newid =	app.machine.generateId();
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
			_setSidebar('song');
		}

		$scope.showPropertyEditor = function(set) {
			$scope.propertyeditor = set;
		}

		$scope.savePropertyEditor = function() {
			console.log('Save property editor');
			var newdata = {};
			for (var i=0; i<$scope.propertyeditor.properties.length; i++) {
				var p = $scope.propertyeditor.properties[i];
				newdata[p.name] = p.expression;
			}
			console.log('newdata', newdata);
			if ($scope.propertyeditor.type == 'song') {
				app.machine.song.title = newdata.title;
				app.machine.sequencer.setBPM(newdata.bpm);
				app.machine.sequencer.setShuffle(newdata.shuffle);
			} else {
				var id = $scope.propertyeditor.id;
				var b = editorService.getBlockById(id);
				if (b) {
					b.setData(newdata);
				} else {
					var c = editorService.getConnectionById(id);
					if (c) {
						c.setData(newdata);
					}
				}
			}
		}

		var _showDeviceEditor = function(obj, type, id, includetitle) {
			var bd = app.machine.createDeviceByType(type);
			var props = [];
			if (includetitle) {
				var p = bd.parameters[i];
				var prop = {
					name: 'title',
					type: '',
					title: 'Title',
					expression: obj.title,
					has_presets: false,
					help: ''
				};
				props.push(prop);
			}
			for (var i=0; i<bd.parameters.length; i++) {
				var p = bd.parameters[i];
				var pres = helpService.getParameterPresets(p.type);
				var prop = {
					name: p.id,
					type: p.type,
					title: p.title || p.id,
					expression: obj.values[p.id].source.expression,
					has_presets: pres.length > 0,
					help: p.help || helpService.getParameterHelp(p.type)
				};
				props.push(prop);
			}
			for (var i=0; i<props.length; i++)
				props[i].index = i;
			var set = {
				id: id,
				type: type,
				title: bd.typeTitle,
				info: bd.typeInfo,
				properties: props
			}
			set.deletable = (set.type != 'master');

			$scope.showPropertyEditor(set);
		}

		$scope.showBlockOrConnectionPropertyEditor = function(id) {

			var b = editorService.getBlockById(id);
			if (b) {
				_showDeviceEditor(b, b.type, id, b.type != 'master');
			} else {
				b = editorService.getConnectionById(id);
				if (b) {
					_showDeviceEditor(b, 'connection', id, false);
				}
			}

		}

		$scope.setSelection = function(id) {
			if ($scope.state == 'create-connection') {
				if (id != '') {
					console.log('connect from', id);
					$scope.propertyeditor = {};
					$scope.connectFrom = id;
					$scope.state = 'create-connection-2';
					_setHelp('Click the block to connect to');
					_setSidebar('song');
				}
			} else if ($scope.state == 'create-connection-2') {
				if (id != '' && id != $scope.connectFrom) {
					console.log('connect to', id);
					$scope.connectTo = id;
					$scope.state = '';
					editorService.connectBlocks($scope.connectFrom, $scope.connectTo);
					_reloadView();
					_setHelp('');
					_setSidebar('song');
				}
			} else {
				$( 'ul.blocks li' ).removeClass('selected');
				$( 'ul.connections li' ).removeClass('selected');
				if (id != '') {
					$( 'ul.blocks li[data-id='+id+']' ).addClass('selected');
					$( 'ul.connections li[data-id='+id+']' ).addClass('selected');
					_setHelp('Shift click the second block to connect them, click delete to delete the selected object');
					$scope.showBlockOrConnectionPropertyEditor(id);
					_setSidebar('device');
				} else {
					_setHelp('');
					_setSidebar('song');
				}
				$scope.selected = id;
			}
			_renderconnections();
		}

		$scope.toolbarAdd = function() {
			$scope.setSelection('');
			_setSidebar('create');
			_setHelp('');//Click the block to connect to');
		}

		$scope.toolbarSong = function() {
		}

		$scope.toolbarSave = function() {
		}

		$scope.toolbarPlay = function() {
			app.machine.togglePlay();
			if (app.machine.isPlaying())
				$('#playbutton').addClass('down');
			else
				$('#playbutton').removeClass('down');
		}

		$scope.toolbarFork = function() {
		}

		$scope.toolbarHelp = function() {
			_setSidebar('help');
		}

		$scope.toolbarAbout = function() {
			_setSidebar('about');
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
			editorService.deleteBlock(id);
			_reloadView();
			_setSidebar('song');
			_makeDraggable();
			_setHelp('');
		}

		$scope.deleteBlockOrConnection = function() {
			var id = $scope.selected;
			if (id == '')
				return;
			editorService.deleteBlock(id);
			editorService.deleteConnection(id);
			_setSidebar('song');
			_reloadView();
			_makeDraggable();
			_setHelp('');
		}

		$scope.deleteConnection = function() {
			var id = $scope.selected;
			if (id == '')
				return;
			editorService.deleteConnection(id);
			$scope.editParametersPanel = false;
			_reloadView();
			_setSidebar('song');
			_makeDraggable();
			_setHelp('');
		}

		$scope.beginAddConnection = function() {
			$scope.connectFrom = '';
			$scope.connectTo = '';
			$scope.setSelection('');
			_setHelp('Click on the block you want to connect from...');
			$scope.state = 'create-connection';
			_setSidebar('song');
		}

		$scope.createConnection = function() {
			_setSidebar('song');
			// _reloadView();
			_makeDraggable();
		}

		$scope.createBlock = function(type) {
			var b = _getBounds();
			editorService.createBlock(type, b.x1-50, b.cy);
			_reloadView();
			_setSidebar('song');
		}

		var _scope = $scope;

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

			for (var i=0; i<editorService.numBlocks(); i++) {
				var id = editorService.getBlock(i);
				var b = editorService.getBlockById(id);
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

		$scope.toolbarCenter = function() {
			// center viewport. viewport
			var ws = $(document);

			var w = ws.width() - 250;
			var h = ws.height();

			$('.workspace').css({
				left:'0px',
				top:'0px'
			});

			var bounds = _getBounds();

			for (var i=0; i<editorService.numBlocks(); i++) {
				var id = editorService.getBlock(i);
				var b = editorService.getBlockById(id);
				b.x -= bounds.cx;
				b.y -= bounds.cy;
				b.x += Math.floor(w * 0.5);
				b.y += Math.floor(h * 0.5);
				editorService.updateBlock(b);
			}

			_reloadView();
			_renderconnections();
			$scope.$apply();
		}

		var _linesVisible = true;


		setTimeout(function() {
			// load blocks...
			editorService.init();
			_reloadView();
			_renderconnections();

			$('.workspace').draggable({
				start: function() {},
				drag: function() {},
				stop: function() {}
			});

			$( '.workspace' ).click(function(b) {
				console.log('clicked workspace', b, b.target);
				popupmenu.hide();
				if (b.target.className === 'workspace' ||
					b.target.tagName === 'CANVAS') {
					$scope.setSelection('');
					$scope.$apply();
					_setSidebar('song');
				}
				window.focus();
			});

			$scope.availableDevices = deviceService.getAvailableDevices();

			_makeDraggable();

			$scope.toolbarCenter();

			_setSidebar('song');

			_setHelp('');

			var myurl = 'http://javascriptbeats.appspot.com/123456';
			var sharetext = 'Look what i did with #javascriptbeats';
			$('#myurl').val(myurl);
			$('#shareTwitter').attr('href', 'http://twitter.com/share?text='+encodeURIComponent(sharetext)+'&url='+encodeURIComponent(myurl));
			$('#shareFacebook').attr('href', 'http://www.facebook.com/sharer.php?u='+encodeURIComponent(myurl));

			//	$scope.setSelection('block1');
			$('#bigloadah').fadeOut();
		}, 100);

		$(window).keyup(function(event) {
			console.log('key up', event, event.keyCode);

			if (event.keyCode == 32 && event.srcElement.tagName != 'INPUT') {
				$scope.toolbarPlay();
				event.preventDefault();
				return false;
			}

			if (event.keyCode == 46) {
				$scope.deleteBlockOrConnection();
				_setSidebar('song');
			}

			return false;
		});
	});
});