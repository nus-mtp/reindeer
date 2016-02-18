/**
 * Created by hlhr2 on 1/29/2016.
 */
var mocha = require('mocha');
var chai = require('chai');
var rooms = require('../../models/rooms');
var ioserver = require('socket.io')(3001);

var should = chai.should();
var expect = chai.expect;

var test = function(next){
	describe('Rooms Model', function (){

		beforeEach(function(){
			rooms.getLobby().removeAllRooms();
		})

		describe('#getLobby()', function(){
			it('should return instance of Lobby', function(){
				rooms.getLobby().should.be.an.instanceof(rooms.Lobby);
			});
		});

		describe('#lobby.addRoom()', function(){
			it('should add room into the lobby', function(){
				var room = new rooms.Room();
				expect(rooms.getLobby().addRoom(1, room)).to.be.true;
				rooms.getLobby().size().should.equal(1)
				var room2 = new rooms.Room();
				expect(rooms.getLobby().addRoom(2, room2)).to.be.true;
				rooms.getLobby().size().should.equal(2);
				rooms.getLobby().get(1).should.be.an.instanceof(rooms.Room);
				rooms.getLobby().get(2).should.be.an.instanceof(rooms.Room);
			});
		});

		describe('#lobby.removeRoom()', function(){
			it('should remove room from the lobby, if room does not exist, return false', function(){
				var room = new rooms.Room();
				rooms.getLobby().addRoom(1, room);
				var room2 = new rooms.Room();
				rooms.getLobby().addRoom(2, room2)
				expect(rooms.getLobby().removeRoom(1)).to.be.true;
				rooms.getLobby().get(2).should.be.an.instanceof(rooms.Room);
				rooms.getLobby().removeRoom(2)
				rooms.getLobby().size().should.equal(0);
				expect(rooms.getLobby().removeRoom(1)).to.be.false;
			});
		});

		describe('#lobby.get()', function(){
			it('should return null if room does not exist', function(){
				expect(rooms.getLobby().get(1)).to.be.null;
			});
		});

		describe('#room.addGroup()', function(){
			it('should add group into the room', function(){
				var room = new rooms.Room();
				room.get('default').should.be.an.instanceof(rooms.Group);
				var group = new rooms.Group(1);
				expect(room.addGroup(group)).to.be.true;
				room.size().should.equal(2)
				var group2 = new rooms.Group(2);
				expect(room.addGroup(group2)).to.be.true;
				room.size().should.equal(3);
				room.get(1).should.be.an.instanceof(rooms.Group);
				room.get(2).should.be.an.instanceof(rooms.Group);
			});
		});

		describe('#room.removeGroup()', function(){
			it('should remove group except default group from room', function(){
				var room = new rooms.Room();
				var group = new rooms.Group(1);
				var group2 = new rooms.Group(2);
				room.addGroup(group);
				room.addGroup(group2);
				room.size().should.equal(3);
				room.removeGroup(1);
				room.size().should.equal(2);
				room.get(2).should.be.an.instanceof(rooms.Group);
				expect(room.get(1)).to.be.null;
				room.removeGroup(2);
				room.size().should.equal(1);
				expect(room.removeGroup('default')).to.be.false;
				room.get('default').should.be.an.instanceof(rooms.Group);
			});
		});

		describe('#room.get()', function(){
			it('should return an instance of room', function(){
				var room = new rooms.Room();
				var group = new rooms.Group(1);
				room.get('default').groupId.should.be.equal('default');
				room.addGroup(group);
				room.get(1).groupId.should.be.equal(1);
			});
		});

	});

	//clean up after all test
	after(function(){
		rooms.getLobby().removeAllRooms();
	});
}

module.exports.test = test;
