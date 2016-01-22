/**
 * Message controller
 * @type {*|exports|module.exports}
 */
var express = require('express');

var get = function(req, res, next){
	var url = '/messagetest/' + req.params.id;

	res.render('messagetest', {
		title: 'Message Test',
		ip: req.app.get('server-ip')
	});
}

module.exports.get = get;