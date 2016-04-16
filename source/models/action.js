/**
 * @module models/action
 * @type {action}
 */

/**
 * Constructor for action
 * @consturctor
 * @param actionType
 * @param actionData
 */
var action = function(actionType, actionData) {
    this.timestamp = new Date();
    this.actionType = actionType;
    this.actionData = actionData;
}

module.exports = action;
