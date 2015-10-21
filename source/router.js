var express = require('express');
var router = express.Router();

var controller = require('./controller');

//set url routing rules
router.get('/', controller.index);
router.get('/users',controller.users);
router.get('/users/:id',controller.users);
router.get('/canvastest', controller.canvas);
router.get('/canvastest/:id',controller.canvas);
router.get('/messagetest', controller.message);

module.exports = router;