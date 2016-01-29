/**
 * Created by hlhr2 on 1/29/2016.
 */
var assert = require('assert');
var rooms = require('../../models/rooms');

var test = function(){
	describe('Rooms Model', function (){

		describe('#getLobby()', function(){
			it('should return instance of Lobby', function(){
				assert.equal(true, (rooms.getLobby() instanceof rooms.Lobby));
			});
		});

	});
}

module.exports.test = test;
