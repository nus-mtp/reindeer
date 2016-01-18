/**
 * This module contains the basic function of managing & storing room/group information
 * @type {*|exports|module.exports}
 */
var express = require ('express');

/**
 * RoomMap contruct an object that stores all the rooms into a hash map
 * @constructor
 */
function RoomMap(){
	this.count = 0;
	this.rooms = {};
}

RoomMap.prototype.size = function(){
	return this.count;
}

RoomMap.prototype.addGroupMap = function(roomId, groupMap){
	if (groupMap instanceof GroupMap){
		this.rooms[roomId] = groupMap;
		this.count++;
		return true;
	} else return false;
}

RoomMap.prototype.removeGroupMap = function(roomId){
	if (this.rooms[roomId]){
		delete this.rooms[roomId];
		this.count--;
		return true;
	} else return false;
}

RoomMap.prototype.getRoomMap = function(){
	return this.rooms;
}

/**
 * GroupMap construct an object that stores all the room into a hash map
 * @constructor
 */
function GroupMap () {
	var defaultSocketMap = new SocketMap ('default');
	this.count = 0;
	this.groups = {};
	this.groups[defaultSocketMap.name] = defaultSocketMap;
}

/**
 * Returns size of current GroupMap
 * @returns {number}
 */
GroupMap.prototype.size = function(){
	return this.count;
}

/**
 * Add sockets(one group of socket clients) into current groups
 * @param socketMap
 * @returns {boolean}
 */
GroupMap.prototype.addSocketMap = function (socketMap) {
	if (socketMap instanceof SocketMap) {
		this.groups[socketMap.name] = socketMap;
		this.count++;
		return true;
	} else return false;
}


/**
 * Remove sockets(one group of socket clients) according to its name
 * @param name
 * @returns {boolean}
 */
GroupMap.prototype.removeSocketMap = function(name){
	if (this.groups[name]){
		delete this.groups[name];
		this.count--;
		return true;
	} else return false;
}

/**
 * Retrieve the Group Map
 * @returns {{}|*}
 */
GroupMap.prototype.getGroupMap = function () {
	return this.groups;
}


/**
 * SocketMap stores socket clients into a hash map
 * @param name
 * @constructor
 */
function SocketMap (name) {
	this.name = name;
	this.count = 0;
	this.sockets = {};
}

/**
 * Return size of current SocketMap
 * @returns {number}
 */
SocketMap.prototype.size = function(){
	return this.count;
}

/**
 * Add user socket client into SocketMap
 * @param userId
 * @param socket
 */
SocketMap.prototype.addSocket = function (userId, socket) {
	this.sockets[userId] = socket;
	this.count++;
}

/**
 * Remove user socket client from SocketMap according to the input user id
 * @param userId
 */
SocketMap.prototype.removeSocket = function(userId){
	if (this.sockets[userId]){
		delete this.sockets[userId];
		this.count--;
	}
}

SocketMap.prototype.getSocketMap = function () {
	return this.sockets;
}

module.exports.createRoomMap = RoomMap;
module.exports.createGroupMap = GroupMap;
module.exports.createSocketMap = SocketMap;