/*根据浏览器的不同语言加载不同js*/
//$(function(){
	var type=navigator.appName;
	var lang;
	var head=document.getElementsByTagName('head')[0];

	if (type=="Netscape"){
		lang = navigator.language
	}else{
		lang = navigator.userLanguage
	}

	//lang = lang.substr(0,2)
	lang = "zh"; //强制写死中文，设计器没必要实现中英文双语，并且英文或其他语言有bug。
	if (lang == "en"){
		$(head).prepend('<script type="text/javascript" src="'+contextPath+'/workflow/processDesigner/js/bpm-i18n-en-US.js"></script>');
	}else if (lang == "zh"){
		$(head).prepend('<script type="text/javascript" src="'+contextPath+'/workflow/processDesigner/js/bpm-i18n-zh-CN.js"></script>');
	}else{
		$(head).prepend('<script type="text/javascript" src="'+contextPath+'/workflow/processDesigner/js/bpm-i18n-zh-CN.js"></script>');
	}
//})
	/*判断是否为ie8浏览器*/
	var isIE8=function(){
		var browser=navigator.appName
		if(browser=="Microsoft Internet Explorer"){
			var b_version=navigator.appVersion
			var version=b_version.split(";");
			var trim_Version=version[1].replace(/[ ]/g,"");
			if(trim_Version=="MSIE8.0"){
				return true;
			}
		}
		return false;
	}