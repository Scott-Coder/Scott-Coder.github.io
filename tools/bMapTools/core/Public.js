/*******************************************************************************
 * publicClass.js -  publicClass Script library
 * Copyright (C) 2016
 *
 * @Author zengchao
 * @Email scottcoder@163.com
 * @UpdateTime (2016-06-21)
 *******************************************************************************/
(function (window, undefined) {
	var S = window.S || {};
	S.version = "v1.0.0";
	S.author = "zengchao||scottcoder@163.com";
	S.userData = {};
	S.temp = {};
	S.history = []; //存储历史记录
	S.eventList = {} // 存储windows 事件管理

	//获取页面参数
	S.queryString = function (key, attr) {
        var result = null;
        attr = attr ? attr : window.queryString;
        if ((!window.queryString) || (!key)) return null;
        if (typeof window.queryString == "string") return window.queryString;
        else {
            for (var i = 0; i < attr.length; i++) {
                var temp = attr[i].split("=");
                if (temp[0] == key) {
                    result = temp[1];
                    break;
                }
            }
        }
        return result;
    };
    //监听浏览器message消息,对消息进行处理
    window.addEventListener("message",function(messager){
        var message = JSON.parse(messager.data.slice(9))
        var messageId = message.MessageId || "";
        if(S.eventList[messageId] && typeof S.eventList[messageId] == "function"){
            S.eventList[messageId](message);
        }
    })
	S.listenPostMessage = function(eventName,callback){
        if(S.eventList[eventName]){
        }else{
            S.eventList[eventName] = callback;
        }
    }
	//获取url上的参数
	S.getQueryString = function (key, url) {
        url = (url) ? url : location.search;
        if (key != null && key != "" && key != undefined) {
            var value = url.match(new RegExp("[\?\&]" + key + "=([^\&]*)(\&?)", "i"));
            return value ? value[1] : value;
        }
        var result = url.match(new RegExp("[\?\&][^\?\&]+=[^\?\&]+", "g"));
        if (result == null) return null;
        for (var i = 0; i < result.length; i++) {
            result[i] = result[i].substring(1);
        }
        return result;
    };
	
	/**
     * form表单提交方式下载函数
     * @param {String} api 下载地址接口
     * @param {Object} params [可选] 下载接口参数对象
     * @return 无
     */
	S.downLoad=function(api,params){
		var form=$("<form target='_blank' method='post' action='"+api+"' name='downLoad'></form>");
		for(var key in params){
			form.append("<input type='hidden' name='"+key+"' value='"+params[key]+"'/>");
		}
		$("body").append(form);
		form.submit();
		form.remove();
	};
	
	/**
     * 格式化日期时间
     * @param {Date} date 需要格式化的日期时间
     * @param {String} format [可选],默认"yyyy-MM-dd hh:mm:ss"
     * @return {String}
     */
	S.dateFormat = function (date, format) {
		format = format || "yyyy-MM-dd hh:mm:ss";
        var o = {
            "M+":date.getMonth() + 1, //month 
            "d+":date.getDate(), //day 
            "h+":date.getHours(), //hour 
            "m+":date.getMinutes(), //minute 
            "s+":date.getSeconds(), //second 
            "q+":Math.floor((date.getMonth() + 3) / 3), //quarter 
            "S":date.getMilliseconds() //millisecond 
        };

        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }

        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    };
	
	//格式化URL
	S.setNoCacheUrl = function (url) {
        if (url.indexOf("?") >= 0)  url += "&rd=" + Math.random();
        else url += "?rd=" + Math.random();
        url = url.replace(/\/{2}/, '/');
        return url;
    };
	
	/**
     * 格式化HTML
     * @param {String} html 需要将html符号转义的字符串
     * @return {String}
     */
	S.htmlFormat = function (html) {
        html = html + "";
        html = html.replace(/'|"/g, "&quot;");
        html = html.replace(/</g, "&lt;");
        html = html.replace(/>/g, "&gt;");
        return html;
    };
	
	/**
     * 反转义HTML
     * @param {String} str 需要反转义的字符串
     * @return {String}
     */
	S.htmlDecode = function(str){
		var result = "";
		var temp = document.createElement("div");
			temp.innerHTML = str;
		result = temp.innerText ||  temp.textContent;
		temp = null;
		return result
	}
	
	
	/**
     * 输出日志
     * @param {String} msg 日志内容
     * @param {String} type 日志类型
     * @return 无
     */
	S.log = function (msg, type) {
        if (!document.all&&console&&S.debug==true) {
            switch (type) {
                case "error":
                    console.log("errorLog>>>>" + msg);
                    break;
                default:
                    console.log("pageLog>>>>" + msg);
                    break;
            }
        }
    };
	/**
     * 清除日志
     * @param 无
     * @return 无
     */
    S.clearLog = function () {
        if (!document.all) {
            try {
                console.clear();
            }
            catch (ex) {
            }
        }
    };
	
	/**
     * 清除两端空格
     * @param {String} str 需要清除的字符串
     * @return {String}
     */
	S.trim = function(str){  
　　     return str.replace(/(^\s*)|(\s*$)/g, "");
　　};
	
	
	//加载文件
	S.fileLoader = function (file,fileType, callBack) {
        S.temp[fileType+"CurrentIndex"] = 0;
        var total = file.length;

        //load js and css by async
        S.asyncLoader(file , fileType, total, function () {
			S.temp["fileComplate"] = true;
			if (typeof callBack == "function") callBack();
        });
    };
	
	//加载
	S.asyncLoader = function (file, type, total, callBack) {
        //all loaded and return
        if (S.temp[type + "CurrentIndex"] == file.length) {
            S.temp[type + "Completed"] = true;
            if (typeof callBack == "function") callBack();
            return;
        }

        if (type == "js") {
            S.jsLoader(file[S.temp[type + "CurrentIndex"]], function () {
                S.temp[type + "CurrentIndex"] = S.temp[type + "CurrentIndex"] + 1;
                S.asyncLoader(file, type, total, callBack);
            });
        }
        else if (type == "css") {
            S.cssLoader(file[S.temp[type + "CurrentIndex"]], function () {
                S.temp[type + "CurrentIndex"] = S.temp[type + "CurrentIndex"] + 1;
                S.asyncLoader(file, type, total, callBack);
            });
        }
    };
	
	//JS文件加载
	S.jsLoader = function (url, callBack) {
        if (url == undefined || url == null) return;
        if (S.temp["fileLoaded"] == undefined) S.temp["fileLoaded"] = {};

        if (!url) {
            if (typeof callBack == "function") callBack();
            return;
        }

        var head = document.getElementsByTagName('head').item(0),
            script = document.createElement('script'),
            complate = function () {
                S.temp["fileLoaded"][url] = true;
                S.log("Js Success:" + url + " is loaded successfully.");
                clear();
                if (typeof callBack == "function") callBack();
            },
            clear = function () {
                script.onload = script.onreadystatechange = script.onerror = null;
                head.removeChild(script);
                head = script = null;
            };

        //script
        script.src = S.setNoCacheUrl(url);
        script.type = "text/javascript";

        //error
        script.onerror = function () {
            clear();
            S.log("Js Fail:" + url + " loaded failed to load.");
        };

        //success
        if (document.all) {
            script.onreadystatechange = function () {
                if (/loaded|complete/.test(script.readyState)) complate();
            };
        } else {
            script.onload = function () {
                complate();
            };
        }

        //append
        head.appendChild(script);
    };
	
	//CSS文件加载
 	S.cssLoader = function (url, callBack) {
        if (url == undefined || url == null) return;
        if (S.temp["fileLoaded"] == undefined) S.temp["fileLoaded"] = {};

        var head = document.getElementsByTagName('head').item(0),
            css = document.createElement('link'),
			/*timer,*/
			complate = function () {
				S.temp["fileLoaded"][url] = true;
				S.log("Css Success:" + url + " is loaded successfully.");

				clear();
				if (typeof callBack == "function") callBack();
			},
			clear = function () {
				timer = null;
				css.onload = css.onerror = null;
				head = null;
			};
        //css
        css.rel = "stylesheet";
        css.type = "text/css";
        css.href = S.setNoCacheUrl(url);

        //error
        css.onerror = function () {
            clear();
            S.log("Css Fail:" + url + " loaded failed to load.");
        };

        //success
        css.onload = function () {
            complate();
        };

        //append
        head.appendChild(css);
    };
	
	/**
     * 格式化html标签
     * @param {String} value 需格式化的字符串
     * @return {String} 格式化后的字符串
     */
    S.htmlFormat=function(value){
        value=value+"";
        value=value.replace(/'|"/g,"&quot;");
        value=value.replace(/</g,"&lt;");
        value=value.replace(/>/g,"&gt;");
        return value;
    };

    //回填表单数据
	S.buildFormValue=function(target,data,dataObjectName){
		if(typeof data!="object") return;
		var obj,type,value;
		target.find("input,textarea,select").each(function(){
			if($(this).attr("noreturn")) return;
			var name=$(this).attr("name");
			if(name&&data[name.replace(dataObjectName,"")]!=undefined){
				obj=$(this);
				type=(obj[0].tagName).toLowerCase();
				value=data[name.replace(dataObjectName,"")];
				
				switch(type){
					case "select":
						var selected=obj.find("option[value=\""+value+"\"]"),
							selectList=obj.siblings(".controls-select");
						selected.attr("selected",true);
						if(selectList.size()>0){
							selectList.find(".value").text(selected.text());
							$(window).resize();
						}
						break;
					case "input":
						if(obj.attr("type")=="text"||obj.attr("type")=="hidden"){
							obj.val(value);
						}
						else if(obj.attr("type")=="radio"){
							var temp=target.find("[name=\""+name+"\"][value=\""+value+"\"]");
							if(temp.attr("init")) return;
							if(temp.size()==1) {
								if(temp.hasClass("read-only")){
									target.find("[name=\""+name+"\"]").removeAttr("checked").parent().removeClass("checked");
									temp.parent().addClass("checked");
									temp.attr("checked",true);
								}
								else {
									temp.parent().click();
								}
								temp.attr("init",true);
							}
						}
						else if(obj.attr("type")=="checkbox"){
							var tempAttr=value+"";
							if(tempAttr) tempAttr=tempAttr.split(",");
							else return;
							
							if(target.find("[name=\""+name+"\"]").eq(0).hasClass("checked")){
								target.find("[name=\""+name+"\"]").removeAttr("checked").parent().removeClass("checked");
							}
							for(var i=0;i<tempAttr.length;i++){
								var temp=target.find("[name=\""+name+"\"][value=\""+tempAttr[i]+"\"]");
								if(temp.attr("init")) return;
								if(temp.size()>0){
									if(temp.hasClass("read-only")){
										temp.parent().addClass("checked");
										temp.attr("checked",true);
									}
									else temp.parent().click();
									temp.attr("init",true);
								}
							}
						}
						break;
					case "textarea":
						obj.val(value);
						break;
				}
			}
		});
	};
	
	/**
     * 发送请求
     * @param {Object} option 各项参数封装的对象
	 * @param {String} option.type 请求类型，默认post
	 * @param {Object} option.data 发送请求的参数，默认{}
	 * @param {String} option.url 发送请求的地址
	 * @param {Boolean} option.async 同异步，默认true
	 * @param {String} option.dataType 数据类型，默认json
	 * @param {Function} option.beforeSend 发送请求前函数，无返回值
	 * @param {Function} option.success 请求成功回调函数，返回接收到的数据对象
	 * @param {Function} option.error 请求失败函数，返回错误信息
	 * @param {Function} option.complete 请求完成后函数，无返回值
     * @return {Any} result
     */
    S.request = function (option) {
        var result = null,
            async = (option.async === false ? false : true),
			callbackName ="callback"+new Date().getTime();
            if(!option.loading&&option.loading!==false) option.loading = true;
		if(option.loading!=false) S.loadingShow();
        $.ajax({
            type:option.type || 'post',
            data:option.data || {},
            //url:S.setNoCacheUrl(option.url) || '',
            url:option.url|| '',
            async:async,
            dataType:option.dataType || 'json',
			timeout : option.timeout||20000, //超时时间设置，单位毫秒,默认设置10秒超时
			jsonp : "callback", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
			jsonpCallback : callbackName, //自定义的jsonp回调函数名称
            beforeSend:function () {
                if (!window["ajaxCount"]) window["ajaxCount"] = 0;
                if (option.loading != false) window["ajaxCount"]++;
                if (typeof option.beforeSend == "function") option.beforeSend();
            },
            success:function (data) {
                S.log("Request Success:" + option.url + " request success");
                result = data;

                if (typeof option.success == 'function') option.success(data);
            },
            error:function (ex) {
                
                if (typeof option.error == 'function') option.error(ex);
                switch (ex.status) {
                    case 0:
                        S.alert("服务器已经停止运行，请通知系统管理员检查并解决。");
                        break;
                    case 401:
						S.alert("账户信息已过期，请重新登录！",function(){
							window.location.href = $$("j_security_logout");
						});
                        break;
                    case 403:
                        S.alert(decodeURIComponent(ex.getResponseHeader("Error-Message")));
                        break;
                    case 404:
                        S.alert(option.url + "，请求服务器的接口不存在。");
                        break;
                    case 500:
						S.alert(decodeURIComponent(ex.getResponseHeader("Error-Message")));
                        break;
                }

                S.log("Request fail:" + option.url + " request fail，" + ex.message);
            },
            complete:function () {
                if (!window["ajaxCount"]) window["ajaxCount"] = 0;
                window["ajaxCount"]>0 && window["ajaxCount"]--;

                if (window["ajaxCount"] <= 0) S.loadingHide();
                if (typeof option.complete == "function") option.complete();
            }
        });
        if (async == false) return result;
    };
  
	S.alert = function(msg,callback){
		if(zDialog){
			new zDialog({
				title:"系统消息",
				type:"alert",
				theme:"blue",
				width:300,
				content:msg,
				btn:[{
						text:"确定",
						click:function(target){
							if(typeof callback=="function") return callback(target);
						}
					 }
				]

			});
		}else{
			alert(msg);
		}
	};
	
 	S.loadingShow=function(message){
		if(message) $(".pageloader .loading-message").text(message);
		$(".pageloader").show();
	};

	S.loadingHide=function(){
		$(".pageloader").hide();
	};

 	//判断类型辅助函数
 	S.checkType = function(any){
		return Object.prototype.toString.call(any)
	}

 	/**
     * 是否为函数类型
     * @param {Any} any 被检测的变量
     * @return {Boolean}
     */
 	S.isFunction = function(any){
  		return S.checkType(any) === '[object Function]';  
	};
	
	/**
     * 是否为数组对象类型
     * @method isArray
     * @param {Any} any 被检测的变量
     * @return {Boolean} 结果
     */
	S.isArray = Array.isArray || function(any) { 
  		return S.checkType(any) === '[object Array]';  
	}
	
	/**
     * 是否为日期类型
     * @param {Any} any 被检测的变量
     * @return {boolean}
     */
	S.isDate = function(any) { 
  		return S.checkType(any) === '[object Date]';  
	}
	
	/**
     * 是否为字符串类型
     * @param {Any} any 被检测的变量
     * @return {Boolean}
     */
	S.isString = function(any){
		return typeof any === "string";
	}
	
	/**
     * 是否为数字类型(为Number且不为正负无穷大数字)
     * @param {Any} any 被检测的变量
     * @return {Boolean}
     */
    S.isNumber = function(any){
        return typeof any === 'number' && isFinite(any);
    };

    /**
     * 是否为布尔值类型
     * @param {Any} any 被检测的变量
     * @return {Boolean}
     */
    S.isBoolean = function(any){
        return typeof any === 'boolean';
    };
	
	/**
     * 是否为空对象 null和undefined和数组的长度为0或空字符串("")
     * @param {Any} any 被检测的变量 
     * @param {Boolean} allowBlank [可选] 默认false 空字符串认为是空对象 反之 空字符串不认为是空对象
     * @return {Boolean}
     */
    S.isEmpty = function(any, allowBlank){
        return any === null || any === undefined ||
        (S.isArray(any) && !any.length) ||
        (!allowBlank ? any === '' : false);
    };

	/**
     * 是否为正则表达式类型
     * @param {Any} v 被检测的变量
     * @return {Boolean}
     */
    S.isRegexp = function(any){
        return S.checkType(any) == '[object RegExp]';
    };

    /**
     * 是否为对象类型
     * @param {Any} any 被检测的变量
     * @return {boolean}
     */
    S.isObject = function(any){
        return !!any && S.checkType(any) === '[object Object]';
    };

	/**
     * 返回数据类型的字符串形式
     *  数字类型:"Number"
     *  布尔类型:"Boolean"
     *  字符串类型:"String"
     *  数组类型:"Array"
     *  日期类型:"Date"
     *  正则表达式类型:"Regexp"
     *  函数类型:"Function"
     *  对象类型:"Object"
     *  其他类型:"Unknow"
     */
	S.typeString = function(any){
		var result = "unknow";
		if(S.isNumber(any)){
			result =  "number";
		}
		if(S.isBoolean(any)){
			result = "boolean";
		}
		if(S.isString(any)){
			result = "string";
		}
		if(S.isArray(any)){
			result = "array";
		}
		if(S.isDate(any)){
			result = "date";
		}
		if(S.isRegexp(any)){
			result = "regexp";
		}
		if(S.isFunction(any)){
			result = "function";
		}
		if(S.isObject(any)){
			result = "object";
		}
		return result
	}
	
	
	/**
     * 存取localStorage
     * @param {String} key 存储的数据key
     * @param {Object} value 存储的数据对象 [可选]传此参数则为存储，不传则为读取;
     * @return {Object}
     */
	S.localStorage = function(key,value){
		if(key==undefined||key==null||key=="") return null;
 		if(value==undefined){
	 		var result = localStorage.getItem(key);
	 		if(result!=undefined&&typeof result=="string"&&((result.indexOf("{")>=0&&result.indexOf(":")>0)||(result.indexOf("[")>=0))){
				try{
					result=JSON.parse(result);
				}
				catch(ex){
				}
			 }
			 return (result==undefined)?null:result;
		 }else{
			 var tempData = ((typeof value=="object")?JSON.stringify(value):value);
			 localStorage.setItem(key,tempData)
		 }
	}
	
	/**
     * 移除指定localStorage
     * @param {String} key 需要在localStorage删除的item
     * @param {Boolean} all [可选] 默认false, 为true则清除所有localStorage
     * @return 无
     */
	S.localRemove = function(key,all){
		if(key==undefined||key==null||key=="") return null;
		if(all&&all==true){
			localStorage.clear();
		}else{
			localStorage.removeItem(key);
		}
	}
	
	/**
     * 存取sessionStorage
     * @param {String} key 存储的数据key
     * @param {Object} value 存储的数据对象 [可选]传此参数则为存储，不传则为读取;
     * @return {Object}
     */
	S.sessionStorage = function(key,value){
 		if(value==undefined){
	 		var result = sessionStorage.getItem(key);
	 		if(result!=undefined&&typeof result=="string"&&((result.indexOf("{")>=0&&result.indexOf(":")>0)||(result.indexOf("[")>=0))){
				try{
					result=JSON.parse(result);
				}
				catch(ex){
				}
			 }
			 return (result==undefined)?null:result;
		 }else{
			 var tempData = ((typeof value=="object")?JSON.stringify(value):value);
			 sessionStorage.setItem(key,tempData)
		 }
	}
	
	/**
     * 移除指定sessionStorage
     * @param {String} key 需要在sessionStorage删除的item
     * @param {Boolean} all [可选] 默认false, 为true则清除所有sessionStorage
     * @return 无
     */
	S.sessionRemove = function(key,all){
		if(key==undefined||key==null||key=="") return null;
		if(all&&all==true){
			sessionStorage.clear();
		}else{
			sessionStorage.removeItem(key);
		}
	}
	
	/**
     * 浏览器是否能创建 XMLHttpRequest 对象
     * @return {Boolean}
     */
	S.canAjax = function(){
		if($.browser){// jQuery 1.9之后$.support替代$.browser
			
		}else{
			return $.support.ajax
		}
	}
	
	/**
     * 生成Guid
     * @return {String}
     */
	S.getGuid = function(length){
		var result = "S";
		length = length || 32;
	    for (var i = 1; i < length; i++){
	      	var num = Math.floor(Math.random()*16.0).toString(16).toLocaleUpperCase();
	       	result += num;
	      	//if((i==4)||(i==8)||(i==12)||(i==16)||(i==20)) result += "-";
	 	}
	    return result;
	};
	
	S.getScrollWidth=function(){
		var noScroll,
			scroll, 
			oDiv = document.createElement("div");
		
		  oDiv.style.cssText = "position:absolute; top:-1000px; width:100px; height:100px; overflow:hidden;";  
		  noScroll = document.body.appendChild(oDiv).clientWidth;  
		  oDiv.style.overflowY = "scroll";  
		  
		  scroll = oDiv.clientWidth;  
		  document.body.removeChild(oDiv);  
		  return noScroll-scroll;  
	};
	
	S.resizeAutoHeight = function(){
		var wH=$(window).height();
		$("[layoutHeight]").each(function(){
			$(this).css({"height":(wH-parseInt($(this).attr("layoutHeight"))+"px")});
		});
	}
	
	/**
     * 单个文件上传
     * @param {Object} option.file 上传的文件对象
     * @param {String} option.url 上传地址
     * @param {String} option.fileObjName 在后端接受文件的参数名称
     * @param {Object} option.formData 发送给服务端的参数，可选
     * @return {function} onStart 上传开始回调
     * @return {function} onError 上传错误回调
     * @return {function} onSuccess 上传成功回调
     * @return {function} onComplete 上传成功回调
     */
	S.uploadFile = function(option){
		if(!option) return false;
		var xhr;
		try{
			xhr = new XMLHttpRequest();//尝试创建 XMLHttpRequest 对象，除 IE 外的浏览器都支持这个方法。
		}catch(e){	  
			xhr = ActiveXobject("Msxml12.XMLHTTP");//使用较新版本的 IE 创建 IE 兼容的对象（Msxml2.XMLHTTP）。
		}
		S.loadingShow();
		if (xhr.upload){
			//文件上传成功或是失败
			xhr.onreadystatechange = function(){
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						if(option.onSuccess&&typeof option.onSuccess == "function") option.onSuccess(JSON.parse(xhr.response));
					}else{
						if(option.onError&&typeof option.onError == "function") option.onError(xhr.status,JSON.parse(xhr.response));
					}
					if(option.onComplete&&typeof option.onComplete == "function") option.onComplete(JSON.parse(xhr.response));
					S.loadingHide();
				}
			};
			if(option.onStart&&typeof option.onStart == "function") option.onStart();
			//开始上传
			xhr.open("post",option.url, true);
			xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			var fd = new FormData();
			fd.append(option.fileObjName,option.file);
			if(option.formData){
				for(var key in option.formData){
					fd.append(key,option.formData[key]);
				}
			}
			xhr.send(fd);
		}
	}
	
	/*
	* 移动端通用函数
	*/
	
	//判断是否为android平台
	S.isAndroid = function(){
		var u = navigator.userAgent, app = navigator.appVersion;
	    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
		return isAndroid;
	}

	//判断是否为IOS平台
	S.isIOS = function(){
		var u = navigator.userAgent, app = navigator.appVersion;
		var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
		return isiOS;
	}
	
	//判断是否用wap 浏览器访问
	S.isBrowser = function(){
		var href = document.location.href;
		if(/^file:/.test(href)){
			return false;//代表是app访问
		}else{
			return true;//代表是网页访问
		}
	}
    
	//重置页面内容
	S.resetPage = function(){
		$(".validator-msg").remove();
	}
	window.S = S;

	//loaded event
	window.onload=function(){

        S.clearLog(); //clear log
        $(window).resize(function(){
			S.resizeAutoHeight();
		});
        
    };
})(window);