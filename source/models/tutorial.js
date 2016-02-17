var express = require ('express');
var sequelize = require ('../sequelize');
var Sequelize = require ('sequelize');
var User = require ('./user');

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
			name:'name',
			fields: ['name']
		},
		{
			name:'courseid',
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
	}
}, {
	indexes: [
		{
			name:'tutorialId',
			fields: ['tutorialId']
		},
		{
			name:'userId',
			fields: ['userId']
		}
	]
})

User.belongsToMany (tutorial, {
	constraints: false,
	foreignKey: 'userId',
	through: 'userTutorial',
	as: 'tutorial'
});

tutorial.belongsToMany (User, {
	constraints: false,
	foreignKey: 'tutorialId',
	through: 'userTutorial',
	as: 'user'
})

sequelize.sync ();

module.exports = tutorial;