/**
 * Created by chendi on 11/4/16.
 */
var mocha = require ('mocha');
var chai = require ('chai');
var request = require ('request');
var httpUtils = require ('request-mocha') (request);
var tutorialController = require('../../controllers/tutorial');
var should = chai.should ();
var expect = chai.expect;

var test = function () {
    describe ("Router API Test", function () {
        describe ("#GET /", function () {
            this.timeout(25000);
            before (function (done) {
                httpUtils._save({
                    method: 'GET',
                    url: 'http://localhost:3000/'
                }).call(this, done);
            });

            it ('should give a feedback', function (done) {
                expect(this.res.statusCode).to.equal(200);
                done();
            });
        });

        describe ("#GET /login", function () {
            this.timeout(25000);
            before (function (done) {
                httpUtils._save({
                    method: 'GET',
                    url: 'http://localhost:3000/login'
                }).call(this, done);
            });

            it ('should give a feedback', function (done) {
                expect(this.res.statusCode).to.equal(200);
                done();
            });
        });


        //describe ("#GET /tutorial/:id", function () {
        //    this.timeout(25000);
        //    before (function (done) {
        //        httpUtils._save({
        //            method: 'GET',
        //            url: 'http://localhost:3000/tutorial/testid',
        //            form: {
        //                "roomID": "testid",
        //                "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6ImEwMTE5NDkzIiwibmFtZSI6IkNIRU4gREkiLCJpYXQiOjE0NjAxMDYzNjksImV4cCI6MTQ2MjY5ODM2OX0.NrVT481O3ILOH7E3btoKtMfP6sdCK4swSym4Qmr69Uo"
        //            }
        //        }).call(this, done);
        //    });
        //
        //    it ('should give a feedback', function (done) {
        //        expect(this.res.statusCode).to.equal(500);
        //        done();
        //    });
        //});

        describe ("#GET /workbin/:modulecode/:groupname/:tutorialid", function () {
            this.timeout(25000);
            before (function (done) {
                httpUtils._save({
                    method: 'GET',
                    url: 'http://localhost:3000/workbin/testTut/default/testid',
                    form: {
                        "roomID": "testid",
                        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6ImEwMTE5NDkzIiwibmFtZSI6IkNIRU4gREkiLCJpYXQiOjE0NjAxMDYzNjksImV4cCI6MTQ2MjY5ODM2OX0.NrVT481O3ILOH7E3btoKtMfP6sdCK4swSym4Qmr69Uo"
                    }
                }).call(this, done);
            });

            it ('should give a feedback', function (done) {
                expect(this.res.statusCode).to.equal(200);
                done();
            });
        });


        describe ("#GET /dashboard", function () {
            this.timeout(25000);
            before (function (done) {
                httpUtils._save({
                    method: 'GET',
                    url: 'http://localhost:3000/dashboard',
                    form: {
                        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6ImEwMTE5NDkzIiwibmFtZSI6IkNIRU4gREkiLCJpYXQiOjE0NjAxMDYzNjksImV4cCI6MTQ2MjY5ODM2OX0.NrVT481O3ILOH7E3btoKtMfP6sdCK4swSym4Qmr69Uo"
                    }
                }).call(this, done);
            });

            it ('should give a feedback', function (done) {
                expect(this.res.statusCode).to.equal(200);
                done();
            });
        });


        describe ("#GET /dashboard", function () {
            this.timeout(25000);
            before (function (done) {
                httpUtils._save({
                    method: 'GET',
                    url: 'http://localhost:3000/dashboard',
                    form: {
                        "token": "error_token"
                    }
                }).call(this, done);
            });

            it ('should give a feedback', function (done) {
                expect(this.res.statusCode).to.equal(200);
                done();
            });
        });

        describe ("#GET /tutorial/:id", function () {
            this.timeout(25000);
            before (function (done) {
                // Create Room First
                var userID = 'a0119493';
                var testTutID = 'testid';
                tutorialController.activateRoomTestStub(userID, testTutID);

                // Get tutorial
                httpUtils._save({
                    method: 'GET',
                    url: 'http://localhost:3000/tutorial/testid',
                    form: {
                        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6ImEwMTE5NDkzIiwibmFtZSI6IkNIRU4gREkiLCJpYXQiOjE0NjAxMDYzNjksImV4cCI6MTQ2MjY5ODM2OX0.NrVT481O3ILOH7E3btoKtMfP6sdCK4swSym4Qmr69Uo"
                    }
                }).call(this, done);
            });

            it ('should give a feedback', function (done) {
                expect(this.res.statusCode).to.equal(200);
                done();
            });
        });

        describe ("#POST /file/getFiles", function () {
            this.timeout(25000);
            before (function (done) {
                httpUtils._save({
                    method: 'POST',
                    url: 'http://localhost:3000/file/getFiles',
                    form: {
                        "tutorialID": "testid",
                        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6ImEwMTE5NDkzIiwibmFtZSI6IkNIRU4gREkiLCJpYXQiOjE0NjAxMDYzNjksImV4cCI6MTQ2MjY5ODM2OX0.NrVT481O3ILOH7E3btoKtMfP6sdCK4swSym4Qmr69Uo"
                    }
                }).call(this, done);
            });

            it ('should give a feedback', function (done) {
                expect(this.res.statusCode).to.equal(200);
                done();
            });
        });
    });
};

module.exports.test = test;