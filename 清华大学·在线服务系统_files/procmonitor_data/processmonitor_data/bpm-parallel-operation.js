var PMParallelDropBehavior = function (selectors) {
    PMUI.behavior.DropBehavior.call(this, selectors);

};
PMParallelDropBehavior.prototype = new PMUI.behavior.DropBehavior();
//PMUI.inheritFrom('PMUI.behavior.DropBehavior', ContainerDropBehavior);
/**
 * Type of the instances
 * @property {String}
 */
PMParallelDropBehavior.prototype.type = "PMParallelDropBehavior";
/**
 * Default selectors for this drop behavior
 * @property {String}
 */
PMParallelDropBehavior.prototype.defaultSelector = ".custom_shape";

/**
 * On drop handler for this drop behavior, creates shapes when dropped from the
 * toolbar, or move shapes among containers
 * @param {PMUI.draw.Shape} shape
 * @return {Function}
 */
PMParallelDropBehavior.prototype.onDrop = function (shape) {

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
            //var connectionType = customShape.connectionType;
            canvas.hideAllFocusLabels();
            shape.updateDimensions(10);
            shape.setParallelStartAndEndPosition();
            shape.refreshChildrenPosition();
            
            shape.parallelChildConnectionOnResize(true, true);
            shape.refreshParallelStartAndEndConnections(false);
            canvas.updatedElement = null;
            
            var portx,
                connectionx,
                result;
            for (var i=0; i< customShape.ports.asArray().length ;i++){
                portx = customShape.ports.asArray()[i];
                connectionx = portx.connection;

                result = PMDesigner.connectValidator.isValid(connectionx.getSrcPort().parent, connectionx.getDestPort().parent, true);
                if (result.conf && result.conf.segmentStyle !== connectionx.originalSegmentStyle) {
                    PMDesigner.msgFlash('Invalid flow between elements. Please delete the flow and reconnect the elements.'.translate(), document.body, 'error',5000, 5);
                }       
            }

        } else {//是左侧工具栏拖拽来的
        	/*siqq*/
            coordinates = PMUI.pageCoordinatesToShapeCoordinates(shape, e,null,null,customShape);
            
                var result = shape.addElement(customShape, coordinates.x, coordinates.y,
                    customShape.topLeftOnCreation);
                if(shape.containerBehavior.addElementLane !== true){
                    //since it is a new element in the designer, we triggered the
                        //custom on create element event
                        canvas.hideAllCoronas();
                        canvas.updatedElement = customShape;
                     
                        // create the command for this new shape
                        command = new PMUI.command.CommandCreate(customShape);
                        canvas.commandStack.add(command);
                        command.execute();
                        if (customShape.label && customShape.focusLabel) {
                            customShape.label.getFocus();
                        }
                       
                        canvas.hideAllFocusLabels();
                        if (customShape.label && customShape.focusLabel) {
                            customShape.label.getFocus();
                        }
                }
        }
        if(id=="CONCURRENT"){
        	customShape.addStartAndEnd("PARALLEL",0,60);//5,125
        	customShape.addStartAndEnd("INCLUSIVE",275,60);//560,125 //300-31
        }
        shape.layers.getFirst().removeCSSClasses(['dropableClass']);
        shape.refreshResizeCanvas();
    };
};

PMParallelDropBehavior.prototype.onDragEnter = function (customShape) {
	 return function (e, ui) {
			if(customShape.canvas.dragConnectHandlers.get(0).relativeShape){
				var sourceShape = customShape.canvas.dragConnectHandlers.get(0).relativeShape.parent;
				if(customShape.extendedType==="CONCURRENT" && sourceShape.parent.extendedType === "CONCURRENT"){
					if(customShape.id===sourceShape.parent.id)
						return ;
		        };
			};
	        var shapeRelative, i;
	        if (customShape.extendedType !== "PARTICIPANT") {
	            if (ui.helper && ui.helper.hasClass("dragConnectHandler")) {
	                shapeRelative = customShape.canvas.dragConnectHandlers.get(0).relativeShape;
	                    if (shapeRelative.id !== customShape.id) {
	                        //for (i = 0; i < customShape.canvas.dropConnectHandlers.getSize(); i += 1) {
	                        for (i = 0; i < 4; i += 1) {
	                            customShape.showConnectDropHelper(i, customShape);
	                        }
	                    }
	            }else{
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
	                    }
	                }
	        }
	    }
};
PMParallelDropBehavior.prototype.onDragLeave = function (shape) {
    return function (e, ui) {
        shape.layers.getFirst().removeCSSClasses(['dropableClass']);
    };
};
var PMParallelResizeBehavior = function () {
    this.oldHeight = null;
    this.isTop = false;
};

PMParallelResizeBehavior.prototype = new PMUI.behavior.RegularResizeBehavior();
PMParallelResizeBehavior.prototype.type = "PMParallelResizeBehavior";


PMParallelResizeBehavior.prototype.init = function (shape) {
    PMUI.behavior.RegularResizeBehavior
        .prototype.init.call(this, shape);
    $shape = $(shape.getHTML());
    $shape.resizable();
//    $shape.resizable('option', 'minWidth', 200 * shape.canvas.getZoomFactor());
//    $shape.resizable('option', 'minHeight', 30 * shape.canvas.getZoomFactor());
};

/**
 * Sets a shape's container to a given container
 * @param container
 * @param shape
 */
PMParallelResizeBehavior.prototype.onResizeStart = function (shape) {
    return function (e, ui) {
        PMUI.behavior.RegularResizeBehavior
            .prototype.onResizeStart.call(this, shape)(e, ui);
        //shape.hideAllChilds();
        shape.hasMinimun = false;
        shape.setParallelStartAndEndPosition();
    };
};
/**
 * Removes shape from its current container
 * @param shape
 */
PMParallelResizeBehavior.prototype.onResize = function (shape) {
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

        shape.refreshChildrenPosition();
    };
};
/**
 * Adds a shape to a given container
 * @param container
 * @param shape
 */
PMParallelResizeBehavior.prototype.onResizeEnd = function (shape) {
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
        shape.refreshAllParallelConnections(false, delta);
        shape.refreshResizeCanvas();
    };
};

/**
 * Updates the minimum height and maximum height of the JQqueryUI's resizable plugin.
 * @param {PMUI.draw.Shape} shape
 * @chainable
 */
PMParallelResizeBehavior.prototype.updateResizeMinimums = function (shape) {
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
var ParallelContainerBehavior = function () {
    this.addElementLane = false;
};

ParallelContainerBehavior.prototype = new PMUI.behavior.RegularContainerBehavior();
ParallelContainerBehavior.prototype.type = "ParallelContainerBehavior";
/*在并发体中添加形状*/
ParallelContainerBehavior.prototype.addToContainer = function (container,
                                                              shape, x, y,
                                                              topLeftCorner) {
    var shapeLeft = 0,
        shapeTop = 0,
        shapeWidth,
        shapeHeight,
        canvas,
        topLeftFactor = (topLeftCorner === true) ? 0 : 1;
    this.addElementLane = false;
    
    //如果该点(x,y)在矩形内,加到并发体中
    if (PMUI.draw.Geometry.pointInRectangle(new PMUI.util.Point(x, y),
                                  new PMUI.util.Point(container.headLineCoord, 0),
                                  new PMUI.util.Point(container.getZoomWidth(),
                                      container.getZoomHeight())
                                 )) {
        PMUI.behavior.RegularContainerBehavior.prototype.addToContainer.call(this, container,
                    shape, x, y, topLeftCorner);
        //添加形状时，如果并发体为水平的，改变并发体大小
        if(container.getOrientation().toLowerCase()==="horizontal"){
        	var RIGHT_DISTANCE = 80,
    		BELOW_DISTANCE = 20,
    		LEFT_DISTANCE = 50,
    		UPON_DISTANCE = 20;
            if(!(shape.extendedType=='PARALLEL' || shape.extendedType=='INCLUSIVE')){
            	 if(shape.x < LEFT_DISTANCE){
                 	shape.setX(LEFT_DISTANCE);
                 }
                 if(shape.x+shape.getZoomWidth()+RIGHT_DISTANCE > container.getZoomWidth() ){
                 	container.setWidth(shape.x+shape.getZoomWidth()+RIGHT_DISTANCE);
                 }
                 if(shape.y < UPON_DISTANCE){
                 	shape.setY(UPON_DISTANCE);
                 }
                 if(shape.y+shape.getZoomHeight()+BELOW_DISTANCE > container.getZoomHeight()){
                 	container.setHeight(shape.y+shape.getZoomHeight()+BELOW_DISTANCE);
                 }
            }
        }
        //添加形状时，如果并发体为水平的，改变并发体大小
        if(container.getOrientation().toLowerCase()==="vertical"){
        	var RIGHT_DISTANCE = 20,
    		BELOW_DISTANCE = 80,
    		LEFT_DISTANCE = 20,
    		UPON_DISTANCE = 50;
            if(!(shape.extendedType=='PARALLEL' || shape.extendedType=='INCLUSIVE')){
            	 if(shape.x < LEFT_DISTANCE){
                 	shape.setX(LEFT_DISTANCE);
                 }
                 if(shape.x+shape.getZoomWidth()+RIGHT_DISTANCE > container.getZoomWidth() ){
                 	container.setWidth(shape.x+shape.getZoomWidth()+RIGHT_DISTANCE);
                 }
                 if(shape.y < UPON_DISTANCE){
                 	shape.setY(UPON_DISTANCE);
                 }
                 if(shape.y+shape.getZoomHeight()+BELOW_DISTANCE > container.getZoomHeight()){
                 	container.setHeight(shape.y+shape.getZoomHeight()+BELOW_DISTANCE);
                 }
            }
        }
        
        if (container.graphic) {
            container.paint();
        }
        container.refreshChildrenPosition().refreshConnections(false, false);
        container.parallelChildConnectionOnResize(true, true);
    } else {//如果不在，加到canvas中
        shape.setParent(container.canvas);
        container.canvas.getChildren().insert(shape);
        this.addShape(container.canvas, shape, shape.getOldX(), shape.getOldY());
        shape.fixZIndex(shape, 0);
        // adds the shape to either the customShape arrayList or the regularShapes
        // arrayList if possible
        container.canvas.addToList(shape);
        //TODO IF SHAPE IS IN POOL HEADER
    }
    //}
};


ParallelContainerBehavior.prototype.addShape = function (container, shape, x, y) {
    shape.setPosition(x, y);
    //insert the shape HTML to the DOM
    container.getHTML().appendChild(shape.getHTML());
    shape.updateHTML();
    shape.paint();
    shape.applyBehaviors();
    //shape.defineEvents();
    shape.attachListeners();
    return this;
};