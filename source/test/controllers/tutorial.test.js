/**
 * Created by hlhr on 2/5/16.
 */
var mocha = require ('mocha');
var chai = require ('chai');
var rooms = require ('../../models/Rooms');
var request = require ('request');
var httpUtils = require ('request-mocha') (request);
var should = chai.should ();
var expect = chai.expect;

var test = function () {
	describe ("Tutorial Restful API", function () {
		describe ("#activateAndCreateRoom", function () {
			httpUtils.save ({
				method: 'POST',
				url: 'http://localhost:3000/api/tutorial/createroom',
				form: {
					"roomID": "1da93387-d8ff-407b-bc6b-400e053755cd",
					"token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6ImEwMDkxNzM4IiwibmFtZSI6IkhVQU5HIExJVUhBT1JBTiIsImlhdCI6MTQ1NTc5ODQ2NCwiZXhwIjoxNDU4MzkwNDY0fQ.EiZsG9bn2S3hB4jL20uJ-h1YVIsQ17xDO1z7o2GrqLs"
				}
			});
			it ('should give a feedback', function () {
				JSON.parse (this.body).success.should.be.equal (true);
			})

		});

	});

	//clean up after all testcase
	after (function () {
		rooms.getLobby ().removeAllRooms ();
	});
}

module.exports.test = test;