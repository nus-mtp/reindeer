/**
 * File Upload controller
 * @type {*|exports|module.exports}
 */

var express = require('express');
var multer = require('multer');
var filesysManager = require('./filesysManager');
var app = require('../../app');

var UserFile = require('../models/File');

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
		var destPath = filesysManager.getUserDirectory(userID);

		var storage = multer.diskStorage({
			destination: function (req, file, cb) {
				cb(null, destPath);
			},
			filename: function (req, file, cb) {
				cb(null, Date.now() + '-' + file.originalname);
			}
		});

		var fileFilter = function(req, file, cb) {
			if (filesysManager.isValidFileTypeUpload(file.mimetype)) {
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
				filesysManager.saveFileInfoToDatabase(userID, filepath);
				res.send("Upload Successful");
			}
		});
	} else {
		res.send("Permission Denied");
	}
};


module.exports.get = get;
module.exports.fileHandler = fileHandler;
