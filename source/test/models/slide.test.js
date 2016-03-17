/**
 * Created by shiyu on 14/3/16.
 */
var mocha = require ('mocha');
var chai = require ('chai');
var Slide = require ('../../models/Slide');
var Action = require ('../../models/Action');
var chaiAsPromised = require ('chai-as-promised');

chai.use (chaiAsPromised);

var should = chai.should ();
var expect = chai.expect;

var test = function () {
    describe('Slide Model', function() {
        var slide = new Slide("");
        var canvasObjectsManager = slide.canvasObjectsManager;
        var results = null;
        describe('#Add new fabric object', function() {
            slide.addFabricObject("user1", "dummy1");
            slide.addFabricObject("user2", "dummy2");
            slide.addFabricObject("user2", "dummy3");
            it("It should add fabric objects to the respective user's fabric object list", function () {
                results = canvasObjectsManager.getFabricObjectsOfUser("user1")[0];
                results.should.be.equal("dummy1");
                results = canvasObjectsManager.getFabricObjectsOfUser("user2");
                results.should.to.include('dummy2');
                results.should.to.include('dummy3');
                slide.undoAction("user1");
                //console.log(canvasObjectsManager.getAllFabricObjectsToRenderCanvas()[0]);
            });
        });
        describe('#Undo new fabric object', function() {
            it('It should undo the previous action and remove the last object added', function () {
                results = canvasObjectsManager.getFabricObjectsOfUser("user1").length;
                results.should.be.equal(0);
                slide.redoAction("user1");
            });
        });

        describe('#redo new fabric object', function() {
            it('It should redo the undone action done previously', function () {
                results = canvasObjectsManager.getFabricObjectsOfUser("user1")[0];
                results.should.be.equal("dummy1");
                slide.clearFabricObjects("user2");
            });
        });

        describe('#Clear fabric object of user', function() {
            it('It should clear the users fabric objects', function () {
                results = canvasObjectsManager.getFabricObjectsOfUser("user2").length;
                results.should.be.equal(0);
                slide.undoAction("user2");
            });
        });

        describe('#Undo clearing of fabric object of user', function() {
            it('It should undo the previous action and remove the last object added', function () {
                results = canvasObjectsManager.getFabricObjectsOfUser("user2");
                results.should.to.include('dummy2');
                results.should.to.include('dummy3');
                slide.redoAction("user2");
            });
        });

        describe('#redo clearing of fabric objects of user', function() {
            it ('It should redo the previous action', function () {
                results = canvasObjectsManager.getFabricObjectsOfUser("user2").length;
                results.should.be.equal(0);
            });
        });
    })
}

module.exports.test = test;