/**
 * Created by chendi on 9/3/16.
 */
var mkdirp = require('mkdirp');
var fs = require('fs');
var app = require('../../app');
var path = require ('path');
var del = require('del');
var File = require('../models/File');

// =============== User File System =============== //
// ================================================ //

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
var saveFileInfoToDatabase = function(userID, fileName, fileMimeType, filePath) {
    File.create(
        {
            name: fileName,
            mimeType: fileMimeType,
            filePath: filePath,
            userID: userID
        }
    );
};


/**
 * Get all the files user have
 *
 * @param userID
 * @return queryResult {
 *      count: <number_of_files>,
 *      rows: [
 *          {
 *              fileName: <fileName>
 *          }
 *          ]
 * }
 * */
var getAllUserFiles = function(userID) {
    return File.getAllUserFiles(userID).then(function(result) {
        var filePageData = getFilePageData(result);
        return filePageData;
    });
};


/**
 * Get file path on disc
 * */
var getFilePath = function(fileID) {
    return File.getFilePath(fileID).then(function(result) {
        return result;
    });
};

/**
 * Form file page data returned to view
 *
 * @param queryResult
 * @param FilePageData
 * */
function getFilePageData(queryResult) {
    var filePageData = new FilePageData(queryResult.count);

    for (var index in queryResult.rows) {
        var currentFileModel = queryResult.rows[index];
        filePageData.addFile(currentFileModel.id, currentFileModel.name);
    }
    return filePageData;
}


/**
 * File Page Data Model
 *
 * @attr count
 * @attr fileList
 * */
function FilePageData(count) {
    this.count = count;
    this.fileList = [];
}


/**
 * Add file data to file page data
 *
 * @param id
 * @param fileList
 * */
FilePageData.prototype.addFile = function(id, fileName){
    this.fileList.push({
        id: id,
        fileName: fileName
    });
};


// Get File path from file id
// Get session file folder from tutorial id

// ============= Session File System ============== //
// ================================================ //


/**
 * Generate session folder path
 *
 * @param sessionID
 * @return session folder path
 * */

var generateSessionDirPath = function(sessionID) {
    var SESSION_FILE_PATH = app.get('sessionFiles');
    return path.join(SESSION_FILE_PATH, sessionID);
};

/**
 * Create a session folder
 *
 * @param sessionID
 * @return sessionFileFolder
 * */
var createSessionDirectory = function(sessionID) {
    var sessionDirPath = generateSessionDirPath(sessionID);
    if(!dirExists(sessionDirPath)) {
        createDirectory(sessionDirPath);
    }
    return sessionDirPath;
};


/**
 * Get session file folder
 *
 * @param sessionID
 * @return session folder path
 * */
var getSessionDirectory = function(sessionID) {
    return createSessionDirectory(sessionID);
};


/**
 * Remove session file folder
 *
 * @param sessionID
 * @return void
 * */
var removeSessionDirectory = function(sessionID) {
    var filePath = generateSessionDirPath(sessionID);
    removeDirectory(filePath);
};


// User File API
module.exports.getUserDirectory = getUserDirectory;
module.exports.generateUserDirPath = generateUserDirPath;
module.exports.dirExists = dirExists;
module.exports.createDirectory = createDirectory;
module.exports.removeDirectory = removeDirectory;
module.exports.removeUserDirectory = removeUserDirectory;
module.exports.createUserDirectory = createUserDirectory;
module.exports.isValidFileTypeUpload = isValidFileTypeUpload;
module.exports.saveFileInfoToDatabase = saveFileInfoToDatabase;
module.exports.getAllUserFiles = getAllUserFiles;
module.exports.getFilePath = getFilePath;


// Session API
module.exports.createSessionDirectory = createSessionDirectory;
module.exports.getSessionDirectory = getSessionDirectory;
module.exports.generateSessionDirPath = generateSessionDirPath;
module.exports.removeSessionDirectory = removeSessionDirectory;