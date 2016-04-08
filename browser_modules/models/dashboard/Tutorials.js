/**
 * Created by shiyu on 1/4/16.
 */
var $ = jQuery = require('jquery');
var Cookies = require('js-cookie');

var Tutorials = function (getTutorialsURL, createSessionURL) {
    this.state = {
        tutorialObjects: [],
    }

    this.getTutorialsURL = getTutorialsURL;
    this.createSessionURL = createSessionURL;
    this.getTutorialUpdates();
}

Tutorials.prototype.createSession = function(tutorialID) {
        var self = this;
        $.ajax({
            type: "POST",
            url: self.createSessionURL,
            data: {
                token: Cookies.get('token'),
                roomID:tutorialID
            },
            success: function() {
                self.getTutorialUpdates();
            },
            error: console.log("Fail to create room"),
            dataType: "JSON"
        });
}

Tutorials.prototype.getTutorialUpdates = function() {
    var self = this;
    console.log(self.getTutorialsURL);
    $.ajax({
        type: "POST",
        url: this.getTutorialsURL,
        data: {token: Cookies.get('token')},
        success: function(data) {
            console.log(data);
            //console.log(parseRawData(data));
            var newTutorialObjects = parseRawData(data);
            if (isDifferent(self.state.tutorialObjects, newTutorialObjects)) {
                self.state.tutorialObjects = newTutorialObjects;
            }
            setTimeout(self.getTutorialUpdates.bind(self), 5000);
        },
        error: console.log("Fail to pull available tutorials"),
        dataType: "JSON"
    });
}

function isDifferent(oldObjects, newObjects) {
    return  !(JSON.stringify(oldObjects) === JSON.stringify(newObjects));
}

function parseRawData(data) {
    var tutorialObjects = [];
    var rawMapOfTutorials = data.result;
    for (tutorialID in rawMapOfTutorials) {
        var tutorial = rawMapOfTutorials[tutorialID][0];
        var courseCode = tutorial.coursecode;
        var courseID = tutorial.courseid;
        var courseName = tutorial.coursename;
        var groupName = tutorial.name;
        var time = tutorial.time;
        var isRoomSessionStarted = tutorial.roomSessionStarted;
        var role = tutorial.users[0].userTutorial.role;
        var tutorialID = tutorial.id;

        var isTutor = false;
        if (role == 'tutor') {
            isTutor = true;
        }
        var tutorialObject = {
            courseID: courseID,
            courseCode: courseCode,
            courseName: courseName,
            iconCode: getIconCode(courseName),
            role: role,
            groupName: groupName,
            isRoomSessionStarted: isRoomSessionStarted,
            isTutor: isTutor,
            tutorialID: tutorialID,
        }

        tutorialObjects.push(tutorialObject);
    }

    return tutorialObjects;
}

function getIconCode(courseName) {
    var res = courseName.split(" ");
    if(res.length == 1)
        return res[0].substring(0, 2);
    else
        return res[0].substring(0, 1) + res[1].substring(0, 1);
}


module.exports = Tutorials;