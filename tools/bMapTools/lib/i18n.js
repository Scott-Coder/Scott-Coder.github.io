define(function(require)
{
	'use strict';
	var template = require('string/template');
	S = S || {};
	S.i18n = {
		text : function(str){
			return template[str] || '';
		}
		,image : function(name){
			if(name.indexOf('#') === 0){
				name = substr(1,t.length -1 );
				var names = name.split('/');
				if(names.length === 1){
					return names[0];
				}
				return seajs.resolve(names+'/img/'+names.splice(1).join('/'));
			}
			return seajs.resolve('img/' + name + '#');
		}
	};
});