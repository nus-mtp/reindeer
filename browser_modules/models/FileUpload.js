var $ = jQuery = require('jquery');

function FileUpload(){
	this.fileSpace = [];
};

FileUpload.prototype.getFileList = function(tutorialID){
	var tutorialID = tutorialID;
	var self = this;
	$.ajax({
		type: 'POST',
		dataType: 'json',
		url: ('http://localhost:3000/file/getFiles?tutorialID='+ tutorialID + '&token=' + Cookies.get('token')),
		success: function(data) {
			var fileList = data.sessionFiles.fileList;
			for(var i=0; i<fileList.length;i++){
				var f = fileList[i];
				self.fileSpace.push({
					fileName: f.fileName,
					id: f.id,
					userID: f.userID
				});
			}
		}
	});
}

FileUpload.prototype.delete = function(index){
	var file = this.fileSpace[index];


	this.fileSpace.splice(index, 1);
}

FileUpload.prototype.submit = function (filepath) {
	var self = this;

	var fso = new ActiveXObject("Scripting.FileSystemObject");
	var file = fso.GetFile(filepath);

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
		xhr.open('POST', window.httpRoot+'/file/upload?tutorialID='+ self.tutorialID + '&token=' + Cookies.get('token'), true);
		xhr.send(formData);
	}
}

module.exports = FileUpload;