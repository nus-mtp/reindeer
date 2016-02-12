

rooms = require('./source/test/models/rooms.test.js');
rooms.test();

www = require('./app');
tutorial = require('./source/test/controllers/tutorial.test.js');

tutorial.test();