/**
 * Created by shiyu on 2/3/16.
 */
var ActionManager = require('./ActionManager');
var CanvasObjectsManager = require('./CanvasObjectsManager');

var Slide = function(slideImagePath) {
    this.actionManager = new ActionManager();
    this.canvasObjectsManager = new CanvasObjectsManager();

    initializeActionManager(this.actionManager, this.canvasObjectsManager);
    this.slideImagePath = slideImagePath;
}

function initializeActionManager(actionManager, canvasObjectsManager) {
    var ACTION_ADD_FABRIC_OBJECT = "addFabricObject";
    var ACTION_CLEAR_FABRIC_OBJECTS = "clearFabricObjects";
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

Slide.prototype.addNewAction = function(action, userID) {

}

module.exports = Slide;

