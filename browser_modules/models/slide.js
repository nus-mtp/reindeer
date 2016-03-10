var $ = jQuery = require('jquery');

function Slide(socket){
	var self = this;
	socket.on('connect', function(){
		self.socket = socket;
	});
	this.state = {

	}
};

//place your functions as follow
Slide.prototype.next = function(){};

module.exports = Slide;