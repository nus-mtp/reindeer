var FileUpload = require('./models/FileUpload');
var FileUploadView = require('./views/FileUploadView');

var init = function() {
	var tutorialID = "<%= tutorialID %>";
	var fileUpload = new FileUpload(tutorialID);
	var fileUploadView = FileUploadView.init(fileUpload);
};
//$(document).ready(function() {
//	init();
//})
module.exports.init = init;
window.dashboard = {
	init:init
};