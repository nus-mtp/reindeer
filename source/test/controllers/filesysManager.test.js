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
var testID = 'filesys_testid';

// =================== TEST ================= //
// ========================================== //
var test = function(next) {
    describe('File System Manager', function() {
        describe('#generateUserDirPath()', function() {
            it('should generate user diretory path', function(done) {
                var expectedPath = path.join(app.get('userFiles'), testID);
                var filePath = filesysManager.generateUserDirPath(testID);
                filePath.should.equals(expectedPath);
                done();
            });
        });

        describe('#dirExists()', function() {
            it('user directory should not exists', function(done) {
                var filePath = filesysManager.generateUserDirPath(testID);
                filesysManager.dirExists(filePath).should.equals(false);
                done();
            });
        });

        describe('#createUserDirectory()', function() {
            it('user directory should be created', function(done) {
                var filePath = filesysManager.generateUserDirPath(testID);
                filesysManager.createUserDirectory(testID);
                filesysManager.dirExists(filePath).should.equals(true);
                done();
            });
        });

        describe('#removeUserDirectory()', function() {
            it('user directory should be removed', function(done) {
                var filePath = filesysManager.generateUserDirPath(testID);
                filesysManager.removeUserDirectory(testID);
                filesysManager.dirExists(filePath).should.equals(false);
                done();
            });
        });
    });
};


module.exports.test = test;