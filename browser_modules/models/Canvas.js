var $ = jQuery = require('jquery');
var Canvas = function(socket){
	this.socket = socket;
	setupFabricCanvas(socket);
}

var setupFabricCanvas= function(socket) {
	var canvas = new fabric.Canvas('whiteboard-canvas');
	document.getElementById("whiteboard-canvas").fabric = canvas;

	canvas.backgroundColor="transparent";
	canvas.selection = true;
	canvas.isDrawingMode = true;
	canvas.freeDrawingBrush.width = 5;
	canvas.freeDrawingCursor='url(/images/UIElements/brush-icon.png),default';

	canvas.on('path:created', function(e) {
		var pathObject = e.path;
		var slideWidth = $('.slide').width();
		var factor = 1000/slideWidth;

		zoomObject(pathObject, factor);
		socket.emit('canvas:new-fabric-object', pathObject);
	});

	socket.on("color", function(color) {
		canvas.freeDrawingBrush.color = color;
	});

	socket.on('canvas:state', function(data) {
		canvas.clear();
		fabric.util.enlivenObjects(data, function(objects) {
			canvas.rawObjects = data;
			var origRenderOnAddRemove = canvas.renderOnAddRemove;
			canvas.renderOnAddRemove = false;

			// objects = JSON.parse(objects);
			objects.forEach(function(o) {
				canvas.add(o);
			});
			canvas.renderOnAddRemove = origRenderOnAddRemove;
			//Save objects before scale!
			// scale objects here
			var slideWidth = $('.slide').width();
			var factor = slideWidth/1000;

			zoomCanvasObjects(canvas, factor);

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

function zoomObject(canvasObject, factor) {
	var scaleX = canvasObject.scaleX;
	var scaleY = canvasObject.scaleY;
	var left = canvasObject.left;
	var top = canvasObject.top;

	var tempScaleX = scaleX * factor;
	var tempScaleY = scaleY * factor;
	var tempLeft = left * factor;
	var tempTop = top * factor;

	canvasObject.scaleX = tempScaleX;
	canvasObject.scaleY = tempScaleY;
	canvasObject.left = tempLeft;
	canvasObject.top = tempTop;

	canvasObject.setCoords();
}

function zoomCanvasObjects(canvas, factor) {
	if (canvas.backgroundImage) {
		// Need to scale background images as well
		var bi = canvas.backgroundImage;
		bi.width = bi.width * factor; bi.height = bi.height * factor;
	}
	var objects = canvas.getObjects();
	for (var i in objects) {
		var scaleX = objects[i].scaleX;
		var scaleY = objects[i].scaleY;
		var left = objects[i].left;
		var top = objects[i].top;

		var tempScaleX = scaleX * factor;
		var tempScaleY = scaleY * factor;
		var tempLeft = left * factor;
		var tempTop = top * factor;

		objects[i].scaleX = tempScaleX;
		objects[i].scaleY = tempScaleY;
		objects[i].left = tempLeft;
		objects[i].top = tempTop;

		objects[i].setCoords();
	}
	canvas.calcOffset();
}

module.exports = Canvas;