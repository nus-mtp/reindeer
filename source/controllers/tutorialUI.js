/**
 * A temporary UI Skeleton controller
 * @type {*|exports|module.exports}
 */

var express = require('express');

var get = function(req, res, next){
	var url = '/tutorialUI/' + req.params.id;

	res.render('UI/tutorialUI', {
		title: 'Tutorial UI',
		ip: req.app.get('server-ip')
	});
}

module.exports.get = get;