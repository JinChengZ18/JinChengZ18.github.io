

/**
 * @class Snapper
 * Class snapper represents the helper shown while moving shapes.
 * @extend JCoreObject
 *
 * @constructor Creates an instance of the class Snapper
 * @param {Object} options Initialization options
 * @cfg {Point} [orientation="horizontal"] The default orientation of this snapper
 */
var PMSnapper = function (options) {
    PMUI.draw.Snapper.call(this, options);
    /**
     * Orientation of this snapper, it can be either "horizontal" or "vertical".
     * @property {string} [orientation=null]
     */
    this.orientation = null;
    /**
     * Data saved to define the positioning of this snapper in the canvas.
     * @property {Array} [data=[]]
     */
    this.data = [];
    /**
     * The visibility of this snapper.
     * @property {boolean} [visible=false]
     */
    this.visible = false;

    PMSnapper.prototype.initObject.call(this, options);
};

PMSnapper.prototype = new PMUI.draw.Snapper();

/**
 * The type of each instance of this class
 * @property {String}
 */
PMSnapper.prototype.type = "Snapper";

/**
 * Instance initializer which uses options to extend the config options to initialize the instance.
 * @param {Object} options The object that contains the config
 * @private
 */
PMSnapper.prototype.initObject = function (options) {

    var defaults = {
        orientation: "horizontal"
    };

    // extend recursively the defaultOptions with the given options
    $.extend(true, defaults, options);

    // call setters using the defaults object
    this.setOrientation(defaults.orientation);
    this.setDimension(defaults.width,defaults.height);

    // create the html (it's hidden initially)
    this.hide();
};
PMSnapper.prototype.getHTML = function () {
    if (!this.html) {
        this.createHTML();
    }
    return this.html;
};
/**
 * Creates the HTML representation of the snapper.
 * @returns {HTMLElement}
 */
PMSnapper.prototype.createHTML = function () {
    if (!this.html) {
        this.html = document.createElement("div");
        
        this.style.applyStyle();
        this.style.addProperties({
            position: "absolute",
            left: this.zoomX,
            top: this.zoomY,
            width: this.zoomWidth,
            height: this.zoomHeight,
            zIndex: this.zOrder
        });

        this.html.id = this.id;
        this.canvas.html.appendChild(this.html);
        this.setZOrder(99);
        this.html.className = 'mafe-snapper';

        if(this.getOrientation() === 'horizontal') {
            this.html.id = 'guide-h';
            this.html.style.borderTop = '1px dashed #55f';
            this.html.style.width = '100%';
            //this.html.style.position = "absolute"
        } else {
            this.html.id = 'guide-v';
            this.html.style.borderLeft = '1px dashed #55f';
            this.html.style.height = '100%';
            //this.html.style.position = "absolute"
        }

        
    }
    return this.html;
};

/**
 * Hides the snapper.
 * @chainable
 */
PMSnapper.prototype.hide = function () {
    this.visible = false;
    this.setVisible(this.visible);
    return this;
};

/**
 * Shows the snapper.
 * @chainable
 */
PMSnapper.prototype.show = function () {
    this.visible = true;
    this.setVisible(this.visible);
    return this;
};

/**
 * Fills the data for the snapper (using customShapes and regularShapes).
 * The data considered for each shape is:
 *
 * - Its absoluteX
 * - Its absoluteY
 * - Its absoluteX + width
 * - Its absoluteY + height
 *
 * @chainable
 */
PMSnapper.prototype.createSnapData = function () {
    var i,
        index = 0,
        shape,
        border = 0;

    // clear the data before populating it
    this.data = [];

    // populate the data array using the customShapes
    for (i = 0; i < this.canvas.customShapes.getSize(); i += 1) {
        shape = this.canvas.customShapes.get(i);
        if (!this.canvas.currentSelection.find('id', shape.getID())) {
            border = parseInt($(shape.getHTML()).css('borderTopWidth'), 10);
            if (this.orientation === 'horizontal') {
                this.data[index * 2] = shape.getAbsoluteY() - border;
                this.data[index * 2 + 1] = shape.getAbsoluteY() + shape.getZoomHeight();
            } else {
                this.data[index * 2] = shape.getAbsoluteX() - border;
                this.data[index * 2 + 1] = shape.getAbsoluteX() + shape.getZoomWidth();
            }
            index += 1;
        }

    }

    // populate the data array using the regularShapes
    for (i = 0; i < this.canvas.regularShapes.getSize(); i += 1) {
        shape = this.canvas.regularShapes.get(i);
        border = parseInt($(shape.getHTML()).css('borderTopWidth'), 10);
        if (this.orientation === 'horizontal') {
            this.data[index * 2] = shape.getAbsoluteY() - border;
            this.data[index * 2 + 1] = shape.getAbsoluteY() +
                shape.getZoomHeight();
        } else {
            this.data[index * 2] = shape.getAbsoluteX() - border;
            this.data[index * 2 + 1] = shape.getAbsoluteX() +
                shape.getZoomWidth();
        }
        index += 1;
    }
    return this;
};
/**
 * Sorts the data using the builtin `sort()` function, so that there's an strictly increasing order.
 * @chainable
 */
PMSnapper.prototype.sortData = function () {
    this.data.sort(function (a, b) {
        return a > b;
    });
    return this;
};

/**
 * Performs a binary search for `value` in `this.data`, return true if `value` was found in the data.
 * @param {number} value
 * @return {boolean}
 */
PMSnapper.prototype.binarySearch = function (value) {
    var low = 0,
        up = this.data.length - 1,
        mid;

    while (low <= up) {
        mid = parseInt((low + up) / 2, 10);
        if (this.data[mid] === value) {
            return value;
        }
        if (this.data[mid] > value) {
            up = mid - 1;
        } else {
            low = mid + 1;
        }
    }
    return false;
};

/**
 * Attaches listeners to this snapper, currently it only has the
 * mouseMove event which hides the snapper.
 * @param {Snapper} snapper
 * @chainable
 */
PMSnapper.prototype.attachListeners = function (snapper) {
    var $snapper = $(snapper.html).mousemove(
        function () {
            snapper.hide();
        }
    );
    return this;
};

/**
 * Sets the orientation of this snapper.
 * @param {string} orientation
 * @chainable
 */
PMSnapper.prototype.setOrientation = function (orientation) {
    if (orientation === "horizontal" || orientation === "vertical") {
        this.orientation = orientation;
    } else {
        throw new Error("setOrientation(): parameter is not valid");
    }
    return this;
};

/**
 * Gets the orientation of this snapper.
 * @return {string}
 */
PMSnapper.prototype.getOrientation = function () {
    return this.orientation;
};

var PMCanvas = function (options) {
    PMUI.draw.Canvas.call(this, options);
    this.project = null;
    this.items = null;
    /**
     * Minimum distance to "snap" to a guide
     * @type {number}
     */
    //lv.yz  4---> 20;//从上下对齐改为中心点对齐
    this.MIN_DISTANCE = 10;
    /**
     * Array which contains a list of all coordinates  to snap
     * @type {number}
     */
    this.guides = []; // no guides available ...

    this.attachedListeners = null;

    this.hasClickEvent = false;
    this.isDragging = false;
    this.isGridLine = true;
    this.dragConnectHandlers = new PMUI.util.ArrayList();
    this.dropConnectHandlers = new PMUI.util.ArrayList();
    this.isDraggingConnectHandler = false;
    this.businessObject = {};
    this.isMouseOverHelper = false;
    this.canConnect = false;
    this.canCreateShape = false;
    this.canCreateShapeType = null;
    this.canCreateShapeClass = null;
    this.shapeHelper = null;
    this.coronaClick = false;
    this.connectStartShape = null;
    this.coronaShape = null;
    this.lassoEnabled = false;
    this.dimensionX=0;
    this.dimensionY=0;
    this.rightestPointX = 0;
    this.downestPointY = 0;
    PMCanvas.prototype.init.call(this, options);
};

PMCanvas.prototype = new PMUI.draw.Canvas();

PMCanvas.prototype.type = "PMCanvas";

this.canvasContainerBehavior = null;

PMCanvas.prototype.init = function (options) {
	
    var defaults = {
        project: null,
        snapToGuide : true,
        enabledMenu: false,
        hasClickEvent: false
    };
    jQuery.extend(true, defaults, options);
    this.setProject(defaults.project)
        .setEnabledMenu(defaults.enabledMenu)
        .setHasClickEvent(defaults.hasClickEvent)
        .setSnapToGuide(defaults.snapToGuide);

    this.items = new PMUI.util.ArrayList();
    this.attachedListeners = false;
};
/**
 * 设置分支上节点的所有branchId
 * */

PMCanvas.batchSetBranchId=function (targetShape,branchId){

	var connections = targetShape.canvas.getConnections();
    for (i = 0; i < connections.getSize(); i +=1) {
        if (connections.get(i).getSrcPort().parent.getID() === targetShape.getID()) {
        	var nextNode=connections.get(i).getDestPort().parent;
        	this.batchSetBranchId(nextNode, branchId);
        }
    }
    targetShape.setBranchId(branchId);
}
PMCanvas.prototype.setDimentionX = function  (value) {
	if(this.dimensionX<value)
		this.dimensionX = value;
    return this;
};
PMCanvas.prototype.getDimentionX = function  () {
    return this.dimensionX;
};
PMCanvas.prototype.setDimentionY = function  (value) {
	if(this.dimensionY<value)
		this.dimensionY = value;
    return this;
};
PMCanvas.prototype.getDimentionY = function  () {
    return this.dimensionY;
};
PMCanvas.prototype.getRightestPointX = function(){
	return this.rightestPointX;
}
PMCanvas.prototype.getDownestPointY = function(){
	return this.downestPointY;
}
PMCanvas.prototype.setRightestPointX = function(value){
	this.rightestPointX = value;
}
PMCanvas.prototype.setDownestPointY = function(value){
	this.downestPointY = value;
}
PMCanvas.prototype.setHasClickEvent = function  (value) {
    this.hasClickEvent = value;
    return this;
};
PMCanvas.prototype.setEnabledMenu = function  (value) {
    this.enabledMenu = value;
    return this;
};
PMCanvas.prototype.setParent = function (parent) {
    this.parent = parent;
    return this;
};

PMCanvas.prototype.setProject = function (project) {
    if (project instanceof PMProject) {
        this.project = project;
    }
    return this;
};
PMCanvas.prototype.onCreateElementHandler = function (element) {
    var id,
        label,
        menuElement;
    if (this.project) {

        this.project.addElement(element);
        if (!this.project.loadingProcess) {
            //this.project.updateElement([]);
            if (element.relatedObject && (element.relatedObject.type === 'PMPool'
                || element.relatedObject.type === 'PMActivity')) {
                element.relatedObject.canvas.emptyCurrentSelection();
                element.relatedObject.canvas.addToSelection(element.relatedObject);
            }
        }
        if (element.type === "Connection") {
             return;
        }
    }
};

/**
 * Factory of canvas behaviors. It uses lazy instantiation to create
 * instances of the different container behaviors
 * @param {String} type An string that specifies the container behavior we want
 * an instance to have, it can be regular or nocontainer
 * @return {ContainerBehavior}
 */
PMCanvas.prototype.containerBehaviorFactory = function (type) {
    if (type === 'pmcanvas') {
        if (!this.canvasContainerBehavior) {
            this.canvasContainerBehavior = new CanvasContainerBehavior();
        }
        return this.canvasContainerBehavior;
    } else {
        return PMShape.prototype.containerBehaviorFactory.call(this, type);
    }
};

PMCanvas.prototype.dropBehaviorFactory = function (type, selectors) {
    if (type === 'canvasdrop') {
        if (!this.pmConnectionDropBehavior) {
            this.pmConnectionDropBehavior = new PMContainerDropBehavior(selectors);
        }
        return this.pmConnectionDropBehavior;
    } else {
        return PMUI.draw.CustomShape.prototype.dropBehaviorFactory.call(this, type, selectors);
    }
};

PMCanvas.prototype.triggerTextChangeEvent = function (element, oldText, newText) {
    var valid, reg, e, nText, mp, id;
    if (element.parent.getType() === 'PMActivity' && !this.validateName(element, newText, oldText)) {
        newText = oldText;
    }
    reg = /<[^\s]/g;
    nText = newText.trim();
    e = reg.test(nText);
    if (e) {
        nText = nText.replace(/</g, '< ');
    }

    this.updatedElement = [{
        id : element.parent.id,
        type : element.parent.type,
        parent : element.parent,
        fields : [{
            field : "name",
            oldVal : oldText,
            newVal : nText
        }]
    }];
    element.parent.setName(nText);
    element.updateDimension();
    element.parent.setBPPMName(nText);
    if (element.parent.atachedDiagram) {
        //var options = PMDesigner.canvasList.options;
        //console.log(options);
        id = PMDesigner.canvasList.getID();
        $('#' + id + ' option[value=' + element.parent.atachedDiagram.getID() + ']')
            .text(nText);
    }

    jQuery(this.html).trigger("changeelement");
};

PMCanvas.prototype.triggerConnectionStateChangeEvent = function (connection) {
    var points = [],
            Point = PMUI.util.Point,
            point,
            i;
    connection.savePoints();

    for (i = 0; i < connection.points.length; i += 1) {
        point = connection.points[i];
        points.push(new Point(point.x / this.zoomFactor, point.y / this.zoomFactor));
    }
    this.updatedElement = [{
        id: connection.getID(),
        type: connection.type,
        fields: [
            {
                field: 'state',
                oldVal: connection.getOldPoints(),
                newVal: points
            }
        ],
        relatedObject: connection
    }];
    connection.algorithm = 'user';
    $(this.html).trigger('changeelement');
    return this;
};

PMCanvas.prototype.triggerUserStateChangeEvent = function (connection) {
    var points = [],
        Point = PMUI.util.Point,
        point,
        i;
    connection.savePoints();
    for (i = 0; i < connection.points.length; i += 1) {
        point = connection.points[i];
        points.push(new Point(point.x / this.zoomFactor, point.y / this.zoomFactor));
    }
    this.updatedElement = [{
        id: connection.getID(),
        type: connection.type,
        fields: [
            {
                field: 'state',
                oldVal: connection.getOldPoints(),
                newVal: points
            }
        ],
        relatedObject: connection
    }];
    connection.algorithm = 'user';
    return this;
};

PMCanvas.prototype.updateDimensionLabel = function (element) {
    var width,
    width = element.relatedObject.width;
    newWidth = Math.max(width, this.zoomWidth);
    element.relatedObject.label.setWidth(width);
    return this;
};
PMCanvas.prototype.onChangeElementHandler = function (element) {
    var textNode,
        currentElement;
    if (this.project && element.length > 0) {
        try {
            this.project.updateElement(element);

        } catch (e) {
            throw new Error( "Error, There are problems updating the element", e );
        }
    }
};
PMCanvas.prototype.onRemoveElementHandler = function (element) {
    var i;
    if (this.project) {

        this.project.removeElement(element);

        //PMDesigner.moddle.toXML(PMDesigner.businessObject, function(err, xmlStrUpdated) {
        //    // xmlStrUpdated contains new id and the added project
        //
        //});
        try {
            for (i = 0; i < element.length; i++) {
                if (element[i].type === "Connection") {
                    break;
                }
            }
        } catch(e){
            throw new Error( "Error, There are problems removing the element", e );
        }
    }
};
PMCanvas.prototype.onSelectElementHandler = function (element) {
    PMUI.removeCurrentMenu();
    if (element.length === 1) {
        switch(element[0].type) {
            case 'PMActivity':
            case 'PMEvent':
            case 'PMGateway':
                break;
        }

    }
    if(this.currentLabel != null){
        //if(this.canvas.getCurrentSelection().getSize() > 0
        //&& this.canvas.getCurrentSelection().asArray()[0].label != this.currentLabel) {
            this.hideAllFocusedLabels();
        //}
    }
    this.isSelected = true;
    //this.hideDragConnectHandlers();
    return this;
};

PMCanvas.prototype.defineEvents = function () {
    return PMUI.draw.Canvas.prototype.defineEvents.call(this);
};
PMCanvas.prototype.getContextMenu = function (){
    return {
    };
};
PMCanvas.prototype.onRightClick = function (){
    var that = this;
    return function (a,b,c){
        /*that.menu = new PMUI.ui.Menu(c.getContextMenu());
        document.body.appendChild(that.menu.getHTML());
        that.menu.setPosition(b.pageX, b.PageY);
        that.menu.defineEvents();*/
    };
};
/**
 * Set guide Lines to canvas and create vertican and horizontal snappers
 * @param {Boolean} snap new value to verify if canvas has enabled snappes
 * @chainable
 */
PMCanvas.prototype.setSnapToGuide = function (snap) {
    this.snapToGuide = snap;
    // create snappers

        this.horizontalSnapper = new PMSnapper({
            orientation: 'horizontal',
            canvas: this,
            width : 4000,
            height: 1
        });


        this.verticalSnapper = new PMSnapper({
            orientation: 'vertical',
            canvas: this,
            width : 1,
            height :4000
        });

    return this;
};
/**
 * Build the data of the snappers recreating the arrays,
 * this method is called from {@link RegularDragBehavior#onDragStart} (it might
 * be an overrided method `onDragStart` if the instance of {@link RegularDragBehavior} was changed).
 * @chainable
 */
PMCanvas.prototype.startSnappers = function (event) {
    var shape, i, parent;
    this.horizontalSnapper.getHTML();
    this.verticalSnapper.getHTML();
    this.guides = [];
    for (i = 0; i < this.customShapes.getSize(); i += 1) {
        shape = this.customShapes.get(i);
        if (!this.currentSelection.find('id', shape.getID())) {
            this.computeGuidesForElement(shape);
        }
    }
    return this;

};

PMCanvas.prototype.computeGuidesForElement = function (shape) {
	//lv.yz 修改 下面有备份
    var x = shape.getAbsoluteX(), y = shape.getAbsoluteY(),
    //var x = jQuery(shape.html).offset().left, 
    //    y = jQuery(shape.html).offset().top,
        w, h,
        centerX,centerY;

    w = shape.getZoomWidth() - 1;
    h = shape.getZoomHeight() - 1;
    centerX = x+shape.getZoomWidth()/2;//从上下对齐改为中心点对齐
    centerY = y+shape.getZoomHeight()/2;//从上下对齐改为中心点对齐
    this.guides.push(//从上下对齐改为中心点对齐
        { type: "h", x: centerX, y: centerY },
//        { type: "h", x: x, y: y + h },
        { type: "v", x: centerX, y: centerY }
//        { type: "v", x: x + w, y: y }
    );
    return this;
};
//PMCanvas.prototype.computeGuidesForElement = function (shape) {
//    var x = shape.getAbsoluteX(), y = shape.getAbsoluteY(),
//    //var x = jQuery(shape.html).offset().left, 
//    //    y = jQuery(shape.html).offset().top,
//        w, h;
//
//    w = shape.getZoomWidth() - 1;
//    h = shape.getZoomHeight() - 1;
//    this.guides.push(
//        { type: "h", x: x, y: y },
//        { type: "h", x: x, y: y + h },
//        { type: "v", x: x, y: y },
//        { type: "v", x: x + w, y: y }
//    );
//    return this;
//};

/**
 * Process the snappers according to this criteria and show and hide:
 *
 * - To show the vertical snapper
 *      - `shape.absoluteX` must equal a value in the data of `this.verticalSnapper`
 *      - `shape.absoluteX + shape.width` must equal a value in the data of `this.verticalSnapper`
 *
 * - To show the horizontal snapper
 *      - `shape.absoluteY` must equal a value in the data of `this.horizontalSnapper`
 *      - `shape.absoluteY + shape.height` must equal a value in the data of `this.horizontalSnapper`
 *
 * @param {Object} e
 * @parem {Object} ui
 * @param {Shape} customShape
 * @chainable
 */
PMCanvas.prototype.processGuides = function (e, ui, customShape){
    // iterate all guides, remember the closest h and v guides
    var guideV,
        guideH,
        distV = this.MIN_DISTANCE + 1,
        distH = this.MIN_DISTANCE + 1,
        offsetV,
        offsetH,
        mouseRelX,
        mouseRelY,
        pos,
        w = customShape.getZoomWidth() - 1,
        h = customShape.getZoomHeight() - 1,
        d;

    mouseRelY = e.originalEvent.pageY - ui.offset.top;//鼠标相对于customShape的y(offset是相对于文档的偏移shu)
    mouseRelX = e.originalEvent.pageX - ui.offset.left;//鼠标相对于customShape的x
    pos = {//鼠标位置-canvas.top值-鼠标相对customShape(可能为负)=customShape相对于cavas顶部的y
    		top: e.originalEvent.pageY - customShape.canvas.getY() - mouseRelY
          + customShape.canvas.getTopScroll(),//customShape相对于cavas顶部的y
          	left: e.originalEvent.pageX - customShape.canvas.getX() - mouseRelX
          + customShape.canvas.getLeftScroll()//customShape相对于cavas顶部的x
    };
    $.each(this.guides, function (i, guide) {//从上下对齐改为中心点对齐 dante
        if (guide.type === "h"){//guide是画布上其他节点的中点坐标信息
            d = Math.abs(pos.top - guide.y + h/2);//customShape顶点+高度/2-其他节点的中点
            if (d < distH) {
                distH = d;
                guideH = guide;
                offsetH = h/2;
            }
        }
        if (guide.type === "v") {//从上下对齐改为中心点对齐
            d = Math.abs(pos.left - guide.x + w/2);
            if (d < distV) {
                distV = d;
                guideV = guide;
                offsetV = w/2;
            }
        }
    });
    
    if (distH <= this.MIN_DISTANCE) {
        $("#guide-h").css("top", guideH.y-this.absoluteY).show();
        if (customShape.parent.family !== 'canvas') {
            ui.position.top = guideH.y - offsetH - customShape.parent.getAbsoluteY()-1;//移动customShape位置
        } else {
            ui.position.top = guideH.y - offsetH-1;//从上下对齐改为中心点对齐
        }
    } else {
        $("#guide-h").hide();
    }

    if (distV <= this.MIN_DISTANCE) {
        $("#guide-v").css("left", guideV.x-this.absoluteX).show();
        if (customShape.parent.family !== 'canvas') {
            ui.position.left = guideV.x - offsetV - customShape.parent.getAbsoluteX()-1;//从上下对齐改为中心点对齐
        } else {
            ui.position.left = guideV.x - offsetV-1;//从上下对齐改为中心点对齐
        }

    } else{
        $("#guide-v").hide();
    }
    return this;
};

/**
 * Fires the {@link PMUI.draw.Canvas#event-changeelement} event, and elaborates the structure of the object that will
 * be passed to the handlers, the structure contains the following fields (considering old values and new values):
 *
 * - x
 * - y
 * - parent (the shape that is parent of this shape)
 * - state (of the connection)
 *
 * @param {PMUI.draw.Port} port The port updated
 * @chainable
 */
PMCanvas.prototype.triggerPortChangeEvent = function (port) {
    var direction = port.connection.srcPort.getID() === port.getID() ?
            "src" : "dest",
        map = {
            src: {
                x: "x1",
                y: "y1",
                parent: "element_origin",
                type: 'element_origin_type'
            },
            dest: {
                x: "x2",
                y: "y2",
                parent: "element_dest",
                type: 'element_dest_type'
            }
        },
        point,
        state,
        zomeedState = [],
        i;
    port.connection.savePoints();
    state = port.connection.getPoints();

    for (i = 0; i < state.length; i += 1) {
        point = port.connection.points[i];
        zomeedState.push(new PMUI.util.Point(point.x / this.zoomFactor, point.y / this.zoomFactor));
    }
    point = direction === "src" ? zomeedState[0] : zomeedState[state.length - 1];

    this.updatedElement = [{
        id: port.connection.getID(),
        type: port.connection.type,
        fields: [
            {
                field: map[direction].x,
                oldVal: point.x,        // there's no old value
                newVal: point.x
            },
            {
                field: map[direction].y,
                oldVal: point.y,        // there's no old value
                newVal: point.y
            },
            {
                field: map[direction].parent,
                oldVal: (port.getOldParent()) ? port.getOldParent().getID() : null,
                newVal: port.getParent().getID()
            },
            {
                field: map[direction].type,
                oldVal: port.connection.getNativeType(port.getParent()).type,
                newVal: port.connection.getNativeType(port.getParent()).type
            },
            {
                field: "state",
                oldVal: port.connection.getOldPoints(),
                newVal: zomeedState
            },
            {
                field: "condition",
                oldVal: "",
                newVal: port.connection.getFlowCondition()
            }
        ],
        relatedObject: port
    }];
    $(this.html).trigger('changeelement');
    //this.hideDragConnectHandlers();
};

/**
 * Attaches event listeners to this canvas, it also creates some custom triggers
 * used to save the data (to send it to the database later).
 *
 * The events attached to this canvas are:
 *
 * - {@link PMUI.draw.Canvas#event-mousedown Mouse down event}
 * - {@link PMUI.draw.Canvas#event-mousemove Mouse move event}
 * - {@link PMUI.draw.Canvas#event-mouseup Mouse up event}
 * - {@link PMUI.draw.Canvas#event-click Click event}
 * - {@link PMUI.draw.Canvas#event-scroll Scroll event}
 *
 * The custom events are:
 *
 * - {@link PMUI.draw.Canvas#event-createelement Create element event}
 * - {@link PMUI.draw.Canvas#event-removeelement Remove element event}
 * - {@link PMUI.draw.Canvas#event-changeelement Change element event}
 * - {@link PMUI.draw.Canvas#event-selectelement Select element event}
 * - {@link PMUI.draw.Canvas#event-rightclick Right click event}
 *
 * This method also initializes jQueryUI's droppable plugin (instantiated as `this.dropBehavior`)
 * @chainable
 */
PMCanvas.prototype.attachListeners = function () {
    if (this.attachedListeners === false) {
        var $canvas = $(this.html).click(this.onClick(this)),
        $canvasContainer = $canvas.parent();
        $canvas.dblclick(this.onDblClick(this));
        $canvas.mousedown(this.onMouseDown(this));
        $canvasContainer.scroll(this.onScroll(this, $canvasContainer));
        if (!this.readOnly) {
            $canvas.mousemove(this.onMouseMove(this));
            $canvas.mouseup(this.onMouseUp(this));
            //$canvas.mouseup(this.onMouseLeave(this));
        }

        $canvas.on("createelement", this.onCreateElement(this));
        $canvas.on("removeelement", this.onRemoveElement(this));
        $canvas.on("changeelement", this.onChangeElement(this));
        $canvas.on("selectelement", this.onSelectElement(this));
        $canvas.on("rightclick", this.onRightClick(this));
        $canvas.on("contextmenu", function (e) {
            e.preventDefault();
        });
        this.updateBehaviors();
        this.attachedListeners = true;
    }
    return this;
};
/**
 * enpty current selection extended
 * @returns {PMCanvas}
 */
PMCanvas.prototype.emptyCurrentSelection = function () {
    PMUI.draw.Canvas.prototype.emptyCurrentSelection.call(this);
    this.hideAllCoronas();
    return this;
};
/**
 * mouse move custom behavior
 * @param canvas
 * @returns {Function}
 */
PMCanvas.prototype.onMouseMove = function (canvas) {
    return function (e, ui){
        if (canvas.lassoEnabled && canvas.isMouseDown && !canvas.rightClick) {
            canvas.isMouseDownAndMove = true;
            var x = e.pageX - canvas.getX() + canvas.getLeftScroll() - canvas.getAbsoluteX(),
                y = e.pageY - canvas.getY() + canvas.getTopScroll() - canvas.getAbsoluteY(),
                topLeftX,
                topLeftY,
                bottomRightX,
                bottomRightY;
            topLeftX = Math.min(x, canvas.multipleSelectionHelper.oldX);
            topLeftY = Math.min(y, canvas.multipleSelectionHelper.oldY);
            bottomRightX = Math.max(x, canvas.multipleSelectionHelper.oldX);
            bottomRightY = Math.max(y, canvas.multipleSelectionHelper.oldY);
            canvas.multipleSelectionHelper.setPosition(
                topLeftX / canvas.zoomFactor,
                topLeftY / canvas.zoomFactor
            );
            canvas.multipleSelectionHelper.setDimension(
                (bottomRightX - topLeftX) / canvas.zoomFactor,
                (bottomRightY - topLeftY) / canvas.zoomFactor
            );

        } else if (canvas.canConnect) {
            canvas.connectHelper(e)
            canvas.connectStartShape.corona.hide();
            canvas.hideAllFocusedLabels();
        } else if (canvas.canCreateShape){
            canvas.createShapeHelper(e);
            //canvas.coronaClick = true;
            //如果在屏幕的右下边缘，扩大，缩小屏幕scrollbar
            if(e.target.id == canvas.id){//当前指向canvas时--e.target.className == "pmui ui-droppable"
            	
                var x = e.offsetX ,//* this.zoomFactor
                	y = e.offsetY ,//* this.zoomFactor
                	RIGHT_DISTANCE = 100,
                	BELOW_DISTANCE = 100,
                	newWidth = x +RIGHT_DISTANCE,
            		newHeight = y + BELOW_DISTANCE;
                if(newWidth > canvas.getWidth()){
                	canvas.setWidth(canvas.getWidth()+100);
                	var plusValue = canvas.getWidth() - e.offsetX -120;
                	$("html,body").animate({scrollLeft:($(document).scrollLeft()+plusValue)},500);
                }
                if(newHeight > canvas.getHeight()){
                	canvas.setHeight(canvas.getHeight()+100);
                	var plusValue = canvas.getHeight() - e.offsetY -120;
                	$("html,body").animate({scrollTop:($(document).scrollTop()+plusValue)},500);
                }
            }
            
        }

    };
};
/**
 * on mouse up behavior
 * @param canvas
 * @returns {Function}
 */
PMCanvas.prototype.onMouseUp = function (canvas) {
    return function (e, ui) {
        var realPoint,
            x,
            y;
        e.preventDefault();
        //e.stopPropagation();
        if (canvas.canCreateShape) {
            canvas.manualCreateShape(canvas ,e);
            canvas.canCreateShape = false;
            return true;
        }
        if (canvas.isMouseDownAndMove) {
            realPoint = canvas.relativePoint(e);
            x = realPoint.x;
            y = realPoint.y;
            canvas.multipleSelectionHelper.setPosition(
                Math.min(x, canvas.multipleSelectionHelper.zoomX) / canvas.zoomFactor,
                Math.min(y, canvas.multipleSelectionHelper.zoomY) / canvas.zoomFactor
            );
            if (canvas.multipleSelectionHelper) {
                canvas.multipleSelectionHelper.wrapElements();
            }
        } else {
            if (!canvas.multipleSelectionHelper.wasDragged) {
                canvas.multipleSelectionHelper.reset().setVisible(false);
            }
            if (canvas.isMouseDown) {
                canvas.onClickHandler(canvas, x, y);
            }
        }
        canvas.isMouseDown = false;
        canvas.isMouseDownAndMove = false;
        canvas.rightClick = false;
        $('.pmui').css("cursor",'');
        canvas.lassoEnabled = false;
    };
};
PMCanvas.prototype.createShapeHelper = function (e) {
    var realPoint = this.relativePoint(e);
    if (this.shapeHelper) {
        $(this.shapeHelper.html).remove();
    }
   
    this.shapeHelper = new CreateShapeHelper({
        x: realPoint.x * this.zoomFactor,
        y: realPoint.y * this.zoomFactor,
        parent: this,
        zOrder: 999,
        className: this.canCreateShapeClass
    });
    this.shapeHelper.paint();
};

PMCanvas.prototype.connectHelper = function (e) {
    var endPoint = {},
        realPoint,
        diff;

    if (this.canConnect) {
        if (this.connectionSegment) {
            //remove the connection segment in order to create another one
            $(this.connectionSegment.getHTML()).remove();
        }
        //start point
        this.startConnectionPoint = {
            x: this.connectStartShape.getAbsoluteX() + this.connectStartShape.xMidPoints[1],
            y: this.connectStartShape.getAbsoluteY() + this.connectStartShape.yMidPoints[1]
        };

        //Determine the point where the mouse currently is
        realPoint = this.relativePoint(e);

        endPoint.x = realPoint.x * this.zoomFactor;
        endPoint.y = realPoint.y * this.zoomFactor;

        endPoint.x += (endPoint.x - this.startConnectionPoint.x > 0) ? -5 : 5;
        endPoint.y += (endPoint.y - this.startConnectionPoint.y > 0) ? -5 : 5;
        this.connectionSegment = new PMUI.draw.Segment({
            startPoint: this.startConnectionPoint,
            endPoint: endPoint,
            //parent: canvas.connectStartShape.parent,
            parent: this,
            //zOrder: PMUI.util.Style.MAX_ZINDEX * 2
            zOrder: 9
        });
        this.connectionSegment.paint();
    }
};
/*连接线生成类*/
PMCanvas.prototype.connectProcedure = function (customShape, e) {
    var endPoint,
        tempPoint,
        initPoint,
        initPortPoint,
        i,
        endPort,
        sourcePort,
        distance = 99999999,
        connection,
        endPoint2,
        targetPoint;
    if (customShape.canvas.connectionSegment) {
        //remove the connection segment left
        $(customShape.canvas.connectionSegment.getHTML()).remove();

    }
    customShape.canvas.canConnect = false;
    $('body').css('cursor','default');

    //连接规则校验
    if (!PMDesigner.connectValidator.isValid(customShape.canvas.connectStartShape, customShape).result) {
        //show invalid message
        PMDesigner.msgFlash(PMDesigner.connectValidator.isValid(customShape.canvas.connectStartShape, customShape).msg, document.body, 'info', 3000, 5);
        return false;
    }
    if (((customShape.canvas.connectStartShape.extendedType === 'START') || (customShape.canvas.connectStartShape.extendedType === 'START' && (customShape.canvas.connectStartShape.evn_marker === 'MESSAGE'|| customShape.canvas.connectStartShape.evn_marker === 'TIMER'))) && !PMDesigner.connectValidator.oneToOneValidator(customShape.canvas.connectStartShape).result) {
        //show invalid message
        PMDesigner.msgFlash(PMDesigner.connectValidator.oneToOneValidator(customShape.canvas.connectStartShape, customShape).msg, document.body, 'info', 3000, 5);
        return false;
    }
    if (customShape.canvas.connectStartShape.getType() === 'PMActivity'
        && !customShape.getType() === 'PMArtifact'
        && !PMDesigner.connectValidator.oneToOneValidator(customShape.canvas.connectStartShape).result) {
        //show invalid message
        PMDesigner.msgFlash(PMDesigner.connectValidator.oneToOneValidator(customShape.canvas.connectStartShape, customShape).msg, document.body, 'info', 3000, 5);
        return false;
    }
    //end 校验
    sourcePort = new PMUI.draw.Port({
        width: 10,
        height: 10
    });
    endPort = new PMUI.draw.Port({
        width: 10,
        height: 10
    });
    endPoint = new PMUI.util.Point(//鼠标点--相对于customShape
        e.pageX - customShape.canvas.getX() - customShape.getAbsoluteX() + customShape.canvas.getLeftScroll(),
        e.pageY - customShape.canvas.getY() - customShape.getAbsoluteY() + customShape.canvas.getTopScroll()
    );
    endPoint2 = new PMUI.util.Point(//鼠标点--相对于canvas
        e.pageX - customShape.canvas.getX()  + customShape.canvas.getLeftScroll(),
        e.pageY - customShape.canvas.getY()  + customShape.canvas.getTopScroll()
    );
    //计算连线起始节点，应该用四个中点中的哪个
    //Shape.prototype.setDimension,xMidPoints[x,x,x,x],yMidPoints[y,y,y,y]
    //(xMidPoints[i],yMidPoints[i])[i=0-3],对应节点上，右，下，左四个边线的中点
    if(customShape.canvas.connectStartShape.extendedType == 'PARALLEL'|| 
    		customShape.extendedType == 'INCLUSIVE'){
    	//对于横向并发体，如果是从并发开始节点引出来的，则默认使用右侧的port
    	//对于纵向并发体，如果是从并发开始节点引出来的，则默认使用下侧的port
    	if(customShape.parent.getOrientation().toLowerCase()==="horizontal"){
    		initPoint =new  PMUI.util.Point(
                customShape.canvas.connectStartShape.xMidPoints[1],
                customShape.canvas.connectStartShape.yMidPoints[1]
            )
    	}else if(customShape.parent.getOrientation().toLowerCase()==="vertical"){
    		initPoint =new  PMUI.util.Point(
                customShape.canvas.connectStartShape.xMidPoints[2],
                customShape.canvas.connectStartShape.yMidPoints[2]
            )
    	}
    	
    }else{
    	for (i = 0; i < customShape.canvas.connectStartShape.xMidPoints.length; i += 1) {
            tempPoint = new  PMUI.util.Point(//开始节点的四个中点
                customShape.canvas.connectStartShape.getAbsoluteX() + customShape.canvas.connectStartShape.xMidPoints[i],
                customShape.canvas.connectStartShape.getAbsoluteY() + customShape.canvas.connectStartShape.yMidPoints[i]
            );
            if (distance > tempPoint.getSquaredDistance(endPoint2)) {//distance.default=999999;
                distance = tempPoint.getSquaredDistance(endPoint2);
                initPoint =new  PMUI.util.Point(
                    customShape.canvas.connectStartShape.xMidPoints[i],
                    customShape.canvas.connectStartShape.yMidPoints[i]
                )
            }
        }
    }
    //添加port,参数x,y是相对于左上点的偏移量
    customShape.canvas.connectStartShape.addPort(sourcePort, initPoint.x, initPoint.y);
    
    
    //计算连线终点，应该用哪个   通过连接线起始点的绝对坐标来算
    initPortPoint =new  PMUI.util.Point(
    		sourcePort.getAbsoluteX(),
    		sourcePort.getAbsoluteY()
        )
    distance = 99999999;
    if(customShape.canvas.connectStartShape.extendedType == 'PARALLEL' || 
    		customShape.extendedType == 'INCLUSIVE'){
    	//如果是从并发开始节点引出来的，则终点默认使用左侧的port
    	//或者是指向并发结束的
    	if(customShape.parent.getOrientation().toLowerCase()==="horizontal"){
    		targetPoint =new  PMUI.util.Point(
        		customShape.xMidPoints[3],
                customShape.yMidPoints[3]
            )
    	}else if(customShape.parent.getOrientation().toLowerCase()==="vertical"){
    		targetPoint =new  PMUI.util.Point(
            	customShape.xMidPoints[0],
                customShape.yMidPoints[0]
            )
    	}
    	
    }else{
    	for (i = 0; i < customShape.xMidPoints.length; i += 1) {
            tempPoint = new  PMUI.util.Point(//目标节点的四个中点
                customShape.getAbsoluteX() + customShape.xMidPoints[i],
                customShape.getAbsoluteY() + customShape.yMidPoints[i]
            );
            if (distance > tempPoint.getSquaredDistance(initPortPoint)) {//distance.default=999999;
                distance = tempPoint.getSquaredDistance(initPortPoint);
                targetPoint =new  PMUI.util.Point(
                    customShape.xMidPoints[i],
                    customShape.yMidPoints[i]
                )
            }
        }
    }
    customShape.addPort(endPort, targetPoint.x, targetPoint.y, false, sourcePort);
    
    
    connection = new PMFlow({
        srcPort : sourcePort,
        destPort: endPort,
        segmentColor: new PMUI.util.Color(0, 0, 0),
        name: " ",
        canvas : customShape.canvas,
        segmentStyle: customShape.connectionType.segmentStyle,
        flo_type: customShape.connectionType.type
    });
//装饰器---连接线的三角号
    connection.setSrcDecorator(new PMUI.draw.ConnectionDecorator({
        width: 11,
        height: 11,
        canvas: customShape.canvas,
        decoratorPrefix: (typeof customShape.connectionType.srcDecorator !== 'undefined'
        && customShape.connectionType.srcDecorator !== null) ?
            customShape.connectionType.srcDecorator : "mafe-decorator",
        decoratorType: "source",
        parent: connection
    }));

    connection.setDestDecorator(new PMUI.draw.ConnectionDecorator({
        width: 11,
        height: 11,
        canvas: customShape.canvas,
        decoratorPrefix: (typeof customShape.connectionType.destDecorator !== 'undefined'
        && customShape.connectionType.destDecorator !== null) ?
            customShape.connectionType.destDecorator : "mafe-decorator",
        decoratorType: "target",
        parent: connection
    }));
    connection.canvas.commandStack.add(new PMUI.command.CommandConnect(connection));
    
    // Filling PMFlow fields,改为先赋值origin和target的shape，后连接
    connection.setTargetShape(endPort.parent);
    connection.setOriginShape(sourcePort.parent);
    //connect the two ports
    connection.connect();
    connection.setSegmentMoveHandlers();
    customShape.canvas.addConnection(connection);
    connection.savePoints();
    // now that the connection was drawn try to create the intersections
    connection.checkAndCreateIntersectionsWithAll();

    //attaching port listeners
    sourcePort.attachListeners(sourcePort);
    endPort.attachListeners(endPort);

    // finally trigger createEvent
    customShape.canvas.triggerCreateEvent(connection, []);
//    
//    if(customShape.extendedType === 'CONCURRENT'){
//    	if((connection.destPort.x >= -10 && connection.destPort.x <= 10) || (connection.destPort.x >= customShape.getWidth()-10 && connection.destPort.x <= customShape.getWidth()+10)){
//    		customShape.changeDirection("horizontal");
//    	}else if((connection.destPort.y >= -10 && connection.destPort.y <= 10) || (connection.destPort.y >= customShape.getHeight()-10 && connection.destPort.y <= customShape.getHeight()+10)){
//    		customShape.changeDirection("vertical");
//    	}
//    }
};
/**
 * hides all corona shape
 */
PMCanvas.prototype.hideAllCoronas = function () {
    var i,
        shape;
    for(i = 0; i < this.currentSelection.getSize(); i += 1) {
        shape = this.currentSelection.get(i);
        shape.corona.hide();
        shape.setZOrder(2);
    }
};
/**
 * cancel connection action
 */
PMCanvas.prototype.cancelConnect = function () {
    if (this.connectionSegment){
        $(this.connectionSegment.getHTML()).remove();
    }
    this.canConnect = false;
    $('body').css('cursor','default');
};
/**
 * doble click mouse behavior
 * @param canvas
 * @returns {Function}
 */
PMCanvas.prototype.onDblClick = function (canvas) {
    return function (e, ui) {
        var currentLabel = canvas.currentLabel, figure, realPoint, realPoint, oldConnection;
        e.stopPropagation();
        e.preventDefault();
        realPoint = canvas.relativePoint(e);
        realPoint.x = realPoint.x*canvas.zoomFactor - canvas.getX();
        realPoint.y = realPoint.y*canvas.zoomFactor - canvas.getY();
        figure = canvas.getBestConnecion(realPoint);
        if(figure !== null){
            canvas.emptyCurrentSelection();
            if(patternFlag!='Monitor'){
            	figure.label.getFocus();
        	}
        }
    };
};

PMCanvas.prototype.hideAllFocusedLabels =  function () {
    if(this.currentLabel != null)
        this.currentLabel.loseFocus();
    return true;
};

/**
 * @event mousedown
 * MouseDown Handler of the canvas. It does the following:
 *
 * - Trigger the {@link PMUI.draw.Canvas#event-rightclick Right Click event} if it detects a right click
 * - Empties `canvas.currentSelection`
 * - Hides `canvas.currentConnection` if there's one
 * - Resets the position of `canvas.multipleSelectionContainer` making it visible and setting its
 *      `[x, y]` to the point where the user did mouse down in the `canvas`.
 *
 * @param {PMUI.draw.Canvas} canvas
 */
PMCanvas.prototype.onMouseDown = function (canvas) {
    return function (e, ui) {
        var x = e.pageX - canvas.getX() + canvas.getLeftScroll() - canvas.getAbsoluteX(),
            y = e.pageY - canvas.getY() + canvas.getTopScroll() - canvas.getAbsoluteY();

        if (canvas.canConnect) {
            canvas.cancelConnect();
        }
        //hide corona
        if (canvas.coronaShape) {
            canvas.hideAllCoronas();
        }
        e.preventDefault();
        if (e.which === 3) {
            canvas.rightClick = true;
            $(canvas.html).trigger("rightclick", [e, canvas]);
        }
        canvas.isMouseDown = true;
        canvas.isMouseDownAndMove = false;
        // do not create the rectangle selection if a segment handler
        // is being dragged
        if (canvas.draggingASegmentHandler) {
            return;
        }
        // clear old selection
        canvas.emptyCurrentSelection();
        //verify lasso is enabled
        if (canvas.lassoEnabled) {
            // hide the currentConnection if there's one
            canvas.hideCurrentConnection();
            canvas.multipleSelectionHelper.reset();
            canvas.multipleSelectionHelper.setPosition(x / canvas.zoomFactor,
                y / canvas.zoomFactor);
            canvas.multipleSelectionHelper.oldX = x;
            canvas.multipleSelectionHelper.oldY = y;
            canvas.multipleSelectionHelper.setVisible(true);
            canvas.multipleSelectionHelper.changeOpacity(0.2);
        }
    };
};


PMCanvas.prototype.onClick = function (canvas) {
	
    return function (e, ui) {
        var currentLabel = canvas.currentLabel, figure, realPoint, realPoint, oldConnection;
        //console.log('current:'+ current);
        if (currentLabel) {
            currentLabel.loseFocus();
            $(currentLabel.textField).focusout();
        }
        realPoint = canvas.relativePoint(e);
        realPoint.x = realPoint.x * canvas.zoomFactor;
        realPoint.y = realPoint.y * canvas.zoomFactor;
        figure = canvas.getBestConnecion(realPoint);
        //canvas.hideDragConnectHandlers();
        canvas.hideDropConnectHandlers();
        //点击画布隐藏连接线的选中标志
        canvas.hideCurrentConnection();
        if(figure!==null && !canvas.isMouseDown){
            oldConnection = canvas.currentConnection;
            canvas.emptyCurrentSelection();
            if (oldConnection) {
                oldConnection.hidePortsAndHandlers();
            }
            figure.showPortsAndHandlers();
            canvas.currentConnection = figure;
        }
        //点击画布结束流程名称的编辑状态
        var processName=jQuery("div#processName input").val();
        if(processName!=="")
        	canvas.project.setProjectNameOndbclick(processName);
        
        if(patternFlag=='FormServerDesigner'&&!canvasStopPropagation){
//        	$('#propertyNodeName').val('');
//        	$('#ms1').magicSuggest(true).clear(true);
//        	$('#ms2').magicSuggest(true).clear(true);
        }
    };
};

PMCanvas.prototype.onMouseLeave = function (canvas) {
	
    return function (e, ui) {
        if (parseInt(e.screenX+10, 10) >= parseInt(document.body.clientWidth, 10)) {
            window.scrollBy(1,0);
        }

        if (parseInt(e.screenY-75, 10) >= parseInt(document.body.clientHeight, 10)) {
            window.scrollBy(0,1);
        }
    };
};

var canvasStopPropagation = false;

/**点击corona*/
PMCanvas.prototype.manualCreateShape = function (parent, e) {
    var customShape = this.shapeFactory(this.canCreateShapeType),
    	startShape = this.connectStartShape,
        command,
        item,
        i,
        X_MIN_JUMP_DISTANCE = 50,
        Y_MIN_JUMP_DISTANCE = 50,
        LEFT_DISTANCE = 50,
        TOP_DISTANCE = 50,
//        tempMJD = MIN_JUMP_DISTANCE+1,
        tempDistance,
        moveDirection='n',//for 'none'
        movedPointValue,
        tempMenu,
        endPoint = {},
        centerOfEndPoint = {},
        centerOfStartShape = {},
        customShapeWidth,
        customShapeHeight,
        ifFirst;
        realPoint = this.relativePoint(e);
    //start 如果是从前一节点拖拽生成的，在某像素范围内，自动水平或垂直对齐lv.yz dante
    //addElement(0,0,0,true)第四个参数设成true就是从中间点算，做麻烦了。
    endPoint.x = realPoint.x * this.zoomFactor - parent.getAbsoluteX();
    endPoint.y = realPoint.y * this.zoomFactor - parent.getAbsoluteY();

//    endPoint.y -= this.getY();
//    parent.addElement(customShape, endPoint.x, endPoint.y, false);
    
    //方法一:鼠标在源节点的高度/宽度范围内
    if(endPoint.x <= startShape.x+startShape.getZoomWidth()&&
    		endPoint.x >= startShape.x){
    	moveDirection = 'x';//for '横向'
    }
    if(endPoint.y <= startShape.y+startShape.getZoomHeight()&&
    		endPoint.y >= startShape.y){
    	moveDirection = 'y';//for '横向'
    }
    customShapeWidth = customShape.width * this.zoomFactor;
    customShapeHeight = customShape.height * this.zoomFactor;
    centerOfStartShape.x = startShape.x + startShape.getZoomWidth()/2;
    centerOfStartShape.y = startShape.y + startShape.getZoomHeight()/2;
    //如果是并发开始节点生成的分支第一个节点，让x坐标为固定值
    if(startShape.extendedType == 'PARALLEL'){
    	ifFirst = true;//for first of the parallel
    }
    switch(moveDirection){
    case 'n'://不移动
    	if(ifFirst){
    		if(parent.getOrientation().toLowerCase()==="horizontal")
    			parent.addElement(customShape, LEFT_DISTANCE, endPoint.y, false);
    		else
    			parent.addElement(customShape, endPoint.x, TOP_DISTANCE, false);
    	}else{
    		parent.addElement(customShape, endPoint.x, endPoint.y, false);
    	}
    	break;
    case 'x':
    	if(ifFirst){
    		parent.addElement(customShape, LEFT_DISTANCE, endPoint.y, false);
    	}else{
    		var movedPointValue = centerOfStartShape.x - customShapeWidth/2-0.5;//-0.5是为了四舍五入
        	parent.addElement(customShape, movedPointValue, endPoint.y, false);
        	
        	
    	}
    	break;
    case 'y':
    	var movedPointValue = centerOfStartShape.y - customShapeHeight/2-0.5;
    	if(ifFirst){
    		parent.addElement(customShape, LEFT_DISTANCE, movedPointValue, false);
    	}else{
        	parent.addElement(customShape, endPoint.x, movedPointValue, false);
    	}
    	break;
    }
     
    //end
    
    this.updatedElement = customShape;

    customShape.canvas.emptyCurrentSelection();//显示周围小绿点
    this.addToList(customShape);
    customShape.showOrHideResizeHandlers(false);

    command = new PMUI.command.CommandCreate(customShape);
    this.commandStack.add(command);
    command.execute();
    
    if(this.canCreateShapeType=="CONCURRENT"){
    	customShape.addStartAndEnd("PARALLEL",0,60);//5,125
    	customShape.addStartAndEnd("INCLUSIVE",275,60);//560,125 //300-31
    }
//    this.layers.getFirst().removeCSSClasses(['dropableClass']);
//    this.refreshResizeCanvas();
    
    this.addToSelection(customShape);//显示corona（右侧小图标）
    customShape.corona.show();

    e.pageY +=  customShape.getZoomHeight()/2;
    this.connectProcedure(customShape, e);//添加连接线
    this.canCreateShape = false;

    this.connectStartShape.corona.hide();//删除拖动时的小图标
    if (this.shapeHelper) {
        //remove the connection segment in order to create another one
        $(this.shapeHelper.html).remove();
    }
    
    // 触发节点的Click事件，为属性页赋值
//    $("div[id^='"+customShape.id+"']").eq(0).click();
//    e.preventDefault();
//    e.stopPropagation();
//    canvasStopPropagation = true;
};

/**
 * Parses `options` creating shapes and connections and placing them in this canvas.
 * It does the following:
 *
 * - Creates each shape (in the same order as it is in the array `options.shapes`)
 * - Creates each    connection (in the same order as it is in the array `options.connections`)
 * - Creates the an instance of {@link PMUI.command.CommandPaste} (if possible)
 *
 * @param {Object} options
 * @param {Array} [options.shapes=[]] The config options of each shape to be placed in this canvas.
 * @param {Array} [options.connections=[]] The config options of each connection to be placed in this canvas.
 * @param {boolean} [options.uniqueID=false] If set to true, it'll assign a unique ID to each shape created.
 * @param {boolean} [options.selectAfterFinish=false] If set to true, it'll add the shapes that are
 * direct children of this canvas to `this.currentSelection` arrayList.
 * @param {string} [options.prependMessage=""] The message to be prepended to each shape's label.
 * @param {boolean}  [options.createCommand=true] If set to true it'll create a command for each creation
 * of a shape and connection (see {@link PMUI.command.CommandCreate}, 
 {@link PMUI.command.CommandConnect}) and save them in
 * a {@link PMUI.command.CommandPaste} (for undo-redo purposes).
 * @param {number} [options.diffX=0] The number of pixels on the x-coordinate to move the shape on creation
 * @param {number} [options.diffY=0] The number of pixels on the y-coordinate to move the shape on creation
 * @chainable
 */
PMCanvas.prototype.parse = function (options) {
	
    var defaults = {
            shapes: [],
            connections: [],
            uniqueID: false,
            selectAfterFinish: false,
            prependMessage: "",
            createCommand: true,
            diffX: 0,
            diffY: 0
        },
        i,
        j,
        id,
        oldID,
        shape,
        points,
        shapeOptions,
        connection,
        connectionOptions,
        sourcePort,
        sourcePortOptions,
        sourceShape,
        sourceBorder,
        destPort,
        destPortOptions,
        destShape,
        destBorder,
        command,
        diffX,
        diffY,
        stackCommandCreate = [],
        stackCommandConnect = [],
        canvasID = this.getID(),
        mapOldId = {},              // {oldId: newId}
        map = {};                   // {newId: reference to the shape}
    $.extend(true, defaults, options);
    // set the differentials (if the shapes are pasted in the canvas)
    diffX = defaults.diffX;
    diffY = defaults.diffY;
    // map the canvas
    map[canvasID] = this;
    mapOldId[canvasID] = canvasID;

    if (defaults.selectAfterFinish) {
        this.emptyCurrentSelection();
    }
    for (i = 0; i < defaults.shapes.length; i += 1) {
        shapeOptions = {};
        $.extend(true, shapeOptions, defaults.shapes[i]);

        // set the canvas of <shape>
        shapeOptions.canvas = this;

        // create a map of the current id with a new id
        oldID = shapeOptions.id;

        // generate a unique id on user request
        if (defaults.uniqueID) {
            shapeOptions.id = PMUI.generateUniqueId();
        }
        mapOldId[oldID] = shapeOptions.id;

        // change labels' messages (using prependMessage)
        if (shapeOptions.labels) {
            for (j = 0; j < shapeOptions.labels.length; j += 1) {
                shapeOptions.labels[j].message = defaults.prependMessage +
                    shapeOptions.labels[j].message;
            }
        }

        // create an instance of the shape based on its type
        shape = this.shapeFactory(shapeOptions.extendedType, shapeOptions);

        // map the instance with its id
        map[shapeOptions.id] = shape;

        // if the shapes don't have a valid parent then set the parent
        // to be equal to the canvas
        // TODO: ADD shapeOptions.topLeftOnCreation TO EACH SHAPE
        if (!mapOldId[shapeOptions.parent]) {
            this.addElement(shape,
                shapeOptions.x + diffX, shapeOptions.y + diffY, true);
        } else if (shapeOptions.parent !== canvasID) {
            // get the parent of this shape
            map[mapOldId[shapeOptions.parent]].addElement(shape, shapeOptions.x,
                shapeOptions.y, true);
        } else {
            map[mapOldId[shapeOptions.parent]].addElement(shape,
                shapeOptions.x + diffX, shapeOptions.y + diffY, true);
        }

        // perform some extra actions defined for each shape
        shape.parseHook();

        shape.attachListeners();
        // execute command create but don't add it to the canvas.commandStack
        command = new PMUI.command.CommandCreate(shape);
        command.execute();
        stackCommandCreate.push(command);
    }   
    for (i = 0; i < defaults.connections.length; i += 1) {
        connectionOptions = {};
        $.extend(true, connectionOptions, defaults.connections[i]);

        // state of the connection
        points = connectionOptions.state || [];

        // determine the shapes
        sourcePortOptions = connectionOptions.srcPort;
        sourceShape = map[mapOldId[sourcePortOptions.parent]];
        sourceBorder = sourceShape.getBorderConsideringLayers();

        destPortOptions = connectionOptions.destPort;
        destShape = map[mapOldId[destPortOptions.parent]];
        destBorder = destShape.getBorderConsideringLayers();

        // populate points if points has no info (backwards compatibility,
        // e.g. the flow state is null)
        if (points.length === 0) {
            points.push({
                x: sourcePortOptions.x + sourceShape.getAbsoluteX(),
                y: sourcePortOptions.y + sourceShape.getAbsoluteY()
            });
            points.push({
                x: destPortOptions.x + destShape.getAbsoluteX(),
                y: destPortOptions.y + destShape.getAbsoluteY()
            });
        }

        //create the ports
        sourcePort = new PMUI.draw.Port({
            width: 8,
            height: 8
        });
        destPort = new PMUI.draw.Port({
            width: 8,
            height: 8
        });
        // add the ports to the shapes
        // LOGIC: points is an array of points relative to the canvas.
        // CustomShape.addPort() requires that the point passed as an argument
        // is respect to the shape, so transform the point's coordinates (also
        // consider the border)
        sourceShape.addPort(
            sourcePort,
            points[0].x + diffX + sourceBorder -
                sourceShape.getAbsoluteX(),
            points[0].y + diffX + sourceBorder -
                sourceShape.getAbsoluteY()
        );
        destShape.addPort(
            destPort,
            points[points.length - 1].x + diffX + destBorder -
                destShape.getAbsoluteX(),
            points[points.length - 1].y + diffY + destBorder -
                destShape.getAbsoluteY(),
            false,
            sourcePort
        );

        connection = this.connectionFactory(
            connectionOptions.type,
            {
                srcPort : sourcePort,
                destPort: destPort,
                segmentColor: new PMUI.util.Color(92, 156, 204),
                canvas : this,
                segmentStyle: connectionOptions.segmentStyle
            }
        );
        connection.id = connectionOptions.id || PMUI.generateUniqueId();
        if (defaults.uniqueID) {
            connection.id = PMUI.generateUniqueId();
        }
        //set its decorators
        connection.setSrcDecorator(new PMUI.draw.ConnectionDecorator({
            width: 1,
            height: 1,
            canvas: this,
            decoratorPrefix: connectionOptions.srcDecoratorPrefix,
            decoratorType: "source",
            parent: connection
        }));
        connection.setDestDecorator(new PMUI.draw.ConnectionDecorator({
            width: 1,
            height: 1,
            canvas: this,
            decoratorPrefix: connectionOptions.destDecoratorPrefix,
            decoratorType: "target",
            parent: connection
        }));

        command = new PMUI.command.CommandConnect(connection);
        stackCommandConnect.push(command);

        // connect the two ports
        if (points.length >= 3) {
            connection.connect({
                algorithm: 'user',
                points: connectionOptions.state,
                dx: defaults.diffX,
                dy: defaults.diffY
            });
        } else {
            // use manhattan
    //            console.log("manhattan");
            connection.connect();
        }
        connection.setSegmentMoveHandlers();
        var fl=connection;
        // add the connection to the canvas, that means insert its html to
        // the DOM and adding it to the connections array
        this.addConnection(connection);

        // now that the connection was drawn try to create the intersections
        connection.checkAndCreateIntersectionsWithAll();

        //attaching port listeners
        sourcePort.attachListeners(sourcePort);
        destPort.attachListeners(destPort);

        this.triggerCreateEvent(connection, []);
    }

    // finally add to currentSelection each shape if possible (this method is
    // down here because of the zIndex problem with connections)
    if (defaults.selectAfterFinish) {
        for (id in map) {
            if (map.hasOwnProperty(id)) {
                if (map[id].family !== 'Canvas') {
                    this.addToSelection(map[id]);
                }
            }
        }
    }

    // create command if possible
    if (defaults.createCommand) {
        this.commandStack.add(new PMUI.command.CommandPaste(this, {
            stackCommandCreate: stackCommandCreate,
            stackCommandConnect: stackCommandConnect
        }));
    }
    return this;
};

/**
 * Fires the {@link PMUI.draw.Canvas#event-removeelement} event, 
 and elaborates the structure of the object that will
 * be passed to the handlers.
 * @param {PMUI.draw.CustomShape} shape The shape created
 * @param {Array} relatedElements The array with the other elements created
 * @chainable
 */
PMCanvas.prototype.triggerRemoveEvent = function (shape, relatedElements) {
    if (relatedElements.length === 0) {
        if (shape) {
            relatedElements.push(shape);
        }
    }
    this.updatedElement = {
        id : (shape && shape.id) || null,
        type : (shape && shape.type) || null,
        relatedObject: shape,
        relatedElements : relatedElements
    };
    this.canvas.hideDragConnectHandlers();
    $(this.html).trigger('removeelement');
    return this;
};

PMCanvas.prototype.createConnectHandlers = function (resizableStyle, nonResizableStyle) {
       // if (type === "Oval") {
            var i,
                number = 20,
                connectHandler;
            
            //add the rest to the mid list
            for (i = 0; i < number; i += 1) {
                connectHandler =  new PMConnectHandler({
                                        parent: this,
                                        zOrder: PMUI.util.Style.MAX_ZINDEX + 4,
                                        representation: new PMUI.draw.Rectangle(),
                                        //orientation: this.midPointIdentifiers[i],
                                        resizableStyle: resizableStyle,
                                        nonResizableStyle: nonResizableStyle
                                    });
                this.dragConnectHandlers.insert(
                   connectHandler
                );
                if (!this.html) {
                       return;
                }
                this.html.appendChild(connectHandler.getHTML());
                connectHandler.setPosition(100, 100);
                connectHandler.setCategory("dragConnectHandler");
                    connectHandler.attachListeners();
                connectHandler.paint();
                //connectHandler.setVisible(true);
            }

            for (i = 0; i < number; i += 1) {
                connectHandler =  new PMConnectHandler({
                                        parent: this,
                                        zOrder: PMUI.util.Style.MAX_ZINDEX + 1,
                                        representation: new PMUI.draw.Rectangle(),
                                        //orientation: this.midPointIdentifiers[i],
                                        resizableStyle: resizableStyle,
                                        nonResizableStyle: nonResizableStyle
                                    });
                this.dropConnectHandlers.insert(
                   connectHandler
                );
                if (!this.html) {
                       return;
                }
                this.html.appendChild(connectHandler.getHTML());
                connectHandler.setPosition(400, 100);
                connectHandler.setCategory("dropConnectHandler");
                    connectHandler.attachListeners();

                connectHandler.paint();
            }
        //}
    return this;
     
};


PMCanvas.prototype.hideDragConnectHandlers = function () {
    var connectHandler,
        i;
    for (i = 0; i < this.dragConnectHandlers.getSize(); i += 1) {
        connectHandler = this.dragConnectHandlers.get(i);
        connectHandler.setVisible(false);
    }

return this;
};

PMCanvas.prototype.hideDropConnectHandlers = function () {
    var connectHandler,
        i;
    for (i = 0; i < this.dropConnectHandlers.getSize(); i += 1) {
        connectHandler = this.dropConnectHandlers.get(i);
        connectHandler.setVisible(false);
    }
    return this;
};

PMCanvas.prototype.applyZoom = function (scale) {
    this.hideDragConnectHandlers();
    this.hideDropConnectHandlers();
    PMUI.draw.Canvas.prototype.applyZoom.call(this, scale);
    return this;
};
PMCanvas.prototype.existThatName = function (element, name) {
    var i,
        shape,
        result = false;
    for(i = 0; i < this.customShapes.getSize(); i += 1) {
        shape = this.customShapes.get(i);
        if (shape.getID() !== element.getID() && shape.getName()=== element.getName()) {
            result = true;
            break;
        }
    }

  return result;
};

PMCanvas.prototype.validateName = function (element, newText, oldText) {
    var result = true;
    if (newText === "") {
        result = false;
        PMDesigner.msgFlash(RIA_I18N.designer.msg.nameNotNull, document.body, 'error', 3000, 5);
    }
    return result;
};

PMCanvas.prototype.addConnection = function (conn) {
    PMUI.draw.Canvas.prototype.addConnection.call(this, conn);
    if (conn.flo_state) {
        conn.algorithm = 'user';
        conn.disconnect(true).connect({
            algorithm: 'user',
            points: conn.flo_state
        });
        conn.setSegmentMoveHandlers();
    }
};
/**
 * This method hide all flows into a container (shape);
 * @param {BPMNShape} shape
 */
PMCanvas.prototype.hideFlowRecursively = function (shape) {
    var i,
        child,
        j,
        flow;
    for (i = 0; i < shape.getChildren().getSize(); i += 1) {
        child = shape.getChildren().get(i);
        for (j = 0; j < child.getPorts().getSize(); j += 1) {
            flow = child.getPorts().get(j).connection;
            flow.disconnect();
        }
        if (child.getChildren().getSize() > 0 ) {
            this.hideFlowRecursively(child);
        }
    }
};

/**
 * Remove all selected elements, it destroy the shapes and all references to them.
 * @chainable
 */
PMCanvas.prototype.removeElements = function () {
    // destroy the shapes (also destroy all the references to them)
    var shape,
        command;
    command = new PMCommandDelete(this);
	var selectNodes=command.currentSelection;
	if(selectNodes.getSize()===0){
		if(command.currentConnection==null || command.currentConnection==undefined){
			return;
		}
		var targetShape=command.currentConnection.getDestPort().parent;
		this.commandStack.add(command);
		command.execute();
		PMCanvas.batchSetBranchId(targetShape,"");
		this.resetContainerSize(selectNodes);
		return this;
	}else{

	    if(selectNodes.get(0).act_name=="服务发起人"){
	    	alert("“服务发起人”节点不能删除！");
	    	return;
	    }
		this.removeNodeBranchId(selectNodes);
	}
		
    this.commandStack.add(command);
    command.execute();
    this.resetContainerSize(selectNodes);
    return this;
};
/**
 * 删除节点时，更新画布或者并发体的大小
 * */
PMCanvas.prototype.resetContainerSize = function (selectNodes) {
	var canvasTop,canvasLeft;
	if(patternFlag=='Monitor'||patternFlag=='PrvView'||patternFlag=='FormServerDesigner'){
		canvasTop = 44;
		canvasLeft = 0;//画布向右偏移工具栏的宽度
	}else{
		canvasTop = 35;
		canvasLeft = 210;//画布向右偏移工具栏的宽度
	}
	var PARALLEL_MIN_WIDTH = 300,
		PARALLEL_MIN_HEIGHT = 150,
		CANVAS_MIN_WIDTH = $(window).width()-canvasLeft,
		CANVAS_MIN_HEIGHT =$(window).height()-canvasTop,
		RIGHT_DISTANCE = 80,
		BELOW_DISTANCE = 20,
		LEFT_DISTANCE = 50,
		UPON_DISTANCE = 20;
	for(var i=0; i<selectNodes.getSize(); i++){
		var selectedNode,
			shapesInParallel,
			shapesInCanvas,
			shape;
		selectedNode=selectNodes.get(i);
		shape = selectedNode.parent;
		if(selectedNode.getDataObject().bou_container==="bpmnParallel"){
			//自动缩小
			shapesInParallel = shape.children.asArray();
			shape.setRightestPointX(0);
			shape.setDownestPointY(0);
			for(var i=0;i<shapesInParallel.length;i++){
				var thisNode = shapesInParallel[i];
				if(thisNode.extendedType=='PARALLEL' || thisNode.extendedType=='INCLUSIVE'){
					continue;
				}
				if(thisNode.x+thisNode.zoomWidth > shape.getRightestPointX()){
					shape.setRightestPointX(thisNode.x+thisNode.zoomWidth);
				}
				if(thisNode.y+thisNode.zoomHeight > shape.getDownestPointY()){
					shape.setDownestPointY(thisNode.y+thisNode.zoomHeight);
				}
			}
			if(shape.getRightestPointX()+RIGHT_DISTANCE < shape.getWidth()){
				if(shape.getRightestPointX()+RIGHT_DISTANCE>=PARALLEL_MIN_WIDTH){
					shape.setWidth(shape.getRightestPointX()+RIGHT_DISTANCE);
				}else{
					shape.setWidth(PARALLEL_MIN_WIDTH);
				}
			}
			if(shape.getDownestPointY()+BELOW_DISTANCE < shape.getHeight()){
				if(shape.getDownestPointY()+BELOW_DISTANCE>=PARALLEL_MIN_HEIGHT){
					shape.setHeight(shape.getDownestPointY()+BELOW_DISTANCE);
				}else{
					shape.setHeight(PARALLEL_MIN_HEIGHT);
				}
			}
			//	shape.setParallelStartAndEndPosition();
			shape.refreshChildrenPosition().refreshConnections(false, false);
			//	shape.refreshChildrenPositions(true);//.refreshConnections(false, false);
			shape.updateDimensions(10);
			shape.parallelChildConnectionOnResize(true, true);
			//shape.refreshParallelStartAndEndConnections(false);
		}else if(selectedNode.getDataObject().bou_container==="bpmnDiagram"){
			//自动缩小
		 		shapesInCanvas = shape.children.asArray();
				shape.setRightestPointX(0);
				shape.setDownestPointY(0);
				for(var i=0;i<shapesInCanvas.length;i++){
					var thisNode = shapesInCanvas[i];
					if(thisNode.x+thisNode.zoomWidth > shape.getRightestPointX()){
						shape.setRightestPointX(thisNode.x+thisNode.zoomWidth);
					}
					if(thisNode.y+thisNode.zoomHeight > shape.getDownestPointY()){
						shape.setDownestPointY(thisNode.y+thisNode.zoomHeight);
					}
				}
				if(shape.getRightestPointX()+RIGHT_DISTANCE < shape.getWidth()){
					if(shape.getRightestPointX()+RIGHT_DISTANCE>=CANVAS_MIN_WIDTH){
						shape.setWidth(shape.getRightestPointX()+RIGHT_DISTANCE);
					}else{
						shape.setWidth(CANVAS_MIN_WIDTH-20);
					}
					
				}
				if(shape.getDownestPointY()+BELOW_DISTANCE < shape.getHeight()){
					if(shape.getDownestPointY()+BELOW_DISTANCE>=CANVAS_MIN_HEIGHT){
						shape.setHeight(shape.getDownestPointY()+BELOW_DISTANCE);
					}else{
						shape.setHeight(CANVAS_MIN_HEIGHT-20);
					}
				}
		}	
		if (shape.graphic) {
	        shape.paint();
	    }
	}
}
PMCanvas.prototype.removeNodeBranchId = function (selectNodes) {

	for(var i=0; i<selectNodes.getSize(); i++){
		var selectNode=selectNodes.get(i);
		if(selectNode.getDataObject().bou_container==="bpmnParallel"){
			var connections = selectNode.canvas.getConnections();	
			for (i = 0; i < connections.getSize(); i +=1) {
			    if (connections.get(i).getSrcPort().parent.getID() === selectNode.getID()) {
			    	var targetNode=connections.get(i).getDestPort().parent;
			    	PMCanvas.batchSetBranchId(targetNode,"");
			     }
			}	
		}		
	}
};
PMCanvas.prototype.triggerTaskTypeChangeEvent = function (element) {
    this.updatedElement = [{
        id : element.id,
        type : element.type,
        fields : [
            {
                field : "act_task_type",
                oldVal : '',
                newVal : this.act_task_type
            },
            {
                field : "act_task_type",
                oldVal : '',
                newVal : this.act_task_type
            }
        ],
        relatedObject: element
    }];
    $(this.html).trigger('changeelement');
    return this;
};
PMCanvas.prototype.buildDiagram = function (diagram) {
	var flowss=diagram.flows;
    var di,that = this;
    this.buildingDiagram = true;

    jQuery.each(diagram.laneset, function(index, val) {
        laneset = diagram.laneset[index];
        that.loadShape('POOL', laneset, true);
    });

    jQuery.each(diagram.lanes, function(index, val) {
        lanes = diagram.lanes[index];
        that.loadShape('LANE', lanes, true);
    });
    jQuery.each(diagram.concurrents, function(index, val) {
    	concurrents = diagram.concurrents[index];
        that.loadShape('CONCURRENT', concurrents, true);
    });
    jQuery.each(diagram.constartandends, function(index, val) {
    	constartandend = diagram.constartandends[index];
        that.loadShape(constartandend.gat_type, constartandend, true);
    });
    jQuery.each(diagram.activities, function(index, val) {
        activities = diagram.activities[index];
        that.loadShape(activities.act_type, activities, true);
    });
    jQuery.each(diagram.events, function(index, val) {
        events = diagram.events[index];
        that.loadShape(events.evn_type, events, true);
    });
    jQuery.each(diagram.gateways, function(index, val) {
        gateways = diagram.gateways[index];
        that.loadShape(gateways.gat_type, gateways, true);
    });
    jQuery.each(diagram.artifacts, function(index, val) {
        artifacts = diagram.artifacts[index];
        that.loadShape(artifacts.art_type, artifacts, true);
    });
 
    jQuery.each(diagram.flows, function(index, val) {
        connections = diagram.flows[index];
        that.loadFlow(connections, true);
    });
    this.buildingDiagram = false;
};
/**
 * Adds a start event as a defaul init canvas
 */
PMCanvas.prototype.setDefaultStartEvent = function () {
    var customShape = this.shapeFactory('START'),
        command;
    this.addElement(customShape, 100, 100, customShape.topLeftOnCreation);
    this.updatedElement = customShape;
    command = new PMUI.command.CommandCreate(customShape);
    this.commandStack.add(command);
    command.execute();

    this.addToSelection(customShape);
    customShape.corona.show();

};

PMCanvas.prototype.loadShape = function (type, shape, fireTrigger) {
    var customShape,
        command,
        transformShape,
        container;

    transformShape = this.setShapeValues(type, shape);
    customShape = this.shapeFactory(type, transformShape);
    if (customShape) {
    	
        customShape.extendedType = type;
        /* 调用 BehavioralElement的addElement()*/
        if (shape.bou_element === '') {
            //container = this;
            this.addElement(customShape, parseInt(shape.bou_x, 10), parseInt(shape.bou_y, 10), true);
        } else {
            container = this.customShapes.find('id', shape.bou_element);
            container.addElement(customShape, parseInt(shape.bou_x, 10), parseInt(shape.bou_y, 10), true);
        }
        this.updatedElement = customShape;
        this.addToList(customShape);
        customShape.showOrHideResizeHandlers(false);
        if (fireTrigger) {
            this.triggerCreateEvent(customShape, []);
        }
        if(shape.bou_container==="bpmnDiagram"){
        	this.setDimentionX(parseInt(shape.bou_x) + parseInt(shape.bou_width));
            this.setDimentionY(parseInt(shape.bou_y) + parseInt(shape.bou_height));
        }
    }
    
};


PMCanvas.prototype.setShapeValues = function (type, options) {
    var newShape;
    switch(type) {
        case "TASK":
        case "AUTO_TASK":
        case "SUB_PROCESS":
//            options.width = parseInt(options.bou_width, 10);
//            options.height = parseInt(options.bou_height, 10);
            options.id = options.act_uid;
            options.labels = [
                {
                    message: options.act_name
                }
            ];
            break;
        case "START":
        case "END":
            options.id = options.evn_uid;
            options.labels = [
                {
                    message: options.evn_name
                }
            ];
            break;

        case "TEXT_ANNOTATION":
        options.width = parseInt(options.bou_width, 10);
        options.height = parseInt(options.bou_height, 10);
        options.id = options.art_uid;
        options.labels = [
            {
                message: options.art_name
            }
        ];
        break;    
        case "EXCLUSIVE":
        case "PARALLEL":
        case "INCLUSIVE":
            options.id = options.gat_uid;
            options.labels = [
                {
                    message: options.gat_name
                }
            ];
            break;

        case "POOL":
            options.id = options.lns_uid;
            options.width = parseInt(options.bou_width, 10);
            options.height = parseInt(options.bou_height, 10);
            options.labels = [
                {
                    message: options.lns_name
                }
            ];
            break;
        case "LANE":
            options.id = options.lan_uid;
            options.relPosition = parseInt(options.bou_rel_position, 10);
            options.width = parseInt(options.bou_width, 10);
            options.height = parseInt(options.bou_height, 10);
            options.labels = [
                {
                    message: options.lan_name
                }
            ];
            break;
        case "CONCURRENT":
        	options.width = parseInt(options.bou_width, 10);
            options.height = parseInt(options.bou_height, 10);
            options.id = options.parUid;
            options.labels = [
                {
                    message: options.lns_name
                }
            ];
            break;
    }
    return options;
};



PMCanvas.prototype.loadFlow = function (conn, trigger) {
    var sourceObj,
        targetObj,
        startPoint,
        endPoint,
        sourcePort,
        targetPort,
        connection,
        //positionX,
        //positionY,
        segmentMap = {
            'SEQUENCE' : 'regular',
            'ASSOCIATION' : 'dotted',
        },
        srcDecorator = {
            'SEQUENCE' : 'mafe-decorator',
            'ASSOCIATION' : 'mafe-decorator',
        },
        destDecorator = {
            'SEQUENCE' : 'mafe-sequence',
            'ASSOCIATION' : 'mafe-decorator_association',
        },
        positionSourceX,
        positionSourceY,
        positionTargetX,
        positionTargetY;

    sourceObj = this.getElementByUid(conn.flo_element_origin);
    targetObj = this.getElementByUid(conn.flo_element_dest);

    if (typeof sourceObj === "object" && typeof targetObj === "object") {
        startPoint = new PMUI.util.Point(conn.flo_x1, conn.flo_y1);
        endPoint = new PMUI.util.Point(conn.flo_x2, conn.flo_y2);

        sourcePort = new PMUI.draw.Port({
            width: 10,
            height: 10
        });

        targetPort = new PMUI.draw.Port({
            width: 10,
            height: 10
        });

        positionSourceX = startPoint.x - sourceObj.absoluteX + this.canvas.absoluteX;
        positionSourceY = startPoint.y - sourceObj.absoluteY + this.canvas.absoluteY;

        positionTargetX = endPoint.x - targetObj.absoluteX + this.canvas.absoluteX;
        positionTargetY = endPoint.y - targetObj.absoluteY + this.canvas.absoluteY;

        sourceObj.addPort(sourcePort, positionSourceX, positionSourceY);
        targetObj.addPort(targetPort, positionTargetX, positionTargetY, false, sourcePort);
        targetPort.setPosition(
            positionTargetX - targetPort.getWidth() / 2,
            positionTargetY - targetPort.getHeight() / 2
        );
        if (!conn.flo_name) {
            conn.flo_name = ' ';
        }
        connection = new PMFlow({
            id : conn.flo_uid,
            srcPort : sourcePort,
            destPort : targetPort,
            canvas : this.canvas,
            segmentStyle : segmentMap[conn.flo_type],
            segmentColor: new PMUI.util.Color(0, 0, 0),
            flo_type : conn.flo_type,
            name : conn.flo_name,
            flo_condition : conn.flo_condition,
            flo_state : conn.flo_state,
            flo_xml : conn.flo_xml,
            dynamic_branch : conn.dynamic_branch,
            flo_uid: (conn.flo_uid) ? conn.flo_uid: null
        });

        connection.setSrcDecorator(new PMUI.draw.ConnectionDecorator({
            decoratorPrefix : srcDecorator[conn.flo_type],
            decoratorType : "source",
            style : {
                cssClasses: []
            },
            width : 11,
            height : 11,
            canvas : this.canvas,
            parent : connection
        }));

        connection.setDestDecorator(new PMUI.draw.ConnectionDecorator({
            decoratorPrefix : destDecorator[conn.flo_type],
            decoratorType : "target",
            style : {
                cssClasses : []
            },
            width : 11,
            height : 11,
            canvas : this.canvas,
            parent : connection
        }));

        connection.setSegmentMoveHandlers();
        //add the connection to the canvas, that means insert its html to
        // the DOM and adding it to the connections array
        this.addConnection(connection);

        // Filling mafeFlow fields
        connection.setTargetShape(targetPort.parent);
        connection.setOriginShape(sourcePort.parent);
        connection.savePoints();

        // now that the connection was drawn try to create the intersections
        connection.checkAndCreateIntersectionsWithAll();

        //attaching port listeners
        sourcePort.attachListeners(sourcePort);
        targetPort.attachListeners(targetPort);
        this.updatedElement = connection;
        if (trigger) {
            this.triggerCreateEvent(connection, []);
        }
    } else {
        throw new Error (RIA_I18N.designer.msg.noElementConnect);
    }
};

PMCanvas.prototype.getElementByUid = function (uid) {
    var element;
    element = this.items.find('id', uid);
    if (!element) {
        element = this.getCustomShapes().find('id', uid);
    }
    return element.relatedObject;
};

PMCanvas.prototype.createBPMNDiagram = function () {

    var bpmnDia =  PMDesigner.moddle.create('bpmndi:BPMNDiagram', { id: 'dia_' + PMUI.generateUniqueId() });
    var bpmnPlane =  PMDesigner.moddle.create('bpmndi:BPMNPlane', { 'bpmnElement': this.businessObject.elem, id: 'plane_' + PMUI.generateUniqueId()});
    //var businessObject;
    bpmnDia.plane = bpmnPlane;
    //if(!this.businessObject.elem) {
    //    this.businessObject.elem = {};
    //}
    this.businessObject.diagram = bpmnDia;
    PMDesigner.businessObject.get('diagrams').push(bpmnDia);
    this.businessObject.di = bpmnPlane;

    //return bpmnPlane;
};


PMCanvas.prototype.createBusinesObject = function(createProcess) {
    this.businessObject.elem = {};
    //if (createProcess) {
        var bpmnProcess =  PMDesigner.moddle.create('bpmn:Process', { id:  'pmui-' + PMUI.generateUniqueId() });
        PMDesigner.businessObject.get('rootElements').push(bpmnProcess);
        this.businessObject.elem = bpmnProcess;
        if (this.businessObject.di
            && (typeof this.businessObject.di.bpmnElement === 'undefined'
                || !this.businessObject.di.bpmnElement)) {
            this.businessObject.di.bpmnElement = this.businessObject.elem;
        }
    //}
    //this.businessObject.di = this.createBPMNDiagram();
};


PMCanvas.prototype.updateCanvasProcess = function() {
    var process,
        children;

    if (this.businessObject.elem && (_.findWhere(PMDesigner.businessObject .get('rootElements'), {$type: "bpmn:Process", id: this.businessObject.elem.id})) ) {
        process = _.findWhere(PMDesigner.businessObject .get('rootElements'), {$type: "bpmn:Process", id: this.businessObject.elem.id});
        if (process.flowElements.length === 1){
            children = PMDesigner.businessObject.get('rootElements');
            CollectionRemove(children, process);
            this.businessObject.elem = null;
        }
        if (this.businessObject.di && this.businessObject.di.planeElement.length <= 1){
            this.removeBPMNDiagram();
        }
    }
};
PMCanvas.prototype.removeBPMNDiagram = function () {
    var dia,
        children;

    dia = _.findWhere(PMDesigner.businessObject.get('diagrams'), {$type: "bpmndi:BPMNDiagram", id: this.businessObject.diagram.id});
    //bpmnDia.plane = bpmnPlane;
    children = PMDesigner.businessObject.get('diagrams');

    CollectionRemove(children, dia);
    this.businessObject.di = null;
};
PMCanvas.prototype.toogleGridLine = function () {
    if(this.isGridLine === true){
        this.isGridLine = false;
        $(this.html).removeClass("pmui-pmcanvas");            

    }else{
        this.isGridLine = true;
        $(this.html).addClass("pmui-pmcanvas");
    }
    return this.isGridLine;
};

PMCanvas.prototype.relativePoint = function (e) {
	var auxX, auxY;
    auxX = e.pageX - this.absoluteX;
    auxY = e.pageY - this.absoluteY;
    if (this.canvas) {
        auxX += this.canvas.getLeftScroll();
        auxY += this.canvas.getTopScroll();
        auxX = Math.floor(auxX/this.canvas.zoomFactor);
        auxY = Math.floor(auxY/this.canvas.zoomFactor);
    }
    return {
        x: auxX-this.canvas.getX(),
        y: auxY-this.canvas.getY()
    };
}
/**
 * @class PMEvent
 * @param {Object} options
 */
var PMEvent = function (options) {
    PMShape.call(this, options);
    /**
     * Defines the alphanumeric unique code
     * @type {String}
     */
    this.evn_uid = null;
    /**
     * Defines the name
     * @type {String}
     */
    this.evn_name = null;
    /**
     * Defines the event type
     * @type {String}
     */
    this.evn_type = null;
    /**
     * Defines the event marker supported
     * @type {String}
     */
    this.evn_marker = null;
    /**
     * 定义开始、结束节点的xml片段
     * */
    this.evn_xml=null;

    /**
     * Defines the order of the boundary event when is attached to an activity
     * @type {Number}
     */
    this.numberRelativeToActivity = 0;
    this.businessObject = {};

    PMEvent.prototype.init.call(this, options);
};

PMEvent.prototype = new PMShape();
/**
 * Defines the object type
 * @type {String}
 */
PMEvent.prototype.type = 'PMEvent';

PMEvent.prototype.supportedList = {
    'START' : {
        'EMPTY':true,    
    },
    'END': {
        'EMPTY':true,
    }
};

PMEvent.prototype.init = function (options) {
    var defaults = {
        evn_uid: '',
        evn_name: '',
        evn_marker: 'EMPTY',
        evn_type: 'START',
        evn_xml:'',
        bou_width: 33,
        bou_height: 33,
    };
    jQuery.extend(true, defaults, options);
    this.setEventUid(defaults.evn_uid)
        .setEventType(defaults.evn_type)
        .setEventMarker(defaults.evn_marker)
        .setEventXml(defaults.evn_xml)
    if (defaults.evn_name) {
        this.setName(defaults.evn_name);
    }
//    this.setOnBeforeContextMenu(this.beforeContextMenu);
};
/**
 * 设置开始、结束节点的xml
 * */
PMEvent.prototype.setEventXml = function (xml) {
    if (xml !== 'undefined' && xml !== '') {
        this.evn_xml = xml;
    }else if(this.evn_type=="START"){
    	this.evn_xml = PMDesigner.strToXml('<StartNode ID="'+this.id+'" name="" x="" y=""/>').getElementsByTagName("StartNode")[0];
    }else{
    	this.evn_xml = PMDesigner.strToXml('<EndNode ID="'+this.id+'" name="" x="" y=""/>').getElementsByTagName("EndNode")[0];
    }
    return this;
};
/**
 * 返回开始、结束节点的xml串
 * */
PMEvent.prototype.getEventXml = function () {
    return this.evn_xml;
};
/**
 * Sets the label element
 * @param {String} value
 * @return {*}
 */
PMEvent.prototype.setName = function (name) {
    if (typeof name !== 'undefined') {
        this.evn_name = name;
        if (this.label) {
            this.label.setMessage(name);
            this.getEventXml().setAttribute("name",name);
        }
    }
    return this;
};

PMEvent.prototype.getDataObject = function () {
    var container,
        element_id,
        name = this.getName();
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
    case 'PMActivity':
        container = 'bpmnActivity';
        element_id = this.parent.id;
        break;
    default:
        container = 'bpmnDiagram';
        element_id = this.canvas.id;
        break;
    }
    return {
        evn_uid: this.id,
        id: this.id,
        evn_name: name,
        evn_type: this.evn_type,
        evn_xml:this.evn_xml,
        //evn_marker: this.evn_marker,
        bou_x: this.x,
        bou_y: this.y,
        bou_width: this.width,
        bou_height: this.height,
        bou_container: container,
        bou_element: element_id
    };
};

/**
 * Sets the event uid property
 * @param {String} id
 * @return {*}
 */
PMEvent.prototype.setEventUid = function (id) {
    this.evn_uid = id;
    return this;
};

/**
 * Sets the event type property
 * @param {String} type
 * @return {*}
 */
PMEvent.prototype.setEventType = function (type) {
    type = type.toLowerCase();
    var defaultTypes = {
        start: 'START',
        end: 'END',
    };
    if (defaultTypes[type]) {
        this.evn_type = defaultTypes[type];
    } else {
        //console.error("Error, problems with the evn_type property");
    }
    return this;
};

/**
 * Sets the event marker property
 * @param {String} marker
 * @return {*}
 */
PMEvent.prototype.setEventMarker = function (marker) {
    this.evn_marker = marker;
    return this;
};

PMEvent.prototype.getEventType = function () {
    return this.evn_type;
};

PMEvent.prototype.getEventMarker = function () {
    return this.evn_marker;
};

/**
 * Change an event marker
 * @return {Object}
 */
PMEvent.prototype.changeMarkerTo = function (type) {
    var command = new CommandChangeEventMarker(this, type);
    this.canvas.commandStack.add(command);
    command.execute();
    return this;
};

/**
 * Stringifies the PMEvent object
 * @return {Object}
 */
PMEvent.prototype.stringify = function () {
    var inheritedJSON = PMShape.prototype.stringify.call(this),
        thisJSON = {
            evn_type: this.getType(),
            evn_marker: this.getEventMarker(),
        };
    jQuery.extend(true, inheritedJSON, thisJSON);
    return inheritedJSON;
};

PMEvent.prototype.createBpmn = function(type) {
    if(!this.businessObject.elem && !(this instanceof PMUI.draw.MultipleSelectionContainer)){
        this.createWithBpmn(type, 'businessObject');
    }
    this.updateBounds(this.businessObject.di);
    if ( this.parent.getType() === 'PMCanvas' && !this.parent.businessObject.di) {
        this.canvas.createBPMNDiagram();
    }
    if (this.parent.businessObject.elem) {
        this.updateShapeParent(this.businessObject, this.parent.businessObject);
    } else {
        this.parent.createBusinesObject();
        this.updateShapeParent(this.businessObject, this.parent.businessObject);
    }
};

PMEvent.prototype.updateBpmn = function() {
    this.updateBounds(this.businessObject.di);
    if (!this.parent.businessObject.elem){
        //Here create busines object to new process
        this.parent.createBusinesObject();
    }
    this.updateShapeParent(this.businessObject, this.parent.businessObject);
};
/**
 * create bpmn object and attach to businessObject event
 */

PMEvent.prototype.createWithBpmn = function(bpmnElementType) {
    PMShape.prototype.createWithBpmn.call(this, bpmnElementType, 'businessObject');
    this.businessObject.elem.eventDefinitions = [];
    this.createEventDefinition();
};

PMEvent.prototype.createEventDefinition = function () {
    var def, type;
    if (this.getEventMarker() !== 'EMPTY') {
        type = this.mapBpmnType[this.getEventType()][this.getEventMarker()];
        def = PMDesigner.bpmnFactory.create(type, {id: 'def_' + PMUI.generateUniqueId()});
        this.businessObject.elem.eventDefinitions.push(def);
    }
};

PMEvent.prototype.updateBpmEventMarker = function (newBpmnType) {
    this.businessObject.elem.eventDefinitions = [];
    this.createEventDefinition();
};

PMEvent.prototype.isSupported = function () {
    var isSupported = false;
    
    if (this.supportedList[this.evn_type][this.getEventMarker()] == true) {
        isSupported = true;
    }
    return isSupported;
};

/**
 * @class PMGateway
 * @param {Object} options
 */
var PMGateway = function (options) {
    PMShape.call(this, options);
    /**
     * Gateway id
     * @type {String}
     */
    this.gat_uid = null;
    /**
     * Gateway name
     * @type {String}
     */
    this.gat_name = null;
    /**
     * Gateway type, accept only: 'exclusive' and 'parallel' values
     * @type {String}
     */
    this.gat_type = null;
    /**
     * 分支属性xml对象
     * */
    this.gat_xml = null;
    /**
     * 当节点在并发体中时，存储节点属于并发体中的那个分支
     * 如果不在并发体中则为空
     * */
    this.branch_id=null;
    this.old_x=null;
    this.old_y=null;
    this.new_x=null;
    this.new_y=null;
    this.businessObject = {};
    PMGateway.prototype.init.call(this, options);
};

PMGateway.prototype = new PMShape();
/**
 * Defines the object type
 * @type {String}
 */
PMGateway.prototype.type = 'PMGateway';

PMGateway.prototype.mapBpmnType = {
    'EXCLUSIVE' : 'bpmn:ExclusiveGateway',
    'INCLUSIVE' : 'bpmn:InclusiveGateway',
    'PARALLEL' : 'bpmn:ParallelGateway',
};
PMGateway.prototype.supportedArray = [
    'EXCLUSIVE',
    'INCLUSIVE',
    'PARALLEL'
];

PMGateway.prototype.getDataObject = function () {
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
        gat_uid: this.getID(),
        id: this.getID(),
        gat_name: name,
        gat_type: this.gat_type,
        gat_direction: this.gat_direction,
        type: this.gat_type,
        gat_default_flow: this.gat_default_flow,
        gat_xml: this.getGatewayXml(),
        xml: this.getGatewayXml(),
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
 * Initialize the PMGateway object
 * @param options
 */
PMGateway.prototype.init = function (options) {
    var defaults = {
        gat_type: 'COMPLEX',
        gat_name: "分支节点",
        gat_xml:"",
        branch_id:"",
        old_x:0,
        old_y:0,
        new_x:0,
        new_y:0,
    };
    jQuery.extend(true, defaults, options);
    this.setGatewayUid(defaults.gat_uid)
        .setGatewayType(defaults.gat_type)
        .setGatewayXml(defaults.gat_xml)
        .setBranchId(defaults.branch_id);
    if (defaults.gat_name) {
        this.setName(defaults.gat_name);
    }
 //   this.setOnBeforeContextMenu(this.beforeContextMenu);
};
/**
 * 设置分支节点的xml对象
 * */
PMGateway.prototype.setGatewayXml = function (xml){
	 if (xml !== 'undefined' && xml !== '') {
	        this.gat_xml = xml;
	    }else if(this.gat_type=="EXCLUSIVE"){
	    	this.gat_xml = PMDesigner.strToXml('<ChoiceNode id="'+ this.id +'" ID="'+this.id+'" name="'+this.name+'"></ChoiceNode>').getElementsByTagName("ChoiceNode")[0];
	    }else if(this.gat_type=="PARALLEL"){
	    	this.gat_xml = PMDesigner.strToXml('<ParallelStartNode ID="'+this.id+'" name="'+this.name+'"></ParallelStartNode>').getElementsByTagName("ParallelStartNode")[0];
	    }else if(this.gat_type=="INCLUSIVE"){
	    	this.gat_xml = PMDesigner.strToXml('<ParallelEndNode ID="'+this.id+'" name="'+this.name+'"></ParallelEndNode>').getElementsByTagName("ParallelEndNode")[0];
	    }
	    return this;
}

PMGateway.prototype.getGatewayXml = function () {
    return this.gat_xml;
};

/**
 * 返回并发体中节点所在分支标识
 * */
PMGateway.prototype.getBranchId = function () {
    return this.branch_id;
};
/**
 * 设置并发体中节点所属分支的标识
 * */
PMGateway.prototype.setBranchId = function (branchId) {
	this.branch_id=branchId;
    return this;
};
/**
 * Sets the Gateway ID
 * @param id
 * @return {*}
 */
PMGateway.prototype.setGatewayUid = function (id) {
    this.gat_uid = id;
    return this;
};
/**
 * Sets the label element
 * @param {String} value
 * @return {*}
 */
PMGateway.prototype.setName = function (name) {
    if ( name !== 'undefined') {
        this.gat_name = name;
        if (this.label) {
            this.label.setMessage(name);
            this.getGatewayXml().setAttribute("name",name);
        }
    }else{
    	this.gat_name = "";
    	this.label.setMessage("");
    }
    return this;
};
/**
 * Sets the gateway type
 * @param type
 * @return {*}
 */
PMGateway.prototype.setGatewayType = function (type) {
    type = type.toUpperCase();
    var defaultTypes = {  
        EXCLUSIVE: 'EXCLUSIVE',
        PARALLEL: 'PARALLEL',
        INCLUSIVE: 'INCLUSIVE',
    };
    if (defaultTypes[type]) {
        this.gat_type = defaultTypes[type];
    }
    return this;
};

PMGateway.prototype.getGatewayType = function () {
    return this.gat_type;
};

var PMLine = function (options) {
	
    PMUI.draw.RegularShape.call(this, options);
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
	this.art_orientation = null;
    this.label = null;
    this.box = null;
    this.extended = null;
    this.extendedType = null;
    this.relationship = null;
    PMLine.prototype.init.call(this, options);
};
/**
 * Constant that represents that a drag behavior for moving the shape should be
 * used
 * @property {Number}
 */
PMLine.prototype = new PMUI.draw.RegularShape();

PMLine.prototype.type = "PMArtifact";
PMLine.prototype.family = "RegularShape";

PMLine.prototype.init = function (options) {
    var defaults = {
        art_orientation: "vertical",
        label: "",
        art_type: 'PMArtifact',
        art_name: "",
        art_uid: PMUI.generateUniqueId()
    };
    jQuery.extend(true, defaults, options);
    this.setOrientation(defaults.art_orientation)
        .setLabel(defaults.label)
        .setArtifactUid(defaults.art_uid)
        .setArtifactType(defaults.art_type)
        .setName(defaults.art_name);
};

PMLine.prototype.setOrientation = function (orientation) {
    var availableOpt, option;
    orientation = orientation.toLowerCase();
    availableOpt = {
        "vertical": "vertical",
        "horizontal": "horizontal"
    };
    option = (availableOpt[orientation]) ? orientation: "vertical";
    this.art_orientation = option;
    this.style.addClasses(["mafe-line-"+this.art_orientation]);
    //this.style.applyStyle();

    return this;
};
PMLine.prototype.setLabel = function (label) {

    return this;
};
/**
 * Sets the label element
 * @param {String} value
 * @return {*}
 */
PMLine.prototype.setName = function (value) {
    if (this.label) {
        this.label.setMessage(value);
    }
    return this;
};
/**
 * Returns the label text
 * @return {String}
 */
PMLine.prototype.getName = function () {
    var text = "";
    if (this.label) {
        text = this.label.getMessage();
    }
    return text;
};
PMLine.prototype.setExtendedType = function (type) {
    this.extendedType = type;
    return this;
};

PMLine.prototype.setRelationship = function (relationship) {
    this.relationship = relationship;
    return this;
};
PMLine.prototype.addRelationship = function (object) {
    if (typeof object === "object") {
        jQuery.extend(true, this.relationship, object);    
    }
    return this;
};
PMLine.prototype.setExtended = function (extended) {
    var ext;
    ext = (typeof extended === 'object')? extended : {};
    this.extended = ext;
    return this;
};

/**
 * Sets the artifact type property
 * @param {String} type
 * @return {*}
 */
PMLine.prototype.setArtifactType = function (type) {
    this.art_type = type;
    return this;
};
/**
 * Sets the artifact unique identifier
 * @param {String} value
 * @return {*}
 */
PMLine.prototype.setArtifactUid = function (value) {
    this.art_uid = value;
    return this;
};
PMLine.prototype.getExtendedObject = function () {
    this.extended = {
        extendedType: this.extendedType
    };
    return this.extended;
};
/**
 * Returns the clean object to be sent to the backend
 * @return {Object}
 */
PMLine.prototype.getDataObject = function () {
	
    var name = this.getName();
    return {
        art_uid: this.art_uid,
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

PMLine.prototype.getArtifactType = function () {
    return this.art_type;
};

/**
 * @event mousedown
 * Moused down callback fired when the user mouse downs on the `shape`
 * @param {PMUI.draw.Shape} shape
 */
PMLine.prototype.onMouseDown = function (shape) {
    return function (e, ui) {
        e.stopPropagation();
    };
};

PMLine.prototype.createHTML = function () {
    var width = this.width || 20000, 
        height = this.height || 20000;
    PMUI.draw.RegularShape.prototype.createHTML.call(this);
    this.style.removeAllProperties();
    this.style.addProperties({
        position: "absolute",
        cursor: "move"
    });

    if (this.art_orientation === "vertical") {
        this.height = height;
        this.width = 5;
        this.style.addProperties({
            width: "5px",
            height: height+"px",
            top: -parseInt(height / 3, 10)
        });
    } else {
        this.width = width;
        this.height = 5;
        this.style.addProperties({
            width: width+"px",
            height: "5px",
            left: -parseInt(width / 3, 10)
        });
    }   

    return this.html;
};

/**
 * @class PMArtifact
 * Handle BPMN Annotations
 *
 *
 * @constructor
 * Creates a new instance of the class
 * @param {Object} options
 */
var PMArtifact = function (options) {
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
    /**
     * 存放注释的xml对象
     * */
    this.art_xml=null;
    PMArtifact.prototype.initObject.call(this, options);
};
PMArtifact.prototype = new PMShape();

/**
 * Defines the object type
 * @type {String}
 */
PMArtifact.prototype.type = "PMArtifact";
PMArtifact.prototype.PMArtifactResizeBehavior = null;

/**
 * Initialize the object with the default values
 * @param {Object} options
 */
PMArtifact.prototype.initObject = function (options) {
    var defaults = {
        art_type: 'TEXT_ANNOTATION',
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
 * 设置注释的xml
 * */
PMArtifact.prototype.setArtifactXml = function (xml) {
	if (xml !== 'undefined' && xml !== '') {
	    this.art_xml = xml;
	}else{
		this.art_xml = PMDesigner.strToXml('<TextAnnotation id="' + this.id + '" ID="' + this.id + '" name="' + this.getName() + '" text="'+this.getName()+'"></TextAnnotation>').getElementsByTagName("TextAnnotation")[0];
	}
}
/**
 * 获得注释xml
 * */

/**
 * Sets the artifact type property
 * @param {String} type
 * @return {*}
 */
PMArtifact.prototype.setArtifactType = function (type) {
    this.art_type = type;
    return this;
};
/**
 * Sets the artifact unique identifier
 * @param {String} value
 * @return {*}
 */
PMArtifact.prototype.setArtifactUid = function (value) {
    this.art_uid = value;
    return this;
};
/**
 * Returns the clean object to be sent to the backend
 * @return {Object}
 */
PMArtifact.prototype.getDataObject = function () {
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
        case 'PMActivity':
            container = 'bpmnActivity';
            element_id = this.parent.id;
            break;
        default:
            container = 'bpmnDiagram';
            element_id = this.canvas.id;
            break;
    }
    return {
        art_uid: this.id,
        id: this.id,
        art_name: name,
        art_type: this.art_type,
        type: this.art_type,
        art_xml: this.art_xml,
        bou_x: this.x,
        bou_y: this.y,
        bou_width: this.width,
        bou_height: this.height,
        bou_container: container,
        bou_element: element_id,
        _extended: this.getExtendedObject()
    };
};

PMArtifact.prototype.getArtifactType = function () {
    return this.art_type;
};

PMArtifact.prototype.updateHTML = function () {
    var height, width;
    height = this.height;
    width = this.width;
    PMShape.prototype.updateHTML.call(this);
    this.setDimension(width, height);
    return this;
};

/**
 * Extends the paint method to draw text annotation lines
 */
PMArtifact.prototype.paint = function () {
    if (!this.graphics || this.graphics === null) {
        this.graphics = new JSGraphics(this.id);
    } else {
        this.graphics.clear();
    }
    this.graphics.setStroke(1);
    this.graphics.drawLine(0, 0, 0, this.getZoomHeight());
    this.graphics.drawLine(0, 0, Math.round(this.getZoomWidth() * 0.25), 0);
    this.graphics.drawLine(0, this.getZoomHeight(), Math.round(this.getZoomWidth() * 0.25), this.getZoomHeight());
    this.graphics.paint();
    for (i = 0; i < this.labels.getSize(); i += 1) {
        label = this.labels.get(i);
        label.paint();
    }
    if (this.corona) {
        this.corona.paint();
        this.corona.hide();
    }
};

PMArtifact.prototype.setResizeBehavior = function (behavior) {
    var factory = new PMUI.behavior.BehaviorFactory({
        products: {
            "regularresize": PMUI.behavior.RegularResizeBehavior,
            "Resize": PMUI.behavior.RegularResizeBehavior,
            "yes": PMUI.behavior.RegularResizeBehavior,
            "resize": PMUI.behavior.RegularResizeBehavior,
            "noresize": PMUI.behavior.NoResizeBehavior,
            "NoResize": PMUI.behavior.NoResizeBehavior,
            "no": PMUI.behavior.NoResizeBehavior,
            "annotationResize": PMArtifactResizeBehavior
        },
        defaultProduct: "noresize"
    });
    this.resizeBehavior = factory.make(behavior);
    if (this.html) {
        this.resize.init(this);
    }
    return this;
};

PMArtifact.prototype.createWithBpmn = function() {
    var businessObject = {};
    var bpmnElementType = this.getBpmnElementType();

    businessObject.elem = PMDesigner.bpmnFactory.create(bpmnElementType, {id: this.id, text: this.getName()});

    if (!businessObject.di) {
        if (this.type === 'Connection') {
            businessObject.di = PMDesigner.bpmnFactory.createDiEdge(businessObject.elem, [], {
                id: businessObject.id + '_di'
            });
        } else {
            businessObject.di = PMDesigner.bpmnFactory.createDiShape(businessObject.elem, {}, {
                id: businessObject.id + '_di'
            });
        }
    }
    this.businessObject = businessObject;

};