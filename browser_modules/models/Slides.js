var $ = jQuery = require('jquery');

function Slides(socket){
	var self = this;
	socket.on('connect', function(){
		self.socket = socket;
	});

	socket.on('slide_images', function(listOfSlideObjects) {
		self.state.listOfSlideObjects = listOfSlideObjects;
	});

	socket.on('slide_index', function(currentSlideIndex) {
		self.state.currentSlideIndex = currentSlideIndex;
	});

	this.state = {
		currentSlideIndex: 0,
		listOfSlideObjects: [
		],
	}
};

//place your functions as follow
Slides.prototype.nextSlide = function(){
	// emit to socket,
	// on reply we increase the count
	this.socket.emit('slide_next');
};

Slides.prototype.previousSlide = function(){
	// emit to socket,
	// on reply we decrease the count
	this.socket.emit('slide_previous');
};

module.exports = Slides;