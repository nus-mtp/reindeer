/**
 * Tutorial controller
 * @type {*|exports|module.exports}
 */
var express = require('express');

var rooms = [];

/**
 * Default get method
 * @param req
 * @param res
 * @param next
 */
var get = function(req, res, next){
	res.render('tutorial',{roomId:req.params.id});
}

/**
 * create room RESTFUL API in post method
 * @param req
 * @param res
 * @param next
 */
var createRoom = function(req, res, next){
	//not yet implemented!
	rooms[1] = {id:1, group:[]};
	console.log(rooms);
	res.json({successful:true, at:'room creation', room:rooms[1]});
}

/**
 * get room parameters RESTFUL API in post method
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
var roomParams = function (req, res, next){
	//not yet implemented!
	var roomId = req.body.roomId
	if (rooms[roomId]){
		return res.json({successful:true, at:'getting room parameters', room:rooms[roomId]});
	} else {
		return res.json({successful:false, at:'getting room parameters', message:'Room has not been created yet'})
	}

}

module.exports.get = get;
module.exports.createRoom = createRoom;
module.exports.roomParams = roomParams;