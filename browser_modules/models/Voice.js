/**
 * Created by chendi on 6/4/16.
 */

// Get local record
var outputAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;

const CHANNELS = 1;
const FRAME_COUT = 256;
const SAMPLE_RATE = 44100;

// Start remote playing by default
var myArrayBuffer = outputAudioCtx.createBuffer(CHANNELS, FRAME_COUT, SAMPLE_RATE);

// Buffer Setting
var voiceBufferBlockThreshold = 30;
var voiceBufferArray = [];

function Voice(socket) {
    this.socket = socket;
    socket.on('connect', function() {

        // Timeout player
        var timeoutLength = (FRAME_COUT/SAMPLE_RATE) * voiceBufferBlockThreshold * 1000;
        setTimeout(playVoice, timeoutLength);

        // Set up local stream
        navigator.getUserMedia({
            audio: true
        }, gotLocalStream(socket), function(err){});

        socket.on('stream', streamHandler);

    });
}

function streamHandler() {
    return function(data){
        setTimeout(gotRemoteStream(data) , 0);
    }
}


// Receive data to  Buffer
function gotRemoteStream(data) {
    console.log("got new voice");
    return function() {
        var left = data.buffer;

        // Push new source block into array
        for (var channel = 0; channel < CHANNELS; channel++) {
            var nowBuffering = myArrayBuffer.getChannelData(channel);
            for (var i = 0; i < voiceBufferBlockThreshold; i++) {
                for (var j = 0; j < FRAME_COUT; j++) {
                    //nowBuffering[i * FRAME_COUT + j] = Math.random() * 2 - 1;;
                    nowBuffering[i * FRAME_COUT + j] = left[j];
                }
            }
        }

        var source = outputAudioCtx.createBufferSource();
        source.buffer = myArrayBuffer;

        voiceBufferArray.push(source);
    }
}


function playVoice() {

    var source = voiceBufferArray.pop();
    if (source) {
        source.connect(outputAudioCtx.destination);
        source.start();
        setTimeout(playVoice, 0);
    } else {
        console.log("data not enough");
        setTimeout(playVoice, timeoutLength);
    }

}

function gotLocalStream(socket) {
    return function(stream){
        var inputAudioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Create an AudioNode from the stream.
        var audioInput = inputAudioContext.createMediaStreamSource(stream);

        // create a javascript node
        var recorder = inputAudioContext.createScriptProcessor(FRAME_COUT, 1, 1);

        // specify the processing function
        recorder.onaudioprocess = recorderProcess(socket);

        // connect stream to our recorder
        audioInput.connect(recorder);

        // connect our recorder to the previous destination
        recorder.connect(inputAudioContext.destination);
    }
}

function convertFloat32ToInt16(buffer) {
    var l = buffer.length;
    var point = Math.floor(l/3);
    var buf = new Int16Array(point);
    for (var x = l; x > 0;) {
        var average = (buffer[x] + buffer[x-1] +  buffer[x-2]) / 3;
        buf[point] = average*0x7FFF;
        point -= 1;
        x -= 3;
    }
    return buf.buffer;
}

function recorderProcess(socket){
    return function(e){
        var raw_record = e.inputBuffer.getChannelData(0);
        //var resampled_voice = resampler.resampler(raw_record);
        //var left = convertFloat32ToInt16(raw_record);
        var left = raw_record;
        socket.emit('stream', {buffer:left});
    }

}

module.exports = Voice;