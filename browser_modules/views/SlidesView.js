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
				$('#upload-button').addClass('uploading');
				$('#upload-button').prop('disabled', true);
				slides.upload(function() {
					$('.upload-selection-panel').hide();
					$('#upload-button').removeClass('uploading');
					$('#upload-button').prop('disabled', false);
				});
			},
			goToSlide: function(event) {
				var goToIndex = event.target.value-1;
				slides.goToSlide(goToIndex);
			}
		}
	});

	vm.$watch('state', function() {
		var canvas = document.getElementById("whiteboard-canvas").fabric;
		var parent = $('.slide');
		canvas.setWidth(parent.width());
		canvas.setHeight(parent.height());
	}, {deep: true});
	return vm;
};

module.exports.init = SlidesView;