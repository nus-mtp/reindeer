var http = require('http');

var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');
var serve = serveStatic(__dirname + '/jsdoc');

var server = http.createServer(function(req, res) {
	var done = finalhandler(req, res);
	serve(req, res, done);
});

server.listen(8080);
console.log('API Documentation serving at port 8080');
