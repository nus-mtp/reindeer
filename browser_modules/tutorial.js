var io = require('socket.io-client');
var $ = jQuery = require('jquery');
var Cookies = require('js-cookie');

var Slide = require('./models/Slide');
var Canvas = require('./models/Canvas');
var Chat = require('./models/Chat');
var Group = require('./models/group');

var ChatView = require('./views/ChatView');
var SlideView = require('./views/SlideView');
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
	var slide = new Slide(socket);
	var canvas = new Canvas(socket);
	var group = new Group(socket);

	//setup view
	var chatView = ChatView.init(socket, chat);
	var slideView = SlideView.init(socket, slide);
	var canvasView = CanvasView.init(socket, canvas);
	var groupView = GroupView.init(socket, group);
};

$(document).ready(function(){
	init();
})

module.exports.connect = connect;
module.exports.init = init;