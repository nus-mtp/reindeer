/**
 * Index controller
 * @type {*|exports|module.exports}
 */
var express = require('express');

var get = function (req, res, next) {
	var auth = req.body.auth;
	var user;
	if (auth.success){
		console.log(auth);
		user = auth.decoded;
	}
	res.render('index', {
		title: 'Reindeer - Login',
		user: user,
		ip: req.app.get("server-ip"),
		port: req.app.get("server-port")
	});

}

module.exports.get = get;