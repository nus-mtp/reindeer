/**
 * A temporary UI Skeleton controller
 * @type {*|exports|module.exports}
 */

var express = require('express');

var get = function(req, res, next){
	var url = '/UISkeleton/' + req.params.id;

	res.render('UI/UISkeleton', {
		title: 'UI Skeleton',
		ip: req.app.get('server-ip')
	});
}

module.exports.get = get;