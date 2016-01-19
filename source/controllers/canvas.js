/**
 * Canvas controller
 * @type {*|exports|module.exports}
 */

var express = require('express');

var get = function(req, res, next){
	var url = '/canvastest/' + req.params.id;

	res.render('canvastest', {
		title: 'Canvas Test',
		ip: req.app.get('server-ip')
	});
}

module.exports.get = get;