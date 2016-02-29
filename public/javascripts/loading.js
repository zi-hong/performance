var Loading = function() {
	this.el=$('<div class="loading-cover">'+
				'<div>'+
				'<span class="loading-con">'+
					'<span></span>'+
					'<span></span>'+
					'<span></span>'+
					'<span></span>'+
					'<span></span>'+
					'<span></span>'+
					'<span></span>'+
					'<span></span>'+
				'</span>'+
				'</div>'+
			'</div>');
};
Loading.prototype.show=function(){
	$('body').append(this.el);
};
Loading.prototype.hide=function(){
	this.el.remove();
}