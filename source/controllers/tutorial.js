/**
 * Tutorial controller
 * @type {*|exports|module.exports}
 */
var express = require('express');
var Rooms = require('../models/rooms');
var Tutorial = require('../models/tutorial');
var lobby = Rooms.getLobby();

/**
 * Default get method
 * @param req
 * @param res
 * @param next
 */
var get = function(req, res, next){
	res.render(
		'tutorial',{
			roomId:req.params.id,
			ip: req.app.get("server-ip"),
			port: req.app.get("server-port")
		});
};

/**
 * create room RESTFUL API in post method
 * @param req
 * @param res
 * @param next
 */
var createRoom = function(req, res, next){
	var userID = req.body.auth.decoded.id;
	var tutorialRoomID = req.body.roomID;
	if (hasPerssionToCreateTutorial(userID, tutorialRoomID)) {
		if (!roomExists(tutorialRoomID)) {
			var room = new Rooms.Room();
			lobby.addRoom(tutorialRoomID, room);
			res.json({success:true, at:'room creation', roomID:tutorialRoomID});
		} else {
			res.json({success:false, at:'room creation', message:'Room already exists'});
		}
	} else {
		res.json({success:false, at:'room create', message: 'Permission Denied, you have no permission to create room'});
	}
};

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
		return res.json({success:true, at:'getting room parameters', lobby:lobby});
	} else {
		return res.json({success:false, at:'getting room parameters', message:'Room has not been created yet'})
	}
};

/**
 * =============== Helper Function ===============
 * ===============================================
 */

/**
 * Check if the user is the tutor of the room
 * */
function hasPerssionToCreateTutorial(userID, tutorialRoomID) {
	return Tutorial.findTutorialTutorID(tutorialRoomID).then(function (result) {
		return userID === result.userId;
	});
}

/**
 * Check if the room exists
 * */
function roomExists(tutorialRoomID) {
	return false;
}

module.exports.get = get;
module.exports.createRoom = createRoom;
module.exports.roomParams = roomParams;