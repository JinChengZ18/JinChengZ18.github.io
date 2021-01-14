
function BpmnFactory(moddle) {
  this._model = moddle;
}

BpmnFactory.$inject = [ 'moddle' ];


BpmnFactory.prototype._needsId = function(element) {
  return element.$instanceOf('bpmn:RootElement') ||
         element.$instanceOf('bpmn:FlowElement') ||
         element.$instanceOf('bpmn:Artifact') ||
         element.$instanceOf('bpmndi:BPMNShape') ||
         element.$instanceOf('bpmndi:BPMNEdge') ||
         element.$instanceOf('bpmndi:BPMNDiagram') ||
         element.$instanceOf('bpmndi:BPMNPlane');
};

BpmnFactory.prototype.create = function(type, attrs) {
  var element = this._model.create(type, attrs || {});
  element.id = attrs.id;
  return element;
};


BpmnFactory.prototype.createDiLabel = function() {
  return this.create('bpmndi:BPMNLabel', {
    bounds: this.createDiBounds()
  });
};


BpmnFactory.prototype.createDiShape = function(semantic, bounds, attrs) {

  return this.create('bpmndi:BPMNShape', _.extend({
    bpmnElement: semantic,
    bounds: this.createDiBounds(bounds)
  }, attrs));
};


BpmnFactory.prototype.createDiBounds = function(bounds) {
  return this.create('dc:Bounds', bounds);
};


BpmnFactory.prototype.createDiWaypoints = function(waypoints) {
  return _.map(waypoints, function(pos) {
    return this.createDiWaypoint(pos);
  }, this);
};

BpmnFactory.prototype.createDiWaypoint = function(point) {
  return this.create('dc:Point', _.pick(point, [ 'x', 'y' ]));
};


BpmnFactory.prototype.createDiEdge = function(semantic, waypoints, attrs) {
  return this.create('bpmndi:BPMNEdge', _.extend({
    bpmnElement: semantic
  }, attrs));
};

var CreateShapeHelper = function (options) {
    //Segment.superclass.call(this, options);
    this.html = null;
    CreateShapeHelper.prototype.initObject.call(this, options);
};

CreateShapeHelper.prototype.initObject = function (options) {
    var defaults = {
        parent: null,
        x: 0,
        y: 0,
        zOrder: 7,
        className: ''
    };

    $.extend(true, defaults, options);
    this.setParent(defaults.parent);
    this.setPosition(defaults.x, defaults.y);
    this.setZOrder(defaults.zOrder);
    this.setClasName(defaults.className);
};
CreateShapeHelper.prototype.setClasName = function (name) {
    this.className = name;
    return this;
};
CreateShapeHelper.prototype.setZOrder = function (zOrder) {
    this.zOrder = zOrder;
    return this;
};
CreateShapeHelper.prototype.setParent = function (parent) {
    this.parent = parent;
    return this;
};
CreateShapeHelper.prototype.setPosition = function (x, y) {
    this.x = x + 2;
    this.y = y + 2;
    return this;
};
CreateShapeHelper.prototype.createHTML = function () {
    this.html = document.createElement('div');
    this.html.id = 'CreateShapeHelper';

    this.html.className = this.className;
    this.html.style.position = "absolute";
    this.html.style.left = this.x + "px";
    this.html.style.top = this.y + "px";
    this.html.style.height = "30px";
    this.html.style.width = "30px";

    this.html.style.zIndex = this.zOrder;
    return this.html;
};

CreateShapeHelper.prototype.paint = function () {
    if (this.html === null) {
        this.parent.html.appendChild(this.createHTML());
    }

    return this;
};