var $ = jQuery = require('jquery');

var Group = function(socket){
	var errorSound = new Audio("/sounds/error_alert.wav");
	var self = this;
	socket.on('connect', function() {
		socket.emit('joinRoom', {roomID: location.pathname.split('/').pop()});
	});

	socket.on('joinError', function(data){
		socket.disconnect();
		console.log(data);
	});

	socket.on('disconnect', function(){
		errorSound.play();
		$('.disconnected-black-cover').fadeIn();
		$('.disconnected-notification').fadeIn();
		socket.disconnect();
		window.onbeforeunload = function(){};
	})

	socket.on('joined', function(){
		console.log('group manager works!');

		socket.emit('getMap');

		socket.on('sendMap', function(message){
			var roomMap = message.roomMap;
			var clientmap = roomMap.groups.default.socketClientMap;
			//console.log(clientmap);
			self.state.members = clientmap;
			console.log(self.state.members);
			//console.log(self.state.members);
		});

		socket.on('joinRoom', function (message) {
			var client = message.client;
			self.state.members[client.userID] = client;
			console.log(self.state.members);
		});

		socket.on('leaveRoom', function(message){
			//console.log(message.clientId + ' disconnected');
			//var clientId = message.clientId;
			//delete self.state.members[findClientbyId(clientId, self.state.members)];
		})

		socket.on('arrangeGroup', function(message){
			var targetIndex = findClientbyId(message.clientId, self.state.members);
			var target = self.state.members[targetIndex];
			target.joinGroup(target.client.currentRoomID, msg.groupId);
		})

		socket.on('group:user_leave', function(user) {
			console.log("user that left: " + user);
		})

		socket.on('group:connected_clients', function(connectedClients) {
			console.log(connectedClients);
			self.state.currentConnectedUsers = connectedClients;

			var stringOfConnectedUsers = [];
			for (var i=0; i<connectedClients.length; ++i) {
				connectedClients[i].username = formatName(connectedClients[i].username);
				stringOfConnectedUsers += connectedClients[i].username;
				if (i != connectedClients.length-1) {
					stringOfConnectedUsers += ", ";
				}
			}

			self.state.stringOfConnectedUsers = stringOfConnectedUsers;
		})
	});

	self.state = {
		members: [],
		currentConnectedUsers:[],
		stringOfConnectedUsers: undefined,
	}
}

var formatName = function(nameOfSender) {
	var formattedName = "";
	var temp = nameOfSender.split(' ');
	for (var i=0; i < temp.length; ++i) {
		formattedName += temp[i].charAt(0).toUpperCase() + temp[i].substring(1).toLowerCase();
		if (i != temp.length-1) {
			formattedName += " ";
		}
	}

	return formattedName
}

Group.prototype.arrangeToGroup = function(targetId, groupId){
	socket.emit('arrangeGroup', {targetId: targetId, groupId: groupId});
}

Group.prototype.chatWith = function(clientId){

}

findClientbyId = function(clientId, members){
	var index = 0;
	for(var member in members){
		if(member.userId === clientId){
			return index;
		}else {
			index++;
		}
	}
	return null;
}

module.exports = Group;