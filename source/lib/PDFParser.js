/**
 * Created by shiyu on 1/4/16.
 */
var fs      = require('fs');
var pdf2img = require('./pdf2img');
var path = require('path');

var PDFParser = function(inputPath, outputPath, targetName) {
    var input   = inputPath;

    pdf2img.setOptions({
        type: 'png',                      // png or jpeg, default png
        size: 1024,                       // default 1024
        density: 600,                     // default 600
        outputdir: outputPath,  // mandatory, outputdir must be absolute path
        targetname: targetName
    });

    pdf2img.convert(input, function(info) {
        console.log(info);
    });
}

module.exports = PDFParser;
