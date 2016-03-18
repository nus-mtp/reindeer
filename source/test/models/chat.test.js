var mocha = require ('mocha');
var chai = require ('chai');
var io = require ('socket.io-client');
var socketURL = 'http://localhost:3000/room';
var request = require ('request');
var httpUtils = require ('request-mocha') (request);
var rooms = require ('../../models/Rooms');

var should = chai.should ();
var expect = chai.expect;

var test = function (next) {
	describe ('Chatbox Connection', function () {

		describe ('New Client Connected', function () {

			var socket1;
			var socket2;
			beforeEach (function (done) {
				// Setup Server
				var room = new rooms.Room();
				rooms.getLobby().addRoom('testid', room);

				// Setup Client Side
				console.log ('Establishing connection');
				socket1 = io.connect (socketURL, {
					'reconnection delay': 0
					, 'reopen delay': 0
					, 'force new connection': true,

					query: "token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6ImEwMTE5NDkzIiwibmFtZSI6IkNIRU4gREkiLCJpYXQiOjE0NTYxMjcwNzQsImV4cCI6MTQ1ODcxOTA3NH0.DgXACMkMtg0dExFhmWmtQyH4s2QDKDfbaQfw-SzVPAE"
				});

				socket2 = io.connect (socketURL, {
					'reconnection delay': 0
					, 'reopen delay': 0
					, 'force new connection': true,

					query: "token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6ImEwMTE5NDU2IiwibmFtZSI6IkhVQU5HIFpJWVUiLCJpYXQiOjE0NTgyNzk1ODMsImV4cCI6MTQ2MDg3MTU4M30.-VE2HfyavRxCWKI2iX5V9W3glpt1yWdgAl_tTA0N7n8"
				});

				socket1.on ('connect', function (done) {
					console.log ('socket1 worked...');
				});
				socket1.on ('disconnect', function (done) {
					console.log ('socket1 disconnected...');
				});

				socket2.on ('connect', function (done) {
					console.log ('socket2 worked...');
				});
				socket2.on ('disconnect', function (done) {
					console.log ('socket2 disconnected...');
				});
				done ();
			});

			it ('should get assigned ID', function (done) {
				socket1.emit ('msgToRoom', 'Hello world');
				socket2.on ('msgToRoom', function (message) {
					message.msg.should.equal ('Hello world');
					console.log ('Test Message, msgToRoom', message.msg);

					// Add done here to forcefully wait for asynchronous callbacks to complete
					done ();
				});

				socket2.emit ('msgToGroup', 'Hello world too');
				socket1.on ('msgToGroup', function (message) {
					message.msg.should.equal ('Hello world too');
					console.log ('Test Message, msgToGroup', message.msg);

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
