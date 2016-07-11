var express = require('express');
var router = express.Router();
var fs = require('fs');
var getData = require('../getData');
var isLogin = require('../dep/login');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'Express'
	});
});
router.get('/login', function(req, res, next) {
	res.render('login', {});
})
router.post('/login', function(req, res, next) {
	var loginInfo = {
		id: '1111',
		name: 'admin',
		password: '1230'
	}
	if (req.body.name == loginInfo.name && req.body.password == loginInfo.password) {
		req.session.user = loginInfo.id;
		res.send({
			isLogin: true,
			msg: ''
		});
	} else {
		res.send({
			isLogin: false,
			msg: '密码或用户名不正确'
		});
	}
});
router.get('/home', function(req, res, next) {
	goHome(res);
})
router.get('/test', function(req, res, next) {
	res.render('test', {});
})
router.get('/getData', function(req, res, next) {
	isLogin(req, res);
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
	//http://10.252.57.93:3000?project=test&page=/demo/fileUpLoadTest&headTime=5828&docTime=5828&jsTime=22081&winTime=33951

	data += 'page=' + decodeURIComponent(req.query.page) + '|headTime=' + req.query.headTime + '|docTime=' + req.query.docTime + '|jsTime=' + req.query.jsTime + '|winTime=' + req.query.winTime + '|headSize=' + req.query.headSize + '|docSize=' + req.query.docSize;
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
router.get('/trace', function(req, res, next) {
	saveData(req, res,'traceData');
})
router.get('/info', function(req, res, next) {
	saveData(req, res,'infoData');
})
function saveData(req, res,name){
	var project = req.query.project;
	var data = '';
	for (var i in req.query) {
		if (i != 'project') {
			data += i + '=' + decodeURIComponent(req.query[i]) + '|';
		}
	};
	data = data.replace(/(\|)$/, '');
	var d = new Date();
	var year = d.getFullYear();
	var month = (d.getMonth() + 1).length > 1 ? d.getMonth() + 1 : '0' + parseInt(d.getMonth() + 1);
	var day = (d.getDate() + '').length > 1 ? d.getDate() : '0' + d.getDate();
	if (fs.existsSync(name+'/' + project)) {
		write();
	} else {
		fs.mkdirSync(name+'/' + project);
		write();
	}

	function write() {
		fs.appendFile(name+'/' + project + '/' + year + '-' + month + '-' + day + '.txt', data + '\r\n', 'utf8', function() {});
	}
	res.send('');
}
function goHome(res) {
	var projectsList = fs.readdirSync('allData/');
	var projectsList_name = [];
	var data = '';
	var lastTime = '';
	for (var j = 0; j < projectsList.length; j++) {
		projectsList_name.push(projectsList[j].replace('.txt', ''));
	}
	res.render('home', {
		projectsList: projectsList_name
	});
}
module.exports = router;