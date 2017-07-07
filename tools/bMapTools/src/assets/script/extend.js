(function(window,undefined){
	
	//jquery param
	var r20 = /%20/g,
		rbracket = /\[\]$/;

	function buildParams(prefix, obj, add){
		if (jQuery.isArray(obj)){
			jQuery.each(obj, function (i, v){
				if(rbracket.test(prefix)){
					add(prefix, v);
				}else{
					buildParams(prefix + "[" + i + "]", v, add);
				}
			});
		}else if(jQuery.type(obj) === "object") {
			for(var name in obj) {
				buildParams(prefix + "." + name, obj[ name ], add);
			}
		}else{
			add(prefix, obj);
		}
	}
	
	$.extend({
		param:function (a) {
			var s = [], add = function (key, value) {
				value = jQuery.isFunction(value) ? value() : (value == null ? "" : value);
				s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
			};
			if (jQuery.isArray(a) || ( a.jquery && !jQuery.isPlainObject(a) )) {
				jQuery.each(a, function (i, v) {
					buildParams('[' + i + ']', v, add);
				});
			} else {
				for (var prefix in a) {
					buildParams(prefix, a[ prefix ], add);
				}
			}
			return s.join("&").replace(r20, "+");
		}
	});

	$.fn.zWorkTools = function(method){
		var methods = {
			init : function(options){
				var $this = $(this);
				var settings = $.extend({
					id : $this.attr("id"),
					type : "all",
					toolbars : ["save","|","zoom","unzoom","resetzoom","|","leftAlign","centerAlign","rightAlign","topAlign","middleAlign","bottomAlign","|","allSelect","delete","help"],
					onInit : null 
				},options)
				
				var toolbarsNames = {
					"save":"保存", "zoom":"放大", "unzoom":"缩小", "resetzoom":"恢复", "leftAlign":"左对齐", "centerAlign":"水平居中", "rightAlign":"右对齐", "topAlign":"顶部对齐", "middleAlign":"垂直居中", "bottomAlign":"底部对齐", "allSelect":"全选", "delete":"删除", "help":"帮助"
				 }
				
				if(settings.toolbars&&settings.toolbars.length>0){
					var barsList = settings.toolbars,
						barsWrapper = $("<ul class='zWorkTools'></ul>");
					$(barsList).each(function(i,k){
						var itemClass = k,
							itemName = toolbarsNames[k];
						if(k=="|"){
							itemClass = "separator";
							itemName = "";
						} 
						//debugger;
						var item = $("<li class='zWorkTools-button zWorkTools-button-"+itemClass+"' title='"+itemName+"' type='"+itemClass+"'></li>");
						barsWrapper.append(item);
					})
					$this.html(barsWrapper)
				}
				
				
				
				//初始化完成后回调函数
				if(settings.onInit) settings.onInit.call($this);
			},
			disable : function(name){
				debugger;
				$(".zWorkTools-button-"+name).addClass("zWorkTools-button-disable");
			}
		}
		
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('方法 ' + method + ' 在$.workTools中不存在');
		}
	}
	
	// $.fn.dSelect = function(method){
	// 	var methods = {
	// 		init : function(options){
	// 			var $this = $(this);
	// 			var settings = $.extend({
	// 				optionList : [],
	// 				labelKey : "label",
	// 				valueKey : "value",
	// 				defultValue : "",
	// 				readOnly : false
	// 			},options);

	// 			// 添加静态option
	// 			var stateOption = [];
	// 			$this.find("option").each(function(i,v){
	// 				stateOption.push({
	// 					[settings["labelKey"]] : $(v).text(),
	// 					[settings["valueKey"]] : $(v).attr("value") || ""
	// 				});
	// 			});
	// 			settings.optionList = stateOption.concat(settings.optionList);
	// 			// 创建新select
	// 			var style = {
	// 				width : $this.width() + "px",
	// 				height : $this.height() + "px",
	// 				top : $this.offset().top + "px",
	// 				left : $this.offset().left + "px"
	// 			}
	// 			var wrap = $('<div class="dSelect_wrapper" style="width:'+style.width+';"><div class="dSelect_panel" style="height:'+style.height+';line-height:'+style.height+';"></div><ul class="dSelect_list"></ul></div>');
	// 			var list = "",option = "";
	// 			$(settings.optionList).each(function(i,v){
	// 				list += '<li index="'+(v[settings["valueKey"]]||"")+'" style="'+style.height+';line-height:'+style.height+'" title="'+(v[settings["labelKey"]]||"")+'">'+(v[settings["labelKey"]]||"")+'</li>';
	// 				option += '<option value="'+(v[settings["valueKey"]]||"")+'">'+(v[settings["labelKey"]]||"")+'</option>';
	// 			});
	// 			$this.html(option).hide();
	// 			wrap.find(".dSelect_list").html(list).hide();
	// 			wrap.on("click","li",function(){
	// 				var label = $(this).text(),
	// 					value = $(this).attr("index");
	// 				wrap.find(".dSelect_panel").html(label).attr("title",label);
	// 				$this.find("option[value="+value+"]")[0].selected = true;
	// 				$(this).parent(".dSelect_list").hide();
	// 				return false;
	// 			});
	// 			wrap.on("click",".dSelect_panel",function(){
	// 				wrap.find(".dSelect_list").show();
	// 				return false;
	// 			});
	// 			$(window).on("click",function(){$(".dSelect_list").hide();});
	// 			$this.after(wrap);
				
	// 			// 默认设置
	// 			if(settings.defultValue) wrap.find("li[index="+settings.defultValue+"]").click();
	// 			else wrap.find("li:first").click();
	// 			// 只读
	// 			if(settings.readOnly) wrap.off();

	// 		}
	// 	}
	// 	var _arguments = arguments;
	// 	$(this).each(function(){
	// 		if(methods[method]){
	// 			return methods[method].apply(this,Array.prototype.slice.call(_arguments,1));
	// 		}else if(typeof method === "object" || !method){
	// 			return methods.init.apply(this,_arguments);
	// 		}else{
	// 			$.error("方法" + method + "不存在");
	// 		}
	// 	});
		
	// }
	
	S.xml2json = function(xmlStr){
		var result = {};
		xmlStr = xmlStr.replace(/&gt;/g, ">");
		xmlStr = xmlStr.replace(/&lt;/g, "<");
		xmlStr = xmlStr.replace(/&quot;/g, "\"");
		var xotree = new XML.ObjTree();
		var dumper = new JKL.Dumper();
		var tree = xotree.parseXML(xmlStr);
		if (tree) {
			if (!tree.html)
				return {
					result : true,
					json : JSON.parse(dumper.dump(tree))
				}
			else {
				return {
					result : false
				};
			}
		}
	}
	
	S.json2xml = function(json){
		var formatXml = function (xml) {
			var reg = /(>)(<)(\/*)/g;
			var wsexp = / *(.*) +\n/g;
			var contexp = /(<.+>)(.+\n)/g;
			xml = xml.replace(reg, '$1\n$2$3').replace(wsexp, '$1\n').replace(contexp, '$1\n$2');
			var pad = 0;
			var formatted = '';
			var lines = xml.split('\n');
			var indent = 0;
			var lastType = 'other';
			var transitions = {
				'single->single': 0,
				'single->closing': -1,
				'single->opening': 0,
				'single->other': 0,
				'closing->single': 0,
				'closing->closing': -1,
				'closing->opening': 0,
				'closing->other': 0,
				'opening->single': 1,
				'opening->closing': 0,
				'opening->opening': 1,
				'opening->other': 1,
				'other->single': 0,
				'other->closing': -1,
				'other->opening': 0,
				'other->other': 0
			};

			for (var i = 0; i < lines.length; i++) {
				var ln = lines[i];
				var single = Boolean(ln.match(/<.+\/>/));
				var closing = Boolean(ln.match(/<\/.+>/));
				var opening = Boolean(ln.match(/<[^!].*>/));
				var type = single ? 'single' : closing ? 'closing' : opening ? 'opening' : 'other';
				var fromTo = lastType + '->' + type;
				lastType = type;
				var padding = '';

				indent += transitions[fromTo];
				for (var j = 0; j < indent; j++) {
					padding += '\t';
				}
				if (fromTo == 'opening->closing')
					formatted = formatted.substr(0, formatted.length - 1) + ln + '\n';
				else
					formatted += padding + ln + '\n';
			}
			return formatted;
		}
		var xmlobjtree = new XML.ObjTree();
		try {
			return {
				result : true,
				xml : formatXml(xmlobjtree.writeXML(json,"-"))
			}
			return formatXml(xmlobjtree.writeXML(json,"-"));
		} catch (e) {
			return {
				result : false
			};
		}
	}

	// 分支列表
	$.fn.branchList = function(param){
		if($.isEmptyObject(param) || param.columns.length==0) return false;
		var options = $.extend({
			nodeNmae : "",
			columns : [],
			data : [],
			allSelect : false,
			selectMode : "Multi", // single 单选
			checkbox : false,
			readOnly : false,
			isTrClick : true,
			noData : "暂无数据",
			onSelect : function(){},
			onAfter : function(){}
		},param);
		var $this = this;
		function build(){
			if(options.data.length == 0) return false;
			var $wrap = $('<div class="brach_list"></div>');
			var $nodeTitle = $('<div class="list_head"><label>节点:<span id="nodeName">'+options.nodeNmae+'</span></label>');
			var $table = $('<table cellpadding="0" cellspacing="0" border="1" color="#000"></table>');
			var $thead;
			$this.append($wrap);
			$wrap.append($nodeTitle).append($table);

			if(options.checkbox && options.selectMode=="Multi") $thead = $('<tr class="head"><th width="25px" class="check"><input allSelect type="checkbox"/></th></tr>');
			else $thead = $('<tr class="head"></tr>');
			
			$(options.columns).each(function(i,v){
				$thead.append('<th width="'+v.width+'">'+v.name+'</th>');
			});
			$this.find("table").append($thead);
			if(options.data.length == 0){
				$this.find("table").append('<tr><td class="noData" colspan="'+(options.columns.length+1)+'">'+options.noData+'</td></tr>')
			}else{
				$(options.data).each(function(i,v){
					var $tbody;
					if(options.checkbox) $tbody = $('<tr formAndWidgetId="'+v.formId+'_'+v.widgetName+'"" row="'+i+'"><td width="25px" class="check" defCheck="'+v.isChecked+'"><input singleSelect type="'+(options.selectMode=="single"?"radio":"checkbox")+'"></td></tr>').data(v);
					else $tbody = $('<tr row="'+i+'"></tr>').data(v);
					$this.find("table").append($tbody).data(v);
					$(options.columns).each(function(j,colV){
						switch(colV.type){
							case "select" : 
								var _disabled = options.readOnly ? "disabled" : "";
								var selectStr = $('<td width="'+colV.width+'" col="'+j+'"><select '+_disabled+' class="branchList_select" name="'+colV.id+'"></select></td>');;
								selectStr.on("change",".branchList_select",function(){
									var name = $(this).attr("name");
									colV.callback && typeof colV.callback == "function" && colV.callback($(this),v,{name: name,value : $(this).val()});
								});
								$tbody.append(selectStr);
								$(v[colV.id]).each(function(index,val){
									var selected = false;
									for(var k = 0; k < colV.default.length ; k++){
										if(colV.default[k].widgetValue == val.value) selected = true;
									}
									var opList = $('<option value="'+val.value+'">'+val.text+'</option>');
									selectStr.find(".branchList_select").append(opList);
									if(selected) selectStr.find(".branchList_select option[value="+val.value+"]")[0].selected = true;
								});
							break;
							default :
							if(S.isArray(v[colV.id])){
								var valArray = [];
								$(v[colV.id]).each(function(j,d){
									valArray.push(d.value)
								});
								$tbody.append('<td width="'+colV.width+'" col="'+j+'" title="'+valArray.join(",")+'">'+valArray.join(",")+'</td>');
							}else $tbody.append('<td width="'+colV.width+'" col="'+j+'" title="'+v[colV.id]+'">'+v[colV.id]+'</td>');
						}
					});
				});
			}
			bindEvent();
			// 设置全选
			options.allSelect && $this.find("table .check input[allSelect]").click();
			// 设置只读
			options.readOnly && $this.find("table input,table select").attr("disabled",true);
			// 设置选中
			setSelected($this.find("td.check"));
			// 完成后的回调
			options.onAfter && S.isFunction(options.onAfter) &&  options.onAfter($this);
		}

		// 设置选中方法
		function setSelected(listDom){
			$(listDom).each(function(i,v){
				$(v).attr("defCheck") == "true" && $(v).find("input[singleSelect]").click();
			});
		}

		function bindEvent(){
			if(options.isTrClick){
				$this.on("click","tr[row]",function(){
					$this.find("tr.active").removeClass("active");
					$(this).addClass("active");
				});
			}
			$this.on("click",".check input",function(){
				var current = $(this)[0].checked;
				var type = $(this).is("[allSelect]")
				switch(type){
					case true : 
						if(current){
							$this.find("input[singleSelect]:not(:checked)").each(function(){
								$(this)[0].checked = true;
							});
						}else{
							$this.find("input[singleSelect]").each(function(){
								$(this)[0].checked = false;
							});
						}
					break;
					case false : 
						var noCheckedLen = $this.find("input[singleSelect]:not(:checked)").length; 
						if(current && noCheckedLen == 0){
							$this.find("input[allSelect]")[0].checked = true;
						}else if(current && noCheckedLen != 0){
							$this.find("input[allSelect]")[0].checked = false;
						}else if(!current) $this.find("input[allSelect]")[0].checked = false;
					break;
				}
				options.onSelect && S.isFunction(options.onSelect) &&  options.onSelect($this);
			});
		}
		build();
		this.__proto__.branch_GetSelectedData = function(){
			var result = [];
			this.find("input[singleSelect]:checked").parents("tr[row]").each(function(i,v){
				result.push($(v).data());
			});
			return result;
		}
		this.__proto__.branch_GetNotSelectedData = function(){
			var result = [];
			this.find("input[singleSelect]:not(:checked)").parents("tr[row]").each(function(i,v){
				result.push($(v).data());
			});
			return result;
		}
		this.__proto__.branch_DeleteSelected = function(){
			if(this.find("input[allSelect]")[0].checked){
				this.remove();
			}else{
				this.find("input[singleSelect]:checked").parents("tr[row]").each(function(i,v){
					$(this).remove();
				});
			}
		}
	}
	
	// 构建processXML数据
	S.buildProcessXML = function(data){
		
	}

	//加载滚动条
    $.fn.loadScroll = function(option){
        if(!this.hasClass(".mCustomScrollbar")){
            this.mCustomScrollbar({  
                theme:"minimal-dark", //主题颜色  
                scrollButtons:{  
                    enable:false //是否使用上下滚动按钮  
                },  
                autoHideScrollbar: true, //是否自动隐藏滚动条  
                scrollInertia :0,//滚动延迟  
                horizontalScroll : false,//水平滚动条  
                callbacks:{  
                    
                }  
            });
        }else{
            if(option&&S.isString(option)){
                this.mCustomScrollbar(option);
            };
        }
    }

})(window);