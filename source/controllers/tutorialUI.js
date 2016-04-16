/**
 * @module controllers/tutorialUI
 * @type {*|exports|module.exports}
 */

var get = function(req, res, next){
	var url = '/tutorialUI/' + req.params.id;

	res.render('UI/tutorialUI', {
		title: 'Tutorial UI',
		ip: req.app.get('server-ip')
	});
}

module.exports.get = get;