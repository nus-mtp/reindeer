var io = require('socket.io-client');
var $ = jQuery = require('jquery');
var Cookies = require('js-cookie');

var Slide = require('./models/Slide');
var Canvas = require('./models/Canvas');
var Chat = require('./models/Chat');

var ChatView = require('./views/ChatView');
var SlideView = require('./views/SlideView');
var CanvasView = require('./views/CanvasView');

$(document).ready(function () {
	//setup socket io
	var socketURL = location.origin + '/room';
	var socket = io.connect(socketURL, {query: "token=" + Cookies.get('token')});

	//create data model
	var chat = new Chat(socket);
	var slide = new Slide(socket);
	var canvas = new Canvas(socket);

	//setup view
	var chatView = ChatView.init(socket, chat);
	var slideView = SlideView.init(socket, slide);
	var canvasView = CanvasView.init(socket, canvas);
})

