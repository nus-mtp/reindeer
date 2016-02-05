/**
 * File Upload controller
 * @type {*|exports|module.exports}
 */

var express = require('express')
var multer = require('multer')

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

module.exports.get = get;
//module.exports.upload = upload;
//module.exports.getTestPage = getTestPage;
//module.exports.testPost = testPost;