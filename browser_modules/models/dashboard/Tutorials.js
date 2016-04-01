/**
 * Created by shiyu on 1/4/16.
 */
var $ = jQuery = require('jquery');

var Tutorials = function (ajaxURL) {
    this.state = {
        tutorialObjects: [],
    }

    this.ajaxURL = ajaxURL;
    this.getTutorialUpdates();
}

Tutorials.prototype.getTutorialUpdates = function() {
    var self = this;
    $.ajax({
        type: "POST",
        url: self.ajaxURL,
        data: {token: Cookies.get('token')},
        success: function(data) {
            console.log(data);
            self.state.tutorialObjects = parseRawData(data);
            console.log(parseRawData(data));
            //setTimeout(self.getTutorialUpdates, 5000);
        },
        error: console.log("Fail to pull available tutorials"),
        dataType: "JSON"
    });
}

function parseRawData(data) {
    var tutorialObjects = [];
    var rawMapOfTutorials = data.result;
    for (tutorialID in rawMapOfTutorials) {
        var tutorial = rawMapOfTutorials[tutorialID][0];
        var courseCode = tutorial.coursecode;
        var courseId = tutorial.courseid;
        var courseName = tutorial.coursename;
        var time = tutorial.time;
        var isRoomSessionStarted = tutorial.roomSessionStarted;

        var tutorialObject = {
            courseCode: courseCode,
            info: courseName,
            iconCode: courseCode.substring(0, 2)
        }
        tutorialObjects.push(tutorialObject);
    }

    return tutorialObjects;
}

module.exports = Tutorials;