$(function() {
	initEvent();
	init();
	function init() {
		if (!initData || initData.length < 1) {
			return;
		}
		pageNameList();
		if (initData.length == 1) {
			toMakeBar();
		} else {
			toMakeLine();
		}
	}
	$(window).on('beforeunload',function(){
		$.ajax({
			url:'text',
			success:function(){

			}
		});

		// var now = +new Date()
		//while( +new Date() - now < 10000 ) {}
	})
	function pageNameList() {
		var option = '';
		for (var h in initData[0].data) {
			option += '<option value="' + h + '">' + h + '</option>';
		}
		$('#pageName').html(option);
	}

	function initEvent() {
		$('.menu').on('click', function() {
			$('#searchCon').toggle();
		})
		var load=new Loading();
		$('#btnGet').on('click', function() {
			var projectName = $('#project').val();
			var startTime = $('#startTime').val();
			var endTime = $('#endTime').val();
			load.show();
			$.ajax({
				url: 'getData?projectName=' + projectName + '&startTime=' + startTime + '&endTime=' + endTime,
				type: 'get',
				complete:function(){
					load.hide();
				},
				success: function(data) {
					initData = data;
					init();
				}
			})
		})
		$('#pageName').on('change', function() {
			if (initData.length == 1) {
				makeBar($(this).val());
			} else {
				makeLine($(this).val());
			}
		})
	}

	function toMakeBar() {
		for (var j in initData[0].data) {
			makeBar(j);
			break;
		}
	}

	function toMakeLine() {
		for (var j in initData[0].data) {
			makeLine(j);
			break;
		}
	}

	function makeBar(page) {
		// var labels = [];
		var data = [];
		for (var j in initData[0].data[page]) {
			// labels.push(j);
			data.push(initData[0].data[page][j]);
		}
		var myChart = echarts.init(document.getElementById('main'));
		option = {
			title: {
				text: page + '页面性能'
			},
			tooltip: {
				trigger: 'axis'
			},
			toolbox: {
				show: true,
				feature: {
					mark: {
						show: true
					},
					dataView: {
						show: true,
						readOnly: false
					},
					saveAsImage: {
						show: true
					}
				}
			},
			calculable: true,
			xAxis: [{
				type: 'category',
				data: ['白屏时间','DOM完成时间','js执行完时间','win完成时间','head大小','doc大小']
			}],
			yAxis: [{
				type: 'value'
			}],
			series: [{
				name: '时间(ms)',
				type: 'bar',
				barWidth: 30,
				data: data
			}]
		};
		myChart.setOption(option);
	}

	function makeLine(page) {
		var date = [];
		var fileTime = [];
		var winTime = [];
		var domTime = [];
		var jsTime = [];
		for (var j = 0; j < initData.length; j++) {
			date.push(initData[j].date);
			fileTime.push(initData[j].data[page] ? initData[j].data[page].headTime : 0);
			winTime.push(initData[j].data[page] ? initData[j].data[page].winTime : 0);
			domTime.push(initData[j].data[page] ? initData[j].data[page].docTime : 0);
			jsTime.push(initData[j].data[page] ? initData[j].data[page].jsTime : 0);
		}
		var myChart = echarts.init(document.getElementById('main'));
		option = {
			title: {
				text: page + '页面性能'
			},
			tooltip: {
				trigger: 'axis'
			},
			toolbox: {
				show: true,
				feature: {
					mark: {
						show: true
					},
					dataView: {
						show: true,
						readOnly: false
					},
					saveAsImage: {
						show: true
					}
				}
			},
			legend: {
				data: ['白屏时间', 'DOM完成时间', 'js执行完时间', 'win完成时间']
			},
			xAxis: [{
				type: 'category',
				boundaryGap: false,
				data: date
			}],
			yAxis: [{
				type: 'value'
			}],
			series: [{
				name: '白屏时间',
				type: 'line',
				data: fileTime
			},{
				name: 'DOM完成时间',
				type: 'line',
				data: domTime
			},{
				name: 'js执行完时间',
				type: 'line',
				data: jsTime
			},{
				name: 'win完成时间',
				type: 'line',
				data: winTime
			}]
		};
		myChart.setOption(option);
	}
})