var jwt = require('jsonwebtoken');
var setAuth = function(id, name){
	var tmpuser = {};
	tmpuser.id = id;
	tmpuser.name = name;

	var token = jwt.sign(tmpuser, 'secret', {expiresIn: '30d'});
	return token;
}

console.log(setAuth('a0119493','Chen Di'));
