var $ = jQuery = require('jquery');

var handle = function(socket){
	socket.on('connect', function(){
		console.log('group manager works!');

		socket.emit('getMap');

		socket.on('sendMap', function(message){
			var clientMap = message.defaultGroup.socketClientMap;
			for(var client in clientMap){
				console.log(client.userId);
			}
		});

		socket.on('joinRoom', function (message) {

		});

		socket.on('leaveRoom', function(message){

		})
	});
}


displayUserList = function (userListArray) {
	var userListTable = $('.user-list-table');
	$('.user-list-table').html("");
	for (var i = 0; i < userListArray.length; i++) {
		userListTable.append($('<tr class="user-id"></tr>').append($('<td></td>').append(userListArray[i])));
	}
}

module.exports.handle = handle;