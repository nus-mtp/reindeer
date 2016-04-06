/**
 * Room I/O is a socket wrapper which implements the basic functions of io part
 * @type {*|exports|module.exports}
 */
var express = require ('express');
var io = require ('socket.io') ();
var rooms = require ('./models/Rooms');
var app = require ('../app');
var auth = require ('./auth');
var handleSlideSocketEvents = require('./SocketEventsHandlers/handleSlideSocketEvents');
var handleCanvasSocketEvents = require('./SocketEventsHandlers/handleCanvasSocketEvents');
var handleMessageSocketEvents = require('./SocketEventsHandlers/handleMessageSocketEvents');
var handleGroupSocketEvents = require('./SocketEventsHandlers/handleGroupSocketEvents');
var handleVoiceSocketEvents = require('./SocketEventsHandlers/handleVoiceSocketEvents');


var lobby = rooms.getLobby ();

var listen = function (server) {
	io.listen (server);
	//console.log (app.locals);
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

	var socketClient = new rooms.SocketClient (clientName, clientId, socket);

	socketClient.emit('color', socketClient.color);

	handleGroupSocketEvents(socketClient);
	handleSlideSocketEvents(socketClient);
	handleCanvasSocketEvents(socketClient);
	handleMessageSocketEvents(socketClient);
	handleVoiceSocketEvents(socketClient);

	/**
	 * Group IO Handler
	 * */


	/*
	 * User Status Handler
	 * */
	socketClient.on ('New User', onNewUser (socketClient, socketClient.socketID));

	socketClient.on ('disconnect', onDisconnection (socketClient));

	//socketClient.on ('joinRoom', joinRoom (socketClient));

	socketClient.on ('leaveRoom', leaveRoom (clientId));
	// -------- End of Web RTC IO -----------//
});

/**
 * ================ User Status IO =================
 * =================================================
 * */
function joinRoom (socketClient) {
	return function () {
		var roomId = socketClient.currentRoomID;
		socketClient.joinRoom (roomId);
		socketClient.roomBroadcast('joinRoom', {client: socketClient});
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


module.exports.listen = listen;
module.exports.close = close;