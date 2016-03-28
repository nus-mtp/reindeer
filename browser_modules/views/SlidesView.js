var Vue = require('vue');

var SlidesView = function(socket, slides){
	//Vue.config.debug = true;
	return new Vue({
		el:'#slides-container',
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
			}
		}
	});
};

module.exports.init = SlidesView;