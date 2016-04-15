/**
 * Router
 * @type {*|exports|module.exports}
 */
var express = require ('express');
var router = express.Router ();

var index = require ('./controllers/index');
var tutorial = require ('./controllers/tutorial');
var users = require ('./controllers/users');
var file = require ('./controllers/file');
var login = require ('./controllers/login');
var dashboard = require ('./controllers/dashboard');
var tutorialUI = require('./controllers/tutorialUI');
var auth = require ('./auth');


router.get ('/', auth.ensureAuth, index.get);
router.get ('/login', auth.ensureAuth, login.get);
router.get ('/login/callback', login.callback);
router.get ('/tutorial/:id', auth.ensureAuth, tutorial.get);
router.get ('/users', users.get);
router.get ('/users/:id', users.get);

router.get ('/workbin/:modulecode/:groupname/:tutorialid', auth.ensureAuth, file.get);
router.get ('/dashboard', auth.ensureAuth, dashboard.get);

router.post ('/api/tutorial/forcesyncivle', auth.protectCSRF, auth.ensureAuth, tutorial.forceSyncIVLE);
router.post ('/api/tutorial/createroom', auth.protectCSRF, auth.ensureAuth, tutorial.activateAndCreateRoom);
router.post ('/api/tutorial/deactivateroom', auth.protectCSRF, auth.ensureAuth, tutorial.deactivateRoom);

router.post ('/api/dashboard/getAllUserTutorialSessions', auth.protectCSRF, auth.ensureAuth, dashboard.getAllUserTutorialSessions);
router.post ('/api/dashboard/forcesyncivle', auth.protectCSRF, auth.ensureAuth, dashboard.forceSyncIVLE);

router.post('/file/upload', auth.protectCSRF, auth.ensureAuth, file.fileHandler);
router.post ('/file/getFiles', auth.protectCSRF, auth.ensureAuth, file.getSessionFiles);

router.get('/file/getFile/:sessionID/:fileID/:filename',  auth.ensureAuth, file.getSessionFile);

router.post ('/file/deleteFile', auth.protectCSRF, auth.ensureAuth, file.deleteFile);
module.exports = router;