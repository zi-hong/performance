var uv = Vue.extend({
	template: '#uv-template',
	components: {
		'search': search,
		'constant-chart': constantChart
	},
	data: function() {
		return {
			data: '',
			showChart: false,
			url: '/api/infoProjectList',
			okFun: this.getData
		}
	},
	events: {
		selPage: function(val) {
			var date = [];
			var data = [];
			for (var j = 0; j < this.data.length; j++) {
				date.push(this.data[j].date);
				data.push(this.data[j].data[val] ? this.data[j].data[val].length : 0);
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
					data: ['uv']
				},
				xAxis: [{
					type: 'category',
					data: date
				}],
				yAxis: [{
					type: 'value'
				}],
				series: [{
					name: 'uv',
					type: 'line',
					data: data
				}]
			};
			this.$broadcast('showChartFun', option);
		}
	},
	methods: {
		formatData: function() {
			var pageList = [];
			for (var j = 0; j < this.data.length; j++) {
				for (var i in this.data[j].data) {
					if (pageList.indexOf(i) == -1) {
						pageList.push(i);
					}
				}
			}
			this.selpages = pageList;
		},
		getData: function(startTime, endTime, selName) {
			var that = this;
			if (!startTime || !endTime || !selName) {
				return;
			}
			that.$dispatch('showLoading');
			$.ajax({
				url: '/api/uv',
				data: {
					startTime: startTime,
					endTime: endTime,
					project: selName
				},
				complete: function() {
					that.$dispatch('hideLoading');
				},
				success: function(msg) {
					if (msg.code == 1) {
						that.data = msg.data;
						that.showChart = true;
						that.formatData();
						that.showAll();
						that.$broadcast('showChartCon', that.data, that.selpages);
					} else {
						alert('查找失败');
					}
				},
				error: function() {
					alert('查找失败');
				}
			})
		},
		showAll: function() {
			var data = [];
			var date = [];
			for (var j = 0; j < this.data.length; j++) {
				date.push(this.data[j].date);
				var temp = {};
				var number = 0;
				for (var i in this.data[j]['data']) {
					for (var h in this.data[j]['data'][i]) {
						if (!temp[h]) {
							temp[h] = 1;
							number++;
						}
					}
				}
				data.push(number);
			}
			var myChart = echarts.init(document.getElementById('pvchart-main'));
			var option = {
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
					data: ['uv']
				},
				xAxis: [{
					type: 'category',
					data: date
				}],
				yAxis: [{
					type: 'value'
				}],
				series: [{
					name: 'uv',
					type: 'line',
					barMaxWidth: 30,
					data: data
				}]
			};
			myChart.setOption(option);
		}
	}
})