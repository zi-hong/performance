var baseInfoPv = Vue.extend({
	template: '#baseInfoPv-template',
	components: {
		'search': search,
		'infopv-chart': baseInfoPvChart
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
						that.$broadcast('showChartCon', msg.data);
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