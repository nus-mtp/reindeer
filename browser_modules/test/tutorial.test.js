var tutorial = require('../tutorial.js');

var socket = tutorial.connect();

var test = function(){
	describe('Tutorial View Controller', function () {
		describe('#connect(url)', function () {
			it('Should create socket connection', function (done) {
				var socket = tutorial.connect('http://localhost:3000/room', {query: "token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6InRlc3RzdHVkZW50IiwibmFtZSI6InRlc3RzdHVkZW50IiwiaWF0IjoxNDU3NjU1NjcxLCJleHAiOjE0NjAyNDc2NzF9.cPbgZrJo9yctaB5goUz8U4MFZuO9RNolSdg5RoDKuls"})
				expect(socket.connected).to.equal(true);
			});
		});
	});
}

module.exports.test = test;
