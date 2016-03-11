/**
 * File Upload controller
 * @type {*|exports|module.exports}
 */

var express = require('express');
var multer = require('multer');
var filesysManager = require('./filesysManager');
var tutorialSessionManager = require('./tutorialSessionManager');
var app = require('../../app');

var get = function (req, res, next) {
	if (req.body.auth.success) {
		res.render('fileUpload', {
			title: 'File Upload',
			ip: req.app.get('server-ip')
		});
	} else {
		res.send("Permission Denied");
	}
};


/**
 * Direct Upload File to User Folder
 *
 * File Limitation:
 * 	- Restrict mimetype to 'application/pdf' and 'image/jpeg' only
 * 	- Max size of a single file <= 30Mb
 * */
var fileHandler = function (req, res, next) {
	if (req.body.auth.success) {
		var userID = req.body.auth.decoded.id;
		var tutorialID = req.body.tutorialID;

		if (tutorialSessionManager.hasPermissionToJoinTutorial(userID, tutorialID)) {
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
					);
					res.send("Upload Successful");
				}
			});
		} else {
			res.send("Permission Denied");
		}
	} else {
		res.send("Permission Denied");
	}
};

var getSessionFiles = function(req, res, next) {
	if (req.body.auth.success) {
		var userID = req.body.auth.decoded.id;
		filesysManager.getAllSessionFiles(userID).then(function (result) {
			res.send({sessionFiles: result});
		});
	} else {
		res.send("Permission Denied");
	}
};

module.exports.get = get;
module.exports.fileHandler = fileHandler;
module.exports.getSessionFiles = getSessionFiles;
