/**
 * Created by chendi on 4/2/16.
 */
var mocha = require('mocha');
var chai = require('chai');
//var webRTC = require('../../../public/javascripts/webRTC.js');
var roomIO = require('../../room.io');
var socketIO = require('../../../public/javascripts/socket.io-1.3.7.js');

var should = chai.should();
var expect = chai.expect;

var test = function(){
    describe('Client Connection', function (){

        socketIO.connect('http://localhost:3000/room');
        describe('#uiActionOnStart()', function(){
            it('should have startbutton enabled', function(){
                roomIO.userIDList.length.should.equal(1);
            });
        });

    });
};

module.exports.test = test;
