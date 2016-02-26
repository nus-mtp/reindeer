/**
 * Room I/O is a socket wrapper which implements the basic functions of io part
 * @type {*|exports|module.exports}
 */
var express = require('express');
var io = require('socket.io')();
var rooms = require ('./models/rooms');
var app = require('../app');
var auth = require('./auth');

var lobby = rooms.getLobby();
var hashOfUserObjects = {};

var listen = function (server) {
	io.listen(server);
	console.log(app.locals);
	console.log('Server Started and Socket listened on ' + app.get('server-port'));
}

var roomio = io.of('/room');

roomio.on('connection', function (socket) {

	var clientId;
	var clientName;
	auth.verify(socket.handshake.token, function(err, decoded){
		if(err){
			console.log(err);
		} else{
			clientId = decoded.id;
			clientName = decoded.name;
		}
	});

	console.log('a user: ' + clientId + ' connected');
	console.log(socket.request.headers);


	hashOfUserObjects[clientId] = [];
	var socketClient = new rooms.SocketClient(clientId, socket);
	socketClient.joinRoom('0dab2c05-af24-46f3-80b0-41e4dd3d64bf');
	socketClient.groupBroadcast('message', {});


	/**
	 * Message IO Handler
	 * */
	socketClient.on('msgToGroup', msgToGroup(clientId, clientName));

	socketClient.on('msgToRoom', msgToRoom(clientId, clientName));

	socketClient.on('msgToUser', msgToUser(clientId, clientName));

	/**
	 * Canvas IO Handler
	 * */
	roomio.emit('canvasState', getAllCanvasObjects());

	socketClient.on('canvasAction', canvasAction);

	socketClient.on('canvasUndo', canvasUndo);

	socketClient.on('canvasClear', canvasClear);

	/*
	* WebRTC IO Handler
	* */
	socketClient.on('Emit Message', onSetupMessage(socketClient));

	/*
	* User Status Handler
	* */
	socketClient.on('New User', onNewUser(socketClient, socketClient.socketID));

    socketClient.on('disconnect', onDisconnection(socketClient));

	socketClient.on('joinRoom', joinRoom(clientId));

	socketClient.on('disconnect', leaveRoom(clientId));
	// -------- End of Web RTC IO -----------//
});

/**
 * ================ User Status IO =================
 * =================================================
 * */
function joinRoom(clientId){
	return function(msg){
		var roomId = msg.body.roomId;
		lobby.getUser(clientId).joinRoom(roomId);
		lobby.getUser(clientId).roomBroadcast('joinRoom', clientId);
	}
}


function leaveRoom(clientId){
	return function(){
		lobby.getUser(clientId).leaveRoom();
		lobby.getUser(clientId).roomBroadcast('leaveRoom', clientId);
	}
}


function onNewUser(socketClient, clientId) {
	return function(message) {
		console.log('===================================== Got New User:', message);	        // for a real app, would be room only (not broadcast)

		addNewUserToList(clientId);
		responseIDToClient(socketClient, clientId);
		responseExistingUserToClient(socketClient);
		broadCastID(socketClient, clientId);
	}
}

function broadCastID(socketClient, ID) {
	socketClient.roomBroadcast('New Joined', {'userID':ID});
}

function onDisconnection(socketClient) {
	return function() {
		console.log('Disconnection: ', socketClient.userID);

		// Set disconnect value
		socketClient.setDisconnect();

		// Notify client side WebRTC on user leave
		socketClient.notifyGroupUsersOnUserLeave(socketClient.userID);
	}
}

/**
 * ================== WebRTC IO ===================
 * =================================================
 * */
var userIDList = [];
function addNewUserToList(curID) {
	userIDList.push(curID);
}

function responseIDToClient(socketClient, ID) {
	socketClient.emit('Assigned ID', {'assignedID': ID});
}

// Repond with all existing connected user in current group except myself
function responseExistingUserToClient(socketClient) {
	var currentGroupUserList = socketClient.getCurrentGroupUserList();
	var groupUserIDList = [];
	for (var index in currentGroupUserList) {
		if (currentGroupUserList[index].socketID != socketClient.socketID) {
			groupUserIDList.push(currentGroupUserList[index].socketID);
		}
	}
	socketClient.emit('Existing UserList', {'userIDList': groupUserIDList});
}

function onSetupMessage(socketClient) {
	return function(message) {
		console.log('!!!!!!! Set Up MESSAGE');
		socketClient.roomBroadcast('Setup Message', message);
	}
}

/**
 * ================== Message IO ===================
 * =================================================
 * */
var msgToGroup = function (clientId, clientName) {
	return function(msg) {
		console.log(msg);
		var user = lobby.getUser(clientId);
		if(user == null){
			console.log('no such user');
		}else{
			lobby.getUser(clientId).groupBroadcast('msgToGroup', clientName + msg);
		}
	}
};

var msgToRoom = function (clientId, clientName) {
	return function(msg) {
		console.log(msg);
		var user = lobby.getUser(clientId);
		if(user == null){
			console.log('no such user');
		}else{
			lobby.getUser(clientId).roomBroadcast('msgToRoom', clientName + msg);
		}
	};
};

var msgToUser = function (clientId, clientName) {
	return function(msg) {
		console.log(msg);
		var receiverId = getReceiverId(msg);
		var user = lobby.getUser(clientId);
		if(user == null){
			console.log('no such user');
			this.emit('systemMsg', 'no such user');
		}else{
			lobby.getUser(clientId).personalMessage('msgToUser', clientName + msg, receiverId);
		}
	}
};

var getReceiverId = function (msg) {
	return msg.receiverId;
}

/**
 * =================== Canvas IO ===================
 * =================================================
 * */
var canvasAction = function (action) {
	var clientId = socket.id;
	console.log(clientId);
	hashOfUserObjects[clientId].push(action);

	roomio.emit('canvasState', getAllCanvasObjects());

	// console.log(redisClient.lpush('canvasAction', action));

	// canvasio.emit('canvasAction', action);
	console.log(hashOfUserObjects);
};

var canvasUndo = function () {
	var clientId = socket.id;
	hashOfUserObjects[clientId].pop();
	roomio.emit('canvasState', getAllCanvasObjects());
};

var canvasClear = function(){
	clearAllCanvasObjects();
	roomio.emit('canvasState', getAllCanvasObjects());
};

var getAllCanvasObjects = function () {
	var currentCavansObjects = [];
	for (var userObjectsKey in hashOfUserObjects) {
		currentCavansObjects = currentCavansObjects.concat(hashOfUserObjects[userObjectsKey]);
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