rooms = require('./source/test/models/rooms.test.js');
rooms.test();

www = require('./app');
tutorial = require('./source/test/controllers/tutorial.test.js');
dashboard = require('./source/test/controllers/dashboard.test.js');
tutorial.test();
dashboard.test();

rtc = require('./source/test/models/webrtc.test.js');
rtc.test();

tutorialmodel = require('./source/test/models/tutorial.test.js');
tutorialmodel.test();
