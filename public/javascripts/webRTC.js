/**
 * Created by chendi on 29/1/16.
 */



/*
 * UsersList [<User>]
 * User {
 *   'ID': <id>,
 *   'PC': <RTCPeerConnection>
 *   'Answered': true
 * }
 * */

var socket = io.connect('http://localhost:3000/room');
var myID;
var myselfInSession = false;
var usersList = [];
var usersStatusList = [];

socket.emit('New User', 'New User');

socket.on('Assigned ID', setMyID)
socket.on('Existing UserList', gotExistingUserList);
socket.on('New Joined', gotNewUserID);
socket.on('Setup Message', gotSetUpMessage);
socket.on('User Leave', gotUserLeave);

var startButton = document.getElementById("startButton");
var joinButton = document.getElementById("joinButton");
var hangupButon = document.getElementById("hangupButton");

joinButton.disabled = true;
hangupButon.disabled = true;

startButton.onclick = start;
joinButton.onclick = joinSession;
hangupButon.onclick = hangup;

var remoteView1 = document.getElementById("remoteAudio1");
var remoteView0 = document.getElementById("remoteAudio0");
var selfView = document.getElementById("localAudio");

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
    myselfInSession = true;
    joinButton.disabled = true;
    hangupButon.disabled = false;

    for (var index in usersList) {
        var curUser = usersList[index];
        if (curUser.ID != 'LEFT') {
            var pc = usersList[index].PC;
            pc.addStream(localStream);
            pc.createOffer(onSuccessCreateOffer(usersList[index]));
        }
    }
}

function hangup () {
    myselfInSession = false;
    joinButton.disabled = false;
    hangupButon.disabled = true

    for (var index in usersList) {
        var curUser = usersList[index];

        if (curUser.Answered || curUser.Offered) {
            var pc = getUserPC(usersList[index].ID);
            pc.removeStream(localStream);
        }
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

function onSuccessCreateOffer(user) {
    function callBack(desc) {
        console.log("CreateOffer ", myID);
        user.Offered = true;
        user.PC.setLocalDescription(desc);
        socket.emit('Emit Message', JSON.stringify({"callerID": myID, "calleeID": user.ID, "sdp": desc}));
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

function onSuccessAnswer (callerID, user) {
    function callBack (desc) {
        console.log("Success Answer ", callerID);
        user.Answered = true;
        user.PC.setLocalDescription(desc);
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

function canAddMediaSrc(mediaElement) {
    return mediaElement.src == "" || !mediaElement.src.includes("blob");
}


function onAddRemoteStream(user) {
    var callBack = function (evt) {
        var mediaSrc;
        if (canAddMediaSrc(remoteView0)) {
            mediaSrc = remoteView0;
        } else {
            mediaSrc = remoteView1;
        }
        user.MediaSrc = mediaSrc;
        mediaSrc.src = URL.createObjectURL(evt.stream);
    };

    return callBack;
}

function gotSetUpMessage(data) {
    var signal = JSON.parse(data);
    //console.log("Got setup Message: ", signal);
    if (signal.sdp) {
        for (var index in usersList) {
            var curUser = usersList[index];
            var curPC = getUserPC(curUser.ID);
            if (myID == signal.calleeID && curUser.ID == signal.callerID) {
                console.log("Set SDP I'm Callee, Caller: ", signal.callerID, " ", signal.sdp);
                curPC.setRemoteDescription(new RTCSessionDescription(signal.sdp), successSetRemoteDescription, handleError);
                curPC.createAnswer(onSuccessAnswer(signal.callerID, curUser), handleError);

                // once remote stream arrives, show it in the remote video element
                curPC.onaddstream = onAddRemoteStream(curUser);

                // send any ice candidates to the other peer
                curPC.onicecandidate = onIcePCCandidate(signal.callerID);
            }

            if (myID == signal.callerID && curUser.ID == signal.calleeID) {
                console.log("Set SDP I'm Caller", signal.sdp);
                curPC.setRemoteDescription(new RTCSessionDescription(signal.sdp), successSetRemoteDescription, handleError);

                // once remote stream arrives, show it in the remote video element
                curPC.onaddstream = onAddRemoteStream(curUser);

                // send any ice candidates to the other peer
                curPC.onicecandidate = onIcePCCandidate(signal.calleeID);
            }
        }

    } else if (signal.candidate) {
        for (var index in usersList) {
            var curUser = usersList[index];
            if (signal.calleeID == myID && signal.callerID == curUser.ID) {
                console.log("Set ICE ", signal.userID, " ", signal.candidate);
                var curPC = getUserPC(curUser.ID);
                curPC.addIceCandidate(new RTCIceCandidate(signal.candidate));
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
    // Add new user to userList
    console.log('New User', userID);
    var pc = new RTCPeerConnection(configuration);
    var newUser = {
        'ID':userID,
        'PC':pc,
        "Answered": false,
        'Offered': false,
        "MediaSrc": null
    };
    usersList.push(newUser);
    console.log("userList: ", usersList);

    // Send offer to user if myself has joined session
    if (myselfInSession) {
        pc.addStream(localStream);
        pc.createOffer(onSuccessCreateOffer(newUser));
    }
}

function gotUserLeave(message) {
    var leaveUserID = message.userID;
    for (var index in usersList) {
        var curUser = usersList[index];
        if (curUser.ID == leaveUserID) {
            curUser.ID = 'LEFT';
            // Clear PC local Stream
            if (curUser.Offered) {
                curUser.Answered = false;
                curUser.PC.removeStream(localStream);
                curUser.PC.close();
                curUser.PC = null;
            }

            // Clear PC local Stream and clear media src
            if (curUser.Answered) {
                curUser.Answered = false;
                curUser.MediaSrc.src = "";
                curUser.PC.removeStream(localStream);
                curUser.PC.close();
                curUser.PC = null;
            }
        }
    }
}

function handleError(message) {
    console.log(message);
}