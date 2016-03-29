var $ = jQuery = require('jquery');
var Canvas = function(socket){
	this.socket = socket;
	setupFabricCanvas(socket);
}

var setupFabricCanvas= function(socket) {
	var canvas = new fabric.Canvas('whiteboard-canvas');

	canvas.backgroundColor="white";
	canvas.selection = true;
	canvas.isDrawingMode = true;
	canvas.freeDrawingBrush.width = 5;

	canvas.on('path:created', function(e) {
		var pathObject = e.path;
		socket.emit('canvas:new-fabric-object', pathObject);
	});

	socket.on('canvas:state', function(data) {
		canvas.clear();
		fabric.util.enlivenObjects(data, function(objects) {
			var origRenderOnAddRemove = canvas.renderOnAddRemove;
			canvas.renderOnAddRemove = false;

			// objects = JSON.parse(objects);
			objects.forEach(function(o) {
				canvas.add(o);
			});
			canvas.renderOnAddRemove = origRenderOnAddRemove;
			canvas.renderAll();
		});
	});

	function keyPress(e) {
		var evtobj = window.event? event : e
		// Capture Undo Key Press
		if (evtobj.keyCode == 90 && evtobj.ctrlKey) {
			socket.emit('canvas:undo');
		}
		// Capture Redo Key Press
		if (evtobj.keyCode == 89 && evtobj.ctrlKey) {
			socket.emit('canvas:redo');

		}
	}

	document.addEventListener("keydown", keyPress, false);
}

module.exports = Canvas;