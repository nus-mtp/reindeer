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

        const SLIDE_NEXT = "slide_next";
        const SLIDE_PREVIOUS = "slide_previous";
        const SLIDE_GO_TO = "slide_go_to";
        const SLIDE_SWITCH_PRESENTATION = "slide_switch_presentation";
        const SLIDE_NEW_BLANK_PRESENTATION = "slide_new_blank_presentation";
        const SLIDE_UPLOAD_SUCCESS = "slide_upload_success";
        const CANVAS_NEW_FABRIC_OBJECT = "canvas:new-fabric-object";
        const CANVAS_UNDO_ACTION = "canvas:undo";
        const CANVAS_REDO_ACTION = "canvas:redo";
        const MESSAGE_ROOM = "message:room";
        const STREAM = 'stream';

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
                            done();
                        });
                    });
            });

            it ('should join room', function(done) {
                _socket.emit('joinRoom', {roomID: 'testid'});
                _socket.on('joined', function() {
                    done();
                });
            });

            it ('should arrange group', function(done) {
                _socket.emit('arrangeGroup', {targetId: 'a0119493', groupId: 'default'});
                done()
            });

            it ('should get map', function(done) {
                _socket.emit('getMap', {targetId: 'a0119493', groupId: 'default'});
                _socket.on('sendMap', function() {
                    done();
                });
            });


            // ===================== Slide Test =======================
            // ========================================================
            it ('should get next slide', function(done) {
                _socket.emit(SLIDE_NEXT);
                done();
            });

            it ('should get previous slide', function(done) {
                _socket.emit(SLIDE_PREVIOUS);
                done();
            });

            it ('should switch presentation', function(done) {
                _socket.emit(SLIDE_SWITCH_PRESENTATION);
                done();
            });

            it ('should get to new blank presentation', function(done) {
                _socket.emit(SLIDE_NEW_BLANK_PRESENTATION);
                done();
            });

            it ('should show upload success', function(done) {
                _socket.emit(SLIDE_UPLOAD_SUCCESS, undefined);
                done();
            });

            it ('should get next slide', function(done) {
                _socket.emit(SLIDE_GO_TO, 0);
                done();
            });


            // ==================== Canvas Test =======================
            // ========================================================
            it ('should add new fabric object', function(done) {
                _socket.emit(CANVAS_NEW_FABRIC_OBJECT, undefined);
                done();
            });

            it ('should undo last action', function(done) {
                _socket.emit(CANVAS_UNDO_ACTION);
                done();
            });

            it ('should redo last action', function(done) {
                _socket.emit(CANVAS_REDO_ACTION);
                done();
            });

            it ('should broadcast canvas status of current slide', function(done) {
                _socket.emit(SLIDE_NEXT);
                done();
            });

            it ('should broadcast canvas status of current slide', function(done) {
                _socket.emit(SLIDE_PREVIOUS, undefined);
                done();
            });

            it ('should broadcast canvas status of current slide', function(done) {
                _socket.emit(SLIDE_SWITCH_PRESENTATION, 0);
                done();
            });

            it ('should broadcast canvas status of current slide', function(done) {
                _socket.emit(SLIDE_UPLOAD_SUCCESS, 0);
                done();
            });

            it ('should broadcast canvas status of current slide', function(done) {
                _socket.emit(SLIDE_NEW_BLANK_PRESENTATION, 0);
                done();
            });


            // =============== Broadcast message to room ==============
            // ========================================================
            it ('should broadcast message to the room', function(done) {
                _socket.emit(MESSAGE_ROOM, 'msg');
                done();
            });


            // =============== Broadcast voice to room ==============
            // ========================================================
            it ('should broadcast voice to the room', function(done) {
                _socket.emit(STREAM, 'data');
                done();
            });
        });
    });

    //clean up after all test
    after (function () {
        rooms.getLobby ().removeAllRooms ();
    });
};

module.exports.test = test;