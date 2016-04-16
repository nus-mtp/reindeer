/**
 * @module controllers/login
 * @type {rest|exports|module.exports}
 */

var rest = require ('rest');
var auth = require ('../auth');
var app = require ('../../app');
var Tutorial = require ('../models/Tutorial');
var User = require ('../models/User');
var logger = require ('../logger').serverLogger;

var protocol = 'https';
var usehttps = app.get ('use-https');
if (!usehttps) {
	protocol = 'http';
}

/**
 * Render login page
 * return HTML
 * @param req
 * @param res
 * @param next
 */
var get = function (req, res, next) {
	var auth = req.body.auth;
	if (auth.success) {
		res.redirect ('/');
	}
	//user login and callback
	else res.redirect ('https://ivle.nus.edu.sg/api/login/?apikey=dQ52oB9BDUvIKSsyntdtW&url=' + protocol + '://' + app.get ('server-ip') + ':' + app.get ('server-port') + '/login/callback');
}

/**
 * Callback function after IVLE login
 * return HTML|{success,at,message}
 * @param req
 * @param res
 * @param next
 */
var callback = function (req, res, next) {
	var ivleToken = req.query.token;
	var apikey = app.get ('api-key');
	//console.log (apikey);

	//view profile
	rest ('https://ivle.nus.edu.sg/api/Lapi.svc/Profile_View?APIKey=' + apikey + '&AuthToken=' + ivleToken).then (function (response) {

		var result = JSON.parse (response.entity).Results[0];
		if (result != undefined) {
			result.Token = ivleToken;


			User.findOne({
				where:{
					id: result.UserID
				}
			}).then(function(user){
				if (!user){
					User.create({
						id: result.UserID,
						name: result.Name,
						email: result.Email,
						gender: result.Gender,
						token: result.Token,
					}).then(function(user){
						var authToken = auth.setAuth (result.UserID, result.Name);
						logger.info(result.UserID + ' created user');
						return res.render ('login/callback_success', {token: authToken});
					}).catch(function(err){
						logger.error(result.UserID + ' create user failed');
						return res.json({success:false, at:'Create user', message:err});
					});
				} else {
					User.update({
						token: result.Token
					},{
						where:{
							id:result.UserID
						}
					}).then(function(user){
						var authToken = auth.setAuth (result.UserID, result.Name);
						logger.info(result.UserID + ' updated user information');
						return res.render ('login/callback_success', {token: authToken});
					}).catch(function(err){
						logger.error(result.UserID + ' update user information failed');
						return res.json({success:false, at:'Update user information', message:err});
					});
				}
			});
		}
		else {
			logger.error('Sync IVLE user information failed, cannot resolve IVLE information');
			return res.json({success: false, at:'Sync IVLE user information', message:'cannot resolve IVLE information'});
		}
	}).catch(function(err){
		logger.error('Sync IVLE user information failed, cannot connect IVLE');
		return res.json({success: false, at:'Sync IVLE user information', message:'cannot connect IVLE'});
	})
}

module.exports.get = get;
module.exports.callback = callback;