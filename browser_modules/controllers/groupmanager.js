var $ = jQuery = require('jquery');

var socketList = {};
var size = 0;

var handle = function(socket){
	socket.on('connect', function(){
		console.log('group manager works!');

		socket.on('joinRoom', function (message) {
			size++;
			socketList[size] = message;
		});

		socket.on('leaveRoom', function(message){
			delete socketList[message];
			size--;
		})
	});
}

module.exports.handle = handle;