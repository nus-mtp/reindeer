var userListControlloer = new UserListControlloer();

$(document).ready(function(){
	var iosocket = io('http://<%= ip %>:3000/room', {token: Cookies.get('token')});
	iosocket.on('connect', function () {
		iosocket.on('joinRoom', function (message) {
			userListControlloer.addUser(message);
		});
		iosocket.on('leaveRoom', function (message) {
			userListControlloer.deleteUser(message);
		});
		iosocket.on('msgToRoom', function(message){

		})
		iosocket.on('msgToGroup', function (message) {

		});
		iosocket.on('msgToUser', function (message) {

		});
		iosocket.on('systemMsg', function (message) {

		});
	})
})