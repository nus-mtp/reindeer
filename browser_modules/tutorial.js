var io = require('socket.io-client');
var $ = jQuery = require('jquery');
var Cookies = require('js-cookie');

var Slides = require('./models/Slides');
var Canvas = require('./models/Canvas');
var Chat = require('./models/Chat');
var Group = require('./models/group');

var ChatView = require('./views/ChatView');
var SlidesView = require('./views/SlidesView');
var CanvasView = require('./views/CanvasView');
var GroupView = require('./views/GroupView');

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
	var group = new Group(socket);

	//setup view
	var chatView = ChatView.init(socket, chat);
	var slidesView = SlidesView.init(socket, slides);
	var canvasView = CanvasView.init(socket, canvas);
	var groupView = GroupView.init(socket, group);
};

var resizeCanvasToSlideSize = function() {
	var canvas = document.getElementById("whiteboard-canvas").fabric;
	var parent = $('.slide');
	canvas.setWidth(parent.width());
	canvas.setHeight(parent.height());
}

$(document).ready(function() {
	init();

	resizeCanvasToSlideSize();

	// Fires resizing after image is loaded
	$(".slide img").load(function() {
		if(this.complete) {
			resizeCanvasToSlideSize();
		}
	})
})

module.exports.connect = connect;
module.exports.init = init;
window.tutorial = {
	init:init
};