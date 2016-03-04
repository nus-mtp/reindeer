var $ = jQuery = require('jquery');
var handle = function(socket){
	socket.on('connect', function(){
		console.log('chat manager works!');

		socket.on('msgToRoom', function (message) {
			console.log(message.msg);
			$('.message-container').append('msgToRoom from ' + message.clientName + ':' + message.msg);
		});
		socket.on('msgToGroup', function (message) {
			$('.message-container').append('msgToGroup from ' + message.clientName + ':' + message.msg);
		});
		socket.on('msgToUser', function (message) {
			$('.message-container').append('personalMsg from ' + message.clientName + ':' + message.msg);
		});
		socket.on('systemMsg', function (message) {
			$('.message-container').append('System Msg : ' + message.clientName + ':' + message.msg);
		});
		// === message io listeners end ===



		// ===
	});

	$('.input-box').keypress(function (event) {
		if (event.which == 13) {
			event.preventDefault();
			if($('#select').val() == 'room'){
				console.log($('.input-box').val());
				socket.emit('msgToRoom', {msg:$('.input-box').val()});
				$('.input-box').val('');
			} else if($('#select').val() == 'group'){
				console.log($('.input-box').val());
				socket.emit('msgToGroup',{msg:$('.input-box').val()});
				$('.input-box').val('');
			} else {
				socket.emit('msgToUser', {receiverId: $('#target').val(), msg: $('.input-box').val()});
				$('.input-box').val('');
			}
		}
	});
}

module.exports.handle = handle;