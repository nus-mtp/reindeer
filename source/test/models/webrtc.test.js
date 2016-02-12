/**
 * Created by chendi on 4/2/16.
 */
var mocha = require('mocha');
var chai = require('chai');
var io = require('socket.io-client');
var socketURL = 'http://localhost:3000/room';
var roomio = require('../../room.io');

var should = chai.should();
var expect = chai.expect;

var test = function(next){
    describe('WebRTC Connection', function (){

        describe('New Client Connected', function(){

            var socket;
            beforeEach(function(done) {
                // Setup
                console.log('Establishing connection');
                socket = io.connect(socketURL, {
                    'reconnection delay' : 0
                    , 'reopen delay' : 0
                    , 'force new connection' : true
                });

                socket.on('connect', function(done) {
                    console.log('worked...');
                    done();
                });
                socket.on('disconnect', function(done) {
                    console.log('disconnected...');
                });
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
};

module.exports.test = test;
