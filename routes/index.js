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
router.get('/login', function(req, res, next) {
	res.render('login', {});
})
router.post('/login', function(req, res, next) {
	var loginInfo = {
			id:'1111',
			name: 'admin',
			password: '1230'
		}
	if (req.body.name == loginInfo.name && req.body.password == loginInfo.password) {
		req.session.user = loginInfo.id;
		res.send({isLogin:true,msg:''});
	}else{
		res.send({isLogin:false,msg:'密码或用户名不正确'});
	}
});
router.get('/home', function(req, res, next) {
	if(isLogin(req, res)){
		goHome(res);
	}
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
	//http://10.252.57.93:3000?project=test&page=/demo/fileUpLoadTest&headTime=5828&docTime=5828&jsTime=22081&winTime=33951
	// for (var j in req.query) {
	// 	if (j == 'project') {
	// 		continue;
	// 	}
	// 	data += j + '=' + req.query[j] + '|';
	// }
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

function goHome(res) {
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
		var list = d.split('\r\n');
		var temp = list[list.length - 2];
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
}
function isLogin(req, res){
	if(req.session.user){
		return true;
	}else{
		res.redirect('/login');
		return false;
	}
}
module.exports = router;