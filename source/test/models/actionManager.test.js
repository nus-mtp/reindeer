/**
 * Created by shiyu on 14/3/16.
 */
var mocha = require ('mocha');
var chai = require ('chai');
var ActionManager = require ('../../models/ActionManager');
var Action = require ('../../models/Action');
var chaiAsPromised = require ('chai-as-promised');

chai.use (chaiAsPromised);

var should = chai.should ();
var expect = chai.expect;

var test = function () {
    describe('Action Manager Model', function() {
        var actionManager = new ActionManager();
        var actionObject = new Action("sayhello", {forwardMessage: "hello", backwardMessage: "bye"});
        var results = null;
        describe('#Register an action', function() {
            actionManager.registerAction("sayhello", function (userId, actionData) {
                results = actionData.forwardMessage;
                //console.log("message: " + actionData.forwardMessage);
            }, function(userId, actionData) {
                results = actionData.backwardMessage;
                //console.log("message: " + actionData.backwardMessage);
            });
            //console.log(actionManager.actionHashMap);
            actionManager.executeAction("123", actionObject);
            it ('Should call the forward callback function', function () {
                results.should.be.equal("hello");
                actionManager.undoAction("123");
            });
            //actionManager.undoAction("123");
            //it ('Should call the backward callback function', function() {
            //    results.should.be.equal("bye");
            //});
        });
        describe('#Undo an action', function() {
            //actionManager.undoAction("123");
            //console.log(results);
            it ('Should call the backward callback function', function() {
                results.should.be.equal("bye");
                actionManager.redoAction("123");
            });
        })

        describe('#Redo an action', function() {
            //actionManager.undoAction("123");
            //console.log(results);
            it ('Should call the forward callback function', function() {
                results.should.be.equal("hello");
                actionManager.undoAction("123");
            });
        })

        describe('#Undo an action', function() {
            //actionManager.undoAction("123");
            //console.log(results);
            it ('Should call the backward callback function', function() {
                results.should.be.equal("bye");
                actionManager.executeAction("123", actionObject);
                results = actionManager.redoAction("123");
            });
        })

        describe('#Redo an action after a new action', function() {
            //actionManager.undoAction("123");
            //console.log(results);
            it ('Redo stack should be empty after a new action', function() {
                results.should.be.equal(false);
            });
        })
    })
}

module.exports.test = test;