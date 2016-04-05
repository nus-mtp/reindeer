/**
 * Created by shiyu on 28/3/16.
 */

const SLIDE_NEXT = "slide_next";
const SLIDE_PREVIOUS = "slide_previous";
const SLIDE_SWITCH_PRESENTATION = "slide_switch_presentation";
const SLIDE_AVAILABLE_PRESENTATIONS = "slide_available_presentations";
const SLIDE_NEW_BLANK_PRESENTATION = "slide_new_blank_presentation";
const SLIDE_INDEX = "slide_index";
const SLIDE_IMAGES = "slide_images";

var handleSlideSocketEvents = function(socketClient) {
    var broadcastAvailablePresentations = function(){
        var presentations = socketClient.getCurrentGroup().presentations;
        var availablePresentations = presentations.getAllPresentations();
        socketClient.roomBroadcast(SLIDE_AVAILABLE_PRESENTATIONS, availablePresentations);
    }

    var broadcastCurrentSlideIndex = function() {
        var presentation = socketClient.getCurrentGroup().presentations.getCurrentPresentation();
        var currentSlide = presentation.currentSlide;
        socketClient.roomBroadcast(SLIDE_INDEX, currentSlide);
    }

    var broadcastSlideImages = function() {
        var presentation = socketClient.getCurrentGroup().presentations.getCurrentPresentation();
        var slideImages = presentation.getAllSlidesAsJSON();
        socketClient.roomBroadcast(SLIDE_IMAGES, slideImages);
    }

    var switchPresentation = function(presentationID) {
        var presentations = socketClient.getCurrentGroup().presentations;
        if(presentations.switchToPresentationByID(presentationID)) {
            broadcastSlideImages();
            broadcastCurrentSlideIndex();
        }
    }

    var nextSlide = function() {
        var presentation = socketClient.getCurrentGroup().presentations.getCurrentPresentation();
        presentation.nextSlide();
        broadcastCurrentSlideIndex();
    }

    var previousSlide = function() {
        var presentation = socketClient.getCurrentGroup().presentations.getCurrentPresentation();
        presentation.previousSlide();
        broadcastCurrentSlideIndex();
    }

    var newBlankPresentation = function() {
        var presentations = socketClient.getCurrentGroup().presentations;
        var newPresentationID = presentations.newBlankPresentation();
        broadcastAvailablePresentations();
        switchPresentation(newPresentationID);
    }

    var registerEvents = function () {
        socketClient.on(SLIDE_NEXT, nextSlide);
        socketClient.on(SLIDE_PREVIOUS, previousSlide);
        socketClient.on(SLIDE_SWITCH_PRESENTATION, switchPresentation);
        socketClient.on(SLIDE_NEW_BLANK_PRESENTATION, newBlankPresentation);
    }

    registerEvents();

    // On connection broadcast
    broadcastSlideImages();
    broadcastCurrentSlideIndex();
    broadcastAvailablePresentations();
}

module.exports = handleSlideSocketEvents;
module.exports.SLIDE_NEXT = SLIDE_NEXT;
module.exports.SLIDE_PREVIOUS = SLIDE_PREVIOUS;