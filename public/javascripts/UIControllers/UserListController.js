/*
 Handles displaying of users in a room.
 */

function UserListController() {
	/*this.initializeAddButton();
	this.initializeDeleteButton();*/
	this.userListArray = [];
	this.displayUserList(this.userListArray);
}

UserListController.prototype.addUser = function (id) {
	this.userListArray.push(id);
	this.displayUserList(this.userListArray);
}

UserListController.prototype.deleteUser = function (id) {
	var index = this.userListArray.indexOf(id);
	if (index > -1) {
		this.userListArray.splice(index, 1);
	}
	this.displayUserList(this.userListArray);
}

UserListController.prototype.displayUserList = function (userListArray) {
	var userListTable = $('.user-list-table');
	$('.user-list-table').html("");
	for (var i = 0; i < userListArray.length; i++) {
		userListTable.append($('<tr class="user-id"></tr>').append($('<td></td>').append(userListArray[i])));
	}
}

/*UserListController.prototype.initializeAddButton = function () {
	var that = this;
	var addButton = $(".add-button");
	addButton.click(function () {
		that.addUser("Hello! It's me!");
	});
}*/

/*UserListController.prototype.initializeDeleteButton = function () {
	var that = this;
	var deleteButton = $(".delete-button");
	deleteButton.click(function () {
		that.deleteUser("Hello! It's me!");
	});
}*/


//Remove this in the real thing!
var userListController = new UserListController();
