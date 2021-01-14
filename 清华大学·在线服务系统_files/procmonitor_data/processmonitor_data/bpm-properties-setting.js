/**
 * 向属性页面传值
 * 
 * */
var closeDialog=function(){
	$("#popup_close").click();
}
PMDesigner.infoPromptBox=function(msg,callbackFunction){
	$("#popup_dialog").wDialog({
		modal:true,
        iframe:true,
        title:'确认删除',
        width:'400px',
        height:'150px',
        message: msg,
        confirm:function(){
        	callbackFunction();
        }
	});
}

var callFlexTree = function(xmlStr , id ,name,type){
	if(type=="appTreeNode"){
		document.getElementsByTagName('iframe')[0].contentWindow.savaAndUpdateApp(xmlStr , id ,name);
	}
}
var callFlex = function(xmlStr , id){
	var nodeStr=PMDesigner.formatNodeToXml(xmlStr,"Parallel");
	menuNode.setPolXml(nodeStr.documentElement);
	menuNode.setParUid(id);
	var displayName = nodeStr.documentElement.getAttribute("name");
	menuNode.setName(displayName);
	//menuNode.setActName(displayName);
	var project=PMDesigner.project;
	project.setDirty(true);
	project.setSaveButtonDisabled();
}
var menuNode=null;
var IntroHelper = function (options) {
    this.steps = [];
    this.introjs = null;
    IntroHelper.prototype.initObject.call(this, options);
};
IntroHelper.prototype.type = 'IntroHelper';

IntroHelper.prototype.initObject = function (options) {
    var defaults = {
        steps: [],
        skipLabel: "Skip"

    };
    $.extend(true, defaults, options);
    this.setSteps(defaults.steps);

    this.setSkipLabel(defaults.skipLabel);
    this.setNextLabel(defaults.nextLabel);
    this.setPrevLabel(defaults.prevLabel);
    this.setDoneLabel(defaults.doneLabel);

};

IntroHelper.prototype.setSteps = function (steps) {
    this.steps = steps;
    return this;
};

IntroHelper.prototype.setSkipLabel = function (label) {
    this.skipLabel = label;
    return this;
};
IntroHelper.prototype.setNextLabel = function (label) {
    this.nextLabel = label;
    return this;
};

IntroHelper.prototype.setPrevLabel = function (label) {
    this.prevLabel = label;
    return this;
};

IntroHelper.prototype.setDoneLabel = function (label) {
    this.doneLabel = label;
    return this;
};

IntroHelper.prototype.setSkipLabel = function (label) {
    this.skipLabel = label;
    return this;
};

IntroHelper.prototype.startIntro = function () {
    this.introjs = introJs();
    this.introjs.setOptions({
        steps: this.steps,
        skipLabel: this.skipLabel,
        nextLabel: this.nextLabel,
        prevLabel: this.prevLabel,
        doneLabel: this.doneLabel
    });

    this.introjs.start();
};
PMDesigner.setMenuNode=function(activity){
	if(this.menuNode!==null)
		menuNode=null;
	menuNode=activity;
}
PMDesigner.getCanRollbackNode = function(thisNodeID){
	//为手动节点时，添加可回退节点，即除了本身之外的所有手动节点的id和name
	var canRollbackNodeStr = "";//like:    id,name;id,name;
	var diagram = PMDesigner.project.diagrams.get(0);
	var elements = diagram.getCustomShapes().asArray();
	for (var j = 0; j < elements.length; j++) {
		if(elements[j].type=="PMActivity"){
			var dataObject = elements[j].getDataObject();
			if(dataObject.act_type == 'TASK' && dataObject.act_uid != thisNodeID){
				canRollbackNodeStr += dataObject.act_uid+','+dataObject.act_name+';';
			}
		}
	}
	return canRollbackNodeStr;
}
PMDesigner.sendDataToJsp=function(xmlStr1,ids){
     xmlStr=xmlStr1;
     var idArray=ids.split(";");
	 //目前只取第一个选中节点，作为示例
	  var typeAndId=idArray[0].split(",");
	 type=typeAndId[0];
	 id  =typeAndId[1];
	 flag="ok";
     isNewVersion = isNewVersion;
     editable = editable;
     operatable = operatable;
     canRollbackNodeStr = "";
     isBranch=false;/*标记传输线的前一节点是否为并发开始节点*/
     dynamicBranch="";
     if(type=='1'){//为手动节点时，添加可回退节点，即除了本身之外的所有手动节点
    	 canRollbackNodeStr = PMDesigner.getCanRollbackNode(id);
     }
     if(type=='Transition' && menuNode.getSrcPort().parent.extendedType==='PARALLEL'){
    	 isBranch=true;
    	 dynamicBranch=menuNode.getDynamicBranch();
     }
     var openUrl = contextPath+"/workflow/webdesign/attributes/forward.jsp";
     var containerId = "popupDiv";
	//  Transition 传输线
	//  Process	流程
	//  Data	数据
	// 	Application	应用程序
	// 	Lane
	// 	TextAnnotation
    var title = "";
    var width = 720;
    var height = 550;
    if(type=="Process"){
		// 如果打开的是流程
	   	title = procmodifydetailMessage.title.proccess;
	   	width = 720;
	   	height = 550;
    }else if(type=="Transition"){
	   	// 如果打开的是传输线
	   	title = procmodifydetailMessage.title.transition;
	   	width = 720;
	   	height = 380;
    }else if(type=="1"){
		// 如果打开的是手动节点
	   	title = procmodifydetailMessage.title.manualnode;
	   	width = 720;
	   	height = 550;
    }else if(type=="8"){
    	// 开始节点
	   	title = procmodifydetailMessage.title.startnode;
	   	width = 720;
	   	height = 380;
    	
    }else if(type=="5"){
    	// 选择节点
	   	title = procmodifydetailMessage.title.choicenode;
	   	width = 720;
	   	height = 380;
    }else if(type=="9"){
    	// 结束节点
	   	title = procmodifydetailMessage.title.endnode;
	   	width = 720;
	   	height = 380;
    }else if(type=="16"){
    	// 并发
	   	title = procmodifydetailMessage.title.parallelnode;
	   	width = 720;
	   	height = 480;
    }
    else if(type=="0"){
    	// 自动
	   	title = procmodifydetailMessage.title.autonode;
	   	width = 720;
	   	height = 550;
    }
    else if(type=="Lane"){
		// 泳道    	
	   	title = procmodifydetailMessage.title.lane;
	   	width = 720;
	   	height = 380;
    }
    else if(type=="2"){
    	// 子流程
	   	title = procmodifydetailMessage.title.subflownode;
	   	width = 720;
	   	height = 550;
    }
    else if(type=="TextAnnotation"){
    	// 注释
	   	title = procmodifydetailMessage.title.annotation;
	   	width = 720;
	   	height = 380;
    }
    
    else if(type=="19"){
    	// 分支节点
	   	title = procmodifydetailMessage.title.branch;
	   	width = 720;
	   	height = 380;
    }
    else if(type=="20"){
    	// 分支开始
	   	title = procmodifydetailMessage.title.branchbegin;
	   	width = 720;
	   	height = 380;
    }
    else if(type=="21"){
    	// 分支结束
	   	title = procmodifydetailMessage.title.branchend;
	   	width = 720;
	   	height = 380;
    }
    PMDesigner.showPopupDialog(containerId,title,openUrl,width,height);
}

PMDesigner.viewTreeElement = function(xmlStr1,id1,type1,flag1){
    flag=flag1;
    xmlStr=xmlStr1;
    id=id1;
    type=type1;
    isNewVersion = isNewVersion;
    editable = editable;
    operatable =operatable;
    var openUrl = contextPath+"/workflow/webdesign/attributes/forward.jsp";
    var width = 720;
    var height = 550;
    if(type=="1"){
     	// 节点模板
 	   	title = procmodifydetailMessage.title.NodeTemplate;
     }
     else if(type=="appTreeNode"){
     	// 应用程序
 	   	title = procmodifydetailMessage.title.Application;
     }
    var containerId = "popupDiv";
    PMDesigner.showPopupDialog(containerId,title,openUrl,width,height);
}

PMDesigner.showPopupDialog = function(containerId,title,url,width,height,confirmFunction){
	if(!confirmFunction){
		confirmFunction = function(){
			var objectIFrame = window.frames[0];
			var tempCompareObj = null;
			for(var i=0;i<window.frames.length;i++){
				tempCompareObj = window.frames[i].document.forms;
				if(tempCompareObj&&tempCompareObj.length>0){
					objectIFrame = window.frames[i];
					break;
				}
			}
			objectIFrame.submit_onclick();
			return false;
		};
	}
	$('#'+containerId).wDialog({
	    modal:true,
	    iframe:true,
	    title:title,
	    width:width+'px',
	    height:height+'px',
	    loadUrl:url,
	    confirm:confirmFunction
	});
} 
PMDesigner.callBackProcSaveXMLIdName = function(xmlStr , id, name){
	var formattedXmlStr = PMDesigner.formatBackXml(xmlStr);
	var processXmlDom = PMDesigner.strToXml(formattedXmlStr);
	var preProcXmlDom = PMDesigner.strToXml(menuNode.processXml);
	processXmlDom.getElementsByTagName("Process")[0].setAttribute("versionName",preProcXmlDom.getElementsByTagName("Process")[0].getAttribute("versionName"));
	processXmlDom.getElementsByTagName("Process")[0].setAttribute("buildTime",preProcXmlDom.getElementsByTagName("Process")[0].getAttribute("buildTime"));
	processXmlDom.getElementsByTagName("Process")[0].setAttribute("modifiedTime",preProcXmlDom.getElementsByTagName("Process")[0].getAttribute("modifiedTime"));
	
	menuNode.description=processXmlDom.getElementsByTagName("Process")[0].getAttribute("description");
	menuNode.processXml = PMDesigner.xmlToStr(processXmlDom);;
	menuNode.projectId = id;
	menuNode.setProjectName(name);
	var project=PMDesigner.project;
	project.setDirty(true);
	project.setSaveButtonDisabled();
	//project.isSave = true;
    //project.save(true);
}
PMDesigner.callBackSaveXMLIdName = function(xmlStr , id, name){//这个name是参与人
	if(xmlStr.indexOf('h5_rt_template="true"')>-1){//节点模板属性页返回的值
		document.getElementsByTagName('iframe')[0].contentWindow.savaAndUpdateTemplate(xmlStr , id ,name);
		return;
	}
	var type=menuNode.getActivityType();
	var nodeType;
	if(type.indexOf("SUB_PROCESS")>-1)
	{
		nodeType="SubprocNode";
	}else if(type.indexOf("AUTO_TASK")>-1)
	{
		nodeType="AutoNode";
	}else
	{
		nodeType="ManualNode";
	}	
	var nodeStr=PMDesigner.formatNodeToXml(xmlStr,nodeType);
	
	menuNode.setActXml(nodeStr.documentElement);
	menuNode.setActivityUid(id);
	var displayName = nodeStr.documentElement.getAttribute("name");
	menuNode.setName(displayName);
	menuNode.setActName(displayName);
	var project=PMDesigner.project;
	project.setDirty(true);
	project.setSaveButtonDisabled();
	if(nodeType=="ManualNode"){
		menuNode.myTitle='';
	}
}
PMDesigner.callBackSaveXMLIdNameType = function(xmlStr , id,name,templateNodeType){//这个name是参与人
	var formattedXmlStr = PMDesigner.formatNodeToXml(xmlStr);
	menuNode.setActXml(formattedXmlStr);
	menuNode.setActivityUid(id);
	var displayName = nodeStr.documentElement.getAttribute("name");
	menuNode.setName(displayName);
	menuNode.setActName(displayName);
	menuNode.setTaskType(templateNodeType);
}
//传输线回调函数
PMDesigner.callBackSaveXMLTransition = function(xmlStr , id , extendProperties){
	var xmlDom=PMDesigner.strToXml(xmlStr);
	var transitionXml=$(xmlDom).find("Transition")[0];
	menuNode.setFlowXml(transitionXml);
	menuNode.setFlowUid(id);
	var displayName = $(transitionXml).attr("name");
	menuNode.setName(displayName);
	menuNode.setFlowName(displayName);
	
	menuNode.setDynamicBranch(extendProperties);
	var project=PMDesigner.project;
	project.setDirty(true);
	project.setSaveButtonDisabled();
}
//替换节点中字符串的格式化方法
PMDesigner.formatNodeToXml  = function(xmlStr,nodeType){
	
	var headerRubbish = 'xmlns:uwws="http://workflow.neusoft.com/model/" xmlns:model="http://workflow.neusoft.com/model/"';
	var bodyStr = xmlStr.replace(/xml-fragment/g,nodeType).replace(headerRubbish,'');
	var rtnXmlDom = PMDesigner.strToXml(bodyStr);
	return rtnXmlDom;
}
//替换字符串的格式化方法
PMDesigner.formatBackXml = function(xmlStr){

//	var xmlStr = xml.toString();
	var headStr = '<uwws:ProcessContent xmlns:uwws="http://workflow.neusoft.com/model/" xmlns:model="http://workflow.neusoft.com/model/">';
	var headerRubbish = 'xmlns:uwws="http://workflow.neusoft.com/model/" xmlns:model="http://workflow.neusoft.com/model/"';
	var bodyStr = xmlStr.replace(/xml-fragment/g,'Process').replace(headerRubbish,'');
	var tailStr =  '</uwws:ProcessContent>';
	var rtnXmlDom = headStr+bodyStr+tailStr;
	return rtnXmlDom;
	
}


//操作xml方法
PMDesigner.formatBackXmlBackup = function(xmlStr){
//	 XmlDocument xmlDoc=new XmlDocument();
//	 xmlDoc.CreateElement("uwws:ProcessContent");
//	 XmlElement xe1 xe1.SetAttribute("genre","李赞红");
	var headStr = '<uwws:ProcessContent xmlns:uwws="http://workflow.neusoft.com/model/" xmlns:model="http://workflow.neusoft.com/model/">';
//	var xmlDom = PMDesigner.strToXml(xmlStr);
}