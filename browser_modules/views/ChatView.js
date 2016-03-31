var Vue = require('vue');

var ChatView = function(socket, chat){
	return new Vue({
		el:'#chat-box',
		data:{
			state:chat.state,
			input:'',
			target:''
		},
		methods:{
			submit:function(){
				var self = this;
				chat.submit({target:self.target, value:self.input}, function(){});
				chat.newMessage(self.target + ': ' + self.input)
				this.input = '';
			}
		}
	});
};

module.exports.init = ChatView;