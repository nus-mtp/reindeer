var express = require ('express');
var User = require ('../models/user');
var rest = require ('rest');
var auth = require ('../auth');
var app = require ('../../app');
var Tutorial = require('../models/tutorial');

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
	else res.redirect ('https://ivle.nus.edu.sg/api/login/?apikey=dQ52oB9BDUvIKSsyntdtW&url='+protocol+'://' + app.get ('server-ip') + ':' + app.get ('server-port') + '/login/callback');
}

var callback = function (req, res, next) {
	var token = req.query.token;
	var apikey = app.get ('api-key');
	console.log (apikey);

	//view profile
	rest ('https://ivle.nus.edu.sg/api/Lapi.svc/Profile_View?APIKey=' + apikey + '&AuthToken=' + token).then (function (response) {
		var result = JSON.parse (response.entity).Results[0];
		if (result != undefined) {
			result.Token = token;

			//view user modules
			rest('https://ivle.nus.edu.sg/api/Lapi.svc/Modules?APIKey=' + apikey + '&AuthToken=' + token+'&Duration=0&IncludeAllInfo=false').then(function(response){
				var courses = JSON.parse(response.entity).Results;
				for(idx in courses){
					var isManager = courses[idx]['Permission'];
					if (isManager === 'M'){
						var courseid = courses[idx]['ID'];
						var acadyear = courses[idx]['AcadYear'];
						var semester = courses[idx]['Semester'];
						//view tutorial groups
						rest('https://ivle.nus.edu.sg/API/Lapi.svc/GroupsByUserAndModule?APIKey='+apikey+'&AuthToken='+token+'&CourseID='+courseid+'&AcadYear='+acadyear+'&Semester='+semester).then(function(response){
							console.log(JSON.parse(response.entity));

						});
					}
				}
			});
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
			}).then (function (user) {
				var authToken = auth.setAuth (result.UserID, result.Name);

				return res.render ('login/callback_success', {token: authToken});
			})
		}
		else res.json (result);
	});
}

var post = function (req, res, next) {

}

module.exports.get = get;
module.exports.callback = callback;