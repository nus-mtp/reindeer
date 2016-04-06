var Rooms = require('../models/Rooms');

var handleGroupSocketEvents = function(socketClient){
	if (!socketClient instanceof Rooms.SocketClient){
		return;
	}
	else {
		socketClient.on('getMap', getMap(socketClient));
		socketClient.on('arrangeGroup', arrangeGroup(socketClient));
		socketClient.on('joinRoom', joinRoom(socketClient));
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

var joinRoom  = function(socketClient) {
	return function (msg) {
		if (socketClient.joinRoom (msg.roomID)){
			socketClient.roomBroadcast('joinRoom', {client: socketClient});
		} else {
			socketClient.emit('error', {message:'You have no permission to join this room'});
		}

	}
}

module.exports = handleGroupSocketEvents;