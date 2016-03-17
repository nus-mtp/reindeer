var $ = jQuery = require('jquery');
var Canvas = function(socket){
	this.socket = socket;
	/*
	socket.on('connect', function(){
		console.log('canvas manager works!');
	});

	socket.on('slidesPaths', function(data) {
		var slideContainer = $('.slideContainer');

		for (var i=0; i<data.length; ++i) {
			var slide = $('<div></div>')
				.addClass('slide')
				.attr('id', i);

			var image = $('<img>')
				.attr('src', data[i]);

			slide.append(image);
			slideContainer.append(slide);
		}
	});

	socket.on('currentSlide', function(data) {
		$('.slide').hide();
		$("#" + data).show();
		console.log(data);
	});

	$('.nextButton').click(function() {
		socket.emit('nextSlide');
	});

	$('.prevButton').click(function() {
		socket.emit('prevSlide');
	})
*/
	//$('.plalette-color').click(function () {
	//	var parentContainer = $(this).parent();
	//	parentContainer.find('.selected').each(function () {
	//		$(this).removeClass('selected');
	//	});
    //
	//	$(this).addClass('selected');
	//	changeBrushColor($(this).data('value'));
	//});
	//// create a wrapper around native canvas element (with id="c")
	//var canvas = new fabric.Canvas('whiteboard-canvas');
	//canvas.backgroundColor = "white";
	//canvas.selection = true;
	//canvas.isDrawingMode = true;
	//canvas.freeDrawingBrush.width = 5;
	//canvas.setWidth(window.innerWidth * 0.55);
	//canvas.setHeight(window.innerHeight * 0.58);
	//// canvas.renderAll();
    //
	//canvas.on('object:modified', function (e) {
	//	socket.emit('canvasState', JSON.stringify(canvas));
	//});
    //
	//canvas.on('path:created', function (e) {
	//	// socket.emit('canvasState', JSON.stringify(canvas));
	//	var pathObject = e.path;
	//	socket.emit('canvasAction', pathObject);
	//	// canvas.add(fabric.util.enlivenObjects(JSON.parse(e.path.toJSON())));
	//	// console.log(e.path);
	//});
    //
	//socket.on('canvasState', function (canvasObjects) {
	//	canvas.clear();
    //
	//	fabric.util.enlivenObjects(canvasObjects, function (objects) {
	//		var origRenderOnAddRemove = canvas.renderOnAddRemove;
	//		canvas.renderOnAddRemove = false;
    //
	//		// objects = JSON.parse(objects);
	//		objects.forEach(function (o) {
	//			canvas.add(o);
	//		});
	//		canvas.renderOnAddRemove = origRenderOnAddRemove;
	//		canvas.renderAll();
	//	});
	//});
    //
	//socket.on('canvasAction', function (action) {
	//	var parsedAction = JSON.parse(action);
	//	console.log(parsedAction.owner);
	//	fabric.util.enlivenObjects([parsedAction], function (objects) {
	//		var origRenderOnAddRemove = canvas.renderOnAddRemove;
	//		canvas.renderOnAddRemove = false;
    //
	//		objects.forEach(function (o) {
	//			canvas.add(o);
	//		});
	//		canvas.renderOnAddRemove = origRenderOnAddRemove;
	//		canvas.renderAll();
	//	});
	//});
    //
	//$(window).resize(function () {
	//	// var canvasWrapper = $('.whiteboard-wrapper');
	//	// canvas.setWidth(canvasWrapper.width());
	//	// canvas.setHeight(canvasWrapper.height());
	//	// canvas.renderAll();
	//});
    //
	//function KeyPress(e) {
	//	var evtobj = window.event ? event : e
	//	if (evtobj.keyCode == 90 && evtobj.ctrlKey) {
	//		socket.emit('canvasUndo');
	//	}
    //
	//	if (evtobj.keyCode == 65 && evtobj.ctrlKey) {
	//		alert('clear');
	//		socket.emit('canvasClear');
	//	}
	//}
    //
    //
	//document.onkeydown = KeyPress;
    //
	////shake to change the brush color to a random color
	////        $.shake({
	////            callback: function()
	////            {
	////                canvas.freeDrawingBrush.color = getRandomColor();
	////           }
	////        });
    //
	//function getRandomColor() {
	//	var letters = '0123456789ABCDEF'.split('');
	//	var color = '#';
	//	for (var i = 0; i < 6; i++) {
	//		color += letters[Math.floor(Math.random() * 16)];
	//	}
	//	return color;
	//}
    //
	//function changeBrushColor(color) {
	//	canvas.freeDrawingBrush.color = color;
	//}
}

Canvas.prototype.nextSlide = function(){
	this.socket.emit('nextSlide');
}

Canvas.prototype.prevSlide = function() {
	this.socket.emit('prevSlide');
}

module.exports = Canvas;