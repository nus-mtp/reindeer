/**
 * Created by shiyu on 28/3/16.
 */

const SLIDE_NEXT = "slide_next";
const SLIDE_PREVIOUS = "slide_previous";
const SLIDE_INDEX = "slide_index";
const SLIDE_IMAGES = "slide_images";

var handleSlideSocketEvents = function(socketClient) {
    var broadcastCurrentSlideIndex = function() {
        var presentation = socketClient.getCurrentGroup().presentation;
        var currentSlide = presentation.currentSlide;
        socketClient.roomBroadcast(SLIDE_INDEX, currentSlide);
    }

    var broadcastSlideImages = function() {
        var presentation = socketClient.getCurrentGroup().presentation;
        var slideImages = presentation.getAllSlidesAsJSON();
        socketClient.roomBroadcast(SLIDE_IMAGES, slideImages);
    }

    var nextSlide = function() {
        var presentation = socketClient.getCurrentGroup().presentation;
        presentation.nextSlide();
        broadcastCurrentSlideIndex();
    }

    var previousSlide = function() {
        var presentation = socketClient.getCurrentGroup().presentation;
        presentation.previousSlide();
        broadcastCurrentSlideIndex();
    }

    var registerEvents = function () {
        socketClient.on(SLIDE_NEXT, nextSlide);
        socketClient.on(SLIDE_PREVIOUS, previousSlide);
    }

    registerEvents();

    // On connection broadcast
    broadcastSlideImages();
    broadcastCurrentSlideIndex();
}

module.exports = handleSlideSocketEvents;