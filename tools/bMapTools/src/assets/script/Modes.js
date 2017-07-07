(function(win,undefined){
'use strict';
if(win.Modes) return;
var data = {
  base : 'modes/'
    ,iscmd : false
},cache = {};
win.Modes = Modes;
Modes.version = '1.0.0';

function isRelativeUrl(path){
  if(path.indexOf('/') === 0){
      return true;
    }else{
      return false;
    }
}
var State = {
    unLoad : 1
    ,Loading : 2
    ,Loaded : 3
}
function mode(option){
    var self = this;
  this.url = option.url?option.url:(data.base + option.name);
  this.name = option.name || option.url;
  this.depends = option.depends || [];
    this.status = State.unLoad;
    this.callback = option.callback || function(){} ;
    cache[this.name] = this;
    var lodeDep = [];
    this.status = State.Loading;
    if(this.depends.length){
        this.depends.forEach(function(depend){
            dependsOnlod(self.url,depend,function(){
                lodeDep.push(depend);
                if(lodeDep.length == self.depends.length){
                    modeOnlod(self.name,self.url,function(){
                        self.requested();
                    });
                }
            });
        });
    }else{
        modeOnlod(self.name,self.url,function(){
            self.requested();
        });
    }
}
mode.prototype.requested = function(){
    if(!Modes.iscmd){
        if(window[this.name]){
            this.exports = win[this.name];
            delete win[this.name];
        }
    }
    this.status = State.Loaded;
    this.callback(this.exports);
}
//加载主js
function modeOnlod(name,url,callback){
    var modeUrl = url + "/" + name +".js";
    request(modeUrl, callback);

}
//依赖项加载
function dependsOnlod(url,depend,callback){
        var RelativeDe =   isRelativeUrl(depend);
        var dependUrl = "";
        if(RelativeDe){
            dependUrl = url + depend;
        }else{
            dependUrl = depend;
        }
        request(dependUrl,callback);
}
//插件调用
function Modes(name,depends,callback){
   if(arguments.length === 2){
       callback = depends;
       depends = [];
   }
  if(cache[name]){
    if(cache[name].status === 3){
        callback && callback(cache[name].exports);
    }
    else{
        cache[name].callback = callback;
    }
  }else{
      var curOption = {
          name :name,
          depends : depends,
          callback:callback
      };
      new mode(curOption);
  }
}
//插件预加载
Modes.config = function(option){
  if(option.base) data.base = option.data;
  if(option.modes) {
    option.modes.forEach(function(item){
            new mode(item);
        });
  }
}


var isOldWebKit = +navigator.userAgent
    .replace(/.*AppleWebKit\/(\d+)\..*/, "$1") < 536;

var IS_CSS_RE = /\.css(?:\?|$)/i;

var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
function isFunction(obj){ return Object.prototype.toString(obj) === '[object Function]'; }

function request(url, callback, charset) {
  var isCSS = IS_CSS_RE.test(url);
  var node = document.createElement(isCSS ? "link" : "script")

  if (charset) {
    var cs = isFunction(charset) ? charset(url) : charset;
    if (cs) {
      node.charset = cs
    }
  }

  addOnload(node, callback, isCSS, url);

  if (isCSS) {
    node.rel = "stylesheet";
    node.href = url;
  }
  else {
    node.async = true;
    node.src = url
  }

   head.appendChild(node);

}
function addOnload(node, callback, isCSS, url) {
  var supportOnload = "onload" in node;

  // for Old WebKit and Old Firefox
  if (isCSS && (isOldWebKit || !supportOnload)) {
    setTimeout(function() {
      pollCss(node, callback)
    }, 1) // Begin after node insertion
    return
  }

  if (supportOnload) {
    node.onload = onload;
    node.onerror = function() {
      onload()
    };
  }
  else {
    node.onreadystatechange = function() {
      if (/loaded|complete/.test(node.readyState)) {
        onload();
      }
    }
  }

  function onload() {
    // Ensure only run once and handle memory leak in IE
    node.onload = node.onerror = node.onreadystatechange = null

    // Remove the script to reduce memory leak
    if (!isCSS && !data.debug) {
      head.removeChild(node)
    }

    // Dereference the node
    node = null;

    callback&&callback();
  }
}

function pollCss(node, callback) {
  var sheet = node.sheet;
  var isLoaded;

  // for WebKit < 536
  if (isOldWebKit) {
    if (sheet) {
      isLoaded = true
    }
  }
  // for Firefox < 9.0
  else if (sheet) {
    try {
      if (sheet.cssRules) {
        isLoaded = true
      }
    } catch (ex) {
      // The value of `ex.name` is changed from "NS_ERROR_DOM_SECURITY_ERR"
      // to "SecurityError" since Firefox 13.0. But Firefox is less than 9.0
      // in here, So it is ok to just rely on "NS_ERROR_DOM_SECURITY_ERR"
      if (ex.name === "NS_ERROR_DOM_SECURITY_ERR") {
        isLoaded = true
      }
    }
  }

  setTimeout(function() {
    if (isLoaded) {
      // Place callback here to give time for style rendering
      callback()
    }
    else {
      pollCss(node, callback)
    }
  }, 20)
}

})(this);