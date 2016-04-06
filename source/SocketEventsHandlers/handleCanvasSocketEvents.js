/**
 * Created by shiyu on 28/3/16.
 */
const CANVAS_STATE = "canvas:state";
const CANVAS_NEW_FABRIC_OBJECT = "canvas:new-fabric-object";
const CANVAS_UNDO_ACTION = "canvas:undo";
const CANVAS_REDO_ACTION = "canvas:redo";
var SLIDE_NEXT = require('./handleSlideSocketEvents').SLIDE_NEXT;
var SLIDE_PREVIOUS = require('./handleSlideSocketEvents').SLIDE_PREVIOUS;
var SLIDE_SWITCH_PRESENTATION = require('./handleSlideSocketEvents').SLIDE_SWITCH_PRESENTATION;
var SLIDE_UPLOAD_SUCCESS = require('./handleSlideSocketEvents').SLIDE_UPLOAD_SUCCESS;
var SLIDE_NEW_BLANK_PRESENTATION = require('./handleSlideSocketEvents').SLIDE_NEW_BLANK_PRESENTATION;

var handleCanvasSocketEvents = function(socketClient) {
    var userID = socketClient.userID;

    var getCurrentSlide = function() {
        var currentPresentation = socketClient.getCurrentGroup().presentations.getCurrentPresentation();
        return currentPresentation.getCurrentSlide();
    }

    var broadcastCanvasStateOfCurrentSlide = function() {
        var currentSlide = getCurrentSlide();
        var canvasObjectsManager = currentSlide.canvasObjectsManager;
        var canvasState = canvasObjectsManager.getAllFabricObjectsToRenderCanvas();
        socketClient.roomBroadcast(CANVAS_STATE, canvasState);
    }

    var addFabricObject = function(fabricObject) {
        var currentSlide = getCurrentSlide();
        currentSlide.addFabricObject(userID, fabricObject);
        broadcastCanvasStateOfCurrentSlide();
    };

    var undoLastAction = function() {
        var currentSlide = getCurrentSlide();
        currentSlide.undoAction(userID);
        broadcastCanvasStateOfCurrentSlide();
    }

    var redoLastAction = function() {
        var currentSlide = getCurrentSlide();
        currentSlide.redoAction(userID);
        broadcastCanvasStateOfCurrentSlide();
    }

    // Register Socket Events here:
    var registerSocketEvents = function() {
        socketClient.on(CANVAS_NEW_FABRIC_OBJECT, addFabricObject);
        socketClient.on(CANVAS_UNDO_ACTION, undoLastAction);
        socketClient.on(CANVAS_REDO_ACTION, redoLastAction);
        socketClient.on(SLIDE_NEXT, broadcastCanvasStateOfCurrentSlide);
        socketClient.on(SLIDE_PREVIOUS, broadcastCanvasStateOfCurrentSlide);
        socketClient.on(SLIDE_SWITCH_PRESENTATION, broadcastCanvasStateOfCurrentSlide);
        socketClient.on(SLIDE_UPLOAD_SUCCESS, broadcastCanvasStateOfCurrentSlide);
        socketClient.on(SLIDE_NEW_BLANK_PRESENTATION, broadcastCanvasStateOfCurrentSlide);
    }

    registerSocketEvents();
    broadcastCanvasStateOfCurrentSlide();
}

module.exports = handleCanvasSocketEvents;