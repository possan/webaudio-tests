'use strict';

define('src/services/editor', ['src/app'], function(app) {
	app.module.service('editorService', function() {
		var _blocks = [];
		var _connections = [];

		this.init = function() {
		}


		this.getConnectionsVM = function() {
			return _connections;
		}

		this.getBlocksVM = function() {
			return _blocks;
		}

		this.numBlocks = function() {
			return app.machine.numTracks();
		}

		this.numConnections = function() {
			return app.machine.numConnections();
		}

		this.getBlockById = function(id) {
			return app.machine.getTrackById(id);
		}

		this.getConnectionById = function(id) {
			return app.machine.getConnectionById(id);
		}

		this.getBlock = function(index) {
			return app.machine.getTrackId(index);
		}

		this.updateBlock = function(block) {
		}

		this.updateConnection = function(conn) {
		}

		this.getConnection = function(index) {
			return app.machine.getConnectionId(index);
		}

		this.createBlock = function(type, x, y) {
			app.machine.createAndAddDevice({
				type: type,
				x: x,
				y: y
			});
		}

		this.connectBlocks = function(from, to) {
			app.machine.connectDevices(from, to);
		}

		this.markDirty = function() {
		}

		this.deleteBlock = function(id) {
			if (id == '')
				return;
			var b = this.getBlockById(id);
			if (b && b.type == 'master')
				return;
			app.machine.removeTrack(id);
			app.machine.removeDevice(id);
		}

		this.deleteConnection = function(id) {
			if (id == '')
				return;
			app.machine.removeConnection(id);
		}





		var _lastid = '';

		this.getBlockProperties = function(id) {
			_lastid = id;
			return [
				{
					id: 'title',
					title: 'Title',
					value: 'xyz'
				},
				{
					id: 'gate',
					title: 'Gate',
					helptext: 'help text 2',
					value: 'zzz'
				},
				{
					id: 'volume',
					title: 'Volume',
					help: 'helptext3',
					value: 'www'
				},
			]
		}

		this.getConnecitonProperties = function(id) {
			_lastid = id;
			return [
				{
					id: 'volume',
					title: 'Volume',
					value: '100'
				},
			]
		}




		this.updateProperties = function(data) {
			console.log( 'update properties', _lastid, data );
		}

		this.getDeviceTypeParameterDefinition = function(type) {
			if (type == 'connection') {
				var d = new Connection();
				return d.parameters;
			}
			var d = app.machine.createDeviceByType(type);
			return d.parameters;
		}
















	});
});