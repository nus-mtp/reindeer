var express = require('express');
var name = 'testname';

var getname = function(inname){
	return inname;
}
module.exports.getname = getname;