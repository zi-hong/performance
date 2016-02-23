var fs = require('fs');
//返回格式化数据
/*
	{
		"/":{"fileTime":469.5,"win_time":544,"doc_time":481.5,"jsReadyTime":537.5},
		"/text1":{"fileTime":651,"win_time":704,"doc_time":652,"jsReadyTime":701},
		"/text2":{"fileTime":651,"win_time":704,"doc_time":652,"jsReadyTime":701}
	}
*/
function getContent(path) {
	if (fs.existsSync(path)) {
		return '';
	}
	var data = fs.readFileSync(path, {
		'encoding': 'utf8'
	});
	var rows = data.split('\r\n');
	var savePage = {};
	for (var j = 0; j < rows.length - 1; j++) {
		var rowsDetail = rows[j].split('|');
		if (savePage[rowsDetail[0].split('=')[1]]) {
			savePage[rowsDetail[0].split('=')[1]].fileTime = (parseInt(savePage[rowsDetail[0].split('=')[1]].fileTime) + parseInt(rowsDetail[1].split('=')[1])) / 2;
			savePage[rowsDetail[0].split('=')[1]].win_time = (parseInt(savePage[rowsDetail[0].split('=')[1]].win_time) + parseInt(rowsDetail[2].split('=')[1])) / 2;
			savePage[rowsDetail[0].split('=')[1]].doc_time = (parseInt(savePage[rowsDetail[0].split('=')[1]].doc_time) + parseInt(rowsDetail[3].split('=')[1])) / 2;
			savePage[rowsDetail[0].split('=')[1]].jsReadyTime = (parseInt(savePage[rowsDetail[0].split('=')[1]].jsReadyTime) + parseInt(rowsDetail[4].split('=')[1])) / 2;

		} else {
			savePage[rowsDetail[0].split('=')[1]] = {
				fileTime: rowsDetail[1].split('=')[1],
				win_time: rowsDetail[2].split('=')[1],
				doc_time: rowsDetail[3].split('=')[1],
				jsReadyTime: rowsDetail[4].split('=')[1]
			}
		}
	}
	return savePage;
}
//返回格式化数据
/*
	[
		{
			date:'2014-09-02',
			data:{
				"/":{"fileTime":469.5,"win_time":544,"doc_time":481.5,"jsReadyTime":537.5},
				"/text1":{"fileTime":651,"win_time":704,"doc_time":652,"jsReadyTime":701},
				"/text2":{"fileTime":651,"win_time":704,"doc_time":652,"jsReadyTime":701}
			}
		}
	]
*/
function getRangeData(startTime, endTime, data) {
	//data:2016-02-16##{"/":{"fileTime":469.5,"win_time":544,"doc_time":481.5,"jsReadyTime":537.5},"/text1":{"fileTime":651,"win_time":704,"doc_time":652,"jsReadyTime":701},"/text2":{"fileTime":651,"win_time":704,"doc_time":652,"jsReadyTime":701}}
	var startTime = new Date(startTime.split('-')[0], startTime.split('-')[1] - 1, startTime.split('-')[2]);
	var endTime = new Date(endTime.split('-')[0], endTime.split('-')[1] - 1, endTime.split('-')[2]);
	var re_data = [];
	var orginData = data.split('\r\n');
	for (var j = 0; j < orginData.length - 1; j++) {
		var d = orginData[j].split('##')[0];
		var temp = new Date(d.split('-')[0], d.split('-')[1] - 1, d.split('-')[2]);
		if (temp.getTime() >= startTime.getTime() && temp.getTime() <= endTime.getTime()) {
			re_data.push({
				date: d,
				data: JSON.parse(orginData[j].split('##')[1])
			})
		}
	}
	return re_data;
}
module.exports = {
	getContent: getContent,
	getRangeData: getRangeData
};