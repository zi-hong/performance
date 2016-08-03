var pointChart = Vue.extend({
	template: '#pointChart-template',
	props: {
		show: {
			type: Boolean
		}
	},
	data: function() {
		return {
			currentData: '',
			pages: [],
			selPage: ''
		}
	},
	events: {
		showChartCon: function(initData) {
			var that = this;
			that.currentData = initData;
			this.$dispatch('showChart');
			setTimeout(function() {
				that.formatData(initData);
			}, 100);
		}
	},
	watch: {
		selPage: function(val) {
			this.showChartFun(val, this.currentData);
			this.showPeopleChart(val,this.currentData);
		}
	},
	methods: {
		formatData: function(initData) {
			var pageList = {};
			for (var i = 0; i < initData.length; i++) {
				for (var j in initData[i].data) {
					if (pageList[j]) {
						pageList[j]++;
					} else {
						pageList[j] = 1;
					}
				}
			}
			var a = [];
			for (var n in pageList) {
				a.push(n);
			}
			this.pages = a;
			this.selPage = this.pages[0];
			this.showChartFun(this.pages[0], initData);
			this.showPeopleChart(this.pages[0],initData);
		},
		showPeopleChart:function(val, data){
			var date = [];
			var tidList = [];
			for (var i = 0; i < data.length; i++) {
				date.push(data[i].date);
				if(data[i].data[val]){
					tidList.push(data[i].data[val]);
				}
			}
			for (var k = 0; k < tidList.length; k++) {
				for (var m = 0; m < tidList[k].length; m++) {
					tidList[k][m].name = tidList[k][m].tid;
					tidList[k][m].type = 'bar';
					tidList[k][m].data = tidList[k][m].user.length;
				}
			}
			var d = {};
			for (var n = 0; n < tidList.length; n++) {
				for (var a = 0; a < tidList[n].length; a++) {
					if (!d[tidList[n][a].tid]) {
						d[tidList[n][a].tid] = [];
					}
					var sub = n - d[tidList[n][a].tid].length;
					for (var t = 0; t < sub - 1; t++) {
						d[tidList[n][a].tid].push(0);
					}
					d[tidList[n][a].tid].push(tidList[n][a].number);
				}
			}
			var series = [];
			var legend = [];
			for (var h in d) {
				legend.push(h);
				series.push({
					name: h,
					type: 'bar',
					data: d[h]
				})
			}
			var myChart = echarts.init(document.getElementById('chartMian'));
			option = {
				tooltip: {
					trigger: 'axis'
				},
				legend: {
					data: legend
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxis: [{
					type: 'category',
					data: date
				}],
				yAxis: [{
					type: 'value'
				}],
				series: series
			};
			myChart.setOption(option);
		},
		showChartFun: function(val, data) {
			var date = [];
			var tidList = [];
			for (var i = 0; i < data.length; i++) {
				date.push(data[i].date);
				if(data[i].data[val]){
					tidList.push(data[i].data[val]);
				}
			}
			for (var k = 0; k < tidList.length; k++) {
				for (var m = 0; m < tidList[k].length; m++) {
					tidList[k][m].name = tidList[k][m].tid;
					tidList[k][m].type = 'bar';
					tidList[k][m].data = tidList[k][m].number;
				}
			}
			var d = {};
			for (var n = 0; n < tidList.length; n++) {
				for (var a = 0; a < tidList[n].length; a++) {
					if (!d[tidList[n][a].tid]) {
						d[tidList[n][a].tid] = [];
					}
					var sub = n - d[tidList[n][a].tid].length;
					for (var t = 0; t < sub - 1; t++) {
						d[tidList[n][a].tid].push(0);
					}
					d[tidList[n][a].tid].push(tidList[n][a].number);
				}
			}
			var series = [];
			var legend = [];
			for (var h in d) {
				legend.push(h);
				series.push({
					name: h,
					type: 'bar',
					data: d[h]
				})
			}
			var myChart = echarts.init(document.getElementById('pointMian'));
			option = {
				tooltip: {
					trigger: 'axis'
				},
				legend: {
					data: legend
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				xAxis: [{
					type: 'category',
					data: date
				}],
				yAxis: [{
					type: 'value'
				}],
				series: series
			};
			myChart.setOption(option);
		}
	}
})