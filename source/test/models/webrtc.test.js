/**
 * Created by chendi on 4/2/16.
 */
var mocha = require ('mocha');
var chai = require ('chai');
var io = require ('socket.io-client');
var socketURL = 'http://localhost:3000/room';
var request = require ('request');
var httpUtils = require ('request-mocha') (request);
var rooms = require ('../../models/rooms');

var should = chai.should ();
var expect = chai.expect;

var test = function (next) {
	describe ('WebRTC Connection', function () {

		describe ('New Client Connected', function () {

			var socket;
			beforeEach (function (done) {
				// Setup Server
				var room = new rooms.Room();
				rooms.getLobby().addRoom('testid', room);

				// Setup Client Side
				console.log ('Establishing connection');
				socket = io.connect (socketURL, {
					'reconnection delay': 0
					, 'reopen delay': 0
					, 'force new connection': true,

					query: "token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6ImEwMTE5NDkzIiwibmFtZSI6IkNIRU4gREkiLCJpYXQiOjE0NTYxMjcwNzQsImV4cCI6MTQ1ODcxOTA3NH0.DgXACMkMtg0dExFhmWmtQyH4s2QDKDfbaQfw-SzVPAE"
				});

				socket.on ('connect', function (done) {
					console.log ('worked...');
				});
				socket.on ('disconnect', function (done) {
					console.log ('disconnected...');
				});
				done ();
			});

			it ('should get assigned ID', function (done) {

				socket.emit ('New User', 'New User');
				socket.on ('Assigned ID', function (message) {
					message.assignedID.should.not.be.equal ("");
					console.log ('Test Message, Assigned ID: ', message.assignedID);

					// Add done here to forcefully wait for asynchronous callbacks to complete
					done ();
				});
			});
		});
	});

	//clean up after all test
	after (function () {
		rooms.getLobby ().removeAllRooms ();
	});
};

module.exports.test = test;
