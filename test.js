rooms = require('./source/test/models/rooms.test.js');
rooms.test();

app = require('./app');
tutorial = require('./source/test/controllers/tutorial.test.js');
dashboard = require('./source/test/controllers/dashboard.test.js');
tutorial.test();
dashboard.test();

rtc = require('./source/test/models/webrtc.test.js');
rtc.test();

tutorialmodel = require('./source/test/models/tutorial.test.js');
//tutorialmodel.test();

process.env.MODE = 'test';
app.set ('sessionTestID', 'session_test_id');
app.set ('userFileTestID', 'filesys_testid');
filesysManager = require('./source/test/controllers/filesysManager.test.js');
filesysManager.test();