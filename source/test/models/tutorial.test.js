var mocha = require ('mocha');
var chai = require ('chai');
var Tutorial = require ('../../models/tutorial');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

var should = chai.should ();
var expect = chai.expect;

var test = function () {
	describe ('Tutorial Model', function () {
		describe ('#findAndCountAllTutorialByUserID()', function () {
			it ('should retrive data from database', function () {
				var queryDatabase = Tutorial.findAndCountAllTutorials ('testid');
				return queryDatabase.then(function (result){
					expect(result.count).to.equal(1);
				});
			});
			it ('should sync data from ivle', function () {
				var syncIVLE = Tutorial.forceSyncIVLE('a0091738');
				return syncIVLE.then(function(result){
					expect(result).to.equal(true);
				});
			})
		})
	})
}

module.exports.test = test;