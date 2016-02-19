var express = require ('express');
var debug = require ('debug') ('app:server');
var app = module.exports = express ();
var fs = require ('fs');
var https = require ('https');


if (process.env.MODE == 'test') {
	app.set ('server-ip', process.env.SERVER_IP);
	app.set ('server-port', process.env.SERVER_PORT);
	app.set ('api-key', process.env.API_KEY);
	app.set ('db-host', process.env.DB_HOST);
	app.set ('db-dialect', process.env.DB_DIALECT);
	app.set ('db-name', process.env.DB_NAME);
	app.set ('db-username', process.env.DB_USERNAME);
	app.set ('db-password', process.env.DB_PASSWORD);
	app.set ('jwt-secret', process.env.JWT_SECRET);
	app.set ('use-https', JSON.parse (process.env.USE_HTTPS));
} else {
	var config = JSON.parse (fs.readFileSync ('config.json', 'utf8'));
	app.set ('server-ip', config['server-ip']);
	app.set ('server-port', config['server-port']);
	app.set ('api-key', config['api-key']);
	app.set ('db-host', config['db-host']);
	app.set ('db-dialect', config['db-dialect']);
	app.set ('db-name', config['db-name']);
	app.set ('db-username', config['db-username']);
	app.set ('db-password', config['db-password']);
	app.set ('jwt-secret', config['jwt-secret']);
	app.set ('use-https', JSON.parse (config['use-https']));
}

if (app.get ('use-https')) {
	app.listen = function () {
		var server = https.createServer (
			{
				key: fs.readFileSync ('ssl/ssl.key'),
				cert: fs.readFileSync ('ssl/www.genkagaku.com.crt')
			},
			this);
		return server.listen.apply (server, arguments);
	}
}

var path = require ('path');
var favicon = require ('serve-favicon');
var logger = require ('morgan');
var cookieParser = require ('cookie-parser');
var bodyParser = require ('body-parser');
var router = require ('./source/router');
var roomio = require ('./source/room.io.js');

// view engine setup
app.set ('env', 'development');
app.set ('views', path.join (__dirname, './source/views'));
app.set ('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use (logger ('dev'));
app.use (bodyParser.json ());
app.use (bodyParser.urlencoded ({extended: false}));
app.use (cookieParser ());
app.use (express.static (path.join (__dirname, 'public')));

//use router to handle different url request
app.use (router);


//error handling
app.use (function (req, res, next) {
	var err = new Error ('Not Found');
	err.status = 404;
	next (err);
});

// development error handler
// will print stacktrace
if (app.get ('env') === 'development') {
	app.use (function (err, req, res, next) {
		console.log (err.message);
		res.status (err.status || 500);
		res.render ('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use (function (err, req, res, next) {
	res.status (err.status || 500);
	res.render ('error', {
		message: err.message,
		error: {}
	});
});

roomio.listen (app.listen (app.get ('server-port')));
