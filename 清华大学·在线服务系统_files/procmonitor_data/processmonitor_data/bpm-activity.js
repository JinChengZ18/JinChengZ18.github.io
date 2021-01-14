/**
 * 手动节点、自动节点、子流程节点基类
 * @autor siqingqian
 */

/**
 * @class PMActivity
 * @param {Object} options
 */
var PMActivity = function (options) {
	PMShape.call(this, options);
	
    /**
     * Activity Alphanumeric unique identifier
     * @type {String}
     */
    this.act_uid = null;
    /**
     * Activity name
     * @type {String}
     */
    this.act_name = null;
    /**
     * Activity Type
     * @type {String}
     */
    this.act_type = null;
    /**
     * 节点xml
     * */
    this.act_xml=null;
    /**
     * Activity Description
     * @type {String}
     */
    
    this.act_description=null;    
    /**
     * 当节点在并发体中时，存储节点属于并发体中的那个分支
     * 如果不在并发体中则为空
     * */
    this.branch_id=null;
   /**
    * 节点图标
    * */
    this.act_icon=null;
    /**
     * Array of Boundary events attached to this activity
     * @type {Array}
     */
    this.boundaryArray = new PMUI.util.ArrayList();
    this.isValidDropArea = true;
  
	PMActivity.prototype.init.call(this, options);
};

/**
 * Point the prototype to the PMShape Object
 * @type {PMShape}
 */
PMActivity.prototype = new PMShape();
/**
 * Defines the object type
 * @type {String}
 */
PMActivity.prototype.type = 'PMActivity';
/**
 * Points to container behavior object
 * @type {Object}
 */
PMActivity.prototype.activityContainerBehavior = null;
/**
 * Points to the resize behavior object
 * @type {Object}
 */
PMActivity.prototype.activityResizeBehavior = null;

PMActivity.prototype.mapBpmnType = {
    'EMPTY': 'bpmn:Task',
    'SENDTASK': 'bpmn:SendTask',
    'RECEIVETASK' : 'bpmn:ReceiveTask',
    'USERTASK' : 'bpmn:UserTask',
    'SERVICETASK' : 'bpmn:ServiceTask',
    'SCRIPTTASK' : 'bpmn:ScriptTask',
    'MANUALTASK' : 'bpmn:ManualTask',
    'BUSINESSRULE' : 'bpmn:BusinessRuleTask',
    'MENU' : 'bpmn:Menu'
};
PMActivity.prototype.supportedArray = [
    'EMPTY',
    'MENU',
    'COLLAPSED',
    'SENDTASK',
    'RECEIVETASK',
    'USERTASK',
    'SERVICETASK',
    'SCRIPTTASK',
    'MANUALTASK',
    'BUSINESSRULE'
];

PMActivity.prototype.supportedLoopArray = [
    'EMPTY',
    'NONE',
    'LOOP',
    'PARALLEL',
    'SEQUENTIAL'
];

PMActivity.prototype.mapLoopTypes = {
    'LOOP': 'bpmn:StandardLoopCharacteristics',
    'PARALLEL' : 'bpmn:MultiInstanceLoopCharacteristics',
    'SEQUENTIAL' : 'bpmn:MultiInstanceLoopCharacteristics'      
};



/**
 * Initialize object with default values
 * @param options
 */
PMActivity.prototype.init = function (options) {
    var defaults = {
        act_type: 'TASK',
        act_name: 'Task',
        act_task_type: 'EMPTY',
        act_loop_type: 'NONE',
        act_xml:"",
        branch_id:"",
        act_icon:"",
        width:120,
        height:60,
        minHeight: 50,
        minWidth: 100,
        maxHeight: 500,
        maxWidth: 600
    };
    jQuery.extend(true, defaults, options);
    this.setActivityUid(defaults.act_uid)
        .setActName(defaults.act_name)
        .setActivityType(defaults.act_type)
        .setTaskType(defaults.act_task_type)
        .setActXml(defaults.act_xml)
        .setActIcon(defaults.act_icon)
        .setBranchId(defaults.branch_id)
        .setMinHeight(defaults.minHeight)
        .setMinWidth(defaults.minWidth)
        .setMaxHeight(defaults.maxHeight)
        .setMaxWidth(defaults.maxWidth);
    this.setOnBeforeContextMenu(this.beforeContextMenu);
};
/**
 * 设置节点xml
 * */
PMActivity.prototype.setActXml = function (xml) {
	this.act_xml=null;
    if (xml !== 'undefined' && xml !== '') {
        this.act_xml = xml;
    }else if(this.act_type=="TASK"){
    	this.act_xml = PMDesigner.strToXml('\n<ManualNode id="'+ this.id +'" ID="'+this.id+'" name="'+this.getActName()+'" msgReceiver="appmanager" operationLevel="0" assignRule="0" icon="'+this.getActIcon()+'"></ManualNode>').getElementsByTagName("ManualNode")[0];
    }else if(this.act_type=="AUTO_TASK"){
    	this.act_xml = PMDesigner.strToXml('\n<AutoNode id="'+ this.id +'" ID="'+this.id+'" name="'+this.getActName()+'" msgReceiver="appmanager" icon="'+this.getActIcon()+'"></AutoNode>').getElementsByTagName("AutoNode")[0];
    }else{
    	this.act_xml = PMDesigner.strToXml('\n<SubprocNode id="'+ this.id +'" ID="'+this.id+'" name="'+this.getActName()+'" msgReceiver="appmanager" subProcCoupleType="0" invokeMode="1" icon="'+this.getActIcon()+'"></SubprocNode>').getElementsByTagName("SubprocNode")[0];
    }
    return this;
};
/**
 * 返回开始、结束节点的xml串
 * */
PMActivity.prototype.getActXml = function () {
    return this.act_xml;
};
PMActivity.prototype.setActIcon=function(icon){
	this.act_icon=icon;
	this.getActXml().setAttribute("icon",icon);
	return this;
}
PMActivity.prototype.getActIcon=function(){
	return this.act_icon;
}
/**
 * 返回并发体中节点所在分支标识
 * */
PMActivity.prototype.getBranchId = function () {
    return this.branch_id;
};
/**
 * 设置并发体中节点所属分支的标识
 * */
PMActivity.prototype.setBranchId = function (branchId) {
	this.branch_id=branchId;
    return this;
};
/**
 * Sets the label element
 * @param {String} value
 * @return {*}
 */
PMActivity.prototype.setName = function (name) {
    if (typeof name !== 'undefined') {
        this.act_name = name;
        if (this.label) {
            this.label.setMessage(name);
            this.getActXml().setAttribute("name",name);
        }
    }
    return this;
};
/**
 * Returns the activity type property
 * @return {String}
 */
PMActivity.prototype.getActivityType = function () {
    return this.act_type;
};

/**
 * Return the minimun height of an activity
 * @return {*}
 */
PMActivity.prototype.getMinHeight = function () {
    return this.minHeight;
};

/**
 * Return the minimun width of an activity
 * @return {*}
 */
PMActivity.prototype.getMinWidth = function () {
    return this.minWidth;
};
/**
 * Return the maximun height of an activity
 * @return {*}
 */
PMActivity.prototype.getMaxHeight = function () {
    return this.maxHeight;
};

/**
 * Return the maximun width of an activity
 * @return {*}
 */
PMActivity.prototype.getMaxWidth = function () {
    return this.maxWidth;
};
/**
 * Sets the act_uid property
 * @param {String} value
 * @return {*}
 */
PMActivity.prototype.setActivityUid = function (value) {
    this.act_uid = value;
    return this;
};
/**
 * Return the id of an activity
 * @returns{String}
 * */
PMActivity.prototype.getActivityUid = function () {
    return this.act_uid;
};
/**
 * Sets the activity type property
 * @param {String} type
 * @return {*}
 */
PMActivity.prototype.setActivityType = function (type) {
    this.act_type = type;
    return this;
};
/**
 * Set the loop type property
 * @param {String} type
 * @return {*}
 */
PMActivity.prototype.setLoopType = function (type) {
    this.act_loop_type = type;
    return this;
};

/**
 * Sets the activity task type
 * @param {String} type
 * @return {*}
 */
PMActivity.prototype.setTaskType = function (type) {
    this.act_task_type = type;
    return this;
};

/**
 * Sets the activity task type
 * @param {String} type
 * @return {*}
 */
PMActivity.prototype.setLoopType = function (type) {
    this.act_loop_type = type;
    return this;
};

/**
 * Sets the minimun height
 * @param {Number} value
 * @return {*}
 */
PMActivity.prototype.setMinHeight = function (value) {
    this.minHeight = value;
    return this;
};

/**
 * Sets the minimun with
 * @param {Number} value
 * @return {*}
 */
PMActivity.prototype.setMinWidth = function (value) {
    this.minWidth = value;

    return this;
};
/**
 * Sets the maximun height
 * @param {Number} value
 * @return {*}
 */
PMActivity.prototype.setMaxHeight = function (value) {
    this.maxHeight = value;
    return this;
};

/**
 * Sets the maximun with
 * @param {Number} value
 * @return {*}
 */
PMActivity.prototype.setMaxWidth = function (value) {
    this.maxWidth = value;

    return this;
};

PMActivity.prototype.setActType = function (type) {
	this.act_type = type;
	return this;
};

PMActivity.prototype.setActName = function (name) {
	this.act_name = name;
	return this;
};
/**
 * Return the name of an activity 
 * @returns{String}
 * */
PMActivity.prototype.getActName = function () {
	return this.act_name;
}
/**
 * Factory of activity behaviors. It uses lazy instantiation to create
 * instances of the different container behaviors
 * @param {String} type An string that specifies the container behavior we want
 * an instance to have, it can be regular or nocontainer
 * @return {ContainerBehavior}
 */
PMActivity.prototype.containerBehaviorFactory = function (type) {
    if (type === 'activity'){
        if(!this.activityContainerBehavior) {
            this.activityContainerBehavior = new ActivityContainerBehavior();
        }
        return this.activityContainerBehavior;
    } else {
        return PMShape.prototype.containerBehaviorFactory.call(this, type);
    }
};

PMActivity.prototype.dropBehaviorFactory = function (type, selectors) {
    if (type === 'pmconnection') {
        if (!this.pmConnectionDropBehavior) {
            this.pmConnectionDropBehavior = new PMConnectionDropBehavior(selectors);
        }
        return this.pmConnectionDropBehavior;
    } else if (type === 'pmcontainer') {
        if (!this.pmContainerDropBehavior) {
            this.pmContainerDropBehavior = new PMContainerDropBehavior(selectors);
        }
        return this.pmContainerDropBehavior;
    } else if (type === 'pmactivitydrop') {
        if (!this.pmContainerDropBehavior) {
            this.pmContainerDropBehavior = new PMActivityDropBehavior(selectors);
        }
        return this.pmContainerDropBehavior;
    } else {
        return PMUI.draw.CustomShape.prototype.dropBehaviorFactory.call(this, type, selectors);
    }
};

PMActivity.prototype.getDataObject = function () {
	
	var name = this.getName(),
        container,
        element_id;
    switch(this.parent.type) {
    case 'PMCanvas':
        container = 'bpmnDiagram';
        element_id = this.canvas.id;
        break;
    case 'PMPool':
        container = 'bpmnPool';
        element_id = this.parent.id;
        break;
    case 'PMLane':
        container = 'bpmnLane';
        element_id = this.parent.id;
        break;
    case 'PMParallel':
    	container = 'bpmnParallel';
        element_id = this.parent.id;
        break;
    default:
        container = 'bpmnDiagram';
        element_id = this.canvas.id;
        break;
    }
    return {
		act_uid: this.id,
		id: this.id,
		act_name: name,
		act_type: this.act_type,
		act_task_type: this.act_task_type,
		type: this.act_type,
		act_xml:this.act_xml,
		xml:this.act_xml,
		branch_id:this.branch_id,
	    bou_x: this.x,
	    bou_y: this.y,
	    bou_width: this.width,
        bou_height: this.height,
        bou_container: container,
        bou_element: element_id,
        _extended: this.getExtendedObject()
    };
};



/**
 * Create/Initialize the boundary places array
 * @return {*}
 */
PMActivity.prototype.makeBoundaryPlaces = function () {
    var bouX,
        bouY,
        factor = 3,
        space,
        number = 0,
        shape = this.boundaryArray.getFirst(),
        numBottom = 0,
        numLeft = 0,
        numTop = 0,
        numRight = 0;
/*
    //BOTTON
    bouY = shape.parent.getHeight() - shape.getHeight() / 2; // Y is Constant
    bouX = shape.parent.getWidth() - (numBottom + 1) * (shape.getWidth() + factor);
    while (bouX + shape.getWidth() / 2 > 0) {
        space = {};
        space.x = bouX;
        space.y = bouY;
        space.available = true;
        space.number = number;
        space.location = 'BOTTOM';
        shape.parent.boundaryPlaces.insert(space);
        number += 1;
        numBottom += 1;
        bouX = shape.parent.getWidth() - (numBottom + 1) * (shape.getWidth() + factor);
    }

    //LEFT
    bouY = shape.parent.getHeight() - (numLeft + 1) * (shape.getHeight() + factor);
    bouX = -shape.getHeight() / 2;   // X is Constant
    while (bouY + shape.getHeight() / 2 > 0) {
        space = {};
        space.x = bouX;
        space.y = bouY;
        space.available = true;
        space.number = number;
        space.location = 'LEFT';
        shape.parent.boundaryPlaces.insert(space);
        number += 1;
        numLeft += 1;
        bouY = shape.parent.getHeight() - (numLeft + 1) * (shape.getHeight() + factor);
    }

    //TOP
    bouY = -shape.getWidth() / 2; // X is Constant
    bouX = numTop * (shape.getWidth() + factor);
    while (bouX + shape.getWidth() / 2 < shape.parent.getWidth()) {
        space = {};
        space.x = bouX;
        space.y = bouY;
        space.available = true;
        space.number = number;
        space.location = 'TOP';
        shape.parent.boundaryPlaces.insert(space);
        number += 1;
        numTop += 1;
        bouX = numTop * (shape.getWidth() + factor);
    }

    //RIGHT
    bouY = numRight * (shape.getHeight() + factor);
    bouX = shape.parent.getWidth() - shape.getWidth() / 2; // Y is Constant
    while (bouY + shape.getHeight() / 2 < shape.parent.getHeight()) {
        space = {};
        space.x = bouX;
        space.y = bouY;
        space.available = true;
        space.number = number;
        space.location = 'RIGHT';
        shape.parent.boundaryPlaces.insert(space);
        number += 1;
        numRight += 1;
        bouY = numRight * (shape.getHeight() + factor);
    }*/
    return this;
};

/**
 * Sets the boundary element to a selected boundary place
 * @param {PMEvent} shape
 * @param {Number} number
 * @return {*}
 */
PMActivity.prototype.setBoundary = function (shape, number) {
   /* var bouPlace = this.boundaryPlaces.get(number);
    bouPlace.available = false;
    shape.setPosition(bouPlace.x, bouPlace.y);*/
    return this;
};

/**
 * Returns the current place available to attach boundary events.
 * Retuns false if there's not place available
 * @return {Number/Boolean}
 */
PMActivity.prototype.getAvailableBoundaryPlace = function () {
    var place = 0,
        bouPlace,
        sw = true,
        i;
  /*  for (i = 0; i < this.boundaryPlaces.getSize(); i += 1) {
        bouPlace = this.boundaryPlaces.get(i);
        if (bouPlace.available && sw) {
            place = bouPlace.number;
            sw = false;
        }
    }
    if (sw) {
        place = false;
    }*/
    return place;
};

/**
 * Update Boundary Places Array
 * @return {*}
 */
PMActivity.prototype.updateBoundaryPlaces = function () {
   /* var i,
        aux,
        k = 0;
    
    aux =  new PMUI.util.ArrayList();
    for (i = 0; i < this.boundaryPlaces.getSize(); i += 1) {
        aux.insert(this.boundaryPlaces.get(i));
    }

    this.boundaryPlaces.clear();
    this.makeBoundaryPlaces();

    for (i = 0; i < this.boundaryPlaces.getSize(); i += 1) {
        if (k < aux.getSize()) {
            this.boundaryPlaces.get(i).available = aux.get(k).available;
            k += 1;
        }
    }
    return this;*/
};

/**
 * Returns the number of boundary events attached to this activity
 * @return {Number}
 */
PMActivity.prototype.getNumberOfBoundaries = function () {
    var child,
        i,
        bouNum = 0;
/*
    for (i = 0; i < this.getChildren().getSize(); i += 1) {
        child = this.getChildren().get(i);
        if (child.getType() === 'PMEvent' && child.evn_type === 'BOUNDARY') {
            bouNum = bouNum + 1;
        }
    }*/
    return bouNum;
};
/**
 * Updates boundary positions when exists a change into the boundary array
 * @param {Boolean} createIntersections
 */
PMActivity.prototype.updateBoundaryPositions = function (createIntersections) {
   /* var child,
        port,
        i,
        j;

    if (this.getNumberOfBoundaries() > 0) {

        this.updateBoundaryPlaces();
        for (i = 0; i < this.getChildren().getSize(); i += 1) {
            child = this.getChildren().get(i);
            if (child.getType() === 'PMEvent'
                && child.evn_type === 'BOUNDARY') {
                child.setPosition(this.boundaryPlaces.get(child.numberRelativeToActivity).x,
                    this.boundaryPlaces.get(child.numberRelativeToActivity).y
                );
                for (j = 0; j < child.ports.getSize(); j += 1) {
                    port = child.ports.get(j);
                    port.setPosition(port.x, port.y);
                    port.connection.disconnect().connect();
                    if (createIntersections) {
                        port.connection.setSegmentMoveHandlers();
                        port.connection.checkAndCreateIntersectionsWithAll();
                    }
                }
            }
        }
    }*/
};

PMActivity.prototype.getActivityType = function () {
    return this.act_type;
};

PMActivity.prototype.getContextMenu = function () {
};
PMActivity.prototype.getTaskType = function () {
    return this.act_task_type;
};

PMActivity.prototype.getLoopType = function () {
    return this.act_loop_type;
};

PMActivity.prototype.updateDefaultFlow = function (destID) {
    this.act_default_flow = destID;
    return this;
};

PMActivity.prototype.updateTaskType = function (newType) {
    return this;
};

PMActivity.prototype.updateScriptType = function (newType) {
    return this;
};
PMActivity.prototype.setNodeState = function (newTheme) {
	if(theme==="tradition")
		this.changeColor(newTheme);
	else
		this.changeIcon(newTheme);
}
PMActivity.prototype.changeIcon = function (newTheme) {
	  switch (newTheme) {
//    节点为图片时、流程监控的五种状态
	    case 'running':
	    case 'active':
	    case 'hangup':
	    case 'finished':
	    case 'ended':
	        newClass = 'bpm-monitor-activity-task-' + newTheme;
	    break;
//    end of 流程监控的五种状态
        default:
            newClass = 'bpm-monitor-activity-task';
        break;
	  }
	  var firstMaker=this.markersArray.get(0);
	  firstMaker.style.removeClasses(['bpm-monitor-activity-task','bpm-monitor-activity-task-running', 'bpm-monitor-activity-task-active', 'bpm-monitor-activity-task-hangup','bpm-monitor-activity-task-finish', 'bpm-monitor-activity-task-ended']);
	  firstMaker.style.addClasses([newClass]);
}
PMActivity.prototype.changeColor = function (newTheme) {
    switch (newTheme) {
//    流程监控的五种新颜色 lv.yz
	    case 'running':
	    case 'active':
	    case 'hangup':
	    case 'finished':
	    case 'ended':
	        newClass = 'mafe-activity-task-' + newTheme;
	    break;
//    end of 流程监控的五种新颜色
        default:
            newClass = 'mafe-activity-task';
        break;
    }
    var firstLayer = this.getLayers().asArray()[0];
    //remove custom clasess
    firstLayer.style.removeClasses(['mafe-activity-task','mafe-activity-task-running', 'mafe-activity-task-hangup', 'mafe-activity-task-active','mafe-activity-task-finished', 'mafe-activity-task-ended']);
    //add the new class
    firstLayer.style.addClasses([newClass]);
    //字体修改为白色
    if(newTheme=='default'){
    	this.getLabels().asArray()[0].style.removeClasses(['pmui-label-white']);
    }else{
    	this.getLabels().asArray()[0].style.addClasses(['pmui-label-white']);
    }
    
    
    return this;
};

PMActivity.prototype.setResizeBehavior = function (behavior) {
        var factory = new PMUI.behavior.BehaviorFactory({
                products: {
                    "regularresize": PMUI.behavior.RegularResizeBehavior,
                    "Resize": PMUI.behavior.RegularResizeBehavior,
                    "yes": PMUI.behavior.RegularResizeBehavior,
                    "resize": PMUI.behavior.RegularResizeBehavior,
                    "noresize": PMUI.behavior.NoResizeBehavior,
                    "NoResize": PMUI.behavior.NoResizeBehavior,
                    "no": PMUI.behavior.NoResizeBehavior,
                    "activityResize": PMActivityResizeBehavior
                },
                defaultProduct: "noresize"
            });
        this.resizeBehavior = factory.make(behavior);
        if (this.html) {
            this.resize.init(this);
        }
        return this;
};


///**
// * Change task type 
// * @param {String} type
// * @returns {*}
// */
//PMActivity.prototype.switchTaskType= function(type){
//    var marker = this.markersArray.get(0),
//        lowerType = type.toLowerCase();
//    marker.removeAllClasses();
//    marker.setMarkerZoomClasses([
//                                "mafe-" + lowerType + "-marker-10",
//                                "mafe-" + lowerType + "-marker-15",
//                                "mafe-" + lowerType + "-marker-21",
//                                "mafe-" + lowerType + "-marker-26",
//                                "mafe-" + lowerType + "-marker-31"
//                            ]);
//    marker.paint(true);
//    this.setTaskType(type);
//    this.paint();
//    this.updateBpmnTaskType(this.mapBpmnType[this.getTaskType()]);
//    PMDesigner.connectValidator.bpmnValidator();
//    return this;
//};

///**
// * Change subprocess type 
// * @param {String} type
// * @returns {*}
// */
//PMActivity.prototype.switchSubProcessType= function(type){
//    var marker = this.markersArray.get(0),
//        lowerType = type.toLowerCase();
//    marker.removeAllClasses();
//    marker.setMarkerZoomClasses([
//                                "mafe-" + lowerType + "-marker-10",
//                                "mafe-" + lowerType + "-marker-15",
//                                "mafe-" + lowerType + "-marker-21",
//                                "mafe-" + lowerType + "-marker-26",
//                                "mafe-" + lowerType + "-marker-31"
//                            ]);
//    marker.paint(true);
//    this.setTaskType(type);
//    this.paint();
//    //this.updateBpmnTaskType(this.mapBpmnType[this.getTaskType()]);
//
//    return this;
//};

//PMActivity.prototype.executeLoopType= function(type) {
//    var marker = this.markersArray.get(1),
//        lowerType = type.toLowerCase();
//    marker.removeAllClasses();
//    marker.setMarkerZoomClasses([
//        "mafe-" + lowerType + "-marker-10",
//        "mafe-" + lowerType + "-marker-15",
//        "mafe-" + lowerType + "-marker-21",
//        "mafe-" + lowerType + "-marker-26",
//        "mafe-" + lowerType + "-marker-31"
//    ]);
//    marker.paint(true);
//    this.setLoopType(type);
//    this.paint();
//    this.updateBpmnTaskType(this.mapBpmnType[this.getTaskType()], this.getLoopType());
//    PMDesigner.connectValidator.bpmnValidator();
//    return this;
//};

PMActivity.prototype.beforeContextMenu = function () {
	// 手动节点触发右键菜单 by siqq 
   /* var items, i,
        menuItem,
        hasMarker = false;
    this.canvas.hideAllCoronas();
    if(this.getActivityType() === 'TASK') {
        items = this.menu.items.find('id', 'taskType').childMenu.items;
        for (i = 0; i < items.getSize(); i += 1) {
            menuItem = items.get(i);
            if (menuItem.id === this.getTaskType().toLowerCase()) {
                menuItem.disable();
                hasMarker = true;
            } else {
                menuItem.enable();
            }
        }
   //我们的节点模型中没有循环任务节点 siqq
        items = this.menu.items.find('id', 'loopType').childMenu.items;
        for (i = 0; i < items.getSize(); i += 1) {
            menuItem = items.get(i);
            if (menuItem.id === this.getLoopType().toLowerCase()) {
                menuItem.disable();
                hasMarker = true;
            } else {
                menuItem.enable();
            }
        }       
    }*/

};
/**
 * updates XML task type tag, removes the current tag and create a new updated
 * @param newBpmnType
 * @param loopType
 */
PMActivity.prototype.updateBpmnTaskType = function(newBpmnType, loopType) {
    var tempID = this.businessObject.elem.id;
    this.removeBpmn();
    this.businessObject.elem = null;
    this.createBpmn(newBpmnType);
    this.businessObject.elem.id = tempID;
    if (loopType && typeof loopType !== 'undefined' && loopType !== 'EMPTY'){
        this.createLoopCharacteristics(this.businessObject.elem, loopType);
    }
};

PMActivity.prototype.getBpmnElementType = function () {
    if (this.extendedType === 'SUB_PROCESS') {
        return 'bpmn:SubProcess';
    } else if(this.extendedType === 'AUTO_TASK'){
    	return 'bpmn:AutoTask';
    }else {
        return this.mapBpmnType[this.getTaskType()];
    }

};
PMActivity.prototype.isSupported = function () {
    var isSupported = false;
    if (this.supportedArray.indexOf(this.getTaskType()) !== -1) {
        isSupported = true;
        if(this.getTaskType() != "COLLAPSED"){
            if (this.supportedLoopArray.indexOf(this.getLoopType()) !== -1) {
                isSupported = true;
            }else{
                isSupported = false;
            }
        }
    }
    
    return isSupported;
};
/**
 * Creates XML Loop task tag to export.
 * @param element
 * @param loopType
 */
PMActivity.prototype.createLoopCharacteristics = function(element, loopType) {
    var loopTypeA,
        loopChar={
            isSequential:false,
            behavior:'All'
        };
    loopTypeA = this.mapLoopTypes[loopType];
    element['loopCharacteristics'] = PMDesigner.bpmnFactory.create(loopTypeA, loopChar);
    if(loopType == "SEQUENTIAL"){
        element['loopCharacteristics'].set('isSequential',true);
    }else{
        element['loopCharacteristics'].set('isSequential',false);
    }   
};


PMActivity.prototype.createBpmn = function(type) {

    if(!this.businessObject.elem && !(this instanceof PMUI.draw.MultipleSelectionContainer)){
        this.createWithBpmn(type, 'businessObject');
    }
    this.updateBounds(this.businessObject.di);
    if ( this.parent.getType()==='PMCanvas' && !this.parent.businessObject.di) {
        this.canvas.createBPMNDiagram();
    }
    //LOOP characteristics
    if(this.act_loop_type && this.act_loop_type !== "EMPTY"){
        this.createLoopCharacteristics(this.businessObject.elem, this.act_loop_type);
    }

    if (this.parent.businessObject.elem){
        this.updateShapeParent(this.businessObject, this.parent.businessObject);
    } else {
        //Here create busines object to new process
        this.parent.createBusinesObject();

        this.updateShapeParent(this.businessObject, this.parent.businessObject);
    }
};
