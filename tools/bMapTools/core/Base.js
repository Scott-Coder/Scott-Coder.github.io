/*
* @author : halvee.L
* @date : 2016-6-13
* @desc : Base Class 
**/

define(function(require)
{
	var Class = require('core/Class'),
		EventManager = require('script/EventManager'),
		art = require('lib/template'),
		isFunction = function(obj){
			return Object.prototype.toString.call(obj) === '[object Function]';
		},
		root = {
			$el : $(document.body),
			children : []
		},
		_require_ = require;
	return Class.extend(
	{
		init : function(container,option)
		{
			option = option || {};
			this.options = option;
			this.container = container || root;
			this.$el = option.$el || this.container.$el ;
			this.children = [];
			this.cachekey = {};
			this.id = option.id || this.$el.attr('id');
			this.container.children.push(this);
			this.onInit(option);
			this.attchEvent();
			if(!S.__page__){ S.__page__ = this;}
		}
		,onInit : function(option){ }
		,$ : function(seletor)
		{
			return $(seletor,this.$el);
		}
		,show : function(){
			this.$el.show();
		}
		,hide : function(){
			this.$el.hide();
		}
		,attchEvent : function(){
			var that = this;
			this.$el.unbind();
			this.$el.bind('click',function(e){
			
				e.$el = $(e.target);
				if($.contains(that.$el[0],e.target) ){
					S.__page__ = that;
					e.name = e.$el.attr('ekey') || '';
					e.src = 'MOUSE';
					if(that[e.name]) return that[e.name](e) === 1;
					return that.handleEvent(e) === 1;
				}
			});
			this.$('input,textarea').bind('focus',function(){
				S.__page__ = this;
			});
		}
		,loadpage:function(option){ //{$el : , url : }
			option = option || {};

			if(!option.url) throw '[loadpage] params error: url is ' + Object.prototype.toString.call(option.url);

			var $el = option.$el || this.$el || this.container.$el,that = this
				,callback = option.callback || function(){}
				,url = option.url;

			option.option = option.option || {};
			option.option.$el = $el;
			option.option.pageUrl = url;
			this.loadpage2($el,url,function(mode){ // mode为JS模块
				var _nodes = {};
				$el.find('script[type="text/html"]').each(function(){
					_nodes[this.id] = this.innerHTML;
					$(this).remove();
				});
				if(mode){
					if(mode.prototype){ 
						mode.prototype.template = $el.html(); 
						mode.prototype.nodes = _nodes;
					}
					else{ 
						mode.template = $el.html();
						mode.nodes = _nodes;
					}
					if(isFunction(mode)){
						option.option.loadtype = true;
						callback && callback(new mode(that,option.option));
					}else{
						mode.loadtype = true;
						callback && callback(mode);
						delete mode.loadtype;
					}
				}else{ 
					mode ={
						template :   $el.html()
						, nodes : _nodes
						,loadtype : true
					};
					callback && callback(mode);
					delete mode.loadtype;
				}
				_nodes = null;
			});
		}
		,loadpage2:function($el,url,callback){
			var a = url.lastIndexOf('.htm') ;
			if(a < 0){
				a = url.length;
				url += '.html';
			}
			url = seajs.resolve(url);
			var tag = S.getGuid();
			var name = url.replace(/.htm(l)/i,function(){ return '.js';}) , loaded;
			S.log(this.id+' Page load '+name+' to seajs');
			seajs.use(name,function(){ //将内容中的模块引入seajs模块管理中
				var mode = _require_(name);
				S.log(this.id+' Page loaded '+name+' to seajs');
				if(loaded){ // 必须要等页面加载完成后才能返回模块
					callback && callback(mode);
					mode = null;
				}else{
					loaded = function(){
						callback && callback(mode);
						mode = null;
					}
				}
			},true,tag);
			S.log(this.id+' Page load '+url+' content');
			$el.load(url,function(result,status,xhr){
				if(status=="error"){
					switch (xhr.status) {
						case 0:
							$.zAlert("服务器已经停止运行，请通知系统管理员检查并解决。");
							break;
						case 401:
							$.zAlert("账户信息已过期，请重新登录！",function(){
								window.location.href = $$("j_security_logout");
							});
							break;
						case 403:
							$.zAlert(decodeURIComponent(xhr.getResponseHeader("Error-Message")));
							break;
						case 404:
							$.zAlert(url + "，请求页面不存在。");
							break;
						case 500:
							$.zAlert(decodeURIComponent(xhr.getResponseHeader("Error-Message")));
							break;
					}
				}else{
					!S.debug && $('script[type="text/javascript"]','body').remove(); 
					S.log(this.id+' Page loaded '+url+' content');
					S.resetPage();
					seajs.emit(tag+'onload'); 
					if(loaded) loaded();
					else loaded = true; 
				}
			});
		}
		,render : function(template,data){
			return art.compile(template)(data);
		}
		,handleEvent : function(event){
			return 1;
		}
		// 添加全局window监听事件
		,addListener : function(name,efunc,iswin){
			EventManager.on(name,efunc,this);
			if(!this.cachekey[name] && iswin){
				window[name] = efunc;
				this.cachekey[name] = true;
			}
		}
		// 移除全局window事件
		,removeListener : function(name){
			EventManager.off(name,null, this);
		}
		,destory : function(){
			var index = this.container.children.indexOf(this);
			index > -1 && this.container.children.splice(index,0);
			for(var attr in this.cachekey){
				EventManager.off(attr,null,this)
			}
			this.cachekey = {};
			this.clear();
			this.$el.html('');
			this.onDestory();
		}
		,clear:function(){
			while(this.children.length){
				this.children.shift().destory();
			}
		}
		,onDestory : function(){}
		//解决zDialog中无法调用模块引入问题，重新封装一层。传入参数与原有调用方式相同。
		,loadDialog : function(option){
			
			option = option || {};
			if(!option.url) return;
			var that = this;
			var dialog = new zDialog({
				id:option.id||"",
				type:option.type||"page",
				theme:option.theme||"black",
				title:option.title,
				showTitle:(option.showTitle === false ? false : true),
				width:option.width||500,
				height:option.height||300,
				onload:false,
				move:option.move,
				btn:option.btn||[],
                autoClose:0,
                position:option.position || "right-bottom",
				onInit:function(form,d){
					that.loadpage({
						url:option.url,
						$el:$(".zDialog-body",form),
						option:{
							pageData:option.data //页面数据传入
						},
						callback:function(mode){
							d.setStyle.call(d,form)
							form.addClass("zDialog-show");
							option.onInit && option.onInit(form);
						}
					});
				}
			});
		}
		//打开iframe页面
		,openIframe:function(url){
			var divH = $("<div class='iframe-div' style='z-index:101;position:fixed;width:100%;height:100%;background:#FFF;top:0px;left:0px;'><iframe width='100%' height='100%' src='"+url+"'></iframe></div>");
			if($(".iframe-div").length<0){
				return;
			}
			$("body").append(divH)
			// var 
		}
	}).implement(require('core/EventEmitter'));
});