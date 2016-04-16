var express = require('express');
var auth = require('../auth');
var rest = require('rest');
var app = require('../../app');
var User = require('../models/User');
var Tutorial = require('../models/Tutorial');
var Room = require('../models/Rooms');
var logger = require('../logger').serverLogger;

var protocol = 'https';
var usehttps = app.get('use-https');
if (!usehttps) {
    protocol = 'http';
}

var addDummy = function(){
    var room = new Room.Room();
    return Room.getLobby().findOrAddRoom('testid', room);
}

/**
 * render dashboard page
 * @param req
 * @param res
 * @param next
 */
var get = function (req, res, next) {

    addDummy().then(function(room){
        room.tutors['a0091738'] = Room.getLobby().get('testid').get('default').get('a0091738');
        room.tutors['a0119493'] = room.get('default').get('a0119493');
        room.tutors['a0105546'] = room.get('default').get('a0105546');
        room.tutors['a0119456'] = room.get('default').get('a0119456');
        room.tutors['a0091024'] = room.get('default').get('a0091024');
        room.tutors['teststudent', 'teststudent', null] = room.get('default').get('teststudent');
        if (req.body.auth.success) {
            res.render('dashboard', {
                user: req.body.auth.decoded,
                ip: app.get('server-ip'),
                port: app.get('server-port'),
                urls: {
                    refreshTutorials: protocol + '://' + app.get('server-ip') + ':' + app.get('server-port') + '/api/dashboard/getAllUserTutorialSessions',
                    createSessions: protocol + '://' + app.get('server-ip') + ':' + app.get('server-port') + '/api/tutorial/createroom',
                    endSessions: protocol + '://' + app.get('server-ip') + ':' + app.get('server-port') + '/api/tutorial/deactivateroom'
                }
            });
        } else {
            res.render('permissionDenied', {});
        }
    });
};

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
    if (req.body.auth.success) {
        Tutorial.findAndCountAllTutorials(req.body.auth.decoded.id).then(function (courseInfo) {
            var moduleTutorialInfo = groupTutorialByCourseCode(courseInfo);
            res.json({success: true, result: moduleTutorialInfo});
        });
    } else {
        res.send("Permission Denied");
    }
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
    if (req.body.auth.success) {
        Tutorial.findTutorial(req.body.auth.decoded.id, req.body.tutorialId).then(function (result) {
            res.json({success: true, result: result});
        });
    } else {
        res.send("Permission Denied");
    }
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
    if (req.body.auth.success) {
        Tutorial.forceSyncIVLE(req.body.auth.decoded.id).catch(function (err) {
            logger.error(err);
            res.json({success: false, message: err});
        }).then(function () {
            res.json({success: true, result: 'Synchronization Complete'});
        });
    } else {
        res.send("Permission Denied");
    }
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
    var moduleTutorials = {};
    for (var idx in queryResult.rows) {
        var coursecode = queryResult.rows[idx].coursecode;
        if (!moduleTutorials[coursecode]) {
            moduleTutorials[coursecode] = [];
        }

        var generalData = queryResult.rows[idx];
        var generalDataWithRoomStatus = addRoomStatus(generalData);
        moduleTutorials[coursecode].push(generalDataWithRoomStatus);
    }
    return moduleTutorials;
}

/**
 * Add room status to each tutorial
 *
 * return general course info with room session status
 * */
function addRoomStatus(generalData) {
    var tutorialID = generalData.id;
    var roomStatus = Room.isActive(tutorialID);

    generalData.dataValues.roomSessionStarted = roomStatus;

    return generalData;
}


module.exports.get = get;
module.exports.getTutorialByIDToken = getTutorialByIDToken;
module.exports.forceSyncIVLE = forceSyncIVLE;
module.exports.getAllUserTutorialSessions = getAllUserTutorialSessions;