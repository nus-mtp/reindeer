/**
 * Created by shiyu on 4/2/16.
 */

'use strict';

const
    PDFImage = require("pdf-image").PDFImage,
    Promise = require('promise');

module.exports = function(pathToPDF) {

    return new Promise(function(fullfill, reject) {
        var pdfImage = new PDFImage(pathToPDF);

        pdfImage.numberOfPages().then(function(numberOfPages) {
            var map = [];
            var converted = 0;
            for (var i=0; i<numberOfPages; ++i) {
                // using a closure to capture the current iteration value
                // we pass in the current element by value
                (function (pageIndex) {
                    pdfImage.convertPage(pageIndex).then(function (imagePath) {
                        map[pageIndex] = imagePath.replace('public/','');
                        ++converted;
                        if (converted == numberOfPages) {
                            fullfill(map);
                        }
                    }, function(err) {
                        reject(err)
                    });
                })(i);
            }
        });
    });
};