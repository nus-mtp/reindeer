var $ = jQuery = require('jquery');
var Canvas = function(socket){
	this.socket = socket;

	//this.socket.on('canvasState',function(canvasObjects){
	//	canvas.clear();
    //
	//	fabric.util.enlivenObjects(canvasObjects, function(objects) {
	//		var origRenderOnAddRemove = canvas.renderOnAddRemove;
	//		canvas.renderOnAddRemove = false;
    //
	//		// objects = JSON.parse(objects);
	//		objects.forEach(function(o) {
	//			canvas.add(o);
	//		});
	//		canvas.renderOnAddRemove = origRenderOnAddRemove;
	//		canvas.renderAll();
	//	});
	//});
    //
	//this.socket.on('canvasAction', function(action) {
	//	var parsedAction = JSON.parse(action);
	//	console.log(parsedAction.owner);
	//	fabric.util.enlivenObjects([parsedAction], function(objects) {
	//		var origRenderOnAddRemove = canvas.renderOnAddRemove;
	//		canvas.renderOnAddRemove = false;
    //
	//		objects.forEach(function(o) {
	//			canvas.add(o);
	//		});
	//		canvas.renderOnAddRemove = origRenderOnAddRemove;
	//		canvas.renderAll();
	//	});
	//});
}

Canvas.prototype.nextSlide = function(){
	this.socket.emit('nextSlide');
}

Canvas.prototype.prevSlide = function() {
	this.socket.emit('prevSlide');
}

module.exports = Canvas;