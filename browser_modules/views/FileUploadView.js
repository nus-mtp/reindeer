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
				fileUploader.submit(self.fileSelect.files);
			}
		}
	});
};

module.exports.init = FileUploadView;