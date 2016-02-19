/**
 * Created by chendi on 4/2/16.
 */
var mocha = require('mocha');
var chai = require('chai');
var io = require('socket.io-client');
var socketURL = 'http://localhost:3000/room';
var request = require ('request');
var httpUtils = require ('request-mocha') (request);
var rooms = require('../../models/rooms');

var should = chai.should();
var expect = chai.expect;

var test = function(next){
    describe('WebRTC Connection', function (){

        describe('New Client Connected', function(){

            var socket;
            beforeEach(function(done) {
                // Setup Server
                httpUtils.save ({
                    method: 'POST',
                    url: 'http://localhost:3000/api/dashboard/getallusertutorials',
                    form: {
                        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6ImEwMDkxNzM4IiwibmFtZSI6IkhVQU5HIExJVUhBT1JBTiIsImlhdCI6MTQ1NTc5ODQ2NCwiZXhwIjoxNDU4MzkwNDY0fQ.EiZsG9bn2S3hB4jL20uJ-h1YVIsQ17xDO1z7o2GrqLs"
                    }
                });

                // Setup Client Side
                console.log('Establishing connection');
                socket = io.connect(socketURL, {
                    'reconnection delay' : 0
                    , 'reopen delay' : 0
                    , 'force new connection' : true
                });

                socket.on('connect', function(done) {
                    console.log('worked...');
                });
                socket.on('disconnect', function(done) {
                    console.log('disconnected...');
                });
                done();
            });

            it ('should get assigned ID', function(done) {

                socket.emit('New User', 'New User');
                socket.on('Assigned ID', function(message) {
                    message.assignedID.should.not.be.equal("");
                    console.log('Test Message, Assigned ID: ', message.assignedID);

                    // Add done here to forcefully wait for asynchronous callbacks to complete
                    done();
                });
            });
        });
    });

    //clean up after all test
    after(function(){
        rooms.getLobby().removeAllRooms();
    });
};

module.exports.test = test;
