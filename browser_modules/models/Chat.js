var $ = jQuery = require('jquery');

var limit = 50;
var size = 0;

function Chat(socket){
	var self = this;
	socket.on('connect', function(){
		self.socket = socket;
		self.socket.on('message:room', function (messageObject) {
			self.newMessage(messageObject.isSelf, messageObject.clientName, messageObject.message, messageObject.color, messageObject.timestamp);
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

var formatName = function(nameOfSender) {
	if(nameOfSender) {
		var formattedName = "";
		var temp = nameOfSender.split(' ');
		for (var i = 0; i < temp.length; ++i) {
			formattedName += temp[i].charAt(0).toUpperCase() + temp[i].substring(1).toLowerCase();
			if (i != temp.length - 1) {
				formattedName += " ";
			}
		}

		return formattedName
	}
}

Chat.prototype.newMessage = function(isSelf, nameOfSender, message, color, timestamp){
	var className = "message message__others";
	if (isSelf) {
		className = "message message__self";
	}

	var formattedName = formatName(nameOfSender);

	this.state.history.push({
		className: className,
		nameOfSender: formattedName,
		message: message,
		color: color,
		timestamp: timestamp,
	});

	size++;
	if(size >limit){
		this.state.history.shift();
		size--;
	}
	//console.log(this.state.history);
}



module.exports = Chat;
