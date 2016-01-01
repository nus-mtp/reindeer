/**
 * Index controller
 * @type {*|exports|module.exports}
 */
var express = require('express');

var get = function (req, res, next) {
	res.render('index', {
		title: 'Express',
		ip: req.app.get('server-ip')
	});
}

module.exports.get = get;