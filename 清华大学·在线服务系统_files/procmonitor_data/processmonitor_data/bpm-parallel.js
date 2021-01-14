var PMParallel = function (options) {
    PMShape.call(this, options);

    /**
     *
     * @type {String}
     */
    this.name = '';

    /**
     *
     * @type {String}
     */
    this.parUid = '';
    /**
     *
     * @type {String}
     */
    this.proType = '';
    /**
     *
     * @type {Boolean}
     */
    this.executable = false;
    
    /**
     *
     * @type {Boolean}
     */
    this.closed = false;
    
    /**
     *
     * @type {String}
     */
    this.parentLane = null;
    /**
     *
     * @type {Number}
     */
    this.relPosition = 0;

    /**
     *
     * @type {Boolean}
     */
    this.sizeIdentical = false;
    /**
     * 定义泳道的xml对象
     * */
    this.pol_xml=null;
    
    this.branch_id=null;
    /**
     *
     * @type {Number}
     */
    this.participants = 0;
    this.graphic = null;
    this.headLineCoord = 0;
    this.orientation = '';
 
    this.participantObject = null;
    this.hasMinimun = false;
    this.bpmnLanes = new PMUI.util.ArrayList();
    /**
     * 记录并发体内最右端节点坐标，为拖动节点之后，自动缩小做依据
     * 
     * */
    this.rightestPointX = 0;
    this.downestPointY = 0;
    this.upPointY = 0;
    this.leftPointX = 0;
    
//    this.pointX=0;
//    this.pointY=0;
    PMParallel.prototype.initObject.call(this, options);
};
PMParallel.prototype = new PMShape();
PMParallel.prototype.type = 'PMParallel';

PMParallel.prototype.parallelContainerBehavior = null;/*节点放入泳道容器时触发的行为*/
PMParallel.prototype.poolResizeBehavior = null;/*节点改变大小的行为*/

PMParallel.prototype.getDataObject = function () {
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
        par_uid: this.getID(),
        par_name: name,
        type :'PMParallel',
        bou_x: this.x,
        bou_y: this.y,
        bou_width: this.width,
        bou_height: this.height,
        bou_container: container,
        bou_element: element_id,
      //  participant:this.participants,
      //  participantObject:this.participantObject,
      //  orientation:this.orientation,
        par_xml:this.pol_xml,
        xml: this.pol_xml,
        branch_id:this.branch_id,
        _extended: this.getExtendedObject()
    };
};

/**
 * Object init method (internal)
 * @param {Object} options
 */
PMParallel.prototype.initObject = function (options) {
    var defaultOptions = {
        lns_name : '并发体',
        parUid : '',
        proType : '',
        branch_id:"",
        executable : false,
        closed: false,
        parentLane: '',
        relPosition: 0,
        sizeIdentical: false,
        participants: 0,
        orientation: 'horizontal',
        pol_xml:'',
        resizing: false,
        parentLane: null,
        identicalSize: false
    };
    $.extend(true, defaultOptions, options);

    this.setName(defaultOptions.lns_name)
        .setParUid(defaultOptions.parUid)
        .setProType(defaultOptions.proType)
        .setExecutable(defaultOptions.executable)
        .setClosed(defaultOptions.closed)
//        .setParentLane(defaultOptions.parentLane)
        .setRelPosition(defaultOptions.relPosition)
        .setSizeIdentical(defaultOptions.sizeIdentical)
        .setOrientation(defaultOptions.orientation)
//        .setParentLane(defaultOptions.parentLane)
        .setIdenticalSize(defaultOptions.identicalSize);
    this.setPolXml(defaultOptions.pol_xml);
    this.setBranchId(defaultOptions.branch_id);
};
/**
 * 返回并发体中节点所在分支标识
 * */
PMParallel.prototype.getBranchId = function () {
    return this.branch_id;
};
/**
 * 设置并发体中节点所属分支的标识
 * */
PMParallel.prototype.setBranchId = function (branchId) {
	this.branch_id=branchId;
    return this;
};
PMParallel.prototype.setPolXml = function (xml) {
	if (xml !== 'undefined' && xml !== '') {
        this.pol_xml = xml;
    }else{
    	this.pol_xml = PMDesigner.strToXml('<Parallel id="'+ this.getID() +'" ID="'+this.getID()+'" name="'+this.getName()+'" x="0" y="0" width="" height="" msgReceiver="appmanager" ></Parallel>').getElementsByTagName("Parallel")[0];
    }
};

PMParallel.prototype.getConXml = function () {
	return this.pol_xml;
};
PMParallel.prototype.getRightestPointX = function(){
	return this.rightestPointX;
}
PMParallel.prototype.getDownestPointY = function(){
	return this.downestPointY;
}
PMParallel.prototype.getUpPointY = function(){
	return this.upPointY;
}
PMParallel.prototype.getLeftPointX = function(){
	return this.leftPointX;
}

PMParallel.prototype.setLeftPointX = function(value){
	this.leftPointX = value;
}
PMParallel.prototype.setUpPointY = function(value){
	this.upPointY = value;
}
PMParallel.prototype.setRightestPointX = function(value){
	this.rightestPointX = value;
}
PMParallel.prototype.setDownestPointY = function(value){
	this.downestPointY = value;
}
//PMParallel.prototype.setPointX = function(value){
//	this.pointX= value;
//}
//PMParallel.prototype.setPointY = function(value){
//	this.pointY = value;
//}
//PMParallel.prototype.getPointX = function(value){
//	return this.pointX;
//}
//PMParallel.prototype.getPointY = function(value){
//	return this.pointY;
//}
/**
 * Creates the HTML representation of the layer
 * @returns {HTMLElement}
 */
PMParallel.prototype.createHTML = function () {
	
    PMShape.prototype.createHTML.call(this);
    //this.style.addClasses(['bpmn_pool', 'bpmn_exclusive']);
    return this.html;
};

PMParallel.prototype.decreaseZIndex = function () {
    this.fixZIndex(this, 3);
    return this;
};

PMParallel.prototype.applyZoom = function () {
    PMShape.prototype.applyZoom.call(this);
    this.updateDimensions(10);
};

PMParallel.prototype.onUpdateLabel = function () {
    var label = this.getLabels().get(0);
    label.text.style["text-overflow"] = "ellipsis";
    label.text.style["overflow"] = "hidden";
    label.text.style["white-space"] = "nowrap";
    label.text.style["margin-left"] = "2%";    
    label.text.setAttribute("title",label.getMessage());
    return this;
};
/**
 * Paints the corresponding Pool, in this case adds the
 * corresponding css classes and margins
 * @chainable
 */
PMParallel.prototype.paint = function() {
    var zoomFactor = this.canvas.zoomFactor,
        label = this.getLabels().get(0);
    if (typeof this.graphic === 'undefined' || this.graphic === null) {
        this.graphic = new JSGraphics(this.id);
    } else {
        this.graphic.clear();
    }

    this.graphic.setColor('#3b4753'); //change color
    this.graphic.setStroke(2);
    if (this.orientation === 'vertical') {
        this.graphic.drawLine(0, this.headLineCoord * zoomFactor,
            this.zoomWidth, this.headLineCoord * zoomFactor);
        label.setOrientation('vertical');
        label.setLabelPosition('center-left');
    } else {
        this.graphic.drawLine(this.headLineCoord * zoomFactor, 0,
            this.headLineCoord * zoomFactor, this.zoomHeight - 5);
        label.setOrientation('horizontal');
        label.setLabelPosition('top');
        //label.setOrientation('vertical');
        //label.setLabelPosition('center-left', 20, 0);

    }
    this.onUpdateLabel();
    //this.graphic.paint();
    if (this.corona) {
        this.corona.paint();
        this.corona.hide();
    }
};

/**
 * Factory of pool behaviors. It uses lazy instantiation to create
 * instances of the different container behaviors
 * @param {String} type An string that specifies the container behavior we want
 * an instance to have, it can be regular or nocontainer
 * @return {ContainerBehavior}
 */
PMParallel.prototype.containerBehaviorFactory = function (type) {
    if (type === 'concurrent'){
        if(!this.parallelContainerBehavior) {
            this.parallelContainerBehavior = new ParallelContainerBehavior();
        }
        return this.parallelContainerBehavior;
    } else {
        return PMShape.prototype.containerBehaviorFactory.call(this, type);
    }
};

/**
 * Handler for the onmousedown event, changes the draggable properties
 * according to the drag behavior that is being applied
 * @param {CustomShape} CustomShape
 * @returns {Function}
 * TODO Implement Mouse Down handler
 */
PMParallel.prototype.onMouseDown = function (shape) {
//    if (shape.getParentLane()) {
//        return function (e, ui) {
//            e.stopPropagation();
//        };
//    } else {
        return PMShape.prototype.onMouseDown.call(this, shape);
//    }
};

PMParallel.prototype.setResizeBehavior = function (behavior) {
	
        var factory = new PMUI.behavior.BehaviorFactory({
                products: {
                    "regularresize": PMUI.behavior.RegularResizeBehavior,
                    "Resize": PMUI.behavior.RegularResizeBehavior,
                    "yes": PMUI.behavior.RegularResizeBehavior,
                    "resize": PMUI.behavior.RegularResizeBehavior,
                    "noresize": PMUI.behavior.NoResizeBehavior,
                    "NoResize": PMUI.behavior.NoResizeBehavior,
                    "no": PMUI.behavior.NoResizeBehavior,
                    "poolResize": PMParallelResizeBehavior
                },
                defaultProduct: "noresize"
            });
        this.resizeBehavior = factory.make(behavior);
        if (this.html) {
            this.resize.init(this);
        }
        return this;
};
/**
 * Add a lane and refactor all lane positions and dimensions
 * @param {BPMNLane} newLane
 * @returns {PMPool}
 */
PMParallel.prototype.addLane = function (newLane) {
        this.bpmnLanes.insert(newLane);
        newLane.setRelPosition(this.bpmnLanes.getSize());
        newLane.setParentPool(this.getID());
    return this;
};

/**
 * remove a lane and refactor all lane positions and dimensions
 * @param {BPMNLane} lane
 * @chainable
 */
PMParallel.prototype.removeLane = function (lane) {
    this.bpmnLanes.remove(lane);
    //console.log('remove');

    return this;
};

/**
 * Get number of lanes into a pool
 * @return {Number}
 */
PMParallel.prototype.getAllChildLanesNum = function (num){
    var i, lane, childPool;
    for (i = 0; i < this.bpmnLanes.getSize(); i += 1) {
        lane = this.bpmnLanes.get(i);
        childPool = this.canvas.customShapes.find('id', lane.getChildPool());
        if (childPool) {
            num += childPool.getAllChildLanesNum (0);
        } else {
            num +=  1;
        }
    }
    return num;
};

/**
 * Destroy a pool and update lane parentLane property if is a child pool
 * @chainable
 */
//PMParallel.prototype.destroy = function () {
//    var parentLane = this.canvas.customShapes.find('id', this.getParentLane());
//    if (parentLane) {
//        this.parent.labels.get(0).setVisible(true);
//        parentLane.childPool = null;
//            
//    }
//    //this.saveAndDestroy();
//    return this;
//};

/**
 * Comparison function for ordering layers according to priority
 * @param {BPMNLane} lane1
 * @param {BPMNLane} lane2
 * @returns {boolean}
 */
PMParallel.prototype.comparisonFunction = function (lane1, lane2) {
    return lane1.relPosition > lane2.relPosition;
};

/**
 * Updates all bpmn child lanes when resize event has been finished
 */
PMParallel.prototype.updateBpmnOnResize = function() {
    var lane,
        i;
    this.updateBpmn();
    for (i = 0; i < this.bpmnLanes.getSize(); i += 1) {
        lane = this.bpmnLanes.get(i);
        lane.updateBpmn();
    }
};
//
//PMParallel.prototype.setMinimunsResize = function (top) {
//    var $shape = $(this.getHTML()),
//        lane,
//        i,
//        j,
//        shape,
//        limits,
//        margin = 15,
//        laneChildrens = new PMUI.util.ArrayList(),
//        minH,
//        hdiff,
//        laneHeightMin = 0,
//        minW = 200;
//    if (!this.hasMinimun) {
//        if (top) {
//            lane = this.bpmnLanes.getFirst();
//                minH = this.getHeight() - lane.getHeight() + (30 * this.canvas.getZoomFactor());
//            for (i = this.bpmnLanes.getSize() - 1; i >= 0; i -= 1) {
//                lane = this.bpmnLanes.get(i);
//                for (j = 0; j < lane.getChildren().getSize(); j += 1) {
//                    shape = lane.getChildren().get(j);
//                    laneChildrens.insert(
//                        {
//                            x       : shape.x,
//                            y       : shape.y + laneHeightMin,
//                            //y       : shape.y + this.getHeight() - this.bpmnLanes.getFirst().getHeight(),
//                            width   : shape.width,
//                            height  : shape.height
//                        }
//                    );
//                }
//                laneHeightMin += lane.height;
//            }
//
//
//        } else {
//            lane = this.bpmnLanes.getLast();
//                minH = lane.getY() + (30 * this.canvas.getZoomFactor());
//            for (i = 0; i < this.bpmnLanes.getSize(); i += 1) {
//                lane = this.bpmnLanes.get(i);
//                for (j = 0; j < lane.getChildren().getSize(); j += 1) {
//                    shape = lane.getChildren().get(j);
//                    laneChildrens.insert(
//                        {
//                            x       : shape.x,
//                            y       : shape.y + laneHeightMin,
//                            width   : shape.width,
//                            height  : shape.height
//                        }
//                    );
//                }
//                laneHeightMin += lane.height;
//            }
//        }
//
//
//        if (laneChildrens.getSize() > 0) {
//            laneChildrens.insert(
//                {
//                    x       : 0,
//                    y       : 0,
//                    width   : 0,
//                    height  : minH
//                }
//            );
//            limits = laneChildrens.getDimensionLimit();
//            minW = (limits[1] + margin + this.headLineCoord) * this.canvas.getZoomFactor();
//            minH = (limits[2] + margin) * this.canvas.getZoomFactor();
//
//
//        }
//        $shape.resizable('option', 'minWidth', minW);
//        $shape.resizable('option', 'minHeight', minH);
//        this.hasMinimun = true;
//    }
//};

/**
 * Updates all child lanes  connections when resize event has been finished
 */
PMParallel.prototype.updateConnectionsChildrens = function() {
    var i,
        j,
        shapeLane,
        shape = this;
    for (i = 0; i < shape.children.asArray().length; i++){
        if(shape.children.asArray()[i].type == "PMLane"){
            shapeLane = shape.children.asArray()[i];
            for (j = 0; j < shapeLane.children.asArray().length; j++){
                shapeLane.children.asArray()[i].refreshConnections(false, true);    
            }
        }else{
            shape.children.asArray()[i].refreshConnections(false, true);                
        }            
    }
};
///**
// * Updates dimesions and positions to pool lane childs
// */
//PMParallel.prototype.updateAllLaneDimension = function() {
//    var newWidth = this.getWidth() - this.headLineCoord,
//        lane,
//        newY = 0,
//        i,
//        parentHeight = 0,
//        laneOldY,
//        delta;
//    for (i = 0; i < this.bpmnLanes.getSize(); i += 1) {
//        lane = this.bpmnLanes.get(i)
//        laneOldY = lane.y;
//        lane.setDimension(lane.getWidth(), lane.getHeight());
//        lane.setRelPosition(i+1);
//        if (i > 0) {
//            newY += this.bpmnLanes.get(i-1).getHeight();
//            lane.setPosition(lane.getX(), newY);
//            lane.style.addProperties({
//                'border-top':'2px solid #3b4753'
//            });
//        } else {
//            lane.style.removeProperties(['border-top', 'border-left']);
//
//        }
//        parentHeight += lane.getHeight();
//        lane.paint();
//        lane.updateBounds(lane.businessObject.di);
//        //updating connections into a lane
//        lane.canvas.refreshArray.clear();
//        delta = {
//            dx: 0,
//            dy: lane.y - laneOldY
//        };
//        lane.fixConnectionsOnResize(lane.resizing, true);
//        lane.laneRefreshConnections(delta);
//    }
//    this.setDimension(this.getWidth(), parentHeight);
//    this.paint();
//    this.updateBounds(this.participantObject.di);
//};

/**
 * to multiple pool support
 * @returns {*}
 */
PMParallel.prototype.getMasterPool = function () {
    if (this.parent.family !== 'Canvas') {
        return this.parent.parent.getMasterPool();
    } else {
        return this;
    }

};


/**
 * Change pool Size to Identical or herarchical
 * @param {Boolean} orientation
 * @returns {PMPool}
 * @chainable
 */
//PMPool.prototype.changeIdenticalSize = function (size) {
//    var command = new BPMNCommandUpdateSize(this, {
//        before:  this.getIdenticalSize(),
//        after: size
//    });
//    command.execute();
//    this.getCanvas().commandStack.add(command);
//    return this;
//};
//SETTERS
/**
 * Set pool name
 * @param {String} name
 * @returns {PMPool}
 */
PMParallel.prototype.setName = function (name) {
    if (typeof name !== 'undefined') {
        this.lns_name = name;
        if (this.label) {
            this.label.setMessage(name);
            //this.getConXml().setAttribute("name",name);
        }
    }
    return this;
};
/**
 * Set pool type
 * @param {String} name
 * @returns {PMPool}
 */
PMParallel.prototype.setType = function (newType) {
    this.type = newType;
    return this;
};
/**
 * Set parUid attached to pool
 * @param {String} uid
 * @returns {PMPool}
 */
PMParallel.prototype.setParUid = function (uid) {
    this.parUid = uid;
    return this;
};
/**
 * Set pool type
 * @param {String} proType
 * @returns {PMPool}
 */
PMParallel.prototype.setProType = function (proType) {
    this.proType = proType;
    return this;
};
/**
 * Set executable mode to pool
 * @param {Boolean} executable
 * @returns {PMPool}
 */
PMParallel.prototype.setExecutable = function (executable) {
    this.executable = executable;
    return this;
};
/**
 * Set closed mode to pool
 * @param {Boolean} closed
 * @returns {PMPool}
 */
PMParallel.prototype.setClosed = function (closed) {
    this.closed = closed;
    return this;
};
/**
 * Set pool orientation
 * @param {String} orientation
 * @returns {PMPool}
 */
PMParallel.prototype.setOrientation = function (orientation) {
    this.orientation = orientation;
    return this;
};
/**
 * Set pool resizing mode
 * @param {String} orientation
 * @returns {PMPool}
 */
PMParallel.prototype.setResizing = function (resizing) {
    this.resizing = resizing;
    return this;
};
/**
 * Set parent Lane UID to pool
 * @param {String} parentLane
 * @returns {PMPool}
 */
//PMParallel.prototype.setParentLane = function (parentLane) {
//    this.parentLane = parentLane;
//    return this;
//};
/**
 * Set pool rel position
 * @param {Number} relPosition
 * @returns {PMPool}
 */
PMParallel.prototype.setRelPosition = function (relPosition) {
    this.relPosition = relPosition;
    return this;
};
/**
 * Set size identical mode if we want identical size of pool childs
 * @param {Number} relPosition
 * @returns {PMPool}
 */
PMParallel.prototype.setSizeIdentical = function (sizeIdentical) {
    this.sizeIdentical = sizeIdentical;
    return this;
};
/**
 * Set number of participants into a pool
 * @param {Number} num
 * @returns {PMPool}
 */
PMParallel.prototype.setParticipants = function (num) {
    this.participants = num;
    return this;
};

/**
 * Set identical Size to a pool
 * @param {Boolean} val
 * @returns {PMPool}
 */
PMParallel.prototype.setIdenticalSize = function (val) {
    this.identicalSize = val;
    return this;
};



//GETTERS
/**
 * Get the pool name
 * @returns {String}
 */
PMParallel.prototype.getName = function () {
    return this.lns_name;
};
/**
 * Get the pool type
 * @returns {String}
 */
PMParallel.prototype.getType = function () {
    return this.type;
};
/**
 * Get the process uid attached to pool
 * @returns {String}
 */
PMParallel.prototype.getParUid = function () {
    return this.parUid;
};
/**
 * Get the process uid attached to pool
 * @returns {String}
 */
PMParallel.getProcessType = function () {
    return this.proType;
};
/**
 * Get a boolean value if the pool is in executable mode
 * @returns {Boolean}
 */
PMParallel.isExecutable = function () {
    return this.executable;
};
/**
 * Get a boolean value if the pool is closed
 * @returns {Boolean}
 */
PMParallel.prototype.isClosed = function (){
    return this.closed;
};
/**
 * Get the pool orientation
 * @returns {Sring}
 */
PMParallel.prototype.getOrientation = function () {
    return this.orientation;
};
/**
 * Get the pool resizing mode
 * @returns {String}
 */
PMParallel.prototype.getResizing = function () {
    return this.resizing;
};
/**
 * Get the relative position of the pool
 * @returns {Number}
 */
PMParallel.prototype.getRelPosition = function () {
    return this.relPosition;
};
/**
 * Get a boolean value if pool have identical size
 * @returns {Boolean}
 */
PMParallel.prototype.isSizeIdentical = function () {
    return this.sizeIdentical;
};
///**
// * Get a parent lane
// * @returns {BPMNLane}
// */
//PMParallel.prototype.getParentLane = function () {
//    return this.parentLane;
//};
/**
 * Get a number of participants asociate to pool
 * @returns {Boolean}
 */
PMParallel.prototype.getParticipants = function () {
    return this.participants;   
};

/**
 * Get a identical size value
 * @returns {Boolean}
 */
PMParallel.prototype.getIdenticalSize = function () {
    return this.identicalSize;
};

PMParallel.prototype.dropBehaviorFactory = function (type, selectors) {
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
    } else if (type === 'pmparalleldrop') {
        if (!this.pmContainerDropBehavior) {
            this.pmContainerDropBehavior = new PMParallelDropBehavior(selectors);
        }
        return this.pmContainerDropBehavior;
    } else {
        return PMUI.draw.CustomShape.prototype.dropBehaviorFactory.call(this, type, selectors);
    }
};
//PMPool.prototype.updateDimension = function() {
//    alert('update dimensions');
//};
/**
 * Updates the dimensions and position of this shape (note: 'this' is a shape)
 * @param {Number} margin the margin for this element to consider towards the
 * shapes near its borders
 * @chainable
 */
PMParallel.prototype.updateDimensions = function (margin) {
    // update its size (if an child grew out of the shape)
    // only if it's not the canvas
    if (this.family !== 'Canvas') {
        this.updateSize(margin);
        this.refreshConnections();
        // updates JQueryUI's options (minWidth and minHeight)
        this.resizeBehavior.updateResizeMinimums(this);
        //PMUI.behavior.ResizeBehavior.prototype.updateResizeMinimums(this);
        this.updateDimensions.call(this.parent, margin);
    }
    return this;
};

PMParallel.prototype.stringify = function(){
    var inheritedJSON = PMShape.prototype.stringify.call(this),
        thisJSON = {
            name : this.getName(),
            parUid : this.getParUid(),
            proType : this.proType,
            executable : this.executable,
            closed: this.isClosed(),
            parentLane: this.parentLane,
            relPosition: this.getRelPosition(),
            sizeIdentical: this.isSizeIdentical(),
            participants: this.getParticipants(),
            orientation: this.getOrientation(),
//            parentLane: this.getParentLane()
            // TODO: CREATE PROPERTIES FOR THE BEHAVIORS
        };
    $.extend(true, inheritedJSON, thisJSON);
    return inheritedJSON;

};

/**
 * Creates bussines model to export to standard bpmn file
 * @param type xml tag to export bpmn file
 */
PMParallel.prototype.createBpmn = function(type) {
    var bpmnCollaboration;
    if ( this.parent.getType()==='PMCanvas' && !this.parent.businessObject.di) {
        this.canvas.createBPMNDiagram();
    }
    if (!(_.findWhere(PMDesigner.businessObject.get('rootElements'), {$type: "bpmn:Collaboration"}))) {
        bpmnCollaboration = PMDesigner.moddle.create('bpmn:Collaboration', {id: 'pmui-' + PMUI.generateUniqueId()});
        //PMDesigner.businessObject.collaboration =  bpmnCollaboration
        PMDesigner.businessObject.get('rootElements').push(bpmnCollaboration);
        this.parent.businessObject.di.bpmnElement = bpmnCollaboration;
        bpmnCollaboration.participants = [];
    } else {
        bpmnCollaboration = _.findWhere(PMDesigner.businessObject .get('rootElements'), {$type: "bpmn:Collaboration"});
    }

    this.createWithBpmn(type, 'participantObject');

    this.updateBounds(this.participantObject.di);
    //this.updateShapeParent();
    this.updateSemanticParent(this.participantObject, {elem: bpmnCollaboration});
    this.updateDiParent(this.participantObject.di, this.parent.businessObject.di);
};

PMParallel.prototype.updateSemanticParent = function(businessObject, newParent) {

    if (businessObject.elem.$parent === newParent.elem) {
        return;
    }

    var children;

    if (businessObject.elem.$parent) {
        // remove from old parent
        children = businessObject.elem.$parent.get('participants');
        CollectionRemove(children, businessObject.elem);
    }

    if (!newParent.elem) {
        businessObject.elem.$parent = null;
    } else {
        // add to new parent
        children = newParent.elem.get('participants');
        children.push(businessObject.elem);
        businessObject.elem.$parent = newParent.elem;
    }
};

PMParallel.prototype.updateDiParent = function(di, parentDi) {
    PMShape.prototype.updateDiParent.call(this, di, parentDi);
};

/**
 * create busines object to moodle bpmn export
 */
PMParallel.prototype.createBusinesObject = function() {
    //init vars to append
    var participant = _.findWhere(this.participantObject.elem.$parent.get('participants'),
            {id: this.participantObject.elem.id}),
        bpmnProcess =  PMDesigner.moddle.create('bpmn:Process',
            { id:  'pmui-' + PMUI.generateUniqueId() });

    PMDesigner.businessObject.get('rootElements').push(bpmnProcess);
    this.businessObject.elem = bpmnProcess;
    this.businessObject.di = this.canvas.businessObject.di;
    participant.processRef = bpmnProcess;
};

//remove bpmn section
PMParallel.prototype.removeBpmn = function() {
    var coll, children, pros;

    if ((_.findWhere(PMDesigner.businessObject .get('rootElements'), {$type: "bpmn:Collaboration"}))) {
        coll = _.findWhere(PMDesigner.businessObject.get('rootElements'), {$type: "bpmn:Collaboration"});
        if (coll.participants.length === 1){
            children = PMDesigner.businessObject.get('rootElements');
            CollectionRemove(children, coll);
            //PMDesigner.businessObject.get
            if (this.parent.businessObject.di){
                this.parent.businessObject.di.bpmnElement = this.parent.businessObject;

            }

        }
    }
    if (this.businessObject.elem && (_.findWhere(PMDesigner.businessObject .get('rootElements'), {$type: "bpmn:Process", id: this.businessObject.elem.id})) ) {
        pros = _.findWhere(PMDesigner.businessObject .get('rootElements'), {$type: "bpmn:Process", id: this.businessObject.elem.id});
        children = PMDesigner.businessObject.get('rootElements');
        CollectionRemove(children, pros);
        this.businessObject.elem = null;

    }
    this.updateSemanticParent(this.participantObject, {elem: null});
    this.updateDiParent(this.participantObject.di);
    if (this.businessObject.di
        && this.businessObject.di.planeElement.length == 0) {
        this.parent.removeBPMNDiagram();
    }
};


PMParallel.prototype.updateBpmn = function() {
    this.updateBounds(this.participantObject.di);
};

/*在并发体中增加开始和结束节点*/
PMParallel.prototype.addStartAndEnd = function(id,x,y) {
	 var customShape = null,
     canvas = this.getCanvas(),
     command,
     coordinates,
     shapesAdded = [], 
     containerBehavior = this.containerBehavior;
	 if (canvas.readOnly) {
	     return false;
	 }
	 this.entered = false;
	 customShape = canvas.shapeFactory(id);//获取一个并发开始/结束类型的shape
 
	 var result = this.addElement(customShape, x, y,
			 customShape.topLeftOnCreation);
	 if(this.containerBehavior.addElementLane !== true){
         //since it is a new element in the designer, we triggered the
             //custom on create element event
             canvas.hideAllCoronas();
             canvas.updatedElement = customShape;
             if (customShape.getType() === 'PMLane') {//不可能走这里
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
};
PMParallel.prototype.refreshChildrenPosition=function() {
	var shape=this;
	var parallelChildrens=shape.children;
	if(shape.getOrientation().toLowerCase()==="horizontal"){
		for(var i=0;i<parallelChildrens.getSize();i++){
	    	var children=parallelChildrens.get(i);
	    	if(children.extendedType ==="PARALLEL"){
	    		children.setPosition(0,shape.getHeight()/2-children.getHeight()/2);
	    	}else if(children.extendedType ==="INCLUSIVE"){
	    		children.setPosition(shape.getWidth()-25,shape.getHeight()/2-children.getHeight()/2);
	    	}
	    }
	}else if(shape.getOrientation().toLowerCase()==="vertical"){
		for(var i=0;i<parallelChildrens.getSize();i++){
		    var children=parallelChildrens.get(i);
		    if(children.extendedType=='PARALLEL'){
		    	children.setPosition(shape.getWidth()/2-children.getWidth()/2,0);
		    }else if(children.extendedType ==="INCLUSIVE"){
		    	children.setPosition(shape.getWidth()/2-children.getWidth()/2,shape.getHeight()-children.getHeight());
		    }
		}	
	}
    
    return this;
};
PMParallel.prototype.setParallelStartAndEndPosition=function(){
	var shape=this;
	var parallelChildrens=shape.children;
    for(var i=0;i<parallelChildrens.getSize();i++){
    	var children=parallelChildrens.get(i);	
    	if(children.extendedType ==="PARALLEL"||children.extendedType ==="INCLUSIVE"){
    		children.old_x=children.x;
    		children.old_y=children.y;
    	}
    }
};

PMParallel.prototype.refreshAllParallelConnections = function (inContainer, delta, rootType) {
  var i,
      connection,
      max;
  var count=this.canvas.refreshArray.getSize();
  for (i = 0, max = this.canvas.refreshArray.getSize(); i < max; i += 1) {
      connection = this.canvas.refreshArray.get(i);
      connection.reconnectManhattah(false);
      connection.setSegmentMoveHandlers();
      connection.checkAndCreateIntersectionsWithAll();
      connection.canvas.triggerUserStateChangeEvent(connection);
  }
  return this;
};

PMParallel.prototype.refreshParallelStartAndEndConnections = function (inContainer, rootType) {
    var i,
        connection,
        max;
    var count=this.canvas.refreshArray.getSize();
    for (i = 0, max = this.canvas.refreshArray.getSize(); i < max; i += 1) {
        connection = this.canvas.refreshArray.get(i);
        if(connection.getSrcPort().parent.extendedType ==="PARALLEL" || connection.getDestPort().parent.extendedType ==="INCLUSIVE"){
            connection.reconnectManhattah(false);
            connection.setSegmentMoveHandlers();
            connection.checkAndCreateIntersectionsWithAll();
            connection.canvas.triggerUserStateChangeEvent(connection);
        }
    }
        return this;
};

PMParallel.prototype.refreshResizeCanvas=function(){
	var container=this.parent;
	if(container.getType() && container.getType()==="PMCanvas"){
     	var newWidth = this.x + this.width + 100;
     	var newHeight = this.y + this.height +100;
     	if(newWidth>container.getWidth())
     		container.setWidth(newWidth);
     	if(newHeight>container.getHeight())
     		container.setHeight(newHeight);
    }
}
PMParallel.prototype.changeDirection=function(direction){
	if(this.getOrientation().toLowerCase()===direction.toLowerCase())
		return;
	var parallelChildrens=this.children,
		parallelChildrensSize=parallelChildrens.getSize();
	if(parallelChildrensSize > 2)
		return;
	
	var shapeWidth=this.getWidth(),
		shapeHeight=this.getHeight(),
		shapeX=this.getX(),
		shapeY=this.getY();
	this.setOrientation(direction);
	this.setDimension(shapeHeight,shapeWidth);
	if(direction.toLowerCase()==="horizontal"){
		 for(var i=0;i<parallelChildrensSize;i++){
		    	var children=parallelChildrens.get(i);
		    	if(children.extendedType=='PARALLEL'){
		    		children.setPosition(0,shapeWidth/2-children.getHeight()/2);
		    	}else{
		    		children.setPosition(shapeHeight-children.getHeight(),shapeWidth/2-children.getHeight()/2);
		    	}
		    }
		this.setPosition(this.getX(),this.getY()+(shapeHeight-shapeWidth)/2);
//		this.addStartAndEnd("PARALLEL",0,shapeWidth/2-23/2);//5,125
//    	this.addStartAndEnd("INCLUSIVE",shapeHeight-23,shapeWidth/2-23/2);
	}else if(direction.toLowerCase()==="vertical"){
		for(var i=0;i<parallelChildrensSize;i++){
	    	var children=parallelChildrens.get(i);
	    	if(children.extendedType=='PARALLEL'){
	    		children.setPosition(shapeHeight/2-children.getWidth()/2,0);
	    	}else{
	    		children.setPosition(shapeHeight/2-children.getWidth()/2,shapeWidth-children.getHeight());
	    	}
	    }
		this.setPosition(this.getX()+(shapeWidth-shapeHeight)/2+1,this.getY());
//		this.addStartAndEnd("PARALLEL",shapeHeight/2-23/2,0);//5,125
//    	this.addStartAndEnd("INCLUSIVE",shapeHeight/2-23/2,shapeWidth-23);//560,125 //300-31
	}
	this.setOrientation(direction);
	this.setDimension(shapeHeight,shapeWidth);
	this.paint();
	this.parallelChildConnectionOnResize(true,true);
	this.refreshResizeCanvas();
}