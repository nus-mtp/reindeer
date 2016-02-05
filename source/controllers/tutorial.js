/**
 * Tutorial controller
 * @type {*|exports|module.exports}
 */
var express = require('express');
var rooms = require('../models/rooms');

var lobby = rooms.getLobby();

/**
 * Default get method
 * @param req
 * @param res
 * @param next
 */
var get = function(req, res, next){
	console.log(req.body.auth);
	res.render(
		'tutorial',{
			roomId:req.params.id,
			ip: req.app.get("server-ip"),
			port: req.app.get("server-port")
		});
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
	lobby.addRoom(1, room);
	res.json({successful:true, at:'room creation', lobby:lobby});
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
	if (lobby.getRoomsMap()[roomId]){
		return res.json({successful:true, at:'getting room parameters', lobby:lobby});
	} else {
		return res.json({successful:false, at:'getting room parameters', message:'Room has not been created yet'})
	}
}

module.exports.get = get;
module.exports.createRoom = createRoom;
module.exports.roomParams = roomParams;