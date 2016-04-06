/**
 * Created by chendi on 6/4/16.
 */

const STREAM = 'stream';
var handleVoiceSocketEvents = function(socketClient) {

    var streamBroadCasting = function(socketClient) {
        return function (data) {
            socketClient.roomBroadcast(STREAM, data);
        }
    };

    var registerSocketEvents = function() {
        socketClient.on(STREAM, streamBroadCasting(socketClient));
    };

    registerSocketEvents();
};

module.exports = handleVoiceSocketEvents;