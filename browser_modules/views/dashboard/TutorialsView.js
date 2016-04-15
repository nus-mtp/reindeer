/**
 * Created by shiyu on 1/4/16.
 */
var Vue = require('vue');

var TutorialsView = function(tutorials) {
    var vm =  new Vue({
        el: '#tutorial-list-container',
        components: {
            'tutorial-view': TutorialView(tutorials),
        },
        data: {
            state: tutorials.state
        },
        methods: {
            createTutorialSession: function(event) {
            },
            test:function(){
                console.log(this.test1);
            }
        }
    });

    vm.$watch('state.tutorialObjects', function() {
        showDiv();
    })


    return vm;
}

var TutorialView = function(tutorials) {
    return Vue.extend({

        props: ['tutorialObject'],
        components: {
            'join-button': JoinButton(),
            'create-end-button': CreateEndButton(tutorials),
            'files-button': FilesButton(tutorials),
        },
        template:   '<div class="tutorial-session" id="{{ tutorialObject.courseCode }}">' +
                        '<div class="tutorial-icon">' +
                            '<h1 class="icon-code">{{ tutorialObject.iconCode }}</h1>' +
                        '</div>' +
                        '<div class="tutorial-info">' +
                            '<h1><b>{{ tutorialObject.courseCode }}</b></h1>' +
                            '<h2>Group: {{ tutorialObject.groupName }}</h2>' +
                            '<h2 class = "course-name">{{ tutorialObject.courseName }}</h2>'+
                        '</div>' +
                        '<div class="tutorial-buttons">' +
                            '<create-end-button v-if="tutorialObject.isTutor" ' +
                                                ':tutorial-id="tutorialObject.tutorialID"'+
                                                ':is-session-active="tutorialObject.isRoomSessionStarted"></create-end-button>' +
                            '<join-button :is-session-active="tutorialObject.isRoomSessionStarted"' +
                                                                ':tutorial-id="tutorialObject.tutorialID"></join-button>' +
                            '<files-button :tutorial-id="tutorialObject.tutorialID"' +
                                            ':module-code="tutorialObject.courseCode"' +
                                            ':group-name="tutorialObject.groupName"></files-button>' +
                        '</div>' +
                    '</div>',
        methods: {

        }
    });
}

var JoinButton = function() {
    return Vue.extend({
        props: ['isSessionActive', 'tutorialId'],
        template:   '<div v-if="isSessionActive" v-on:click="joinTutorial" class="button" id="join-button">' +
                        '<h3>Join</h3>' +
                    '</div>' +
                    '<div v-else class="button" id="join-unable-button">' +
                        '<h3>Not Open</h3>' +
                    '</div>',
        methods: {
            joinTutorial: function() {
                var self = this;
                var tutorialID = self.$get('tutorialId');
                window.open("/tutorial/" + tutorialID);
            }
        }
    })
}

var CreateEndButton = function(tutorials) {
    return Vue.extend({
        props: ['isSessionActive', 'tutorialId'],
        template:   '<div v-if="isSessionActive" class="button" id="end-button">' +
                        '<h3>End</h3>' +
                    '</div>' +
                    '<div v-else v-on:click="createTutorialSession" class="button" id="create-button">' +
                        '<h3>Create</h3>' +
                    '</div>',
        methods: {
            createTutorialSession: function() {
                var self = this;
                var tutorialId = self.$get('tutorialId');
                tutorials.createSession(tutorialId);
            }
        }
    })
}

var FilesButton = function(tutorials) {
    return Vue.extend({
        data:
        function(){
           return {
               fileSpace:[],
               fileBox:true,
           }
        },
        props:['tutorialId', 'moduleCode', 'groupName'],
        template:   '<div v-on:click="getFileList" class="button" id="files-button">' +
                        '<h3>Files</h3>' +
                    '</div>' +
                    '<div id="fileListBox">' +
                        '<li v-for="file in fileSpace">' +
                            '<span>{{"fileName:"}}{{ file.fileName }}{{"    userID:"}}{{file.userID}}</span>' +
                            '<button v-if=file.isOwner v-on:click="deleteFile($index)">Delete</button>' +
                        '</li>' +

                        '<div class="uploadWrapper">' +
                            '<form v-on:submit.prevent="submit" class="fileForm" method="POST" enctype="multipart/form-data">' +
                            '<label class="custom-file-upload">' +
                                '<i class="fa fa-folder-open"></i>' +
                                '<input type="file" class="fileSelect" onchange="$(".uploadButton").text($(".fileSelect").val().replace(/.*[\/\\]/, ""));"/>' +
                            '</label>' +
                            '<div class="uploadButton"></div>' +
                                '<button type="submit" class="upload-button">' +
                                    '<span class="normal-indicator">Upload</span>' +
                                    '<span class="uploading-indicator">' +
                                        '<i class="fa fa-spinner fa-pulse"></i>' +
                                    '</span>' +
                                '</button>' +
                            '</form>' +
                        '</div>' +
                    '</div>',
        methods: {
            getFileList: function(){
                var self = this;
                var tutorialID = self.$get('tutorialId');

                if(self.fileBox){
                    $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        url: ('http://localhost:3000/file/getFiles?tutorialID='+ tutorialID + '&token=' + Cookies.get('token')),
                        success: function(data) {
                            var userID = data.userID;
                            var fileList = data.sessionFiles.fileList;
                            for(var i=0; i<fileList.length;i++){
                                var f = fileList[i];
                                self.fileSpace.push({
                                    fileName: f.fileName,
                                    id: f.id,
                                    userID: f.userID,
                                    isOwner: f.userID == userID
                                });
                                console.log(userID== f.userID);
                            }
                        }
                    });
                    self.fileBox = false;
                } else {
                    self.fileSpace = [];
                    self.fileBox = true;
                }
            },
            deleteFile: function(index){
                var self = this;
                var file = self.fileSpace[index];

                var fileID = file.id;

                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: ('http://localhost:3000/file/deleteFile?fileID='+ fileID + '&token=' + Cookies.get('token')),
                    success: function(data) {
                        if(data){
                            self.fileSpace.splice(index, 1);
                        }
                    }
                });
            },
            submit: function () {
                var self = this;
                var tutorialID = self.$get('tutorialId');

                function readBody(xhr) {
                    var data;
                    if (!xhr.responseType || xhr.responseType === "text") {
                        data = xhr.responseText;
                    } else if (xhr.responseType === "document") {
                        data = xhr.responseXML;
                    } else {
                        data = xhr.response;
                    }
                    return data;
                }

                // Get the selected files from the input.
                var fileSelect = document.getElementById('fileSelect');
                var files = fileSelect.files;
                var file = files[0];

                console.log(files);
                // Create a new FormData object.
                var formData = new FormData();

                if ((!file.type.match('image.*'))
                    && (!file.type.match('\.pdf'))) {
                    alert("Sorry. The system only supports image files and PDF files.");

                } else {
                    formData.append('userUpload', file, file.name);
                    // Set up the request.
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState == 4) {
                            var jsonResponse = JSON.parse(xhr.response);
                            console.log(jsonResponse)
                            if (jsonResponse.uploadStatus) {
                                callback();
                            }
                        }
                    }

                    // Open the connection.
                    xhr.open('POST', 'http://localhost:3000/file/upload?tutorialID='+ tutorialID + '&token=' + Cookies.get('token'), true);
                    xhr.send(formData);
                }
            }
        }
    });
}


function showDiv() {
    // If there are hidden divs left
    if($('div:hidden').length) {
        // Fade the first of them in
        $('div:hidden:first').fadeIn();
        // And wait one second before fading in the next one
        setTimeout(showDiv, 800);
        //showDiv();
    }
}

module.exports.init = TutorialsView;