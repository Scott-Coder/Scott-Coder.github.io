seajs.config({
	"base": "./",
	"alias": { //简化模块名称 
		"Base" : "core/Base"
	},
	"paths": { //映射模块路径
		"script" : "src/assets/script",
		"css" : "src/assets/style",
		"images" : "src/assets/images",
		"public" : "src/public",
		"webapps" : "src/webapps",
		"common" : "src/webapps/common", // 公共页面
		"getPoint" : "src/webapps/getPoint" // 坐标拾取器
	},
	"charset": "utf-8",
	"preload": [ // 在普通模块加载前加块此模块
		"core/Public",
		"script/Modes.js"
	]
});
var S = {
	debug : true,
	logstate : true,
	KEY4F : true // 是否启用F系列快捷键
}; //全局容器
seajs.use("script/index");