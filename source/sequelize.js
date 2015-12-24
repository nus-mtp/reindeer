/**
 * Created by hlhr on 12/24/15.
 */
var express = require ('express');
var Sequelize = require ('sequelize');
var sequelize = new Sequelize ('express', 'express', 'testexpress', {
	host: '188.166.237.245',
	dialect: 'mysql',
	pool: {
		max: 10,
		min: 0,
		idle: 10000
	}
});

module.exports = sequelize;