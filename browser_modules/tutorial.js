var io = require('socket.io-client');
var $ = jQuery = require('jquery');
var cookies = require('js-cookie');
var socketURL = location.origin+'/room';
var canvasmanager = require('./controllers/canvasmanager');
var chatmanager = require('./controllers/chatmanager');
var groupmanager = require('./controllers/groupmanager');

$(document).ready(function () {
	var socket = io.connect(socketURL, { query: "token=" + cookies.get('token') });
	canvasmanager.handle(socket);
	chatmanager.handle(socket);
	groupmanager.handle(socket);
})

