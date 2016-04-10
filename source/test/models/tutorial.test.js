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

		describe ('#findTutorial()', function () {
			this.timeout (25000);
			it ('should sync data from ivle', function () {
				var findTut = Tutorial.findTutorial('a0119493', 'testid');

				return findTut.then (function (result) {
					(result).should.not.equal (undefined);
				});
			})
		});

		describe ('#findTutorialTutorID()', function () {
			this.timeout (25000);
			it ('should sync data from ivle', function () {
				var findTutTutorID = Tutorial.findTutorialTutorID('testid');

				return findTutTutorID.then (function (result) {
					(result).should.not.equal (undefined);
				});
			})
		});

		describe ('#checkIfInTutorialUserList()', function () {
			this.timeout (25000);
			it ('should sync data from ivle', function () {
				var checkIfInTutorialUserList = Tutorial.checkIfInTutorialUserList('a0119493', 'testid');

				return checkIfInTutorialUserList.then (function (result) {
					(result).should.not.equal (undefined);
				});
			})
		});

		describe ('#findAndCountAllTutorials()', function () {
			this.timeout (25000);
			it ('should retrive data from database', function () {
				var queryDatabase = Tutorial.findAndCountAllTutorials ('a0119493');

				return queryDatabase.then (function (result) {
					(result).should.not.equal (undefined);
				});
			});
		});

		describe ('#findAndCountAllUsersInTutorial()', function () {
			this.timeout (25000);
			it ('should retrive data from database', function () {
				var queryDatabase = Tutorial.findAndCountAllUsersInTutorial ('testid');

				return queryDatabase.then (function (result) {
					(result).should.not.equal (undefined);
				});
			});
		});

		describe ('#forceSyncIVLE()', function () {
			this.timeout (25000);
			it ('should sync data from ivle', function () {
				var syncIVLE = Tutorial.forceSyncIVLE ('a0119493');

				return syncIVLE.then (function (result) {
					(result).should.equal (true);
				});
			})
		});

		describe ('#findTutorialSession()', function () {
			this.timeout (25000);
			it ('should retrive data from database', function () {
				var queryDatabase = Tutorial.findTutorialSession ('a0119493');

				return queryDatabase.then (function (result) {
					(result).should.not.equal (undefined);
				});
			});
		});

		//clean up after all test
		after (function () {
			rooms.getLobby ().removeAllRooms ();
		});
	})


}

module.exports.test = test;