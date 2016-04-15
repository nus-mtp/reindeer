/**
 * User controller
 * @type {*|exports|module.exports}
 */

var express = require('express');
var user = require('../models/User');

var get = function(req, res, next){
	res.render('users', {
		title: user.getname(req.params.id)
	});
}

module.exports.get = get;