/**
 * Created by hlhr2 on 1/29/2016.
 */
var mocha = require('mocha');
var chai = require('chai');
var rooms = require('../../models/Rooms');
var ioserver = require('socket.io')(3001);

var should = chai.should();
var expect = chai.expect;

var test = function(next){
	describe('Rooms Model', function (){

		beforeEach(function(){
			rooms.getLobby().removeAllRooms();
			console.log("#Clean Up Room Before");
		});

		afterEach(function(){
			rooms.getLobby().removeAllRooms();
			console.log("#Clean Up Room After");
		});

		/**
		 * =========== Lobby Test ============
		 * ===================================
		 */

		describe('#getLobby()', function(){
			it('should return instance of Lobby', function(){
				rooms.getLobby().should.be.an.instanceof(rooms.Lobby);
			});
		});


		//describe('#lobby.findOrAddRoom()', function() {
		//	this.timeout(15000);
		//	it('should add room into the lobby', function (done) {
		//		var room = new rooms.Room();
		//		var addRoomPromise1 = rooms.getLobby().findOrAddRoom(1, room);
        //
		//		addRoomPromise1.then(function (data) {
		//			data.should.be.an.instanceof(rooms.Room);
		//			return done;
        //
		//		}).then(function (done) {
		//			var room2 = new rooms.Room();
		//			var addRoomPromise2 = rooms.getLobby().findOrAddRoom(2, room2);
        //
		//			addRoomPromise2.then(function (data) {
		//				data.should.be.an.instanceof(rooms.Room);
		//				rooms.getLobby().size().should.equal(2);
		//				rooms.getLobby().get(1).should.be.an.instanceof(rooms.Room);
		//				rooms.getLobby().get(2).should.be.an.instanceof(rooms.Room);
		//				done();
		//			});
		//		});
		//	});
		//});


        describe('#lobby.findOrAddRoom()', function() {
			this.timeout(15000);
			it('should add room into the lobby', function (done) {
				var room = new rooms.Room();
				var addRoomPromise1 = rooms.getLobby().findOrAddRoom(1, room);

				addRoomPromise1.then(function (data) {
					data.should.be.an.instanceof(rooms.Room);
					return done;

				}).then(function (done) {
					var room2 = new rooms.Room();
					var addRoomPromise2 = rooms.getLobby().findOrAddRoom(2, room2);

					addRoomPromise2.then(function (data) {
						data.should.be.an.instanceof(rooms.Room);
						rooms.getLobby().size().should.equal(2);
						rooms.getLobby().get(1).should.be.an.instanceof(rooms.Room);
						rooms.getLobby().get(2).should.be.an.instanceof(rooms.Room);
						done();
					});
				});
			});
        });

        describe('#lobby.findOrAddRoom()', function() {
			this.timeout(15000);
			it('should return false if parameter is not room', function (done) {

				var room = {};
				var addRoomPromise = rooms.getLobby().findOrAddRoom(1, room);

				addRoomPromise.catch(function (data) {
					data.should.not.be.empty;
					done();
				})
			});
        });

        describe('#lobby.findOrAddRoom()', function() {
			this.timeout(15000);
			it('should not duplicate room', function (done) {

				var room = new rooms.Room();
				var addRoomPromise = rooms.getLobby().findOrAddRoom(1, room);

				addRoomPromise.then(function (data) {
					data.should.be.an.instanceof(rooms.Room);
					return done;
				}).then(function (done) {
					var room = new rooms.Room();
					var roomTestAddRoom2 = rooms.getLobby().findOrAddRoom(1, room);

					roomTestAddRoom2.then(function (data) {
						rooms.getLobby().size().should.equal(1);
						done()
					})
				});
			});
        });


        describe('#lobby.removeRoom()', function(){
			it('should remove room from the lobby', function(done){

				var room = new rooms.Room();
				var addRoomPromise = rooms.getLobby().findOrAddRoom(1, room);

				addRoomPromise.then(function(data) {
					expect(rooms.getLobby().removeRoom(1)).to.be.true;
					rooms.getLobby().size().should.equal(0);
					done();
				});
			});
        });


        describe('#lobby.removeRoom()', function(){
			it('should return false if room does not exist', function(){
				expect(rooms.getLobby().removeRoom(1)).to.be.false;
			});
        });


        describe('#lobby.removeAllRoom()', function() {
			it('should remove all room from the lobby', function(done) {

				var room = new rooms.Room();
				var addRoomPromise = rooms.getLobby().findOrAddRoom(1, room);

				addRoomPromise.then(function(data) {
					expect(rooms.getLobby().removeAllRooms()).to.be.true;
					rooms.getLobby().size().should.equal(0);
					done();
				});
			})
        });


        describe('#lobby.get()', function(){
			it('should return null if room does not exist', function(){
				expect(rooms.getLobby().get(1)).to.be.null;
			});
        });


        describe('#lobby.getRoomsMap()', function(){
			it('should return rooms map object', function(done){

				var room = new rooms.Room();
				var addRoomPromise = rooms.getLobby().findOrAddRoom(1, room);

				addRoomPromise.then(function(data) {
					rooms.getLobby().getRoomsMap().should.be.equal(rooms.getLobby().rooms);
					done();
				});
			});
        });

        describe('#lobby.getUser()', function(){
			it('should return null user does not exist', function(){
				expect(rooms.getLobby().getUser(1)).to.be.null;
			});
        });


		/**
		 * ============ Room Test ============
		 * ===================================
		 */

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


		describe('#room.addGroup()', function(){
			it('should not duplicate group', function(){
				var room = new rooms.Room();
				room.get('default').should.be.an.instanceof(rooms.Group);
				room.size().should.be.equal(1);
				var group = new rooms.Group('default');
				expect(room.addGroup(group)).to.be.false;
				room.size().should.be.equal(1);
			});
		});


		describe('#room.addGroup()', function(){
			it('should return false if parameter is not group', function(){
				var group = {};
				var room = new rooms.Room();
				expect(room.addGroup(group)).to.be.false;
				room.size().should.be.equal(1);
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


		describe('#room.removeGroup()', function(){
			it('should return false if group does not exist', function(){
				var room = new rooms.Room();
				expect(room.removeGroup('test')).to.be.false;
				room.size().should.be.equal(1);
			});
		});


		describe('#room.registClient()', function(){
			it('should regist client into room', function(){
				var socketClient = new rooms.SocketClient('teststudent', 'teststudent', null);
				var room = new rooms.Room();
				var group = new rooms.Group(1);
				room.addGroup(group);
				expect(room.registClient(socketClient)).to.be.true;
			});
		});


		describe('#room.activateClient()', function(){
			it('should activate client into room', function(){
				var socketClient = new rooms.SocketClient('teststudent', 'teststudent', null);
				var room = new rooms.Room();
				var group = new rooms.Group(1);
				room.addGroup(group);
				room.registClient(socketClient);
				expect(room.activeClient(socketClient)).to.be.true;
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

		describe('#room.getGroupsMap()', function(){
			it('should return groups map object', function(){
				var room = new rooms.Room();
				room.getGroupsMap().should.be.equal(room.groups);
			})
		});


		describe('#room.hasUser()', function(){
			it('should get the user', function(){
				var socketClient = new rooms.SocketClient('teststudent', 'teststudent', null);
				var room = new rooms.Room();
				var group = new rooms.Group(1);
				room.addGroup(group);
				room.registClient(socketClient);
				expect(room.hasUser('teststudent')).to.be.true;
			});
		});


		describe('#room.setActive()', function(){
			it('should get the user', function(){
				var room = new rooms.Room();
				room.setActive();
				expect(room.active).to.be.true;
			});
		});


		/**
		 * ============ Group Test ============
		 * ====================================
		 */

		describe('#Group.addClient()', function(){
			it('should add client to group', function(){
				var socketClient = new rooms.SocketClient('teststudent', 'teststudent', null);
				var group = new rooms.Group();
				expect(group.addClient(socketClient)).to.be.true;
				expect(group.size() == 1).to.be.true;
			});
		});


		describe('#Group.renewClient()', function(){
			it('should renew client to group', function(){
				var socketClient = new rooms.SocketClient('teststudent', 'teststudent', null);
				var socketClient2 = new rooms.SocketClient('teststudent2', 'teststudent', null);
				var group = new rooms.Group();
				group.addClient(socketClient);
				expect(group.renewClient(socketClient2)).to.be.true;
				expect(group.get('teststudent')).to.be.an.instanceof(rooms.SocketClient);
			});
		});


		describe('#Group.removeClient()', function(){
			it('should remove client from group', function(){
				var socketClient = new rooms.SocketClient('teststudent', 'teststudent', null);
				var group = new rooms.Group();
				group.addClient(socketClient);
				group.removeClient('teststudent');
				expect(group.size() == 0).to.be.true;
			});
		});


		describe('#Group.get()', function(){
			it('should get client from group', function(){
				var socketClient = new rooms.SocketClient('teststudent', 'teststudent', null);
				var group = new rooms.Group();
				group.addClient(socketClient);
				expect(group.get('teststudent')).to.be.an.instanceof(rooms.SocketClient);
			});
		});


		describe('#Group.getClientsMap()', function(){
			it('should get client map from group', function(){
				var socketClient = new rooms.SocketClient('teststudent', 'teststudent', null);
				var group = new rooms.Group();
				group.addClient(socketClient);
				expect(group.getClientsMap() != {}).to.be.true;
			});
		});


		describe('#Group.getConnectedClientsList()', function(){
			it('should get connected clients from group', function(){
				var socketClient = new rooms.SocketClient('teststudent', 'teststudent', null);
				var group = new rooms.Group();
				group.addClient(socketClient);
				expect(group.getConnectedClientsList().length == 0).to.be.true;
			});
		});


		describe('#SocketClient.setDisconnect()', function(){
			it('should disconnect socket client', function(){
				var socketClient = new rooms.SocketClient('teststudent', 'teststudent', null);
				socketClient.setDisconnect();
				expect(socketClient.connected).to.be.false;
			});
		});


		describe('#SocketClient.getRoomID()', function(){
			this.timeout(5000);
			it('should getRoomID', function(done){

				var socketClient = new rooms.SocketClient('teststudent', 'teststudent', null);
				var room = new rooms.Room();
				var addRoomPromise = rooms.getLobby().findOrAddRoom(1, room);

				addRoomPromise.then(function(data) {
					expect(socketClient.getRoom() == null).to.be.true;
					done();
				});
			});
		});


		//describe('#SocketClient.joinRoom()', function() {
		//	this.timeout(5000);
		//	it('should join room', function (done) {
        //
		//		var socketClient = new rooms.SocketClient('teststudent', 'teststudent', null);
		//		var room = new rooms.Room();
		//		var addRoomPromise = rooms.getLobby().findOrAddRoom(1, room);
        //
		//		//addRoomPromise.then(function(data) {
		//		//	console.log('========== 1' + data);
		//		//	(false).should.be.true;
		//		//	done();
		//		//});
        //
		//		addRoomPromise.then(function(data) {
		//			//var temp = rooms.getLobby().removeRoom(1);
		//			var temp = false;
		//			console.log(temp);
		//			return assert.equal(true, true);
		//			//socketClient.joinRoom(1).should.equal(true);
		//			return done;
		//		});
		//	});
		//});

	});


	//clean up after all test
	after(function(){
		rooms.getLobby().removeAllRooms();
	});
}

module.exports.test = test;
