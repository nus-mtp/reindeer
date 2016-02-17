var express = require('express');
var auth = require('../auth');
var rest = require('rest');
var app = require('../../app');
var User = require('../models/user');

var get = function(req, res, next){
	res.render('dashboard',{
		ip: req.app.get("server-ip"),
		port: req.app.get("server-port")
	});
}

var refreshTutorials = function(req, res, next){
	auth.verify(req.body.token, function(err, decoded){
		if (err){
			res.json({success:false, message:'Login Required'});
		}else {
			User.findOne({where:{id:decoded.id}}).then(function(user){
				var ivleToken = user.token;

				console.log(ivleToken);
				rest('https://ivle.nus.edu.sg/api/Lapi.svc/Modules?APIKey='+app.get('api-key')+'&AuthToken='+ivleToken+'&Duration=0&IncludeAllInfo=false').then( function(response){
					res.json({success:true, result:JSON.parse(response.entity)});
				});
			})

		}
	})
}

module.exports.get = get;
module.exports.refreshTutorials = refreshTutorials;