var $ = jQuery = require('jquery');
var handle = function(socket){
	socket.on('connect', function(){
		console.log('chat manager works!');
	});
}

module.exports.handle = handle;