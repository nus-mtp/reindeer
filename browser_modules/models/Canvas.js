var $ = jQuery = require('jquery');
var Canvas = function(socket){
	this.socket = socket;
	setupFabricCanvas(socket);
}

Canvas.prototype.nextSlide = function(){
	this.socket.emit('nextSlide');
}

Canvas.prototype.prevSlide = function() {
	this.socket.emit('prevSlide');
}

var setupFabricCanvas= function(socket) {
	var canvas = new fabric.Canvas('whiteboard-canvas');

	canvas.backgroundColor="white";
	canvas.selection = true;
	canvas.isDrawingMode = true;
	canvas.freeDrawingBrush.width = 5;

	canvas.on('path:created', function(e) {
		var pathObject = e.path;
		socket.emit('canvas_new-fabric-object', pathObject);
	});

	socket.on('canvas_state', function(data) {
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
}


module.exports = Canvas;