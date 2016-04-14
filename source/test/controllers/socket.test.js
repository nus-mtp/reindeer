/**
 * Created by chendi on 14/4/16.
 */
var mocha = require('mocha');
var chai = require('chai');
var app = require('../../../app');
var rooms = require ('../../models/Rooms');
var path = require('path');
var should = chai.should ();
var io = require ('socket.io-client');
var socketURL = 'http://localhost:3000/room';
var expect = chai.expect;
var request = require('supertest');

var test = function (next) {
    describe ('Socket Connection', function () {

        describe ('New Client Connected', function () {

            //this.timeout(5000);
            var _socket = null;
            before (function (done) {

                // Initialize server room
                var requests = request('http://localhost:3000');

                requests.get('/dashboard')
                    .query({ token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6ImEwMTE5NDkzIiwibmFtZSI6IkNIRU4gREkiLCJpYXQiOjE0NjAxMDYzNjksImV4cCI6MTQ2MjY5ODM2OX0.NrVT481O3ILOH7E3btoKtMfP6sdCK4swSym4Qmr69Uo' })
                    .expect(200, function() {

                        _socket = io.connect (socketURL, {
                            'reconnection delay': 0
                            , 'reopen delay': 0
                            , 'force new connection': true,

                            query: {token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6ImEwMTE5NDkzIiwibmFtZSI6IkNIRU4gREkiLCJpYXQiOjE0NjAxMDYzNjksImV4cCI6MTQ2MjY5ODM2OX0.NrVT481O3ILOH7E3btoKtMfP6sdCK4swSym4Qmr69Uo"}
                        });

                        _socket.on ('connect', function () {
                            console.log ('socket established...');
                            done()
                        });
                    });
            });

            //it ('should get assigned ID', function (done) {
            //
            //    socket.emit ('New User', 'New User');
            //    socket.on ('Assigned ID', function (message) {
            //        message.assignedID.should.not.be.equal ("");
            //        console.log ('Test Message, Assigned ID: ', message.assignedID);
            //
            //        // Add done here to forcefully wait for asynchronous callbacks to complete
            //        done ();
            //    });
            //});
            //it ('should get server socket acknowledgement', function (done) {
            //    _socket.emit('connection');
            //    _socket.on('Meow', function(data) {
            //        console.log("== RECEIVED" + data);
            //        done();
            //    })
            //});
            it ('should not throw error', function() {
                expect(true).to.be.true;
            });
        });
    });

    //clean up after all test
    after (function () {
        rooms.getLobby ().removeAllRooms ();
    });
};

module.exports.test = test;