var express = require('express');
var sequelize = require('./sequelize');
var Sequelize = require('sequelize');

var tutorial = sequelize.define('tutorial',{
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primarykey: true
	},
	datetime:{
		type: Sequelize.STRING,
	},


})