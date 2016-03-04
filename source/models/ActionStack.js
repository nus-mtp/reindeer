/**
 * Created by shiyu on 1/3/16.
 */
var Action = require('./action');
var ActionStack = function() {
    this.stackOfActions = [];
    this.stackOfUndoneAction = [];
}

/**
 *
 * @param actionType
 * @param actionData
 */
ActionStack.prototype.addNewAction = function(actionType, actionData) {
    // Create a new Action
    var newAction = new Action(actionType, actionData);
    // First in, last out, obviously..
    this.stackOfActions.push(newAction);

    // Wait a minute, after adding new action, it doesnt make sense
    // for us to allow a redo action anymore. So lets clear the redo stack!
    this.stackOfUndoneAction = [];
}

/**
 *
 * @returns {boolean}
 */
ActionStack.prototype.undoAction = function() {
    // First check if there is anything to undo/pop
    var isStackNotEmpty = (this.stackOfActions.length > 0);
    if (isStackNotEmpty) {
        // Proceed to pop!
        var undoneAction = this.stackOfActions.pop();
        // Now after popping, we have to save the action on to the undoneStack
        // so that redoing can be achieved
        this.stackOfUndoneAction.push(undoneAction);
    } else {
        //TODO: We have no actions current in the stack!
        // Return false or exception!?
        return false;
    }

    // Lets return a boolean to tell notify that the undo process has been successful
    return true;
}

/**
 *
 * @returns {boolean}
 */
ActionStack.prototype.redoAction = function() {
    // Alright.. here we first check whether there is anything to redo
    var isStackNotEmpty = (this.stackOfUndoneAction.length > 0);
    if (isStackNotEmpty) {
        // Okay it appears, we have clearance to redo! :D
        var redoneAction = this.stackOfUndoneAction.pop();
        // Now to redo we push it back on to the main stack of actions
        this.stackOfActions.push(redoneAction);
    } else {
        // You crazy!? there is nothing here to redo!!
        // TODO: return false or exception
        return false;
    }

    // Redo action was successful at this point, notify user!
    return true;
}

/**
 *
 * @returns {Array}
 */
ActionStack.prototype.getAllActions = function() {
    return this.stackOfActions;
}

module.exports = ActionStack;