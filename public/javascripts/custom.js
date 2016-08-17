var custom = Vue.extend({
	template: '#custom-template',
	data: function() {
		return {
			data: '',
			okFun: this.getData,
			url: '/api/infoProjectList',
			show: false,
			pageList: [],
			currentPage: '',
			filterStr: '',
			startTime: '',
			endTime: '',
			selName: ''
		}
	},
	components: {
		'search': search
	},
	events: {},
	methods: {
		showChart: function() {
			var date = [];
			var data = [];
			for (var j = 0; j < this.data.length; j++) {
				date.push(this.data[j].date);
				data.push(this.data[j].data);
			}
			var myChart = echarts.init($('#chartMian').get(0));

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
					name: '访问量',
					type: 'line',
					data: data
				}]
			}
			myChart.setOption(option);
		},
		search: function() {
			var that = this;
			that.$dispatch('showLoading');
			$.ajax({
				url: '/api/customData',
				data: {
					project: that.selName,
					startTime: that.startTime,
					endTime: that.endTime,
					page: that.currentPage,
					filter: that.filterStr
				},
				complete: function() {
					that.$dispatch('hideLoading');
				},
				success: function(msg) {
					if (msg.code == 1) {
						that.data = msg.data;
						that.showChart();
					}
				}
			})
		},
		getData: function(startTime, endTime, selName) {
			var that = this;
			if (!startTime || !endTime || !selName) {
				return;
			}
			that.startTime = startTime;
			that.endTime = endTime;
			that.selName = selName;
			that.$dispatch('showLoading');
			that.show = false;
			$.ajax({
				url: '/api/pageList',
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
						that.show = true;
						that.currentPage = msg.data[0] || '';
						that.pageList = msg.data;
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