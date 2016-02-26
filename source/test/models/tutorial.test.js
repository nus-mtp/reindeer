var mocha = require ('mocha');
var chai = require ('chai');
var Tutorial = require ('../../models/tutorial');
var chaiAsPromised = require ('chai-as-promised');

var rooms = require ('../../models/rooms');
chai.use (chaiAsPromised);

var should = chai.should ();
var expect = chai.expect;

var test = function () {
	describe ('Tutorial Model', function () {
		describe ('#findAndCountAllTutorialByUserID()', function () {
			this.timeout (15000);
			it ('should retrive data from database', function (done) {
				setTimeout (done, 15000);
				var queryDatabase = Tutorial.findAndCountAllTutorials ('testid');
				return queryDatabase.then (function (result) {
					expect (result.count).to.equal (1);
					done();
				});
			});

		});

		describe ('#forceSyncIVLE()', function () {
			this.timeout (15000);
			it ('should sync data from ivle', function (done) {
				setTimeout (done, 15000);
				var syncIVLE = Tutorial.forceSyncIVLE ('a0091738');
				return syncIVLE.then (function (result) {
					expect (result).to.equal (true);
					done();
				});
			})
		})

		//clean up after all test
		after (function () {
			rooms.getLobby ().removeAllRooms ();
		});
	})


}

module.exports.test = test;