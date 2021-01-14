/**
 * @class Corona
 * Handle Shapes corona options
 *
 * @constructor
 * Creates a new instance of the class
 * @param {Object} options
 */
var Corona = function (options) {
    PMUI.draw.Shape.call(this, options);
    /**
     * Defines the positions of the markers
     * @type {Array}
     * @private
     */
    this.positions = ['left+2 top+2', 'center top+5', 'right top+5',
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
    this.columns = [];
    this.items = PMUI.util.ArrayList();
    Corona.prototype.initObject.call(this, options);
};

Corona.prototype = new PMUI.draw.Shape();
/**
 * Defines the object type
 * @type {String}
 */
Corona.prototype.type = 'Corona';

/**
 * Initialize the object with the default values
 * @param {Object} options
 */
Corona.prototype.initObject = function (options) {
    var defaults = {
        parent: null,
        position: 2,
        items : null,
        width: 23,
        height: 66,
        items: [],
        columnsNumber: 3
    };
    $.extend(true, defaults, options);
    //this.setPosition(defaults.position)
    this.setParent(defaults.parent)
        .setHeight(defaults.height)
        .setItems(defaults.items)
        .setColumnsNumber(defaults.columnsNumber);

    if (defaults.items.length > defaults.columnsNumber) {
        this.setWidth(defaults.width * (Math.floor(defaults.items.length / defaults.columnsNumber) + 1));
    } else {
        this.setWidth(defaults.width);
    }

};
Corona.prototype.setWidth = function (newWidth) {
    var intPart;
    if (typeof newWidth === "number" && newWidth >= 0) {
        this.width = newWidth;
        if (this.canvas) {
            this.zoomWidth = this.width;
            intPart = Math.floor(this.zoomWidth);
            this.zoomWidth = (this.zoomWidth % 2 === 0) ? intPart + 1 : intPart;
        } else {
            this.zoomWidth = this.width;
        }
        if (this.html) {
            this.style.addProperties({width: this.zoomWidth});
        }
    }
    return this;
};

Corona.prototype.setHeight = function (newHeight) {
    var intPart;
    if (typeof newHeight === "number" && newHeight >= 0) {
        this.height = newHeight;
        if (this.canvas) {
            this.zoomHeight = this.height;
            intPart = Math.floor(this.zoomHeight);
            this.zoomHeight = (this.zoomHeight % 2 === 0) ? intPart + 1 : intPart;
        } else {
            this.zoomHeight = this.height;
        }
        if (this.html) {
            this.style.addProperties({height: this.zoomHeight});
        }
    }
    return this;
};
Corona.prototype.setColumnsNumber = function (number) {
    this.columnsNumber = number;
    return this;
};
/**
 * Create the HTML for the marker
 * @return {*}
 */
Corona.prototype.createHTML = function () {
    var columnn,
        i;
    PMUI.draw.Shape.prototype.createHTML.call(this);
    this.html.style.zIndex  = '121';
    this.html.style.display = 'table';
    this.html.style.paddingLeft = '3px';
    for (i = 0; i < this.columnsNumber; i += 1) {
        columnn =  PMUI.createHTMLElement("div");
        columnn.className = 'row';
        columnn.style.display = 'table-row';
        this.html.appendChild(columnn);

        this.columns.push (columnn);
    }

    this.parent.html.appendChild(this.html);
    return this.html;

};
Corona.prototype.paint = function (update) {
    var html,
        i,
        item,
        size = this.items.getSize();
    if (this.getHTML() === null || update) {
        this.createHTML();
    }

    for (i = 0; i < size; i += 1) {
        item = this.items.get(i);

        if (!item.html) {
            item.paint();
            item.attachListeners();
        }

    }
    $(this.html).position({
        of: $(this.parent.html),
        my: "left top",
        at: "right top",
        collision: 'none'
    });
    $(this.html).click(function(e) {
        e.preventDefault();
        e.stopPropagation();
    });
};
Corona.prototype.show = function () {
    var i,
        item,
        size = this.items.getSize();
    this.html.style.visibility = 'visible';
    //for (i = 0; i < size; i += 1) {
    //    item = this.items.get(i);
    //    item.html.style.display = 'table-cell';
    //}
    return this;
};
Corona.prototype.hide = function () {
    var i,
        item,
        size = this.items.getSize();
    this.html.style.visibility = 'hidden';
    //for (i = 0; i < size; i += 1) {
    //    item = this.items.get(i);
    //    item.html.style.display = 'none';
    //}
    return this;
};
Corona.prototype.setItems = function (items) {
    var size = items.length,
        i,
        item;
    for (i = 0; i < size; i += 1) {
        items[i].parent = this;
        items[i].canvas = this.canvas;
        item = new CoronaItem(items[i]);
        this.items.insert(item);
    }
    return this;
};

var CoronaItem = function (options) {
    PMUI.draw.Shape.call(this, options);

    CoronaItem.prototype.initObject.call(this, options);
};

CoronaItem.prototype = new PMUI.draw.Shape();
/**
 * Defines the object type
 * @type {String}
 */
CoronaItem.prototype.type = 'CoronaItem';

/**
 * Initialize the object with the default values
 * @param {Object} options
 */
CoronaItem.prototype.initObject = function (options) {
    var defaults = {
        className: '',
        width: 22,
        height: 22,
        parent: null,
        name: '',
        column: 0
    };
    $.extend(true, defaults, options);
    this.setParent(defaults.parent)
        .setHeight(defaults.height)
        .setWidth(defaults.width)
        .setClassName(defaults.className)
        .setName(defaults.name)
        .setColumn(defaults.column);
    this.onClickCallback = defaults.onClick;
    this.onMouseDownCallback = defaults.onMouseDown;
};
CoronaItem.prototype.setColumn = function (column) {
    this.column = column;
    return this;
};
CoronaItem.prototype.setName = function (name) {
    this.name = name;
    return this;
};

CoronaItem.prototype.setClassName = function (name) {
    this.className = name;
    return this;
};
/**
 * Create the HTML for the corona item
 * @return {*}
 */
CoronaItem.prototype.createHTML = function () {

    PMUI.draw.Shape.prototype.createHTML.call(this);
    this.html.className = this.className;
    this.html.style.position = 'relative';
    this.html.title = this.name;
    this.html.style.display = 'table-cell';
    this.parent.columns[this.column].appendChild(this.html);
    //this.parent.html.appendChild(this.html);
    return this.html;
};
CoronaItem.prototype.paint = function (update) {
    if (this.getHTML() === null || update) {
        this.createHTML();
    }
};
CoronaItem.prototype.attachListeners = function () {
    $(this.html).click(this.onClick(this));
    $(this.html).mousedown(this.onMouseDown(this));
    $(this.html).mouseup(this.onMouseUp(this));
    return this;
};
CoronaItem.prototype.onClick = function () {
    var self = this;
    return function (e, ui) {
        e.stopPropagation();
        e.preventDefault();
        if (self.onClickCallback) {
            self.onClickCallback(self);
        }

    };
};
CoronaItem.prototype.onMouseDown = function () {
    var self = this;
    return function (e, ui) {
        if (self.onMouseDownCallback) {
            self.onMouseDownCallback(self);
        }
        e.stopPropagation();
        e.preventDefault();
    };
};
CoronaItem.prototype.onMouseUp = function () {

    return function (e, ui) {
        e.stopPropagation();
        e.preventDefault();
    };
};
CoronaItem.prototype.setCallback = function (fn) {
    this.callback = fn;
    return this;
};