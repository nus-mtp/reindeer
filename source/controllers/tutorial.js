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
 * create room RESTFUL API in post method
 * Create room with forceSynIVLE if room not exist
 *
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
		});
	} else {
		activateRoom(req, res, next);
	}
};


/**
 * Activate room, change room active status to true
 *
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
 * Pull latest data from IVLE into server database
 *
 * @param req
 * @param res
 * @param next
 * */
var forceSyncIVLE = function (req, res, next) {
	var userID = req.body.auth.decoded.id;
	Tutorial.forceSyncIVLE(userID).then(function (result) {
		if (result) {
			res.json({success: true, at: 'sync IVLE'});
		}
	});
};

module.exports.get = get;
module.exports.forceSyncIVLE = forceSyncIVLE;
module.exports.activateAndCreateRoom = activateAndCreateRoom;
module.exports.activateRoomTestStub = activateRoomTestStub;
