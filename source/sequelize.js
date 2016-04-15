/**
 * Sequelize wrapper
 * @type {*|exports|module.exports}
 */
var express = require ('express');
var app = require('../app');
var Sequelize = require ('sequelize');
var logger = require('./logger').dbLogger;
var fs = require('fs');

var sequelize = new Sequelize (app.get('db-name'), app.get('db-username'), app.get('db-password'), {
	host: app.get('db-host'),
	dialect: app.get('db-dialect'),
	pool: {
		max: 10,
		min: 0,
		idle: 10000
	},
	logging: function(str) {
		logger.info(str);
	}
});

module.exports = sequelize;