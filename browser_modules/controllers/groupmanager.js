var $ = jQuery = require('jquery');

var socketList = {};

var handle = function(socket){
	socket.on('connect', function(){
		console.log('group manager works!');

		socket.on('joinRoom', function (message) {
			socketList;
		});

		socket.on('leaveRoom', function(message){
			socketList;
		})
	});
}

module.exports.handle = handle;