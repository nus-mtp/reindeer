/**
 * Room I/O is a socket wrapper which implements the basic functions of io part
 * @type {*|exports|module.exports}
 */
var express = require ('express');
var io = require ('socket.io') ();
var rooms = require ('./models/Rooms');
var app = require ('../app');
var auth = require ('./auth');
var socketRouter = require('./socketRouter');

var lobby = rooms.getLobby ();
var hashOfUserObjects = {};

var listen = function (server) {
	io.listen (server);
	console.log (app.locals);
	console.log ('Server Started and Socket listened on ' + app.get ('server-port'));
}



/**
 * Middleware to authenticate the incoming socket connection
 * @param socket
 * @param next
 */
var authenticateSocketConnection = function(socket, next) {
	// Retrieve handshake data from socket
	var handshakeData = socket.request;
	// Then extract client's JWT token
	var jwtToken = handshakeData._query.token;
	// Verify the JWT token
	auth.verify(jwtToken, function(err, decoded){
		if (err){
			// Authentication failed, we throw an error
			console.log(err);
			next(new Error('Not Authorized!'));
		} else {
			// Extract Client's Id and Name and append them to the socket object
			socket.id = decoded.id;
			socket.name = decoded.name;
			next ();
		}
	})
}

// We assign the above middleware
var roomio = io.of('/room').use(authenticateSocketConnection);

var close = function(){
	return io.httpServer.close();
}

roomio.on ('connection', function (socket) {
	// Now at this point, incoming client's connection has been authenticated
	var clientId = socket.id;
	var clientName = socket.name;

	console.log ('User: ' + clientName + ' has connected');
	console.log (socket.request.headers);

	var socketClient = new rooms.SocketClient (clientId, socket);

	socketClient.joinRoom ('testid');
	socketClient.groupBroadcast ('message', {});


	//console.log(socketClient.getCurrentGroup().presentation.getAllSlidesAsJSON());
	//console.log(socketClient.getCurrentGroup().presentation.currentSlide);
	//console.log(socketClient.getCurrentGroup().presentation.nextSlide());
	//console.log(socketClient.getCurrentGroup().presentation.currentSlide);

	socketRouter(clientId, clientName, socketClient, lobby);


	/**
	 * Message IO Handler
	 * */

	socketClient.on ('msgToGroup', function(msg){console.log(socketClient); socketClient.groupBroadcast ('msgToGroup', {clientName: clientName, msg: msg.msg });});

	socketClient.on ('msgToRoom', function(msg){console.log(socketClient); socketClient.roomBroadcast ('msgToRoom', {clientName: clientName, msg: msg.msg });});

	socketClient.on ('msgToUser', function(msg){console.log(socketClient); socketClient.personalMessage ('msgToUser', {clientName: clientName, msg: msg.msg, receiverId: msg.receiverId})});

	/**
	 * Group IO Handler
	 * */
	socketClient.on('getMap', function(){
		socketClient.emit('sendMap', {roomMap: socketClient.getRoom()});
	})

	socketClient.on('arrangeGroup', function(msg){
		var target = socketClient.getRoom.get('default').get(msg.targetId);
		target.joinGroup(socketClient.currentRoomID, msg.groupId);
		socketClient.roomBroadcast('arrangeGroup', msg);
	})

	/**
	 * Canvas IO Handler
	 * */
	roomio.emit ('canvasState', getAllCanvasObjects ());

	socketClient.on ('canvasAction', canvasAction);

	socketClient.on ('canvasUndo', canvasUndo);

	socketClient.on ('canvasClear', canvasClear);


	// emit slides filepath to client
	socketClient.emit("slidesPaths", socketClient.getCurrentGroup().presentation.getAllSlidesAsJSON());

	// emit current slide
	socketClient.emit("currentSlide", socketClient.getCurrentGroup().presentation.currentSlide);

	socketClient.on('nextSlide', function() {
		socketClient.getCurrentGroup().presentation.nextSlide();
		socketClient.roomBroadcast("currentSlide", socketClient.getCurrentGroup().presentation.currentSlide);
	});

	socketClient.on('prevSlide', function() {
		socketClient.getCurrentGroup().presentation.previousSlide();
		socketClient.roomBroadcast("currentSlide", socketClient.getCurrentGroup().presentation.currentSlide);
	});

	/*
	 * WebRTC IO Handler
	 * */
	socketClient.on ('Emit Message', onSetupMessage (socketClient));

	/*
	 * User Status Handler
	 * */
	socketClient.on ('New User', onNewUser (socketClient, socketClient.socketID));

	socketClient.on ('disconnect', onDisconnection (socketClient));

	socketClient.on ('joinRoom', joinRoom (socket));

	socketClient.on ('leaveRoom', leaveRoom (clientId));
	// -------- End of Web RTC IO -----------//
});

/**
 * ================ User Status IO =================
 * =================================================
 * */
function joinRoom (socket) {
	return function (msg) {
		var roomId = msg.roomId;
		var clientId = socket.id;
		lobby.getUser (clientId).joinRoom (roomId);
		lobby.getUser (clientId).roomBroadcast ('joinRoom', {client: socket});
	}
}


function leaveRoom (clientId) {
	return function () {
		lobby.getUser (clientId).leaveRoom ();
		lobby.getUser (clientId).roomBroadcast ('leaveRoom', {clientId: clientId});
	}
}


function onNewUser (socketClient, clientId) {
	return function (message) {
		console.log ('===================================== Got New User:', message);	        // for a real app, would be room only (not broadcast)

		addNewUserToList (clientId);
		responseIDToClient (socketClient, clientId);
		responseExistingUserToClient (socketClient);
		broadCastID (socketClient, clientId);
	}
}

function broadCastID (socketClient, ID) {
	socketClient.roomBroadcast ('New Joined', {'userID': ID});
}

function onDisconnection (socketClient) {
	return function () {
		console.log ('Disconnection: ', socketClient.userID);

		// Set disconnect value
		socketClient.setDisconnect ();

		// Notify client side WebRTC on user leave
		socketClient.notifyGroupUsersOnUserLeave (socketClient.userID);

		// Leave room
		socketClient.leaveRoom();
	}
}

/**
 * ================== WebRTC IO ===================
 * =================================================
 * */
var userIDList = [];
function addNewUserToList (curID) {
	userIDList.push (curID);
}

function responseIDToClient (socketClient, ID) {
	socketClient.emit ('Assigned ID', {'assignedID': ID});
}

// Repond with all existing connected user in current group except myself
function responseExistingUserToClient (socketClient) {
	var currentGroupUserList = socketClient.getCurrentGroupUserList ();
	var groupUserIDList = [];
	for (var index in currentGroupUserList) {
		if (currentGroupUserList[index].socketID != socketClient.socketID) {
			groupUserIDList.push (currentGroupUserList[index].socketID);
		}
	}
	socketClient.emit ('Existing UserList', {'userIDList': groupUserIDList});
}

function onSetupMessage (socketClient) {
	return function (message) {
		console.log ('!!!!!!! Set Up MESSAGE');
		socketClient.roomBroadcast ('Setup Message', message);
	}
}



/**
 * =================== Canvas IO ===================
 * =================================================
 * */
var canvasAction = function (action) {
	var clientId = socket.id;
	console.log (clientId);
	hashOfUserObjects[clientId].push (action);

	roomio.emit ('canvasState', getAllCanvasObjects ());

	// console.log(redisClient.lpush('canvasAction', action));

	// canvasio.emit('canvasAction', action);
	console.log (hashOfUserObjects);
};

var canvasUndo = function () {
	var clientId = socket.id;
	hashOfUserObjects[clientId].pop ();
	roomio.emit ('canvasState', getAllCanvasObjects ());
};

var canvasClear = function () {
	clearAllCanvasObjects ();
	roomio.emit ('canvasState', getAllCanvasObjects ());
};

var getAllCanvasObjects = function () {
	var currentCavansObjects = [];
	for (var userObjectsKey in hashOfUserObjects) {
		currentCavansObjects = currentCavansObjects.concat (hashOfUserObjects[userObjectsKey]);
		// console.log(hashOfUserObjects[userObjectsKey]);
	}
	return currentCavansObjects;
};

var clearAllCanvasObjects = function () {
	for (var userObjectsKey in hashOfUserObjects) {
		hashOfUserObjects[userObjectsKey] = [];
	}
};

module.exports.listen = listen;
module.exports.close = close;