var Vue = require('vue');

var FileUploadView = function(fileUploader){
	return new Vue({
		el:'.uploadWrapper',
		data:{
			form:fileUploader.form,
			fileSelect:fileUploader.fileSelect
		},
		methods:{
			submit:function(){
				fileUploader.submit();
			}
		}
	});
};

module.exports.init = FileUploadView;