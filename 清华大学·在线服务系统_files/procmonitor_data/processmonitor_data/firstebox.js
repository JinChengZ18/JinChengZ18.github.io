var fb_pathToImage = contextPath + "/workflow/common/plugin/firstebox/loading.gif";
var ftop1 = 0, ftop2 = 0, ftop = 0, fleft = 0, fftop = 0;
$(document).ready(function () {
	if($('a.firstebox, area.firstebox, input.firstebox') != null){
		fb_init('a.firstebox, area.firstebox, input.firstebox');
		imgLoader = new Image();
		imgLoader.src = fb_pathToImage;
	}
});
function fb_init(domChunk) {
	$(domChunk).click(function () {
		var t = this.title || this.name || null;
		var a = this.href || this.alt;
		var g = this.rel || false;
		if (a.indexOf('FB_iniframe') != -1) {
			self.fb_show(t, a, g);
		} else {
			fb_show(t, a, g);
		};
		this.blur();
		return false;
	});
};
function fb_show(caption, url, imageGroup) {
	try {
		ftop = 0,
		fleft = 0,
		fftop = 0,
		ftop1 = 0,
		ftop2 = 0;
		if (typeof document.body.style.maxHeight === "undefined") {
			$("body", "html").css({
				height : "100%",
				width : "100%"
			});
			$("html").css("overflow", "hidden");
			if (document.getElementById("FB_HideSelect") === null) {
				$("body").append("<iframe id='FB_HideSelect'></iframe><div id='FB_overlay'></div><div id='FB_window'></div>");
				$("#FB_overlay").click(fb_remove);
			}
		} else {
			if (document.getElementById("FB_overlay") === null) {
				$("body").append("<div id='FB_overlay'></div><div id='FB_window'></div>");
				$("#FB_overlay").click(fb_remove);
			}
		};
		if (fb_detectMacXFF()) {
			$("#FB_overlay").addClass("FB_overlayMacFFBGHack");
		} else {
			$("#FB_overlay").addClass("FB_overlayBG");
		};
		if (caption === null) {
			caption = "";
		};
		$("body").append("<div id='FB_load'><img src='" + imgLoader.src + "' /></div>");
		$('#FB_load').show();
		var baseURL;
		if (url.indexOf("?") !== -1) {
			baseURL = url.substr(0, url.indexOf("?"));
		} else {
			baseURL = url;
		};
		var urlString = /\.jpg$|\.jpeg$|\.png$|\.gif$|\.bmp$/;
		var urlType = baseURL.toLowerCase().match(urlString);
		//处理图片类型的url
		if (urlType == '.jpg' || urlType == '.jpeg' || urlType == '.png' || urlType == '.gif' || urlType == '.bmp') {
			
			FB_PrevCaption = "";
			FB_PrevURL = "";
			FB_PrevHTML = "";
			FB_PrevHTML1 = "";
			FB_NextCaption = "";
			FB_NextURL = "";
			FB_NextHTML = "";
			FB_NextHTML1 = "";
			FB_imageCount = "";
			FB_FoundURL = false;
			if (imageGroup) {
				FB_TempArray = $("a[rel=" + imageGroup + "]").get();
				for (FB_Counter = 0; ((FB_Counter < FB_TempArray.length) && (FB_NextHTML === "")); FB_Counter++) {
					var urlTypeTemp = FB_TempArray[FB_Counter].href.toLowerCase().match(urlString);
					if (!(FB_TempArray[FB_Counter].href == url)) {
						if (FB_FoundURL) {
							FB_NextCaption = FB_TempArray[FB_Counter].title;
							FB_NextURL = FB_TempArray[FB_Counter].href;
							FB_NextHTML = "<span id='FB_next'>&nbsp;&nbsp;<a href='#'>\u4E0B\u4E00\u5F20 &gt;</a></span>";
							FB_NextHTML1 = '<a href="#" id="nextLink" title="\u4E0B\u4E00\u5F20"></a>';
						} else {
							FB_PrevCaption = FB_TempArray[FB_Counter].title;
							FB_PrevURL = FB_TempArray[FB_Counter].href;
							FB_PrevHTML = "<span id='FB_prev'>&nbsp;&nbsp;<a href='#'>&lt; \u4E0A\u4E00\u5F20</a></span>";
							FB_PrevHTML1 = '<a href="#" title="\u4E0A\u4E00\u5F20" id="prevLink"></a>';
						}
					} else {
						FB_FoundURL = true;
						FB_imageCount = "\u56FE\u7247 " + (FB_Counter + 1) + " / " + (FB_TempArray.length);
					}
				}
			};
			imgPreloader = new Image();
			imgPreloader.onload = function () {
				imgPreloader.onload = null;
				var pagesize = fb_getPageSize();
				var x = pagesize[0] - 150;
				var y = pagesize[1] - 150;
				var imageWidth = imgPreloader.width;
				var imageHeight = imgPreloader.height;
				if (imageWidth > x) {
					imageHeight = imageHeight;
					imageWidth = x;
					if (imageHeight > y) {
						imageWidth = imageWidth;
						imageHeight = y;
					}
				} else if (imageHeight > y) {
					imageWidth = imageWidth;
					imageHeight = y;
					if (imageWidth > x) {
						imageHeight = imageHeight;
						imageWidth = x;
					}
				};
				FB_WIDTH = imageWidth + 30;
				FB_HEIGHT = imageHeight + 60;
				$("#FB_window").append("<img  onDblClick='fb_remove()' id='FB_Image' src='" + url + "' alt='" + caption + "'/><div id='hoverNav'>" + FB_PrevHTML1 + FB_NextHTML1 + "</div><div id='FB_caption'>" + caption + "<div id='FB_secondLine'>" + FB_imageCount + FB_PrevHTML + FB_NextHTML + "</div></div><div id='FB_closeWindow'><a href='#' id='FB_closeWindowButton1' style='display:none;' style='display:none;' title='\u5173\u95ED\u6216\u6309\u952E\u76D8\u9000\u51FA\u952E'>\u5173\u95ED</a></div>");
				$("#FB_closeWindowButton").click(fb_remove);
				if (!(FB_PrevHTML === "")) {
					function goPrev() {
						if ($(document).unbind("click", goPrev)) {
							$(document).unbind("click", goPrev);
						};
						$("#FB_window").remove();
						$("body").append("<div id='FB_window'></div>");
						fb_show(FB_PrevCaption, FB_PrevURL, imageGroup);
						return false;
					};
					$('#prevLink').height(imageHeight);
					$("#FB_prev").click(goPrev);
					$("#prevLink").click(goPrev);
				};
				if (!(FB_NextHTML === "")) {
					function goNext() {
						$("#FB_window").remove();
						$("body").append("<div id='FB_window'></div>");
						fb_show(FB_NextCaption, FB_NextURL, imageGroup);
						return false;
					};
					$("#FB_next").click(goNext);
					$('#nextLink').height(imageHeight);
					$("#nextLink").click(goNext);
				};
				document.onkeydown = function (e) {
					if (e == null) {
						keycode = event.keyCode;
					} else {
						keycode = e.which;
					};
					if (keycode == 39) {
						if (!(FB_NextHTML === "")) {
							document.onkeydown = "";
							goNext();
						}
					} else if (keycode == 37) {
						if (!(FB_PrevHTML === "")) {
							document.onkeydown = "";
							goPrev();
						}
					}
				};
				fb_position();
				$("#FB_load").remove();
				$("#FB_ImageOff").click(fb_remove);
				$("#FB_window").css({
					display : "block"
				});
			};
			imgPreloader.src = url;
			
			$("#FB_window").fdrag(true);
		} else {
			//非图片类型的url
			var queryString = url.replace(/^[^\?]+\??/, '');
			var params = fb_parseQuery(queryString);
			var fwidth = params['width'];
			var fheight = params['height'];
			if (fwidth <= 1) {
				fwidth = $("body").width() * fwidth;
			};
			if (fheight <= 1) {
				fheight = document.documentElement.clientHeight * fheight;
			};
			FB_WIDTH = (fwidth * 1) + 30 || 630;
			FB_HEIGHT = (fheight * 1) + 40 || 440;
			ajaxContentW = FB_WIDTH - 30;
			ajaxContentH = FB_HEIGHT - 45;
			if (url.indexOf('FB_iframe') != -1) {
				urlNoQuery = url.split('FB_');
				$("#FB_iframeContent").remove();
				if (params['modal'] != "true") {
					$("#FB_window").append("<div id='FB_title'><div id='FB_ajaxWindowTitle'>" + caption + "</div><div id='FB_closeAjaxWindow'><a href='#' id='FB_closeWindowButton1' style='display:none;' title='\u5173\u95ED\u6216\u6309\u952E\u76D8\u9000\u51FA\u952E'>\u5173\u95ED</a></div></div><iframe frameborder='0' hspace='0' src='" + urlNoQuery[0] + "' id='FB_iframeContent' name='FB_iframeContent" + Math.round(Math.random() * 1000) + "' onload='fb_showIframe()' style='width:" + (ajaxContentW + 24) + "px;height:" + (ajaxContentH + 15) + "px;' > </iframe>");
				} else {
					$("#FB_overlay").unbind();
					$("#FB_window").append("<iframe frameborder='0' hspace='0' src='" + urlNoQuery[0] + "' id='FB_iframeContent' name='FB_iframeContent" + Math.round(Math.random() * 1000) + "' onload='fb_showIframe()' style='width:" + (ajaxContentW + 24) + "px;height:" + (ajaxContentH + 15) + "px;'> </iframe>");
				}
			} else {
				if ($("#FB_window").css("display") != "block") {
					if (params['modal'] != "true") {
						$("#FB_window").append("<div id='FB_title'><div id='FB_ajaxWindowTitle'>" + caption + "</div><div id='FB_closeAjaxWindow'><a href='#' id='FB_closeWindowButton1' style='display:none' title='\u5173\u95ED\u6216\u6309\u952E\u76D8\u9000\u51FA\u952E'>\u5173\u95ED</a></div></div><div id='FB_ajaxContent' style='width:" + ajaxContentW + "px;height:" + ajaxContentH + "px'></div>");
					} else {
						$("#FB_overlay").unbind();
						$("#FB_window").append("<div id='FB_ajaxContent' class='FB_modal' style='width:" + ajaxContentW + "px;height:" + ajaxContentH + "px;'></div>");
					}
				} else {
					$("#FB_ajaxContent")[0].style.width = ajaxContentW + "px";
					$("#FB_ajaxContent")[0].style.height = ajaxContentH + "px";
					$("#FB_ajaxContent")[0].scrollTop = 0;
					$("#FB_ajaxWindowTitle").html(caption);
				}
			};
			$("#FB_closeWindowButton").click(fb_remove);
			if (url.indexOf('FB_inline') != -1) {
				$("#FB_ajaxContent").append($('#' + params['inlineId']).children());
				$("#FB_window").unload(function () {
					$('#' + params['inlineId']).append($("#FB_ajaxContent").children());
				});
				fb_position();
				$("#FB_load").remove();
				$("#FB_window").css({
					display : "block"
				});
			} else if (url.indexOf('FB_iframe') != -1) {
				fb_position();
				if($.browser  != undefined){
					if ($.browser.safari) {
						$("#FB_load").remove();
						$("#FB_window").css({
							display : "block"
						});
					}
				}
			} else {
				$("#FB_ajaxContent").load(url += "&random=" + (new Date().getTime()), function () {
					fb_position();
					$("#FB_load").remove();
					fb_init("#FB_ajaxContent a.firstebox");
					$("#FB_window").css({
						display : "block"
					});
				});
			};
			
			$("#FB_window").fdrag(true);
		};
		if (!params['modal']) {
			$("#FB_window").setHandler('FB_title');
			document.onkeyup = function (e) {
				if (e == null) {
					keycode = event.keyCode;
				} else {
					keycode = e.which;
				};
				if (keycode == 27) {
					fb_remove();
				}
			};
		}
	} catch (e) {}

};
function fb_showIframe() {
	$("#FB_load").remove();
	$("#FB_window").css({
		display : "block"
	});
};
function fb_remove() {
	$("#FB_imageOff").unbind("click");
	$("#FB_closeWindowButton").unbind("click");
	$("#FB_window").fadeOut("fast", function () {
		$('#FB_window,#FB_overlay,#FB_HideSelect').trigger("unload").unbind().remove();
	});
	$("#FB_load").remove();
	if (typeof document.body.style.maxHeight == "undefined") {
		$("body", "html").css({
			height : "auto",
			width : "auto"
		});
		$("html").css("overflow", "");
	};
	document.onkeydown = "";
	document.onkeyup = "";
	return false;
};
function fb_position() {
	$("#FB_window").css({
		width : FB_WIDTH + 'px'
	});
	$("#FB_window").fPosition({
		vpos : "middle",
		hpos : "center",
		fw : FB_WIDTH,
		fh : FB_HEIGHT
	});
};
function fb_parseQuery(query) {
	var Params = {};
	if (!query) {
		return Params;
	};
	var Pairs = query.split(/[;&]/);
	for (var i = 0; i < Pairs.length; i++) {
		var KeyVal = Pairs[i].split('=');
		if (!KeyVal || KeyVal.length != 2) {
			continue;
		};
		var key = unescape(KeyVal[0]);
		var val = unescape(KeyVal[1]);
		val = val.replace(/\+/g, ' ');
		Params[key] = val;
	};
	return Params;
};
function fb_getPageSize() {
	var de = document.documentElement;
	var w = window.innerWidth || self.innerWidth || (de && de.clientWidth) || document.body.clientWidth;
	var h = window.innerHeight || self.innerHeight || (de && de.clientHeight) || document.body.clientHeight;
	arrayPageSize = [w, h];
	return arrayPageSize;
};
function fb_detectMacXFF() {
	var userAgent = navigator.userAgent.toLowerCase();
	if (userAgent.indexOf('mac') != -1 && userAgent.indexOf('firefox') != -1) {
		return true;
	}
};
(function ($) {
	$.fn.fPosition = function (options) {
	
		var defaults = {
			vpos : null,
			hpos : null
		};
	
		var top;
		var left;
		var options = $.extend(defaults, options);
		return this.each(function (index) {
			var $this = $(this);
			$this.css("position", "absolute");
			if(jQuery.browser != undefined){
				if (jQuery.browser.opera) {
					ftop = ((parseInt(window.innerHeight) / 2) - (options.fh / 2));
					$this.css("top", ($(document).scrollTop() + (parseInt(window.innerHeight) / 2) - (options.fh / 2)) + "px");
				} else {
					ftop = ((parseInt($(window).height()) / 2) - (options.fh / 2));
					$this.css("top", ($(document).scrollTop() + (parseInt($(window).height()) / 2) - (options.fh / 2)) + "px");
				}
			}else{
				ftop = ((parseInt($(window).height()) / 2) - (options.fh / 2));
				$this.css("top", ($(document).scrollTop() + (parseInt($(window).height()) / 2) - (options.fh / 2)) + "px");
			};
			
			$this.css("left", ((parseInt($(window).width()) / 2) - (options.fw / 2)+$(document).scrollLeft()) + "px");
			fleft = ((parseInt($(window).width()) / 2) - (options.fw / 2));
		});
	};
	var isMouseDown = false;
	var currentElement = null;
	var dropCallbacks = {};
	var dragCallbacks = {};
	var bubblings = {};
	var lastMouseX;
	var lastMouseY;
	var lastElemTop;
	var lastElemLeft;
	var dragStatus = {};
	var holdingHandler = false;
	$.getMousePosition = function (e) {
		var posx = 0;
		var posy = 0;
		if (!e)
			var e = window.event;
		if (e.pageX || e.pageY) {
			posx = e.pageX;
			posy = e.pageY;
		} else if (e.clientX || e.clientY) {
			posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		};
		return {
			'x' : posx,
			'y' : posy
		};
	};
	$.updatePosition = function (e) {
		
		var pos = $.getMousePosition(e);
		var spanX = (pos.x - lastMouseX);
		var spanY = (pos.y - lastMouseY);
		$(currentElement).css("top", (lastElemTop + spanY));
		$(currentElement).css("left", (lastElemLeft + spanX));
		fleft = lastElemLeft + spanX;
		fftop = spanY;
	};
	$(document).mousemove(function (e) {
		if (isMouseDown && dragStatus[currentElement.id] != 'false') {
			$.updatePosition(e);
			if (dragCallbacks[currentElement.id] != undefined) {
				dragCallbacks[currentElement.id](e, currentElement);
			};
			return false;
		}
	});
	$(document).mouseup(function (e) {
		if (isMouseDown && dragStatus[currentElement.id] != 'false') {
			isMouseDown = false;
			if (dropCallbacks[currentElement.id] != undefined) {
				dropCallbacks[currentElement.id](e, currentElement);
			};
			return false;
		}
	});
	$.fn.ondrag = function (callback) {
		return this.each(function () {
			dragCallbacks[this.id] = callback;
		});
	};
	$.fn.ondrop = function (callback) {
		return this.each(function () {
			dropCallbacks[this.id] = callback;
		});
	};
	$.fn.dragOff = function () {
		return this.each(function () {
			dragStatus[this.id] = 'off';
		});
	};
	$.fn.dragOn = function () {
		return this.each(function () {
			dragStatus[this.id] = 'on';
		});
	};
	$.fn.setHandler = function (handlerId) {
		return this.each(function () {
			var draggable = this;
			bubblings[this.id] = true;
			$(draggable).css("cursor", "");
			dragStatus[draggable.id] = "handler";
			$("#" + handlerId).css("cursor", "move");
			$("#" + handlerId).mousedown(function (e) {
				holdingHandler = true;
				$(draggable).trigger('mousedown', e);
			});
			$("#" + handlerId).mouseup(function (e) {
				holdingHandler = false;
			});
		});
	};
	$.fn.fdrag = function (allowBubbling) {
		
		return this.each(function () {
			if (undefined == this.id || !this.id.length)
				this.id = "easydrag" + (new Date().getTime());
			bubblings[this.id] = allowBubbling ? true : false;
			dragStatus[this.id] = "on";
			$(this).css("cursor", "move");
			$(this).mousedown(function (e) {
				if ((dragStatus[this.id] == "off") || (dragStatus[this.id] == "handler" && !holdingHandler))
					return bubblings[this.id];
				$(this).css("position", "absolute");
				$(this).css("z-index", parseInt(new Date().getTime() / 1000));
				isMouseDown = true;
				currentElement = this;
				var pos = $.getMousePosition(e);
				lastMouseX = pos.x;
				lastMouseY = pos.y;
				lastElemTop = this.offsetTop;
				lastElemLeft = this.offsetLeft;
				$.updatePosition(e);
				return bubblings[this.id];
			});
		});
	};
})(jQuery);
$(window).scroll(function () {

	if (ftop2 != fftop) {
		ftop1 = ftop1 + fftop;
		ftop2 = fftop;
	};
	$("#FB_window").css("top", (ftop + ftop1 + $(document).scrollTop()) + "px").css("left", (fleft + $(document).scrollLeft()) + "px");
});
