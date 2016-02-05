/**
 * Created by hlhr2 on 1/29/2016.
 */
var mocha = require('mocha');
var chai = require('chai');
var rooms = require('../../models/rooms');

var should = chai.should();
var expect = chai.expect;

var test = function(next){
	describe('Rooms Model', function (){


		describe('#getLobby()', function(){
			it('should return instance of Lobby', function(){
				rooms.getLobby().should.be.an.instanceof(rooms.Lobby);
			});
		});

		describe('#lobby.addRoom()', function(){
			it('should add room into the lobby', function(){
				var room = new rooms.Room();
				expect(rooms.getLobby().addRoom(1, room)).to.be.true;
				rooms.getLobby().size().should.equal(1);
				rooms.getLobby().get(1).should.be.an.instanceof(rooms.Room);
				rooms.getLobby().removeRoom(1);
			});
		});

		describe('#lobby.removeRoom()', function(){
			it('should remove room from the lobby, if room does not exist, return false', function(){
				var room = new rooms.Room();
				rooms.getLobby().addRoom(1, room);
				expect(rooms.getLobby().removeRoom(1)).to.be.true;
				rooms.getLobby().getRoomsMap().should.be.empty;
				rooms.getLobby().size().should.equal(0);
				expect(rooms.getLobby().removeRoom(1)).to.be.false;
			});
		});

		describe('#lobby.get()', function(){
			it('should return null if room does not exist', function(){
				expect(rooms.getLobby().get(1)).to.be.null;
			});
		});

	});

	//clean up after all test
	after(function(){
		rooms.getLobby().removeAllRooms();
	});
}

module.exports.test = test;
