var express = require('express');
var io = require('socket.io')();
// var redis = require('redis');
var credentials;
var hashOfUserObjects = {};
// On localhost just hardcode the connection details
credentials = {
	"host": "127.0.0.1",
	"port": 6379
}

// Connect to Redis
// var redisClient = redis.createClient(credentials.port, credentials.host);
// if('password' in credentials) {
//     redisClient.auth(credentials.password);
// }

var messageio = io.of('/messagetest');
var canvaslist = {};

var listen = function (app) {
	io.listen(app);
	console.log('socket listen on ' + app.address().port);
}

var canvasconnect = function (url) {
	var canvasio;
	//canvaslist.push(url);
	//console.log(url);
	canvasio = io.of(url);
	canvasio.on('connection', function (socket) {
		console.log('a user: ' + socket.id + 'connected to ' + url);
		console.log(socket.request.headers);

		// redisClient.lindex('canvasState', 0, function(err, result) {
		//     if (err) {

		//     } else {
		//         canvasio.emit('canvasState', result);
		//     }
		// });
		var clientId = socket.id;
		hashOfUserObjects[clientId] = [];

		canvasio.emit('canvasState', getAllCanvasObjects());

		// socket.on('canvasState', function (canvas) {
		//     // console.log(redisClient.lpush('canvasState', canvas));

		//     canvasio.emit('canvasState', canvas);
		// });

		socket.on('canvasAction', function (action) {
			var clientId = socket.id;
			console.log(clientId);
			hashOfUserObjects[clientId].push(action);

			canvasio.emit('canvasState', getAllCanvasObjects());

			// console.log(redisClient.lpush('canvasAction', action));

			// canvasio.emit('canvasAction', action);
			// console.log(hashOfUserObjects);
		});

		socket.on('canvasUndo', function () {
			var clientId = socket.id;
			hashOfUserObjects[clientId].pop();
			canvasio.emit('canvasState', getAllCanvasObjects());
		});
		
		socket.on('canvasClear', function(){
			hashOfUserObjects = {};
			canvasio.emit('canvasState', getAllCanvasObjects());
		});
	});

}

var getAllCanvasObjects = function () {
	var currentCavansObjects = [];
	for (var userObjectsKey in hashOfUserObjects) {
		currentCavansObjects = currentCavansObjects.concat(hashOfUserObjects[userObjectsKey]);
		// console.log(hashOfUserObjects[userObjectsKey]);
	}
	return currentCavansObjects;
}

var messageconnect = function (url) {
	var messageio;
	messageio = io.of(url);
}

messageio.on('connection', function (socket) {
	console.log('a user connected to message');
	socket.emit('news', {
		hello: 'Welcome' + 'Session ' + socket.id
	});

	socket.on('message', function (msg) {
		console.log(msg);
		messageio.emit('message', msg);
	});
});


//module.exports = io;
module.exports.listen = listen;
module.exports.canvasconnect = canvasconnect;
module.exports.messageconnect = messageconnect;