var app = require('./app');
rooms = require('./source/test/models/rooms.test.js');
rooms.test();

tutorial = require('./source/test/controllers/tutorial.test.js');
dashboard = require('./source/test/controllers/dashboard.test.js');
tutorial.test();
dashboard.test();

actionManager = require('./source/test/models/actionManager.test.js');
actionManager.test();

tutorialmodel = require('./source/test/models/tutorial.test.js');
tutorialmodel.test();

process.env.MODE = 'test';
app.set ('sessionTestID', 'session_test_id');
app.set ('userFileTestID', 'filesys_testid');
filesysManager = require('./source/test/controllers/filesysManager.test.js');
filesysManager.test();

slide = require('./source/test/models/slide.test.js');
slide.test();

router = require('./source/test/controllers/router.test.js');
router.test();

