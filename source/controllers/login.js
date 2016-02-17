var express = require ('express');
var rest = require ('rest');
var auth = require ('../auth');
var app = require ('../../app');
var Tutorial = require ('../models/tutorial');
var User = require ('../models/user');

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
		if (result != undefined) {
			result.Token = ivleToken;

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
				var authToken = auth.setAuth (result.UserID, result.Name);

				//view user modules
				rest ('https://ivle.nus.edu.sg/api/Lapi.svc/Modules?APIKey=' + apikey + '&AuthToken=' + ivleToken + '&Duration=0&IncludeAllInfo=false').then (function (response) {
					var courses = JSON.parse (response.entity).Results;

					for (courseIndex in courses) {
						var course = courses[courseIndex];
						var permission = course['Permission'];
						var courseid = course['ID'];
						var acadyear = course['AcadYear'];
						var semester = course['Semester'];
						var coursecode = course['CourseCode'];
						var coursename = course['CourseName'];

						//Must use closure here because rest use asyn method and course info may be changed
						(function (permission, coursename, coursecode) {
							//view tutorial groups
							rest ('https://ivle.nus.edu.sg/API/Lapi.svc/GroupsByUserAndModule?APIKey=' + apikey + '&AuthToken=' + ivleToken + '&CourseID=' + courseid + '&AcadYear=' + acadyear + '&Semester=' + semester).then (function (response) {
									var tutorials = JSON.parse (response.entity).Results;
									//console.log (tutorials);
									for (tutorialIndex in tutorials) {
										var tutorial = tutorials[tutorialIndex];
										if (tutorial['GroupTypeCode'] === 'T') {
											Tutorial.findOrCreate ({
												where: {
													name: tutorial['GroupName'],
													courseid: tutorial['CourseID']
												},
												defaults: {
													grouptype: tutorial['GroupType'],
													coursecode: coursecode,
													coursename: coursename,
													week: tutorial['Week'],
													day: tutorial['Day'],
													time: tutorial['Time']
												}
											}).spread (function (tutorial, created) {
												var role = 'student';
												if (permission === 'M') {
													role = 'tutor';
												}
												//console.log ('Creating' + coursecode + group['GroupName']);
												tutorial.addUser (user, {role: role});
											});
										}
									}
								}
							);
						}) (permission, coursename, coursecode)

					}
				});
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