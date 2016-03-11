/**
 * Created by chendi on 8/3/16.
 */

var Sequelize = require('sequelize');
var sequelizeConnection = require('../sequelize');
var User = require('./User');

var DBUserFile = sequelizeConnection.define('userFiles', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true
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

sequelizeConnection.sync();

var findAllUserFiles = function(userID) {
    return DBUserFile.findAndCountAll({where: {userID: userID}}).then(function(result){
        return result;
    })
};

module.exports = DBUserFile;
module.exports.getAllUserFiles = findAllUserFiles;