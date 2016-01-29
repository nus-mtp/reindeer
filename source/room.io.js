/**
 * Room I/O is a socket wrapper which implements the basic functions of io part
 * @type {*|exports|module.exports}
 */
var express = require('express');
var io = require('socket.io')();
var rooms = require ('./models/rooms');

var lobby = rooms.getLobby();
var hashOfUserObjects = {};

var listen = function (app) {
	io.listen(app);
	console.log('socket listen on ' + app.address().port);
}

var roomio = io.of('/room');

roomio.on('connection', function (socket) {
	console.log('a user: ' + socket.id + ' connected');
	console.log(socket.request.headers);

	// redisClient.lindex('canvasState', 0, function(err, result) {
	//     if (err) {

	//     } else {
	//         canvasio.emit('canvasState', result);
	//     }
	// });
	var clientId = socket.id;
	hashOfUserObjects[clientId] = [];
	var socketClient = new rooms.SocketClient(clientId, socket);
	socketClient.joinRoom('1');
	socketClient.groupBroadcast('message', {});

	socketClient.on('message', function (msg) {
		console.log(msg);
		roomio.emit('message', msg);
	});

	roomio.emit('canvasState', getAllCanvasObjects());

	// socket.on('canvasState', function (canvas) {
	//     // console.log(redisClient.lpush('canvasState', canvas));

	//     canvasio.emit('canvasState', canvas);
	// });

	socketClient.on('canvasAction', function (action) {
		var clientId = socket.id;
		console.log(clientId);
		hashOfUserObjects[clientId].push(action);

		roomio.emit('canvasState', getAllCanvasObjects());

		// console.log(redisClient.lpush('canvasAction', action));

		// canvasio.emit('canvasAction', action);
		console.log(hashOfUserObjects);
	});

	socketClient.on('canvasUndo', function () {
		var clientId = socket.id;
		hashOfUserObjects[clientId].pop();
		roomio.emit('canvasState', getAllCanvasObjects());
	});

	socketClient.on('canvasClear', function(){
		clearAllCanvasObjects();
		roomio.emit('canvasState', getAllCanvasObjects());
	});
});

var getAllCanvasObjects = function () {
	var currentCavansObjects = [];
	for (var userObjectsKey in hashOfUserObjects) {
		currentCavansObjects = currentCavansObjects.concat(hashOfUserObjects[userObjectsKey]);
		// console.log(hashOfUserObjects[userObjectsKey]);
	}
	return currentCavansObjects;
}

var clearAllCanvasObjects = function () {
	for (var userObjectsKey in hashOfUserObjects) {
		hashOfUserObjects[userObjectsKey] = [];
	}
}

module.exports.listen = listen;