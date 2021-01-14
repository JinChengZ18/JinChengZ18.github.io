/**
 * 定义流程定义对象
 */
var PMProject;
PMProject = function(options) {
    this.diagrams = new PMUI.util.ArrayList();
    this.keys = null;
    this.waitingResponse = false;
    this.identifiers = {};
    this.isSave = false;
    this.XMLSupported= true;
    this.isClose= false;
    
    this.dirtyElements = [
        {
            laneset: {},
            lanes: {},
            activities: {},
            events:{},
            gateways:{},
            flows:{},
            artifacts: {},
            lines: {},
            data: {},
            participants: {},
            concurrent:{}
        },
        {
            laneset: {},
            lanes: {},
            activities: {},
            events:{},
            gateways:{},
            flows:{},
            artifacts: {},
            lines: {},
            data: {},
            participants: {},
            concurrent: {}
        }
    ];
    PMProject.prototype.init.call(this, options);
};

PMProject.prototype.init = function (options) {
    var defaults = {
        projectId: "",
        projectName: "",
        description: "",
        processXml:"",
        remoteProxy: null,
        localProxy: null,
        keys: {
            access_token: null,
            expires_in: null,
            token_type: null,
            scope: null,
            refresh_token: null,
            client_id: null,
            client_secret: null
        },
        listeners: {
            create : function(){},
            remove : function(){},
            update : function(){},
            success: function(){},
            failure: function(){}
        }
    };
    jQuery.extend(true, defaults, options);
    this.setKeysClient(defaults.keys)
        .setID(defaults.id)
        .setTokens(defaults.keys)
        .setListeners(defaults.listeners);
    //this.setProcessNameOndblClick();
};

/**
 * 双击流程名称时，可以对流程名称进行修改
 * */
PMProject.prototype.setProcessNameOndblClick = function () {
	jQuery(".navBar div").remove();//jQuery(".navBar div:not(#processName)").remove();        	
    jQuery(".navBar").append("<div id='processName' title='双击可编辑名称' style='margin-top:8px ;width:200px;height:25px'></div>")
    jQuery(".navBar div").append( "<span  style='width: auto; height: auto; line-height: 20px; display: block;'>" + this.projectName + "</span>" )
                         .append( "<input style='width:150px;padding: 2px;position:absolute;display: none;margin-top:-2px;background-color:white;color:black;border:black'>");
    jQuery(".navBar").tooltip({tooltipClass: "mafe-action-tooltip"});
    $("div#processName").dblclick(function(){
    	jQuery("div#processName span").css("display","none");
        jQuery("div#processName input").val(jQuery("div#processName span").text());
        jQuery("div#processName input").css("display","block"); 
        jQuery(jQuery("div#processName input")).select();
    });
    $("div#processName input").click(function(event){
    	event.stopPropagation();
    });
//    $("div#processName input").blur(function(){
//        var processName=jQuery("div#processName input").val();
//        this.setProjectNameOndbclick(processName);
//    });
    $("div#processName input").keypress(function(e) {  
        if(e.which == 13) {  
        	jQuery("div#processName span").text(jQuery("div#processName input").val());
            jQuery("div#processName span").css("display","block");
            jQuery("div#processName input").css("display","none"); 	 
        }  
    });
};
PMProject.prototype.setProjectNameOndbclick=function(name){
	 jQuery("div#processName span").text(name);
     jQuery("div#processName span").css("display","block");
     jQuery("div#processName input").css("display","none");  
     var processXml=this.processXml;
     var projectName=this.projectName;
     this.processXml=processXml.replace(projectName,name);
     this.setProjectName(name);
     this.setDirty(true);
 	 this.setSaveButtonDisabled();
}
PMProject.prototype.setID = function (id) {
    this.id = id;
    return this;
};
/**
 * 设置流程xml
 * */
PMProject.prototype.setProcessXml = function (processXml) {
    this.processXml = processXml;
    return this;
};
PMProject.prototype.getProcessXml = function () {
    return this.processXml;
};

PMProject.prototype.setProjectId = function (id) {
    if (typeof id === "string") {
        this.projectId = id;
    }
    return this;
};

PMProject.prototype.setXMLSupported = function (value) {
    if(typeof value == "boolean")
        this.XMLSupported = value;
    return this;
};

PMProject.prototype.setProjectName = function (name) {
    if (typeof name === "string") {
        this.projectName = name;
    };
    if ( jQuery( "div#processName span").length > 0) {
    	jQuery( "div#processName span").text(name);
    };
    return this;
};

PMProject.prototype.setDescription = function (description) {
    this.description = description;
    return this;
};

PMProject.prototype.setKeysClient = function (keys) {
    if (typeof keys === "object") {
        this.keys = keys;
    }
    return this;
};

PMProject.prototype.setListeners = function (listeners) {
    if (typeof listeners === "object") {
        this.listeners = listeners;
    }
    return this;
};
/**
 * Sets the time interval used to save automatically
 * @param {Number} interval Expressed in miliseconds
 * @return {*}
 */
PMProject.prototype.setSaveInterval = function (interval) {
    this.saveInterval = interval;
    return this;
};

PMProject.prototype.getKeysClient = function () {
    //var token = Base64.decode(this.keys);
    var keys = this.keys;
    return {
        access_token: keys.access_token,
        expires_in: keys.expires_in,
        token_type: keys.token_type,
        scope: keys.scope,
        refresh_token: keys.refresh_token,
        client_id: keys.client_id,
        client_secret: keys.client_secret
    };
};
PMProject.prototype.buildCanvas = function (selectors, options) {
	var canvasTop,canvasLeft;
	if(patternFlag=='Monitor'||patternFlag=='PrvView'||patternFlag=='FormServerDesigner'||patternFlag=='CreateByTemplate'){
		canvasTop = 44;
		canvasLeft = 0;//画布向右偏移工具栏的宽度
	}else{
		canvasTop = 35;
		canvasLeft = 210;//画布向右偏移工具栏的宽度
	}
	
	var canvasHeight=$(window).height()-canvasTop;
	var canvasWidth=$(window).width()-canvasLeft;
    var canvas = new PMCanvas({/*定义画布即流程绘图区 by siqq*/
        id: PMUI.generateUniqueId(),
        project: PMDesigner.project,
        top: canvasTop,
        left: canvasLeft,
        topScroll: canvasTop,
        leftScroll: canvasLeft,
        width: canvasWidth,
        height: canvasHeight,
        style: {
            cssProperties: {
                overflow: "hidden"
            }
        },
        drop: {
            type: 'canvasdrop',
            selectors: selectors
        },
        container: "pmcanvas",
        readOnly: prj_readonly === 'true' ? true : false,
        hasClickEvent : true,
        copyAndPasteReferences: {
            PMEvent: PMEvent,
            PMGateway: PMGateway,
            PMActivity: PMActivity,
            PMArtifact: PMArtifact,
            PMFlow: PMFlow
        }
    });
 
    jQuery("#div-layout-canvas").append(canvas.getHTML());
    
    jQuery("#div-layout-canvas").children().eq(0).prepend('<div class="swiper-btngroup col-md-7 col-sm-7 col-xs-7 padding-none push-down-10 push-up-5" style="width:auto;"><div class="swiper-note" style="z-index: 999;"><span class="fa fa-hand-o-up"></span>流程图是可以滑动的哦！！！<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button></div></div>');
    
	if(document.body.scrollWidth<=767){
		$(".close").click(function(){
			$(".swiper-note").hide();
		})
		$(".swiper-note").show();
		//setTimeout('$(".swiper-note").hide()',11000);
	}
  //start by lv.yz
    jQuery("#div-layout-canvas").children().eq(0)
    .on("dragover",function(ev){
//        if(iframeWindow.isCrossIFrameDragging) {
            ev.preventDefault();
            ev.originalEvent.dataTransfer.dropEffect = 'move';
//        }
    }).on("drop",function(ev){
    	PMProject.prototype.resourceTreeViewDrop(ev,null);
    });
    //end by lv.yz
    canvas.toogleGridLine();
    canvas.setShapeFactory(PMDesigner.shapeFactory);
    canvas.attachListeners();
    canvas.createConnectHandlers('','');
//    canvas.readOnly = true;
    var menuCanvas = PMDesigner.getMenuFactory("CANVAS");
    canvas.setContextMenu(menuCanvas);

    PMDesigner.canvasList.addOption(
        {
            label: options.name,
            value: canvas.getID()
        });

    this.diagrams.insert(canvas);
    return canvas;
};
PMProject.prototype.resourceTreeViewDrop = function (ev,containerShape) {
	
	if(!ev.originalEvent || ev.originalEvent.dataTransfer == undefined ){//|| containerShape == null
		return;
	}
	var df = ev.originalEvent.dataTransfer;
	var resourceViewFlag = df.getData("resourceViewFlag");
	var iframeWindow = $('#resourceViewIFrame')[0].contentWindow;
	if(resourceViewFlag != 'true'||!iframeWindow.isCrossIFrameDragging){
		return;
	}
    var activity_type = df.getData("activityType");
    var activity_xml = df.getData("xml");
    var activity_name = df.getData("activityName");
    
	//原方法的三个参数shape,e, ui;
	var shape ;
	if(containerShape == null){
		shape = PMDesigner.project.diagrams.get(0);
	}else {
		shape = containerShape;
	}
	var e = ev;
	e.pageX = e.originalEvent.pageX;
	e.pageY = e.originalEvent.pageY;
	var ui = "";
	 var customShape = null,
     canvas = shape.getCanvas(),
     selection,
     sibling,
     i,
     command,
     coordinates,
     id,
     shapesAdded = [],
     containerBehavior = shape.containerBehavior;
	 if (canvas.readOnly) {
         return false;
     }
     shape.entered = false;
     id = activity_type; //ui.draggable.attr('id');
     customShape = canvas.shapeFactory(activity_type);
     customShape.setName(activity_name);
     customShape.setActName(activity_name);
     var nodeType;
 	if(activity_type.indexOf("SUB_PROCESS")>-1)
 	{
 		nodeType="SubprocNode";
 	}else if(activity_type.indexOf("AUTO_TASK")>-1)
 	{
 		nodeType="AutoNode";
 	}else
 	{
 		nodeType="ManualNode";
 	}
 	var nodeStr=PMDesigner.formatNodeToXml(activity_xml,nodeType);
 	$(nodeStr).find(nodeType).attr('ID',customShape.getID());
     customShape.setActXml(nodeStr.documentElement);
     
	 if(false){
		 
	 }else{
         coordinates = PMUI.pageCoordinatesToShapeCoordinates(shape, e,null,null,customShape);
         var result = shape.addElement(customShape, coordinates.x, coordinates.y,
             customShape.topLeftOnCreation);
         if(shape.containerBehavior.addElementLane !== true){
                 //since it is a new element in the designer, we triggered the
                     //custom on create element event
             canvas.hideAllCoronas();
             canvas.updatedElement = customShape;
             if (customShape.getType() === 'PMLane') {
                 command = new PMCommandCreateLane(customShape);
                 canvas.commandStack.add(command);
                 command.execute();
             } else {
                 // create the command for this new shape
                 command = new PMUI.command.CommandCreate(customShape);
                 canvas.commandStack.add(command);
                 command.execute();
                 if (customShape.label && customShape.focusLabel) {
                     customShape.label.getFocus();
                 }
             }
             canvas.hideAllFocusLabels();
             if (customShape.label && customShape.focusLabel) {
                 customShape.label.getFocus();
             }
          }
	 }
};

PMProject.prototype.getKeysClient = function () {
    var keys = this.keys;
    return {
        access_token: keys.access_token,
        expires_in: keys.expires_in,
        token_type: keys.token_type,
        scope: keys.scope,
        refresh_token: keys.refresh_token,
        client_id: keys.client_id,
        client_secret: keys.client_secret
    };
};
/**
 * 初始化流程模板
 * */
PMProject.prototype.getInitProcess = function () {
	var createTime,user,proId,startId,processData;
	$.ajax({
        url: contextPath+'/workflow/getInitProcess.action',
        dataType: "json",
        async: false,
        success: function (data) {
        	createTime=data.createTime;
        	user=data.userName;
        	proId=data.proId;
        	startId=data.startID;
        },
        error: function () {
            $(".loader").fadeOut("slow"); //remove loader gif
            alert("流程模板读取错误");
        }
    });
	if(patternFlag=='FormServerDesigner'){
		var manualId=PMUI.generateUniqueId();
		var transitionId=PMUI.generateUniqueId();
		
		var offset_x = 190;
		var offset_y = 292;
		
		processData='<uwws:ProcessContent xmlns:uwws="http://workflow.neusoft.com/model/" xmlns:model="http://workflow.neusoft.com/model/">'
					+'<Process ID="'+ proId +'" name="New Process" x="0" y="0" msgReceiver="appmanager" versionName="V1" isActiveVersion="1" isCompleted="0" builder="'+ user +'" buildTime="'+ createTime +'">'
				    +'  <transitions>'
				    +'  	<Transition id="'+ transitionId +'" name=" " x="0" y="0" source="'+ startId +'" target="'+ manualId +'" priority="0" bendpoints="123,105;225,105"/>'
				    +'	</transitions>'
				    +'  <associations/>'
				    +'  <textAnnotations/>'
				    +'  <datas/>'
				    +'  <laneSet/>'
				    +'	<StartNode ID="'+ startId +'" name="开始节点" x="70" y="78"/>'
				    +'  <ManualNode id="'+ manualId +'" ID="'+ manualId +'" name="服务发起人" msgReceiver="appmanager" operationLevel="1" assignRule="0"  application="" category="" description="" x="225" y="78" width="52" height="52">'
				    +'		<customProperties>'
				    +'			<customInfo>'
				    +'  			<rollbackNode/>'
				    +'  			<mustbeResetParticipantsNode/>'
				    +'  			<noMustbeResetParticipantsNode/>'
				    +'			</customInfo>'
				    +'		</customProperties>'
					+'  	<extendProperties>'
					+'    		<ExtendProperty name="$_operatorfiltertype" value="0"/>'
					+'    		<ExtendProperty name="$_operatorfiltertype_reader" value="0"/>'
					+'    		<ExtendProperty name="$isFirstNode" value="1"/>'
					+'          <ExtendProperty name="cache_ext" value="暂存"/>'
					+'          <ExtendProperty name="cache_ext_radio" value="1"/>'
					+'          <ExtendProperty name="agree_ext" value="提交"/>'
					+'          <ExtendProperty name="agree_ext_radio" value="1"/>'
					+'          <ExtendProperty name="send_ext" value="送达"/>'
					+'          <ExtendProperty name="send_ext_radio" value="0"/>'
					+'          <ExtendProperty name="back_ext" value="回退"/>'
					+'          <ExtendProperty name="back_ext_radio" value="0"/>'
					+'          <ExtendProperty name="end_ext" value="终止"/>'
					+'          <ExtendProperty name="end_ext_radio" value="0"/>'
					+'          <ExtendProperty name="pass_ext" value="传阅"/>'
					+'          <ExtendProperty name="pass_ext_radio" value="0"/>'
					+'          <ExtendProperty name="comm_ext" value="沟通"/>'
					+'          <ExtendProperty name="comm_ext_radio" value="0"/>'
					+'          <ExtendProperty name="reset_ext" value="重新填报"/>'
					+'          <ExtendProperty name="reset_ext_radio" value="0"/>'
					+'    		</extendProperties>'
					+'		<expiration>'
					+'		    <duration condition="0"/>'
					+'		    <action application="" type="5"/>'
					+'		    <alertVariable condition=""/>'
					+'		    <alertDuration condition=""/>'
					+'		    <alertAction application="noApplication" type="1" count="1" interval="5"/>'
					+'		</expiration>'
					+'		<preCondition condition=""/>'
					+'		<postCondition condition=""/>'
					+'  	<engineEvents/>'
					+'	  <participants>'
					+'	    <Participant authorityType="1" value="2" type="10"/>'
					+'	  </participants>'
					+'  </ManualNode>'
				    +'	<textAnnotations>'
				    +'	</textAnnotations>'
				    +'  <applications/>'
				    +'</Process>'
				  +'</uwws:ProcessContent>';
	}else{
		var height=($(window).height() - 70)/2;
		processData='<uwws:ProcessContent xmlns:uwws="http://workflow.neusoft.com/model/" xmlns:model="http://workflow.neusoft.com/model/">'
			    +'<Process ID="'+ proId +'" name="New Process" x="0" y="0" msgReceiver="appmanager" versionName="V1" isActiveVersion="1" isCompleted="0" builder="'+ user +'" buildTime="'+ createTime +'">'
			    +'  <transitions>'
			    +'	</transitions>'
			    +'  <associations/>'
			    +'  <textAnnotations/>'
			    +'  <datas/>'
			    +'  <laneSet/>'
			    +'	<StartNode ID="'+ startId +'" name="开始节点" x="50" y="'+ height +'"/>'
			    +'	<textAnnotations>'
			    +'	</textAnnotations>'
			    +'  <applications/>'
			    +'</Process>'
			  +'</uwws:ProcessContent>';
	}
	return processData;
}
PMProject.prototype.load = function () {
    var keys = this.getKeysClient(),
        that = this,
        processData;
   
    if(prj_uid==""){
    	processData=this.getInitProcess();
    	that.dirty = false;
        that.loadProcess(processData);
        $(".loader").fadeOut("slow");
    }else{
    	//在Flex 中，是在/UW_WebConsole/WebRoot/workflow/processCommon/swf/bsdesign-view.xml 中读取的pluginClass值
    	var customPropertyPlugin = 'com.neusoft.uniflow.web.processcommon.flash.data.DefaultDefinitionFilePlugin';
    	$.ajax({
            url: contextPath+'/workflow/getdata.action',
            data: {selectedID:prj_uid,selectedVersion:version,customPropertyPlugin:customPropertyPlugin},
            dataType: "text",
            success: function (data) {
            	processData = data;
                that.dirty = false;
                that.loadProcess(processData);
                $(".loader").fadeOut("slow");  //remove loader gif
            },
            error: function () {
                $(".loader").fadeOut("slow"); //remove loader gif
//                alert("流程读取错误"); //by 刘淼，没必要显示。
            }
        });
    }
    return this;
};
PMProject.prototype.loadProcess = function (process) {
	if(patternFlag=='CreateByTemplate'){//根据流程模板新建
		if(PMDesigner.createByTemplate===undefined){
			PMDesigner.createByTemplate='alreadResetedIDs';
			PMDesigner.resetAllIDs(process);
			return;
		}
	}
	var that = this,
    i,
    j,
    moddle,
    imported = false,     // imported flag
    sidebarCanvas = [];
	var xmlDom=PMDesigner.strToXml(process);
	var processObj=$(xmlDom).find("Process");
	//this.preTreat(xmlDom);
	if (processObj) {
        this.loadingProcess = true;
        this.setProjectId($(processObj).attr("ID"));
        this.setProjectName($(processObj).attr("name"));
        this.setDescription($(processObj).attr("description"));
        var processXmlDom=this.getProcessXmlDom(process);
   	 	this.setProcessXml(PMDesigner.xmlToStr(processXmlDom));
   	 	this.setProcessNameOndblClick();
   	 	this.dealTransitionForCon(processObj);

        if ($(processObj).attr("prj_bpmn_file_upload")) {	
            that.importDiagram(project.prj_bpmn_file_upload);
        } else {
//        	jQuery(".bpmn_shapes").empty();
        		for (j = 0; j < PMDesigner.sidebar.length; j += 1) {
                    sidebarCanvas = sidebarCanvas.concat(PMDesigner.sidebar[j].getSelectors());
                    jQuery(".bpmn_shapes").append(PMDesigner.sidebar[j].getHTML());
                }  
	      jQuery("#mCSB_1").remove();
                sidebarCanvas.splice(8, 1);  //to remove lane selector
               // sidebarCanvas.splice(16, 1);  //to remove boundary event selector

                sidebarCanvas = sidebarCanvas.concat('.mafe-event-start');
                sidebarCanvas = sidebarCanvas.concat('.mafe-event-intermediate');
                sidebarCanvas = sidebarCanvas.concat('.mafe-event-end');
                sidebarCanvas = sidebarCanvas.concat('.pmui-pmactivity');
                sidebarCanvas = sidebarCanvas.concat('.pmui-pmgateway');
                sidebarCanvas = sidebarCanvas.concat('.pmui-pmdata');
                sidebarCanvas = sidebarCanvas.concat('.mafe-artifact-annotation');
                sidebarCanvas = sidebarCanvas.concat('.mafe-artifact-group');
                sidebarCanvas = sidebarCanvas.concat('.mafe-pool');
                sidebarCanvas = sidebarCanvas.concat('.pmui-pmparallel');
                sidebarCanvas = sidebarCanvas.concat('.mafe_participant');

                var canvas =  PMDesigner.project.buildCanvas(sidebarCanvas, {name: 'Main'});
                PMUI.setActiveCanvas(canvas);
                jQuery("#p-center-layout").scroll(canvas.onScroll(canvas, jQuery("#p-center-layout")));

                var xmlStr =
                    '<?xml version="1.0" encoding="UTF-8"?>' +
                    '<bpmn2:definitions xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" id="BPMNProcessmaker" targetNamespace="http://bpmn.io/schema/bpmn">' +
                    '</bpmn2:definitions>';
                if(!isIE8()){
                	 PMDesigner.moddle.fromXML(xmlStr, function(err, definitions) {
 	                    PMDesigner.businessObject = definitions;
 	                    that.initializeProcess(canvas, processObj);
 	                });
                }else{
                	that.initializeProcess(canvas, processObj);
                }         
        }    
    }
	
	
}
PMProject.prototype.initializeProcess=function (canvas,processObj){
	var that=this;
	 canvas.buildDiagram(that.fromXmlTodiagram($(processObj)[0]));
     /*根据画布上节点位置，更新画布大小*/
     if(canvas.getType() && canvas.getType()==="PMCanvas"){
      	var newWidth = canvas.getDimentionX() + 100;
      	var newHeight = canvas.getDimentionY() +100;
      	if(newWidth>canvas.getWidth())
      		canvas.setWidth(newWidth);
      	if(newHeight>canvas.getHeight())
      		canvas.setHeight(newHeight);
     }
     if(PMDesigner.isFromImported==true||PMDesigner.isFromCreateByTemplate==true){
     	that.setDirty(true);
     	PMDesigner.isFrom2Imported = false;
     	PMDesigner.isFromCreateByTemplate=false
     }else{
     	that.setDirty(false);
     }
     that.loadingProcess = false;
     that.loaded = true;
     that.setSaveButtonDisabled();
     PMDesigner.modeReadOnly();
     if(patternFlag=="Monitor"){//lv.yz 监控
     	PMDesigner.getActivityInstInfo()
     }
}
PMProject.prototype.dealTransitionForCon = function (processObj){
	var parallels=$(processObj).find("Parallel");
	var transitions=$(processObj).children("transitions")[0];

	for(var i=0;i<parallels.length;i++){
		var parallel=parallels[i];
		var parallelStartId=$($(parallel).children("ParallelStartNode")[0]).attr("ID");
		var parallelEndId=$($(parallel).children("ParallelEndNode")[0]).attr("ID");
		var branchs=$(parallel).children("Branch");
		for(var j=0;j<branchs.length;j++){
			var branch = branchs[j];
			var branchId=$(branch).attr("ID")
			var branchStartId=$($(branch).children("BranchStartNode")[0]).attr("ID");
			var branchEndId=$($(branch).children("BranchEndNode")[0]).attr("ID");
			PMDesigner.branchStartAndEnd[branchId]=branchStartId+","+branchEndId;
			/*更改并发体开始节点与分支间的连线*/
			var transitionToFirstNode=$(transitions).find("Transition[source='"+branchStartId+"']")[0];
			var targetNodeId= $(transitionToFirstNode).attr("target");
			var transitionToBranch=$(transitions).find("Transition[target='"+branchId+"']")[0];
			$(transitionToBranch).attr("target",targetNodeId);
			$(transitionToFirstNode).remove();
			
			var transitionToParallelEnd=$(transitions).find("Transition[source='"+branchId+"']")[0];
			var transitionToBranchEnd =$(transitions).find("Transition[target='"+branchEndId+"']");
			$(transitionToBranchEnd).attr("target",parallelEndId);
			$(transitionToParallelEnd).remove();
			/*把分支属性添加到连接线上*/
			
			var extendProperty=$(branch).find("ExtendProperty")[0]
			var extendPropertyName=$(extendProperty).attr("name");
			var extendPropertyValue=$(extendProperty).attr("value");
			var dynamicBranch=extendPropertyName+','+extendPropertyValue;
			$(transitionToBranch).attr("dynamicBranch",dynamicBranch);
		}
	}
	
}
PMProject.prototype.preTreatment = function (processObj){
	var nodePoolMap=new Object();
	var poolSet=$(processObj).children("laneSet")[0];//泳池Set:poolSet --可能有多个
	var pools=$(poolSet).children("lane");//泳池本身 --一个泳池set下有一个pool？
	for(var i=0;i<pools.length;i++){
		var poolXml=$(pools)[i];
		var lanes=$(poolXml).find("lane");//泳道
		if(PMDesigner.isFromCreateByTemplate==true){//导入流程时，每个元素赋予新的id，
			var new_pool_id = PMUI.generateUniqueId();
			$(poolXml).attr("id",new_pool_id);
		}
		var pool_id=$(poolXml).attr("id");//泳池id
		if(lanes.length!==0){
			for(var p=0;p<lanes.length;p++){
				//$(lanes)[p].attr("element")
				if(PMDesigner.isFromCreateByTemplate==true){//导入流程时，每个元素赋予新的id，
					var new_lane_id = PMUI.generateUniqueId();
					$($(lanes)[p]).attr("id",new_lane_id);
				}
				var flowNodes=$($(lanes)[p]).find("flowNodeRef");
				for(var j=0;j<flowNodes.length;j++){
					var flowNode=$(flowNodes)[j];
					var id=$(flowNode).text();	
					nodePoolMap[id]=$($(lanes)[p]).attr("id") + "," + "bpmnLane";
				}
			}
		}else{
			var flowNodes=$(poolXml).find("flowNodeRef");
			for(var j=0;j<flowNodes.length;j++){
				var flowNode=$(flowNodes)[j];
				var id=$(flowNode).text();	
				nodePoolMap[id]=pool_id + "," + "bpmnPool";
			}
		}
	}
	return nodePoolMap;
}

PMProject.prototype.fromXmlTodiagram = function (processObj) {
	var that = this;
	var nodePoolMap=this.preTreatment(processObj);
	var diagram ={	
		 	laneset: that.fromXmlToJson(processObj,"laneSet"),
	        lanes: that.fromXmlToJson(processObj,"lanes"),
	        concurrents: that.fromXmlToJson(processObj,"concurrents",nodePoolMap),
	        constartandends: that.fromXmlToJson(processObj,"constartandend",nodePoolMap),
	        activities: that.fromXmlToJson(processObj,"activity",nodePoolMap),
	        events: that.fromXmlToJson(processObj,"events",nodePoolMap),
	        gateways: that.fromXmlToJson(processObj,"gateways",nodePoolMap),
	        artifacts: that.fromXmlToJson(processObj,"artifacts",nodePoolMap),
	        flows: that.fromXmlToJson(processObj,"flows",nodePoolMap),
	       
	       // data: that.fromXmlToJson(processObj,"data",nodePoolMap),
	       // participants: that.fromXmlToJson(processObj,"participants",nodePoolMap)
	};
	return diagram;
}

PMProject.prototype.returnNodeContainer=function (node,nodePoolMap){
	var nodeContainArray=new Array();
	var nodePoolArray=[];
	if(nodePoolMap[$(node).attr("ID")]){//nodePoolMap[节点id]= 泳池/泳道id,bpmnPool/bpmnLane
		nodePoolArray=nodePoolMap[$(node).attr("ID")].split(",");
	}
	if(nodePoolArray.length>0){//container 是泳道,泳池
		nodeContainArray.push(nodePoolArray[0]);
		nodeContainArray.push(nodePoolArray[1]);
		$(node).attr("branchId","");
		return nodeContainArray;
	}else if($(node).parent().parent("Parallel").length>0){//container是并发体
		nodeContainArray.push($($(node).parent().parent("Parallel")[0]).attr("ID"));
		nodeContainArray.push("bpmnParallel");
		var nodeParent=$(node).parent("Branch")[0];
		if(PMDesigner.isFromCreateByTemplate!=true){//是导入流程的时候，branchId需要新值
			$(node).attr("branchId",$(nodeParent).attr("ID"));
		}
		return nodeContainArray;
	}else{//container 是canvas
		nodeContainArray.push("");
		nodeContainArray.push("bpmnDiagram");
		$(node).attr("branchId","");
	}
	return nodeContainArray;
}
PMProject.prototype.checkPositionAndUpdateContainerDimensions = function(item,node,nodePoolMap){
	//多种节点中加了判断它是否为容器中最右，最下的节点，并更新容器的rightest,downest属性
	if(nodePoolMap[$(node).attr("ID")]){//container是泳道
		//先不判断
	}else if($(node).parent().parent("Parallel").length>0){//container是并发体
		//在第一次拖动并发体时判断
	}else{//container 是canvas
		var canvasRightestX,
		canvasDownestY,
		thisNodeRightestX,
		thisNodeDownestY;
		
		canvasRightestX= this.canvas.getRightestPointX();
		canvasDownestY = this.canvas.getDownestPointY();
		thisNodeRightestX = item.bou_x + bou_width;
		thisNodeDownestY = item.bou_y + bou_height;
		
		if(thisNodeRightestX > canvasRightestX){
			this.canvas.setRightestPointX(thisNodeRightestX);
		}
		if(thisNodeDownestY > canvasDownestY){
			this.canvas.setDownestPointY(thisNodeDownestY);
		}
	}
}
PMProject.prototype.fromXmlToJson=function (processObj,type,nodePoolMap){
	var node=new Array();
	var item={};
	if(type=="concurrents"){
		var concurrentNodes=$(processObj).find("Parallel");
		var concurrentsLength=concurrentNodes.length;
		for(var i=0;i<concurrentsLength;i++){
			var concurrentNode=$(concurrentNodes)[i];
			if(PMDesigner.isFromCreateByTemplate==true){//根据模板新建流程时，每个元素赋予新的id，
				var newID = PMUI.generateUniqueId();//mapForNewIDAndOldID是 旧-新id 的映射，为了连接线与节点的关系映射做准备
				PMDesigner.mapForOldIDAndNewID[$(concurrentNode).attr('ID')]=newID;//map.oldID = newID;
				if(nodePoolMap[$(concurrentNode).attr('ID')]){//需要放在id改变之前,如果该元素在泳池或者泳道中
					nodePoolMap[newID] = nodePoolMap[$(concurrentNode).attr('ID')];//对应关系改为对新ID的映射
					nodePoolMap[$(concurrentNode).attr('ID')] = undefined;//删除旧id的映射
				}
				$(concurrentNode).attr('ID',newID);
				//branchId处理
				if($(concurrentNode).attr("branchId")!=""||$(concurrentNode).parent().is('Branch')){//有分支ID(导入)或者parent是Branch节点(根据模板新建)
					var newBranchId;//branchId是否在map中已经存在，为保持branchId一致,如下↓。
					var oldBranchId;
					if($(concurrentNode).attr("branchId")==""||$(concurrentNode).attr("branchId")==undefined){
						oldBranchId = $(concurrentNode).parent().attr('ID');
					}else{
						oldBranchId = $(concurrentNode).attr("branchId");
					}
					if(PMDesigner.mapForOldIDAndNewID[$(concurrentNode).attr("branchId")]){
						newBranchId = PMDesigner.mapForOldIDAndNewID[$(concurrentNode).attr("branchId")];
					}else{
						newBranchId = PMUI.generateUniqueId();
						PMDesigner.mapForOldIDAndNewID[oldBranchId]=newBranchId;
					}
					$(concurrentNode).attr("branchId",newBranchId)
				}
			}
			var bou_element,
				bou_container,
				nodePoolArray=new Array();
			nodePoolArray=this.returnNodeContainer(concurrentNode,nodePoolMap);
			var concurrentXmlStr=PMDesigner.xmlToStr(concurrentNode);
			var concurrentXml=PMDesigner.strToXml(concurrentXmlStr).getElementsByTagName("Parallel")[0];
			$(concurrentXml).find("ParallelStartNode").remove();
			$(concurrentXml).find("ParallelEndNode").remove();
			$(concurrentXml).find("Branch").remove();
			/*判断并发体是横向还是纵向*/
		
			var orientation="horizontal";
			var ParallelStartNodeY=$($(concurrentNode).find("ParallelStartNode")[0]).attr("y");	
			if(ParallelStartNodeY>=-10 && ParallelStartNodeY<=10)
				orientation="vertical";
			item={
					parUid:$(concurrentNode).attr("ID"),
					lns_name:$(concurrentNode).attr("name"),
					proType:"Concurrent",
					branch_id:$(concurrentNode).attr("branchId"),
					orientation: orientation,
					bou_x:$(concurrentNode).attr("x"),
					bou_y:$(concurrentNode).attr("y"),
					bou_width:$(concurrentNode).attr("width"),
					bou_height:$(concurrentNode).attr("height"),
					bou_container:nodePoolArray[1],
					bou_element:nodePoolArray[0],
					pol_xml:concurrentXml
				};
			//canvas.loadShape(item.evn_type, item, true);
			node[i]=item;
		}
		return node;
	}
	/**
	 * 转换并发体内的并发开始节点和并发结束节点
	 * */
	if(type=="constartandend"){
		var conStartNodes=$(processObj).find("ParallelStartNode");
		var conStartNodesLength=conStartNodes.length;
		
		var coneEndNodes=$(processObj).find("ParallelEndNode");
		var coneEndNodesLength=coneEndNodes.length;
		for(var i=0;i<conStartNodesLength;i++){
			var conStartNode=$(conStartNodes)[i];
			if(PMDesigner.isFromCreateByTemplate==true){//导入流程时，每个元素赋予新的id，
				var newID = PMUI.generateUniqueId();//mapForNewIDAndOldID是 旧-新id 的映射，为了连接线与节点的关系映射做准备
				PMDesigner.mapForOldIDAndNewID[$(conStartNode).attr('ID')]=newID;//map.oldID = newID;
				if(nodePoolMap[$(conStartNode).attr('ID')]){//需要放在id改变之前,如果该元素在泳池或者泳道中
					nodePoolMap[newID] = nodePoolMap[$(conStartNode).attr('ID')];//对应关系改为对新ID的映射
					nodePoolMap[$(conStartNode).attr('ID')] = undefined;//删除旧id的映射
				}
				$(conStartNode).attr('ID',newID);
			}
			
			item={
				gat_uid : $(conStartNode).attr("ID"),
				gat_name : $(conStartNode).attr("name"),
				gat_type : "PARALLEL",
				bou_x : $(conStartNode).attr("x"),
				bou_y : $(conStartNode).attr("y"),
				bou_width:$(conStartNode).attr("width"),
				bou_height:$(conStartNode).attr("height"),
				bou_element:$($(conStartNode).parent("Parallel")[0]).attr("ID"),
				bou_container:"bpmnParallel",
				branch_id:"",
				gat_xml:conStartNode
			};
			//canvas.loadShape(item.gat_type, item, true);
			node[i]=item;
		}
		for(var j=conStartNodesLength;j<conStartNodesLength+coneEndNodesLength;j++){
			var conEndNode=$(coneEndNodes)[j-conStartNodesLength];
			if(PMDesigner.isFromCreateByTemplate==true){//导入流程时，每个元素赋予新的id，
				var newID = PMUI.generateUniqueId();//mapForNewIDAndOldID是 旧-新id 的映射，为了连接线与节点的关系映射做准备
				PMDesigner.mapForOldIDAndNewID[$(conEndNode).attr('ID')]=newID;//map.oldID = newID;
				if(nodePoolMap[$(conEndNode).attr('ID')]){//需要放在id改变之前,如果该元素在泳池或者泳道中
					nodePoolMap[newID] = nodePoolMap[$(conEndNode).attr('ID')];//对应关系改为对新ID的映射
					nodePoolMap[$(conEndNode).attr('ID')] = undefined;//删除旧id的映射
				}
				$(conEndNode).attr('ID',newID);
			}
			item={
				gat_uid : $(conEndNode).attr("ID"),
				gat_name : $(conEndNode).attr("name"),
				gat_type : "INCLUSIVE",
				bou_x : $(conEndNode).attr("x"),
				bou_y : $(conEndNode).attr("y"),
				bou_width:$(conEndNode).attr("width"),
				bou_height:$(conEndNode).attr("height"),
				bou_element:$($(conEndNode).parent("Parallel")[0]).attr("ID"),
				bou_container:"bpmnParallel",
				branch_id:"",
				gat_xml:conEndNode
			};
			//canvas.loadShape(item.gat_type, item, true);
			node[j]=item;
		}
		return node;
	}
	if(type=="events"){
		var start=$(processObj).find("StartNode");
		var end=$(processObj).find("EndNode");
		var startLength=start.length;
		var endLength=end.length;
		for(var i=0;i<startLength;i++){
			var startNode=$(start)[i];
			if(PMDesigner.isFromCreateByTemplate==true){//导入流程时，每个元素赋予新的id，
				var newID = PMUI.generateUniqueId();//mapForNewIDAndOldID是 旧-新id 的映射，为了连接线与节点的关系映射做准备
				PMDesigner.mapForOldIDAndNewID[$(startNode).attr('ID')]=newID;//map.oldID = newID;
				if(nodePoolMap[$(startNode).attr('ID')]){//需要放在id改变之前,如果该元素在泳池或者泳道中
					nodePoolMap[newID] = nodePoolMap[$(startNode).attr('ID')];//对应关系改为对新ID的映射
					nodePoolMap[$(startNode).attr('ID')] = undefined;//删除旧id的映射
				}
				$(startNode).attr('ID',newID);
			}
			var bou_element,
				bou_container,
				nodePoolArray=new Array();
			nodePoolArray=this.returnNodeContainer(startNode,nodePoolMap);
			
			item={
					evn_uid:$(startNode).attr("ID"),
					evn_name:$(startNode).attr("name"),
					evn_type:"START",
					bou_x:$(startNode).attr("x"),
					bou_y:$(startNode).attr("y"),
					bou_width:$(startNode).attr("width"),
					bou_height:$(startNode).attr("height"),
					bou_container:nodePoolArray[1],
					bou_element:nodePoolArray[0],
					evn_xml:startNode
				};
			//canvas.loadShape(item.evn_type, item, true);
			node[i]=item;
		}
		for(var i=startLength;i<startLength+endLength;i++){
			var endNode=$(end)[i-startLength];
			if(PMDesigner.isFromCreateByTemplate==true){//导入流程时，每个元素赋予新的id，
				var newID = PMUI.generateUniqueId();//mapForNewIDAndOldID是 旧-新id 的映射，为了连接线与节点的关系映射做准备
				PMDesigner.mapForOldIDAndNewID[$(endNode).attr('ID')]=newID;//map.oldID = newID;
				if(nodePoolMap[$(endNode).attr('ID')]){//需要放在id改变之前,如果该元素在泳池或者泳道中
					nodePoolMap[newID] = nodePoolMap[$(endNode).attr('ID')];//对应关系改为对新ID的映射
					nodePoolMap[$(endNode).attr('ID')] = undefined;//删除旧id的映射
				}
				$(endNode).attr('ID',newID);
			}
			var bou_element,
				bou_container,
				nodePoolArray=new Array();
			nodePoolArray=this.returnNodeContainer(endNode,nodePoolMap);
			item={
					evn_uid:$(endNode).attr("ID"),
					evn_name:$(endNode).attr("name"),
					evn_type:"END",
					bou_x:$(endNode).attr("x"),
					bou_y:$(endNode).attr("y"),
					bou_width:$(endNode).attr("width"),
					bou_height:$(endNode).attr("height"),
					bou_container:nodePoolArray[1],
					bou_element:nodePoolArray[0],
					evn_xml:endNode
				};
			//canvas.loadShape(item.evn_type, item, true);
			node[i]=item;
		}
	};
	
	if(type=="activity"){
		var manualNodes=$(processObj).find("ManualNode");
		var autoNodes=$(processObj).find("AutoNode");
		var subprocNodes=$(processObj).find("SubprocNode");
		
		var manualLength=manualNodes.length;
		var autoLength=autoNodes.length;
		var subLength=subprocNodes.length;
		for(var i=0;i<manualLength;i++){
			var bou_element,bou_container,nodePoolArray=new Array(),manualNode=$(manualNodes)[i];
			if(PMDesigner.isFromCreateByTemplate==true){//导入流程时，每个元素赋予新的id，
				var newID = PMUI.generateUniqueId();//mapForNewIDAndOldID是 旧-新id 的映射，为了连接线与节点的关系映射做准备
				PMDesigner.mapForOldIDAndNewID[$(manualNode).attr('ID')]=newID;//map.oldID = newID;
				if(nodePoolMap[$(manualNode).attr('ID')]){//如果该元素在泳池或者泳道中,需要放在id改变之前
					nodePoolMap[newID] = nodePoolMap[$(manualNode).attr('ID')];//对应关系改为对新ID的映射
					nodePoolMap[$(manualNode).attr('ID')] = undefined;//删除旧id的映射
				}
				$(manualNode).attr('ID',newID);
				
				//branchId处理
				if($(manualNode).attr("branchId")!=""||$(manualNode).parent().is('Branch')){
					var newBranchId;//branchId是否在map中已经存在，为保持branchId一致,如下↓。
					var oldBranchId;
					if($(manualNode).attr("branchId")==""||$(manualNode).attr("branchId")==undefined){
						oldBranchId = $(manualNode).parent().attr('ID');
					}else{
						oldBranchId = $(manualNode).attr("branchId");
					}
					if(PMDesigner.mapForOldIDAndNewID[$(manualNode).attr("branchId")]){
						newBranchId = PMDesigner.mapForOldIDAndNewID[$(manualNode).attr("branchId")];
					}else{
						newBranchId = PMUI.generateUniqueId();
						PMDesigner.mapForOldIDAndNewID[oldBranchId]=newBranchId;
					}
					$(manualNode).attr("branchId",newBranchId)
				}
			}
			nodePoolArray=this.returnNodeContainer(manualNode,nodePoolMap);
			var bid=$(manualNode).attr("branchId");
			item={
					act_uid:$(manualNode).attr("ID"),
					act_name:$(manualNode).attr("name"),
					act_type:"TASK",
					act_icon:$(manualNode).attr("icon"),
					bou_x:$(manualNode).attr("x"),
					bou_y:$(manualNode).attr("y"),
//					bou_width:$(manualNode).attr("width"),
//					bou_height:$(manualNode).attr("height"),
					bou_container:nodePoolArray[1],
					bou_element:nodePoolArray[0],
					branch_id:$(manualNode).attr("branchId"),
					act_xml:manualNode
				};
			//canvas.loadShape(item.act_type, item, true);
			node[i]=item;
		}
		var alength=manualLength+autoLength;
		for(var i=manualLength;i<alength;i++){
			var autoNode=$(autoNodes)[i-manualLength];
			if(PMDesigner.isFromCreateByTemplate==true){//导入流程时，每个元素赋予新的id，
				var newID = PMUI.generateUniqueId();//mapForNewIDAndOldID是 旧-新id 的映射，为了连接线与节点的关系映射做准备
				PMDesigner.mapForOldIDAndNewID[$(autoNode).attr('ID')]=newID;//map.oldID = newID;
				if(nodePoolMap[$(autoNode).attr('ID')]){//需要放在id改变之前,如果该元素在泳池或者泳道中
					nodePoolMap[newID] = nodePoolMap[$(autoNode).attr('ID')];//对应关系改为对新ID的映射
					nodePoolMap[$(autoNode).attr('ID')] = undefined;//删除旧id的映射
				}
				$(autoNode).attr('ID',newID);
				//branchId处理
				if($(autoNode).attr("branchId")!=""||$(autoNode).parent().is('Branch')){
					var newBranchId;//branchId是否在map中已经存在，为保持branchId一致,如下↓。
					var oldBranchId;
					if($(autoNode).attr("branchId")==""||$(autoNode).attr("branchId")==undefined){
						oldBranchId = $(autoNode).parent().attr('ID');
					}else{
						oldBranchId = $(autoNode).attr("branchId");
					}
					if(PMDesigner.mapForOldIDAndNewID[$(autoNode).attr("branchId")]){
						newBranchId = PMDesigner.mapForOldIDAndNewID[$(autoNode).attr("branchId")];
					}else{
						newBranchId = PMUI.generateUniqueId();
						PMDesigner.mapForOldIDAndNewID[oldBranchId]=newBranchId;
					}
					$(autoNode).attr("branchId",newBranchId);
				}
			}
			var bou_element,
				bou_container,
				nodePoolArray=new Array();
			nodePoolArray=this.returnNodeContainer(autoNode,nodePoolMap);
			
			item={
					act_uid:$(autoNode).attr("ID"),
					act_name:$(autoNode).attr("name"),
					act_type:"AUTO_TASK",
					act_icon:$(autoNode).attr("icon"),
					branch_id:$(autoNode).attr("branchId"),
					bou_x:$(autoNode).attr("x"),
					bou_y:$(autoNode).attr("y"),
//					bou_width:$(autoNode).attr("width"),
//					bou_height:$(autoNode).attr("height"),
			        bou_container:nodePoolArray[1],
					bou_element:nodePoolArray[0],
					act_xml:autoNode
				};
			//canvas.loadShape(item.act_type, item, true);
			node[i]=item;
		}
		var slength=manualLength+autoLength+subLength;
		for(var i=alength;i<slength;i++){
			var subprocNode=$(subprocNodes)[i-alength];
			if(PMDesigner.isFromCreateByTemplate==true){//导入流程时，每个元素赋予新的id，
				var newID = PMUI.generateUniqueId();//mapForNewIDAndOldID是 旧-新id 的映射，为了连接线与节点的关系映射做准备
				PMDesigner.mapForOldIDAndNewID[$(subprocNode).attr('ID')]=newID;//map.oldID = newID;
				if(nodePoolMap[$(subprocNode).attr('ID')]){//需要放在id改变之前,如果该元素在泳池或者泳道中
					nodePoolMap[newID] = nodePoolMap[$(subprocNode).attr('ID')];//对应关系改为对新ID的映射
					nodePoolMap[$(subprocNode).attr('ID')] = undefined;//删除旧id的映射
				}
				$(subprocNode).attr('ID',newID);
				//branchId处理
				if($(subprocNode).attr("branchId")!=""||$(subprocNode).parent().is('Branch')){
					var newBranchId;//branchId是否在map中已经存在，为保持branchId一致,如下↓。
					var oldBranchId;
					if($(subprocNode).attr("branchId")==""||$(subprocNode).attr("branchId")==undefined){
						oldBranchId = $(subprocNode).parent().attr('ID');
					}else{
						oldBranchId = $(subprocNode).attr("branchId");
					}
					if(PMDesigner.mapForOldIDAndNewID[$(subprocNode).attr("branchId")]){
						newBranchId = PMDesigner.mapForOldIDAndNewID[$(subprocNode).attr("branchId")];
					}else{
						newBranchId = PMUI.generateUniqueId();
						PMDesigner.mapForOldIDAndNewID[oldBranchId]=newBranchId;
					}
					$(subprocNode).attr("branchId",newBranchId);
				}
			}
			var bou_element,
				bou_container,
				nodePoolArray=new Array();
			nodePoolArray=this.returnNodeContainer(subprocNode,nodePoolMap);
			
			item={
					act_uid:$(subprocNode).attr("ID"),
					act_name:$(subprocNode).attr("name"),
					act_type:"SUB_PROCESS",
					act_icon:$(subprocNode).attr("icon"),
					branch_id:$(subprocNode).attr("branchId"),
					bou_x:$(subprocNode).attr("x"),
					bou_y:$(subprocNode).attr("y"),
//					bou_width:$(subprocNode).attr("width"),
//					bou_height:$(subprocNode).attr("height"),
			        bou_container:nodePoolArray[1],
					bou_element:nodePoolArray[0],
					act_xml:subprocNode
				};
			//canvas.loadShape(item.act_type, item, true);
			node[i]=item;
		}
		return node;
	}
	if(type=="flows"){
		var transitions=$(processObj).find("Transition");
		var associations=$(processObj).find("Association");
		var transitionLength=transitions.length;
		var associationsLength=associations.length;
		for(var i=0;i<transitionLength;i++){
			var transition=$(transitions)[i];
			if(PMDesigner.isFromCreateByTemplate==true){//导入流程时，每个元素赋予新的id，
				var newID = PMUI.generateUniqueId();//mapForNewIDAndOldID是 旧-新id 的映射，为了连接线与节点的关系映射做准备
//				PMDesigner.mapForOldIDAndNewID.$(transition).attr('ID')=newID;//map.oldID = newID;
				$(transition).attr('id',newID);
				
				//source  target
				var oldSourceID = $(transition).attr('source');
				var newSourceID = PMDesigner.mapForOldIDAndNewID[oldSourceID];
				$(transition).attr('source',newSourceID);
				
				var oldTargetID = $(transition).attr('target');
				var newTargetID = PMDesigner.mapForOldIDAndNewID[oldTargetID];
				$(transition).attr('target',newTargetID);
				
			}
			var bendpointsArray= $(transition).attr("bendpoints").split(";");
			/*获得分支属性*/
			var dynamicBranch= $(transition).attr("dynamicBranch");
			var startPositionArray=bendpointsArray[0].split(",");
			var endPositionArray=bendpointsArray[bendpointsArray.length-1].split(",");
			item={	
					flo_uid:$(transition).attr("id"),
					flo_type:$(transition).attr("transType")==9? "ASSOCIATION":"SEQUENCE",
					flo_name:$(transition).attr("name"),
					flo_element_origin:$(transition).attr("source"),
					flo_element_dest:$(transition).attr("target"),
					flo_state:this.getflowState(bendpointsArray),
					flo_x1:startPositionArray[0],
					flo_y1:startPositionArray[1],
					flo_x2:endPositionArray[0],
					flo_y2:endPositionArray[1],
					flo_xml:transition,
					dynamic_branch:dynamicBranch
				};
			//canvas.loadFlow(item, true);
			node[i]=item;
		}
		return node;
	}
	if(type=="gateways"){
		var choiceNodes=$(processObj).find("ChoiceNode");
		var choiceNodesLength=choiceNodes.length;
		
		for(var i=0;i<choiceNodesLength;i++){
			var choiceNode=$(choiceNodes)[i];
			if(PMDesigner.isFromCreateByTemplate==true){//导入流程时，每个元素赋予新的id，
				var newID = PMUI.generateUniqueId();//mapForNewIDAndOldID是 旧-新id 的映射，为了连接线与节点的关系映射做准备
				PMDesigner.mapForOldIDAndNewID[$(choiceNode).attr('ID')]=newID;//map.oldID = newID;
				if(nodePoolMap[$(choiceNode).attr('ID')]){//需要放在id改变之前,如果该元素在泳池或者泳道中
					nodePoolMap[newID] = nodePoolMap[$(choiceNode).attr('ID')];//对应关系改为对新ID的映射
					nodePoolMap[$(choiceNode).attr('ID')] = undefined;//删除旧id的映射
				}
				$(choiceNode).attr('ID',newID);
				//branchId处理
				if($(choiceNode).attr("branchId")!=""||$(choiceNode).parent().is('Branch')){
					var newBranchId;//branchId是否在map中已经存在，为保持branchId一致,如下↓。
					var oldBranchId;
					if($(choiceNode).attr("branchId")==""||$(choiceNode).attr("branchId")==undefined){
						oldBranchId = $(choiceNode).parent().attr('ID');
					}else{
						oldBranchId = $(choiceNode).attr("branchId");
					}
					if(PMDesigner.mapForOldIDAndNewID[$(choiceNode).attr("branchId")]){
						newBranchId = PMDesigner.mapForOldIDAndNewID[$(choiceNode).attr("branchId")];
					}else{
						newBranchId = PMUI.generateUniqueId();
						PMDesigner.mapForOldIDAndNewID[oldBranchId]=newBranchId;
					}
					$(choiceNode).attr("branchId",newBranchId);
				}
			}
			var bou_element,
				bou_container,
				nodePoolArray=new Array();
			nodePoolArray=this.returnNodeContainer(choiceNode,nodePoolMap);

			item={
				gat_uid : $(choiceNode).attr("ID"),
				gat_name : $(choiceNode).attr("name"),
				gat_type : "EXCLUSIVE",
				branch_id:$(choiceNode).attr("branchId"),
				bou_x : $(choiceNode).attr("x"),
				bou_y : $(choiceNode).attr("y"),
				bou_width:$(choiceNode).attr("width"),
				bou_height:$(choiceNode).attr("height"),
				bou_element:nodePoolArray[0],
				bou_container:nodePoolArray[1],
				gat_xml:choiceNode
			};
			//canvas.loadShape(item.gat_type, item, true);
			node[i]=item;
		}
		return node;
	}
	if(type=="artifacts"){
		var textAnnotations=$(processObj).find("TextAnnotation");
		var textAnnoLength=textAnnotations.length;
		for(var i=0;i<textAnnoLength;i++){
			var textAnnotation=$(textAnnotations)[i];
			if(PMDesigner.isFromCreateByTemplate==true){//导入流程时，每个元素赋予新的id，
				var newID = PMUI.generateUniqueId();//mapForNewIDAndOldID是 旧-新id 的映射，为了连接线与节点的关系映射做准备
				PMDesigner.mapForOldIDAndNewID[$(textAnnotation).attr('id')]=newID;//map.oldID = newID;
				if(nodePoolMap[$(textAnnotation).attr('ID')]){//需要放在id改变之前,如果该元素在泳池或者泳道中
					nodePoolMap[newID] = nodePoolMap[$(textAnnotation).attr('ID')];//对应关系改为对新ID的映射
					nodePoolMap[$(textAnnotation).attr('ID')] = undefined;//删除旧id的映射
				}
				$(textAnnotation).attr('id',newID);
			}
			var bou_element,
				bou_container,
				nodePoolArray=new Array();
			nodePoolArray=this.returnNodeContainer(textAnnotation,nodePoolMap);
			item={
				art_uid : $(textAnnotation).attr("id"),
				art_name : $(textAnnotation).attr("text"),
				art_type : "TEXT_ANNOTATION",
				bou_x : $(textAnnotation).attr("x"),
				bou_y : $(textAnnotation).attr("y"),
				bou_width:$(textAnnotation).attr("width"),
				bou_height:$(textAnnotation).attr("height"),
				bou_element:nodePoolArray[0],
				bou_container:nodePoolArray[1],
				art_xml:textAnnotation
			};
			//canvas.loadShape(item.art_type, item, true);
			node[i]=item;
		}
		return node;
	}
	if(type=="laneSet"){	
		var laneSet=$(processObj).children("laneSet")[0];
		var poolsNode=$(laneSet).children("lane");
		var poolsNodelength=poolsNode.length;
		for(var i=0;i<poolsNodelength;i++){
			var poolNode=$(poolsNode)[i];
			if(PMDesigner.isFromCreateByTemplate==true){//导入流程时，每个元素赋予新的id，
				$(poolNode).attr('id',PMUI.generateUniqueId());
				//nodePoolMap[泳池/泳道id]=节点id
			}
				
			item={
				lns_uid : $(poolNode).attr("id"),
				lns_name : $(poolNode).attr("name"),
				orientation : "HORIZONTAL",
				bou_x : $(poolNode).attr("x"),
				bou_y : $(poolNode).attr("y"),
				bou_width:$(poolNode).attr("width"),
				bou_height:$(poolNode).attr("height"),
				bou_container:"bpmnDiagram",
				bou_element:"",
			};
			//canvas.loadShape("POOL", item, true);
			node[i]=item;
		}
		return node;
	}
	if(type=="lanes"){
		var poolSet=$(processObj).children("laneSet")[0];
		var pools=$(poolSet).children("lane");
		var count=0;
		for(var i=0;i<pools.length;i++){
			var poolXml=$(pools)[i];
			var lanes=$(poolXml).find("lane");
			var pool_id=$(poolXml).attr("id");
			
			for(var l=0; l<lanes.length; l++){
				var laneNode=$(lanes)[l];
				if(PMDesigner.isFromCreateByTemplate==true)//导入流程时，每个元素赋予新的id，
					$(laneNode).attr('id',PMUI.generateUniqueId());
				item={
					lan_uid : $(laneNode).attr("id"),
					lan_name : $(laneNode).attr("name"),
					bou_rel_position: l+1,
					bou_x : $(laneNode).attr("x"),
					bou_y : $(laneNode).attr("y"),
					bou_width:$(laneNode).attr("width"),
					bou_height:$(laneNode).attr("height"),
					bou_element:pool_id,
					bou_container:"bpmnPool",
				};
			//canvas.loadShape("LANE", item, true);
			node[count++]=item;
			}	
		}
	}
	return node;
}
PMProject.prototype.getflowState = function(bendpointsArray){
	var flowStates=new Array();
	var state;
	for(var i=0;i<bendpointsArray.length;i++){
		var bendpoint=bendpointsArray[i].split(",");
		state={
			"x":bendpoint[0],
			"y":bendpoint[1]
		}
		flowStates[i]=state;
	}
	return flowStates;
}
PMProject.prototype.getProcessXmlDom = function(process){
	var processXmlDom=PMDesigner.strToXml(process);
	var processObj=$(processXmlDom).find("Process")[0];
	if($(processXmlDom).find("datas").length==0){
		var datas="<datas/>";
		$(processObj).append(PMDesigner.strToXml(datas).getElementsByTagName("datas")[0]);
	}
	$(processXmlDom).find("StartNode").remove();
	$(processXmlDom).find("EndNode").remove();
	$(processXmlDom).find("ManualNode").remove();
	$(processXmlDom).find("AutoNode").remove();
	$(processXmlDom).find("SubprocNode").remove();
	$(processXmlDom).find("laneSet").empty();
	$(processXmlDom).find("Transition").remove();
	$(processXmlDom).find("TextAnnotation").remove();
	$(processXmlDom).find("Association").remove();
	$(processXmlDom).find("Parallel").remove();
	$(processXmlDom).find("ChoiceNode").remove();
	
	return processXmlDom;
}

PMProject.prototype.importDiagram = function(data) {
    //jQuery.get('/resources/miwg-test-suite/C.2.0.bpmn', function(data) {
    var that = this;
    this.isSave = true;
    PMDesigner.moddle.fromXML(data, function(err, definitions) {
            if (err) {
                PMDesigner.msgFlash('Import Error: ' + err.message, document.body, 'error',5000, 5);
            } else {
                var imp = new importBpmnDiagram(definitions);
                if(PMDesigner.project.XMLSupported){
                    PMDesigner.businessObject = definitions;
                    imp.completeImportFlows();
                    PMUI.getActiveCanvas().buildingDiagram = false;
                    
                    
                    PMDesigner.project.setDirty(true);
                    PMDesigner.project.save(false);
                    PMUI.getActiveCanvas().hideAllFocusLabels();
                    PMDesigner.project.setXMLSupported(true);
                }else{
                    PMDesigner.msgFlash('The process definition that you are trying to import contains BPMN elements that are not supported in ProcessMaker. Please try with other process.', document.body, 'error',5000, 5);
                }
            }
        });
    //});
}

/**
 * Represents a flag if the project was saved or not
 */
PMProject.prototype.isDirty = function () {
    return this.dirty;
};

/**
 *  Saves old bpmn project
 * @param options
 * @returns {PMProject}
 */
PMProject.prototype.save = function (options) {//流程保存接口
    var keys = this.getKeysClient(),
        that = this;
    var categoryId=category_id;
    //校验前准备
    $('.custom_validator').empty();
    $('.validator_body').css('display', 'block');
    var $_downbutton = $('.validator_header').children().eq(0);
    if(!$_downbutton.hasClass("down-expand")){
    	$_downbutton.addClass("down-expand");
    }
    //获取提交的xml，并进行前台校验
    var dirtyObject = that.getDirtyObjectXml();
    var dirtyObjectXml=PMDesigner.xmlToStr(dirtyObject);
    //异步后台校验
//    PMDesigner.xmlValidateServer(dirtyObjectXml);
    if($('.custom_validator>.custom_validator_row>span.validator-error').size() > 0){//有错误,只计算错误，警告不计算
    	$(dirtyObject).find('Process').attr('isCompleted','0');
    }else{
    	$(dirtyObject).find('Process').attr('isCompleted','1');
    }
    dirtyObjectXml=PMDesigner.xmlToStr(dirtyObject);
    //Flex 版本中pluginClass 是在/UW_WebConsole/WebRoot/workflow/processCommon/swf/bsdesign-view.xml 中配置的。
    var pluginClass = 'com.neusoft.uniflow.web.processcommon.flash.data.DefaultDefinitionFilePlugin';
    if (this.isDirty()) {
    	var handleSucces = function(data, textStatus, xhr){
    		that.listeners.success(that, textStatus, data);
            that.isSave = false;
            if(options=="closeWindow"){
        		PMDesigner.closeWebPage();
        	}
    	};
    	var handleError = function(data, textStatus, xhr){
//    		data.error="";
    		that.listeners.failure(that, textStatus, data);
            that.isSave = false;
            if(options=="closeWindow"){
        		PMDesigner.closeWebPage();
        	}
    	};
        $.ajax({
            url: contextPath+"/workflow/write.action?categoryID="+categoryId+"&customPropertyPlugin="+pluginClass,
            type:"put",
            data: dirtyObjectXml,
            async:false,
            beforeSend: function (xhr, settings)
            {
                xhr.setRequestHeader("Authorization", "Bearer " + keys.access_token);
                xhr.setRequestHeader("Accept-Language", LANG);
            },
            success: function (data, textStatus, xhr)
            {
            	try{
            		var errorData = $.parseJSON(data);
            		if(errorData.header&&errorData.header.code=='-1'){
            			handleError(data, textStatus, xhr);
                	}else{
                		handleSucces(data, textStatus, xhr);
                	}
            	}catch(err){
            		try{
            			var rightData = $(data).attr('procresult');
            			if(rightData=='true'){
            				handleSucces(data, textStatus, xhr);
            			}
            		}catch(err){
            			handleError(data, textStatus, xhr);
            		}
            		
            	}
            },
            error: function (xhr, textStatus, errorThrown)
            {
            	PMDesigner.msgFlash("流程保存错误",document.body, 'error',5000, 5);
            }
        });
    }
    return this;
};
PMProject.prototype.getDirtyObjectXml = function () {/*获取保存时向后台发送的数据*/
    var that = this,
        diaArray,
        processXmlDom,
        i,
        diagram,
        lastDiagram,
        parallelXmlDom;
    var object, i, elements, shapes;
    processXmlDom=PMDesigner.strToXml(that.processXml);
    var processDom=processXmlDom.getElementsByTagName("Process")[0];
    var transitionsXmlDom=processXmlDom.getElementsByTagName("transitions")[0];
    var associationsXmlDom=processXmlDom.getElementsByTagName("associations")[0];
    var textAnnotationXmlDom=processXmlDom.getElementsByTagName("textAnnotations")[0];
    var poolSetXmlDom=processXmlDom.getElementsByTagName("laneSet")[0];
    lastDiagram = this.diagrams.getSize()-1;
    diagram = this.diagrams.get(lastDiagram);
    elements = diagram.items.asArray();
    var parllelStartEndNode=new Array();
    var pool_element = new Object();
    //初始化校验器参数
	var mapForConnectionAndNodes = PMDesigner.getMapForConnectionAndNodes();
	PMDesigner.startNodeCount = 0;
	PMDesigner.endNodeCount = 0;
	//end of 初始化校验器参数
    for (var j = 0; j < elements.length; j+=1) {
    	if (typeof elements[j].relatedObject.getDataObject() === "undefined"){
            object = elements[j].relatedObject;
        } else {
            object = elements[j].relatedObject.getDataObject();
        }
    	if((object.bou_container=="bpmnPool" || object.bou_container=="bpmnLane")&& object.type!="PMLane"){
    		
    		var elementId=object.bou_element;
    		if(!pool_element[elementId] || pool_element[elementId]==""){
    			pool_element[elementId]=object.id;
    		}else{
    			var id=pool_element[elementId]+","+object.id;
    			pool_element[elementId]=id;
    		}
    	}
    	if(object.type == "PARALLEL"||object.type == "INCLUSIVE"){
    		parllelStartEndNode.push(elements[j]);
    	}
    	//校验单个元素
    	var objInAndOutConnections = mapForConnectionAndNodes[elements[j].id];
		 PMDesigner.validateOneObject(elements[j].relatedObject,objInAndOutConnections);
    }
    //需要统计的校验元素完成最后的校验
	PMDesigner.validateCountAbleElements();
	//end of 需要统计的校验元素完成最后的校验
    if (diagram.items.getSize() > 0) {
        for (i = 0; i < elements.length; i+=1) {
            if (typeof elements[i].relatedObject.getDataObject() === "undefined"){
                object = elements[i].relatedObject;
            } else {
                object = elements[i].relatedObject.getDataObject();
            }
            switch(elements[i].type) {
                case "PMActivity":
                	$(object.xml).attr("x",object.bou_x);
                	$(object.xml).attr("y",object.bou_y);
                	$(object.xml).attr("width",object.bou_width);
                	$(object.xml).attr("height",object.bou_height);
                	if(object.bou_container=="bpmnParallel"){
                		this.addElementToParallel(processDom, object)
                	}else{
                		processDom.appendChild(object.xml);
                	}
                    break;
                case "PMGateway":
                	$(object.xml).attr("x",object.bou_x);
                	$(object.xml).attr("y",object.bou_y);
                	$(object.xml).attr("width",object.bou_width);
                	$(object.xml).attr("height",object.bou_height);
                	if(object.bou_container=="bpmnParallel"){
                		this.addElementToParallel(processDom, object)
                	}else{
                		processDom.appendChild(object.xml);
                	}
                	
                    break;
                case "PMEvent":      	
                	$(object.evn_xml).attr("x",object.bou_x);
                	$(object.evn_xml).attr("y",object.bou_y);
                	$(object.evn_xml).attr("width",object.bou_width);
                	$(object.evn_xml).attr("height",object.bou_height);
                	processDom.appendChild(object.evn_xml);
                    break;
                case "PMFlow":
                case "Connection":
                	$(object.flo_xml).attr("source",object.flo_element_origin);
                    $(object.flo_xml).attr("target",object.flo_element_dest);
                    $(object.flo_xml).attr("bendpoints",object.bendpoints);
                    $(object.flo_xml).attr("id",object.flo_uid);
                    if(object.flo_type=="ASSOCIATION"){
                    	$(object.flo_xml).attr("transType",9);
                    }
                    transitionsXmlDom.appendChild(object.flo_xml);
                    break;
                case "PMArtifact":          
                  	$(object.art_xml).attr("x",object.bou_x);
              		$(object.art_xml).attr("y",object.bou_y);
              		$(object.art_xml).attr("width",object.bou_width);
              		$(object.art_xml).attr("height",object.bou_height);
              		$(object.art_xml).attr("text",object.art_name);
              		textAnnotationXmlDom.appendChild(object.art_xml);
                    break;
                case "PMPool":
                	var elementIdArray=[];
                	var element_id=pool_element[object.lns_uid];
                	if(element_id)
                		elementIdArray=element_id.split(",");
                	for(var k=0;k<elementIdArray.length;k++){
                		$(object.pol_xml).append(PMDesigner.strToXml('<flowNodeRef>'+elementIdArray[k]+'</flowNodeRef>').getElementsByTagName("flowNodeRef")[0]);
                	}
                	$(object.pol_xml).attr("x",object.bou_x);
              		$(object.pol_xml).attr("y",object.bou_y);
              		$(object.pol_xml).attr("width",object.bou_width);
              		$(object.pol_xml).attr("height",object.bou_height);
              		poolSetXmlDom.appendChild(object.pol_xml);
                    break;
                case "PMLane":
                	var elementIdArray=[];
                	var element_id=pool_element[object.lan_uid];
                	if(element_id)
                		elementIdArray=element_id.split(",");
                	for(var k=0;k<elementIdArray.length;k++){
                		$(object.lan_xml).append(PMDesigner.strToXml('<flowNodeRef>'+elementIdArray[k]+'</flowNodeRef>').getElementsByTagName("flowNodeRef")[0]);
                	}
                	$(object.lan_xml).attr("x",object.bou_x);
              		$(object.lan_xml).attr("y",object.bou_y);
              		$(object.lan_xml).attr("width",object.bou_width);
              		$(object.lan_xml).attr("height",object.bou_height);
                	
                	var laneXML=processXmlDom.getElementById(object.lns_uid);
                	var laneSetXml=$(laneXML).children("laneSet");
                	if(laneSetXml.length==0){
                		$(laneXML).append(PMDesigner.strToXml('<laneSet></laneSet>').getElementsByTagName("laneSet")[0]);
                		laneSetXml=$(laneXML).children("laneSet")[0];
                	}
                	$(laneSetXml).append(object.lan_xml);
                    break;
                case "PMParallel":
                	$(object.par_xml).attr("x",object.bou_x);
                	$(object.par_xml).attr("y",object.bou_y);
                	$(object.par_xml).attr("width",object.bou_width);
                	$(object.par_xml).attr("height",object.bou_height);
                	if(object.bou_container=="bpmnParallel"){
                		this.addElementToParallel(processDom, object)
                	}else{
                		processDom.appendChild(object.par_xml);
                	}
                	break;
            }
        }
    }
    this.updateParallelTranstion(parllelStartEndNode,processDom);
    //return PMDesigner.xmlToStr(processXmlDom);
    return processXmlDom;
};
PMProject.prototype.updateParallelTranstion = function (parllelStartEndNodes,processDom) {
	var transtions=$(processDom).find("transitions")[0];
	/*记录分支是否连到并发结束节点*/
	var branchTrans= new Object();
	for(var i=0;i<parllelStartEndNodes.length;i++){
		var parllelStartEndNode=parllelStartEndNodes[i].relatedObject;
		var connections = parllelStartEndNode.canvas.getConnections();

		var count=connections.getSize();
		/*如果为并发体开始节点，则更改并发体开始节点与分支的连线*/
		if(parllelStartEndNode.getGatewayType()==="PARALLEL"){
			 for (var j = 0; j < connections.getSize(); j +=1) {
				 	var connection=connections.get(j);
				 	var connentionId=connection.id;
	                if (connection.getSrcPort().parent.getID() === parllelStartEndNode.getID()) {
	                	var firstNodeId=connection.getDestPort().parent.getID();
	                	var dynamicBranch=connection.getDynamicBranch();
	                	var branchObject=$($(processDom).find("#"+firstNodeId)[0]).parent()[0];
	                	if(!branchObject)
	                		branchObject=$($(processDom).find("[ID='"+firstNodeId+"']")[0]).parent()[0];
	                
//	                	if(dynamicBranch!==""){
	                	if(dynamicBranch && dynamicBranch!==""){
	                		var name=dynamicBranch.split(",")[0];
	                		var dynamicVarity=dynamicBranch.split(",")[1];
	                		$(branchObject).append(PMDesigner.strToXml('<extendProperties><ExtendProperty name="'+ name +'" value="'+ dynamicVarity +'"/></extendProperties>').getElementsByTagName("extendProperties")[0]);
	                	}
	                	var branchId=$(branchObject).attr("ID");
	                	var branchStartNode=$(branchObject).find("BranchStartNode")[0];
	                	var branchStartNodeId=$(branchStartNode).attr("ID");
	                	var transation=$(processDom).find("#"+connentionId)[0];
	                	$(transation).attr("target",branchId);
	                	var newTransation=PMDesigner.strToXml('<Transition id="'+ PMUI.generateUniqueId() +'" name="" x="0" y="0" source="'+ branchStartNodeId +'" target="'+ firstNodeId +'"></Transition>').getElementsByTagName("Transition")[0];
	                	$(transtions).append(newTransation);
	                }
	            }
		}else if(parllelStartEndNode.getGatewayType()==="INCLUSIVE"){
			for(var k=0;k < connections.getSize(); k +=1){
				var connection=connections.get(k);
			 	var connentionId=connection.id;
			 	var transation=$(processDom).find("#"+connentionId)[0];
			 	if(connection.getDestPort().parent.getID()=== parllelStartEndNode.getID()){
			 		var endNodeId=connection.getSrcPort().parent.getID();
                	//var endNode= $(processDom).find("#"+endNodeId)[0];
                	var branchObject=$($(processDom).find("#"+endNodeId)[0]).parent()[0];
                	if(!branchObject)
                		branchObject=$($(processDom).find("[ID='"+endNodeId+"']")[0]).parent()[0];
                	var branchId=$(branchObject).attr("ID");
                	var branchEndNode=$(branchObject).find("BranchEndNode")[0];
                	var branchEndNodeId=$(branchEndNode).attr("ID");
                	//$(transation).attr("source",branchId);
                	$(transation).attr("target",branchEndNodeId);
                	var bid=branchTrans[branchId];
                	if(branchTrans[branchId]===""||branchTrans[branchId]===undefined){
                		var newTransation=PMDesigner.strToXml('<Transition id="'+ PMUI.generateUniqueId() +'" name="" x="0" y="0" source="'+ branchId +'" target="'+ parllelStartEndNode.getID() +'"></Transition>').getElementsByTagName("Transition")[0];
                    	$(transtions).append(newTransation);
                    	branchTrans[branchId]=parllelStartEndNode.getID();
                	}
                	//var newTransation=PMDesigner.strToXml('<Transition id="'+ PMUI.generateUniqueId() +'" name="" x="0" y="0" source="'+ endNodeId +'" target="'+ branchEndNodeId +'"></Transition>').getElementsByTagName("Transition")[0];
                	//$(transtions).append(newTransation);
			 	}
			}
		}
	}
}
PMProject.prototype.addElementToParallel = function (processDom,object) {
	var containId=object.bou_element;
	var parallelXmlDom=$(processDom).find("#"+containId)[0];
	if(!parallelXmlDom)
		parallelXmlDom=$(processDom).find("[ID='"+containId+"']")[0];
	var branchId=object.branch_id;
	if(object.type == "PARALLEL"||object.type == "INCLUSIVE"){
		$(parallelXmlDom).append(object.xml);
		return ;
	}
	/*if(branchId==""){
		alert("节点"+object.id+"没有分支Id");
	}*/
	var branchXmlDom=$(parallelXmlDom).find("#"+branchId)[0];
	if(branchXmlDom){
		$(branchXmlDom).append(object.xml);
	}else{
		var branchLength=$(parallelXmlDom).find("Branch").length;
		var branchStartId=PMUI.generateUniqueId();
		var branchEndId=PMUI.generateUniqueId();
		if(PMDesigner.branchStartAndEnd[branchId]){
			branchStartId = PMDesigner.branchStartAndEnd[branchId].split(",")[0];
			branchEndId = PMDesigner.branchStartAndEnd[branchId].split(",")[1];
		}
		var branchXmlStr='<Branch id="'+ branchId +'" ID="'+ branchId +'" name="分支" x="0" y="0" msgReceiver="appmanager">'
					+' <BranchStartNode ID="'+ branchStartId +'" name="分支开始" x="0" y="0"/>'
					+'<BranchEndNode ID="'+ branchEndId +'" name="分支结束" x="0" y="0"/>'
					+'</Branch>';
		branchXmlDom=PMDesigner.strToXml(branchXmlStr).getElementsByTagName("Branch")[0];
		$(branchXmlDom).append(object.xml);
		$(parallelXmlDom).append(branchXmlDom);	
	}
	return ;
}
PMProject.prototype.saveClose = function (options) {
    var keys = this.getKeysClient(),
        that = this;
    if (this.isDirty()) {
            $.ajax({
                url: "/api/1.0/" + WORKSPACE + "/project/" + that.id,
                type: 'PUT',
                data: JSON.stringify(that.getDirtyObject()),
                contentType: "application/json",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Bearer " + keys.access_token);
                    xhr.setRequestHeader("Accept-Language", LANG);
                },
                success: function (data, textStatus) {
                    var message_window,
                        browser = PMDesigner.getBrowser();
                        url = parent.location.href;
                    that.listeners.success(that, textStatus, data);
                    that.isSave = false;
                    if((navigator.userAgent.indexOf("MSIE")!=-1) || (navigator.userAgent.indexOf("Trident")!=-1)){
                        window.close();
                    } else {
                        parent.location.href = url;
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    that.listeners.failure(that, textStatus, xhr);
                    that.isSave = false;
                }
            });

     }
    return this;
};

PMProject.prototype.getDirtyObject = function () {//获取保存时向后台发送的数据
    var that = this,
        diaArray,
        shape,
        i,
        diagram,
        lastDiagram;

    lastDiagram = this.diagrams.getSize()-1;
    diagram = this.diagrams.get(lastDiagram);
    shape =this.getDataObject(diagram);
    return {
        prj_uid: that.projectId,
        prj_name: that.projectName,
        prj_description: that.description,
       // diagrams: diaArray
        laneset: shape.laneset,
        lanes: shape.lanes,
        activities: shape.activities,
        events: shape.events,
        gateways: shape.gateways,
        flows: shape.flows,
        artifacts: shape.artifacts,
        data: shape.data,
        participants: shape.participants
    };
};

PMProject.prototype.getDataObject = function (canvas) {
    var object, i, elements, shapes;
    //elements = this.canvas.items.asArray();
    elements = canvas.items.asArray();

    shapes = {
        activities: [],
        gateways: [],
        events: [],
        flows: [],
        artifacts: [],
        laneset: [],
        lanes: [],
        data: [],
        participants: [],
        pools: []
    };
    //if (this.canvas.items.getSize() > 0) {
    if (canvas.items.getSize() > 0) {
        for (i = 0; i < elements.length; i+=1) {
            if (typeof elements[i].relatedObject.getDataObject() === "undefined"){
                object = elements[i].relatedObject;
            } else {
                object = elements[i].relatedObject.getDataObject();
            }
            switch(elements[i].type) {
                case "PMActivity":
                    shapes.activities.push(object);
                    break;
                case "PMGateway":
                    shapes.gateways.push(object);
                    break;
                case "PMEvent":
                    shapes.events.push(object);
                    break;
                case "PMFlow":
                case "Connection":
                    shapes.flows.push(object);
                    break;
                case "PMArtifact":
                    shapes.artifacts.push(object);
                    break;
                case "PMData":
                    shapes.data.push(object);
                    break;
                case "PMParticipant":
                    shapes.participants.push(object);
                    break;
                case "PMPool":
                    shapes.laneset.push(object);
                    break;
                case "PMLane":
                    shapes.lanes.push(object);
                    break;
            }
        }
    }
    return shapes;
};
PMProject.prototype.setDirty = function (dirty) {
    if (typeof dirty === "boolean") {
        this.dirty = dirty;
    }
    return this;
};

PMProject.prototype.addElement = function (element) {
	
    var object,
        pk_name,
        list,
        i,
        pasteElement,
        elementUndo,
        sh,
        contDivergent = 0,
        contConvergent = 0;
    if (element.relatedElements.length > 0) {
        // for (i = 0; i < element.relatedElements.length; i += 1) {
        for (i = element.relatedElements.length -1; i >= 0; i -= 1) {
            pasteElement = element.relatedElements[i];
            list = this.getUpdateList(pasteElement.type);
            if (list === undefined) {
                return;
            }

            list[pasteElement.id] = object;
            elementUndo = {
                id: pasteElement.id,
                relatedElements: [],
                relatedObject: pasteElement,
                type: pasteElement.type || pasteElement.extendedType
            };
            //this.canvas.items.insert(elementUndo);
            PMUI.getActiveCanvas().items.insert(elementUndo);
            if (!(pasteElement instanceof PMUI.draw.MultipleSelectionContainer)
                && !(pasteElement instanceof PMLine)
                && !(pasteElement instanceof PMLabel) && !isIE8()) {
                pasteElement.createBpmn(pasteElement.getBpmnElementType());
            }

            //object = pasteElement.getDataObject();
        }
    } else {
        switch(element.type) {
            case "Connection":
                pk_name = this.formatProperty(element.type, 'uid');
                list = this.getUpdateList(element.type);
                element.relatedObject[pk_name] = element.id;

                if (typeof element.relatedObject.getDataObject === "undefined"){
                    object = element.relatedObject;
                } else {
                    //object = element.relatedObject.getDataObject();
                }
                list[element.id] = object;

                break;
            default:
                pk_name = this.formatProperty(element.type, 'uid');
                list = this.getUpdateList(element.type);
                element.relatedObject[pk_name] = element.id;
                //object = element.relatedObject.getDataObject();
                list[element.id] = object;
                break;
        }
        //this.canvas.items.insert(element);
        PMUI.getActiveCanvas().items.insert(element);

        var shape = element.relatedObject;
        if (!(shape instanceof PMUI.draw.MultipleSelectionContainer)
            && !(shape instanceof PMLine)
            && !(shape instanceof PMLabel) && !isIE8()) {
            shape.createBpmn(shape.getBpmnElementType());
        }
    }
    this.dirty = true;

    //Call to Create callBack
    this.listeners.create(this, element);
    PMDesigner.connectValidator.bpmnValidator();

};


PMProject.prototype.updateElement = function (updateElement) {
    var element,
        i,
        shape,
        object,
        list,
        item;
    for (i = 0; i < updateElement.length; i += 1) {
        element = updateElement[i];
        shape = element.relatedObject;

        object = this.formatObject(element);
        list = this.getUpdateList(element.type);

        if (list[element.id]) {
            jQuery.extend(true, list[element.id], object);
            if (element.type === 'Connection') {
                list[element.id].flo_state = object.flo_state;
                item = PMUI.getActiveCanvas().items.find("id",element.id);
                item.relatedObject.flo_state = object.flo_state;
            }
        } else {
            list[element.id] = object;
        }
        if (shape) {
            if(shape instanceof PMUI.draw.Port && !isIE8()) {
                shape.connection.updateBpmn();
            } else {
                if (!(shape instanceof PMUI.draw.MultipleSelectionContainer)
                    && !(shape instanceof PMLine)
                    && !(shape instanceof PMLabel) && !isIE8()) {
                    shape.updateBpmn();
                }

            }
        }

    }
    this.dirty = true;

    //Call to Update callBack
    this.listeners.update(this, updateElement);
    PMDesigner.connectValidator.bpmnValidator();
};



PMProject.prototype.removeElement = function (updateElement) {
    var object,
        dirtyEmptyCounter,
        element,
        i,
        pk_name,
        list,
        emptyObject = {},
        currentItem;

    for (i = 0; i < updateElement.length; i += 1) {
        element = updateElement[i];
        //Removig from canvas.item
        currentItem = PMUI.getActiveCanvas().items.find("id", updateElement[i].id);
        PMUI.getActiveCanvas().items.remove(currentItem);

        list = this.getUpdateList(element.type);
        if (list) {
            pk_name = this.formatProperty(element.type, 'uid');
            if (list[element.id]) {
                delete list[element.id];
            } else {
                pk_name = this.formatProperty(element.type, 'uid');
                object = {};
                object[pk_name] = element.id;
                list[element.id] = object;
            }
        }
        // to remove BpmnModdle in de exported xml
        if (!(element instanceof PMUI.draw.MultipleSelectionContainer)
            && !(element instanceof PMLine)
            && !(element instanceof PMLabel) && !isIE8()) {
            element.removeBpmn();
            if (element.atachedDiagram) {
                //console.log('remove diagram');
                this.removeAttachedDiagram(element);
            }
        }

    }

    if (!this.isWaitingResponse()) {
        dirtyEmptyCounter = true;
        dirtyEmptyCounter = dirtyEmptyCounter && (this.dirtyElements[0].activities === emptyObject);
        dirtyEmptyCounter = dirtyEmptyCounter && (this.dirtyElements[0].gateways === emptyObject);
        dirtyEmptyCounter = dirtyEmptyCounter && (this.dirtyElements[0].events === emptyObject);
        dirtyEmptyCounter = dirtyEmptyCounter && (this.dirtyElements[0].artifacts === emptyObject);
        dirtyEmptyCounter = dirtyEmptyCounter && (this.dirtyElements[0].flows === emptyObject);
        //dirtyEmptyCounter = dirtyEmptyCounter && (this.dirtyElements[0].data === emptyObject);
        if (dirtyEmptyCounter) {
            this.dirty = false;
        }
    }
    this.dirty = true;
    //Call to Remove callBack
    this.listeners.remove(this, updateElement);
    PMDesigner.connectValidator.bpmnValidator();
};

PMProject.prototype.formatProperty = function (type, property) {
    var prefixes = {
            "PMActivity" : "act",
            "PMGateway" : "gat",
            "PMEvent" : "evn",
            "PMArtifact" : "art",
            "PMData" : "dat",
            "PMParticipant" : "par",
            "PMPool" : "swl",
            "PMLane" : "lan",
            "PMParallel" : "par"
        },
        map = {
            // map for shapes
            x: "bou_x",
            y: "bou_y",
            width: "bou_width",
            height: "bou_height"
        },
        out;

    if (type === "PMFlow" || type === 'Connection') {
        out = "flo_" + property;
    } else if (map[property]) {
        out = map[property];
    } else {
        out = prefixes[type] + '_' + property;
    }
    return out;
};
PMProject.prototype.getUpdateList = function (type) {
    var listName = {
            "PMActivity" : "activities",
            "PMGateway" : "gateways",
            "PMEvent" : "events",
            "PMFlow" : "flows",
            "PMArtifact" : "artifacts",
            "PMLabel" : "artifacts",
            "Connection" : "flows",
            "PMData": "data",
            "PMParticipant": "participants",
            "PMPool": "laneset",
            "PMLane": "lanes",
            "PMParallel": "concurrent"
        },
        dirtyArray;
    dirtyArray = (this.isWaitingResponse()) ? 1 : 0;
    return this.dirtyElements[dirtyArray][listName[type]];
};

/**
 * Represents if the proxy is waiting any response from the server
 */
PMProject.prototype.isWaitingResponse = function () {
    return this.waitingResponse;
};

PMProject.prototype.updateIdentifiers = function (response) {
    var i, shape, that = this, connection, shapeCanvas;
    if (typeof response === "object") {
        for (i = 0; i < response.length; i+=1) {
            shape = PMUI.getActiveCanvas().items.find("id", response[i].old_uid);
            shapeCanvas = PMUI.getActiveCanvas().children.find("id", response[i].old_uid);
            connection = PMUI.getActiveCanvas().connections.find("flo_uid", response[i].old_uid);
            this.identifiers[response[i].old_uid] = response[i].new_uid;
            if (shape) {
                shape.id = response[i].new_uid;

                shape.relatedObject.id = response[i].new_uid;
                shape.relatedObject.html.id = response[i].new_uid;
                switch(shape.type) {
                    case "Connection":
                        shape.relatedObject.flo_uid = response[i].new_uid;
                        break;
                    case "PMActivity":
                        shape.relatedObject.act_uid = response[i].new_uid;
                        break;
                    case "PMEvent":
                        shape.relatedObject.evn_uid = response[i].new_uid;
                        break;
                    case "PMGateway":
                        shape.relatedObject.gat_uid = response[i].new_uid;
                        break;
                    case "PMArtifact":
                        shape.relatedObject.art_uid = response[i].new_uid;
                        break;
                    case "PMData":
                        shape.relatedObject.dat_uid = response[i].new_uid;
                        break;
                    case "PMParticipant":
                        shape.relatedObject.par_uid = response[i].new_uid;
                        break;
                    case "PMPool":
                        shape.relatedObject.lns_uid = response[i].new_uid;
                        shape.relatedObject.participantObject.id = 'el_' + response[i].new_uid;
                        break;
                    case "PMLane":
                        shape.relatedObject.lan_uid = response[i].new_uid;
                        break;
                    case "PMParallel":
                    	shape.relatedObject.par_uid = response[i].new_uid;
                        shape.relatedObject.participantObject.id = 'el_' + response[i].new_uid;
                }
            }
            if (shapeCanvas) {
                shapeCanvas.id = response[i].new_uid;
            }
            if (connection) {
                connection.flo_uid = response[i].new_uid;
                connection.id = response[i].new_uid;
            }
        }
    }
};

PMProject.prototype.formatObject = function (element) {
    var i,
        field,
        formattedElement = {},
        property;
    formattedElement[this.formatProperty(element.type, 'uid')] = element.id;

    if (element.adam) {
        for (i = 0; i < element.fields.length;  i += 1) {
            field = element.fields[i];
            formattedElement[field.field] = field.newVal;
        }
    } else if (element.fields){
        for (i = 0; i < element.fields.length;  i += 1) {
            field = element.fields[i];
            property = this.formatProperty(element.type, field.field);
            if (property === "element_uid") {
                field.newVal = field.newVal.id;
            }
            formattedElement[property] = field.newVal;
        }
    }

    return formattedElement;
};

PMProject.prototype.subProcessDiagram = function (element) {
    var sidebarCanvas = [], opt= {name : element.act_name}, s, newCanvas, di;
    PMUI.getActiveCanvas().getHTML().style.display = 'none';
    //console.log(element);
    if (!element.atachedDiagram) {
        for(s = 0; s < PMDesigner.sidebar.length; s += 1) {
            sidebarCanvas = sidebarCanvas.concat(PMDesigner.sidebar[s].getSelectors());
            jQuery(".bpmn_shapes").append(PMDesigner.sidebar[s].getHTML());
        }

        sidebarCanvas.splice(17, 1);  //to remove lane selector
        sidebarCanvas.splice(5, 1);  //to remove boundary event selector
        sidebarCanvas = sidebarCanvas.concat('.pmui-pmevent');
        sidebarCanvas = sidebarCanvas.concat('.pmui-pmactivity');
        sidebarCanvas = sidebarCanvas.concat('.pmui-pmgateway');
        sidebarCanvas = sidebarCanvas.concat('.pmui-pmdata');
        sidebarCanvas = sidebarCanvas.concat('.mafe-artifact-annotation');
        sidebarCanvas = sidebarCanvas.concat('.mafe-artifact-group');
        sidebarCanvas = sidebarCanvas.concat('.mafe-pool');
        sidebarCanvas = sidebarCanvas.concat('.mafe_participant');



        newCanvas = this.buildCanvas(sidebarCanvas, opt);
        PMUI.setActiveCanvas(newCanvas);
        jQuery("#p-center-layout").scroll(newCanvas.onScroll(newCanvas, jQuery("#p-center-layout")));
        newCanvas.getHTML().style.display = 'inline';
        element.atachedDiagram = newCanvas;
        PMDesigner.canvasList.setValue(newCanvas.getID());

        //change business object
        di = newCanvas.createBPMNDiagram();
        newCanvas.businessObject = element.businessObject;
        di.bpmnElement = element.businessObject; //update reference
        newCanvas.businessObject.di = di;


    } else {
        newCanvas = element.atachedDiagram;
        PMUI.setActiveCanvas(newCanvas);
        newCanvas.getHTML().style.display = 'inline';
        PMDesigner.canvasList.setValue(newCanvas.getID());
    }

};

PMProject.prototype.removeAttachedDiagram = function (element) {
    var canvas = element.atachedDiagram;
    this.diagrams.remove(canvas);
    if (canvas.html !== undefined) {
        jQuery(canvas.html).remove();
        canvas.html = null;
    }
    element.atachedDiagram = null;

    PMDesigner.canvasList.removeOption(canvas.getID());

};
PMProject.prototype.setTokens = function (response) {
    this.tokens = response;
    return this;
};

PMProject.prototype.setSaveButtonDisabled = function () {
    if (this.isDirty()) {
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
            
//            var mafebuttonMenu = document.getElementsByClassName("mafe-button-menu")[0];
//            mafebuttonMenu.style.backgroundColor = "#e8e8e8";
//            mafebuttonMenu.firstChild.src = contextPath+"/processDesigner/img/caret-down.png";
        }
    }
};