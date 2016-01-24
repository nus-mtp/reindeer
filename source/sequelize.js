/**
 * Sequelize wrapper
 * @type {*|exports|module.exports}
 */
var express = require ('express');
var Sequelize = require ('sequelize');
var fs = require('fs');
var config;
if (process.env.npm_config_c){
	config = JSON.parse(fs.readFileSync(process.env.npm_config_c, 'utf8'));
} else {
	config = JSON.parse(fs.readFileSync('config.json', 'utf8'))
}

var sequelize = new Sequelize (config['db-name'], config['db-username'], config['db-password'], {
	host: config['db-host'],
	dialect: config['db-dialect'],
	pool: {
		max: 10,
		min: 0,
		idle: 10000
	}
});

module.exports = sequelize;