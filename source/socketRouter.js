/**
 * Created by shiyu on 3/3/16.
 */
var messageHandler = require('./messageHandler');
var socketRouter = function(clientId, clientName, socketClient, lobby) {
    //registerMessageEventsToSocket(clientId, clientName, socketClient, lobby);
    registerSlideEventsToSocket(socketClient);
    registerCanvasEventsToSocket(clientId, socketClient);
}

var registerMessageEventsToSocket = function(clientId, clientName, socketClient, lobby) {
    socketClient.on('msgToGroup', messageHandler.msgToGroup (clientId, clientName, lobby));
    socketClient.on('msgToRoom', messageHandler.msgToRoom (clientId, clientName, lobby));
    socketClient.on('msgToUser', messageHandler.msgToUser (socketClient, clientId, clientName, lobby));
}

var registerSlideEventsToSocket = function(socketClient) {
    socketClient.roomBroadcast("receiveSlideObjects", socketClient.getCurrentGroup().presentation.getAllSlidesAsJSON());
    socketClient.roomBroadcast("receiveCurrentSlideIndex", socketClient.getCurrentGroup().presentation.currentSlide);

    socketClient.on('nextSlide', function() {
        socketClient.getCurrentGroup().presentation.nextSlide();
        socketClient.roomBroadcast("receiveCurrentSlideIndex", socketClient.getCurrentGroup().presentation.currentSlide);
    });

    socketClient.on('prevSlide', function() {
        socketClient.getCurrentGroup().presentation.previousSlide();
        socketClient.roomBroadcast("receiveCurrentSlideIndex", socketClient.getCurrentGroup().presentation.currentSlide);
    });
}

var registerCanvasEventsToSocket = function(clientId, socketClient) {
    var currentSlide = socketClient.getCurrentGroup().presentation.getCurrentSlide();
    socketClient.roomBroadcast("canvasState", currentSlide.canvasObjectsManager.getFabricObjectsOfUser(clientId));

    socketClient.on('addFabricObject', function(fabricObject) {
        var currentSlide = socketClient.getCurrentGroup().presentation.getCurrentSlide();
        currentSlide.addFabricObject(clientId, fabricObject);
        socketClient.roomBroadcast("canvasState", currentSlide.canvasObjectsManager.getFabricObjectsOfUser(clientId));
    });
}

module.exports = socketRouter;