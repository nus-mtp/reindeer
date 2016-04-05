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
				$('.upload-selection-panel').show();
			}
		}
	});

	return vm;
};

module.exports.init = SlidesView;