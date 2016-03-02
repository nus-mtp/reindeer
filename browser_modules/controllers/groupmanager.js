var $ = jQuery = require('jquery');

var handle = function(socket){
	socket.on('connect', function(){
		console.log('group manager works!');
	});
}

module.exports.handle = handle;