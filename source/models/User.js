/**
 * @module models/User
 * @type {Sequelize|*|exports|module.exports}
 */

var sequelize = require('../sequelize');
var Sequelize = require('sequelize');

/**
 * Define User model
 * @type {Model}
 */
var user = sequelize.define('user', {
	id: {
		type: Sequelize.STRING,
		unique: true,
		primaryKey: true,
		validate: {
			notEmpty: true,
			isUnique: function(value, next) {
				user.find({
					where: {
						id: value
					}
				}).then(function (user) {
					if (user) {
						return next ('User already exist!');
					}
					return next ();
				}).catch(function (err) {
					return next (err);
				});
			}
		}
	},
	name: {
		type: Sequelize.STRING
	},
	email: {
		type: Sequelize.STRING
	},
	gender: {
		type: Sequelize.ENUM('Male', 'Female')
	},
	token: {
		type: Sequelize.STRING(511)
	},

}, {
	instanceMethods: {
		toJSON: function () {
			var values = this.get();
			delete values.token;
			return values;
		}
	},
});

sequelize.sync({});

module.exports = user;