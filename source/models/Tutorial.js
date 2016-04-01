var express = require ('express');
var sequelize = require ('../sequelize');
var Sequelize = require ('sequelize');
var User = require ('./User');
var rest = require ('rest');
var app = require ('../../app');
var Rooms = require('./Rooms');

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
});

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
};

var findTutorialTutorID = function (tid) {
	return userTutorial.find (
		{
			attributes: ['userId'],
			where: {
				tutorialId: tid,
				role: 'tutor'
			}
		}
	);
};

var checkIfInTutorialUserList = function (uid, tid) {
	return userTutorial.find (
		{
			where: {
				tutorialId: tid,
				userId: uid
			}
		}
	);
}

var findAndCountAllTutorials = function (uid) {
	return tutorial.findAndCountAll ({
		include: [{
			model: User,
			attributes: ['id'],
			where: {id: uid}
		}]
	});
};

var findAndCountAllUsersInTutorial = function(tid){
	return userTutorial.findAndCountAll({
		where:{
			tutorialId:tid
		}
	});
};

/**
 * Private function, fetch IVLE user modules, return promise
 * @param token
 * @returns {*}
 */
var fetchIVLEUserModules = function (token) {
	return rest ('https://ivle.nus.edu.sg/api/Lapi.svc/Modules?APIKey=' + app.get ('api-key') + '&AuthToken=' + token + '&Duration=0&IncludeAllInfo=false');
}

/**
 * Private function, fetch IVLE tutorial groups, return promise
 * @param token
 * @param course
 * @returns {*}
 */
var fetchIVLETutorialGroups = function (token, course) {
	return rest ('https://ivle.nus.edu.sg/API/Lapi.svc/GroupsByUserAndModule?APIKey=' + app.get ('api-key') + '&AuthToken=' + token + '&CourseID=' + course['ID'] + '&AcadYear=' + course['AcadYear'] + '&Semester=' + course['semester']).then (function (response) {
		return {tutorialGroup: JSON.parse (response.entity).Results, course: course};
	});
}

var forceSyncIVLE = function (uid) {
	return new Promise (function (fulfill, reject) {
		User.findOne ({
			where: {
				id: uid
			},
		}).then (function (user) {
			return fetchIVLEUserModules (user.token).then (function (response) {
				//console.log(JSON.parse(response.entity).Results);
				return [response, JSON.parse (response.entity).Results, user];
			});
		}).spread (function (response, courses, user) {
			//console.log(courses);
			if (courses.length == 0 && (response.status.code != 200)) {
				reject ('Sync Module Failed');
			}
			return Promise.all (courses.map (function (course) {
				//console.log(course);
				return fetchIVLETutorialGroups (user.token, course)
			})).then (function (result) {
				//console.log(result);
				if (result.length == 0) {
					return reject ('Sync Groups By User And Module Failed');
				}
				return [result, user];
			});
		}).spread (function (result, user) {
			//create tutorial in this block
			var groups = [];
			for (resultIndex in result) {
				for (groupIndex in result[resultIndex]['tutorialGroup']) {
					if (result[resultIndex]['tutorialGroup'][groupIndex]['GroupTypeCode'] === 'T') {
						var group = result[resultIndex]['tutorialGroup'][groupIndex];
						group['CourseName'] = result[resultIndex]['course']['CourseName'];
						group['Permission'] = result[resultIndex]['course']['Permission'];
						groups.push (group);
					}
				}
			}
			return Promise.all (groups.map (function (group) {
				return tutorial.findOrCreate ({
					where: {
						name: group['GroupName'],
						courseid: group['CourseID']
					},
					defaults: {
						grouptype: group['GroupType'],
						coursecode: group['ModuleCode'],
						coursename: group['CourseName'],
						week: group['Week'],
						day: group['Day'],
						time: group['Time']
					}
				}).spread (function (tutorial, created) {
					return tutorial;
				});
			})).then (function (tutorials) {
				return tutorials;
			}).then (function (tutorials) {
				return {tutorials: tutorials, user: user, groups: groups};
			})
		}).then (function (result) {
			//Add user tutorial relation in this block
			//console.log('aaaaaa');
			var tutorials = result.tutorials;
			var groups = result.groups;

			if (tutorials.length != groups.length) {
				return reject ('Database Error!');
			}
			var relations = [];
			for (groupIndex in groups) {
				var relation = {};
				relation['tutorial'] = tutorials[groupIndex];
				relation['permission'] = groups[groupIndex]['Permission'];
				relations.push (relation);
			}
			return Promise.all (relations.map (function (relation) {

				if (!Rooms.getLobby().get(relation['tutorial'].id)){
					//If room has not been created, create the room first
					//console.log(relation['tutorial'].id);
					var room = new Rooms.Room();
					Rooms.getLobby().addRoom(relation['tutorial'].id, room);
				}
				if (Rooms.getLobby().get(relation['tutorial'].id)){
					//If room has been created and user socket not exist in room, then add initialized user socket to the room storage
					if (!Rooms.getLobby().get(relation['tutorial'].id).get('default').get(result.user.id)){
						var socketClient = new Rooms.SocketClient(result.user.name, result.user.id,null);
						socketClient.regist(relation['tutorial'].id);
					}
				}
				var role = 'student';
				if (relation['permission'] === 'M') {
					role = 'tutor';
					Rooms.getLobby().get(relation['tutorial'].id).tutors[result.user.id] = Rooms.getLobby().get(relation['tutorial'].id).get('default').get(result.user.id);
				}
				return relation['tutorial'].addUser (result.user, {role: role});
			}));
		}).then (function (result) {
			if (result) {
				fulfill (true);
			}
		}).catch (function (err) {
			reject ('Sync Failed: ' + err);
		})
	});
};

var findTutorialSession = function (uid) {
	return userTutorial.findAll ({
		where: {
			userId: uid
		}
	});
};

module.exports = tutorial;
module.exports.forceSyncIVLE = forceSyncIVLE;
module.exports.findTutorial = findTutorial;
module.exports.findAndCountAllTutorials = findAndCountAllTutorials;
module.exports.findTutorialSession = findTutorialSession;
module.exports.findTutorialTutorID = findTutorialTutorID;
module.exports.checkIfInTutorialUserList = checkIfInTutorialUserList;
module.exports.findAndCountAllUsersInTutorial = findAndCountAllUsersInTutorial;