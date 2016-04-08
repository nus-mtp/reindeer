var Vue = require('vue');

var GroupView = function(socket, group){
	return new Vue({
		el:'#group-info-wrapper',
		data:{
			state:group.state
		},
		methods:{
			arrange:function(targetId, groupId){
				group.arrangeToGroup(targetId, groupId);
			},
			chat:function(clientId){
				group.chatWith(clientId);
			}
		}
	});
};

module.exports.init = GroupView;