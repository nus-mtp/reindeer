var express = require('express');
var io = require('socket.io')();

var messageio = io.of('/messagetest');

var listen = function(app) {
	io.listen(app);
	console.log('socket listen on ' + app.address().port);
}

var canvasconnect = function(url){
	var canvasio;
	console.log(url);
	canvasio = io.of(url);
	canvasio.on('connection', function(socket){
		console.log('a user connected to '+url);
		console.log(socket.request.headers);
		socket.emit('msg',{
			msg: socket.request.headers,
		});
		socket.on('canvasState', function(msg){
			console.log(msg);
		});
	});
}

var messageconnect = function (url){
    var messageio;
    console.log(url);
    messageio = io.of(url);
    messageio.on('connection', function (socket) {
        console.log('a user connected to ' + url);
        console.log(socket.request.headers);
        socket.emit('msg', {
            msg: socket.request.headers,
        });
    });
}

messageio.on('connection', function(socket){
	console.log('a user connected to message');
	socket.emit('msg',{
		msg: socket.request.headers,
	});
});

module.exports.listen = listen;
module.exports.canvasconnect = canvasconnect;
module.exports.messageconnect = messageconnect;