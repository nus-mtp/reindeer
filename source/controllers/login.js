var express = require ('express');
var rest = require ('rest');
var auth = require ('../auth');
var app = require ('../../app');
var Tutorial = require ('../models/Tutorial');
var User = require ('../models/User');

var protocol = 'https';
var usehttps = app.get ('use-https');
if (!usehttps) {
	protocol = 'http';
}
var get = function (req, res, next) {
	var auth = req.body.auth;
	if (auth.success) {
		res.redirect ('/');
	}
	//user login and callback
	else res.redirect ('https://ivle.nus.edu.sg/api/login/?apikey=dQ52oB9BDUvIKSsyntdtW&url=' + protocol + '://' + app.get ('server-ip') + ':' + app.get ('server-port') + '/login/callback');
}

var callback = function (req, res, next) {
	var ivleToken = req.query.token;
	var apikey = app.get ('api-key');
	//console.log (apikey);

	//view profile
	rest ('https://ivle.nus.edu.sg/api/Lapi.svc/Profile_View?APIKey=' + apikey + '&AuthToken=' + ivleToken).then (function (response) {

		var result = JSON.parse (response.entity).Results[0];
		console.log(result);
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
						var authToken = auth.setAuth (user.id, user.name);
						return res.render ('login/callback_success', {token: authToken});
					}).catch(function(err){
						return res.json({success:false, message:err});
					});
				} else {
					User.update({
						token: result.Token
					},{
						where:{
							id:result.UserID
						}
					}).then(function(user){
						var authToken = auth.setAuth (user.id, user.name);
						return res.render ('login/callback_success', {token: authToken});
					}).catch(function(err){
						return res.json({success:false, message:err});
					});
				}
			})

			/*
			User.findOrCreate ({
				where: {
					id: result.UserID
				},
				defaults: {
					name: result.Name,
					email: result.Email,
					gender: result.Gender,
					token: result.Token,
				}
			}).spread (function (user, isNewuser) {
				//Tutorial.forceSyncIVLE (user.id).then (function (result) {});
				var authToken = auth.setAuth (user.id, user.name);
				return res.render ('login/callback_success', {token: authToken});
			})
			*/
		}
		else res.json (result);
	});
}

var post = function (req, res, next) {

}

module.exports.get = get;
module.exports.callback = callback;