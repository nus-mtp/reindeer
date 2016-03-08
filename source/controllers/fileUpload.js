/**
 * File Upload controller
 * @type {*|exports|module.exports}
 */

var express = require('express');
var multer = require('multer');

var UserFile = require('../models/File');

//var get = function (req, res, next) {
//	res.send("Hello from the other side...");
//}
//
//var testPost = function (req, res, next) {
//	res.send(req.body);
//}
//
//var upload = function (req, res, next) {
//	console.log(req.file);
//	res.send(req.body);
//}

var get = function (req, res, next) {
	res.render('fileUpload', {
		title: 'File Upload',
		ip: req.app.get('server-ip')
	});
}

//var storage = multer.diskStorage({
//	destination: function (req, file, cb) {
//		cb(null, './public/uploads/')
//	}
//})
//var upload = multer({ storage: storage }).single('photo');

var uploadHandler = multer({ dest: './public/uploads/' });
var upload = uploadHandler.single('photo');

module.exports.get = get;
module.exports.upload = upload;
//module.exports.upload = upload;
//module.exports.getTestPage = getTestPage;
//module.exports.testPost = testPost;