var constant = Vue.extend({
	template: '#constant-template',
	components: {
		'search': search,
		'constant-chart': constantChart
	},
	data: function() {
		return {
			data: '',
			showChart: false,
			okFun: this.getData,
			oneTime:true,
			url: '/api/infoProjectList'
		}
	},
	events: {
		showChart: function() {
			this.showChart = true;
		}
	},
	methods: {
		getData: function(time, selName) {
			var that = this;
			if (!time  || !selName) {
				return;
			}
			that.$dispatch('showLoading');
			$.ajax({
				url: '/api/dayData',
				data: {
					project: selName,
					time: time
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
				error: function() {
					alert('查找失败');
				}
			})
		}
	}
})