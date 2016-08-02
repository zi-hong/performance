var express = require('express');
var router = express.Router();
var isLogin = require('../dep/login');
var getData = require('../getData');
var fs = require('fs');

router.get('/', function(req, res, next) {
	res.send('api');
});
/*性能分析获取项目名*/
router.get('/getObjet', function(req, res, next) {
		isLogin(req, res);
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
	})
	/*性能统计数据*/
router.get('/performanceData', function(req, res, next) {
		isLogin(req, res);
		var project = req.query.project;
		var startTime = req.query.startTime;
		var endTime = req.query.endTime;
		var data = [];
		if (fs.existsSync('allData/' + project + '.txt')) {
			data = fs.readFileSync('allData/' + project + '.txt', {
				'encoding': 'utf8'
			});
			data = getData.getRangeData(startTime, endTime, data);
		}
		res.send({
			code: 1,
			data: data
		});
	})
	/*打点统计--项目名*/
router.get('/pointProjectList', function(req, res, next) {
		isLogin(req, res);
		getNameList(req, res, 'traceData');
	})
	/*打点统计--埋点统计*/
router.get('/pointData', function(req, res, next) {
		// isLogin(req, res);
		var project = req.query.project;
		var startTime = req.query.startTime;
		var endTime = req.query.endTime;

		var startTime_date = new Date(startTime + ' 00:00');
		var startTime_time = startTime_date.getTime();

		var endTime_date = new Date(endTime + ' 00:00');
		var endTime_time = endTime_date.getTime();

		var dataList = [];
		if (fs.existsSync('traceData/' + project)) {
			for (var i = startTime_time; i <= endTime_time; i += 1000 * 60 * 60 * 24) {
				var d = new Date(i);
				var year = d.getFullYear();
				var mouth = (parseInt(1 + d.getMonth()) + '').length > 1 ? parseInt(1 + d.getMonth()) : '0' + parseInt(1 + d.getMonth());
				var day = (d.getDate() + '').length > 1 ? d.getDate() : '0' + d.getDate();
				var path = 'traceData/' + project + '/' + year + '-' + mouth + '-' + day + '.txt'
				if (!fs.existsSync(path)) {
					continue;
				}
				var data = fs.readFileSync(path, {
					'encoding': 'utf8'
				});
				data = getBaseData(data);
				if (data) {
					dataList.push({
						date: year + '-' + mouth + '-' + day,
						data: data
					});
				}
			}
		}
		res.send({
			code: 1,
			data: dataList
		});
	})
	/*打点统计--天访问量*/
router.get('/dayData', function(req, res, next) {
		var project = req.query.project;
		var time = req.query.time;
		if (fs.existsSync('infoData/' + project)) {
			var d = new Date(time + ' 00:00');
			var year = d.getFullYear();
			var mouth = (parseInt(1 + d.getMonth()) + '').length > 1 ? parseInt(1 + d.getMonth()) : '0' + parseInt(1 + d.getMonth());
			var day = (d.getDate() + '').length > 1 ? d.getDate() : '0' + d.getDate();
			var path = 'infoData/' + project + '/' + year + '-' + mouth + '-' + day + '.txt'
			if (!fs.existsSync(path)) {
				res.send({
					code: 0
				});
				return;
			}
			var data = fs.readFileSync(path, {
				'encoding': 'utf8'
			});
			data = getDayData(data);
			res.send({
				code: 1,
				data: data
			});
		} else {
			res.send({
				code: 0
			});
		}
	})
	/*基本信息统计--项目名*/
router.get('/infoProjectList', function(req, res, next) {
		getNameList(req, res, 'infoData');
	})
	/*基本信息统计--pv*/
router.get('/infoPv', function(req, res, next) {
		var project = req.query.project;
		var startTime = req.query.startTime;
		var endTime = req.query.endTime;
		var startTime_date = new Date(startTime + ' 00:00');
		var startTime_time = startTime_date.getTime();

		var endTime_date = new Date(endTime + ' 00:00');
		var endTime_time = endTime_date.getTime();
		var dataList = [];
		if (fs.existsSync('infoData/' + project)) {
			for (var i = startTime_time; i <= endTime_time; i += 1000 * 60 * 60 * 24) {
				var d = new Date(i);
				var year = d.getFullYear();
				var mouth = (parseInt(1 + d.getMonth()) + '').length > 1 ? parseInt(1 + d.getMonth()) : '0' + parseInt(1 + d.getMonth());
				var day = (d.getDate() + '').length > 1 ? d.getDate() : '0' + d.getDate();
				var path = 'infoData/' + project + '/' + year + '-' + mouth + '-' + day + '.txt'
				if (!fs.existsSync(path)) {
					continue;
				}
				var data = fs.readFileSync(path, {
					'encoding': 'utf8'
				});
				data = getInfoPvData(data);
				if (data) {
					dataList.push({
						date: year + '-' + mouth + '-' + day,
						data: data
					});
				}
			}
		}
		res.send({
			code: 1,
			data: dataList
		});
	})
	/*浏览器数据*/
router.get('/browser', function(req, res, next) {
		var project = req.query.project;
		var startTime = req.query.startTime;
		var endTime = req.query.endTime;
		var startTime_date = new Date(startTime + ' 00:00');
		var startTime_time = startTime_date.getTime();

		var endTime_date = new Date(endTime + ' 00:00');
		var endTime_time = endTime_date.getTime();
		var dataList = [];
		if (fs.existsSync('infoData/' + project)) {
			for (var i = startTime_time; i <= endTime_time; i += 1000 * 60 * 60 * 24) {
				var d = new Date(i);
				var year = d.getFullYear();
				var mouth = (parseInt(1 + d.getMonth()) + '').length > 1 ? parseInt(1 + d.getMonth()) : '0' + parseInt(1 + d.getMonth());
				var day = (d.getDate() + '').length > 1 ? d.getDate() : '0' + d.getDate();
				var path = 'infoData/' + project + '/' + year + '-' + mouth + '-' + day + '.txt'
				if (!fs.existsSync(path)) {
					continue;
				}
				var data = fs.readFileSync(path, {
					'encoding': 'utf8'
				});
				data = getBrowserData(data);
				if (data) {
					dataList.push({
						date: year + '-' + mouth + '-' + day,
						data: data
					});
				}
			}
		}
		res.send({
			code: 1,
			data: dataList
		});
	})
	/*基本信息统计--使用平台统计*/
router.get('/platform', function(req, res, next) {
	var project = req.query.project;
	var startTime = req.query.startTime;
	var endTime = req.query.endTime;
	var startTime_date = new Date(startTime + ' 00:00');
	var startTime_time = startTime_date.getTime();

	var endTime_date = new Date(endTime + ' 00:00');
	var endTime_time = endTime_date.getTime();
	var dataList = [];
	if (fs.existsSync('infoData/' + project)) {
		for (var i = startTime_time; i <= endTime_time; i += 1000 * 60 * 60 * 24) {
			var d = new Date(i);
			var year = d.getFullYear();
			var mouth = (parseInt(1 + d.getMonth()) + '').length > 1 ? parseInt(1 + d.getMonth()) : '0' + parseInt(1 + d.getMonth());
			var day = (d.getDate() + '').length > 1 ? d.getDate() : '0' + d.getDate();
			var path = 'infoData/' + project + '/' + year + '-' + mouth + '-' + day + '.txt'
			if (!fs.existsSync(path)) {
				continue;
			}
			var data = fs.readFileSync(path, {
				'encoding': 'utf8'
			});
			data = getPlatformData(data);
			if (data) {
				dataList.push({
					date: year + '-' + mouth + '-' + day,
					data: data
				});
			}
		}
	}
	res.send({
		code: 1,
		data: dataList
	});
})

function getBrowserData(data) {
	if (!data) {
		return;
	}
	var list = data.split('\r\n');
	var result = {};
	for (var i = 0; i < list.length - 1; i++) {
		var browser = list[i].match(/(^|\|)browser\=([^|]*)/i);
		if (!browser || !browser[2]) {
			continue;
		}
		var name = browser[2];
		if (name != '58app' && name != 'uc' && name != 'qqbrowser') {
			name = 'others';
		}
		if (result[name]) {
			result[name]++;
		} else {
			result[name] = 1;
		}
	}
	return result;
}
/*基本信息统计--平台*/
function getPlatformData(data) {
	if (!data) {
		return;
	}
	var list = data.split('\r\n');
	var result = {};
	for (var i = 0; i < list.length - 1; i++) {

		var os = list[i].match(/(^|\|)os\=([^|]*)/);
		if (!os || !os[2]) {
			continue;
		}
		var name = os[2];
		if (result[name]) {
			result[name]++;
		} else {
			result[name] = 1;
		}
	}
	return result;
}
/*按小时数据*/
function getDayData(data) {
	/*
		{
			pagename:{
				1:1,
				2:3,
				3:2
			}
		}
	*/
	if (!data) {
		return;
	}
	var list = data.split('\r\n');
	var result = {};
	for (var i = 0; i < list.length - 1; i++) {
		var pageName = list[i].match(/(^|\|)page\=([^|]*)/);
		var time = list[i].match(/(^|\|)\_\=([^|]*)/);
		var hour = null;
		if (!pageName || !pageName[2] || !time || !time[2]) {
			continue;
		}
		pageName = decodeURIComponent(pageName[2]).replace(/(\/*((\?|#).*|$))/g,'');
		var d = new Date(parseInt(time[2]));
		hour = d.getHours();
		if (result[pageName]) {
			if (result[pageName][hour]) {
				result[pageName][hour]++;
			} else {
				result[pageName][hour] = 1;
			}
		} else {
			result[pageName] = {};
			result[pageName][hour] = 1;
		}
	}
	return result;
}
/*获得项目名*/
function getNameList(req, res, name) {
	try {
		var projectsList = fs.readdirSync(name + '/');
		res.send({
			projects: projectsList,
			code: 1
		});
	} catch (ex) {
		res.send({
			message: ex.message,
			code: 0
		});
	}
}
/*获得getInfoPvData*/
function getInfoPvData(data) {
	if (!data) {
		return;
	}
	var list = data.split('\r\n');
	var result = {};
	for (var i = 0; i < list.length - 1; i++) {
		var pageName = list[i].match(/(^|\|)page\=([^|]*)/);
		if (!pageName || !pageName[2]) {
			continue;
		}
		var name = decodeURIComponent(pageName[2]).replace(/(\/*((\?|#).*|$))/g,'');
		if (result[name]) {
			result[name]++;
		} else {
			result[name] = 1;
		}
	}
	return result;
}
/*获得数据*/
function getBaseData(data) {
	if (!data) {
		return;
	}
	var list = data.split('\r\n');
	/*
	{
		pagename1: [{
				tid: 12,
				number: 123
			}
		],
		pagename2: [{
				tid: 12,
				number: 123
			}
		]
	}
	*/
	var result = {};
	for (var j = 0; j < list.length - 1; j++) {
		var row = list[j].split('|');
		var rowObj = {};
		for (var i = 0; i < row.length; i++) {
			rowObj[row[i].split('=')[0]] = row[i].split('=')[1];
		}
		var isHas = false; //标记是否已添加
		rowObj.page = decodeURIComponent(rowObj.page).replace(/(\/*((\?|#).*|$))/g,'');
		if (result[rowObj.page]) {
			for (var k = 0; k < result[rowObj.page].length; k++) {
				if (result[rowObj.page][k].tid == rowObj.tid) {
					isHas = true;
					result[rowObj.page][k].number++;
				}
			}
			if (!isHas) {
				result[rowObj.page].push({
					tid: rowObj.tid,
					number: 1
				});
			}
		} else {
			result[rowObj.page] = [{
				tid: rowObj.tid,
				number: 1
			}];
		}
	}
	return result;
}
module.exports = router;