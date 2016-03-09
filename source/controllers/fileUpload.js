/**
 * File Upload controller
 * @type {*|exports|module.exports}
 */

var express = require('express');
var multer = require('multer');
var filesysManager = require('./filesysManager');

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
 * */

var fileHandler = function (req, res, next) {
	if (req.body.auth.success) {
		var userID = req.body.auth.decoded.id;
		var destPath = filesysManager.getUserDirectory(userID);
		var uploadHandler = multer({dest: destPath}).single('userUpload');
		uploadHandler(req, res, next);
	} else {
		res.send("Permission Denied");
	}
};



module.exports.get = get;
module.exports.fileHandler = fileHandler;
