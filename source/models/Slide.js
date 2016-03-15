/**
 * Created by shiyu on 2/3/16.
 */
var ActionManager = require('./ActionManager');

var slide = function(slideImagePath) {
    this.ActionManager = new ActionManager();
    this.slideImagePath = slideImagePath;

    this.currentUnusedID = 0;
    // keeps a list of the canvas of objects needed by the client's fabric canvas to render;
    this.hashOfFabricJSObjects = {};
}

slide.prototype.addAction = function(fabricObject, userID) {
    this.hashOfFabricJSObjects[this.currentUnusedID] = fabricObject;


}

module.exports = slide;

