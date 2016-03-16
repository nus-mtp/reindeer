var Vue = require('vue');

var SlideView = function(socket, slide){
	return new Vue({
		el:'',
		data:{
			state:slide.state,
			//put local variables here
		},
		methods:{
			//put local methods here
		}
	});
};

module.exports.init = SlideView;