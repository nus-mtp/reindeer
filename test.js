

rooms = require('./source/test/models/rooms.test.js');
rooms.test();

www = require('./www');
tutorial = require('./source/test/controllers/tutorial.test.js');

tutorial.test();

rtc = require('./source/test/models/webrtc.test.js');
rtc.test();