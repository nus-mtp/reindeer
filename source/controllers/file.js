/**
 * File Upload controller
 * @type {*|exports|module.exports}
 */

var express = require('express');
var multer = require('multer');
var filesysManager = require('./filesysManager');
var Rooms = require('../models/Rooms');
var app = require('../../app');

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

			var destPath = filesysManager.getSessionDirectory(tutorialID);

			var storage = multer.diskStorage({
				destination: function (req, file, cb) {
					cb(null, destPath);
				},
				filename: function (req, file, cb) {
					req.uploadfileInfo.fileName = file.originalname;
					cb(null, Date.now() + '-' + file.originalname);
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
							destPath
					).then(function(result){
						// Move uploaded file to presentation folder
						res.send("Upload Successful");

						if (filesysManager.isPDF(req.uploadfileInfo.mimetype)) {
							var fileID = result.dataValues.id;
							// *****************
							// Presentation do conversion
							// *****************

						} else {
							// *****************
							// Presentation just move the image to presentation folder
							// *****************

						}
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

module.exports.get = get;
module.exports.fileHandler = fileHandler;
module.exports.getSessionFiles = getSessionFiles;
