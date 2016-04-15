var Vue = require('vue');

var FileUploadView = function(fileUploader){
	return new Vue({
		el:'#fileUploader',
		data:{
			fileSpace:fileUploader.fileSpace,
			fileSelect:''
		},
		methods:{
			submit:function(){
				var self = this;
				console.log(self.fileSelect);
				fileUploader.submit(self.fileSelect);
			},
			delete:function(index){
				fileUploader.delete(index);
			}
		}
	});
};

module.exports.init = FileUploadView;