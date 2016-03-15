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
        var actionObject = new Action("sayhello", null);
        var results = null;
        describe('#Register an action', function() {
            actionManager.registerAction("sayhello", function () {
                results = "hello";
            }, function() {
                results = "bye";
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
            });
        })
    })
}

module.exports.test = test;