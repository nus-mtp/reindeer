var $ = jQuery = require('jquery');
var Cookies = require('js-cookie');

function Slides(socket, tutorialID){
	this.tutorialID = tutorialID;
	var self = this;
	socket.on('connect', function(){
		self.socket = socket;
	});

	socket.on('slide_images', function(listOfSlideObjects) {
		self.state.listOfSlideObjects = listOfSlideObjects;
	});

	socket.on('slide_index', function(currentSlideIndex) {
		self.state.currentSlideIndex = currentSlideIndex;
		self.state.goToIndex = currentSlideIndex + 1;
	});

	socket.on('slide_available_presentations', function(availablePresentations) {
		self.state.availablePresentations = availablePresentations;
		//console.log(availablePresentations);
	});

	socket.on('slide_presentation_id', function(currentPresentationID) {
		self.state.currentPresentationID = currentPresentationID;
	});

	socket.on('slide_count', function(slideCount) {
		self.state.slideCount = slideCount;
	});

	this.state = {
		goToIndex: undefined,
		currentSlideIndex: 0,
		listOfSlideObjects: [],
		availablePresentations: [],
		currentPresentationID: 0,
		slideCount: undefined,
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

Slides.prototype.goToSlide = function(slideIndex) {
	this.socket.emit('slide_go_to', slideIndex);
}

Slides.prototype.switchPresentation = function(presentationID) {
	this.socket.emit('slide_switch_presentation', presentationID);
}

Slides.prototype.newBlankPresentation = function() {
	this.socket.emit('slide_new_blank_presentation');
}

Slides.prototype.upload = function(callback) {
	var self = this;
	function readBody(xhr) {
		var data;
		if (!xhr.responseType || xhr.responseType === "text") {
			data = xhr.responseText;
		} else if (xhr.responseType === "document") {
			data = xhr.responseXML;
		} else {
			data = xhr.response;
		}
		return data;
	}

	// Get the selected files from the input.
	var fileSelect = document.getElementById('fileSelect');
	var files = fileSelect.files;
	var file = files[0];

	// Create a new FormData object.
	var formData = new FormData();

	if ((!file.type.match('image.*'))
		&& (!file.type.match('\.pdf'))) {
		alert("Sorry. The system only supports image files and PDF files.");

	} else {
		formData.append('userUpload', file, file.name);

		// Set up the request.
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				var jsonResponse = JSON.parse(xhr.response);
				console.log(jsonResponse)
				if (jsonResponse.uploadStatus) {
					self.socket.emit('slide_upload_success', jsonResponse.presentationID);
					callback();
				}
			}
		}

		// Open the connection.
		xhr.open('POST', 'http://localhost:3000/file/upload?tutorialID='+ this.tutorialID + '&token=' + Cookies.get('token'), true);
		xhr.send(formData);
	}
}

module.exports = Slides;
