var mocha = require ('mocha');
var chai = require ('chai');
var Tutorial = require ('../../models/Tutorial');
var chaiAsPromised = require ('chai-as-promised');

var rooms = require ('../../models/Rooms');
chai.use (chaiAsPromised);

var should = chai.should ();
var expect = chai.expect;

var test = function () {
	describe ('Tutorial Model', function () {
		describe ('#findAndCountAllTutorialByUserID()', function () {
			this.timeout (25000);
			it ('should retrive data from database', function () {
				var queryDatabase = Tutorial.findAndCountAllTutorials ('a0119493');

				return queryDatabase.then (function (result) {
					expect (result).should.not.equal (undefined);
				});
			});

		});

		describe ('#forceSyncIVLE()', function () {
			this.timeout (25000);
			it ('should sync data from ivle', function () {
				var syncIVLE = Tutorial.forceSyncIVLE ('a0119493');

				return syncIVLE.then (function (result) {
					expect (result).to.equal (true);
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