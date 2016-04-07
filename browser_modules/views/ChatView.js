var Vue = require('vue');

var ChatView = function(socket, chat){
	var vm = new Vue({
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
				self.input = "";
			}
		},
		watch: {
			"state": {
				handler: function() {
					var objDiv = document.getElementById("message-container");
					objDiv.scrollTop = objDiv.scrollHeight;
				},
				deep: true,
			}
		}
	});

	return vm;
};

module.exports.init = ChatView;