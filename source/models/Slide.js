/**
 * @module models/Slide
 * @type {action|exports|module.exports}
 */
var Action = require('./action');
var ActionManager = require('./ActionManager');
var CanvasObjectsManager = require('./CanvasObjectsManager');

const ACTION_ADD_FABRIC_OBJECT = "addFabricObject";
const ACTION_CLEAR_FABRIC_OBJECTS = "clearFabricObjects";

var Slide = function(slideImagePath) {
    this.actionManager = new ActionManager();
    this.canvasObjectsManager = new CanvasObjectsManager();

    initializeActionManager(this.actionManager, this.canvasObjectsManager);
    this.slideImagePath = slideImagePath;
}

function initializeActionManager(actionManager, canvasObjectsManager) {

    actionManager.registerAction(ACTION_ADD_FABRIC_OBJECT,
                                function(userId, actionData) {
                                    canvasObjectsManager.addNewFabricObjectToUser(userId, actionData.fabricObject);
                                },
                                function(userId) {
                                    canvasObjectsManager.removeLastFabricObjectFromUser(userId);
                                });


    actionManager.registerAction(ACTION_CLEAR_FABRIC_OBJECTS,
                                function(userId, actionData) {
                                    canvasObjectsOfUser = canvasObjectsManager.popAllFabricObjectFromUser(userId);
                                    actionData.canvasObjectsOfUser = canvasObjectsOfUser;
                                },
                                function(userId, actionData) {
                                    canvasObjectsManager.loadFabricObjectsToUser(userId, actionData.canvasObjectsOfUser);
                                });
}

Slide.prototype.undoAction = function(userId) {
    this.actionManager.undoAction(userId);
}

Slide.prototype.redoAction = function(userId) {
    this.actionManager.redoAction(userId);
}

Slide.prototype.addFabricObject = function(userId, fabricObject) {
    var addFabricAction = new Action(ACTION_ADD_FABRIC_OBJECT, {fabricObject: fabricObject});
    this.actionManager.executeAction(userId, addFabricAction);
}

Slide.prototype.clearFabricObjects = function(userId) {
    var clearFabricObjectsAction = new Action(ACTION_CLEAR_FABRIC_OBJECTS, {});
    this.actionManager.executeAction(userId, clearFabricObjectsAction);
}

Slide.prototype.getFabricObjectsOfAllUsers = function() {
    this.canvasObjectsManager.getAllFabricObjectsToRenderCanvas();
}

module.exports = Slide;

