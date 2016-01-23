var express = require('express');
var User = require('../models/user');
var rest = require('rest');
var auth = require('../auth');

var get = function(req, res, next) {
	res.redirect('https://ivle.nus.edu.sg/api/login/?apikey=dQ52oB9BDUvIKSsyntdtW&url=http://localhost:3000/login/callback');
}

var callback = function(req, res, next){
	var token = req.query.token;
	var apikey = req.app.get('apikey');
	console.log(apikey);

	rest('https://ivle.nus.edu.sg/api/Lapi.svc/Profile_View?APIKey='+apikey+'&AuthToken='+token).then(function(response){
		var result = JSON.parse(response.entity).Results[0];
		if(result!=undefined){
			result.Token = token;
			User.findOrCreate({
				where:{
					id:result.UserID
				},
				defaults:{
					name: result.Name,
					email: result.Email,
					gender: result.Gender,
					token: result.Token,
				}
			}).then(function(user){
				var authToken = auth.setAuth(result.UserID, result.Name);

				return res.render('login/callback_success', {token: authToken});
			})
		}
		else res.json(result);
	});
}

var post = function(req, res, next){

}

module.exports.get = get;
module.exports.callback = callback;