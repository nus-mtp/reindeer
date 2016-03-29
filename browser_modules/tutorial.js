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

	//setup view
	var chatView = ChatView.init(socket, chat);
	var slidesView = SlidesView.init(socket, slides);
	var canvasView = CanvasView.init(socket, canvas);
};

$(document).ready(function() {
	init();
})

module.exports.connect = connect;
module.exports.init = init;