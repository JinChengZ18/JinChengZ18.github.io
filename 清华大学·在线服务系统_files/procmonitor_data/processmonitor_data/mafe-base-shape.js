/**
 * 定义节点基础�?
 */
var PMCommandReconnect = function (rec, opt) {
    var CmdReconnect = function (receiver) {
        PMUI.command.CommandReconnect.call(this, receiver);
        CmdReconnect.prototype.init.call(this, receiver, opt);
    };

    CmdReconnect.prototype = new PMUI.command.CommandReconnect(rec);

    CmdReconnect.prototype.init = function (receiver, opt) {
        
      
    };


    CmdReconnect.prototype.execute = function () {
    
    };

    CmdReconnect.prototype.undo = function () {
      
    };
    return new CmdReconnect(rec);
};

var PMSegmentDragBehavior = function (options) {

};
PMSegmentDragBehavior.prototype = new PMUI.behavior.ConnectionDragBehavior();

/**
 * On drag handler, creates a connection segment from the shape to the current
 * mouse position
 * @param {PMUI.draw.CustomShape} customShape
 * @return {Function}
 */
PMSegmentDragBehavior.prototype.onDrag = function (customShape) {
    return function (e, ui) {
        var canvas = customShape.getCanvas(),
            endPoint = new PMUI.util.Point(),
            realPoint = canvas.relativePoint(e);
        if (canvas.connectionSegment) {
            //remove the connection segment in order to create another one
            $(canvas.connectionSegment.getHTML()).remove();
        }
        
        //Determine the point where the mouse currently is
        endPoint.x = realPoint.x*customShape.canvas.zoomFactor;
        endPoint.y = realPoint.y*customShape.canvas.zoomFactor;

        //creates a new segment from where the helper was created to the
        // currently mouse location

        canvas.connectionSegment = new PMUI.draw.Segment({
            startPoint: customShape.startConnectionPoint,
            endPoint: endPoint,
            parent: canvas,
            color: new PMUI.util.Color(92, 156, 204), 
            zOrder: PMUI.util.Style.MAX_ZINDEX * 2
        });

        //We make the connection segment point to helper in order to get
        // information when the drop occurs
        canvas.connectionSegment.pointsTo = customShape;
        //create HTML and paint
        //canvas.connectionSegment.createHTML();
        canvas.connectionSegment.paint();
    };

};
    var PMConnectHandler = function (options) {

        PMUI.draw.Handler.call(this, options);
        /**
         * Category of this resize handler
         * @type {"resizable"/"nonresizable"}
         */
        this.category = null;

        /**
         * Denotes whether the resize handle is visible or not.
         * @property boolean
         */
        this.visible = false;

        /**
         * JSON used to create an instance of the class Style used when the object is resizable.
         * @property {Object}
         */
        this.resizableStyle = null;

        /**
         * JSON used to create an instance of the class Style used when the object is not resizable.
         * @property {Object}
         */
        this.nonResizableStyle = null;
        
        this.relativeShape =  null;

        // set defaults
        PMConnectHandler.prototype.init.call(this, options);
    };

    PMConnectHandler.prototype = new PMUI.draw.Handler();
    //PMUI.inheritFrom('PMUI.draw.Handler', connectHandler);

    /**
     * The type of each instance of this class.
     * @property {String}
     */
    PMConnectHandler.prototype.type = "PMConnectHandler";

    /**
     * Instance initializer which uses options to extend the config options to initialize the instance
     * @param {Object} options The object that contains the config
     * @private
     */
    PMConnectHandler.prototype.init = function (options) {

        var defaults = {
            width: 10,
            height: 10,
            parent: null,
            orientation: null,
            representation: null,
            resizableStyle: {},
            nonResizableStyle: {},
            zOrder: 2
        };

        // extend recursively the defaultOptions with the given options
        $.extend(true, defaults, options);

        // add default zIndex to this handler
        if (defaults.resizableStyle.cssProperties) {
            defaults.resizableStyle.cssProperties.zIndex = defaults.zOrder;
        }
        if (defaults.nonResizableStyle.cssProperties) {
            defaults.nonResizableStyle.cssProperties.zIndex = defaults.zOrder;
        }

        // init
        this.setParent(defaults.parent)
            .setWidth(defaults.width)
            .setHeight(defaults.height)
            .setOrientation(defaults.orientation)
            .setRepresentation(defaults.representation)
            .setResizableStyle(defaults.resizableStyle)
            .setNonResizableStyle(defaults.nonResizableStyle);

        // create the id
        //this.id = defaults.orientation + defaults.parent.id + "connectHandler";
    };

    /**
     * Sets the parent of this handler
     * @param {PMUI.draw.Shape} newParent
     * @chainable
     */
    PMConnectHandler.prototype.setParent = function (newParent) {
        this.parent = newParent;
        return this;
    };

    /**
     * Gets the parent of this handler.
     * @return {PMUI.draw.Shape}
     */
    PMConnectHandler.prototype.getParent = function () {
        return this.parent;
    };

    /**
     * Paints this resize handler by calling it's parent's `paint` and setting
     * the visibility of this resize handler
     * @chainable
     */
    PMConnectHandler.prototype.paint = function () {
        if (!this.html) {
            throw new Error("paint():  This handler has no html");
        }

        // this line paints the representation (by default a rectangle)
        PMUI.draw.Handler.prototype.paint.call(this);
        
        this.setVisible(this.visible);
        return this;
    };

    /**
     * Sets the category of the resizeHandler (also adds the needed class to
     * make the element resizable)
     * @param newCategory
     * @chainable
     */
    PMConnectHandler.prototype.setCategory = function (newCategory) {
        if (typeof newCategory === "string") {
            this.category = newCategory;
        }
        //if (this.category === "resizable") {
        //    his.color = new PMUI.util.Color(255, 204, 0);
        //    this.style.addClasses([
        //        "ui-resizable-handle", "ui-resizable-" + this.orientation
        //    ]);
        //} else {
            this.style.addClasses([newCategory]);
            //this.color = new PMUI.util.Color(255, 204, 0);

            //this.style.removeClasses([
            //    "ui-resizable-handle", "ui-resizable-" + this.orientation
            //]);
        //}
        return this;
    };


    /**
     * Sets the resizable style of this shape by creating an instance of the class Style
     * @param {Object} style
     * @chainable
     */
    PMConnectHandler.prototype.setResizableStyle = function (style) {
        this.resizableStyle = new PMUI.util.Style({
            belongsTo: this,
            cssProperties: style.cssProperties,
            cssClasses: style.cssClasses
        });
        return this;
    };

    /**
     * Sets the non resizable style for this shape by creating an instance of the class Style
     * @param {Object} style
     * @chainable
     */
    PMConnectHandler.prototype.setNonResizableStyle = function (style) {
        this.nonResizableStyle = new PMUI.util.Style({
            belongsTo: this,
            cssProperties: style.cssProperties,
            cssClasses: style.cssClasses
        });
        return this;
    };

        PMConnectHandler.prototype.attachListeners = function () {


        var $handler = $('.dragConnectHandler');
        $handler.mousedown(this.onMouseDown(this));
        //$handler.mouseover(this.onMouseOver(this));
        //if (this.attachEvents && !this.canvas.readOnly) {
            //$shape.on("mousedown", this.onMouseDown(this));
            //$shape.on("mouseup", this.onMouseUp(this));
            //$handler.on("click", this.onClick(this));
          //  this.updateBehaviors();    
        //}
        if (this.relativeShape) {
            //code
            dragOptions = {
                    revert: true,
                    helper: "clone",
                    cursorAt: false,
                    revertDuration: 0,
                    grid: [1, 1],
                    start: this.onDragStart(this.relativeShape),
                    drag: this.onDrag(this.relativeShape),
                    stop: this.onDragEnd(this.relativeShape),
                    //containment: "parent"
                    refreshPositions: true ,
                    cursor: "pointer"
                    //snap: '.dropConnectHandler',
                    //snapMode: 'inner',
                    //snapTolerance: 10,
        
                };
             $(this.html).draggable(dragOptions);

            
        }
        
        //$handler.droppable(dropOptions);
        return this;
    };
PMConnectHandler.prototype.attachDrop = function () {
    dropOptions = {
                    accept:  '.dragConnectHandler, .pmui-oval',
                    //activeClass: "ui-state-hover",
                    hoverClass: "ui-state-hover",
                    drop: this.onDrop(this.relativeShape, this),
                    over: this.onDropOver(this.relativeShape, this)
                    
                    //out: this.onDropOut(this.parent, this),
      //              greedy: true,
                    //live: true
                    
                };
            $('.dropConnectHandler').droppable(dropOptions);
};

PMConnectHandler.prototype.onMouseDown = function (customShape) {
    return function (e, ui) {
        e.preventDefault();
        e.stopPropagation();
    }
};

    PMConnectHandler.prototype.onMouseOver = function (customShape) {
        return function (e, ui) {
            e.preventDefault();
            e.stopPropagation();
            //PMUI.getActiveCanvas.isMouseOverHelper = true;
            //if (PMUI.getActiveCanvas.hightLightShape) {
            //    PMUI.getActiveCanvas.hightLightShape.showAllConnectDragHelpers();
            //}
            //customShape.showAllConnectDragHelpers();
        }
    };
    PMConnectHandler.prototype.onMouseOut = function (customShape) {
        return function (e, ui) {
            e.preventDefault();
            e.stopPropagation();
            PMUI.getActiveCanvas.isMouseOverHelper = false;
            if (PMUI.getActiveCanvas.hightLightShape) {
                PMUI.getActiveCanvas.hideDragConnectHandlers();
            }
        }
    };


    PMConnectHandler.prototype.onDragStart = function (customShape) {
    	
        return function (e, ui) {
            if (!customShape.canvas.currentConnection) {
                customShape.canvas.isDraggingConnectHandler = true;
                var canvas = customShape.canvas,
                    currentLabel = canvas.currentLabel,
                    realPoint = canvas.relativePoint(e),
                    startPortX = e.pageX - customShape.getAbsoluteX(),
                    startPortY = e.pageY - customShape.getAbsoluteY();
                
                // empty the current selection so that the segment created by the
                // helper is always on top
                customShape.canvas.emptyCurrentSelection();
                
                if (currentLabel) {
                    currentLabel.loseFocus();
                    $(currentLabel.textField).focusout();
                }
                if (customShape.family !== "CustomShape") {
                    return false;
                }
                customShape.setOldX(customShape.getX());
                customShape.setOldY(customShape.getY());
                
                //customShape.startConnectionPoint.x += customShape.getAbsoluteX();
                //customShape.startConnectionPoint.y += customShape.getAbsoluteY();
                customShape.startConnectionPoint.x = customShape.canvas.zoomFactor*realPoint.x;
                customShape.startConnectionPoint.y = customShape.canvas.zoomFactor*realPoint.y - canvas.getY();
            } else {
                customShape.canvas.currentConnection.disconnect();
            }
            
            
    //        customShape.increaseParentZIndex(customShape.parent);
            return true;

        };
 };
 PMConnectHandler.prototype.onDragEnd = function (customShape) {
        return function (e, ui) {
            if (!customShape.canvas.currentConnection) {
                customShape.canvas.isDraggingConnectHandler = false;
                if (customShape.canvas.connectionSegment) {
                    //remove the connection segment left
                    $(customShape.canvas.connectionSegment.getHTML()).remove();
                }
                customShape.setPosition(customShape.getOldX(), customShape.getOldY());
                customShape.dragging = false;
                customShape.canvas.hideDragConnectHandlers();
                customShape.canvas.hideDropConnectHandlers();
            } else {
                if (customShape.canvas.connectionSegment) {
                    //remove the connection segment left
                    $(customShape.canvas.connectionSegment.getHTML()).remove();
                    customShape.canvas.currentConnection.connect();
                    customShape.canvas.currentConnection.setSegmentMoveHandlers();
                    customShape.canvas.currentConnection.showPortsAndHandlers();
                }
            }
            
        };
    };


PMConnectHandler.prototype.onDrag = function (customShape) {
    return function (e, ui) {
        if (customShape.canvas.currentConnection) {
        	
            canvas = customShape.canvas;
            endPoint = new PMUI.util.Point();

            var startPoint;
            if (canvas.connectionSegment) {
                $(canvas.connectionSegment.getHTML()).remove();
            }

            endPoint.x = e.pageX - canvas.getX() + canvas.getLeftScroll() - canvas.getAbsoluteX();
            endPoint.y = e.pageY - canvas.getY() + canvas.getTopScroll() - canvas.getAbsoluteY();

            //make connection segment
            otherPort = customShape.connection.srcPort.getPoint(false)
                .equals(customShape.getPoint(false)) ? customShape.connection.destPort :
                        customShape.connection.srcPort;

            startPoint = otherPort.getPoint(false);
            startPoint.x = startPoint.x - canvas.getAbsoluteX();
            startPoint.y = startPoint.y - canvas.getAbsoluteY();

            canvas.connectionSegment = new PMUI.draw.Segment({
                startPoint: startPoint,
                endPoint: endPoint,
                parent: canvas
            });
            //canvas.connectionSegment.pointsTo = port;
            canvas.connectionSegment.createHTML();
            canvas.connectionSegment.paint();
        } else {
            customShape.canvas.isDraggingConnectHandler = true;
            var canvas = customShape.getCanvas(),
                endPoint = new PMUI.util.Point(),
                realPoint = canvas.relativePoint(e);
            if (canvas.connectionSegment) {
                //remove the connection segment in order to create another one
                $(canvas.connectionSegment.getHTML()).remove();
            }
            //Determine the point where the mouse currently is
            endPoint.x = realPoint.x*customShape.canvas.zoomFactor - canvas.getX();;
            endPoint.y = realPoint.y*customShape.canvas.zoomFactor - canvas.getY();


            //creates a new segment from where the helper was created to the
            // currently mouse location
           
            canvas.connectionSegment = new PMUI.draw.Segment({
                startPoint: customShape.startConnectionPoint,
                endPoint: endPoint,
                parent: canvas,
                zOrder: PMUI.util.Style.MAX_ZINDEX * 2
            });
                
            //We make the connection segment point to helper in order to get
            // information when the drop occurs
            canvas.connectionSegment.pointsTo = customShape;
            //create HTML and paint
            //canvas.connectionSegment.createHTML();
            canvas.connectionSegment.paint();
        }
        
        
    };
};

PMConnectHandler.prototype.onClick = function (obj) {
    return function (e, ui) {
        alert('clicked');
    };
};

    /**
     * Drag enter hook for this drop behavior, marks that a shape is over a
     * droppable element
     * @param {PMUI.draw.Shape} shape
     * @return {Function}
     */
    PMConnectHandler.prototype.onDropOver = function (shape, handler) {
        return function (e, ui) {
            //shape.entered = true;
            //handler.style.remove
            //handler.style.addClasses(['pmConnnectHandler']);
        };
    };

    /**
     * Drag leave hook for this drop behavior, marks that a shape has left a
     * droppable element
     * @param {PMUI.draw.Shape} shape
     * @return {Function}
     */
    PMConnectHandler.prototype.onDropOut = function (shape, handler) {
        return function (e, ui) {
            shape.entered = false;
            handler.style.addClasses(['pmConnnectHandler']);
        };
    };
    /**
     * On drop handler for this drop behavior, creates a connection between the
     * droppable element and the dropped element, or move ports among those shapes
     * @param {PMUI.draw.Shape} shape
     * @return {Function}
     */
    /*连接线改变位置时调用*/
PMConnectHandler.prototype.onDrop = function (shape, handler) {
    var that = this;
    return function (e, ui) {
    	var  connection;
        if (!shape.canvas.currentConnection) {
            var canvas  = shape.getCanvas(),
                id = ui.draggable.attr('id'),
                x,
                y,
                currLeft,
                currTop,
                startPoint,
                sourceShape,
                sourcePort,
                endPort,
                endPortXCoord,
                endPortYCoord,
                currentConnection = canvas.currentConnection,
                srcPort,
                dstPort,
                port,
                prop,
                success = false,
                command,
                aux,
                segmentMap;
            shape.entered = false;
                startPoint = shape.canvas.connectionSegment.startPoint;
                sourceShape = shape.canvas.connectionSegment.pointsTo;
                //determine the points where the helper was created
                if (sourceShape.parent && sourceShape.parent.id === shape.id) {
                    return true;
                }
                if (!PMDesigner.connectValidator.isValid(sourceShape, shape).result) {
                    //show invalid message
                    PMDesigner.msgFlash(PMDesigner.connectValidator.isValid(sourceShape, shape).msg, document.body, 'info', 3000, 5);
                    return false;
                }
                if (((sourceShape.extendedType === 'START') || (sourceShape.extendedType === 'START' && (sourceShape.evn_marker === 'MESSAGE'|| sourceShape.evn_marker === 'TIMER'))) && !PMDesigner.connectValidator.oneToOneValidator(sourceShape).result) {
                    //show invalid message
                    PMDesigner.msgFlash(PMDesigner.connectValidator.oneToOneValidator(sourceShape, shape).msg, document.body, 'info', 3000, 5);
                    return false;
                }
                sourceShape.setPosition(sourceShape.oldX, sourceShape.oldY);
                startPoint.x -= sourceShape.absoluteX - shape.canvas.getAbsoluteX();
                startPoint.y -= sourceShape.absoluteY - shape.canvas.getAbsoluteY();
                //create the ports
                sourcePort = new PMUI.draw.Port({
                    width: 10,
                    height: 10
                });
                endPort = new PMUI.draw.Port({
                    width: 10,
                    height: 10
                });
    
                //determine the position where the helper was dropped
                endPortXCoord = ui.offset.left - shape.canvas.getX() -
                    shape.getAbsoluteX() + shape.canvas.getLeftScroll();
                endPortYCoord = ui.offset.top - shape.canvas.getY() -
                    shape.getAbsoluteY() + shape.canvas.getTopScroll();
                // add ports to the corresponding shapes
                // addPort() determines the position of the ports
                sourceShape.addPort(sourcePort, startPoint.x, startPoint.y);
                shape.addPort(endPort, endPortXCoord, endPortYCoord,
                    false, sourcePort);
    
                //add ports to the canvas array for regularShapes
                //shape.canvas.regularShapes.insert(sourcePort).insert(endPort);
                //create the connection
                connection = new PMFlow({
                    srcPort : sourcePort,
                    destPort: endPort,
                    segmentColor: new PMUI.util.Color(0, 0, 0),
                    name: " ",
                    canvas : shape.canvas,
                    segmentStyle: shape.connectionType.segmentStyle,
                    flo_type: shape.connectionType.type
                });
    
                connection.setSrcDecorator(new PMUI.draw.ConnectionDecorator({
                    width: 11,
                    height: 11,
                    canvas: canvas,
                    decoratorPrefix: (typeof shape.connectionType.srcDecorator !== 'undefined'
                        && shape.connectionType.srcDecorator !== null) ?
                            shape.connectionType.srcDecorator : "mafe-decorator",
                    decoratorType: "source",
                    parent: connection
                }));
    
                connection.setDestDecorator(new PMUI.draw.ConnectionDecorator({
                    width: 11,
                    height: 11,
                    canvas: canvas,
                    decoratorPrefix: (typeof shape.connectionType.destDecorator !== 'undefined'
                        && shape.connectionType.destDecorator !== null) ?
                            shape.connectionType.destDecorator : "mafe-decorator",
                    decoratorType: "target",
                    parent: connection
                }));
                connection.canvas.commandStack.add(new PMUI.command.CommandConnect(connection));
    
                //connect the two ports
                connection.connect();
                connection.setSegmentMoveHandlers();
    
                //add the connection to the canvas, that means insert its html to
                // the DOM and adding it to the connections array
                canvas.addConnection(connection);
    
                // Filling PMFlow fields
                connection.setTargetShape(endPort.parent);
                connection.setOriginShape(sourcePort.parent);
                connection.savePoints();
    
                // now that the connection was drawn try to create the intersections
                connection.checkAndCreateIntersectionsWithAll();
    
                //attaching port listeners
                sourcePort.attachListeners(sourcePort);
                endPort.attachListeners(endPort);
    
                // finally trigger createEvent
                canvas.triggerCreateEvent(connection, []);
        } else {
        		connection = shape.canvas.currentConnection;
                var id = ui.draggable.attr('id'),
                targetShape,
                sourceShape,
                originalType,
                canvas  = shape.getCanvas();
    
                if (shape.canvas.dragConnectHandlers.get(0).id === id) {
                    port = shape.canvas.dragConnectHandlers.get(0).relativeShape;
                    targetShape = shape.canvas.dragConnectHandlers.get(1).relativeShape.parent;
                    sourceShape= shape;

                } else if (shape.canvas.dragConnectHandlers.get(1).id === id) {
                    port = shape.canvas.dragConnectHandlers.get(1).relativeShape;
                    sourceShape = shape.canvas.dragConnectHandlers.get(0).relativeShape.parent;
                    targetShape = shape;
                } else {
                    port = null;
                }

                originalType = connection.flo_type;
                if (!PMDesigner.connectValidator.isValid(sourceShape, targetShape, true).result) {
                    //show invalid message
                    PMDesigner.msgFlash(PMDesigner.connectValidator.isValid(sourceShape, targetShape, true).msg, document.body, 'info', 3000, 5);
                    return false;
                }
                if (originalType !== targetShape.connectionType.type) {
                    PMDesigner.msgFlash('Invalid connection type'.translate(), document.body, 'info', 3000, 5);
                    targetShape.connectionType.type = originalType;
                    return false;
                }
                if ((sourceShape.extendedType === 'START' && (sourceShape.evn_marker === 'MESSAGE'|| sourceShape.evn_marker === 'TIMER')) && !PMDesigner.connectValidator.oneToOneValidator(sourceShape).result) {
                    //show invalid message
                    PMDesigner.msgFlash(PMDesigner.connectValidator.oneToOneValidator(sourceShape, shape).msg, document.body, 'info', 3000, 5);
                    return false;
                }

                port.setOldParent(port.getParent());
                port.setOldX(port.getX());
                port.setOldY(port.getY());
                
                x = ui.position.left;
                y = ui.position.top;

                endPortXCoord = ui.offset.left - shape.canvas.getX() -
                    shape.getAbsoluteX() + shape.canvas.getLeftScroll();
                endPortYCoord = ui.offset.top - shape.canvas.getY() -
                    shape.getAbsoluteY() + shape.canvas.getTopScroll();
                port.setPosition(endPortXCoord, endPortYCoord);
                shape.dragging = false;
                if (shape.getID() !== port.parent.getID()) {
                    port.parent.removePort(port);
                    currLeft = ui.offset.left - canvas.getX() -
                        shape.absoluteX + shape.canvas.getLeftScroll();
                    currTop = ui.offset.top - canvas.getY() - shape.absoluteY +
                        shape.canvas.getTopScroll();
                    shape.addPort(port, currLeft, currTop, true);
                    canvas.regularShapes.insert(port);
                } else {
                    shape.definePortPosition(port, port.getPoint(true));
                }

                aux = {
                    before: {
                        condition: connection.flo_condition,
                        type: connection.flo_type,
                        segmentStyle: connection.segmentStyle,
                        srcDecorator: connection.srcDecorator.getDecoratorPrefix(),
                        destDecorator: connection.destDecorator.getDecoratorPrefix()
                    },
                    after: {
                        type: targetShape.connectionType.type,
                        segmentStyle: targetShape.connectionType.segmentStyle,
                        srcDecorator: connection.srcDecorator.getDecoratorPrefix(),
                        destDecorator: connection.destDecorator.getDecoratorPrefix()
                    }
                };
                connection.connect();
                
                canvas.triggerPortChangeEvent(port);
                connection.disconnect();
                command = new  PMCommandReconnect(port, aux);
                //command.execute();
                canvas.commandStack.add(command);
                canvas.hideDropConnectHandlers();
        }

//        if(shape.extendedType === 'CONCURRENT'){
//        	if((connection.destPort.x >= -10 && connection.destPort.x <= 10) || (connection.destPort.x >= shape.getWidth()-10 && connection.destPort.x <= shape.getWidth()+10)){
//        		shape.changeDirection("horizontal");
//        	}else if((connection.destPort.y >= -10 && connection.destPort.y <= 10) || (connection.destPort.y >= shape.getHeight()-10 && connection.destPort.y <= shape.getHeight()+10)){
//        		shape.changeDirection("vertical");
//        	}
//        }
        return false;
        };
    };

var PMShape = function (options) {
    PMUI.draw.CustomShape.call(this, options);
    this.extended = null;
    this.extendedType = null;
    this.relationship = null;

    this.midPointArray = [];
    this.htmlPorts = null;
    this.hasConnectHandlers = false;

    /**
     * Stores the label object used to show into the canvas
     * @type {Object}
     * @private
     */
    this.label = this.labels.get(0);
    this.diffXMidPoint = [-1, -4, -1, 4];
    this.diffYMidPoint = [4, -1, -4, -1];
    this.focusLabel = false;
    /**
     * Array of markers added to this activity
     * @type {Array}
     */
    this.markersArray = new PMUI.util.ArrayList();
    this.validatorMarker = null;
    this.errors = new PMUI.util.ArrayList();
    this.businessObject = {};
    /**
     * 记录节点出边线的条数
     * */
    this.src_count=null;
    PMShape.prototype.init.call(this, options);
};

PMShape.prototype = new PMUI.draw.CustomShape();

PMShape.prototype.type = 'PMShape';
PMShape.prototype.pmConnectionDropBehavior = null;
PMShape.prototype.pmContainerDropBehavior = null;
PMShape.prototype.supportedArray = [];
PMShape.prototype.init = function (options) {
    var defaults = {
    	src_count: 0,
        extended: {},
        relationship: {},
        corona: {},
        focusLabel: false
    };
    jQuery.extend(true, defaults, options);
    this.setExtended(defaults.extended)
        .setExtendedType(defaults.extendedType)
        .setRelationship(defaults.relationship)
        .setFlowSrcCount(defaults.src_count);
    if (defaults.markers) {
        this.addMarkers(defaults.markers, this);
    }// validatorMarker
    if (defaults.validatorMarker) {
        this.addValidatorMarkers(defaults.validatorMarker, this);
    }// corona
    if (defaults.corona) {
        this.setCorona(defaults.corona);
    }
    this.focusLabel = defaults.focusLabel;
        //.createConnectHandlers('class','class');

};

PMShape.prototype.setFlowSrcCount=function(srcCount){
	this.src_count=srcCount;
	return this;
}
PMShape.prototype.getFlowSrcCount=function(srcCount){
	return this.src_count;
}
/**
 * Sets the label element
 * @param {String} value
 * @return {*}
 */
PMShape.prototype.setName = function (value) {
    if (this.label) {
        this.label.setMessage(value);
    }
    return this;
};

/**
 * Returns the label text
 * @return {String}
 */
PMShape.prototype.getName = function () {
    var text = "";
    if (this.label) {
        text = this.label.getMessage();
    }
    return text;
};
PMShape.prototype.setExtendedType = function (type) {
    this.extendedType = type;
    return this;
};
PMShape.prototype.getDataObject = function() {
    return {
};
};
PMShape.prototype.setRelationship = function (relationship) {
    this.relationship = relationship;
    return this;
};
PMShape.prototype.addRelationship = function (object) {
    if (typeof object === "object") {
        jQuery.extend(true, this.relationship, object);
    }
    return this;
};
PMShape.prototype.setExtended = function (extended) {
    var ext;
    ext = (typeof extended === 'object')? extended : {};
    this.extended = ext;
    return this;
};
PMShape.prototype.getExtendedObject = function () {
    this.extended = {
        extendedType: this.extendedType
    };
    return this.extended;
};
PMShape.prototype.getMarkers = function () {
    return this.markersArray;
};
//PMShape.prototype.setDropBehavior = function (obj) {
//    var factory = new PMUI.behavior.BehaviorFactory({
//            products:{
//                "pmconnection": PMConnectionDropBehavior,
//                "connectioncontainer": PMUI.behavior.ConnectionContainerDropBehavior,
//                "connection": PMUI.behavior.ConnectionDropBehavior,
//                "container": PMUI.behavior.ContainerDropBehavior,
//                "nodrop": PMUI.behavior.NoDropBehavior
//            },
//            defaultProduct: "nodrop"
//        });
//    this.drop = factory.make(obj);
//    return this;
//};
PMShape.prototype.dropBehaviorFactory = function (type, selectors) {
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
    } else {
        return PMUI.draw.CustomShape.prototype.dropBehaviorFactory.call(this, type, selectors);
    }
};
//为形状设置拖拽规�?by siqq
PMShape.prototype.setDragBehavior = function (obj) {
	var factory
	if(patternFlag=='Monitor' || patternFlag=='PrvView'){//流程监控不允许拖拽
		factory = new PMUI.behavior.BehaviorFactory({
	        products: {
	            "pmsegment": PMSegmentDragBehavior,
//	            "customshapedrag" : PMCustomShapeDragBehavior,
	            //"customshapedrag" : PMUI.behavior.CustomShapeDragBehavior,
	            "regulardrag": PMUI.behavior.RegularDragBehavior,
	            "connectiondrag": PMUI.behavior.ConnectionDragBehavior,
	            "connection": PMUI.behavior.ConnectionDragBehavior,
	            "nodrag": PMUI.behavior.NoDragBehavior
	        },
	        defaultProduct: "nodrag"
	    });
	}else{
		factory = new PMUI.behavior.BehaviorFactory({
	        products: {
	            "pmsegment": PMSegmentDragBehavior,
	            "customshapedrag" : PMCustomShapeDragBehavior,
	            //"customshapedrag" : PMUI.behavior.CustomShapeDragBehavior,
	            "regulardrag": PMUI.behavior.RegularDragBehavior,
	            "connectiondrag": PMUI.behavior.ConnectionDragBehavior,
	            "connection": PMUI.behavior.ConnectionDragBehavior,
	            "nodrag": PMUI.behavior.NoDragBehavior
	        },
	        defaultProduct: "nodrag"
	    });
	}
    
    this.drag = factory.make(obj);
    if (this.html && this.drag) {
        this.drag.attachDragBehavior(this);
        
    }
    if (this.canvas) {
        this.canvas.hideDragConnectHandlers();
    }
    
    return this;
};
/**
 * This function will attach all the listeners corresponding to the CustomShape
 * @chainable
 */
PMShape.prototype.attachListeners = function () {
    var that = this;
    if (this.html === null) {
        return this;
    }
   
    //drag options for the added shapes
    if (!this.canvas.readOnly) {
        var $customShape = $(this.html).click(this.onClick(this));
        $customShape.on("mousedown", this.onMouseDown(this));
        //$customShape.mousemove(this.onMouseMove(this));
        $customShape.mouseup(this.onMouseUp(this));
        $customShape.mouseover(this.onMouseOver(this));
        $customShape.mouseout(this.onMouseOut(this));
        //enter和leave为自定义tooltip做
        if(this.extendedType == 'TASK'){
        	$customShape.mouseenter(this.onMouseEnter(this));
            $customShape.mouseleave(this.onMouseLeave(this));
        }
        $customShape.dblclick(this.onDblClick(this));
        $customShape.on("contextmenu", function (e) {
            e.preventDefault();
        });
        this.updateBehaviors();
        //$customShape.droppable({
        //         accept:  '.dragConnectHandler, .pmui-port',
        //        
        //          drop: this.onDrop(this),
        //          over: this.onDropOver(this),
        //          //out: this.onDropOut(this),
        //          greedy: true,
        //          tolerance: 'intersect'
        //    })


    } else {
        if(this.canvas.hasClickEvent) {
            var $customShape = $(this.html).click(function(e){
                if(that.hasClick) {
                    that.hasClick(e);
                }
            });
            this.updateBehaviors(); 
        }
    }


    return this;

};

PMShape.prototype.showConnectDropHelper = function (i, customShape) {
    var connectHandler, x, y;
    connectHandler = customShape.canvas.dropConnectHandlers.get(i);
    connectHandler.setDimension(18*customShape.canvas.getZoomFactor(), 18*customShape.canvas.getZoomFactor());
    x = customShape.getAbsoluteX() - customShape.canvas.getAbsoluteX()+customShape.xMidPoints[i] - connectHandler.width/2 - 1;
    y = customShape.getAbsoluteY() - customShape.canvas.getAbsoluteY()+customShape.yMidPoints[i] - connectHandler.height/2 - 1;
    if (customShape.parent.type !== 'PMCanvas') {
        x += 3;
        y += 2;
    }
    connectHandler.setPosition(x, y);

    connectHandler.relativeShape = customShape;
    connectHandler.attachDrop();
    //connectHandler.paint();
    connectHandler.setVisible(true);
    connectHandler.setZOrder(103);
};

/**
 * Handler for the onmousedown event, changes the draggable properties
 * according to the drag behavior that is being applied
 * @param {PMUI.draw.CustomShape} CustomShape
 * @returns {Function}
 */
PMShape.prototype.onMouseDown = function (customShape) {
    return function (e, ui) {
    	clearTimeout(this.timeOut);
   	 	$("#tooltip").remove();
        var canvas = customShape.canvas;
        if (customShape.getType() === 'PMPool' || customShape.getType() === 'PMLane') {
            canvas.cancelConnect();
        }
        if (e.which === 3) {
            $(canvas.html).trigger("rightclick", [e, customShape]);
        } else {
           canvas.hideDragConnectHandlers();
           canvas.hideDropConnectHandlers();
            customShape.dragType = 2;
            if (customShape.dragType === customShape.DRAG) {
                if(!(customShape.getType() === 'PMEvent' && customShape.getEventType() === 'BOUNDARY')) {
                    customShape.setDragBehavior("customshapedrag");
                }
            } else if (customShape.dragType === customShape.CONNECT) {
                //customShape.setDragBehavior("pmsegment");
            } else {
                customShape.setDragBehavior("nodrag");
            }
        }
            customShape.dragging = true;
        //
        e.stopPropagation();
        
    };
};

/**
 * @event mouseup
 * Moused up callback fired when the user mouse ups on the `shape`
 * @param {PMUI.draw.Shape} shape
 */
PMShape.prototype.onMouseUp = function (customShape) {
    return function (e, ui) {
        //e.stopPropagation();
        e.preventDefault();

        if (customShape.canvas.canConnect
            && customShape.canvas.connectStartShape.getID() !== customShape.getID()
            && customShape.getType() !== 'PMPool'
            && customShape.getType() !== 'PMLane') {

            customShape.canvas.connectProcedure(customShape, e);
        }
        if (customShape.canvas.canCreateShape
            && customShape.canvas.connectStartShape.getID() !== customShape.getID()
            && (customShape.getType() === 'PMPool' || customShape.getType() === 'PMLane' || customShape.getType() === 'PMParallel')) {
            //e.stopPropagation();
            customShape.canvas.manualCreateShape(customShape, e);
        }
    };
};
PMShape.prototype.showConnectDragHelpers = function (i, shape) {
    var y, x, connectHandler;
    connectHandler = shape.canvas.dragConnectHandlers.get(i);
    connectHandler.setDimension(15*shape.canvas.getZoomFactor(), 15*shape.canvas.getZoomFactor());
    //connectHandler.setPosition(shape.getZoomX()+shape.xMidPoints[i] - connectHandler.width/2 -1 , shape.getZoomY()+shape.yMidPoints[i]-connectHandler.height/2 -1);
    x = shape.getAbsoluteX() - shape.canvas.getAbsoluteX()+shape.xMidPoints[i] - connectHandler.width/2 -1;
    y = shape.getAbsoluteY()- shape.canvas.getAbsoluteY()+1+shape.yMidPoints[i]-connectHandler.height/2 -1;
    if (shape.parent.type !== 'PMCanvas') {
        x += 3;
        y += 2;
    }
    connectHandler.setPosition(x, y);

    //connectHandler.paint();

    connectHandler.setVisible(true);
    connectHandler.relativeShape = shape;
    connectHandler.attachListeners();
};

PMShape.prototype.showAllConnectDragHelpers = function () {
    var shape = this, i, connectHandler;
    if (shape.canvas.isDragging || shape.canvas.currentLabel ||shape.entered  || shape.canvas.isResizing || PMUI.isCtrl) {
        shape.canvas.hideDragConnectHandlers();
        return;
    }
    if (!shape.canvas.isDraggingConnectHandler && !shape.dragging &&
        !shape.canvas.currentSelection.find('id', shape.id) &&
        !shape.canvas.currentConnection &&
        !shape.canvas.isMouseDown) {

        if (shape.extendedType === "TEXT_ANNOTATION") {
            shape.canvas.hideDragConnectHandlers();
            shape.showConnectDragHelpers(3,shape);
            for (i = 0; i < shape.canvas.dragConnectHandlers.getSize(); i += 1) {
                //for (i = 0; i < 4; i += 1) {
                connectHandler = shape.canvas.dragConnectHandlers.get(i);
                connectHandler.relativeShape = shape;
                shape.canvas.hightLightShape = shape;
                connectHandler.attachListeners();
            }
        } else {
            if (shape.extendedType !== "H_LABEL" && shape.extendedType !== "V_LABEL"
                && shape.extendedType !== "LANE" && shape.extendedType !== "POOL"
                &&shape.extendedType !== "GROUP") {
                //for (i = 0; i < shape.canvas.dragConnectHandlers.getSize(); i += 1) {
                shape.canvas.hideDragConnectHandlers();
                shape.canvas.hightLightShape = shape;
                for (i = 0; i < 4; i += 1) {
                    shape.showConnectDragHelpers(i,shape);
                }
                shape.canvas.emptyCurrentSelection();
            }

        }
    }
};
PMShape.getItemXml = function(customShape){
	var rtnXml = "";
	switch(customShape.getType()) {
    case "PMActivity"://节点�?自动，手动，子流�?
    	rtnXml = customShape.getActXml();
    	break;
    case "PMGateway"://分支�?
    	rtnXml = customShape.getGatewayXml();
    	break;
    case "PMEvent": //开始结束节点类
    	rtnXml = customShape.getEventXml();
    	break;
    case "PMFlow":
    case "Connection"://这两个是连接线类
    	break;
    case "PMPool"://泳池
    	break;
    case "PMLane"://泳道
    	break;
    case "PMParallel"://并发节点�?
    	rtnXml = customShape.getConXml();
    	break;
    case "PMArtifact"://注释
    	break;
	}
	return rtnXml;
}
	
PMShape.getItemNumType = function(actType){
	var rtnStr = "";
	switch(actType) {
    case "MANUALTASK":
    	rtnStr = "1";
    	break;
    case "MENU":// AUTO_TASK
    	rtnStr = "0";
    	break;
    case "COLLAPSED":// SUB_PROCESS
    	rtnStr = "2";
    	break;
    case "START":
    	rtnStr = "0";
    	break;
    case "END":
    	rtnStr = "0";
    	break;
    case "EXCLUSIVE":
    	rtnStr = "0";
    	break;
	}
	return rtnStr;
}
//定义节点点击事件
PMShape.prototype.onClick = function (customShape) {
    return function (e) {
    	clearTimeout(this.timeOut);
   	 	$("#tooltip").remove();
    	if(patternFlag=='PrvView' && customShape.type=="PMActivity"){
    		canvas = customShape.canvas;
    		canvas.emptyCurrentSelection();
    		canvas.addToSelection(customShape);
    		var activeNodeXml=customShape.getActXml();
    		var activeNodeId=customShape.getActivityUid();
        	//取出当前节点的xmlString，转化为dom，加入到process对象的xml中，传给属性页面。
        	var processXml=PMDesigner.getProcessXml(1,activeNodeXml);	
        	ids="1,"+activeNodeId;
        	window.parent.nodeClicked(processXml,ids);
    		return this;
    	}
    	//lv.yz 流程监控
    	if(patternFlag=='Monitor'){//如果是流程监控，取消原来所有点击事件，只调用流程监控的显示属性方�?
    		var nodeStr=PMShape.getItemXml(customShape);
    		if(nodeStr === ""){
    			return;
    		}
            if(customShape.type=="PMActivity") {
	        	//取出当前节点的xmlString，转化为dom，加入到process对象的xml中，传给属性页面�?
	            var numType = PMShape.getItemNumType(customShape.getTaskType());
	        	var processXml=PMDesigner.getProcessXml(numType,nodeStr);
	    		 
	    		
	    		var menuNodeId=customShape.getID();
	    		processXml = processXml.replace(/ProcessContent/g,'uwws:ProcessContent');
	    		processXml = processXml.replace('xmlns="http://workflow.neusoft.com/model/"','xmlns:uwws="http://workflow.neusoft.com/model/" xmlns:model="http://workflow.neusoft.com/model/"')
	    		var ids = numType+","+menuNodeId;
	    		window.parent.itemSelected(processXml,ids);
	    		//end of lv.yz 流程监控
            }
    		//点击出现corona即右侧的小形�?
            canvas = customShape.canvas,
            currentSelection = canvas.currentSelection,
            currentLabel = canvas.currentLabel;
	        //hide all coronas
	        customShape.canvas.hideAllCoronas();

	        // hide the current connection if there was one
	        customShape.canvas.hideCurrentConnection();
	
            canvas.emptyCurrentSelection();
            canvas.addToSelection(customShape);
            if (!customShape.canvas.canConnect) {
                if(customShape.canvas.currentLabel === null && $(customShape.act_xml).attr('state')=='1'){
                    customShape.corona.show();
                }
            }
            canvas.coronaShape = customShape;
            
            if (!currentSelection.isEmpty()) {
                canvas.triggerSelectEvent(currentSelection.asArray());
            }
	        if (this.helper) {
	            $(this.helper.html).remove();
	        }
	        customShape.wasDragged = false;
	       
	   	 	e.stopPropagation();
	   	 	//end of 点击出现corona即右侧的小形
    	}else{//不是监控调用
    		 var isCtrl = false,
             canvas = customShape.canvas,
             currentSelection = canvas.currentSelection,
             currentLabel = canvas.currentLabel,
             realPoint;
	         //hide all coronas
	         customShape.canvas.hideAllCoronas();
	         if (e.ctrlKey) { // Ctrl is also pressed
	             isCtrl = true;
	         }
	         // hide the current connection if there was one
	         customShape.canvas.hideCurrentConnection();
	         if (e.which === 3) {        // right click
	             e.preventDefault();
	             // trigger right click
	             customShape.canvas.triggerRightClickEvent(customShape);
	         } else {
	                 if (isCtrl) {
	                     if (currentSelection.contains(customShape)) {
	                         // remove from the current selection
	                         canvas.removeFromSelection(customShape);
	                     } else {
	                         // add to the current selection
	                         canvas.addToSelection(customShape);
	                     }
	
	                 } else {
	                     canvas.emptyCurrentSelection();
	                     canvas.addToSelection(customShape);
	                     if (!customShape.canvas.canConnect) {
	                         if(customShape.canvas.currentLabel === null){
	                             customShape.corona.show();
	                         }
	                     }
	
	                     canvas.coronaShape = customShape;
	                 }
	             if (!currentSelection.isEmpty()) {
	                 canvas.triggerSelectEvent(currentSelection.asArray());
	             }
	         }
	
	         if (this.helper) {
	             $(this.helper.html).remove();
	         }
	         customShape.wasDragged = false;
    	}
    	//start 并发体中，点击线附近的10像素，即可选中线
        realPoint = canvas.relativePoint(e);
        realPoint.x = realPoint.x * canvas.zoomFactor;
        realPoint.y = realPoint.y * canvas.zoomFactor;
        figure = canvas.getBestConnecion(realPoint);
        canvas.hideDropConnectHandlers();
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
        //end of 并发体中，点击线附近的10像素，即可选中线
//        if(patternFlag=='FormServerDesigner'){//表单新建服务的节点点击事件
//        	if(customShape.type!="PMActivity") {
//        		return;
//        	}
////        	$('#ms1').magicSuggest(true).clear(true);//clear([boolean] silent),不触发selectionChange事件
////        	$('#ms2').magicSuggest(true).clear(true);
//        	$('#currentMappingID').val(customShape.getActivityUid());
//    		var nodeName = customShape.getActName();
//    		$('#propertyNodeName').val(nodeName);
//    		var paticipantsNamesArray = new Array(),
//    		dynamicPartisArray = new Array(),
//    		idAndType="",
//    		participants = $(customShape.act_xml).find('Participant');
//	    	if(participants.size()!=0){
//	    		var namesArrayString = "";
//	    		$.each(participants,function(i,item){//name,id|roleOrPerson
//	    			var typeAndID,dynamicID;
//	    			if($(item).attr('type')!='10'){//type:0-人员;1-角色;7-节点;8-变量;
//	    				typeAndID = $(item).attr('type') +","+$(item).attr('value');
//	    			}else {
//	    				dynamicID = $(item).attr('value');
//	    			}
//	    			if(typeAndID){
//	    				paticipantsNamesArray.push(typeAndID);
//	    			}
//	    			if(dynamicID){
//	    				dynamicPartisArray.push(dynamicID);
//	    			}
//	    			
//	    			namesArrayString+=typeAndID+";";
//	    		})
////	    		$('#ms1').magicSuggest(true).setValue(paticipantsNamesArray);
//	    		
////	    		$('#ms2').magicSuggest(true).setValue(dynamicPartisArray);
//	    	}
//        }//dante
    	 e.stopPropagation();
    };
};
PMShape.prototype.onDblClick = function (customShape) {
	if(patternFlag==="Monitor" || patternFlag==="PrvView" || customShape.extendedType==="PARALLEL" || customShape.extendedType==="INCLUSIVE"){
		 return function (e) {
		     customShape.canvas.hideAllFocusLabels();
		     e.preventDefault();
		     e.stopPropagation();
		 };
	}
    return function (e) {
        customShape.canvas.hideAllFocusLabels();
        customShape.label.getFocus();
        e.preventDefault();
        e.stopPropagation();
    };
};
PMShape.prototype.onMouseOver = function (customShape) {
    //var that = this;
    return function (e, ui) {
        var layer,
            canConnect = true;
        /*if(customShape.canvas.connectStartShape.extendedType==="PARALLEL"){
        };*/
        if (customShape.canvas.canConnect
            && customShape.canvas.connectStartShape.getID() !== customShape.getID()
            && customShape.getType() !== 'PMPool'
            && customShape.getType() !== 'PMLane'
            && customShape.getType() !== 'PMParallel') {
            //validate if can connect green, else is red
            layer = customShape.getLayers().find('layerName', 'second-layer');
            if (layer) {
                layer.setVisible(true);
                if (!PMDesigner.connectValidator.isValid(customShape.canvas.connectStartShape, customShape).result) {
                    canConnect = false;
                }
                if (((customShape.canvas.connectStartShape.extendedType === 'START') || (customShape.canvas.connectStartShape.extendedType === 'START' && (customShape.canvas.connectStartShape.evn_marker === 'MESSAGE'|| customShape.canvas.connectStartShape.evn_marker === 'TIMER'))) && !PMDesigner.connectValidator.oneToOneValidator(customShape.canvas.connectStartShape).result) {
                    canConnect = false;
                }
                if (customShape.canvas.connectStartShape.getType() === 'PMActivity'
                    && !customShape.getType() === 'PMArtifact'
                    && !PMDesigner.connectValidator.oneToOneValidator(customShape.canvas.connectStartShape).result) {
                    canConnect = false;
                }
                layer.removeCSSClasses(['mafe-can-not-connect-layer', 'mafe-can-connect-layer']);
                if (canConnect) {
                    layer.addCSSClasses(['mafe-can-connect-layer']);
                } else {
                    layer.addCSSClasses(['mafe-can-not-connect-layer']);
                }
            }
        }
        e.preventDefault();
        e.stopPropagation();

        //$(shape.html).css( 'cursor', 'move' );
        //shape.showAllConnectDragHelpers();
    };


};

PMShape.prototype.onMouseEnter = function (customShape) {
	//自定义 手动节点tooltip
    return function (e, ui) {
    	if(customShape.canvas.isDragging){
    		return;
    	}
    	PMDesigner.timeOut = setTimeout(customShape._customTooltipShow(customShape,e,ui), 1200 );
	    
    };
};
PMShape.prototype.onMouseLeave = function (customShape) {
    var that = this;
    return function (e, ui) {
    	clearTimeout(PMDesigner.timeOut);
    	 $("#tooltip").remove(); 
    };
};
PMShape.prototype._customTooltipShow = function(customShape,e,ui){
	return function(){
		customShape.customTooltipShow(customShape,e,ui);
	}
}
PMShape.prototype.getParticipantsInfo = function(){
	var paticipantsNamesArray,idAndType="",assignRule,assignRuleStr,j,
		customShape = this,
		participants = $(customShape.act_xml).find('Participant[authorityType="1"]');
	if(participants.size()!=0){
		$.each(participants,function(i,item){//name,id|roleOrPerson
			if($(item).attr('type')!='10'){//type:0-人员;1-角色;7-节点;8-变量;
				idAndType += $(item).attr('value')+","+$(item).attr('type')+";";
			}else{
				var tmpName;
				switch($(item).attr('value')){
				case '2':
					tmpName = '实例创建者';
					break;
				case '3':
					tmpName = '实例创建者的上一级';
					break;
				case '4':
					tmpName = '前一节点';
					break;
				case '5':
					tmpName = '前一节点的上一级';
					break;
				case '20':
					tmpName = '实例创建者所在部门领导';
					break;
				case '21':
					tmpName = '实例创建者所在机构领导';
					break;
				case '22':
					tmpName = '前一节点所在部门领导';
					break;
				case '23':
					tmpName = '前一节点所在机构领导';
					break;
				}
				customShape.dynamicParticipants += tmpName+'；';
			}
			
		})
		$.ajax({
	        url:  contextPath + "/workflow/getNodeParticipantsName.action",
	        type:"get",
	        data: {
	        	'idAndType':idAndType
	        },
	        async:false,
	        success: function (data){
	        	if(data!=''){
	        		paticipantsNamesArray = data.split(';');
	        	}
	        },
	        error: function (xhr, textStatus, errorThrown){
	        }
		});
	}else{
		idAndType=undefined;
	}
	return paticipantsNamesArray;
}
PMShape.prototype.getParticipantsInfoCC = function(){
	var paticipantsNamesArray,idAndType="",assignRule,assignRuleStr,j,
		customShape = this,
		participants = $(customShape.act_xml).find('Participant[authorityType="0"]');
	if(participants.size()!=0){
		$.each(participants,function(i,item){//name,id|roleOrPerson
			if($(item).attr('type')!='10'){//type:0-人员;1-角色;7-节点;8-变量;
				idAndType += $(item).attr('value')+","+$(item).attr('type')+";";
			}else{
				var tmpName;
				switch($(item).attr('value')){
				case '2':
					tmpName = '实例创建者';
					break;
				case '3':
					tmpName = '实例创建者的上一级';
					break;
				case '4':
					tmpName = '前一节点';
					break;
				case '5':
					tmpName = '前一节点的上一级';
					break;
				case '20':
					tmpName = '实例创建者所在部门领导';
					break;
				case '21':
					tmpName = '实例创建者所在机构领导';
					break;
				case '22':
					tmpName = '前一节点所在部门领导';
					break;
				case '23':
					tmpName = '前一节点所在机构领导';
					break;
				}
				customShape.dynamicParticipantsCC += tmpName+'；';
			}
			
		})
		$.ajax({
	        url:  contextPath + "/workflow/getNodeParticipantsName.action",
	        type:"get",
	        data: {
	        	'idAndType':idAndType
	        },
	        async:false,
	        success: function (data){
	        	if(data!=''){
	        		paticipantsNamesArray = data.split(';');
	        	}
	        },
	        error: function (xhr, textStatus, errorThrown){
	        }
		});
	}else{
		idAndType=undefined;
	}
	return paticipantsNamesArray;
}
PMShape.prototype.dynamicParticipants="";
PMShape.prototype.dynamicParticipantsCC="";
PMShape.prototype.customTooltipShow = function(customShape,e,ui){
	var x = 10, //tooltip偏移鼠标的横坐标 
		y = 10, //tooptip偏移鼠标的纵坐标 
		myTitle;
	customShape.dynamicParticipants="";
	customShape.dynamicParticipantsCC="";
    if(customShape.myTitle===undefined||customShape.myTitle===''){
    	var paticipantsNamesArray = customShape.getParticipantsInfo();
    	var paticipantsNamesArrayCC = customShape.getParticipantsInfoCC();//抄送
    	assignRule = $(customShape.act_xml).attr('assignRule');
    	switch(assignRule){
        	case '0':
        		assignRuleStr = '或签';
        		break;
        	case '1':
        		assignRuleStr = '与签';
        		break;
        	case '3':
        		assignRuleStr = '岗位与签';
        		break;
    	}
    	myTitle = '<p>【办理方式】'+assignRuleStr+'</p>';
    	if(paticipantsNamesArray!==undefined || customShape.dynamicParticipants!= ""){
    		myTitle += '<p>【办理人员】';
    		if(paticipantsNamesArray!==undefined){
    			for(j=0;j<paticipantsNamesArray.length;j++){
            		var type =  paticipantsNamesArray[j].split(',')[0];
            		var name = paticipantsNamesArray[j].split(',')[1];
            		var typeStr="";
            		switch(type){
            		case '0':
            			typeStr = '人员';
            			break;
            		case '1':
            			typeStr = '';
            			break;
            		case '7':
            			typeStr = '节点';
            			break;
            		case '8':
            			typeStr = '变量';
            			break;
            		}
            		
//            		myTitle += typeStr+'['+name+'];';
            		
            		myTitle += name + '；';
            	}
    		}
    		myTitle += customShape.dynamicParticipants + '</p>';
    	}
    	
    	if(paticipantsNamesArrayCC!==undefined || customShape.dynamicParticipantsCC!= ""){
    		myTitle += '<p>【抄送人员】';
    		if(paticipantsNamesArrayCC!==undefined){
    			for(j=0;j<paticipantsNamesArrayCC.length;j++){
            		var type =  paticipantsNamesArrayCC[j].split(',')[0];
            		var name = paticipantsNamesArrayCC[j].split(',')[1];
            		var typeStr="";
            		switch(type){
            		case '0':
            			typeStr = '人员';
            			break;
            		case '1':
            			typeStr = '';
            			break;
            		case '7':
            			typeStr = '节点';
            			break
            		case '8':
            			typeStr = '变量';
            			break;
            		}
            		myTitle +=  name + '；';
            	}
    		}
    		myTitle +=  customShape.dynamicParticipantsCC + '</p>';
    	}
    	
    	var tooltip = "<div id='tooltip' class='custom-tooltip'>" + myTitle + "</div>"; 
    	$("body").append(tooltip); 
    	customShape.myTitle = myTitle;
    }else{
    	var tooltip = "<div id='tooltip' class='custom-tooltip'>" + customShape.myTitle + "</div>"; 
    	$("body").append(tooltip); 
    }
    //处理tooltip在边缘时，显示错位，出边框等问题
    var tooltipLeft = (e.pageX + x) + "px",
    	tooltipTop = (e.pageY + y) + "px";
    if(e.pageY + y +$("#tooltip").height() > window.screen.availHeight){
    	tooltipTop = (e.pageY + y - $("#tooltip").height()-y) + 'px';
    }
    if(e.pageX + x +$("#tooltip").width() > window.screen.availWidth){
    	tooltipLeft = (e.pageX + x - $("#tooltip").width()-x) + 'px';
    }
    $("#tooltip").css({ 
        "top": tooltipTop, 
        "left": tooltipLeft 
    }).show("fast"); 	
}
PMShape.prototype.onMouseOut = function (customShape) {
    var that = this;
    return function (e, ui) {
        var layer;
        customShape.dragging = false;
        e.stopPropagation();
        layer = customShape.getLayers().find('layerName', 'second-layer');
        if(layer) {
            layer.setVisible(false);
        }
        //customShape.canvas.hideDragConnectHandlers();
    };
};


/**
 * Overwrite the parent function to set the dimension
 * @param {Number} x
 * @param {Number} y
 * @return {*}
 */
PMShape.prototype.setDimension = function (x, y) {
    var factor;
    PMUI.draw.CustomShape.prototype.setDimension.call(this, x, y);
    if (this.getType() === 'PMEvent' || this.getType() === 'PMGateway' || this.getType() === 'PMData') {
        factor = 3;
    } else {
        if (this.getType() === 'PMActivity' && theme!=="tradition") {
            factor = 2;
        } else {
            factor = 1;
        }
    }
    if (this.label) {
        //validation for vertical labels case pool and lanes
        if (this.getType() === 'PMPool' || this.getType() === 'PMLane') {
            this.label.updateDimension(false);
        } else {
            this.label.setDimension((this.zoomWidth * 0.9 * factor) / this.canvas.zoomFactor,
                this.label.height);
            this.label.setLabelPosition(this.label.location, this.label.diffX, this.label.diffY);
            this.label.updateDimension(false);
        }

    }
    if (this.getType() === 'PMPool') {
        this.paint();
    }

    return this;
};
/**
 * Creates a drag helper for drag and drop operations for the helper property
 * in jquery ui draggable
 * TODO Create a singleton object for this purpose
 * @returns {String} html
 */
PMShape.prototype.createDragHelper = function () {
    var html = document.createElement("div");
    // can't use class style here
    html.style.width = 8 + "px";
    html.style.height = 8 + "px";
    html.style.borderRadius = "5px";
    html.style.marginTop = "-5px";
    html.style.marginLeft = "-5px";
    html.style.backgroundColor = "rgb(92, 156, 204)";
    html.style.zIndex = 2 * PMUI.draw.Shape.prototype.MAX_ZINDEX;
    html.id = "drag-helper";
    html.className = "drag-helper";
    // html.style.display = "none";
    return html;
};
PMShape.prototype.getContextMenu = function () {
    return {};
};

PMShape.prototype.getHTMLPorts = function () {
    if (!this.htmlPorts) {
        //this.createHTMLPorts();
    }
    return this.htmlPorts;
};


PMShape.prototype.updatePropertiesHTMLPorts = function () {
    var items = jQuery(this.htmlPorts).children(), k,
    point =this.midPointArray;
    for (k = 0; k < items.length; k+=1) {
        items[k].style.left = point[k].x + "px";
        items[k].style.top = point[k].y + "px";
    }

    return this;
};

/**
 * Adds markers to the arrayMarker property
 * @param {Array} markers
 * @param {Object} parent
 * @return {*}
 */
PMShape.prototype.addMarkers = function (markers, parent) {
    var newMarker, i, factoryMarker;
    if (jQuery.isArray(markers)) {
        for (i = 0; i < markers.length; i += 1) {
            factoryMarker = markers[i];
            factoryMarker.parent = parent;
            factoryMarker.canvas = parent.canvas;
            newMarker = new PMMarker(factoryMarker);
            this.markersArray.insert(newMarker);
        }
    }
    return this;
};
/**
 * Adds markers to the arrayMarker property
 * @param {Array} markers
 * @param {Object} parent
 * @return {*}
 */
PMShape.prototype.addValidatorMarkers = function (marker, parent) {
    marker.parent = parent;
    marker.canvas = parent.canvas;
    this.validatorMarker = new PMVAlidatorMarker(marker);
    return this;
};
/**
 * adds a corona to shape
 * @param corona
 */
PMShape.prototype.setCorona = function (options) {
    //TODO ADD CORONA
    var self = this;
    this.corona = new Corona({
        parent: self,
        canvas: self.canvas,
        items: options
    });
    return this;
};

PMShape.prototype.updateLabelsPosition = function () {

    var i,
        label;
    for (i = 0; i < this.labels.getSize(); i += 1) {
        label = this.labels.get(i);
        label.setLabelPosition(label.location, label.diffX, label.diffY);
        label.paint();
    }
    return this;
};
/**
 * Paint the shape
 */ 
PMShape.prototype.paint = function () {
    var m, marker, size, width;
    PMUI.draw.CustomShape.prototype.paint.call(this);
    size =  this.markersArray.getSize();
    for (m = 0; m < size; m += 1) {
        marker = this.markersArray.get(m);
        marker.paint();
    }
    //节点为图片时，图片设置
//    if(theme!=='tradition' && this.getType() === 'PMActivity'){
//    	var layers=this.getLayers();
//		for(var l = 0; l < layers.getSize(); l += 1){
//			layer=layers.get(l);
//			if(layer.layerName=='first-layer'){
//				var src=contextPath + "/workflow/processDesigner/nodeIconModify/image/"+ this.getActIcon();
//				$(layer.html).css("background","url('"+src+"')");
//			}
//		}
//    }
    if (this.validatorMarker) {
        this.validatorMarker.paint();
        this.validatorMarker.hide();
    }
    if(this.corona) {
        this.corona.paint();
        this.corona.hide();
    }
    if (theme==='tradition' && this.getType() === 'PMActivity'){
        width =  this.getWidth() - 20;
        this.label.textField.style.width = width + 'px';
    }
    
    //if(!this.isSupported()) {
    //    this.label.text.style.color = 'rgb(161, 166, 175)';
    //} else {
    //    this.label.text.style.color = 'black';
    //}
};
/**
 * Extends fixZIndex from shape class
 * @chainable
 */
PMShape.prototype.fixZIndex = function (shape, value) {
    var i,
        port;
    //shape.setZOrder(2);
    PMUI.draw.CustomShape.prototype.fixZIndex.call(this, shape, value);
    // force to z-order if container parent is the canvas
    for (i = 0; i < shape.ports.getSize(); i += 1) {
        port = shape.ports.get(i);
        if (port.connection.getSrcPort().getParent().getParent().getType() === 'PMCanvas' &&
            port.connection.getDestPort().getParent().getParent().getType() === 'PMCanvas') {
            port.connection.setZOrder(1);
        }
    }


};

/**
 *  Extend applyZoom of CustomShape for apply Zoom into Markers
 *  @return {*}
 */
PMShape.prototype.applyZoom = function () {
    var i, marker;
    PMUI.draw.CustomShape.prototype.applyZoom.call(this);
    
    for (i = 0; i < this.markersArray.getSize(); i += 1) {
        marker = this.markersArray.get(i);
        marker.applyZoom();
    }
    if (this.validatorMarker) {
        this.validatorMarker.applyZoom();
    }
    var zoomFactor = this.canvas.zoomFactor;
    if(this.getType() === 'PMActivity'){
 	   switch (zoomFactor){
 		   case 0.5:
 			   $(".bpm-active-node").css("font-size","20px");
 		   	   break;
 		   case 0.75:
 			   $(".bpm-active-node").css("font-size","30px");
 			   break;
 		   case 1.0:
 			   $(".bpm-active-node").css("font-size","40px");
 		   	   break;
 		   case 1.25:
 			   $(".bpm-active-node").css("font-size","50px");
 		   	   break;
 		   case 1.5:
 			   $(".bpm-active-node").css("font-size","60px")
 		   	   break;
 		   default:
 			   $(".bpm-active-node").css("font-size","40px");
 	   }	   
    }
    return this;
};
/**
 * Set flow as a default and update the other flows
 * @param {String} destID
 * @returns {AdamShape}
 */
PMShape.prototype.setDefaultFlow = function (floID) {
    var i,
        port,
        connection;
    for (i = 0; i < this.getPorts().getSize(); i += 1) {
        port = this.getPorts().get(i);
        connection = port.connection;
        this.updateDefaultFlow(0);
        if (connection.srcPort.parent.getID() === this.getID()) {
            if (connection.getID() === floID) {
                this.updateDefaultFlow(floID);
                connection.setFlowCondition("");
                connection.changeFlowType('default');
                connection.setFlowType("DEFAULT");
            } else if (connection.getFlowType() === 'DEFAULT') {
                connection.changeFlowType('sequence');
                connection.setFlowType("SEQUENCE");
            }
        }

    }
    return this;
};

PMShape.prototype.hideAllChilds = function() {
    var i,
        child,
        j,
        flow,
        arrayFlow= {};
    for (i = 0; i < this.getChildren().getSize(); i += 1) {
        child = this.getChildren().get(i);
        child.hideElement();
    }
    this.canvas.hideFlowRecursively(this);
};

PMShape.prototype.showAllChilds = function() {
    var i,child;
    for (i = 0; i < this.getChildren().getSize(); i += 1) {
        child = this.getChildren().get(i);
        child.showElement();
    }
};

PMShape.prototype.hideElement = function() {
    this.html.style.visibility = 'hidden';
    return this;
};

PMShape.prototype.showElement = function() {
    this.html.style.visibility = 'visible';
    return this;
};

PMShape.prototype.getBpmnElementType = function () {
	
    var map = {
        'TASK' : 'bpmn:Task',
        'START' : 'bpmn:StartEvent',
        'END' : 'bpmn:EndEvent',
        'EXCLUSIVE' : 'bpmn:ExclusiveGateway',
        'INCLUSIVE' : 'bpmn:InclusiveGateway',
        'PARALLEL' : 'bpmn:ParallelGateway',
        'COMPLEX' : 'bpmn:ComplexGateway',
        'EVENTBASED' : 'bpmn:EventBasedGateway',
        'SUB_PROCESS' : 'bpmn:SubProcess',
        'AUTO_TASK' : 'bpmn:AutoTask',
        'INTERMEDIATE': 'bpmn:IntermediateCatchEvent',
        'BOUNDARY': 'bpmn:BoundaryEvent',
        'TEXT_ANNOTATION': 'bpmn:TextAnnotation',
        'GROUP': 'bpmn:Group',
        'PARTICIPANT':  'bpmn:Participant',
        'POOL':  'bpmn:Participant',
        'LANE':  'bpmn:Lane',
        'DATASTORE': 'bpmn:DataStore',
        'CONCURRENT': 'bpmn:Participant'
    };
    if (this.evn_type === 'INTERMEDIATE' && this.evn_behavior  === 'THROW') {
        return 'bpmn:IntermediateThrowEvent';
    } else {
        return map[this.extendedType];
    }

};

PMShape.prototype. createWithBpmn = function(bpmnElementType, name) {
    var businessObject = {};
    businessObject.elem = PMDesigner.bpmnFactory.create(bpmnElementType, {id: 'el_' + this.id, name: this.getName()});
    if (!businessObject.di) {
        if (this.type === 'PMParticipant' || this.type === 'PMPool' || this.type === 'PMLane') {
            businessObject.di = PMDesigner.bpmnFactory.createDiShape(businessObject.elem, {}, {
                id: 'di_' + businessObject.elem.id,
                isHorizontal: true
            });
        } else {
            businessObject.di = PMDesigner.bpmnFactory.createDiShape(businessObject.elem, {}, {
                id: 'di_' + businessObject.elem.id
            });
        }
    }
    this[name] = businessObject;
    //this.businessObject = businessObject;
};

PMShape.prototype.createHandlers = function (type, number, resizableStyle, nonResizableStyle) {
    if (type === "Rectangle") {
        var i;

        //First determine how many ResizeHandlers we are to create
        if (!number || (number !== 8 &&
            number !== 4 && number !== 0)) {
            number = 4;
        }
        //Then insert the corners first
        for (i = 0; i < number && i < 4; i += 1) {
            this.cornerResizeHandlers.insert(
                new PMUI.draw.ResizeHandler({
                    parent: this,
                    zOrder: PMUI.util.Style.MAX_ZINDEX + 23,
                    representation: new PMUI.draw.Rectangle(),
                    orientation: this.cornersIdentifiers[i],
                    resizableStyle: resizableStyle,
                    nonResizableStyle: nonResizableStyle
                })
            );
        }
        //subtract 4 just added resize points to the total
        number -= 4;
        //add the rest to the mid list
        for (i = 0; i < number; i += 1) {
            this.midResizeHandlers.insert(
                new PMUI.draw.ResizeHandler({
                    parent: this,
                    zOrder: PMUI.util.Style.MAX_ZINDEX + 23,
                    representation: new PMUI.draw.Rectangle(),
                    orientation: this.midPointIdentifiers[i],
                    resizableStyle: resizableStyle,
                    nonResizableStyle: nonResizableStyle
                })
            );
        }
    }
    return this;
    //console.log(this.cornerResizeHandlers.asArray());
    //console.log(this.midResizeHandlers.asArray());
};

/**
 * Recursive method to get correct parent busines object
 * @param root
 * @returns {PMPool}
 */
PMShape.prototype.getPoolParent = function(root){
    while (root.getType()!=='PMPool') {
        root =root.parent;
    }
    return root;
};
/**
 *
 * @param businessObject
 * @param parentBusinessObject
 */
PMShape.prototype.updateShapeParent = function(businessObject, parentBusinessObject) {
    var pool,
        parentDi,
        parentBusinessObjectAux = {}; //temp business object for lanes
    parentDi = parentBusinessObject && parentBusinessObject.di;
    //regular parent change
    if (parentBusinessObject.elem &&
        parentBusinessObject.elem.$type === 'bpmn:Lane' ) {
        //text annotation Data store Data object into lane
        if(businessObject.elem.$type !== 'bpmn:TextAnnotation'
            && businessObject.elem.$type !== 'bpmn:DataStoreReference'
            && businessObject.elem.$type !== 'bpmn:DataObjectReference') {
            this.parent.updateLaneSetParent(businessObject, parentBusinessObject);
        }
        pool = this.getPoolParent(this.parent);
        parentBusinessObjectAux = pool.businessObject;
        parentDi = parentBusinessObjectAux && parentBusinessObjectAux.di;
        this.updateSemanticParent(businessObject, parentBusinessObjectAux);
    } else {
        this.updateSemanticParent(businessObject, parentBusinessObject);
    }
    this.updateDiParent(businessObject.di, parentDi);

};


PMShape.prototype.updateSemanticParent = function(businessObject, newParent) {

    if (businessObject.elem.$parent === newParent.elem) {
        return;
    }

    var children;

    if (businessObject.elem.$parent) {
        // remove from old parent
        children = businessObject.elem.$parent.get('flowElements');
        CollectionRemove(children, businessObject.elem);
    }

    if (!newParent.elem) {
        businessObject.elem.$parent = null;
    } else {
        // add to new parent
        children = newParent.elem.get('flowElements');
        children.push(businessObject.elem);
        businessObject.elem.$parent = newParent.elem;

    }
};

PMShape.prototype.updateDiParent = function(di, parentDi) {

    if (parentDi && !parentDi.$instanceOf('bpmndi:BPMNPlane')) {
        parentDi = parentDi.$parent;
    }

    if (di.$parent === parentDi) {
        return;
    }

    var planeElements = (parentDi || di.$parent).get('planeElement');

    if (parentDi) {
        planeElements.push(di);
        di.$parent = parentDi;
    } else {
        CollectionRemove(planeElements, di);
        di.$parent = null;
    }
};

PMShape.prototype.updateBounds = function(di) {
   var bounds = this.type === 'label' ? this._getLabel(di).bounds : di.bounds;
   var x = this.getX(), y = this.getY(),
    parent = this.parent;
    while (parent.type !== 'PMCanvas') {
        x = parent.getX() + x;
        y = parent.getY() + y;
        parent = parent.parent;
    }

    _.extend(bounds, {
        x: x,
        y: y,
        width: this.width,
        height: this.height
    });

};

PMShape.prototype._getLabel = function(di) {
    if (!di.label) {
        di.label = PMDesigner.bpmnFactory.createDiLabel();
    }

    return di.label;
};


PMShape.prototype.createBpmn = function(type) {

    if(!this.businessObject.elem && !(this instanceof PMUI.draw.MultipleSelectionContainer)){
        this.createWithBpmn(type, 'businessObject');
    }
    this.updateBounds(this.businessObject.di);
    if ( this.parent.getType()==='PMCanvas' && !this.parent.businessObject.di) {
        this.canvas.createBPMNDiagram();
    }
    if (this.parent.businessObject.elem){

        this.updateShapeParent(this.businessObject, this.parent.businessObject);
    } else {
        //Here create busines object to new process
        this.parent.createBusinesObject();

        this.updateShapeParent(this.businessObject, this.parent.businessObject);
    }

    //PMDesigner.moddle.toXML(PMDesigner.businessObject, function (err, xmlStrUpdated) {
    //    //
    //});
};
//remove bpmn section
PMShape.prototype.removeBpmn = function() {
    var parentShape = this.parent;
    var businessObject = this.businessObject,
        parentBusinessObject = parentShape && parentShape.businessObject.elem,
        parentDi = parentBusinessObject && parentBusinessObject.di;

    if (this.parent.businessObject.elem
        && this.parent.businessObject.elem.$type === 'bpmn:Lane' ) {

        this.parent.updateLaneSetParent(businessObject, {elem: null});
        //parentBusinessObject = this.parent.parent.businessObject;
        //var parentDi = parentBusinessObject && parentBusinessObject.di;
    } else if (this.parent.type === 'PMCanvas' ){
        this.parent.updateCanvasProcess();
    }

    this.updateSemanticParent(businessObject, {elem: null});
    this.updateDiParent(businessObject.di);



};

PMShape.prototype.updateBpmn = function() {
    this.updateBounds(this.businessObject.di);

    if (!this.parent.businessObject.elem){
        //Here create busines object to new process
        this.parent.createBusinesObject();
    }
    this.updateShapeParent(this.businessObject, this.parent.businessObject);

};

PMShape.prototype.updateLaneSetParent = function(businessObject, newParent) {
    if (businessObject.elem.$lane) {
        // remove from old parent
        children = businessObject.elem.$lane.get('flowNodeRef');
        CollectionRemove(children, businessObject.elem);
    }
    if (!newParent.elem) {
        //businessObject.$parent = null;
    } else {
        // add to new parent

        children = newParent.elem.get('flowNodeRef');
        children.push(businessObject.elem);
        businessObject.elem.$lane = newParent.elem;

    }
};

PMShape.prototype.setBPPMName = function (name) {
    if (this.businessObject && this.businessObject.elem ) {
        this.businessObject.elem.name = name;
    }
    if (this.participantObject && this.participantObject.elem ) {
        this.participantObject.elem.name = name;
    }
};

PMShape.prototype.isSupported = function () {
    return true;
};

PMShape.prototype.addErrorLog = function (error) {

    error.name = this.getName();
    this.errors.insert(error);
    error.id = this.getID();
    PMDesigner.validTable.row.add([
            error.id,
            error.category,
            error.code,
            error.name,
            error.type,
            error.description

        ]
    ).draw(); //paint
};

PMShape.prototype.poolChildConnectionOnResize = function (resizing, root, delta, rootType) {
    var i,
        port,
        child,
        connection;
    if (root) {
        if (this.ports) {
            for (i = 0; i < this.ports.getSize(); i += 1) {
                port = this.ports.get(i);
                connection = port.connection;
                this.recalculatePortPosition(port);
//                connection.disconnect().connect();
//                if (!this.resizing) {
//                    connection.setSegmentMoveHandlers();
//                    connection.checkAndCreateIntersectionsWithAll();
//                }
                connection.reconnectManhattah(false);
                connection.setSegmentMoveHandlers();
                connection.checkAndCreateIntersectionsWithAll();
                connection.canvas.triggerUserStateChangeEvent(connection);
            }
        }
    } else {
        if (this.ports) {
            this.registerResizeConnection();
        }
    }
    // children
    for (i = 0; i < this.children.getSize(); i += 1) {
        child = this.children.get(i);
        child.setPosition(child.x, child.y);
        child.poolChildConnectionOnResize(child.resizing, false, delta, rootType);
    }
    return this;
};
PMShape.prototype.parallelChildConnectionOnResize = function (resizing, root) {
    var i,
        port,
        child,
        connection;
        if (this.ports) {
            for (i = 0; i < this.ports.getSize(); i += 1) {
                port = this.ports.get(i);
                connection = port.connection;
                this.recalculatePortPosition(port);//
//                connection.disconnect();//是reconnectManhattah中的
//                connection.paint(false);//是reconnectManhattah中的connect()中的
//                connection.attachListeners();//是reconnectManhattah中的connect()中的
                connection.reconnectManhattah(false);//导致卡;disconnected && connect
//                connection.setSegmentMoveHandlers();//导致卡，后面有调用，重复了;片段的handler:重置位置，加监听，重新渲染，把html加入到设计器
//                connection.checkAndCreateIntersectionsWithAll();//不导致卡；设置线的打弯儿交叉点，可以不加；
                connection.canvas.triggerUserStateChangeEvent(connection);//?
            }
        }
    var parallelChild=this.getChildrenShapeByElementType("PARALLEL");
    var inclusiveChild=this.getChildrenShapeByElementType("INCLUSIVE");
    if(parallelChild){
    	parallelChild.parallelChildConnectionOnResize(parallelChild.resizing, false);
    }
    if(inclusiveChild){
    	inclusiveChild.parallelChildConnectionOnResize(inclusiveChild.resizing, false);
    }
//        for (var i = 0; i < this.children.getSize(); i += 1) {
//        	var child = this.children.get(i);
//        	child.parallelChildConnectionOnResize(child.resizing, false);
//        }
    return this;
};
PMShape.prototype.registerResizeConnection = function () {
    var i,
        port,
        connection;
    for (i = 0; i < this.ports.getSize(); i += 1) {
        port = this.ports.get(i);
        port.setPosition(port.x, port.y);
        connection = port.connection;
        
       if(!this.canvas.refreshArray.contains(connection)) {
            connection.canvas.refreshArray.insert(connection);
        }
    }
};


PMShape.prototype.fixConnectionsOnResize = function (resizing, root) {
    var i,
        port,
        child,
        connection,
        zoomFactor = this.canvas.zoomFactor;
    if (root) {
        if (this.ports) {
            // connections
            for (i = 0; i < this.ports.getSize(); i += 1) {
                port = this.ports.get(i);
                connection = port.connection;
                this.recalculatePortPosition(port);
                connection.disconnect().connect();
                if (!this.resizing) {
                    connection.setSegmentMoveHandlers();
                    connection.checkAndCreateIntersectionsWithAll();
                }
            }
        }
    } else {
        if (this.ports) {
            this.registerResizeConnection();
        }
    }
    // children
    for (i = 0; i < this.children.getSize(); i += 1) {
        child = this.children.get(i);
        child.setPosition(child.x, child.y);
        child.fixConnectionsOnResize(child.resizing, false);
    }
    return this;
};

PMShape.prototype.refreshChildrenPositions = function (onCommand, delta) {
    var i,
        children = this.children,
        child;
    for (i = 0; i < children.getSize(); i += 1) {
        child = children.get(i);
        child.setPosition(child.getX(), child.getY());
        if (onCommand) {
            child.refreshAllMovedConnections(false, delta);
        }
        child.refreshChildrenPositions(onCommand, delta);
    }
    return this;
};

PMShape.prototype.refreshAllPoolConnections = function (inContainer, delta, rootType) {
    var i,
        connection,
        max;
    for (i = 0, max = this.canvas.refreshArray.getSize(); i < max; i += 1) {
        connection = this.canvas.refreshArray.get(i);
        connection.reconectSwitcher(delta, inContainer, rootType);
    }
    return this;
};

PMShape.prototype.laneRefreshConnections = function (inContainer, delta, rootType) {
    var i,
        connection,
        max;
    for (i = 0, max = this.canvas.refreshArray.getSize(); i < max; i += 1) {
        connection = this.canvas.refreshArray.get(i);
        connection.reconectSwitcher(delta, inContainer, rootType);
    }
    return this;
};

PMShape.prototype.refreshAllMovedConnections = function (inContainer, delta, rootType) {
    var i,
        connection,
        ports = this.ports,
        port,
        max;

    for (i = 0, max = ports.getSize(); i < max; i += 1) {
        port = ports.get(i);
        port.setPosition(port.x, port.y);
        connection = port.connection;
        if (!this.canvas.connToRefresh.contains(connection)) {
            connection.canvas.connToRefresh.insert(connection);
        }
    }
    return this;
};

PMShape.prototype.refreshChildConnections = function (inContainer, delta, rootType) {
    var i,
        connection,
        max;
    for (i = 0, max = this.canvas.refreshArray.getSize(); i < max; i += 1) {
        connection = this.canvas.refreshArray.get(i);
        connection.reconectSwitcher(delta, inContainer, rootType);
    }
    return this;
};

PMShape.prototype.refreshShape = function () {
    PMUI.draw.Shape.prototype.refreshShape.call(this);
    this.updatePortsOnZoom();
    this.paint();
    return this;
};
PMShape.prototype.getChildrenShapeByElementType = function (elementType) {
	for (var i = 0; i < this.children.getSize(); i += 1) {
        var child = this.children.get(i);
        if(child.extendedType===elementType){
        	return child;
        }
    }
	return false;
};
PMShape.prototype.showOrHideResizeHandlers = function (visible) {
    var i;
    if (!visible) {
        visible = false;
        this.corona.hide();
    }
    for (i = 0; i < this.cornerResizeHandlers.getSize(); i += 1) {
        this.cornerResizeHandlers.get(i).setVisible(visible);
    }

    for (i = 0; i < this.midResizeHandlers.getSize(); i += 1) {
        this.midResizeHandlers.get(i).setVisible(visible);
    }
    return this;
};