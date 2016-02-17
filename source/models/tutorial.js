var express = require('express');
var sequelize = require('../sequelize');
var Sequelize = require('sequelize');
var User = require('./user');

var tutorial = sequelize.define('tutorial', {
	name: {
		type: Sequelize.STRING,
		unique:'compositeIndex'
	},
	courseid:{
		type:Sequelize.STRING,
		unique:'compositeIndex'
	},
	coursecode:{
		type:Sequelize.STRING
	},
	coursename:{
		type:Sequelize.STRING
	},
	datetime:{
		type: Sequelize.STRING
	}
},{

});

sequelize.sync();

module.exports = tutorial;