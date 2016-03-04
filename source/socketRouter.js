/**
 * Created by shiyu on 3/3/16.
 */
var messageHandler = require('./messageHandler');
var socketRouter = function(clientId, clientName, socketClient, lobby) {
    registerMessageEventsToSocket(clientId, clientName, socketClient, lobby);
}

var registerMessageEventsToSocket = function(clientId, clientName, socketClient, lobby) {
    socketClient.on('msgToGroup', messageHandler.msgToGroup (clientId, clientName, lobby));
    socketClient.on('msgToRoom', messageHandler.msgToRoom (clientId, clientName, lobby));
    socketClient.on('msgToUser', messageHandler.msgToUser (socketClient, clientId, clientName, lobby));
}

module.exports = socketRouter;