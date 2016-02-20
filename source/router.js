/**
 * Router
 * @type {*|exports|module.exports}
 */
var express = require ('express');
var router = express.Router ();


var index = require ('./controllers/index');
var tutorial = require ('./controllers/tutorial');
var users = require ('./controllers/users');
var canvas = require ('./controllers/canvas');
var message = require ('./controllers/message');
var fileUpload = require ('./controllers/fileUpload');
var login = require ('./controllers/login');
var dashboard = require ('./controllers/dashboard');
var auth = require ('./auth');

router.get ('/', auth.ensureAuth, index.get);
router.get ('/tutorial/:id', auth.ensureAuth, tutorial.get);
router.get ('/users', users.get);
router.get ('/users/:id', users.get);
router.get ('/canvastest', canvas.get);
router.get ('/canvastest/:id', canvas.get);
router.get ('/messagetest', message.get);
router.get ('/messagetest/:id', message.get);
router.get ('/fileUpload', fileUpload.get);

router.get ('/dashboard', dashboard.get);

router.get ('/login', auth.ensureAuth, login.get);
router.get ('/login/callback', login.callback);

router.post ('/fileupload', fileUpload.upload, function (req, res, next) {});
router.post ('/api/tutorial/createroom', auth.protectCSRF, auth.ensureAuth, tutorial.createRoom);
router.post ('/api/tutorial/roomparams', auth.protectCSRF, auth.ensureAuth, tutorial.roomParams);

router.post ('/api/dashboard/getallusertutorials', auth.protectCSRF, auth.ensureAuth, dashboard.getAllUserTutorials);
router.post ('/api/dashboard/forcesyncivle', auth.protectCSRF, auth.ensureAuth, dashboard.forceSyncIVLE);
module.exports = router;