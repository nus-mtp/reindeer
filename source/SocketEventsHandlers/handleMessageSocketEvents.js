/**
 * Created by shiyu on 1/4/16.
 */
const MESSAGE_ROOM = "message:room";

var handleMessageSocketEvents = function(socketClient) {
    var userID = socketClient.userID;
    var userName = socketClient.userName;
    var color = socketClient.color;

    var broadcastMessageToRoom = function (clientID, clientName, color) {
        return function (msg) {
            console.log(msg);
            messageObject = {
                clientID: clientID,
                clientName: clientName,
                message: msg,
                color: color,
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