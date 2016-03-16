/**
 * Created by shiyu on 16/3/16.
 */
var CanvasObjectsManager = function() {
    this.hashOfUsersFabricObjects = {};
}

CanvasObjectsManager.prototype.addNewFabricObjectToUser = function(userId, fabricObject) {
    var fabricObjectsBelongingToUser = this.hashOfUsersFabricObjects[userId];

    if (!fabricObjectsBelongingToUser) {
        fabricObjectsBelongingToUser = [];
        this.hashOfUsersFabricObjects = fabricObjectsBelongingToUser;
    }

    fabricObjectsBelongingToUser.push(fabricObject);
}

CanvasObjectsManager.prototype.removeLastFabricObjectFromUser = function(userId) {
    var fabricObjectsBelongingToUser = this.hashOfUsersFabricObjects[userId];

    if (!fabricObjectsBelongingToUser) {
        return null;
    } else {
        var lastFabricObject = this.hashOfUsersFabricObjects.pop();
        if (lastFabricObject) {
            return lastFabricObject;
        } else {
            return null;
        }
    }
}

CanvasObjectsManager.prototype.popAllFabricObjectFromUser = function(userId) {
    var fabricObjectsBelongingToUser = this.hashOfUsersFabricObjects[userId];

    if (!fabricObjectsBelongingToUser) {
        return false;
    } else {
        this.hashOfUsersFabricObjects[userId] = [];
        return fabricObjectsBelongingToUser;
    }
}

CanvasObjectsManager.prototype.loadFabricObjectsToUser = function(userId, fabricObjects) {
    this.hashOfUsersFabricObjects[userId] = fabricObjects;
}

CanvasObjectsManager.prototype.getAllFabricObjectsToRenderCanvas = function() {
    var allFabricObjects = [];
    for (var user in this.hashOfUsersFabricObjects) {
        allFabricObjects =  allFabricObjectsc.concat(this.hashOfUsersFabricObjects[user]);
    }

    return allFabricObjects;
}

module.exports = CanvasObjectManagers;