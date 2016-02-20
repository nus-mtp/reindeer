var express = require ('express');
var auth = require ('../auth');
var rest = require ('rest');
var app = require ('../../app');
var User = require ('../models/user');
var Tutorial = require ('../models/tutorial');

var protocol = 'https';
var usehttps = app.get ('use-https');
if (!usehttps) {
	protocol = 'http';
}

/**
 * render dashboard page
 * @param req
 * @param res
 * @param next
 */
var get = function (req, res, next) {
	res.render ('dashboard', {
		ip: app.get ('server-ip'),
		port: app.get ('server-port'),
		urls: {
			refreshTutorials: protocol + '://' + app.get ('server-ip') + ':' + app.get ('server-port') + '/api/dashboard/refreshtutorials'
		}
	});
}

/**
 * API get all user tutorials by user token
 * post json
 * {
 *   token: string
 * }
 * return {success, message/result}
 * @param req
 * @param res
 * @param next
 */
var getAllUserTutorials = function (req, res, next) {
	auth.verify (req.body.token, function (err, decoded) {
		if (err) {
			res.json ({success: false, message: 'Login Required'});
		} else {
			Tutorial.findAndCountAllTutorials (decoded.id).then (function (result) {
				res.json ({success: true, result: result});
			});
		}
	});
}

/**
 * API get exact one user tutorial by user token and tutorial id
 * post json
 * {
 *   token: string
 *   tutorialId: integer
 * }
 * return {success, message/result}
 * @param req
 * @param res
 * @param next
 */
var getUserTutorial = function (req, res, next) {
	auth.verify (req.body.token, function (err, decoded) {
		if (err) {
			res.json ({success: false, message: 'Login Required'});
		} else {
			Tutorial.findTutorial (decoded.id, req.body.tutorialId).then (function (result) {
				res.json ({success: true, result: result});
			});
		}
	});
}

/**
 * API force Synchronize IVLE by user token
 * post json
 * {
 *   token: string
 * }
 * return {success, message/result}
 * @param req
 * @param res
 * @param next
 */
var forceSyncIVLE = function (req, res, next) {
	auth.verify (req.body.token, function (err, decoded) {
		if (err) {
			res.json ({success: false, message: 'Login Required'});
		} else {
			Tutorial.forceSyncIVLE (decoded.id).catch (function (err) {
				res.json ({success: false, message: err});
			}).then (function () {
				res.json ({success: true, result: 'Synchronization Complete'});
			});
		}
	})
}

module.exports.get = get;
module.exports.getAllUserTutorials = getAllUserTutorials;
module.exports.getUserTutorial = getUserTutorial;
module.exports.forceSyncIVLE = forceSyncIVLE;