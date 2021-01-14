
/**
 * Return an incremental name based of the type of the shape
 * @param {Object} pmCanvas The current canvas
 */
var IncrementNameCanvas = function (pmCanvas) {
    var random,
        elementsName = {
            TASK: RIA_I18N.designer.elementsName.task,
            AUTO_TASK:RIA_I18N.designer.elementsName.autoTask,
            SUB_PROCESS: RIA_I18N.designer.elementsName.subProcess,
            TEXT_ANNOTATION: RIA_I18N.designer.elementsName.annotation,
            POOL: RIA_I18N.designer.elementsName.pool,
            LANE: RIA_I18N.designer.elementsName.lane,
            CONCURRENT:RIA_I18N.designer.elementsName.parallel
        },
        random = false;
    return {
        id: Math.random(),
        get: function (type) {
            var i,
                j,
                k = pmCanvas.getCustomShapes().getSize(),
                exists,
                index = 1;
            for (i = 0; i < k; i += 1) {
                exists = false;
                for (j = 0; j < k; j += 1) {
                    if (pmCanvas.getCustomShapes().get(j).getName() === elementsName[type] + " " + (i + 1)) {
                        exists = true;
                        break;
                    }
                }
                if (!exists) {
                    break;
                }
            }
            return elementsName[type] + " " + (i + 1);
        }
    };
};

var autoResizeScreen = function () {
    var myWidth = 0, myHeight = 0;
    if (typeof(window.innerWidth) === 'number') {
        //No-IE
        myWidth = window.innerWidth;
        myHeight = window.innerHeight;
    } else if (document.documentElement &&
            (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
        //IE 6+
        myWidth = document.documentElement.clientWidth;
        myHeight = document.documentElement.clientHeight;
    } else if (document.body &&
            (document.body.clientWidth || document.body.clientHeight)) {
        //IE 4 compatible
        myWidth = document.body.clientWidth;
        myHeight = document.body.clientHeight;
    }
    return myWidth;
};

var showUID = function (id) {
    var messageWindow = new PMUI.ui.MessageWindow({
        width: 490,
        bodyHeight: 'auto',
        id: 'showMessageWindowUID',
        windowMessageType: 'info',
        message: id,
        footerItems: [
            {
                text: 'Ok',
                handler: function ()
                {
                    messageWindow.close();
                },
				buttonType : "success"
            }
        ]
    });
    messageWindow.setTitle("ID");
    messageWindow.open();
    messageWindow.showFooter();
    $(messageWindow.dom.icon).removeClass();
};
//
//var applyStyleWindowForm = function (win) {
//    $(win.body).removeClass("pmui-background");
//    win.footer.html.style.textAlign = 'right';
//    (function searchForm (items) {
//        var i;
//        for (i = 0; i < items.length; i += 1) {
//            if (items[i].footer && items[i].footer.setVisible) {
//                $(win.body).addClass("pmui-background");
//                items[i].footer.setVisible(false);
//            }
//            searchForm(items[i].getItems ? items[i].getItems() :
//                    (items[i].getPanel ? items[i].getPanel().getItems() : []));
//        }
//    }(win.getItems()));
//};
//
//var QuickMessageWindow = function (html, message) {
//    if (html === undefined) {
//        return;
//    }
//    QuickMessageWindow.prototype.show.call(this, html, message);
//};
//QuickMessageWindow.prototype.show = function (html, message) {
//    var that = this;
//    var factorX = 25;
//    var factorY = 20;
//    if ($('#tooltipmessagecustom')[0]) {
//        $('#tooltipmessagecustom').css({
//            'top': $(html).offset().top + factorY,
//            'left': $(html).offset().left + factorX
//        });
//        $('#tooltipmessagecustombody').html(message);
//    } else {
//        var button = $('<div id="header"></div>')
//				.append($("<a style='font-size: 14px'></a>")
//                .html('X')
//                .on('click', function () {
//            $('#tooltipmessagecustom').remove();
//        }));
//        $('body').append($('<div></div>')
//                .append(button)
//                .append($('<div></div>')
//                .attr('id', 'tooltipmessagecustombody')
//                .css({'float': 'left'})
//                .html(message))
//                .addClass('pmui pmui-pmtooltipmessage')
//                .attr('id', 'tooltipmessagecustom')
//                .css({
//            'box-sizing': 'border-box', 'position': 'absolute',
//            'z-index': '100', 'font-size': '10',
//            'top': $(html).offset().top + factorY,
//            'left': $(html).offset().left + factorX
//        })).on('mousedown', function (evt) {
//            that.closeEvent(evt);
//        }).on('click', function (evt) {
//            that.closeEvent(evt);
//        }).on('mouseup', function (evt) {
//            that.closeEvent(evt);
//        });
//        $(window).scroll(function () {
//            that.close();
//        });
//    }
//};
//QuickMessageWindow.prototype.close = function () {
//    $('#tooltipmessagecustom').remove();
//};
//QuickMessageWindow.prototype.closeEvent = function (evt) {
//    var element = evt.target || evt.srcElement;
//    if ($('#tooltipmessagecustom')[0] && element !== $('#tooltipmessagecustom')[0] && element !== $('#tooltipmessagecustom')[0].children[1]) {
//        $('#tooltipmessagecustom').remove();
//    }
//};
//
//var messagePageGrid = function (currentPage, pageSize, numberItems, criteria, filter) {
//    if (numberItems === 0) {
//        return '';
//    }
//    var msg = 'Page' + ' ' + (currentPage + 1) + ' ' + 'of' + ' ' + Math.ceil(numberItems / pageSize);
//    return msg;
//};
//
/*
 * Function: validateKeysField
 * valid characteres for file name:
 * http://support.microsoft.com/kb/177506/es
 * 
 * (A-z)letter
 * (0-9)number
 *  ^   Accent circumflex (caret)
 *  &   Ampersand
 *  '   Apostrophe (single quotation mark)
 *  @   At sign
 *  {   Brace left
 *  }   Brace right
 *  [   Bracket opening
 *  ]   Bracket closing
 *  ,   Comma
 *  $   Dollar sign
 *  =   Equal sign
 *  !   Exclamation point
 *  -   Hyphen
 *  #   Number sign
 *  (   Parenthesis opening
 *  )   Parenthesis closing
 *  %   Percent
 *  .   Period
 *  +   Plus
 *  ~   Tilde
 *  _   Underscore
 *  
 *  Example: only backspace, number and letter.
 *  validateKeysField(objectHtmlInput, ['isbackspace', 'isnumber', 'isletter']);
 *  
 *  Aditional support:
 *  :   Colon
 *  
 */
//var validateKeysField = function (object, validates) {
//    object.onkeypress = function (e) {
//        var key = document.all ? e.keyCode : e.which;
//        if (key === 0)
//            return true;
//        var isbackspace = key === 8;
//        var isnumber = key > 47 && key < 58;
//        var isletter = (key > 96 && key < 123) || (key > 64 && key < 91);
//        var isaccentcircumflex = key === 94;
//        var isampersand = key === 41;
//        var isapostrophe = key === 145;
//        var isatsign = key === 64;
//        var isbraceleft = key === 123;
//        var isbraceright = key === 125;
//        var isbracketopening = key === 91;
//        var isbracketclosing = key === 93;
//        var iscomma = key === 130;
//        var isdollarsign = key === 36;
//        var isequalsign = key === 61;
//        var isexclamationpoint = key === 33;
//        var ishyphen = key === 45;
//        var isnumbersign = key === 35;
//        var isparenthesisopening = key === 40;
//        var isparenthesisclosing = key === 41;
//        var ispercent = key === 37;
//        var isperiod = key === 46;
//        var isplus = key === 43;
//        var istilde = key === 126;
//        var isunderscore = key === 95;
//        var iscolon = key === 58;
//
//        var sw = eval(validates[0]);
//        for (var i = 1; i < validates.length; i++) {
//            sw = sw || eval(validates[i]);
//        }
//        return sw;
//    };
//};

//var applyStyleTreePanel = function (treePanel, fontStyle) {
//    if (fontStyle !== false) {
//        $(treePanel.getHTML()).find('a').css('font-weight', 'bold');
//        $(treePanel.getHTML()).find('a').css('color', 'black');
//        $(treePanel.getHTML()).find('ul li ul li>a').css('font-weight', 'normal');
//        $(treePanel.getHTML()).find('ul li ul li>a').css('color', 'black');
//    }
//};

/*
 * Convert time format HH:MM:SS to decimal value.
 */
//var timeToDecimal = function (value) {
//    var s = value.toString().replace(/\s/g, '').split(':');
//    var hour = parseInt(s[0]) || 0;
//    var min = parseInt(s[1]) || 1;
//    var sec = parseInt(s[2]) || 1;
//    return (hour + min / 60 + sec / 3600);
//};

/*
 * Convert decimal to time format HH:MM:SS.
 */
//var decimalToTime = function (value, second) {
//    var num = typeof value === 'number' ? value : 1;
//
//    var hour = parseInt(num);
//    num = num - parseInt(num);
//    num = num.toFixed(13);
//    num = num * 60;
//
//    var min = parseInt(num);
//    num = num - parseInt(num);
//    num = num.toFixed(13);
//    num = num * 60;
//
//    var sec = parseInt(num);
//
//    hour = hour.toString().length === 1 ? '0' + hour : hour;
//    min = min.toString().length === 1 ? '0' + min : min;
//    sec = sec.toString().length === 1 ? '0' + sec : sec;
//
//    return second === true ? hour + ':' + min + ':' + sec : hour + ':' + min;
//};

/**
 * 
 * @type type
 */var Mafe = {};

/**
 * 
 * @param {type} settings
 * @returns {undefined}
 */
Mafe.Window = function (settings) {
    this.views = [];
    PMUI.ui.Window.call(this, settings);
    Mafe.Window.prototype.init.call(this, settings);
};
Mafe.Window.prototype = new PMUI.ui.Window();
Mafe.Window.prototype.init = function (settings) {
    this.setHeight(DEFAULT_WINDOW_HEIGHT);
    this.setWidth(DEFAULT_WINDOW_WIDTH);
    this.hideFooter();
    this.setButtonPanelPosition('bottom');
};
Mafe.Window.prototype.createHTML = function () {
    PMUI.ui.Window.prototype.createHTML.call(this);
//    applyStyleWindowForm(this);
    this.footer.html.style.textAlign = 'right';
    return this.html;
};
Mafe.Window.prototype.resetView = function () {
    this.hideFooter();
    var items = this.items.asArray();
    for (var i = 0; i < items.length; i++) {
        if (items[i].setVisible) {
            items[i].setVisible(false);
        }
        if (items[i].reset) {
            items[i].reset();
        }
    }
};
Mafe.Window.prototype.setButtons = function (buttons) {
    this.clearFooterItems();
    this.setFooterItems(buttons);
    this.showFooter();
};


/**
 * 
 * @returns {undefined}
 */
Mafe.ConfirmDeletion = function () {
    var that = this;
    that.onDelete = new Function();
    that.onCancel = new Function();
    var defaults = {
        id: 'idConfirmDeletion',
        width: 490,
        bodyHeight: 'auto',
        windowMessageType: 'warning',
        message: 'Do you want to delete this Element?',
        footerItems: [{
                id: 'idCancelConfirmDeletion',
                text: 'No',
                visible: true,
                handler: function () {
                    that.onCancel();
                    that.close();
                },
				buttonType : "error"
            },{
                id: 'idDeleteConfirmDeletion',
                text: 'Yes',
                visible: true,
                handler: function () {
                    that.onDelete();
                    that.close();
                },
				buttonType : "success"
            }
        ]
    };
    PMUI.ui.MessageWindow.call(this, defaults);
    Mafe.ConfirmDeletion.prototype.init.call(this);
};
Mafe.ConfirmDeletion.prototype = new PMUI.ui.MessageWindow();
Mafe.ConfirmDeletion.prototype.init = function () {
    this.open();
    this.showFooter();
};

/**
 * 
 * @returns {undefined}
 */
Mafe.ConfirmCancellation = function (options) {
    var that = this;
    that.onYes = new Function();
    that.onNo = new Function();
    var defaults = {
        id: 'idConfirmCancellation',
        title: options["title"] || 'Confirm',
        width: 490,
        bodyHeight: 'auto',
        windowMessageType: 'warning',
        message: 'Are you sure you want to discard your changes?',
        footerItems: [ 
			{
                id: 'idCancelConfirmCancellation',
                text: 'No',
                visible: true,
                handler: function () {
                    that.onNo();
                    that.close();
				},
				buttonType : "error"
            },{
                id: 'idDeleteConfirmCancellation',
                text: 'Yes',
                visible: true,
                handler: function () {
                    that.onYes();
                    that.close();
                },
				buttonType : "success"
            }
        ]
    };
    PMUI.ui.MessageWindow.call(this, defaults);
    Mafe.ConfirmCancellation.prototype.init.call(this);
};
Mafe.ConfirmCancellation.prototype = new PMUI.ui.MessageWindow();
Mafe.ConfirmCancellation.prototype.init = function () {
    this.open();
    this.showFooter();
};

'use strict';

/**
 * Failsafe remove an element from a collection
 *
 * @param  {Array<Object>} [collection]
 * @param  {Object} [element]
 *
 * @return {Object} the element that got removed or undefined
 */
var CollectionRemove = function(collection, element) {

    if (!collection || !element) {
        return;
    }

    var idx = collection.indexOf(element);
    if (idx === -1) {
        return;
    }

    collection.splice(idx, 1);

    return element;
};

function setEncoded(link, name, data) {
    var encodedData = encodeURIComponent(data);

    if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(new Blob([data],{type: "application/octet-stream"}), name);

    } else {
        if (data) {
            link.addClass('active').attr({
                'href': 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData,
                'download': name
            });
        } else {
            link.removeClass('active');
        }
    }

}

/**
 * FullScreen class
 */
var FullScreen = function(options) {
    this.element = null;
    this.onReadyScreen = null;
    this.onCancelScreen = null;
    this.fullscreemed = false;
    this.fireEvent = false;
    FullScreen.prototype.init.call(this, options);
};
/**
 * [init description]
 * @param  {Object} options Config options
 */
FullScreen.prototype.init = function(options) {
    var defaults = {
        element: document.documentElement,
        onReadyScreen: function(){},
        onCancelScreen: function(){}
    };
    jQuery.extend(true, defaults, options);
    this.element = defaults.element;
    this.action = defaults.action;

    this.onReadyScreen = defaults.onReadyScreen;
    this.onCancelScreen = defaults.onCancelScreen;
    this.attachListeners();
};
FullScreen.prototype.cancel = function () {
    var requestMethod,fnCancelScreen, wscript, el;
    if (parent.document.documentElement === document.documentElement) {
        el = document;
    } else {
        el = parent.document;
    }
    requestMethod = el.cancelFullScreen || 
                    el.webkitCancelFullScreen || 
                    el.mozCancelFullScreen || 
                    el.exitFullscreen;
    if (requestMethod) {
        requestMethod.call(el);
        try {
            fnCancelScreen = this.onCancelScreen;
            fnCancelScreen(el);
        } catch (e) {
            throw new Error(e);
        }
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
};

FullScreen.prototype.applyZoom = function () {
    var requestMethod, wscript, fnReadyScreen, el = this.element;
    requestMethod = el.requestFullScreen || 
                    el.webkitRequestFullScreen || 
                    el.mozRequestFullScreen || 
                    el.msRequestFullScreen;

    if (requestMethod) {
        requestMethod.call(el); 
        try {
            fnReadyScreen = this.onReadyScreen;
            fnReadyScreen(el);
        } catch (e) {
            throw new Error(e);
        }
    } else if (typeof window.ActiveXObject !== "undefined") {
        wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
    return false
};
FullScreen.prototype.toggle = function (action) {
    var el, isInFullScreen;
    if (parent.document.documentElement === document.documentElement) {
        el = document;
    } else {
        el = parent.document;
    }

    isInFullScreen = (el.fullScreenElement && el.fullScreenElement !== null) ||  (el.mozFullScreen || el.webkitIsFullScreen);
    if (isInFullScreen) {
        this.action.setTooltip('Full Screen');
        this.cancel();
    } else {

        this.applyZoom();
        this.fullscreemed = true;
        this.action.setTooltip('Exit full screen');
    }
    return false;
};
FullScreen.prototype.attachListeners = function () {
	
    var el, self = this;
    if (parent.document.documentElement === document.documentElement) {
        el = document;
    } else {
        el = parent.document;
    }
    if(isIE8()){
    	el.attachEvent("fullscreenchange", function () {
            self.fireFullScreen();
        }, false);

        el.attachEvent("mozfullscreenchange", function () {
            self.fireFullScreen();
        }, false);

        el.attachEvent("webkitfullscreenchange", function (e, a) {
            self.fireFullScreen();
        }, false);

        el.attachEvent("msfullscreenchange", function () {
            self.fireFullScreen();
        }, false);
    }else{
    	el.addEventListener("fullscreenchange", function () {
            self.fireFullScreen();
        }, false);

        el.addEventListener("mozfullscreenchange", function () {
            self.fireFullScreen();
        }, false);

        el.addEventListener("webkitfullscreenchange", function (e, a) {
            self.fireFullScreen();
        }, false);

        el.addEventListener("msfullscreenchange", function () {
            self.fireFullScreen();
        }, false);
    }
    
};

FullScreen.prototype.fireFullScreen = function () {
    if (this.fullscreemed && this.fireEvent) {
        this.action.setTooltip('Full Screen');
        $(this.action.selector).tooltip("close");
        this.fireEvent = false;
    } else {
        this.fireEvent = true;
    }
    return true;
};
//var PMIframe = function (settings) {
//	PMUI.core.Element.call(this, settings);
//
//    this.src = null;
//    this.name = null;
//    this.scrolling = null;
//    this.frameborder = null;
//    this.errorMessage = null;
//    this.data = null;
//
//    PMIframe.prototype.init.call(this, settings);
//};
//
//PMIframe.prototype = new PMUI.core.Element();
//
//PMIframe.prototype.type = "PMPMIframe";
//
//PMIframe.prototype.family = 'PMPMIframe';
//
//PMIframe.prototype.init = function (settings) {
//    var defaults = {
//    	src: "",
//    	name: "",
//        width:  770,
//        height: 305,
//        scrolling: 'no',
//        frameborder: "0"
//    };
//
//    jQuery.extend(true, defaults, settings);
//
//    this.setSrc(defaults.src)
//        .setName(defaults.name)
//        .setWidth(defaults.width)
//        .setHeight(defaults.height)
//        .setScrolling(defaults.scrolling)
//        .setFrameborder(defaults.frameborder);
//};
//
//PMIframe.prototype.setSrc = function (src){
//    this.src = src;
//    return this;
//};
//PMIframe.prototype.setName = function (name){
//    this.name = name;
//    return this;
//};
//PMIframe.prototype.setScrolling = function (scrolling){
//    this.scrolling = scrolling;
//    return this;
//};
//PMIframe.prototype.setFrameborder = function (frameborder){
//    this.frameborder = frameborder;
//    return this;
//};
//
//
//PMIframe.prototype.createHTML = function (){
//    var input;
//
//    if(this.html){
//        return this.html;
//    }
//
//    input = PMUI.createHTMLElement("iframe");
//    input.className = "PMIframeWin";
//    input.id = this.id;
//    input.name = "PMIframeWindow";
//    input.src = this.src;
//    input.frameBorder = this.frameborder;
//
//    this.html = input;
//    this.applyStyle();
//    return this.html;
//};

var PMTooltipMessage = function (options) {
    PMUI.ui.Window.call(this, options);
    this.container = null;
    this.message = options.message;   
    PMTooltipMessage.prototype.init.call(this, options);
};

PMTooltipMessage.prototype = new PMUI.ui.Window();
PMTooltipMessage.prototype.type = "PMTooltipMessage";



PMTooltipMessage.prototype.createHTML = function (){
        var containerCode;
    
        if(this.html){
            return this.html;
        }
        
        PMUI.ui.Window.prototype.createHTML.call(this);
        //this.setModal(false);
        //$(this.header).remove('#'+this.closeButton.id);
        //this.closeButton =null;
        this.closeButton.style.removeAllClasses();
        this.closeButton.setText("x");
        this.closeButton.style.addClasses(['mafe-tooltip-close']);
        this.header.appendChild(this.closeButton.getHTML());
        this.container = PMUI.createHTMLElement('div');
        this.container.innerHTML = this.message;
        this.body.appendChild(this.container);
        return this.html;
    };


PMTooltipMessage.prototype.open = function (x,y){
    PMUI.ui.Window.prototype.open.call(this);
    this.setVisible(false);
    this.setX(x);
    this.setY(y);    
    this.header.className = "mafe-tooltip-header";
    this.body.className = "mafe-tooltip-body";
    this.style.addClasses(['mafe-tooltip']);
    this.setTitle("");
    $("#"+this.id).show("drop","fast");
    this.closeButton.defineEvents();
};


PMTooltipMessage.prototype.setMessage = function (message){
    this.message = message;
    if(this.html)
        this.container.innerHTML = message; 
};
//
//var VariablePicker = function (options) {
//    this.relatedField = null;
//    this.processId = null;
//    this.workspace = null;
//    this.window = null;
//    this.currentVariable = null;
//    this.pageSize = 10;
//    VariablePicker.prototype.init.call(this, options);
//};
//
//VariablePicker.prototype.type = 'VariablePicker';
//
//VariablePicker.prototype.family = 'VariablePicker';
//
//VariablePicker.prototype.init = function (options) {
//    var defaults = {
//        relatedField: null,
//        processId: PMDesigner.project.projectId,
//        workspace: WORKSPACE
//    };
//
//    jQuery.extend(true, defaults, options);
//
//    this.setRelatedField(defaults.relatedField)
//            .setProcessId(defaults.processId)
//            .setWorkspace(defaults.workspace);
//};
//
//VariablePicker.prototype.setRelatedField = function (field) {
//    if (field instanceof PMUI.form.Field) {
//        this.relatedField = field;
//    }
//    return this;
//};
//
//VariablePicker.prototype.setProcessId = function (process) {
//    this.processId = process;
//    return this;
//};
//
//VariablePicker.prototype.setWorkspace = function (workspace) {
//    this.workspace = workspace;
//    return this;
//};
//
//VariablePicker.prototype.getURL = function () {
//    var url = '/api/1.0/' + this.workspace + '/project/' + this.processId + '/variables';
//    return url;
//};
//
//VariablePicker.prototype.open = function (callback) {
//    var w, rc, fieldC, dataGrid, panel, textField, that = this;
//
//    button = new PMUI.ui.Button({
//        id: 'insertVariable',
//        text: 'Insert Variable',
//        handler: function () {
//            if (callback && callback.success && typeof callback.success === 'function') {
//                that.currentVariable = fieldC.getValue() + that.currentVariable;
//                callback.success.call(that, that.currentVariable);
//            }
//            that.close();
//        },
//        disabled: true
//    });
//
//    textField = new PMUI.field.TextField({
//        id: 'textFieldSearch',
//        label: '',
//        placeholder: 'Text to Search'
//    });
//
//    w = new PMUI.ui.Window({
//        id: 'processVariables',
//        title: 'Process Variables',
//        width: 480,
//        height: 475,
//        closable: true,
//        modal: true,
//        buttons: [
//            button   
//        ],
//        buttonsPosition: 'center'
//    });
//
//    fieldC = new PMUI.field.DropDownListField({
//        id: 'prefixDropDownListField',
//        label: 'Prefix',
//        helper: '@@ string, @# float, @% integer, @? URL, @$ SQL query, @= original type.',
//        options: [
//            {
//                id: 'prefixDropDownListField1',
//                label: '@@',
//                value: '@@'
//            },
//            {
//                id: 'prefixDropDownListField2',
//                label: '@#',
//                value: '@#'
//            },
//            {
//                id: 'prefixDropDownListField3',
//                label: '@%',
//                value: '@%'
//            },
//            {
//                id: 'prefixDropDownListField4',
//                label: '@?',
//                value: '@?'
//            },
//            {
//                id: 'prefixDropDownListField5',
//                label: '@$',
//                value: '@$'
//            },
//            {
//                id: 'prefixDropDownListField6',
//                label: '@=',
//                value: '@='
//            }
//        ],
//        onChange: function (newValue, oldValue) {
//        }
//    });
//
//    textField = new PMUI.field.TextField({
//        id: 'textFieldSearch',
//        label: '',
//        placeholder: 'Text to search',
//        width: 150
//    });
//
//    dataGrid = new PMUI.grid.GridPanel({
//        id: 'gridPanel',
//        selectable: true,
//        pageSize: this.pageSize,
//        nextLabel: 'Next',
//        previousLabel: 'Previous',
//        customStatusBar: function (currentPage, pageSize, numberItems, criteria, filter) {
//            return messagePageGrid(currentPage, pageSize, numberItems, criteria, filter);
//        },
//        columns: [
//            {
//                id: 'gridPanelVariable',
//                title: 'Variable',
//                columnData: 'var_name',
//                width: 150,
//                sortable: true,
//                alignmentCell: 'left'
//            },
//            {
//                id: 'gridPanelLabel',
//                title: 'Type',
//                columnData: 'var_label',
//                width: 230,
//                sortable: false,
//                alignmentCell: 'left'
//            }
//        ],
//        onRowClick: function (row, data) {
//            button.enable();
//            that.currentVariable = data.var_name;
//        }
//
//    });
//
//
//    panelFilter = new PMUI.core.Panel({
//        id: 'panelFilter',
//        layout: 'hbox',
//        items: [fieldC, textField]
//    });
//
//    panel = new PMUI.core.Panel({
//        id: 'paneldataGrid',
//        layout: 'vbox',
//        items: [panelFilter, dataGrid]
//    });
//
//
//    rc = new PMRestClient({
//        //endpoint: 'variables',
//        typeRequest: 'get',
//        functionSuccess: function (xhr, response) {
//            that.window = w;
//            dataGrid.setDataItems(response);
//            w.open();
//            w.showFooter();
//            w.addItem(panel);
//            panelFilter.setWidth(430);
//            fieldC.setControlsWidth(70);
//            textField.controls[0].onKeyUp = function () {
//                dataGrid.filter(textField.controls[0].html.value);
//            };
//            dataGrid.dom.toolbar.style.display = 'none';
//            $(dataGrid.dom.footer).css("margin-top","0px");
//            $(dataGrid.dom.footer).css("position","static");
//            $(dataGrid.dom.footer).css("padding-left","10px");
//            $(dataGrid.dom.footer).css("padding-right","10px");
//                        
//            textField.dom.labelTextContainer.innerHTML = '';
//            textField.dom.labelTextContainer.style.marginTop = 5;
//            fieldC.dom.labelTextContainer.style.paddingLeft = 20;
//            panel.style.addProperties({'padding-left': 20});
//            fieldC.dom.labelTextContainer.style.width = 60;
//            textField.dom.labelTextContainer.style.display = 'none';
//            textField.controls[0].setWidth(200);
//            $(dataGrid.html).find(".pmui-gridpanel-footer").css("position","static");
//            $(dataGrid.html).find(".pmui-gridpanel-footer").css("margin-top","0px"); 
//        }
//    });
//    rc.setBaseEndPoint('projects/' + this.processId + '/variables').executeRestClient();
//
//
//};
//
//VariablePicker.prototype.close = function () {
//    if (this.window) {
//        this.window.close();
//        this.window = null;
//    }
//};

var PMAction = function (options) {

	this.name = null;
	this.action = null;
    this.selector = null;
    this.tooltip = null;
    this.execute = null;
    this.label = null;
    this.before = null;
    this.after = null;
    this.handler = null;
    this.eventsDefined = false;
	PMAction.prototype.init.call(this, options);
};

PMAction.prototype.type = "action";

PMAction.prototype.events = [
	"click","click"
];

PMAction.prototype.init = function(options){
	var defaults = {
        action:"click",
        selector: "",
        tooltip: "",
        execute: false,
        label: {
            selector: "",
            text: "",
            value:""
        },
        before: function(event){
            event.preventDefault();
            PMUI.removeCurrentMenu();
        },
        after: function(event) {
            event.stopPropagation();
        },
        handler: function(event){}
	};
    jQuery.extend(true, defaults, options);
    
    this.setAction(defaults.action)
        .setSelector(defaults.selector)
        .setExecute(defaults.execute)
        .setLabel(defaults.label)
        .setBefore(defaults.before)
        .setAfter(defaults.after)
        .setHandler(defaults.handler)
        .setText(defaults.label.text)
        .setValue(defaults.label.value)
        .setTooltip(defaults.tooltip)
        .addEventListener();
        
};
PMAction.prototype.setAction = function (action) {
    this.action = action;
    return this;
};
PMAction.prototype.setSelector = function (selector) {
    this.selector = selector;
    return this;
};
PMAction.prototype.setExecute = function (option) {
    this.execute = option;
    return this;
};
PMAction.prototype.setLabel = function (label) {
    this.label = label;
    if (!label.selector) {
        this.label.selector = this.selector;
    }
    return this;
};
PMAction.prototype.setBefore = function (action) {
    this.before = action;
    return this;
};
PMAction.prototype.setAfter = function (action) {
    this.after = action;
    return this;
};
PMAction.prototype.setHandler = function (action) {
    this.handler = action;
    return this;
};
PMAction.prototype.setText = function (text) {
    if (typeof text === "string" && text.length > 0) {
        this.label.text = text;
        jQuery(this.label.selector).text(this.label.text);
    }
    return this;
};
PMAction.prototype.setValue = function (value) {
    if (typeof value === "string" && value.length > 0) {
        this.label.value = value;
        jQuery(this.label.selector).val(this.label.value);
    }
    return this;
};
PMAction.prototype.setTooltip = function (message) {
    var that = this;
    if (typeof message === "string") {
        this.tooltip = message;
        jQuery(this.selector).attr("title","");
        jQuery(this.selector).tooltip({ content: that.tooltip, tooltipClass: "mafe-action-tooltip" });
    }
    return this;
};
PMAction.prototype.addEventListener = function () {
    var that = this;
    if (this.execute === true && this.eventsDefined === false) {

        jQuery(this.selector).on(this.action,function(event){
            try {
                that.before(event);
            } catch (e) {
                throw new Error('Before action ' + e.message);    
            }
            try {
                that.handler(event);
            } catch (e) {
                throw new Error('Handler ' + e.message);    
            }
            try {
                that.after(event);      
            } catch (e) {
                throw new Error('After action ' + e.message);    
            }
        });

        jQuery(this.label.selector).text(this.label.text);
        this.eventsDefined = true;
    }
    return this;
};
PMAction.prototype.defineEvents = function () {
    this.setExecute(true);
    this.addEventListener();
};


/*global jCore*/
var PMArtifactResizeBehavior = function () {
};

PMArtifactResizeBehavior.prototype = new PMUI.behavior.RegularResizeBehavior();
PMArtifactResizeBehavior.prototype.type = "PMArtifactResizeBehavior";


/**
 * Sets a shape's container to a given container
 * @param container
 * @param shape
 */
PMArtifactResizeBehavior.prototype.onResizeStart = function (shape) {
    return PMUI.behavior.RegularResizeBehavior
        .prototype.onResizeStart.call(this, shape);
};
/**
 * Removes shape from its current container
 * @param shape
 */
PMArtifactResizeBehavior.prototype.onResize = function (shape) {
    //RegularResizeBehavior.prototype.onResize.call(this, shape);
    return function (e, ui) {
        PMUI.behavior.RegularResizeBehavior
            .prototype.onResize.call(this, shape)(e, ui);
        if (shape.graphics) {
            shape.paint();
        }

    };

};

var ConnectValidator = function () {

};
ConnectValidator.prototype.type = "ConnectValidator";

ConnectValidator.prototype.initRules = {
    'START': {
        'START' : 'sequencialRules',
        'TASK'  : 'sequencialRules',
        'AUTO_TASK' :'sequencialRules',
        'SUB_PROCESS': 'sequencialRules',
        'GATEWAY': 'sequencialRules',
        'END': 'sequencialRules',
        'CONCURRENT': 'sequencialRules',
        'TEXT_ANNOTATION': 'annotationRules'  
    },
    'END': {
        'START' : 'sequencialRules',
        'TASK'  : 'sequencialRules',
        'AUTO_TASK' :'sequencialRules',
        'SUB_PROCESS': 'sequencialRules',
        'GATEWAY': 'sequencialRules',
        'CONCURRENT': 'sequencialRules',
        'END': 'sequencialRules',
        'TEXT_ANNOTATION': 'annotationRules'
    },
    'TASK': {
        'START' : 'sequencialRules',
        'TASK'  : 'sequencialRules',
        'AUTO_TASK' :'sequencialRules',
        'SUB_PROCESS': 'sequencialRules',
        'GATEWAY': 'sequencialRules',
        'PARALLEL': 'sequencialRules',
        'INCLUSIVE':'sequencialRules',
        'CONCURRENT': 'sequencialRules',
        'END': 'sequencialRules',
        'TEXT_ANNOTATION': 'annotationRules'
    },
    'SUB_PROCESS': {
        'START' : 'sequencialRules',
        'TASK'  : 'sequencialRules',
        'AUTO_TASK' :'sequencialRules',
        'SUB_PROCESS': 'sequencialRules',
        'GATEWAY': 'sequencialRules',
        'PARALLEL': 'sequencialRules',
        'INCLUSIVE':'sequencialRules',
        'CONCURRENT': 'sequencialRules',
        'END': 'sequencialRules',
        'TEXT_ANNOTATION': 'annotationRules'
    },
    'AUTO_TASK': {
    	'START' : 'sequencialRules',
        'TASK'  : 'sequencialRules',
        'AUTO_TASK' :'sequencialRules',
        'SUB_PROCESS': 'sequencialRules',
        'GATEWAY': 'sequencialRules',
        'PARALLEL': 'sequencialRules',
        'INCLUSIVE':'sequencialRules',
        'CONCURRENT': 'sequencialRules',
        'END': 'sequencialRules',
        'TEXT_ANNOTATION': 'annotationRules'
    },
    'GATEWAY': {
        'START' : 'sequencialRules',
        'TASK'  : 'sequencialRules',
        'AUTO_TASK' :'sequencialRules',
        'SUB_PROCESS': 'sequencialRules',
        'GATEWAY': 'sequencialRules',
        'PARALLEL': 'sequencialRules',
        'INCLUSIVE':'sequencialRules',
        'CONCURRENT': 'sequencialRules',
        'END': 'sequencialRules',
        'TEXT_ANNOTATION': 'annotationRules'
    },
    'CONCURRENT': {
    	'START' : 'sequencialRules',
        'TASK'  : 'sequencialRules',
        'AUTO_TASK' :'sequencialRules',
        'SUB_PROCESS': 'sequencialRules',
        'GATEWAY': 'sequencialRules',
        'PARALLEL': 'sequencialRules',
        'INCLUSIVE':'sequencialRules',
        'CONCURRENT': 'sequencialRules',
        'END': 'sequencialRules',
        'TEXT_ANNOTATION': 'annotationRules'
    },
    'PARALLEL': {
    	'TASK'  : 'sequencialRules',
        'AUTO_TASK' :'sequencialRules',
        'SUB_PROCESS': 'sequencialRules',
        'GATEWAY': 'sequencialRules',
        'CONCURRENT': 'sequencialRules',
    },
    'INCLUSIVE': {
    	'TASK'  : 'sequencialRules',
        'AUTO_TASK' :'sequencialRules',
        'SUB_PROCESS': 'sequencialRules',
        'GATEWAY': 'sequencialRules',
        'CONCURRENT': 'sequencialRules',
    },
    'TEXT_ANNOTATION': {
        'START' : 'annotationRules',
        'TASK'  : 'annotationRules',
        'AUTO_TASK' : 'annotationRules',
        'SUB_PROCESS': 'annotationRules',
        'GATEWAY': 'annotationRules',
        'CONCURRENT': 'annotationRules',
        'END': 'annotationRules',
        'TEXT_ANNOTATION': 'annotationRules'
    }
};


ConnectValidator.prototype.sequencialRules = {
    'START': {
        'START' : false,
        'TASK'  : true,
        'AUTO_TASK' :true,
        'SUB_PROCESS': true,
        'CONCURRENT':true,
        'GATEWAY': true,
        'END': false,
        'PARALLEL': false,
        'INCLUSIVE': false,
    },
    'END': {
        'START' : false,
        'TASK'  : false,
        'AUTO_TASK' : false,
        'SUB_PROCESS': false,
        'GATEWAY': false,
        'END': false,
        'CONCURRENT':false,
        'PARALLEL': false,
        'INCLUSIVE': false,
    },
    'TASK': {
        'START' : false,
        'TASK'  : true,
        'AUTO_TASK'  : true,
        'SUB_PROCESS': true,
        'GATEWAY': true,
        'END': true,
        'CONCURRENT': true,
        'PARALLEL': false,
        'INCLUSIVE': true
    },
    'AUTO_TASK': {
        'START' : false,
        'TASK'  : true,
        'AUTO_TASK'  : true,
        'SUB_PROCESS': true,
        'GATEWAY': true,
        'END': true,
        'CONCURRENT': true,
        'PARALLEL': false,
        'INCLUSIVE': true
        
    },
    'SUB_PROCESS': {
        'START' : false,
        'TASK'  : true,
        'AUTO_TASK'  : true,
        'SUB_PROCESS': true,
        'GATEWAY': true,
        'END': true,
        'CONCURRENT': true,
        'PARALLEL': false,
        'INCLUSIVE': true
    },
    'GATEWAY': {
        'START' : false,
        'TASK'  : true,
        'AUTO_TASK'  : true,
        'SUB_PROCESS': true,
        'GATEWAY': true,
        'END': true,
        'CONCURRENT': true,
        'PARALLEL': false,
        'INCLUSIVE': false
    },
    'CONCURRENT':{
    	'START' : false,
        'TASK'  : true,
        'AUTO_TASK'  : true,
        'SUB_PROCESS': true,
        'GATEWAY': true,
        'END': true,
        'CONCURRENT': true,
        'PARALLEL': false,
        'INCLUSIVE': true
    },
    'PARALLEL': {
    	'TASK'  : true,
        'AUTO_TASK'  : true,
        'SUB_PROCESS': true,
        'GATEWAY': true,
        'CONCURRENT': true,
    },
    'INCLUSIVE': {
    	'TASK'  : false,
        'AUTO_TASK'  : false,
        'SUB_PROCESS': false,
        'GATEWAY': false,
        'CONCURRENT': false,
    }
};

ConnectValidator.prototype.messageRules = {
};


ConnectValidator.prototype.associationRules = {
    
    'START': {
        'TASK': false,
        'AUTO_TASK': false,
        'START': false,
        'SUB_PROCESS': false,
        'GATEWAY': false,
        'CONCURRENT':false,
        'PARALLEL': false,
        'INCLUSIVE': false,
        'END': false,
    },
    'END': {
        'TASK': false,
        'AUTO_TASK': false,
        'START': false,
        'SUB_PROCESS': false,
        'GATEWAY': false,
        'CONCURRENT':false,
        'PARALLEL': false,
        'INCLUSIVE': false,
        'END': false,
    },
    'TASK': {
        'TASK': false,
        'AUTO_TASK': false,
        'START': false,
        'SUB_PROCESS': false,
        'GATEWAY': false,
        'END': false,
        'CONCURRENT':false,
        'PARALLEL': false,
        'INCLUSIVE': false,
    },
    'AUTO_TASK': {
        'TASK': false,
        'AUTO_TASK': false,
        'START': false,
        'SUB_PROCESS': false,
        'GATEWAY': false,
        'END': false,
        'CONCURRENT':false,
        'PARALLEL': false,
        'INCLUSIVE': false,
    },
    'SUB_PROCESS': {
        'TASK': false,
        'AUTO_TASK': false,
        'START': false,
        'SUB_PROCESS': false,
        'GATEWAY': false,
        'END': false,
        'CONCURRENT':false,
        'PARALLEL': false,
        'INCLUSIVE': false,
    },
    'GATEWAY': {
        'TASK': false,
        'AUTO_TASK': false,
        'START': false,
        'SUB_PROCESS': false,
        'GATEWAY': false,
        'END': false,
        'CONCURRENT':false,
        'PARALLEL': false,
        'INCLUSIVE': false,
    },
    'CONCURRENT': {
    	'TASK': false,
        'AUTO_TASK': false,
        'START': false,
        'SUB_PROCESS': false,
        'GATEWAY': false,
        'END': false,
        'CONCURRENT':false,
        'PARALLEL': false,
        'INCLUSIVE': false,
    },
    'PARALLEL':{
    	'TASK': false,
        'AUTO_TASK': false,
        'START': false,
        'SUB_PROCESS': false,
        'GATEWAY': false,
        'END': false,
        'CONCURRENT':false,
        'PARALLEL': false,
        'INCLUSIVE': false,
    },
    'INCLUSIVE':{
    	'TASK': false,
        'AUTO_TASK': false,
        'START': false,
        'SUB_PROCESS': false,
        'GATEWAY': false,
        'END': false,
        'CONCURRENT':false,
        'PARALLEL': false,
        'INCLUSIVE': false,
    }
};

ConnectValidator.prototype.proMessageRules = {
    'TASK': {
        'START' : false,
        'INTERMEDIATE' : false,
        'TASK'  : true,
        'SUB_PROCESS': true,
        'GATEWAY': false,
        'END': false
    }
};

ConnectValidator.prototype.isValid = function (sourceShape, targetShape, thereIsConnection) {
	
    var result = {
            result : false,
            msg: RIA_I18N.designer.msg.invalidConnections
        },
        connections,
        rules,
        i,
        parentSource,
        sourceObject,
        targetObject,
        branchId;
    //type of shapes
    
    if (this.getTypeToValidate(sourceShape) && this.getTypeToValidate(targetShape)) {
    	
        result.msg= RIA_I18N.designer.msg.invalidConnections;
        sourceObject=sourceShape.getDataObject();
        targetObject=targetShape.getDataObject();
        //validate if there is an current connection between same elements
        if (!thereIsConnection) {
            connections = sourceShape.canvas.getConnections();
            for (i = 0; i < connections.getSize(); i +=1) {
                if (connections.get(i).getSrcPort().parent.getID() === sourceShape.getID() &&  connections.get(i).getDestPort().parent.getID() === targetShape.getID()) {
                    result.result = false;
                    result.msg = 'There is a connection between these elements';
                    return result;
                }
            }
        }
        //if(targetObject)
        /*如果节点在并发体中则不能连接到并发体外*/
        if ((sourceObject.bou_container=="bpmnParallel"||targetObject.bou_container=="bpmnParallel")&&sourceObject.bou_container!==targetObject.bou_container && sourceObject.type!=="TEXT_ANNOTATION" && targetObject.type!=="TEXT_ANNOTATION") {
        	return result; 
        } else {
        	if(sourceObject.bou_container=="bpmnParallel" && targetObject.gat_type!=="INCLUSIVE"){
        		if ((sourceObject.branch_id !== "" && targetObject.branch_id !== "")&&sourceObject.branch_id!==targetObject.branch_id) {
                  	 return result; 
               	}
        		
        		if(sourceObject.gat_type && sourceObject.gat_type=="PARALLEL" && targetObject.branch_id ==""){
        			branchId=PMUI.generateUniqueId();
        		}else{
        			branchId=sourceObject.branch_id;
        		}
        		
        		if(targetObject.branch_id==""){
        			PMCanvas.batchSetBranchId(targetShape,branchId);
        		}
        	}
        	
            if (this.initRules[this.getTypeToValidate(sourceShape)][this.getTypeToValidate(targetShape)]) {
                //result.result = this.initRules[this.getTypeToValidate(sourceShape)][this.getTypeToValidate(targetShape)];
                rules = this.initRules[this.getTypeToValidate(sourceShape)][this.getTypeToValidate(targetShape)];
                switch(rules) {
                    case 'sequencialRules':
                        if (this.sequencialRules[this.getTypeToValidate(sourceShape)][this.getTypeToValidate(targetShape)]) {
                            result.result = this.sequencialRules[this.getTypeToValidate(sourceShape)][this.getTypeToValidate(targetShape)];
                        }
                        targetShape.setConnectionType({
                            type: 'SEQUENCE',
                            segmentStyle:'regular',
                            destDecorator: 'mafe-sequence'
                        });
                        break;
                    case 'messageRules':
                        if (this.messageRules[this.getTypeToValidate(sourceShape)][this.getTypeToValidate(targetShape)]) {
                            result.result = this.messageRules[this.getTypeToValidate(sourceShape)][this.getTypeToValidate(targetShape)];
                            if (result.result) {
                                if(sourceShape.extendedType === 'START' && sourceShape.evn_marker === "MESSAGE") {
                                    result.result = false;
                                    result.msg= 'Start Event must not have any outgoing Message Flows';
                                }
                            }
                        }
                        // result.result = true;
                        targetShape.setConnectionType({
                            type: 'MESSAGE',
                            segmentStyle:'segmented',
                            destDecorator: 'mafe-message',
                            srcDecorator: 'mafe-message'
                        });
                        break;
                    case 'annotationRules':
                        result.result = true;
                        targetShape.setConnectionType({
                            type: 'ASSOCIATION',
                            segmentStyle:'dotted',
                            destDecorator: 'mafe-default'
                        });
                        break;
                    case 'associationRules':
                        if (this.associationRules[this.getTypeToValidate(sourceShape)][this.getTypeToValidate(targetShape)]) {
                            result.result = this.associationRules[this.getTypeToValidate(sourceShape)][this.getTypeToValidate(targetShape)];
                        }
                        //result.result = true;
                        targetShape.setConnectionType({
                            type: 'DATAASSOCIATION',
                            segmentStyle:'dotted',
                            destDecorator: 'mafe-association'
                        });
                        break;
                }
            }
        }
    }
    return result;
};

ConnectValidator.prototype.oneToOneValidator = function (sourceShape) {
    var result = {
            result :true,
            msg: RIA_I18N.designer.msg.invalidConnections
        },
        conn,
        connections = sourceShape.canvas.getConnections();
    for (i = 0; i < connections.getSize(); i +=1) {
        conn = connections.get(i);
        if (conn.getSrcPort().parent.getID() === sourceShape.getID() && conn.flo_type === 'SEQUENCE') {
            result.result = false;
            result.msg= RIA_I18N.designer.errorMessage.oneConnection;
        }
    }
    return result;
};

ConnectValidator.prototype.getTypeToValidate = function (shape) {
    var type;
    switch(shape.extendedType) {
        case 'START':   
            type = shape.extendedType;
            break;
        case 'END':  
            type = shape.extendedType;
            break;
        case 'TASK':
        case 'AUTO_TASK':
        case 'SUB_PROCESS':
        case 'TEXT_ANNOTATION':
            type = shape.extendedType;
            break;
        case 'EXCLUSIVE':
        case 'COMPLEX':
        	 type = 'GATEWAY';
             break;
        case 'PARALLEL':
        	type = 'PARALLEL';
        	break;
        case 'INCLUSIVE':
            type = 'INCLUSIVE';
            break;
        case 'POOL':
            type = 'POOL';
            break;
        case 'LANE':
            type = 'LANE';
            break;
        case 'CONCURRENT':
            type = 'CONCURRENT';
            break;
        default:
            type = 'TASK';
            break;

    }
    return type;
};
ConnectValidator.prototype.styleErrorMap = new PMUI.util.ArrayList();
ConnectValidator.prototype.hasNotMap = new PMUI.util.ArrayList();


ConnectValidator.prototype.styleErrorConfig = {
    'bpmn:StartEvent' : [
        {
            code: '105102',
            description: 'Start Event must have an outgoing sequence flow',
            type: 'bpmnStartEvent',
            category: 'Error',
            criteria: function (shape, error) {
                var ref = shape.businessObject.elem;
                if (ref && !(ref.outgoing && ref.outgoing.length === 1)) {
                    //add error
                    shape.addErrorLog(error);

                }
            }
        },
        {
            code: '105101',
            description: 'Start Event must not have an incommig sequence flow',
            type: 'bpmnStartEvent',
            category: 'Error',
            criteria: function (shape, error) {

                var ref = shape.businessObject.elem;
                if (ref && ref.incoming && ref.incoming.length > 0) {
                    //add error
                    shape.addErrorLog(error);
                }
            }
        }
    ],
    'bpmnActivity' : [
        {
            code: '105201',
            description: 'Activity must have an incoming sequence flow',
            type: 'bpmnActivity',
            category: 'Error',
            criteria: function (shape, error) {
                var ref = shape.businessObject.elem;
                if (ref && !(ref.incoming && ref.incoming.length === 1)) {
                    //add error
                    shape.addErrorLog(error);

                }
            }
        },
        {
            code: '105202',
            description: 'Activity must have an outgoing sequence flow',
            type: 'bpmnActivity',
            category: 'Error',
            criteria: function (shape, error) {
                var ref = shape.businessObject.elem;
                if (ref && !(ref.outgoing && ref.outgoing.length === 1)) {
                    //add error
                    shape.addErrorLog(error);

                }
            }
        }
    ],
    'bpmn:EndEvent' : [
        {
            code: '105301',
            description: 'End event must have an incoming sequence flow',
            type: 'bpmnEndEvent',
            category: 'Error',
            criteria: function (shape, error) {
                var ref = shape.businessObject.elem;
                if (ref && !(ref.incoming && ref.incoming.length > 0)) {
                    //add error
                    shape.addErrorLog(error);

                }
            }
        }
    ],
    'bpmnIntermediateEvent' : [
        {
            code: '105401',
            description: 'Intermediate event must have an incoming sequence flow',
            type: 'bpmnIntermediateEvent',
            category: 'Error',
            criteria: function (shape, error) {
                var ref = shape.businessObject.elem;
                if (ref && !(ref.incoming && ref.incoming.length === 1)) {
                    //add error
                    shape.addErrorLog(error);

                }
            }
        },
        {

            code: '105402',
            description: 'Intermediate event must have an outgoing sequence flow',
            type: 'bpmnIntermediateEvent',
            category: 'Error',
            criteria: function (shape, error) {
                var ref = shape.businessObject.elem;
                if (ref && !(ref.outgoing && ref.outgoing.length === 1)) {
                    //add error
                    shape.addErrorLog(error);

                }
            }
        }
    ],
    'bpmnGateway' : [
        {
            code: '105501',
            description: 'Diverging Gateway must have an incoming sequence flow',
            type: 'bpmnGateway',
            category: 'Error',
            criteria: function (shape, error) {
                if (shape.gat_direction === 'CONVERGING') {
                    error.description = 'Converging Gateway must have two or more incoming sequence flow';
                    var ref = shape.businessObject.elem;
                    if (ref && !(ref.incoming && ref.incoming.length > 1)) {
                        shape.addErrorLog(error);
                    }
                } else {
                    var ref = shape.businessObject.elem;
                    if (ref && !(ref.incoming && ref.incoming.length === 1)) {
                        //add error
                        shape.addErrorLog(error);
                    }
                }

            }
        },
        {

            code: '105502',
            description: 'Diverging Gateway must have two or more outgoing sequence flow',
            type: 'bpmnGateway',
            category: 'Error',
            criteria: function (shape, error) {
                if (shape.gat_direction === 'CONVERGING') {
                    error.description = 'Converging Gateway must have a outgoing sequence flow';
                    var ref = shape.businessObject.elem;
                    if (ref && !(ref.outgoing && ref.outgoing.length === 1)) {
                        shape.addErrorLog(error);
                    }
                } else {
                    var ref = shape.businessObject.elem;
                    if (ref && !(ref.outgoing && ref.outgoing.length > 1)) {
                        //add error
                        shape.addErrorLog(error);
                    }
                }
            }
        }
    ]
};
ConnectValidator.prototype.bpmnValidator = function () {

    var canvas,
        shape,
        i,
        errorList;
    canvas = PMUI.getActiveCanvas();
    errorList = new PMUI.util.ArrayList();
    for (i = 0; i < canvas.customShapes.getSize(); i += 1) {
        shape = canvas.customShapes.get(i);
        if (shape.extendedType!=='CONCURRENT' && shape.validatorMarker) {
            this.bpmnFlowValidator(errorList, shape);
            this.bpmnUserValidator(errorList, shape);
            shape.validatorMarker.hide();
            if (shape.errors.getSize() > 0 && shape.validatorMarker){
                shape.validatorMarker.show();
            }
        }
    }
    return errorList;
};

ConnectValidator.prototype.bpmnFlowValidator = function (errorList, shape) {
    this.sequenceFlowValidator(shape);
    this.messageFlowValidator(shape);
};
ConnectValidator.prototype.sequenceFlowValidator = function(shape) {
    var ref = shape.businessObject.elem,
        errorCandidates,
        i,
        error = {},
        type;
    shape.errors.clear();
    if (shape.getType() === 'PMParticipant'){
        ref = shape.participantObject.elem;
    }
    switch(ref.$type){
    case 'bpmn:Task':
    case 'bpmn:UserTaskk':
    case 'bpmn:ManualTask':
    case 'bpmn:Menu':
    case 'bpmn:SubProcess':
        type = 'bpmnActivity';
       break;
    case 'bpmn:ExclusiveGateway':
    case 'bpmn:ParallelGateway':
    case 'bpmn:InclusiveGateway':
        type = 'bpmnGateway';
        break;
    default:
        type = ref.$type;
        break;
    }
    errorCandidates =  this.styleErrorConfig[type];
    if (errorCandidates) {
        for (i = 0; i < errorCandidates.length; i += 1) {
            error = errorCandidates[i];
            if (error.criteria) {
                error.criteria(shape, _.extend({}, error));
            }
        }
    }
};
ConnectValidator.prototype.messageFlowValidator = function(shape) {
    //todo message flow validator
    //console.log(shape);
    return true;
};
ConnectValidator.prototype.bpmnUserValidator = function (errorList, shape) {
    return true;
};
var CommandChangeGatewayType = function (receiver, options) {
    PMUI.command.Command.call(this, receiver);
    this.before = null;
    this.after = null;
    CommandChangeGatewayType.prototype.initObject.call(this, options);
};

//CommandChangeGatewayType.prototype = new PMUI.command.Command();
PMUI.inheritFrom('PMUI.command.Command', CommandChangeGatewayType);
/**
 * Type of the instances of this class
 * @property {String}
 */
CommandChangeGatewayType.prototype.type = "CommandChangeGatewayType";

/**
 * Initializes the command parameters
 * @param {PMUI.draw.Core} receiver The object that will perform the action
 */
CommandChangeGatewayType.prototype.initObject = function (options) {

    var parsedClass = options;
    this.layer = this.receiver.getLayers().get(0);
    //layer.setZoomSprites(newSprite);

    this.before = {
        zoomSprite: this.layer.zoomSprites,
        type: this.receiver.extendedType,
        defaultFlow: this.receiver.canvas.items.find('id',this.receiver.gat_default_flow) ?
            this.receiver.canvas.items.find('id',this.receiver.gat_default_flow).relatedObject : null
    };
//    if (options === 'COMPLEX') {
//        parsedClass = 'EXCLUSIVE';
//    }
    this.after = {
        zoomSprite: [
            'mafe-gateway-' + parsedClass.toLowerCase() + '-20',
            'mafe-gateway-' + parsedClass.toLowerCase() + '-30',
            'mafe-gateway-' + parsedClass.toLowerCase() + '-41',
            'mafe-gateway-' + parsedClass.toLowerCase() + '-51',
            'mafe-gateway-' + parsedClass.toLowerCase() + '-61'
        ],
        type: options
    };
};

/**
 * Executes the command, changes the position of the element, and if necessary
 * updates the position of its children, and refreshes all connections
 */
CommandChangeGatewayType.prototype.execute = function () {
    var menuShape;
    this.layer.setZoomSprites(this.after.zoomSprite);
    //this.layer.paint();
    this.receiver.setGatewayType(this.after.type);
    this.receiver.extendedType = this.after.type;
    this.receiver
        .updateBpmGatewayType(this.receiver.mapBpmnType[this.after.type]);
    //PMDesigner.project.setDirty(true);
    PMDesigner.project.updateElement([]);
    //$(this.receiver.canvas.html).trigger('changeelement');
    //this.receiver.canvas.onChangeElementHandler(this.receiver);
    this.receiver.paint();
    if (this.after.type ==='PARALLEL' && this.before.defaultFlow) {
        this.receiver.gat_default_flow = null;
        this.before.defaultFlow.changeFlowType('sequence');
        this.before.defaultFlow.setFlowType("SEQUENCE");
    }

    menuShape = PMDesigner.getMenuFactory(this.after.type);

    this.receiver.setContextMenu(menuShape);

};

/**
 * Returns to the state before the command was executed
 */
CommandChangeGatewayType.prototype.undo = function () {
    this.layer.setZoomSprites(this.before.zoomSprite);
    //this.layer.paint();
    this.receiver.setGatewayType(this.before.type);
    this.receiver.extendedType = this.before.type;
    this.receiver
        .updateBpmGatewayType(this.receiver.mapBpmnType[this.before.type]);
    PMDesigner.project.setDirty(true);
    $(this.receiver.html).trigger('changeelement');
    this.receiver.paint();
    menuShape = PMDesigner.getMenuFactory(this.before.type);
    this.receiver.setContextMenu(menuShape);
    if (this.after.type ==='PARALLEL' && this.before.defaultFlow) {
        this.receiver.gat_default_flow = this.before.defaultFlow.getID();
        this.before.defaultFlow.setFlowCondition("");
        this.before.defaultFlow.changeFlowType('default');
        this.before.defaultFlow.setFlowType("DEFAULT");

    }
};

/**
 *  Executes the command again after an undo action has been done
 */
CommandChangeGatewayType.prototype.redo = function () {
    this.execute();
};


    var CommandDefaultFlow = function (receiver, options) {
        PMUI.command.Command.call(this, receiver);
        this.before = null;
        this.after = null;
        CommandDefaultFlow.prototype.initObject.call(this, options);
    };

    //CommandChangeGatewayType.prototype = new PMUI.command.Command();
    PMUI.inheritFrom('PMUI.command.Command', CommandDefaultFlow);
    /**
     * Type of the instances of this class
     * @property {String}
     */
    CommandChangeGatewayType.prototype.type = "CommandDefaultFlow";

    /**
     * Initializes the command parameters
     * @param {PMUI.draw.Core} receiver The object that will perform the action
     */
    CommandDefaultFlow.prototype.initObject = function (options) {

        this.before = {
            id: this.receiver.gat_default_flow
        };
        this.after = {
            id: options
        };
    };

    /**
     * Executes the command, changes the position of the element, and if necessary
     * updates the position of its children, and refreshes all connections
     */
    CommandDefaultFlow.prototype.execute = function () {
        this.receiver.setDefaultFlow(this.after.id);
        PMDesigner.project.setDirty(true);
    };

    /**
     * Returns to the state before the command was executed
     */
    CommandDefaultFlow.prototype.undo = function () {
         this.receiver.setDefaultFlow(this.before.id);
    };

    /**
     *  Executes the command again after an undo action has been done
     */
    CommandDefaultFlow.prototype.redo = function () {
        this.execute();
    };

