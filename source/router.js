/**
 * Router
 * @type {*|exports|module.exports}
 */
var express = require('express');
var multer = require('multer');
var router = express.Router();
//var upload = multer({
//	dest: '../public/uploads/',
//	filename: '1.jpg',
//});

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, '../public/uploads/')
	},
	filename: function (req, file, cb) {
		cb(null, file.fieldname)
	}
})
var upload = multer({ storage: storage })

var index = require('./controllers/index');
var tutorial = require('./controllers/tutorial');
var users = require('./controllers/users');
var canvas = require('./controllers/canvas');
var message = require('./controllers/message');
var fileUpload = require('./controllers/fileUpload');

router.get('/', index.get);
router.get('/tutorial/:id', tutorial.get);
router.get('/users', users.get);
router.get('/users/:id',users.get);
router.get('/canvastest', canvas.get);
router.get('/canvastest/:id', canvas.get);
router.get('/messagetest', message.get);
router.get('/messagetest/:id', message.get);

router.get('/fileUpload', fileUpload.get);
router.post('/fileupload', upload.single('photo'), function (req, res, next){});
router.post('/api/tutorial/createroom', tutorial.createRoom);
router.post('/api/tutorial/roomparams', tutorial.roomParams);

module.exports = router;