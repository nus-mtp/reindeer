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
        var actionManager = slide.actionManager;
        var canvasObjectsManager = slide.canvasObjectsManager;
        var actionObject = new Action("addFabricObject", {fabricObject: "dummy1"});
        var secondActionObject = new Action("addFabricObject", {fabricObject: "dummy2"});
        var thirdActionObject = new Action("addFabricObject", {fabricObject: "dummy3"});
        var clearActionObject = new Action("clearFabricObjects", {});
        var results = null;
        describe('#Add new fabric object', function() {
            actionManager.executeAction("user1", actionObject);
            actionManager.executeAction("user2", secondActionObject);
            actionManager.executeAction("user2", thirdActionObject);
            it("It should add fabric objects to the respective user's fabric object list", function () {
                results = canvasObjectsManager.getFabricObjectsOfUser("user1")[0];
                results.should.be.equal("dummy1");
                results = canvasObjectsManager.getFabricObjectsOfUser("user2");
                results.should.to.include('dummy2');
                results.should.to.include('dummy3');
                actionManager.undoAction("user1");
                //console.log(canvasObjectsManager.getAllFabricObjectsToRenderCanvas()[0]);
            });
        });
        describe('#Undo new fabric object', function() {
            it('It should undo the previous action and remove the last object added', function () {
                results = canvasObjectsManager.getFabricObjectsOfUser("user1").length;
                results.should.be.equal(0);
                actionManager.redoAction("user1");
            });
        });

        describe('#redo new fabric object', function() {
            it('It should redo the undone action done previously', function () {
                results = canvasObjectsManager.getFabricObjectsOfUser("user1")[0];
                results.should.be.equal("dummy1");
                actionManager.executeAction("user2", clearActionObject);
            });
        });

        describe('#Clear fabric object of user', function() {
            it('It should clear the users fabric objects', function () {
                results = canvasObjectsManager.getFabricObjectsOfUser("user2").length;
                results.should.be.equal(0);
                actionManager.undoAction("user2");
            });
        });

        describe('#Undo clearing of fabric object of user', function() {
            it('It should undo the previous action and remove the last object added', function () {
                results = canvasObjectsManager.getFabricObjectsOfUser("user2");
                results.should.to.include('dummy2');
                results.should.to.include('dummy3');
                actionManager.redoAction("user2");
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