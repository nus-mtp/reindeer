var io = require('socket.io-client');
var $ = jQuery = require('jquery');
var Cookies = require('js-cookie');

var Vue = require('vue');
var Slide = require('./models/Slide');
var Canvas = require('./models/Canvas');
var Chat = require('./models/Chat');
//var groupmanager = require('./models/groupmanager');
//var webRTCmanager = require('./models/webRTCmanager');

var socketURL = location.origin+'/room';

$(document).ready(function () {
	var socket = io.connect(socketURL, { query: "token=" + Cookies.get('token') });
	var chat = new Chat(socket);
	//groupmanager.handle(socket);
	//webRTCmanager.handle(socket);


	var chatbox = new Vue({
		el:'#chat-box',
		data:{
			state:chat.state,
			input:'',
			target:''
		},
		methods:{
			submit:function(){
				chat.submit({target:chatbox.target, value:chatbox.input}, function(){});
			}
		}
	});

})

