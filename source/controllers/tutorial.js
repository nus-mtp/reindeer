/**
 * Tutorial controller
 * @type {*|exports|module.exports}
 */
var express = require('express');
var Rooms = require('../models/rooms');
var Tutorial = require('../models/tutorial');
var SessionManager = require('./tutorialSessionManager');
var lobby = Rooms.getLobby();
var app = require('../../app');

var protocol = 'https';
var usehttps = app.get('use-https');
if (!usehttps) {
	protocol = 'http';
}

/**
 * Default get method
 * @param req
 * @param res
 * @param next
 */
var get = function(req, res, next){
	var userID = req.body.auth.decoded.id;
	var tutorialRoomID = req.params.id;

	if (SessionManager.hasPermissionToJoinTutorial(userID, tutorialRoomID)) {
		if (SessionManager.roomExists(tutorialRoomID)) {
			res.render(
				'tutorial',{
					roomId: req.params.id,
					roomioURL: protocol + '://' + req.app.get('server-ip') + ':' + req.app.get('server-port') + '/room',
					title: 'Tutorial UI',
					ip: req.app.get('server-ip')
				});
		} else {
			res.render(
				'error', {
					message:'Room Not Exists',
					error: {
						status: 'Room Not Exists',
						stack: 'controllers/tutorial.js'
					}
				}
			)
		}
	} else {
		res.render(
			'error', {
				message:'Permission Denied',
				error: {
					status: 'No Permission',
					stack: 'controllers/tutorial.js'
				}
			}
		)
	}
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
	if (SessionManager.hasPerssionToCreateTutorial(userID, tutorialRoomID)) {
		if (!SessionManager.roomExists(tutorialRoomID)) {
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
	var roomId = req.body.roomId;
	if (lobby.getRoomsMap()[roomId]){
		return res.json({success:true, at:'getting room parameters', lobby:lobby});
	} else {
		return res.json({success:false, at:'getting room parameters', message:'Room has not been created yet'});
	}
};

module.exports.get = get;
module.exports.createRoom = createRoom;
module.exports.roomParams = roomParams;