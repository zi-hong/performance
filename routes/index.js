var express = require('express');
var router = express.Router();
var fs = require('fs');
var getData = require('../getData');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'Express'
	});
});
router.get('/home', function(req, res, next) {
	var projectsList = fs.readdirSync('allData/');
	var projectsList_name = [];
	var data = '';
	var lastTime = '';
	for (var j = 0; j < projectsList.length; j++) {
		projectsList_name.push(projectsList[j].replace('.txt', ''));
	}
	
	if (projectsList[0]) {
		var d = fs.readFileSync('allData/' + projectsList[0], {
			'encoding': 'utf8'
		});
		var list=d.split('\r\n');
		var temp=list[list.length-2];
		lastTime = temp.split('##')[0];
		data = encodeURIComponent(JSON.stringify([{
			date: lastTime,
			data: JSON.parse(temp.split('##')[1])
		}]));
	}
	res.render('home', {
		projectsList: projectsList_name,
		time: lastTime,
		data: data
	});
})
router.get('/getData', function(req, res, next) {
	var projectName = req.query.projectName;
	var startTime = req.query.startTime;
	var endTime = req.query.endTime;
	var data = '';
	if (fs.existsSync('allData/' + projectName + '.txt')) {
		data = fs.readFileSync('allData/' + projectName + '.txt', {
			'encoding': 'utf8'
		});
		data = getData.getRangeData(startTime, endTime, data);
	}
	res.send(data);
})
router.get('/saveTime', function(req, res, next) {
	var data = '';
	for (var j in req.query) {
		if (j == 'project') {
			continue;
		}
		data += j + '=' + req.query[j] + '|';
	}
	var d = new Date();
	var year = d.getFullYear();
	var month = (d.getMonth() + 1).length > 1 ? d.getMonth() + 1 : '0' + parseInt(d.getMonth() + 1);
	var day = (d.getDate() + '').length > 1 ? d.getDate() : '0' + d.getDate();
	console.log(req.query['project']);
	if (fs.existsSync('data/' + req.query['project'])) {
		write();
	} else {
		fs.mkdirSync('data/' + req.query['project']);
		write();
	}

	function write() {
		fs.appendFile('data/' + req.query['project'] + '/' + year + '-' + month + '-' + day + '.txt', data + '\r\n', 'utf8', function() {});
	}
	res.send('');
})

module.exports = router;