window.httpRoot = 'HTTP_ROOT';
var io = require('socket.io-client');
var $ = jQuery = require('jquery');
var Cookies = require('js-cookie');

var Slides = require('./models/Slides');
var Canvas = require('./models/Canvas');
var Chat = require('./models/Chat');
var Group = require('./models/group');
var Voice = require('./models/Voice');

var ChatView = require('./views/ChatView');
var SlidesView = require('./views/SlidesView');
var CanvasView = require('./views/CanvasView');
var GroupView = require('./views/GroupView');

//setup socket io
var connect = function (url, token) {
	return io.connect(url, {query: "token=" + token});
}

var init = function(tutorialID) {
	var socketURL;
	var pagename = location.pathname.split('/').pop();
	if (pagename === 'test.html') {
		socketURL = 'http://localhost:3000/room';
	} else {
		socketURL = window.httpRoot + '/room';
	}
	var socket = connect(socketURL, Cookies.get('token'));

	//create data model
	var group = new Group(socket);
	var chat = new Chat(socket);
	var slides = new Slides(socket,tutorialID);
	var canvas = new Canvas(socket);
	//var voice =new Voice(socket);

	//setup view
	var chatView = ChatView.init(socket, chat);
	var slidesView = SlidesView.init(socket, slides);
	var canvasView = CanvasView.init(socket, canvas);
	var groupView = GroupView.init(socket, group);
};

var previousWidth = $(window).width();

var resizeCanvasToSlideSize = function() {
	var canvas = document.getElementById("whiteboard-canvas").fabric;
	var parent = $('.slide');
	canvas.setWidth(parent.width());
	canvas.setHeight(parent.height());

	// reset
	if (canvas.rawObjects) {
		canvas.clear();
		fabric.util.enlivenObjects(canvas.rawObjects, function(objects)
		{
			var origRenderOnAddRemove = canvas.renderOnAddRemove;
			canvas.renderOnAddRemove = false;
			objects.forEach(function (o) {
				canvas.add(o);
			});
			canvas.renderOnAddRemove = origRenderOnAddRemove;
			var slideWidth = $('.slide').width();
			var factor = slideWidth / 1000;
			zoomCanvasObjects(canvas, factor);
			canvas.renderAll();
		});
	}
}

$(document).ready(function() {
	resizeCanvasToSlideSize();

	// Fires resizing after image is loaded
	$(".slide img").load(function() {
		if(this.complete) {
			resizeCanvasToSlideSize();
		}
	})

	$(window).on('resize', function() {
		resizeCanvasToSlideSize();
	});
})

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

module.exports.resizeCanvasToSlideSize = resizeCanvasToSlideSize;
module.exports.connect = connect;
module.exports.init = init;
window.tutorial = {
	init:init
};