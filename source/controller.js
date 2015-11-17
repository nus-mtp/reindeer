var express = require('express');
var user = require('./model/user');
var socket = require('./socket');
socket.canvasconnect('/canvastest');
socket.messageconnect('/messagetest');
//setting render for index page
var index = function (req, res, next) {
	//console.log(req.app.get('server-ip'));
	res.render('index', {
		title: 'Express',
		ip: req.app.get('server-ip')
	});
}

//setting render for user page
var users = function (req, res, next) {
	res.render('users', {
		title: user.getname(req.params.id)
	});
	//this will get a params from url
	console.log(req.params.id);
}

//setting render for canvas test page
var canvas = function (req, res, next) {
	var url = '/canvastest/' + req.params.id;
	//console.log(url);

	res.render('canvastest', {
		title: 'Canvas Test',
		ip: req.app.get('server-ip')
	});
}

//setting render for message test page
var message = function (req, res, next) {
	var url = '/messagetest/' + req.params.id;
	//console.log(url);

	res.render('messagetest', {
		title: 'Message Test',
		ip: req.app.get('server-ip')
	});
}

module.exports.index = index;
module.exports.users = users;
module.exports.canvas = canvas;
module.exports.message = message;