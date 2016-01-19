/**
 * Tutorial controller
 * @type {*|exports|module.exports}
 */
var express = require('express');
var rooms = require('../models/rooms');

var roomMap = rooms.getRoomMap();

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
	var room = new rooms.Room();
	roomMap.addRoom(1, room);
	res.json({successful:true, at:'room creation', rooms:roomMap.getMap()});
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
	if (roomMap.getMap()[roomId]){
		return res.json({successful:true, at:'getting room parameters', rooms:roomMap.getMap()});
	} else {
		return res.json({successful:false, at:'getting room parameters', message:'Room has not been created yet'})
	}
}

module.exports.get = get;
module.exports.createRoom = createRoom;
module.exports.roomParams = roomParams;