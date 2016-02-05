/**
 * Created by hlhr on 2/5/16.
 */
var mocha = require('mocha');
var chai = require('chai');
var rooms = require('../../models/rooms');
var request = require('request');

var should = chai.should();
var expect = chai.expect;

var test = function(){
	describe("Tutorial Restful API", function(){

		describe("#createRoom", function(){
			it('should give a feedback', function(){
				request.post('http://localhost:3000/api/tutorial/createroom', function(err, res, body){
					body.should.be.equal('{"successful":true,"at":"room creation","lobby":{"count":1,"rooms":{"1":{"count":1,"groups":{"default":{"groupId":"default","count":0,"socketClientMap":{}}}}}}}');
				});
			})

		});

	});

	//clean up after all testcase
	after(function(){
		rooms.getLobby().removeAllRooms();
	});
}

module.exports.test = test;