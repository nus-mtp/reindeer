/**
 * Created by shiyu on 28/3/16.
 */
const CANVAS_STATE = "canvas_state";
const CANVAS_NEW_FABRIC_OBJECT = "canvas_new-fabric-object";

var handleCanvasSocketEvents = function(socketClient) {
    var userID = socketClient.userID;

    var broadcastCanvasStateOfCurrentSlide = function() {
        var currentPresentation = socketClient.getCurrentGroup().presentation;
        var currentSlide = currentPresentation.getCurrentSlide();
        var canvasObjectsManager = currentSlide.canvasObjectsManager;
        var canvasState = canvasObjectsManager.getAllFabricObjectsToRenderCanvas();
        socketClient.roomBroadcast(CANVAS_STATE, canvasState);
    }

    var addFabricObject = function(fabricObject) {
        var currentPresentation = socketClient.getCurrentGroup().presentation;
        var currentSlide = currentPresentation.getCurrentSlide();
        currentSlide.addFabricObject(userID, fabricObject);

        broadcastCanvasStateOfCurrentSlide();
    };

    var registerSocketEvents = function() {
        socketClient.on(CANVAS_NEW_FABRIC_OBJECT, addFabricObject);
    }

    registerSocketEvents();
    broadcastCanvasStateOfCurrentSlide();
}

module.exports = handleCanvasSocketEvents;