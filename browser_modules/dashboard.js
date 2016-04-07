var FileUpload = require('./models/FileUpload');
var FileUploadView = require('./views/FileUploadView');

var init = function(tutorialID) {
	var fileUpload = new FileUpload(tutorialID);
	var fileUploadView = FileUploadView.init(fileUpload);
};

module.exports.init = init;
window.dashboard = {
	init:init
};