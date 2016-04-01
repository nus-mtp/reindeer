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

        }
    });

    vm.$watch('state.tutorialObjects', function() {
        showDiv();
    })

    return vm;
}

function showDiv() {
    // If there are hidden divs left
    if($('div:hidden').length) {
        // Fade the first of them in
        $('div:hidden:first').fadeIn();
        // And wait one second before fading in the next one
        setTimeout(showDiv, 800);
    }
}

module.exports.init = TutorialsView;