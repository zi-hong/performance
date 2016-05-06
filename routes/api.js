var express = require('express');
var router = express.Router();
var isLogin = require('../login');
var getData = require('../getData');
var fs = require('fs');

router.get('/', function(req, res, next) {
	res.send('api');
});
router.get('/getObjet', function(req, res, next) {
	if (isLogin(req, res)) {
		try {
			var projectsList = fs.readdirSync('allData/');
			var projectsList_name = [];
			for (var j = 0; j < projectsList.length; j++) {
				projectsList_name.push(projectsList[j].replace('.txt', ''));
			}
			res.send({
				projects: projectsList_name,
				code: 1
			});
		} catch (ex) {
			res.send({
				message: ex.message,
				code: 0
			});
		}
	}
})
router.get('/performanceData', function(req, res, next) {
	console.log(111);
	// if (isLogin(req, res)) {
		var project = req.query.project;
		var startTime = req.query.startTime;
		var endTime = req.query.endTime;
		var data = [];
		console.log(project);
		if (fs.existsSync('allData/' + project + '.txt')) {
			data = fs.readFileSync('allData/' + project + '.txt', {
				'encoding': 'utf8'
			});
			data = getData.getRangeData(startTime, endTime, data);
		}
		res.send({code:1,data:data});
	// }
})
module.exports = router;