/**
 * Created by chendi on 29/1/16.
 */



/*
 * UsersList [<User>]
 * User {
 *   'ID': <id>,
 *   'PC': <RTCPeerConnection>
 * }
 * */

var socket = io.connect('http://localhost:3000/room');
var myID;
var myDesc;
var usersList = [];

socket.emit('New User', 'New User');

socket.on('Assigned ID', setMyID)
socket.on('Existing UserList', gotExistingUserList);
socket.on('New Joined', gotNewUserID);
socket.on('Setup Message', gotSetUpMessage);

var startButton = document.getElementById("startButton");
var joinButton = document.getElementById("joinButton");
var hangupButon = document.getElementById("hangupButton");

joinButton.disabled = true;
hangupButon.disabled = true;

startButton.onclick = start;
joinButton.onclick = joinSession;
hangupButon.onclick = hangup;

var remoteView1 = document.getElementById("remoteVideo1");
var remoteView0 = document.getElementById("remoteVideo0");
var selfView = document.getElementById("localVideo");

// =============== Get ID ===============
// ======================================
function setMyID(message) {
    myID = message.assignedID;
    console.log('My ID is: ', myID);
}

// =============== WebRTC ===============
// ======================================
var pc;
var configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };
var localStream;

// run start(true) to initiate a call
function start() {
    startButton.disabled = true;
    joinButton.disabled = false;

    // get the local stream, show it in the local video element and send it
    getUserMedia({"audio": true, "video": true}, function (stream) {
        selfView.src = URL.createObjectURL(stream);
        localStream = stream;
    }, handleError);
}

function joinSession() {
    console.log("Join Session");
    joinButton.disabled = true;
    hangupButon.disabled = false;

    for (var index in usersList) {
        var pc = usersList[index].PC;
        pc.addStream(localStream);
        pc.createOffer(onSuccessCreateOffer(usersList[index].ID, pc));
    }
}

function hangup () {
    joinButton.disabled = false;
    hangupButon.disabled = true

    for (var index in usersList) {
        var pc = getUserPC(usersList[index].ID);
        pc.removeStream(localStream);
    }
}

function gotExistingUserList(message) {
    var userIDList = message.userIDList;
    for (var index in userIDList) {
        if (userIDList[index] != myID) {
            console.log("Add existing user to user list: ", userIDList[index]);
            addNewUser(userIDList[index]);
        }
    }
}

function onSuccessCreateOffer(calleeID, pc) {
    function callBack(desc) {
        console.log("CreateOffer ", myID);
        pc.setLocalDescription(desc);
        myDesc = desc;
        socket.emit('Emit Message', JSON.stringify({"callerID": myID, "calleeID": calleeID, "sdp": desc}));
    }
    return callBack;
}

function getVideoSource(userID) {
    for (var index in usersList) {
        var curRemoteView = document.getElementById("remoteVideo" + index);
        if (curRemoteView.src != null) {
            return curRemoteView;
        }
    }
}

function getUserPC (userID) {
    //console.log(usersList);
    for (var index in usersList) {
        //console.log("user: ", usersList[index], "User.ID: ", usersList[index].ID, " userID: ", userID);
        if (usersList[index].ID == userID) {
            return usersList[index].PC;
        }
    }
    console.log("Cannot find userID: ", userID);
}

function onSuccessAnswer (callerID, pc) {
    function callBack (desc) {
        console.log("Success Answer ", callerID);
        pc.setLocalDescription(desc);
        myDesc = desc;
        socket.emit('Emit Message', JSON.stringify({"callerID": callerID, "calleeID": myID, "sdp": desc}));
    }
    return callBack;
}

function onIcePCCandidate(calleeID) {
    function callBack (evt) {
        if (!event || !event.candidate) {
            return;
        } else {
            console.log("Send Candidate MyID", myID, " ", evt.candidate);
            socket.emit('Emit Message', JSON.stringify({
                "callerID": myID,
                "calleeID": calleeID,
                "candidate": evt.candidate
            }));
        }
    }

    return callBack;
}

function gotSetUpMessage(data) {
    var signal = JSON.parse(data);
    //console.log("Got setup Message: ", signal);
    if (signal.sdp) {
        for (var index in usersList) {
            var pc = getUserPC(usersList[index].ID);
            if (myID == signal.calleeID && usersList[index].ID == signal.callerID) {
                console.log("Set SDP I'm Callee, Caller: ", signal.callerID, " ", signal.sdp);
                pc.setRemoteDescription(new RTCSessionDescription(signal.sdp), successSetRemoteDescription, handleError);
                pc.createAnswer(onSuccessAnswer(signal.callerID, pc), handleError);

                // once remote stream arrives, show it in the remote video element
                pc.onaddstream = function (evt) {
                    //var videoSrc = getVideoSource(userID);
                    //var videoSrc = remoteView0;
                    if (remoteView0.src == "") {
                        videoSrc = remoteView0;
                    } else {
                        videoSrc = remoteView1;
                    }
                    videoSrc.src = URL.createObjectURL(evt.stream);
                };

                // send any ice candidates to the other peer
                pc.onicecandidate = onIcePCCandidate(signal.callerID);
            }

            if (myID == signal.callerID && usersList[index].ID == signal.calleeID) {
                console.log("Set SDP I'm Caller", signal.sdp);
                pc.setRemoteDescription(new RTCSessionDescription(signal.sdp), successSetRemoteDescription, handleError);

                // once remote stream arrives, show it in the remote video element
                pc.onaddstream = function (evt) {
                    //var videoSrc = getVideoSource(userID);
                    //var videoSrc = remoteView0;
                    if (remoteView0.src == "") {
                        videoSrc = remoteView0;
                    } else {
                        videoSrc = remoteView1;
                    }
                    videoSrc.src = URL.createObjectURL(evt.stream);
                };

                // send any ice candidates to the other peer
                pc.onicecandidate = onIcePCCandidate(signal.calleeID);
            }
        }

    } else if (signal.candidate) {
        for (var index in usersList) {
            if (signal.calleeID == myID && signal.callerID == usersList[index].ID) {
                console.log("Set ICE ", signal.userID, " ", signal.candidate);
                var pc = getUserPC(usersList[index].ID);
                pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
                break;
            }
        }
    } else {
        console.log("Unknown Message", signal);
    }
}

function successAddCandidateCallBack(message) {
    console.log("successAddCandidateCallBack ", message);
}

function successSetRemoteDescription(message) {
    console.log("successSetRemoteDescription ", message);
}

function gotNewUserID(message) {
    var userID = message.userID;
    addNewUser(userID);
}

function addNewUser(userID) {
    console.log('New User', userID);
    var pc = new RTCPeerConnection(configuration);
    var newUser = {
        'ID':userID,
        'PC':pc
    };
    usersList.push(newUser);
    console.log("userList: ", usersList);
}

function handleError(message) {
    console.log(message);
}