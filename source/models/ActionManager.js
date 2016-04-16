/**
 * @module models/ActionManager
 * @type {ActionStack|exports|module.exports}
 */

var ActionStack = require('./ActionStack');

/**
 * Constructor for ActionManager
 * @constructor
 */
var ActionManager = function() {
    this.actionHashMap = {};
    this.hashOfUsers = {};
}

/**
 * Register action intu action hashmap
 * @param actionName
 * @param forwardExecutionCallback
 * @param backwardExecutionCallback
 */
ActionManager.prototype.registerAction = function(actionName, forwardExecutionCallback, backwardExecutionCallback) {
    this.actionHashMap[actionName] = {
        forwardExecutionCallback: forwardExecutionCallback,
        backwardExecutionCallback: backwardExecutionCallback,
    };
}

/**
 * Execute action
 * @param userId
 * @param actionObject
 * @returns {boolean}
 */
ActionManager.prototype.executeAction = function(userId, actionObject) {
    var actionName = actionObject.actionType;
    var actionData = actionObject.actionData;
    // Check if action type has been registered.
    if (!this.actionHashMap[actionName]) {
        return false;
    }
    // Check if user is registered, if not, create new action stack
    var actionStack = this.hashOfUsers[userId];
    if (!this.hashOfUsers[userId]) {
        this.hashOfUsers[userId] = new ActionStack();
        actionStack = this.hashOfUsers[userId];
    }

    // Retrieve from action hash map
    var actionToBeExecuted = this.actionHashMap[actionName].forwardExecutionCallback;

    // Pass action data into it
    actionToBeExecuted(userId, actionData);

    //push action into action stack so that undoing is possible afterwards
    actionStack.addNewAction(actionObject);
}

/**
 * Undo action
 * @param userId
 * @returns {boolean}
 */
ActionManager.prototype.undoAction = function(userId) {
    // Check if user is registered
    var actionStack = this.hashOfUsers[userId];

    if (actionStack) {
        // retrieve action object
        var actionObject = actionStack.undoAction();

        if (!actionObject) {
            // Nothing to undo
            return false;
        }

        var actionName = actionObject.actionType;
        var actionData = actionObject.actionData;

        // Retrieve from action hash map
        var actionToBeExecuted = this.actionHashMap[actionName].backwardExecutionCallback;

        // Pass action data into it
        actionToBeExecuted(userId, actionData);
    } else {
        // User does not exist
        return false;
    }
}

/**
 * Redo action
 * @param userId
 * @returns {boolean}
 */
ActionManager.prototype.redoAction = function(userId) {
    var actionStack = this.hashOfUsers[userId];

    if (actionStack) {
        // retrieve action object
        var actionObject = actionStack.redoAction();

        if (!actionObject) {
            // Nothing to redo;
            return false;
        }
        var actionName = actionObject.actionType;
        var actionData = actionObject.actionData;

        // Retrieve from action hash map
        var actionToBeExecuted = this.actionHashMap[actionName].forwardExecutionCallback;

        // Pass action data into it
        actionToBeExecuted(userId, actionData);
    } else {
        return false;
    }
}

/**
 * Export Constructor of ActionManager
 * @type {ActionManager}
 */
module.exports = ActionManager;