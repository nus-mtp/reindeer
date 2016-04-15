/**
 * File Upload controller
 * @type {*|exports|module.exports}
 */

var express = require('express');
var multer = require('multer');
var filesysManager = require('./filesysManager');
var Rooms = require('../models/Rooms');
var app = require('../../app');
var PDFParser = require('../lib/PDFParser');
var path = require('path');

var get = function (req, res, next) {
	if (req.body.auth.success) {
		var tutorialID = req.params.tutorialid;
		var moduleCode = req.params.modulecode;
		var groupName = req.params.groupname;

		var workbinName = moduleCode + " - " + groupName;

		res.render('fileUpload', {
			tutorialID: tutorialID,
			workbinName: workbinName
		});
	} else {
		res.send("Permission Denied");
	}
};


/**
 * Direct Upload File to Session Folder
 *
 * File Limitation:
 * 	- Restrict mimetype to 'application/pdf' and 'image/jpeg' only
 * 	- Max size of a single file <= 30Mb
 * */
var fileHandler = function (req, res, next) {
	if (req.body.auth.success) {
		var userID = req.body.auth.decoded.id;
		var tutorialID = req.query.tutorialID;

		if (Rooms.hasUser(tutorialID, userID)) {
			// Initialize file info field
			req.uploadfileInfo = {};

			var destFolderPath = filesysManager.getSessionDirectory(tutorialID);

			var storage = multer.diskStorage({
				destination: function (req, file, cb) {
					cb(null, destFolderPath);
				},
				filename: function (req, file, cb) {
					var diskFileName = Date.now() + '-' + file.originalname;

					req.uploadfileInfo.fileName = file.originalname;
					req.uploadfileInfo.filePath = destFolderPath + '/' + diskFileName;

					cb(null, diskFileName);
				}
			});

			var fileFilter = function(req, file, cb) {
				if (filesysManager.isValidFileTypeUpload(file.mimetype)) {
					req.uploadfileInfo.mimetype = file.mimetype;
					cb(null, true);
				} else {
					cb(new Error('Invalid file type'));
				}
			};

			var limits = {
				fileSize: app.get('MAX_FILE_SIZE')
			};

			var uploadHandler = multer({storage:storage, fileFilter: fileFilter, limits: limits}).single('userUpload');
			uploadHandler(req, res, function(err){
				if (err) {
					res.send("Upload Fail");
				} else {
					filesysManager.saveFileInfoToDatabase(
							tutorialID,
							userID,
							req.uploadfileInfo.fileName,
							req.uploadfileInfo.mimetype,
							req.uploadfileInfo.filePath
					).then(function(result){
						// Move uploaded file to presentation folder
						if (filesysManager.isPDF(req.uploadfileInfo.mimetype)) {
							var fileID = result.dataValues.id;
							// *****************
							// Presentation do conversion
							// *****************
							var pathToPdf = '';
							var pathToPresentationFolder = '';
							filesysManager.getFilePath(fileID).then(function(results) {
								pathToPdf = results;
								filesysManager.getPresentationFileFolder(fileID).then(function(pathToFolder) {
									pathToPresentationFolder = pathToFolder;
									PDFParser(pathToPdf, pathToPresentationFolder, fileID, function(info) {
										var numberOfPagesInPDF = info.length;
										// Rewrite paths
										for (var i = 0; i < numberOfPagesInPDF; ++i) {
											info[i]['path'] = "/file/getFile/"+tutorialID+"/"+fileID+"/"+info[i]['name'];
										}
										var group = Rooms.getLobby().get(tutorialID).get('default');
										var presentations = group.presentations;
										var presentationID = presentations.newPresentation(info);

										console.log(presentations.getCurrentPresentation().getAllSlidesAsJSON());
										res.send({
											uploadStatus: "success",
											presentationID: presentationID,
											fileID: fileID
										});
										// Update presentation model here
										// Then notify users through socket
									})
								})
							});
						} else {
							// *****************
							// Presentation just move the image to presentation folder
							// *****************

						}
						//res.send("Upload Successful");
					})
				}
			});
		} else {
			res.send("Permission Denied");
		}
	} else {
		res.send("Permission Denied");
	}
};


/**
 * Get all the files of a session
 * */
var getSessionFiles = function(req, res, next) {
	if (req.body.auth.success) {
		var userID = req.body.auth.decoded.id;
		var sessionID = req.query.tutorialID || req.body.tutorialID;

		if (Rooms.hasUser(sessionID, userID)) {
			filesysManager.getAllSessionFiles(sessionID).then(function (result) {
				res.send({sessionFiles: result});
			});
		} else {
			res.send("Permission Denied");
		}
	} else {
		res.send("Permission Denied");
	}
};

var getSessionFile = function(req, res, next) {
	if (req.body.auth.success) {
		//var userID = req.body.auth.decoded.id;
		//var sessionID = req.query.tutorialID || req.body.tutorialID;
		var fileID = req.params.fileID;
		var fileName = req.params.filename;
		var sessionID = req.params.sessionID;
		var appDir = path.dirname(require.main.filename);
		res.sendFile(appDir + '/fileuploads/sessionfiles/'+ sessionID + '/presentationFiles/' + fileID + '/' + fileName);
        //
		//if (Rooms.hasUser(sessionID, userID)) {
		//	var appDir = path.dirname(require.main.filename);
		//	var fileID = req.params.fileID;
		//	var fileName = req.params.filename;
		//	res.sendFile(appDir + '/fileuploads/sessionfiles/'+ fileID + '/presentationFiles/' + fileID + '/' + fileName);
		//} else {
		//	res.send("Permission Denied");
		//}
	} else {
		res.send("Permission Denied");
	}
}

var deleteFile = function(req, res, next){
	if (req.body.auth.success){
		var userID = req.body.auth.decoded.id;
		var fileID = req.query.fileID;
		res.send(filesysManager.removeUserFile(fileID, userID));
	} else {
		res.send(false);
	}
}

module.exports.get = get;
module.exports.fileHandler = fileHandler;
module.exports.getSessionFiles = getSessionFiles;
module.exports.getSessionFile = getSessionFile;
module.exports.deleteFile = deleteFile;
