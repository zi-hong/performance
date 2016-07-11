var search = Vue.extend({
	template: '#search-template',
	data: function() {
		return {
			objets: [],
			startTime: '',
			endTime: '',
			selName: '',
		}
	},
	props: {
		okfun: {
			type: Function,
			required: true
		},
		url: {
			type: String
		}
	},
	ready: function() {
		this.getObjet();
	},
	methods: {
		getObjet: function() {
			this.$dispatch('showLoading');
			var that = this;
			$.ajax({
				url: that.url || '/api/getObjet',
				complete: function() {
					that.$dispatch('hideLoading');
				},
				success: function(msg) {
					if (msg.code == 1) {
						that.objets = msg.projects;
						that.selName = that.objets[0];
					} else {
						alert('查找失败');
					}
				},
				error: function() {
					alert('查找失败');
				}
			})
		},
		getData: function() {
			this.okfun(this.startTime, this.endTime, this.selName);
		}
	}
})