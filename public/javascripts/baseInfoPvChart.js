var baseInfoPvChart = Vue.extend({
	template: '#baseInfoPvchart-template',
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
				a.push(decodeURIComponent(n));
			}
			this.pages = a;
			this.selPage = this.pages[0];
			this.showChartFun(this.pages[0], initData);
			this.showAll(initData);
		},
		showAll: function(data) {
			var myChart = echarts.init(document.getElementById('allNumber'));
			var date = [];
			var dataR = [];
			for (var i = 0; i < data.length; i++) {
				var number = 0;
				date.push(data[i].date);
				for (var j in data[i].data) {
					number += data[i].data[j];
				}
				dataR.push(number);
			}
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
					data: ['总访问量']
				},
				xAxis: [{
					type: 'category',
					data: date
				}],
				yAxis: [{
					type: 'value'
				}],
				series: [{
					name: '总访问量',
					type: 'bar',
					barMaxWidth: 30,
					data: dataR
				}]
			};
			myChart.setOption(option);
		},
		showChartFun: function(val, data) {

			var myChart = echarts.init(document.getElementById('pointMian'));
			var date = [];
			var dataR = [];
			for (var i = 0; i < data.length; i++) {
				date.push(data[i].date);
				dataR.push(data[i].data[val]);
			}

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
					data: ['单页面访问量']
				},
				xAxis: [{
					type: 'category',
					data: date
				}],
				yAxis: [{
					type: 'value'
				}],
				series: [{
					name: '访问量',
					type: 'bar',
					barMaxWidth: 30,
					data: dataR
				}]
			};
			myChart.setOption(option);
		}
	}

})