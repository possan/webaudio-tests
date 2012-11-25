define('src/popupmenu', function() {
	var popupmenu = {};

	var _lastPopup = null;

	var _createRecursive = function(parent_ul, items) {
		for (var i=0; i<items.length; i++) {
			var item = items[i];

			var a = $('<a/>');
			a.text(items[i].title);
			a.attr('data-data', JSON.stringify(item));
			// a.attr('data-index', i);

			var li1 = $('<li/>');
			li1.append(a);

			if (item.items && item.items.length > 0) {
				// recursive menu
				var ul = $('<ul/>');
				_createRecursive(ul, item.items);
				li1.append(ul);
			}

			parent_ul.append(li1);
		}
	}

	var _showPopupMenu = function(opts) {
		if (_lastPopup != null) {
			_lastPopup .remove()
			_lastPopup = null;
		}

		if (opts) {
			var x = opts.x || opts.event.pageX;
			var y = opts.y || opts.event.pageY;
			var items = opts.items || [];
			var callback = opts.callback || function(item) {};

			console.log('show popup menu', x, y, items);

			var ul = $('<ul class=\"popup\" />');
			$(document.body).append(ul);
			_createRecursive(ul, items);

			ul.css({
				left: x-160,
				top: y-10
			});

			_lastPopup  = ul;

			ul.menu({
				select: function( event, ui ) {
					console.log('select in menu', event, ui, ui.item[0], event.srcElement);
					// var idx = event.srcElement.dataset.index;
					var itm = JSON.parse(event.srcElement.dataset.data);
					callback(itm);
					ul.remove();
				}
			});
		}
	}

	popupmenu.hide = function() {
		_showPopupMenu(undefined);
	}

	popupmenu.show = function(opts) {
		_showPopupMenu(opts);
	}

	return popupmenu;
});