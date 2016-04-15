/**
 * Created by chendi on 8/3/16.
 */

var Sequelize = require('sequelize');
var sequelizeConnection = require('../sequelize');
var User = require('./User');
var Tutorial = require('./Tutorial');

var DBUserFile = sequelizeConnection.define('userFiles', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true
    },
    tutorialSessionID: {
        type: Sequelize.UUID,
        references: {
            model: Tutorial,
            key: 'id'
        }
    },
    name: {
        type: Sequelize.STRING
    },
    mimeType: {
        type: Sequelize.STRING
    },
    filePath: {
        type: Sequelize.STRING
    },
    userID: {
        type: Sequelize.STRING,
        references: {
            model: User,
            key: 'id'
        }
    }
});

DBUserFile.belongsTo(User, {
    foreignKey: 'userID'
});

DBUserFile.belongsTo(Tutorial, {
    foreignKey: 'tutorialSessionID'
});

sequelizeConnection.sync();

/**
 * Find all user file information
 *
 * @param userID
 * @return query_result
 * @description: format f return {
 *      count: <num_of_rows>,
 *      rows: [{data}]
 * }
 * */
var getAllUserFiles = function(userID) {
    return DBUserFile.findAndCountAll({where: {userID: userID}}).then(function(result){
        return result;
    })
};

/**
 * Find all session file information
 *
 * @param userID
 * @return query_result
 * @description format of return {
 *      count: <num_of_rows>,
 *      rows: [{data}]
 * }
 * */
var getAllSessionFiles = function(sessionID) {
    return DBUserFile.findAndCountAll({where: {tutorialSessionID: sessionID}}).then(function(result){
        return result;
    })
};

/**
 * Get file path using file id
 *
 * @param fileID
 * @return one entry or null
 * */
var getFilePath = function(fileID) {
    return DBUserFile.findOne({where: {id:fileID}}).then(function(result) {
        if (result) {
            return result.filePath;
        } else {
            return null;
        }
    });
};

/**
 * Check is the user is the owner of the file
 *
 * @param fileID
 * @param userID
 * @return <boolean>
 * */
var getOwnerOfFile = function(fileID, userID) {
    return DBUserFile.findOne({where: {id:fileID, userID: userID}}).then(function(result){
        return null;
    })
};

/**
 * Get session ID from fileID
 *
 * @param fileID
 * @return sessionID
 * */
var getSessionID = function(fileID) {
    return DBUserFile.findOne({where: {id:fileID}}).then(function(result){
        return result.tutorialSessionID;
    });
};

/**
 * Delete the row corresponding to a file ID
 *
 * @param fileID
 * @returns {*}
 */
var removeFile = function(fileID) {
    return DBUserFile.findOne({
        where: {id: fileID}
    }).then(function(task){
        if (task) {
            return task.destroy();
        } else {
            return new Promise(function(fulfill, reject) {
                fulfill(true);
            });
        }
    })
};



module.exports = DBUserFile;
module.exports.getAllUserFiles = getAllUserFiles;
module.exports.getAllSessionFiles = getAllSessionFiles;
module.exports.getFilePath = getFilePath;
module.exports.getOwnerOfFile = getOwnerOfFile;
module.exports.getSessionID = getSessionID;
module.exports.removeFile = removeFile;