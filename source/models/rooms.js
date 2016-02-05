/**
 * This module contains the basic function of managing & storing rooms, groups and socket clients information
 * @type {*|exports|module.exports}
 */
var express = require('express');
var socket = require('socket.io');
var lobby = new Lobby();

var getLobby = function () {
	return lobby;
}


/**
 * Lobby contruct an object that stores all the rooms into a hash map
 * @constructor
 */
function Lobby() {
	this.count = 0;
	this.rooms = {};
}

Lobby.prototype.size = function () {
	return this.count;
}

Lobby.prototype.addRoom = function (roomId, room) {
	if (room instanceof Room) {
		if (this.rooms[roomId]) {
			return false;
		}
		this.rooms[roomId] = room;
		this.count++;
		return true;
	} else return false;
}

Lobby.prototype.removeRoom = function (roomId) {
	if (this.rooms[roomId]) {
		delete this.rooms[roomId];
		this.count--;
		return true;
	} else return false;
}

Lobby.prototype.removeAllRooms = function(){
	this.rooms = {};
	this.count = 0;
	return true;
}

Lobby.prototype.get = function (roomId) {
	var room = this.rooms[roomId];
	if (room) {
		return room;
	} else return null;
}

Lobby.prototype.getRoomsMap = function () {
	return this.rooms;
}


/**
 * Room construct an object that stores all the groups into a hash map
 * @constructor
 */
function Room() {
	var defaultGroup = new Group('default');
	this.count = 1;
	this.groups = {};
	this.groups[defaultGroup.groupId] = defaultGroup;
}

/**
 * Returns size of current Room
 * @returns {number}
 */
Room.prototype.size = function () {
	return this.count;
}

/**
 * Add group into current room
 * @param group
 * @returns {boolean}
 */
Room.prototype.addGroup = function (group) {
	if (group instanceof Group) {
		if (this.groups[group.groupId]) {
			return false;
		}
		this.groups[group.groupId] = group;
		this.count++;
		return true;
	} else return false;
}


/**
 * Remove group according to its groupId
 * @param groupId
 * @returns {boolean}
 */
Room.prototype.removeGroup = function (groupId) {
	if (this.groups[groupId]) {
		delete this.groups[groupId];
		this.count--;
		return true;
	} else return false;
}

/**
 * Retrieve the group according to its groupId
 * @param groupId
 * @returns {*}
 */
Room.prototype.get = function (groupId) {
	var group = this.groups[groupId];
	if (group) {
		return group;
	} else return null;
}

/**
 * Retrieve the Room
 * @returns {{}|*}
 */
Room.prototype.getGroupsMap = function () {
	return this.groups;
}


/**
 * Group stores socket clients into a hash map
 * @param groupId
 * @constructor
 */
function Group(groupId) {
	this.groupId = groupId;
	this.count = 0;
	this.socketClientMap = {};
}

/**
 * Return size of current Group
 * @returns {number}
 */
Group.prototype.size = function () {
	return this.count;
}

/**
 * Add user socket client into Group
 * @param socketClient
 * @returns {boolean}
 */
Group.prototype.addClient = function (socketClient) {
	if (socketClient instanceof SocketClient) {
		if (this.socketClientMap[socketClient.userID]) {
			return false;
		}
		this.socketClientMap[socketClient.userID] = socketClient;
		this.count++;
		return true;
	} else return false;
}


/**
 * Remove user socket client from Group according to the input user id
 * @param userId
 */
Group.prototype.removeClient = function (userId) {
	if (this.socketClientMap[userId]) {
		delete this.socketClientMap[userId];
		this.count--;
	}
}

/**
 * Retrieve socket client according to its user id
 * @param userId
 * @returns {*}
 */
Group.prototype.get = function (userId) {
	var socketClient = this.socketClientMap[userId];
	if (socketClient) {
		return socketClient;
	} else return null;
}

/**
 * Retrieve map of all socket clients
 * @returns {{}|*}
 */
Group.prototype.getClientsMap = function () {
	return this.socketClientMap;
}

/*
* Retrieve the list of connected clients
* @returns [{}|*]
* */
Group.prototype.getConnectedClientsList = function () {
	var dataArray = [];
	for(var element in this.socketClientMap) {
        if (this.socketClientMap[element].connected) {
            dataArray.push(this.socketClientMap[element]);
        }
	}
	return dataArray;
}

/**
 * Socket Client Wrapper for storing user ID and user socket
 * @param userId
 * @param socket
 * @constructor
 */
function SocketClient(userId, socket) {
	this.userID = userId;
	this.socket = socket;
	this.socketID = socket.id;
	this.header = socket.request.headers;
	this.currentGroupID = null;
	this.currentRoomID = null;
	this.connected = true;
}


/*
* Set value of this.connected to false
* */
SocketClient.prototype.setDisconnect = function() {
    this.connected = false;
}

/**
 * Notify All user in current room on user leave
 */
SocketClient.prototype.notifyGroupUsersOnUserLeave = function() {
    this.roomBroadcast('User Leave',  {'userID': this.socketID});
}

/**
 * Socket listener wrapper
 * @param evt
 * @param callback
 */
SocketClient.prototype.on = function (evt, callback) {
	this.socket.on(evt, callback);
}

SocketClient.prototype.getRoom = function () {
	if (this.currentRoomID != null) {
		return getLobby().get(this.currentRoomID);
	} else return null;
}

/**
 * Add Socket Client to a room by its room id
 * @param roomId
 */
SocketClient.prototype.joinRoom = function (roomId) {
	var defaultGroup = getLobby().get(roomId).get('default');
	defaultGroup.addClient(this);
	this.currentGroupID = 'default';
	this.currentRoomID = roomId;
}

SocketClient.prototype.inRoom = function (roomId) {
	return (roomId === this.currentRoomID);
}

SocketClient.prototype.leaveRoom = function () {
	if (this.currentRoomID == null) {
		return false;
	} else {
		var currentGroup = getLobby().get(this.currentRoomID).get(this.currentGroupID);
		currentGroup.removeClient(this.userID);
		this.currentGroupID = null;
		this.currentRoomID = null;
	}
}

SocketClient.prototype.joinGroup = function (roomId, groupId) {
	if (this.inRoom(roomId)) {
		var group = getLobby().get(roomId).get(groupId);
		if (group && (group instanceof Group)) {
			group.addClient(this);
			this.currentGroupID = groupId;
		}
	}
}

SocketClient.prototype.inGroup = function (roomId, groupId) {
	return (this.inRoom(roomId) && groupId === this.currentGroupID);
}

SocketClient.prototype.leaveGroup = function (roomId, groupId) {
	if (this.inGroup(roomId, groupId) && (this.currentGroupID != 'default')) {
		var group = getLobby().get(roomId).get(groupId);
		if (group && (group instanceof Group)) {
			group.removeClient(this.userID);
			this.currentGroupID = 'default';
		}
	}
}

SocketClient.prototype.getCurrentGroup = function() {
    return getLobby().get(this.currentRoomID).get(this.currentGroupID);
}

SocketClient.prototype.getCurrentGroupUserList = function () {
	var curGroup = this.getCurrentGroup();
	return curGroup.getConnectedClientsList();
}

/**
 * Socket Emit wrapper
 * @param key
 * @param value
 */
SocketClient.prototype.emit = function (key, value) {
	this.socket.emit(key, value);
}

/**
 * Room Broadcaster
 * @param key
 * @param value
 */
SocketClient.prototype.roomBroadcast = function (key, value) {
	var clients = getLobby().get(this.currentRoomID).get('default').getClientsMap();
	//null check not implemented!
	for (var client in clients) {
		if (clients[client] == this) {
			continue;
		}
		clients[client].emit(key, value);
	}
}

/**
 * Group Broadcaster
 * @param name
 * @param key
 * @param value
 */
SocketClient.prototype.groupBroadcast = function (key, value) {
	var clients = getLobby().get(this.currentRoomID).get(this.currentGroupID).getClientsMap();
	//null check not implemented!
	for (var client in clients) {
		if (clients[client] == this) {
			continue;
		}
		clients[client].emit(key, value);
	}
}

/**
 * Stringify Socket Client JSON object
 * @returns {SocketClient}
 */
SocketClient.prototype.toJSON = function () {
	var tojson = {};
	tojson.userID = this.userID;
	tojson.socketID = this.socketID;
	tojson.currentGroupID = this.currentGroupID;
	tojson.currentRoomID = this.currentRoomID;
	tojson.connected = this.connected;
	return tojson;
}

module.exports.getLobby = getLobby;
module.exports.SocketClient = SocketClient;
module.exports.Lobby = Lobby;
module.exports.Room = Room;
module.exports.Group = Group;