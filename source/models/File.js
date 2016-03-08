/**
 * Created by chendi on 8/3/16.
 */

var Sequelize = require('sequelize');
var sequelizeConnection = require('../sequelize');
var User = require('./user');

var UserFile = sequelizeConnection.define('userFiles', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true
    },
    name: {
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

UserFile.belongsTo(User, {
    foreignKey: 'userID'
});

sequelizeConnection.sync();

module.exports = UserFile;