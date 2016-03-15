/**
 * Created by shiyu on 4/3/16.
 */
var slide = require('./Slide');

var presentation = function() {
    this.slides = [];
    this.currentSlide = 0;
    for (var i=0; i<60; ++i) {
        this.slides.push(new slide("/images/test-"+ i +".png"));
    }
}

presentation.prototype.getAllSlidesAsJSON = function() {
    var jsonObject = [];
    for (var i=0; i<this.slides.length; ++i) {
        jsonObject.push(this.slides[i].slideImagePath);
    }

    return jsonObject;
}

presentation.prototype.getCurrentSlide = function() {
    return this.slides[this.currentSlide];
}

presentation.prototype.insertSlideInFrontOfCurrentSlide = function(imagePath) {
    var newSlide;
    if (imagePath) {
        newSlide = new Slide(imagePath);
    } else {
        // Create a blank slide
        newSlide = newSlide();
    }

    this.slides.splice(this.currentSlide, 0, newSlide)
}

presentation.prototype.deleteSlide = function() {

}


presentation.prototype.nextSlide = function() {
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

presentation.prototype.previousSlide = function() {
    var temp = this.currentSlide;

    temp--;
    if (temp >= 0) {
        this.currentSlide = temp;
        return true;
    } else {
        return false;
    }
}

module.exports = presentation;