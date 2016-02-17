var express = require('express');
var auth = require('../auth');
var rest = require('rest');
var app = require('../../app');
var User = require('../models/user');

var protocol = 'https';
var usehttps = app.get ('use-https');
if (!usehttps) {
	protocol = 'http';
}

var get = function(req, res, next){
	res.render('dashboard',{
		ip: app.get('server-ip'),
		port: app.get('server-port'),
		urls: {
			refreshTutorials:protocol+'://'+app.get('server-ip')+':'+app.get('server-port')+'/api/dashboard/refreshtutorials'
		}
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
				rest('https://ivle.nus.edu.sg/api/Lapi.svc/Modules?APIKey='+app.get('api-key')+'&AuthToken='+ivleToken+'&Duration=0&IncludeAllInfo=false').then(function(response){
					var courses = JSON.parse(response.entity).Results;
					var tutorials = {};
					for (idx in courses){
						tutorials[courses[idx]['ID']] = courses[idx]['CourseName'];
						console.log(courses[idx]['ID']);
					}
					res.json({success:true, result:tutorials});
				});
			})

		}
	})
}

module.exports.get = get;
module.exports.refreshTutorials = refreshTutorials;