/**
 * Created by shiyu on 1/4/16.
 */
var Presentation = require('./Presentation');

var Presentations = function () {
    this.hashOfPresentations = {};
    this.currentPresentationID = undefined;
}

Presentations.prototype.newPresentation = function(presentationID, presentationObject) {
    this.hashOfPresentations[presentationID] = new Presentation(presentationObject);

    if (!this.currentPresentationID) {
        this.currentPresentationID = presentationID;
    }
}

Presentations.prototype.getCurrentPresentation = function() {
    return this.hashOfPresentations[this.currentPresentationID];
}

Presentations.prototype.switchToPresentationByID = function(presentationID) {

}

Presentations.prototype.getAllPresentations = function() {

}

module.exports = Presentations;
