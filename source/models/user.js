var express = require('express');
var sequelize = require('../sequelize');
var Sequelize = require('sequelize');
var name = 'testname';

var getname = function(inname){
	return inname;
}


var user = sequelize.define('user', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	email: {
		type: Sequelize.STRING,
		unique: true,
		validate: {
			isEmail: true,
			notEmpty: true,
			isUnique: function (value, next) {
				user.find({
					where: {
						email: value
					}
				}).then(function (user) {
					if (user) {
						return next ('Email already exist!');
					}
					return next ();
				}).catch(function (err) {
					return next (err);
				});
			}
		}
	},
	password: {
		type: Sequelize.STRING
	},
	name: {
		type: Sequelize.STRING
	},
	gender: {
		type: Sequelize.ENUM,
		values: ['male', 'female']
	},
	birth: {
		type: Sequelize.DATEONLY
	},
	role: {
		type: Sequelize.ENUM,
		values: ['tutor', 'general']
	},
	resetToken: {
		type: Sequelize.STRING
	},
	resetExpiry: {
		type: Sequelize.DATE
	}
}, {
	instanceMethods: {
		toJSON: function () {
			var values = this.get();
			delete values.password;
			return values;
		}
	},
	indexes: [{
		unique: true,
		fields: ['email']
	}, {
		fields: ['name']
	}]
});

sequelize.sync({force:true});

module.exports = user;
module.exports.getname = getname;