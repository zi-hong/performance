var express = require('express');
var router = express.Router();
var isLogin = require('../dep/login');
var userInfo = require('../config/userConfig');
var getData = require('../getData');

var fs = require('fs');

router.get('/', function(req, res, next) {
	res.send('api');
});
/*性能分析获取项目名*/
router.get('/getObjet', function(req, res, next) {
		isLogin(req, res);
		getNameList(req, res, 'allData/');
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
		getNameList(req, res, 'traceData/');
	})
	/*打点统计--埋点统计*/
router.get('/pointData', function(req, res, next) {
		// isLogin(req, res);
		var project = req.query.project;
		var startTime = req.query.startTime;
		var endTime = req.query.endTime;

		var startTime_time = getTimeByDate(startTime);
		var endTime_time = getTimeByDate(endTime);

		var dataList = [];
		if (fs.existsSync('traceData/' + project)) {
			for (var i = startTime_time; i <= endTime_time; i += 1000 * 60 * 60 * 24) {

				var o = getTimePathByDate(i)
				var year = o.year;
				var mouth = o.mouth;
				var day = o.day;

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
	isLogin(req, res);
	getNameList(req, res, 'infoData/');
})

/*浏览器数据*/
router.get('/browser', function(req, res, next) {
		var project = req.query.project;
		var startTime = req.query.startTime;
		var endTime = req.query.endTime;

		var startTime_time = getTimeByDate(startTime);
		var endTime_time = getTimeByDate(endTime);

		var dataList = [];
		if (fs.existsSync('infoData/' + project)) {
			for (var i = startTime_time; i <= endTime_time; i += 1000 * 60 * 60 * 24) {

				var o = getTimePathByDate(i)

				var year = o.year;
				var mouth = o.mouth;
				var day = o.day;

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

	var startTime_time = getTimeByDate(startTime);
	var endTime_time = getTimeByDate(endTime);

	var dataList = [];
	if (fs.existsSync('infoData/' + project)) {
		for (var i = startTime_time; i <= endTime_time; i += 1000 * 60 * 60 * 24) {
			var o = getTimePathByDate(i)
			var year = o.year;
			var mouth = o.mouth;
			var day = o.day;
			var path = 'infoData/' + project + '/' + year + '-' + mouth + '-' + '' + day + '.txt';
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
router.get('/performance', function(req, res, next) {
	var project = req.query.project;
	var startTime = req.query.startTime;
	var endTime = req.query.endTime;

	var startTime_time = getTimeByDate(startTime);
	var endTime_time = getTimeByDate(endTime);
	var dataList = [];
	if (fs.existsSync('infoData/' + project)) {
		for (var i = startTime_time; i <= endTime_time; i += 1000 * 60 * 60 * 24) {
			var o = getTimePathByDate(i)
			var year = o.year;
			var mouth = o.mouth;
			var day = o.day;
			var path = 'infoData/' + project + '/' + year + '-' + mouth + '-' + '' + day + '.txt';
			if (!fs.existsSync(path)) {
				continue;
			}
			var data = fs.readFileSync(path, {
				'encoding': 'utf8'
			});

			data = getPerformance(data);
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
router.get('/pageList', function(req, res, next) {
	var project = req.query.project;
	var startTime = req.query.startTime;
	var endTime = req.query.endTime;
	var startTime_time = getTimeByDate(startTime);
	var endTime_time = getTimeByDate(endTime);
	var dataList = [];
	if (fs.existsSync('infoData/' + project)) {
		for (var i = startTime_time; i <= endTime_time; i += 1000 * 60 * 60 * 24) {
			var o = getTimePathByDate(i)
			var year = o.year;
			var mouth = o.mouth;
			var day = o.day;
			var path = 'infoData/' + project + '/' + year + '-' + mouth + '-' + '' + day + '.txt';
			if (!fs.existsSync(path)) {
				continue;
			}
			var data = fs.readFileSync(path, {
				'encoding': 'utf8'
			});

			var d = getPageList(data);
			dataList = dataList.concat(d);
		}
	}
	var pages = dataList.filter(function(val, index) {
		if (dataList.indexOf(val) == index) {
			return true;
		}
		return false;
	})
	res.send({
		code: 1,
		data: pages
	});
})
router.get('/customData', function(req, res, next) {
	var project = req.query.project;
	var startTime = req.query.startTime;
	var endTime = req.query.endTime;
	var startTime_time = getTimeByDate(startTime);
	var endTime_time = getTimeByDate(endTime);
	var page = req.query.page;
	var filter = req.query.filter;
	var dataList = [];
	if (fs.existsSync('infoData/' + project)) {
		for (var i = startTime_time; i <= endTime_time; i += 1000 * 60 * 60 * 24) {
			var o = getTimePathByDate(i)
			var year = o.year;
			var mouth = o.mouth;
			var day = o.day;
			var path = 'infoData/' + project + '/' + year + '-' + mouth + '-' + '' + day + '.txt';
			if (!fs.existsSync(path)) {
				continue;
			}
			var data = fs.readFileSync(path, {
				'encoding': 'utf8'
			});

			var d = getCustomData(data, page, filter);
			if (d) {
				dataList.push({
					date: year + '-' + mouth + '-' + day,
					data: d
				});
			}
		}
	}
	res.send({
		code: 1,
		data: dataList
	});
})
router.get('/uv', function(req, res, next) {
	var project = req.query.project;
	var startTime = req.query.startTime;
	var endTime = req.query.endTime;
	var startTime_time = getTimeByDate(startTime);
	var endTime_time = getTimeByDate(endTime);
	var dataList = [];
	if (fs.existsSync('infoData/' + project)) {
		for (var i = startTime_time; i <= endTime_time; i += 1000 * 60 * 60 * 24) {
			var o = getTimePathByDate(i)
			var year = o.year;
			var mouth = o.mouth;
			var day = o.day;
			var path = 'infoData/' + project + '/' + year + '-' + mouth + '-' + '' + day + '.txt';
			if (!fs.existsSync(path)) {
				continue;
			}
			var data = fs.readFileSync(path, {
				'encoding': 'utf8'
			});

			var d = getUvData(data);
			if (d) {
				dataList.push({
					date: year + '-' + mouth + '-' + day,
					data: d
				});
			}
		}
	}
	res.send({
		code: 1,
		data: dataList
	});
})
router.get('/pageInfo', function(req, res, next) {
	var project = req.query.project;
	var page = req.query.page;
	var startTime = req.query.startTime;
	var endTime = req.query.endTime;
	var startTime_time = getTimeByDate(startTime);
	var endTime_time = getTimeByDate(endTime);
	var dataList = [];
	if (fs.existsSync('infoData/' + project)) {
		for (var i = startTime_time; i <= endTime_time; i += 1000 * 60 * 60 * 24) {
			var o = getTimePathByDate(i)
			var year = o.year;
			var mouth = o.mouth;
			var day = o.day;
			var path = 'infoData/' + project + '/' + year + '-' + mouth + '-' + '' + day + '.txt';
			if (!fs.existsSync(path)) {
				continue;
			}
			var data = fs.readFileSync(path, {
				'encoding': 'utf8'
			});

			var d = getUvData(data, page);
			if (d) {
				dataList.push({
					date: year + '-' + mouth + '-' + day,
					data: d
				});
			}
		}
	}
	res.send({
		code: 1,
		data: dataList
	});
})

function getUvData(data, page) {
	if (!data) {
		return;
	}
	var list = data.split('\r\n');
	var result = {
		pv: 0,
		uv: 0,
		lv: 0
	};
	var uvObj = {
		length: 0
	};
	var lvObj = {
		length: 0
	};

	for (var j = 0; j < list.length - 1; j++) {

		var uid = getParamer(list[j], 'uid');
		var loginuid = getParamer(list[j], 'loginuid');
		var pageName = '';
		if (page) {
			pagename = getParamer(list[j], 'page');
			pagename = decodeURIComponent(pagename).replace(/(\/*((\?|#).*|$))/g, '') || '/';;
			if (page != pagename) {
				continue;
			}
		}
		result.pv++;
		if (uid) {
			if (uvObj[uid]) {
				uvObj[uid]++;
			} else {
				uvObj[uid] = 1;
				uvObj.length++;
			}
		}

		if (loginuid) {
			if (lvObj[loginuid]) {
				lvObj[loginuid]++;
			} else {
				lvObj[loginuid] = 1;
				lvObj.length++;
			}
		}

	}
	result.uv = uvObj.length;
	result.lv = lvObj.length;
	return result;
}

function getCustomData(data, page, filter) {
	if (!data) {
		return;
	}
	var list = data.split('\r\n');
	var count = {
		total: 0
	};
	for (var j = 0; j < list.length - 1; j++) {
		count.total++;
		var pageName = getParamer(list[j], 'page');
		if (!pageName) {
			continue;
		}
		var name = decodeURIComponent(pageName).replace(/(\/*((\?|#).*|$))/g, '') || '/';
		var paramer = decodeURIComponent(pageName).split('?');
		var tamp = paramer[1] ? paramer[1].split('&') : [];
		for (var m = 0; m < tamp.length; m++) {
			var a = tamp[m].split('=');
			if (a.length > 1 && a[0] == filter && page == name) {
				count[a[1]] ? count[a[1]]++ : count[a[1]] = 1;
			}
		}
	}
	return count;
}

function getPageList(data) {
	if (!data) {
		return [];
	}
	var list = data.split('\r\n');
	var result = [];
	for (var j = 0; j < list.length - 1; j++) {
		var pageName = getParamer(list[j], 'page');
		if (!pageName) {
			continue;
		}
		var name = decodeURIComponent(pageName).replace(/(\/*((\?|#).*|$))/g, '') || '/';
		if (result.indexOf(name) == -1) {
			result.push(name);
		}
	}
	return result;
}

function getPerformance(data) {
	if (!data) {
		return;
	}
	var list = data.split('\r\n');
	var result = {};
	for (var j = 0; j < list.length - 1; j++) {
		var rowObj = {};
		var rows = list[j].split('|');
		for (var h = 0; h < rows.length; h++) {
			if (rows[h]) {
				rowObj[rows[h].split('=')[0]] = rows[h].split('=')[1]
			}
		}

		if ((rowObj.res + '').length >= 5 || (rowObj.rt + '').length >= 5) {
			continue;
		}
		rowObj.page = decodeURIComponent(rowObj.page).replace(/(\/*((\?|#).*|$))/g, '') || '/';
		if (result[rowObj.page]) {
			result[rowObj.page].dns += parseInt(rowObj.dns || 0);
			result[rowObj.page].conn += parseInt(rowObj.conn || 0);
			result[rowObj.page].req += parseInt(rowObj.req || 0);
			result[rowObj.page].res += parseInt(rowObj.res || 0);
			result[rowObj.page].rt += parseInt(rowObj.rt || 0);
			result[rowObj.page].intr += parseInt(rowObj.intr || 0);
			result[rowObj.page].length++;
		} else {
			result[rowObj.page] = {
				dns: parseInt(rowObj.dns || 0),
				conn: parseInt(rowObj.conn || 0),
				req: parseInt(rowObj.req || 0),
				res: parseInt(rowObj.res || 0),
				rt: parseInt(rowObj.rt || 0),
				intr: parseInt(rowObj.intr || 0),
				length: 1
			}
		}
	}
	return result;
}

function getTimePathByDate(date) {
	var d = new Date(date);
	var year = d.getFullYear();
	var mouth = (parseInt(1 + d.getMonth()) + '').length > 1 ? parseInt(1 + d.getMonth()) : '0' + parseInt(1 + d.getMonth());
	var day = (d.getDate() + '').length > 1 ? d.getDate() : '0' + d.getDate();
	return {
		year: year,
		mouth: mouth,
		day: day
	};
}

function getParamer(listStr, paramer) {
	var reg = new RegExp('(?:^|\|)' + paramer + '\=([^|]*)');
	var name = listStr.match(reg);
	if (!name || !name[1]) {
		return '';
	} else {
		return name[1];
	}
}

function getTimeByDate(dateStr) { //2016-08-09
	var date = new Date(dateStr + ' 00:00');
	var time = date.getTime();
	return time;
}

function getBrowserData(data) {
	if (!data) {
		return;
	}
	var list = data.split('\r\n');
	var result = {};
	/*
		{
			page:{
				58app:123,
				uc:12
			}
		}
	*/
	for (var i = 0; i < list.length - 1; i++) {
		var name = getParamer(list[i], 'browser');
		var page = getParamer(list[i], 'page');
		if (!name || !page) {
			continue;
		}

		page = decodeURIComponent(page).replace(/(\/*((\?|#).*|$))/g, '') || '/';

		if (name != '58app' && name != 'uc' && name != 'qqbrowser' && name != 'wx') {
			name = 'others';
		}
		if (result[page]) {
			result[page][name] ? result[page][name]++ : result[page][name] = 1;
		} else {
			result[page] = {};
			result[page][name] = 1;
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
		var pageName = getParamer(list[i], 'page');
		var time = getParamer(list[i], '_');
		if (!pageName || !time) {
			continue;
		}

		var hour = null;
		pageName = decodeURIComponent(pageName).replace(/(\/*((\?|#).*|$))/g, '') || '/';;
		var d = new Date(parseInt(time));
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
function getNameList(req, res, path) {
	try {
		var list = fs.readdirSync(path);
		var result = [];
		console.log(req.session.user);
		console.log(list);
		var projectsList = userInfo[req.session.user].project;
		for (var j = 0; j < list.length; j++) {
			var l = list[j].replace(/(\..*$)/, '')
			if (projectsList.indexOf(l) != -1) {
				result.push(l);
			}
		}
		console.log(result);
		res.send({
			projects: result,
			code: 1
		});
	} catch (ex) {
		res.send({
			message: ex.message,
			code: 0
		});
	}
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
				tid: 1,
				user:{
					A:1,
					B:2,
					length:2
				},
				number:1
			},
			{
				tid: 2,
				user:{
					A:1,
					B:2,
					C:3
					length:3
				},
				number:1
			}
		],
		pagename2: [{
				tid: 12,
				user:{
					A:1,
					B:2
				},
				number:12
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
		var obj = null;
		rowObj.page = decodeURIComponent(rowObj.page).replace(/(\/*((\?|#).*|$))/g, '') || '/';;

		if (result[rowObj.page]) {
			for (var k = 0; k < result[rowObj.page].length; k++) {
				if (result[rowObj.page][k].tid == rowObj.tid) {
					isHas = true;
					result[rowObj.page][k].number++;
					if (result[rowObj.page][k].user[rowObj.uid]) {
						result[rowObj.page][k].user[rowObj.uid]++
					} else {
						result[rowObj.page][k].user[rowObj.uid] = 1;
						result[rowObj.page][k].user.length++;
					}
				}
			}
			if (!isHas) {
				obj = {
					tid: rowObj.tid,
					number: 1,
					user: {
						length: 1
					}
				};
				obj.user[rowObj.uid] = 1
				result[rowObj.page].push(obj);
			}
		} else {
			obj = {
				tid: rowObj.tid,
				number: 1,
				user: {
					length: 1
				}
			};
			obj.user[rowObj.uid] = 1
			result[rowObj.page] = [obj];
		}
	}
	for (var h in result) {
		for (var m = 0; m < result[h].length; m++) {
			for (var n in result[h][m].user) {
				if (n != 'length') {
					delete result[h][m].user[n];
				}
			}
		}
	}
	return result;
}
module.exports = router;