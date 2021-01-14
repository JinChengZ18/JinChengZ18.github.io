/**
 * 流程设计器主页面的渲染
 */
var PMDesigner = {};

PMDesigner.globalXml = "";
PMDesigner.remoteUrl = "";
if(!isIE8()){
	PMDesigner.moddle = new BpmnModdle();
	PMDesigner.bpmnFactory = new BpmnFactory(PMDesigner.moddle);
}
PMDesigner.branchStartAndEnd=new Object();
/**
 * 流程保存接口
 * */
PMDesigner.saveProcess=function(categoryId){
	if(categoryId !== "" && categoryId!==undefined)
		category_id=categoryId;
	
	var proj=PMDesigner.project;
	if(PMDesigner.project.isDirty() && PMDesigner.project.isSave === false){
        PMDesigner.project.isSave = true;
        $(".mafe-save-process")[0].childNodes[0].text = RIA_I18N.designer.msg.saving;
        PMDesigner.project.save(true);
    }
	var process={
		processId:proj.projectId,
		processName:proj.projectName,
		processDesc:proj.description,
		processVersion:version
	}
	return process;
}
/**
 * 流程校验接口
 * */
PMDesigner.validateProcess=function(){
	var processVer=version;
	var validatorInfo=PMDesigner.validateAllObjects(true);
	var validatorflag=false;
	if(validatorInfo.length<=0)
		validatorflag=true;
	var proj=PMDesigner.project;
	if(version=="")
		processVer="V1";
	var process={
		processId:proj.projectId,
		processName:proj.projectName,
		processDesc:proj.description,
		processVersion:processVer,
		validatorflag:validatorflag,
		validatorInfo:validatorInfo
	}
	return process;
}
/**
 * 修改流程名称
 * */
PMDesigner.updateProcessName=function(name){
	PMDesigner.project.projectName=name;
	var processXmlStr= PMDesigner.project.processXml;
	var processXmlDom = PMDesigner.strToXml(processXmlStr);
	processXmlDom.getElementsByTagName("Process")[0].setAttribute("name",name);
	PMDesigner.project.setProcessXml(PMDesigner.xmlToStr(processXmlDom));
	return PMDesigner.project.projectName;
}
/**
 * function to get the enviroment variables (WORKSPACE, LANG, SKIN)
 */
enviromentVariables = function (variable) {
    if (window.parent) {
        var url1 = window.parent.location.pathname;
        var variables = url1.split('/');
        var WORKSPACE = variables[1];
        WORKSPACE = WORKSPACE.substring(3);
        var LANG = variables[2];
        var SKIN = variables[3];

        if (variable == 'WORKSPACE') {
            return WORKSPACE;
        } else if (variable == 'LANG') {
            return LANG;
        } else if (variable == 'SKIN') {
            return SKIN;
        } else {
            return null;
        }
    }
}
PMDesigner.resetValidatorStyle = function(){
	var newWidth = document.body.clientWidth-$('#resourceViewDiv').width()-$('.bpmn_shapes_left_panel').width();
	 $('.bpmn_validator').css("width",newWidth);
	 $('.bpmn_validator').css('left',$('.bpmn_shapes_left_panel').css('width'));
//	 PMDesigner.validTable.draw();
}
jQuery(document).ready(function ($) {
	//资源视图折叠
	$('.left-collapse-menu').click(function (e) {
		if ( $('#resourceView').css("display").toLowerCase() !== "none") {
			 $('#resourceView').css({
	            display: 'none'
	        });
	    } else {
		   	 $('#resourceView').css({
		            display: 'block'
		        });
		   //第一次打开折叠的时候加载资源试图iframe
			 if($('#resourceView > iframe').attr('src')==''){
				 $('#resourceView > iframe').attr('src',contextPath+'/workflow/processDesigner/bpmResourceView/resourceView.jsp');
			 }
	    }
		PMDesigner.resetValidatorStyle();
		$('.left-collapse-menu').children().eq(0).toggleClass("out-expand");
	});
	//左侧图形菜单折叠 
	$('.right-collapse-menu').click(function (e) {
		if ( $('.node-panel').css("display").toLowerCase() !== "none") {
			 $('.node-panel').css({
	            display: 'none'
	        });
			 var $_canvas = $(jQuery("#div-layout-canvas").children().eq(0));
			 if($(jQuery("#div-layout-canvas").children().eq(0)).width()<$(window).width()){
				 $_canvas.width($(window).width());
			 }
			 $_canvas.css('left',0);
			 PMDesigner.project.diagrams.get(PMDesigner.project.diagrams.getSize()-1).x=0;
	    } else {
		   	 $('.node-panel').css({
		            display: 'block'
		        });
		   	var $_canvas = $(jQuery("#div-layout-canvas").children().eq(0));
		   	$_canvas.css('left',$('.node-panel').width());
//		   	$_canvas.width($_canvas.width()-$('.node-panel').width());
		    PMDesigner.project.diagrams.get(PMDesigner.project.diagrams.getSize()-1).x=$('#bpmn_shapes').width();
	    }
		PMDesigner.resetValidatorStyle();
		$('.right-collapse-menu').children().eq(0).toggleClass("in-expand");
	});
});
buttonResourceViewClick = function() {
	 if ( $('#resourceView').css("display").toLowerCase() !== "none") {
		 $('#resourceView').css({
            display: 'none'
        });
        title = "Maximize";
    } else {
   	 $('#resourceView').css({
            display: 'block'
        });
    }
} 
var LANG = (typeof SYS_LANG !== "undefined") ? SYS_LANG : enviromentVariables('LANG');
var WORKSPACE = (typeof SYS_SYS !== "undefined") ? SYS_SYS : enviromentVariables('WORKSPACE');
var SKIN = (typeof SYS_SKIN !== "undefined") ? SYS_SKIN : enviromentVariables('SKIN');

var DEFAULT_WINDOW_WIDTH = 943;
var DEFAULT_WINDOW_HEIGHT = 520;
var ENABLED_FEATURES = [];

if (LANG != 'en') {
    if (typeof __TRANSLATIONMAFE != "undefined" && typeof __TRANSLATIONMAFE[LANG] != 'undefined') {
        PMUI.loadLanguage(__TRANSLATIONMAFE.en, 'en');
        PMUI.loadLanguage(__TRANSLATIONMAFE[LANG], LANG);

        PMUI.setDefaultLanguage('en');
        PMUI.setCurrentLanguage(LANG);
    }
}

PMDesigner.resizeFrame = function () {
    if (parent.document.documentElement === document.documentElement) {
        jQuery(".content").css("height", parseInt(jQuery(window).height()));
    } else {
        jQuery(".content").css("height", document.body.clientHeight);

    }
};


var resizingFrame = PMDesigner.resizeFrame;

PMDesigner.applyCanvasOptions = function () {
    list = new PMUI.control.DropDownListControl({
        options: [],
        style: {
            cssClasses: [
                "mafe-dropdown-zoom"
            ]
        },
        width: 150,
        onChange: function (newValue, previous) {
            var canvas = PMDesigner.project.diagrams.find('id', newValue);
            PMUI.getActiveCanvas().getHTML().style.display = 'none';
            PMUI.setActiveCanvas(canvas);
            canvas.getHTML().style.display = 'inline';
        }
    });
    //enable to support multidiagram
    //jQuery(jQuery(".navBar li")[6]).append(list.getHTML());
    list.defineEvents();
    PMDesigner.canvasList = list;
};

//Zoom
PMDesigner.ApplyOptionsZoom = function () {
    list = new PMUI.control.DropDownListControl({
    id:'_idListZoom',
        options: [
            {
                label: "50%",
                value: 1
            },
            {
                label: "75%",
                value: 2
            },
            {
                label: "100%",
                value: 3,
                selected: true
            },
            {
                label: "125%",
                value: 4
            },
            {
                label: "150%",
                value: 5
            }
        ],
        style: {
            cssClasses: [
                "mafe-dropdown-zoom"
            ]
        },
        onChange: function (newValue, previous) {
            var i;
            newValue = parseInt(newValue, 10);
            PMUI.getActiveCanvas().applyZoom(newValue);
        }
    });

    //jQuery(jQuery(".navBar li")[4]).append(list.getHTML());
    jQuery(jQuery(".mafe-zoom-options")).append(list.getHTML());

    list.defineEvents();
};
/**
 * hides all requiered TinyControls
 */
PMDesigner.hideAllTinyEditorControls = function () {
    var control,
        i,
        max,
        j,
        mapMax,
        editor,
        controlMap = [
            'tinyeditor_fontselect',
            'tinyeditor_fontsizeselect',
            'tinyeditor_bullist',
            'tinyeditor_numlist',
            'tinyeditor_forecolor',
            'tinyeditor_backcolor'
        ];
    for (i = 0, max = tinymce.editors.length; i < max; i += 1) {
        editor = tinymce.editors[i];
        jQuery.each(editor.controlManager.controls, function (index, val) {
            if (val && jQuery.isFunction(val.hideMenu)){
                val.hideMenu();
            }
        });
    }

};
PMDesigner.getProcessXml=function(type,menuNodeDom){	
	var processXmlStr= PMDesigner.project.processXml;
	var processXmlDom = PMDesigner.strToXml(processXmlStr);
	if(type=="Transition")
		processXmlDom.getElementsByTagName("transitions")[0].appendChild(menuNodeDom)
	else{
		if(!processXmlDom.getElementsByTagName("Process")[0].appendChild(menuNodeDom))
			$($(processXmlDom).find("Process")[0]).append(menuNodeDom);
	}
	var processXml=PMDesigner.xmlToStr(processXmlDom);
	return processXml;
}
PMDesigner.xmlToStr=function(xmlDom){
	var xmlStr="";
	if(xmlDom.xml){//不在IE中,会返回undefined
	      xmlStr=xmlDom.xml;
	}else{
		 xmlStr=new XMLSerializer().serializeToString(xmlDom);
	}
	return xmlStr;
}
PMDesigner.strToXml=function(xmlStr){
	//var processName= $("div#processName span").text();
	var xmlDom;
	if(document.all){
		xmlDom = new ActiveXObject("Microsoft.XMLDOM");
		xmlDom.async = false;
		xmlDom.loadXML(xmlStr);
	}else{
		xmlDom = new DOMParser().parseFromString(xmlStr, "text/xml");
	}
	/*if(xmlDom.getElementsByTagName("Process").length!=0){
		var processProName=xmlDom.getElementsByTagName("Process")[0].getAttribute("name");
		if(processName!=processProName&&processName!=""){
			xmlDom.getElementsByTagName("Process")[0].setAttribute("name",processName);
		}		
	}*/
	return xmlDom;
}
PMDesigner.closeWebPage = function() {  
    if (navigator.userAgent.indexOf("MSIE") > 0) {  
        if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {  
            window.opener = null; window.close();  
        }  
        else {  
            window.open('', '_top'); window.top.close();  
        }  
    }  
    else if (navigator.userAgent.indexOf("Firefox") > 0) {  
        window.location.href = 'about:blank ';  
    }  
    else {  
        window.opener = null;   
        window.open('', '_self', '');  
        window.close();  
    }  
}  
jQuery(document).ready(function ($) {//流程设计器初始化 zhaozhg
    /***************************************************
     * Defines the Process
     ***************************************************/
    if (typeof prj_uid === "undefined") {
        prj_uid = '';
    }
    if(patternFlag=='Monitor'||patternFlag=='PrvView'||patternFlag=='FormServerDesigner' || patternFlag=='CreateByTemplate')
    	prj_readonly=true;
    else
    	prj_readonly=false;

    if (typeof credentials === "undefined") {
        credentials = '';
    } else {
        credentials = RCBase64.decode(credentials);
        credentials = (credentials == '') ? "" : JSON.parse(credentials);
    }
   
    PMDesigner.createHTML();

    var setSaveButtonDisabled = function (that) {
        if (that.isDirty()) {
             if ($(".mafe-save-process").length > 0) {
                    $(".mafe-save-process")[0].removeAttribute("style");
                    $(".mafe-save-process")[0].childNodes[0].style.color = "#FFF";
                    $(".mafe-save-process")[0].childNodes[0].text = RIA_I18N.designer.button.save;
            }
        } else {
            if ($(".mafe-save-process").length > 0) {
                $(".mafe-save-process")[0].style.backgroundColor = "#e8e8e8";
                $(".mafe-save-process")[0].style.color = "#000";
                $(".mafe-save-process")[0].childNodes[0].style.color = "#000";
                $(".mafe-save-process")[0].childNodes[0].text = RIA_I18N.designer.button.save;
            }
        }
    };
    var monitorAddPercentage = function(){
    	if(patternFlag && patternFlag=="Monitor"){
        	//比例调节下拉框
        	listMonitor = new PMUI.control.DropDownListControl({
        	    id:'_idListZoom',
        	        options: [
        	            {
        	                label: "50%",
        	                value: 1
        	            },
        	            {
        	                label: "75%",
        	                value: 2
        	            },
        	            {
        	                label: "100%",
        	                value: 3,
        	                selected: true
        	            },
        	            {
        	                label: "125%",
        	                value: 4
        	            },
        	            {
        	                label: "150%",
        	                value: 5
        	            }
        	        ],
        	        style: {
        	            cssClasses: [
        	                "mafe-dropdown-zoom"
        	            ],
        	            cssProperties:{
        	            	'float' : 'left',
    	            	    'margin-top': '5px',
        	                'margin-left': '5px'
        	            }
        	                           
        	        },
        	        onChange: function (newValue, previous) {
        	            var i;
        	            newValue = parseInt(newValue, 10);
        	            PMUI.getActiveCanvas().applyZoom(newValue);
        	        }
        	    });
    		jQuery(".bpmn_shapes ").append(listMonitor.getHTML());
    	    listMonitor.defineEvents();
        }
    }
    var s;
    var sidebarCanvas = [];
    for (s = 0; s < PMDesigner.sidebar.length; s += 1) {
        sidebarCanvas = sidebarCanvas.concat(PMDesigner.sidebar[s].getSelectors());
        jQuery(".bpmn_shapes").append(PMDesigner.sidebar[s].getHTML());
        if(s == PMDesigner.sidebar.length-1){
//        	monitorAddPercentage();
        }
    }
    firstAbsuluteX = jQuery("#div-layout-canvas").offset().left;

    var project = new PMProject({//流程定义方法  by siqq
        id: prj_uid,
        name: 'Untitled Process',
        keys: {
            access_token: credentials.access_token,
            expires_in: credentials.expires_in,
            token_type: credentials.token_type,
            scope: credentials.scope,
            refresh_token: credentials.refresh_token,
            client_id: credentials.client_id,
            client_secret: credentials.client_secret
        },
        listeners: {
            create: function (self, element) {
                var sh, i,
                        contDivergent = 0,
                        contConvergent = 0;
                //Updating the background color for connections
                jQuery(".pmui-intersection > div > div").css("background-color", "black");

                if (element.type == "Connection") {
                    ///////////****************Changing the gatDirection*******************//////////////////
                    if (element.relatedObject.srcPort.parent.gat_type === "PARALLEL" ||
                            element.relatedObject.srcPort.parent.gat_type === "INCLUSIVE" ||
                            element.relatedObject.destPort.parent.gat_type === "PARALLEL" ||
                            element.relatedObject.destPort.parent.gat_type === "INCLUSIVE") {
                        if (element.relatedObject.srcPort.parent.gat_type !== undefined) {
                            sh = element.relatedObject.srcPort.parent;
                        } else {
                            sh = element.relatedObject.destPort.parent;
                        }
                        if (sh.gat_direction === "DIVERGING") {
                            for (i = 0; i < sh.ports.asArray().length; i += 1) {
                                if (sh.ports.asArray()[i].connection.flo_element_origin_type === "bpmnActivity") {
                                    contDivergent++;
                                }
                                if (contDivergent > 1) {
                                    sh.gat_direction = "CONVERGING";
                                    i = sh.ports.asArray().length;
                                }
                            }
                        }
                        if (sh.gat_direction === "CONVERGING") {
                            for (i = 0; i < sh.ports.asArray().length; i += 1) {
                                if (sh.ports.asArray()[i].connection.flo_element_origin_type === "bpmnGateway") {
                                    contConvergent++;
                                }
                                if (contConvergent > 1) {
                                    sh.gat_direction = "DIVERGING";
                                    i = sh.ports.asArray().length;
                                }
                            }
                        }

                    }
                }
                setSaveButtonDisabled(self);
            },
            update: function (self) {
                jQuery(".pmui-intersection > div > div").css("background-color", "black");
                setSaveButtonDisabled(self);
            },
            remove: function (self) {
                setSaveButtonDisabled(self);
            },
            success: function (self, xhr, response) {
                var message;
                self.dirty = false;
                setSaveButtonDisabled(self);
              
                self.updateIdentifiers(response);
                PMDesigner.connectValidator.bpmnValidator();
                //if (PMDesigner.currentMsgFlash) {
                PMDesigner.msgFlash(RIA_I18N.designer.buttonTooltip.saveSucess, document.body, 'success', 3000, 5);
               // PMDesigner.RoutingRuleSetOrder();
                //}

            },
            failure: function (self, xhr, response) {
                var message;
                if (response.error.code === 401) {
                   
                } else {
                	setSaveButtonDisabled(self);
                    PMDesigner.msgFlash(RIA_I18N.designer.buttonTooltip.saveFailure, document.body, 'error', 3000, 5);
                    self.updateIdentifiers(response);
                }
            }
        }
    });
    PMDesigner.project = project;
   
    PMDesigner.connectValidator = new ConnectValidator();
    var d;
    for (d = 0; d < PMDesigner.sidebar.length; d += 1) {
        PMDesigner.sidebar[d].activate();
    }

    /**
     * ContextMenu added to HTMLElement
     **/

    $('.bpmn_shapes_legend').hide();
  
    //project.remoteProxy.setUrl("/api/1.0/" + WORKSPACE + "/project/" + prj_uid);//请求流程模型 zhaozhg
    project.load();

    var exportLink = $('.mafe-button-export-process');
    exportLink.click(function (e) {
    	var fileName = PMDesigner.project.projectName +".uwbp";
    	var dirtyObject = PMDesigner.project.getDirtyObjectXml();
        var content=PMDesigner.xmlToStr(dirtyObject); 
    	 
    	var encodedData = encodeURIComponent(content);
    	exportLink.attr({
            'href': 'data:application/bpmn20-xml,' + encodedData,
            'download': fileName
        });
    });
    $('.mafe-button-fullscreen').addClass('glyphicon glyphicon-fullscreen');
    $('.mafe-button-validation').addClass('glyphicon glyphicon-check');
//    $('.mafe-validator').append('<span class="glyphicon glyphicon-check"></span>');
    $('.mafe-button-close').addClass('glyphicon glyphicon-remove-circle');
  
    var importLink = $('.mafe-button-import-process');//.addClass('glyphicon glyphicon-import')
    importLink.click(function(e){
    	var openUrl = contextPath+"/workflow/processDesigner/importedFileUpLoad.jsp?pattern=h5-import";
        var width = 500;
        var height = 200;
        var containerId = "popupDiv";
        var title = RIA_I18N.designer.button.importProcess;
//         open_scrollable_window(openUrl,width , height);
        PMDesigner.showPopupDialog(containerId,title,openUrl,width,height);
    });
    /*========================================
     =            Designer buttons            =
     ========================================*/
    new PMAction({
        selector: ".mafe-button-save",
//        tooltip: RIA_I18N.designer.buttonTooltip.save,
        label: {
            text: RIA_I18N.designer.button.save
        },
        execute: true,
        handler: function(){
        	PMDesigner.saveProcess();
        }
    });
    new PMAction({
        selector: ".mafe-button-export-process",
//        tooltip: RIA_I18N.designer.buttonTooltip.exportprocess,
        label: {
            text: RIA_I18N.designer.button.exportprocess
        },
        execute: false,
        handler: function () {
        	
        }
    });
    new PMAction({
        selector: ".mafe-button-import-process",
//        tooltip: RIA_I18N.designer.buttonTooltip.importProcess,
        label: {
            text: RIA_I18N.designer.button.importProcess
        },
        execute: false,
        handler: function () {
           
        }
    });

    new PMAction({
        selector: ".mafe-button-undo",
        tooltip:RIA_I18N.designer.buttonTooltip.undo,
        label: {
            text: ""
        },
        execute: true,
        handler: function () {
            PMUI.getActiveCanvas().hideDragConnectHandlers();
            //PMDesigner.canvas.commandStack.undo();
            PMUI.getActiveCanvas().commandStack.undo();
        }
    });
    new PMAction({
        selector: ".mafe-button-redo",
        tooltip: RIA_I18N.designer.buttonTooltip.redo,
        label: {
            text: ""
        },
        execute: true,
        handler: function () {
            PMUI.getActiveCanvas().hideDragConnectHandlers();
            //PMDesigner.canvas.commandStack.redo();
            PMUI.getActiveCanvas().commandStack.redo();
        }
    });
    new PMAction({
        selector: ".mafe-button-validation",// mafe-button-validation
        tooltip: RIA_I18N.designer.pannel.validator,
        execute: true,
        handler: function () {
            PMDesigner.reloadDataTable();
        }
    });
    PMDesigner.ApplyOptionsZoom();
    var fullscreamaction = new PMAction({
        selector: ".mafe-button-fullscreen",
        tooltip: RIA_I18N.designer.buttonTooltip.full,
        execute: true,
        handler: function () {
            PMDesigner.fullScreen.toggle(this);
        }
    });

    var help = new PMAction({
        selector: ".mafe-toolbar-help",
        tooltip: RIA_I18N.designer.buttonTooltip.help,
        execute: true,
        handler: function () {
          PMDesigner.helper.startIntro();
        }  
    });
    new PMAction({
        selector: ".mafe-button-close",
        tooltip: RIA_I18N.designer.buttonTooltip.close,
        execute: true,
        handler: function () {
            var message_window,
                browser = PMDesigner.getBrowser(),
                url = parent.location.href;
            if (PMDesigner.project.isDirty() && !PMDesigner.project.isSave) {
            	$("#popup_dialog").wDialog({
            		modal:true,
                    iframe:true,
                    title:PMDesigner.project.projectName,
                    width:'400px',
                    height:'150px',
                    message: RIA_I18N.designer.msg.saveAndExit,
                    confirm:function(){                	
                    	PMDesigner.project.save("closeWindow");
                    }
            	});
            }else{
            	PMDesigner.closeWebPage();
            }
        }
    });

    //监控的Action
    var procRefresh = new PMAction({
			        selector: ".mafe-toolbar-refresh",
			        tooltip: RIA_I18N.designer.pannel.refresh,
			        execute: true,
			        handler: function () {
			        	window.parent.refresh();
			        }
			    });
	var procCurrentNode = new PMAction({
			        selector: ".mafe-toolbar-current-node",
			        tooltip: RIA_I18N.designer.pannel.currentNode,
			        execute: true,
			        handler: function () {
			        	PMDesigner.getCurMonitorPathID();
			        }
			    });
	var procPreNode = new PMAction({
			        selector: ".mafe-toolbar-pre-node",
			        tooltip: RIA_I18N.designer.pannel.preNode,
			        execute: true,
			        handler: function () {
			        	PMDesigner.getPreMonitorPathID();
			        }
			    });
	var procNextNode = new PMAction({
			        selector: ".mafe-toolbar-next-node",
			        tooltip: RIA_I18N.designer.pannel.nextNode,
			        execute: true,
			        handler: function () {
			        	PMDesigner.getNextMonitorPathID();
			        }
			    });
	var procSuspendOrResumeProc = new PMAction({
			        selector: ".mafe-toolbar-suspend",
			        tooltip: RIA_I18N.designer.pannel.hangOrResume,
			        execute: true,
			        handler: function () {
			        	if(jQuery('.mafe-toolbar-suspend').hasClass('mafe-toolbar-resume')){
			        		window.parent.doResume();
			        	}else{
			        		window.parent.doSuspend();
			        	}
			        	PMDesigner.setMonitorProcessButtonState();
			        }
			    });
	var procRestartProc = new PMAction({
			        selector: ".mafe-toolbar-restart",
			        tooltip: RIA_I18N.designer.pannel.restart,
			        execute: true,
			        handler: function () {
			        	window.parent.doRestart();
			        	PMDesigner.setMonitorProcessButtonState();
			        }
			    });
	var procCompleteProc = new PMAction({
			        selector: ".mafe-toolbar-complete",
			        tooltip: RIA_I18N.designer.pannel.complete,
			        execute: true,
			        handler: function () {
			        	window.parent.doComplete();
			        	PMDesigner.setMonitorProcessButtonState();
			        }
			    });
	var procAbortProc = new PMAction({
			        selector: ".mafe-toolbar-abort",
			        tooltip: RIA_I18N.designer.pannel.abort,
			        execute: true,
			        handler: function () {
			        	window.parent.doAbort();
			        	PMDesigner.setMonitorProcessButtonState();
			        }
			    });	
	if(patternFlag && patternFlag=='Monitor'){
		PMDesigner.setMonitorButtonState();//设置3个流程path按钮的状态
		PMDesigner.setMonitorProcessButtonState();//4个流程按钮状态
	}
    //end of 监控的Action
    var option = $("<a class='mafe-button-menu-option' style='color:#000;display:none'>" + "Save as image" + "</a>");
	/**
	 * Add left shapes panel
	 * 
	 * */
//    $('body').append('<div class="bpmn_shapes_panel_leftside"><div class="right_collapse_menu"></div><div class="bpmn_shapes"><div class="basic-control">基本控件</div></div></div>')
//    $('body').append('<div class="bpmn_shapes"><div class="basic-control">基本控件</div></div>')
    /*if(patternFlag=='FormServerDesigner'){
    	$('body').append('<div class="formServerDesignerProps" style="width:300px;height:440px;"><div class="node-properties">节点属性</div></div>')
    	$('.formServerDesignerProps').append('<div class="node-properties-area form-horizontal" style="overflow-y:auto;"></div>');
    	$('.node-properties-area').append('<div id="currentMappingID" style="display:none;"></div>');
    	
    	var nodeproperty = '<div class="form-group">'
    		+'<label class="control-label col-md-4">节点名称</label>'
    		+'<div class="col-md-8">'
    		+'	<input type="text" id="propertyNodeName" class="form-control required input-sm" style="font-size:13px;font-family:微软雅黑;border-radius: 4px;" placeholder="请输入名称"/>'
    		+'</div>'
    		+'</div>'
    		+'<div class="form-group row">'
    		+'<label class="control-label col-md-4">审批人</label>'
    		+'<div class="col-md-8">'
    		+'	<div id="ms1" class="form-control"></div>'
    		+'</div>'
    		+'</div>'
    		+'<div class="form-group row">'
    		+'<div class="col-md-12">'
    		+'<div class="form-control"  id="partisDisplayField" style="height:100px;"></div>'
    		+'</div>'
    		+'</div>'
    		+'<div class="form-group row">'
    		+'<label class="control-label col-md-4"></label>'
    		+'<div class="col-md-8">'
    		+'	<div id="ms2" class="form-control"></div>'
    		+'</div>'
    		+'</div>'
    		+'<div class="form-group row">'
    		+'<div class="col-md-12">'
    		+'	<div class="form-control" id="partisDisplayField2"  style="height:100px;"></div>'
    		+'</div>'
    		+'</div>';
    	$('.node-properties-area').append($(nodeproperty));
    	
    	
    	
//    	$('.node-properties-area').append('<div class="form-group node-name input-group"></div>');
//        $('.node-properties-area>.form-group.node-name').append('<label class="control-label" style="font-weight: normal;">节点名称</label>');
//        $('.node-properties-area>.form-group.node-name').append('<input type="text" id="propertyNodeName" class="form-control required" style="font-size:12px;font-family:微软雅黑;border-radius: 4px;">');
//        $('.node-properties-area').append('<div class="form-group partis-name"></div>');
//        $('.node-properties-area>.form-group.partis-name').append('<label class="control-label" style="font-weight: normal;">审批人</label>');
//        $('.node-properties-area>.form-group.partis-name').append('<div class="form-server-participants" style="width: 100px;float: right;"></div>');
//        $('.node-properties-area>.form-group.partis-name>.form-server-participants').append('<div id="ms1" class="form-control" style="font-size: 12px;padding-left:6px;padding-top:0;padding-bottom:0;width:100%;"></div>');
//        $('.node-properties-area>.form-group.partis-name').append('<div class="ms-ctn form-control" style="width:100%;min-height:34px;margin-bottom:15px;margin-top:5px;" id="partisDisplayField"></div>');
//        //form-control  padding-top:0;padding-left:0;border: 0;
//        $('.node-properties-area>.form-group.partis-name').append('<label class="control-label" style="font-weight: normal;">通用审批人</label>');
//        $('.node-properties-area>.form-group.partis-name').append('<div class="form-server-dynamic-participants" style="width: 100px;float: right;"></div>');
//        $('.node-properties-area>.form-group.partis-name>.form-server-dynamic-participants').append('<div id="ms2" class="form-control" style="font-size: 12px;padding-left:6px;padding-top:0;padding-bottom:0;width:100%;"></div>');
//        $('.node-properties-area>.form-group.partis-name').append('<div class="ms-ctn form-control" style="width:100%;min-height:34px;margin-top:5px;" id="partisDisplayField2"></div>');
        $('body').append('<div id="alertBox" style="display:none;" class="alert-box">没有选择节点</div>')
        var jsonData;
        $.ajax({
			type : "get",
			url : contextPath+"/workflow/getFormServerPartis.action",
			async : false,
			datatype:'json',
			success : function(data) {
				jsonData = $.parseJSON(data);
			},
			error : function() {
				parent.PMDesigner.msgFlash(parent.RIA_I18N.designer.msg.deleteError,parent.document.body, 'error',5000, 5);  
			}
		});
        var  ms1 = $('#ms1').magicSuggest({
        	placeholder:'从组织机构选择',
        	noSuggestionText:'没有匹配项',
        	required:false,
        	data:jsonData,
        	smallTrigger:true,
        	renderer:function(ref, value){
        		return '<div><span>'+ref.name+'</span><span style="float:right;">'+ref.typename+'</span></div>'
        	},
        	selectionContainer:$('#partisDisplayField'),
        	});
        var  ms2 = $('#ms2').magicSuggest({
        	placeholder:'动态审核人',
        	noSuggestionText:'没有匹配项',
        	required:false,
        	smallTrigger:true,
        	data:[{"id":"2","name":"实例创建者","typename":"动态"},{"id":"3","name":"创建者上级","typename":"动态"},
        	      {"id":"4","name":"前一节点","typename":"动态"},
        	      {"id":"20","name":"创建者部门领导","typename":"动态"}],
        	selectionContainer:$('#partisDisplayField2'),
        	});
        $(ms1).on('selectionchange', function(event, thisItem, records){
        	//TODO 判断是否为第一个节点
        	var currentNodeID = $('#currentMappingID').val();
        	if(!PMUI.getActiveCanvas().currentSelection.find('id',currentNodeID)){
        		//当设计器当前选择与存储的选择点不同，即没有选择点时，返回
        		$('#ms1').magicSuggest(true).clear(true);
        		var box=$('#alertBox');
        		box.show();
        		setTimeout(function(){box.hide();},500);
        		return false;
        	}
        	var typeAndIDArray = thisItem.getValue();
        	var currentNode = PMUI.getActiveCanvas().getCustomShapes().find('id',currentNodeID);
	    	if($(currentNode.act_xml).find('participants').length==0){
	    		$(currentNode.act_xml).append('<participants></participants>');
	    	}else{
//	    		$(currentNode.act_xml).find('participants').empty();
	    		$(currentNode.act_xml).find('Participant[type!=10]').remove();
	    	}
	    	
	    	$.each(typeAndIDArray,function(i,item){
	    		var typeAndID = item.split(',');
	    		var type = typeAndID[0];
	    		var id = typeAndID[1];
	    		var participantStr = '<Participant authorityType="1" value="'+id+'" type="'+type+'"></Participant>'
	    		$(currentNode.act_xml).find('participants').append(participantStr);
	    	})
        	
		  });
        $(ms2).on('selectionchange', function(event, thisItem, records){
        	//TODO 判断是否为第一个节点
        	var currentNodeID = $('#currentMappingID').val();
        	if(!PMUI.getActiveCanvas().currentSelection.find('id',currentNodeID)){
        		//当设计器当前选择与存储的选择点不同，即没有选择点时，返回
        		$('#ms2').magicSuggest(true).clear(true);
        		var box=$('#alertBox');
        		box.show();
        		setTimeout(function(){box.hide();},500);
        		return false;
        	}
        	var iDArray = thisItem.getValue();
        	var currentNode = PMUI.getActiveCanvas().getCustomShapes().find('id',currentNodeID);
	    	if($(currentNode.act_xml).find('participants').length==0){
	    		$(currentNode.act_xml).append('<participants></participants>');
	    	}else{
	    		$(currentNode.act_xml).find('Participant[type=10]').remove();
	    	}
	    	
	    	$.each(iDArray,function(i,item){
	    		var id = item;
	    		var participantStr = '<Participant authorityType="1" value="'+id+'" type="10"></Participant>'
	    		$(currentNode.act_xml).find('participants').append(participantStr);
	    	})
        	
		  });
        
        $('#propertyNodeName').bind('keyup',function(){
        	var currentValue,
        		currentNodeID,
        		currentNode;
        	currentNodeID = $('#currentMappingID').val();
        	currentNode = PMUI.getActiveCanvas().getCustomShapes().find('id',currentNodeID);
        	
        	var currentNodeID = $('#currentMappingID').val();
        	if(!PMUI.getActiveCanvas().currentSelection.find('id',currentNodeID)){
        		//当设计器当前选择与存储的选择点不同，即没有选择点时，返回
        		$('#ms1').magicSuggest(true).clear(true);
        		var box=$('#alertBox');
        		box.show();
        		setTimeout(function(){box.hide();},500);
        		return false;
        	}
        	
        	currentValue = $('#propertyNodeName').val();
        	currentNode.setName(currentValue);
        });
    }*/
    
    
    $('.bpmn_shapes_left_panel').css("height",document.documentElement.clientHeight-35);
    /**
     * 不用DataTables插件,改自己写
     * */
    $('body').append('<div class="bpmn_validator"><div class="validator_header"></div><div class="validator_body"></div></div>')
	if(patternFlag && (patternFlag=='Monitor' || patternFlag=='PrvView' || patternFlag=='FormServerDesigner' || patternFlag=='CreateByTemplate')){//如果是流程监控或表单授权调用的，隐藏校验框
		$('.bpmn_validator').css('display','none');
	};
    $('.validator_header').append('<div class="up-collapse"></div>');
    $('.validator_body').append('<div class="custom_validator"><div class="custom_validator_init">'+RIA_I18N.designer.validateMessage.notValidateYet+'</div></div>');
    $('.validator_header').click(function (e) {
		if ( $('.validator_body').css("display").toLowerCase() !== "none") {
			 $('.validator_body').css({
	            display: 'none'
	        });
	    } else {
		   	 $('.validator_body').css({
		            display: 'block'
		        });
	    }
		$('.validator_header').children().eq(0).toggleClass("down-expand");
	});

    var menu = $("<div class='mafe-button-menu-container'style='height:30px;line-height:30px;cursor:pointer'>导出为图片</div><div class='bpm-export-bpmn2-button'style='height:30px;line-height:30px;cursor:pointer'>导出bpmn2.0</div>");
    $(".mafe-export-group").on("mouseout", function(e){ 
    	if( !e ){
    		e = window.event; 
    	}
    	var reltg = e.relatedTarget ? e.relatedTarget : e.toElement; 
    	while( reltg && reltg != this ) {
    		reltg = reltg.parentNode; 
    	}
    	if( reltg != this ){ 
    		menu.hide();
    	} 
	})
    $(menu.eq(1)).on("click", function (e) {//保存为bpmn2.0
    
          var dirtyObject = PMDesigner.project.getDirtyObjectXml();
	var content=PMDesigner.xmlToStr(dirtyObject); 
	
    	PMDesigner.moddle.toXML(PMDesigner.businessObject, function (err, xmlStrUpdated) {
		var bpmnTail= "</bpmn2:definitions>";
		var bpmnHead = xmlStrUpdated.split(bpmnTail)[0];
		content = bpmnHead+content+bpmnTail;
		
    		var encodedData = encodeURIComponent(content);
    		var fileName = PMDesigner.project.projectName +".bpmn";
             option.attr({//这里就和导出图片用同一个option了，并不会互相影响
                  'href': 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData,
                  'download': fileName
             });
             option[0].click();
        });
    })
    $(menu.eq(0)).on("click", function (e) {//保存为图片
    	var canvasObject=$("#div-layout-canvas").children()[0];
    	$(canvasObject).find(".mafe-concurrent").css("z-index",1);
    	html2canvas(canvasObject, {  
             allowTaint: true,  
             taintTest: false,
             async:false,
             onrendered: function(canvas) {
                 canvas.id = "mycanvas";
                 var dataUrl = canvas.toDataURL();
                 var fileName = PMDesigner.project.projectName +".png";
	             option.attr({
	                  'href': dataUrl,
	                  'download': fileName
	             });
	             option[0].click();
             }
    	 });
        menu.hide();
    });
    $(".mafe-button-menu").on("mouseover", function (e) {
        e.stopPropagation();
        $(".mafe-export-group").append(menu);
        $(".mafe-export-group").append(option);
        menu.show();
    });
    $(".mafe-button-menu").tooltip({tooltipClass: "mafe-action-tooltip"});
    /*-----  End of Designer buttons  ------*/
    /*=================================================
     =            Full screen functionality            =
     =================================================*/
    var elem;
    if (parent.document.documentElement === document.documentElement) {
        elem = document.documentElement;
    } else {
        elem = parent.document.getElementById("frameMain");
    }
    PMDesigner.fullScreen = new FullScreen({
        element: elem,
        action: fullscreamaction,
        onReadyScreen: function () {
            setTimeout(function () {
                PMDesigner.resizeFrame();
            }, 500);
        },
        onCancelScreen: function () {
            setTimeout(function () {
                PMDesigner.resizeFrame();
            }, 500);
        }
    });
    /*-----  End of Full screen functionality  ------*/

    /*=============================================
     =            Shapes and Controls Box            =
     =============================================*/
    PMDesigner.cookie = {
        name: "PMDesigner",
        object: {},
        get: function (cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i].trim();
                if (c.indexOf(name) == 0)
                    return c.substring(name.length, c.length);
            }
            return "";
        },
        remove: function (cname) {
            jQuery.each(PMDesigner.cookie.object, function (index, val) {
                if (index === cname) {
                    delete PMDesigner.cookie.object[cname];
                    PMDesigner.cookie.refresh();
                }
            });
        },
        refresh: function () {
            document.cookie = PMDesigner.cookie.name + "=" + JSON.stringify(PMDesigner.cookie.object);
        }
    };
    PMDesigner.localStorage = {
        prefix: "PM_" + WORKSPACE + "_" + prj_uid,
        object: {},
        remove: function (cname) {
            var obj;
            obj = localStorage.getItem(PMDesigner.localStorage.prefix);
            obj = (obj === null) ? {} : JSON.parse(obj);
            if (obj[cname]) {
                delete obj[cname];
                localStorage.setItem(PMDesigner.localStorage.prefix, JSON.stringify(obj));
            }
        }
    };
    if (Modernizr.localstorage) {
        var localDesigner = localStorage.getItem(PMDesigner.localStorage.prefix);
        localDesigner = (localDesigner === null) ? {} : JSON.parse(localDesigner);
        PMDesigner.panelsPosition = localDesigner;
    } else {
        if (PMDesigner.cookie.get(PMDesigner.cookie.name) !== "") {
            var positions, pLeft, pTop, html;
            positions = JSON.parse(PMDesigner.cookie.get(PMDesigner.cookie.name));
            PMDesigner.cookie.object = positions;
            PMDesigner.panelsPosition = positions;
        }
    }
    if (typeof PMDesigner.panelsPosition === "object") {/*设置导航栏、形状栏和右侧process objects的位置*/
        var pst = PMDesigner.panelsPosition;
        if (pst.navbar) {
            pLeft = pst.navbar.x;
            pTop = pst.navbar.y;
            html = $(".navBar")[0];
            //html.style.left = pLeft+"px";
            //html.style.top = pTop+"px";
            //html.style.left = '0px';
            //html.style.left = '0px';
        }
        if (pst.bpmn) {
            //pLeft = pst.bpmn.x;
            //pTop = pst.bpmn.y;
            pLeft = 0;
            pTop = 35;//面板距顶部高度
            html = $(".bpmn_shapes")[0];
            html.style.left = pLeft + "px";
            html.style.top = pTop + "px";
        }
    }

    jQuery(".content_controls").draggable({
        handle: "div",
        start: function () {
        },
        drag: function () {
            jQuery("html").css("overflow","hidden");
        },
        stop: function (event) {
            jQuery("html").css("overflow","auto");
            if(jQuery(this).position().top > $(window).height()){
                var x = $(window).height() - 30;
                jQuery(this).css({'top' : x + 'px'});
            }
            var pLeft, pTop, currentObj;
            pLeft = parseInt(event.target.style.left);
            pTop = parseInt(event.target.style.top);
            if(pTop<90)
                pTop = 90;
            event.target.style.setProperty("top",pTop.toString()+"px");
            controls = {
                controls: {
                    x: pLeft,
                    y: pTop
                }
            };
            if (Modernizr.localstorage) {
                currentObj = localStorage.getItem(PMDesigner.localStorage.prefix);
                currentObj = (currentObj === null) ? {} : JSON.parse(currentObj);
                jQuery.extend(true, currentObj, controls);
                localStorage.setItem(PMDesigner.localStorage.prefix, JSON.stringify(currentObj));
            } else {
                jQuery.extend(true, PMDesigner.cookie.object, controls);
                document.cookie = PMDesigner.cookie.name + "=" + JSON.stringify(PMDesigner.cookie.object);
            }
        }
    });
    /*-----  End of Shapes and Controls Box  ------*/

    //Resize window
    PMDesigner.resizeFrame();

    /*==============================================
    =            Autosave functionality            =
    ==============================================*/
    /*PMDesigner.project.setSaveInterval(40000);//暂时屏蔽自动保存机制
    setInterval(function(){
        if (PMDesigner.project.isDirty()) {
            PMDesigner.project.remoteProxy.setUrl("/api/1.0/"+WORKSPACE+"/project/"+prj_uid);
            if(PMDesigner.project.isSave === true){
                PMDesigner.msgFlash('Saving Process', document.body, 'success',5000, 5);
            }else{
                PMDesigner.project.isSave = true;
                PMDesigner.project.save(true);
            }
        }
    }, PMDesigner.project.saveInterval);*/
    /*-----  End of Autosave functionality  ------*/

    //Reviewing functionalities
    if (!PMDesigner.supportBrowser("fullscreen")) {
        var li = $(".mafe-button-fullscreen");

        if (li[0]) {
            li[0].parentElement.style.display = "none";
        }
    }


    jQuery('.mafe-zoom-options').attr('title',RIA_I18N.designer.buttonTooltip.zoom).tooltip({tooltipClass: "mafe-action-tooltip"});
    jQuery('.mafe-toolbar-lasso').mouseover(function (e) {
        $('.mafe-toolbar-lasso').css('cursor', 'pointer');
    });
    jQuery('.mafe-toolbar-validation').mouseover(function (e) {
        $('.mafe-toolbar-validation').css('cursor', 'pointer');
    });
    jQuery('.mafe-toolbar-lasso').click(function (e) {/*套索按钮点击事件定义*/
        if (!PMUI.getActiveCanvas().lassoEnabled) {
           // $('.mafe-toolbar-lasso').css('background-color', 'rgb(207, 207, 207)');
        	$('.pmui').css("cursor",'crosshair');
            PMUI.getActiveCanvas().lassoEnabled = true;
        } else {
           // $('.mafe-toolbar-lasso').css('background-color', 'rgb(233, 233, 233)');
        	$('.pmui').css("cursor",'');
            PMUI.getActiveCanvas().lassoEnabled = false;
        }
    });

    if (prj_readonly !== true) {
        $("#idContent").find(".content_controls").show();
        $(".node-panel").show();
        $(".bpmn_shapes").css("height",$('.node-panel').height()-$(".basic-control").height());
        $('.bpmn_shapes_legend').hide();
        $("#idNavBar").show().css('height','33px');
        $("#idNavBar").click(function(){
        	//点击navBar结束流程名称的编辑状态
            var processName=jQuery("div#processName input").val();
            if(processName!==""){
            	PMDesigner.project.setProjectNameOndbclick(processName);
            }
        });
        $('.bpmn_validator').css("width",document.body.clientWidth-8-$('.bpmn_shapes_left_panel').width());
        $('.bpmn_validator').css('left',$('.bpmn_shapes_left_panel').css('width'));
    }else{
    	$(".bpmn_shapes_left_panel").hide();
   	 	$("#idNavBar").hide();
   	 	$(".resourceViewDiv").hide();
    }
//    PMDesigner.getActivityInstInfo() 
});
PMDesigner.primaryPeopleSelectCallBack = function(rtnValue){//name,id|roleOrPerson;name,id|roleOrPerson//role-1,person-0
	var personIDStr = "",//formatted to id,id,id...
		rtnArray = rtnValue.split(';'),
		arrLength = rtnArray.length,
		thisNodeXml = menuNode.getActXml(),
		$_participants;
	
	$(thisNodeXml).find('participants').remove();//不能用empty()，因为初始化的时候，没有participants节点。
	$_participants = $(thisNodeXml).append('<participants></participants>').find('participants');
	
	$.each(rtnArray, function(i, item){     
		var personID = item.split(',')[1].split('|')[0];
		var personOrRole = item.split(',')[1].split('|')[1];//role-1,person-0;
		var xmlStrForAppend = '<Participant authorityType="1" type="'+personOrRole+'" value="'+personID+'"/>';
		$_participants.append(xmlStrForAppend);
	 });
	
	menuNode.setActXml(thisNodeXml);
	 
}
PMDesigner.openPrimaryPeopleSelect = function(item){
	//表单创建服务时，选择手动节点办理人 lv.yz serverform
	var thisNode = item.parent.parent,
	left,top,selectedItem,flag,participants,
	idAndType="";
	PMDesigner.setMenuNode(thisNode);//记录当前操作节点
	left = (window.screen.availWidth - 635) / 2 + 320;
	top = (window.screen.availHeight - 420) / 2;
	participants = $(thisNode.getActXml()).find('Participant');
	if(participants.size()!=0){
		$.each(participants,function(i,item){//name,id|roleOrPerson
			if(i==participants.size()-1){
				idAndType += $(item).attr('value')+","+$(item).attr('type');
			}else{
				idAndType += $(item).attr('value')+","+$(item).attr('type')+";";
			}
		})
	}else{
		idAndType="";
	}
	if(idAndType!=""){
		$.ajax({
	        url:  contextPath + "/workflow/getParticipantsInfo.action",
	        type:"get",
	        data: {
	        	'idAndType':idAndType
	        },
	        async:false,
	        success: function (data){
	        	selectedItem = data;
	        },
	        error: function (xhr, textStatus, errorThrown){
	        	alert("数据请求错误")
	        }
		});
	}
	flag = "formServerDesigner";
	if(selectedItem&&selectedItem.length>4096){
		$.messager.popup(manualNodeMessage.lengthExceedError);
	}else{
		
		openUrl = contextPath
			+ "/workflow/webdesign/attributes/unitorgselect/personselect/reasign.jsp?selectedItem="+encodeURI(selectedItem)+"&flag="+flag;
		$("#openThickBox").attr("title","选择办理人").attr("href",openUrl+"&placeValuesBeforeFB_=savedValues&FB_iframe=true&height=420&width=550&FB_iniframe=true");
		$("#openThickBox").click();
	}
}
//导入回调函数
var importXMLintoBpmn = function(xmlStr){
	PMDesigner.mapForOldIDAndNewID = new Object();
//	var newProjectID = PMUI.generateUniqueId();
//	var importedXmlDom = PMDesigner.strToXml(xmlStr);
	//给变量赋予新ID 
//	var datas = $(importedXmlDom).find('Data');
//	if(datas.length>0){
//		for(var i=0;i<datas.length;i++){
//			$(datas[i]).attr('id',PMUI.generateUniqueId());
//		}
//	}
	//给流程赋予新的userName,time
//	var createTime,user;
//	$.ajax({
//        url: '../workflow/getInitProcess.action',
//        dataType: "json",
//        async: false,
//        success: function (data) {
//        	createTime=data.createTime;
//        	user=data.userName;
//        },
//        error: function () {
//        }
//    }); 
//	$(importedXmlDom).find('Process').attr('builder',user);
//	$(importedXmlDom).find('Process').attr('buildTime',createTime);
	//赋予流程新ID
//	var xmlStrWithNewID = PMDesigner.xmlToStr($(importedXmlDom).find('Process').attr('ID',newProjectID).parent()[0]);
	
	PMDesigner.isFromImported=true;
	jQuery("#div-layout-canvas").empty();//清空画布
	PMDesigner.getNewProject();//给流程设计器一个新的project
	PMDesigner.project.loadProcess(xmlStr);//加载新的xml
}
PMDesigner.resetAllIDs = function(xmlStr){
	PMDesigner.mapForOldIDAndNewID = new Object();
	var newProjectID = PMUI.generateUniqueId();
	var importedXmlDom = PMDesigner.strToXml(xmlStr);
//	给变量赋予新ID 
	var datas = $(importedXmlDom).find('Data');
	var datasIdArray = new Array();
	if(datas.length>0){
		for(var i=0;i<datas.length;i++){
			var oldId = $(datas[i]).attr('id');
			var newId = PMUI.generateUniqueId();
			datasIdArray.push({"oldId":oldId,"newId":newId});
			$(datas[i]).attr('id',newId);
//			$(importedXmlDom).find('Participant').each(function(j,k){
//				if($(k).attr('value')==oldId){
//					$(k).attr('value',newId);
//				}
//			})
		}
	}
//	给流程赋予新的userName,time
	var createTime,user;
	$.ajax({
		url: contextPath+'/workflow/getInitProcess.action',
        dataType: "json",
        async: false,
        success: function (data) {
        	createTime=data.createTime;
        	user=data.userName;
        },
        error: function () {
        }
    }); 
	$(importedXmlDom).find('Process').attr('builder',user);
	$(importedXmlDom).find('Process').attr('buildTime',createTime);
//	赋予流程新ID
	var xmlStrWithNewID = PMDesigner.xmlToStr($(importedXmlDom).find('Process').attr('ID',newProjectID).parent()[0]);
	
	// 替换使用过变量的各种地方
	$(datasIdArray).each(function(i,o){
		xmlStrWithNewID = xmlStrWithNewID.replace(new RegExp(o.oldId,"gm"),o.newId);
	})
	
	
	PMDesigner.isFromCreateByTemplate=true;
	jQuery("#div-layout-canvas").empty();//清空画布
	PMDesigner.getNewProject();//给流程设计器一个新的project
	PMDesigner.project.loadProcess(xmlStrWithNewID);//加载新的xml
}
PMDesigner.getNewProject = function(){//for import progress
	var setSaveButtonDisabled = function (that) {
        if (that.isDirty()) {
             if ($(".mafe-save-process").length > 0) {
                    $(".mafe-save-process")[0].removeAttribute("style");
                    $(".mafe-save-process")[0].childNodes[0].style.color = "#FFF";
                    $(".mafe-save-process")[0].childNodes[0].text = RIA_I18N.designer.button.save;
            }
        } else {
            if ($(".mafe-save-process").length > 0) {
                $(".mafe-save-process")[0].style.backgroundColor = "#e8e8e8";
                $(".mafe-save-process")[0].style.color = "#000";
                $(".mafe-save-process")[0].childNodes[0].style.color = "#000";
                $(".mafe-save-process")[0].childNodes[0].text = RIA_I18N.designer.button.save;
//
//                var mafebuttonMenu = document.getElementsByClassName("mafe-button-menu")[0];
//                mafebuttonMenu.style.backgroundColor = "#e8e8e8";
//                mafebuttonMenu.firstChild.src = contextPath+"/processDesigner/img/caret-down.png";
            }
        }
    };
	var project = new PMProject({//流程定义方法  by siqq
        id: prj_uid,
        name: 'Untitled Process',
        keys: {
            access_token: credentials.access_token,
            expires_in: credentials.expires_in,
            token_type: credentials.token_type,
            scope: credentials.scope,
            refresh_token: credentials.refresh_token,
            client_id: credentials.client_id,
            client_secret: credentials.client_secret
        },
        listeners: {
            create: function (self, element) {
                var sh, i,
                        contDivergent = 0,
                        contConvergent = 0;
                //Updating the background color for connections
                jQuery(".pmui-intersection > div > div").css("background-color", "black");

                if (element.type == "Connection") {
                    ///////////****************Changing the gatDirection*******************//////////////////
                    if (element.relatedObject.srcPort.parent.gat_type === "PARALLEL" ||
                            element.relatedObject.srcPort.parent.gat_type === "INCLUSIVE" ||
                            element.relatedObject.destPort.parent.gat_type === "PARALLEL" ||
                            element.relatedObject.destPort.parent.gat_type === "INCLUSIVE") {
                        if (element.relatedObject.srcPort.parent.gat_type !== undefined) {
                            sh = element.relatedObject.srcPort.parent;
                        } else {
                            sh = element.relatedObject.destPort.parent;
                        }
                        if (sh.gat_direction === "DIVERGING") {
                            for (i = 0; i < sh.ports.asArray().length; i += 1) {
                                if (sh.ports.asArray()[i].connection.flo_element_origin_type === "bpmnActivity") {
                                    contDivergent++;
                                }
                                if (contDivergent > 1) {
                                    sh.gat_direction = "CONVERGING";
                                    i = sh.ports.asArray().length;
                                }
                            }
                        }
                        if (sh.gat_direction === "CONVERGING") {
                            for (i = 0; i < sh.ports.asArray().length; i += 1) {
                                if (sh.ports.asArray()[i].connection.flo_element_origin_type === "bpmnGateway") {
                                    contConvergent++;
                                }
                                if (contConvergent > 1) {
                                    sh.gat_direction = "DIVERGING";
                                    i = sh.ports.asArray().length;
                                }
                            }
                        }

                    }
                }
                setSaveButtonDisabled(self);
            },
            update: function (self) {
                jQuery(".pmui-intersection > div > div").css("background-color", "black");
                setSaveButtonDisabled(self);
            },
            remove: function (self) {
                setSaveButtonDisabled(self);
            },
            success: function (self, xhr, response) {
                var message;
                self.dirty = false;
                setSaveButtonDisabled(self);
                self.updateIdentifiers(response);
                PMDesigner.connectValidator.bpmnValidator();
                PMDesigner.msgFlash(RIA_I18N.designer.buttonTooltip.saveSucess, document.body, 'success', 3000, 5);

            },
            failure: function (self, xhr, response) {
            	setSaveButtonDisabled(self);
                var message;
                PMDesigner.msgFlash(RIA_I18N.designer.buttonTooltip.saveFailure, document.body, 'error', 3000, 5);
                self.updateIdentifiers(response);
            }
        }
    });
    PMDesigner.project = project;
}
PMDesigner.getActivityInstInfo = function(){
	 if(patternFlag && patternFlag=="Monitor"){
	    	$.ajax({
				type : "get",
				url : contextPath + "/workflow/getActInstStateByProcInstID.action",
				async : false,
				dataType:"json",
				data : {
					"procInstID":proc_inst_id
				},
				success : function(data) {
					PMDesigner.setColorToProcessMonitor(data);
//					PMDesigner.showDynamicBranch(data[1]);
				},
				error : function() {
					parent.PMDesigner.msgFlash("获取节点实例信息出错", 'error',5000, 5);  
				}
			})
	    	
	    }
}
PMDesigner.showDynamicBranch = function(element,branchInfos){
	var menu={
			id:"parallel",
			width:150,
			items:[]
	};
	var j=0;
	for(var i=0; i<branchInfos.length; i++){	
		var branchinfo=branchInfos[i];
		if(element.id===branchinfo.parallelDefId){
			menu.items.push(PMDesigner.createMenuItem(branchinfo));
		}
	}
	element.setContextMenu(menu);
}
PMDesigner.createMenuItem=function(branchinfo){
	var item={
            id: branchinfo.branchInstId,
            text: branchinfo.branchInstTitle,
            onClick: function (menuOption) {
            	PMDesigner.changeActivityState(menuOption.getMenuTargetElement(),branchinfo.info);
            }
        };
	return item;
}

PMDesigner.changeActivityState=function(parallel,branchinfo){
	var branchChildrens=branchinfo.split(";");
	var parallelChildrens=parallel.children;
	for(var i=0;i<branchChildrens.length;i++){
		var branchChildrenInfo=branchChildrens[i].split(",")
		var activityStateInfo={
			current_state:branchChildrenInfo[2],
			activity_ins_id:branchChildrenInfo[1]
		}
		for(var j=0;j<parallelChildrens.getSize();j++){
			if(parallelChildrens.get(j).id === branchChildrenInfo[0]){
				PMDesigner.setColorToActivity(parallelChildrens.get(j),activityStateInfo);
			}
		}
	}
}

PMDesigner.setColorToProcessMonitor = function(processMonitorInfo){
	
	var diagram = PMDesigner.project.diagrams.get(0);
	var elements = diagram.getCustomShapes().asArray();
	var data=processMonitorInfo[0];
	//遍历节点，根据状态，加上颜色，并且给节点的xml加上对应的instId
	for (var i = 0; i < elements.length; i++) {
		if(elements[i].type=="PMActivity"){
			for(var j=0;j<data.length;j++){
				if(data[j].activity_tmp_id==elements[i].getActivityUid()){
					PMDesigner.setColorToActivity(elements[i],data[j]);
				}
			}
			if(!$(elements[i].act_xml).attr('instID')){
				$(elements[i].act_xml).attr('instID','');
			}
			if(!$(elements[i].act_xml).attr('state')){
				$(elements[i].act_xml).attr('state','-1');
			}
		}
		if(elements[i].type=="PMParallel"){
			PMDesigner.showDynamicBranch(elements[i],processMonitorInfo[1]);
		}
	}
}
PMDesigner.setColorToActivity = function(element,activityStateInfo){
	switch(activityStateInfo.current_state){
	case '0': //初始态
		element.setNodeState("default");
	break;
	case '1'://运行态
		element.setNodeState("running");
	break;
	case '2'://激活态
		element.setNodeState("active");
	break;
	case '3'://挂起态
		element.setNodeState("hangup");
	break;
	case '4'://完成态
		element.setNodeState("finished");
	break;
	case '5'://终止态
		element.setNodeState("ended");
	break;
	default:
		element.setNodeState("default");
	}
	$(element.act_xml).attr('instID',activityStateInfo.activity_ins_id);
	$(element.act_xml).attr('state',activityStateInfo.current_state);
}
PMDesigner.validateAllObjects = function(wantRtrn){
	/**
	 * 具体的前台校验转移到了getDirtyObjectXml() 中
	 * */ 
	$('.custom_validator').empty();
	var dirtyObject = PMDesigner.project.getDirtyObjectXml();
    var xmlStr=PMDesigner.xmlToStr(dirtyObject);
//	PMDesigner.xmlValidateServer(xmlStr);
	if($('.custom_validator>.custom_validator_row').size()>0){//有错误
    	$(PMDesigner.project.processXml).find('Process').attr('iscompleted','0');
    }else{
    	$(PMDesigner.project.processXml).find('Process').attr('iscompleted','1');
    }
	$('.custom_validator>.custom_validator_row').unbind("click").click(function(){
		//点击校验的一行时 lv.yz
        var id = $(this).children().eq(1).text();
        var shape;
        if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
            PMUI.getActiveCanvas().emptyCurrentSelection();
        }
        else {
            $('.custom_validator_row.selected').removeClass('selected');
            $(this).addClass('selected');
            PMUI.getActiveCanvas().emptyCurrentSelection();
            shape = PMUI.getActiveCanvas().items.find('id', id);
            if(shape){//当错误类型属于流程时，找不到shape
            	PMUI.getActiveCanvas().addToSelection( shape.relatedObject);
            }
        }
	});
	//构造外部校验接口返回值//dante
	if(wantRtrn === true){
		var rtnArray = new Array();
		for(var i=0;i<$('.custom_validator>.custom_validator_row').size();i++){
			var innerArray = new Array();
			var item = $('.custom_validator_row > .message-info')[i];
			innerArray.push("");
			innerArray.push($(item).next().text());//id
			innerArray.push($(item).text());
			rtnArray.push(innerArray);
		}
		return rtnArray;
	}
}
window.onload = function () {
    //Reset the scroll positions
    window.scrollBy(-window.scrollX, -window.scrollY);
    document.onkeydown = function (e) {
        if (e.keyCode === 8 && e.target === document.body) {
            e.stopPropagation();
            return false;
        }
    };
};
/*==================================================
 =            Components from the Panels            =
 ==================================================*/
/* 在右侧process objects面板上添加最小化、刷新按钮及点击事件 */
PMDesigner.createHTML = function () {
	
    //var minShapes = document.createElement("span"),
        var minShapesLegend = document.createElement("span"),
           // refreshShapes = document.createElement("span"),
            minControls = document.createElement("span"),
            processObjects = document.createElement("span"),
            refreshControls = document.createElement("span"),
            refreshNavBar = document.createElement("span");
    //minShapes.id = "minShapes";
    minShapesLegend.id = "minShapesLegend";
    //refreshShapes.id = "resetShapes";
    minControls.id = "minControls";
    refreshControls.id = "resetControls";
    refreshNavBar.id = "resetNavBar";
    //minShapes.className = "mafe-shapes-toggle";
    minShapesLegend.className = "mafe-shapes-toggle";
   // refreshShapes.className = "mafe-shapes-refresh";
    minControls.className = "mafe-shapes-toggle";
    processObjects.className = "mafe-process-object";
    refreshControls.className = "mafe-shapes-refresh";
    refreshNavBar.className = "mafe-shapes-refresh";
   // minShapes.title = "Minimize";
    minShapesLegend.title = "Minimize";
   // refreshShapes.title = "reset";
    minControls.title = "Minimize";
    refreshControls.title = "Reset to original position";
    refreshNavBar.title = "reset";

   // jQuery(minShapes).tooltip({tooltipClass: "mafe-action-tooltip"});
    jQuery(minShapesLegend).tooltip({tooltipClass: "mafe-action-tooltip"});
   // jQuery(refreshShapes).tooltip({tooltipClass: "mafe-action-tooltip"});
    jQuery(minControls).tooltip({tooltipClass: "mafe-action-tooltip"});
    jQuery(refreshControls).tooltip({tooltipClass: "mafe-action-tooltip"});
    jQuery(refreshNavBar).tooltip({tooltipClass: "mafe-action-tooltip"});

    refreshControls.style.backgroundPosition ='0px 0px';
    processObjects.textContent = "Process Objects";

//    minShapes.onclick = function () {
//    	
//        var i,
//                items = jQuery(".bpmn_shapes > ul");
//        if (items.length > 0) {
//            for (i = 0; i < items.length; i += 1) {
//                if (jQuery(items[i]).css("display").toLowerCase() !== "none") {
//                    jQuery(items[i]).css({
//                        display: 'none'
//                    });
//                } else {
//                    jQuery(items[i]).css({
//                        display: 'block'
//                    });
//                }
//
//            }
//        }
//    };
    minShapesLegend.onclick = function () {
        var i;
        var items = jQuery(".bpmn_shapes_legend").children();
        for (i = 1; i < items.length; i++) {
            if (jQuery(items[i]).css("display").toLowerCase() !== "none") {
                jQuery(items[i]).css({
                    display: 'none'
                });
            } else {
                jQuery(items[i]).css({
                    display: 'block'
                });
            }
        }
    };
//    refreshShapes.onclick = function () {
//        jQuery(".bpmn_shapes").removeAttr('style');
//        if (Modernizr.localstorage) {
//            PMDesigner.localStorage.remove("bpmn");
//        } else {
//            PMDesigner.cookie.remove("bpmn");
//        }
//    };
    minControls.onclick = function () {
        var i,
            title = '',
            items = jQuery(".content_controls > ul");

        if (items.length > 0) {
            for (i = 0; i < items.length; i += 1) {
                if (jQuery(items[i]).css("display").toLowerCase() !== "none") {
                    jQuery(items[i]).css({
                        display: 'none'
                    });
                    title = "Maximize";
                    $('#minControls').removeClass('mafe-shapes-toggle');
                    $('#minControls').addClass('mafe-shapes-plus');
                } else {
                    jQuery(items[i]).css({
                        display: 'block'
                    });
                    title = "Minimize";
                    $('#minControls').removeClass('mafe-shapes-plus');
                    $('#minControls').addClass('mafe-shapes-toggle');

                }
            }
        }
        jQuery(minControls).tooltip({content: title});
    };
    refreshControls.onclick = function () {
        jQuery(".content_controls").css({
            left : "auto",
            right : "20px",
            top : "90px"
        });
        if (Modernizr.localstorage) {
            PMDesigner.localStorage.remove("controls");
        } else {
            PMDesigner.cookie.remove("controls");
        }
    };
    refreshNavBar.onclick = function () {
        jQuery(".navBar").removeAttr('style');
        if (Modernizr.localstorage) {
            PMDesigner.localStorage.remove("navbar");
        } else {
            PMDesigner.cookie.remove("navbar");
        }
    };

  //  jQuery(".bpmn_shapes>div").append(minShapes);
    //jQuery(".bpmn_shapes>div").append(refreshShapes);
    jQuery(".content_controls>div").append(processObjects);
    jQuery(".content_controls>div").append(minControls);
    jQuery(".content_controls>div").append(refreshControls);
    jQuery(".navBar>div").append(refreshNavBar);
    jQuery(".bpmn_shapes_legend>div").append(minShapesLegend);
    jQuery(".bpmn_shapes, .content_controls").on("contextmenu", function (e) {
        e.preventDefault();
    });

    PMDesigner.applyCanvasOptions();

};

/*-----  End of Components from the Panels  ------*/

/*=====================================================
 =            Get information about browser            =
 =====================================================*/
PMDesigner.getBrowser = function () {
    var match,
            ua = navigator.userAgent.toLowerCase();
    if (ua) {
        match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
                /(webkit)[ \/]([\w.]+)/.exec(ua) ||
                /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
                /(msie) ([\w.]+)/.exec(ua) ||
                ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
                [];

        return {
            browser: match[ 1 ] || "",
            version: match[ 2 ] || "0"
        };
    }
};
/*-----  End of Get information about browser  ------*/

PMDesigner.supportBrowser = function (functionality) {
    var browser, el, module;
    functionality = functionality.toLowerCase();
    switch (functionality) {
        case "fullscreen":
            browser = PMDesigner.getBrowser();
            if ((browser.browser === "msie") && (parseInt(browser.version, 10) <= 10)) {
                try {
                    module = new ActiveXObject("WScript.Shell");
                } catch (e) {
                    module = false;
                }
            } else {
                el = document.documentElement;
                module = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen;
                if (!module) {
                    module = false;
                }
            }
            break;
        case "":
            break;
    }
    return module;
};

/*============================================================
 =            Leave the current page Functionality            =
 ============================================================*/
window.onbeforeunload = function (e) {
    var message;
    if(patternFlag=="Designer" && PMDesigner.project.isDirty()
        && PMDesigner.project.isClose == false
        && PMDesigner.project.isSave == false) {
    	
        message = RIA_I18N.designer.msg.sureToExist;
        e = e || window.event;
        if (e) {
            e.returnValue = message;
        }
        return message;
    }
};
/*-----  End of Leave the current page Functionality  ------*/

/*=====================================================================
 =            Validating coordinates for create a new shape            =
 =====================================================================*/
PMUI.validCoordinatedToCreate = function (canvas, event, shape) {
    var position, p, width, height, createElem = true, panels = [], message;
    //navBar panel
    position = jQuery(".navBar").offset();
    width = jQuery(".navBar").width();
    height = jQuery(".navBar").height();
    element = {
        x1: position.left,
        y1: position.top,
        x2: position.left + width,
        y2: position.top + height
    };
    panels.push(element);
    //BPMN panel
    position = jQuery(".bpmn_shapes").offset();
    width = jQuery(".bpmn_shapes").width();
    height = jQuery(".bpmn_shapes").height();
    element = {
        x1: position.left,
        y1: position.top,
        x2: position.left + width,
        y2: position.top + height
    };
    
    if (panels.length > 0) {
        for (p = 0; p < panels.length; p += 1) {
            if (((event.pageX >= panels[p].x1) && (event.pageX <= panels[p].x2))
                    && ((event.pageY >= panels[p].y1) && (event.pageY <= panels[p].y2))) {
                PMDesigner.msgFlash('Is not possible create the element in that area', document.body, 'info', 3000, 5);
                return false;
            }
        }
    }

    return true;
};
/*-----  End of Validating coordinates for create a new shape  ------*/

PMUI.pageCoordinatesToShapeCoordinates = function (shape, e, xCoord, yCoord, customShape) {
    var coordinates,
            x = (!xCoord) ? e.pageX : xCoord,
            y = (!yCoord) ? e.pageY : yCoord,
            orgX = (!xCoord) ? e.pageX : xCoord,
            orgY = (!yCoord) ? e.pageY : yCoord,
            canvas = shape.getCanvas();
    x += canvas.getLeftScroll() - shape.getAbsoluteX() - canvas.getX();
    y += canvas.getTopScroll() - shape.getAbsoluteY() - canvas.getY();
    
    coordinates = new PMUI.util.Point(x, y);
    return coordinates;
};

PMDesigner.msgFlash = function (text, container, severity, duration, zorder) {

        var msg;
        if (!PMDesigner.currentMsgFlash) {
            msg = new PMUI.ui.FlashMessage({
                id: '__msgFlashMessage',
                severity: 'success'
            });
        } else {
            msg = PMDesigner.currentMsgFlash;
        }
        if(msg.html)
            jQuery(msg.html).remove();
        msg.setMessage(text||"");
        msg.setAppendTo(container||document.body);
        msg.setSeverity(severity||"success");
        msg.setDuration(duration||3000);
        msg.setZOrder(zorder||100);
        msg.show();
        PMDesigner.currentMsgFlash = msg;
};

PMDesigner.msgWinError = function (text) {

    var msgError;
    if (!PMDesigner.currentWinError) {
        msgError = new PMUI.ui.MessageWindow({
            id: 'showMessageWindowFailure',
            width: 490,
            windowMessageType: 'error',
            title: 'Error',
            footerItems: [
                {
                    text: 'Ok',
                    handler: function () {
                        msgError.close();
                    },
                    buttonType : "success"
                }
            ]
        });
    } else {
        msgError = PMDesigner.currentWinError;
    }
    msgError.setMessage(text || 'Error');
    msgError.showFooter();
    msgError.open();
    PMDesigner.currentWinError = msgError;
};

PMDesigner.msgWinWarning = function (text) {

    var msgWarning;
    if (!PMDesigner.currentWinWarning) {
        msgWarning = new PMUI.ui.MessageWindow({
            id: 'showMessageWindowWarning',
            windowMessageType: 'warning',
            width: 490,
            title: 'Warning',
            footerItems: [{
                text: 'Ok',
                buttonType : "success", handler: function () {
                        msgWarning.close();
                    }}]
        });
    } else {
        msgWarning = PMDesigner.currentWinWarning;
    }
    msgWarning.setMessage(text || 'Warning');
    msgWarning.showFooter();
    msgWarning.open();
    PMDesigner.currentWinWarning = msgWarning;
};


PMDesigner.modeReadOnly = function () {
    if (prj_readonly === 'true') {
        var restClient = new PMRestClient({
            typeRequest: 'post',
            multipart: true,
            data: {
                calls: [{
                        url: 'cases/' + app_uid + '/tasks',
                        method: 'GET'
                    }
                ]
            },
            functionSuccess: function (xhr, response) {
                var viewTaskInformation = new ViewTaskInformation();
                viewTaskInformation.setData(response[0].response);
                viewTaskInformation.setShapes();
                viewTaskInformation.showViewLegendsInformation();
            },
            functionFailure: function (xhr, response)
            {
                PMDesigner.msgWinError(response.error.message);
            }
        });
        restClient.setBaseEndPoint('');
        restClient.executeRestClient();
    }
};

PMDesigner.reloadDataTable = function () {
    $('.validator_body').css('display', 'block');
    var $_downbutton = $('.validator_header').children().eq(0);
    if(!$_downbutton.hasClass("down-expand")){
    	$_downbutton.addClass("down-expand");
    }
//    if(!PMDesigner.validTableDrawed){
//   		PMDesigner.validTableDrawed = true;
//	 }
    PMDesigner.validateAllObjects(false);
};

var DataDictionary = function () {
};
DataDictionary.prototype.getColor = function (value) {
    switch (value) {
        case 'TASK_IN_PROGRESS':
            return 'red';
        case 'TASK_COMPLETED':
            return 'green';
        case 'TASK_PENDING_NOT_EXECUTED':
            return 'silver';
        case 'TASK_PARALLEL':
            return 'orange';
        default:
            return 'white';
    }
};
DataDictionary.prototype.getStatus = function (value) {
    switch (value) {
        case 'TASK_IN_PROGRESS':
            return 'Task in Progress';
        case 'TASK_COMPLETED':
            return 'Completed Task';
        case 'TASK_PENDING_NOT_EXECUTED':
            return 'Pending Task / Not Executed';
        case 'TASK_PARALLEL':
            return 'Parallel Task';
        default:
            return value;
    }
};
DataDictionary.prototype.getTasAssignType = function (value) {
    switch (value) {
        case 'BALANCED':
            return 'Balanced';
        case 'MANUAL':
            return 'Manual';
        case 'REPORT_TO':
            return 'Report toO';
        case 'EVALUATE':
            return 'Evaluate';
        case 'SELF_SERVICE':
            return 'self Service';
        case 'SELF_SERVICE_EVALUATE':
            return 'Self Service Evaluate';
        default:
            return value;
    }
};
DataDictionary.prototype.getTasType = function (value) {
    switch (value) {
        case 'NORMAL':
            return 'Normal';
        case 'SUBPROCESS':
            return 'Sub Process';
        default:
            return value;
    }
};
DataDictionary.prototype.getTasDerivation = function (value) {
    switch (value) {
        case 'NORMAL':
            return 'Normal';
        default:
            return value;
    }
};

var ViewTaskInformation = function (settings) {
    ViewTaskInformation.prototype.init.call(this, settings);
};
ViewTaskInformation.prototype.init = function () {
    var that = this;
    var panelButton = new PMUI.core.Panel({
        layout: 'hbox',
        items: [
            that.getButton('Information', function () {
                that.showInformation();
            }),
            that.getButton('Delegations', function () {
                that.showDelegations();
            }),
            that.getButton('Route', function () {
                that.showRoute();
            })
        ]
    });
    that.windowAbstract.showFooter();
    that.windowAbstract.addItem(panelButton);
    that.windowAbstract.addItem(that.panelvertical);
};
ViewTaskInformation.prototype.dataDictionary = new DataDictionary();
ViewTaskInformation.prototype.data = null;
ViewTaskInformation.prototype.shapeData = null;
ViewTaskInformation.prototype.panelvertical = new PMUI.core.Panel({layout: 'vbox', width: 400});
ViewTaskInformation.prototype.windowAbstract = new PMUI.ui.Window({id: 'windowAbstract', width: 500, height: 350});
ViewTaskInformation.prototype.setData = function (data) {
    this.data = data;
};
ViewTaskInformation.prototype.setCursor = function (shape) {
    shape.getHTML().onmouseover = function () {
        this.style.cursor = 'pointer';
    };
    shape.getHTML().onmouseout = function () {
        this.style.cursor = '';
    };
};
ViewTaskInformation.prototype.setShapes = function () {
    var that = this;
    var shape;
    var dt = that.data;
    for (var i = 0; i < dt.length; i++) {
        var diagrams = PMDesigner.project.diagrams.asArray();
        for (var j = 0; j < diagrams.length; j++) {
            shape = diagrams[j].getCustomShapes().find('id', dt[i].tas_uid);
            if (typeof shape != "undefined" && shape != null) {
                shape.changeColor(that.dataDictionary.getColor(dt[i].status));
                shape.data = dt[i];
                shape.hasClick = function (event) {
                    that.setShapeData(this.data);
                    that.showInformation();
                };
                that.setCursor(shape);
            }
        }
    }
};
ViewTaskInformation.prototype.setShapeData = function (data) {
    this.shapeData = data;
};
ViewTaskInformation.prototype.addRowNewLine = function (label, value) {
    var panelhorizontal = new PMUI.core.Panel({
        layout: 'hbox'
    });
    panelhorizontal.addItem(new PMUI.ui.TextLabel({text: ''}));
    this.panelvertical.addItem(panelhorizontal);
    return panelhorizontal;
};
ViewTaskInformation.prototype.addRow = function (label, value) {
    var field1, field2, field3;

    field1 = new PMUI.ui.TextLabel({text: label, proportion: 0.3});
    field2 = new PMUI.ui.TextLabel({text: ':', proportion: 0.1});
    field3 = new PMUI.ui.TextLabel({text: value ? value + '' : '', proportion: 0.6});

    var panelhorizontal = new PMUI.core.Panel({
        layout: 'hbox'
    });

    panelhorizontal.addItem(field1);
    panelhorizontal.addItem(field2);
    panelhorizontal.addItem(field3);
    this.panelvertical.addItem(panelhorizontal);
    return panelhorizontal;
};
ViewTaskInformation.prototype.clearRows = function () {
    this.panelvertical.clearItems();
};
ViewTaskInformation.prototype.showInformation = function () {
    var that = this;
    that.clearRows();
    that.addRow('Title', that.shapeData.tas_title);
    that.addRow('Description', that.shapeData.tas_description);
    that.addRow('Status', that.dataDictionary.getStatus(that.shapeData.status));
    that.addRow('Type', that.dataDictionary.getTasType(that.shapeData.tas_type));
    that.addRow('Assign type', that.dataDictionary.getTasAssignType(that.shapeData.tas_assign_type));
    that.addRow('Derivation', that.dataDictionary.getTasDerivation(that.shapeData.tas_derivation));
    that.addRow('Start', that.shapeData.tas_start);
    that.addRowNewLine();
    that.addRow('User Name', that.shapeData.usr_username);
    that.addRow('User', that.shapeData.usr_firstname + ' ' + that.shapeData.usr_lastname);

    that.windowAbstract.setTitle('Information' + ' ' + that.shapeData.tas_title);
    that.windowAbstract.open();
    that.windowAbstract.body.style.padding = '20px';
};
ViewTaskInformation.prototype.showDelegations = function () {
    var that = this, i, dt;
    that.clearRows();
    dt = that.shapeData.delegations;
    for (i = 0; i < dt.length; i++) {
        that.addRow('User', dt[i].usr_username);
        that.addRow('User Name', dt[i].usr_firstname + ' ' + dt[i].usr_lastname);
        that.addRow('Duration', dt[i].del_duration);
        that.addRow('Finish Date', dt[i].del_finish_date);
        that.addRow('Index', dt[i].del_index);
        that.addRow('Init Date', dt[i].del_init_date);
        that.addRow('Task Due Date', dt[i].del_task_due_date);
        that.addRowNewLine();
    }

    that.windowAbstract.setTitle('Delegations' + ' ' + that.shapeData.tas_title);
    that.windowAbstract.open();
    that.windowAbstract.body.style.padding = '20px';
};
ViewTaskInformation.prototype.showRoute = function () {
    var that = this, i, dt;
    that.clearRows();
    that.addRow('Type', that.shapeData.route.type);
    that.addRowNewLine();
    dt = that.shapeData.route.to;
    for (i = 0; i < dt.length; i++) {
        that.addRow('Condition', dt[i].rou_condition);
        that.addRow('Number', dt[i].rou_number);
        that.addRowNewLine();
    }

    that.windowAbstract.setTitle('Route' + ' ' + that.shapeData.tas_title);
    that.windowAbstract.open();
    that.windowAbstract.body.style.padding = '20px';
};
ViewTaskInformation.prototype.getButton = function (text, fn) {
    return new PMUI.ui.Button({
        text: text,
        width: 180,
        height: 50,
        style: {
            cssProperties: {
                marginRight: 10,
                marginBottom: 10,
                backgroundColor: '#474747',
                borderRadius: 5,
                padding: 5
            },
            cssClasses: ['mafeButton']
        },
        handler: fn
    });
};
ViewTaskInformation.prototype.showViewLegendsInformation = function () {
    $('.bpmn_shapes_legend').show();

    var i;
    var dt = [
        ['red', 'Task in Progress'],
        ['green', 'Completed Task'],
        ['silver', 'Pending Task / Not Executed'],
        ['orange', 'Parallel Task']
    ];
    for (i = 0; i < dt.length; i++) {
        var legend = $("<div></div>");
        var legendIcon = $("<div></div>").addClass("mafe-activity-task-" + dt[i][0]).addClass("icon-legend");
        var legendText = $("<div>" + dt[i][1] + "</div>").addClass("text-legend");
        legend.append(legendIcon).append(legendText);
        jQuery(".bpmn_shapes_legend").append(legend);
    }

    jQuery(".bpmn_shapes_legend").draggable({
        handle: "div",
        start: function(){
        },
        drag: function(event,e,u){
        },
        stop: function(event){

        }
    });
};

(function () {
	
    PMDesigner.getMenuFactory = function (type) {
        if (prj_readonly === 'true') {
            return {};
        }

        var menuMessages={
            'START':{
                'TIMER': 'Please configure cron to create cases.',
                'CONDITIONAL' : 'Please configure cron to create cases in base to a condition.',
                'SIGNALCATCH' : 'Please configure cron to create cases in base to a signal.'
            },
            'INTERMEDIATE':{
                'CATCH':{
                    'TIMER' : 'Please configure cron to wait for time event.',
                    'CONDITIONAL' : 'Please configure cron to wait for time condition.',
                    'SIGNALCATCH' : 'Please configure script to wait for a signal.'
                },
                'THROW':{
                    'SIGNALTHROW' : 'Please configure a script to send a signal.'
                }                
            },
            'END':{
                'ERRORTHROW' : 'Please configure script to end with error status.',
                'SIGNALTHROW' : 'Please configure script to send a signal.',
                'TERMINATETHROW' : 'Please configure script to terminate case.'
            }          
        };

        var menu = {},rootMenu,
            elementActivite;
        if(patternFlag=='Monitor'||patternFlag=='PrvView'){//监控或表单授权的时候，右键不显示属性菜单按钮
        	switch (type) {
            case 'CANVAS':
                menu = {
                    id: "menuCanvas",
                    width: 150,
                    items: [
                        {
                            id: "menuGridLines",
                            text: RIA_I18N.designer.properties.enableGridLine,
                            onClick: function () {
                                var canvas = PMUI.getActiveCanvas();
                                if(canvas.toogleGridLine()){
                                    this.setText(RIA_I18N.designer.properties.disableGridLine);
                                }else{
                                    this.setText(RIA_I18N.designer.properties.enableGridLine);
                                }
                            }
                        }                   
                    ],
                    onShow: function (menu) {
                        if (PMUI.getActiveCanvas().currentConnection) {
                            PMUI.getActiveCanvas().currentConnection.hidePortsAndHandlers();
                        }
                    }
                };
                break;
        	}
        }else if(patternFlag=='FormServerDesigner' || patternFlag=='CreateByTemplate'){
        	switch (type) {
            case 'CANVAS':
            	menu = {
                    id: "menuCanvas",
                    width: 150,
                    items: [
                        {
                            id: "menuEditProcess",
                            text: RIA_I18N.designer.properties.processProper,
                            onClick: function (menuOption) {
                            	var processXmlStr = menuOption.getMenuTargetElement().project.processXml;
                            	var projectId=menuOption.getMenuTargetElement().project.projectId;
                            	var ids = "Process,"+projectId+";";
                            	PMDesigner.setMenuNode(menuOption.getMenuTargetElement().project);
                            	PMDesigner.sendDataToJsp(processXmlStr,ids);
                            }
                        },
                        
                        {
                            id: "menuGridLines",
                            text: RIA_I18N.designer.properties.enableGridLine,
                            onClick: function () {
                                var canvas = PMUI.getActiveCanvas();
                                if(canvas.toogleGridLine()){
                                    this.setText(RIA_I18N.designer.properties.disableGridLine);
                                }else{
                                    this.setText(RIA_I18N.designer.properties.enableGridLine);
                                }
                            }
                        }                   
                    ],
                    onShow: function (menu) {
                        if (PMUI.getActiveCanvas().currentConnection) {
                            PMUI.getActiveCanvas().currentConnection.hidePortsAndHandlers();
                        }
                    }
                };
                break;
        	}
        }else{
        	switch (type) {
            case 'CANVAS':
        	 menu = {
                     id: "menuCanvas",
                     width: 150,
                     items: [
                         {
                             id: "menuEditProcess",
                             text: RIA_I18N.designer.properties.processProper,
                             onClick: function (menuOption) {
                             	var processXmlStr = menuOption.getMenuTargetElement().project.processXml;
                             	var projectId=menuOption.getMenuTargetElement().project.projectId;
                             	var ids = "Process,"+projectId+";";
                             	PMDesigner.setMenuNode(menuOption.getMenuTargetElement().project);
                             	PMDesigner.sendDataToJsp(processXmlStr,ids);
                             }
                         },
                         
                         {
                             id: "menuGridLines",
                             text: RIA_I18N.designer.properties.enableGridLine,
                             onClick: function () {
                                 var canvas = PMUI.getActiveCanvas();
                                 if(canvas.toogleGridLine()){
                                     this.setText(RIA_I18N.designer.properties.disableGridLine);
                                 }else{
                                     this.setText(RIA_I18N.designer.properties.enableGridLine);
                                 }
                             }
                         }                   
                     ],
                     onShow: function (menu) {
                         if (PMUI.getActiveCanvas().currentConnection) {
                             PMUI.getActiveCanvas().currentConnection.hidePortsAndHandlers();
                         }
                     }
                 };
                 break;
            case 'TASK':
            case 'SUB_PROCESS':
            case 'AUTO_TASK':
            	menu={
            		id: "menuTask",
            		width: 150,
            		items: [
            		    {
	            			id: "menuAddTaskTemplate",
	                        text: RIA_I18N.designer.properties.addTaskTemplate, 
	                        icon: "mafe-menu-add-template-action",
	                        onClick: function (menuOption) {
	                        	var nodeXmlStr=PMDesigner.xmlToStr(menuOption.getMenuTargetElement().getActXml());
	                        	var actId=menuOption.getMenuTargetElement().getActivityUid();
	                        	var actType = menuOption.getMenuTargetElement().getActivityType();
	                        	document.getElementsByTagName('iframe')[0].contentWindow.addNodeTemplate(actId,actType,nodeXmlStr);
	                        }
            		    },
            		    {
            		    	id: "menuChangeTaskIcon",
	                        text: RIA_I18N.designer.properties.changeTaskIcon, 
	                        icon: "mafe-menu-change-icon-action",
	                        onClick: function (menuOption) {
	                        	var openUrl=contextPath+"/workflow/processDesigner/nodeIconModify/setTaskIcon.html?theme=" + theme;
	                        	//PMDesigner.showPopupDialog("popupDiv","节点图标修改",openUrl,"450","200");
	                        	$('#popupDiv').wDialog({
	                        	    modal:true,
	                        	    iframe:true,
	                        	    title:RIA_I18N.designer.dialogTitle.updateIcon,
	                        	    width:450+'px',
	                        	    height:350+'px',
	                        	    loadUrl:openUrl,
	                        	    confirm:function(){
	                        	    	var icon=window.frames[1].submit_onclick(menuOption.getMenuTargetElement());
	                        	    	menuOption.getMenuTargetElement().setActIcon(icon);
	                        	    	var project=PMDesigner.project;
	                        	    	project.setDirty(true);
	                        	    	project.setSaveButtonDisabled();
	                        	    }
	                        	});
	                        }
            		    },
            		    {
            		    	id: "menuDeleteTask",
	                        text: RIA_I18N.designer.properties.deleteTask, 
	                        icon: "mafe-menu-delete-action",
	                        onClick: function (menuOption) {
	                        	PMUI.getActiveCanvas().removeElements();
	                        }
            		    },
            		    {
	            			id: "menuTaskProperties",
	                        text: RIA_I18N.designer.properties.taskProperties, 
	                        icon: "mafe-menu-properties-action",
	                        onClick: function (menuOption) {
	                        	var menuNodeDom=menuOption.getMenuTargetElement().getActXml();             	           
	                        	var menuNodeId=menuOption.getMenuTargetElement().getActivityUid();
	                        	//取出当前节点的xmlString，转化为dom，加入到process对象的xml中，传给属性页面。
	                        	var processXml=PMDesigner.getProcessXml(1,menuNodeDom);
	                        	if(type==="TASK")
	                        		ids="1,"+menuNodeId;
	                        	else if(type==="SUB_PROCESS")
	                        		ids="2,"+menuNodeId;
	                        	else if(type==="AUTO_TASK")
	                        		ids="0,"+menuNodeId;
	                        	PMDesigner.setMenuNode(menuOption.getMenuTargetElement());
	                        	PMDesigner.sendDataToJsp(processXml,ids);
	                        }
            		    }
            		],
            		onShow: function (menu) {
            			 var targetElement = menu.getTargetElement();
                         PMUI.getActiveCanvas().emptyCurrentSelection();
                         PMUI.getActiveCanvas().addToSelection(targetElement);
                         PMUI.getActiveCanvas().hideDragConnectHandlers();
                         PMUI.getActiveCanvas().hideAllFocusLabels();
                         if (PMUI.getActiveCanvas().currentConnection) {
                             PMUI.getActiveCanvas().currentConnection
                                 .hidePortsAndHandlers();
                         }
                     }
            	};
            	if(type==='SUB_PROCESS'){
            		var openSubProcess={
            			id: "openSubProcess",
	                    text: RIA_I18N.designer.properties.openSubProcess, 
	                    onClick: function (menuOption) {
	                    	var nodeXml=menuOption.getMenuTargetElement().getActXml();
	                    	var subProcessId=$(nodeXml).find("subProc").attr("processID");
	                    	var subProcessVersion=$(nodeXml).find("subProc").attr("versionName");
	                    	if(subProcessId==''||subProcessId==undefined)
	                    		PMDesigner.msgFlash(RIA_I18N.designer.msg.bindSubProcess,document.body, 'error',5000, 5);
	                    	else
	                    		window.open(contextPath+"/bsdesign.do?selectedID="+subProcessId+"&selectedVersion="+subProcessVersion+"&needCreatRole=''&pattern=Designer");
	                    }	
            		}
            		menu.items.push(openSubProcess);
            	}
            	break;
            case 'CONCURRENT':
           	 	menu = {
                    id: "menuConcurrent",
                    width: 150,
                    items: [     
                        {
                            id: "menudirection",
                            text: RIA_I18N.designer.properties.vertical,
                            onClick: function (menuOption) {
                            	if(menuOption.getMenuTargetElement().children.getSize() > 2)
                            		return ;
                            	var orientation = menuOption.getMenuTargetElement().getOrientation();
                                if(orientation==="horizontal"){
                                	menuOption.getMenuTargetElement().changeDirection("vertical");
                                    this.setText(RIA_I18N.designer.properties.horizontal);
                                   
                                }else{
                                	menuOption.getMenuTargetElement().changeDirection("horizontal");
                                    this.setText(RIA_I18N.designer.properties.vertical);
                                }
                            }
                        }                   
                    ],
                    onShow: function (menu) {	
            			var childrenSize=menu.targetElement.children.getSize();
            			var direction;
            			if(menu.targetElement.getOrientation()==="horizontal")
            				direction="纵向布局";
            			else
            				direction="横向布局";
            			var item=menu.items.get(0);
            			$(item.html).find(".first-layle").remove();
         				if(childrenSize > 2){
         					var str='<div class="first-layle" style="position:absolute;top:0;left:0;height:33px;width:151px;line-height:33px;padding-left:0.6em;color:#B0B0B0;background:#dedede">'+ direction +'</div>';
         					$(item.html).append(str);
         				}	
                        if (PMUI.getActiveCanvas().currentConnection) {
                            PMUI.getActiveCanvas().currentConnection.hidePortsAndHandlers();
                        }
                    }
                };
                break;
         	}
        }
        
        return menu;
    };
}());
/*
 * 定义流程图中的形状以及点击后周围出现的小图形
 * 闭包PMDesigner.shapeFactory()
 * 节点生成时的defaultOptions,即生成节点的一些默认值
 **/
(function () {
    PMDesigner.shapeFactory = function (type, options) {
        var customshape = null,
                menuShape,
                defaultOptions = null,
                canvasName,
                name,
                id,
                width,
                height,
                cssClass,
                classEvent = "start",
                pmCanvas = this.canvas,
                corona,
                taskCorona,
                gatewayCorona,
                endCorona,
                settingActCorona,
                intermediateCorona,
                deleteCorona,
                settingSubCorona,
                settingConcurrentCorona;

        canvasName = new IncrementNameCanvas(pmCanvas);
        name = canvasName.get(type);

        if (typeof options === 'undefined') {
            options = {};
            switch (type) {  
            case 'PARALLEL':
            case 'EXCLUSIVE':
            case 'INCLUSIVE':
                options.gat_type = type;
                break;
            }
        }
	      /**
	       *设置不同类型的节点宽度和高度 
	       * */
        switch(type){
	        case 'PARALLEL':
	    		width=23;
	    		height=23;
	    		cssClass='np-concurrency-on';
	    	break;
	    	case 'INCLUSIVE':
	    		width=23;
	    		height=23;
	    		cssClass='np-concurrency-off';
	    	break;
	    	case 'EXCLUSIVE':
	    		width=52;
				height=52;
				cssClass='np-node-chose';
	    	break;
        }
        taskCorona = {
            name: RIA_I18N.designer.pannel.mannel,
            className: 'np-node-manual',
            onClick:  function (item) {
                item.parent.hide();
                //item.parent.parent.canvas.hideAllFocusedLabels();
            },
            onMouseDown: function (item) {
                item.canvas.canCreateShape = true;
                item.canvas.canCreateShapeType = 'TASK';
                item.canvas.canCreateShapeClass = 'np-node-manual';
                item.canvas.connectStartShape = item.parent.parent;
            },
            column: 0
        };
        autotaskCorona = {
            name: RIA_I18N.designer.pannel.auto,
            className: 'np-cogs',
            onClick:  function (item) {
                item.parent.hide();
                //item.parent.parent.canvas.hideAllFocusedLabels();
            },
            onMouseDown: function (item) {
                item.canvas.canCreateShape = true;
                item.canvas.canCreateShapeType = 'AUTO_TASK';
                item.canvas.canCreateShapeClass = 'np-cogs';
                item.canvas.connectStartShape = item.parent.parent;
            },
            column: 0
        };
        subprocessCorona = {
            name: "子流程",
            className: 'np-sitemap',
            onClick:  function (item) {
                item.parent.hide();
                //item.parent.parent.canvas.hideAllFocusedLabels();
            },
            onMouseDown: function (item) {
                item.canvas.canCreateShape = true;
                item.canvas.canCreateShapeType = 'SUB_PROCESS';
                item.canvas.canCreateShapeClass = 'np-sitemap';
                item.canvas.connectStartShape = item.parent.parent;
            },
            column: 0
        };
        concurrentCorona={
        	name: "并发体",
            className: 'np-concurrency',
            onClick:  function (item) {
                item.parent.hide();
                //item.parent.parent.canvas.hideAllFocusedLabels();
            },
            onMouseDown: function (item) {
                item.canvas.canCreateShape = true;
                item.canvas.canCreateShapeType = 'CONCURRENT';
                item.canvas.canCreateShapeClass = 'np-concurrency';
                item.canvas.connectStartShape = item.parent.parent;
            },
            column: 1		
        }
        gatewayCorona =  {
            name: RIA_I18N.designer.pannel.exclusive,
            className: 'np-node-chose',
            onClick:  function (item) {
                item.parent.hide();
                //item.parent.parent.canvas.hideAllFocusedLabels();
            },
            onMouseDown: function (item) {
                item.canvas.canCreateShape = true;
                item.canvas.canCreateShapeType = 'EXCLUSIVE';
                item.canvas.canCreateShapeClass = 'np-node-chose';
                item.canvas.connectStartShape = item.parent.parent;
            },
            column: 1
        };
        intermediateCorona =  {
            name: 'Intermediate',
            className: 'mafe-corona-intermediate',
            onClick:  function (item) {
                item.parent.hide();
                //item.parent.parent.canvas.hideAllFocusedLabels();
            },
            onMouseDown: function (item) {
                item.canvas.canCreateShape = true;
                item.canvas.canCreateShapeType = 'INTERMEDIATE_SENDMESSAGE';
                item.canvas.canCreateShapeClass = 'mafe-toolbar-intermediate-send-mesage';
                item.canvas.connectStartShape = item.parent.parent;
            },
            column: 0
        };
        endCorona =  {
            name: RIA_I18N.designer.pannel.end,
            className: 'np-node-off',
            onClick:  function (item) {
                item.parent.hide();
                //item.parent.parent.canvas.hideAllFocusedLabels();
            },
            onMouseDown: function (item) {
                item.canvas.canCreateShape = true;
                item.canvas.canCreateShapeType = 'END';
                item.canvas.canCreateShapeClass = 'np-node-off';
                item.canvas.connectStartShape = item.parent.parent;
            },
            column: 1
        };
        settingActCorona = {/*设置手动节点属性*/
            name: RIA_I18N.designer.pannel.properties,
            className: 'mafe-corona-settings',
            onClick: function (item) {
//            	if(patternFlag=='FormServerDesigner'){
//            		PMDesigner.openPrimaryPeopleSelect(item);
//            	}else{
            		var menuNodeDom=item.parent.parent.getActXml();
                	var menuNodeId=item.parent.parent.getActivityUid();
                	//取出当前节点的xmlString，转化为dom，加入到process对象的xml中，传给属性页面。
                	var processXml=PMDesigner.getProcessXml(1,menuNodeDom);
                	
                	ids="1,"+menuNodeId;
                	PMDesigner.setMenuNode(item.parent.parent);
                	PMDesigner.sendDataToJsp(processXml,ids);
//            	}
            },
            column: 2
        };
        settingAutoCorona = {//自动节点
                name: RIA_I18N.designer.pannel.properties,
                className: 'mafe-corona-settings',
                onClick: function (item) {
                	var autoNodeDom=item.parent.parent.getActXml();
                	
                	var autoNodeId=item.parent.parent.getActivityUid();           	
                	//取出当前节点的xmlString，转化为dom，加入到process对象的xml中，传给属性页面。
                	var processXml=PMDesigner.getProcessXml(0,autoNodeDom);

                	ids="0,"+autoNodeId;
                	PMDesigner.setMenuNode(item.parent.parent);
                	PMDesigner.sendDataToJsp(processXml,ids);
                },
                column: 2
            };
        settingSubCorona = {
            name: RIA_I18N.designer.pannel.properties,
            className: 'mafe-corona-settings',
            onClick: function (item) {
            	var subNodeDom=item.parent.parent.getActXml();
            	
            	var subNodeId=item.parent.parent.getActivityUid();           	
            	//取出当前节点的xmlString，转化为dom，加入到process对象的xml中，传给属性页面。
            	var processXml=PMDesigner.getProcessXml(2,subNodeDom);
            	
            	ids="2,"+subNodeId;
            	PMDesigner.setMenuNode(item.parent.parent);
            	PMDesigner.sendDataToJsp(processXml,ids);
               
            },
            column: 2
        };
        settingGatewayCorona = {
            name: RIA_I18N.designer.pannel.properties,
            className: 'mafe-corona-settings',
            onClick: function (item) {
                 
            },
            column: 2
        };
        settingConcurrentCorona={
            name: RIA_I18N.designer.pannel.properties,
            className: 'mafe-corona-settings',
            onClick: function (item) {
            	var concurrentNodeDom=item.parent.parent.getConXml();
            	/*$(!concurrentNodeDom.find("concurrentNodeDom")){
            		concurrentNodeDom
            	}*/
            	var message=item.parent.parent.label.message;
  	            var concurrentNodeName=concurrentNodeDom.getAttribute("name");
  	            if(message!=concurrentNodeName){
  	            	concurrentNodeDom.setAttribute("name",message);
  	            }
  	           // var concurrentNode=item.parent.parent;
            	var concurrentNodeId=item.parent.parent.id;           	
            	//取出当前节点的xmlString，转化为dom，加入到process对象的xml中，传给属性页面。
            	var processXml=PMDesigner.getProcessXml(16,concurrentNodeDom);
            	
            	ids="16," + concurrentNodeId;
            	PMDesigner.setMenuNode(item.parent.parent);
            	PMDesigner.sendDataToJsp(processXml,ids);     
            },
            column: 2
        };
        setteingTaskIcon={
        		name: RIA_I18N.designer.pannel.addTemplete,
                className: 'mafe-corona-add-icon',
                onClick:  function (item) {
                	var openUrl="processmaker/setTaskIcon/setTaskIcon.html";
                	//PMDesigner.showPopupDialog("popupDiv","节点图标修改",openUrl,"450","200");
                	$('#popupDiv').wDialog({
                	    modal:true,
                	    iframe:true,
                	    title:"节点图标修改",
                	    width:450+'px',
                	    height:350+'px',
                	    loadUrl:openUrl,
                	    confirm:function(){
                	    	var icon=window.frames[1].submit_onclick(item.parent.parent);
                	    	item.parent.parent.setActIcon(icon);
                	    	var project=item.parent.parent.parent.project;
                	    	project.setDirty(true);
                	    	project.setSaveButtonDisabled();
                	    }
                	});
                },
                column: 1
        };
        deleteCorona =  {
            name: RIA_I18N.designer.pannel.dele,
            className: 'mafe-corona-delete',
            onClick:  function (item) {
                PMUI.getActiveCanvas().removeElements();
            },
            column: 2
        };
        endDeleteCorona= {
    		name: RIA_I18N.designer.pannel.dele,
    		className: 'mafe-corona-delete',
    		onClick:  function (item) {
    			PMUI.getActiveCanvas().removeElements();
    		},
        	column: 0
        };
        addNodeTemplete={
        	name: RIA_I18N.designer.pannel.addTemplete,
            className: 'mafe-corona-add-templete',
            onClick:  function (item) {
            	var nodeXmlStr=PMDesigner.xmlToStr(item.parent.parent.getActXml());
            	var actId=item.parent.parent.getActivityUid();
            	var actType = item.parent.parent.getActivityType();
            	document.getElementsByTagName('iframe')[0].contentWindow.addNodeTemplate(actId,actType,nodeXmlStr);
            },
            column: 2
        }
        if(patternFlag && (patternFlag=='Monitor'||patternFlag=='PrvView')){
        	corona = [];//监控调用的话，不加连接线
        }else{
        	corona = [
        	            {
        	                name: RIA_I18N.designer.pannel.connect,
        	                className: 'np-lines',
        	                onClick:  function (item) {
        	                    item.parent.hide();
        	                    item.parent.parent.canvas.hideAllFocusedLabels();
        	                },
        	                onMouseDown: function (item) {
        	                    item.canvas.canConnect = true;
        	                    item.canvas.connectStartShape = item.parent.parent;
        	                },
        	                column: 2
        	            }
        	        ];
        }
        
        nodeRegressCorona={//监控-节点回退按钮
            	name: RIA_I18N.designer.pannel.nodeRegress,
                className: 'mafe-corona-node-regress',
                onClick:  function (item) {
                	var menuNodeDom=item.parent.parent.getActXml();
    	            var message=item.parent.parent.label.message;
    	            var menuNodeName=menuNodeDom.getAttribute("name");
    	            if(message!=menuNodeName){
    	            	menuNodeDom.setAttribute("name",message);
    	            }
                	
                	var menuNodeId=item.parent.parent.getActivityUid();
                	var nodeType = item.parent.parent.getActivityType();
                	var nodeTypeNum;
                	switch(nodeType){
                	case 'TASK':
                		nodeTypeNum = 1;
                		break;
                	case 'AUTO_TASK':
                		nodeTypeNum = 0;
                		break
                	case 'SUB_PROCESS':
                		nodeTypeNum = 2;
                		break;
                	}
                	//取出当前节点的xmlString，转化为dom，加入到process对象的xml中，传给属性页面。
                	var processXml=PMDesigner.getProcessXml(nodeTypeNum,menuNodeDom);
                	ids= nodeTypeNum+","+menuNodeId;
                	window.parent.rollback(processXml,ids);
                },
                column: 1
        };
        
        nodeFinishCorona={//监控-节点完成按钮
            	name: RIA_I18N.designer.pannel.nodeFinish,
                className: 'mafe-corona-node-finish',
                onClick:  function (item) {
                	var menuNodeDom=item.parent.parent.getActXml();
    	            var message=item.parent.parent.label.message;
    	            var menuNodeName=menuNodeDom.getAttribute("name");
    	            if(message!=menuNodeName){
    	            	menuNodeDom.setAttribute("name",message);
    	            }
                	
                	var menuNodeId=item.parent.parent.getActivityUid();
                	var nodeType = item.parent.parent.getActivityType();
                	var nodeTypeNum;
                	switch(nodeType){
                	case 'TASK':
                		nodeTypeNum = 1;
                		break;
                	case 'AUTO_TASK':
                		nodeTypeNum = 0;
                		break
                	case 'SUB_PROCESS':
                		nodeTypeNum = 2;
                		break;
                	}
                	//取出当前节点的xmlString，转化为dom，加入到process对象的xml中，传给属性页面。
                	var processXml=PMDesigner.getProcessXml(nodeTypeNum,menuNodeDom);
                	ids= nodeTypeNum+","+menuNodeId;
                	window.parent.actComplete(processXml,ids);
                },
                column: 0
            };
        //点击节点时，节点右侧显示的小图形coronas
        if(patternFlag && patternFlag=='Monitor'){
        	if(type=='TASK'){
        		corona.push(nodeFinishCorona);
        		corona.push(nodeRegressCorona);
//        		corona[1].column = 0;
//                corona[2].column = 1;
        	}
        }else if(patternFlag=='FormServerDesigner' || patternFlag=='CreateByTemplate'){//表单-新建服务
        	 switch (type) {
             /*case 'START':
                 corona.push(taskCorona);
                 corona.push(gatewayCorona);
                 corona.push(deleteCorona);

                 break;
             case 'TASK':
                 corona.push(taskCorona);
                 corona.push(endCorona);
                 corona.push(gatewayCorona);
                 corona.push(settingActCorona);
                 corona.push(deleteCorona);
                 break;
             case 'EXCLUSIVE':
                 corona.push(taskCorona);
                 corona.push(gatewayCorona);
                 corona.push(deleteCorona);
                 break;*/
        	 case 'START':
                 corona.push(taskCorona);
                 corona.push(autotaskCorona);
                 corona.push(subprocessCorona);
              //   corona.push(intermediateCorona);
                 corona.push(gatewayCorona);
                 corona.push(deleteCorona);

                 break;
        	 case 'END':
            	 corona=[];
            	 corona.push(endDeleteCorona);
            	 break;
             case 'TASK':
                 corona.push(taskCorona);
                 corona.push(autotaskCorona);
                 corona.push(subprocessCorona);
                 corona.push(concurrentCorona);
                 corona.push(gatewayCorona);
                 corona.push(endCorona);
                // corona.push(setteingTaskIcon);
               //  corona.push(addNodeTemplete);
                 corona.push(settingActCorona);
                 corona.push(deleteCorona);
                 break;
             case 'AUTO_TASK':
                 corona.push(taskCorona);
                 corona.push(autotaskCorona);
                 corona.push(subprocessCorona);
                 corona.push(concurrentCorona);
                 corona.push(gatewayCorona);
                 corona.push(endCorona);
                 //corona.push(setteingTaskIcon);
                // corona.push(addNodeTemplete);
                 corona.push(settingAutoCorona);
                 corona.push(deleteCorona);
                 break;
                 
             case 'SUB_PROCESS':
                 corona.push(taskCorona);
                 corona.push(autotaskCorona);
                 corona.push(subprocessCorona);
                 corona.push(concurrentCorona);
                 corona.push(gatewayCorona);
                 corona.push(endCorona);
                 //corona.push(setteingTaskIcon);
                 //corona.push(addNodeTemplete);
                 corona.push(settingSubCorona);
                 corona.push(deleteCorona);
                 break;
             case 'CONCURRENT':
             	corona.push(taskCorona);
                 corona.push(autotaskCorona);
                 corona.push(subprocessCorona);
                 corona.push(concurrentCorona);
                 corona.push(gatewayCorona);
                 corona.push(endCorona);
                 corona.push(settingConcurrentCorona);
                 corona.push(deleteCorona);
                 break;
             case 'EXCLUSIVE':
                 corona.push(taskCorona);
                 corona.push(autotaskCorona);
                 corona.push(subprocessCorona);
                 corona.push(concurrentCorona);
                 corona.push(gatewayCorona);
                 corona.push(deleteCorona);
                 break;
             case 'PARALLEL':
                 corona.push(taskCorona);
                 corona.push(autotaskCorona);
                 corona.push(subprocessCorona);
                 corona.push(concurrentCorona);
                 corona.push(gatewayCorona);
                 break;
             case 'INCLUSIVE':
             	corona=[];
             	break;
             case 'PARTICIPANT':
             case 'TEXT_ANNOTATION':
                 corona[0].column = 0;
                 corona.push(deleteCorona);
                 corona[1].column = 1;
                 break;
             }
        }else if(patternFlag!=='PrvView'){//不是监控和表单授权的时候
        	 switch (type) {
             case 'START':
                 corona.push(taskCorona);
                 corona.push(autotaskCorona);
                 corona.push(subprocessCorona);
                 corona.push(concurrentCorona);
              //   corona.push(intermediateCorona);
                 corona.push(gatewayCorona);
                 corona.push(deleteCorona);

                 break;
             case 'END':
            	 corona=[];
            	 corona.push(endDeleteCorona);
            	 break;
             case 'TASK':
                 corona.push(taskCorona);
                 corona.push(autotaskCorona);
                 corona.push(subprocessCorona);
                 corona.push(concurrentCorona);
                 corona.push(gatewayCorona);
                 corona.push(endCorona);
                // corona.push(setteingTaskIcon);
               //  corona.push(addNodeTemplete);
                 corona.push(settingActCorona);
                 corona.push(deleteCorona);
                 break;
             case 'AUTO_TASK':
                 corona.push(taskCorona);
                 corona.push(autotaskCorona);
                 corona.push(subprocessCorona);
                 corona.push(concurrentCorona);
                 corona.push(gatewayCorona);
                 corona.push(endCorona);
                 //corona.push(setteingTaskIcon);
                // corona.push(addNodeTemplete);
                 corona.push(settingAutoCorona);
                 corona.push(deleteCorona);
                 break;
                 
             case 'SUB_PROCESS':
                 corona.push(taskCorona);
                 corona.push(autotaskCorona);
                 corona.push(subprocessCorona);
                 corona.push(concurrentCorona);
                 corona.push(gatewayCorona);
                 corona.push(endCorona);
                 //corona.push(setteingTaskIcon);
                 //corona.push(addNodeTemplete);
                 corona.push(settingSubCorona);
                 corona.push(deleteCorona);
                 break;
             case 'CONCURRENT':
             	corona.push(taskCorona);
                 corona.push(autotaskCorona);
                 corona.push(subprocessCorona);
                 corona.push(concurrentCorona);
                 corona.push(gatewayCorona);
                 corona.push(endCorona);
                 corona.push(settingConcurrentCorona);
                 corona.push(deleteCorona);
                 break;
             case 'EXCLUSIVE':
                 corona.push(taskCorona);
                 corona.push(autotaskCorona);
                 corona.push(subprocessCorona);
                 corona.push(concurrentCorona);
                 corona.push(gatewayCorona);
                 corona.push(deleteCorona);
                 break;
             case 'PARALLEL':
                 corona.push(taskCorona);
                 corona.push(autotaskCorona);
                 corona.push(subprocessCorona);
                 corona.push(concurrentCorona);
                 corona.push(gatewayCorona);
                 break;
             case 'INCLUSIVE':
             	corona=[];
             	break;
             case 'PARTICIPANT':
             case 'TEXT_ANNOTATION':
                 corona[0].column = 0;
                 corona.push(deleteCorona);
                 corona[1].column = 1;
                 break;
             }
        }
       
        switch (type) {
        case 'TASK':
            defaultOptions = {
                canvas: pmCanvas,
                act_type: 'TASK',
                act_name: name,
                act_task_type: 'MANUALTASK',
                act_loop_type: 'EMPTY',
                width:52,
                height:52,
                container: "activity",
                labels: [
                    {
                        message: name,
                        width: 100,
                        visible: true,
                        position: {
                            location: 'bottom',
                            diffX: 0,
                            diffY: 5
                        },
         
                    }
                ],
                
                layers: [
                    {
                        x: 0,
                        y: 0,
                        layerName: "first-layer",
                        priority: 2,
                        visible: true,
                        style: {
                            cssClasses: [
                                'np-node-manual',
                                'bpm-active-node'
                            ]
                        }
                    },
                    {
                        x: 0,
                        y: 0,
                        layerName: "second-layer",
                        priority: 2,
                        visible: false,
                        style: {
                            cssClasses: []
                        }
                    }

                ],
                connectAtMiddlePoints: true,
                
                resizeBehavior: 'activityResize',
                resizeHandlers: {
                    type: "Rectangle",
                    total: 8,
                    resizableStyle: {
                        cssProperties: {
                            'background-color': "rgb(0, 255, 0)",
                            'border': '1px solid black'
                        }
                    },
                    nonResizableStyle: {
                        cssProperties: {
                            'background-color': "white",
                            'border': '1px solid black'
                        }
                    }
                },
                "drop": {
                    type: "pmactivitydrop",
                    selectors: [
                        "#BOUNDARY_EVENT",
                        ".mafe-event-boundary",
                        ".dragConnectHandler"
                    ]
                },
                markers: [
							{
							  markerType: 'USERTASK',
							  x: 10,
							  y: 10,
							  position: 5,
							  markerZoomClasses: [
							     
							  ]
							}
						],
                corona: corona,
                focusLabel: true
            };
            jQuery.extend(true, defaultOptions, options);
            defaultOptions.markers[0]
            	.markerZoomClasses = PMDesigner.updateMarkerLayerClasses(defaultOptions);
            customshape = new PMActivity(defaultOptions);
            break;
        case 'AUTO_TASK':
            defaultOptions = {
                canvas: pmCanvas,
                act_type: 'AUTO_TASK',
                act_name: name,
                act_task_type: 'MENU',
                act_loop_type: 'EMPTY',
                width:52,
                height:52,           
                container: "activity",
                labels: [
                    {
                        message: name,
                        width: 0,
                        height: 0,
                        position: {
                            location: 'bottom',
                            diffX: 0,
                            diffY: 5
                        },
                        attachEvents: false
                        
                    }
                ],
              
                layers: [
                    {
                        x: 0,
                        y: 0,
                        layerName: "first-layer",
                        priority: 2,
                        visible: true,
                        style: {
                            cssClasses: [
                                'np-cogs',
                                'bpm-active-node'
                            ]
                        }
                    },
                    {
                        x: 0,
                        y: 0,
                        layerName: "second-layer",
                        priority: 2,
                        visible: false,
                        style: {
                            cssClasses: []
                        }
                    }

                ],
                connectAtMiddlePoints: true,
              
                resizeBehavior: 'activityResize',
                resizeHandlers: {
                    type: "Rectangle",
                    total: 8,
                    resizableStyle: {
                        cssProperties: {
                            'background-color': "rgb(0, 255, 0)",
                            'border': '1px solid black'
                        }
                    },
                    nonResizableStyle: {
                        cssProperties: {
                            'background-color': "white",
                            'border': '1px solid black'
                        }
                    }
                },
                //drop : 'pmconnection',
                "drop": {
                    type: "pmactivitydrop",
                    selectors: [
                        "#BOUNDARY_EVENT",
                        ".mafe-event-boundary",
                        ".dragConnectHandler"
                    ]
                },
                markers: [
                    {
                        markerType: 'USERTASK',
                        x: 10,
                        y: 10,
                        position: 5,
                        markerZoomClasses: [
                           
                        ]
                    }
                ],
                corona: corona,
                focusLabel: true
            };
            jQuery.extend(true, defaultOptions, options);
            defaultOptions.markers[0]
                .markerZoomClasses = PMDesigner.updateMarkerLayerClasses(defaultOptions);
            customshape = new PMActivity(defaultOptions);
            break;
        case 'SUB_PROCESS':
          defaultOptions = {
              canvas: pmCanvas,
              act_type: 'SUB_PROCESS',
              act_task_type: 'COLLAPSED',
              act_loop_type: 'EMPTY',
              act_name: name,
              width:52,
              height:52,
              container: "activity",
              labels: [
                  {
                      message: name,
                      position: {
                          location: 'bottom',
                          diffX: 0,
                          diffY: 5
                      },
                      attachEvents: false
                  }
              ],
              layers: [
                  {
                      x: 0,
                      y: 0,
                      layerName: "first-layer",
                      priority: 2,
                      visible: true,
                      style: {
                          cssClasses: [
                              'np-sitemap',
                              'bpm-active-node'
                          ]
                      }
                  },
                  {
                      x: 0,
                      y: 0,
                      layerName: "second-layer",
                      priority: 2,
                      visible: false,
                      style: {
                          cssClasses: []
                      }
                  }

              ],
              connectAtMiddlePoints: true,
              resizeBehavior: 'activityResize',
              resizeHandlers: {
                  type: "Rectangle",
                  total: 8,
                  resizableStyle: {
                      cssProperties: {
                          'background-color': "rgb(0, 255, 0)",
                          'border': '1px solid black'
                      }
                  },
                  nonResizableStyle: {
                      cssProperties: {
                          'background-color': "white",
                          'border': '1px solid black'
                      }
                  }
              },
              //drop : 'pmconnection',
              "drop": {
                  type: "pmactivitydrop",
                  selectors: [
                      "#BOUNDARY_EVENT",
                      ".mafe-event-boundary",
                      ".dragConnectHandler"
                  ]
              },
              markers: [
                  {
                      markerType: 'COLLAPSED',
                      x: 10,
                      y: 10,
                      position: 5,
                      markerZoomClasses: [
                          "mafe-collapsed-marker-10",
                          "mafe-collapsed-marker-15",
                          "mafe-collapsed-marker-21",
                          "mafe-collapsed-marker-26",
                           "mafe-collapsed-marker-31"
                      ]
                  }
              ],
              corona: corona,
              focusLabel: true
          };
          jQuery.extend(true, defaultOptions, options);
          defaultOptions.markers[0]
                  .markerZoomClasses = PMDesigner.updateMarkerLayerClasses(defaultOptions);
          customshape = new PMActivity(defaultOptions);
          break;
//        case 'TASK':
//            defaultOptions = {
//                canvas: pmCanvas,
//                act_type: 'TASK',
//                act_name: name,
//                act_task_type: 'MANUALTASK',
//                act_loop_type: 'EMPTY',
//                act_icon:'manual.png',
//                width:120,
//                height:60,
//                container: "activity",
//                labels: [
//                    {
//                        message: name,
//                        width: 0,
//                        height: 0,
//                        position: {
//                            location: 'center',
//                            diffX: 0,
//                            diffY: 0
//                        },
//                        attachEvents: false             
//                    }
//                ],
//                
//                layers: [
//                    {
//                        x: 0,
//                        y: 0,
//                        layerName: "first-layer",
//                        priority: 2,
//                        visible: true,
//                        style: {
//                            cssClasses: [
//                                'mafe-activity-task'
//                            ]
//                        }
//                    },
//                    {
//                        x: 0,
//                        y: 0,
//                        layerName: "second-layer",
//                        priority: 2,
//                        visible: false,
//                        style: {
//                            cssClasses: []
//                        }
//                    }
//
//                ],
//                connectAtMiddlePoints: true,
//                
//                resizeBehavior: 'activityResize',
//                resizeHandlers: {
//                    type: "Rectangle",
//                    total: 8,
//                    resizableStyle: {
//                        cssProperties: {
//                            'background-color': "rgb(0, 255, 0)",
//                            'border': '1px solid black'
//                        }
//                    },
//                    nonResizableStyle: {
//                        cssProperties: {
//                            'background-color': "white",
//                            'border': '1px solid black'
//                        }
//                    }
//                },
//                //drop : 'pmconnection',
//                "drop": {
//                    type: "pmactivitydrop",
//                    selectors: [
//                        "#BOUNDARY_EVENT",
//                        ".mafe-event-boundary",
//                        ".dragConnectHandler"
//                    ]
//                },
//                markers: [
//                    {
//                        markerType: 'USERTASK',
//                        x: 10,
//                        y: 10,
//                        position: 0,
//                        markerZoomClasses: [
//                           
//                        ]
//                    },
//                    {
//                        markerType: 'EMPTY',
//                        x: 10,
//                        y: 10,
//                        position: 4,
//                        markerZoomClasses: [
//                          
//                        ]
//                    }
//                ],
//                corona: corona,
//                focusLabel: true
//            };
//            jQuery.extend(true, defaultOptions, options);
//            defaultOptions.markers[0]
//                    .markerZoomClasses = PMDesigner.updateMarkerLayerClasses(defaultOptions);
//            defaultOptions.markers[1]
//                    .markerZoomClasses = PMDesigner.updateLoopLayerClasses(defaultOptions);
//            customshape = new PMActivity(defaultOptions);
//            break;
//        case 'AUTO_TASK':
//            defaultOptions = {
//                canvas: pmCanvas,
//                act_type: 'AUTO_TASK',
//                act_name: name,
//                act_task_type: 'MENU',
//                act_loop_type: 'EMPTY',
//                act_icon: 'auto.png',
//                width:120,
//                height:60,
//                container: "activity",
//                labels: [
//                    {
//                        message: name,
//                        width: 0,
//                        height: 0,
//                        position: {
//                            location: 'center',
//                            diffX: 0,
//                            diffY: 0
//                        },
//                        attachEvents: false
//                        
//                    }
//                ],
//              
//                layers: [
//                    {
//                        x: 0,
//                        y: 0,
//                        layerName: "first-layer",
//                        priority: 2,
//                        visible: true,
//                        style: {
//                            cssClasses: [
//                                'mafe-activity-task'
//                            ]
//                        }
//                    },
//                    {
//                        x: 0,
//                        y: 0,
//                        layerName: "second-layer",
//                        priority: 2,
//                        visible: false,
//                        style: {
//                            cssClasses: []
//                        }
//                    }
//
//                ],
//                connectAtMiddlePoints: true,
//              
//                resizeBehavior: 'activityResize',
//                resizeHandlers: {
//                    type: "Rectangle",
//                    total: 8,
//                    resizableStyle: {
//                        cssProperties: {
//                            'background-color': "rgb(0, 255, 0)",
//                            'border': '1px solid black'
//                        }
//                    },
//                    nonResizableStyle: {
//                        cssProperties: {
//                            'background-color': "white",
//                            'border': '1px solid black'
//                        }
//                    }
//                },
//                //drop : 'pmconnection',
//                "drop": {
//                    type: "pmactivitydrop",
//                    selectors: [
//                        "#BOUNDARY_EVENT",
//                        ".mafe-event-boundary",
//                        ".dragConnectHandler"
//                    ]
//                },
//                markers: [
//                    {
//                        markerType: 'USERTASK',
//                        x: 10,
//                        y: 10,
//                        position: 0,
//                        markerZoomClasses: [
//                           
//                        ]
//                    },
//                    {
//                        markerType: 'EMPTY',
//                        x: 10,
//                        y: 10,
//                        position: 4,
//                        markerZoomClasses: [
//                         
//                        ]
//                    }
//                ],
//                corona: corona,
//                focusLabel: true
//            };
//            jQuery.extend(true, defaultOptions, options);
//            defaultOptions.markers[0]
//                    .markerZoomClasses = PMDesigner.updateMarkerLayerClasses(defaultOptions);
//            defaultOptions.markers[1]
//                    .markerZoomClasses = PMDesigner.updateLoopLayerClasses(defaultOptions);
//            customshape = new PMActivity(defaultOptions);
//            break;
//        case 'SUB_PROCESS':
//            defaultOptions = {
//                canvas: pmCanvas,
//                act_type: 'SUB_PROCESS',
//                act_task_type: 'COLLAPSED',
//                act_loop_type: 'EMPTY',
//                act_icon: 'sub-process.png',
//                act_name: name,
//                width:120,
//                height:60,
//                container: "activity",
//                labels: [
//                    {
//                        message: name,
//                        position: {
//                            location: 'center',
//                            diffX: 0,
//                            diffY: 0
//                        },
//                        attachEvents: false
//                    }
//                ],
//                layers: [
//                    {
//                        x: 0,
//                        y: 0,
//                        layerName: "first-layer",
//                        priority: 2,
//                        visible: true,
//                        style: {
//                            cssClasses: [
//                                'mafe-activity-subprocess'
//                            ]
//                        }
//                    },
//                    {
//                        x: 0,
//                        y: 0,
//                        layerName: "second-layer",
//                        priority: 2,
//                        visible: false,
//                        style: {
//                            cssClasses: []
//                        }
//                    }
//
//                ],
//                connectAtMiddlePoints: true,
//                resizeBehavior: 'activityResize',
//                resizeHandlers: {
//                    type: "Rectangle",
//                    total: 8,
//                    resizableStyle: {
//                        cssProperties: {
//                            'background-color': "rgb(0, 255, 0)",
//                            'border': '1px solid black'
//                        }
//                    },
//                    nonResizableStyle: {
//                        cssProperties: {
//                            'background-color': "white",
//                            'border': '1px solid black'
//                        }
//                    }
//                },
//                //drop : 'pmconnection',
//                "drop": {
//                    type: "pmactivitydrop",
//                    selectors: [
//                        "#BOUNDARY_EVENT",
//                        ".mafe-event-boundary",
//                        ".dragConnectHandler"
//                    ]
//                },
//                markers: [
//                    {
//                        markerType: 'COLLAPSED',
//                        x: 10,
//                        y: 10,
//                        position: 0,
//                        markerZoomClasses: [
//                            "mafe-collapsed-marker-10",
//                            "mafe-collapsed-marker-15",
//                            "mafe-collapsed-marker-21",
//                            "mafe-collapsed-marker-26",
//                             "mafe-collapsed-marker-31"
//                        ]
//                    },
//                    {
//                        markerType: 'EMPTY',
//                        x: 10,
//                        y: 10,
//                        position: 4,
//                        markerZoomClasses: [
//                         
//                        ]
//                    }
//                ],
//                corona: corona,
//                focusLabel: true
//            };
//            jQuery.extend(true, defaultOptions, options);
//            defaultOptions.markers[0]
//                    .markerZoomClasses = PMDesigner.updateMarkerLayerClasses(defaultOptions);
//            customshape = new PMActivity(defaultOptions);
//            break;
        case 'START':
            defaultOptions = {
                canvas: pmCanvas,
                width: 52,
                height: 52,
                evn_type: 'start',
                evn_name: '',
                evn_marker: 'EMPTY',
                evn_behavior: 'catch',
                evn_message: 'LEAD',
                labels: [
                    {
                        message: '',
                        visible: true,
                        width: 100,
                        position: {
                            location: 'bottom',
                            diffX: 0,
                            diffY: 13
                        }
                    }
                ],
                style: {
                    cssClasses: ['mafe-event-start']
                },
                layers: [
                    {
                        x: 0,
                        y: 0,
                        layerName: "first-layer",
                        priority: 2,
                        visible: true,
                        style: {
                            cssClasses: ['np-node-on']
                        },
                        zoomSprites: [
//                            'mafe-event-start-empty-16',
//                            'mafe-event-start-empty-24',
//                            'mafe-event-start-empty-33',
//                            'mafe-event-start-empty-41',
//                            'mafe-event-start-empty-49'
                        ]
                    },
                    {
                        x: 0,
                        y: 0,
                        layerName: "second-layer",
                        priority: 2,
                        visible: false,
                        style: {
                            cssClasses: []
                        }
                    }
                ],
                connectAtMiddlePoints: true,
                resizeBehavior: 'NoResize',
                resizeHandlers: {
                    type: "Rectangle",
                    total: 4,
                    resizableStyle: {
                        cssProperties: {
                            'background-color': "rgb(0, 255, 0)",
                            'border': '1px solid black'
                        }
                    },
                    nonResizableStyle: {
                        cssProperties: {
                            'background-color': "white",
                            'border': '1px solid black'
                        }
                    }
                },
                //drop : 'pmconnection'
                "drop": {
                    type: "pmconnection",
                    selectors: ['.dragConnectHandler']
                },
                corona: corona
            };

            jQuery.extend(true, defaultOptions, options);
            defaultOptions.layers[0]
                    .zoomSprites = PMDesigner.updateLayerClasses(defaultOptions);
            customshape = new PMEvent(defaultOptions);
            break;
        case 'END':
            defaultOptions = {
                canvas: pmCanvas,
                width: 52,
                height: 52,
                evn_type: 'end',
                evn_name: '',
                evn_marker: 'EMPTY',
                evn_behavior: 'throw',
                labels: [
                    {
                        message: '',
                        visible: true,
                        position: {
                            location: 'bottom',
                            diffX: 0,
                            diffY: 13
                        }
                    }
                ],
                style: {
                    cssClasses: ['mafe-event-end']
                },
                layers: [
                    {
                        x: 0,
                        y: 0,
                        layerName: "first-layer",
                        priority: 2,
                        visible: true,
                        style: {
                            cssClasses: ['np-node-off']
                        },
                        zoomSprites: [
//                            'mafe-event-end-empty-16',
//                            'mafe-event-end-empty-24',
//                            'mafe-event-end-empty-33',
//                            'mafe-event-end-empty-41',
//                            'mafe-event-end-empty-49'
                        ]
                    },
                    {
                        x: 0,
                        y: 0,
                        layerName: "second-layer",
                        priority: 2,
                        visible: false,
                        style: {
                            cssClasses: []
                        }
                    }
                ],
                connectAtMiddlePoints: true,
                resizeBehavior: 'NoResize',
                resizeHandlers: {
                    type: "Rectangle",
                    total: 4,
                    resizableStyle: {
                        cssProperties: {
                            'background-color': "rgb(0, 255, 0)",
                            'border': '1px solid black'
                        }
                    },
                    nonResizableStyle: {
                        cssProperties: {
                            'background-color': "white",
                            'border': '1px solid black'
                        }
                    }
                },
                //drop : 'pmconnection'
                "drop": {
                    type: "pmconnection",
                    selectors: ['.dragConnectHandler']
                },
                corona : corona
            };
            jQuery.extend(true, defaultOptions, options);
            defaultOptions.layers[0]
                    .zoomSprites = PMDesigner.updateLayerClasses(defaultOptions);
            customshape = new PMEvent(defaultOptions);
            break;

        case 'PARALLEL':
        case 'EXCLUSIVE':
        case 'INCLUSIVE':	
            defaultOptions = {
                labels: [
                    {
                        message: '',
                        visible: true,
                        width: 100,
                        position: {
                            location: 'bottom',
                            diffX: 0,
                            diffY: 13
                        }
                    }
                ],
                canvas: pmCanvas,
                width: width,
                height: height,
                gat_type: 'EXCLUSIVE',
                gat_name: '',
                
                layers: [
                    {
                        x: 0,
                        y: 0,
                        layerName: "first-layer",
                        priority: 2,
                        visible: true,
                        style: {
                            cssClasses: [cssClass]
                        },
                        zoomSprites: [
                            'mafe-gateway-exclusive-20',
                            'mafe-gateway-exclusive-30',
                            'mafe-gateway-exclusive-41',
                            'mafe-gateway-exclusive-51',
                            'mafe-gateway-exclusive-61'
                        ]
                    },
                    {
                        x: 0,
                        y: 0,
                        layerName: "second-layer",
                        priority: 2,
                        visible: false,
                        style: {
                            cssClasses: []
                        }
                    }
                ],
                connectAtMiddlePoints: true,
                resizeBehavior: 'NoResize',
                resizeHandlers: {
                    type: "Rectangle",
                    total: 4,
                    resizableStyle: {
                        cssProperties: {
                            'background-color': "rgb(0, 255, 0)",
                            'border': '1px solid black'
                        }
                    },
                    nonResizableStyle: {
                        cssProperties: {
                            'background-color': "white",
                            'border': '1px solid black'
                        }
                    }
                },
                //drop : 'pmconnection'
                "drop": {
                    type: "pmconnection",
                    selectors: ['.dragConnectHandler']
                },
                corona: corona
            };
            jQuery.extend(true, defaultOptions, options);
            defaultOptions.layers[0]
                    .zoomSprites = PMDesigner.updateGatewayLayerClasses(defaultOptions);
            customshape = new PMGateway(defaultOptions);
            break;
        
        case 'GROUP':
            defaultOptions = {
                art_name: name,
                art_type: 'GROUP',
                canvas: pmCanvas,
                width: 200,
                height: 100,
                style: {
                    cssClasses: ['mafe-artifact-group']
                },
                layers: [
                    {
                        x: 0,
                        y: 0,
                        layerName: "background-layer",
                        priority: 1,
                        visible: true,
                        style: {
                            cssClasses: [
                                'mafe-artifact-group'
                            ]
                        }
                    },
                    {
                        x: 0,
                        y: 0,
                        layerName: "second-layer",
                        priority: 2,
                        visible: false,
                        style: {
                            cssClasses: []
                        }
                    }
                ],
                connectAtMiddlePoints: true,
                resizeBehavior: 'annotationResize',
                resizeHandlers: {
                    type: "Rectangle",
                    total: 8,
                    resizableStyle: {
                        cssProperties: {
                            'background-color': "rgb(0, 255, 0)",
                            'border': '1px solid black'
                        }
                    }
                },
                labels: [
                    {
                        message: "",
                        width: 0,
                        height: 0,
                        //orientation: "vertical",
                        //minHeight:30,
                        position: {
                            location: 'top',
                            diffX: 2,
                            diffY: 0
                        },
                        attachEvents: false,
                        updateParent: true,
                        style: {
                            cssClasses: [
                                'mafe-label-annotation'
                            ]
                        }
                    }
                ],
                "drop": {
                    type: "pmconnection",
                    selectors: ['.dragConnectHandler']
                },
                corona : [
                    {
                        name: RIA_I18N.designer.pannel.dele,
                        className: 'mafe-corona-delete',
                        onClick:  function (item) {
                            PMUI.getActiveCanvas().removeElements();
                        },
                        column: 0
                    }

                ],
                focusLabel: true
            };
            jQuery.extend(true, defaultOptions, options);
            customshape = new PMArtifact(defaultOptions);
            break;
        case 'TEXT_ANNOTATION':
            defaultOptions = {
                art_name: name,
                art_type: 'TEXT_ANNOTATION',
                canvas: pmCanvas,
                width: 100,
                height: 30,
                style: {
                    cssClasses: ['mafe-artifact-annotation']
                },
                layers: [
                    {
                        x: 0,
                        y: 0,
                        layerName: "background-layer",
                        priority: 1,
                        visible: true,
                        style: {
                            cssClasses: [
                                'mafe-artifact-annotation'
                            ]
                        }
                    },
                    {
                        x: 0,
                        y: 0,
                        layerName: "second-layer",
                        priority: 2,
                        visible: false,
                        style: {
                            cssClasses: []
                        }
                    }
                ],
                connectAtMiddlePoints: true,
                resizeBehavior: 'annotationResize',
                resizeHandlers: {
                    type: "Rectangle",
                    total: 8,
                    resizableStyle: {
                        cssProperties: {
                            'background-color': "rgb(0, 255, 0)",
                            'border': '1px solid black'
                        }
                    }
                },
                labels: [
                    {
                        message: name,
                        width: 0,
                        height: 0,
                        position: {
                            location: 'center',
                            diffX: 0,
                            diffY: 0
                        },
                        attachEvents: false,
                        updateParent: true
                    }
                ],
                //drop : 'pmconnection'
                "drop": {
                    type: "pmconnection",
                    selectors: ['.dragConnectHandler']
                },
                corona: corona,
                focusLabel: true
            };
            jQuery.extend(true, defaultOptions, options);
            customshape = new PMArtifact(defaultOptions);
            break;

        case 'PARTICIPANT':
            defaultOptions = {
                width: 500,
                height: 130,
                "canvas": this,
                "connectAtMiddlePoints": false,
                //drag: 'bpmndrag',
                topLeft: true,
                connectionType: 'dotted',
                resizeBehavior: "participantResize",
                resizeHandlers: {
                    type: "Rectangle",
                    total: 8,
                    resizableStyle: {
                        cssProperties: {
                            'background-color': "rgb(0, 255, 0)",
                            'border': '1px solid black'
                        }
                    },
                    nonResizableStyle: {
                        cssProperties: {
                            'background-color': "white",
                            'border': '1px solid black'
                        }
                    }
                },
                "drop": {
                    type: "pmconnection",
                    selectors: ['.dragConnectHandler']
                },
                "style": {
                    cssClasses: ["mafe-pool"]
                  
                },
                layers: [
                    {
                        layerName: "first-layer",
                        priority: 2,
                        visible: true,
                        style: {
                            cssProperties: {
                            	
                            }
                        }
                    },
                    {
                        x: 0,
                        y: 0,
                        layerName: "second-layer",
                        priority: 2,
                        visible: false,
                        style: {
                            cssClasses: []
                        }
                    }
                ],
                labels: [
                    {
                        message: name,
                        width: 0,
                        height: 0,
                        orientation: 'vertical',
                        position: {
                            location: 'center-left',
                            diffX: 15,
                            diffY: 0
                        },
                        attachEvents: false
                    }
                ],
                par_name: name,
                corona: corona,
                focusLabel: true

            };
            jQuery.extend(true, defaultOptions, options);
            customshape = new PMParticipant(defaultOptions);
            break;
        case 'CONCURRENT':
            name = options.lns_name;
            defaultOptions = {
                width: 300,
                height: 150,
                "canvas": pmCanvas,
                "connectAtMiddlePoints": true,
                //drag: 'bpmndrag',
                topLeft: false,
                connectionType: 'dotted',
                resizeBehavior: "poolResize",

                resizeHandlers: {
                    type: "Rectangle",
                    total: 8,
                    resizableStyle: {
                        cssProperties: {
                            'background-color': "rgb(0, 255, 0)",
                            'border': '1px solid black'
                        }
                    },
                    nonResizableStyle: {
                        cssProperties: {
                            'background-color': "white",
                            'border': '1px solid black'
                        }
                    }
                },
                "drop": {
                    type: "pmparalleldrop",
                    selectors: [
                        "#TASK",
                        "#AUTO_TASK",
                        "#SUB_PROCESS",
                        "#EXCLUSIVE",
                        "#PARALLEL",
                        "#INCLUSIVE",
                   
                        "#CONCURRENT",
                        ".pmui-pmactivity",
                        ".pmui-pmgateway",
                        ".pmui-pmparallel",
                    
                        ".dragConnectHandler",
                        ".port"
                    ]
                },
                container: "concurrent",
                "style": {
                    cssClasses: ["mafe-concurrent"]
                  
                },
                layers: [
                    {
                        layerName: "first-layer",
                        priority: 2,
                        visible: true,
                        style: {
                            cssProperties: {
                            	
                            }
                        }
                    },
                    {
                        x: 0,
                        y: 0,
                        layerName: "second-layer",
                        priority: 2,
                        visible: false,
                        style: {
                            cssClasses: []
                        }
                    }
                ],
                labels: [
                    {
                        message: name,
                        width: 0,
                        height: 0,
                     // orientation: 'vertical',
                        position: {
                        	location: 'top',
                            diffX: 2,
                            diffY: 0
                        },
                        attachEvents: false
                    }
                ],
                lns_name: name,
                focusLabel: true,
                corona : corona,
            };
            jQuery.extend(true, defaultOptions, options);
            customshape = new PMParallel(defaultOptions);
            break;
        case 'POOL':
            if(options.lns_name){
                name = options.lns_name;
            }else if(options.par_name){
                name = options.par_name;
            }
            defaultOptions = {
                width: 700,
                height: 200,
                "canvas": pmCanvas,
                "connectAtMiddlePoints": false,
                //drag: 'bpmndrag',
                topLeft: false,
                connectionType: 'dotted',
                resizeBehavior: "poolResize",

                resizeHandlers: {
                    type: "Rectangle",
                    total: 8,
                    resizableStyle: {
                        cssProperties: {
                            'background-color': "rgb(0, 255, 0)",
                            'border': '1px solid black'
                        }
                    },
                    nonResizableStyle: {
                        cssProperties: {
                            'background-color': "white",
                            'border': '1px solid black'
                        }
                    }
                },
                "drop": {
                    type: "pmcontainer",
                    selectors: [
                        "#TASK",
                        "#AUTO_TASK",
                        "#SUB_PROCESS",
                        "#START", 
                        "#END",
                        "#EXCLUSIVE",
                        //"#PARALLEL",
                       // "#INCLUSIVE",
                        "#CONCURRENT",
                        "#TEXT_ANNOTATION",
                        "#LANE",
                        "#GROUP",
                        
                        ".mafe-event-start",
                        ".mafe-event-intermediate",
                        ".mafe-event-end",
                        ".pmui-pmactivity",
                        ".pmui-pmgateway",
                        ".pmui-pmdata",
                        ".mafe-artifact-annotation",
                        ".mafe-artifact-group",
                        ".port"
                    ]
                },
                container: "pool",
                "style": {
                    cssClasses: ["mafe-pool"]
                  
                },
                layers: [
                    {
                        layerName: "first-layer",
                        priority: 2,
                        visible: true,
                        style: {
                            cssProperties: {
                            	
                            }
                        }
                    },
                    {
                        x: 0,
                        y: 0,
                        layerName: "second-layer",
                        priority: 2,
                        visible: false,
                        style: {
                            cssClasses: []
                        }
                    }
                ],
                labels: [
                    {
                        message: name,
                        width: 0,
                        height: 0,
                        orientation: 'vertical',
                        position: {
                            location: 'center-left',
                            diffX: 15,
                            diffY: 0
                        },
                        attachEvents: false
                    }
                ],
                lns_name: name,
                focusLabel: true,
                corona : [
                    {
                        name: RIA_I18N.designer.pannel.dele,
                        className: 'mafe-corona-delete',
                        onClick:  function (item) {
                            PMUI.getActiveCanvas().removeElements();
                        },
                        column: 0
                    }
                ]
            };
            jQuery.extend(true, defaultOptions, options);
            customshape = new PMPool(defaultOptions);
            break;
        case 'LANE':
            defaultOptions = {
                width: 500,
                height: 200,
                "canvas": pmCanvas,
                "connectAtMiddlePoints": false,
                //drag: 'bpmndrag',
                topLeft: true,
                connectionType: 'dotted',
                resizeBehavior: "laneResize",
                resizeHandlers: {
                    type: "Rectangle",
                    total: 8,
                    resizableStyle: {
                        cssProperties: {
                            'background-color': "rgb(0, 255, 0)",
                            'border': '1px solid black'
                        }
                    },
                    nonResizableStyle: {
                        cssProperties: {
                            'background-color': "white",
                            'border': '1px solid black'
                        }
                    }
                },
               
                "drop": {
                    type: "pmcontainer",
                    selectors: [
                        "#TASK",
                        "#AUTO_TASK",
                        "#SUB_PROCESS",
                        "#START",
                        "#END",                          
                        "#EXCLUSIVE",
                        "#PARALLEL",
                        "#INCLUSIVE",
                        "#GROUP",
                        "#TEXT_ANNOTATION",
                        ".mafe-event-start",
                        ".mafe-event-intermediate",
                        ".mafe-event-end",
                        ".pmui-pmactivity",
                        ".pmui-pmgateway",
                        ".pmui-pmdata",
                        ".mafe-artifact-annotation",
                        ".mafe-artifact-group"
                    ]
                },
                container: "lane",
                layers: [
                    {
                        layerName: "first-layer",
                        priority: 2,
                        visible: true,
                        style: {
                            cssProperties: {
                            	
                            }
                        }
                    }
                ],
                labels: [
                    {
                        message: name,          
                        width: 0,
                        height: 0,
                        orientation: 'vertical',
                        position: {
                            location: 'center-left',
                            diffX: 15,
                            diffY: 0
                        }      
                    }
                ],
                lan_name: name,
                focusLabel: true

            };
            jQuery.extend(true, defaultOptions, options);
            customshape = new PMLane(defaultOptions);
            break;

        }
        if (customshape && !pmCanvas.readOnly) {
            customshape.attachListeners();
            customshape.extendedType = type;
            menuShape = PMDesigner.getMenuFactory(type);
            customshape.getHTML();
            customshape.setContextMenu(menuShape);

        }
        return customshape;
    };
    PMDesigner.updateLayerClasses = function (options) {
        return [
            'mafe-event-' + options.evn_type.toLowerCase() + '-' + options.evn_marker.toLowerCase() + '-16',
            'mafe-event-' + options.evn_type.toLowerCase() + '-' + options.evn_marker.toLowerCase() + '-24',
            'mafe-event-' + options.evn_type.toLowerCase() + '-' + options.evn_marker.toLowerCase() + '-33',
            'mafe-event-' + options.evn_type.toLowerCase() + '-' + options.evn_marker.toLowerCase() + '-41',
            'mafe-event-' + options.evn_type.toLowerCase() + '-' + options.evn_marker.toLowerCase() + '-49'
        ];
    };
    PMDesigner.updateGatewayLayerClasses = function (options) {
        return [
            'mafe-gateway-' + options.gat_type.toLowerCase() + '-20',
            'mafe-gateway-' + options.gat_type.toLowerCase() + '-30',
            'mafe-gateway-' + options.gat_type.toLowerCase() + '-41',
            'mafe-gateway-' + options.gat_type.toLowerCase() + '-51',
            'mafe-gateway-' + options.gat_type.toLowerCase() + '-61'
        ];
    };
    /*修改流程图显示比例时，修改右上角图标*/
    PMDesigner.updateMarkerLayerClasses = function (options) {
        if (options.act_task_type !== 'EMPTY') {
            return [
                "mafe-" + options.act_task_type.toLowerCase() + "-marker-10",
                "mafe-" + options.act_task_type.toLowerCase() + "-marker-15",
                "mafe-" + options.act_task_type.toLowerCase() + "-marker-21",
                "mafe-" + options.act_task_type.toLowerCase() + "-marker-26",
                "mafe-" + options.act_task_type.toLowerCase() + "-marker-31"
            ];
        }
    };
    PMDesigner.updateLoopLayerClasses = function (options) {
        if (options.act_loop_type !== 'EMPTY') {
            return [
                "mafe-" + options.act_loop_type.toLowerCase() + "-marker-10",
                "mafe-" + options.act_loop_type.toLowerCase() + "-marker-15",
                "mafe-" + options.act_loop_type.toLowerCase() + "-marker-21",
                "mafe-" + options.act_loop_type.toLowerCase() + "-marker-26",
                "mafe-" + options.act_loop_type.toLowerCase() + "-marker-31"
            ];
        }
    };
    PMDesigner.updateDataMarkerLayerClasses = function (options) {
        var type = options.dat_object_type.toLowerCase();
        if (type !== 'dataobject') {
            return [
                "mafe-" + type + "-marker-10",
                "mafe-" + type + "-marker-15",
                "mafe-" + type + "-marker-21",
                "mafe-" + type + "-marker-26",
                "mafe-" + type + "-marker-31"
            ];
        }
    };
}());


/*
 * 在形状栏添加或删除某个形状时可修改此处
 * by siqq
 * */
PMDesigner.sidebar = [];
if(patternFlag && patternFlag=='Monitor'){//监控--上部操作按钮
	PMDesigner.sidebar.push(
			 new ToolbarPanel({
			        buttons: [
			            {
			                selector: 'REFRESH',
			                className: [
			                    'mafe-designer-icon',
			                    'mafe-toolbar-refresh'
			                ],
			                tooltip: RIA_I18N.designer.pannel.refresh
			            }
			        ]
			    }),
			    new ToolbarPanel({
			        buttons: [
			            {
			                selector: 'CURRENT_NODE',
			                className: [
			                    'mafe-designer-icon',
			                    'mafe-toolbar-current-node'
			                ],
			                tooltip: RIA_I18N.designer.pannel.currentNode
			            },
			            {
			                selector: 'PRE_NODE',
			                className: [
			                    'mafe-designer-icon',
			                    'mafe-toolbar-pre-node'
			                ],
			                tooltip: RIA_I18N.designer.pannel.preNode
			            },
			            {
			                selector: 'NEXT_NODE',
			                className: [
			                    'mafe-designer-icon',
			                    'mafe-toolbar-next-node'
			                ],
			                tooltip: RIA_I18N.designer.pannel.nextNode
			            }
			        ]
			    }),
			    new ToolbarPanel({
			        buttons: [
//			            {
//			                selector: 'SUSPEND',
//			                className: [
//			                    'mafe-designer-icon',
//			                    'mafe-toolbar-suspend'
//			                ],
//			                tooltip: RIA_I18N.designer.pannel.hangOrResume
//			            },
//			            {
//			                selector: 'RESTART',
//			                className: [
//			                    'mafe-designer-icon',
//			                    'mafe-toolbar-restart'
//			                ],
//			                tooltip: RIA_I18N.designer.pannel.restart
//			            },
//			            {
//			                selector: 'COMPLETE',
//			                className: [
//			                    'mafe-designer-icon',
//			                    'mafe-toolbar-complete'
//			                ],
//			                tooltip: RIA_I18N.designer.pannel.complete
//			            },
//			            {
//			                selector: 'ABORT',
//			                className: [
//			                    'mafe-designer-icon',
//			                    'mafe-toolbar-abort'
//			                ],
//			                tooltip: RIA_I18N.designer.pannel.abort
//			            }
			        ]
			    })
	);
}else if(patternFlag!=='PrvView'){//当不是监控和表单授权时上部按钮
	PMDesigner.sidebar.push(
		    new ToolbarPanel({
		    	
		        buttons:[
		            {
		                selector: 'TASK',
		                className: [
		                    'mafe-designer-icon',
		                    'np-node-manual'
		                ],
		                tooltip: RIA_I18N.designer.pannel.mannel
		            },
		            {/*add by siqq*/
		                selector: 'AUTO_TASK',
		                className: [
		                    'mafe-designer-icon',
		                    'np-cogs'
		                ],
		                tooltip: RIA_I18N.designer.pannel.auto
		            },
		            {
		                selector: 'SUB_PROCESS',
		                className: [
		                    'mafe-designer-icon',
		                    'np-sitemap'
		                ],
		                tooltip: RIA_I18N.designer.pannel.subProcess
		            }
		        ]
		    }),
		    new ToolbarPanel({
		        buttons: [
		            {
		                selector: 'EXCLUSIVE',
		                className: [
		                    'mafe-designer-icon',
		                    'np-node-chose'
		                ],
		                tooltip: RIA_I18N.designer.pannel.exclusive
		            },
		            /*{
		                selector: 'PARALLEL',
		                className: [
		                    'mafe-designer-icon',
		                    'mafe-toolbar-gateway-parallel'
		                ],
		                tooltip: RIA_I18N.designer.pannel.parallel
		            },*/
		            {
		                selector: 'CONCURRENT',
		                className: [
		                    'mafe-designer-icon',
		                    'np-concurrency'
		                ],
		                tooltip: RIA_I18N.designer.pannel.parallel
		            }
		        ]
		    }),
		    new ToolbarPanel({
		        buttons: [
		            {
		                selector: 'START',
		                className: [
		                    'mafe-designer-icon',
		                    'np-node-on'
		                ],
		                tooltip: RIA_I18N.designer.pannel.start
		            },
		            {
		                selector: 'END',
		                className: [
		                    'mafe-designer-icon',
		                    'np-node-off'
		                ],
		                tooltip: RIA_I18N.designer.pannel.end
		            },
		        ]
		    }),
		    new ToolbarPanel({
		        buttons: [
		            {
		                selector: 'POOL',
		                className: [
		                    'mafe-designer-icon',
		                    'np-swimpool'
		                ],
		                tooltip: RIA_I18N.designer.pannel.pool
		            },
		            {
		                selector: 'LANE',
		                className: [
		                    'mafe-designer-icon',
		                    'np-swimlanes'
		                ],
		                tooltip: RIA_I18N.designer.pannel.lane
		            }
		        ]
		    }),
		    new ToolbarPanel({
		        buttons: [
		            {
		                selector: 'TEXT_ANNOTATION',
		                className: [
		                    'mafe-designer-icon',
		                    'np-conment'
		                ],
		                tooltip: RIA_I18N.designer.pannel.annotation
		            }
		        ]
		    })
		);
}

