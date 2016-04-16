/**
 * @module models/ActionStack
 */

/**
 * Constructor for ActionStack
 * @constructor
 */
var ActionStack = function() {
    this.stackOfActions = [];
    this.stackOfUndoneAction = [];
}

/**
 * Add new action
 * @param actionType
 * @param actionData
 */
ActionStack.prototype.addNewAction = function(newAction) {
    // First in, last out, obviously..
    this.stackOfActions.push(newAction);

    // Wait a minute, after adding new action, it doesnt make sense
    // for us to allow a redo action anymore. So lets clear the redo stack!
    this.stackOfUndoneAction = [];
}

/**
 * Undo action
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

        // Return the actionID
        return undoneAction
    } else {
        //TODO: We have no actions current in the stack!
        // Return false or exception!?
        return null;
    }
}

/**
 * Redo action
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
        return redoneAction;
    } else {
        // You crazy!? there is nothing here to redo!!
        // TODO: return false or exception
        return null;
    }
}

/**
 * Retrieve action stack
 * @returns {Array}
 */
ActionStack.prototype.getAllActions = function() {
    return this.stackOfActions;
}

/**
 * Export constroctor of ActionStack
 * @type {ActionStack}
 */
module.exports = ActionStack;