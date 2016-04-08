var mocha = require ('mocha');
var chai = require ('chai');
var request = require ('request');
var httpUtils = require ('request-mocha') (request);
var should = chai.should ();
var expect = chai.expect;

var test = function () {
	describe ("Dashboard Restful API", function () {
		describe ("#getAllUserTutorialSessions", function () {
			this.timeout(15000);
			before (function (done) {
				httpUtils._save ({
					method: 'POST',
					url: 'http://localhost:3000/api/dashboard/getAllUserTutorialSessions',
					form: {
						"token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6ImEwMTE5NDkzIiwibmFtZSI6IkNIRU4gREkiLCJpYXQiOjE0NjAxMDYzNjksImV4cCI6MTQ2MjY5ODM2OX0.NrVT481O3ILOH7E3btoKtMfP6sdCK4swSym4Qmr69Uo"
					}
				}).call (this, done);
			});
			it ('should give a feedback', function (done) {
				JSON.parse (this.body).success.should.be.equal (true);
				done();
			});
		});
	});
}

module.exports.test = test;