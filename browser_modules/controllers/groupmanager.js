var $ = jQuery = require('jquery');

var handle = function(socket){
	socket.on('connect', function(){
		console.log('group manager works!');

		socket.on('joinRoom', function (message) {

		});

		socket.on('leaveRoom', function(message){

		})
	});
}

module.exports.handle = handle;