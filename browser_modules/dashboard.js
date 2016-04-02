/**
 * Created by shiyu on 1/4/16.
 */
var Tutorial = require('./models/dashboard/Tutorials');
var TutorialView = require('./views/dashboard/TutorialsView');
var $ = jQuery = require('jquery');

var init = function(getTutorialsURL, createSessionURL) {
    var tutorials = new Tutorial(getTutorialsURL, createSessionURL);
    var tutorialsView = TutorialView.init(tutorials);
}

module.exports.init = init;
window.dashboard = {
    init:init
};