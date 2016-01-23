/**
 * Router
 * @type {*|exports|module.exports}
 */
var express = require('express');
var router = express.Router();

var index = require('./controllers/index');
var tutorial = require('./controllers/tutorial');
var users = require('./controllers/users');
var canvas = require('./controllers/canvas');
var message = require('./controllers/message');
var login = require('./controllers/login');
var auth = require('./auth');

router.get('/', auth.ensureAuth, index.get);
router.get('/tutorial/:id', auth.ensureAuth, tutorial.get);
router.get('/users', users.get);
router.get('/users/:id',users.get);
router.get('/canvastest', canvas.get);
router.get('/canvastest/:id', canvas.get);
router.get('/messagetest', message.get);
router.get('/messagetest/:id', message.get);

router.get('/login', login.get);
router.get('/login/callback', login.callback);

router.post('/api/tutorial/createroom', auth.ensureAuth, tutorial.createRoom);
router.post('/api/tutorial/roomparams', auth.ensureAuth, tutorial.roomParams);
module.exports = router;