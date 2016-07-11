var point = Vue.extend({
	template: '#pointMain-template',
	components: {
		'search': search,
		'point-chart': pointChart,
	},
	data: function() {
		return {
			data: '',
			showChart: false,
			okFun: this.getData,
			url: '/api/pointProjectList'
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
			$.ajax({
				url: '/api/pointData',
				data: {
					project: selName,
					startTime: startTime,
					endTime: endTime
				},
				success: function(msg) {
					if (msg.code == 1) {
						that.$broadcast('showChartCon', msg.data);
					} else {
						alert('查找失败');
						that.$dispatch('hideLoading');
					}
				},
				erroe: function() {
					alert('查找失败');
					that.$dispatch('hideLoading');
				}
			})
		}
	}
})