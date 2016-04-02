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

var TutorialView = Vue.extend({
    props:['tutorialObject'],
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
                        '<div class="button" id="files-button">' +
                            '<h3>Files</h3>' +
                        '</div>' +
                    '</div>' +
                '</div>',
});

Vue.component('tutorial-view', TutorialView);

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