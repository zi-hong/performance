var browser = Vue.extend({
	template: '#platform-template',
	components: {
		'search': search
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
		showChart: function() {
			this.showChart = true;
		}
	},
	methods: {
		getData: function(startTime, endTime, selName) {
			var that = this;
			if (!startTime || !endTime || !selName) {
				return;
			}
			that.$dispatch('showLoading');
			$.ajax({
				url: '/api/browser',
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
						that.showCountChart(msg.data);
					} else {
						alert('查找失败');
					}
				},
				error: function() {
					alert('查找失败');
				}
			})
		},
		showCountChart: function(initData) {
			var data = {};
			var date = [];
			for (var j = 0; j < initData.length; j++) {
				date.push(initData[j].date);
				for (var n in initData[j].data) {
					data[n] ? data[n]++ : data[n] = 1;
				}
			}
			var r=[];
			for(var m in data){
				r.push({name:m,value:data[m]});
			}
			var myChart = echarts.init(document.getElementById('pvchart-main'));
			option = {
				tooltip: {
					trigger: 'item',
					formatter: "{a} <br/>{b} : {c} ({d}%)"
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
						magicType: {
							show: true,
							type: ['pie', 'funnel'],
							option: {
								funnel: {
									x: '25%',
									width: '50%',
									funnelAlign: 'left',
									max: 1548
								}
							}
						},
						restore: {
							show: true
						},
						saveAsImage: {
							show: true
						}
					}
				},
				calculable: true,
				series: [{
					name: '访问来源',
					type: 'pie',
					radius: '55%',
					center: ['50%', '60%'],
					data: r
				}]
			};
			myChart.setOption(option);
		}
	}
})