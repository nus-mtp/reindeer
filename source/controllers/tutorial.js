/**
 * Tutorial controller
 * @type {*|exports|module.exports}
 */
var express = require('express');
var Rooms = require('../models/Rooms');
var Tutorial = require('../models/Tutorial');
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

	if (Rooms.hasUser(tutorialRoomID, userID)) {
		if (Rooms.isActive(tutorialRoomID)) {
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
						stack: 'controllers/Tutorial.js'
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
					stack: 'controllers/Tutorial.js'
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
var activateRoom = function(req, res, next){
	var userID = req.body.auth.decoded.id;
	var tutorialRoomID = req.body.roomID;
	if (Rooms.hasTutor(tutorialRoomID, userID)) {
		if (!Rooms.isActive(tutorialRoomID)) {
			lobby.get(tutorialRoomID).setActive();
			res.json({success:true, at:'room creation', roomID:tutorialRoomID});
		} else {
			res.json({success:false, at:'room creation', message:'Room already exists'});
		}
	} else {
		res.json({success:false, at:'room create', message: 'Permission Denied, you have no permission to create room'});
	}
};

module.exports.get = get;
module.exports.activateRoom = activateRoom;