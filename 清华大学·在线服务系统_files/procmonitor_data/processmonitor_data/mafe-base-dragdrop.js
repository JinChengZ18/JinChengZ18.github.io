/**
 * 处理图形拖拽相关逻辑，包括连接线的拖拽和形状的拖拽。(该形状标识画布上的形状而不是panel上的按钮)
 */
/**
* @class PMConnectionDropBehavior
* Extends the functionality to handle creation of connections
*
* @constructor
* Creates a new instance of the object
*/
var PMConnectionDropBehavior = function (selectors) {
    PMUI.behavior.ConnectionDropBehavior.call(this, selectors);
};
PMConnectionDropBehavior.prototype = new PMUI.behavior.ConnectionDropBehavior();
/**
* Defines the object type
* @type {String}
*/
PMConnectionDropBehavior.prototype.type = "PMConnectionDropBehavior";

/**
 * Defines a Map of the basic Rules
 * @type {Object}
 */
PMConnectionDropBehavior.prototype.basicRules = {
    PMEvent : {
        PMEvent : {
            connection : 'regular',
            type: 'SEQUENCE'
        },
        PMActivity : {
            connection : 'regular',
            type: 'SEQUENCE'
        }
    },
    PMActivity: {
        PMActivity : {
            connection : 'regular',
            type: 'SEQUENCE'
        },
        PMArtifact : {
            connection : 'dotted',
            destDecorator: 'con_none',
            type: 'ASSOCIATION'
        },
        PMIntermediateEvent : {
            connection : 'regular',
            type: 'SEQUENCE'
        },
        PMEndEvent: {
            connection : 'regular',
            type: 'SEQUENCE'
        },
        PMGateway : {
            connection : 'regular',
            type: 'SEQUENCE'
        }
    },
    PMStartEvent : {
        PMActivity : {
            connection : 'regular',
            type: 'SEQUENCE'
        },
        PMIntermediateEvent : {
            connection : 'regular',
            type: 'SEQUENCE'
        },
        PMGateway : {
            connection : 'regular',
            type: 'SEQUENCE'
        }
    },
    PMIntermediateEvent : {
        PMActivity : {
            connection : 'regular',
            type: 'SEQUENCE'
        },
        PMIntermediateEvent : {
            connection : 'regular',
            type: 'SEQUENCE'
        },
        PMEndEvent : {
            connection : 'regular',
            type: 'SEQUENCE'
        },
        PMGateway : {
            connection : 'regular',
            type: 'SEQUENCE'
        }
    },
    PMBoundaryEvent : {
        PMActivity : {
            connection : 'regular',
            type: 'SEQUENCE'
        },
        PMIntermediateEvent : {
            connection : 'regular',
            type: 'SEQUENCE'
        },
        PMEndEvent : {
            connection : 'regular',
            type: 'SEQUENCE'
        },
        PMGateway : {
            connection : 'regular',
            type: 'SEQUENCE'
        }
    },
    PMGateway : {
        PMActivity : {
            connection : 'regular',
            type: 'SEQUENCE'
        },
        PMIntermediateEvent : {
            connection : 'regular',
            type: 'SEQUENCE'
        }
    },
    PMArtifact: {
        PMActivity: {
            connection : 'dotted',
            destDecorator: 'con_none',
            type: 'ASSOCIATION'
        }
    }
};

/**
 * Defines a Map of the init Rules
 * @type {Object}
 */

PMConnectionDropBehavior.prototype.initRules = {
    PMCanvas: {
        PMCanvas: {
            name: 'PMCanvas to PMCanvas',
            rules: PMConnectionDropBehavior.prototype.basicRules
        }
    },
    PMActivity: {
        PMCanvas: {
            name: 'PMActivity to PMCanvas',
            rules: PMConnectionDropBehavior.prototype.basicRules
        }
    }
};

/**
 * Handle the hook functionality when a drop start
 *  @param shape
 */
PMConnectionDropBehavior.prototype.dropStartHook = function (shape, e, ui) {
    shape.srcDecorator = null;
    shape.destDecorator = null;
    var draggableId = ui.draggable.attr("id"),
        source  = shape.canvas.customShapes.find('id', draggableId),
        prop;
    if (source) {
        prop = this.validate(source, shape);
        if (prop) {
            shape.setConnectionType({
                type: prop.type,
                segmentStyle: prop.connection,
                srcDecorator: prop.srcDecorator,
                destDecorator: prop.destDecorator
            });

        } else {
            // verif if port is changed
            if (typeof source !== 'undefined') {
                if (!(ui.helper && ui.helper.attr('id') === "drag-helper")) {
                    return false;
                }
                //showMessage('Invalid Connection');
                shape.setConnectionType('none');
            }
        }
    }

    return true;
};

/**
 * Connection validations method
 * return an object if is valid otherwise return false
 * @param {Connection} source
 * @param {Connection} target
 */
PMConnectionDropBehavior.prototype.validate = function (source, target) {
    var sType,
        tType,
        rules,
        initRules,
        initRulesName,
        BPMNAuxMap = {
            PMEvent : {
                'START' : 'PMStartEvent',
                'END': 'PMEndEvent',
                'INTERMEDIATE': 'PMIntermediateEvent',
                'BOUNDARY': 'PMBoundaryEvent'
            },
            bpmnArtifact : {
                'TEXTANNOTATION': 'bpmnAnnotation'
            }
        };
    if (source && target) {
        if (source.getID() === target.getID()) {
            return false;
        }

        if (this.initRules[source.getParent().getType()]
                && this.initRules[source.getParent().getType()][target.getParent().getType()]) {


            initRules = this.initRules[source.getParent().getType()][target.getParent().getType()].rules;
            initRulesName = this.initRules[source.getParent().getType()][target.getParent().getType()].name;
            // get the types
            sType = source.getType();
            tType = target.getType();
            //Custimize all PM events
            if (sType === 'PMEvent') {
                if (BPMNAuxMap[sType] && BPMNAuxMap[sType][source.getEventType()]) {
                    sType = BPMNAuxMap[sType][source.getEventType()];
                }
            }
            if (tType === 'PMEvent') {
                if (BPMNAuxMap[tType] && BPMNAuxMap[tType][target.getEventType()]) {
                    tType = BPMNAuxMap[tType][target.getEventType()];
                }
            }

            if (initRules[sType] && initRules[sType][tType]) {
                rules = initRules[sType][tType];
            } else {
                rules = false;
            }
            if (initRules) {
                switch (initRulesName) {
                case 'bpmnPool to bpmnPool':
                    if (source.getParent().getID() !== target.getParent().getID()) {
                        rules = false;
                    }
                    break;
                case 'bpmnLane to bpmnLane':
                    if (source.getFirstPool(source.parent).getID()
                            !== target.getFirstPool(target.parent).getID()) {
                        if (this.extraRules[sType]
                                && this.extraRules[sType][tType]) {
                            rules = this.extraRules[sType][tType];
                        } else {
                            rules = false;
                        }
                    }
                    break;
                case 'bpmnActivity to bpmnLane':
                    if (this.basicRules[sType]
                            && this.basicRules[sType][tType]) {
                        rules = this.basicRules[sType][tType];
                    } else {
                        rules = false;
                    }
                    break;
                default:
                    break;
                }
            } else {
                rules = false;
            }

        } else {
            // get the types
            sType = source.getType();
            tType = target.getType();
            //
            if (sType === 'PMEvent') {
                if (BPMNAuxMap[sType] && BPMNAuxMap[sType][source.getEventType()]) {
                    sType = BPMNAuxMap[sType][source.getEventType()];
                }
            }
            if (tType === 'PMEvent') {
                if (BPMNAuxMap[tType] && BPMNAuxMap[tType][target.getEventType()]) {
                    tType = BPMNAuxMap[tType][target.getEventType()];
                }
            }
            if (this.advancedRules[sType] && this.advancedRules[sType][tType]) {
                rules = this.advancedRules[sType][tType];
            } else {
                rules = false;
            }
        }
        return rules;
    }
};
PMConnectionDropBehavior.prototype.onDragEnter = function (customShape) {
    return function (e, ui) {
//		if(customShape instanceof PMGateway && //进入并发开始，结束节点时，不进行操作
//				(customShape.gat_type=="INCLUSIVE" || customShape.gat_type=="PARALLEL")){
//			return ;
//		}
    	var relativeShape = customShape.canvas.dragConnectHandlers.get(0).relativeShape;
    	if(relativeShape === undefined || relativeShape===null){
    		return;
    	}
    	var sourceShape = customShape.canvas.dragConnectHandlers.get(0).relativeShape.parent;
    	 if(customShape.parent.extendedType==="CONCURRENT"){
    		// if(sourceShape.parent.extendedType !== "CONCURRENT")
    		 if(customShape.parent.id!==sourceShape.parent.id)
    			 return ;
         };
        var shapeRelative, i;
        if (customShape.extendedType !== "PARTICIPANT") {
            if (ui.helper && ui.helper.hasClass("dragConnectHandler")) {
                //if (customShape.extendedType !== "TEXT_ANNOTATION"
                //    && customShape.extendedType !== "GROUP") {
                shapeRelative = customShape.canvas.dragConnectHandlers.get(0).relativeShape;
                    if (shapeRelative.id !== customShape.id) {
                        //for (i = 0; i < customShape.canvas.dropConnectHandlers.getSize(); i += 1) {
                        for (i = 0; i < 4; i += 1) {
                            customShape.showConnectDropHelper(i, customShape);
                        }
                    }
                //} else {
                //    if (customShape.extendedType !== "H_LABEL"
                //        && customShape.extendedType !== "V_LABEL"
                //        && customShape.extendedType !== "GROUP") {
                //
                //        shapeRelative = customShape.canvas.dragConnectHandlers.get(3).relativeShape;
                //        if (shapeRelative && shapeRelative.id !== customShape.id) {
                //            customShape.canvas.hideDropConnectHandlers();
                //            customShape.showConnectDropHelper(3, customShape);
                //        }
                //    }
                //}
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
                    }
                }
        }
    }
};
/**
* Handle the functionality when a shape is dropped
* @param shape
*/
PMConnectionDropBehavior.prototype.onDrop = function (shape) {
    var that = this;
    return function (e, ui) {
        return false;
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
            connection,
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
        if (!shape.drop.dropStartHook(shape, e, ui)) {
            return false;
        }
        if (shape.getConnectionType() === "none") {
            return true;
        }
        if (currentConnection) {
            srcPort = currentConnection.srcPort;
            dstPort = currentConnection.destPort;
            if (srcPort.id === id) {
                port = srcPort;
            } else if (dstPort.id === id) {
                port = dstPort;
            } else {
                port = null;
            }
        }
        if (ui.helper && ui.helper.attr('id') === "drag-helper") {

            //if its the helper then we need to create two ports and draw a
            // connection
            //we get the points and the corresponding shapes involved
            startPoint = shape.canvas.connectionSegment.startPoint;
            sourceShape = shape.canvas.connectionSegment.pointsTo;
            //determine the points where the helper was created
            if (sourceShape.parent && sourceShape.parent.id === shape.id) {
                return true;
            }
            sourceShape.setPosition(sourceShape.oldX, sourceShape.oldY);

            //startPoint.x -= sourceShape.absoluteX;
            //startPoint.y -= sourceShape.absoluteY;
            startPoint.x = startPoint.portX;
            startPoint.y = startPoint.portY;
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
                name: "",
                canvas : shape.canvas,
                segmentStyle: shape.connectionType.segmentStyle,
                flo_type: shape.connectionType.type
            });

            connection.setSrcDecorator(new PMUI.draw.ConnectionDecorator({
                width: 1,
                height: 1,
                canvas: canvas,
                decoratorPrefix: (typeof shape.connectionType.srcDecorator !== 'undefined'
                    && shape.connectionType.srcDecorator !== null) ?
                        shape.connectionType.srcDecorator : "mafe-decorator",
                decoratorType: "source",
                parent: connection
            }));

            connection.setDestDecorator(new PMUI.draw.ConnectionDecorator({
                width: 1,
                height: 1,
                canvas: canvas,
                decoratorPrefix: (typeof shape.connectionType.destDecorator !== 'undefined'
                    && shape.connectionType.destDecorator !== null) ?
                        shape.connectionType.destDecorator : "mafe-decorator",
                decoratorType: "target",
                        style : {
                            cssClasses : [
                                "mafe-connection-decoration-target"
                            ]
                        },
                parent: connection
            }));

            /*directionDec = connection.getDestPort().getDirection();
            if (directionDec) {
                if (directionDec === 0 || directionDec === 2) {
                    //For TOP and BOTTOM
                    connection.destDecorator.setX(ui.offset.left);
                } else if(directionDec === 1 || directionDec === 3){
                    //For RIGHT and LEFT
                    connection.destDecorator.setY(ui.offset.top);
                }
            }*/
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
        } else if (port) {
            connection = port.getConnection();
            if (connection.srcPort.getID() === port.getID()) {
                prop = PMConnectionDropBehavior.prototype.validate(
                    shape,
                    connection.destPort.getParent()
                );
            } else {
                prop = PMConnectionDropBehavior.prototype.validate(
                    connection.srcPort.getParent(),
                    shape
                );
            }
            
            if (prop) {
                port.setOldParent(port.getParent());
                port.setOldX(port.getX());
                port.setOldY(port.getY());

                x = ui.position.left;
                y = ui.position.top;
                port.setPosition(x, y);
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

                // LOGIC: when portChangeEvent is triggered it gathers the state
                // of the connection but since at this point there's only a segment
                // let's paint the connection, gather the state and then disconnect
                // it (the connection is later repainted on, I don't know how)

                aux = {
                    before: {
                        condition: connection.flo_condition,
                        type: connection.flo_type,
                        segmentStyle: connection.segmentStyle,
                        srcDecorator: connection.srcDecorator.getDecoratorPrefix(),
                        destDecorator: connection.destDecorator.getDecoratorPrefix()
                    },
                    after: {
                        type : prop.type,
                        segmentStyle: prop.connection,
                        srcDecorator: prop.srcDecorator,
                        destDecorator: prop.destDecorator
                    }
                };
                connection.connect();
                canvas.triggerPortChangeEvent(port);
                command = new PMCommandReconnect(port, aux);
                //command.execute();
                canvas.commandStack.add(command);
                canvas.hideDropConnectHandlers();

            } else {
                return false;
            }
        }
        return false;
    };
};
//形状在画布上的拖拽行为
var PMCustomShapeDragBehavior = function () {
};
PMCustomShapeDragBehavior.prototype = new PMUI.behavior.CustomShapeDragBehavior();
/**
 * Type of the instances
 * @property {String}
 */
PMCustomShapeDragBehavior.prototype.type = "CustomShapeDragBehavior";
/**
 * 记录拖动过程中鼠标的位置
 * */
PMCustomShapeDragBehavior.ePageX=0;
PMCustomShapeDragBehavior.ePageY=0;
/**
 * Attach the drag behavior and ui properties to the corresponding shape
 * @param {PMUI.draw.CustomShape} customShape
 */
PMCustomShapeDragBehavior.prototype.attachDragBehavior = function (customShape) {
	
    if(customShape instanceof PMGateway && (customShape.gat_type === 'PARALLEL'||customShape.gat_type === 'INCLUSIVE'))
    	return;
    
    var dragOptions,
        $customShape = $(customShape.getHTML());
    
    dragOptions = {
        revert: false,
        helper: "none",
        cursorAt: false,
        //containment: "parent",
        revertDuration: 0,
        disable: false,
        grid: [1, 1],
        start: this.onDragStart(customShape),
        drag: this.onDrag(customShape, true),
        stop: this.onDragEnd(customShape, true)
    };
    $customShape.draggable({'cursor':"move"});
    $customShape.draggable(dragOptions);
};

//TODO Encapsulates behaviors for multiple drag, and simple custom shape drag
//TODO Initialize all oldX and oldY values
/**
 * On drag start handler, it uses the {@link PMUI.behavior.RegularDragBehavior}.onDragStart
 * method to initialize the drag, but also initializes other properties
 * @param {PMUI.draw.CustomShape} customShape
 * @return {Function}
 */
PMCustomShapeDragBehavior.prototype.onDragStart = function (customShape) {

    return function (e, ui) {
    	
    	PMCustomShapeDragBehavior.ePageX=e.pageX;
    	PMCustomShapeDragBehavior.ePageY=e.pageY;
        customShape.canvas.hideAllCoronas();
        if (customShape.canvas.canConnect) {
            if (customShape.canvas.connectStartShape.getID() !== customShape.getID()) {
                customShape.canvas.connectProcedure(customShape, e);
            }
            customShape.canvas.cancelConnect();
            return false;
        }

        if(customShape.canvas.currentSelection.asArray().length == 0){
           customShape.canvas.addToSelection(customShape);                
        }
        PMUI.behavior.RegularDragBehavior.prototype.onDragStart.call(this,
            customShape)(e, ui);

        customShape.previousXDragPosition = customShape.getX();
        customShape.previousYDragPosition = customShape.getY();
        if (customShape.canvas.snapToGuide) {
            //init snappers
            customShape.canvas.startSnappers(e);
        }
        customShape.canvas.isDragging = true;
//        /*拖动开始前计算最左和最上边节点位置*/
//        var shape=customShape.parent;
//        if(shape.getType()==="PMParallel"){
//        	shapesInParallel = shape.children.asArray();
//            shape.setPointX(0);
//     		shape.setPointY(0);
//     		
//     		for(var i=0;i<shapesInParallel.length;i++){
//     			var thisNode = shapesInParallel[i];
//     			if(thisNode.extendedType=='PARALLEL' || thisNode.extendedType=='INCLUSIVE' || thisNode.id === customShape.id){
//     				continue;
//     			}
//     			if(shape.getPointY()==0 || thisNode.getY()<shape.getPointY()){
//     				shape.setPointY(thisNode.getY());
//     			}
//     			if(shape.getPointX()==0 || thisNode.getX()<shape.getPointX()){
//     				shape.setPointX(thisNode.getX());
//     			}
//     		}
//        };
    };
};
/**
 * Procedure executed while dragging, it takes care of multiple drag, moving
 * connections, updating positions and children of the shapes being dragged
 * @param {PMUI.draw.CustomShape} customShape shape being dragged
 * @param {boolean} root return whether this is the shape where the drag started
 * @param {number} childDiffX x distance needed for the non-root shapes to move
 * @param {number} childDiffY y distance needed for the non-root shapes to move
 * @param {Object} e jQuery object containing the properties when a drag event
 * occur
 * @param {Object} ui JQuery UI object containing the properties when a drag
 * event occur
 */
PMCustomShapeDragBehavior.prototype.onDragProcedure = function (customShape, root, childDiffX, childDiffY, e, ui) {
    var i,
        j,
        sibling,
        diffX,
        diffY,
        port,
        child,
        connection,
        shape1,
        shape2,
        canvas = customShape.canvas,
        k,
        uiOffset,
        positionsX1= [];

    uiOffset = {};
    uiOffset.x = ui.helper.position().left / canvas.zoomFactor;
    uiOffset.y = ui.helper.position().top / canvas.zoomFactor; 
    uiOffset.diffX = customShape.x - uiOffset.x;
    uiOffset.diffY = customShape.y - uiOffset.y;
    //去掉tooltip，因为如果鼠标比customshape移动的快，会重新激活customShape的计时
    if(customShape.extendedType == "TASK"){
    	clearTimeout(PMDesigner.timeOut);
   	 $("#tooltip").remove(); 
    }

    for (k = 0; k < customShape.canvas.currentSelection.getSize(); k += 1) {
        sibling = customShape.canvas.currentSelection.get(k);
        if (sibling.id !== customShape.id) {
            positionsX1.push(sibling.x + uiOffset.diffX);
        }
    }
    // shapes
    if (root) {
        // Commented for problem on snappers
        
        if (customShape.canvas.snapToGuide) {
            customShape.canvas.processGuides(e, ui, customShape);
        }
       
       // customShape.setPosition(ui.helper.position().left / canvas.zoomFactor,
       //     ui.helper.position().top / canvas.zoomFactor);

        customShape.setPosition( uiOffset.x, uiOffset.y);
        diffX = customShape.x - customShape.previousXDragPosition;
        diffY = customShape.y - customShape.previousYDragPosition;

        customShape.previousXDragPosition = customShape.x;
        customShape.previousYDragPosition = customShape.y;

        for (i = 0; i < customShape.canvas.currentSelection.getSize(); i += 1) {
            sibling = customShape.canvas.currentSelection.get(i);
            if (sibling.id !== customShape.id) {
                if (((sibling.x + diffX) >= 0) && ((sibling.y + diffY)>=0)){
                    sibling.setPosition(sibling.x + diffX, sibling.y + diffY);
                } else {
                    e.preventDefault();
                }
            }
        }
    } else {
        customShape.setPosition(customShape.x, customShape.y);
    }

    // children
    if (root) {
        for (i = 0; i < customShape.canvas.currentSelection.getSize(); i += 1) {
            sibling = customShape.canvas.currentSelection.get(i);
            for (j = 0; j < sibling.children.getSize(); j += 1) {
                child = sibling.children.get(j);
                PMUI.behavior.CustomShapeDragBehavior.prototype.onDragProcedure.call(this, child,
                    false, diffX, diffY, e, ui);
            }
        }
    } else {
        for (i = 0; i < customShape.children.getSize(); i += 1) {
            child = customShape.children.get(i);
            PMUI.behavior.CustomShapeDragBehavior.prototype.onDragProcedure.call(this, child,
                false, childDiffX, childDiffY, e, ui);
        }
    }

    // connections
    if (root) {
        for (i = 0; i < customShape.canvas.currentSelection.getSize(); i += 1) {
            sibling = customShape.canvas.currentSelection.get(i);//当前选中节点(i)
            for (j = 0; j < sibling.ports.getSize(); j += 1) {
                //for each port update its absolute position and repaint its connection
                port = sibling.ports.get(j);
                connection = port.connection;
                //四个点，只能是相对于customShape的上(1/2x,0),右(x,1/2y),下(1/2x,y),左(0,1/2y)
                //先做左侧的点出过问题，先只解决这一个-----从pmui里解决了
//                if(Math.abs(port.y+port.getZoomHeight()/2-sibling.getZoomHeight()/2)<1){//左，右节点
//                	if(Math.abs(port.x) < Math.abs(port.x-sibling.getZoomWidth())){//距离左侧比右侧近
//                		port.x = 0-port.getZoomWidth()/2;
//                	}else{
//                		port.x = sibling.getZoomWidth()-port.getZoomWidth()/2;
//                	}
//                }
                port.setPosition(port.x, port.y);

                if (customShape.canvas.sharedConnections.
                        find('id', connection.getID())) {
                    // move the segments of this connections
                    if (connection.srcPort.parent.getID() ===
                            sibling.getID()) {
                        // to avoid moving the connection twice
                        // (two times per shape), move it only if the shape
                        // holds the sourcePort
                        connection.move(diffX * canvas.zoomFactor,
                            diffY * canvas.zoomFactor);
                    }
                } else {
//                    connection
//                        // repaint:  false
//                        .setSegmentColor(PMUI.util.Color.GREY, false)
//                        .setSegmentStyle("regular", false)// repaint:  false
//                        .disconnect()
//                        .connect();
                	connection
                	.setSegmentColor(PMUI.util.Color.GREY, false)
                    .setSegmentStyle("regular", false)// repaint:  false
                    .disconnect()
                    .connect();
                }
            }
        }
    } else {
        for (i = 0; i < customShape.ports.getSize(); i += 1) {
            //for each port update its absolute position and repaint its connection
            port = customShape.ports.get(i);
            connection = port.connection;
            shape1 = connection.srcPort.parent;
            shape2 = connection.destPort.parent;

            port.setPosition(port.x, port.y);

            if (customShape.canvas.sharedConnections.
                    find('id', connection.getID())) {
                // to avoid moving the connection twice
                // (two times per shape), move it only if the shape
                // holds the sourcePort
                if (connection.srcPort.parent.getID() ===
                        customShape.getID()) {
                    connection.move(childDiffX * canvas.zoomFactor,
                            childDiffY * canvas.zoomFactor);
                }
            } else {
                connection
                    // repaint:  false
                    .setSegmentColor(PMUI.util.Color.GREY, false)
                    .setSegmentStyle("regular", false)
                    .disconnect()
                    .connect();
            }
        }
    }
};
/**
 * On drag handler, calls the drag procedure while the dragging is occurring,
 * and also takes care of the snappers
 * @param {PMUI.draw.CustomShape} customShape shape being dragged
 * @param {boolean} root return whether this is the shape where the drag started
 * @param {number} childDiffX x distance needed for the non-root shapes to move
 * @param {number} childDiffY y distance needed for the non-root shapes to move
 * @return {Function}
 */
PMCustomShapeDragBehavior.prototype.onDrag = function (customShape, root, childDiffX, childDiffY) {
    var self = this;
    return function (e, ui) {
    	var shape=customShape.parent;
        // call to dragEnd procedure
        self.onDragProcedure(customShape, root, childDiffX,
            childDiffY, e, ui);
        /*当拖动节点时，如果节点位置超出画布区域，则增加画布大小*/
    	//canvas
    	if(shape.getType() && shape.getType()==="PMCanvas"){
    		self.autoResizeCanvas(customShape,shape);
        }
    	//并发体内的节点，右侧和下侧，自动扩大并发体；左和上，不允许拖出去
    	//并发体右侧和下方的节点，往回拖动之后，并发体的宽度和高度自动缩小
    	if(shape.getType() && shape.getType()==="PMParallel"){
    		self.autoResizeParallel(customShape,shape,e, ui);
        }
    };
};
/**
 * 自适应并发体大小
 * 
 * */
PMCustomShapeDragBehavior.prototype.autoResizeParallel = function(customShape,shape,e, ui){
	var RIGHT_DISTANCE,
		BELOW_DISTANCE,
		LEFT_DISTANCE,
		UPON_DISTANCE,
		PARALLEL_MIN_WIDTH,
		PARALLEL_MIN_HEIGHT,
	    mouseRelX,
	    mouseRelY,
	    pos,
	    diffX,
	    diffY,
	    shapesInParallel,
	    resizedFlag = false,
		containChangePosition = false;
	if(shape.getOrientation() && shape.getOrientation().toLowerCase()==="horizontal"){
		RIGHT_DISTANCE = 80;
		BELOW_DISTANCE = 20;
		LEFT_DISTANCE = 50;
		UPON_DISTANCE = 20;
		PARALLEL_MIN_WIDTH = 300;
		PARALLEL_MIN_HEIGHT = 150;
	}
	if(shape.getOrientation() && shape.getOrientation().toLowerCase()==="vertical"){
		RIGHT_DISTANCE = 20;
		BELOW_DISTANCE = 80;
		LEFT_DISTANCE = 20;
		UPON_DISTANCE = 50;
		PARALLEL_MIN_WIDTH = 150;
		PARALLEL_MIN_HEIGHT = 300;
	}
	 newWidth = customShape.x + customShape.width + RIGHT_DISTANCE;
	 newHeight = customShape.y + customShape.height +BELOW_DISTANCE;
	 
	 diffX=e.pageX-PMCustomShapeDragBehavior.ePageX;
	 diffY=e.pageY-PMCustomShapeDragBehavior.ePageY;
	 PMCustomShapeDragBehavior.ePageX=e.pageX;
	 PMCustomShapeDragBehavior.ePageY=e.pageY;
	 
	 mouseRelY = e.originalEvent.pageY - ui.offset.top;//鼠标相对于customShape的y(offset是相对于文档的偏移shu)
	 mouseRelX = e.originalEvent.pageX - ui.offset.left;//鼠标相对于customShape的x
	 pos = {//鼠标位置-canvas.top值-鼠标相对customShape(可能为负)=customShape相对于cavas顶部的y
			 //实际是：/customShape相对于canvas的位置
	 		top: e.originalEvent.pageY - customShape.canvas.getY() - mouseRelY
	       + customShape.canvas.getTopScroll(),//customShape相对于cavas顶部的y
	       	left: e.originalEvent.pageX - customShape.canvas.getX() - mouseRelX
	       + customShape.canvas.getLeftScroll()//customShape相对于cavas顶部的x
	 };
	 //左侧
	 if(pos.left-shape.getX() <=LEFT_DISTANCE){//判断位置的时候，要根据鼠标计算，不能根据customShape的位置计算。
		 shape.setX(shape.getX()+diffX);
	 	 shape.setWidth(shape.getWidth()-diffX);
		 ui.position.left = LEFT_DISTANCE;
		 for(var j=0; j < shape.children.getSize(); j+=1){
			 child = shape.children.get(j);
			 if(child.id !== customShape.id)
				 child.setPosition(child.getX()-diffX,child.getY());
		 }
		 resizedFlag = true;
	 }
	 //向上
 	if(pos.top - shape.getY() <= UPON_DISTANCE){//上方---useful不动
 		shape.setY(shape.getY()+diffY);
 		shape.setHeight(shape.getHeight()-diffY);
 		ui.position.top = UPON_DISTANCE;
 		
 		containChangePosition =true;
 		for (i = 0; i < shape.children.getSize(); i += 1) {
 		     child = shape.children.get(i);
 		     if(child.id !== customShape.id)
 		    	child.setPosition(child.getX(),child.getY()-diffY);
 		}
 		resizedFlag = true;
	}

	if(newWidth>shape.getWidth()){//右侧
		shape.setWidth(newWidth);
		resizedFlag = true;
	}
	if(newHeight>shape.getHeight()){//下方
		shape.setHeight(newHeight);
		resizedFlag = true;
	}
	//自动缩小
	if(!resizedFlag){
		shapesInParallel = shape.children.asArray();	
		shape.setRightestPointX(0);
		shape.setDownestPointY(0);
//		shape.setLeftPointX(0);
//		shape.setUpPointY(0);
		var topShape;
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
//			if(shape.getUpPointY()==0 || thisNode.y<=shape.getUpPointY()){
//				shape.setUpPointY(thisNode.y);
//				topShape=thisNode;
//			}
//			if(shape.getLeftPointX()==0 || thisNode.x<shape.getLeftPointX()){
//				shape.setLeftPointX(thisNode.x);
//			}
		
//			console.log("Shape:" + thisNode.act_name);
//			console.log("y:" + thisNode.getY());
//			console.log("domY:" + $(thisNode.html).css('top'));
		}
//		console.log("topShape:" + topShape.act_name);
//		console.log("upPoint:" + shape.getUpPointY());
//		if(shape.getLeftPointX()>LEFT_DISTANCE){
//			var diffX=shape.getLeftPointX()-LEFT_DISTANCE;
//			var rightPointX=shape.getRightestPointX()-diffX;
//			if(rightPointX + RIGHT_DISTANCE>=PARALLEL_MIN_WIDTH){
//				shape.setX(shape.getX()+diffX);
//		 		shape.setWidth(shape.getWidth()-diffX);
//		 		for (var x = 0; x < shape.children.getSize(); x += 1) {
//		 		     child = shape.children.get(x);
//		 		     if(child.id!==customShape.id && child.extendedType !=="PARALLEL")
//		 		    	child.setPosition(child.getX()-diffX,child.getY());
//		 		}
//			}else{
//				shape.setWidth(PARALLEL_MIN_WIDTH);
//			}
//			resizedFlag = true;
//		}
		if(shape.getRightestPointX()+RIGHT_DISTANCE < shape.getWidth()){
			if(shape.getRightestPointX()+RIGHT_DISTANCE>=PARALLEL_MIN_WIDTH){
				shape.setWidth(shape.getRightestPointX()+RIGHT_DISTANCE);
			}else{
				shape.setWidth(PARALLEL_MIN_WIDTH);
			}
			resizedFlag = true;
		}
		if(shape.getDownestPointY()+BELOW_DISTANCE < shape.getHeight() && !containChangePosition){
			if(shape.getDownestPointY()+BELOW_DISTANCE>=PARALLEL_MIN_HEIGHT){
				shape.setHeight(shape.getDownestPointY()+BELOW_DISTANCE);
			}else{
				shape.setHeight(PARALLEL_MIN_HEIGHT);
			}
			resizedFlag = true;
		}
//		if(shape.getUpPointY() > UPON_DISTANCE){	
//			var diffY1=shape.getUpPointY()-UPON_DISTANCE;
////			shape.setPointY(shape.getPointY()-diffY);
//			var downPointY=shape.getDownestPointY()-diffY1
//			if(downPointY + BELOW_DISTANCE>=PARALLEL_MIN_HEIGHT){
//				shape.setY(shape.getY()+diffY1);
//		 		shape.setHeight(shape.getHeight()-diffY1);
//		 		for (var y = 0; y < shape.children.getSize(); y += 1) {
//		 		     child = shape.children.get(y);
//		 		     if(child.id!==customShape.id)
//		 		    	child.setPosition(child.getX(),child.getY()-diffY1);
//		 		}
//			}else{
//				shape.setHeight(PARALLEL_MIN_HEIGHT);
//			}
//	 		resizedFlag = true;
//		}
	}

	if (shape.graphic) {
        shape.paint();
    }
	shape.refreshChildrenPosition();//.refreshConnections(false, false);
	if(resizedFlag)
		shape.parallelChildConnectionOnResize(true, true);
}

/**
 * 并发体内最上面节点向下拖动时
 * */
PMCustomShapeDragBehavior.prototype.dragDown = function(customShape){
	var resizedFlag=false,
		shape=customShape.parent;
	
	if(shape.getOrientation().toLowerCase()==="horizontal"){
		RIGHT_DISTANCE = 80;
		BELOW_DISTANCE = 20;
		LEFT_DISTANCE = 50;
		UPON_DISTANCE = 20;
		PARALLEL_MIN_WIDTH = 300;
		PARALLEL_MIN_HEIGHT = 150;
	}
	if(shape.getOrientation().toLowerCase()==="vertical"){
		RIGHT_DISTANCE = 20;
		BELOW_DISTANCE = 80;
		LEFT_DISTANCE = 20;
		UPON_DISTANCE = 50;
		PARALLEL_MIN_WIDTH = 150;
		PARALLEL_MIN_HEIGHT = 300;
	}
	shapesInParallel = shape.children.asArray();	
	shape.setLeftPointX(0);
	shape.setUpPointY(0);
	for(var i=0;i<shapesInParallel.length;i++){
		var thisNode = shapesInParallel[i];
		if(thisNode.extendedType=='PARALLEL' || thisNode.extendedType=='INCLUSIVE'){
			continue;
		}
		if(shape.getUpPointY()==0 || thisNode.y<shape.getUpPointY()){
			shape.setUpPointY(thisNode.y);
		}
		if(shape.getLeftPointX()==0 || thisNode.x<shape.getLeftPointX()){
			shape.setLeftPointX(thisNode.x);
		}
	}
	if(shape.getLeftPointX()>LEFT_DISTANCE){
		var diffX=shape.getLeftPointX()-LEFT_DISTANCE;
		var rightPointX=shape.getRightestPointX()-diffX;
		if(rightPointX + RIGHT_DISTANCE>=PARALLEL_MIN_WIDTH){
			shape.setX(shape.getX()+diffX);
	 		shape.setWidth(shape.getWidth()-diffX);
	 		for (var x = 0; x < shape.children.getSize(); x += 1) {
	 		     child = shape.children.get(x);
	 		     if(child.extendedType !=="PARALLEL")
	 		    	child.setX(child.getX()-diffX);
	 		}
		}else{
			shape.setWidth(PARALLEL_MIN_WIDTH);
		}
		resizedFlag = true;
	}

	if(shape.getUpPointY() > UPON_DISTANCE){	
		var diffY1=shape.getUpPointY()-UPON_DISTANCE;
		var downPointY=shape.getDownestPointY()-diffY1
		if(downPointY + BELOW_DISTANCE>=PARALLEL_MIN_HEIGHT){
			shape.setY(shape.getY()+diffY1);
	 		shape.setHeight(shape.getHeight()-diffY1);
	 		for (var y = 0; y < shape.children.getSize(); y += 1) {
	 		     child = shape.children.get(y);
//	 		     if(child.id !== customShape.id)
	 		    	child.setY(child.getY()-diffY1);
	 		}
		}else{
			shape.setHeight(PARALLEL_MIN_HEIGHT);
		}
 		resizedFlag = true;
	}
	shape.refreshChildrenPosition();//.refreshConnections(false, false);
	if(resizedFlag)
		shape.parallelChildConnectionOnResize(true, true);
}
/**
 * 自适应画布cavas大小
 * 
 * */
PMCustomShapeDragBehavior.prototype.autoResizeCanvas = function(customShape,shape){
	var canvasTop,canvasLeft;
	if(patternFlag=='Monitor'||patternFlag=='PrvView'||patternFlag=='FormServerDesigner'){
		canvasTop = 44;
		canvasLeft = 0;//画布向右偏移工具栏的宽度
	}else{
		canvasTop = 35;
		canvasLeft = 210;//画布向右偏移工具栏的宽度
	}
	var RIGHT_DISTANCE = 100,
		BELOW_DISTANCE = 100,
//		LEFT_DISTANCE = 50,
//		UPON_DISTANCE = 20,
		CANVAS_MIN_WIDTH = $(window).width()-canvasLeft,
		CANVAS_MIN_HEIGHT =$(window).height()-canvasTop, 
		newWidth = customShape.x + customShape.width + RIGHT_DISTANCE,
		newHeight = customShape.y + customShape.height +BELOW_DISTANCE,
//    mouseRelX,
//    mouseRelY,
//    pos,
    shapesInCanvas;
// 	var newWidth = customShape.x + customShape.width + 100;
// 	var newHeight = customShape.y + customShape.height +100;
	//自动扩大
 	if(newWidth>shape.getWidth())
 		shape.setWidth(newWidth);
 	if(newHeight>shape.getHeight())
 		shape.setHeight(newHeight);
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
/**
 * Procedure executed on drag end, it takes care of multiple drag, moving
 * connections, updating positions and children of the shapes being dragged
 * @param {PMUI.draw.CustomShape} customShape shape being dragged
 * @param {boolean} root return whether this is the shape where the drag started
 * @param {Object} e jQuery object containing the properties when a drag event
 * occur
 * @param {Object} ui JQuery UI object containing the properties when a drag
 * event occur
 */
PMCustomShapeDragBehavior.prototype.dragEndProcedure = function (customShape, root, e, ui) {
    var i,
        j,
        sibling,
        port,
        child,
        connection,
        shape1,
        shape2,
        canvas = customShape.canvas;
    if (root) {

        // the difference between this segment of code and the segment of code
        // found in dragProcedure is that it's not needed to move the shapes
        // anymore using differentials
        
        if (customShape.getX() < 0) {
            customShape.setPosition(0, customShape.getY());
        }
        if (customShape.getY() < 0) {
            customShape.setPosition(customShape.getX(), 0);
        }
        customShape.wasDragged = true;
        customShape.canvas.isDragging = false;
        for (i = 0; i < customShape.canvas.currentSelection.getSize();
             i += 1) {
            sibling = customShape.canvas.currentSelection.get(i);
            sibling.setPosition(sibling.x, sibling.y);
        }

    } 

    // children
    if (root) {
        for (i = 0; i < customShape.canvas.currentSelection.getSize();
             i += 1) {
            sibling = customShape.canvas.currentSelection.get(i);
            for (j = 0; j < sibling.children.getSize(); j += 1) {
                child = sibling.children.get(j);
                child.changedContainer = true;
                PMUI.behavior.CustomShapeDragBehavior.prototype.dragEndProcedure.call(this,
                    child, false, e, ui);
            }
        }
    } else {
        for (i = 0; i < customShape.children.getSize(); i += 1) {
            child = customShape.children.get(i);
            PMUI.behavior.CustomShapeDragBehavior.prototype.dragEndProcedure.call(this,
                child, false, e, ui);
        }
    }

    // connections
    if (root) {
        for (i = 0; i < customShape.canvas.currentSelection.getSize();
             i += 1) {
            sibling = customShape.canvas.currentSelection.get(i);
            for (j = 0; j < sibling.ports.getSize(); j += 1) {

                // for each port update its absolute position and repaint
                // its connection
                port = sibling.ports.get(j);
                connection = port.connection;

                port.setPosition(port.x, port.y);

                if (customShape.canvas.sharedConnections.
                        find('id', connection.getID())) {
                    // move the segments of this connections
                    if (connection.srcPort.parent.getID() ===
                            sibling.getID()) {
                        // to avoid moving the connection twice
                        // (two times per shape), move it only if the shape
                        // holds the sourcePort
                        connection.disconnect(true).connect({
                            algorithm: 'user',
                            points: connection.points,
                            dx: parseFloat($(connection.html).css('left')),
                            dy: parseFloat($(connection.html).css('top'))
                        });
                        connection.checkAndCreateIntersectionsWithAll();
                        connection.canvas.triggerUserStateChangeEvent(connection);
                    }
                } else {
                    connection
                        // repaint:  false
                        .setSegmentColor(connection.originalSegmentColor, false)
                        .setSegmentStyle(connection.originalSegmentStyle, false)
                        .disconnect()
                        .connect();
                    connection.setSegmentMoveHandlers();
                    connection.checkAndCreateIntersectionsWithAll();
                }
            }
        }
    } else {
        for (i = 0; i < customShape.ports.getSize(); i += 1) {
            //for each port update its absolute position and repaint
            //its connection
            port = customShape.ports.get(i);
            connection = port.connection;
            shape1 = connection.srcPort.parent;
            shape2 = connection.destPort.parent;

            port.setPosition(port.x, port.y);
            if (customShape.canvas.sharedConnections.
                    find('id', connection.getID())) {
                // to avoid moving the connection twice
                // (two times per shape), move it only if the shape
                // holds the sourcePort
                if (connection.srcPort.parent.getID() ===
                        customShape.getID()) {
                    connection.checkAndCreateIntersectionsWithAll();
                }
            } else {
                connection
                    // repaint:  false
                    .setSegmentColor(connection.originalSegmentColor, false)
                    .setSegmentStyle(connection.originalSegmentStyle, false)
                    .disconnect()
                    .connect();
                connection.setSegmentMoveHandlers();
                connection.checkAndCreateIntersectionsWithAll();
            }
        }
    }

};
/**
 * On drag end handler, ot calls drag end procedure, removes the snappers and,
 * fires the command move if necessary
 * @param {PMUI.draw.CustomShape} customShape
 * @return {Function}
 */
PMCustomShapeDragBehavior.prototype.onDragEnd = function (customShape) {
    var command,
        self = this;
    return function (e, ui) {
        // call to dragEnd procedure
        self.dragEndProcedure(customShape, true, e, ui);

        customShape.dragging = false;

        // hide the snappers
        customShape.canvas.verticalSnapper.hide();
        customShape.canvas.horizontalSnapper.hide();

        if (!customShape.changedContainer) {

            command = new PMUI.command.CommandMove(customShape.canvas.currentSelection);
            command.execute();
            customShape.canvas.commandStack.add(command);
        }
        customShape.changedContainer = false;

        // decrease the zIndex of the oldParent of customShape
        customShape.decreaseParentZIndex(customShape.oldParent);
        customShape.canvas.emptyCurrentSelection();
        if(customShape.parent.getType()==="PMParallel")
        	self.dragDown(customShape);
        customShape.corona.hide();
//        /*并发体内节点向上拖动时，刷新并发体内节点连线*/
//        var shape=customShape.parent;
//    	if(shape.getType() && shape.getType()==="PMParallel"){
//    		var delta = {
//                    dx: shape.x - shape.oldX,
//                    dy: shape.y - shape.oldY
//                };
//    		shape.refreshChildrenPosition();
//    		shape.poolChildConnectionOnResize(true, true);
//    		shape.refreshAllParallelConnections(false, delta);
//    		shape.refreshResizeCanvas();
//        }
    };
};   

