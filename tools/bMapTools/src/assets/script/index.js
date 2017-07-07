define(function(require){
	require("src/public/fontAwesome/css/font-awesome.min.css");
	require("src/public/zDialog/zDialog.css");
	require("lib/scrollBars/jquery.mCustomScrollbar.min.css");
	require("lib/bootstrap-3.3.5/js/bootstrap.min.js");
	require("src/public/zDialog/zDialog.js");
	require("lib/scrollBars/jquery.mousewheel.min.js");
	require("lib/scrollBars/jquery.mCustomScrollbar.min.js");
	require("script/extend.js");
	require("src/assets/baseData/cityCenter.js");
	var Base = require("Base");
	new (Base.extend({
		onInit : function(option){
			this.goToContainer();
		},
		getBaseData : function(){
			var self = this;
			/*S.request({
				url : "src/assets/baseData/cityCenter.json",
				success : function(data){
					if(data){
						S.cityCenter = data;
					}
					self.goToContainer();
				}
			})*/
		},
		goToContainer : function(){
			this.loadpage({
				url:"container.html",
				callback:function(){
					
				}
			});
		}
	}))();
});