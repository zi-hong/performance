var performChart = Vue.extend({
	template: '#chart-template',
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
			//this.showCountChart(val, this.currentData);
		}
	},
	methods: {
		formatData: function(initData) {
			var pageList = {};
			for (var j = 0; j < initData.length; j++) {
				for (var i in initData[j].data) {
					if (pageList[i]) {
						pageList[i]++;
					} else {
						pageList[i] = 1;
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
			//this.showCountChart(this.pages[0], initData);
		},
		showChartFun: function(page, initData) {
			var date = [];
			var dns = [];
			var conn = [];
			var req = [];
			var res = [];
			var tr = [];
			var intr = [];
			for (var j = 0; j < initData.length; j++) {
				date.push(initData[j].date);
				dns.push(initData[j].data[page] ? initData[j].data[page].dns/initData[j].data[page].length : 0);
				conn.push(initData[j].data[page] ? initData[j].data[page].conn/initData[j].data[page].length : 0);
				req.push(initData[j].data[page] ? initData[j].data[page].req/initData[j].data[page].length : 0);
				res.push(initData[j].data[page] ? initData[j].data[page].res/initData[j].data[page].length : 0);
				tr.push(initData[j].data[page] ? initData[j].data[page].tr/initData[j].data[page].length : 0);
				intr.push(initData[j].data[page] ? initData[j].data[page].intr/initData[j].data[page].length : 0);
			}
			var myChart = echarts.init(document.getElementById('chartMian'));
			option = {
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
					data: ['DNS查找时间', '建立链接时间', '发送请求时间', '接受请求时间','加载完成时间','可响应时间']
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
					name: 'DNS查找时间',
					type: 'line',
					data: dns
				}, {
					name: '建立链接时间',
					type: 'line',
					data: conn
				}, {
					name: '发送请求时间',
					type: 'line',
					data: req
				},
				{
					name: '接受请求时间',
					type: 'line',
					data: res
				},
				{
					name: '加载完成时间',
					type: 'line',
					data: tr
				},
				{
					name: '可响应时间',
					type: 'line',
					data: intr
				}]
			};
			myChart.setOption(option);
		},
		showCountChart: function(page, initData) {
			var data = [];
			var date = [];
			for (var j = 0; j < initData.length; j++) {
				date.push(initData[j].date);
				data.push(initData[j].data[page] ? initData[j].data[page].count : 0);
			}
			var myChart = echarts.init(document.getElementById('countMain'));
			option = {
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
					data: ['访问次数']
				},
				xAxis: [{
					type: 'category',
					data: date
				}],
				yAxis: [{
					type: 'value'
				}],
				series: [{
					name: '访问次数',
					type: 'bar',
					barMaxWidth: 30,
					data: data
				}]
			};
			myChart.setOption(option);
		}
	}
})