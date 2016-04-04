/**
 * Created by shiyu on 1/4/16.
 */
var Presentation = require('./Presentation');

var Presentations = function () {
    this.hashOfPresentations = {};
    this.currentPresentationID = undefined;
    this.nextPresentationID = 0;

    this.newBlankPresentation();
}

Presentations.prototype.newPresentation = function(presentationObject) {
    var presentationID = this.getNewPresentationID();
    this.hashOfPresentations[presentationID] = new Presentation(presentationObject);

    if (!this.currentPresentationID) {
        this.currentPresentationID = presentationID;
    }
}

Presentations.prototype.newBlankPresentation = function() {
    var presentationID = this.getNewPresentationID();
    this.hashOfPresentations[presentationID] = new Presentation([{path: null}]);
    if (!this.currentPresentationID) {
        this.currentPresentationID = presentationID;
    }
}

Presentations.prototype.getNewPresentationID = function() {
    return this.nextPresentationID++;
}

Presentations.prototype.getCurrentPresentation = function() {
    return this.hashOfPresentations[this.currentPresentationID];
}

Presentations.prototype.switchToPresentationByID = function(presentationID) {
    if (this.hashOfPresentations[presentationID]) {
        this.currentPresentationID = presentationID;

        return true;
    } else {
        return false;
    }
}

Presentations.prototype.getAllPresentations = function() {
    // Iterate through all presentations, extract presentationID and path to first page(this will be the thumbnail)
    var presentations = [];
    for (var presentationID in this.hashOfPresentations) {
        var presentation = this.hashOfPresentations[presentationID];
        var presentationObject = {};
        presentationObject['id'] = presentationID;
        var firstSlideOfPresentation = presentation.getSlideByIndex(0);
        presentationObject['thumbnailPath'] = firstSlideOfPresentation.slideImagePath;

        presentations.push(presentationObject);
    }

    return presentations;
}

module.exports = Presentations;
