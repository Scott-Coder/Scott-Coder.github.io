define(function(){
	'use strict';
	
	function EventManager(){
	}
	EventManager.prototype.on = function(eventList,callback,context)
	{
		var cache ,event ,list;
		if(!callback) return;
		eventList = eventList.split(/,/);
		cache = this._eventList || ( this._eventList = {});
		while((event = eventList.shift())){
			list = cache[event] || (cache[event] = []);
			list.push({
				f : callback
				,c : context
			});
		}
		return this;
	}
	EventManager.prototype.emit = function()
	{
		if(!arguments.length) return;
		var event = arguments[0],param = Array.prototype.slice.call(arguments,1),cache = this._eventList;
		if((!cache || !cache[event]) && !window[event]) return;
		if(window[event]){
			window[event](arguments[1] || {});
			return;
		}
		var list = cache[event];
		for(var i = 0 , len = list.length ; i< len ; i ++){
			list[i].f.apply(list[i].c || this, param);
		}
	}
	EventManager.prototype.off = function(evt,func,context)
	{
		if(!arguments.length) return;
		var event = arguments[0],cache = this._eventList;
		if(!cache || !cache[event]) return;
		if(! (func || context) ){ delete cache[event]; return;}
		var list = cache[event];
		for(var i = 0; i < list.length ; i ++){
			if(list[i].f === func || list[i].c === context){
				list.splice(i,1);
			}
		}
	}
	return EventManager;
});