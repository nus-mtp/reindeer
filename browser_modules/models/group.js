var $ = jQuery = require('jquery');

var Group = function(socket){
	socket.on('connect', function(){
		console.log('group manager works!');

		socket.emit('getMap');

		socket.on('sendMap', function(message){
			var clientmap = message.roomMap.defaultGroup.socketClientMap;
			for(var client in clientmap){
				var clientId = client.id;
				this.state.members[clientId] = {client: client};
			}
		});

		socket.on('joinRoom', function (message) {
			var client = message.socket;
			var clientId = client.id;
			this.state.members[clientId] = {client: client};
		});

		socket.on('leaveRoom', function(message){
			var clientId = message.clientId;
			delete this.state.members[clientId];
		})

		socket.on('arrangeGroup', function(message){
			var target = this.state.members[message.targetId];
			target.joinGroup(this.state.members[message.targetId].client.currentRoomID, msg.groupId);
		})

		this.state = {
			members: [],
		}


	});
}

Group.prototype.arrangeToGroup = function(targetId, groupId){
	socket.emit('arrangeGroup', {targetId: targetId, groupId: groupId});
}

Group.prototype.chatWith = function(clientId){

}

displayUserList = function (userListArray) {
	var userListTable = $('.user-list-table');
	$('.user-list-table').html("");
	for (var i = 0; i < userListArray.length; i++) {
		userListTable.append($('<tr class="user-id"></tr>').append($('<td></td>').append(userListArray[i])));
	}
}

module.exports.handle = handle;