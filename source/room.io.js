/**
 * Room I/O is a socket wrapper which implements the basic functions of io part
 * @type {*|exports|module.exports}
 */
var express = require ('express');
var io = require ('socket.io') ();
var rooms = require ('./models/rooms');
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


roomio.on ('connection', function (socket) {
	// Now at this point, incoming client's connection has been authenticated
	var clientId = socket.id;
	var clientName = socket.name;

	console.log ('User: ' + clientName + ' has connected');
	console.log (socket.request.headers);

	var socketClient = new rooms.SocketClient (clientId, socket);

	socketClient.joinRoom ('testid');
	socketClient.groupBroadcast ('message', {});

	socketRouter(clientId, clientName, socketClient, lobby);

	/*
	 * WebRTC IO Handler
	 * */
	socketClient.on ('Emit Message', onSetupMessage (socketClient));

	/*
	 * User Status Handler
	 * */
	socketClient.on ('New User', onNewUser (socketClient, socketClient.socketID));

	socketClient.on ('disconnect', onDisconnection (socketClient));

	socketClient.on ('joinRoom', joinRoom (clientId));

	socketClient.on ('leaveRoom', leaveRoom (clientId));
	// -------- End of Web RTC IO -----------//
});

/**
 * ================ User Status IO =================
 * =================================================
 * */
function joinRoom (clientId) {
	return function (msg) {
		var roomId = msg.roomId;
		lobby.getUser (clientId).joinRoom (roomId);
		lobby.getUser (clientId).roomBroadcast ('joinRoom', clientId);
	}
}


function leaveRoom (clientId) {
	return function () {
		lobby.getUser (clientId).leaveRoom ();
		lobby.getUser (clientId).roomBroadcast ('leaveRoom', clientId);
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