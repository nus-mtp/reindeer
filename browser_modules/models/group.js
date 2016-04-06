var $ = jQuery = require('jquery');

var Group = function(socket){
	var self = this;
	socket.on('connect', function(){
		console.log('group manager works!');

		socket.emit('getMap');

		socket.emit('joinRoom', {roomID: location.pathname.split('/').pop()});

		socket.on('sendMap', function(message){
			var roomMap = message.roomMap;
			var clientmap = roomMap.groups.default.socketClientMap;
			for(var client in clientmap){
				//self.state.members[client.id] = {client: client};
				self.state.members.push({client: client});
			}
			//console.log(self.state.members);
		});

		socket.on('joinRoom', function (message) {
			var client = message.client.socket;
			this.state.members.push({client: client});
		});

		socket.on('leaveRoom', function(message){
			var clientId = message.clientId;
			delete this.state.members[findClientbyId(clientId, self.state.members)];
		})

		socket.on('arrangeGroup', function(message){
			var targetIndex = findClientbyId(message.clientId, self.state.members);
			var target = this.state.members[targetIndex];
			target.joinGroup(target.client.currentRoomID, msg.groupId);
		})
	});

	this.state = {
		members: [],
	}
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

//displayUserList = function (userListArray) {
//	var userListTable = $('.user-list-table');
//	$('.user-list-table').html("");
//	for (var i = 0; i < userListArray.length; i++) {
//		userListTable.append($('<tr class="user-id"></tr>').append($('<td></td>').append(userListArray[i])));
//	}
//}

module.exports = Group;