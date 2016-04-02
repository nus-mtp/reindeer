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