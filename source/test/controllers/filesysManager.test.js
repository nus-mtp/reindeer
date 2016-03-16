/**
 * Created by chendi on 9/3/16.
 */

var mocha = require('mocha');
var chai = require('chai');
var filesysManager = require('../../controllers/filesysManager');
var app = require('../../../app');
var path = require('path');


// ================ TEST DATA =============== //
// ========================================== //
var userFileTestID = app.get('userFileTestID');
var sessionTestID = app.get('sessionTestID');

// =================== TEST ================= //
// ========================================== //
var test = function(next) {
    describe('File System Manager', function() {

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

        describe('#Check presentation folder', function(){
            it('presentation directory should be created', function(done) {
                var presentationFolderPath = filesysManager.generatePresentationFolderPath(sessionTestID);
                filesysManager.dirExists(presentationFolderPath).should.equals(true);
                done();
            });
        });

        describe('#getPresentationFileFolder()', function() {
            it('Presentation file folder should be created', function(done) {
                var filePath = filesysManager.generatePresentationFileFolderPath('testFileID', sessionTestID);
                filesysManager.getPresentationFileFolder('testFileID');
                filesysManager.dirExists(filePath).should.equals(true);
                done();
            });
        });

        describe('#removeSessionDirectory()', function() {
            it('session directory should be removed', function(done) {
                var filePath = filesysManager.generateSessionDirPath(sessionTestID);
                filesysManager.removeSessionDirectory(sessionTestID);
                filesysManager.dirExists(filePath).should.equals(false);
                done();
            });
        });
    });
};


module.exports.test = test;