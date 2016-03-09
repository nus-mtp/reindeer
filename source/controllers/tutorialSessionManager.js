/**
 * Session Manager
 * @type {*|exports|module.exports}
 */
var Rooms = require('../models/Rooms');
var Tutorial = require('../models/Tutorial');
var lobby = Rooms.getLobby();

/**
 * Check if the user is the tutor of the room
 *
 * @param userID
 * @param tutorialRoomID
 * @returns boolean
 * */
function hasPerssionToCreateTutorial(userID, tutorialRoomID) {
    return Tutorial.findTutorialTutorID(tutorialRoomID).then(function (result) {
        if (result == null) {
            return false;
        } else {
            return userID === result.userId;
        }
    });
}

/**
 * Check if user has permission to enter the room
 *
 * @param userID
 * @param tutorialRoomID
 * @returns boolean
 * */
function hasPermissionToJoinTutorial(userID, tutorialRoomID) {
    return Tutorial.checkIfInTutorialUserList(userID, tutorialRoomID).then(function (result) {
        return result == null;
    });
}

/**
 * Check if the room exists
 *
 * @param tutorialRoomID
 * @returns boolean
 * */
function roomExists(tutorialRoomID) {
    return lobby.get(tutorialRoomID) != null;
}

module.exports.roomExists = roomExists;
module.exports.hasPermissionToJoinTutorial = hasPermissionToJoinTutorial;
module.exports.hasPerssionToCreateTutorial = hasPerssionToCreateTutorial;