/**
 * Created by shiyu on 26/2/16.
 */

var action = function(actionType, actionData) {
    this.timestamp = new Date();
    this.actionType = actionType;
    this.actionData = actionData;
}

module.exports = action;
