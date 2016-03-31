var $ = jQuery = require('jquery');

var limit = 50;
var size = 0;

function Chat(socket){
	var self = this;
	socket.on('connect', function(){
		self.socket = socket;
		self.socket.on('message:room', function (messageObject) {
			self.newMessage(messageObject.isSelf, messageObject.clientName, messageObject.message);
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
	this.socket.emit("message:room", data.value);
}

Chat.prototype.newMessage = function(isSelf, nameOfSender, message){
	var className = "message message__others";
	if (isSelf) {
		className = "message message__self";
	}
	this.state.history.push({
		className: className,
		nameOfSender: nameOfSender,
		message: message
	});

	size++;
	if(size >limit){
		this.state.history.shift();
		size--;
	}
	//console.log(this.state.history);
}


module.exports = Chat;