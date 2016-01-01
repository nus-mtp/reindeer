/**
 * User controller
 * @type {*|exports|module.exports}
 */

var express = require('express');
var user = require('../models/user');

var get = function(req, res, next){
	res.render('users', {
		title: user.getname(req.params.id)
	});
	console.log(req.params.id);
}

module.exports.get = get;