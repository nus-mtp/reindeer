/**
 * Created by shiyu on 2/3/16.
 */
var ActionStackToUserManager = require('./ActionStackToUserManager');

var slide = function(slideImagePath) {
    this.actionStackToUserManager = new ActionStackToUserManager();
    this.slideImagePath = slideImagePath;
}

module.exports = slide;

