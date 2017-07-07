define(function(){
    'use strict';
	function _type(){
		return Object.prototype.toString.call(arguments[0]);
	}
	function isFunction(obj){
		return _type(obj) === '[object Function]';
	}
	function isArray(obj){
		return _type(obj) === '[object Array]';
	}
	//  See: http://jsperf.com/object-create-vs-new-ctor
	var fnMatch = /hv/.test(function(){ 
	hv; }) ? /\b_super\b/ : /.*/;

	// Shared empty constructor function to aid in prototype-chain creation.

    function Ctor() {}
    //构造原型链
    // See: http://jsperf.com/object-create-vs-new-ctor
    var createProto = function(proto) {
        Ctor.prototype = proto;
        return new Ctor();
    };
	// 创建一条洁净的原型链
	function inheritProps(newproto,oldproto,addTo){
		addTo = addTo || newproto;
		for(var attr in newproto){
			addTo[attr] = isFunction(newproto[attr]) && isFunction(oldproto[attr]) && fnMatch.test(newproto[attr]) 
						? (function(name,fn){
							return function(){
								var tmp = this._super,ret;
								this._super = oldproto[name];
								ret = fn.apply(this,arguments);
								this._super = tmp;
								return ret;
							}
						})(attr,newproto[attr]) : newproto[attr];
			
		}
		return addTo;
	}
	function Class(){
	}
	Class.extend = function(proto){
		proto = proto || {};
		var _super = this.prototype,prototype = createProto(_super);
		inheritProps(proto,_super,prototype);
		function subClass(){
			this.init && this.init.apply(this,arguments);
		}
		subClass.constructor = subClass;
		subClass.prototype = prototype;
		return classify(subClass);
	}
	function classify(o){
		o.extend = Class.extend;
		o.implement = function(items)
		{
			isArray(items) || (items = [items] );
			var proto = this.prototype,item;
			while((item = items.shift()) )
			{
				item = item.prototype || item;
				for(var attr in item){
					proto[attr] = item[attr];
				}
			}
			return this;
		}
		o.static = function(){

		}
		return o;
	}
	return Class;
});