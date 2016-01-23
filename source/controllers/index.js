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
		title: 'Express',
		user: user
	});

}

module.exports.get = get;