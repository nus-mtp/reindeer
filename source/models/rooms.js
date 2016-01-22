/**
 * This module contains the basic function of managing & storing rooms, groups and socket clients information
 * @type {*|exports|module.exports}
 */
var express = require ('express');
var socket = require ('socket.io');
var roomMap = new RoomMap ();

var getRoomMap = function () {
	return roomMap;
}


/**
 * RoomMap contruct an object that stores all the rooms into a hash map
 * @constructor
 */
function RoomMap () {
	this.count = 0;
	this.rooms = {};
}

RoomMap.prototype.size = function () {
	return this.count;
}

RoomMap.prototype.addRoom = function (roomId, room) {
	if (room instanceof Room) {
		if (this.rooms[roomId]){
			return false;
		}
		this.rooms[roomId] = room;
		this.count++;
		return true;
	} else return false;
}

RoomMap.prototype.removeRoom = function (roomId) {
	if (this.rooms[roomId]) {
		delete this.rooms[roomId];
		this.count--;
		return true;
	} else return false;
}

RoomMap.prototype.get = function (roomId) {
	var room = this.rooms[roomId];
	if (room) {
		return room;
	} else return null;
}

RoomMap.prototype.getMap = function () {
	return this.rooms;
}


/**
 * Room construct an object that stores all the groups into a hash map
 * @constructor
 */
function Room () {
	var defaultGroup = new Group ('default');
	this.count = 1;
	this.groups = {};
	this.groups[defaultGroup.name] = defaultGroup;
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
		if (this.groups[group.name]){
			return false;
		}
		this.groups[group.name] = group;
		this.count++;
		return true;
	} else return false;
}


/**
 * Remove group according to its name
 * @param name
 * @returns {boolean}
 */
Room.prototype.removeGroup = function (name) {
	if (this.groups[name]) {
		delete this.groups[name];
		this.count--;
		return true;
	} else return false;
}

/**
 * Retrieve the group according to its name
 * @param name
 * @returns {*}
 */
Room.prototype.get = function (name) {
	var group = this.groups[name];
	if (group) {
		return group;
	} else return null;
}

/**
 * Retrieve the Room
 * @returns {{}|*}
 */
Room.prototype.getMap = function () {
	return this.groups;
}


/**
 * Group stores socket clients into a hash map
 * @param name
 * @constructor
 */
function Group (name) {
	this.name = name;
	this.count = 0;
	this.socketClients = {};
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
		if (this.socketClients[socketClient.userId]){
			return false;
		}
		this.socketClients[socketClient.userId] = socketClient;
		this.count++;
		return true;
	} else return false;
}


/**
 * Remove user socket client from Group according to the input user id
 * @param userId
 */
Group.prototype.removeClient = function (userId) {
	if (this.socketClients[userId]) {
		delete this.socketClients[userId];
		this.count--;
	}
}

/**
 * Retrieve socket client according to its user id
 * @param userId
 * @returns {*}
 */
Group.prototype.get = function (userId) {
	var socketClient = this.socketClients[userId];
	if (socketClient) {
		return socketClient;
	} else return null;
}

/**
 * Retrieve map of all socket clients
 * @returns {{}|*}
 */
Group.prototype.getMap = function () {
	return this.socketClients;
}

/**
 * Socket Client Wrapper for storing user ID and user socket
 * @param userId
 * @param socket
 * @constructor
 */
function SocketClient (userId, socket) {
	this.userId = userId;
	this.socket = socket;
	this.socketId = socket.id;
	this.header = socket.request.headers;
	this.currentgroup = null;
	this.currentroom = null;
	this.connected = true;
	var that = this;
	socket.on('disconnect', function(){
		that.connected = false;
	});
}

/**
 * Socket listener wrapper
 * @param evt
 * @param callback
 */
SocketClient.prototype.on = function (evt, callback){
	this.socket.on(evt, callback);
}

SocketClient.prototype.getRoom = function() {
	if (this.currentroom != null){
		return getRoomMap().get(this.currentroom);
	} else return null;
}

/**
 * Add Socket Client to a room by its room id
 * @param roomId
 */
SocketClient.prototype.joinRoom = function (roomId) {
	var defaultGroup = getRoomMap().get(roomId).get('default');
	defaultGroup.addClient(this);
	this.currentgroup = 'default';
	this.currentroom = roomId;
}

SocketClient.prototype.leaveRoom = function(){
	if (this.currentroom == null){
		return false;
	} else {
		var defaultGroup = getRoomMap().get(this.currentroom).get('default');
		if (this.currentgroup != 'default') {
			var currentGroup = getRoomMap().get(this.currentroom).get(this.currentgroup);
			currentGroup.removeClient(this.userId);
		}
		defaultGroup.removeClient(this.userId);
	}
}

/**
 * Socket Emit wrapper
 * @param key
 * @param value
 */
SocketClient.prototype.emit = function(key, value){
	this.socket.emit(key, value);
}

/**
 * Room Broadcaster
 * @param key
 * @param value
 */
SocketClient.prototype.roomBroadcast = function(key, value){
	var clients = getRoomMap().get(this.currentroom).get('default').getMap();
	//null check not implemented!
	for (var socketId in clients){
		if (socketId == this.socketId){
			continue;
		}
		clients[socketId].emit(key, value);
	}
}

/**
 * Group Broadcaster
 * @param name
 * @param key
 * @param value
 */
SocketClient.prototype.groupBroadcast = function(key, value){
	var clients = getRoomMap().get(this.currentroom).get(this.currentgroup).getMap();
	//null check not implemented!
	for (var socketId in clients){
		if (socketId == this.socketId){
			continue;
		}
		clients[socketId].emit(key, value);
	}
}

/**
 * Stringify Socket Client JSON object
 * @returns {SocketClient}
 */
SocketClient.prototype.toJSON = function () {
	var tojson = {};
	tojson.userId = this.userId;
	tojson.socketId = this.socketId;
	tojson.currentgroup = this.currentgroup;
	tojson.currentroom = this.currentroom;
	tojson.connected = this.connected;
	return tojson;
}

module.exports.getRoomMap = getRoomMap;
module.exports.SocketClient = SocketClient;
module.exports.RoomMap = RoomMap;
module.exports.Room = Room;
module.exports.Group = Group;