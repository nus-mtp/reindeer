/**
 * Tutorial controller
 * @type {*|exports|module.exports}
 */
var express = require('express');
var room = require('../models/room');

var roomMap = new room.createRoomMap();

var getRoomMap = function(){
	return roomMap;
}

/**
 * Default get method
 * @param req
 * @param res
 * @param next
 */
var get = function(req, res, next){
	res.render('tutorial',{roomId:req.params.id});
}

/**
 * create room RESTFUL API in post method
 * @param req
 * @param res
 * @param next
 */
var createRoom = function(req, res, next){
	//not yet implemented!
	var groupMap = new room.createGroupMap();
	var socketMap = new room.createSocketMap('test');
	console.log(groupMap.size());
	groupMap.addSocketMap(socketMap);
	console.log(groupMap.size());
	groupMap.removeSocketMap('test');
	console.log(groupMap.size());
	roomMap.addGroupMap(1, groupMap);
	console.log(roomMap);
	res.json({successful:true, at:'room creation', rooms:roomMap.getRoomMap()});
}

/**
 * get room parameters RESTFUL API in post method
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
var roomParams = function (req, res, next){
	//not yet implemented!
	var roomId = req.body.roomId
	if (roomMap.get(roomId)){
		return res.json({successful:true, at:'getting room parameters', rooms:roomMap.getRoomMap()});
	} else {
		return res.json({successful:false, at:'getting room parameters', message:'Room has not been created yet'})
	}

}

module.exports.getRoomMap = getRoomMap;

module.exports.get = get;
module.exports.createRoom = createRoom;
module.exports.roomParams = roomParams;