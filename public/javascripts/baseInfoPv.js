var baseInfoPv = Vue.extend({
	template: '#baseInfoPv-template',
	components: {
		'search': search,
		'constant-chart': constantChart
	},
	data: function() {
		return {
			data: '',
			showChart: false,
			okFun: this.getData,
			url: '/api/infoProjectList'
		}
	},
	events: {
		selPage: function(val) {
			var date = [];
			var dataR = [];
			for (var i = 0; i < this.initData.length; i++) {
				date.push(this.initData[i].date);
				dataR.push(this.initData[i].data[val]);
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
			this.$broadcast('showChartFun', option);
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
			this.selpages = a;
			this.initData = initData;
			// this.selPage = this.pages[0];
		},
		showAll: function(data) {
			var myChart = echarts.init(document.getElementById('pvchart-main'));
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
		getData: function(startTime, endTime, selName) {
			var that = this;
			if (!startTime || !endTime || !selName) {
				return;
			}
			that.$dispatch('showLoading');
			$.ajax({
				url: '/api/infoPv',
				data: {
					project: selName,
					startTime: startTime,
					endTime: endTime
				},
				complete: function() {
					that.$dispatch('hideLoading');

				},
				success: function(msg) {
					if (msg.code == 1) {
						that.showChart = true;
						that.formatData(msg.data);
						setTimeout(function() {
							that.showAll(that.initData);
						}, 300)
						that.$broadcast('showChartCon', that.initData, that.selpages);
					} else {
						alert('查找失败');
					}
				},
				erroe: function() {
					alert('查找失败');
				}
			})
		}
	}
})