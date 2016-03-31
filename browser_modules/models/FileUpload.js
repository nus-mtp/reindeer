var $ = jQuery = require('jquery');

function FileUpload(){

	var tutorialID = "<%= tutorialID %>";
	var form = document.getElementById('fileForm');
	var fileSelect = document.getElementById('fileSelect');
	var uploadButton = document.getElementById('uploadButton');
	var fileSpace = $('#file-space');

	// Load tutorial session file
	$.ajax({
		type: 'POST',
		dataType: 'json',
		url: ('http://localhost:3000/file/getFiles?tutorialID='+ tutorialID + '&token=' + Cookies.get('token')),
		success: function(data) {
			fileSpace.html(JSON.stringify(data));
		}
	});

	// File upload
//	form.onsubmit = function (event) {
//		event.preventDefault();
//
//		// Get the selected files from the input.
//		var files = fileSelect.files;
//		var file = files[0];
//
//		// Create a new FormData object.
//		var formData = new FormData();
//
//		if ((!file.type.match('image.*'))
//			&& (!file.type.match('\.pdf'))) {
//			alert("Sorry. The system only supports image files and PDF files.");
//
//		} else {
//			formData.append('userUpload', file, file.name);
//
////                $.ajax({
////                    type:'POST',
////                    data: formData,
////                    url: 'http://localhost:3000/file/upload?token=' + Cookies.get('token'),
////                    success: function(message) {
////                        console.log(messasge);
////                    }
////                });
//			// Set up the request.
//			var xhr = new XMLHttpRequest();
//
//			// Open the connection.
//			xhr.open('POST', 'http://localhost:3000/file/upload?tutorialID='+ tutorialID + '&token=' + Cookies.get('token'), true);
//			xhr.send(formData);
//		}
//	}
};

FileUpload.prototype.submit = function (event) {
	event.preventDefault();

	// Get the selected files from the input.
	var files = fileSelect.files;
	var file = files[0];

	// Create a new FormData object.
	var formData = new FormData();

	if ((!file.type.match('image.*'))
		&& (!file.type.match('\.pdf'))) {
		alert("Sorry. The system only supports image files and PDF files.");

	} else {
		formData.append('userUpload', file, file.name);

//                $.ajax({
//                    type:'POST',
//                    data: formData,
//                    url: 'http://localhost:3000/file/upload?token=' + Cookies.get('token'),
//                    success: function(message) {
//                        console.log(messasge);
//                    }
//                });
		// Set up the request.
		var xhr = new XMLHttpRequest();

		// Open the connection.
		xhr.open('POST', 'http://localhost:3000/file/upload?tutorialID='+ tutorialID + '&token=' + Cookies.get('token'), true);
		xhr.send(formData);
	}
}

module.exports = FileUpload;