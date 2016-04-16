/**
 * @module controllers/tutorial
 * @type {*|exports|module.exports}
 */
var express = require('express');
var Rooms = require('../models/Rooms');
var Tutorial = require('../models/Tutorial');
var lobby = Rooms.getLobby();
var app = require('../../app');
var logger = require('../logger').serverLogger;

var protocol = 'https';
var usehttps = app.get('use-https');
if (!usehttps) {
	protocol = 'http';
}

/**
 * Render tutorial room session page
 * return HTML
 * @param req
 * @param res
 * @param next
 */
var get = function (req, res, next) {
	var userID = req.body.auth.decoded.id;
	var tutorialRoomID = req.params.id;

	if (Rooms.hasUser(tutorialRoomID, userID)) {
		if (Rooms.isActive(tutorialRoomID)) {
			Tutorial.findTutorial(userID, tutorialRoomID).then(function (courseInfo) {
				var tutorial = courseInfo.rows[0];

				res.render(
					'tutorial/tutorial', {
						roomId: req.params.id,
						roomioURL: protocol + '://' + req.app.get('server-ip') + ':' + req.app.get('server-port') + '/room',
						title: 'Tutorial UI',
						tutorial: tutorial,
						ip: req.app.get('server-ip')
					});
			});
		} else {
			res.render(
				'error', {
					message: 'Room Not Exists',
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
				message: 'Permission Denied',
				error: {
					status: 'No Permission',
					stack: 'controllers/Tutorial.js'
				}
			}
		)
	}
};

/**
 * Create room with forceSynIVLE if room not exist
 * post {token, roomID}
 * return {success, at, roomID/message}
 * @param req
 * @param res
 * @param next
 */
var activateAndCreateRoom = function (req, res, next) {
	var userID = req.body.auth.decoded.id;
	var tutorialRoomID = req.body.roomID;
	if (!lobby.get(tutorialRoomID)) {
		Tutorial.forceSyncIVLE(userID).then(function (result) {
			activateRoom(req, res, next);
		}).catch(function(e){
			logger.error(e);
			res.json({success:false, at:'room creation', message:'Room not exists and sync failed'});
		});
	} else {
		activateRoom(req, res, next);
	}
};


/**
 * Helper function activate room, change room active status to true
 * @param req
 * @param res
 * @param next
 * */
var activateRoom = function (req, res, next) {
	var userID = req.body.auth.decoded.id;
	var tutorialRoomID = req.body.roomID;

	if (Rooms.hasTutor(tutorialRoomID, userID)) {
		if (!Rooms.isActive(tutorialRoomID)) {
			lobby.get(tutorialRoomID).setActive();
			res.json({success: true, at: 'room creation', roomID: tutorialRoomID});
		} else {
			res.json({success: false, at: 'room creation', message: 'Room already exists'});
		}
	} else {
		res.json({
			success: false,
			at: 'room create',
			message: 'Permission Denied, you have no permission to create room'
		});
	}
};

/**
 * deactivate room handler
 * post {token, roomID}
 * return {success, at, message}
 * @param req
 * @param res
 * @param next
 */
var deactivateRoom = function(req, res){
	var userID = req.body.auth.decoded.id;
	var tutorialRoomID = req.body.roomID;
	try{
		var room = Rooms.getLobby().get(tutorialRoomID);


		if (Rooms.hasTutor(tutorialRoomID, userID)){
			if (Rooms.isActive(tutorialRoomID)){
				room.deActivate();
				res.json({
					success: true,
					at:'deactivate room',
					message: 'Room Session has been closed'
				})
			} else {
				res.json({
					success: true,
					at:'deactivate room',
					message: 'Room has been deactivated'
				});
			}
		} else {
			res.json({
				success:false,
				at:'deactivate room',
				message: 'Permission Denied'
			})
		}
	} catch(e) {
		res.json({
			success: false,
			at:'deactivate room',
			message: 'This tutorial group is not existed'
		});

		logger.error(e);
		return;
	}
}

/**
 * Activate room, change room active status to true
 *
 * @param req
 * @param res
 * @param next
 * */
var activateRoomTestStub = function (userID, tutorialRoomID) {

	if (Rooms.hasTutor(tutorialRoomID, userID)) {
		if (!Rooms.isActive(tutorialRoomID)) {
			lobby.get(tutorialRoomID).setActive();
		} else {
			throw 'ActivateRoomTestStub: Room Not Active';
		}
	} else {
		throw 'ActivateRoomTestStub: User not tutor';
	}
};

/**
 * Force sunchronize user data with IVLE
 * post {token}
 * return {success, at, message}
 * @param req
 * @param res
 * @param next
 * */
var forceSyncIVLE = function (req, res, next) {
	var userID = req.body.auth.decoded.id;
	Tutorial.forceSyncIVLE(userID).then(function (result) {
		if (result) {
			res.json({success: true, at: 'sync IVLE', message:'Sync Successful'});
		}
	}).catch(function(e){
		logger.error(e);
		res.json({success: false, at:'sync IVLE', message:e});
	});
};

module.exports.get = get;
module.exports.forceSyncIVLE = forceSyncIVLE;
module.exports.activateAndCreateRoom = activateAndCreateRoom;
module.exports.activateRoomTestStub = activateRoomTestStub;
module.exports.deactivateRoom = deactivateRoom;
