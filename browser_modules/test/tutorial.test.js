var tutorial = require('../tutorial.js');


var test = function(){

	describe('Tutorial View Controller', function () {


		describe('#connect(url)', function () {
			//this.timeout(25000);
			it('Should create socket connection', function (done) {
				setTimeout(done, 25000);
				var socket = tutorial.connect('http://localhost:3000/room', "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6InRlc3RzdHVkZW50IiwibmFtZSI6InRlc3RzdHVkZW50IiwiaWF0IjoxNDU3Njc1NDgxLCJleHAiOjE0NjAyNjc0ODF9.S5jZivdt7w1ZZ7I25RP4iOVhOO6ZovObYqQEtg0JWuk");

				socket.on('connect', function(){
					expect(socket.connected).to.equal(true);
					done();
				});

				//done();
			});
		});
	});
}

module.exports.test = test;
