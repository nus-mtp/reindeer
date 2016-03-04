/**
 * Created by shiyu on 3/3/16.
 */
var msgToGroup = function (clientId, clientName, lobby) {
    return function (msg) {
        console.log (msg);
        var user = lobby.getUser (clientId);
        if (user == null) {
            console.log ('no such user');
        } else {
            lobby.getUser (clientId).groupBroadcast ('msgToGroup', clientName + msg);
        }
    }
};

var msgToRoom = function (clientId, clientName, lobby) {
    return function (msg) {
        console.log (msg);
        var user = lobby.getUser (clientId);
        if (user == null) {
            console.log ('no such user');
        } else {
            user.roomBroadcast ('msgToRoom', clientName + msg);
        }
    };
};

var msgToUser = function (socketClient, clientId, clientName, lobby) {
    return function (msg) {
        console.log (msg);
        var receiverId = getReceiverId (msg);
        var user = lobby.getUser (clientId);
        if (user == null) {
            console.log ('no such user');
            socketClient.emit ('systemMsg', 'no such user');
        } else {
            lobby.getUser (clientId).personalMessage ('msgToUser', clientName + msg.msg, receiverId);
        }
    }
};

var getReceiverId = function (msg) {
    return msg.receiverId;
}

module.exports.msgToGroup = msgToGroup;
module.exports.msgToRoom = msgToRoom;
module.exports.msgToUser = msgToUser;
module.exports.getReceiverId = getReceiverId;
