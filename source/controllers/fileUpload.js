/**
 * File Upload controller
 * @type {*|exports|module.exports}
 */

var express = require('express');
var multer = require('multer');

var UserFile = require('../models/File');

var get = function (req, res, next) {
	res.render('fileUpload', {
		title: 'File Upload',
		ip: req.app.get('server-ip')
	});
};

var uploadHandler = multer({ dest: './public/uploads/' });
var upload = uploadHandler.single('photo');

module.exports.get = get;
module.exports.upload = upload;