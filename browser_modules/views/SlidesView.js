var Vue = require('vue');
var $ = jQuery = require('jquery');

var SlidesView = function(socket, slides){
	//Vue.config.debug = true;
	var vm =  new Vue({
		el:'#presentation-wrapper',
		data:{
			state: slides.state,
			//put local variables here
		},
		methods:{
			nextSlide: function() {
				slides.nextSlide();
			},
			prevSlide: function() {
				slides.previousSlide();
			},
			switchPresentation: function(presentationID) {
				slides.switchPresentation(presentationID);
				$('.upload-selection-panel').hide();
			},
			openUploadSelectionPanel: function() {
				$('.upload-selection-panel').removeClass('upload-file-selected');
				$('.upload-selection-panel').show();
			},
			newBlankPresentation: function() {
				$('.upload-selection-panel').hide();
				slides.newBlankPresentation();
			},
			showUploadFileDialog: function() {
				$('.upload-selection-panel').addClass('upload-file-selected');
			},
			closeUploadFileSelectionPanel: function() {
				$('.upload-selection-panel').hide();
			},
			uploadSubmit: function () {
				slides.upload();
			}
		}
	});

	return vm;
};

module.exports.init = SlidesView;