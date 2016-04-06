/**
 * Created by shiyu on 1/4/16.
 */
const MESSAGE_ROOM = "message:room";
var moment = require('moment');

var handleMessageSocketEvents = function(socketClient) {
    var userID = socketClient.userID;
    var userName = socketClient.userName;
    var color = socketClient.color;

    var broadcastMessageToRoom = function (clientID, clientName, color) {
        return function (msg) {
            var timestamp = moment();
            var formatted = timestamp.locale('en').format('HH:mm A');
            console.log(formatted);
            console.log(msg);
            messageObject = {
                clientID: clientID,
                clientName: clientName,
                message: msg,
                color: color,
                timestamp: formatted,
            }

            socketClient.roomBroadcast(MESSAGE_ROOM, messageObject);
        }
    };

    var registerSocketEvents = function() {
        socketClient.on(MESSAGE_ROOM, broadcastMessageToRoom(userID, userName, color));
    }

    registerSocketEvents();
}

module.exports = handleMessageSocketEvents;