var Vue = require('vue');

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
			}
		}
	});

	vm.$watch('state.listOfSlideObjects', function (val) {
		var canvas = document.getElementById("whiteboard-canvas").fabric;
		var parent = $('.slide');
		canvas.setWidth(parent.width());
		canvas.setHeight(parent.height());
	})

	return vm;
};

module.exports.init = SlidesView;