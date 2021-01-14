/**
 * 定义流程其他模型
 */
/**
 * @class PMArtifact
 * Handle BPMN Annotations
 *
 *
 * @constructor
 * Creates a new instance of the class
 * @param {Object} options
 */
var PMLabel = function (options) {
    PMShape.call(this, options);
    /**
     * Defines the type artifact
     * @type {String}
     */
    this.art_type = null;
    /**
     * Defines the unique identifier
     * @type {String}
     */
    this.art_uid = null;

    PMArtifact.prototype.initObject.call(this, options);
};
PMLabel.prototype = new PMShape();

/**
 * Defines the object type
 * @type {String}
 */
PMLabel.prototype.type = "PMArtifact";
PMLabel.prototype.PMArtifactResizeBehavior = null;

/**
 * Initialize the object with the default values
 * @param {Object} options
 */
PMArtifact.prototype.initObject = function (options) {
    var defaults = {
        art_type: 'PMArtifact',
        art_name: "",
        art_xml: ""
    };
    
    jQuery.extend(true, defaults, options);
    this.setArtifactUid(defaults.art_uid);
    this.setArtifactType(defaults.art_type);
    this.setName(defaults.art_name);
    this.setArtifactXml(defaults.art_xml);
    
};

/**
 * Sets the artifact type property
 * @param {String} type
 * @return {*}
 */
PMLabel.prototype.setArtifactType = function (type) {
    this.art_type = type;
    return this;
};
/**
 * Sets the artifact unique identifier
 * @param {String} value
 * @return {*}
 */
PMLabel.prototype.setArtifactUid = function (value) {
    this.art_uid = value;
    return this;
};
/**
 * Returns the clean object to be sent to the backend
 * @return {Object}
 */
PMLabel.prototype.getDataObject = function () {
    var name = this.getName();
    return {
        art_uid: this.id,
        art_name: name,
        art_type: this.art_type,
        bou_x: this.x,
        bou_y: this.y,
        bou_width: this.width,
        bou_height: this.height,
        bou_container: 'bpmnDiagram',
        _extended: this.getExtendedObject()
    };
};

PMLabel.prototype.getArtifactType = function () {
    return this.art_type;
};
PMLabel.prototype.createLayer = function (options) {

    var layer;
    options.parent = this;
    layer = new CustomLayer(options);
    this.addLayer(layer);
    return layer;
};
PMArtifact.prototype.updateHTML = function () {
    var height,width;
    height = this.height;
    width = this.width;
    PMShape.prototype.updateHTML.call(this); 
    this.setDimension(width,height);       
    return  this;
};
/*global jCore, $ */
/**
 * @class AdamMarker
 * Handle Activity Markers
 *
 * @constructor
 * Creates a new instance of the class
 * @param {Object} options
 */
var PMMarker = function (options) {
    //jCore.Shape.call(this, options);
    PMUI.draw.Shape.call(this, options);
    /**
     * Defines the positions of the markers
     * @type {Array}
     * @private
     */
    this.positions = ['left+2 top+2', 'center top+5', 'right top',
        'left+5 bottom-1', 'center bottom-2', 'right-5 bottom-1'];
    /**
     * Defines the offset of the markers
     * @type {Array}
     * @private
     */
    this.offset =  ['5 5', '0 5', '0 5', '5 -1', '0 -1', '-5 -1'];
    /**
     * Define the marker type property
     * @type {null}
     */
    this.markerType = null;
    PMMarker.prototype.initObject.call(this, options);
};
PMMarker.prototype = new PMUI.draw.Shape();
/**
 * Defines the object type
 * @type {String}
 */
PMMarker.prototype.type = 'PMMarker';

/**
 * Initialize the object with the default values
 * @param {Object} options
 */
PMMarker.prototype.initObject = function (options) {
    var defaults = {
        canvas: null,
        parent: null,
        position: 0,
        width: 21,
        height: 21,
        markerZoomClasses: [],
        markerType: null
    };
    $.extend(true, defaults, options);
    this.setParent(defaults.parent)
        .setPosition(defaults.position)
        .setHeight(defaults.height)
        .setWidth(defaults.width)
        .setMarkerZoomClasses(defaults.markerZoomClasses)
        .setMarkerType(defaults.markerType);
};

/**
 * Applies zoom to the Marker
 * @return {*}
 */
PMMarker.prototype.applyZoom = function () {
    var newSprite;
    this.removeAllClasses();
    this.setProperties();
    newSprite = this.markerZoomClasses[this.parent.canvas.zoomPropertiesIndex];
    this.html.className = newSprite;
    this.currentZoomClass = newSprite;
    return this;
};

/**
 * Create the HTML for the marker
 * @return {*}
 */
PMMarker.prototype.createHTML = function () {
    PMUI.draw.Shape.prototype.createHTML.call(this);

    this.html.id = this.id;
    this.setProperties();
    this.html.className = this.markerZoomClasses[
        this.parent.canvas.getZoomPropertiesIndex()
    ];
    this.currentZoomClass = this.html.className;
    this.parent.html.appendChild(this.html);
    return this.html;
};

/**
 * Updates the painting of the marker
 * @param update
 */
PMMarker.prototype.paint = function (update) {

    if (this.getHTML() === null || update) {
        this.createHTML();
    }
    $(this.html).empty("img");
    if(theme === 'tradition'){
    	var src=contextPath+"/workflow/processDesigner/nodeIconModify/image/"+ this.parent.getActIcon();
        switch(this.markerType){
        	case 'USERTASK':
        		$(this.html).append('<img style="width:100%; height:100%;" src="'+ src +'">');
        	break;
        	case 'AUTOTASK':
        		$(this.html).append('<img style="width:100%; height:100%;" src="'+ src +'">');
        	break;
        	case 'COLLAPSED':
        		$(this.html).append('<img style="width:100%; height:100%;" src="'+ src +'">');
        	break;
        }
    }

    $(this.html).position({
        of: $(this.parent.html),
        my: this.positions[this.position],
        at: this.positions[this.position],
        //offset: this.offset[this.position],
        collision: 'none'
    });
};

/**
 * Sets the marker type property
 * @param {String} newType
 * @return {*}
 */
PMMarker.prototype.setMarkerType = function (newType) {
    this.markerType = newType;
    return this;
};

/**
 * Sets the position of the marker
 * @param {Number} newPosition
 * @return {*}
 */
PMMarker.prototype.setPosition = function (newPosition) {
    if (newPosition !== null && typeof newPosition === 'number') {
        this.position = newPosition;
    }
    return this;
};

/**
 * Sets the parent of the marker
 * @param {AdamActivity} newParent
 * @return {*}
 */
PMMarker.prototype.setParent = function (newParent) {
    this.parent = newParent;
    return this;
};

/**
 * Sets the elements class
 * @param eClass
 * @return {*}
 */
PMMarker.prototype.setEClass = function (eClass) {
    this.currentZoomClass = eClass;
    return this;
};

/**
 * Sets the array of zoom classes
 * @param {Object} classes
 * @return {*}
 */
PMMarker.prototype.setMarkerZoomClasses = function (classes) {
    this.markerZoomClasses = classes;
    return this;
};

/**
 * Sets the marker HTML properties
 * @return {*}
 */
PMMarker.prototype.setProperties = function () {
    this.html.style.width = this.width * this.parent.getCanvas().getZoomFactor() + 'px';
    this.html.style.height = this.height * this.parent.getCanvas().getZoomFactor() + 'px';
    return this;
};

/**
 * Remove all classes of HTML
 * @return {*}
 */
PMMarker.prototype.removeAllClasses = function () {
    this.html.className = '';
    return this;
};

/*global jCore*/
var PMActivityResizeBehavior = function () {
};

PMActivityResizeBehavior.prototype = new PMUI.behavior.RegularResizeBehavior();
PMActivityResizeBehavior.prototype.type = "PMActivityResizeBehavior";


/**
 * Sets a shape's container to a given container
 * @param container
 * @param shape
 */
PMActivityResizeBehavior.prototype.onResizeStart = function (shape) {
    return PMUI.behavior.RegularResizeBehavior
        .prototype.onResizeStart.call(this, shape);
};
/**
 * Removes shape from its current container
 * @param shape
 */
PMActivityResizeBehavior.prototype.onResize = function (shape) {
    //RegularResizeBehavior.prototype.onResize.call(this, shape);
    return function (e, ui) {
        PMUI.behavior.RegularResizeBehavior
            .prototype.onResize.call(this, shape)(e, ui);
        //if (shape.graphics) {
            shape.paint();
        shape.updateBoundaryPositions(false);
        //}

    };

};

var PMPoolResizeBehavior = function () {
    this.oldHeight = null;
    this.isTop = false;
};

PMPoolResizeBehavior.prototype = new PMUI.behavior.RegularResizeBehavior();
PMPoolResizeBehavior.prototype.type = "PMPoolResizeBehavior";


PMPoolResizeBehavior.prototype.init = function (shape) {
    PMUI.behavior.RegularResizeBehavior
        .prototype.init.call(this, shape);
    $shape = $(shape.getHTML());
    $shape.resizable();
    $shape.resizable('option', 'minWidth', 200 * shape.canvas.getZoomFactor());
    $shape.resizable('option', 'minHeight', 30 * shape.canvas.getZoomFactor());
};

/**
 * Sets a shape's container to a given container
 * @param container
 * @param shape
 */
PMPoolResizeBehavior.prototype.onResizeStart = function (shape) {
    return function (e, ui) {
        PMUI.behavior.RegularResizeBehavior
            .prototype.onResizeStart.call(this, shape)(e, ui);
        //shape.hideAllChilds();
        shape.hasMinimun = false;
        if (shape.bpmnLanes.getSize() > 0) {
            this.lastLaneHeight = shape.bpmnLanes.getLast().getHeight();
            this.firstLaneHeight = shape.bpmnLanes.getFirst().getHeight();
        }

    };
};
/**
 * Removes shape from its current container
 * @param shape
 */
PMPoolResizeBehavior.prototype.onResize = function (shape) {
    //RegularResizeBehavior.prototype.onResize.call(this, shape);
    return function (e, ui) {
        var i,
            port,
            diffH,
            newWidth,
            lane,
            top = true,
            newY,
            canvas = shape.canvas;
        shape.setPosition(ui.position.left / canvas.zoomFactor,
            ui.position.top / canvas.zoomFactor);
        shape.setDimension(ui.size.width / canvas.zoomFactor,
            ui.size.height / canvas.zoomFactor);
        if (shape.graphic) {
            shape.paint();
        }
        //to resize last lane
        diffH = (ui.size.height / canvas.zoomFactor) - (ui.originalSize.height / canvas.zoomFactor);
        newWidth = shape.getWidth() - shape.headLineCoord - 1.2;

        if (shape.bpmnLanes.getSize() > 0) {
            if (ui.originalPosition.top === ui.position.top) {
                this.isTop = false;
                shape.setMinimunsResize();
                lane = shape.bpmnLanes.getLast();
                lane.setDimension(newWidth, this.lastLaneHeight + diffH);
                for (i = 0; i < shape.bpmnLanes.getSize() - 1; i += 1) {
                    lane = shape.bpmnLanes.get(i);
                    lane.setDimension(newWidth, lane.getHeight());
                }
            } else {
                this.isTop = true;
                shape.setMinimunsResize(true);

                lane = shape.bpmnLanes.getFirst();
                lane.setDimension(newWidth, this.firstLaneHeight + diffH);
                newY = this.firstLaneHeight + diffH;

                for (i = 1; i < shape.bpmnLanes.getSize(); i += 1) {
                    lane = shape.bpmnLanes.get(i);
                    lane.setPosition(lane.getX(), newY);
                    lane.setDimension(newWidth, lane.getHeight());
                    newY += lane.getHeight();
                }
            }

        }
    };
};
/**
 * Adds a shape to a given container
 * @param container
 * @param shape
 */
PMPoolResizeBehavior.prototype.onResizeEnd = function (shape) {
    return function (e, ui) {
        var i,
            j,
            size,
            connection,
            label,
            shapePorts,
            shapeLane,
            command,
            delta;
        shape.resizing = false;
        shape.canvas.isResizing = false;
        // last resize
        PMUI.behavior.RegularResizeBehavior.prototype.onResize.call(this, shape)(e, ui);
        // show the handlers again
        shape.showOrHideResizeHandlers(true);
        // update the dimensions of the parent if possible (a shape might
        // have been resized out of the dimensions of its parent)
        shape.updateBpmnOnResize();

        // TESTING COMMANDS
        // command = new CommandResize(shape);
        // shape.canvas.commandStack.add(command);
        // command.execute();
        for (i = 0, size = shape.labels.getSize(); i < size; i += 1) {
            label = shape.labels.get(i);
            label.setLabelPosition(label.location, label.diffX, label.diffY);
        }
        delta = {
            dx: shape.x - shape.oldX,
            dy: shape.y - shape.oldY
        };
        options = {
            isTop: this.isTop,
            beforeHeightsOpt: {
                lastLaneHeight: this.lastLaneHeight,
                firstLaneHeight: this.firstLaneHeight
            },
            delta: delta
        };
        var command = new PMCommandPoolResize(shape, options);
        //command.execute();
        shape.getCanvas().commandStack.add(command);
        shape.canvas.refreshArray.clear();
        shape.poolChildConnectionOnResize(true, true);
        shape.refreshAllPoolConnections(false, delta);
    };
};

/**
 * Updates the minimum height and maximum height of the JQqueryUI's resizable plugin.
 * @param {PMUI.draw.Shape} shape
 * @chainable
 */
PMPoolResizeBehavior.prototype.updateResizeMinimums = function (shape) {
    var minW,
        minH,
        children = shape.getChildren(),
        limits = children.getDimensionLimit(),
        margin = 15,
        $shape = $(shape.getHTML());
    if (children.getSize() > 0) {
        minW = (limits[1] + margin) * shape.canvas.getZoomFactor();
        minH = (limits[2] + margin) * shape.canvas.getZoomFactor();
    } else {
        minW = 300 * shape.canvas.getZoomFactor();
        minH = 30 * shape.canvas.getZoomFactor();
    }

    // update jQueryUI's minWidth and minHeight
    $shape.resizable();
    $shape.resizable('option', 'minWidth', minW);
    $shape.resizable('option', 'minHeight', minH);
    return this;
};
var PMPool = function (options) {
	
    PMShape.call(this, options);
    //LNS_NAME (String)
    /**
     *
     * @type {String}
     */
    this.name = '';
    /**
     *
     * @type {String}
     */
    //this.type= '';
    //PRO_UID (String)
    /**
     *
     * @type {String}
     */
    this.proUid = '';
    //PRO_TYPE (String)
    /**
     *
     * @type {String}
     */
    this.proType = '';
    //PRO_IS_EXECUTABLE
    /**
     *
     * @type {Boolean}
     */
    this.executable = false;
    //PRO_IS_CLOSED
    /**
     *
     * @type {Boolean}
     */
    this.closed = false;
    //LNS_IS_HORIZONTAL
    /**
     *
     * @type {String}
     */
    //this.orientation = 'HORIZONTAL';
    //LNS_PARENT_LANE (String)
    /**
     *
     * @type {String}
     */
    this.parentLane = null;
    //BOU_REL_POSITION (Int)
    /**
     *
     * @type {Number}
     */
    this.relPosition = 0;
    //BOU_SIZE_IDENTICAL
    /**
     *
     * @type {Boolean}
     */
    this.sizeIdentical = false;
    /**
     * 定义泳道的xml对象
     * */
    this.pol_xml=null;
    //PAR_NUM_PARTICIPANTS (Int)
    /**
     *
     * @type {Number}
     */
    this.participants = 0;
    this.graphic = null;
    this.headLineCoord = 40;
    this.orientation = 'HORIZONTAL';
    //this.resizing = 'HERARCHICAL';
    this.participantObject = null;
    this.hasMinimun = false;
    this.bpmnLanes = new PMUI.util.ArrayList();

    PMPool.prototype.initObject.call(this, options);
};
PMPool.prototype = new PMShape();
PMPool.prototype.type = 'PMPool';

PMPool.prototype.poolContainerBehavior = null;
PMPool.prototype.poolResizeBehavior = null;

PMPool.prototype.getDataObject = function () {
    var name = this.getName();
    return {
        lns_uid: this.getID(),
        lns_name: name,
        bou_x: this.x,
        bou_y: this.y,
        bou_width: this.width,
        bou_height: this.height,
        bou_container: 'bpmnDiagram',
        participant:this.participants,
        participantObject:this.participantObject,
        orientation:this.orientation,
        pol_xml:this.pol_xml,
        _extended: this.getExtendedObject()
    };
};

/**
 * Object init method (internal)
 * @param {Object} options
 */
PMPool.prototype.initObject = function (options) {

    var defaultOptions = {
        lns_name : 'Pool',
        proUid : '',
        proType : '',
        executable : false,
        closed: false,
        parentLane: '',
        relPosition: 0,
        sizeIdentical: false,
        participants: 0,
        orientation: 'HORIZONTAL',
        pol_xml:'',
        resizing: false,
        parentLane: null,
        identicalSize: false
    };
    $.extend(true, defaultOptions, options);

    this.setName(defaultOptions.lns_name)
        .setProUid(defaultOptions.proUid)
        .setProType(defaultOptions.proType)
        .setExecutable(defaultOptions.executable)
        .setClosed(defaultOptions.closed)
        .setParentLane(defaultOptions.parentLane)
        .setRelPosition(defaultOptions.relPosition)
        .setSizeIdentical(defaultOptions.sizeIdentical)
        .setOrientation(defaultOptions.orientation)
        //.setPolXml(defaultOptions.pol_xml)
        //.setResizing(defaultOptions.resizing)
        .setParentLane(defaultOptions.parentLane)
        .setIdenticalSize(defaultOptions.identicalSize);
    this.setPolXml(defaultOptions.pol_xml);
};
PMPool.prototype.setPolXml = function (xml) {
	if (xml !== 'undefined' && xml !== '') {
        this.pol_xml = xml;
    }else{
    	this.pol_xml = PMDesigner.strToXml('<lane id="'+this.getID()+'" name="'+this.getName()+'" x="0" y="0" width="" height="" isHorizontal="true" ></lane>').getElementsByTagName("lane")[0];
    }
};
/**
 * Creates the HTML representation of the layer
 * @returns {HTMLElement}
 */
PMPool.prototype.createHTML = function () {
	
    PMShape.prototype.createHTML.call(this);
    //this.style.addClasses(['bpmn_pool', 'bpmn_exclusive']);
    return this.html;
};

PMPool.prototype.decreaseZIndex = function () {
    this.fixZIndex(this, 3);
    return this;
};

PMPool.prototype.applyZoom = function () {
    PMShape.prototype.applyZoom.call(this);
    this.updateDimensions(10);
};

PMPool.prototype.onUpdateLabel = function () {
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
PMPool.prototype.paint = function() {
    var zoomFactor = this.canvas.zoomFactor,
        label = this.getLabels().get(0);
    if (typeof this.graphic === 'undefined' || this.graphic === null) {
        this.graphic = new JSGraphics(this.id);
    } else {
        this.graphic.clear();
    }
    this.graphic.setColor('#3b4753'); //change color
    this.graphic.setStroke(2);
    if (this.orientation === 'VERTICAL') {
        this.graphic.drawLine(0, this.headLineCoord * zoomFactor,
            this.zoomWidth, this.headLineCoord * zoomFactor);
        label.setOrientation('horizontal');
        label.setLabelPosition('top');
    } else {
        this.graphic.drawLine(this.headLineCoord * zoomFactor, 0,
            this.headLineCoord * zoomFactor, this.zoomHeight - 5);
        //label.setOrientation('vertical');
        //label.setLabelPosition('center-left', 20, 0);

    }
    this.onUpdateLabel();
    this.graphic.paint();
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
PMPool.prototype.containerBehaviorFactory = function (type) {
    if (type === 'pool'){
        if(!this.poolContainerBehavior) {
            this.poolContainerBehavior = new PoolContainerBehavior();
        }
        return this.poolContainerBehavior;
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
PMPool.prototype.onMouseDown = function (shape) {
    if (shape.getParentLane()) {
        return function (e, ui) {
            e.stopPropagation();
        };
    } else {
        return PMShape.prototype.onMouseDown.call(this, shape);
    }
};

PMPool.prototype.setResizeBehavior = function (behavior) {
        var factory = new PMUI.behavior.BehaviorFactory({
                products: {
                    "regularresize": PMUI.behavior.RegularResizeBehavior,
                    "Resize": PMUI.behavior.RegularResizeBehavior,
                    "yes": PMUI.behavior.RegularResizeBehavior,
                    "resize": PMUI.behavior.RegularResizeBehavior,
                    "noresize": PMUI.behavior.NoResizeBehavior,
                    "NoResize": PMUI.behavior.NoResizeBehavior,
                    "no": PMUI.behavior.NoResizeBehavior,
                    "poolResize": PMPoolResizeBehavior
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
PMPool.prototype.addLane = function (newLane) {
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
PMPool.prototype.removeLane = function (lane) {
    this.bpmnLanes.remove(lane);
    //console.log('remove');

    return this;
};

/**
 * Get number of lanes into a pool
 * @return {Number}
 */
PMPool.prototype.getAllChildLanesNum = function (num){
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
PMPool.prototype.destroy = function () {
    var parentLane = this.canvas.customShapes.find('id', this.getParentLane());
    if (parentLane) {
        this.parent.labels.get(0).setVisible(true);
        parentLane.childPool = null;
            
    }
    //this.saveAndDestroy();
    return this;
};

/**
 * Comparison function for ordering layers according to priority
 * @param {BPMNLane} lane1
 * @param {BPMNLane} lane2
 * @returns {boolean}
 */
PMPool.prototype.comparisonFunction = function (lane1, lane2) {
    return lane1.relPosition > lane2.relPosition;
};

/**
 * Refactor recursively all lane position an dimensions
 * because lanes has a particular behavior
 * @chainable
 */
PMPool.prototype.setLanePositionAndDimension= function (lane) {
    var numLanes,
        oldX,
        oldY,
        newx,
        newy,
        oldWidth,
        oldHeight,
        newWidth,
        newHeight,
        oldRelPosition,
        lane,
        i,
        label,
        numLanes2,
        newHeight2,
        newWidth2,
        childPool;

    numLanes = this.bpmnLanes.getSize();
    newx = (this.orientation === 'HORIZONTAL') ? this.headLineCoord : -1;
    newy = (this.orientation === 'HORIZONTAL') ? 0 : this.headLineCoord;
    //new lane width to update
    newWidth = (this.orientation === 'HORIZONTAL') ?
        this.getWidth() - this.headLineCoord - 1  : this.getWidth() / numLanes;
    //new lane height to update
    newHeight = (this.orientation === 'HORIZONTAL') ?
        (this.getHeight() -1) / numLanes: this.getHeight() - this.headLineCoord;

    // FOR IDENTICAL OPTION
    numLanes2 = this.getAllChildLanesNum(0);
    newWidth2 = (this.orientation === 'HORIZONTAL') ?
        this.getWidth() - this.headLineCoord-1 : this.getWidth() / numLanes2;
    newHeight2 = (this.orientation === 'HORIZONTAL') ?
        this.getHeight()/numLanes2: this.getHeight() - this.headLineCoord;

    if (numLanes > 1) {
        lane.style.addProperties({
                    'border-top':'2px solid #3b4753'
        });
        lane.setDimension(newWidth , lane.getHeight());
        lane.setPosition(newx, newy + this.getHeight());
        lane.setRelPosition(numLanes);
        this.setDimension(this.getWidth(), this.getHeight() + lane.getHeight());
        this.label.updateDimension(false);
        this.paint();

        
    } else {
        lane.style.removeProperties(['border-top', 'border-left']);
        lane.setDimension(newWidth, this.getHeight());
        lane.setPosition(newx, newy);
        lane.setRelPosition(numLanes);
    }
    lane.label.updateDimension(false);
    this.label.updateDimension(false);
    lane.paint();
	if(!isIE8()){
		lane.updateBounds(lane.businessObject.di);
	    this.updateBounds(this.participantObject.di);
	}
    return this;
};

/**
 * Updates all child lanes when a lane has been removed
 * @param lane
 * @returns {PMPool}
 */
PMPool.prototype.updateOnRemoveLane= function (lane) {
    var i, diffH=0, nextLane, tempLane = lane, tempX = lane.getX(), tempY = lane.getY(),newY = 0;
    for (i = lane.getRelPosition()-1; i < this.bpmnLanes.getSize(); i += 1) {
        nextLane = this.bpmnLanes.get(i);
        //diffH += nextLane.getHeight();
        if (i === 0) {
             nextLane.style.removeProperties(['border-top', 'border-left']);
        }
//        oldX = nextLane.getX();
//        oldY = nextLane.getY();
        if (i > 0) {
            newY += this.bpmnLanes.get(i-1).getHeight();
        }
        nextLane.setPosition(lane.getX(), newY);
        nextLane.setRelPosition(nextLane.getRelPosition()-1);
        nextLane.paint();       
    }
    if (this.bpmnLanes.getSize() > 0) {
        this.setDimension(this.getWidth(), this.getHeight() - lane.getHeight());
        this.paint();
    }
    
    return this;
};
/**
 * Updates all bpmn child lanes when resize event has been finished
 */
PMPool.prototype.updateBpmnOnResize = function() {
    var lane,
        i;
    this.updateBpmn();
    for (i = 0; i < this.bpmnLanes.getSize(); i += 1) {
        lane = this.bpmnLanes.get(i);
        lane.updateBpmn();
    }
};

PMPool.prototype.setMinimunsResize = function (top) {
    var $shape = $(this.getHTML()),
        lane,
        i,
        j,
        shape,
        limits,
        margin = 15,
        laneChildrens = new PMUI.util.ArrayList(),
        minH,
        hdiff,
        laneHeightMin = 0,
        minW = 200;
    if (!this.hasMinimun) {
        if (top) {
            lane = this.bpmnLanes.getFirst();
                minH = this.getHeight() - lane.getHeight() + (30 * this.canvas.getZoomFactor());
            for (i = this.bpmnLanes.getSize() - 1; i >= 0; i -= 1) {
                lane = this.bpmnLanes.get(i);
                for (j = 0; j < lane.getChildren().getSize(); j += 1) {
                    shape = lane.getChildren().get(j);
                    laneChildrens.insert(
                        {
                            x       : shape.x,
                            y       : shape.y + laneHeightMin,
                            //y       : shape.y + this.getHeight() - this.bpmnLanes.getFirst().getHeight(),
                            width   : shape.width,
                            height  : shape.height
                        }
                    );
                }
                laneHeightMin += lane.height;
            }


        } else {
            lane = this.bpmnLanes.getLast();
                minH = lane.getY() + (30 * this.canvas.getZoomFactor());
            for (i = 0; i < this.bpmnLanes.getSize(); i += 1) {
                lane = this.bpmnLanes.get(i);
                for (j = 0; j < lane.getChildren().getSize(); j += 1) {
                    shape = lane.getChildren().get(j);
                    laneChildrens.insert(
                        {
                            x       : shape.x,
                            y       : shape.y + laneHeightMin,
                            width   : shape.width,
                            height  : shape.height
                        }
                    );
                }
                laneHeightMin += lane.height;
            }
        }


        if (laneChildrens.getSize() > 0) {
            laneChildrens.insert(
                {
                    x       : 0,
                    y       : 0,
                    width   : 0,
                    height  : minH
                }
            );
            limits = laneChildrens.getDimensionLimit();
            minW = (limits[1] + margin + this.headLineCoord) * this.canvas.getZoomFactor();
            minH = (limits[2] + margin) * this.canvas.getZoomFactor();


        }
        $shape.resizable('option', 'minWidth', minW);
        $shape.resizable('option', 'minHeight', minH);
        this.hasMinimun = true;
    }
};

/**
 * Updates all child lanes  connections when resize event has been finished
 */
PMPool.prototype.updateConnectionsChildrens = function() {
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
/**
 * Updates dimesions and positions to pool lane childs
 */
PMPool.prototype.updateAllLaneDimension = function() {
    var newWidth = this.getWidth() - this.headLineCoord,
        lane,
        newY = 0,
        i,
        parentHeight = 0,
        laneOldY,
        delta;
    for (i = 0; i < this.bpmnLanes.getSize(); i += 1) {
        lane = this.bpmnLanes.get(i)
        laneOldY = lane.y;
        lane.setDimension(lane.getWidth(), lane.getHeight());
        lane.setRelPosition(i+1);
        if (i > 0) {
            newY += this.bpmnLanes.get(i-1).getHeight();
            lane.setPosition(lane.getX(), newY);
            lane.style.addProperties({
                'border-top':'2px solid #3b4753'
            });
        } else {
            lane.style.removeProperties(['border-top', 'border-left']);

        }
        parentHeight += lane.getHeight();
        lane.paint();
        lane.updateBounds(lane.businessObject.di);
        //updating connections into a lane
        lane.canvas.refreshArray.clear();
        delta = {
            dx: 0,
            dy: lane.y - laneOldY
        };
        lane.fixConnectionsOnResize(lane.resizing, true);
        lane.laneRefreshConnections(delta);
    }
    this.setDimension(this.getWidth(), parentHeight);
    this.paint();
    this.updateBounds(this.participantObject.di);
};

/**
 * to multiple pool support
 * @returns {*}
 */
PMPool.prototype.getMasterPool = function () {
    if (this.parent.family !== 'Canvas') {
        return this.parent.parent.getMasterPool();
    } else {
        return this;
    }

};

/**
 * Change pool orientation dinamically
 * @param {String} orientation
 * @returns {PMPool}
 */
//PMPool.prototype.changeOrientation = function (orientation){
//    var command = new BPMNCommandUpdateOrientation(this, {
//        before:  this.getOrientation(),
//        after: orientation.toUpperCase()
//    });
//    command.execute();
//    this.getCanvas().commandStack.add(command);
//    return this;
//};

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
PMPool.prototype.setName = function (name) {
    if (typeof name !== 'undefined') {
        this.lns_name = name;
        if (this.label) {
            this.label.setMessage(name);
        }
    }
    return this;
};
/**
 * Set pool type
 * @param {String} name
 * @returns {PMPool}
 */
PMPool.prototype.setType = function (newType) {
    this.type = newType;
    return this;
};
/**
 * Set proUid attached to pool
 * @param {String} uid
 * @returns {PMPool}
 */
PMPool.prototype.setProUid = function (uid) {
    this.proUid = uid;
    return this;
};
/**
 * Set pool type
 * @param {String} proType
 * @returns {PMPool}
 */
PMPool.prototype.setProType = function (proType) {
    this.proType = proType;
    return this;
};
/**
 * Set executable mode to pool
 * @param {Boolean} executable
 * @returns {PMPool}
 */
PMPool.prototype.setExecutable = function (executable) {
    this.executable = executable;
    return this;
};
/**
 * Set closed mode to pool
 * @param {Boolean} closed
 * @returns {PMPool}
 */
PMPool.prototype.setClosed = function (closed) {
    this.closed = closed;
    return this;
};
/**
 * Set pool orientation
 * @param {String} orientation
 * @returns {PMPool}
 */
PMPool.prototype.setOrientation = function (orientation) {
    this.orientation = orientation;
    return this;
};
/**
 * Set pool resizing mode
 * @param {String} orientation
 * @returns {PMPool}
 */
PMPool.prototype.setResizing = function (resizing) {
    this.resizing = resizing;
    return this;
};
/**
 * Set parent Lane UID to pool
 * @param {String} parentLane
 * @returns {PMPool}
 */
PMPool.prototype.setParentLane = function (parentLane) {
    this.parentLane = parentLane;
    return this;
};
/**
 * Set pool rel position
 * @param {Number} relPosition
 * @returns {PMPool}
 */
PMPool.prototype.setRelPosition = function (relPosition) {
    this.relPosition = relPosition;
    return this;
};
/**
 * Set size identical mode if we want identical size of pool childs
 * @param {Number} relPosition
 * @returns {PMPool}
 */
PMPool.prototype.setSizeIdentical = function (sizeIdentical) {
    this.sizeIdentical = sizeIdentical;
    return this;
};
/**
 * Set number of participants into a pool
 * @param {Number} num
 * @returns {PMPool}
 */
PMPool.prototype.setParticipants = function (num) {
    this.participants = num;
    return this;
};

/**
 * Set identical Size to a pool
 * @param {Boolean} val
 * @returns {PMPool}
 */
PMPool.prototype.setIdenticalSize = function (val) {
    this.identicalSize = val;
    return this;
};



//GETTERS
/**
 * Get the pool name
 * @returns {String}
 */
PMPool.prototype.getName = function () {
    return this.lns_name;
};
/**
 * Get the pool type
 * @returns {String}
 */
PMPool.prototype.getType = function () {
    return this.type;
};
/**
 * Get the process uid attached to pool
 * @returns {String}
 */
PMPool.prototype.getProUid = function () {
    return this.proUid;
};
/**
 * Get the process uid attached to pool
 * @returns {String}
 */
PMPool.getProcessType = function () {
    return this.proType;
};
/**
 * Get a boolean value if the pool is in executable mode
 * @returns {Boolean}
 */
PMPool.isExecutable = function () {
    return this.executable;
};
/**
 * Get a boolean value if the pool is closed
 * @returns {Boolean}
 */
PMPool.prototype.isClosed = function (){
    return this.closed;
};
/**
 * Get the pool orientation
 * @returns {Sring}
 */
PMPool.prototype.getOrientation = function () {
    return this.orientation;
};
/**
 * Get the pool resizing mode
 * @returns {String}
 */
PMPool.prototype.getResizing = function () {
    return this.resizing;
};
/**
 * Get the relative position of the pool
 * @returns {Number}
 */
PMPool.prototype.getRelPosition = function () {
    return this.relPosition;
};
/**
 * Get a boolean value if pool have identical size
 * @returns {Boolean}
 */
PMPool.prototype.isSizeIdentical = function () {
    return this.sizeIdentical;
};
/**
 * Get a parent lane
 * @returns {BPMNLane}
 */
PMPool.prototype.getParentLane = function () {
    return this.parentLane;
};
/**
 * Get a number of participants asociate to pool
 * @returns {Boolean}
 */
PMPool.prototype.getParticipants = function () {
    return this.participants;   
};

/**
 * Get a identical size value
 * @returns {Boolean}
 */
PMPool.prototype.getIdenticalSize = function () {
    return this.identicalSize;
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
PMPool.prototype.updateDimensions = function (margin) {
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
/**
 * Updates the dimensions and position of this pool relative to lane childs (note: 'this' is a shape)
 * @chainable
 */
PMPool.prototype.updateDimensionsWithLanes = function (margin) {
    // update its size (if an child grew out of the shape)
    // only if it's not the canvas
    var lane,
        i,
        j,
        limits,
        minW,
        minH,
        childrens,
        margin = 15,
        shape,
        $shape = $(this.getHTML()),
        laneHeightMin = 0,
        laneHeightSum = 0,
        lastLane,
        laneChildrens= new PMUI.util.ArrayList();

    for (i = 0; i < this.bpmnLanes.getSize(); i += 1) {
        lane = this.bpmnLanes.get(i);
        childrens = lane.getChildren();
        for (j = 0; j < childrens.getSize(); j += 1) {
            shape = childrens.get(j);
            if (i  < this.bpmnLanes.getSize() - 1) {
                laneHeightSum += shape.parent.height;
            } else {
                laneHeightSum = 0;
            }
            laneChildrens.insert(
                {
                    x       : shape.x,
                    //y       : shape.y + laneHeightMin + laneHeightSum,
                    y       : shape.y + laneHeightMin,
                    width   : shape.width,
                    height  : shape.height
                }
            );

        }
        laneHeightMin += lane.height;
    }
    if (laneChildrens.getSize() > 0) {
        limits = laneChildrens.getDimensionLimit();

        minW = (limits[1] + margin + this.headLineCoord) * this.canvas.getZoomFactor();
        minH = (limits[2] + margin) * this.canvas.getZoomFactor();
    } else {
        minW = 300 * this.canvas.getZoomFactor();
        lastLane = this.bpmnLanes.get(this.bpmnLanes.getSize() - 2);
        minH = lastLane.getY() + lastLane.getHeight() + (30 * this.canvas.getZoomFactor());
    }

    // update jQueryUI's minWidth and minHeight
    $shape.resizable();
    $shape.resizable('option', 'minWidth', minW);
    $shape.resizable('option', 'minHeight', minH);
    return this;
};

PMPool.prototype.stringify = function(){
    var inheritedJSON = PMShape.prototype.stringify.call(this),
        thisJSON = {
            name : this.getName(),
            proUid : this.getProUid(),
            proType : this.proType,
            executable : this.executable,
            closed: this.isClosed(),
            parentLane: this.parentLane,
            relPosition: this.getRelPosition(),
            sizeIdentical: this.isSizeIdentical(),
            participants: this.getParticipants(),
            orientation: this.getOrientation(),
            parentLane: this.getParentLane()
            // TODO: CREATE PROPERTIES FOR THE BEHAVIORS
        };
    $.extend(true, inheritedJSON, thisJSON);
    return inheritedJSON;

};

/**
 * Creates bussines model to export to standard bpmn file
 * @param type xml tag to export bpmn file
 */
PMPool.prototype.createBpmn = function(type) {
    var bpmnCollaboration;
    if (!this.parent.businessObject.di){
        //Here create busines object to new process
        //this.parent.createBusinesObject();
        this.parent.createBPMNDiagram();
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
    //}
    //PMDesigner.moddle.toXML(PMDesigner.businessObject, function (err, xmlStrUpdated) {
    //
    //    // xmlStrUpdated contains new id and the added process
    //});
};
PMPool.prototype.updateSemanticParent = function(businessObject, newParent) {

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

PMPool.prototype.updateDiParent = function(di, parentDi) {
    PMShape.prototype.updateDiParent.call(this, di, parentDi);
};

/**
 * create busines object to moodle bpmn export
 */
PMPool.prototype.createBusinesObject = function() {
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
PMPool.prototype.removeBpmn = function() {
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

PMPool.prototype.updateBpmn = function() {

    this.updateBounds(this.participantObject.di);
};

var PMLane = function (options) {
    PMShape.call(this, options);
    //PAR_NAME (String)
    /**
     *
     * @type {String}
     */
    this.name = '';
    //PAR_IS_HORIZONTAL (inherited)

    //PRO_UID (String)
    /**
     *
     * @type {String}
     */
    this.proUid = '';

    //LAN_CHILD_LANESET (String)
    /**
     *
     * @type {String}
     */
    this.childLaneset = '';

    //BOU_REL_POSITION (Number)
    /**
     *
     * @type {Number}
     */
    this.relPosition = 0;

    this.parentPool = null;

    this.childPool = null;
    
    this.lan_xml=null;
    PMLane.prototype.initObject.call(this, options);
};

PMLane.prototype = new PMShape();
PMLane.prototype.type = 'PMLane';
PMLane.prototype.laneContainerBehavior = null;


PMLane.prototype.getDataObject = function () {
    var name = this.getName();
    return {
        lan_uid: this.id,
        lns_uid: this.parent.id,
        lan_name: name,
        type: "PMLane",
        bou_x: this.x,
        bou_y: this.y,
        bou_width: this.width,
        bou_height: this.height,
        bou_rel_position: this.getRelPosition(),
        element_id: this.parent.id,
        bou_container: 'bpmnPool',
        lan_parent_pool: this.parentPool,
        lan_xml: this.lan_xml,
        _extended: this.getExtendedObject()
    };
};

PMLane.prototype.initObject = function (options) {
var defaultOptions = {
        lan_name : 'Lane',
        proUid: null,
        childLaneset : null,
        relPosition: 0,
        childPool: null,
        orientation: 'HORIZONTAL',
        lan_xml: '',
    };
    $.extend(true, defaultOptions, options);

    this.setName(defaultOptions.lan_name)
        .setProUid(defaultOptions.proUid)
        .setRelPosition(defaultOptions.relPosition)
        .setChildPool(defaultOptions.childPool)
        .setOrientation(defaultOptions.orientation);
    this.setLaneXml(defaultOptions.lan_xml);
};
PMLane.prototype.paint = function(){

  if (this.parent.orientation === 'VERTICAL') {
       // this.graphic.drawLine(0, this.headLineCoord, this.width,
        //     this.headLineCoord);
        this.getLabels().get(0).setOrientation('horizontal');
        this.getLabels().get(0).setLabelPosition('top');
    } else {
        this.getLabels().get(0).setOrientation('vertical');
        this.getLabels().get(0).setLabelPosition('center-left', 20, 0);
 
    }
    if (this.childPool) {
        this.getLabels().get(0).setVisible(false);
    }

    this.getLabels().get(0).setZOrder(1);
    //this.points.getFirst();
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
PMLane.prototype.containerBehaviorFactory = function (type) {
    if (type === 'lane') {
        if(!this.laneContainerBehavior) {
            this.laneContainerBehavior = new LaneContainerBehavior();
        }
        return this.laneContainerBehavior;
    } else {

        return PMShape.prototype.containerBehaviorFactory.call(this, type);
    }
};
PMLane.prototype.setResizeBehavior = function (behavior) {
        var factory = new PMUI.behavior.BehaviorFactory({
                products: {
                    "regularresize": PMUI.behavior.RegularResizeBehavior,
                    "Resize": PMUI.behavior.RegularResizeBehavior,
                    "yes": PMUI.behavior.RegularResizeBehavior,
                    "resize": PMUI.behavior.RegularResizeBehavior,
                    "noresize": PMUI.behavior.NoResizeBehavior,
                    "NoResize": PMUI.behavior.NoResizeBehavior,
                    "no": PMUI.behavior.NoResizeBehavior,
                    //"poolResize": PMPoolResizeBehavior
                    "laneResize": PMLaneResizeBehavior
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
 * Convert a lane to Pool
 */
PMLane.prototype.transformToPool = function () {
  //TODO TRANFORM TO POOL
   var customShape = new BPMNPool({
                        width: this.getWidth()-1,
                        height: this.getHeight()-1,
                        "canvas" : this.canvas,
                        "connectAtMiddlePoints": false,
                        container : 'pool',
                        topLeft:true,

                        drop : {
                            type: 'bpmnconnectioncontainer',
                            selectors : ["#BPMNLane",
                                "#BPMNActivity", "#BPMNSubProcess", "#BPMNStartEvent",
                                "#BPMNEndEvent", "#BPMNIntermediateEvent", "#BPMNGateway",
                                "#BPMNDataObject", "#BPMNDataStore", "#BPMNGroup",
                                "#BPMNAnnotation", ".bpmn_droppable", ".custom_shape"],
                            overwrite : true
                        },
                        drag: 'noDrag',
                        resizeBehavior: "no",
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
                        "style": {
                            cssClasses: []
//                            cssProperties: {
//                                border: '1px solid #000000',
//                                '-webkit-box-shadow':  'none',
//                                '-moz-box-shadow':  'none',
//                                'box-shadow': 'none'
//                            }

                        },
                        layers: [
                            {
                                layerName : "first-layer",
                                priority: 2,
                                visible: true,
                                style: {
                                    cssProperties: {

                                    }
                                }
                            }
                        ],
                        labels : [
                            {
                                message : this.getMessage(),
                                width : 50,
                                height : 10,
                                orientation:'vertical',
                                position: {
                                    location: 'center-left',
                                    diffX : 20,
                                    diffY : 0

                                    },
                                updateParent: false
                            }
                        ],
                        orientation: this.parent.getOrientation(),
                        name: this.getName(),
                        parentLane: this.getID()
                    });
    this.labels.get(0).setVisible(false);
    this.setChildPool(customShape.getID());
    this.addElement(customShape, 1, 0, true);
    customShape.labels.get(0).setVisible(true);
    this.canvas.triggerSinglePropertyChangeEvent(this, 'childPool',
        this.getChildPool() ,customShape.getID());


    customShape.attachListeners();
    this.canvas.updatedElement = customShape;
    var command = new jCore.CommandCreate(customShape);
    this.canvas.commandStack.add(command);
    command.execute();


};

PMLane.prototype.createHTML = function () {
    PMShape.prototype.createHTML.call(this);
    if (this.getRelPosition() > 1) {
        //if (this.getOrientation() === 'HORIZONTAL') {
        //    this.style.addProperties({
        //        'border-top':'1px solid black'
        //    });
        //} else {
        //    this.style.addProperties({
        //        'border-left':'1px solid black'
        //    });
        //}
        this.style.addProperties({
            'border-top':'2px solid #3b4753'
        });
    }
    return this.html;
};

PMLane.prototype.attachListeners = function () {
    var $lane = $(this.html);
    if (!this.html) {
        return this;
    }
    PMShape.prototype.attachListeners.call(this);
};


PMLane.prototype.onMouseDown = function (shape) {
    return function (e, ui) {
        if (shape.getType() === 'PMPool' || shape.getType() === 'PMLane') {
            shape.canvas.cancelConnect();
        }
        PMUI.draw.CustomShape.prototype.onMouseDown.call(this, shape) (e,ui);
        shape.setDragBehavior('nodrag');
    };
};
//BPMNLane.prototype.onMouseUp = function (shape) {
//    return function (e, ui) {
//        //e.stopPropagation();
//    };
//};
//BPMNLane.prototype.onClick = function (shape) {
//    return function (e, ui) {
//       // e.stopPropagation();
//    };
//};

PMLane.prototype.destroy = function () {
    //BPMNShape.prototype.destroy.call(this);
    var parentPool = this.canvas.customShapes.find('id',this.parent.getID());
    if (parentPool){
        parentPool.removeLane(this);
        parentPool.updateOnRemoveLane(this);
        
    }
    //this.saveAndDestroy();
    return this;
};
//SETTERS
PMLane.prototype.setChildPool = function (pPool) {
    this.childPool = pPool;
    return this;
};
PMLane.prototype.setParentPool = function (pPool) {
    this.parentPool = pPool;
    return this;
};
/**
 * 设置泳道xml
 * */
PMLane.prototype.setLaneXml = function (xml) {
	if (xml !== 'undefined' && xml !== '') {
        this.lan_xml = xml;
    }else{
    	this.lan_xml = PMDesigner.strToXml('<lane id="'+this.getID()+'" name="'+this.getName()+'" x="0" y="0" width="" height="" isHorizontal="true" ></lane>').getElementsByTagName("lane")[0];
    }
};
/**
 * Set lane name
 * @param {String} name
 * @returns {BPMNLane}
 */
PMLane.prototype.setName = function (name) {
    if (typeof name !== 'undefined') {
        this.lan_name = name;
        if (this.label) {
            this.label.setMessage(name);
        }
    }
    return this;
};
/**
 * Set lane type
 * @param {String} newType
 * @returns {BPMNLane}
 */
PMLane.prototype.setType = function (newType) {
    this.type = newType;
    return this;
};
/**
 * Set process uid asociated to lane
 * @param {String} uid
 * @returns {BPMNLane}
 */
PMLane.prototype.setProUid = function (uid) {
    this.proUid = uid;
    return this;
};
/**
 * Set the relative position of lane
 * @param {Number} relPosition
 * @returns {BPMNLane}
 */
PMLane.prototype.setRelPosition = function (relPosition) {
    this.relPosition = relPosition;
    return this;
};

PMLane.prototype.setOrientation = function (orientation) {
    this.orientation = orientation;
    return this;
};
/**
 * Set ChildLaneset to lane
 * @param {BPMNPool} childLane
 * @returns {BPMNLane}
 */
PMLane.prototype.setChildLaneset = function (childLane) {
    this.childLaneset = childLane;
    return this;
};


//GETTERS
/**
 * Get the lane name
 * @returns {String}
 */
PMLane.prototype.getName = function () {
    return this.lan_name;
};

PMLane.prototype.getType = function () {
    return this.type;
};
/**
 * Get pro uid asociated to lane
 * @returns {String}
 */
PMLane.prototype.getProUid = function () {
    return this.proUid;
};
/**
 * Get the relative position of lane
 * @returns {Number}
 */
PMLane.prototype.getRelPosition = function () {
    return this.relPosition;
};
PMLane.prototype.getOrientation = function () {
    return this.orientation;
};
/**
 * Get ChildLaneSet
 * @returns {BPMNPool}
 */
PMLane.prototype.getChildLaneset = function () {
    return this.childLaneset;
};
PMLane.prototype.getChildPool = function () {
    return this.childPool;
};
PMLane.prototype.applyZoom = function () {
    PMShape.prototype.applyZoom.call(this);
    this.updateDimensions();
};
PMLane.prototype.updateDimensions = function (margin) {
    var minW,
        minH,
        //TODO UPDATE LANE DIMENSIONS
        children = this.getChildren(),
        limits = children.getDimensionLimit(),
        margin = 30,
        $shape = $(this.getHTML());

    minW = (limits[1] + margin) * this.canvas.getZoomFactor();
    minH = (limits[2] + margin) * this.canvas.getZoomFactor();

    // update jQueryUI's minWidth and minHeight
    $shape.resizable();
    $shape.resizable('option', 'minWidth', minW);
    $shape.resizable('option', 'minHeight', minH);
    return this;
};

/**
 * That method shows or hides lane resize behaviors
 * @param visible
 * @returns {PMLane}
 */
PMLane.prototype.showOrHideResizeHandlers = function (visible) {
    var i;
    if (!visible) {
        visible = false;
    }
    for (i = 0; i < this.cornerResizeHandlers.getSize(); i += 1) {
        this.cornerResizeHandlers.get(i).setVisible(false);
    }

    for (i = 0; i < this.midResizeHandlers.getSize(); i += 1) {
        //if (i === 1 || i === 2) {
        if (i === 2) {
            this.midResizeHandlers.get(i).setVisible(visible);
        } else {
            this.midResizeHandlers.get(i).setVisible(false);
        }
    }
    return this;
};

PMLane.prototype.updateAllRelatedDimensions = function () {
    var diffH = this.getHeight() - this.oldHeight,
        diffW = this.getWidth() - this.oldWidth;
    
    //this.parent.setDimension(this.parent.getWidth() + diffW, this.parent.getHeight() + diffH);
    this.parent.updateAllLaneDimension();
    this.parent.paint();
    return this;
};

PMLane.prototype.stringify = function(){
    var inheritedJSON = PMShape.prototype.stringify.call(this),
        thisJSON = {
            name : this.getName(),
            proUid: this.getProUid(),
            relPosition: this.getRelPosition(),
            childPool: this.getChildPool()
            // TODO: CREATE PROPERTIES FOR THE BEHAVIORS
        };
    $.extend(true, inheritedJSON, thisJSON);
    return inheritedJSON;
};

PMLane.prototype.createBpmn = function(type) {
    var bpmnLaneset;
    if (this.parent.businessObject.elem){
        //this.updateShapeParent(this.businessObject, this.parent.businessObject);
    } else {
        this.parent.createBusinesObject();

    }
    bpmnLaneset = this.createLaneset();
    this.createWithBpmn('bpmn:Lane', 'businessObject');
    //this.businessObject.
    this.updateBounds(this.businessObject.di);
    //this.updateShapeParent();
    this.updateSemanticParent(this.businessObject,  {elem: bpmnLaneset}) ;
    //this.updateShapeParent(this.businessObject, this.parent.businessObject);
    this.updateDiParent(this.businessObject.di,  this.parent.parent.businessObject.di);
};

PMLane.prototype.createLaneset = function() {
    var bpmnLaneset;
    if (!(_.findWhere(this.parent.businessObject.elem.get('flowElements'), {$type: "bpmn:LaneSet"}))) {
        bpmnLaneset =  PMDesigner.moddle.create('bpmn:LaneSet');
        bpmnLaneset.$parent  = this.parent.businessObject.elem;
        this.parent.businessObject.elem.get('flowElements').push(bpmnLaneset);
    } else {
        bpmnLaneset = _.findWhere(this.parent.businessObject.elem.get('flowElements'), {$type: "bpmn:LaneSet"});

    }
    return bpmnLaneset;
};

PMLane.prototype.updateSemanticParent = function(businessObject, newParent) {

    if (businessObject.elem.$parent === newParent.elem) {
        return;
    }

    var children;

    if (businessObject.elem.$parent) {
        // remove from old parent
        children = businessObject.elem.$parent.get('lanes');
        CollectionRemove(children, businessObject.elem);
    }

    if (!newParent.elem) {
        businessObject.elem.$parent = null;
    } else {
        // add to new parent
        children = newParent.elem.get('lanes');
        children.push(businessObject.elem);
        businessObject.elem.$parent = newParent.elem;
    }
};

//remove bpmn section
PMLane.prototype.removeBpmn = function() {
    var bpmnLaneset;
    this.parent.updateBounds(this.parent.participantObject.di);
    PMShape.prototype.removeBpmn.call(this);

    if ((_.findWhere(this.parent.businessObject.elem.get('flowElements'), {$type: "bpmn:LaneSet"}))) {
        bpmnLaneset =  _.findWhere(this.parent.businessObject.elem.get('flowElements'), {$type: "bpmn:LaneSet"});
        if (bpmnLaneset.lanes < 1) {
            CollectionRemove(this.parent.businessObject.elem.get('flowElements'), bpmnLaneset);
        }
        //this.parent.businessObject.get('flowElements').push(bpmnLaneset);

    }
};

PMLane.prototype.updateBpmn = function() {
    this.updateBounds(this.businessObject.di);

    //if (!this.parent.businessObject){
    //    //Here create busines object to new process
    //    this.parent.createBusinesObject();
    //    this.updateShapeParent(this.businessObject, this.parent.businessObject);
    //}

};

PMLane.prototype.laneRefreshConnections = function(delta) {
    var i,
        max,
        srcElem,
        destElem,
        connection,
        delta;
    for (i = 0, max = this.canvas.refreshArray.getSize(); i < max; i += 1) {
        connection = this.canvas.refreshArray.get(i);

        srcElem = connection.getSrcPort().parent;
        destElem = connection.getDestPort().parent;

        if(this.isConnetionIntoLane(srcElem)
            && this.isConnetionIntoLane(destElem)) {
            connection.reconnectUser(delta, false);
            connection.setSegmentMoveHandlers();
            connection.checkAndCreateIntersectionsWithAll();
            this.canvas.triggerUserStateChangeEvent(connection);
        } else {
            connection.reconnectManhattah();
            connection.setSegmentMoveHandlers();
            connection.checkAndCreateIntersectionsWithAll();
            this.canvas.triggerConnectionStateChangeEvent(connection);
        }


    }
};

PMLane.prototype.isConnetionIntoLane = function(shape) {
    var i,
        max,
        child;
    for (i = 0, max = this.children.getSize(); i < max; i += 1) {
        child = this.children.get(i);
        if (shape.getID() === child.getID()) {
            return true;
        }
    }
    return false;
};

/**
 * Command create: command created when a lane is created (from the toolbar)
 * @class BPMNCommandCreateLane
 * @constructor
 */
var PMCommandCreateLane = function (receiver) {
    var NewObj = function (receiver) {
        PMUI.command.CommandCreate.call(this, receiver);
    };

    NewObj.prototype = new PMUI.command.CommandCreate(receiver);
    /**
     * Type of command of this object
     * @type {String}
     */
    NewObj.prototype.type = 'PMCommandCreateLane';


    /**
     * Executes the command
     */
    NewObj.prototype.execute = function () {
        PMUI.command.CommandCreate.prototype.execute.call(this);


        //this.receiver.parent.refactorLanePositionsAndDimensions();
        this.receiver.parent.setLanePositionAndDimension(this.receiver);
    };

    /**
     * Inverse executes the command a.k.a. undo
     */
    NewObj.prototype.undo = function () {
        PMUI.command.CommandCreate.prototype.undo.call(this);
        this.receiver.parent.bpmnLanes.remove(this.receiver);

        this.receiver.parent.updateOnRemoveLane(this.receiver);
    };
    NewObj.prototype.redo = function () {
        this.execute();
        return this;
    };
    return new NewObj(receiver);
};


/**
 * @class PMUI.behavior.ContainerDropBehavior
 * Encapsulates the drop behavior of a container
 * @extends PMUI.behavior.DropBehavior
 *
 * @constructor
 * Creates a new instance of the class
 * @param {Array} [selectors=[]] css selectors that this drop behavior will
 * accept
 */
var PMContainerDropBehavior = function (selectors) {
    PMUI.behavior.DropBehavior.call(this, selectors);

};
PMContainerDropBehavior.prototype = new PMUI.behavior.DropBehavior();
//PMUI.inheritFrom('PMUI.behavior.DropBehavior', ContainerDropBehavior);
/**
 * Type of the instances
 * @property {String}
 */
PMContainerDropBehavior.prototype.type = "PMContainerDropBehavior";
/**
 * Default selectors for this drop behavior
 * @property {String}
 */
PMContainerDropBehavior.prototype.defaultSelector = "";

/**
 * On drop handler for this drop behavior, creates shapes when dropped from the
 * toolbar, or move shapes among containers
 * @param {PMUI.draw.Shape} shape
 * @return {Function}
 */
PMContainerDropBehavior.prototype.onDrop = function (shape) {

    return function (e, ui) {
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
        if (ui.helper && ui.helper.attr('id') === "drag-helper") {
            return false;
        }
        id = ui.draggable.attr('id');

        customShape = canvas.shapeFactory(id);
        if (customShape === null) {//不是从左侧工具栏拖拽来的

            customShape = canvas.customShapes.find('id', id);
            if (!customShape || !shape.dropBehavior.dropHook(shape, e, ui)) {
                return false;
            }

            if (!(customShape.parent &&
                customShape.parent.id === shape.id)) {
            	if(!(customShape.parent instanceof PMParallel)){//如果是并发体里的，不允许被拖拽到外面
            		selection = canvas.currentSelection;
                    for (i = 0; i < selection.getSize(); i += 1) {
                        sibling = selection.get(i);
                        coordinates = PMUI.getPointRelativeToPage(sibling);
                        coordinates = PMUI.pageCoordinatesToShapeCoordinates(shape, null,
                            coordinates.x, coordinates.y, customShape);
                        shapesAdded.push({
                            shape: sibling,
                            container: shape,
                            x: coordinates.x,
                            y: coordinates.y,
                            topLeft: false
                        });
                    }
                    //变换container
                    command = new PMUI.command.CommandSwitchContainer(shapesAdded);
                    command.execute();
                    canvas.commandStack.add(command);
                    canvas.multipleDrop = true;
            	}
            }
            //var connectionType = customShape.connectionType;
            canvas.hideAllFocusLabels();
            shape.updateDimensions(10);
            canvas.updatedElement = null;
            // fix resize minWidth and minHeight and also fix the dimension
            // of this shape (if a child made it grow)
            //customShape.ports.asArray()
            var portx,
                connectionx,
                result;
            for (var i=0; i< customShape.ports.asArray().length ;i++){
                portx = customShape.ports.asArray()[i];
                connectionx = portx.connection;

                result = PMDesigner.connectValidator.isValid(connectionx.getSrcPort().parent, connectionx.getDestPort().parent, true);
                if (result.conf && result.conf.segmentStyle !== connectionx.originalSegmentStyle) {
                    PMDesigner.msgFlash(RIA_I18N.designer.errorMessage.wrongConAndRecon, document.body, 'error',5000, 5);
                }
                //result = PMDesigner.connectValidator.isValidConnection(connectionx.getSrcPort().parent,  connectionx.getDestPort().parent,connectionx);
                //if(result.change) {
                //    if(!result.valid){
                //        PMDesigner.msgFlash('Invalid flow between elements. Please delete the flow and reconnect the elements.', document.body, 'error',5000, 5);
                //    }
                //}
            }

        } else {
        	/*siqq*/
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
                          //add drop listener for resource tree item drag  lv.yz
                            if(customShape.getType() === 'PMPool'||customShape.getType() ===  'PMParallel'){
                            	$('#'+customShape.id).on("drop",function(ev){
                                	PMProject.prototype.resourceTreeViewDrop(ev,customShape);
                                	ev.stopPropagation();
                                });
                            }
                          //end of add drop listener for resource tree item drag  lv.yz
                        }
                        canvas.hideAllFocusLabels();
                        if (customShape.label && customShape.focusLabel) {
                            customShape.label.getFocus();
                        }
                }
            //}
        }
        if(shape.getType() && shape.getType()==="PMCanvas"){
        	var newWidth = customShape.x + customShape.width +100;
        	var newHeight = customShape.y + customShape.height +100;
        	if(newWidth>shape.getWidth())
        		shape.setWidth(newWidth);
        	if(newHeight>shape.getHeight())
        		shape.setHeight(newHeight);
        	//shape.setDimension(newWidth,newHeight);
        }
        if(id=="CONCURRENT"){
        	customShape.addStartAndEnd("PARALLEL",0,64);//5,125
        	customShape.addStartAndEnd("INCLUSIVE",275,64);//560,125 //300-31
        }	
    };
};

PMContainerDropBehavior.prototype.setSelectors = function (selectors, overwrite) {
    PMUI.behavior.DropBehavior.prototype
        .setSelectors.call(this, selectors, overwrite);
    this.selectors.push(".port");
    //this.selectors.push(".custom_shape");
    return this;
};
var PoolContainerBehavior = function () {
    this.addElementLane = false;
};

PoolContainerBehavior.prototype = new PMUI.behavior.RegularContainerBehavior();
PoolContainerBehavior.prototype.type = "PoolContainerBehavior";
/*在泳道中添加形状*/
PoolContainerBehavior.prototype.addToContainer = function (container,
                                                              shape, x, y,
                                                              topLeftCorner) {
    var shapeLeft = 0,
        shapeTop = 0,
        shapeWidth,
        shapeHeight,
        canvas,
        topLeftFactor = (topLeftCorner === true) ? 0 : 1;
    this.addElementLane = false;
    if (shape.type === 'PMLane') {
        if (container.type === "Canvas") {
            canvas = container;
        } else {
            canvas = container.canvas;
        }
        // have not lanes childrens
        if (container.children.getSize() !== container.bpmnLanes.getSize()) {
            PMDesigner.msgFlash(RIA_I18N.designer.errorMessage.needEmptyPool, document.body, 'error',3000, 5);
            this.addElementLane = true;
        } else {
            shapeWidth = container.getWidth() - container.headLineCoord;
            shapeHeight = container.getHeight();

            shapeLeft += x - (shapeWidth / 2) * topLeftFactor;
            shapeTop += y - (shapeHeight / 2) * topLeftFactor;

            shapeLeft /= canvas.zoomFactor;
            shapeTop /= canvas.zoomFactor;
            //shape.setDimension(shapeWidth, shapeHeight);
            shape.setParent(container);
            container.getChildren().insert(shape);

           // point = container.getLanePoint();
            this.addShape(container, shape, shapeLeft, shapeTop);
            container.addLane(shape);
            shape.fixZIndex(shape, 0);
            // fix resize minWidth and minHeight and also fix the dimension
            // of this shape (if a child made it grow)
            //container.resizeBehavior.updateResizeMinimums(container);
            // adds the shape to either the customShape arrayList or the regularShapes
            // arrayList if possible
            canvas.addToList(shape);
        }

    } else {
    		/*PMUI.behavior.RegularContainerBehavior.prototype.addToContainer.call(this, container,
                shape, x, y, topLeftCorner);*/
            if (PMUI.draw.Geometry.pointInRectangle(new PMUI.util.Point(x, y),
                                          new PMUI.util.Point(container.headLineCoord, 0),
                                          new PMUI.util.Point(container.getZoomWidth(),
                                              container.getZoomHeight())
                                         )) {
                PMUI.behavior.RegularContainerBehavior.prototype.addToContainer.call(this, container,
                    shape, x, y, topLeftCorner);
            } else {
                shape.setParent(container.canvas);
                container.canvas.getChildren().insert(shape);
                this.addShape(container.canvas, shape, shape.getOldX(), shape.getOldY());
                shape.fixZIndex(shape, 0);
                // adds the shape to either the customShape arrayList or the regularShapes
                // arrayList if possible
                container.canvas.addToList(shape);
                //TODO IF SHAPE IS IN POOL HEADER
            }
    }
};


PoolContainerBehavior.prototype.addShape = function (container, shape, x, y) {
    shape.setPosition(x, y);
    //insert the shape HTML to the DOM
    if (shape instanceof PMArtifact && shape.art_type === 'GROUP') {
        $(container.getHTML()).prepend(shape.getHTML());
    } else {
        container.getHTML().appendChild(shape.getHTML());
    }
    shape.updateHTML();
    shape.paint();
    shape.applyBehaviors();
    //shape.defineEvents();
    shape.attachListeners();
    return this;
};

/**
 * Command resize: command resize when a poll is resized (mazimized or minimized)
 * @class BPMNCommandPoolResize
 * @constructor
 */
var PMCommandPoolResize = function (receiver, options) {
    this.isTop = options.isTop;
    this.beforeHeightsOpt = options.beforeHeightsOpt;
    this.delta = options.delta;
    if (receiver.bpmnLanes.getSize() > 0) {
        this.afterHeightsOpt = {
            lastLaneHeight: receiver.bpmnLanes.getLast().getHeight(),
            firstLaneHeight: receiver.bpmnLanes.getFirst().getHeight()
        };
    }

    PMUI.command.CommandResize.call(this, receiver);
};
/**
 * Type of command of this object
 * @type {String}
 */
 //CommandChangeGatewayType.prototype = new PMUI.command.Command();
PMUI.inheritFrom('PMUI.command.CommandResize', PMCommandPoolResize);
PMCommandPoolResize.prototype.type = 'PMCommandPoolResize';

/**
 * Executes the command
 */
PMCommandPoolResize.prototype.execute = function () {
    var i,
        pool = this.receiver,
        lane,
        newY,
        newWidth,
        delta;
    PMUI.command.CommandResize.prototype.execute.call(this);

    if (pool.bpmnLanes.getSize() > 0) {
        newWidth = pool.getWidth() - pool.headLineCoord - 1.2;
        if (this.isTop) {
            lane = pool.bpmnLanes.getFirst();
            lane.setDimension(newWidth, this.afterHeightsOpt.firstLaneHeight);
            newY = this.afterHeightsOpt.firstLaneHeight;
            for (i = 1; i < pool.bpmnLanes.getSize(); i += 1) {
                lane = pool.bpmnLanes.get(i);
                lane.setPosition(lane.getX(), newY);
                lane.setDimension(newWidth, lane.getHeight());
                newY += lane.getHeight();
            }
        } else {
            pool.setMinimunsResize();
            lane = pool.bpmnLanes.getLast();
            lane.setDimension(newWidth,  this.afterHeightsOpt.lastLaneHeight);
            for (i = 0; i < pool.bpmnLanes.getSize() - 1; i += 1) {
                lane = pool.bpmnLanes.get(i);
                lane.setDimension(newWidth, lane.getHeight());
            }
        }
    }
    pool.canvas.refreshArray.clear();
    delta = {
        dx: this.delta.dx,
        dy: this.delta.dy
    };
    pool.poolChildConnectionOnResize(true, true);
    pool.refreshAllPoolConnections(false, delta);
};

/**
 * Inverse executes the command a.k.a. undo
 */
PMCommandPoolResize.prototype.undo = function () {
    var i,
        pool = this.receiver,
        lane,
        newWidth,
        newY,
        delta;
    this.receiver.oldHeight = this.receiver.getHeight();
    PMUI.command.CommandResize.prototype.undo.call(this);
    if (this.receiver.graphic) {
        this.receiver.paint();
    }
    if (pool.bpmnLanes.getSize() > 0) {
        newWidth = pool.getWidth() - pool.headLineCoord - 1.2;
        if (this.isTop) {
            lane = pool.bpmnLanes.getFirst();
            lane.setDimension(newWidth, this.beforeHeightsOpt.firstLaneHeight);
            newY = this.beforeHeightsOpt.firstLaneHeight;
            for (i = 1; i < pool.bpmnLanes.getSize(); i += 1) {
                lane = pool.bpmnLanes.get(i);
                lane.setPosition(lane.getX(), newY);
                lane.setDimension(newWidth, lane.getHeight());
                newY += lane.getHeight();
            }
        } else {
            lane = pool.bpmnLanes.getLast();
            lane.setDimension(newWidth,  this.beforeHeightsOpt.lastLaneHeight);
            for (i = 0; i < pool.bpmnLanes.getSize() - 1; i += 1) {
                lane = pool.bpmnLanes.get(i);
                lane.setDimension(newWidth, lane.getHeight());
            }
        }
    }
    pool.canvas.refreshArray.clear();
    delta = {
        dx: this.delta.dx * -1,
        dy: this.delta.dy * -1
    };
    pool.poolChildConnectionOnResize(true, true);
    pool.refreshAllPoolConnections(false, delta);

};

/**
 * Executes the command a.k.a redo
 */
PMCommandPoolResize.prototype.redo = function () {
    this.execute();
};

/*global jCore*/
var PMLaneResizeBehavior = function () {
};

PMLaneResizeBehavior.prototype = new PMUI.behavior.RegularResizeBehavior();
PMLaneResizeBehavior.prototype.type = "PMLaneResizeBehavior";

PMLaneResizeBehavior.prototype.init = function (shape) {
    PMUI.behavior.RegularResizeBehavior
        .prototype.init.call(this, shape);
    $shape = $(shape.getHTML());
    $shape.resizable();
    $shape.resizable('option', 'minHeight', 30 * shape.canvas.getZoomFactor());
};
/**
 * Sets a shape's container to a given container
 * @param container
 * @param shape
 */
PMLaneResizeBehavior.prototype.onResizeStart = function (shape) {
    return PMUI.behavior.RegularResizeBehavior
        .prototype.onResizeStart.call(this, shape);
};
/**
 * Removes shape from its current container
 * @param shape
 */
PMLaneResizeBehavior.prototype.onResize = function (shape) {
    //RegularResizeBehavior.prototype.onResize.call(this, shape);
    return function (e, ui) {
        PMUI.behavior.RegularResizeBehavior
            .prototype.onResize.call(this, shape)(e, ui);
        //if (shape.graphic) {
        //shape.paint();
        //}
    };
};

PMLaneResizeBehavior.prototype.onResizeEnd = function (shape) {
    return function (e, ui) {
        var i,
            j,            
            label,
            command;
        shape.resizing = false;
        shape.canvas.isResizing = false;
        // last resize
        PMUI.behavior.RegularResizeBehavior.prototype.onResize.call(this, shape)(e, ui);
        // show the handlers again
        shape.showOrHideResizeHandlers(true);        
        for (i = 0; i < shape.labels.getSize(); i += 1) {
            label = shape.labels.get(i);
            label.setLabelPosition(label.location, label.diffX, label.diffY);
        }
        // TESTING COMMANDS
        command = new PMCommandLaneResize(shape);
        command.execute();
        shape.canvas.commandStack.add(command);
        shape.parent.updateDimensionsWithLanes();
        //shape.fixConnectionsOnResize(shape.resizing, true);
        //shape.refreshConnections(false, true);
        //shape.showAllChilds();

        return true;
    };
};

var LaneContainerBehavior = function () {
};

LaneContainerBehavior.prototype = new PMUI.behavior.RegularContainerBehavior();
LaneContainerBehavior.prototype.type = "LaneContainerBehavior";


LaneContainerBehavior.prototype.addShape = function (container, shape, x, y) {
    shape.setPosition(x, y);
    //insert the shape HTML to the DOM
    if (shape instanceof PMArtifact && shape.art_type === 'GROUP') {
        $(container.getHTML()).prepend(shape.getHTML());
    } else {
        container.getHTML().appendChild(shape.getHTML());
    }
    shape.updateHTML();
    shape.paint();
    shape.applyBehaviors();
    //shape.defineEvents();
    shape.attachListeners();
    return this;
};

/**
 * @class CommandDelete
 * Class CommandDelete determines the actions executed when some shapes are deleted (redo) and the actions
 * executed when they're recreated (undo).
 *
 * Instances of this class are created in {@link Canvas#removeElements}.
 * @extends Command
 *
 * @constructor Creates an instance of the class CommandDelete
 * @param {Object} receiver The object that will execute the command
 */
PMCommandDelete = function (receiver) {
    PMUI.command.Command.call(this, receiver);

    /**
     * A stack of commandsConnect
     * @property {Array}
     */
    this.stackCommandConnect = [];

    /**
     * ArrayList that represents the selection that was active before deleting the elements
     * @property {ArrayList}
     */
    this.currentSelection = new  PMUI.util.ArrayList();

    /**
     * Reference to the current connection in the canvas
     * @property {Connection}
     */
    this.currentConnection = null;

    /**
     * List of all the elements related to the commands
     * @property {Array}
     */
    this.relatedElements = [];
    this.beforeRelPositions = [];
    this.tempLanes = new  PMUI.util.ArrayList();

    PMCommandDelete.prototype.initObject.call(this, receiver);
};

PMUI.inheritFrom('PMUI.command.Command', PMCommandDelete);

/**
 * Type of command
 * @property {String}
 */
PMCommandDelete.prototype.type = "PMCommandDelete";

/**
 * Instance initializer which uses options to extend the config options to initialize the instance
 * @param {Object} receiver The object that will execute the command
 * @private
 */
PMCommandDelete.prototype.initObject = function (receiver) {
    var i,
        shape;

    // move the current selection to this.currentSelection array
    for (i = 0; i < receiver.getCurrentSelection().getSize() > 0; i += 1) {
        shape = receiver.getCurrentSelection().get(i);
        this.currentSelection.insert(shape);
    }

    // save the currentConnection of the canvas if possible
    if (receiver.currentConnection) {
        this.currentConnection = receiver.currentConnection;
    }

};

/**
 * Saves and destroys connections and shapes
 * @private
 * @param {Object} shape
 * @param {boolean} root True if `shape` is a root element in the tree
 * @param {boolean} [fillArray] If set to true it'll fill `this.relatedElements` with the objects erased
 * @return {boolean}
 */
PMCommandDelete.prototype.saveAndDestroy = function (shape, root, fillArray) {
    var i,
        child,
        parent,
        children = null,
        connection,
        canvas = shape.canvas;

    if (shape.hasOwnProperty("children")) {
        children = shape.children;
    }

    // special function to be called as an afterwards
    // BIG NOTE: doesn't have to delete html
    if (shape.destroy) {
        shape.destroy();
    }

    for (i = 0; i < children.getSize(); i += 1) {
        child = children.get(i);
        this.saveAndDestroy(child, false, fillArray);
    }

    while (shape.ports && shape.ports.getSize() > 0) {
        connection = shape.ports.getFirst().connection;
        if (fillArray) {
            this.relatedElements.push(connection);
        }

        this.stackCommandConnect.push(
            new PMUI.command.CommandConnect(connection)
        );
        connection.saveAndDestroy();
    }

    // remove from the children array of its parent
    if (root) {
        parent = shape.parent;
        parent.getChildren().remove(shape);
        if (parent.isResizable()) {
            parent.resizeBehavior.updateResizeMinimums(shape.parent);
        }
        if(parent.getType() === 'PMLane') {
            parent.updateDimensions();
        }
        // remove from the currentSelection and from either the customShapes
        // arrayList or the regularShapes arrayList
        //canvas.removeFromList(shape);

        // remove the html only from the root
        shape.html = $(shape.html).detach()[0];

        if (shape.getType() === 'PMLane') {
            this.beforeRelPositions[shape.getID()] = shape.getRelPosition();
            shape.parent.bpmnLanes.remove(shape);
            //shape.parent.refactorLanePositionsAndDimensions();
        }

    }
    if (fillArray) {
        this.relatedElements.push(shape);
    }
    // remove from the currentSelection and from either the customShapes
    // arrayList or the regularShapes arrayList
    canvas.removeFromList(shape);
    return true;
};
/**
 * Executes the command
 *
 * @chainable
 */
PMCommandDelete.prototype.execute = function () {
    var shape,
        i,
        canvas = this.receiver,
        currentConnection,
        stringified,
        fillArray = false,
        mainShape = null,
        data,
        self = this,
        url =  '/project/' + PMDesigner.project.id + '/activity/validate-active-cases';
    if (this.relatedElements.length === 0) {
        fillArray = true;
    }

    canvas.emptyCurrentSelection();
    // copy from this.currentConnection
   if(this.currentSelection.getSize() === 1) {
        shape = this.currentSelection.get(0);
        
        canvas.addToSelection(shape);//删除所选节点  bysiqq
        /*
        if (shape.getType() === 'PMActivity') {
            data = {
                act_uid: shape.getID(),
                case_type : 'assigned'
            };
            
            PMDesigner.restApi.execute ({//鏆傛椂灞忚斀鍒犻櫎Restzhaozhg
                data:  JSON.stringify(data),
                method: "update",
                url: "/api/1.0/" + WORKSPACE + url,
                async: false,
                success: function (data, textStatus, xhr) {
                    if(data.result) {
                        canvas.addToSelection(shape);
                    } else {
                        shape.corona.hide();
                        PMDesigner.msgFlash(data.message, document.body, 'error',3000, 5);
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    PMDesigner.msgFlash('There are problems removing task', document.body, 'error',3000, 5);
                }
            });
        } else {
            canvas.addToSelection(shape);
        }*/
    } else if(this.currentSelection.getSize() !== 0){
        PMDesigner.msgFlash(RIA_I18N.designer.errorMessage.invalidOperation, document.body, 'error',3000, 5);
    }
    
    if (canvas.currentSelection.getSize() === 1) {
        mainShape = shape;
    }
    // remove the elements in the canvas current selection

    stringified = [];

    if (shape && shape.getType() === 'PMPool') {
        for (i = 0; i < shape.bpmnLanes.getSize(); i += 1) {
            this.tempLanes.insert(shape.bpmnLanes.get(i));
        }
    }

    while (canvas.getCurrentSelection().getSize() > 0) {
        shape = canvas.getCurrentSelection().getFirst();
        this.saveAndDestroy(shape, true, fillArray);
    }
    if (shape && shape.getType() === 'PMLane') {
        //shape.parent.refactorLanePositionsAndDimensions();

        for (i = 0; i < shape.parent.bpmnLanes.getSize(); i += 1) {
            shape.parent.bpmnLanes.get(i)
                .refreshChildrenPositions(true)
                .refreshConnections(false, false);
        }
    }

    // destroy the currentConnection
    canvas.currentConnection = this.currentConnection;
    currentConnection = canvas.currentConnection;
    if (currentConnection) {
        // add to relatedElements just in the case when only a connection is
        // selected and deleted
        this.relatedElements.push(currentConnection);

        this.stackCommandConnect.push(
            new PMUI.command.CommandConnect(currentConnection)
        );

        currentConnection.saveAndDestroy();
        currentConnection = null;
    }
    canvas.triggerRemoveEvent(mainShape, this.relatedElements);
    
    return this;
};

/**
 * Inverse executes the command a.k.a. undo
 *
 * @chainable
 */
PMCommandDelete.prototype.undo = function () {
    // undo recreates the shapes
    var i,
        shape,
        mainShape = this.currentSelection.getFirst(),
        size,
        haveLanes = false,
        shapeBefore,
        j,
        element;
    this.currentSelection.sort(function (lane1, lane2) {
        return lane1.relPosition > lane2.relPosition;
    });

    for (i = 0; i < this.currentSelection.getSize(); i += 1) {
        shape = this.currentSelection.get(i);
        shapeBefore = null;
        // add to the canvas array of regularShapes and customShapes
        shape.canvas.addToList(shape);
        // add to the children of the parent
        shape.parent.getChildren().insert(shape);
       // PMUI.behavior.ResizeBehavior.prototype.updateResizeMinimums(shape.parent);
        shape.showOrHideResizeHandlers(false);

        if (shape.getType() !== 'PMLane') {
            shape.parent.html.appendChild(shape.getHTML());
        } else {
            shapeBefore = shape.parent.bpmnLanes
                .get(this.beforeRelPositions[shape.getID()] - 1);
            if (shapeBefore) {
                shape.parent.html
                    .insertBefore(shape.getHTML(), shapeBefore.getHTML());
            } else {
                shape.parent.html.appendChild(shape.getHTML());
            }
            size = shape.parent.bpmnLanes.getSize();
            for (j = this.beforeRelPositions[shape.getID()] - 1; j < size; j += 1) {
                element = shape.parent.bpmnLanes.get(j);
                element.setRelPosition(j + 2);
            }
            shape.setRelPosition(this.beforeRelPositions[shape.getID()]);
            shape.parent.bpmnLanes.insert(shape);
            shape.parent.bpmnLanes.sort(shape.parent.comparisonFunction);
            shape.parent.updateAllLaneDimension();
        }
        if (shape.getType() === 'PMPool'){
            for (i = 0; i < this.tempLanes.getSize(); i += 1) {
                shape.bpmnLanes.insert(this.tempLanes.get(i));
            }
            if (shape.bpmnLanes.getSize() > 0) {
                shape.updateAllLaneDimension();
            }
        }
        shape.corona.hide();
    }


    // reconnect using the stack of commandConnect
    for (i = this.stackCommandConnect.length - 1; i >= 0; i -= 1) {
        //this.stackCommandConnect[i].redo();
        this.stackCommandConnect[i].buildConnection();
    }

    this.receiver.triggerCreateEvent(mainShape, this.relatedElements);
    if (haveLanes) {
        // mainShape.parent.bpmnLanes.sort(mainShape.parent.comparisonFunction);
        //mainShape.parent.refactorLanePositionsAndDimensions();
        //mainShape.parent.setLanePositionAndDimension(mainShape);

//        mainShape.parent.setDimension(mainShape.parent.getWidth(), mainShape.parent.getHeight() + mainShape.getHeight());
//        mainShape.parent.paint();
        //mainShape.parent.updateAllLaneDimension();
        for (i = 0; i < mainShape.parent.bpmnLanes.getSize(); i += 1) {
            mainShape.parent.bpmnLanes.get(i)
                .refreshChildrenPositions(true)
                .refreshConnections(false);
        }

    }

    return this;
};
/**
 * Executes the command (a.k.a redo)
 * @chainable
 */
PMCommandDelete.prototype.redo = function () {
    this.execute();
    return this;
};
/**
 * Command resize: command resize when a poll is resized (mazimized or minimized)
 * @class BPMNCommandPoolResize
 * @constructor
 */
var PMCommandLaneResize = function(receiver){
    PMUI.command.CommandResize.call(this, receiver);
};
/**
 * Type of command of this object
 * @type {String}
 */
    //CommandChangeGatewayType.prototype = new PMUI.command.Command();
PMUI.inheritFrom('PMUI.command.CommandResize', PMCommandLaneResize);
PMCommandLaneResize.prototype.type = 'PMCommandLaneResize';

/**
 * Executes the command
 */
PMCommandLaneResize.prototype.execute = function (){

    PMUI.command.CommandResize.prototype.execute.call(this);
    this.receiver.updateAllRelatedDimensions();
};

/**
 * Inverse executes the command a.k.a. undo
 */
PMCommandLaneResize.prototype.undo = function () {
    this.receiver.oldWidth = this.receiver.getWidth();
    this.receiver.oldHeight = this.receiver.getHeight();
            PMUI.command.CommandResize.prototype.undo.call(this);
    this.receiver.updateAllRelatedDimensions();

};

/**
 * Executes the command a.k.a redo
 */
PMCommandLaneResize.prototype.redo = function () {
    this.execute();
};

var CommandChangeEventMarker = function (receiver, options) {
    PMUI.command.Command.call(this, receiver);
    this.before = null;
    this.after = null;
    CommandChangeEventMarker.prototype.initObject.call(this, options);
};

//CommandChangeGatewayType.prototype = new PMUI.command.Command();
PMUI.inheritFrom('PMUI.command.Command', CommandChangeEventMarker);
/**
 * Type of the instances of this class
 * @property {String}
 */
CommandChangeEventMarker.prototype.type = "CommandChangeEventMarker";

/**
 * Initializes the command parameters
 * @param {PMUI.draw.Core} receiver The object that will perform the action
 */
CommandChangeEventMarker.prototype.initObject = function (options) {

    var parsedClass = options;
    this.layer = this.receiver.getLayers().get(0);
    //layer.setZoomSprites(newSprite);

    this.before = {
        zoomSprite: this.layer.zoomSprites,
        marker: this.receiver.evn_marker
    };
//    if (options === 'COMPLEX') {
//        parsedClass = 'EXCLUSIVE';
//    }
    this.after = {
        zoomSprite: [
            'mafe-event-' + this.receiver.getEventType().toLowerCase() + '-' +
                parsedClass.toLowerCase() + '-16',
            'mafe-event-' + this.receiver.getEventType().toLowerCase() + '-' +
                parsedClass.toLowerCase() + '-24',
            'mafe-event-' + this.receiver.getEventType().toLowerCase() + '-' +
                parsedClass.toLowerCase() + '-33',
            'mafe-event-' + this.receiver.getEventType().toLowerCase() + '-' +
                parsedClass.toLowerCase() + '-41',
            'mafe-event-' + this.receiver.getEventType().toLowerCase() + '-' +
                parsedClass.toLowerCase() + '-49'
        ],
        marker: options
    };
};

/**
 * Executes the command, changes the position of the element, and if necessary
 * updates the position of its children, and refreshes all connections
 */
CommandChangeEventMarker.prototype.execute = function () {
    var menuShape;
    this.layer.setZoomSprites(this.after.zoomSprite);
    //this.layer.paint();

    this.receiver.setEventMarker(this.after.marker);
    this.receiver
        .updateBpmEventMarker(this.receiver.getBpmnElementType());
    PMDesigner.project.updateElement([]);
    menuShape = PMDesigner.getMenuFactory(this.receiver.getEventType());
    this.receiver.setContextMenu(menuShape);
    this.receiver.paint();
};

/**
 * Returns to the state before the command was executed
 */
CommandChangeEventMarker.prototype.undo = function () {
    this.layer.setZoomSprites(this.before.zoomSprite);
    //this.layer.paint();
    this.receiver.setEventMarker(this.before.marker);
    this.receiver
        .updateBpmEventMarker(this.receiver.getBpmnElementType());
    this.receiver.extendedType = this.before.marker;
    PMDesigner.project.setDirty(true);
    $(this.receiver.html).trigger('changeelement');

    menuShape = PMDesigner.getMenuFactory(this.before.marker);
    this.receiver.setContextMenu(menuShape);
    this.receiver.paint();
};

/**
 *  Executes the command again after an undo action has been done
 */
CommandChangeEventMarker.prototype.redo = function () {
    this.execute();
};


var CanvasContainerBehavior = function () {
};

CanvasContainerBehavior.prototype = new PMUI.behavior.RegularContainerBehavior();
CanvasContainerBehavior.prototype.type = "CanvasContainerBehavior";

/**
 * Adds a shape to a given container given its coordinates
 * @param {PMUI.draw.BehavioralElement} container container using this behavior
 * @param {PMUI.draw.Shape} shape shape to be added
 * @param {number} x x coordinate where the shape will be added
 * @param {number} y y coordinate where the shape will be added
 * @param {boolean} topLeftCorner Determines whether the x and y coordinates
 * will be considered from the top left corner or from the center
 */
CanvasContainerBehavior.prototype.addToContainer = function (container, shape, x, y, topLeftCorner) {
/*向canvas中增加形状 by siqq*/
	var shapeLeft = 0,
        shapeTop = 0,
        shapeWidth,
        shapeHeight,
        canvas,
        topLeftFactor = (topLeftCorner === true) ? 0 : 1;
    if (container.family === "Canvas") {
        canvas = container;
    } else {
        canvas = container.canvas;
    }

    shapeWidth = shape.getZoomWidth();
    shapeHeight = shape.getZoomHeight();

    shapeLeft += x - (shapeWidth / 2) * topLeftFactor;
    shapeTop += y - (shapeHeight / 2) * topLeftFactor;

    shapeLeft /= canvas.zoomFactor;
    shapeTop /= canvas.zoomFactor;

    shape.setParent(container);
    container.getChildren().insert(shape);
    this.addShape(container, shape, shapeLeft, shapeTop);

    // fix the zIndex of this shape and it's children
    if (shape.getType() === 'PMPool' || shape.getType() === 'PMParticipant' || shape.getType() === 'PMParallel') {
        shape.fixZIndex(shape, 3);
    } else {
        shape.fixZIndex(shape, 2);
    }
    //在画布新增节点时，如果节点位置在画布边缘，则增加画布大小
    if(container.getType() && container.getType()==="PMCanvas"){
    	var newWidth = shape.x + shape.width +100;
    	var newHeight = shape.y + shape.height +100;
    	if(newWidth>container.getWidth())
    		container.setWidth(newWidth);
    	if(newHeight>container.getHeight())
    		container.setHeight(newHeight);
    }
    // fix resize minWidth and minHeight and also fix the dimension
    // of this shape (if a child made it grow)
    container.updateDimensions(10);

    // adds the shape to either the customShape arrayList or the regularShapes
    // arrayList if possible
    canvas.addToList(shape);
};
CanvasContainerBehavior.prototype.addShape = function (container, shape, x, y) {
    shape.setPosition(x, y);
    //insert the shape HTML to the DOM
    if (shape instanceof PMArtifact && shape.art_type === 'GROUP') {
        $(container.getHTML()).prepend(shape.getHTML());
    } else {
        container.getHTML().appendChild(shape.getHTML());
    }
    shape.updateHTML();
    shape.paint();
    shape.applyBehaviors();
    //shape.defineEvents();
    shape.attachListeners();
    return this;

};

/**
 * @class ActivityContainerBehavior
 * Encapsulates the behavior of a regular container
 * @extends PMUI.behavior.RegularContainerBehavior
 *
 * @constructor
 * Creates a new instance of the class
 */
var ActivityContainerBehavior = function () {
};


ActivityContainerBehavior.prototype = new PMUI.behavior.RegularContainerBehavior();


/**
 * Type of the instances
 * @property {String}
 */
ActivityContainerBehavior.prototype.type = "ActivityContainerBehavior";
/**
 * Adds a shape to a given container given its coordinates
 * @param {PMUI.draw.BehavioralElement} container container using this behavior
 * @param {PMUI.draw.Shape} shape shape to be added
 * @param {number} x x coordinate where the shape will be added
 * @param {number} y y coordinate where the shape will be added
 * @param {boolean} topLeftCorner Determines whether the x and y coordinates
 * will be considered from the top left corner or from the center
 */
ActivityContainerBehavior.prototype.addToContainer = function (container, shape, x, y, topLeftCorner) {
    var shapeLeft = 0,
        shapeTop = 0,
        shapeWidth,
        shapeHeight,
        canvas,
        topLeftFactor = (topLeftCorner === true) ? 0 : 1;

    if (container.family === "Canvas") {
        canvas = container;
    } else {
        canvas = container.canvas;
    }


    shapeWidth = shape.getZoomWidth();
    shapeHeight = shape.getZoomHeight();

    shapeLeft += x - (shapeWidth / 2) * topLeftFactor;
    shapeTop += y - (shapeHeight / 2) * topLeftFactor;

    shapeLeft /= canvas.zoomFactor;
    shapeTop /= canvas.zoomFactor;

    shape.setParent(container);
    container.getChildren().insert(shape);
    this.addShape(container, shape, shapeLeft, shapeTop);

    // fix the zIndex of this shape and it's children
    shape.fixZIndex(shape, 1);

    canvas.addToList(shape);
    if (shape.getType() === 'PMEvent' && shape.getEventType() === 'BOUNDARY') {
        //shape.parent. updateBoundaryPositions(false);
        container.boundaryArray.insert(shape);
        if (container.boundaryPlaces.isEmpty()) {
            container.makeBoundaryPlaces();
        }
        shape.attachToActivity();
    } else {
        // fix resize minWidth and minHeight and also fix the dimension
        // of this shape (if a child made it grow)
        container.updateDimensions(10);
    }

};
///**
// * Removes a shape from the container implementing this behavior
// * @param {PMUI.draw.Shape} shape shape to be removed
// */
//ActivityContainerBehavior.prototype.removeFromContainer = function (shape) {
//    var parent = shape.parent;
//    parent.getChildren().remove(shape);
//    if (parent.isResizable()) {
//        parent.resizeBehavior.updateResizeMinimums(shape.parent);
//    }
//    shape.parent = null;
//};
///**
// * Sets the position of the shape, and append its html
// * @param {PMUI.draw.BehavioralElement} container element implementing this behavior
// * @param {PMUI.draw.Shape} shape shape added to the container
// * @param {number} x x coordinate of the position that will be set relative to
// * the container
// * @param {number} y y coordinate of the position that will be set relative to
// * the container
// * @chainable
// */
//ActivityContainerBehavior.prototype.addShape = function (container, shape, x, y) {
//    shape.setPosition(x, y);
//    //insert the shape HTML to the DOM
//    container.getHTML().appendChild(shape.getHTML());
//
//    shape.updateHTML();
//    shape.paint();
//    shape.applyBehaviors();
//    //shape.defineEvents();
//    shape.attachListeners();
//    return this;
//
//};


/**
 * @class PMUI.behavior.ContainerDropBehavior
 * Encapsulates the drop behavior of a container
 * @extends PMUI.behavior.DropBehavior
 *
 * @constructor
 * Creates a new instance of the class
 * @param {Array} [selectors=[]] css selectors that this drop behavior will
 * accept
 */
var PMActivityDropBehavior = function (selectors) {
    PMUI.behavior.DropBehavior.call(this, selectors);

};
PMActivityDropBehavior.prototype = new PMUI.behavior.DropBehavior();
//PMUI.inheritFrom('PMUI.behavior.DropBehavior', ContainerDropBehavior);
/**
 * Type of the instances
 * @property {String}
 */
PMActivityDropBehavior.prototype.type = "PMActivityDropBehavior";
/**
 * Default selectors for this drop behavior
 * @property {String}
 */
PMActivityDropBehavior.prototype.defaultSelector = ".custom_shape";

/**
 * On drop handler for this drop behavior, creates shapes when dropped from the
 * toolbar, or move shapes among containers
 * @param {PMUI.draw.Shape} shape
 * @return {Function}
 */
PMActivityDropBehavior.prototype.onDrop = function (shape) {
    return function (e, ui) {
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
        shape.layers.getFirst().removeCSSClasses(['dropableClass']);
        if (!shape.isValidDropArea) {
            return false;
        }

        shape.entered = false;
        if (ui.helper && ui.helper.attr('id') === "drag-helper") {
            return false;
        }
        id = ui.draggable.attr('id');

        customShape = canvas.shapeFactory(id);
        if (customShape === null) {
            customShape = canvas.customShapes.find('id', id);
            if (!customShape || !shape.dropBehavior.dropHook(shape, e, ui)) {
                return false;
            }

            if (!(customShape.parent &&
                customShape.parent.id === shape.id)) {

                selection = canvas.currentSelection;
                for (i = 0; i < selection.getSize(); i += 1) {
                    sibling = selection.get(i);
                    coordinates = PMUI.getPointRelativeToPage(sibling);
                    coordinates = PMUI.pageCoordinatesToShapeCoordinates(shape, null,
                        coordinates.x, coordinates.y, customShape);
                    shapesAdded.push({
                        shape: sibling,
                        container: shape,
                        x: coordinates.x,
                        y: coordinates.y,
                        topLeft: false
                    });
                }
                command = new PMUI.command.CommandSwitchContainer(shapesAdded);
                command.execute();
                canvas.commandStack.add(command);
                canvas.multipleDrop = true;

            }
            shape.setBoundary(customShape, customShape.numberRelativeToActivity);
            //this.setNumber(numBou);

            // fix resize minWidth and minHeight and also fix the dimension
            // of this shape (if a child made it grow)
            //shape.updateDimensions(10);
            canvas.hideAllFocusLabels();
            canvas.updatedElement = null;

        } else {
            coordinates = PMUI.pageCoordinatesToShapeCoordinates(shape, e,null,null,customShape);
            if (PMUI.validCoordinatedToCreate(shape, e, customShape)) {
                shape.addElement(customShape, coordinates.x, coordinates.y,
                    customShape.topLeftOnCreation);

                //since it is a new element in the designer, we triggered the
                //custom on create element event
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

                }
                canvas.hideAllFocusLabels();
            }
        }
    };
};


PMActivityDropBehavior.prototype.setSelectors = function (selectors, overwrite) {
    PMUI.behavior.DropBehavior.prototype
        .setSelectors.call(this, selectors, overwrite);
    this.selectors.push(".port");
    //this.selectors.push(".custom_shape");
    return this;
};



PMActivityDropBehavior.prototype.onDragEnter = function (customShape) {
    return function (e, ui) {
    	var sourceShape = customShape.canvas.dragConnectHandlers.get(0).relativeShape.parent;
   	 	if(customShape.parent.extendedType==="CONCURRENT"){
	   		//if(sourceShape.parent.extendedType !== "CONCURRENT")
   	 	 if(customShape.parent.id!==sourceShape.parent.id)
	   			return ;
	    };
        var shapeRelative, i;
        if (customShape.extendedType !== "PARTICIPANT") {
            if (ui.helper && ui.helper.hasClass("dragConnectHandler")) {
                if (customShape.extendedType !== "TEXT_ANNOTATION") {
                    shapeRelative = customShape.canvas.dragConnectHandlers.get(0).relativeShape;
                    if (shapeRelative.id !== customShape.id) {
                        //for (i = 0; i < customShape.canvas.dropConnectHandlers.getSize(); i += 1) {
                        for (i = 0; i < 4; i += 1) {
                            customShape.showConnectDropHelper(i, customShape);
                        }
                    }
                } else {
                    if (customShape.extendedType !== "H_LABEL" && customShape.extendedType !== "V_LABEL") {
                        shapeRelative = customShape.canvas.dragConnectHandlers.get(3).relativeShape;
                        if (shapeRelative.id !== customShape.id) {
                            customShape.canvas.hideDropConnectHandlers();
                            customShape.showConnectDropHelper(3, customShape);
                        }
                    }
                }
            } else {
                //coordinates = PMUI.pageCoordinatesToShapeCoordinates(customShape, e, null, null, null);
                customShape.layers.getFirst().addCSSClasses(['dropableClass']);
                //customShape.isValidDropArea = false;
                return false;
            }
        } else {
            shapeRelative = customShape.canvas.dragConnectHandlers.get(0).relativeShape;

            if (shapeRelative.id !== customShape.id) {
                if (ui.helper && ui.helper.hasClass("dragConnectHandler")) {
                    //for (i = 0; i < customShape.canvas.dropConnectHandlers.getSize(); i += 1) {
                    for (i = 0; i < 10; i += 1) {
                        //shape.showConnectDragHelpers(i,shape);
                        connectHandler = customShape.canvas.dropConnectHandlers.get(i);
                        connectHandler.setDimension(18*customShape.canvas.getZoomFactor(),18*customShape.canvas.getZoomFactor());
                        //connectHandler.setPosition(customShape.getZoomX()+customShape.xMidPoints[i] - connectHandler.width/2 - 1, customShape.getZoomY()+customShape.yMidPoints[i] - connectHandler.height/2 - 1);
                        connectHandler.setPosition(customShape.getZoomX()+ i*customShape.getZoomWidth()/10 , customShape.getZoomY()-connectHandler.height/2 -1);
                        connectHandler.relativeShape = customShape;
                        connectHandler.attachDrop();
                        //connectHandler.paint();
                        connectHandler.setVisible(true);
                    }

                    for (i = 0; i < 10; i += 1) {
                        //shape.showConnectDragHelpers(i,shape);
                        connectHandler = customShape.canvas.dropConnectHandlers.get(i+10);
                        connectHandler.setDimension(18*customShape.canvas.getZoomFactor(),18*customShape.canvas.getZoomFactor());
                        //connectHandler.setPosition(customShape.getZoomX()+customShape.xMidPoints[i] - connectHandler.width/2 - 1, customShape.getZoomY()+customShape.yMidPoints[i] - connectHandler.height/2 - 1);
                        connectHandler.setPosition(customShape.getZoomX()+ i*customShape.getZoomWidth()/10 , customShape.getZoomY()+ customShape.getZoomHeight()-connectHandler.height/2 -1);
                        connectHandler.relativeShape = customShape;
                        connectHandler.attachDrop();
                        //connectHandler.paint();
                        connectHandler.setVisible(true);
                    }
                } else {

                    console.log(customShape);
                }
            }
        }
    }
};
PMActivityDropBehavior.prototype.onDragLeave = function (shape) {
    return function (e, ui) {
        shape.layers.getFirst().removeCSSClasses(['dropableClass']);
    };
};