/**
 * Created by chendi on 15/4/16.
 */
var log4js = require('log4js');
var app = require('../app');
var path = require('path');

log4js.loadAppender('file');
log4js.configure({
    appenders: [
        { type: 'console', category: 'serverLogger' },
        { type: 'dateFile', filename: path.join(app.get('serverLogPath'), 'error_log.log'), pattern: "-yyyy-MM-dd", alwaysIncludePattern: true, category: 'serverLogger' },
        { type: 'dateFile', filename: path.join(app.get('databaseLogPath'), 'database.log'), pattern: "-yyyy-MM-dd", alwaysIncludePattern: true, category: 'databaseLogger' }
    ]
});

var serverLogger = log4js.getLogger('serverLogger');
var databaseLogger = log4js.getLogger('databaseLogger');

// Set server logger level
if (process.env.MODE == 'test') {
    serverLogger.setLevel('TRACE');
} else {
    serverLogger.setLevel('INFO');
}

// Set database logger level
databaseLogger.setLevel('INFO');

module.exports.serverLogger = serverLogger;
module.exports.dbLogger = databaseLogger;