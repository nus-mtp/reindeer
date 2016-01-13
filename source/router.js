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

router.get('/', index.get);
router.get('/tutorial/:id', tutorial.get);
router.get('/users', users.get);
router.get('/users/:id',users.get);
router.get('/canvastest', canvas.get);
router.get('/canvastest/:id', canvas.get);
router.get('/messagetest', message.get);
router.get('/messagetest/:id', message.get);

router.post('/api/tutorial/createroom', tutorial.createRoom);
router.post('/api/tutorial/roomparams', tutorial.roomParams);
module.exports = router;