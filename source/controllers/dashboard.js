var express = require('express');
var auth = require('../auth');
var rest = require('rest');
var app = require('../../app');
var User = require('../models/user');
var Tutorial = require('../models/tutorial');

var protocol = 'https';
var usehttps = app.get('use-https');
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
    res.render('dashboard', {
        ip: app.get('server-ip'),
        port: app.get('server-port'),
        urls: {
            refreshTutorials: protocol + '://' + app.get('server-ip') + ':' + app.get('server-port') + '/api/dashboard/getAllUserTutorialSessions',
            createSessions: protocol + '://' + app.get('server-ip') + ':' + app.get('server-port') + '/api/tutorial/createroom'
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
var getAllUserTutorialSessions = function (req, res, next) {
    Tutorial.findAndCountAllTutorials(req.body.auth.decoded.id).then(function (courseInfo) {
        var moduleTutorialInfo = groupTutorialByCourseCode(courseInfo);
        res.json({success: true, result: moduleTutorialInfo});
    });
};

/**
 * API get one tutorial slot by user token and tutorial id
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
var getTutorialByIDToken = function (req, res, next) {
    Tutorial.findTutorial(req.body.auth.decoded.id, req.body.tutorialId).then(function (result) {
        res.json({success: true, result: result});
    });
};

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
    Tutorial.forceSyncIVLE(req.body.auth.decoded.id).catch(function (err) {
        res.json({success: false, message: err});
    }).then(function () {
        res.json({success: true, result: 'Synchronization Complete'});
    });
};


/**
 * ============================ Helper Function ==============================
 * ===========================================================================
 * */

/**
 * Group Tutorials By Coursecode
 *
 * return {
 * 		<coursecode>: Array[]
 * 	}
 * */
function groupTutorialByCourseCode(queryResult) {
    var moduleTutorials = {}
    for (var idx in queryResult.rows) {
        var coursecode = queryResult.rows[idx].coursecode;
        if (!moduleTutorials[coursecode]) {
            moduleTutorials[coursecode] = [];
        }
        moduleTutorials[coursecode].push(queryResult.rows[idx]);
    }
    return moduleTutorials;
}


module.exports.get = get;
module.exports.getTutorialByIDToken = getTutorialByIDToken;
module.exports.forceSyncIVLE = forceSyncIVLE;
module.exports.getAllUserTutorialSessions = getAllUserTutorialSessions;