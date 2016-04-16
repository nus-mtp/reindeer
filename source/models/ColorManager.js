/**
 * @module models/ColorManager
 */

/**
 * Color Manager Constructor
 * @constructor
 */
var ColorManager = function() {
    this.setOfRandomColors = {};
}

ColorManager.prototype.getUniqueRandomColor = function() {
    var uniqueColor = generateRandomColor();
    while(this.setOfRandomColors[uniqueColor]) {
        uniqueColor = generateRandomColor();
    }

    this.setOfRandomColors[uniqueColor] = true;
    return uniqueColor;
}

var generateRandomColor = function() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

module.exports = ColorManager;