var constantChart = Vue.extend({
	template: '#constantChart-template',
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
			var pageList = [];
			for (var i in initData) {
				pageList.push(i);
			}

			
			this.pages = pageList;
			this.selPage = this.pages[0];
			this.showChartFun(this.pages[0], initData);
		},
		showChartFun: function(val, initData) {

			var myChart = echarts.init(document.getElementById('pointMian'));
			var date = [];
			var data = [];
			for(var j in initData[val]){
				date.push(j+'时');
				data.push(initData[val][j]);
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
			};
			myChart.setOption(option);
		}
	}

})