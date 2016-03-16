/**
 * Created by chendi on 9/3/16.
 */
var mkdirp = require('mkdirp');
var fs = require('fs');
var app = require('../../app');
var path = require ('path');
var del = require('del');
var File = require('../models/File');


/**
 * This is the file system where you have manage how all the
 * files are actually been stored on the server disc
 *
 * WARNING: Only 2 apis are open for call, others are not safe to be called
 * directly, other wise the actual file disc system may be messed up
 *
 * #getFilePath(fileID)
 *      @param file id generated by database when the file get stored
 *      @return This function would return the actual file path of the a user file
 *
 * #getSessionDirectory(sessionID)
 *      @param session id that corresponding to a tutorial session
 *      @return The session folder that stores all the session files
 * */


// =============== User File System =============== //
// ================================================ //


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
 * Remove a file from user directory (Cannot be recovered)
 * return a boolean indicate if the file been successfully removed
 * Ownership check will be enforced for each remove.
 *
 * @param fileID
 * @return boolean
 * */
var removeUserFile = function(fileID, userID) {
    if (isOwnerOfFile(fileID, userID)) {
        //remove
        return true;
    } else {
        return false;
    }
};

/**
 * Check if user has permission to remove the file
 *
 * @param userID
 * @param fileID
 * */
var isOwnerOfFile = function(fileID, userID) {
    return File.getOwnerOfFile(fileID, userID).then(function(result) {
        if (result == null) {
            return false;
        } else {
            return true;
        }
    })
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
var saveFileInfoToDatabase = function(tutorialSessionID, userID, fileName, fileMimeType, filePath) {
    File.create(
        {
            tutorialSessionID: tutorialSessionID,
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
 *
 * @param fileID
 * @return filepath
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
 * Create the session folder if not exist
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
 * Initialize if not exist
 *
 * @param sessionID
 * @return session folder path
 * */
var getSessionDirectory = function(sessionID) {
    var sessionDirPath = generateSessionDirPath(sessionID);
    if(!dirExists(sessionDirPath)) {
        initializeSessionDirectory(sessionDirPath, sessionID);
    }
    return sessionDirPath;
};


/**
 * Initialize session folder
 * Create the folder if not exist
 * Create presentation folder inside
 *
 * @param sessionDirPath
 * @param sessionID
 * @return void
 * */
var initializeSessionDirectory = function(sessionDirPath, sessionID) {
    createDirectory(sessionDirPath);
    createPresentationFolder(sessionID);
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
var getAllSessionFiles = function(sessionID) {
    return File.getAllSessionFiles(sessionID).then(function(result) {
        var filePageData = getFilePageData(result);
        return filePageData;
    });
};


// =========== Presentation File System =========== //
// ================================================ //

/**
 * Return the session file folder for storing image file
 * Create the folder if not exist.
 * The folder would exist inside the tutorial session folder.
 *
 * @param fileID
 * @return presentation folder path
 * */
var getPresentationFileFolder = function(fileID) {
    var sessionID = undefined;
    if(process.env.MODE != 'test') {
        var sessionQueryResult = File.getSessionID(fileID);
        assert(sessionID != null);
        sessionID = sessionQueryResult.id;
    } else {
        sessionID = app.get('sessionTestID');
    }
    var presentationFolderPath = generatePresentationFileFolderPath(fileID, sessionID);
    createDirectory(presentationFolderPath);

    return presentationFolderPath;
};

/**
 * Generate the presentation folder path
 *
 * @param fileID
 * @param sessionID
 * @return presentation file folder path
 * */
var generatePresentationFileFolderPath = function(fileID, sessionID) {
    var tutorialFolder = getSessionDirectory(sessionID);
    var presentationFolderPath = path.join(tutorialFolder, app.get('presentationFileFolder'), fileID);
    return presentationFolderPath;
};

/**
 * Create presentation folder
 *
 * @param sessionID
 * @return presentation folder path
 * */
var createPresentationFolder = function(sessionID) {
    var presentationFolderPath = generatePresentationFolderPath(sessionID);
    if (!dirExists(presentationFolderPath)) {
        createDirectory(presentationFolderPath);
    }
    return presentationFolderPath;
};

/**
 * Generate session folder path
 *
 * @param sessionID
 * @return sessionFolderPath
 */
var generatePresentationFolderPath = function(sessionID) {
    var tutorialFolder = getSessionDirectory(sessionID);
    return path.join(tutorialFolder, app.get('presentationFileFolder'));
};


// Filesys api
module.exports.dirExists = dirExists;
module.exports.createDirectory = createDirectory;
module.exports.removeDirectory = removeDirectory;

// User File API
module.exports.isValidFileTypeUpload = isValidFileTypeUpload;
module.exports.saveFileInfoToDatabase = saveFileInfoToDatabase;
module.exports.getAllUserFiles = getAllUserFiles;
module.exports.getFilePath = getFilePath;
module.exports.removeUserFile = removeUserFile;

// Session File API
module.exports.createSessionDirectory = createSessionDirectory;
module.exports.getSessionDirectory = getSessionDirectory;
module.exports.generateSessionDirPath = generateSessionDirPath;
module.exports.removeSessionDirectory = removeSessionDirectory;
module.exports.getAllSessionFiles = getAllSessionFiles;

// Presentation File API
module.exports.getPresentationFileFolder = getPresentationFileFolder;
module.exports.generatePresentationFileFolderPath = generatePresentationFileFolderPath;
module.exports.generatePresentationFolderPath = generatePresentationFolderPath;