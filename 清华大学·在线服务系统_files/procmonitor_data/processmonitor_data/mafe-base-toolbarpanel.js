/*形状栏渲染，by siqq*/
var ToolbarPanel = function (options) {
	this.tooltip = null;
    ToolbarPanel.prototype.init.call(this, options);
};

ToolbarPanel.prototype = new PMUI.core.Panel();
ToolbarPanel.prototype.type = "ToolbarPanel";

ToolbarPanel.prototype.init = function (options) {
    var defaults = {
        buttons: [],
        tooltip: "",
        width: "100%"
    };
    jQuery.extend(true, defaults, options);
    PMUI.core.Panel.call(this, defaults);
    this.buttons = [];
    this.setTooltip(defaults.tooltip);
    this.setButtons(defaults.buttons);
};
ToolbarPanel.prototype.setTooltip = function (message) {
    if (typeof message === "string") {
        this.tooltip = message;
    }

    return this;
};

ToolbarPanel.prototype.setButtons = function (buttons) {
    var that = this; 
    jQuery.each(buttons, function(index, button){
        that.buttons.push(button);
    });
    return this;
};
ToolbarPanel.prototype.createHTMLButton = function (button) {
    var i,a,
        li = PMUI.createHTMLElement('li'),
//        a = PMUI.createHTMLElement('span');
    	span = PMUI.createHTMLElement('span');
    if(patternFlag=='Monitor')
    	a = PMUI.createHTMLElement('a');
    else
    	a = PMUI.createHTMLElement('span');
    li.id = button.selector;
    li.className = "mafe-toolbarpanel-btn";
    
    span.className = "bpm-panel-title";
    jQuery(span).text(button.tooltip);
   // a.title = button.tooltip;
   // a.style.cursor = "move";
    jQuery(a).tooltip({tooltipClass: "mafe-action-tooltip"});
//    jQuery(a).tooltip({ content: button.tooltip,
//                        tooltipClass: "mafe-action-tooltip",
//                        position: {
//                            my: "left top", at: "left bottom", collision: "flipfit"
//                        }
//                     });

    for (i = 0; i < button.className.length; i+=1) {
        jQuery(a).addClass(button.className[i]);
    }
    
    li.appendChild(a);
    if(patternFlag!="Monitor"){//监控的时候不加文字
    	li.appendChild(span);
    }
    return li;
};

ToolbarPanel.prototype.createHTML = function () {
	var that = this, ul;
    PMUI.core.Panel.prototype.setElementTag.call(this, "ul");
    PMUI.core.Panel.prototype.createHTML.call(this);
    this.html.style.overflow = "visible";
	jQuery.each(this.buttons, function(i, button){
		var html = that.createHTMLButton(button);
        that.html.appendChild(html);
		button.html = html;
	});
	return this.html;
};

ToolbarPanel.prototype.activate = function () {
    var that = this;
    jQuery.each(this.buttons, function(i, b) {
//为每个panel上的button增加拖拽逻辑  by siqq
		var bHtml=b.html;
        jQuery(b.html).draggable({ 
            opacity: 0.7,
            helper: "clone",
            cursor: "hand"
        });
    });
    return this;
};
ToolbarPanel.prototype.getSelectors = function () {
    var selectors = [], that = this;
    jQuery.each(this.buttons, function(i, button){
        selectors.push ('#' + button.selector);
    });
    return selectors;
};

