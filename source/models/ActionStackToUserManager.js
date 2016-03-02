/**
 * Created by shiyu on 1/3/16.
 */
var ActionStack = require('.ActionStack');

var ActionStackToUserManager = function() {
    this.hashOfUserAction = [];
}

ActionStackToUserManager.prototype.addAction = function(userId, actionType, actionData) {
    var usersActionStack = null;
    // Check if user is already a key in the hash
    if (this.hashOfUserAction[userID]) {
        // Yay it exists, so lets retrieve the corresponding Action Stack
        usersActionStack = this.hashOfUserAction[userID];
    } else {
        // Uh oh, we don't have an action stack assigned to this user yet!
        // so lets do just that!
        usersActionStack = new ActionStack();
        this.hashOfUserAction[userID] = usersActionStack;
    }

    // Okay now that we reached this point, should safely assume that we have the user has
    // an action stack.

    // Proceed to add action!
    usersActionStack.addNewAction(actionType, actionData);
}

/**
 *
 * @param userId
 * @returns {boolean}
 */
ActionStackToUserManager.prototype.undoAction = function(userId) {
    var usersActionStack = this.hashOfUserAction[userId];
    // Gotta check whether this user has an action stack
    if (usersActionStack) {
        // Okay now that we have confirmed, lets undo!
        var isSomethingHasBeenUndone = usersActionStack.undoAction();
        if (!isSomethingHasBeenUndone) {
            // Okay there probably isnt any action in this guy's stack
            // TODO: Next step of action
            return false;
        }
    } else {
        // What are you undoing?? You don't even own an action stack.
        return false;
    }

    return true;
}

/**
 *
 * @param userId
 * @returns {boolean}
 */
ActionStackToUserManager.prototype.redoAction = function(userId) {
    var usersActionStack = this.hashOfUserAction[userId];
    // Same old same old, check if user has an action stack
    if (usersActionStack) {
        // Okay good to get that cleared
        // Redo now, NOW!
        var isSomethingHasBeenRedone = usersActionStack.redoAction();
        if (!isSomethingHasBeenRedone) {
            // Nothing there to redo perhapsss
            return false;
        }
    } else {
        // Erm.. user does not have an action stack
        return false;
    }

    return true;
}

/**
 *
 * @returns {Array}
 */
ActionStackToUserManager.prototype.getAllActions = function() {
    // Okay this might be tricky, we have to retrieve all the actions,
    // then sort them based on the timestamp before returning the results. GOT IT!?


    //Retrieve all the stacks and merge them
    var combinedStack = [];

    for (var actionStack in this.hashOfUserAction) {
        combinedStack = combineStack.concat(actionStack.getAllActions());
    }

    // Sort them in ascending order
    combineStack.sort(function(a, b) {
        // Compares timestamp
        if (a.timestamp < b.timestamp) {
            return -1;
        } else if (a.timestamp > b.timestamp) {
            return 1;
        } else {
            return 0;
        }
    })

    return combinedStack;
}

module.exports = ActionStackToUserManager;

