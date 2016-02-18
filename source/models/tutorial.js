var express = require ('express');
var sequelize = require ('../sequelize');
var Sequelize = require ('sequelize');
var User = require ('./user');
var rest = require ('rest');
var app = require ('../../app');

var tutorial = sequelize.define ('tutorial', {
	id: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		unique: true,
		primaryKey: true
	},
	grouptype: {
		type: Sequelize.STRING,
	},
	name: {
		type: Sequelize.STRING,
	},
	courseid: {
		type: Sequelize.STRING,
	},
	coursecode: {
		type: Sequelize.STRING
	},
	coursename: {
		type: Sequelize.STRING
	},
	week: {
		type: Sequelize.STRING
	},
	day: {
		type: Sequelize.STRING
	},
	time: {
		type: Sequelize.STRING
	}
}, {
	indexes: [
		{
			name: 'name',
			fields: ['name']
		},
		{
			name: 'courseid',
			fields: ['courseid']
		}
	]
});

var userTutorial = sequelize.define ('userTutorial', {
	role: {
		type: Sequelize.ENUM,
		values: ['student', 'tutor'],
		allowNull: false
	},
	tutorialId: {
		type: Sequelize.UUID,
		references: {
			model: tutorial,
			key: 'id'
		}
	},
	userId: {
		type: Sequelize.STRING,
		references: {
			model: User,
			key: 'id'
		}
	}
}, {
	indexes: [
		{
			name: 'tutorialId',
			fields: ['tutorialId']
		},
		{
			name: 'userId',
			fields: ['userId']
		}
	]
})

User.belongsToMany (tutorial, {
	foreignKey: 'userId',
	through: 'userTutorial',
});

tutorial.belongsToMany (User, {
	foreignKey: 'tutorialId',
	through: 'userTutorial',
});

sequelize.sync ();

var findTutorial = function (uid, tid) {
	return tutorial.findAndCountAll ({
		where: {
			id: tid
		},
		include: [{
			model: User,
			attributes: ['id'],
			where: {id: uid}
		}]
	})
}

var findAndCountAllTutorials = function (uid) {
	return tutorial.findAndCountAll ({
		include: [{
			model: User,
			attributes: ['id'],
			where: {id: uid}
		}]
	});
}

var forceSyncIVLE = function (uid) {
	var apikey = app.get ('api-key');
	return new Promise (function (fulfill, reject) {
		User.findOne ({
			where: {
				id: uid
			},
		}).catch (function (err) {
			reject (err);
		}).then (function (user) {
			//view user modules
			rest ('https://ivle.nus.edu.sg/api/Lapi.svc/Modules?APIKey=' + apikey + '&AuthToken=' + user.token + '&Duration=0&IncludeAllInfo=false').then (function (response) {
				var courses = JSON.parse (response.entity).Results;
				if (courses.length == 0 && (response.status.code != 200)) {
					reject ('Sync Module Failed');
				}
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
						rest ('https://ivle.nus.edu.sg/API/Lapi.svc/GroupsByUserAndModule?APIKey=' + apikey + '&AuthToken=' + user.token + '&CourseID=' + courseid + '&AcadYear=' + acadyear + '&Semester=' + semester).then (function (response) {
								var groups = JSON.parse (response.entity).Results;
								if (groups.length == 0 && (response.status.code != 200)) {
									console.log (response)
									reject ('Sync GroupsByUserAndModule Failed');
								}
								for (groupIndex in groups) {
									var group = groups[groupIndex];
									if (group['GroupTypeCode'] === 'T') {
										tutorial.findOrCreate ({
											where: {
												name: group['GroupName'],
												courseid: group['CourseID']
											},
											defaults: {
												grouptype: group['GroupType'],
												coursecode: coursecode,
												coursename: coursename,
												week: group['Week'],
												day: group['Day'],
												time: group['Time']
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
						).then (fulfill (true)).catch (function (err) {
							reject (err);
						});
					}) (permission, coursename, coursecode);
				}
			}).catch (function (err) {
				reject (err);
			});
		});
	});
}

module.exports = tutorial;
module.exports.forceSyncIVLE = forceSyncIVLE;
module.exports.findTutorial = findTutorial;
module.exports.findAndCountAllTutorials = findAndCountAllTutorials;