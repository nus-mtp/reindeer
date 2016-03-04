var $ = jQuery = require('jquery');
var handle = function(socket){
	socket.on('connect', function(){
		console.log('chat manager works!');

		socket.on('msgToRoom', function (message) {
			$('.message-container').append('msgToRoom from ' + $('<li></li>').text(message));
		});
		socket.on('msgToGroup', function (message) {
			$('.message-container').append('msgToGroup from ' + $('<li></li>').text(message));
		});
		socket.on('msgToUser', function (message) {
			$('.message-container').append('personalMsg from ' + $('<li></li>').text(message));
		});
		socket.on('systemMsg', function (message) {
			$('.message-container').append('System Msg : ' + $('<li></li>').text(message));
		});
		// === message io listeners end ===



		// ===
	});

	$('.input-box').keypress(function (event) {
		if (event.which == 13) {
			event.preventDefault();
			if($('#select').val() == 'room'){
				console.log($('.input-box').val());
				socket.emit('msgToRoom',$('.input-box').val());
				$('.input-box').val('');
			} else if($('#select').val() == 'group'){
				console.log($('.input-box').val());
				socket.emit('msgToGroup',$('.input-box').val());
				$('.input-box').val('');
			} else {
				socket.emit('msgToUser', {receiverId: $('#target').val(), msg: $('.input-box').val()});
				$('.input-box').val('');
			}
		}
	});
}

module.exports.handle = handle;