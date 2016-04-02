/**
 * Created by shiyu on 1/4/16.
 */
var Vue = require('vue');

var TutorialsView = function(tutorials) {
    var vm =  new Vue({
        el: '#tutorial-list-container',
        data: {
            state: tutorials.state,
        },
        methods: {
            createTutorialSession: function(event) {
            }
        }
    });

    vm.$watch('state.tutorialObjects', function() {
        showDiv();
    })

    return vm;
}

var TutorialView = function() {
    return Vue.extend({
        props: ['tutorialObject'],
        components: {
            'join-button': JoinButton(),
            'create-end-button': CreateEndButton(),
        },
        template:   '<div class="tutorial-session" id="{{ tutorialObject.courseCode }}">' +
                        '<div class="tutorial-icon">' +
                            '<h1 class="icon-code">{{ tutorialObject.iconCode }}</h1>' +
                        '</div>' +
                        '<div class="tutorial-info">' +
                            '<h1><b>{{ tutorialObject.courseCode }}</b></h1>' +
                            '<h2>{{ tutorialObject.courseName }}</h2>' +
                            '<h2>Group: {{ tutorialObject.groupName }}</h2>' +
                        '</div>' +
                        '<div class="tutorial-buttons">' +
                            '<create-end-button v-if="tutorialObject.isTutor" :is-session-active="tutorialObject.isRoomSessionStarted"></create-end-button>' +
                            '<join-button :is-session-active="tutorialObject.isRoomSessionStarted"></join-button>' +
                            '<div class="button" id="files-button">' +
                                '<h3>Files</h3>' +
                            '</div>' +
                        '</div>' +
                    '</div>',
        methods: {

        }
    });
}

var JoinButton = function() {
    return Vue.extend({
        props: ['isSessionActive'],
        template:   '<div v-if="isSessionActive" class="button" id="join-button">' +
                        '<h3>Open</h3>' +
                    '</div>' +
                    '<div v-else class="button" id="join-unable-button">' +
                        '<h3>Not Open</h3>' +
                    '</div>',
    })
}

var CreateEndButton = function() {
    return Vue.extend({
        props: ['isSessionActive'],
        template:   '<div v-if="isSessionActive" class="button" id="end-button">' +
                        '<h3>End</h3>' +
                    '</div>' +
                    '<div v-else class="button" id="create-button">' +
                        '<h3>Create</h3>' +
                    '</div>',
    })
}

Vue.component('tutorial-view', TutorialView());

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