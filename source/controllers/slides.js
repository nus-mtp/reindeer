/**
 * Created by shiyu on 4/2/16.
 */
const
    express     = require('express'),
    Promise     = require('promise'),
    pdfParser   = require('../lib/pdf-parser');

var get = function(req, res, next) {
    //pdfParser('test.pdf').then(function(filepath) {
    //    res.send(filepath);
    //}, function(err) {
    //    res.send(err.message);
    //});

    res.render('slidetest', {
        title: 'Slide Test',
        ip: req.app.get('server-ip')
    });
};

module.exports.get = get;