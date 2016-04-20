/**
 * Created by shiyu on 1/4/16.
 */
window.httpRoot = 'HTTP_ROOT';
var Tutorials = require('./models/dashboard/Tutorials');
var TutorialView = require('./views/dashboard/TutorialsView');
var $ = jQuery = require('jquery');

var init = function() {
    var tutorials = new Tutorials();
    var tutorialsView = TutorialView.init(tutorials);

}

module.exports.init = init;
window.dashboard = {
    init:init
};
window.$ = window.jQuery = $;
window.Cookies = require('js-cookie');