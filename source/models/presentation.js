/**
 * @module models/presentation
 * @type {Slide|exports|module.exports}
 */

var Slide = require('./Slide');

var Presentation = function(presentationObject) {
    this.slides = [];
    this.currentSlide = 0;
    for (var i=0; i<presentationObject.length; ++i) {
        this.slides.push(new Slide(presentationObject[i]['path']));
    }
}

Presentation.prototype.getCountOfSlides = function() {
    return this.slides.length;
}

Presentation.prototype.getSlideByIndex = function(index) {
    var slide = this.slides[index];
    if (slide) {
        return slide;
    }
}

Presentation.prototype.getAllSlidesAsJSON = function() {
    var jsonObject = [];
    for (var i=0; i<this.slides.length; ++i) {
        jsonObject.push({imagePath: this.slides[i].slideImagePath});
    }

    return jsonObject;
}

Presentation.prototype.getCurrentSlide = function() {
    return this.slides[this.currentSlide];
}

Presentation.prototype.insertSlideInFrontOfCurrentSlide = function(imagePath) {
    var newSlide;
    if (imagePath) {
        newSlide = new Slide(imagePath);
    } else {
        // Create a blank slide
        newSlide = newSlide();
    }

    this.slides.splice(this.currentSlide, 0, newSlide)
}

Presentation.prototype.deleteSlide = function() {

}

Presentation.prototype.nextSlide = function() {
    var temp = this.currentSlide;
    var sizeOfSlides = this.slides.length;

    temp++;
    if (temp < sizeOfSlides) {
        this.currentSlide = temp;
        return true;
    } else {
        return false;
    }
}

Presentation.prototype.previousSlide = function() {
    var temp = this.currentSlide;

    temp--;
    if (temp >= 0) {
        this.currentSlide = temp;
        return true;
    } else {
        return false;
    }
}

Presentation.prototype.goToSlide = function(goToSlideIndex) {
    if (this.slides[goToSlideIndex]) {
        this.currentSlide = goToSlideIndex;
        return true;
    } else {
        return false;
    }
}

module.exports = Presentation;