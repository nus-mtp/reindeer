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
			this.timeout(25000);
			before (function (done) {
				httpUtils._save({
					method: 'POST',
					url: 'http://localhost:3000/api/tutorial/createroom',
					form: {
						"roomID": "1da93387-d8ff-407b-bc6b-400e053755cd",
						"token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6ImEwMTE5NDkzIiwibmFtZSI6IkNIRU4gREkiLCJpYXQiOjE0NjAxMDYzNjksImV4cCI6MTQ2MjY5ODM2OX0.NrVT481O3ILOH7E3btoKtMfP6sdCK4swSym4Qmr69Uo"
					}
				}).call(this, done);
			});

			it ('should give a feedback', function (done) {
				JSON.parse (this.body).success.should.be.equal (true);
				done();
			});
		});
	});

	//clean up after all testcase
	after (function () {
		rooms.getLobby().removeAllRooms ();
	});
}

module.exports.test = test;