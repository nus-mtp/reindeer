var io = require('socket.io-client');
var $ = jQuery = require('jquery');
var Cookies = require('js-cookie');

var Slides = require('./models/Slides');
var Canvas = require('./models/Canvas');
var Chat = require('./models/Chat');

var ChatView = require('./views/ChatView');
var SlidesView = require('./views/SlidesView');
var CanvasView = require('./views/CanvasView');

//setup socket io
var connect = function (url, token) {
	return io.connect(url, {query: "token=" + token});
}

var init = function() {
	var socketURL;
	var pagename = location.pathname.split('/').pop();
	if (pagename === 'test.html') {
		socketURL = 'http://localhost:3000/room';
	} else {
		socketURL = location.origin + '/room';
	}
	var socket = connect(socketURL, Cookies.get('token'));

	//create data model
	var chat = new Chat(socket);
	var slides = new Slides(socket);
	var canvas = new Canvas(socket);
	setupFabricCanvas(socket);

	//setup view
	var chatView = ChatView.init(socket, chat);
	var slidesView = SlidesView.init(socket, slides);
	var canvasView = CanvasView.init(socket, canvas);
};

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

$(document).ready(function() {
	init();
})

module.exports.connect = connect;
module.exports.init = init;