var static = require('node-static');
var http = require('http');
var file = new(static.Server)();
var app = http.createServer(function (req, res) {
  file.serve(req, res);
}).listen(2013);

var io = require('socket.io').listen(app);

io.sockets.on('connection', function (socket){

  // convenience function to log server messages on the client
	// function log(){
	// 	var array = [">>> Message from server: "];
	//   for (var i = 0; i < arguments.length; i++) {
	//   	array.push(arguments[i]);
	//   }
	//     socket.emit('log', array);
	// }

	socket.on('New User', function (message) {
		console.log('===================================== Got message:', message);
    // for a real app, would be room only (not broadcast)
		socket.broadcast.emit('New Joined', {'userInfo':message});
	});
    
    socket.on('message', function(message) {
       console.log('!!!!!!! MESSAGE');
       socket.broadcast.emit('message', message); 
    });

});

