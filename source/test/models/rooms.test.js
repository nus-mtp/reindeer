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


		describe('#lobby.findOrAddRoom()', function() {
			it('should add room into the lobby', function () {
				var lobby = new rooms.Lobby();
				var room = new rooms.Room();
				var addRoomPromise1 = lobby.findOrAddRoom(1, room);

				return addRoomPromise1.then(function (data) {
					var room2 = new rooms.Room();
					var addRoomPromise2 = lobby.findOrAddRoom(2, room2);
					return addRoomPromise2;

				}).then(function (data) {
					data.should.be.an.instanceof(rooms.Room)
					lobby.size().should.equal(2);
					lobby.get(1).should.be.an.instanceof(rooms.Room);
					lobby.get(2).should.be.an.instanceof(rooms.Room);
				});
			});
		});

		describe('#lobby.findOrAddRoom()', function() {
			it('should return false if parameter is not room', function () {
				var room = {};
				var addRoomPromise = rooms.getLobby().findOrAddRoom(1, room);

				return addRoomPromise.catch(function (data) {
					data.should.not.be.empty;
				})
			});
		});

		describe('#lobby.findOrAddRoom()', function() {
			it('should not duplicate room', function () {

				var lobby = new rooms.Lobby();
				var room = new rooms.Room();
				var addRoomPromise = lobby.findOrAddRoom(1, room);

				return addRoomPromise.then(function () {
					var room = new rooms.Room();
					var roomTestAddRoom2 = lobby.findOrAddRoom(1, room);
					return roomTestAddRoom2;
				}).then(function (data) {
					lobby.size().should.equal(1);
				});
			});
		});


		describe('#lobby.removeRoom()', function(){
			it('should remove room from the lobby', function(){

				var lobby = new rooms.Lobby();
				var room = new rooms.Room();
				var addRoomPromise = lobby.findOrAddRoom(1, room);

				return addRoomPromise.then(function(data) {
					expect(lobby.removeRoom(1)).to.be.true;
					lobby.size().should.equal(0);
				});
			});
		});


		describe('#lobby.removeRoom()', function(){
			it('should return false if room does not exist', function(){
				expect(rooms.getLobby().removeRoom(1)).to.be.false;
			});
		});


		describe('#lobby.removeAllRoom()', function() {
			it('should remove all room from the lobby', function() {

				var lobby = new rooms.Lobby();
				var room = new rooms.Room();
				var addRoomPromise = lobby.findOrAddRoom(1, room);

				return addRoomPromise.then(function(data) {
					expect(lobby.removeAllRooms()).to.be.true;
					lobby.size().should.equal(0);
				});
			})
		});


		describe('#lobby.get()', function(){
			it('should return null if room does not exist', function(){
				expect(rooms.getLobby().get(1)).to.be.null;
			});
		});


		describe('#lobby.getRoomsMap()', function(){
			it('should return rooms map object', function(){

				var lobby = new rooms.Lobby();
				var room = new rooms.Room();
				var addRoomPromise = lobby.findOrAddRoom(1, room);

				return addRoomPromise.then(function(data) {
					lobby.getRoomsMap().should.be.equal(lobby.rooms);
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


		/**
		 * ============ Socket Client ============
		 * ====================================
		 */


		describe('#SocketClient.setDisconnect()', function(){
			it('should disconnect socket client', function(){
				var socketClient = new rooms.SocketClient('teststudent', 'teststudent', null);
				socketClient.setDisconnect();
				expect(socketClient.connected).to.be.false;
			});
		});


		describe('#SocketClient.getRoomID()', function(){
			it('should getRoomID', function(){

				var socketClient = new rooms.SocketClient('teststudent', 'teststudent', null);
				var room = new rooms.Room();
				var addRoomPromise = rooms.getLobby().findOrAddRoom(1, room);

				return addRoomPromise.then(function(data) {
					socketClient.regist(1);
					expect(socketClient.getRoom()).to.be.not.null;
				});
			});
		});


		describe('#SocketClient.joinRoom()', function() {
			it('should join room', function () {

				var socketClient = new rooms.SocketClient('teststudent', 'teststudent', null);
				var room = new rooms.Room();
				var addRoomPromise = rooms.getLobby().findOrAddRoom(1, room);

				return addRoomPromise.then(function(data) {
					socketClient.regist(1);
					(socketClient.joinRoom(1)).should.be.true;
				});
			});
		});


		describe('#SocketClient.regist()', function() {
			it('should register into room', function () {

				var socketClient = new rooms.SocketClient('teststudent', 'teststudent', null);
				var room = new rooms.Room();
				var addRoomPromise = rooms.getLobby().findOrAddRoom(1, room);

				return addRoomPromise.then(function(data) {
					socketClient.regist(1);
					(socketClient.getRoom()).should.not.be.null;
				});
			});
		});


		describe('#SocketClient.inRoom()', function() {
			it('should register into room', function () {

				var socketClient = new rooms.SocketClient('teststudent', 'teststudent', null);
				var room = new rooms.Room();
				var addRoomPromise = rooms.getLobby().findOrAddRoom(1, room);

				return addRoomPromise.then(function(data) {
					socketClient.regist(1);
					(socketClient.inRoom(1)).should.be.true;
				});
			});
		});


		describe('#SocketClient.leaveRoom()', function() {
			it('should leave room', function () {

				var socketClient = new rooms.SocketClient('teststudent', 'teststudent', null);
				var room = new rooms.Room();
				var addRoomPromise = rooms.getLobby().findOrAddRoom(1, room);

				return addRoomPromise.then(function(data) {
					socketClient.regist(1);
					socketClient.joinRoom(1);
					socketClient.leaveRoom();
					(socketClient.inRoom(1)).should.be.false;
				});
			});
		});


		describe('#SocketClient.joinGroup()', function() {
			it('should join group into room', function () {

				var socketClient = new rooms.SocketClient('teststudent', 'teststudent', null);
				var room = new rooms.Room();
				var group = new rooms.Group('testGroup');
				room.addGroup(group);
				var addRoomPromise = rooms.getLobby().findOrAddRoom(1, room);

				return addRoomPromise.then(function(data) {
					socketClient.regist(1);
					socketClient.joinGroup(1, 'testGroup');
					(group.size()).should.equals(1);
				});
			});
		});


		describe('#SocketClient.inGroup()', function() {
			it('should be in group', function () {

				var socketClient = new rooms.SocketClient('teststudent', 'teststudent', null);
				var room = new rooms.Room();
				var group = new rooms.Group('testGroup');
				room.addGroup(group);
				var addRoomPromise = rooms.getLobby().findOrAddRoom(1, room);

				return addRoomPromise.then(function(data) {
					socketClient.regist(1);
					socketClient.joinGroup(1, 'testGroup');
					(socketClient.inGroup(1, 'testGroup')).should.be.true;
				});
			});
		});


		describe('#SocketClient.leaveGroup()', function() {
			it('should leave group', function () {

				var socketClient = new rooms.SocketClient('teststudent', 'teststudent', null);
				var room = new rooms.Room();
				var group = new rooms.Group('testGroup');
				room.addGroup(group);
				var addRoomPromise = rooms.getLobby().findOrAddRoom(1, room);

				return addRoomPromise.then(function(data) {
					socketClient.regist(1);
					socketClient.joinGroup(1, 'testGroup');
					socketClient.leaveGroup();
					(group.size()).should.equals(0);
				});
			});
		});


		describe('#SocketClient.getCurrentGroup()', function() {
			it('should get current group', function () {

				var socketClient = new rooms.SocketClient('teststudent', 'teststudent', null);
				var room = new rooms.Room();
				var group = new rooms.Group('testGroup');
				room.addGroup(group);
				var addRoomPromise = rooms.getLobby().findOrAddRoom(1, room);

				return addRoomPromise.then(function(data) {
					socketClient.regist(1);
					socketClient.joinGroup(1, 'testGroup');
					(socketClient.getCurrentGroup()).should.equals(group);
				});
			});
		});


		describe('#SocketClient.getCurrentGroupUserList()', function() {
			it('should get current connected client list', function () {

				var socketClient = new rooms.SocketClient('teststudent', 'teststudent', null);
				var room = new rooms.Room();
				var group = new rooms.Group('testGroup');
				room.addGroup(group);
				var addRoomPromise = rooms.getLobby().findOrAddRoom(1, room);

				return addRoomPromise.then(function(data) {
					socketClient.regist(1);
					socketClient.joinGroup(1, 'testGroup');
					(socketClient.getCurrentGroupUserList().length).should.equals(0);
				});
			});
		});


		describe('#SocketClient.emit()', function() {
			it('should not emit message', function () {

				var socketClient = new rooms.SocketClient('teststudent', 'teststudent', null);
				var room = new rooms.Room();
				var group = new rooms.Group('testGroup');
				room.addGroup(group);
				var addRoomPromise = rooms.getLobby().findOrAddRoom(1, room);

				return addRoomPromise.then(function(data) {
					socketClient.regist(1);
					socketClient.joinGroup(1, 'testGroup');
					(socketClient.emit('test', 'test')).should.be.false;
				});
			});
		});


		describe('#SocketClient.roomBroadCast()', function() {
			it('should not pop error when broadcast message', function () {

				var socketClient = new rooms.SocketClient('teststudent', 'teststudent', null);
				var room = new rooms.Room();
				var group = new rooms.Group('testGroup');
				room.addGroup(group);
				var addRoomPromise = rooms.getLobby().findOrAddRoom(1, room);

				return addRoomPromise.then(function(data) {
					socketClient.regist(1);
					socketClient.roomBroadcast('test', 'test');
				}).catch(function(error){
					error.should.be.null;
				});
			});
		});


		describe('#SocketClient.personalMessage()', function() {
			it('should not pop error when emit personal message', function () {

				var socketClient = new rooms.SocketClient('teststudent', 'teststudent', null);
				var room = new rooms.Room();
				var group = new rooms.Group('testGroup');
				room.addGroup(group);
				var addRoomPromise = rooms.getLobby().findOrAddRoom(1, room);

				return addRoomPromise.then(function(data) {
					socketClient.regist(1);
					socketClient.personalMessage('test', 'test', 'testStudent');
				}).catch(function(error){
					error.should.be.null;
				});
			});
		});


		describe('#SocketClient.groupBroadCast()', function() {
			it('should not pop error when group broad cast message', function () {

				var socketClient = new rooms.SocketClient('teststudent', 'teststudent', null);
				var room = new rooms.Room();
				var group = new rooms.Group('testGroup');
				room.addGroup(group);
				var addRoomPromise = rooms.getLobby().findOrAddRoom(1, room);

				return addRoomPromise.then(function(data) {
					socketClient.regist(1);
					socketClient.groupBroadcast('test', 'test');
				}).catch(function(error){
					error.should.be.null;
				});
			});
		});
	});


	//clean up after all test
	after(function(){
		rooms.getLobby().removeAllRooms();
	});
}

module.exports.test = test;
