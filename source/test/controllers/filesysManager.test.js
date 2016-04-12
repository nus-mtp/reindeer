/**
 * Created by chendi on 9/3/16.
 */

var mocha = require('mocha');
var chai = require('chai');
var filesysManager = require('../../controllers/filesysManager');
var app = require('../../../app');
var path = require('path');
var should = chai.should ();
var expect = chai.expect;
var request = require('supertest');


// ================ TEST DATA =============== //
// ========================================== //
var userFileTestID = app.get('userFileTestID');
var sessionTestID = app.get('sessionTestID');

// =================== TEST ================= //
// ========================================== //
var test = function(next) {
    describe('File System Manager', function() {

        var cleanUPDirectory = function() {
            var sessionID = app.get('sessionTestID');
            var sessionDirPath = filesysManager.generateSessionDirPath(sessionID);
            filesysManager.removeFileOrDirectory(sessionDirPath);
        };

        beforeEach(cleanUPDirectory);
        afterEach(cleanUPDirectory);


        // User file api
        describe('#isValidTypeUplaod()', function() {
            it('test file type', function(done) {
                var json = 'application/json';
                var pdf = 'application/pdf';
                var jpeg = 'image/jpeg';

                var isValid1 = filesysManager.isValidFileTypeUpload(json);
                isValid1.should.equals(false);

                var isValid2 = filesysManager.isValidFileTypeUpload(pdf);
                isValid2.should.equals(true);

                var isValid3 = filesysManager.isValidFileTypeUpload(jpeg);
                isValid3.should.equals(true);

                done();
            })
        });

        describe('#isPDF()', function() {
            it('test file type', function(done) {
                var json = 'application/json';
                var pdf = 'application/pdf';

                var isValid1 = filesysManager.isPDF(json);
                isValid1.should.equals(false);

                var isValid2 = filesysManager.isPDF(pdf);
                isValid2.should.equals(true);

                done();
            })
        });


        describe ('#getAllUserFiles()', function () {
            this.timeout (25000);
            it ('should sync data from ivle', function () {
                var getAllUserFiles = filesysManager.getAllUserFiles ('a0119493');

                return getAllUserFiles.then (function (result) {
                    (result).should.not.equal (undefined);
                });
            })
        });


        describe('#removeUserFile()', function() {
            this.timeout(60000);
            var _fileID_for_userUpload = 'defaultID';
            before(function(done) {
                var requests = request('http://localhost:3000');

                // Add testid session into room model
                requests.get('/dashboard')
                    .query({ token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6ImEwMTE5NDkzIiwibmFtZSI6IkNIRU4gREkiLCJpYXQiOjE0NjAxMDYzNjksImV4cCI6MTQ2MjY5ODM2OX0.NrVT481O3ILOH7E3btoKtMfP6sdCK4swSym4Qmr69Uo' })
                    .expect(200, function() {

                        // upload a file into server
                        requests.post('/file/upload')
                            .query({ tutorialID: 'testid', token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6ImEwMTE5NDkzIiwibmFtZSI6IkNIRU4gREkiLCJpYXQiOjE0NjAxMDYzNjksImV4cCI6MTQ2MjY5ODM2OX0.NrVT481O3ILOH7E3btoKtMfP6sdCK4swSym4Qmr69Uo' })
                            .attach('userUpload', '/Users/chendi/Desktop/testpdf.pdf')
                            .expect(200, function(err, res) {
                                _fileID_for_userUpload = res.body.fileID;
                                done()
                            });
                    });
            });
            it('user file should be removed', function() {

                var testFileID = _fileID_for_userUpload;
                var testUserID = 'a0119493';

                return filesysManager.removeUserFile(testFileID, testUserID).then(function(data){
                    data.should.equals(true);
                    var getFilePathPromise = filesysManager.getFilePath(testFileID);
                    return getFilePathPromise;

                }).then(function(filePath) {
                    filesysManager.dirExists(filePath).should.be.false;

                    var fileQueryPromise = filesysManager.getFilePath(testFileID);
                    return fileQueryPromise;

                }).then(function(filePath) {
                    expect(filePath).to.be.null;
                });
            });
        });


        // Test Session File API
        describe('#generateSessionDirPath()', function() {
            it('should return session folder path', function(done) {
                var expectedPath = path.join(app.get('sessionFiles'), sessionTestID);
                var filePath = filesysManager.generateSessionDirPath(sessionTestID);
                filePath.should.equals(expectedPath);
                done();
            })
        });

        describe('#dirExists()', function() {
            it('session directory should not exists', function(done) {
                var filePath = filesysManager.generateSessionDirPath(sessionTestID);
                filesysManager.dirExists(filePath).should.equals(false);
                done();
            });
        });

        describe('#getSessionDirectory()', function() {
            it('session directory should be created', function(done) {
                var filePath = filesysManager.generateSessionDirPath(sessionTestID);
                filesysManager.getSessionDirectory(sessionTestID);
                filesysManager.dirExists(filePath).should.equals(true);
                done();
            });
        });

        describe('#getAllSessionFiles()', function() {
            it('get all session files', function(done) {
                var files = filesysManager.getAllSessionFiles(sessionTestID);
                files.should.not.equals(undefined);
                done();
            });
        });

        // Presentation file api
        describe('#Check presentation folder', function(){
            it('presentation directory should be created', function(done) {
                var presentationFolderPath = filesysManager.generatePresentationFolderPath(sessionTestID);
                filesysManager.dirExists(presentationFolderPath).should.equals(true);
                done();
            });
        });

        //describe('#getPresentationFileFolder()', function() {
        //    it('Presentation file folder should be created', function(done) {
        //        var filePath = filesysManager.generatePresentationFileFolderPath('testFileID', sessionTestID);
        //        filesysManager.getPresentationFileFolder('testFileID');
        //        filesysManager.dirExists(filePath).should.equals(true);
        //        done();
        //    });
        //});
        //
        //describe('#removeSessionDirectory()', function() {
        //    it('session directory should be removed', function(done) {
        //        var filePath = filesysManager.generateSessionDirPath(sessionTestID);
        //        filesysManager.removeSessionDirectory(sessionTestID);
        //        filesysManager.dirExists(filePath).should.equals(false);
        //        done();
        //    });
        //});

    });
};


module.exports.test = test;