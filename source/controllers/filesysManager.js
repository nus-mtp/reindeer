/**
 * Created by chendi on 9/3/16.
 */
var mkdirp = require('mkdirp');
var fs = require('fs');
var app = require('../../app');
var path = require ('path');
var del = require('del');

/**
 * Get user file directory, if directory not exists then create one
 *
 * @param userID
 * @return directory path
 * */
var getUserDirectory = function(userID) {
    var userDirPath = generateUserDirPath(userID);
    if(!dirExists(userDirPath)) {
        createDirectory(userDirPath);
    }
    return userDirPath;
};

/**
 * Get the stardard path of a user directory
 *
 * @param userID
 * @return directory path
 * */
var generateUserDirPath = function(userID) {
    var USER_FILE_PATH = app.get('userFiles');
    return path.join(USER_FILE_PATH, userID);
};

/**
 * Check if a directory exists
 *
 * @param directory path
 * @return <boolean>
 * */
var dirExists = function(userDirPath) {
    try {
        fs.accessSync(userDirPath, fs.F_OK, function(){});
        return true;
    } catch (e) {
        return false;
    }
};

/**
 * Create directory
 *
 * Create directory, do nothing if directory already exists
 *
 * @param directory path
 * @return void
 * */
var createDirectory = function(path) {
    mkdirp.sync(path, function(err) {
        throw "Cannot create path" + err;
    });
};

/**
 * Create User directory
 *
 * Create user directory, do nothing if directory already exists
 *
 * @param userID
 * @return void
 * */
var createUserDirectory = function(userID) {
    var userDirPath = generateUserDirPath(userID);
    if(!dirExists(userDirPath)) {
        createDirectory(userDirPath);
    }
};


/**
 * Remove Directory
 *
 * @param directory path
 * @return void
 * */
var removeDirectory = function(path) {
    del.sync(path, function(err) {
        console.log(err);
    })
};


/**
 * Remove User Directory
 *
 * Remove a user's file directory and all the files inside
 *
 * @param userID
 * @return void
 * */
var removeUserDirectory = function(userID) {
    var userFileDirPath = generateUserDirPath(userID);
    removeDirectory(userFileDirPath);
};


/**
 * File filter
 *
 * @param mimeType
 * @return boolean
 * */
var isValidFileTypeUpload = function(mimeType) {
    return mimeType == 'application/pdf' || mimeType == 'image/jpeg';
};


/**
 * Save File to database
 *
 * @param userID
 * @filepath filepath
 * @return void
 * */
var saveFileInfoToDatabase = function(userID, filePath) {
    
};

module.exports.getUserDirectory = getUserDirectory;
module.exports.generateUserDirPath = generateUserDirPath;
module.exports.dirExists = dirExists;
module.exports.createDirectory = createDirectory;
module.exports.removeDirectory = removeDirectory;
module.exports.removeUserDirectory = removeUserDirectory;
module.exports.createUserDirectory = createUserDirectory;
module.exports.isValidFileTypeUpload = isValidFileTypeUpload;
module.exports.saveFileInfoToDatabase = saveFileInfoToDatabase;