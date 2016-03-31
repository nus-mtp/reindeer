var express = require('express');
var auth = require('../auth');
var rest = require('rest');
var app = require('../../app');
var User = require('../models/User');
var Tutorial = require('../models/Tutorial');
var Room = require('../models/Rooms');

var protocol = 'https';
var usehttps = app.get('use-https');
if (!usehttps) {
    protocol = 'http';
}

var addDummy = function(){
    if (!Room.getLobby().get('testid')){
        var room = new Room.Room();

        Room.getLobby().addRoom('testid', room);
        var socketClient = new Room.SocketClient('a0091738', 'a0091738', null);
        socketClient.regist('testid');
        Room.getLobby().get('testid').tutors['a0091738'] = Room.getLobby().get('testid').get('default').get('a0091738');

        var socketClient2 = new Room.SocketClient('a0119493', 'a0119493', null);
        socketClient2.regist('testid');
        Room.getLobby().get('testid').tutors['a0119493'] = Room.getLobby().get('testid').get('default').get('a0119493');

        var socketClient3 = new Room.SocketClient('a0105546', 'a0105546', null);
        socketClient3.regist('testid');
        Room.getLobby().get('testid').tutors['a0105546'] = Room.getLobby().get('testid').get('default').get('a0105546');

        var socketClient4 = new Room.SocketClient('a0119456', 'a0119456', null);
        socketClient4.regist('testid');
        Room.getLobby().get('testid').tutors['a0119456'] = Room.getLobby().get('testid').get('default').get('a0119456');

        var socketClient5 = new Room.SocketClient('a0091024', 'a0091024', null);
        socketClient5.regist('testid');
        Room.getLobby().get('testid').tutors['a0091024'] = Room.getLobby().get('testid').get('default').get('a0091024');

        //console.log(JSON.stringify(Room.getLobby().get('testid')));
    }

}

/**
 * render dashboard page
 * @param req
 * @param res
 * @param next
 */
var get = function (req, res, next) {

    addDummy();

    if (req.body.auth.success) {
        res.render('dashboard', {
            ip: app.get('server-ip'),
            port: app.get('server-port'),
            urls: {
                refreshTutorials: protocol + '://' + app.get('server-ip') + ':' + app.get('server-port') + '/api/dashboard/getAllUserTutorialSessions',
                createSessions: protocol + '://' + app.get('server-ip') + ':' + app.get('server-port') + '/api/tutorial/createroom'
            }
        });
    } else {
        res.send("Permission Denied");
    }
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