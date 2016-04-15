/**
 * Created by shiyu on 1/4/16.
 */
var Vue = require('vue');

var filesysManager = require('../../../source/controllers/filesysManager');

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
               fileSpace:['1','2'],
           }
        },
        props:['tutorialId', 'moduleCode', 'groupName'],
        template:   '<div v-on:click="getFileList" class="button" id="files-button">' +
                        '<h3>Files</h3>' +
                    '</div>' +
                    '<div hidden="hidden" id="fileListBox">' +
                        '<h1>Tutorial Files</h1>' +
                        '<li v-for="file in fileSpace">' +
                            '<span>{{"fileName:"}}{{ file.fileName }}{{"    userID:"}}{{file.userID}}</span>' +
                            '<button v-on:click="deleteFile($index)">Delete</button>' +
                        '</li>' +
                    '</div>' +
                    '<div id="uploadWrapper">' +
                       /* '<h1 id="title"> <%= workbinName %> Workbin </h1>' +*/
                    '<h1>' +
                        '<form id="fileForm" method="POST" enctype="multipart/form-data">' +
                            '<input type="file" id="fileSelect" onchange="$(".uploadButton").text($("#fileSelect").val().replace(/.*[\/\\]/, ""));"/>' +
                            '<button type="submit" class="uploadButton" v-on:click="submit">Upload</button>' +
                        '</form>' +
                    '</h1>' +
                    '</div>',
        methods: {
            getFileList: function(){
                var fileListBox=document.getElementById("fileListBox");
                fileListBox.removeAttribute("hidden");

                var self = this;
                var tutorialID = self.$get('tutorialId');
                console.log(self.fileSpace);
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: ('http://localhost:3000/file/getFiles?tutorialID='+ tutorialID + '&token=' + Cookies.get('token')),
                    success: function(data) {
                        var fileList = data.sessionFiles.fileList;
                        for(var i=0; i<fileList.length;i++){
                            var f = fileList[i];
                            self.fileSpace.push({
                                fileName: f.fileName,
                                id: f.id,
                                userID: f.userID
                            });
                        }
                        console.log(self);
                    }
                });
            },
            deleteFile: function(index){
                var self = this;
                var file = self.fileSpace[index];

                var fileID = file.id;
                var userID = file.userID;

                filepath.delete(index);
                self.fileSpace.splice(index, 1);
                filesysManager.removeUserFile(fileID, userID);
            },
            submit: function () {
                // Get the selected files from the input.
                var fileSelect = document.getElementById('fileSelect');
                var files = fileSelect.files;
                var file = files[0];

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
                    xhr.open('POST', 'http://localhost:3000/file/upload?tutorialID='+ this.tutorialID + '&token=' + Cookies.get('token'), true);
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