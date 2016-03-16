var Vue = require('vue');

var CanvasView = function(socket, canvas){
	return new Vue({
		el:'',
		data:{
			state:canvas.state,
			//put local variables here
		},
		methods:{
			//put local methods here
		}
	});
};

module.exports.init = CanvasView;