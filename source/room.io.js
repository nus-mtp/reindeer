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

	handleGroupSocketEvents(socketClient, function(){
		handleSlideSocketEvents(socketClient);
		handleCanvasSocketEvents(socketClient);
		handleMessageSocketEvents(socketClient);
		handleVoiceSocketEvents(socketClient);
	});
});

module.exports.listen = listen;
module.exports.close = close;