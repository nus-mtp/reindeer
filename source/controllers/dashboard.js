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

var refreshTutorials = function (req, res, next) {
	auth.verify (req.body.token, function (err, decoded) {
		if (err) {
			res.json ({success: false, message: 'Login Required'});
		} else {
			User.findOne ({where: {id: decoded.id}}).then (function (user) {
				var ivleToken = user.token;

				console.log (ivleToken);
				rest ('https://ivle.nus.edu.sg/api/Lapi.svc/Modules?APIKey=' + app.get ('api-key') + '&AuthToken=' + ivleToken + '&Duration=0&IncludeAllInfo=false').then (function (response) {
					var courses = JSON.parse (response.entity).Results;
					var tutorials = {};
					for (idx in courses) {
						tutorials[courses[idx]['ID']] = courses[idx]['CourseName'];
						console.log (courses[idx]['ID']);
					}
					res.json ({success: true, result: tutorials});
				});
			})

		}
	})
}

/**
 * API get all user tutorials by user token
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
			Tutorial.findTutorial (decoded.id, req.body.tid).then (function (result) {
				res.json ({success: true, result: result});
			});
		}
	});
}

/**
 * API force Synchronize IVLE by user token
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
module.exports.refreshTutorials = refreshTutorials;
module.exports.getAllUserTutorials = getAllUserTutorials;
module.exports.getUserTutorial = getUserTutorial;
module.exports.forceSyncIVLE = forceSyncIVLE;