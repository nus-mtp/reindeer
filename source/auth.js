/**
 * Auth wrapper
 * @type {*|exports|module.exports}
 */
var fs = require ('fs');
var express = require ('express');
var app = require ('../app');
var user = require ('./models/user.js');
var jwt = require ('jsonwebtoken');


/**
 * protectCSRF ensure Fully Authentication check by ignoring cookies
 * Client must attached its token within post body, url or headers
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
var protectCSRF = function (req, res, next) {
	req.cookies.token = null;
	return next ();
}

/**
 * ensureAuth is a middleware which filter the json token for verifying login
 * @param req
 * @param res
 * @param next
 *
 * usage:
 * in router.js ---router.use('*some url*', auth.ensureAuth, *next middleware function*)
 * in next middleware ---var middleware = function(req, res, next){var authResult = req.body.auth}
 */
var ensureAuth = function (req, res, next) {
	//Get token from body or query or headers
	var token = req.body.token || req.query.token || req.headers['token'] || req.cookies.token;
	if (token) {
		return jwt.verify (token, app.get ('jwt-secret'), function (err, decoded) {
			if (err) {
				req.body.auth = {
					success: false,
					message: 'Invalid'
				};
				return next ();
			} else {
				req.body.auth = {
					success: true,
					decoded: decoded
				};
				return next ();
			}
		});
	} else {
		req.body.auth = {
			success: false,
			message: 'Null'
		};
		return next ();
	}

	// have not yet implemented else!!!!
};

/**
 * provide api function for authorization (currently not usable)
 * @param req
 * @param res
 * @returns {res.json(response)}
 */
var api = function (req, res) {
	if (req.body.auth.success) {
		var response = {
			success: true,
			message: 'Login Successful!'
		};
		return res.json (response);
	} else {
		var response = {
			success: false,
			message: 'Login Failed!'
		};
		return res.json (response);
	}
};

/**
 * auth is a middleware provide function for login use and set authorization info
 * @param req
 * @param res
 * @param next
 * usage:
 * use like ensureAuth before login controller
 */
var setAuth = function (id, name) {
	var tmpuser = {};
	tmpuser.id = id;
	tmpuser.name = name

	//set token
	var token = jwt.sign (tmpuser, app.get ('jwt-secret'), {
		expiresIn: '30d'
	});
	return token;
};

module.exports.protectCSRF = protectCSRF;
module.exports.ensureAuth = ensureAuth;
module.exports.setAuth = setAuth;
module.exports.api = api;
