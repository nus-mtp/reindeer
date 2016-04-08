var Rooms = require('../models/Rooms');

var handleGroupSocketEvents = function(socketClient, handleNext){
	if (!socketClient instanceof Rooms.SocketClient){
		return;
	}
	else {
		socketClient.on('getMap', getMap(socketClient));
		socketClient.on('arrangeGroup', arrangeGroup(socketClient));
		socketClient.on('joinRoom', joinRoom(socketClient, handleNext));
		socketClient.on('disconnect', leaveRoom(socketClient));
		socketClient.on('leaveRoom', leaveRoom(socketClient));
	}
}

var getMap = function(socketClient){
	return function(){
		socketClient.emit('sendMap', {roomMap: socketClient.getRoom()});
	}
}

var arrangeGroup = function(socketClient){
	return function(msg){
		var target = socketClient.getRoom.get('default').get(msg.targetId);
		target.joinGroup(socketClient.currentRoomID, msg.groupId);
		socketClient.roomBroadcast('arrangeGroup', msg);
	}
}

var getAllConnectedClientsInGroup = function(socketClient) {
	return socketClient.getCurrentGroupUserList();
}

var joinRoom  = function(socketClient, handleNext) {
	return function (msg) {
		if (socketClient.joinRoom (msg.roomID)){
			//socketClient.roomBroadcast('joinRoom', {client: socketClient});
			socketClient.roomBroadcast('sendMap', {roomMap: socketClient.getRoom()});
			//socketClient.emit('color', socketClient.color);
			socketClient.emit('joined');
			//socketClient.roomBroadcast('group:connected_clients', getAllConnectedClientsInGroup(socketClient));
			handleNext();
		} else {
			socketClient.emit('error', {message:'You have no permission to join this room'});
		}
	}
}

/*
var disconnect = function(socketClient){
	return function(){
		var group = socketClient.getCurrentGroup();
		socketClient.leaveGroup();
		socketClient.roomBroadcast('group:user_leave', socketClient);
		var connectedClients = group.getConnectedClientsList();
		socketClient.roomBroadcast('group:connected_clients', connectedClients);
	}
}
*/

var leaveRoom = function(socketClient){
	return function(){
		//console.log(socketClient.userID + ' disconnected');
		//socketClient.roomBroadcast('leaveRoom', {clientId:socketClient.userID});
		var roomId = socketClient.currentRoomID;
		socketClient.leaveRoom();
		var room = Rooms.getLobby().get(roomId);
		room.emit('sendMap', {roomMap: room});
	}
}

module.exports = handleGroupSocketEvents;