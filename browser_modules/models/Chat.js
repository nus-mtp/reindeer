var $ = jQuery = require('jquery');

var limit = 50;
var size = 0;

function Chat(socket){
	var self = this;
	socket.on('connect', function(){
		self.socket = socket;
		self.socket.on('msgToRoom', function (message) {
			//console.log(message.msg);
			self.newMessage('msgToRoom from ' + message.clientName + ': ' + message.msg);
		});
		self.socket.on('msgToGroup', function (message) {
			self.newMessage('msgToGroup from ' + message.clientName + ': ' + message.msg);
		});
		self.socket.on('msgToUser', function (message) {
			self.newMessage('personalMsg from ' + message.clientName + ': ' + message.msg);
		});
		self.socket.on('systemMsg', function (message) {
			self.newMessage('System Msg : ' + message.clientName + ': ' + message.msg);
		});
	});
	//must use state to store local variables
	//data can be retrieved from Vue components only inside state
	this.state = {
		history:[],
	}

}
/*
ChatManager.prototype.init = function(){
	var self = this;
	self.socket.on('connect', function(){
		console.log('chat manager works!');


		self.socket.on('msgToRoom', function (message) {
			console.log(message.msg);
			$('.message-container').append(formMessageBubble('msgToRoom from ' + message.clientName + ':' + message.msg));
		});
		self.socket.on('msgToGroup', function (message) {
			$('.message-container').append('msgToGroup from ' + message.clientName + ':' + message.msg);
		});
		self.socket.on('msgToUser', function (message) {
			$('.message-container').append('personalMsg from ' + message.clientName + ':' + message.msg);
		});
		self.socket.on('systemMsg', function (message) {
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
				this.socket.emit('msgToRoom', {msg:$('.input-box').val()});
				$('.input-box').val('');
			} else if($('#select').val() == 'group'){
				console.log($('.input-box').val());
				this.socket.emit('msgToGroup',{msg:$('.input-box').val()});
				$('.input-box').val('');
			} else {
				this.socket.emit('msgToUser', {receiverId: $('#target').val(), msg: $('.input-box').val()});
				$('.input-box').val('');
			}
		}

	});
}
*/

Chat.prototype.submit = function(data, callback){
	//callback reserved for server response
	//console.log(data);
	this.socket.emit(data.target, data.value);
}

Chat.prototype.newMessage = function(message){
	this.state.history.push({msg: message});
	size++;
	if(size >limit){
		this.state.history.shift();
		size--;
	}
	//console.log(this.state.history);
}

formMessageBubble = function (message) {
	var messageBubble = $('<div></div>')
		.append(message)
		.addClass("message-bubble");
	return messageBubble;
}

module.exports = Chat;