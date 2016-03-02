var $ = jQuery = require('jquery');
var handle = function(socket){
	socket.on('connect', function(){
		console.log('canvas manager works!');
	});
}

module.exports.handle = handle;