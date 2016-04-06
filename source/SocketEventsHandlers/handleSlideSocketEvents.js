/**
 * Created by shiyu on 28/3/16.
 */

const SLIDE_NEXT = "slide_next";
const SLIDE_PREVIOUS = "slide_previous";
const SLIDE_GO_TO = "slide_go_to";
const SLIDE_PRESENTATION_ID = "slide_presentation_id";
const SLIDE_SWITCH_PRESENTATION = "slide_switch_presentation";
const SLIDE_AVAILABLE_PRESENTATIONS = "slide_available_presentations";
const SLIDE_NEW_BLANK_PRESENTATION = "slide_new_blank_presentation";
const SLIDE_UPLOAD_SUCCESS = "slide_upload_success";
const SLIDE_INDEX = "slide_index";
const SLIDE_IMAGES = "slide_images";
const SLIDE_COUNT = "slide_count";

var handleSlideSocketEvents = function(socketClient) {
    var broadcastUploadSuccess = function() {
        broadcastAvailablePresentations();
        broadcastSlideImages();
        broadcastCurrentSlideIndex();
    }

    var broadcastCountOfSlides = function() {
        var presentations = socketClient.getCurrentGroup().presentations;
        var presentation = presentations.getCurrentPresentation();
        socketClient.roomBroadcast(SLIDE_COUNT, presentation.getCountOfSlides());
    }

    var broadcastAvailablePresentations = function(){
        var presentations = socketClient.getCurrentGroup().presentations;
        var availablePresentations = presentations.getAllPresentations();
        socketClient.roomBroadcast(SLIDE_AVAILABLE_PRESENTATIONS, availablePresentations);
    }

    var broadcastCurrentPresentationID = function() {
        var presentations = socketClient.getCurrentGroup().presentations;
        var presentationID =  presentations.currentPresentationID;
        socketClient.roomBroadcast(SLIDE_PRESENTATION_ID, presentationID);
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
            broadcastAvailablePresentations();
            broadcastCountOfSlides();
            //broadcastCurrentPresentationID();
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

    var goToSlide = function(goToIndex) {
        var presentation = socketClient.getCurrentGroup().presentations.getCurrentPresentation();
        presentation.goToSlide(goToIndex);
        broadcastCurrentSlideIndex();
    }

    var newBlankPresentation = function() {
        var presentations = socketClient.getCurrentGroup().presentations;
        var newPresentationID = presentations.newBlankPresentation();
        switchPresentation(newPresentationID);
    }

    var registerEvents = function () {
        socketClient.on(SLIDE_NEXT, nextSlide);
        socketClient.on(SLIDE_PREVIOUS, previousSlide);
        socketClient.on(SLIDE_SWITCH_PRESENTATION, switchPresentation);
        socketClient.on(SLIDE_NEW_BLANK_PRESENTATION, newBlankPresentation);
        socketClient.on(SLIDE_UPLOAD_SUCCESS, switchPresentation);
        socketClient.on(SLIDE_GO_TO, goToSlide);
    }

    registerEvents();

    // On connection broadcast
    broadcastSlideImages();
    broadcastCurrentSlideIndex();
    broadcastAvailablePresentations();
    broadcastCountOfSlides();
    //broadcastCurrentPresentationID();
}

module.exports = handleSlideSocketEvents;
module.exports.SLIDE_NEXT = SLIDE_NEXT;
module.exports.SLIDE_PREVIOUS = SLIDE_PREVIOUS;
module.exports.SLIDE_SWITCH_PRESENTATION = SLIDE_SWITCH_PRESENTATION;
module.exports.SLIDE_NEW_BLANK_PRESENTATION = SLIDE_NEW_BLANK_PRESENTATION;
module.exports.SLIDE_UPLOAD_SUCCESS = SLIDE_UPLOAD_SUCCESS;