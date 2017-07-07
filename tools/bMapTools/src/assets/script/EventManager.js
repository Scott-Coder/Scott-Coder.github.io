define(function(require) {
	'use strict';
	var EventEmitter = new (require('core/EventEmitter'))()
		,keyMap = {
			'48' : 'KEY_ZERO' //0
			,'49' : 'KEY_ONE'
			,'50' : 'KEY_TWO'
			,'51' : 'KEY_THREE'
			,'52' : 'KEY_FOUR'
			,'53' : 'KEY_FIVE'
			,'54' : 'KEY_SIX'
			,'55' : 'KEY_SEVEN'
			,'56' : 'KEY_EIGHT'
			,'57' : 'KEY_NINE' // 9
			// ,'96' : 'KEY_ZERO' //0 数字键盘区
			// ,'97' : 'KEY_ONE'
			// ,'98' : 'KEY_TWO'
			// ,'99' : 'KEY_THREE'
			// ,'100' : 'KEY_FOUR'
			// ,'101' : 'KEY_FIVE'
			// ,'102' : 'KEY_SIX'
			// ,'103' : 'KEY_SEVEN'
			// ,'104' : 'KEY_EIGHT'
			// ,'105' : 'KEY_NINE' // 9
			// ,'107' : 'KEY_FONE' //F1
			// ,'108' : 'KEY_FTWO' //F2
			// ,'96' : 'KEY_FTHREE' //F3
			// ,'97' : 'KEY_FFOUR' //F4
			// ,'98' : 'KEY_FFIVE' //F5
			// ,'99' : 'KEY_FSIX' //F6
			// ,'110' : 'KEY_FSEVEN' //F7
			// ,'111' : 'KEY_FEIGHT' //F8
			// ,'112' : 'KEY_FNINE' //F9
			// ,'113' : 'KEY_FTEN' // F10
			// ,'114' : 'KEY_FELEVEN'
			// ,'115' : 'KEY_FTWELVE'
			,'38' : 'KEY_UP'
			,'39' : 'KEY_RIGHT'
			,'40' : 'KEY_DOWN'
			,'41' : 'KEY_RIGHT'
		};
	window.onkeydown = function(e){
		if(S.__page__){
			e.name = keyMap[e.which || e.keyCode];
			e.src = 'KEY';
			var ret = 1, obj = S.__page__;
			while(ret === 1 && obj && obj.handleEvent){
				ret = obj.handleEvent(e);
				obj = obj.container;
			};
		}
		if(e.keyCode === 116 && S.F5KEY){
			return false;
		}
	}
	return EventEmitter;
});