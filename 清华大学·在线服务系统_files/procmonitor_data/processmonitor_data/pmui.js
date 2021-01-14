var PMUI = {};
PMUI.version = "0.1.1";
PMUI.isCtrl = false;
PMUI.isShift = false;
PMUI.activeCanvas = null;
PMUI.currentContextMenu = null;
$(document).keydown(function(a) {
	if (PMUI.activeCanvas) {
		switch (a.which) {
		case 16:
			PMUI.isShift = true;
			break;
		case 17:
			PMUI.isCtrl = true;
			break;
		case 116:
			a.preventDefault();
			window.location.reload(true);
			break;
		case 37:
			if (!PMUI.activeCanvas.currentLabel) {
				a.preventDefault();
				PMUI.activeCanvas.moveElements(PMUI.activeCanvas, "LEFT")
			}
			break;
		case 38:
			if (!PMUI.activeCanvas.currentLabel) {
				a.preventDefault();
				PMUI.activeCanvas.moveElements(PMUI.activeCanvas, "TOP")
			}
			break;
		case 39:
			if (!PMUI.activeCanvas.currentLabel) {
				a.preventDefault();
				PMUI.activeCanvas.moveElements(PMUI.activeCanvas, "RIGHT")
			}
			break;
		case 40:
			if (!PMUI.activeCanvas.currentLabel) {
				a.preventDefault();
				PMUI.activeCanvas.moveElements(PMUI.activeCanvas, "BOTTOM")
			}
			break
		}
	}
}).keypress(function(a) {}).keyup(function(b) {
	var a;
	if (PMUI.activeCanvas) {
		b.preventDefault();
		switch (b.which) {
		case 8:
			if (PMUI.isCtrl) {
				if (PMUI.activeCanvas && !PMUI.activeCanvas.currentLabel) {
					PMUI.activeCanvas.removeElements()
				}
			}
			break;
		case 13:
			if (PMUI.activeCanvas && PMUI.activeCanvas.currentLabel) {
				PMUI.activeCanvas.currentLabel.loseFocus()
			}
			break;
		case 46:
			if (PMUI.activeCanvas && !PMUI.activeCanvas.currentLabel) {
				PMUI.activeCanvas.removeElements()
			}
			break;
		case 16:
			PMUI.isShift = false;
			break;
		case 17:
			PMUI.isCtrl = false;
			break;
		case 113:
			if (PMUI.activeCanvas && PMUI.activeCanvas.getCurrentSelection().getLast() !== null) {
				a = PMUI.activeCanvas.getCurrentSelection().getLast();
				if (a !== undefined && a.label.html !== null) {
					$(a.label.html).dblclick();
					$(a.label.text.html).focus()
				}
			}
			break
		}
	}
});
PMUI.extendNamespace = function(e, d) {
	var c, b, f, a;
	if (arguments.length !== 2) {
		throw new Error("PMUI.extendNamespace(): method needs 2 arguments")
	}
	b = e.split(".");
	if (b[0] === "PMUI") {
		b = b.slice(1)
	}
	c = PMUI;
	for (a = 0; a < b.length - 1; a += 1) {
		f = b[a];
		if (typeof c[f] === "undefined") {
			c[f] = {}
		}
		c = c[f]
	}
	f = b[b.length - 1];
	if (c[f]) {}
	c[f] = d;
	return d
};
PMUI.inheritFrom = function(f, d) {
	var e, h, c, b, a;
	if (arguments.length !== 2) {
		throw new Error("PMUI.inheritFrom(): method needs 2 arguments")
	}
	function g(i) {
		var j = function() {};
		j.prototype = i;
		return new j()
	}
	c = f.split(".");
	if (c[0] === "PMUI") {
		c = c.slice(1)
	}
	e = PMUI;
	for (b = 0; b < c.length; b += 1) {
		h = c[b];
		if (typeof e[h] === "undefined") {
			throw new Error("PMUI.inheritFrom(): object " + h + " not found, full path was " + f)
		}
		e = e[h]
	}
	a = g(e.prototype);
	a.constructor = d;
	d.prototype = a;
	d.superclass = e
};
PMUI.generateUniqueId = function() {
	var a = function(e, d) {
		if (typeof e === "undefined") {
			e = 0
		}
		if (typeof d === "undefined") {
			d = 999999999
		}
		return Math.floor(Math.random() * (d - e + 1)) + e
	},
	c = function(g, f) {
		if (typeof g === "undefined") {
			g = ""
		}
		var e, d = function(h, l) {
			var k = "",
			j;
			h = parseInt(h, 10).toString(16);
			if (l < h.length) {
				return h.slice(h.length - l)
			}
			if (l > h.length) {
				k = "";
				for (j = 0; j < 1 + (l - h.length); j += 1) {
					k += "0"
				}
				return k + h
			}
			return h
		};
		if (!this.php_js) {
			this.php_js = {}
		}
		if (!this.php_js.uniqidSeed) {
			this.php_js.uniqidSeed = Math.floor(Math.random() * 123456789)
		}
		this.php_js.uniqidSeed += 1;
		e = g;
		e += d(parseInt(new Date().getTime() / 1000, 10), 8);
		e += d(this.php_js.uniqidSeed, 5);
		if (f) {
			e += (Math.random() * 10).toFixed(8).toString()
		}
		return e
	},
	b;
	do {
		b = c(a(0, 999999999), true);
		b = b.replace(".", "0")
	} while ( b . length !== 32 );
	return b
};
PMUI.createHTMLElement = function(a) {
	return document.createElement(a)
};
PMUI.setActiveCanvas = function(a) {
	PMUI.activeCanvas = a;
	return this
};
PMUI.getActiveCanvas = function() {
	return PMUI.activeCanvas
};
PMUI.isHTMLElement = function(b) {
	try {
		return b instanceof HTMLElement
	} catch(a) {
		return (typeof b === "object") && (b.nodeType === 1) && (typeof b.style === "object") && (typeof b.ownerDocument === "object")
	}
};
PMUI.removeCurrentMenu = function() {
	if (PMUI.currentContextMenu && PMUI.currentContextMenu.displayed) {
		PMUI.currentContextMenu.hide();
		PMUI.currentContextMenu = null
	}
};
PMUI.getPointRelativeToPage = function(b) {
	var c = b.getCanvas(),
	a = b.absoluteX + c.getX() - c.getLeftScroll() + b.zoomWidth / 2,
	d = b.absoluteY + c.getY() - c.getTopScroll() + b.zoomHeight / 2;
	return new PMUI.util.Point(a, d)
};
PMUI.init = function() {
	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function(b) {
			var a = this.length >>> 0;
			var c = Number(arguments[1]) || 0;
			c = (c < 0) ? Math.ceil(c) : Math.floor(c);
			if (c < 0) {
				c += a
			}
			for (; c < a; c++) {
				if (c in this && this[c] === b) {
					return c
				}
			}
			return - 1
		}
	}
	return this
};
String.prototype.capitalize = function() {
	return this.toLowerCase().replace(/(^|\s)([a-z])/g,
	function(a, c, b) {
		return c + b.toUpperCase()
	})
};
if (typeof exports !== "undefined") {
	module.exports = PMUI
} (function() {
	var a = function() {
		var e = [],
		d = 0,
		b,
		c;
		return {
			id: Math.random(),
			get: function(f) {
				return e[f]
			},
			insert: function(f) {
				e[d] = f;
				d += 1;
				return this
			},
			insertAt: function(g, f) {
				e.splice(f, 0, g);
				d = e.length;
				return this
			},
			remove: function(f) {
				b = this.indexOf(f);
				if (b === -1) {
					return false
				}
				d -= 1;
				e.splice(b, 1);
				return true
			},
			getSize: function() {
				return d
			},
			isEmpty: function() {
				return d === 0
			},
			indexOf: function(f) {
				for (c = 0; c < d; c += 1) {
					if (f === e[c]) {
						return c
					}
				}
				return - 1
			},
			find: function(g, h) {
				var f, j;
				for (f = 0; f < e.length; f += 1) {
					j = e[f];
					if (j[g] === h) {
						return j
					}
				}
				return undefined
			},
			contains: function(f) {
				if (this.indexOf(f) !== -1) {
					return true
				}
				return false
			},
			sort: function(g) {
				var f = false;
				if (g) {
					e.sort(g);
					f = true
				}
				return f
			},
			asArray: function() {
				return e.slice(0)
			},
			swap: function(h, g) {
				var f;
				if (h < d && h >= 0 && g < d && g >= 0) {
					f = e[h];
					e[h] = e[g];
					e[g] = f
				}
				return this
			},
			getFirst: function() {
				return e[0]
			},
			getLast: function() {
				return e[d - 1]
			},
			popLast: function() {
				var f;
				d -= 1;
				f = e[d];
				e.splice(d, 1);
				return f
			},
			getDimensionLimit: function() {
				var f = [100000, -1, -1, 100000],
				g = [undefined, undefined, undefined, undefined];
				for (c = 0; c < d; c += 1) {
					if (f[0] > e[c].y) {
						f[0] = e[c].y;
						g[0] = e[c]
					}
					if (f[1] < e[c].x + e[c].width) {
						f[1] = e[c].x + e[c].width;
						g[1] = e[c]
					}
					if (f[2] < e[c].y + e[c].height) {
						f[2] = e[c].y + e[c].height;
						g[2] = e[c]
					}
					if (f[3] > e[c].x) {
						f[3] = e[c].x;
						g[3] = e[c]
					}
				}
				return f
			},
			clear: function() {
				if (d !== 0) {
					e = [];
					d = 0
				}
				return this
			},
			set: function(f) {
				if (! (f === null || jQuery.isArray(f))) {
					throw new Error("set(): The parameter must be an array or null.")
				}
				e = (f && f.slice(0)) || [];
				d = e.length;
				return this
			}
		}
	};
	PMUI.extendNamespace("PMUI.util.ArrayList", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function(b) {
		this.cssProperties = null;
		this.cssClasses = null;
		this.belongsTo = null;
		a.prototype.initObject.call(this, b)
	};
	a.prototype.type = "Style";
	a.MAX_ZINDEX = 100;
	a.prototype.initObject = function(b) {
		var c = {
			cssClasses: [],
			cssProperties: {},
			belongsTo: null
		};
		jQuery.extend(true, c, b);
		this.cssClasses = c.cssClasses;
		this.cssProperties = c.cssProperties;
		this.belongsTo = c.belongsTo
	};
	a.prototype.applyStyle = function() {
		if (!this.belongsTo.html) {
			throw new Error("applyStyle(): can't apply style to an object with no html.")
		}
		var d, c, b;
		jQuery(this.belongsTo.html).css(this.cssProperties);
		c = this.belongsTo.type.toLowerCase();
		if (this.cssClasses.indexOf("pmui-" + c) === -1) {
			this.cssClasses.unshift("pmui-" + c)
		}
		if (this.cssClasses.indexOf("pmui") === -1) {
			this.cssClasses.unshift("pmui")
		}
		for (d = 0; d < this.cssClasses.length; d += 1) {
			b = this.cssClasses[d];
			if (!$(this.belongsTo.html).hasClass(b)) {
				jQuery(this.belongsTo.html).addClass(b)
			}
		}
		return this
	};
	a.prototype.unapplyStyle = function() {
		var c, b, d;
		if (!this.belongsTo.html) {
			throw new Error("unapplyStyle(): can't unapply style to an object with no html.")
		}
		b = this.belongsTo.type.toLowerCase();
		jQuery(this.belongsTo.html).removeClass("pmui-" + b);
		for (d in this.cssProperties) {
			jQuery(this.belongsTo.html).css(d, "")
		}
	};
	a.prototype.addProperties = function(b) {
		jQuery.extend(true, this.cssProperties, b);
		jQuery(this.belongsTo && this.belongsTo.html).css(b);
		return this
	};
	a.prototype.getProperty = function(b) {
		if (isIE8()) {
			return
		}
		return this.cssProperties[b] || jQuery(this.belongsTo.html).css(b) || (this.belongsTo.html && window.getComputedStyle(this.belongsTo.html, null) && window.getComputedStyle(this.belongsTo.html, null).getPropertyValue(b)) || ""
	};
	a.prototype.getProperties = function() {
		return this.cssProperties
	};
	a.prototype.removeProperties = function(c) {
		var d, b;
		for (b = 0; b < c.length; b += 1) {
			d = c[b];
			if (this.cssProperties.hasOwnProperty(d)) {
				jQuery(this.belongsTo.html).css(d, "");
				delete this.cssProperties[d]
			}
		}
		return this
	};
	a.prototype.removeAllProperties = function() {
		var b;
		if (this.belongsTo) {
			for (b in this.cssProperties) {
				jQuery(this.belongsTo.html).css(b, "")
			}
		}
		this.cssProperties = {};
		return this
	};
	a.prototype.addClasses = function(d) {
		var c, b;
		if (d && d instanceof Array) {
			for (c = 0; c < d.length; c += 1) {
				b = d[c];
				if (typeof b === "string") {
					if (this.cssClasses.indexOf(b) === -1) {
						this.cssClasses.push(b);
						jQuery(this.belongsTo && this.belongsTo.html).addClass(b)
					}
				} else {
					throw new Error("addClasses(): array element is not of type string")
				}
			}
		} else {
			throw new Error("addClasses(): parameter must be of type Array")
		}
		return this
	};
	a.prototype.removeClasses = function(e) {
		var d, c, b;
		if (e && e instanceof Array) {
			for (d = 0; d < e.length; d += 1) {
				b = e[d];
				if (typeof b === "string") {
					c = this.cssClasses.indexOf(b);
					if (c !== -1) {
						jQuery(this.belongsTo.html).removeClass(this.cssClasses[c]);
						this.cssClasses.splice(c, 1)
					}
				} else {
					throw new Error("removeClasses(): array element is not of type string")
				}
			}
		} else {
			throw new Error("removeClasses(): parameter must be of type Array")
		}
		return this
	};
	a.prototype.removeAllClasses = function() {
		while (this.cssClasses.length) {
			jQuery(this.belongsTo && this.belongsTo.html).removeClass(this.cssClasses.pop())
		}
		return this
	};
	a.prototype.containsClass = function(b) {
		return this.cssClasses.indexOf(b) !== -1
	};
	a.prototype.getClasses = function() {
		return this.cssClasses.slice(0)
	};
	a.prototype.clear = function() {
		return this.removeAllClasses().removeAllProperties()
	};
	a.prototype.stringify = function() {
		return {
			cssClasses: this.cssClasses
		}
	};
	if (typeof exports !== "undefined") {
		module.exports = a
	}
	PMUI.extendNamespace("PMUI.util.Style", a)
} ()); (function() {
	var a = function(b) {
		this.products = null;
		this.defaultProduct = null;
		a.prototype.init.call(this, b)
	};
	a.prototype.type = "Factory";
	a.prototype.family = "Factory";
	a.prototype.init = function(b) {
		var c;
		if (!b) {
			b = {}
		}
		c = {
			defaultProduct: b.defaultProduct || "element",
			products: b.products || {
				element: PMUI.core.Element
			}
		};
		this.setDefaultProduct(c.defaultProduct).setProducts(c.products)
	};
	a.prototype.setDefaultProduct = function(b) {
		this.defaultProduct = b;
		return this
	};
	a.prototype.setProducts = function(b) {
		this.products = b;
		return this
	};
	a.prototype.removeProduct = function(c) {
		var b, d = this.products;
		if (typeof c === "string") {
			delete d[c]
		} else {
			for (b in d) {
				if (d[b] === c) {
					delete d[b]
				}
			}
		}
		return this
	};
	a.prototype.clearProducts = function() {
		var b;
		for (b in this.products) {
			this.removeProduct(b)
		}
		return this
	};
	a.prototype.register = function(c, d) {
		var b = this.products || {};
		b[c] = d;
		this.products = b;
		return this
	};
	a.prototype.build = function(d, c) {
		var e, b;
		if (this.isValidName(d)) {
			e = this.products[d];
			b = new e(c)
		} else {
			throw new Error('The type "' + d + '" has not valid constructor or is undefined.')
		}
		return b
	};
	a.prototype.isValidName = function(b) {
		var c = this.products[b];
		return !! c
	};
	a.prototype.isValidClass = function(b) {
		var c = false;
		jQuery.each(this.products,
		function(e, d) {
			if (b instanceof d) {
				c = true
			}
		});
		return c
	};
	a.prototype.make = function(d) {
		var b, c = d.pmType || "";
		if (this.isValidClass(d)) {
			b = d
		} else {
			if (this.isValidName(c)) {
				b = this.build.call(this, c, d)
			} else {
				b = this.build.call(this, this.defaultProduct, d)
			}
		}
		return b
	};
	PMUI.extendNamespace("PMUI.util.Factory", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function(e, d, b, c) {
		this.red = (!e) ? 0 : e;
		this.green = (!d) ? 0 : d;
		this.blue = (!b) ? 0 : b;
		this.opacity = (!c) ? 1 : c
	};
	a.prototype.type = "Color";
	a.GREY = new a(192, 192, 192, 1);
	a.prototype.getCSS = function() {
		var b = "rgba(" + this.red + "," + this.green + "," + this.blue + "," + this.opacity + ")";
		return b
	};
	PMUI.extendNamespace("PMUI.util.Color", a)
} ()); (function() {
	var a = function(c, b) {
		this.x = c;
		this.y = b
	};
	a.prototype.type = "Point";
	a.prototype.getX = function() {
		return this.x
	};
	a.prototype.getY = function() {
		return this.y
	};
	a.prototype.add = function(b) {
		return new a(this.x + b.x, this.y + b.y)
	};
	a.prototype.subtract = function(b) {
		return new a(this.x - b.x, this.y - b.y)
	};
	a.prototype.multiply = function(b) {
		return new a(this.x * b, this.y * b)
	};
	a.prototype.equals = function(b) {
		return (Math.abs(this.x - b.x) < PMUI.draw.Geometry.eps) && (Math.abs(this.y - b.y) < PMUI.draw.Geometry.eps)
	};
	a.prototype.getDistance = function(b) {
		return Math.sqrt((this.x - b.x) * (this.x - b.x) + (this.y - b.y) * (this.y - b.y))
	};
	a.prototype.getSquaredDistance = function(b) {
		return (this.x - b.x) * (this.x - b.x) + (this.y - b.y) * (this.y - b.y)
	};
	a.prototype.getManhattanDistance = function(b) {
		return Math.abs(this.x - b.x) + Math.abs(this.y - b.y)
	};
	a.prototype.clone = function() {
		return new a(this.x, this.y)
	};
	if (typeof exports !== "undefined") {
		module.exports = a
	}
	PMUI.extendNamespace("PMUI.util.Point", a)
} ()); (function() {
	var a = function(b) {
		if (!b) {
			return null
		}
		this.graphics = new JSGraphics(b);
		this.color = "#000"
	};
	a.prototype.drawLine = function(d, j, c, h, g, e, i, f, b) {
		if (!b) {
			this.graphics.clear()
		}
		if (!g) {
			g = "regular"
		}
		switch (g) {
		case "dotted":
			this.graphics.setStroke( - 1);
			break;
		case "segmented":
			this.graphics.setStroke(1);
			this.graphics.drawLine = this.makeSegmentedLine;
			break;
		case "segmentdot":
			this.graphics.setStroke(1);
			this.graphics.drawLine = this.makeSegmentDotLine;
			break;
		default:
			this.graphics.setStroke(1)
		}
		this.graphics.setColor(e.getCSS());
		this.graphics.drawLine(d, j, c, h, i, f);
		this.graphics.paint()
	};
	a.prototype.getColor = function() {
		return this.color
	};
	a.prototype.setColor = function(b) {
		if (b.type === "Color") {
			this.color = b
		}
		return this
	};
	a.prototype.makeSegmentedLine = function(c, l, b, j, f, g) {
		var o, n, d, i = 4,
		e = 3,
		m = 0,
		k, h;
		if ((b !== c && j !== l)) {
			return
		}
		if (b === c) {
			if (j === l) {
				return
			}
			o = 0;
			if (j < l) {
				d = j;
				j = l;
				l = d
			}
			n = m = j - l
		} else {
			n = 0;
			if (b < c) {
				d = b;
				b = c;
				c = d
			}
			o = m = b - c
		}
		k = c;
		h = l;
		if (m < 7) {
			i = 2;
			e = 1
		}
		i = (!f) ? i: f;
		e = (!g) ? e: g;
		if (n === 0) {
			while (o > 0) {
				if (o >= i) {
					this._mkDiv(k, h, i, 1);
					k += i + e;
					o -= (i + e)
				} else {
					this._mkDiv(k, h, o, 1);
					o = 0
				}
			}
		} else {
			while (n > 0) {
				if (n >= i) {
					this._mkDiv(k, h, 1, i);
					h += i + e;
					n -= (i + e)
				} else {
					this._mkDiv(k, h, 1, n);
					n = 0
				}
			}
		}
	};
	a.prototype.makeSegmentDotLine = function(c, m, b, k, f, g) {
		var p, o, d, j = 7,
		e = 4,
		h = 1,
		n = 0,
		l, i;
		if ((b !== c && k !== m)) {
			return
		}
		if (b === c) {
			if (k === m) {
				return
			}
			p = 0;
			if (k < m) {
				d = k;
				k = m;
				m = d
			}
			o = k - m;
			n = o
		} else {
			o = 0;
			if (b < c) {
				d = b;
				b = c;
				c = d
			}
			p = b - c;
			n = p
		}
		l = c;
		i = m;
		j = (!f) ? j: f;
		e = (!g) ? e: g;
		if (o === 0) {
			while (p > 0) {
				if (p >= j) {
					this._mkDiv(l, i, j, 1);
					p -= (j + e);
					l += j + e;
					if (p > 0) {
						this._mkDiv(l, i, h, 1);
						p -= (h + e);
						l += h + e
					}
				} else {
					this._mkDiv(l, i, p, 1);
					p = 0
				}
			}
		} else {
			while (o > 0) {
				if (o >= j) {
					this._mkDiv(l, i, 1, j);
					o -= (j + e);
					i += j + e;
					if (o > 0) {
						this._mkDiv(l, i, 1, h);
						o -= (h + e);
						i += h + e
					}
				} else {
					this._mkDiv(l, i, 1, o);
					o = 0
				}
			}
		}
	};
	a.prototype.drawArc = function(f, e, g, h, c, b) {
		var j, i, d = h;
		if (!b) {
			b = 10
		}
		while (Math.abs(d - c) > 0.00001) {
			d = (d + b) % 360;
			j = f + g * Math.cos(d * PMUI.draw.Geometry.pi / 180);
			i = e + g * Math.sin(d * PMUI.draw.Geometry.pi / 180);
			this.graphics.drawLine(j, i, j, i)
		}
	};
	PMUI.extendNamespace("PMUI.draw.Graphics", a)
} ()); (function() {
	var a = {
		pi: Math.acos( - 1),
		eps: 1e-8,
		cross: function(c, b) {
			return c.x * b.y - c.y * b.x
		},
		area: function(f, e, d) {
			var c = e.clone(),
			b = d.clone();
			return this.cross(c.subtract(f), b.subtract(f))
		},
		onSegment: function(c, b, d) {
			return (Math.abs(this.area(b, d, c)) < this.eps && c.x >= Math.min(b.x, d.x) && c.x <= Math.max(b.x, d.x) && c.y >= Math.min(b.y, d.y) && c.y <= Math.max(b.y, d.y))
		},
		perpendicularSegmentIntersection: function(b, g, e, d) {
			var f, c = null;
			if (b.x > g.x || b.y > g.y) {
				f = b.clone();
				b = g.clone();
				g = f
			}
			if (e.x > d.x || e.y > d.y) {
				f = e.clone();
				e = d.clone();
				d = f
			}
			if (b.x === g.x) {
				if (e.y === d.y && e.x < b.x && b.x < d.x && b.y < e.y && e.y < g.y) {
					c = new PMUI.util.Point(b.x, e.y)
				}
			} else {
				if (b.y === g.y) {
					if (e.x === d.x && b.x < e.x && e.x < g.x && e.y < b.y && b.y < d.y) {
						c = new PMUI.util.Point(e.x, b.y)
					}
				}
			}
			return c
		},
		segmentIntersection: function(f, e, d, b, h) {
			var k = this.area(d, b, f),
			j = this.area(d, b, e),
			i = this.area(f, e, d),
			g = this.area(f, e, b),
			c;
			if (((k > 0 && j < 0) || (k < 0 && j > 0)) && ((i > 0 && g < 0) || (i < 0 && g > 0))) {
				return true
			}
			c = false;
			if (h) {
				if (k === 0 && this.onSegment(f, d, b)) {
					c = true
				} else {
					if (j === 0 && this.onSegment(e, d, b)) {
						c = true
					} else {
						if (i === 0 && this.onSegment(d, f, e)) {
							c = true
						} else {
							if (g === 0 && this.onSegment(b, f, e)) {
								c = true
							}
						}
					}
				}
			}
			return c
		},
		segmentIntersectionPoint: function(b, e, d, c) {
			return b.add((e.subtract(b)).multiply(this.cross(d.subtract(b), c.subtract(b)) / this.cross(e.subtract(b), c.subtract(d))))
		},
		pointInRectangle: function(b, d, c) {
			return (b.x >= d.x && b.x <= c.x && b.y >= d.y && b.y <= c.y)
		},
		pointInCircle: function(d, c, b) {
			return c.getDistance(d) <= b
		},
		pointInRhombus: function(c, f, b) {
			var e, d = f.length - 1;
			for (e = 0; e < f.length; d = e, e += 1) {
				if (this.segmentIntersection(b, c, f[d], f[e], true) && this.onSegment(c, f[d], f[e]) === false) {
					return false
				}
			}
			return true
		}
	};
	if (typeof exports !== "undefined") {
		module.exports = a
	}
	PMUI.extendNamespace("PMUI.draw.Geometry", a)
} ()); (function() {
	var a = function(b) {
		this.id = null;
		a.prototype.init.call(this, b)
	};
	a.prototype.type = "Base";
	a.prototype.family = "Core";
	a.prototype.init = function(b) {
		var c = {
			id: PMUI.generateUniqueId()
		};
		jQuery.extend(true, c, b);
		this.setID(c.id)
	};
	a.prototype.setID = function(b) {
		this.id = b;
		return this
	};
	a.prototype.getID = function() {
		return this.id
	};
	a.prototype.getType = function() {
		return this.type
	};
	a.prototype.getFamily = function() {
		return this.family
	};
	if (typeof exports !== "undefined") {
		module.exports = a
	}
	PMUI.extendNamespace("PMUI.core.Base", a)
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b);
		this.html = null;
		this.style = null;
		this.x = null;
		this.y = null;
		this.width = null;
		this.height = null;
		this.visible = null;
		this.zOrder = null;
		this.elementTag = null;
		this.positionMode = null;
		this.proportion = null;
		this.display = null;
		this.menu = null;
		this.events = {};
		this.eventsDefined = false;
		this.onContextMenu = false;
		this.onBeforeContextMenu = false;
		this.parent = null;
		this.actionHTML = null;
		a.prototype.init.call(this, b)
	};
	PMUI.inheritFrom("PMUI.core.Base", a);
	a.prototype.type = "Element";
	a.prototype.init = function(b) {
		var c = {
			elementTag: "div",
			positionMode: "relative",
			menu: null,
			style: {
				cssProperties: {},
				cssClasses: []
			},
			x: 0,
			y: 0,
			width: "auto",
			height: "auto",
			zOrder: "auto",
			display: "",
			visible: true,
			proportion: 1,
			onContextMenu: null,
			onBeforeContextMenu: null
		};
		jQuery.extend(true, c, b);
		this.setElementTag(c.elementTag).setStyle(c.style).setPositionMode(c.positionMode).setDisplay(c.display).setX(c.x).setY(c.y).setWidth(c.width).setHeight(c.height).setZOrder(c.zOrder).setVisible(c.visible).setProportion(c.proportion).setContextMenu(c.menu).setOnBeforeContextMenu(c.onBeforeContextMenu).setOnContextMenuHandler(c.onContextMenu)
	};
	a.prototype.setOnBeforeContextMenu = function(b) {
		if (! (b === null || typeof b === "function")) {
			throw new Error("setOnBeforeContextMenu(): The parameter must be a function or null.")
		}
		this.onBeforeContextMenu = b;
		return this
	};
	a.prototype.setOnContextMenuHandler = function(b) {
		if (typeof b === "function" || null) {
			this.onContextMenu = b
		}
		return this
	};
	a.prototype.setDisplay = function(b) {
		if (b === "" || b === "block" || b === "inline" || b === "inline-block" || b === "none") {
			this.display = b;
			this.applyStyle()
		} else {
			throw new Error('The setDisplay() method only accepts one od the following options:  "", "block", "inline", "inline-block", "none"')
		}
		return this
	};
	a.prototype.setPositionMode = function(b) {
		if (b === "static" || b === "absolute" || b === "fixed" || b === "relative" || b === "inherit" || b === "") {
			this.positionMode = b;
			this.applyStyle()
		} else {
			throw new Error('The setPosition() method only accepts one of the following options: "static", "absolute", "fixed", "relative", "inherit" or an empty string.')
		}
		return this
	};
	a.prototype.setElementTag = function(b) {
		if (!this.html && typeof b === "string") {
			this.elementTag = b
		}
		return this
	};
	a.prototype.addCSSClasses = function(b) {
		this.style.addClasses(b);
		return this
	};
	a.prototype.addCSSProperties = function(b) {
		this.style.addProperties(b);
		return this
	};
	a.prototype.removeCSSClasses = function(b) {
		this.style.removeClasses(b);
		return this
	};
	a.prototype.removeCSSProperties = function(b) {
		this.style.removeProperties(b);
		return this
	};
	a.prototype.setStyle = function(b) {
		b = b || {};
		if (this.style && this.html) {
			this.style.unapplyStyle()
		}
		if (b instanceof PMUI.util.Style) {
			this.style = b;
			b.belongsTo = this
		} else {
			if (typeof b === "object") {
				b.belongsTo = this;
				this.style = new PMUI.util.Style(b)
			}
		}
		this.applyStyle();
		return this
	};
	a.prototype.setX = function(b) {
		if (typeof b === "number") {
			this.x = b
		} else {
			if (/^\d+(\.\d+)?px$/.test(b)) {
				this.x = parseInt(b, 10)
			} else {
				throw new Error("setX: x param is not a number")
			}
		}
		this.style.addProperties({
			left: this.x
		});
		return this
	};
	a.prototype.getX = function() {
		return this.x
	};
	a.prototype.setY = function(b) {
		if (typeof b === "number") {
			this.y = b
		} else {
			if (/^\d+(\.\d+)?px$/.test(b)) {
				this.y = parseInt(b, 10)
			} else {
				throw new Error("setY: y param is not a number")
			}
		}
		this.style.addProperties({
			top: this.y
		});
		return this
	};
	a.prototype.getY = function() {
		return this.y
	};
	a.prototype.setWidth = function(b) {
		if (typeof b === "number") {
			this.width = b
		} else {
			if (/^\d+(\.\d+)?px$/.test(b)) {
				this.width = parseInt(b, 10)
			} else {
				if (/^\d+(\.\d+)?%$/.test(b)) {
					this.width = b
				} else {
					if (/^\d+(\.\d+)?em$/.test(b)) {
						this.width = b
					} else {
						if (b === "auto") {
							this.width = b
						} else {
							throw new Error("setWidth: width param is not a number")
						}
					}
				}
			}
		}
		this.style.addProperties({
			width: this.width
		});
		return this
	};
	a.prototype.getWidth = function() {
		return this.width
	};
	a.prototype.setHeight = function(b) {
		if (typeof b === "number") {
			this.height = b
		} else {
			if (/^\d+(\.\d+)?px$/.test(b)) {
				this.height = parseInt(b, 10)
			} else {
				if (/^\d+(\.\d+)?%$/.test(b)) {
					this.height = b
				} else {
					if (/^\d+(\.\d+)?em$/.test(b)) {
						this.height = b
					} else {
						if (b === "auto" || b === "inherit") {
							this.height = b
						} else {
							throw new Error("setHeight: height param is not a number")
						}
					}
				}
			}
		}
		this.style.addProperties({
			height: this.height
		});
		return this
	};
	a.prototype.getHeight = function() {
		return this.height
	};
	a.prototype.setZOrder = function(b) {
		if (typeof b === "number") {
			this.zOrder = parseInt(b, 10)
		} else {
			if (b === "auto" || b === "inherit") {
				this.zOrder = b
			} else {
				throw new Error("setZOrder: zOrder param is not a number")
			}
		}
		if (this.html) {
			this.style.addProperties({
				"z-index": this.zOrder
			})
		}
		return this
	};
	a.prototype.getZOrder = function() {
		return this.zOrder
	};
	a.prototype.setVisible = function(b) {
		b = !!b;
		this.visible = b;
		if (this.html) {
			this.style.addProperties({
				display: this.visible ? this.display: "none"
			})
		}
		return this
	};
	a.prototype.isVisible = function() {
		return this.visible
	};
	a.prototype.setPosition = function(b) {
		this.setX(b.x);
		this.setY(b.y);
		return this
	};
	a.prototype.getPosition = function() {
		return {
			x: this.getX(),
			y: this.getY()
		}
	};
	a.prototype.setDimension = function(b) {
		this.setWidth(b.width);
		this.setHeight(b.height);
		return this
	};
	a.prototype.getDimension = function() {
		return {
			width: this.getWidth(),
			height: this.getHeight()
		}
	};
	a.prototype.applyStyle = function() {
		if (this.html) {
			this.style.applyStyle();
			this.style.addProperties({
				display: this.visible ? this.display: "none",
				position: this.positionMode,
				left: this.x,
				top: this.y,
				width: this.width,
				height: this.height,
				zIndex: this.zOrder
			})
		}
		return this
	};
	a.prototype.createHTML = function() {
		var b;
		if (this.html) {
			return this.html
		}
		b = PMUI.createHTMLElement(this.elementTag || "div");
		b.id = this.id;
		this.html = b;
		this.actionHTML = b;
		this.applyStyle();
		if (this.eventsDefined) {
			this.defineEvents()
		}
		return this.html
	};
	a.prototype.getHTML = function() {
		if (!this.html) {
			this.html = this.createHTML()
		}
		return this.html
	};
	a.prototype.setProportion = function(b) {
		this.proportion = b;
		return this
	};
	a.prototype.addEvent = function(e, c) {
		var b = new PMUI.event.EventFactory(),
		f = b.make(e),
		d = c || PMUI.generateUniqueId();
		this.events[d] = f;
		return f
	};
	a.prototype.defineEvents = function() {
		var b = this;
		this.removeEvents();
		this.addEvent("contextmenu").listen(this.actionHTML,
		function(c) {
			if (typeof b.onBeforeContextMenu === "function") {
				b.onBeforeContextMenu(b)
			}
			if (typeof b.onContextMenu === "function") {
				b.onContextMenu(b)
			}
			if (b.menu) {
				c.stopPropagation();
				c.preventDefault();
				b.menu.show(c.pageX, c.pageY)
			}
		});
		this.eventsDefined = true;
		return this
	};
	a.prototype.removeEvent = function(b) {
		if (this.events[b]) {
			this.events[b].unlisten();
			delete this.events[b]
		}
		return this
	};
	a.prototype.removeEvents = function() {
		var b;
		for (b in this.events) {
			this.removeEvent(b)
		}
		return this
	};
	a.prototype.calculateWidth = function(g, c) {
		var e = c || "12px arial",
		d = $(PMUI.createHTMLElement("div")),
		b;
		d.text(g).css({
			position: "absolute",
			"float": "left",
			"white-space": "nowrap",
			visibility: "hidden",
			font: e
		}).appendTo($("body"));
		b = d.width();
		d.remove();
		return b
	};
	a.prototype.setContextMenu = function(c) {
		var b;
		this.removeContextMenu();
		if (c !== null) {
			if (jQuery.isArray(c)) {
				b = new PMUI.menu.Menu({
					items: c
				})
			} else {
				if (c instanceof PMUI.menu.Menu) {
					b = c
				} else {
					if (typeof c === "object") {
						b = new PMUI.menu.Menu(c)
					}
				}
			}
			if (b) {
				this.menu = b.setTargetElement(this)
			}
		}
		return this
	};
	a.prototype.removeContextMenu = function() {
		if (this.menu) {
			this.menu.setTargetElement(null);
			this.menu = null
		}
		return this
	};
	a.prototype.getParent = function() {
		return this.parent
	};
	a.prototype.showContextMenu = function() {
		if (this.menu) {
			this.menu.show()
		}
		return this
	};
	a.prototype.eventsAreDefined = function() {
		return this.eventsDefined
	};
	if (typeof exports !== "undefined") {
		module.exports = a
	}
	PMUI.extendNamespace("PMUI.core.Element", a)
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b);
		this.items = null;
		this.factory = null;
		this.behaviorObject = null;
		this.behavior = null;
		this.containmentArea = null;
		this.onDragStart = null;
		this.onDrop = null;
		this.onDropOut = null;
		this.onBeforeDrop = null;
		this.onSort = null;
		this.sortableItems = null;
		this.disabled = null;
		this.disabledBehavior = null;
		this.massiveAction = false;
		this.onAdd = null;
		this.dragDropBehaviorScope = null;
		this.onSortStart = null;
		this.dragHandler = null;
		a.prototype.init.call(this, b)
	};
	PMUI.inheritFrom("PMUI.core.Element", a);
	a.prototype.type = "Container";
	a.prototype.init = function(b) {
		var c = {
			items: [],
			behavior: "nobehavior",
			dataItems: null,
			onDragStart: null,
			onBeforeDrop: null,
			onDrop: null,
			onDropOut: null,
			onSort: null,
			sortableItems: "> *",
			disabled: false,
			onAdd: null,
			onSortStart: null,
			dragDropBehaviorScope: "pmui-containeritem-behavior",
			dragHandler: null
		};
		jQuery.extend(true, c, b);
		this.items = new PMUI.util.ArrayList();
		this.setFactory(c.factory).setOnAddHandler(c.onAdd);
		if (jQuery.isArray(c.dataItems)) {
			this.setDataItems(c.dataItems)
		} else {
			this.setItems(c.items)
		}
		this.setSortableItems(c.sortableItems).setDragHandler(c.dragHandler).setDragDropBehaviorScope(c.dragDropBehaviorScope).setBehavior(c.behavior).setOnDragStartHandler(c.onDragStart).setOnBeforeDropHandler(c.onBeforeDrop).setOnDropHandler(c.onDrop).setOnDropOutHandler(c.onDropOut).setOnSortHandler(c.onSort);
		this.setOnSortStartHandler(c.onSortStart);
		if (this.disabled) {
			this.disable()
		} else {
			this.enable()
		}
	};
	a.prototype.setDragHandler = function(b) {
		if (! (typeof b === "string" || b === null)) {
			throw new Error("The parameter must be a string or null")
		}
		this.dragHandler = b;
		this.setBehavior(this.behavior);
		return this
	};
	a.prototype.setDragDropBehaviorScope = function(b) {
		if (typeof b !== "string") {
			throw new Error("setDragDropBehaviorScope(): The parameter must be a string.")
		}
		this.dragDropBehaviorScope = b;
		this.setBehavior(this.behavior);
		return this
	};
	a.prototype.setOnAddHandler = function(b) {
		if (! (b === null || typeof b === "function")) {
			throw new Error("setOnAddHandler(): The parameter ust be a function or null.")
		}
		this.onAdd = b;
		return this
	};
	a.prototype.setOnDragStartHandler = function(b) {
		if (! (typeof b === "function" || b === null)) {
			throw new Error("setOnDragStartHandler(): the parameter must be a function or null.")
		}
		this.onDragStart = b;
		return this
	};
	a.prototype.setOnDropOutHandler = function(b) {
		if (! (typeof b === "function" || b === null)) {
			throw new Error("setOnDropOutHandler(): the parameter must be a function or null.")
		}
		this.onDropOut = b;
		return this
	};
	a.prototype.disableBehavior = function() {
		this.disabledBehavior = true;
		this.behaviorObject.disable();
		return this
	};
	a.prototype.enableBehavior = function() {
		this.disabledBehavior = false;
		this.disabled = false;
		this.style.removeClasses(["pmui-disabled"]);
		return this
	};
	a.prototype.disable = function() {
		this.disabled = true;
		this.style.addClasses(["pmui-disabled"]);
		return this.disableBehavior()
	};
	a.prototype.enable = function() {
		this.disabled = false;
		this.style.removeClasses(["pmui-disabled"]);
		return this.enableBehavior()
	};
	a.prototype.setSortableItems = function(b) {
		this.sortableItems = b;
		return this.setBehavior(this.behavior)
	};
	a.prototype.setOnSortHandler = function(b) {
		if (b !== null && typeof b !== "function") {
			throw new Error("setOnSortHandler(): the parameter must be a function or null.")
		}
		this.onSort = b;
		return this
	};
	a.prototype.setOnSortStartHandler = function(b) {
		if (b !== null && typeof b !== "function") {
			throw new Error("setOnSortStartHandler(): the parameter must be a function or null.")
		}
		this.onSortStart = b;
		return this
	};
	a.prototype.setOnBeforeDropHandler = function(b) {
		if (b !== null && typeof b !== "function") {
			throw new Error("setOnDropHandler(): the parameter must be a function or null.")
		}
		this.onBeforeDrop = b;
		return this
	};
	a.prototype.setOnDropHandler = function(b) {
		if (b !== null && typeof b !== "function") {
			throw new Error("setOnDropHandler(): the parameter must be a function or null.")
		}
		this.onDrop = b;
		return this
	};
	a.prototype.addDataItem = function(d, c) {
		var b, e;
		if (typeof d !== "object") {
			throw new Error("addDataItem(): The parameter must be an object.")
		}
		b = [{
			data: d
		}];
		for (e = 1; e < arguments.length; e += 1) {
			b.push(arguments[e])
		}
		this.addItem.apply(this, b);
		return this
	};
	a.prototype.setDataItems = function(b) {
		var c;
		if (jQuery.isArray(b)) {
			this.clearItems();
			this.massiveAction = true;
			for (c = 0; c < b.length; c += 1) {
				this.addDataItem(b[c])
			}
			this.massiveAction = false;
			this.paintItems()
		}
		return this
	};
	a.prototype.getContainmentArea = function() {
		this.getHTML();
		return this.containmentArea
	};
	a.prototype.getBehavioralItems = function() {
		return this.getItems()
	};
	a.prototype.setBehavior = function(c) {
		var e, d, b;
		return this
	};
	a.prototype.setFactory = function(b) {
		if (b instanceof PMUI.util.Factory) {
			this.factory = b
		} else {
			this.factory = new PMUI.util.Factory(b)
		}
		return this
	};
	a.prototype.removeItem = function(b) {
		var c;
		if (b instanceof PMUI.core.Element) {
			c = b
		} else {
			if (typeof b === "string") {
				c = this.items.find("id", b.id)
			} else {
				if (typeof b === "number") {
					c = this.items.get(b)
				}
			}
		}
		if (c) {
			c.parent = null;
			if (this.html) {
				jQuery(c.html).detach()
			}
			this.items.remove(c)
		}
		if (!this.items.getSize()) {
			this.style.addClasses(["pmui-empty"])
		}
		if (this.massiveAction) {
			return this
		}
		return this.setBehavior(this.behavior)
	};
	a.prototype.clearItems = function() {
		this.massiveAction = true;
		while (this.items.getSize() > 0) {
			this.removeItem(0)
		}
		this.setBehavior(this.behavior);
		this.massiveAction = false;
		return this
	};
	a.prototype.isDirectParentOf = function(b) {
		return this.items.indexOf(b) >= 0
	};
	a.prototype.canContain = function(b) {
		return b instanceof PMUI.core.Element ? this.factory.isValidClass(b) : false
	};
	a.prototype.paintItem = function(d, c) {
		var b;
		if (this.html) {
			if (c !== null && c !== undefined) {
				b = this.items.get(c + 1);
				if (b) {
					this.containmentArea.insertBefore(d.getHTML(), b.getHTML())
				} else {
					this.containmentArea.appendChild(d.getHTML())
				}
			} else {
				this.containmentArea.appendChild(d.getHTML())
			}
			if (this.eventsDefined) {
				d.defineEvents()
			}
			this.setBehavior(this.behavior)
		}
		return this
	};
	a.prototype.paintItems = function() {
		var b, c;
		if (this.containmentArea) {
			b = this.items.asArray();
			for (c = 0; c < b.length; c++) {
				this.paintItem(b[c])
			}
		}
		return this
	};
	a.prototype.addItem = function(d, c) {
		var b;
		if (this.factory) {
			b = this.factory.make(d)
		}
		if (b && !this.isDirectParentOf(b)) {
			if (c !== null && c !== undefined) {
				this.items.insertAt(b, c)
			} else {
				this.items.insert(b)
			}
			b.parent = this;
			if (!this.massiveAction) {
				this.paintItem(b, c)
			}
			if (typeof this.onAdd === "function") {
				c = typeof c === "number" ? c: this.items.getSize() - 1;
				this.onAdd(this, this.getItem(c), c)
			}
		}
		return this
	};
	a.prototype.setItems = function(b) {
		var c;
		if (jQuery.isArray(b)) {
			this.clearItems();
			this.massiveAction = true;
			for (c = 0; c < b.length; c += 1) {
				this.addItem(b[c])
			}
			this.massiveAction = false;
			this.paintItems()
		}
		return this
	};
	a.prototype.getItems = function() {
		return this.items.asArray()
	};
	a.prototype.getItem = function(c) {
		var b;
		if (typeof c === "number") {
			b = this.items.get(c)
		} else {
			if (typeof c === "string") {
				b = this.items.find("id", c)
			} else {
				if (this.items.indexOf(c) >= 0) {
					b = c
				}
			}
		}
		return b
	};
	a.prototype.getItemIndex = function(c) {
		var b;
		if (c instanceof PMUI.core.Element) {
			b = c
		} else {
			if (typeof c === "number") {
				b = this.items.get(c)
			} else {
				if (typeof c === "string") {
					b = this.items.find("id", c)
				}
			}
		}
		return this.items.indexOf(b)
	};
	a.prototype.createHTML = function() {
		if (this.html) {
			return this.html
		}
		a.superclass.prototype.createHTML.call(this);
		this.containmentArea = this.html;
		this.paintItems();
		this.style.applyStyle();
		this.setBehavior(this.behavior);
		return this.html
	};
	a.prototype.moveItem = function(f, d) {
		var c = this.items,
		b, e;
		f = this.getItem(f);
		if (f instanceof PMUI.core.Element && this.isDirectParentOf(f)) {
			b = c.indexOf(f);
			c = c.asArray();
			e = this.items.get(d + (b < d ? 1 : 0));
			f = c.splice(b, 1)[0];
			this.items.remove(f);
			this.items.insertAt(f, d);
			if (this.html) {
				if (d === this.items.getSize() - 1) {
					this.containmentArea.appendChild(f.getHTML())
				} else {
					this.containmentArea.insertBefore(f.getHTML(), e.getHTML())
				}
			}
		}
		return this
	};
	a.prototype.onDragOver = function() {
		return function() {}
	};
	a.prototype.onSortingChange = function() {
		var b = this;
		return function(h, g) {
			var d = g.item.get(0),
			f = PMUI.getPMUIObject(d),
			c;
			c = jQuery(b.getContainmentArea()).find(">*").index(d);
			b.moveItem(f, c);
			if (typeof b.onSort === "function") {
				b.onSort(b, f, c)
			}
		}
	};
	a.prototype.onDraggableMouseOver = function(b) {
		return this
	};
	a.prototype.onDraggableMouseOut = function(b) {
		return this
	};
	a.prototype.defineEvents = function() {
		var b, c, d = this;
		a.superclass.prototype.defineEvents.call(this);
		if (d.items.getSize() > 0) {
			c = d.getItems();
			for (b = 0; b < c.length; b++) {
				c[b].defineEvents()
			}
		}
		return this
	};
	PMUI.extendNamespace("PMUI.core.Container", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b);
		this.parent = null;
		a.prototype.init.call(this, b)
	};
	PMUI.inheritFrom("PMUI.core.Container", a);
	a.prototype.type = "Item";
	a.prototype.family = "Item";
	a.prototype.init = function(b) {
		var c = {
			parent: null
		};
		jQuery.extend(true, c, b);
		this.setParent(c.parent)
	};
	a.prototype.setParent = function(b) {
		this.parent = b;
		return this
	};
	a.prototype.getParent = function() {
		return this.parent
	};
	a.prototype.remove = function() {
		if (this.parent) {
			this.parent.removeItem(this)
		}
		return this
	};
	PMUI.extendNamespace("PMUI.core.Item", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b);
		this.panel = null;
		this.parent = null;
		this.layout = null;
		this.topPadding = null;
		this.leftPadding = null;
		this.bottomPadding = null;
		this.rightPadding = null;
		this.borderWidth = null;
		this.border = null;
		a.prototype.init.call(this, b)
	};
	PMUI.inheritFrom("PMUI.core.Container", a);
	a.prototype.type = "Panel";
	a.prototype.init = function(b) {
		var c = {
			panel: null,
			parent: null,
			layout: "box",
			padding: "",
			borderWidth: ""
		};
		jQuery.extend(true, c, b);
		this.setPanel(c.panel).setParent(c.parent).setPadding(c.padding).setBorderWidth(c.borderWidth)
	};
	a.prototype.applyStyle = function() {
		if (this.html) {
			this.style.applyStyle();
			this.style.addProperties({
				display: this.visible ? this.display: "none",
				position: this.positionMode,
				left: this.x,
				top: this.y,
				width: this.width,
				height: this.height,
				zIndex: this.zOrder,
				"padding-top": this.topPadding,
				"padding-right": this.rightPadding,
				"padding-bottom": this.bottomPadding,
				"padding-left": this.leftPadding,
				"border-width": this.borderWidth,
				"border-style": this.borderWidth !== "" ? "solid": "",
				"box-sizing": "border-box"
			})
		}
		return this
	};
	a.prototype.setBorderWidth = function(c) {
		var b = false;
		if (typeof c === "number") {
			this.borderWidth = c + "px"
		} else {
			if (typeof c === "string") {
				c = jQuery.trim(c);
				if (/^\d+(\.\d+)?px$/.test(c) || c === "") {
					this.borderWidth = c
				} else {
					b = true
				}
			} else {
				b = false
			}
		}
		if (b) {
			throw new Error("setBorderWidth(): invalid parameter.")
		} else {
			this.applyStyle();
			if (this.layout) {
				this.layout.applyLayout()
			}
		}
		return this
	};
	a.prototype.getBorderWidth = function() {
		return this.borderWidth || this.style.getProperty("border-width")
	};
	a.prototype.setPadding = function(c) {
		var b = false;
		if (typeof c === "string") {
			c = jQuery.trim(c);
			c = c.split(/\s+/).join(" ");
			if (/^(\d+(\.\d+)?(px|%)\s)+$/.test(c + " ")) {
				c = c.match(/\d+(\.\d+)?(px|%)/g);
				switch (c.length) {
				case 4:
					this.topPadding = c[0];
					this.rightPadding = c[1];
					this.bottomPadding = c[2];
					this.leftPadding = c[3];
					break;
				case 3:
					this.topPadding = c[0];
					this.rightPadding = this.leftPadding = c[1];
					this.bottomPadding = c[2];
					break;
				case 2:
					this.topPadding = this.bottomPadding = c[0];
					this.rightPadding = this.leftPadding = c[1];
					break;
				case 1:
					this.topPadding = this.rightPadding = this.bottomPadding = this.leftPadding = c[0];
					break
				}
			} else {
				if (c === "") {
					this.topPadding = this.rightPadding = this.bottomPadding = this.leftPadding = ""
				} else {
					b = true
				}
			}
		} else {
			if (typeof c === "number") {
				this.topPadding = this.rightPadding = this.bottomPadding = this.leftPadding = c + "px"
			} else {
				b = true
			}
		}
		if (b) {
			throw new Error("setPadding(): Invalid parameter.")
		} else {
			this.applyStyle();
			if (this.layout) {
				this.layout.applyLayout()
			}
		}
		return this
	};
	a.prototype.getPadding = function() {
		return [this.topPadding || this.style.getProperty("padding-top"), this.rightPadding || this.style.getProperty("padding-right"), this.bottomPadding || this.style.getProperty("padding-bottom"), this.leftPadding || this.style.getProperty("padding-left")]
	};
	a.prototype.setPanel = function(b) {
		if (b) {
			if (b instanceof a) {
				this.panel = b
			} else {
				if (typeof b === "object") {
					this.panel = new a(b)
				}
			}
			if (this.html) {
				jQuery(this.html).empty().append(b.getHTML())
			}
		}
		return this
	};
	a.prototype.getUsableWidth = function() {
		var c = this.getPadding(),
		b = parseInt(this.getBorderWidth(), 10) * 2;
		if (isNaN(this.getWidth())) {
			return this.getWidth()
		}
		return this.getWidth() - (parseInt(c[1], 10) || 0) - (parseInt(c[3], 10) || 0) - (b || 0)
	};
	a.prototype.getUsableHeight = function() {
		var c = this.getPadding(),
		b = parseInt(this.getBorderWidth(), 10) * 2;
		if (isNaN(this.getHeight())) {
			return this.getHeight()
		}
		return this.getHeight() - (parseInt(c[0], 10) || 0) - (parseInt(c[2], 10) || 0) - (b || 0)
	};
	a.prototype.setParent = function(b) {
		this.parent = b;
		return this
	};
	a.prototype.addItem = function(c, b) {
		a.superclass.prototype.addItem.call(this, c, b);
		if (this.layout) {
			this.layout.applyLayout()
		}
		return this
	};
	a.prototype.setWidth = function(b) {
		a.superclass.prototype.setWidth.call(this, b);
		if (this.layout) {
			this.layout.applyLayout()
		}
		return this
	};
	a.prototype.setHeight = function(b) {
		a.superclass.prototype.setHeight.call(this, b);
		if (this.layout) {
			this.layout.applyLayout()
		}
		return this
	};
	a.prototype.getParent = function() {
		return this.parent
	};
	a.prototype.createHTML = function() {
		if (this.html) {
			return this.html
		}
		a.superclass.prototype.createHTML.call(this);
		this.applyStyle();
		if (this.layout) {
			this.layout.applyLayout()
		}
		return this.html
	};
	if (typeof exports !== "undefined") {
		module.exports = a
	}
	PMUI.extendNamespace("PMUI.core.Panel", a)
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b);
		this.name = null;
		this.value = null;
		this.field = null;
		this.disabled = null;
		this.onChange = null;
		this.onBeforeChange = null;
		a.prototype.init.call(this, b)
	};
	PMUI.inheritFrom("PMUI.core.Element", a);
	a.prototype.type = "Control";
	a.prototype.init = function(b) {
		var c = {
			name: this.id,
			value: "",
			field: null,
			disabled: false,
			onBeforeChange: null,
			onChange: null
		};
		$.extend(true, c, b);
		this.setName(c.name).setValue(c.value).setField(c.field).disable(c.disabled).setOnBeforeChangeHandler(c.onBeforeChange).setOnChangeHandler(c.onChange)
	};
	a.prototype.setOnBeforeChangeHandler = function(b) {
		if (! (b === null || typeof b === "function")) {
			throw new Error("setOnBeforeChangeHandler(): The parameter must be a function or null.")
		}
		this.onBeforeChange = b;
		return this
	};
	a.prototype.setName = function(b) {
		if (typeof b === "string" || typeof b === "number") {
			this.name = b.toString();
			if (this.html) {
				this.html.setAttribute("name", b)
			}
		} else {
			throw new Error("The setName() method only accepts string or number values")
		}
		return this
	};
	a.prototype.getName = function() {
		return this.name
	};
	a.prototype.setValue = function(b) {
		if (typeof b !== "undefined") {
			this.value = b.toString()
		} else {
			throw new Error("setValue(): a parameter is required.")
		}
		return this
	};
	a.prototype.getValue = function() {
		return this.value
	};
	a.prototype.setField = function(b) {
		return this
	};
	a.prototype.getField = function() {
		return this.field
	};
	a.prototype.disable = function(b) {
		this.disabled = !!b;
		return this
	};
	a.prototype.isEnabled = function() {
		return ! this.disabled
	};
	a.prototype.setOnChangeHandler = function(b) {
		if (typeof b === "function") {
			this.onChange = b
		}
		return this
	};
	a.prototype.getValueFromRawElement = function() {
		throw new Error("Calling getValueFromRawElement() from PMUI.control.Control: this is an abstract method!")
	};
	a.prototype.onChangeHandler = function() {
		var c = this.value,
		b = this.getValueFromRawElement(),
		d;
		if (typeof this.onBeforeChange === "function" && b !== c) {
			d = this.onBeforeChange(b, c);
			if (d === false) {
				b = c;
				this.setValue(b)
			}
		}
		this.value = b;
		if (typeof this.onChange === "function" && this.value !== c) {
			this.onChange(this.value, c)
		}
		return this
	};
	a.prototype.attachListeners = function() {
		throw new Error("Calling attachListeners() from PMUI.control.Control: this is an abstract method!")
	};
	a.prototype.createHTML = function() {
		a.superclass.prototype.createHTML.call(this);
		return this.html
	};
	a.prototype.getHTML = function() {
		if (!this.html) {
			this.html = this.createHTML()
		}
		return this.html
	};
	a.prototype.setFocus = function() {
		if (this.html) {
			this.html.focus()
		}
	};
	PMUI.extendNamespace("PMUI.control.Control", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b);
		this.elementTag = "input"
	};
	PMUI.inheritFrom("PMUI.control.Control", a);
	a.prototype.type = "HTMLControl";
	a.prototype.setValue = function(b) {
		a.superclass.prototype.setValue.call(this, b);
		if (this.html && this.html.value !== this.value) {
			this.html.value = this.value
		}
		return this
	};
	a.prototype.disable = function(b) {
		a.superclass.prototype.disable.call(this, b);
		if (this.html) {
			this.html.disabled = this.disabled
		}
		return this
	};
	a.prototype.getValueFromRawElement = function() {
		return this.html.value
	};
	a.prototype.defineEvents = function() {
		var b = this;
		a.superclass.prototype.defineEvents.call(this);
		if (this.html) {
			this.addEvent("blur").listen(this.html,
			function() {
				b.onChangeHandler()
			})
		}
		return this
	};
	a.prototype.createHTML = function() {
		if (this.html) {
			return this.html
		}
		a.superclass.prototype.createHTML.call(this);
		this.setName(this.name).setValue(this.value).disable(this.disabled);
		return this.html
	};
	PMUI.extendNamespace("PMUI.control.HTMLControl", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b);
		this.options = [];
		this.elementTag = "select";
		a.prototype.init.call(this, b)
	};
	PMUI.inheritFrom("PMUI.control.HTMLControl", a);
	a.prototype.type = "DropDownListControl";
	a.prototype.init = function(b) {
		var c = {
			options: [],
			value: null,
			height: 30
		};
		jQuery.extend(true, c, b);
		this.setOptions(c.options);
		this.setHeight(c.height);
		if (c.value !== null) {
			this.setValue(c.value)
		}
	};
	a.prototype.clearOptions = function() {
		this.options = [];
		if (this.html) {
			jQuery(this.html).empty()
		}
		this.value = "";
		return this
	};
	a.prototype.enableDisableOption = function(c, g, l) {
		var k = this,
		f = jQuery(this.html),
		e,
		d,
		b,
		h = {
			applyTo: "all"
		};
		c = !!c;
		if (l) {
			for (e = 0; e < this.options.length; e += 1) {
				if (this.options[e].isGroup && this.options[e].label === l) {
					k = this.options[e];
					break
				}
			}
			if (k === this.options) {
				throw new Error('disableOption(): the group "' + l + "\" wasn't found.")
			}
			f = jQuery(this.html).find('>optgroup[label="' + l + '"]')
		}
		if (typeof g === "number") {
			k.options[g].disabled = c;
			f.find(">*").eq(g).attr("disabled", c)
		} else {
			if (typeof g === "string") {
				for (e = 0; e < k.options.length; e += 1) {
					if (!k.options[e].isGroup && k.options[e].value === g) {
						k.options[e].disabled = c
					} else {
						if (k.options[e].isGroup && k.options[e].label === g) {
							k.options[e].disabled = c;
							b = k.options[e].options;
							for (d = 0; d < b.length; d += 1) {
								if (b[d].value === g) {
									b[d].disabled = true
								}
							}
						}
					}
				}
				jQuery(f).find('option[value="' + g + '"]').add('optgroup[label="' + g + '"]').attr("disabled", c)
			} else {
				if (typeof g === "object") {
					jQuery.extend(true, h, g);
					if (h.applyTo === "groups") {
						for (e = 0; e < k.options.length; e += 1) {
							if (k.options[e].isGroup && k.options[e].label === g.criteria) {
								k.options[e].disabled = c
							}
						}
						jQuery(f).find('optgroup[label="' + g.criteria + '"]').attr("disabled", c)
					} else {
						if (h.applyTo === "options") {
							for (e = 0; e < k.options.length; e += 1) {
								if (!k.options[e].isGroup && k.options[e].value === g.criteria) {
									k.options[e].disabled = c
								}
							}
							jQuery(f).find('option[value="' + g.criteria + '"]').attr("disabled", c.criteria)
						} else {
							g = g.criteria;
							for (e = 0; e < k.options.length; e += 1) {
								if (!k.options[e].isGroup && k.options[e].value === g) {
									k.options[e].disabled = c
								} else {
									if (k.options[e].isGroup && k.options[e].label === g) {
										k.options[e].disabled = c;
										b = k.options[e].options;
										for (d = 0; d < b.length; d += 1) {
											if (b[d].value === g) {
												b[d].disabled = true
											}
										}
									}
								}
							}
							jQuery(f).find('option[value="' + g + '"]').add('optgroup[label="' + g + '"]').attr("disabled", c)
						}
					}
				} else {
					throw new Error("disableOption(): the first parameter must be a Number or a String.")
				}
			}
		}
		return this
	};
	a.prototype.disableOption = function(b, c) {
		return this.enableDisableOption(true, b, c)
	};
	a.prototype.enableOption = function(b, c) {
		return this.enableDisableOption(false, b, c)
	};
	a.prototype.removeOption = function(f, h) {
		var k = this,
		g = jQuery(this.html),
		e,
		d,
		b,
		c = {
			applyTo: "all"
		};
		if (h) {
			for (e = 0; e < this.options.length; e += 1) {
				if (this.options[e].isGroup && this.options[e].label === h) {
					k = this.options[e];
					break
				}
			}
			if (k === this.options) {
				throw new Error('disableOption(): the group "' + h + "\" wasn't found.")
			}
			g = jQuery(this.html).find('>optgroup[label="' + h + '"]')
		}
		if (typeof f === "number") {
			k.options.splice(f, 1);
			g.find(">*").eq(f).remove()
		} else {
			if (typeof f === "string") {
				for (e = 0; e < k.options.length; e += 1) {
					if (!k.options[e].isGroup && k.options[e].value === f) {
						k.options.splice(e, 1);
						e -= 1
					} else {
						if (k.options[e].isGroup && k.options[e].label === f) {
							b = k.options[e].options;
							for (d = 0; d < b.length; d += 1) {
								if (b[d].value === f) {
									b.splice(d, 1);
									d -= 1
								}
							}
							k.options.splice(e, 1);
							e -= 1
						}
					}
				}
				jQuery(g).find('option[value="' + f + '"]').add('optgroup[label="' + f + '"]').remove()
			} else {
				if (typeof f === "object") {
					jQuery.extend(true, c, f);
					if (c.applyTo === "groups") {
						for (e = 0; e < k.options.length; e += 1) {
							if (k.options[e].isGroup && k.options[e].label === f.criteria) {
								k.options.splice(e, 1);
								e -= 1
							}
						}
						jQuery(g).find('optgroup[label="' + f.criteria + '"]').remove()
					} else {
						if (c.applyTo === "options") {
							for (e = 0; e < k.options.length; e += 1) {
								if (!k.options[e].isGroup && k.options[e].value === f.criteria) {
									k.options.splice(e, 1);
									e -= 1
								}
							}
							jQuery(g).find('option[value="' + f.criteria + '"]').remove()
						} else {
							f = f.criteria;
							for (e = 0; e < k.options.length; e += 1) {
								if ((!k.options[e].isGroup && k.options[e].value === f) || (k.options[e].isGroup && k.options[e].label === f)) {
									k.options.splice(e, 1);
									e -= 1
								}
							}
							jQuery(g).find('option[value="' + f + '"]').add('optgroup[label="' + f + '"]').remove()
						}
					}
				} else {
					throw new Error("disableOption(): the first parameter must be a Number or a String.")
				}
			}
		}
		return this
	};
	a.prototype.addOptionGroup = function(b) {
		var c = {},
		e, d;
		if (!b.label) {
			throw new Error("addOptionGroup(): a label for the new option group is required!")
		}
		c.label = b.label;
		c.disabled = !!b.disabled;
		c.isGroup = true;
		c.options = [];
		this.options.push(c);
		if (this.html) {
			e = PMUI.createHTMLElement("optgroup");
			e.label = c.label;
			e.disabled = c.disabled;
			this.html.appendChild(e)
		}
		if (!jQuery.isArray(b.options)) {
			b.options = []
		}
		for (d = 0; d < b.options.length; d += 1) {
			this.addOption(b.options[d], c.label)
		}
		return this
	};
	a.prototype.addOption = function(e, h) {
		var f = {},
		c, d, g, b = false;
		f.value = e.value !== null && e.value !== undefined && e.value.toString ? e.value: (e.label || "");
		f.value = f.value.toString();
		f.label = e.label || f.value;
		f.label = f.label.toString();
		f.disabled = !!e.disabled;
		f.isGroup = false;
		if (!h) {
			this.options.push(f)
		} else {
			for (d = 0; d < this.options.length; d += 1) {
				if (this.options[d].isGroup && this.options[d].label === h) {
					this.options[d].options.push(f);
					b = true;
					break
				}
			}
			if (!b) {
				this.addOptionGroup({
					label: h
				});
				this.options[this.options.length - 1].options.push(f)
			}
		}
		if (this.html) {
			c = PMUI.createHTMLElement("option");
			c.value = f.value;
			c.selected = !!e.selected;
			c.label = f.label;
			c.disabled = f.disabled;
			c.textContent = c.label;
			if (h) {
				g = jQuery(this.html).find('optgroup[label="' + h + '"]');
				if (g.length) {
					g.get(0).appendChild(c)
				} else {
					throw new Error('addOption(): the optiongroup "' + h + "\" wasn't found")
				}
			} else {
				jQuery(this.html).append(c)
			}
		}
		if (e.selected) {
			this.value = f.value
		}
		if (this.getOptions().length == 1) {
			this.value = f.value
		}
		return this
	};
	a.prototype.getSelectedLabel = function() {
		var b;
		if (this.html) {
			return jQuery(this.html).find("option:selected").attr("label")
		}
		for (b = 0; b < this.options.length; b += 1) {
			if (this.options[b].value === this.value) {
				return this.options[b].label
			}
		}
		return ""
	};
	a.prototype.valueExistsInOptions = function(g) {
		var e, d, c, b, h, f;
		b = (c = this.options || []).length;
		for (e = 0; e < b; e++) {
			if (c[e].isGroup) {
				f = (h = c[e].options || []).length;
				for (d = 0; d < f; d++) {
					if (h[d].value == g) {
						return true
					}
				}
			} else {
				if (c[e].value == g) {
					return true
				}
			}
		}
		return false
	};
	a.prototype.getFirstAvailableOption = function() {
		var e, d, c, b, g, f;
		b = (c = this.options || []).length;
		for (e = 0; e < b; e++) {
			if (c[e].isGroup) {
				return (c[e].options.length && c[e].options[0]) || null
			} else {
				return c[e]
			}
		}
		return null
	};
	a.prototype.setOptions = function(b) {
		var c, d, e;
		if (jQuery.isArray(b)) {
			this.clearOptions();
			for (c = 0; c < b.length; c += 1) {
				if (jQuery.isArray(b[c].options)) {
					this.addOptionGroup(b[c])
				} else {
					this.addOption(b[c])
				}
			}
			if (!this.valueExistsInOptions(this.value)) {
				e = this.getFirstAvailableOption();
				this.value = (e && e.value) || ""
			}
		}
		return this
	};
	a.prototype.getOptions = function(e) {
		var c = [],
		d,
		b;
		if (e) {
			return this.options.slice(0)
		}
		for (d = 0; d < this.options.length; d += 1) {
			if (!this.options[d].isGroup) {
				c.push(this.options[d])
			} else {
				for (b = 0; b < this.options[d].options.length; b += 1) {
					c.push(this.options[d].options[b])
				}
			}
		}
		return c
	};
	a.prototype.defineEvents = function() {
		var b = this;
		a.superclass.superclass.prototype.defineEvents.call(this);
		if (this.html) {
			this.addEvent("change").listen(this.html,
			function() {
				b.onChangeHandler()
			})
		}
		return this
	};
	a.prototype.setValue = function(b) {
		var c;
		if (!this.valueExistsInOptions(b)) {
			c = this.getFirstAvailableOption();
			b = (c && c.value) || ""
		}
		return a.superclass.prototype.setValue.call(this, b)
	};
	a.prototype.createHTML = function() {
		var b;
		if (this.html) {
			return this.html
		}
		b = this.value;
		a.superclass.prototype.createHTML.call(this);
		this.setOptions(this.options.slice(0)).setValue(b);
		return this.html
	};
	PMUI.extendNamespace("PMUI.control.DropDownListControl", a)
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, jQuery.extend(true, {
			positionMode: "absolute"
		},
		b));
		this.header = null;
		this.body = null;
		this.footer = null;
		this.title = null;
		this.closeButton = null;
		this.isOpen = false;
		this.visibleFooter = null;
		this.visibleCloseButton = null;
		this.modal = null;
		this.footerHeight = null;
		this.footerAlign = null;
		this.buttonPanelPosition = null;
		this.onOpen = null;
		this.onClose = null;
		this.dom = {};
		this.onBeforeClose = null;
		a.prototype.init.call(this, b)
	};
	PMUI.inheritFrom("PMUI.core.Panel", a);
	a.prototype.type = "Window";
	a.prototype.family = "ui";
	a.prototype.init = function(b) {
		var c = {
			height: "auto",
			width: "auto",
			title: "[Untitled window]",
			modal: true,
			footerHeight: "auto",
			zOrder: 100,
			footerItems: [],
			footerAlign: "center",
			visibleCloseButton: true,
			visibleFooter: false,
			buttons: [],
			buttonPanelPosition: "bottom",
			onOpen: null,
			onClose: null,
			onBeforeClose: null
		};
		jQuery.extend(true, c, b);
		this.setTitle(c.title).setModal(c.modal).setWidth(c.width).setHeight(c.height).setZOrder(c.zOrder).setButtonPanelPosition(c.buttonPanelPosition).setOnOpenHandler(c.onOpen).setOnCloseHandler(c.onClose);
		this.setOnBeforeCloseHandler(c.onBeforeClose);
		if (c.visibleCloseButton) {
			this.showCloseButton()
		} else {
			this.hideCloseButton()
		}
	};
	a.prototype.setOnCloseHandler = function(b) {
		if (! (b === null || typeof b === "function")) {
			throw new Error("setOnCloseHandler(): The parameter must be a function or null.")
		}
		this.onClose = b;
		return this
	};
	a.prototype.setOnBeforeCloseHandler = function(b) {
		if (! (b === null || typeof b === "function")) {
			throw new Error("setOnCloseHandler(): The parameter must be a function or null.")
		}
		this.onBeforeClose = b;
		return this
	};
	a.prototype.setOnOpenHandler = function(b) {
		if (! (b === null || typeof b === "function")) {
			throw new Error("setOnOpenHandler(): The parameter must be a function or null.")
		}
		this.onOpen = b;
		return this
	};
	a.prototype.updateDimensionsAndPosition = function() {
		var e, d, b, f = this.height,
		c;
		if (!this.footer || !this.html || !this.isOpen) {
			return this
		}
		if (this.footerHeight === "auto") {
			this.footer.setHeight("auto")
		} else {
			this.footer.setHeight(this.footerHeight)
		}
		if (f === "auto") {
			this.body.style.height = "auto";
			this.body.style.minHeight = "150px"
		} else {
			if (/^\d+(\.\d+)?em$/.test(f)) {
				f = PMUI.emToPx(parseInt(f, 10), this.modalObject)
			} else {
				if (/^\d+(\.\d+)?%$/.test(f)) {
					f = jQuery(this.html).outerHeight()
				}
			}
			d = this.visibleFooter ? jQuery(this.footer.getHTML()).outerHeight() : 0;
			b = jQuery(this.header).outerHeight();
			e = f - d - b;
			if (e <= 0) {
				e = 0
			}
			this.body.style.minHeight = "";
			this.body.style.height = e + "px"
		}
		c = jQuery(this.header).width();
		c = c - (this.visibleCloseButton ? jQuery(this.closeButton.getHTML()).outerWidth() : 0);
		this.dom.titleContainer.style.width = c < 0 ? 0 : c + "px";
		c = jQuery(this.html).outerWidth();
		f = jQuery(this.html).outerHeight();
		this.addCSSProperties({
			left: "50%",
			"margin-left": (c / -2) + "px",
			top: "50%",
			"margin-top": (f / -2) + "px"
		});
		return this
	};
	a.prototype.setTitle = function(b) {
		if (typeof b === "string") {
			this.title = b;
			if (this.dom.titleContainer) {
				this.dom.titleContainer.textContent = b;
				this.dom.titleContainer.title = b
			}
		} else {
			throw new Error("The setTitle() method accepts only string values.")
		}
		return this
	};
	a.prototype.getTitle = function() {
		return this.title
	};
	a.prototype.setModal = function(b) {
		if (typeof b !== "undefined") {
			this.modal = !!b
		}
		return this
	};
	a.prototype.setWidth = function(b) {
		a.superclass.prototype.setWidth.call(this, b);
		return this.updateDimensionsAndPosition()
	};
	a.prototype.setHeight = function(b) {
		a.superclass.prototype.setHeight.call(this, b);
		return this.updateDimensionsAndPosition()
	};
	a.prototype.setFooterHeight = function(b) {
		if (typeof b === "number") {
			this.footerHeight = b
		} else {
			if (/^\d+(\.\d+)?px$/.test(b)) {
				this.footerHeight = parseInt(b, 10)
			} else {
				if (b === "auto") {
					this.footerHeight = b
				} else {
					throw new Error("setFooterHeight: footerHeight param is not valid.")
				}
			}
		}
		if (this.footer) {
			this.footer.style.height = this.footerHeight + "px"
		}
		if (this.isOpen) {
			this.updateDimensionsAndPosition()
		}
		return this
	};
	a.prototype.setButtonPanelPosition = function(b) {
		if (! (b === "top" || b === "bottom")) {
			throw new Error('setButtonPanelPosition(): the value is not valid, should be a "top" or "bottom"')
		}
		this.buttonPanelPosition = b;
		if (this.html) {
			if (b === "top") {
				this.html.insertBefore(this.footer.html, this.body)
			} else {
				this.html.appendChild(this.footer.html)
			}
		}
		return this
	};
	a.prototype.addFooterItem = function(b) {
		this.footer.addItem(b);
		return this
	};
	a.prototype.close = function() {
		jQuery(this.modalObject).detach();
		jQuery(this.html).detach();
		jQuery(this.closeButton).detach();
		if (typeof this.onClose === "function") {
			this.onClose(this)
		}
		this.isOpen = false;
		if (document.body && this.modal) {
			document.body.style.overflow = "auto"
		}
		if ($.stackModal) {
			$.stackModal.pop();
			var b = $.stackModal[$.stackModal.length - 1];
			$(b).find(":tabbable:eq(0)").focus(1);
			$(b).find(":tabbable:eq(1)").focus(1)
		}
		return this
	};
	a.prototype.showCloseButton = function() {
		this.visibleCloseButton = true;
		if (this.closeButton) {
			this.closeButton.setVisible(true)
		}
		return this
	};
	a.prototype.addItem = function(c) {
		var b;
		if (this.factory) {
			b = this.factory.make(c)
		}
		if (b && !this.isDirectParentOf(b)) {
			b.parent = this;
			this.items.insert(b);
			if (this.body) {
				this.body.appendChild(b.getHTML());
				if (this.eventsDefined) {
					b.defineEvents()
				}
			}
		}
		return this
	};
	a.prototype.open = function() {
		var b;
		if (this.isOpen) {
			return this
		}
		b = this.getHTML();
		if (this.modal) {
			this.modalObject.appendChild(b);
			document.body.appendChild(this.modalObject);
			jQuery(b).draggable({
				containment: "#" + this.modalObject.id,
				scroll: false
			});
			$(b).find(":tabbable:eq(0)").focus(1);
			$(b).find(":tabbable:eq(1)").focus(1);
			if (!$.stackModal) {
				$.stackModal = []
			}
			$.stackModal.push(b);
			$(b).on("keydown",
			function(e) {
				if (e.keyCode !== $.ui.keyCode.TAB) {
					return
				}
				var d = $(":tabbable", this),
				f = d.filter(":first"),
				c = d.filter(":last");
				if (e.target === c[0] && !e.shiftKey) {
					f.focus(1);
					return false
				} else {
					if (e.target === f[0] && e.shiftKey) {
						c.focus(1);
						return false
					}
				}
			})
		} else {
			document.body.appendChild(b);
			jQuery(this.getHTML()).draggable()
		}
		if (typeof this.onOpen === "function") {
			this.onOpen(this)
		}
		this.isOpen = true;
		this.updateDimensionsAndPosition();
		this.setVisible(true);
		this.defineEvents();
		if (document.body && this.modal) {
			document.body.style.overflow = "hidden"
		}
		return this
	};
	a.prototype.hideCloseButton = function() {
		this.visibleCloseButton = false;
		if (this.closeButton) {
			this.closeButton.setVisible(false)
		}
		return this
	};
	a.prototype.showCloseButton = function() {
		this.visibleCloseButton = true;
		if (this.closeButton) {
			this.closeButton.setVisible(true)
		}
		return this
	};
	a.prototype.updateModalDimensions = function() {
		if (document && this.modalObject) {
			this.modalObject.style.height = this.modalObject.style.width = "0px";
			this.modalObject.style.width = window.innerWidth + "px";
			this.modalObject.style.height = window.innerHeight + "px"
		}
		return this
	};
	a.prototype.setBodyPadding = function(b) {
		if (typeof b === "number") {
			this.bodyPadding = b
		} else {
			if (/^\d+(\.\d+)?px$/.test(height)) {
				this.bodyPadding = parseInt(b, 10)
			} else {
				throw new Error("setHeight: height param is not valid.")
			}
		}
		this.bodyPadding = b;
		if (this.html) {
			this.body.style.padding = b + "px"
		}
		return this
	};
	a.prototype.paintItems = function() {
		if (this.body) {
			a.superclass.prototype.paintItems.call(this)
		}
		return this
	};
	a.prototype.defineEvents = function() {
		var f, e, d, h = this,
		g = this.html,
		l = this.modal,
		k, c, b = function(n) {
			var i = h.body.clientHeight,
			j = h.body.scrollHeight,
			m = h.body.scrollTop;
			n.stopPropagation()
		};
		a.superclass.prototype.defineEvents.call(this);
		k = new PMUI.event.Action({
			handler: function(i) {
				i.stopPropagation()
			}
		}),
		c = new PMUI.event.Action({
			handler: function() {
				h.updateModalDimensions()
			}
		});
		this.addEvent("mousedown").listen(this.body, k);
		h.addEvent("click").listen(this.html, k);
		h.addEvent("mouseover").listen(this.html, k);
		h.addEvent("mouseout").listen(this.html, k);
		h.addEvent("mousedown").listen(this.html, k);
		h.addEvent("resize").listen(window, c);
		this.addEvent("keydown").listen(this.html, k);
		this.addEvent("keypress").listen(this.html, k);
		this.addEvent("keyup").listen(this.html, k);
		this.modalObject.addEventListener("wheel",
		function(i) {
			i.preventDefault();
			i.stopPropagation()
		},
		false);
		this.body.addEventListener("wheel", b, false);
		this.footer.defineEvents();
		h.closeButton.defineEvents();
		this.updateModalDimensions();
		return this
	};
	a.prototype.createHTML = function() {
		var g, c, b, d, f, e = this;
		if (this.html) {
			return this.html
		}
		a.superclass.prototype.createHTML.call(this);
		g = PMUI.createHTMLElement("div");
		g.className = "pmui-window-header";
		c = PMUI.createHTMLElement("div");
		c.className = "pmui-window-body";
		f = PMUI.createHTMLElement("div");
		f.className = "pmui-window-modal";
		f.id = this.id + "-modal";
		b = PMUI.createHTMLElement("span");
		b.className = "pmui-window-title";
		b.style.display = "inline-block";
		d = new PMUI.ui.Button({
			style: {
				cssClasses: ["pmui-window-close"]
			},
			text: "",
			width: "16px",
			handler: function(h) {
				if (typeof e.onBeforeClose === "function") {
					e.onBeforeClose(e)
				} else {
					e.close()
				}
			}
		});
		this.modalObject = f;
		g.appendChild(b);
		g.appendChild(d.getHTML());
		$(d.html).find(".button-icon").css("opacity", "inherit");
		this.html.appendChild(g);
		this.html.appendChild(c);
		this.html.appendChild(this.footer.getHTML());
		this.dom.titleContainer = b;
		this.header = g;
		this.body = this.containmentArea = c;
		this.closeButton = d;
		this.setTitle(this.title).setFooterHeight(this.footerHeight).setItems(this.items.asArray().slice(0)).setButtonPanelPosition(this.buttonPanelPosition);
		if (this.visibleCloseButton) {
			this.showCloseButton()
		} else {
			this.hideCloseButton()
		}
		if (this.visibleFooter) {
			this.showFooter()
		} else {
			this.hideFooter()
		}
		if (this.eventsDefined) {
			this.defineEvents()
		}
		return this.html
	};
	PMUI.extendNamespace("PMUI.ui.Window", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b);
		this.message = null;
		this.dom = {};
		this.iconClass = null;
		this.windowMessageType = null;
		a.prototype.init.call(this, b)
	};
	PMUI.inheritFrom("PMUI.ui.Window", a);
	a.prototype.type = "WindowMessage";
	a.prototype.family = "ui";
	a.prototype.init = function(b) {
		var d;
		var c = {
			message: "[not-message]",
			iconClass: "",
			windowMessageType: "default",
			title: "",
			footerAlign: "right"
		};
		jQuery.extend(true, c, b);
		this.setMessage(c.message);
		this.setWindowMessageType(c.windowMessageType);
		this.setTitle(c.title)
	};
	a.prototype.setMessage = function(b) {
		if (typeof b !== "string") {
			throw new Error("setMessage(): the parameter must be a string.")
		}
		this.message = jQuery.trim(b);
		if (this.dom.messageContainer) {
			this.dom.messageContainer.textContent = b
		}
		return this
	};
	a.prototype.getMessage = function() {
		return this.message
	};
	a.prototype.setWindowMessageType = function(c) {
		var b = "";
		if (typeof c !== "string") {
			throw new Error("settype(): the type value is not valid")
		}
		this.windowMessageType = c;
		this.style.removeClasses(["pmui-windowmessage-default", "pmui-windowmessage-error", "pmui-windowmessage-warning", "pmui-windowmessage-success"]);
		b = "pmui-windowmessage-" + this.windowMessageType;
		switch (this.windowMessageType) {
		case "error":
			this.style.addClasses([b]);
			break;
		case "warning":
			this.style.addClasses([b]);
			break;
		case "success":
			this.style.addClasses([b]);
			break;
		case "default":
			this.style.addClasses([b]);
			break
		}
		return this
	};
	a.prototype.getWindowMessageType = function() {
		return this.windowMessageType
	};
	a.prototype.addItem = function() {
		return this
	};
	a.prototype.createHTML = function() {
		var f, h, b, c, d, g, e;
		a.superclass.prototype.createHTML.call(this);
		f = PMUI.createHTMLElement("table");
		f.className = "pmui-messagewindow-container";
		h = PMUI.createHTMLElement("tr");
		b = PMUI.createHTMLElement("td");
		c = PMUI.createHTMLElement("td");
		c.style.textAlign = "center";
		c.className = "pmui-content-label";
		d = PMUI.createHTMLElement("span");
		d.className = "pmui-messagewindow-icon";
		e = PMUI.createHTMLElement("span");
		e.className = "pmui-messagewindow-message";
		b.appendChild(d);
		h.appendChild(b);
		c.appendChild(e);
		h.appendChild(c);
		f.appendChild(h);
		this.dom.icon = d;
		this.dom.messageContainer = e;
		this.body.appendChild(f);
		this.setMessage(this.message);
		this.body.style.padding = "15px";
		c.style.width = (typeof this.width == "number") ? this.width * (0.84) + "px": "70%";
		this.body.style.minHeight = "inherit";
		return this.html
	};
	a.prototype.updateDimensionsAndPosition = function() {
		var e, d, b, f = this.height,
		c;
		if (!this.footer || !this.html || !this.isOpen) {
			return this
		}
		if (this.footerHeight === "auto") {
			this.footer.setHeight("auto")
		} else {
			this.footer.setHeight(this.footerHeight)
		}
		if (f === "auto") {
			this.body.style.height = "auto";
			this.body.style.minHeight = "inherit"
		} else {
			if (/^\d+(\.\d+)?em$/.test(f)) {
				f = PMUI.emToPx(parseInt(f, 10), this.modalObject)
			} else {
				if (/^\d+(\.\d+)?%$/.test(f)) {
					f = jQuery(this.html).outerHeight()
				}
			}
			d = this.visibleFooter ? jQuery(this.footer.getHTML()).outerHeight() : 0;
			b = jQuery(this.header).outerHeight();
			e = f - d - b;
			if (e <= 0) {
				e = 0
			}
			this.body.style.minHeight = "";
			this.body.style.height = e + "px"
		}
		c = jQuery(this.header).width();
		c = c - (this.visibleCloseButton ? jQuery(this.closeButton.getHTML()).outerWidth() : 0);
		this.dom.titleContainer.style.width = c < 0 ? 0 : c + "px";
		c = jQuery(this.html).outerWidth();
		f = jQuery(this.html).outerHeight();
		this.addCSSProperties({
			left: "50%",
			"margin-left": (c / -2) + "px",
			top: "50%",
			"margin-top": (f / -2) + "px"
		});
		return this
	};
	PMUI.extendNamespace("PMUI.ui.MessageWindow", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function(c, b) {
		a.superclass.call(this, jQuery.extend(c, {
			elementTag: "a"
		}));
		this.icon = null;
		this.action = null;
		this.parent = null;
		this.text = null;
		this.aliasButton = null;
		this.iconPosition = null;
		this.messageTooltip = null;
		this.linkStyle = null;
		this.labelVisible = null;
		this.iconVisible = null;
		this.disabled = null;
		this.dom = null;
		this.buttonType = null;
		a.prototype.init.call(this, c, b)
	};
	PMUI.inheritFrom("PMUI.core.Element", a);
	a.prototype.type = "Button";
	a.prototype.family = "Button";
	a.prototype.init = function(c, b) {
		var d;
		d = {
			iconClass: "",
			aliasButton: null,
			parent: b || null,
			height: "auto",
			width: "auto",
			handler: function() {},
			text: "[button]",
			iconPosition: "right",
			tooltip: false,
			messageTooltip: "",
			iconVisible: true,
			labelVisible: true,
			disabled: false,
			buttonType: "default"
		};
		this.dom = {};
		jQuery.extend(true, d, c);
		this.setAliasButton(d.aliasButton).setParent(d.parent).setText(d.text).setIcon(d.iconClass).setWidth(d.width).setHeight(d.height).setIconPosition(d.iconPosition).setHandler(d.handler).setTooltipMessage(d.messageTooltip).setDisabled(d.disabled).setButtonType(d.buttonType)
	};
	a.prototype.setButtonType = function(b) {
		var c = "";
		if (typeof b !== "string") {
			throw new Error("setButtonType(): the type value is not valid")
		}
		this.buttonType = b;
		this.style.removeClasses(["pmui-error", "pmui-warning", "pmui-success", "pmui-info", "pmui-link"]);
		c = "pmui-" + this.buttonType;
		switch (this.buttonType) {
		case "error":
			this.style.addClasses([c]);
			break;
		case "warning":
			this.style.addClasses([c]);
			break;
		case "success":
			this.style.addClasses([c]);
			break;
		case "info":
			this.style.addClasses([c]);
			break;
		case "link":
			this.style.addClasses([c]);
			break
		}
		return this
	};
	a.prototype.showLabel = function() {
		this.labelVisible = true;
		if (this.html) {
			this.label.style.display = ""
		}
		return this
	};
	a.prototype.setDisabled = function(b) {
		if (typeof b !== "boolean") {
			throw new Error("setDisabled(): the parameter is not valid, should be type boolean")
		}
		this.disabled = b;
		if (this.html) {
			if (this.disabled) {
				this.disable()
			} else {
				this.enable()
			}
		}
		return this
	};
	a.prototype.disable = function() {
		this.disabled = true;
		this.style.addClasses(["pmui-disabled"]);
		if (this.eventsDefined) {
			this.defineEvents()
		}
		return this
	};
	a.prototype.enable = function() {
		this.disabled = false;
		this.style.removeClasses(["pmui-disabled"]);
		if (this.eventsDefined) {
			this.defineEvents()
		}
		return this
	};
	a.prototype.click = function() {
		jQuery(this.html).trigger("click");
		return this
	};
	a.prototype.setHandler = function(b) {
		if (typeof b !== "function" && b !== null) {
			throw new Error("setHandler(): the parameter should be a function or null;")
		}
		this.handler = b;
		this.action = new PMUI.event.Action({
			actionText: this.aliasButton,
			handler: this.handler
		});
		return this
	};
	a.prototype.removeEvent = function(b) {
		jQuery(this.html).unbind(b);
		return this
	};
	a.prototype.removeEvents = function() {
		var b;
		for (b in this.events) {
			this.removeEvent(this.events[b].eventName)
		}
		this.events = {};
		return this
	};
	a.prototype.setText = function(b) {
		this.text = b;
		if (this.html && this.dom.spanText) {
			if (jQuery.trim(b) !== "") {
				this.dom.spanText.textContent = this.text
			} else {
				this.dom.spanText.inerHTML = "&nbsp;"
			}
		}
		return this
	};
	a.prototype.setIcon = function(b) {
		var c;
		if (! (typeof b == "string")) {
			throw new Error("setIcon(): the property should bo string")
		}
		this.icon = b;
		if (this.html && this.dom.icon) {
			this.dom.icon.className = this.dom.icon.className + " " + this.icon
		}
		return this
	};
	a.prototype.setAliasButton = function(b) {
		this.aliasButton = b;
		return this
	};
	a.prototype.setParent = function(b) {
		this.parent = b;
		return this
	};
	a.prototype.createHTML = function() {
		var c, b;
		if (this.html) {
			return this.html
		}
		a.superclass.prototype.createHTML.call(this);
		this.html.href = "#";
		c = PMUI.createHTMLElement("span");
		c.className = "button-label";
		this.dom.spanText = c;
		this.html.appendChild(c);
		b = PMUI.createHTMLElement("span");
		b.className = "button-icon";
		this.dom.icon = b;
		this.html.appendChild(b);
		this.setIconPosition(this.iconPosition);
		this.setTooltipMessage(this.messageTooltip);
		this.setDisabled(this.disabled);
		this.setText(this.text);
		this.setIcon(this.icon);
		this.applyStyle();
		return this.html
	};
	a.prototype.defineEvents = function() {
		var c = this,
		b;
		a.superclass.prototype.defineEvents.call(this);
		if (this.html) {
			if (this.disabled) {
				this.addEvent("click").listen(this.html,
				function(d) {
					d.preventDefault();
					d.stopPropagation()
				})
			} else {
				this.addEvent("click").listen(this.html,
				function(d) {
					d.preventDefault();
					d.stopPropagation();
					this.focus();
					if (typeof c.handler === "function") {
						c.handler(c)
					}
				})
			}
		}
		return this
	};
	a.prototype.setHeight = function(b) {
		if (typeof b === "number") {
			this.height = b + "px"
		} else {
			if (/^\d+(\.\d+)?px$/.test(b)) {
				this.height = b
			} else {
				if (/^\d+(\.\d+)?%$/.test(b)) {
					this.height = b
				} else {
					if (/^\d+(\.\d+)?em$/.test(b)) {
						this.height = b
					} else {
						if (b === "auto" || b === "inherit") {
							this.height = b
						} else {
							throw new Error("setHeight: height param is not a number")
						}
					}
				}
			}
		}
		if (this.height !== "auto") {
			this.style.addProperties({
				"line-height": parseInt(this.height, 10) + "px"
			})
		} else {
			this.style.addProperties({
				"line-height": "normal"
			})
		}
		this.applyStyle();
		return this
	};
	a.prototype.setIconPosition = function(b) {
		if (b == "right" || b == "left" || b == "top" || b == "bottom") {
			this.iconPosition = b;
			if (this.html) {
				if (this.iconPosition == "left" || this.iconPosition == "top") {
					$(this.html).prepend(this.dom.icon);
					if (this.iconPosition == "left") {
						this.dom.icon.style.display = "inline-block";
						this.dom.icon.style.marginLeft = ""
					} else {
						this.dom.icon.style.display = "block";
						this.dom.icon.style.marginLeft = "50%"
					}
				} else {
					$(this.html).append(this.dom.icon);
					if (this.iconPosition == "right") {
						this.dom.icon.style.display = "inline-block";
						this.dom.icon.style.marginLeft = ""
					} else {
						this.dom.icon.style.display = "block";
						this.dom.icon.style.marginLeft = "50%"
					}
				}
			}
		} else {
			throw new Error("setIconPosition(): the parameter is not valid, should be 'right','left', 'top' or 'bottom'")
		}
		return this
	};
	a.prototype.setTooltipMessage = function(b) {
		if (typeof b == "string") {
			this.messageTooltip = b;
			if (this.html) {
				this.html.setAttribute("title", b)
			}
		}
		return this
	};
	PMUI.extendNamespace("PMUI.ui.Button", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b);
		this.icon = null;
		this.messageArea = null;
		this.message = null;
		this.category = null;
		this.displayMode = null;
		this.mode = null;
		this.tooltipPosition = null;
		this.tooltipClass = null;
		this.showEffect = null;
		this.hideEffect = null;
		this.onOpen = null;
		this.onClose = null;
		this.track = null;
		a.prototype.init.call(this, b)
	};
	PMUI.inheritFrom("PMUI.core.Element", a);
	a.prototype.type = "PMUITooltipMessage";
	a.prototype.family = "PMUITooltipMessage";
	a.prototype.init = function(b) {
		var c = {
			message: "",
			category: "help",
			displayMode: "inline",
			mode: "tooltip",
			tooltipClass: "pmui-tooltip-message",
			tooltipPosition: {
				my: "left top+15",
				at: "left bottom",
				collision: "flipfit"
			},
			showEffect: null,
			hideEffect: null,
			onOpen: null,
			onClose: null,
			track: false
		};
		$.extend(true, c, b);
		this.onClose = c.onClose;
		this.onOpen = c.onOpen;
		this.setTooltipClass(c.tooltipClass).setTooltipPosition(c.tooltipPosition).setShowEffect(c.showEffect).setHideEffect(c.hideEffect).setTrack(c.track).setMessage(c.message).setCategory(c.category).setDisplayMode(c.displayMode).setMode(c.mode)
	};
	a.prototype.setTooltipClass = function(b) {
		this.tooltipClass = b;
		return this
	};
	a.prototype.setTrack = function(b) {
		this.track = !!b;
		if (this.html) {
			this.setMode(this.mode)
		}
		return this
	};
	a.prototype.setHideEffect = function(b) {
		this.hideEffect = b;
		if (this.html) {
			this.setMode(this.mode)
		}
		return this
	};
	a.prototype.setShowEffect = function(b) {
		this.showEffect = b;
		if (this.html) {
			this.setMode(this.mode)
		}
		return this
	};
	a.prototype.setTooltipPosition = function(b) {
		this.tooltipPosition = b;
		if (this.html) {
			this.setMode(this.mode)
		}
		return this
	};
	a.prototype.setMessage = function(b) {
		if (typeof b === "string") {
			this.message = b;
			if (this.html) {
				if (this.messageArea) {
					this.messageArea.getHTML().textContent = b
				}
				if (this.mode === "tooltip") {
					this.icon.html.title = b
				} else {
					this.icon.html.title = ""
				}
			}
		} else {
			throw new Error("setMessage() method only accepts string values.")
		}
		return this
	};
	a.prototype.setCategory = function(b) {
		var c = ["help", "info", "error", "warning"];
		if (typeof b === "string" && c.indexOf(b) > -1) {
			this.category = b;
			if (this.icon && this.messageArea) {
				this.icon.style.removeAllClasses();
				this.icon.style.addClasses(["pmui-icon", "pmui-icon-" + b]);
				this.messageArea.className = "pmui-tooltip-message pmui-tooltip-" + b + "-message"
			}
			if (this.html) {
				if (this.category === "error") {
					this.style.addClasses(["pmui-tooltip-category-error"])
				} else {
					this.style.removeClasses(["pmui-tooltip-category-error"])
				}
			}
		} else {
			throw new Error('setCategory() method only accepts one of the following values: "help", "info", "warning", "info".')
		}
		return this
	};
	a.prototype.setDisplayMode = function(b) {
		if (b === "block" || b === "inline") {
			this.displayMode = b;
			if (this.html) {
				this.style.addProperties({
					display: b
				})
			}
		} else {
			throw new Error('setDisplayMode() method only accepts "inline" or "block" values')
		}
		return this
	};
	a.prototype.setMode = function(c) {
		if (c === "tooltip" || c === "normal") {
			this.mode = c;
			if (this.html) {
				$(this.html).addClass("pmui-tooltip-mode-" + c);
				if (c === "tooltip") {
					this.messageArea.setVisible(false);
					this.icon.html.title = this.message;
					$(this.icon.html).tooltip({
						tooltipClass: this.tooltipClass,
						position: this.tooltipPosition,
						show: this.showEffect,
						hide: this.hideEffect,
						open: this.onOpen,
						track: this.track,
						close: this.onClose
					})
				} else {
					try {
						$(this.icon.html).tooltip("destroy")
					} catch(b) {}
					this.icon.html.title = "";
					this.messageArea.setVisible(true)
				}
			}
		} else {
			throw new Error('setMode() method only accepts "tooltip" or "normal" values')
		}
		return this
	};
	a.prototype.createHTML = function() {
		var b, d, c;
		if (this.html) {
			return this.html
		}
		b = PMUI.createHTMLElement("span");
		b.className = "pmui-tooltip";
		c = new PMUI.core.Element({
			elementTag: "span",
			width: 18,
			height: 18,
			style: {
				cssClasses: ["pmui-icon"],
				cssProperties: {
					display: "inline-block",
					"vertical-align": "middle"
				}
			}
		});
		d = new PMUI.core.Element({
			elementTag: "span",
			style: {
				cssClasses: ["pmui-tooltip-message"]
			}
		});
		b.appendChild(c.getHTML());
		b.appendChild(d.getHTML());
		this.icon = c;
		this.messageArea = d;
		this.html = b;
		this.applyStyle();
		this.setCategory(this.category);
		this.setMessage(this.message);
		this.setMode(this.mode);
		return this.html
	};
	PMUI.extendNamespace("PMUI.ui.TooltipMessage", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b);
		this.message = null;
		this.duration = null;
		this.appendTo = null;
		this.severity = null;
		a.prototype.init.call(this, b)
	};
	PMUI.inheritFrom("PMUI.core.Element", a);
	a.prototype.type = "FlashMessage";
	a.prototype.init = function(b) {
		var c = {
			message: "",
			duration: 3000,
			appendTo: document.body,
			display: "inline-block",
			positionMode: "fixed",
			severity: "info"
		};
		jQuery.extend(true, c, b);
		this.setMessage(c.message).setDuration(c.duration).setAppendTo(c.appendTo).setPositionMode(c.positionMode).setDisplay(c.display).setSeverity(c.severity)
	};
	a.prototype.setSeverity = function(b) {
		if (! (b === "success" || b === "error" || b === "info")) {
			throw new Error('setSeverity(): the parameter must be "success" or "error" or "info"')
		}
		this.severity = b;
		this.style.removeClasses(["pmui-info", "pmui-error", "pmui-success"]).addClasses(["pmui-" + b]);
		return this
	};
	a.prototype.setAppendTo = function(b) {
		if (! (PMUI.isHTMLElement(b) || b instanceof PMUI.core.Element)) {
			throw new Error("setAppendTo(): The parameter must be a HTML element or an instance of PMUI.ui.Element.")
		}
		this.appendTo = b;
		return this
	};
	a.prototype.setDuration = function(b) {
		if (typeof b !== "number") {
			throw new Error("setDuration(): The parameter must be a number.")
		}
		this.duration = b;
		return this
	};
	a.prototype.setMessage = function(e) {
		var d, b, c;
		if (typeof e !== "string" && !jQuery.isArray(e)) {
			throw new Error("setMessage(): The parameter must be a message.")
		}
		this.message = (typeof e === "string") ? jQuery.trim(e) : e;
		if (this.html) {
			jQuery(this.html).empty();
			if (typeof e === "string") {
				this.html.textContent = e
			} else {
				d = PMUI.createHTMLElement("ul");
				d.className = "pmui-flashmessage-list";
				d.style.listStyleType = "none";
				for (c = 0; c < e.length; c++) {
					b = PMUI.createHTMLElement("li");
					b.textContent = e[c];
					d.appendChild(b)
				}
				this.html.appendChild(d)
			}
		}
		return this
	};
	a.prototype.show = function() {
		var c = this.appendTo,
		d = this.html,
		f = 50,
		b, e;
		if (!PMUI.isHTMLElement(c)) {
			c = c.html
		}
		if (c) {
			if (!d) {
				d = this.getHTML()
			}
			jQuery(d).fadeTo(1, 0).get(0).style.top = f + "px";
			document.body.appendChild(d);
			b = jQuery(d).outerWidth();
			c.appendChild(d);
			this.style.addProperties({
				left: "50%",
				"margin-left": b / -2
			});
			jQuery(d).finish().css({
				top: "50px"
			}).fadeTo(1, 0).animate({
				top: "-=" + f,
				opacity: 1
			},
			400, "swing").delay(this.duration).animate({
				top: "+=" + f,
				opacity: 0,
				zIndex: "0"
			})
		}
		return this
	};
	a.prototype.createHTML = function() {
		a.superclass.prototype.createHTML.call(this);
		this.setMessage(this.message);
		return this.html
	};
	PMUI.extendNamespace("PMUI.ui.FlashMessage", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function(b) {
		b = jQuery.extend(true, b, {
			elementTag: "ul",
			positionMode: "absolute"
		});
		a.superclass.call(this, b);
		this.targetElement = null;
		this.parent = null;
		this.onShow = null;
		this.onHide = null;
		this.displayed = null;
		this.factory = new PMUI.menu.MenuItemFactory();
		this.items = new PMUI.util.ArrayList();
		this.onOutsideClickHandler = null;
		a.prototype.init.call(this, b)
	};
	PMUI.inheritFrom("PMUI.core.Element", a);
	a.prototype.type = "Menu";
	a.prototype.init = function(b) {
		var c = {
			targetElement: null,
			parent: null,
			onShow: null,
			onHide: null,
			items: []
		};
		jQuery.extend(true, c, b);
		this.onShow = c.onShow;
		this.onHide = c.onHide;
		this.setParent(c.parent).setItems(c.items).setTargetElement(c.targetElement).setOutsideClickHandler()
	};
	a.prototype.setOutsideClickHandler = function() {
		var b = this;
		this.onOutsideClickHandler = function(c) {
			if (!jQuery(c.currentTarget).parents("#" + b.id).length) {
				b.hide()
			}
		};
		return this
	};
	a.prototype.setTargetElement = function(d) {
		var c, b = (this.targetElement && this.targetElement.html) || document.body;
		$(b).removeClass("pmui-contextmenu-target");
		if (d instanceof PMUI.core.Element || null) {
			c = this.getRootMenu();
			if (c.targetElement) {
				if (c.targetElement.menu === c) {
					c.targetElement.menu = null
				}
			}
			c.targetElement = d
		}
		return this
	};
	a.prototype.getTargetElement = function() {
		var b = this.getRootMenu();
		return b.targetElement
	};
	a.prototype.addItem = function(c) {
		var b = this.factory.make(c);
		if (b) {
			b.setParent(this);
			this.items.insert(b);
			if (this.html) {
				this.html.appendChild(b.getHTML())
			}
		}
		return this
	};
	a.prototype.removeItem = function(b) {
		var c;
		if (typeof b === "string") {
			c = this.items.find("id", b)
		} else {
			if (typeof b === "number") {
				c = this.items.get(b)
			} else {
				if (b instanceof PMUI.item.MenuItem && this.items.contains(b)) {
					c = b
				}
			}
		}
		if (c) {
			this.items.remove(c);
			jQuery(c.html).detach()
		}
		return this
	};
	a.prototype.clearItems = function() {
		var b = 0;
		while (this.items.getSize()) {
			this.removeItem(0)
		}
		return this
	};
	a.prototype.setItems = function(b) {
		var c;
		if (!jQuery.isArray(b)) {
			throw new Error("setItems(): The parameter must be an array.")
		}
		this.clearItems();
		for (c = 0; c < b.length; c++) {
			this.addItem(b[c])
		}
		return this
	};
	a.prototype.getItems = function() {
		return this.items.asArray().slice(0)
	};
	a.prototype.setParent = function(b) {
		if (! (b === null || b instanceof PMUI.menu.MenuItem)) {
			throw new Error("setParent(): The parameter must be an instance of PMUI.item.MenuItem or null.")
		}
		this.parent = b;
		return this
	};
	a.prototype.defineEventListeners = function() {
		var b = this;
		this.removeEvents();
		this.addEvent("contextmenu").listen(this.html,
		function(c) {
			c.stopPropagation();
			c.preventDefault()
		});
		this.addEvent("click").listen(this.html,
		function(c) {
			c.stopPropagation()
		});
		this.addEvent("mousedown").listen(this.html,
		function(c) {
			c.stopPropagation()
		});
		return this
	};
	a.prototype.createHTML = function() {
		if (this.html) {
			return this.html
		}
		a.superclass.prototype.createHTML.call(this);
		this.setItems(this.items.asArray().slice(0));
		this.defineEventListeners();
		return this.html
	};
	a.prototype.isRoot = function() {
		return ! this.parent
	};
	a.prototype.getRootMenu = function() {
		if (this.isRoot()) {
			return this
		} else {
			return this.parent.parent.getRootMenu()
		}
	};
	a.prototype.show = function(b, f) {
		var d = this.getRootMenu(),
		c = (this.targetElement && this.targetElement.html) || document.body,
		e = $(c).zIndex();
		b = b || 0;
		f = f || 0;
		d.setPosition({
			x: b,
			y: f
		});
		PMUI.removeCurrentMenu();
		d.setZOrder(e + 1);
		$(c).addClass("pmui-contextmenu-target");
		document.body.appendChild(d.getHTML());
		this.addEvent("mousedown", "clickOutside").listen(document, this.onOutsideClickHandler);
		this.displayed = true;
		PMUI.currentContextMenu = this;
		if (typeof this.onShow === "function") {
			this.onShow(this)
		}
		if (document.documentElement.clientHeight - f < jQuery(this.html).outerHeight()) {
			this.html.style.top = f - jQuery(this.html).outerHeight() + "px"
		}
		return this
	};
	a.prototype.hide = function() {
		var c = this.getRootMenu(),
		b = (this.targetElement && this.targetElement.html) || document.body;
		this.removeEvent("clickOutside");
		$(b).removeClass("pmui-contextmenu-target");
		jQuery(c.html).detach();
		c.displayed = false;
		PMUI.currentContextMenu = null;
		if (typeof c.onHide === "function") {
			c.onHide(c)
		}
		return this
	};
	a.prototype.setContextMenu = function() {
		return this
	};
	PMUI.extendNamespace("PMUI.menu.Menu", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b);
		this.dom = {};
		this.parent = null;
		a.prototype.init.call(this, b)
	};
	PMUI.inheritFrom("PMUI.core.Element", a);
	a.prototype.type = "MenuItem";
	a.prototype.init = function(b) {
		var c = {
			parent: null
		};
		jQuery.extend(true, c, b);
		this.setParent(c.parent)
	};
	a.prototype.setParent = function(b) {
		if (! (b === null || b instanceof PMUI.menu.Menu)) {
			throw new Error("setParent(): The parameter must be an instance of PMUI.ui.Menu or null.")
		}
		this.parent = b;
		return this
	};
	a.prototype.getParent = function() {
		return this.parent
	};
	a.prototype.getRootMenu = function() {
		var b = this.parent;
		if (this.parent) {
			return this.parent.getRootMenu()
		}
		return b
	};
	a.prototype.isLeaf = function() {
		throw new Error("isLeaf() is being called from an abstract class.")
	};
	a.prototype.getMenu = function() {
		return this.parent
	};
	a.prototype.setContextMenu = function() {
		return this
	};
	a.prototype.getMenuTargetElement = function() {
		var b = this.getRootMenu();
		if (b) {
			return b.getTargetElement()
		}
		return b
	};
	a.prototype.createHTML = function() {
		if (this.html) {
			return this.html
		}
		a.superclass.prototype.createHTML.call(this);
		return this.html
	};
	PMUI.extendNamespace("PMUI.menu.MenuItem", a)
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b);
		this.onClick = null;
		this.text = null;
		this.hideOnClick = null;
		this.disabled = null;
		a.prototype.init.call(this, b)
	};
	PMUI.inheritFrom("PMUI.menu.MenuItem", a);
	a.prototype.type = "MenuOption";
	a.prototype.init = function(b) {
		var c = {
			onClick: null,
			elementTag: "li",
			text: "[option]",
			hideOnClick: true,
			disabled: false
		};
		jQuery.extend(true, c, b);
		this.setElementTag(c.elementTag).setText(c.text).setOnClickHandler(c.onClick).hideOnClick = !!c.hideOnClick;
		if (c.disabled) {
			this.disable()
		} else {
			this.enable()
		}
	};
	a.prototype.enable = function() {
		this.disabled = false;
		this.style.removeClasses(["pmui-disabled"]);
		return this
	};
	a.prototype.disable = function() {
		this.disabled = true;
		this.style.addClasses(["pmui-disabled"]);
		return this
	};
	a.prototype.setText = function(b) {
		if (typeof b !== "string") {
			throw new Error("setText(): the parameter must be a srting.")
		}
		this.text = b;
		if (this.dom.textContainer) {
			this.dom.textContainer.textContent = b
		}
		return this
	};
	a.prototype.setOnClickHandler = function(b) {
		if (! (b === null || typeof b === "function")) {
			throw new Error("setOnClickHandler(): The parameter must be a function or null.")
		}
		this.onClick = b;
		return this
	};
	a.prototype.onClickHandler = function() {
		var b = this;
		return function(c) {
			c.preventDefault();
			c.stopPropagation();
			if (!b.disabled) {
				if (typeof b.onClick === "function") {
					b.onClick(b)
				}
				if (b.hideOnClick) {
					b.parent.hide()
				}
			}
		}
	};
	a.prototype.remove = function() {
		this.parent.removeItem(this);
		return this
	};
	a.prototype.defineEventListeners = function() {
		this.removeEvents();
		this.addEvent("click").listen(this.dom.title, this.onClickHandler());
		return this
	};
	a.prototype.createHTML = function() {
		var c, d, b;
		if (this.html) {
			return this.html
		}
		a.superclass.prototype.createHTML.call(this);
		c = PMUI.createHTMLElement("a");
		c.href = "#";
		c.className = "pmui-menuoption-title";
		d = PMUI.createHTMLElement("span");
		d.className = "pmui-menuoption-text";
		b = PMUI.createHTMLElement("i");
		b.className = "pmui-menuoption-text-icon";
		this.dom.title = c;
		this.dom.textContainer = d;
		this.dom.iconContainer = b;
		c.appendChild(b);
		c.appendChild(d);
		this.html.appendChild(c);
		this.setText(this.text);
		this.defineEventListeners();
		return this.html
	};
	PMUI.extendNamespace("PMUI.menu.MenuOption", a)
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b);
		this.childMenu = null;
		a.prototype.init.call(this, b)
	};
	PMUI.inheritFrom("PMUI.menu.MenuOption", a);
	a.prototype.init = function(b) {
		var c = {
			items: []
		};
		jQuery.extend(true, c, b);
		this.childMenu = new PMUI.menu.Menu({
			positionMode: "absolute",
			parent: this
		});
		this.setItems(c.items)
	};
	a.prototype.setItems = function(b) {
		this.childMenu.setItems(b);
		if (this.childMenu.getItems().length) {
			this.style.addClasses(["pmui-father"])
		}
		return this
	};
	a.prototype.getItems = function() {
		return this.childMenu.getItems()
	};
	a.prototype.onClickHandler = function() {
		var b = this;
		return function(c) {
			c.preventDefault();
			c.stopPropagation();
			if (!b.disabled) {
				if (typeof b.onClick === "function") {
					b.onClick(b)
				}
				if (b.hideOnClick && b.childMenu.getItems().length === 0) {
					b.parent.hide()
				}
			}
		}
	};
	a.prototype.createHTML = function() {
		if (this.html) {
			return this.html
		}
		a.superclass.prototype.createHTML.call(this);
		this.html.appendChild(this.childMenu.getHTML());
		this.setItems(this.getItems());
		return this.html
	};
	PMUI.extendNamespace("PMUI.menu.MenuRegularOption", a)
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, jQuery.extend(true, b, {
			elementTag: "div"
		}));
		a.prototype.init.call(this, b)
	};
	PMUI.inheritFrom("PMUI.menu.MenuItem", a);
	a.prototype.type = "MenuSeparatorItem";
	a.prototype.isLeaf = function() {
		return true
	};
	PMUI.extendNamespace("PMUI.menu.MenuSeparatorItem", a)
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b);
		a.prototype.init.call(this, b)
	};
	PMUI.inheritFrom("PMUI.util.Factory", a);
	a.prototype.type = "MenuItemFactory";
	a.prototype.init = function(b) {
		var c = {
			products: {
				menuRegularOption: PMUI.menu.MenuRegularOption,
				menuSeparatorItem: PMUI.menu.MenuSeparatorItem
			},
			defaultProduct: "menuRegularOption"
		};
		this.setDefaultProduct(c.defaultProduct).setProducts(c.products)
	};
	PMUI.extendNamespace("PMUI.menu.MenuItemFactory", a)
} ()); (function() {
	var a = function(b) {
		this.element = null;
		this.handler = null;
		this.selector = null;
		this.eventName = null;
		a.prototype.init.call(this, b)
	};
	a.prototype.type = "Event";
	a.prototype.family = "Event";
	a.prototype.init = function(b) {
		var c = {
			handler: function(d) {}
		};
		jQuery.extend(true, c, b);
		this.setHandler(c.handler);
		this.setElement(c.element).setEventName(c.name);
		return this
	};
	a.prototype.setElement = function(b) {
		this.element = b;
		return this
	};
	a.prototype.setHandler = function(b) {
		if (typeof b === "function") {
			this.handler = b
		}
		return this
	};
	a.prototype.setSelector = function(b) {
		if (typeof b === "string") {
			this.selector = b
		}
		return this
	};
	a.prototype.setEventName = function(b) {
		this.eventName = b;
		return this
	};
	a.prototype.listenWithDelegation = function(c, b, d) {
		var e;
		if (d instanceof PMUI.event.Action) {
			e = d.handler
		} else {
			e = d
		}
		$(c).on(this.eventName, b, d);
		this.setHandler(d).setElement(c).setSelector(b);
		return this
	};
	a.prototype.listen = function(b, c) {
		var d;
		d = c;
		jQuery(b).on(this.eventName, d);
		this.setHandler(d).setElement(b);
		return this
	};
	a.prototype.unlisten = function() {
		if (this.selector) {
			jQuery(this.element).off(this.eventName, this.selector, this.handler)
		} else {
			jQuery(this.element).off(this.eventName, this.handler)
		}
		return this
	};
	PMUI.extendNamespace("PMUI.event.Event", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function() {
		a.superclass.call(this);
		a.prototype.init.call(this)
	};
	PMUI.inheritFrom("PMUI.util.Factory", a);
	a.prototype.type = "EventFactory";
	a.prototype.eventTypes = {
		click: "mouse",
		mousedown: "mouse",
		mouseup: "mouse",
		mousemove: "mouse",
		mouseover: "mouse",
		mouseout: "mouse",
		mouseenter: "mouse",
		mouseleave: "mouse",
		dblclick: "mouse",
		drag: "mouse",
		drop: "mouse",
		resize: "mouse",
		rightclick: "mouse",
		contextmenu: "mouse",
		keyup: "keyboard",
		keydown: "keyboard",
		keypress: "keyboard"
	};
	a.prototype.init = function() {
		var b = {
			products: {
				mouse: PMUI.event.MouseEvent,
				keyboard: PMUI.event.KeyboardEvent,
				event: PMUI.event.Event
			},
			defaultProduct: "event"
		};
		this.setProducts(b.products).setDefaultProduct(b.defaultProduct)
	};
	a.prototype.make = function(c) {
		var d, b;
		if (this.isValidClass(c)) {
			d = c
		} else {
			b = this.eventTypes[c] || "event";
			d = this.build(b, {
				name: c
			})
		}
		return d
	};
	PMUI.extendNamespace("PMUI.event.EventFactory", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b)
	};
	PMUI.inheritFrom("PMUI.event.Event", a);
	a.prototype.type = "MouseEvent";
	PMUI.extendNamespace("PMUI.event.MouseEvent", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b)
	};
	PMUI.inheritFrom("PMUI.event.Event", a);
	a.prototype.type = "KeyboardEvent";
	PMUI.extendNamespace("PMUI.event.KeyboardEvent", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b);
		this.canvas = null;
		this.oldWidth = 0;
		this.oldHeight = 0;
		this.oldX = 0;
		this.oldY = 0;
		this.absoluteX = 0;
		this.absoluteY = 0;
		this.oldAbsoluteX = 0;
		this.oldAbsoluteY = 0;
		this.zoomX = 0;
		this.zoomY = 0;
		this.zoomWidth = 0;
		this.zoomHeight = 0;
		this.savedOptions = {};
		this.drag = null;
		a.prototype.init.call(this, b)
	};
	PMUI.inheritFrom("PMUI.core.Element", a);
	a.prototype.type = "Core";
	a.prototype.paint = function() {};
	a.prototype.init = function(b) {
		var c = {
			zOrder: 1,
			visible: true,
			drag: "nodrag",
			positionMode: "absolute"
		};
		$.extend(true, c, b);
		this.setZOrder(c.zOrder).setVisible(c.visible).setCanvas(c.canvas)
	};
	a.prototype.applyStyle = function() {
		if (this.html) {
			this.style.applyStyle();
			this.style.addProperties({
				display: this.visible ? this.display: "none",
				position: "absolute",
				left: this.zoomX,
				top: this.zoomY,
				width: this.zoomWidth,
				height: this.zoomHeight,
				zIndex: this.zOrder
			})
		}
		return this
	};
	a.prototype.createHTML = function() {
		var b;
		if (!this.html) {
			a.superclass.prototype.createHTML.call(this);
			this.defineEvents()
		}
		return this.html
	};
	a.prototype.setPosition = function(c, b) {
		this.setX(c);
		this.setY(b);
		return this
	};
	a.prototype.setDimension = function(c, b) {
		this.setWidth(c);
		this.setHeight(b);
		return this
	};
	a.prototype.setX = function(b) {
		if (typeof b === "number") {
			b = Math.round(b);
			this.x = b;
			if (this.canvas) {
				this.zoomX = this.x * this.canvas.zoomFactor
			} else {
				this.zoomX = this.x
			}
			this.setAbsoluteX();
			if (this.html) {
				this.style.addProperties({
					left: this.zoomX
				})
			}
		} else {
			throw new Error("setX :  parameter newX is not a number")
		}
		return this
	};
	a.prototype.setY = function(b) {
		if (typeof b === "number") {
			b = Math.round(b);
			this.y = b;
			if (this.canvas) {
				this.zoomY = this.y * this.canvas.zoomFactor
			} else {
				this.zoomY = this.y
			}
			this.setAbsoluteY();
			if (this.html) {
				this.style.addProperties({
					top: this.zoomY
				})
			}
		}
		return this
	};
	a.prototype.setAbsoluteX = function() {
		if (!this.parent) {
			this.absoluteX = this.zoomX
		} else {
			this.absoluteX = this.zoomX + this.parent.absoluteX
		}
		return this
	};
	a.prototype.setOldX = function(b) {
		if (typeof b === "number") {
			this.oldX = b
		}
		return this
	};
	a.prototype.setOldY = function(b) {
		if (typeof b === "number") {
			this.oldY = b
		}
		return this
	};
	a.prototype.setAbsoluteY = function() {
		if (!this.parent) {
			this.absoluteY = this.zoomY
		} else {
			this.absoluteY = this.zoomY + this.parent.absoluteY
		}
		return this
	};
	a.prototype.setWidth = function(c) {
		var b;
		if (typeof c === "number" && c >= 0) {
			this.width = c;
			if (this.canvas) {
				this.zoomWidth = this.width * this.canvas.zoomFactor;
				b = Math.floor(this.zoomWidth);
				this.zoomWidth = (this.zoomWidth % 2 === 0) ? b + 1 : b
			} else {
				this.zoomWidth = this.width
			}
			if (this.html) {
				this.style.addProperties({
					width: this.zoomWidth
				})
			}
		}
		return this
	};
	a.prototype.setHeight = function(b) {
		var c;
		if (typeof b === "number" && b >= 0) {
			this.height = b;
			if (this.canvas) {
				this.zoomHeight = this.height * this.canvas.zoomFactor;
				c = Math.floor(this.zoomHeight);
				this.zoomHeight = (this.zoomHeight % 2 === 0) ? c + 1 : c
			} else {
				this.zoomHeight = this.height
			}
			if (this.html) {
				this.style.addProperties({
					height: this.zoomHeight
				})
			}
		}
		return this
	};
	a.prototype.setZOrder = function(b) {
		if (typeof b === "number" && b > 0) {
			this.zOrder = b;
			if (this.html) {
				this.style.addProperties({
					zIndex: this.zOrder
				})
			}
		}
		return this
	};
	a.prototype.setCanvas = function(b) {
		if (b && b.family === "Canvas") {
			this.canvas = b
		}
		return this
	};
	a.prototype.setVisible = function(b) {
		if (typeof b === "boolean") {
			this.visible = b;
			if (this.html) {
				if (b) {
					this.style.addProperties({
						display: "inline"
					})
				} else {
					this.style.addProperties({
						display: "none"
					})
				}
			}
		}
		return this
	};
	a.prototype.setID = function(b) {
		this.id = b;
		if (this.html) {
			this.html.id = this.id
		}
		return this
	};
	a.prototype.getCanvas = function() {
		return this.canvas
	};
	a.prototype.getAbsoluteX = function() {
		return this.absoluteX
	};
	a.prototype.getAbsoluteY = function() {
		return this.absoluteY
	};
	a.prototype.getStyle = function() {
		return this.style
	};
	a.prototype.getZoomX = function() {
		return this.zoomX
	};
	a.prototype.getZoomY = function() {
		return this.zoomY
	};
	a.prototype.getZoomWidth = function() {
		return this.zoomWidth
	};
	a.prototype.getZoomHeight = function() {
		return this.zoomHeight
	};
	a.prototype.getOldX = function() {
		return this.oldX
	};
	a.prototype.getOldY = function() {
		return this.oldY
	};
	a.prototype.getOldWidth = function() {
		return this.oldWidth
	};
	a.prototype.getOldHeight = function() {
		return this.oldHeight
	};
	a.prototype.stringify = function() {
		return {
			id: this.getID(),
			x: this.getX(),
			y: this.getY(),
			width: this.getWidth(),
			height: this.getHeight(),
			type: this.type,
			style: this.getStyle().stringify(),
			drag: this.savedOptions.drag
		}
	};
	a.prototype.setDragBehavior = function(c) {
		var b = new PMUI.behavior.BehaviorFactory({
			products: {
				customshapedrag: PMUI.behavior.CustomShapeDragBehavior,
				regulardrag: PMUI.behavior.RegularDragBehavior,
				connectiondrag: PMUI.behavior.ConnectionDragBehavior,
				connection: PMUI.behavior.ConnectionDragBehavior,
				nodrag: PMUI.behavior.NoDragBehavior
			},
			defaultProduct: "nodrag"
		});
		this.drag = b.make(c);
		if (this.html && this.drag) {
			this.drag.attachDragBehavior(this)
		}
		return this
	};
	a.prototype.relativePoint = function(d) {
		var c, b;
		c = d.pageX - this.absoluteX;
		b = d.pageY - this.absoluteY;
		if (this.canvas) {
			c += this.canvas.getLeftScroll();
			b += this.canvas.getTopScroll();
			c = Math.floor(c / this.canvas.zoomFactor);
			b = Math.floor(b / this.canvas.zoomFactor)
		}
		return {
			x: c,
			y: b
		}
	};
	a.prototype.parseJSON = function(b) {
		this.initObject(b)
	};
	a.prototype.TOP = 0;
	a.prototype.RIGHT = 1;
	a.prototype.BOTTOM = 2;
	a.prototype.LEFT = 3;
	a.prototype.HORIZONTAL = 0;
	a.prototype.VERTICAL = 1;
	a.prototype.ZOOMSCALES = 5;
	PMUI.extendNamespace("PMUI.draw.Core", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b);
		this.containerBehavior = null;
		this.dropBehavior = null;
		this.children = null;
		a.prototype.init.call(this, b)
	};
	PMUI.inheritFrom("PMUI.draw.Core", a);
	a.prototype.type = "BehavioralElement";
	a.prototype.init = function(b) {
		var c = {
			drop: "nodrop",
			container: "nocontainer"
		};
		$.extend(true, c, b);
		var c = {
			drop: {
				type: "nodrop",
				selectors: [],
				overwrite: false
			},
			container: "nocontainer"
		};
		$.extend(true, c, b);
		this.setDropBehavior(c.drop.type, c.drop.selectors, c.drop.overwrite);
		this.setContainerBehavior(c.container);
		this.children = new PMUI.util.ArrayList()
	};
	a.prototype.setDropBehavior = function(d, c, b) {
		this.dropBehavior = this.dropBehaviorFactory(d, c);
		this.dropBehavior.setSelectors(c, b);
		if (this.html && this.dropBehavior) {
			this.dropBehavior.attachDropBehavior(this);
			$.extend(true, this.savedOptions.drop, {
				type: d,
				overwrite: b
			});
			if (c && c.hasOwnProperty("length")) {
				this.dropBehavior.updateSelectors(this, c, b);
				$.extend(true, this.savedOptions.drop, {
					selectors: c
				})
			}
		}
		return this
	};
	a.prototype.dropBehaviorFactory = function(c, b) {
		if (c === "nodrop") {
			if (!this.noDropBehavior) {
				this.noDropBehavior = new PMUI.behavior.NoDropBehavior(b)
			}
			return this.noDropBehavior
		}
		if (c === "container") {
			if (!this.containerDropBehavior) {
				this.containerDropBehavior = new PMUI.behavior.ContainerDropBehavior(b)
			}
			return this.containerDropBehavior
		}
		if (c === "connection") {
			if (!this.connectionDropBehavior) {
				this.connectionDropBehavior = new PMUI.behavior.ConnectionDropBehavior(b)
			}
			return this.connectionDropBehavior
		}
		if (c === "connectioncontainer") {
			if (!this.connectionContainerDropBehavior) {
				this.connectionContainerDropBehavior = new PMUI.behavior.ConnectionContainerDropBehavior(b)
			}
			return this.connectionContainerDropBehavior
		}
	};
	a.prototype.setContainerBehavior = function(b) {
		$.extend(true, this.savedOptions, {
			container: b
		});
		this.containerBehavior = this.containerBehaviorFactory(b);
		return this
	};
	a.prototype.containerBehaviorFactory = function(b) {
		if (b === "regular") {
			if (!this.regularContainerBehavior) {
				this.regularContainerBehavior = new PMUI.behavior.RegularContainerBehavior()
			}
			return this.regularContainerBehavior
		}
		if (!this.noContainerBehavior) {
			this.noContainerBehavior = new PMUI.behavior.NoContainerBehavior()
		}
		return this.noContainerBehavior
	};
	a.prototype.updateChildrenPosition = function(e, c) {
		var h = this.getChildren(),
		j,
		g,
		f = [],
		b = [],
		d = [];
		for (g = 0; g < h.getSize(); g += 1) {
			j = h.get(g);
			if ((e !== 0 || c !== 0) && !this.canvas.currentSelection.contains(j)) {
				f.push(j);
				b.push({
					x: j.x,
					y: j.y
				});
				d.push({
					x: j.x + e,
					y: j.y + c
				})
			}
			j.setPosition(j.x + e, j.y + c)
		}
		if (f.length > 0) {
			this.canvas.triggerPositionChangeEvent(f, b, d)
		}
		return this
	};
	a.prototype.isContainer = function() {
		return this.containerBehavior && this.containerBehavior.type !== "NoContainerBehavior"
	};
	a.prototype.addElement = function(c, b, e, d) {
		this.containerBehavior.addToContainer(this, c, b, e, d);
		return this
	};
	a.prototype.removeElement = function(b) {
		this.containerBehavior.removeFromContainer(b);
		return this
	};
	a.prototype.swapElementContainer = function(c, e, b, h, d) {
		var g = !b ? c.getX() : b,
		f = !h ? c.getY() : h;
		c.changedContainer = true;
		this.removeElement(c);
		e.addElement(c, g, f, d);
		return this
	};
	a.prototype.getChildren = function() {
		return this.children
	};
	a.prototype.updateDimensions = function(b) {
		if (this.family !== "Canvas") {
			this.updateSize(b);
			this.refreshConnections();
			PMUI.behavior.ResizeBehavior.prototype.updateResizeMinimums(this);
			a.prototype.updateDimensions.call(this.parent, b)
		}
		return this
	};
	a.prototype.setDropAcceptedSelectors = function(c, b) {
		if (c && c.hasOwnProperty("length")) {
			this.drop.updateSelectors(this, c, b)
		}
		return this
	};
	a.prototype.updateBehaviors = function() {
		if (this.dropBehavior) {
			this.dropBehavior.attachDropBehavior(this);
			this.dropBehavior.updateSelectors(this)
		}
		return this
	};
	a.prototype.stringify = function() {
		var b = a.superclass.prototype.stringify.call(this),
		c = {
			container: this.savedOptions.container,
			drop: this.savedOptions.drop
		};
		$.extend(true, b, c);
		return b
	};
	PMUI.extendNamespace("PMUI.draw.BehavioralElement", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b)
	};
	PMUI.inheritFrom("PMUI.util.Factory", a);
	a.prototype.type = "BehaviorFactory";
	a.prototype.make = function(c) {
		var d, b = c.pmType;
		if (this.isValidClass(c)) {
			d = c
		} else {
			if (this.isValidName(b)) {
				d = this.build(b, c)
			} else {
				if (this.isValidName(c)) {
					d = this.build(c, {})
				} else {
					d = this.build(this.defaultProduct, c)
				}
			}
		}
		return d
	};
	PMUI.extendNamespace("PMUI.behavior.BehaviorFactory", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function() {};
	a.prototype.type = "DragBehavior";
	a.prototype.family = "DragBehavior";
	a.prototype.attachDragBehavior = function(b) {
		var c, d = $(b.getHTML());
		c = {
			revert: false,
			helper: "none",
			cursorAt: false,
			revertDuration: 0,
			grid: [1, 1],
			start: this.onDragStart(b),
			drag: this.onDrag(b),
			stop: this.onDragEnd(b)
		};
		d.draggable(c)
	};
	a.prototype.onDragStart = function(b) {
		return function(d, c) {}
	};
	a.prototype.onDrag = function(b) {
		return function(d, c) {}
	};
	a.prototype.onDragEnd = function(b) {
		return function(d, c) {}
	};
	a.prototype.dragStartHook = function(b) {};
	a.prototype.dragHook = function(b) {};
	a.prototype.dragEndHook = function() {};
	PMUI.extendNamespace("PMUI.behavior.DragBehavior", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function() {};
	PMUI.inheritFrom("PMUI.behavior.DragBehavior", a);
	a.prototype.type = "CustomShapeDragBehavior";
	a.prototype.attachDragBehavior = function(b) {
		var c, d = $(b.getHTML());
		c = {
			revert: false,
			helper: "none",
			cursorAt: false,
			revertDuration: 0,
			disable: false,
			grid: [1, 1],
			start: this.onDragStart(b),
			drag: this.onDrag(b, true),
			stop: this.onDragEnd(b, true)
		};
		d.draggable({
			cursor: "move"
		});
		d.draggable(c)
	};
	a.prototype.onDragStart = function(b) {
		return function(d, c) {
			if (b.canvas.currentSelection.asArray().length == 0) {
				b.canvas.addToSelection(b)
			}
			PMUI.behavior.RegularDragBehavior.prototype.onDragStart.call(this, b)(d, c);
			b.previousXDragPosition = b.getX();
			b.previousYDragPosition = b.getY();
			if (b.canvas.snapToGuide) {
				b.canvas.startSnappers(d)
			}
			b.canvas.isDragging = true
		}
	};
	a.prototype.onDragProcedure = function(u, s, f, d, y, p) {
		var w, v, x, r, q, n, h, o, c, b, g = u.canvas,
		t, l, m = [];
		l = {};
		l.x = p.helper.position().left / g.zoomFactor;
		l.y = p.helper.position().top / g.zoomFactor;
		l.diffX = u.x - l.x;
		l.diffY = u.y - l.y;
		for (t = 0; t < u.canvas.currentSelection.getSize(); t += 1) {
			x = u.canvas.currentSelection.get(t);
			if (x.id !== u.id) {
				m.push(x.x + l.diffX)
			}
		}
		if (s) {
			if (u.canvas.snapToGuide) {
				u.canvas.processGuides(y, p, u)
			}
			u.setPosition(p.helper.position().left / g.zoomFactor, p.helper.position().top / g.zoomFactor);
			r = u.x - u.previousXDragPosition;
			q = u.y - u.previousYDragPosition;
			u.previousXDragPosition = u.x;
			u.previousYDragPosition = u.y;
			for (w = 0; w < u.canvas.currentSelection.getSize(); w += 1) {
				x = u.canvas.currentSelection.get(w);
				if (x.id !== u.id) {
					if (((x.x + r) >= 0) && ((x.y + q) >= 0)) {
						x.setPosition(x.x + r, x.y + q)
					} else {
						y.preventDefault()
					}
				}
			}
		} else {
			u.setPosition(u.x, u.y)
		}
		if (s) {
			for (w = 0; w < u.canvas.currentSelection.getSize(); w += 1) {
				x = u.canvas.currentSelection.get(w);
				for (v = 0; v < x.children.getSize(); v += 1) {
					h = x.children.get(v);
					PMUI.behavior.CustomShapeDragBehavior.prototype.onDragProcedure.call(this, h, false, r, q, y, p)
				}
			}
		} else {
			for (w = 0; w < u.children.getSize(); w += 1) {
				h = u.children.get(w);
				PMUI.behavior.CustomShapeDragBehavior.prototype.onDragProcedure.call(this, h, false, f, d, y, p)
			}
		}
		if (s) {
			for (w = 0; w < u.canvas.currentSelection.getSize(); w += 1) {
				x = u.canvas.currentSelection.get(w);
				for (v = 0; v < x.ports.getSize(); v += 1) {
					n = x.ports.get(v);
					o = n.connection;
					n.setPosition(n.x, n.y);
					if (u.canvas.sharedConnections.find("id", o.getID())) {
						if (o.srcPort.parent.getID() === x.getID()) {
							o.move(r * g.zoomFactor, q * g.zoomFactor)
						}
					} else {
						o.setSegmentColor(PMUI.util.Color.GREY, false).setSegmentStyle("regular", false).disconnect().connect()
					}
				}
			}
		} else {
			for (w = 0; w < u.ports.getSize(); w += 1) {
				n = u.ports.get(w);
				o = n.connection;
				c = o.srcPort.parent;
				b = o.destPort.parent;
				n.setPosition(n.x, n.y);
				if (u.canvas.sharedConnections.find("id", o.getID())) {
					if (o.srcPort.parent.getID() === u.getID()) {
						o.move(f * g.zoomFactor, d * g.zoomFactor)
					}
				} else {
					o.setSegmentColor(PMUI.util.Color.GREY, false).setSegmentStyle("regular", false).disconnect().connect()
				}
			}
		}
	};
	a.prototype.onDrag = function(c, b, f, e) {
		var d = this;
		return function(h, g) {
			d.onDragProcedure(c, b, f, e, h, g)
		}
	};
	a.prototype.dragEndProcedure = function(g, n, l, m) {
		var k, h, o, f, d, b, q, p, c = g.canvas;
		if (n) {
			g.setPosition(m.helper.position().left / c.zoomFactor, m.helper.position().top / c.zoomFactor);
			g.wasDragged = true;
			g.canvas.isDragging = false;
			for (k = 0; k < g.canvas.currentSelection.getSize(); k += 1) {
				o = g.canvas.currentSelection.get(k);
				o.setPosition(o.x, o.y)
			}
		} else {
			g.setPosition(g.x, g.y)
		}
		if (n) {
			for (k = 0; k < g.canvas.currentSelection.getSize(); k += 1) {
				o = g.canvas.currentSelection.get(k);
				for (h = 0; h < o.children.getSize(); h += 1) {
					d = o.children.get(h);
					d.changedContainer = true;
					PMUI.behavior.CustomShapeDragBehavior.prototype.dragEndProcedure.call(this, d, false, l, m)
				}
			}
		} else {
			for (k = 0; k < g.children.getSize(); k += 1) {
				d = g.children.get(k);
				PMUI.behavior.CustomShapeDragBehavior.prototype.dragEndProcedure.call(this, d, false, l, m)
			}
		}
		if (n) {
			for (k = 0; k < g.canvas.currentSelection.getSize(); k += 1) {
				o = g.canvas.currentSelection.get(k);
				for (h = 0; h < o.ports.getSize(); h += 1) {
					f = o.ports.get(h);
					b = f.connection;
					f.setPosition(f.x, f.y);
					if (g.canvas.sharedConnections.find("id", b.getID())) {
						if (b.srcPort.parent.getID() === o.getID()) {
							b.disconnect(true).connect({
								algorithm: "user",
								points: b.points,
								dx: parseFloat($(b.html).css("left")),
								dy: parseFloat($(b.html).css("top"))
							});
							b.checkAndCreateIntersectionsWithAll()
						}
					} else {
						b.setSegmentColor(b.originalSegmentColor, false).setSegmentStyle(b.originalSegmentStyle, false).disconnect().connect();
						b.setSegmentMoveHandlers();
						b.checkAndCreateIntersectionsWithAll()
					}
				}
			}
		} else {
			for (k = 0; k < g.ports.getSize(); k += 1) {
				f = g.ports.get(k);
				b = f.connection;
				q = b.srcPort.parent;
				p = b.destPort.parent;
				f.setPosition(f.x, f.y);
				if (g.canvas.sharedConnections.find("id", b.getID())) {
					if (b.srcPort.parent.getID() === g.getID()) {
						b.checkAndCreateIntersectionsWithAll()
					}
				} else {
					b.setSegmentColor(b.originalSegmentColor, false).setSegmentStyle(b.originalSegmentStyle, false).disconnect().connect();
					b.setSegmentMoveHandlers();
					b.checkAndCreateIntersectionsWithAll()
				}
			}
		}
	};
	a.prototype.onDragEnd = function(b) {
		var d, c = this;
		return function(g, f) {
			c.dragEndProcedure(b, true, g, f);
			b.dragging = false;
			b.canvas.verticalSnapper.hide();
			b.canvas.horizontalSnapper.hide();
			if (!b.changedContainer) {
				d = new PMUI.command.CommandMove(b.canvas.currentSelection);
				d.execute();
				b.canvas.commandStack.add(d)
			}
			b.changedContainer = false;
			b.decreaseParentZIndex(b.oldParent);
			b.canvas.emptyCurrentSelection()
		}
	};
	PMUI.extendNamespace("PMUI.behavior.CustomShapeDragBehavior", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function() {};
	PMUI.inheritFrom("PMUI.behavior.DragBehavior", a);
	a.prototype.type = "RegularDragBehavior";
	a.prototype.attachDragBehavior = function(b) {
		var c = $(b.getHTML());
		a.superclass.prototype.attachDragBehavior.call(this, b);
		c.draggable({
			cursor: "move"
		})
	};
	a.prototype.onDragStart = function(b) {
		return function(h, g) {
			var d = b.canvas,
			c = d.currentLabel,
			j, f;
			d.hideCurrentConnection();
			if (c) {
				c.loseFocus();
				$(c.textField).focusout()
			}
			d.fixSnapData();
			if (!d.currentSelection.contains(b)) {
				d.emptyCurrentSelection();
				d.addToSelection(b)
			}
			for (f = 0; f < d.currentSelection.getSize(); f += 1) {
				j = d.currentSelection.get(f);
				j.setOldX(j.getX());
				j.setOldY(j.getY());
				j.setOldParent(j.getParent())
			}
			b.increaseParentZIndex(b.getParent());
			b.canvas.isDragging = true;
			return true
		}
	};
	a.prototype.onDrag = function(b) {
		return function(d, c) {
			b.setPosition(c.helper.position().left, c.helper.position().top);
			b.canvas.showOrHideSnappers(b)
		}
	};
	a.prototype.onDragEnd = function(b) {
		return function(d, c) {
			var f;
			b.setPosition(c.helper.position().left / b.canvas.zoomFactor, c.helper.position().top / b.canvas.zoomFactor);
			b.decreaseParentZIndex(b.oldParent);
			b.dragging = false;
			b.canvas.isDragging = false;
			b.canvas.verticalSnapper.hide();
			b.canvas.horizontalSnapper.hide();
			if (!b.changedContainer) {
				f = new PMUI.command.CommandMove(b.canvas.currentSelection);
				f.execute();
				b.canvas.commandStack.add(f)
			}
			b.changedContainer = false
		}
	};
	PMUI.extendNamespace("PMUI.behavior.RegularDragBehavior", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function() {};
	PMUI.inheritFrom("PMUI.behavior.DragBehavior", a);
	a.prototype.type = "ConnectionDragBehavior";
	a.prototype.attachDragBehavior = function(b) {
		var d = $(b.getHTML()),
		c;
		c = {
			helper: b.createDragHelper,
			cursorAt: {
				top: 0,
				left: 0
			},
			revert: true
		};
		a.superclass.prototype.attachDragBehavior.call(this, b);
		d.draggable(c);
		d.draggable("enable")
	};
	a.prototype.onDragStart = function(b) {
		return function(h, g) {
			var f = b.canvas,
			c = f.currentLabel,
			d = f.relativePoint(h),
			j = h.pageX - b.getAbsoluteX(),
			i = h.pageY - b.getAbsoluteY();
			b.startConnectionPoint.portX = j;
			b.startConnectionPoint.portY = i;
			b.canvas.emptyCurrentSelection();
			if (c) {
				c.loseFocus();
				$(c.textField).focusout()
			}
			if (b.family !== "CustomShape") {
				return false
			}
			b.setOldX(b.getX());
			b.setOldY(b.getY());
			b.startConnectionPoint.x = b.canvas.zoomFactor * d.x;
			b.startConnectionPoint.y = b.canvas.zoomFactor * d.y;
			return true
		}
	};
	a.prototype.onDrag = function(b) {
		return function(h, g) {
			var d = b.getCanvas(),
			f = new PMUI.util.Point(),
			c = d.relativePoint(h);
			if (d.connectionSegment) {
				$(d.connectionSegment.getHTML()).remove()
			}
			f.x = c.x * b.canvas.zoomFactor;
			f.y = c.y * b.canvas.zoomFactor;
			d.connectionSegment = new PMUI.draw.Segment({
				startPoint: b.startConnectionPoint,
				endPoint: f,
				parent: d,
				zOrder: PMUI.util.Style.MAX_ZINDEX * 2
			});
			d.connectionSegment.pointsTo = b;
			d.connectionSegment.paint()
		}
	};
	a.prototype.onDragEnd = function(b) {
		return function(d, c) {
			if (b.canvas.connectionSegment) {
				$(b.canvas.connectionSegment.getHTML()).remove()
			}
			b.setPosition(b.getOldX(), b.getOldY());
			b.dragging = false
		}
	};
	PMUI.extendNamespace("PMUI.behavior.ConnectionDragBehavior", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function() {};
	PMUI.inheritFrom("PMUI.behavior.DragBehavior", a);
	a.prototype.type = "NoDragBehavior";
	a.prototype.onDragStart = function(b) {
		return function(d, c) {
			b.canvas.hideCurrentConnection();
			return false
		}
	};
	PMUI.extendNamespace("PMUI.behavior.NoDragBehavior", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function(b) {
		this.selectors = [];
		a.prototype.init.call(this, b)
	};
	a.prototype.type = "DropBehavior";
	a.prototype.family = "DropBehavior";
	a.prototype.defaultSelector = "";
	a.prototype.init = function(b) {
		var c = {
			selectors: []
		};
		jQuery.extend(true, c, b);
		this.setSelectors(c.selectors)
	};
	a.prototype.attachDropBehavior = function(c) {
		var d = $(c.getHTML()),
		b = {
			accept: this.defaultSelector,
			drop: this.onDrop(c),
			over: this.onDragEnter(c),
			out: this.onDragLeave(c),
			greedy: true
		};
		d.droppable(b)
	};
	a.prototype.onDragEnter = function(b) {
		return function(d, c) {}
	};
	a.prototype.onDragLeave = function(b) {
		return function(d, c) {}
	};
	a.prototype.onDrop = function(b) {
		return function(d, c) {}
	};
	a.prototype.setSelectors = function(f, d) {
		var c = "",
		b, e;
		if (f) {
			this.selectors = f
		}
		if (!d) {
			c = this.defaultSelector;
			b = 0
		} else {
			if (f.length > 0) {
				c = f[0];
				b = 1
			}
		}
		for (e = b; e < f.length; e += 1) {
			c += "," + this.selectors[e]
		}
		return this
	};
	a.prototype.updateSelectors = function(b, e) {
		var f = $(b.getHTML()),
		c,
		d;
		if (e) {
			this.selectors = e
		}
		if (this.selectors.length > 0) {
			c = this.selectors[0]
		}
		for (d = 1; d < this.selectors.length; d += 1) {
			c += "," + this.selectors[d]
		}
		f.droppable({
			accept: c
		});
		return this
	};
	a.prototype.dragEnterHook = function() {
		return true
	};
	a.prototype.dragLeaveHook = function() {
		return true
	};
	a.prototype.dropStartHook = function(b, d, c) {
		return true
	};
	a.prototype.dropHook = function(b, d, c) {
		return true
	};
	a.prototype.dropEndHook = function(b, d, c) {
		return true
	};
	PMUI.extendNamespace("PMUI.behavior.DropBehavior", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b)
	};
	PMUI.inheritFrom("PMUI.behavior.DropBehavior", a);
	a.prototype.type = "ConnectionDropBehavior";
	a.prototype.defaultSelector = ".custom_shape,.port";
	a.prototype.setSelectors = function(c, b) {
		a.superclass.prototype.setSelectors.call(this, c, b);
		this.selectors.push(".port");
		this.selectors.push(".custom_shape");
		return this
	};
	a.prototype.onDragEnter = function(b) {
		return function(d, c) {
			b.entered = true
		}
	};
	a.prototype.onDragLeave = function(b) {
		return function(d, c) {
			b.entered = false
		}
	};
	a.prototype.onDrop = function(b) {
		var c = this;
		return function(f, d) {}
	};
	PMUI.extendNamespace("PMUI.behavior.ConnectionDropBehavior", a)
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b)
	};
	PMUI.inheritFrom("PMUI.behavior.DropBehavior", a);
	a.prototype.type = "ContainerDropBehavior";
	a.prototype.defaultSelector = ".custom_shape";
	a.prototype.onDrop = function(b) {
		return function(k, l) {
			var f = null,
			d = b.getCanvas(),
			n,
			o,
			j,
			h,
			m,
			c,
			p = [],
			g = b.containerBehavior;
			if (d.readOnly) {
				return false
			}
			b.entered = false;
			if (l.helper && l.helper.attr("id") === "drag-helper") {
				return false
			}
			c = l.draggable.attr("id");
			f = d.shapeFactory(c);
			if (f === null) {
				f = d.customShapes.find("id", c);
				if (!f || !b.dropBehavior.dropHook(b, k, l)) {
					return false
				}
				if (! (f.parent && f.parent.id === b.id)) {
					n = d.currentSelection;
					for (j = 0; j < n.getSize(); j += 1) {
						o = n.get(j);
						m = PMUI.getPointRelativeToPage(o);
						m = PMUI.pageCoordinatesToShapeCoordinates(b, null, m.x, m.y, f);
						p.push({
							shape: o,
							container: b,
							x: m.x,
							y: m.y,
							topLeft: false
						})
					}
					h = new PMUI.command.CommandSwitchContainer(p);
					h.execute();
					d.commandStack.add(h);
					d.multipleDrop = true
				}
				b.updateDimensions(10);
				d.updatedElement = null
			} else {
				m = PMUI.pageCoordinatesToShapeCoordinates(b, k, null, null, f);
				if (PMUI.validCoordinatedToCreate(b, k, f)) {
					b.addElement(f, m.x, m.y, f.topLeftOnCreation);
					d.updatedElement = f;
					h = new PMUI.command.CommandCreate(f);
					d.commandStack.add(h);
					h.execute();
					d.hideAllFocusLabels();
					if (f.label) {
						f.label.getFocus()
					}
				}
			}
		}
	};
	PMUI.extendNamespace("PMUI.behavior.ContainerDropBehavior", a)
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b)
	};
	PMUI.inheritFrom("PMUI.behavior.DropBehavior", a);
	a.prototype.type = "ConnectionContainerDropBehavior";
	a.prototype.defaultSelector = ".custom_shape,.port";
	a.prototype.setSelectors = function(c, b) {
		a.superclass.prototype.setSelectors.call(this, c, b);
		this.selectors.push(".port");
		this.selectors.push(".custom_shape");
		return this
	};
	a.prototype.onDrop = function(b) {
		return function(d, c) {
			if (!PMUI.behavior.ConnectionDropBehavior.prototype.onDrop.call(this, b)(d, c)) {
				PMUI.behavior.ContainerDropBehavior.prototype.onDrop.call(this, b)(d, c)
			}
		}
	};
	PMUI.extendNamespace("PMUI.behavior.ConnectionContainerDropBehavior", a)
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b)
	};
	PMUI.inheritFrom("PMUI.behavior.DropBehavior", a);
	a.prototype.type = "NoDropBehavior";
	a.prototype.attachDropBehavior = function(b) {};
	PMUI.extendNamespace("PMUI.behavior.NoDropBehavior", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function() {};
	a.prototype.type = "ContainerBehavior";
	a.prototype.family = "ContainerBehavior";
	a.prototype.addToContainer = function(c, d, b, f, e) {};
	a.prototype.removeFromContainer = function(b) {};
	a.prototype.addShape = function(c, d, b, e) {};
	a.prototype.isContainer = function() {
		return false
	};
	PMUI.extendNamespace("PMUI.behavior.ContainerBehavior", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function() {};
	PMUI.inheritFrom("PMUI.behavior.ContainerBehavior", a);
	a.prototype.type = "RegularContainerBehavior";
	a.prototype.addToContainer = function(b, h, k, j, i) {
		var l = 0,
		d = 0,
		f, e, c, g = (i === true) ? 0 : 1;
		if (b.family === "Canvas") {
			c = b
		} else {
			c = b.canvas
		}
		f = h.getZoomWidth();
		e = h.getZoomHeight();
		l += k - (f / 2) * g;
		d += j - (e / 2) * g;
		l /= c.zoomFactor;
		d /= c.zoomFactor;
		h.setParent(b);
		b.getChildren().insert(h);
		this.addShape(b, h, l, d);
		h.fixZIndex(h, 0);
		b.updateDimensions(10);
		c.addToList(h)
	};
	a.prototype.removeFromContainer = function(b) {
		var c = b.parent;
		c.getChildren().remove(b);
		if (c.isResizable()) {
			c.resizeBehavior.updateResizeMinimums(b.parent)
		}
		b.parent = null
	};
	a.prototype.addShape = function(c, d, b, e) {
		d.setPosition(b, e);
		c.getHTML().appendChild(d.getHTML());
		d.updateHTML();
		d.paint();
		d.applyBehaviors();
		d.attachListeners();
		return this
	};
	PMUI.extendNamespace("PMUI.behavior.RegularContainerBehavior", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function() {};
	PMUI.inheritFrom("PMUI.behavior.ContainerBehavior", a);
	a.prototype.type = "NoContainerBehavior";
	PMUI.extendNamespace("PMUI.behavior.NoContainerBehavior", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function() {};
	a.prototype.type = "ResizeBehavior";
	a.prototype.family = "ResizeBehavior";
	a.prototype.init = function(b) {
		var d = $(b.getHTML()),
		c = {
			handles: b.getHandlesIDs(),
			disable: false,
			start: this.onResizeStart(b),
			resize: this.onResize(b),
			stop: this.onResizeEnd(b)
		};
		d.resizable(c)
	};
	a.prototype.onResizeStart = function(b) {};
	a.prototype.onResize = function(b) {};
	a.prototype.onResizeEnd = function(b) {};
	a.prototype.updateResizeMinimums = function(c) {
		var b, f, e = c.getChildren(),
		d = e.getDimensionLimit(),
		g = 15,
		h = $(c.getHTML());
		b = d[1] + g;
		f = d[2] + g;
		h.resizable();
		h.resizable("option", "minWidth", b);
		h.resizable("option", "minHeight", f);
		return this
	};
	PMUI.extendNamespace("PMUI.behavior.ResizeBehavior", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function() {};
	PMUI.inheritFrom("PMUI.behavior.ResizeBehavior", a);
	a.prototype.type = "NoResizeBehavior";
	a.prototype.init = function(b) {
		var c = $(b.getHTML());
		a.superclass.prototype.init.call(this, b);
		c.resizable("disable");
		c.removeClass("ui-state-disabled");
		b.applyStyleToHandlers("nonResizableStyle");
		b.showOrHideResizeHandlers(false)
	};
	a.prototype.updateResizeMinimums = function(b) {};
	PMUI.extendNamespace("PMUI.behavior.NoResizeBehavior", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function() {};
	PMUI.inheritFrom("PMUI.behavior.ResizeBehavior", a);
	a.prototype.type = "RegularResizeBehavior";
	a.prototype.init = function(b) {
		var c = $(b.getHTML());
		a.superclass.prototype.init.call(this, b);
		c.resizable("enable");
		b.applyStyleToHandlers("resizableStyle");
		b.showOrHideResizeHandlers(false)
	};
	a.prototype.onResizeStart = function(b) {
		return function(d, c) {
			b.resizing = true;
			b.canvas.isResizing = true;
			b.dragging = false;
			b.oldWidth = b.width;
			b.oldHeight = b.height;
			b.oldX = b.x;
			b.oldY = b.y;
			b.oldAbsoluteX = b.absoluteX;
			b.oldAbsoluteY = b.absoluteY;
			if (b.ports) {
				b.initPortsChange()
			}
			if (b.canvas.currentSelection.getSize() > 1) {
				b.canvas.emptyCurrentSelection();
				b.canvas.addToSelection(b)
			}
			b.showOrHideResizeHandlers(false);
			b.calculateLabelsPercentage();
			b.canvas.hideAllFocusLabels();
			return true
		}
	};
	a.prototype.onResize = function(b) {
		return function(h, g) {
			var f, c, d = b.canvas;
			b.setPosition(g.position.left / d.zoomFactor, g.position.top / d.zoomFactor);
			b.setDimension(g.size.width / d.zoomFactor, g.size.height / d.zoomFactor);
			b.updateLabelsPosition();
			b.canvas.hideAllFocusLabels()
		}
	};
	a.prototype.onResizeEnd = function(b) {
		return function(g, f) {
			var d, c, h;
			b.resizing = false;
			b.canvas.isResizing = false;
			a.prototype.onResize.call(this, b)(g, f);
			b.showOrHideResizeHandlers(true);
			b.parent.updateDimensions(10);
			if (b.ports) {
				b.firePortsChange()
			}
			h = new PMUI.command.CommandResize(b);
			b.canvas.commandStack.add(h);
			h.execute();
			for (d = 0; d < b.labels.getSize(); d += 1) {
				c = b.labels.get(d);
				c.setLabelPosition(c.location, c.diffX, c.diffY)
			}
			return true
		}
	};
	PMUI.extendNamespace("PMUI.behavior.RegularResizeBehavior", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function(b) {
		this.receiver = b;
		this.canvas = this.getCanvas(b)
	};
	a.prototype.family = "Command";
	a.prototype.execute = function(b) {};
	a.prototype.undo = function(b) {};
	a.prototype.redo = function(b) {};
	a.prototype.getCanvas = function(d) {
		var b, c;
		if (d.getSize) {
			b = d.get(0);
			c = b.getCanvas()
		} else {
			if (d.getCanvas) {
				c = d.getCanvas()
			} else {
				c = null
			}
		}
		return c
	};
	PMUI.extendNamespace("PMUI.command.Command", a)
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b)
	};
	PMUI.inheritFrom("PMUI.command.Command", a);
	a.prototype.type = "CommandConnect";
	a.prototype.buildConnection = function() {
		var b = this.receiver,
		c = b.canvas,
		d = b.getSrcPort(),
		e = b.getDestPort();
		d.parent.ports.insert(d);
		e.parent.ports.insert(e);
		d.parent.html.appendChild(d.getHTML());
		e.parent.html.appendChild(e.getHTML());
		c.addConnection(b);
		c.updatedElement = b;
		return b
	};
	a.prototype.execute = function() {
		var b = this.receiver,
		c = b.canvas,
		d = b.getSrcPort(),
		e = b.getDestPort();
		d.parent.ports.insert(d);
		e.parent.ports.insert(e);
		d.parent.html.appendChild(d.getHTML());
		e.parent.html.appendChild(e.getHTML());
		c.addConnection(b);
		b.checkAndCreateIntersectionsWithAll();
		c.updatedElement = b;
		c.triggerCreateEvent(b, []);
		return this
	};
	a.prototype.undo = function() {
		this.receiver.saveAndDestroy();
		this.receiver.canvas.triggerRemoveEvent(this.receiver, []);
		return this
	};
	a.prototype.redo = function() {
		this.execute();
		return this
	};
	PMUI.extendNamespace("PMUI.command.CommandConnect", a)
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b);
		this.before = null;
		this.after = null;
		a.prototype.initObject.call(this, b)
	};
	PMUI.inheritFrom("PMUI.command.Command", a);
	a.prototype.type = "CommandCreate";
	a.prototype.initObject = function(b) {
		var c = b.getParent();
		this.before = {};
		this.after = {
			x: b.getX(),
			y: b.getY(),
			parent: b.getParent()
		}
	};
	a.prototype.execute = function() {
		var b = this.receiver,
		c = b.parent;
		if (!c.getChildren().contains(b)) {
			c.getChildren().insert(b)
		}
		this.after.parent.html.appendChild(b.getHTML());
		b.canvas.addToList(b);
		b.showOrHideResizeHandlers(false);
		b.canvas.triggerCreateEvent(b, []);
		return this
	};
	a.prototype.undo = function() {
		this.receiver.parent.getChildren().remove(this.receiver);
		this.receiver.saveAndDestroy();
		this.receiver.canvas.triggerRemoveEvent(this.receiver, []);
		return this
	};
	a.prototype.redo = function() {
		this.execute();
		return this
	};
	PMUI.extendNamespace("PMUI.command.CommandCreate", a)
} ()); (function() {
	var a = function(c, b) {
		a.superclass.call(this, c);
		this.before = null;
		this.after = null;
		a.prototype.initObject.call(this, c, b)
	};
	PMUI.inheritFrom("PMUI.command.Command", a);
	a.prototype.type = "CommandEditLabel";
	a.prototype.initObject = function(e, b) {
		var c = 0,
		d = 0;
		if (e.parent) {
			c = e.parent.height;
			d = e.parent.width
		}
		this.before = {
			message: e.message,
			width: e.width,
			height: e.height,
			parentHeight: c,
			parentWidth: d
		};
		this.after = {
			message: b,
			width: 0,
			height: 0,
			parentHeight: d,
			parentWidth: c
		}
	};
	a.prototype.execute = function(b) {
		this.receiver.setMessage(this.after.message);
		this.receiver.updateDimension();
		if (this.after.width === 0) {
			this.after.width = this.receiver.width;
			this.after.height = this.receiver.height;
			if (this.after.parentWidth !== 0) {
				this.after.parentWidth = this.receiver.parent.width;
				this.after.parentHeight = this.receiver.parent.height
			}
		}
		this.receiver.paint();
		if (!b) {
			this.receiver.canvas.triggerTextChangeEvent(this.receiver, this.before.message, this.after.message);
			if ((this.after.parentWidth !== this.before.parentWidth) && (this.before.parentHeight !== this.after.parentHeight)) {
				this.receiver.canvas.triggerDimensionChangeEvent(this.receiver.parent, this.before.parentWidth, this.before.parentHeight, this.after.parentWidth, this.after.parentHeight)
			}
		}
	};
	a.prototype.undo = function(b) {
		this.receiver.setMessage(this.before.message);
		if (this.receiver.parent) {
			this.receiver.parent.setDimension(this.before.parentWidth, this.before.parentHeight)
		}
		this.receiver.setDimension(this.before.width, this.before.height);
		this.receiver.updateDimension();
		this.receiver.paint();
		this.receiver.canvas.triggerTextChangeEvent(this.receiver, this.after.message, this.before.message);
		if ((this.after.parentWidth !== this.before.parentWidth) && (this.before.parentHeight !== this.after.parentHeight)) {
			this.receiver.canvas.triggerDimensionChangeEvent(this.receiver.parent, this.after.parentWidth, this.after.parentHeight, this.before.parentWidth, this.before.parentHeight)
		}
	};
	a.prototype.redo = function() {
		this.execute()
	};
	PMUI.extendNamespace("PMUI.command.CommandEditLabel", a)
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b);
		this.before = null;
		this.after = null;
		this.relatedShapes = [];
		a.prototype.initObject.call(this, b)
	};
	PMUI.inheritFrom("PMUI.command.Command", a);
	a.prototype.type = "CommandMove";
	a.prototype.initObject = function(e) {
		var c, b = [],
		d = [];
		for (c = 0; c < e.getSize(); c += 1) {
			this.relatedShapes.push(e.get(c));
			b.push({
				x: e.get(c).getOldX(),
				y: e.get(c).getOldY()
			});
			d.push({
				x: e.get(c).getX(),
				y: e.get(c).getY()
			})
		}
		this.before = {
			shapes: b
		};
		this.after = {
			shapes: d
		};
		this.moveUndo = false
	};
	a.prototype.execute = function() {
		var f, e, b, d, c, g;
		PMUI.getActiveCanvas().refreshArray.clear();
		PMUI.getActiveCanvas().connToRefresh.clear();
		for (f = 0; f < this.relatedShapes.length; f += 1) {
			c = this.relatedShapes[f];
			g = {
				dx: this.after.shapes[f].x - this.before.shapes[f].x,
				dy: this.after.shapes[f].y - this.before.shapes[f].y
			};
			c.setPosition(this.after.shapes[f].x, this.after.shapes[f].y).refreshChildrenPositions(true, g);
			for (e = 0, b = this.canvas.connToRefresh.getSize(); e < b; e += 1) {
				d = this.canvas.connToRefresh.get(e);
				d.reconectSwitcher(g, false)
			}
			c.refreshConnections(false, this.relatedShapes, g)
		}
		this.canvas.triggerPositionChangeEvent(this.relatedShapes, this.before.shapes, this.after.shapes);
		if (this.moveUndo) {
			for (e = 0; e < PMUI.getActiveCanvas().refreshArray.getSize(); e += 1) {
				d = PMUI.getActiveCanvas().refreshArray.get(e);
				d.reconnectUser(g, false);
				d.setSegmentMoveHandlers().checkAndCreateIntersectionsWithAll();
				PMUI.getActiveCanvas().triggerConnectionStateChangeEvent(d)
			}
			this.moveUndo = false
		}
	};
	a.prototype.undo = function() {
		var f, g, d, c, e, b;
		PMUI.getActiveCanvas().refreshArray.clear();
		PMUI.getActiveCanvas().connToRefresh.clear();
		for (f = 0; f < this.relatedShapes.length; f += 1) {
			d = this.relatedShapes[f];
			g = {
				dx: this.before.shapes[f].x - this.after.shapes[f].x,
				dy: this.before.shapes[f].y - this.after.shapes[f].y
			};
			d.setPosition(this.before.shapes[f].x, this.before.shapes[f].y).refreshChildrenPositions(true, g);
			for (e = 0, b = this.canvas.connToRefresh.getSize(); e < b; e += 1) {
				c = this.canvas.connToRefresh.get(e);
				c.reconectSwitcher(g, false)
			}
			d.refreshConnections(false, this.relatedShapes, g)
		}
		this.canvas.triggerPositionChangeEvent(this.relatedShapes, this.after.shapes, this.before.shapes);
		for (e = 0; e < PMUI.getActiveCanvas().refreshArray.getSize(); e += 1) {
			c = PMUI.getActiveCanvas().refreshArray.get(e);
			c.reconnectUser(g, false);
			c.setSegmentMoveHandlers().checkAndCreateIntersectionsWithAll();
			PMUI.getActiveCanvas().triggerConnectionStateChangeEvent(c)
		}
		this.moveUndo = true
	};
	a.prototype.redo = function() {
		this.execute()
	};
	PMUI.extendNamespace("PMUI.command.CommandMove", a)
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b);
		this.before = {
			x: this.receiver.getOldX(),
			y: this.receiver.getOldY(),
			parent: this.receiver.getOldParent()
		};
		this.after = {
			x: this.receiver.getX(),
			y: this.receiver.getY(),
			parent: this.receiver.getParent()
		}
	};
	PMUI.inheritFrom("PMUI.command.Command", a);
	a.prototype.type = "CommandReconnect";
	a.prototype.execute = function() {
		var b = this.receiver,
		d = this.after.parent,
		c = this.before.parent;
		if (d.canvas.currentConnection) {
			d.canvas.currentConnection.hidePortsAndHandlers();
			d.canvas.currentConnection = null
		}
		if (d.getID() !== c.getID()) {
			c.removePort(b);
			d.addPort(b, this.after.x, this.after.y, true)
		} else {
			d.definePortPosition(b, new PMUI.util.Point(this.after.x, this.after.y))
		}
		b.connection.disconnect().connect().setSegmentMoveHandlers().checkAndCreateIntersectionsWithAll();
		this.receiver.canvas.triggerPortChangeEvent(b);
		return this
	};
	a.prototype.undo = function() {
		var b = this.receiver,
		d = this.after.parent,
		c = this.before.parent;
		if (d.canvas.currentConnection) {
			d.canvas.currentConnection.hidePortsAndHandlers();
			d.canvas.currentConnection = null
		}
		if (d.getID() !== c.getID()) {
			d.removePort(b);
			c.addPort(b, this.before.x, this.before.y, true);
			b.canvas.regularShapes.insert(b)
		} else {
			d.definePortPosition(b, new PMUI.util.Point(this.before.x, this.before.y))
		}
		b.connection.disconnect().connect().setSegmentMoveHandlers().checkAndCreateIntersectionsWithAll();
		this.receiver.canvas.triggerPortChangeEvent(b);
		return this
	};
	a.prototype.redo = function() {
		this.execute();
		return this
	};
	PMUI.extendNamespace("PMUI.command.CommandReconnect", a)
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b);
		this.before = {
			x: this.receiver.getOldX(),
			y: this.receiver.getOldY(),
			width: this.receiver.getOldWidth(),
			height: this.receiver.getOldHeight()
		};
		this.after = {
			x: this.receiver.getX(),
			y: this.receiver.getY(),
			width: this.receiver.getWidth(),
			height: this.receiver.getHeight()
		}
	};
	PMUI.inheritFrom("PMUI.command.Command", a);
	a.prototype.type = "CommandResize";
	a.prototype.execute = function() {
		var b = this.receiver,
		c = b.getCanvas();
		b.setPosition(this.after.x, this.after.y).setDimension(this.after.width, this.after.height);
		c.triggerDimensionChangeEvent(b, this.before.width, this.before.height, this.after.width, this.after.height);
		if ((this.after.x !== this.before.x) || (this.after.y !== this.before.y)) {
			c.triggerPositionChangeEvent([b], [{
				x: this.before.x,
				y: this.before.y
			}], [{
				x: this.after.x,
				y: this.after.y
			}])
		}
		return this
	};
	a.prototype.undo = function() {
		var b = this.receiver,
		c = b.getCanvas();
		b.setPosition(this.before.x, this.before.y).setDimension(this.before.width, this.before.height);
		b.fixConnectionsOnResize(b.resizing, true);
		c.triggerDimensionChangeEvent(b, this.after.width, this.after.height, this.before.width, this.before.height);
		if ((this.after.x !== this.before.x) || (this.after.y !== this.before.y)) {
			c.triggerPositionChangeEvent([b], [{
				x: this.after.x,
				y: this.after.y
			}], [{
				x: this.before.x,
				y: this.before.y
			}])
		}
		return this
	};
	a.prototype.redo = function() {
		this.execute();
		return this
	};
	PMUI.extendNamespace("PMUI.command.CommandResize", a)
} ()); (function() {
	var a = function(c, b) {
		a.superclass.call(this, c);
		this.oldPoints = [];
		this.newPoints = [];
		a.prototype.initObject.call(this, b)
	};
	PMUI.inheritFrom("PMUI.command.Command", a);
	a.prototype.type = "CommandResize";
	a.prototype.initObject = function(c) {
		var e = {
			oldPoints: [],
			newPoints: []
		},
		d,
		b;
		$.extend(true, e, c);
		this.oldPoints = [];
		for (d = 0; d < e.oldPoints.length; d += 1) {
			b = e.oldPoints[d];
			this.oldPoints.push(new PMUI.util.Point(b.x, b.y))
		}
		this.newPoints = [];
		for (d = 0; d < e.newPoints.length; d += 1) {
			b = e.newPoints[d];
			this.newPoints.push(new PMUI.util.Point(b.x, b.y))
		}
	};
	a.prototype.common = function(c) {
		var b = this.receiver;
		$(b.destDecorator.getHTML()).trigger("click");
		b.hidePortsAndHandlers();
		b.disconnect(true).connect({
			algorithm: "user",
			points: this[c]
		});
		b.setSegmentMoveHandlers();
		b.checkAndCreateIntersectionsWithAll();
		b.showPortsAndHandlers();
		b.canvas.triggerConnectionStateChangeEvent(b);
		return this
	};
	a.prototype.execute = function() {
		this.common("newPoints");
		return this
	};
	a.prototype.undo = function() {
		this.common("oldPoints");
		return this
	};
	a.prototype.redo = function() {
		this.execute();
		return this
	};
	PMUI.extendNamespace("PMUI.command.CommandSegmentMove", a)
} ()); (function() {
	var a = function(e, b) {
		var d, f, h;
		d = [];
		f = [];
		h = e || 20;
		function c() {
			f = []
		}
		function g() {}
		if (b && {}.toString.call(b) === "[object Function]") {
			g = b
		}
		return {
			add: function(i) {
				c();
				d.push(i);
				if (d.length > h) {
					d.shift()
				}
				g()
			},
			addToRedo: function(i) {
				f.push(i)
			},
			undo: function() {
				var i;
				if (d.length === 0) {
					return false
				}
				i = d.pop();
				i.undo();
				f.unshift(i);
				g();
				return true
			},
			redo: function() {
				var i;
				if (f.length === 0) {
					return false
				}
				i = f.shift();
				i.redo();
				d.push(i);
				g();
				return true
			},
			clearStack: function() {
				f = [];
				d = []
			},
			debug: function(k) {
				var j;
				if (k) {
					for (j = 0; j < d.length; j += 1) {
						console.log((j + 1) + ") " + d[j].type)
					}
				}
				if (k) {
					for (j = 0; j < f.length; j += 1) {
						console.log((j + 1) + ") " + f[j].type)
					}
				}
			},
			getRedoSize: function() {
				return f.length
			},
			getUndoSize: function() {
				return d.length
			},
			setHandler: function(i) {
				if (i && {}.toString.call(i) === "[object Function]") {
					g = i
				}
				return this
			}
		}
	};
	PMUI.extendNamespace("PMUI.command.CommandStack", a)
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b[0].shape);
		this.before = null;
		this.after = null;
		this.relatedShapes = [];
		a.prototype.initObject.call(this, b)
	};
	PMUI.inheritFrom("PMUI.command.Command", a);
	a.prototype.type = "CommandSwitchContainer";
	a.prototype.initObject = function(d) {
		var e, c, b = [],
		f = [];
		for (e = 0; e < d.length; e += 1) {
			c = d[e];
			this.relatedShapes.push(c.shape);
			b.push({
				parent: c.shape.parent,
				x: c.shape.getOldX(),
				y: c.shape.getOldY(),
				topLeft: true
			});
			f.push({
				parent: c.container,
				x: c.x,
				y: c.y,
				topLeft: c.topLeft
			})
		}
		this.before = {
			shapes: b
		};
		this.after = {
			shapes: f
		}
	};
	a.prototype.execute = function() {
		var c, b;
		for (c = 0; c < this.relatedShapes.length; c += 1) {
			b = this.relatedShapes[c];
			this.before.shapes[c].parent.swapElementContainer(b, this.after.shapes[c].parent, this.after.shapes[c].x, this.after.shapes[c].y, this.after.shapes[c].topLeft);
			b.refreshChildrenPositions().refreshConnections(false, this.relatedShapes)
		}
		this.canvas.triggerParentChangeEvent(this.relatedShapes, this.before.shapes, this.after.shapes)
	};
	a.prototype.undo = function() {
		var c, b;
		for (c = 0; c < this.relatedShapes.length; c += 1) {
			b = this.relatedShapes[c];
			this.before.shapes[c].parent.swapElementContainer(b, this.before.shapes[c].parent, this.before.shapes[c].x, this.before.shapes[c].y, this.before.shapes[c].topLeft);
			b.refreshChildrenPositions().refreshConnections(false, this.relatedShapes)
		}
		this.canvas.triggerParentChangeEvent(this.relatedShapes, this.after.shapes, this.before.shapes)
	};
	a.prototype.redo = function() {
		this.execute()
	};
	PMUI.extendNamespace("PMUI.command.CommandSwitchContainer", a)
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b);
		this.html = null;
		this.customShapes = null;
		this.regularShapes = null;
		this.connections = null;
		this.currentSelection = null;
		this.sharedConnections = null;
		this.leftScroll = 0;
		this.topScroll = 0;
		this.currentConnection = null;
		this.oldCurrentConnection = null;
		this.connectionSegment = null;
		this.multipleSelectionHelper = null;
		this.horizontalSnapper = null;
		this.verticalSnapper = null;
		this.zoomFactor = 1;
		this.zoomPropertiesIndex = 2;
		this.zOrder = 0;
		this.isMouseDown = false;
		this.currentShape = null;
		this.isMouseDownAndMove = false;
		this.multipleDrop = false;
		this.draggingASegmentHandler = false;
		this.updatedElement = null;
		this.rightClick = false;
		this.intersectionTimeout = null;
		this.currentLabel = null;
		this.commandStack = null;
		this.shapesToCopy = [];
		this.connectionsToCopy = [];
		this.readOnly = false;
		this.readOnlyLayer = null;
		this.copyAndPasteReferences = {};
		this.prevZoom = 1;
		this.dummyLabelInitializer = null;
		this.isDragging = false;
		this.isResizing = false;
		this.refreshArray = new PMUI.util.ArrayList();
		this.connToRefresh = new PMUI.util.ArrayList();
		a.prototype.init.call(this, b)
	};
	PMUI.inheritFrom("PMUI.draw.BehavioralElement", a);
	a.prototype.type = "Canvas";
	a.prototype.family = "Canvas";
	a.prototype.init = function(c) {
		var b, d;
		d = {
			left: 0,
			top: 0,
			width: 4000,
			height: 4000,
			copyAndPasteReferences: (c && c.copyAndPasteReferences) || {},
			readOnly: false
		};
		jQuery.extend(true, d, c);
		if (c) {
			this.children = new PMUI.util.ArrayList();
			this.customShapes = new PMUI.util.ArrayList();
			this.regularShapes = new PMUI.util.ArrayList();
			this.connections = new PMUI.util.ArrayList();
			this.currentSelection = new PMUI.util.ArrayList();
			this.sharedConnections = new PMUI.util.ArrayList();
			this.commandStack = new PMUI.command.CommandStack(20);
			this.multipleSelectionHelper = new PMUI.draw.MultipleSelectionContainer({
				canvas: this
			});
			this.copyAndPaste = false;
			this.copyAndPasteReferences = d.copyAndPasteReferences;
			this.setShapeFactory(d.shapeFactory);
			this.setPosition(d.left, d.top).setDimension(d.width, d.height).setCanvas(this).setReadOnly(d.readOnly);
			this.horizontalSnapper = new PMUI.draw.Snapper({
				orientation: "horizontal",
				canvas: this
			});
			this.verticalSnapper = new PMUI.draw.Snapper({
				orientation: "vertical",
				canvas: this
			});
			if (d.absoluteX) {
				this.absoluteX = d.absoluteX
			}
			if (d.absoluteY) {
				this.absoluteY = d.absoluteY
			}
			if (d.readOnly) {}
		}
	};
	a.prototype.createHTML = function() {
		a.superclass.prototype.createHTML.call(this);
		this.addElement(this.multipleSelectionHelper, 0, 0, true);
		return this.html
	};
	a.prototype.setReadOnly = function(b) {
		if (b) {
			this.readOnly = b
		}
		return this
	};
	a.prototype.setToReadOnly = function() {
		var b = this.readOnlyLayer;
		if (b && b.html) {
			this.html.appendChild(this.readOnlyLayer.html)
		} else {
			this.readOnlyLayer = new PMUI.draw.ReadOnlyLayer({
				width: this.width,
				height: this.height
			});
			this.html.appendChild(this.readOnlyLayer.html)
		}
		this.readOnly = true;
		return this
	};
	a.prototype.unsetReadOnly = function() {
		var b = this.readOnlyLayer;
		this.html.removeChild(b.getHTML());
		this.readOnly = false;
		return this
	};
	a.prototype.setPosition = function(b, c) {
		this.setX(b);
		this.setY(c);
		return this
	};
	a.prototype.setX = function(b) {
		this.x = this.zoomX = b;
		this.absoluteX = 0;
		return this
	};
	a.prototype.setY = function(b) {
		this.y = this.zoomY = b;
		this.absoluteY = 0;
		return this
	};
	a.prototype.createHTMLDiv = function() {
		return document.getElementById(this.id)
	};
	a.prototype.shapeFactory = function(c) {
		var b = null;
		return b
	};
	a.prototype.addToList = function(b) {
		switch (b.family) {
		case "CustomShape":
			if (!this.customShapes.contains(b)) {
				this.customShapes.insert(b)
			}
			break;
		case "RegularShape":
			if (!this.regularShapes.contains(b)) {
				this.regularShapes.insert(b)
			}
			break;
		default:
		}
		return this
	};
	a.prototype.hideCurrentConnection = function() {
		if (this.currentConnection) {
			this.currentConnection.hidePortsAndHandlers();
			this.currentConnection = null
		}
		return this
	};
	a.prototype.applyZoom = function(f) {
		var d, c, b, e;
		if (f > 0) {
			f -= 1;
			this.prevZoom = this.zoomPropertiesIndex;
			this.zoomPropertiesIndex = f;
			this.zoomFactor = (f * 25 + 50) / 100
		}
		for (d = 0; d < this.customShapes.getSize(); d += 1) {
			c = this.customShapes.get(d);
			c.applyZoom();
			c.paint()
		}
		this.canvas.refreshArray.clear();
		for (d = 0, b = this.connections.getSize(); d < b; d += 1) {
			e = this.connections.get(d);
			e.applyZoom()
		}
		for (d = 0; d < this.regularShapes.getSize(); d += 1) {
			c = this.regularShapes.get(d);
			c.applyZoom();
			c.paint()
		}
		return this
	};
	a.prototype.addConnection = function(b) {
		this.html.appendChild(b.getHTML());
		this.connections.insert(b);
		this.updatedElement = b;
		return this
	};
	a.prototype.removeElements = function() {
		var b, c;
		c = new PMUI.command.CommandDelete(this);
		this.commandStack.add(c);
		c.execute();
		return this
	};
	a.prototype.moveAllChildConnections = function(c) {
		var e, f, d, b;
		if (c.child !== null) {
			for (e = 0; e < c.children.getSize(); e += 1) {
				f = c.children.get(e);
				f.setPosition(f.x, f.y);
				for (d = 0; d < f.getPorts().getSize(); d += 1) {
					b = f.getPorts().get(d);
					b.setPosition(b.x, b.y);
					b.connection.disconnect();
					b.connection.connect();
					b.connection.savePoints()
				}
				this.moveAllChildConnections(f)
			}
		}
		return this
	};
	a.prototype.moveElements = function(c, m, l) {
		var g, f, k, b = 0,
		n = 0,
		d, e = [],
		h = true,
		o;
		switch (m) {
		case "LEFT":
			b = -1;
			break;
		case "RIGHT":
			b = 1;
			break;
		case "TOP":
			n = -1;
			break;
		case "BOTTOM":
			n = 1;
			break
		}
		o = c.getCurrentSelection();
		o.sort(function(j, i) {
			return j.y > i.y
		});
		if (o.get(0).y - 4 + n < 0) {
			h = false
		}
		o.sort(function(j, i) {
			return j.x > i.x
		});
		if (o.get(0).x - 3 + b < 0) {
			h = false
		}
		for (g = 0; g < o.getSize(); g += 1) {
			k = o.get(g);
			e.push(k);
			if (l && typeof l === "function" && !l(k)) {
				h = false
			}
			if (h) {
				k.oldX = k.x;
				k.oldY = k.y;
				k.oldAbsoluteX = k.absoluteX;
				k.oldAbsoluteY = k.absoluteY;
				k.setPosition(k.getX() + b, k.getY() + n);
				k.changePosition(k.oldX, k.oldY, k.oldAbsoluteX, k.oldAbsoluteY);
				for (f = 0; f < k.ports.getSize(); f += 1) {
					d = k.ports.get(f);
					d.setPosition(d.x, d.y);
					d.connection.disconnect().connect();
					d.connection.savePoints()
				}
				this.moveAllChildConnections(k)
			}
		}
		clearTimeout(this.intersectionTimeout);
		this.intersectionTimeout = window.setTimeout(function(j) {
			var i = [],
			p = j || [];
			for (g = 0; g < p.length; g += 1) {
				k = p[g];
				i.push(k)
			}
			while (i.length > 0) {
				k = i.pop();
				for (g = 0; g < k.getChildren().getSize(); g += 1) {
					i.push(k.getChildren().get(g))
				}
				for (f = 0; f < k.ports.getSize(); f += 1) {
					d = k.ports.get(f);
					d.connection.disconnect().connect();
					d.connection.setSegmentMoveHandlers();
					d.connection.checkAndCreateIntersectionsWithAll()
				}
			}
		},
		1000, e);
		return this
	};
	a.prototype.removeFromList = function(b) {
		this.currentSelection.remove(b);
		if (b.family === "CustomShape") {
			this.customShapes.remove(b)
		} else {
			if (b.family === "RegularShape") {
				this.regularShapes.remove(b)
			}
		}
		return this
	};
	a.prototype.fixSnapData = function() {
		this.horizontalSnapper.createSnapData();
		this.verticalSnapper.createSnapData();
		this.horizontalSnapper.sortData();
		this.verticalSnapper.sortData();
		return this
	};
	a.prototype.showOrHideSnappers = function(e) {
		var g = this.horizontalSnapper,
		d = this.verticalSnapper,
		c = e.getAbsoluteX(),
		h = e.getAbsoluteY(),
		f = e.getZoomWidth(),
		b = e.getZoomHeight();
		if (g.binarySearch(h)) {
			g.setPosition(this.getLeftScroll() / this.zoomFactor, h / this.zoomFactor);
			g.show()
		} else {
			if (g.binarySearch(h + b)) {
				g.setPosition(this.getLeftScroll() / this.zoomFactor, (h + b) / this.zoomFactor);
				g.show()
			} else {
				g.hide()
			}
		}
		if (d.binarySearch(c)) {
			d.setPosition(c / this.zoomFactor - this.absoluteX, this.getTopScroll() / this.zoomFactor);
			d.show()
		} else {
			if (d.binarySearch(c + f)) {
				d.setPosition((c + f) / this.zoomFactor, this.getTopScroll() / this.zoomFactor);
				d.show()
			} else {
				d.hide()
			}
		}
		return this
	};
	a.prototype.emptyCurrentSelection = function() {
		var c, b;
		while (this.currentSelection.getSize() > 0) {
			b = this.currentSelection.get(0);
			this.removeFromSelection(b)
		}
		this.sharedConnections.clear();
		return this
	};
	a.prototype.isValidSelection = function(c, b) {
		if (c.parent === null) {
			return b.parent === null
		}
		if (b.parent === null) {
			return false
		}
		return b.parent.id === c.parent.id
	};
	a.prototype.addToSelection = function(c) {
		var d = this.currentSelection,
		b, e, f = d.isEmpty();
		if (!f) {
			b = d.get(0);
			e = this.isValidSelection(b, c)
		} else {
			e = true
		}
		if (!d.contains(c) && e) {
			c.increaseZIndex();
			d.insert(c);
			if (c.family === "CustomShape") {
				this.addToSharedConnections(c)
			}
			c.selected = true;
			c.showOrHideResizeHandlers(true)
		}
		return this
	};
	a.prototype.removeFromSelection = function(b) {
		b.decreaseZIndex();
		this.removeFromSharedConnections(b);
		this.currentSelection.remove(b);
		b.selected = false;
		b.showOrHideResizeHandlers(false);
		return this
	};
	a.prototype.removeFromSharedConnections = function(b) {
		var e, f, d, c = this.sharedConnections;
		for (e = 0; e < b.getChildren().getSize(); e += 1) {
			f = b.getChildren().get(e);
			this.removeFromSharedConnections(f)
		}
		if (b.ports) {
			for (e = 0; e < b.ports.getSize(); e += 1) {
				d = b.ports.get(e).connection;
				if (c.find("id", d.getID())) {
					this.sharedConnections.remove(d)
				}
			}
		}
		return this
	};
	a.prototype.findAncestorInCurrentSelection = function(b) {
		if (this.currentSelection.find("id", b.getID())) {
			return true
		}
		if (!b.parent) {
			return false
		}
		return this.findAncestorInCurrentSelection(b.parent)
	};
	a.prototype.addToSharedConnections = function(b) {
		var f, h, e, g, d, c = this.sharedConnections;
		for (f = 0; f < b.getChildren().getSize(); f += 1) {
			h = b.getChildren().get(f);
			this.addToSharedConnections(h)
		}
		if (b.ports) {
			for (f = 0; f < b.ports.getSize(); f += 1) {
				e = b.ports.get(f).connection;
				g = e.srcPort.parent;
				d = e.destPort.parent;
				if (this.findAncestorInCurrentSelection(g) && this.findAncestorInCurrentSelection(d) && !c.find("id", e.getID())) {
					c.insert(e)
				}
			}
		}
		return this
	};
	a.prototype.removeConnection = function(b) {
		this.connections.remove(b);
		return this
	};
	a.prototype.attachListeners = function() {
		var c = $(this.html).click(this.onClick(this)),
		b = c.parent();
		c.mousedown(this.onMouseDown(this));
		b.scroll(this.onScroll(this, b));
		c.mousemove(this.onMouseMove(this));
		c.mouseup(this.onMouseUp(this));
		c.on("createelement", this.onCreateElement(this));
		c.on("removeelement", this.onRemoveElement(this));
		c.on("changeelement", this.onChangeElement(this));
		c.on("selectelement", this.onSelectElement(this));
		c.on("rightclick", this.onRightClick(this));
		c.on("contextmenu",
		function(d) {
			d.preventDefault()
		});
		this.updateBehaviors();
		return this
	};
	a.prototype.onCreateElementHandler = function(b) {};
	a.prototype.onCreateElement = function(b) {
		return function(d, c) {
			b.onCreateElementHandler(b.updatedElement)
		}
	};
	a.prototype.onRemoveElementHandler = function(b) {
		return true
	};
	a.prototype.onRemoveElement = function(b) {
		return function(d, c) {
			b.onRemoveElementHandler(b.updatedElement.relatedElements)
		}
	};
	a.prototype.onChangeElementHandler = function(b) {};
	a.prototype.onChangeElement = function(b) {
		return function(d, c) {
			b.onChangeElementHandler(b.updatedElement)
		}
	};
	a.prototype.onSelectElementHandler = function(b) {};
	a.prototype.onSelectElement = function(b) {
		return function(d, c) {
			b.onSelectElementHandler(b.updatedElement)
		}
	};
	a.prototype.onRightClickHandler = function(b, c) {};
	a.prototype.onRightClick = function(b) {
		return function(f, g, d) {
			var c = b.relativePoint(g);
			b.updatedElement = d;
			b.onRightClickHandler(b.updatedElement, {
				canvas: c,
				page: {
					x: g.pageX,
					y: g.pageY
				}
			})
		}
	};
	a.prototype.onClick = function(b) {
		return function(i, h) {
			var d = b.currentLabel,
			c, f, f, g;
			if (d) {
				d.loseFocus();
				$(d.textField).focusout()
			}
			f = b.relativePoint(i);
			c = b.getBestConnecion(f);
			if (c !== null) {
				g = b.currentConnection;
				b.emptyCurrentSelection();
				if (g) {
					g.hidePortsAndHandlers()
				}
				c.showPortsAndHandlers();
				b.currentConnection = c
			}
		}
	};
	a.prototype.getBestConnecion = function(b, e) {
		var f = this.getConnections().asArray().length;
		for (var d = 0; d < f; d++) {
			var c = this.getConnections().get(d);
			if (c.hitTest(b)) {
				return c
			}
		}
		return null
	};
	a.prototype.onMouseDown = function(b) {
		return function(f, d) {
			var c = f.pageX - b.getX() + b.getLeftScroll() - b.getAbsoluteX(),
			g = f.pageY - b.getY() + b.getTopScroll() - b.getAbsoluteY();
			f.preventDefault();
			if (f.which === 3) {
				b.rightClick = true;
				$(b.html).trigger("rightclick", [f, b])
			}
			b.isMouseDown = true;
			b.isMouseDownAndMove = false;
			if (b.draggingASegmentHandler) {
				return
			}
			b.emptyCurrentSelection();
			b.hideCurrentConnection();
			b.multipleSelectionHelper.reset();
			b.multipleSelectionHelper.setPosition(c / b.zoomFactor, g / b.zoomFactor);
			b.multipleSelectionHelper.oldX = c;
			b.multipleSelectionHelper.oldY = g;
			b.multipleSelectionHelper.setVisible(true);
			b.multipleSelectionHelper.changeOpacity(0.2)
		}
	};
	a.prototype.onMouseMove = function(b) {
		return function(i, h) {
			if (b.isMouseDown && !b.rightClick) {
				b.isMouseDownAndMove = true;
				var d = i.pageX - b.getX() + b.getLeftScroll() - b.getAbsoluteX(),
				k = i.pageY - b.getY() + b.getTopScroll() - b.getAbsoluteY(),
				g,
				f,
				c,
				j;
				g = Math.min(d, b.multipleSelectionHelper.oldX);
				f = Math.min(k, b.multipleSelectionHelper.oldY);
				c = Math.max(d, b.multipleSelectionHelper.oldX);
				j = Math.max(k, b.multipleSelectionHelper.oldY);
				b.multipleSelectionHelper.setPosition(g / b.zoomFactor, f / b.zoomFactor);
				b.multipleSelectionHelper.setDimension((c - g) / b.zoomFactor, (j - f) / b.zoomFactor)
			}
		}
	};
	a.prototype.onMouseUp = function(b) {
		return function(g, f) {
			var d, c, h;
			if (b.isMouseDownAndMove) {
				d = b.relativePoint(g);
				c = d.x;
				h = d.y;
				b.multipleSelectionHelper.setPosition(Math.min(c, b.multipleSelectionHelper.zoomX) / b.zoomFactor, Math.min(h, b.multipleSelectionHelper.zoomY) / b.zoomFactor);
				if (b.multipleSelectionHelper) {
					b.multipleSelectionHelper.wrapElements()
				}
			} else {
				if (!b.multipleSelectionHelper.wasDragged) {
					b.multipleSelectionHelper.reset().setVisible(false)
				}
				if (b.isMouseDown) {
					b.onClickHandler(b, c, h)
				}
			}
			b.isMouseDown = false;
			b.isMouseDownAndMove = false;
			b.rightClick = false
		}
	};
	a.prototype.onClickHandler = function() {};
	a.prototype.onScroll = function(c, b) {
		return function(f, d) {
			c.setLeftScroll(b.scrollLeft()).setTopScroll(b.scrollTop())
		}
	};
	a.prototype.triggerSelectEvent = function(c) {
		var b, d = [],
		e;
		for (b = 0; b < c.length; b += 1) {
			e = c[b];
			d.push({
				id: e.id,
				type: e.type,
				relatedObject: e
			})
		}
		this.updatedElement = d;
		$(this.html).trigger("selectelement");
		return this
	};
	a.prototype.triggerRightClickEvent = function(b) {
		this.updatedElement = {
			id: b.id,
			type: b.type,
			relatedObject: b
		};
		$(this.html).trigger("rightclick");
		return this
	};
	a.prototype.triggerCreateEvent = function(b, c) {
		this.updatedElement = {
			id: (b && b.id) || null,
			type: (b && b.type) || null,
			relatedObject: b,
			relatedElements: c
		};
		$(this.html).trigger("createelement");
		return this
	};
	a.prototype.triggerRemoveEvent = function(b, c) {
		this.updatedElement = {
			id: (b && b.id) || null,
			type: (b && b.type) || null,
			relatedObject: b,
			relatedElements: c
		};
		$(this.html).trigger("removeelement");
		return this
	};
	a.prototype.triggerDimensionChangeEvent = function(d, c, f, e, b) {
		this.updatedElement = [{
			id: d.id,
			type: d.type,
			fields: [{
				field: "width",
				oldVal: c,
				newVal: e
			},
			{
				field: "height",
				oldVal: f,
				newVal: b
			}],
			relatedObject: d
		}];
		$(this.html).trigger("changeelement");
		return this
	};
	a.prototype.triggerPortChangeEvent = function(b) {
		this.updatedElement = [{
			id: b.getID(),
			type: b.type,
			fields: [{
				field: "x",
				oldVal: b.getOldX(),
				newVal: b.getX()
			},
			{
				field: "y",
				oldVal: b.getOldY(),
				newVal: b.getY()
			},
			{
				field: "parent",
				oldVal: b.getOldParent().getID(),
				newVal: b.getParent().getID()
			},
			{
				field: "state",
				oldVal: b.connection.getOldPoints(),
				newVal: b.connection.savePoints() && b.connection.getPoints()
			}],
			relatedObject: b
		}];
		$(this.html).trigger("changeelement");
		return this
	};
	a.prototype.triggerConnectionStateChangeEvent = function(c) {
		var e = [],
		f = PMUI.util.Point,
		b,
		d;
		c.savePoints();
		for (d = 0; d < c.points.length; d += 1) {
			b = c.points[d];
			e.push(new f(b.x / this.zoomFactor, b.y / this.zoomFactor))
		}
		this.updatedElement = [{
			id: c.getID(),
			type: c.type,
			fields: [{
				field: "state",
				oldVal: c.getOldPoints(),
				newVal: e
			}],
			relatedObject: c
		}];
		return this
	};
	a.prototype.triggerPositionChangeEvent = function(b, e, f) {
		var c, d = [];
		for (c = 0; c < b.length; c += 1) {
			d.push({
				id: b[c].getID(),
				type: b[c].type,
				fields: [{
					field: "x",
					oldVal: e[c].x,
					newVal: f[c].x
				},
				{
					field: "y",
					oldVal: e[c].y,
					newVal: f[c].y
				}],
				relatedObject: b[c]
			})
		}
		this.updatedElement = d;
		$(this.html).trigger("changeelement");
		return this
	};
	a.prototype.triggerTextChangeEvent = function(c, b, d) {
		this.updatedElement = [{
			id: c.id,
			type: c.type,
			parent: c.parent,
			fields: [{
				field: "message",
				oldVal: b,
				newVal: d
			}],
			relatedObject: c
		}];
		$(this.html).trigger("changeelement");
		return this
	};
	a.prototype.triggerParentChangeEvent = function(b, e, f) {
		var c, d = [];
		for (c = 0; c < b.length; c += 1) {
			d.push({
				id: b[c].getID(),
				type: b[c].type,
				fields: [{
					field: "parent",
					oldParent: e[c].parent,
					newVal: f[c].parent
				},
				{
					field: "x",
					oldVal: e[c].x,
					newVal: f[c].x
				},
				{
					field: "y",
					oldVal: e[c].y,
					newVal: f[c].y
				}],
				relatedObject: b[c]
			})
		}
		this.updatedElement = d;
		$(this.html).trigger("changeelement");
		return this
	};
	a.prototype.setTopScroll = function(b) {
		this.topScroll = b;
		return this
	};
	a.prototype.setLeftScroll = function(b) {
		this.leftScroll = b;
		return this
	};
	a.prototype.setZoomFactor = function(b) {
		if (typeof b === "number" && b % 25 === 0 && b > 0) {
			this.zoomFactor = b
		}
		return this
	};
	a.prototype.setCurrentConnection = function(b) {
		if (b.type === "Connection") {
			this.currentConnection = b
		}
		return this
	};
	a.prototype.setShapeFactory = function(b) {
		a.prototype.shapeFactory = b;
		return this
	};
	a.prototype.getZoomFactor = function() {
		return this.zoomFactor
	};
	a.prototype.getZoomPropertiesIndex = function() {
		return this.zoomPropertiesIndex
	};
	a.prototype.getConnectionSegment = function() {
		return this.connectionSegment
	};
	a.prototype.getLeftScroll = function() {
		return this.leftScroll
	};
	a.prototype.getTopScroll = function() {
		return this.topScroll
	};
	a.prototype.getCurrentConnection = function() {
		return this.currentConnection
	};
	a.prototype.getCurrentSelection = function() {
		return this.currentSelection
	};
	a.prototype.getConnections = function() {
		return this.connections
	};
	a.prototype.getSharedConnections = function() {
		return this.sharedConnections
	};
	a.prototype.getCustomShapes = function() {
		return this.customShapes
	};
	a.prototype.getRegularShapes = function() {
		return this.regularShapes
	};
	a.prototype.getMultipleSelectionHelper = function() {
		return this.multipleSelectionHelper
	};
	a.prototype.getHorizontalSnapper = function() {
		return this.horizontalSnapper
	};
	a.prototype.getVerticalSnapper = function() {
		return this.verticalSnapper
	};
	a.prototype.getUpdatedElement = function() {
		return this.updatedElement
	};
	a.prototype.isResizable = function() {
		return false
	};
	a.prototype.getCanvas = function() {
		return this
	};
	a.prototype.undo = function() {
		this.commandStack.undo();
		return this
	};
	a.prototype.redo = function() {
		this.commandStack.redo();
		return this
	};
	a.prototype.stringify = function() {
		var d, b = [],
		e = [],
		c = [],
		g,
		h,
		f;
		for (d = 0; d < this.customShapes.getSize(); d += 1) {
			b.push(this.customShapes.get(d).stringify())
		}
		for (d = 0; d < this.regularShapes.getSize(); d += 1) {
			e.push(this.regularShapes.get(d).stringify())
		}
		for (d = 0; d < this.connections.getSize(); d += 1) {
			c.push(this.connections.get(d).stringify())
		}
		g = f.prototype.stringify.call(this);
		h = {
			customShapes: b,
			regularShapes: e,
			connections: c
		};
		$.extend(true, g, h);
		return g
	};
	a.prototype.addToShapesToCopy = function(c) {
		var d, e, b = c.stringify();
		b.extendedType = c.extendedType;
		this.shapesToCopy.push(b);
		for (d = 0; d < c.getChildren().getSize(); d += 1) {
			e = c.getChildren().get(d);
			this.addToShapesToCopy(e)
		}
		return this
	};
	a.prototype.copy = function() {
		var d, c, b;
		this.shapesToCopy = [];
		for (d = 0; d < this.getCurrentSelection().getSize(); d += 1) {
			c = this.getCurrentSelection().get(d);
			this.addToShapesToCopy(c)
		}
		this.connectionsToCopy = [];
		for (d = 0; d < this.getSharedConnections().getSize(); d += 1) {
			b = this.getSharedConnections().get(d);
			this.connectionsToCopy.push(b.stringify())
		}
		return this
	};
	a.prototype.paste = function() {
		this.parse({
			shapes: this.shapesToCopy,
			connections: this.connectionsToCopy,
			createCommand: true,
			uniqueID: true,
			selectAfterFinish: true,
			prependMessage: "Copy of ",
			diffX: 100,
			diffY: 100
		});
		return this
	};
	a.prototype.shapeFactory = function(c, b) {
		if (this.copyAndPasteReferences[c]) {
			return new this.copyAndPasteReferences[c](b)
		}
		return new PMUI.draw.CustomShape(b)
	};
	a.prototype.connectionFactory = function(c, b) {
		if (c && this.copyAndPasteReferences[c]) {
			return new this.copyAndPasteReferences[c](b)
		}
		return new PMUI.draw.Connection(b)
	};
	a.prototype.transformToTree = function(c) {
		var b = {},
		e, d;
		for (d = 0; d < c.length; d += 1) {
			e = c[d];
			if (!b[e.id]) {
				b[e.id] = []
			}
			if (e.parent) {
				if (!b[e.parent]) {
					b[e.parent] = []
				}
				b[e.parent][e.order] = e.id
			}
		}
		return b
	};
	a.prototype.levelOrderTraversal = function(c, e) {
		var b = [],
		h = [],
		g,
		d = e || this.getID(),
		f;
		b.push(d);
		while (b.length > 0) {
			g = b.shift();
			h.push(g);
			for (f = 0; f < c[g].length; f += 1) {
				b.push(c[g][f])
			}
		}
		return h
	};
	a.prototype.parse = function(e) {
		var l = {
			shapes: [],
			connections: [],
			uniqueID: false,
			selectAfterFinish: false,
			prependMessage: "",
			createCommand: true,
			diffX: 0,
			diffY: 0
		},
		A,
		x,
		v,
		h,
		c,
		z,
		p,
		n,
		k,
		s,
		o,
		D,
		f,
		g,
		B,
		w,
		r,
		d,
		u,
		t,
		b = [],
		q = [],
		m = this.getID(),
		y = {},
		C = {};
		$.extend(true, l, e);
		u = l.diffX;
		t = l.diffY;
		C[m] = this;
		y[m] = m;
		if (l.selectAfterFinish) {
			this.emptyCurrentSelection()
		}
		for (A = 0; A < l.shapes.length; A += 1) {
			p = {};
			$.extend(true, p, l.shapes[A]);
			p.canvas = this;
			h = p.id;
			if (l.uniqueID) {
				p.id = PMUI.generateUniqueId()
			}
			y[h] = p.id;
			if (p.labels) {
				for (x = 0; x < p.labels.length; x += 1) {
					p.labels[x].message = l.prependMessage + p.labels[x].message
				}
			}
			c = this.shapeFactory(p.extendedType, p);
			C[p.id] = c;
			if (!y[p.parent]) {
				this.addElement(c, p.x + u, p.y + t, true)
			} else {
				if (p.parent !== m) {
					C[y[p.parent]].addElement(c, p.x, p.y, true)
				} else {
					C[y[p.parent]].addElement(c, p.x + u, p.y + t, true)
				}
			}
			c.parseHook();
			c.attachListeners();
			d = new PMUI.command.CommandCreate(c);
			d.execute();
			b.push(d)
		}
		for (A = 0; A < l.connections.length; A += 1) {
			k = {};
			$.extend(true, k, l.connections[A]);
			z = k.state || [];
			o = k.srcPort;
			D = C[y[o.parent]];
			f = D.getBorderConsideringLayers();
			B = k.destPort;
			w = C[y[B.parent]];
			r = w.getBorderConsideringLayers();
			if (z.length === 0) {
				z.push({
					x: o.x + D.getAbsoluteX(),
					y: o.y + D.getAbsoluteY()
				});
				z.push({
					x: B.x + w.getAbsoluteX(),
					y: B.y + w.getAbsoluteY()
				})
			}
			s = new PMUI.draw.Port({
				width: 8,
				height: 8
			});
			g = new PMUI.draw.Port({
				width: 8,
				height: 8
			});
			D.addPort(s, z[0].x + u + f - D.getAbsoluteX(), z[0].y + u + f - D.getAbsoluteY());
			w.addPort(g, z[z.length - 1].x + u + r - w.getAbsoluteX(), z[z.length - 1].y + t + r - w.getAbsoluteY(), false, s);
			n = this.connectionFactory(k.type, {
				srcPort: s,
				destPort: g,
				canvas: this,
				segmentStyle: k.segmentStyle
			});
			n.id = k.id || PMUI.generateUniqueId();
			if (l.uniqueID) {
				n.id = PMUI.generateUniqueId()
			}
			n.setSrcDecorator(new PMUI.draw.ConnectionDecorator({
				width: 11,
				height: 11,
				canvas: this,
				decoratorPrefix: k.srcDecoratorPrefix,
				decoratorType: "source",
				parent: n
			}));
			n.setDestDecorator(new PMUI.draw.ConnectionDecorator({
				width: 11,
				height: 11,
				canvas: this,
				decoratorPrefix: k.destDecoratorPrefix,
				decoratorType: "target",
				parent: n
			}));
			d = new PMUI.command.CommandConnect(n);
			q.push(d);
			if (z.length >= 3) {
				n.connect({
					algorithm: "user",
					points: k.state,
					dx: l.diffX,
					dy: l.diffY
				})
			} else {
				n.connect()
			}
			n.setSegmentMoveHandlers();
			this.addConnection(n);
			n.checkAndCreateIntersectionsWithAll();
			s.attachListeners(s);
			g.attachListeners(g);
			this.triggerCreateEvent(n, [])
		}
		if (l.selectAfterFinish) {
			for (v in C) {
				if (C.hasOwnProperty(v)) {
					if (C[v].family !== "Canvas") {
						this.addToSelection(C[v])
					}
				}
			}
		}
		if (l.createCommand) {
			this.commandStack.add(new PMUI.command.CommandPaste(this, {
				stackCommandCreate: b,
				stackCommandConnect: q
			}))
		}
		return this
	};
	a.prototype.getRelativeX = function() {
		return this.x + this.absoluteX
	};
	a.prototype.getRelativeY = function() {
		return this.y + this.absoluteY
	};
	a.prototype.hideAllFocusLabels = function() {
		var d = this.customShapes.getSize(),
		c,
		b;
		for (c = 0; c < d; c += 1) {
			b = this.customShapes.get(c);
			b.labels.get(0).loseFocus()
		}
		return true
	};
	PMUI.extendNamespace("PMUI.draw.Canvas", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b);
		this.xCorners = [0, 0, 0, 0];
		this.yCorners = [0, 0, 0, 0];
		this.xMidPoints = [0, 0, 0, 0];
		this.yMidPoints = [0, 0, 0, 0];
		this.cornerResizeHandlers = new PMUI.util.ArrayList();
		this.midResizeHandlers = new PMUI.util.ArrayList();
		this.center = null;
		this.parent = null;
		this.oldParent = null;
		this.defaultZOrder = 1;
		this.dragging = false;
		this.wasDragged = false;
		this.entered = false;
		this.resizeBehavior = null;
		this.resizing = false;
		this.repainted = false;
		this.fixed = true;
		this.changedContainer = false;
		this.topLeftOnCreation = false;
		this.attachEvents = true;
		a.prototype.init.call(this, b)
	};
	PMUI.inheritFrom("PMUI.draw.BehavioralElement", a);
	a.prototype.type = "Shape";
	a.prototype.family = "Shape";
	a.prototype.noDragBehavior = null;
	a.prototype.regularDragBehavior = null;
	a.prototype.connectionDragBehavior = null;
	a.prototype.customShapeDragBehavior = null;
	a.prototype.cornersIdentifiers = ["nw", "ne", "se", "sw"];
	a.prototype.midPointIdentifiers = ["n", "e", "s", "w"];
	a.prototype.MAX_ZINDEX = 100;
	a.prototype.DEFAULT_RADIUS = 6;
	a.prototype.init = function(b) {
		var c = {
			topLeft: false,
			resizeBehavior: "no",
			resizeHandlers: {
				type: "None",
				total: 4,
				resizableStyle: {
					cssProperties: {
						"background-color": "rgb(0, 255, 0)",
						border: "1px solid black"
					}
				},
				nonResizableStyle: {
					cssProperties: {
						"background-color": "white",
						border: "1px solid black"
					}
				}
			},
			drag: "disabled",
			attachEvents: true
		};
		$.extend(true, c, b);
		if (c.drag !== "disabled") {
			this.setDragBehavior(c.drag)
		} else {
			this.setDragBehavior("nodrag")
		}
		this.setResizeBehavior(c.resizeBehavior);
		this.createHandlers(c.resizeHandlers.type, c.resizeHandlers.total, c.resizeHandlers.resizableStyle, c.resizeHandlers.nonResizableStyle);
		this.topLeftOnCreation = c.topLeft;
		this.attachEvents = c.attachEvents
	};
	a.prototype.createHandlers = function(e, f, c, b) {
		if (e === "Rectangle") {
			var d;
			if (!f || (f !== 8 && f !== 4 && f !== 0)) {
				f = 4
			}
			for (d = 0; d < f && d < 4; d += 1) {
				this.cornerResizeHandlers.insert(new PMUI.draw.ResizeHandler({
					parent: this,
					zOrder: PMUI.util.Style.MAX_ZINDEX + 3,
					representation: new PMUI.draw.Rectangle(),
					orientation: this.cornersIdentifiers[d],
					resizableStyle: c,
					nonResizableStyle: b
				}))
			}
			f -= 4;
			for (d = 0; d < f; d += 1) {
				this.midResizeHandlers.insert(new PMUI.draw.ResizeHandler({
					parent: this,
					zOrder: PMUI.util.Style.MAX_ZINDEX + 3,
					representation: new PMUI.draw.Rectangle(),
					orientation: this.midPointIdentifiers[d],
					resizableStyle: c,
					nonResizableStyle: b
				}))
			}
		}
		return this
	};
	a.prototype.updateHandlers = function() {
		var c, b;
		for (b = 0; b < this.cornerResizeHandlers.getSize(); b += 1) {
			c = this.cornerResizeHandlers.get(b);
			c.setPosition(this.xCorners[b] - Math.round(c.width / 2) - 1, this.yCorners[b] - Math.round(c.height / 2) - 1)
		}
		for (b = 0; b < this.midResizeHandlers.getSize(); b += 1) {
			c = this.midResizeHandlers.get(b);
			c.setPosition(this.xMidPoints[b] - Math.round(c.width / 2) - 1, this.yMidPoints[b] - Math.round(c.height / 2) - 1)
		}
		return this
	};
	a.prototype.showOrHideResizeHandlers = function(c) {
		var b;
		if (!c) {
			c = false
		}
		for (b = 0; b < this.cornerResizeHandlers.getSize(); b += 1) {
			this.cornerResizeHandlers.get(b).setVisible(c)
		}
		for (b = 0; b < this.midResizeHandlers.getSize(); b += 1) {
			this.midResizeHandlers.get(b).setVisible(c)
		}
		return this
	};
	a.prototype.applyStyleToHandlers = function(c) {
		var b;
		for (b = 0; b < this.cornerResizeHandlers.getSize(); b += 1) {
			this.cornerResizeHandlers.get(b)[c].applyStyle()
		}
		for (b = 0; b < this.midResizeHandlers.getSize(); b += 1) {
			this.midResizeHandlers.get(b)[c].applyStyle()
		}
		return this
	};
	a.prototype.attachListeners = function() {
		var b = $(this.html);
		if (this.attachEvents && !this.canvas.readOnly) {
			b.on("mousedown", this.onMouseDown(this));
			b.on("mouseup", this.onMouseUp(this));
			b.on("click", this.onClick(this));
			this.updateBehaviors()
		}
		return this
	};
	a.prototype.onMouseDown = function(b) {
		return function(d, c) {}
	};
	a.prototype.onMouseUp = function(b) {
		return function(d, c) {}
	};
	a.prototype.onClick = function(b) {
		return function(d, c) {}
	};
	a.prototype.createHTML = function() {
		var b;
		a.superclass.prototype.createHTML.call(this);
		for (b = 0; b < this.cornerResizeHandlers.getSize(); b += 1) {
			this.addResizeHandler(this.cornerResizeHandlers.get(b), this.xCorners[b], this.yCorners[b])
		}
		for (b = 0; b < this.midResizeHandlers.getSize(); b += 1) {
			this.addResizeHandler(this.midResizeHandlers.get(b), this.xMidPoints[b], this.yMidPoints[b])
		}
		return this.html
	};
	a.prototype.isDraggable = function() {
		return this.drag && this.drag.type !== "NoDragBehavior"
	};
	a.prototype.updateBehaviors = function() {
		a.superclass.prototype.updateBehaviors.call(this);
		if (this.drag) {
			this.drag.attachDragBehavior(this)
		}
		if (this.resizeBehavior) {
			this.resizeBehavior.init(this)
		}
		return this
	};
	a.prototype.addResizeHandler = function(c, b, d) {
		if (!this.html) {
			return
		}
		this.html.appendChild(c.getHTML());
		c.setPosition(b - Math.round(c.width / 2) - 1, d - Math.round(c.height / 2) - 1);
		if (this.isResizable()) {
			c.setCategory("resizable")
		}
		return this
	};
	a.prototype.paint = function() {
		var b, c;
		for (b = 0; b < this.cornerResizeHandlers.getSize(); b += 1) {
			this.cornerResizeHandlers.get(b).paint()
		}
		for (b = 0; b < this.midResizeHandlers.getSize(); b += 1) {
			this.midResizeHandlers.get(b).paint()
		}
		if (this.resizeBehavior) {
			c = this.resizeBehavior.type === "NoResizeBehavior" ? "nonResizableStyle": "resizableStyle";
			this.applyStyleToHandlers(c)
		}
		return this
	};
	a.prototype.updateHTML = function() {
		return this
	};
	a.prototype.saveAndDestroy = function() {
		this.html = $(this.html).detach()[0];
		this.canvas.removeFromList(this);
		return this
	};
	a.prototype.updateSize = function(k) {
		var f = this.children,
		c = f.getDimensionLimit(),
		h = c[3],
		n = c[0],
		q = c[1],
		d = c[2],
		p = this.getX(),
		l = this.getY(),
		j = this.getWidth(),
		b = this.getHeight(),
		i,
		o = 0,
		m = 0,
		e = false,
		g = false;
		if (k !== "undefined") {
			i = k
		} else {
			i = 15
		}
		if (h < 0) {
			o = i - h;
			e = true;
			this.oldX = this.x;
			this.oldAbsoluteX = this.x;
			this.oldY = this.y;
			this.oldAbsoluteY = this.absoluteY
		}
		if (n < 0) {
			m = i - n;
			e = true;
			this.oldX = this.x;
			this.oldAbsoluteX = this.x;
			this.oldY = this.y;
			this.oldAbsoluteY = this.absoluteY
		}
		p -= o;
		l -= m;
		j += o;
		b += m;
		if (q > this.width) {
			if (this instanceof PMParallel) {
				j += q - this.width
			} else {
				j += q - this.width + i
			}
			g = true;
			this.oldWidth = this.width
		}
		if (d > this.height) {
			b += d - this.height + i;
			g = true;
			this.oldHeight = this.height
		}
		this.setPosition(p, l);
		this.setDimension(j, b);
		if (e) {
			this.changePosition(this.oldX, this.oldY, this.absoluteX, this.absoluteY)
		}
		if (g) {
			this.changeSize(this.oldWidth, this.oldHeight)
		}
		this.updateChildrenPosition(o, m);
		return this
	};
	a.prototype.applyZoom = function() {
		this.refreshShape();
		return this
	};
	a.prototype.setDimension = function(c, b) {
		a.superclass.prototype.setDimension.call(this, c, b);
		if (this.xCorners) {
			this.xCorners = [0, Math.round(this.zoomWidth), Math.round(this.zoomWidth), 0];
			this.yCorners = [0, 0, Math.round(this.zoomHeight), Math.round(this.zoomHeight)];
			this.xMidPoints = [Math.round(this.zoomWidth / 2), Math.round(this.zoomWidth), Math.round(this.zoomWidth / 2), 0];
			this.yMidPoints = [0, Math.round(this.zoomHeight / 2), Math.round(this.zoomHeight), Math.round(this.zoomHeight / 2)];
			this.updateHandlers()
		}
		return this
	};
	a.prototype.changeParent = function(h, g, d, c, f, e) {
		var b = [{
			field: "x",
			oldVal: h,
			newVal: this.x
		},
		{
			field: "y",
			oldVal: g,
			newVal: this.y
		},
		{
			field: "absoluteX",
			oldVal: d,
			newVal: this.absoluteX
		},
		{
			field: "absoluteY",
			oldVal: c,
			newVal: this.absoluteY
		},
		{
			field: "parent",
			oldVal: f,
			newVal: this.parent
		}];
		e.updatedElement = {
			id: this.id,
			type: this.type,
			fields: b,
			relatedObject: this
		};
		$(e.html).trigger("changeelement");
		return this
	};
	a.prototype.changeSize = function(c, e) {
		var d = this.canvas,
		b = [{
			field: "width",
			oldVal: c,
			newVal: this.width
		},
		{
			field: "height",
			oldVal: e,
			newVal: this.height
		}];
		d.updatedElement = {
			id: this.id,
			type: this.type,
			fields: b,
			relatedObject: this
		};
		$(d.html).trigger("changeelement");
		return this
	};
	a.prototype.changePosition = function(g, f, d, c) {
		var e = this.canvas,
		b = [{
			field: "x",
			oldVal: g,
			newVal: this.x
		},
		{
			field: "y",
			oldVal: f,
			newVal: this.y
		},
		{
			field: "absoluteX",
			oldVal: d,
			newVal: this.absoluteX
		},
		{
			field: "absoluteY",
			oldVal: c,
			newVal: this.absoluteY
		}];
		e.updatedElement = [{
			id: this.id,
			type: this.type,
			fields: b,
			relatedObject: this
		}];
		$(e.html).trigger("changeelement");
		return this
	};
	a.prototype.setFixed = function(b) {
		if (typeof b === "boolean") {
			this.fixed = b
		}
		return this
	};
	a.prototype.fixZIndex = function(j, k) {
		var f, c, b, l, e, h, g, d;
		d = j.parent.html.style.zIndex;
		j.setZOrder(parseInt(d, 10) + k + parseInt(j.defaultZOrder, 10));
		for (f = 0; f < j.children.getSize(); f += 1) {
			c = j.children.get(f);
			c.fixZIndex(c, 0)
		}
		if (j.ports) {
			for (f = 0; f < j.ports.getSize(); f += 1) {
				b = j.ports.get(f);
				l = b.connection.srcPort.parent;
				e = b.connection.destPort.parent;
				h = parseInt(l.html.style.zIndex, 10);
				g = parseInt(e.html.style.zIndex, 10);
				b.connection.style.addProperties({
					zIndex: Math.max(h + 1, g + 1)
				})
			}
		}
		return this
	};
	a.prototype.increaseZIndex = function() {
		this.fixZIndex(this, PMUI.util.Style.MAX_ZINDEX);
		return this
	};
	a.prototype.decreaseZIndex = function() {
		this.fixZIndex(this, 0);
		return this
	};
	a.prototype.increaseParentZIndex = function(b) {
		if (b.family !== "Canvas") {
			b.style.addProperties({
				zIndex: parseInt(b.html.style.zIndex, 10) + 1
			});
			b.increaseParentZIndex(b.parent)
		}
		return this
	};
	a.prototype.decreaseParentZIndex = function(b) {
		if (b && b.family !== "Canvas") {
			b.style.addProperties({
				zIndex: parseInt(b.html.style.zIndex, 10) - 1
			});
			b.decreaseParentZIndex(b.parent)
		}
		return this
	};
	a.prototype.setResizeBehavior = function(c) {
		var b = new PMUI.behavior.BehaviorFactory({
			products: {
				regularresize: PMUI.behavior.RegularResizeBehavior,
				Resize: PMUI.behavior.RegularResizeBehavior,
				yes: PMUI.behavior.RegularResizeBehavior,
				resize: PMUI.behavior.RegularResizeBehavior,
				noresize: PMUI.behavior.NoResizeBehavior,
				NoResize: PMUI.behavior.NoResizeBehavior,
				no: PMUI.behavior.NoResizeBehavior
			},
			defaultProduct: "noresize"
		});
		this.resizeBehavior = b.make(c);
		if (this.html) {
			this.resizeBehavior.init(this)
		}
		return this
	};
	a.prototype.isResizable = function() {
		return this.resizeBehavior && this.resizeBehavior.type !== "NoResizeBehavior"
	};
	a.prototype.refreshShape = function() {
		this.setPosition(this.x, this.y).setDimension(this.width, this.height);
		return this
	};
	a.prototype.refreshConnections = function() {
		return this
	};
	a.prototype.refreshChildrenPositions = function(b) {
		var d, c = this.children,
		g, e = [],
		f = [];
		for (d = 0; d < c.getSize(); d += 1) {
			g = c.get(d);
			g.setPosition(g.getX(), g.getY());
			if (b) {
				g.refreshConnections(false)
			}
			e.push(g);
			f.push({
				x: g.getX(),
				y: g.getY()
			});
			g.refreshChildrenPositions(b)
		}
		return this
	};
	a.prototype.fixConnectionsOnResize = function(c, b) {
		var f, e, h, d, g = this.canvas.zoomFactor;
		if (b) {
			if (this.ports) {
				for (f = 0; f < this.ports.getSize(); f += 1) {
					e = this.ports.get(f);
					d = e.connection;
					this.recalculatePortPosition(e);
					d.disconnect().connect();
					if (!this.resizing) {
						d.setSegmentMoveHandlers();
						d.checkAndCreateIntersectionsWithAll()
					}
				}
			}
		} else {
			if (this.ports) {
				for (f = 0; f < this.ports.getSize(); f += 1) {
					e = this.ports.get(f);
					d = e.connection;
					e.setPosition(e.x, e.y);
					d.disconnect().connect();
					if (!this.resizing) {
						d.setSegmentMoveHandlers();
						d.checkAndCreateIntersectionsWithAll()
					}
				}
			}
		}
		for (f = 0; f < this.children.getSize(); f += 1) {
			h = this.children.get(f);
			h.setPosition(h.x, h.y);
			h.fixConnectionsOnResize(h.resizing, false)
		}
		return this
	};
	a.prototype.stringify = function() {
		var d = a.superclass.prototype.stringify.call(this),
		b = (this.savedOptions.resizeHandlers && this.savedOptions.resizeHandlers.type) || "Rectangle",
		c = (this.savedOptions.resizeHandlers && this.savedOptions.resizeHandlers.total) || 4,
		e = {
			resizeBehavior: this.savedOptions.resizeBehavior,
			resizeHandlers: {
				type: b,
				total: c
			}
		};
		$.extend(true, d, e);
		return d
	};
	a.prototype.setCenter = function(b) {
		if (b instanceof PMUI.util.Point) {
			this.center = b
		} else {
			throw new Error("setCenter():  argument is not an instance of Point")
		}
		return this
	};
	a.prototype.setParent = function(c, b) {
		if (c) {
			if (this.canvas && b) {
				this.canvas.updatedElement = {
					id: this.id,
					type: this.type,
					fields: [{
						field: "parent",
						oldVal: this.parent,
						newVal: c
					}]
				};
				$(this.canvas.html).trigger("changeelement")
			}
			this.parent = c
		}
		return this
	};
	a.prototype.setOldParent = function(b) {
		this.oldParent = b;
		return this
	};
	a.prototype.getCenter = function() {
		return this.center
	};
	a.prototype.getParent = function() {
		return this.parent
	};
	a.prototype.getOldParent = function() {
		return this.oldParent
	};
	a.prototype.getHandlesIDs = function() {
		var b = {},
		c;
		for (c = 0; c < this.midPointIdentifiers.length; c += 1) {
			b[this.midPointIdentifiers[c]] = "#" + this.midPointIdentifiers[c] + this.id + "resizehandler"
		}
		for (c = 0; c < this.cornersIdentifiers.length; c += 1) {
			b[this.cornersIdentifiers[c]] = "#" + this.cornersIdentifiers[c] + this.id + "resizehandler"
		}
		return b
	};
	a.prototype.applyBehaviors = function() {
		if (this.html) {
			if (this.drag) {
				this.drag.attachDragBehavior(this)
			}
			if (this.drop) {
				this.drop.attachDropBehavior(this)
			}
			if (this.resizeBehavior) {
				this.resizeBehavior.init(this)
			}
		}
		return this
	};
	PMUI.extendNamespace("PMUI.draw.Shape", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b);
		this.xPercentage = 0;
		this.yPercentage = 0;
		this.message = "";
		this.orientation = "";
		this.text = null;
		this.updateParent = false;
		this.overflow = false;
		this.onFocus = false;
		this.location = "";
		this.diffX = 0;
		this.diffY = 0;
		this.fontSizeOnZoom = [];
		this.fontSize = 0;
		this.textField = null;
		this.initialWidth = null;
		this.minHeight = null;
		a.prototype.init.call(this, b)
	};
	PMUI.inheritFrom("PMUI.draw.Shape", a);
	a.prototype.type = "Label";
	a.prototype.lineHeight = 20;
	a.prototype.init = function(b) {
		var c = {
			message: "New Label",
			orientation: "horizontal",
			fontFamily: "微软雅黑",
			size: 0,
			position: {
				location: "none",
				diffX: 0,
				diffY: 0
			},
			overflow: false,
			updateParent: false,
			parent: null
		};
		this.fontSizeOnZoom = [6, 8, 10, 13, 15];
		$.extend(true, c, b);
		this.setMessage(c.message).setOverflow(c.overflow).setMinHeight(c.minHeight).setUpdateParent(c.updateParent).setOrientation(c.orientation).setFontFamily(c.fontFamily).setFontSize(c.size).setParent(c.parent).setLabelPosition(c.position.location, c.position.diffX, c.position.diffY)
	};
	a.prototype.attachListeners = function() {
		var b = $(this.html);
		var b = $(this.text);
		var c = $(this.textField);
		if (!this.html) {
			return this
		}
		a.superclass.prototype.attachListeners.call(this);
		if (!this.getCanvas().readOnly) {
			$(c).mousedown(function(d) {
				d.stopPropagation()
			});
			$(c).mouseup(function(d) {
				d.stopPropagation()
			});
			$(c).click(function(d) {
				d.stopPropagation()
			})
		}
		return this
	};
	a.prototype.createHTML = function() {
		a.superclass.prototype.createHTML.call(this);
		this.html.style.textAlign = "center";
		this.html.style.align = "center";
		this.html.style.fontFamily = this.fontFamily;
		this.html.style.fontSize = "12px";
		this.textField = document.createElement("input");
		this.textField.style.width = "200px";
		this.textField.style.position = "absolute";
		this.textField.style.display = "none";
		this.text = document.createElement("span");
		this.text.style.width = "auto";
		this.text.style.height = "auto";
		this.text.style.lineHeight = this.lineHeight * this.canvas.zoomFactor + "px";
		this.text.innerHTML = this.message;
		this.html.appendChild(this.text);
		this.html.appendChild(this.textField);
		this.html.style.zIndex = "120";
		return this.html
	};
	a.prototype.paint = function() {
		var b = $(this.html);
		this.text.style.lineHeight = this.lineHeight * this.canvas.zoomFactor + "px";
		this.textField.value = this.message;
		this.text.innerHTML = this.message;
		this.html.style.verticalAlign = "middle";
		if (this.overflow) {
			this.html.style.overflow = "hidden"
		} else {
			if (!isIE8()) {
				this.html.style.overflow = "none"
			}
		}
		this.displayText(true);
		if (this.orientation === "vertical") {
			b.addClass("rotateText")
		} else {
			b.removeClass("rotateText")
		}
		if (this.parent.onUpdateLabel) {
			this.parent.onUpdateLabel()
		}
		return this
	};
	a.prototype.displayText = function(g, f) {
		var d = 0,
		c = 0,
		b;
		if (g) {
			this.text.style.display = "block";
			this.textField.style.display = "none";
			if (this.orientation === "vertical") {
				this.textField.style.left = "0px"
			}
		} else {
			this.textField.style.display = "block";
			if (this.orientation === "vertical") {
				this.textField.style.left = this.width / 2 + "px";
				if (f) {
					d = this.canvas.getTopScroll() + this.parent.getAbsoluteY() + this.parent.getZoomHeight() / 2;
					c = f.pageY - this.canvas.getZoomY();
					b = (c - d);
					this.textField.style.top = b + "px"
				}
			}
			this.text.style.display = "none"
		}
		return this
	};
	a.prototype.setMessage = function(b) {
		this.message = b;
		if (this.text) {
			this.text.innerHTML = this.message;
			this.textField.value = this.message
		}
		return this
	};
	a.prototype.getMessage = function() {
		return this.message
	};
	a.prototype.setMinHeight = function(b) {
		this.minHeight = b;
		return this
	};
	a.prototype.setOrientation = function(c) {
		var b;
		this.orientation = c;
		if (!this.html) {
			return this
		}
		b = $(this.html);
		if (c === "vertical") {
			b.addClass("rotateText")
		} else {
			b.removeClass("rotateText")
		}
		return this
	};
	a.prototype.getOrientation = function() {
		return this.orientation
	};
	a.prototype.setFontFamily = function(b) {
		this.fontFamily = b;
		if (this.html) {
			this.html.style.fontFamily = this.fontFamily
		}
		return this
	};
	a.prototype.setFontSize = function(b) {
		if (b === 0) {
			this.fontSize = this.getZoomFontSize()
		} else {
			this.fontSize = b
		}
		if (this.html) {
			this.html.style.fontSize = this.fontSize + "pt"
		}
		return this
	};
	a.prototype.setUpdateParent = function(b) {
		this.updateParent = b;
		return this
	};
	a.prototype.setOverflow = function(b) {
		this.overflow = b;
		return this
	};
	a.prototype.setLabelPosition = function(g, n, m) {
		var o, l, f, c = this.zoomWidth,
		s = this.zoomHeight,
		q = this.parent,
		r, h, e = this.canvas.zoomFactor,
		j = 4 * e,
		p = ["top-left", "top", "top-right", "center-left", "center", "center-right", "bottom-left", "bottom", "bottom-right"],
		b,
		d = (this.orientation === "vertical") ? 1 : 0,
		k;
		if (!g || g === "") {
			g = "top-left"
		}
		if (n === undefined || n === null) {
			n = 0
		}
		if (m === undefined || m === null) {
			m = 0
		}
		if (q && q.family !== "Canvas") {
			r = q.getZoomWidth();
			h = q.getZoomHeight();
			b = [{
				x: c / 2,
				y: 0
			},
			{
				x: 0,
				y: s / 2
			}];
			k = [{
				x: -c / 2,
				y: 0
			},
			{
				x: r / 2 - c / 2,
				y: 0
			},
			{
				x: r - c / 2,
				y: 0
			},
			{
				x: -c / 2,
				y: h / 2 - s / 2
			},
			{
				x: r / 2 - this.zoomWidth / 2,
				y: h / 2 - this.zoomHeight / 2
			},
			{
				x: r - c,
				y: h / 2 - s / 2
			},
			{
				x: -c / 2,
				y: h - j
			},
			{
				x: r / 2 - c / 2,
				y: h - j
			},
			{
				x: r - c / 2,
				y: h - j
			}];
			for (f = 0; f < 9; f += 1) {
				if (g === p[f]) {
					this.setPosition(k[f].x / e + n, k[f].y / e + m);
					break
				}
			}
		}
		this.location = g;
		this.diffX = n;
		this.diffY = m;
		return this
	};
	a.prototype.getFocus = function(b) {
		var c = $(this.textField);
		this.displayText(false, b);
		this.canvas.currentLabel = this;
		$(c).select();
		this.onFocus = true;
		$label = $(this.html);
		$label.removeClass("rotateText");
		if (this.parent.corona) {
			this.canvas.hideAllCoronas();
			this.canvas.cancelConnect()
		}
		return this
	};
	a.prototype.loseFocus = function() {
		var b;
		this.canvas.currentLabel = null;
		if (this.textField.value !== this.message) {
			if(this.message=="服务发起人"){
				alert("“服务发起人”节点名称不可修改！");
				this.textField.value = this.message;
			}else if(this.textField.value == "服务发起人"){
				alert("节点名称不可修改为“服务发起人”！");
				this.textField.value = this.message;
			}
			b = new PMUI.command.CommandEditLabel(this, this.textField.value);
			b.execute();
			this.canvas.commandStack.add(b);
			this.setLabelPosition(this.location, this.diffX, this.diffY);
			if (patternFlag == "FormServerDesigner") {
				$("#propertyNodeName").val(this.textField.value)
			}
		}
		this.paint();
		this.onFocus = false;
		if (this.orientation === "vertical") {
			$label = $(this.html);
			$label.addClass("rotateText")
		}
		return this
	};
	a.prototype.onClick = function(b) {
		return function(d, c) {
			if (b.parent.family === "Canvas") {
				d.stopPropagation()
			}
			if (b.onFocus) {
				d.stopPropagation()
			}
		}
	};
	a.prototype.onDblClick = function(b) {
		return function(g, f) {
			var d = b.getCanvas(),
			c = $(b.html);
			if (d.currentLabel) {
				d.currentLabel.loseFocus()
			}
			b.getFocus(g);
			g.stopPropagation()
		}
	};
	a.prototype.getZoomFontSize = function() {
		var b = this.canvas;
		this.fontSize = this.fontSizeOnZoom[b.zoomPropertiesIndex];
		return this.fontSize
	};
	a.prototype.parseMessage = function() {
		var c, e = 0,
		b = [],
		d;
		while (this.message.charAt(e) === " ") {
			e += 1
		}
		d = 0;
		for (c = e; c < this.message.length; c += 1) {
			if (this.message.charAt(c) === " ") {
				b.push(d);
				d = 0
			} else {
				d += 1
			}
		}
		b.push(d);
		return b
	};
	a.prototype.updateDimension = function(e) {
		var c = this.width || $(this.text).width(),
		d,
		b;
		c = (this.orientation === "vertical") ? this.parent.height: this.zoomWidth;
		if (c === this.parent.width) {
			c = c * 0.9
		}
		if (c < 10) {
			d = this.parent.getWidth() * 0.9;
			this.initialWidth = this.parent.getWidth() * 0.9
		} else {
			d = c
		}
		b = $(this.text).height();
		this.setDimension(d / this.canvas.zoomFactor, b / this.canvas.zoomFactor);
		if (this.updateParent) {
			this.updateParentDimension()
		}
		this.setLabelPosition(this.location, this.diffX, this.diffY);
		this.width = d;
		return this
	};
	a.prototype.applyZoom = function() {
		var b = this.canvas;
		this.setFontSize(0);
		this.updateDimension();
		return this
	};
	a.prototype.updateParentDimension = function() {
		if (this.orientation === "vertical") {
			this.updateVertically()
		} else {
			this.updateHorizontally()
		}
		if (this.parent.html) {
			this.parent.paint()
		}
		return this
	};
	a.prototype.updateVertically = function() {
		var f = 5,
		d = this.parent,
		b = this.zoomWidth,
		c, e = this.canvas.zoomFactor;
		if (this.minHeight || this.maxHeight) {
			if (this.zoomHeight < this.maxHeight && this.zoomHeight > this.minHeight) {
				c = this.zoomHeight
			}
			if (this.zoomHeight > this.maxHeight) {
				c = this.maxHeight
			}
			if (this.zoomHeight < this.minHeight) {
				c = this.minHeight
			}
			if (this.zoomHeight > this.minHeight) {
				c = this.zoomHeight
			}
		} else {
			c = this.zoomHeight
		}
		d.setDimension(d.width, c / e);
		d.updateChildrenPosition(0, 0);
		d.refreshConnections();
		this.setLabelPosition(this.location, this.diffX, this.diffY);
		return this
	};
	a.prototype.updateHorizontally = function() {
		var g = 5,
		d = this.parent,
		b = this.zoomWidth,
		h = this.zoomHeight,
		f, c, e = this.canvas.zoomFactor;
		if (b > d.zoomWidth - g * 2) {
			f = b + g * 2
		} else {
			f = d.zoomWidth
		}
		if (h > d.zoomHeight - g * 2) {
			c = h + g * 2
		} else {
			c = d.zoomHeight
		}
		d.refreshConnections();
		this.setLabelPosition(this.location, this.diffX, this.diffY);
		return this
	};
	a.prototype.stringify = function() {
		var b = {},
		c = {
			id: this.getID(),
			message: this.getMessage(),
			orientation: this.getOrientation(),
			position: {
				location: this.location,
				diffX: this.diffX,
				diffY: this.diffY
			}
		};
		$.extend(true, b, c);
		return b
	};
	PMUI.extendNamespace("PMUI.draw.Label", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function(b) {
		this.layers = new PMUI.util.ArrayList();
		a.superclass.call(this, b);
		this.ports = new PMUI.util.ArrayList();
		this.labels = new PMUI.util.ArrayList();
		this.zoomProperties = new PMUI.util.ArrayList();
		this.limits = [0, 0, 0, 0];
		this.border = [{
			x: 0,
			y: 0
		},
		{
			x: 0,
			y: 0
		},
		{
			x: 0,
			y: 0
		},
		{
			x: 0,
			y: 0
		}];
		this.dragType = this.CANCEL;
		this.startConnectionPoint = null;
		this.connectAtMiddlePoints = null;
		this.previousXDragPosition = 0;
		this.previousYDragPosition = 0;
		this.connectionType = null;
		a.prototype.init.call(this, b)
	};
	PMUI.inheritFrom("PMUI.draw.Shape", a);
	a.prototype.type = "CustomShape";
	a.prototype.family = "CustomShape";
	a.prototype.containerDropBehavior = null;
	a.prototype.connectionDropBehavior = null;
	a.prototype.noDropBehavior = null;
	a.prototype.CONNECT = 1;
	a.prototype.DRAG = 2;
	a.prototype.CANCEL = 0;
	a.prototype.init = function(b) {
		var d = {
			connectAtMiddlePoints: true,
			layers: [],
			labels: [],
			connectionType: "regular",
			drag: "customshapedrag"
		},
		c;
		this.limits = [5, 5, 5, 5, 5];
		this.setStartConnectionPoint(new PMUI.util.Point(0, 0));
		$.extend(true, d, b);
		for (c = 0; c < d.layers.length; c += 1) {
			this.createLayer(d.layers[c])
		}
		for (c = 0; c < d.labels.length; c += 1) {
			this.createLabel(d.labels[c])
		}
		this.setConnectAtMiddlePoints(d.connectAtMiddlePoints).setConnectionType(d.connectionType)
	};
	a.prototype.createLayer = function(b) {
		var c;
		b.parent = this;
		c = new PMUI.draw.Layer(b);
		this.addLayer(c);
		return c
	};
	a.prototype.createLabel = function(c) {
		var b;
		c.canvas = this.canvas;
		c.parent = this;
		if (c.width === 0) {
			c.width = this.width * 0.9
		}
		b = new PMUI.draw.Label(c);
		this.addLabel(b);
		return b
	};
	a.prototype.addLabel = function(b) {
		if (this.html) {
			b.parent = this;
			this.html.appendChild(b.getHTML())
		}
		if (!this.labels.contains(b)) {
			this.labels.insert(b)
		}
	};
	a.prototype.createHTML = function() {
		var c, b;
		a.superclass.prototype.createHTML.call(this);
		this.style.addClasses(["custom_shape"]);
		this.layers.sort(PMUI.draw.Layer.prototype.comparisonFunction);
		for (c = 0; c < this.layers.getSize(); c += 1) {
			this.html.appendChild(this.layers.get(c).getHTML())
		}
		for (c = 0; c < this.labels.getSize(); c += 1) {
			b = this.labels.get(c);
			this.addLabel(b);
			b.attachListeners()
		}
		return this.html
	};
	a.prototype.attachListeners = function() {
		if (this.html === null) {
			return this
		}
		if (!this.canvas.readOnly) {
			var b = $(this.html).click(this.onClick(this));
			b.on("mousedown", this.onMouseDown(this));
			b.mousemove(this.onMouseMove(this));
			b.mouseup(this.onMouseUp(this));
			b.on("contextmenu",
			function(c) {
				c.preventDefault()
			});
			this.updateBehaviors()
		}
		return this
	};
	a.prototype.paint = function() {
		var c, b;
		a.superclass.prototype.paint.call(this);
		for (c = 0; c < this.layers.getSize(); c += 1) {
			this.layers.get(c).paint()
		}
		for (c = 0; c < this.ports.getSize(); c += 1) {
			this.ports.get(c).paint()
		}
		for (c = 0; c < this.labels.getSize(); c += 1) {
			b = this.labels.get(c);
			b.paint()
		}
		return this
	};
	a.prototype.updateHTML = function() {
		var c, b;
		this.setDimension(this.width, this.height);
		for (c = 0; c < this.labels.getSize(); c += 1) {
			b = this.labels.get(c);
			b.paint();
			b.updateDimension()
		}
		return this
	};
	a.prototype.containsElement = function(c, e) {
		var d, b;
		for (d = 0, b = e.length; d < b; d += 1) {
			if (e[d].getID() === c.getID()) {
				return true
			}
		}
		return false
	};
	a.prototype.refreshConnections = function(k, c, j) {
		var e, b, h = this.ports,
		d, f, g;
		if (c != undefined) {
			for (e = 0; e < h.getSize(); e += 1) {
				d = h.get(e);
				d.setPosition(d.getX(), d.getY());
				b = d.connection;
				f = b.getSrcPort().parent;
				g = b.getDestPort().parent;
				if (! (this.containsElement(f, c) && this.containsElement(g, c))) {
					b.reconnectManhattah(k);
					b.setSegmentMoveHandlers().checkAndCreateIntersectionsWithAll();
					this.canvas.triggerConnectionStateChangeEvent(b)
				} else {
					if (j) {
						if (!this.canvas.refreshArray.contains(b)) {
							b.canvas.refreshArray.insert(b)
						}
					}
				}
			}
		}
		return this
	};
	a.prototype.updateLayers = function() {
		var d, b, c;
		for (d = 0; d < this.getLayers().getSize(); d += 1) {
			c = this.getLayers().get(d);
			c.setProperties()
		}
		return this
	};
	a.prototype.findLayerPosition = function(f) {
		var c = null,
		b = 10000000,
		e, g, d;
		for (e = 0; e < this.layers.getSize(); e += 1) {
			g = this.layers.get(e);
			d = g.getPriority();
			if (d > f.getPriority()) {
				if (b > d) {
					b = d;
					c = g
				}
			}
		}
		return c
	};
	a.prototype.addLayer = function(c) {
		var b = this.findLayerPosition(c);
		if (this.html) {
			if (!b) {
				this.html.appendChild(c.getHTML())
			} else {
				this.html.insertBefore(c.getHTML(), b.getHTML())
			}
			c.paint()
		}
		this.layers.insert(c);
		return this
	};
	a.prototype.findLayer = function(b) {
		return this.layers.find("id", b)
	};
	a.prototype.setDimension = function(c, b) {
		a.superclass.prototype.setDimension.call(this, c, b);
		this.updateLabels();
		this.updateLayers();
		return this
	};
	a.prototype.updateLabels = function() {};
	a.prototype.hideLayer = function(b) {
		var c;
		if (!b || typeof b !== "string") {
			return this
		}
		c = this.findLayer(b);
		if (!c) {
			return this
		}
		c.setVisible(false);
		return this
	};
	a.prototype.showLayer = function(b) {
		var c;
		if (!b || typeof b !== "string") {
			return this
		}
		c = this.findLayer(b);
		if (!c) {
			return this
		}
		c.setVisible(true);
		return this
	};
	a.prototype.addPort = function(d, f, g, e, c) {
		var b = new PMUI.util.Point(f, g);
		d.setParent(this);
		d.setCanvas(this.canvas);
		this.definePortPosition(d, b, c);
		this.html.appendChild(d.getHTML());
		d.paint();
		this.ports.insert(d);
		return this
	};
	a.prototype.removePort = function(b) {
		this.ports.remove(b);
		return this
	};
	a.prototype.definePortPosition = function(c, r, d) {
		var b = this.canvas,
		l = [this.TOP, this.RIGHT, this.BOTTOM, this.LEFT],
		p = [new PMUI.util.Point(Math.round(this.zoomWidth / 2), 0), new PMUI.util.Point(this.zoomWidth, Math.round(this.zoomHeight / 2)), new PMUI.util.Point(Math.round(this.zoomWidth / 2), this.zoomHeight), new PMUI.util.Point(0, Math.round(this.zoomHeight / 2))],
		m = [new PMUI.util.Point(r.x, 0), new PMUI.util.Point(this.getZoomWidth(), r.y), new PMUI.util.Point(r.x, this.getZoomHeight()), new PMUI.util.Point(0, r.y)],
		n,
		o,
		g,
		q,
		s,
		k,
		e,
		j = [ - 1, 1, 1, -1],
		h = [0, 1, 0, 0],
		f = [0, -2, 0, 1];
		n = this.connectAtMiddlePoints ? p: m;
		k = "getSquaredDistance";
		if (d && this.connectAtMiddlePoints) {
			k = "getManhattanDistance"
		}
		o = undefined;
		s = Infinity;
		for (g = 0; g < n.length; g += 1) {
			q = r[k](n[g]);
			if (s > q) {
				s = q;
				o = l[g]
			}
		}
		e = this.getBorderConsideringLayers();
		for (g = 0; g < 4; g += 1) {
			this.border[g].x = (e * j[g] + e * h[g]);
			this.border[g].y = (e * j[g] + e * f[g])
		}
		c.setDirection(o);
		c.setPosition((n[o].x - c.getWidth() / 2), (n[o].y - c.getHeight() / 2));
		c.determinePercentage();
		return this
	};
	a.prototype.getBorderConsideringLayers = function() {
		var b = parseInt(this.style.getProperty("borderTopWidth") || 0, 10),
		d,
		c;
		for (c = 0; c < this.getLayers().getSize(); c += 1) {
			d = this.getLayers().get(c);
			b = Math.max(b, parseInt(d.style.getProperty("borderTopWidth") || 0, 10))
		}
		return b
	};
	a.prototype.showPorts = function() {
		var b;
		for (b = 0; b < this.ports.getSize(); b += 1) {
			this.ports.get(b).show()
		}
		return this
	};
	a.prototype.hidePorts = function() {
		var b;
		for (b = 0; b < this.ports.getSize(); b += 1) {
			this.ports.get(b).hide()
		}
		return this
	};
	a.prototype.updatePortsPosition = function(f, d) {
		var c, b, e = this.ports;
		for (c = 0; c < e.getSize(); c += 1) {
			b = e.get(c);
			if (b.direction === this.RIGHT || b.direction === this.BOTTOM) {
				b.oldX = b.x;
				b.oldY = b.y;
				b.oldAbsoluteX = b.absoluteX;
				b.oldAbsoluteY = b.absoluteY;
				b.setPosition(b.x + f, b.y + d, true);
				b.changePosition(b.oldX, b.oldY, b.oldAbsoluteX, b.oldAbsoluteY)
			} else {
				b.setPosition(b.x, b.y, true)
			}
			b.connection.disconnect().connect();
			b.connection.setSegmentMoveHandlers()
		}
		return this
	};
	a.prototype.recalculatePortPosition = function(d) {
		var c = Math.round((d.percentage * d.parent.getZoomWidth()) / 100),
		e = Math.round((d.percentage * d.parent.getZoomHeight()) / 100),
		f = [c, d.parent.getZoomWidth(), c, 0],
		b = [0, e, d.parent.getZoomHeight(), e];
		d.setPosition(this.border[d.direction].x + f[d.direction] - Math.round(d.width / 2), this.border[d.direction].y + b[d.direction] - Math.round(d.height / 2));
		return this
	};
	a.prototype.initPortsChange = function() {
		var c, d = this.ports,
		b;
		for (c = 0; c < d.getSize(); c += 1) {
			b = d.get(c);
			b.oldX = b.x;
			b.oldY = b.y;
			b.oldAbsoluteX = b.absoluteX;
			b.oldAbsoluteY = b.absoluteY
		}
		return this
	};
	a.prototype.firePortsChange = function() {
		var c, d = this.ports,
		b;
		for (c = 0; c < d.getSize(); c += 1) {
			b = d.get(c);
			a.superclass.prototype.changePosition.call(this, b.oldX, b.oldY, b.oldAbsoluteX, b.oldAbsoluteY)
		}
		return this
	};
	a.prototype.refreshShape = function() {
		a.superclass.prototype.refreshShape.call(this);
		this.updatePortsOnZoom().refreshConnections(false);
		this.paint();
		return this
	};
	a.prototype.updatePortsOnZoom = function() {
		var g, k = this.ports,
		d, c = this.canvas.zoomFactor,
		j = (this.canvas.prevZoom * 25 + 50) / 100,
		e = (k.getSize() > 0) ? k.get(0).width / 2 : 0,
		b,
		h,
		l = [this.zoomWidth / 2 - e, this.zoomWidth - e, this.zoomWidth / 2 - e, -e],
		f = [ - e, this.zoomHeight / 2 - e, this.zoomHeight - e, this.zoomHeight / 2 - e];
		for (g = 0; g < k.getSize(); g += 1) {
			d = k.get(g);
			if (this.connectAtMiddlePoints) {
				d.setPosition(l[d.direction], f[d.direction])
			} else {
				d.setPosition(d.x / j * c, d.y / j * c)
			}
			d.applyBorderMargin(true);
			b = d.connection.srcDecorator;
			h = d.connection.destDecorator;
			if (b) {
				b.applyZoom()
			}
			if (h) {
				h.applyZoom()
			}
		}
		return this
	};
	a.prototype.calculateLabelsPercentage = function() {
		var c, b;
		for (c = 0; c < this.labels.getSize(); c += 1) {
			b = this.labels.get(c);
			b.xPercentage = b.getX() / this.getWidth();
			b.yPercentage = b.getY() / this.getHeight()
		}
	};
	a.prototype.updateLabelsPosition = function() {
		var c, b;
		for (c = 0; c < this.labels.getSize(); c += 1) {
			b = this.labels.get(c);
			b.setLabelPosition(b.location, b.diffX, b.diffY)
		}
		return this
	};
	a.prototype.determineDragBehavior = function(b) {
		var e = PMUI.util.Point,
		f = PMUI.draw.Geometry,
		c = this.limits[this.canvas.zoomPropertiesIndex],
		d = parseInt(this.style.getProperty("border") || 0, 10);
		if (f.pointInRectangle(b, new e(0, 0), new e(this.zoomWidth + 2 * d, this.zoomHeight + 2 * d))) {
			if (f.pointInRectangle(b, new e(d + c, d + c), new e(this.zoomWidth + d - c, this.zoomHeight + d - c))) {
				return this.DRAG
			}
			return this.CONNECT
		}
		return this.CANCEL
	};
	a.prototype.createDragHelper = function() {
		var b = document.createElement("div");
		b.style.width = 8 + "px";
		b.style.height = 8 + "px";
		b.style.backgroundColor = "black";
		b.style.zIndex = 2 * PMUI.draw.Shape.prototype.MAX_ZINDEX;
		b.id = "drag-helper";
		b.className = "drag-helper";
		return b
	};
	a.prototype.onMouseDown = function(b) {
		return function(f, d) {
			var c = b.canvas;
			if (f.which === 3) {
				$(c.html).trigger("rightclick", [f, b])
			} else {
				if (b.dragType === b.DRAG) {
					b.setDragBehavior("customshapedrag")
				} else {
					if (b.dragType === b.CONNECT) {
						b.setDragBehavior("connection")
					} else {
						b.setDragBehavior("nodrag")
					}
				}
				b.dragging = true
			}
			f.stopPropagation()
		}
	};
	a.prototype.onMouseUp = function(b) {
		return function(d, c) {
			b.dragging = false
		}
	};
	a.prototype.onMouseMove = function(b) {
		return function(i, h) {
			var g, d, c, f;
			if (b.dragging || b.entered) {
				return
			}
			g = $(b.html);
			d = b.getCanvas();
			c = d.relativePoint(i);
			b.startConnectionPoint.x = c.x - b.absoluteX;
			b.startConnectionPoint.y = c.y - b.absoluteY;
			f = new PMUI.util.Point(i.pageX - d.getX() - b.absoluteX + d.getLeftScroll(), i.pageY - d.getY() - b.absoluteY + d.getTopScroll());
			b.dragType = b.determineDragBehavior(f);
			if (b.dragType === b.DRAG) {
				g.css("cursor", "move")
			} else {
				if (b.dragType === b.CONNECT) {
					g.css("cursor", "crosshair")
				} else {
					g.css("cursor", "default")
				}
			}
		}
	};
	a.prototype.onClick = function(b) {
		return function(i, g) {
			var h = false,
			d = b.canvas,
			f = d.currentSelection,
			c = d.currentLabel;
			if (i.ctrlKey) {
				h = true
			}
			b.canvas.hideCurrentConnection();
			if (i.which === 3) {
				i.preventDefault();
				b.canvas.triggerRightClickEvent(b)
			} else {
				if (!b.wasDragged) {
					if (h) {
						if (f.contains(b)) {
							d.removeFromSelection(b)
						} else {
							d.addToSelection(b)
						}
					} else {
						d.emptyCurrentSelection();
						d.addToSelection(b)
					}
				}
				if (!f.isEmpty()) {
					d.triggerSelectEvent(f.asArray())
				}
			}
			if (this.helper) {
				$(this.helper.html).remove()
			}
			b.wasDragged = false;
			i.stopPropagation()
		}
	};
	a.prototype.parseHook = function() {};
	a.prototype.getPorts = function() {
		return this.ports
	};
	a.prototype.getLayers = function() {
		return this.layers
	};
	a.prototype.getLabels = function() {
		return this.labels
	};
	a.prototype.applyZoom = function() {
		var c, b;
		a.superclass.prototype.applyZoom.call(this);
		for (c = 0; c < this.layers.getSize(); c += 1) {
			this.layers.get(c).applyZoom()
		}
		for (c = 0; c < this.labels.getSize(); c += 1) {
			b = this.labels.get(c);
			b.applyZoom();
			b.setLabelPosition(b.location, b.diffX, b.diffY)
		}
		return this
	};
	a.prototype.setStartConnectionPoint = function(b) {
		this.startConnectionPoint = b;
		return this
	};
	a.prototype.setConnectAtMiddlePoints = function(b) {
		this.connectAtMiddlePoints = b;
		return this
	};
	a.prototype.getConnectAtMiddlePoints = function() {
		return this.connectAtMiddlePoints
	};
	a.prototype.setConnectionType = function(b) {
		this.connectionType = b;
		return this
	};
	a.prototype.getConnectionType = function() {
		return this.connectionType
	};
	a.prototype.stringify = function() {
		var b = [],
		f = [],
		c,
		d,
		e;
		for (c = 0; c < this.layers.getSize(); c += 1) {
			b.push(this.layers.get(c).stringify())
		}
		for (c = 0; c < this.labels.getSize(); c += 1) {
			f.push(this.labels.get(c).stringify())
		}
		d = a.superclass.prototype.stringify.call(this);
		e = {
			canvas: this.canvas.getID(),
			layers: b,
			labels: f,
			connectAtMiddlePoints: this.getConnectAtMiddlePoints(),
			connectionType: this.getConnectionType(),
			parent: this.parent.getID()
		};
		$.extend(true, d, e);
		return d
	};
	a.prototype.parseJSON = function(b) {
		this.initObject(b);
		return this
	};
	PMUI.extendNamespace("PMUI.draw.CustomShape", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b);
		this.color = new PMUI.util.Color();
		this.graphics = null
	};
	PMUI.inheritFrom("PMUI.draw.Shape", a);
	a.prototype.type = "RegularShape";
	a.prototype.getColor = function() {
		return this.color
	};
	a.prototype.setColor = function(b) {
		if (b.type && b.type === "Color") {
			this.color = b
		}
		return this
	};
	PMUI.extendNamespace("PMUI.draw.RegularShape", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this);
		this.startAngle = null;
		this.endAngle = null;
		this.radius = null;
		this.step = null;
		a.prototype.init.call(this, b)
	};
	PMUI.inheritFrom("PMUI.draw.RegularShape", a);
	a.prototype.type = "Arc";
	a.prototype.init = function(b) {
		var c = {
			center: new PMUI.util.Point(0, 0),
			radius: PMUI.draw.Shape.prototype.DEFAULT_RADIUS,
			startAngle: 270,
			endAngle: 90,
			step: 10
		};
		$.extend(true, c, b);
		this.setCenter(c.center).setStartAngle(c.startAngle).setEndAngle(c.endAngle).setRadius(c.radius).setStep(c.step);
		this.id += "-ARC"
	};
	a.prototype.paint = function() {
		this.setVisible(this.visible);
		if (this.html) {
			this.style.applyStyle();
			this.graphics = new PMUI.draw.Graphics(this.id);
			this.graphics.setColor("black");
			this.graphics.drawArc(this.center.x, this.center.y, this.radius, this.startAngle, this.endAngle, this.step);
			this.graphics.graphics.paint()
		}
		return this
	};
	a.prototype.createHTML = function() {
		a.superclass.prototype.createHTML.call(this);
		return this.html
	};
	a.prototype.getStartAngle = function() {
		return this.startAngle
	};
	a.prototype.setStartAngle = function(b) {
		this.startAngle = b;
		return this
	};
	a.prototype.getEndAngle = function() {
		return this.endAngle
	};
	a.prototype.setEndAngle = function(b) {
		this.endAngle = b;
		return this
	};
	a.prototype.getRadius = function() {
		return this.radius
	};
	a.prototype.setRadius = function(b) {
		this.radius = b;
		return this
	};
	a.prototype.getStep = function() {
		return this.step
	};
	a.prototype.setStep = function(b) {
		this.step = b;
		return this
	};
	PMUI.extendNamespace("PMUI.draw.Arc", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b);
		a.prototype.init.call(this, b)
	};
	PMUI.inheritFrom("PMUI.draw.RegularShape", a);
	a.prototype.type = "Oval";
	a.prototype.init = function(b) {
		var c = {
			center: new PMUI.util.Point(0, 0),
			width: 4,
			height: 4
		};
		$.extend(true, c, b);
		this.setCenter(c.center).setWidth(c.width).setHeight(c.height)
	};
	a.prototype.paint = function() {
		this.setVisible(this.visible);
		if (this.html) {
			this.style.applyStyle();
			this.graphic = new JSGraphics(this.id);
			this.graphic.setColor("red");
			this.graphic.fillOval(0, 0, this.getWidth(), this.getHeight());
			this.graphic.paint()
		}
		return this
	};
	a.prototype.createHTML = function() {
		a.superclass.prototype.createHTML.call(this);
		return this.html
	};
	PMUI.extendNamespace("PMUI.draw.Oval", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b);
		this.points = null;
		a.prototype.init.call(this, b)
	};
	PMUI.inheritFrom("PMUI.draw.RegularShape", a);
	a.prototype.type = "Polygon";
	a.prototype.init = function(b) {
		var c = {
			points: []
		};
		$.extend(true, c, b);
		this.setPoints(c.points)
	};
	a.prototype.setPoints = function(d) {
		var c, b;
		this.points = [];
		for (c = 0; c < d.length; c += 1) {
			b = d[c];
			this.points.push(new PMUI.util.Point(b.getX(), b.getY()))
		}
	};
	a.prototype.getPoints = function() {
		return this.points
	};
	PMUI.extendNamespace("PMUI.draw.Polygon", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function(b, d, c) {
		a.superclass.call(this);
		this.center = (!b) ? null: b;
		this.visible = true;
		this.parent = c;
		this.idOtherConnection = d
	};
	PMUI.inheritFrom("PMUI.draw.Arc", a);
	a.prototype.type = "Intersection";
	a.prototype.paint = function() {
		if (this.parent.orientation === this.VERTICAL) {
			this.startAngle = 270;
			this.endAngle = 90
		} else {
			this.startAngle = 180;
			this.endAngle = 0
		}
		a.superclass.prototype.paint.call(this);
		this.style.applyStyle();
		return this
	};
	a.prototype.destroy = function() {
		$(this.html).remove();
		return this
	};
	a.prototype.createHTML = function() {
		PMUI.draw.Shape.prototype.createHTML.call(this);
		return this.html
	};
	PMUI.extendNamespace("PMUI.draw.Intersection", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b);
		a.prototype.init.call(this, b)
	};
	PMUI.inheritFrom("PMUI.draw.Polygon", a);
	a.prototype.type = "Rectangle";
	a.prototype.init = function(b) {};
	a.prototype.paint = function() {
		if (this.html) {
			this.style.applyStyle();
			if (this.color) {
				this.style.addProperties({
					backgroundColor: this.color.getCSS()
				})
			}
		}
		return this
	};
	a.prototype.createHTML = function() {
		PMUI.draw.Shape.prototype.createHTML.call(this);
		return this.html
	};
	PMUI.extendNamespace("PMUI.draw.Rectangle", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this);
		this.backgroundColor = null;
		this.canvas = null;
		a.prototype.init.call(this, b)
	};
	PMUI.inheritFrom("PMUI.draw.Rectangle", a);
	a.prototype.type = "MultipleSelectionContainer";
	a.prototype.init = function(b) {
		var c = {
			canvas: null,
			x: 0,
			y: 0,
			color: new PMUI.util.Color(0, 128, 255, 0.1)
		};
		jQuery.extend(true, c, b);
		this.backgroundColor = c.color;
		this.canvas = c.canvas;
		this.absoluteX = this.canvas.absoluteX;
		this.absoluteY = this.canvas.absoluteY
	};
	a.prototype.paint = function() {
		this.style.addProperties({
			backgroundColor: this.backgroundColor.getCSS()
		});
		return this
	};
	a.prototype.changeOpacity = function(b) {
		this.paint();
		return this
	};
	a.prototype.wrapElements = function() {
		var b = this.canvas.currentSelection,
		c = [];
		this.intersectElements();
		if (!b.isEmpty()) {
			c = b.asArray();
			this.canvas.triggerSelectEvent(c)
		}
		this.reset();
		this.setVisible(false);
		return this
	};
	a.prototype.intersectElements = function() {
		var d, b, c;
		this.canvas.emptyCurrentSelection();
		c = this.canvas.customShapes;
		for (d = 0; d < c.getSize(); d += 1) {
			b = c.get(d);
			if (b.parent.family === "Canvas" && this.checkIntersection(b)) {
				this.canvas.addToSelection(b)
			}
		}
		return this
	};
	a.prototype.reset = function() {
		this.setPosition(0, 0);
		this.setDimension(0, 0);
		return this
	};
	a.prototype.getLeft = PMUI.draw.Shape.prototype.getAbsoluteX;
	a.prototype.getTop = PMUI.draw.Shape.prototype.getAbsoluteY;
	a.prototype.checkIntersection = function(b) {
		var e = PMUI.util.Point,
		f = PMUI.draw.Geometry,
		d = new PMUI.util.Point(this.zoomX, this.zoomY),
		c = new PMUI.util.Point(this.zoomX + this.zoomWidth, this.zoomY + this.zoomHeight);
		return f.pointInRectangle(new PMUI.util.Point(b.getZoomX(), b.getZoomY()), d, c) || f.pointInRectangle(new PMUI.util.Point(b.zoomX + b.zoomWidth, b.zoomY), d, c) || f.pointInRectangle(new PMUI.util.Point(b.zoomX, b.zoomY + b.zoomHeight), d, c) || f.pointInRectangle(new PMUI.util.Point(b.zoomX + b.zoomWidth, b.zoomY + b.zoomHeight), d, c)
	};
	PMUI.extendNamespace("PMUI.draw.MultipleSelectionContainer", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b);
		this.orientation = null;
		this.data = [];
		this.visible = false;
		a.prototype.init.call(this, b)
	};
	PMUI.inheritFrom("PMUI.draw.Core", a);
	a.prototype.type = "Snapper";
	a.prototype.init = function(b) {
		var c = {
			orientation: "horizontal"
		};
		$.extend(true, c, b);
		this.setOrientation(c.orientation)
	};
	a.prototype.createHTML = function() {
		a.superclass.prototype.createHTML.call(this);
		return this.html
	};
	a.prototype.enable = function() {
		if (this.html) {
			this.graphic = new JSGraphics(this.id);
			this.graphic.setColor("#81DAF5");
			if (this.orientation === "horizontal") {
				this.graphic.drawLine(0, 0, 4000, 0)
			} else {
				this.graphic.drawLine(0, 0, 0, 4000)
			}
			this.graphic.paint()
		}
		return this
	};
	a.prototype.hide = function() {
		this.visible = false;
		this.setVisible(this.visible);
		return this
	};
	a.prototype.show = function() {
		this.visible = true;
		this.setVisible(this.visible);
		return this
	};
	a.prototype.createSnapData = function() {
		var e, d = 0,
		b, c = 0;
		this.data = [];
		for (e = 0; e < this.canvas.customShapes.getSize(); e += 1) {
			b = this.canvas.customShapes.get(e);
			c = parseInt($(b.getHTML()).css("borderTopWidth"), 10);
			if (this.orientation === "horizontal") {
				this.data[d * 2] = b.getAbsoluteY() - c;
				this.data[d * 2 + 1] = b.getAbsoluteY() + b.getZoomHeight()
			} else {
				this.data[d * 2] = b.getAbsoluteX() - c;
				this.data[d * 2 + 1] = b.getAbsoluteX() + b.getZoomWidth()
			}
			d += 1
		}
		for (e = 0; e < this.canvas.regularShapes.getSize(); e += 1) {
			b = this.canvas.regularShapes.get(e);
			c = parseInt($(b.getHTML()).css("borderTopWidth"), 10);
			if (this.orientation === "horizontal") {
				this.data[d * 2] = b.getAbsoluteY() - c;
				this.data[d * 2 + 1] = b.getAbsoluteY() + b.getZoomHeight()
			} else {
				this.data[d * 2] = b.getAbsoluteX() - c;
				this.data[d * 2 + 1] = b.getAbsoluteX() + b.getZoomWidth()
			}
			d += 1
		}
		return this
	};
	a.prototype.sortData = function() {
		this.data.sort();
		return this
	};
	a.prototype.binarySearch = function(e) {
		var c = 0,
		b = this.data.length - 1,
		d;
		while (c <= b) {
			d = parseInt((c + b) / 2, 10);
			if (this.data[d] === e) {
				return e
			}
			if (this.data[d] > e) {
				b = d - 1
			} else {
				c = d + 1
			}
		}
		return false
	};
	a.prototype.attachListeners = function(c) {
		var b = $(c.html).mousemove(function() {
			c.hide()
		});
		return this
	};
	a.prototype.setOrientation = function(b) {
		if (b === "horizontal" || b === "vertical") {
			this.orientation = b
		} else {
			throw new Error("setOrientation(): parameter is not valid")
		}
		return this
	};
	a.prototype.getOrientation = function() {
		return this.orientation
	};
	PMUI.extendNamespace("PMUI.draw.Snapper", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function() {
		a.superclass.call(this)
	};
	PMUI.inheritFrom("PMUI.draw.Core", a);
	a.prototype.type = "Router";
	a.prototype.createRoute = function() {
		return true
	};
	PMUI.extendNamespace("PMUI.draw.Router", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function() {
		a.superclass.call(this);
		this.mindist = 20
	};
	PMUI.inheritFrom("PMUI.draw.Router", a);
	a.prototype.type = "ManhattanConnectionRouter";
	a.prototype.createRoute = function(c) {
		var b, e, g, f, d = [];
		b = c.srcPort.getPoint(false);
		e = c.srcPort.direction;
		g = c.destPort.getPoint(false);
		f = c.destPort.direction;
		this.route(c, g, f, b, e, d);
		return d
	};
	a.prototype.route = function(g, j, c, l, b, v) {
		var u, r, f, n, w, o, x, k, m, q, h, t = 0,
		i, p, s = 36,
		e = null,
		z = null,
		d = null;
		u = 0.1;
		r = 0.01;
		f = 0;
		n = 1;
		w = 2;
		o = 3;
		i = g.flo_element_origin;
		p = g.flo_element_dest;
		if (i && g.canvas.customShapes.find("id", i)) {
			if (g.canvas.customShapes.find("id", i).extendedType == "PARALLEL") {
				t = 1;
				var y = g.canvas.customShapes.find("id", p).parent;
				e = y.getAbsoluteX() + s
			}
		}
		if (p && g.canvas.customShapes.find("id", p)) {
			if (g.canvas.customShapes.find("id", p).extendedType == "INCLUSIVE") {
				t = 2;
				var y = g.canvas.customShapes.find("id", p).parent;
				z = y.getAbsoluteX() + y.getZoomWidth() - s - 13
			}
		}
		x = j.x - l.x;
		k = j.y - l.y;
		if (((x * x) < (r)) && ((k * k) < (r))) {
			v.push(l);
			return
		}
		if (c === o) {
			if ((x > 0) && ((k * k) < u) && (b === n)) {
				m = l;
				q = b
			} else {
				if (x < 0) {
					m = new PMUI.util.Point(j.x - this.mindist, j.y)
				} else {
					if (((k > 0) && (b === w)) || ((k < 0) && (b === f))) {
						m = new PMUI.util.Point(l.x, j.y)
					} else {
						if (c === b) {
							h = Math.min(j.x, l.x) - this.mindist;
							m = new PMUI.util.Point(h, j.y)
						} else {
							if (t == "1") {
								m = new PMUI.util.Point(e, j.y)
							} else {
								if (t == "2") {
									m = new PMUI.util.Point(z, j.y)
								} else {
									m = new PMUI.util.Point(j.x - (x / 2), j.y)
								}
							}
						}
					}
				}
				if (k > 0) {
					q = f
				} else {
					q = w
				}
			}
		} else {
			if (c === n) {
				if ((x < 0) && ((k * k) < u) && (b === o)) {
					m = l;
					q = b
				} else {
					if (x > 0) {
						m = new PMUI.util.Point(j.x + this.mindist, j.y)
					} else {
						if (((k > 0) && (b === w)) || ((k < 0) && (b === f))) {
							m = new PMUI.util.Point(l.x, j.y)
						} else {
							if (c === b) {
								h = Math.max(j.x, l.x) + this.mindist;
								m = new PMUI.util.Point(h, j.y)
							} else {
								m = new PMUI.util.Point(j.x - (x / 2), j.y)
							}
						}
					}
					if (k > 0) {
						q = f
					} else {
						q = w
					}
				}
			} else {
				if (c === w) {
					if (((x * x) < u) && (k < 0) && (b === f)) {
						m = l;
						q = b
					} else {
						if (k > 0) {
							m = new PMUI.util.Point(j.x, j.y + this.mindist)
						} else {
							if (((x > 0) && (b === n)) || ((x < 0) && (b === o))) {
								m = new PMUI.util.Point(j.x, l.y)
							} else {
								if (c === b) {
									h = Math.max(j.y, l.y) + this.mindist;
									m = new PMUI.util.Point(j.x, h)
								} else {
									m = new PMUI.util.Point(j.x, j.y - (k / 2))
								}
							}
						}
						if (x > 0) {
							q = o
						} else {
							q = n
						}
					}
				} else {
					if (c === f) {
						if (((x * x) < u) && (k > 0) && (b === w)) {
							m = l;
							q = b
						} else {
							if (k < 0) {
								m = new PMUI.util.Point(j.x, j.y - this.mindist)
							} else {
								if (((x > 0) && (b === n)) || ((x < 0) && (b === o))) {
									m = new PMUI.util.Point(j.x, l.y)
								} else {
									if (c === b) {
										h = Math.min(j.y, l.y) - this.mindist;
										m = new PMUI.util.Point(j.x, h)
									} else {
										m = new PMUI.util.Point(j.x, j.y - (k / 2))
									}
								}
							}
							if (x > 0) {
								q = o
							} else {
								q = n
							}
						}
					}
				}
			}
		}
		this.route(g, m, q, l, b, v);
		v.push(j)
	};
	PMUI.extendNamespace("PMUI.draw.ManhattanConnectionRouter", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b);
		this.srcPort = null;
		this.destPort = null;
		this.srcDecorator = null;
		this.destDecorator = null;
		this.lineSegments = new PMUI.util.ArrayList();
		this.points = [];
		this.zoomPoints = [];
		this.oldPoints = [];
		this.segmentStyle = null;
		this.originalSegmentStyle = null;
		this.segmentColor = null;
		this.originalSegmentColor = null;
		this.defaultZOrder = 2;
		this.zOrder = 2;
		this.intersectionWith = new PMUI.util.ArrayList();
		this.corona = 10;
		a.prototype.init.call(this, b)
	};
	PMUI.inheritFrom("PMUI.draw.Core", a);
	a.prototype.type = "Connection";
	a.prototype.family = "Connection";
	a.prototype.router = new PMUI.draw.ManhattanConnectionRouter();
	a.prototype.init = function(c) {
		var b = {
			srcPort: new PMUI.draw.Port(),
			destPort: new PMUI.draw.Port(),
			segmentColor: new PMUI.util.Color(0, 0, 0),
			segmentStyle: "regular"
		};
		$.extend(true, b, c);
		this.setSrcPort(b.srcPort).setDestPort(b.destPort).setSegmentStyle(b.segmentStyle, false).setSegmentColor(b.segmentColor, false);
		this.originalSegmentStyle = b.segmentStyle;
		this.originalSegmentColor = b.segmentColor;
		this.getSrcPort().setConnection(this);
		this.getDestPort().setConnection(this)
	};
	a.prototype.createHTML = function() {
		this.html = document.createElement("div");
		this.html.id = this.id;
		this.style.addProperties({
			position: "absolute",
			left: 0,
			top: 0,
			height: 0,
			width: 0,
			zIndex: this.zOrder
		});
		return this.html
	};
	a.prototype.attachListeners = function() {
		if (!this.canvas.readOnly) {
			$(this.html).children().click(this.onClick(this))
		}
	};
	a.prototype.onClick = function(b) {
		return function(h, g) {
			var c = b,
			f = b.canvas.currentConnection,
			d = c.canvas;
			d.emptyCurrentSelection();
			if (f) {
				f.hidePortsAndHandlers()
			}
			c.showPortsAndHandlers();
			d.currentConnection = c;
			h.stopPropagation()
		}
	};
	a.prototype.setSegmentMoveHandlers = function() {
		var b, e, c = [this.HORIZONTAL, this.VERTICAL],
		d = (this.destPort.direction === this.TOP || this.destPort.direction === this.BOTTOM) ? 1 : 0;
		for (b = this.lineSegments.getSize() - 1; b >= 0; b -= 1) {
			e = this.lineSegments.get(b);
			e.orientation = c[d];
			e.hasMoveHandler = false;
			if (b < this.lineSegments.getSize() - 1 && b > 0) {
				e.nextNeighbor = this.lineSegments.get(b + 1);
				e.previousNeighbor = this.lineSegments.get(b - 1);
				e.hasMoveHandler = true;
				e.addSegmentMoveHandler()
			}
			d = 1 - d
		}
		return this
	};
	a.prototype.removeAllSegmentHandlers = function() {
		var c, b;
		for (b = 0; b < this.lineSegments.getSize(); b += 1) {
			c = this.lineSegments.get(b);
			if (c.hasMoveHandler) {
				$(c.moveHandler.html).remove()
			}
		}
		return this
	};
	a.prototype.showMoveHandlers = function() {
		var c, b;
		for (c = 0; c < this.lineSegments.getSize(); c += 1) {
			b = this.lineSegments.get(c).moveHandler;
			if (b) {
				b.setVisible(true)
			}
		}
		return this
	};
	a.prototype.hideMoveHandlers = function() {
		var c, b;
		for (c = 0; c < this.lineSegments.getSize(); c += 1) {
			b = this.lineSegments.get(c).moveHandler;
			if (b) {
				b.setVisible(false)
			}
		}
		return this
	};
	a.prototype.hidePortsAndHandlers = function() {
		this.hidePorts();
		this.hideMoveHandlers();
		return this
	};
	a.prototype.showPortsAndHandlers = function() {
		this.showPorts();
		this.showMoveHandlers();
		return this
	};
	a.prototype.paint = function(b) {
		var d = {
			algorithm: "manhattan",
			points: [],
			dx: 0,
			dy: 0
		};
		$.extend(true, d, b);
		try {
			if (this.html === null) {
				this.createHTML()
			}
			$(this.html).empty();
			this.oldPoint = null;
			switch (d.algorithm) {
			case "manhattan":
				this.createManhattanRoute();
				break;
			case "user":
				this.createUserDefinedRoute(d.points, d.dx, d.dy);
				break;
			default:
				throw new Error("Connection.paint():  the algorithm provided is not correct")
			}
			this.style.applyStyle();
			this.style.addProperties({
				top:
				0,
				left: 0
			});
			if (this.destDecorator !== null) {
				this.destDecorator.paint();
				if (!this.canvas.readOnly) {
					this.destDecorator.attachListeners()
				}
			}
			if (this.srcDecorator !== null) {
				this.srcDecorator.paint()
			}
			this.oldPoint = null
		} catch(c) {}
		return this
	};
	a.prototype.disconnect = function(b) {
		this.clearAllIntersections();
		this.hideMoveHandlers();
		if (b) {
			this.savePoints()
		}
		this.lineSegments.clear();
		$(this.html).empty();
		return this
	};
	a.prototype.connect = function(b) {
		this.paint(b);
		this.attachListeners();
		return this
	};
	a.prototype.hidePorts = function() {
		this.srcPort.hide();
		this.destPort.hide();
		return this
	};
	a.prototype.showPorts = function() {
		this.srcPort.show();
		this.destPort.show();
		return this
	};
	a.prototype.savePoints = function(c) {
		var d, f, b, e = "points",
		g = {
			saveToOldPoints: false
		};
		$.extend(true, g, c);
		if (g.saveToOldPoints) {
			e = "oldPoints"
		}
		this[e] = [];
		this.zoomPoints = [];
		for (d = 0; d < this.lineSegments.getSize(); d += 1) {
			f = this.lineSegments.get(d);
			if (d === 0) {
				this[e].push(new PMUI.util.Point(f.startPoint.x, f.startPoint.y));
				this.zoomPoints.push(new PMUI.util.Point(f.startPoint.x / this.canvas.zoomFactor, f.startPoint.y / this.canvas.zoomFactor))
			}
			this[e].push(new PMUI.util.Point(f.endPoint.x, f.endPoint.y));
			this.zoomPoints.push(new PMUI.util.Point(f.endPoint.x / this.canvas.zoomFactor, f.endPoint.y / this.canvas.zoomFactor))
		}
		return this
	};
	a.prototype.createUserDefinedRoute = function(e, c, b) {
		var d, f, g = new PMUI.util.Point(c, b);
		for (d = 1; d < e.length; d += 1) {
			f = new PMUI.draw.Segment({
				startPoint: new PMUI.util.Point(parseInt(e[d - 1].x, 10), parseInt(e[d - 1].y, 10)).add(g),
				endPoint: new PMUI.util.Point(parseInt(e[d].x, 10), parseInt(e[d].y, 10)).add(g),
				parent: this,
				canvas: this.canvas,
				color: this.segmentColor
			});
			this.addSegment(f)
		}
		return this
	};
	a.prototype.createManhattanRoute = function() {
		var c = this.router.createRoute(this),
		b,
		d;
		for (b = 1; b < c.length; b += 1) {
			d = new PMUI.draw.Segment({
				startPoint: new PMUI.util.Point(parseInt(c[b - 1].x - this.canvas.absoluteX, 10), parseInt(c[b - 1].y - this.canvas.absoluteY, 10)),
				endPoint: new PMUI.util.Point(parseInt(c[b].x - this.canvas.absoluteX, 10), parseInt(c[b].y - this.canvas.absoluteY, 10)),
				parent: this,
				canvas: this.canvas,
				color: this.segmentColor
			});
			this.addSegment(d)
		}
		return this
	};
	a.prototype.addSegment = function(b) {
		b.setStyle(this.segmentStyle);
		b.paint();
		this.lineSegments.insert(b);
		return this
	};
	a.prototype.saveAndDestroy = function() {
		if (this.canvas.currentConnection) {
			this.hidePortsAndHandlers();
			this.canvas.currentConnection = null
		}
		this.canvas.removeConnection(this);
		this.srcPort.saveAndDestroy();
		this.destPort.saveAndDestroy();
		this.html = $(this.html).detach()[0];
		return this
	};
	a.prototype.fixZIndex = function() {
		var g = this.srcPort.parent,
		d = this.destPort.parent,
		e, f, b, c;
		if (g.parent) {
			e = g.parent
		} else {
			e = g.canvas
		}
		b = Math.min(e.getZOrder(), g.getZOrder() - 1);
		if (d.parent) {
			f = d.parent
		} else {
			f = d.canvas
		}
		c = Math.min(f.getZOrder(), d.getZOrder() - 1);
		this.setZOrder(Math.max(b, c) + 2);
		return this
	};
	a.prototype.checkAndCreateIntersections = function(e) {
		var d, c, f, g, b = false,
		h;
		for (d = 0; d < this.lineSegments.getSize(); d += 1) {
			f = this.lineSegments.get(d);
			for (c = 0; c < e.lineSegments.getSize(); c += 1) {
				g = e.lineSegments.get(c);
				h = PMUI.draw.Geometry.perpendicularSegmentIntersection(f.startPoint, f.endPoint, g.startPoint, g.endPoint);
				if (h) {
					b = true;
					f.createIntersectionWith(g, h)
				}
			}
		}
		if (b) {
			if (!this.intersectionWith.find("id", e.getID())) {
				this.intersectionWith.insert(e)
			}
			if (!e.intersectionWith.find("id", this.getID())) {
				e.intersectionWith.insert(this)
			}
		}
		return b
	};
	a.prototype.checkAndCreateIntersectionsWithAll = function() {
		var b, c, d;
		for (b = 0; b < this.canvas.connections.getSize(); b += 1) {
			c = this.canvas.connections.get(b);
			if (c.getID() !== this.getID()) {
				this.checkAndCreateIntersections(c)
			}
		}
		for (b = 0; b < this.lineSegments.getSize(); b += 1) {
			d = this.lineSegments.get(b);
			if (d.intersections.getSize()) {
				d.paintWithIntersections()
			}
		}
		return this
	};
	a.prototype.clearIntersectionsWith = function(e) {
		var d, f, c, b;
		for (d = 0; d < this.lineSegments.getSize(); d += 1) {
			b = false;
			f = this.lineSegments.get(d);
			while (true) {
				c = f.intersections.find("idOtherConnection", e.getID());
				if (c) {
					f.intersections.remove(c);
					c.destroy()
				} else {
					break
				}
				b = true
			}
			if (b) {
				f.paintWithIntersections()
			}
		}
		this.intersectionWith.remove(e);
		e.intersectionWith.remove(this);
		return this
	};
	a.prototype.clearAllIntersections = function() {
		var b;
		while (this.intersectionWith.getSize() > 0) {
			b = this.intersectionWith.get(0);
			b.clearIntersectionsWith(this)
		}
		return this
	};
	a.prototype.move = function(c, b) {
		var e, d;
		e = parseFloat(this.html.style.top);
		d = parseFloat(this.html.style.left);
		$(this.html).css({
			top: e + b,
			left: d + c
		});
		return this
	};
	a.prototype.stringify = function() {
		return {
			segmentStyle: this.getSegmentStyle(),
			srcPort: this.getSrcPort().stringify(),
			destPort: this.getDestPort().stringify(),
			state: this.savePoints() && this.points,
			srcDecoratorPrefix: this.getSrcDecorator().getDecoratorPrefix(),
			destDecoratorPrefix: this.getDestDecorator().getDecoratorPrefix()
		}
	};
	a.prototype.setSegmentColor = function(c, b) {
		var d, e;
		this.segmentColor = c;
		if (this.html && b) {
			for (d = 0; d < this.lineSegments.getSize(); d += 1) {
				e = this.lineSegments.get(d);
				e.setColor(this.segmentColor);
				e.paint()
			}
		}
		return this
	};
	a.prototype.getSegmentColor = function() {
		return this.segmentColor
	};
	a.prototype.setSegmentStyle = function(e, b) {
		var c, d;
		this.segmentStyle = e;
		if (this.html && b) {
			for (c = 0; c < this.lineSegments.getSize(); c += 1) {
				d = this.lineSegments.get(c);
				d.setStyle(this.segmentStyle);
				d.paint()
			}
		}
		return this
	};
	a.prototype.getSegmentStyle = function() {
		return this.segmentStyle
	};
	a.prototype.setSrcPort = function(b) {
		this.srcPort = b;
		return this
	};
	a.prototype.getSrcPort = function() {
		return this.srcPort
	};
	a.prototype.setDestPort = function(b) {
		this.destPort = b;
		return this
	};
	a.prototype.getDestPort = function() {
		return this.destPort
	};
	a.prototype.getSrcDecorator = function() {
		return this.srcDecorator
	};
	a.prototype.getDestDecorator = function() {
		return this.destDecorator
	};
	a.prototype.getLineSegments = function() {
		return this.lineSegments
	};
	a.prototype.setSrcDecorator = function(b) {
		if (b.type === "ConnectionDecorator") {
			this.srcDecorator = b
		}
		return this
	};
	a.prototype.setDestDecorator = function(b) {
		if (b.type === "ConnectionDecorator") {
			this.destDecorator = b
		}
		return this
	};
	a.prototype.getZOrder = function() {
		return PMUI.draw.Shape.prototype.getZOrder.call(this)
	};
	a.prototype.getOldPoints = function() {
		return this.oldPoints
	};
	a.prototype.getPoints = function() {
		return this.points
	};
	a.prototype.hitTest = function(b) {
		var f = this.getLineSegments().asArray().length;
		for (var d = 0; d < f; d++) {
			var e = this.getLineSegments().get(d);
			var c = e.hit(this.corona, b);
			if (c) {
				return true
			}
		}
		return false
	};
	a.prototype.applyZoom = function(c) {
		var d, b;
		for (d = 0, b = this.points.length; d < b; d += 1) {
			this.points[d].x = this.zoomPoints[d].x * this.canvas.zoomFactor;
			this.points[d].y = this.zoomPoints[d].y * this.canvas.zoomFactor
		}
		this.disconnect(false);
		this.connect({
			algorithm: "user",
			points: this.points
		});
		this.canvas.refreshArray.insert(this);
		this.setSegmentMoveHandlers();
		this.checkAndCreateIntersectionsWithAll();
		this.canvas.triggerUserStateChangeEvent(this)
	};
	a.prototype.reconnectUser = function(d, b) {
		var c;
		if (d) {
			for (c = 0; c < this.points.length; c += 1) {
				this.points[c].x += d.dx * this.canvas.zoomFactor;
				this.points[c].y += d.dy * this.canvas.zoomFactor
			}
			this.disconnect(b);
			this.connect({
				algorithm: "user",
				points: this.points
			})
		}
	};
	a.prototype.reconnectManhattah = function(b) {
		this.disconnect(b);
		this.connect()
	};
	PMUI.extendNamespace("PMUI.draw.Connection", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b);
		this.parent = null;
		this.decoratorType = null;
		this.decoratorPrefix = null;
		this.spriteDirection = {
			"0": "top",
			"1": "right",
			"2": "bottom",
			"3": "left"
		};
		this.height = 11;
		this.width = 11;
		this.separator = null;
		this.sprite = null;
		this.cssClass = null;
		a.prototype.initObject.call(this, b)
	};
	PMUI.inheritFrom("PMUI.draw.Core", a);
	a.prototype.type = "ConnectionDecorator";
	a.prototype.initObject = function(b) {
		var c = {
			width: 11,
			height: 11,
			sprite: "bpmn_zoom",
			decoratorPrefix: "",
			separator: "_",
			decoratorType: "target",
			parent: null
		};
		$.extend(true, c, b);
		this.setDecoratorType(c.decoratorType).setDecoratorPrefix(c.decoratorPrefix).setSeparator(c.separator).setSprite(c.sprite).setParent(c.parent).setDimension(c.width, c.height).setCssClass("")
	};
	a.prototype.paint = function(m) {
		var l, b, k, c, h, d, j, f, g, e;
		if (this.decoratorType === "source") {
			c = this.parent.getSrcPort()
		} else {
			c = this.parent.getDestPort()
		}
		l = c.getPoint(false);
		l.x = Math.floor(l.x) - this.canvas.absoluteX;
		l.y = Math.floor(l.y) - this.canvas.absoluteY;
		k = c.getDirection();
		b = c.canvas;
		j = Math.round(this.canvas.zoomFactor * 5 * 2);
		h = [l.y - this.zoomHeight + 1, l.y - (this.zoomHeight / 2) + 1, l.y - 1, l.y - (this.zoomHeight / 2) + 1];
		d = [l.x - (this.zoomWidth / 2) + 1, l.x - 1, l.x - (this.zoomWidth / 2) + 1, l.x - this.zoomWidth + 1];
		for (e = 0; e < h.length; e++) {
			h[e] = Math.floor(h[e])
		}
		for (e = 0; e < d.length; e++) {
			d[e] = Math.floor(d[e])
		}
		if (this.getHTML() === null) {
			this.createHTML()
		}
		if (this.decoratorType === null) {
			this.html = null;
			return this
		}
		this.style.removeClasses([this.cssClass]);
		this.setCssClass([this.prefix, parseInt(b.zoomFactor * 100, 10), this.decoratorType, this.spriteDirection[k]].join(this.separator));
		this.style.addClasses([this.sprite, this.getCssClass()]);
		this.style.addProperties({
			top: h[k],
			left: d[k]
		});
		this.parent.html.appendChild(this.html);
		return this
	};
	a.prototype.createHTML = function() {
		this.html = document.createElement("div");
		this.html.id = this.id;
		this.style.applyStyle();
		this.style.addProperties({
			position: "absolute",
			left: 0,
			top: 0,
			height: this.zoomHeight,
			width: this.zoomWidth,
			zIndex: PMUI.util.Style.MAX_ZINDEX
		});
		return this.html
	};
	a.prototype.attachListeners = function() {
		var b;
		b = $(this.getHTML()).click(this.onClick(this));
		b.on("mousedown", this.onMouseDown(this));
		return this
	};
	a.prototype.applyZoom = function() {
		this.setDimension(this.width, this.height);
		return this
	};
	a.prototype.onMouseDown = function(b) {
		return function(d, c) {
			d.preventDefault();
			if (d.which === 3) {
				b.parent.canvas.updatedElement = b.parent;
				$(b.parent.canvas.html).trigger("rightclick")
			}
			d.stopPropagation()
		}
	};
	a.prototype.onClick = function(b) {
		return function(h, g) {
			var c = b.parent,
			f = b.parent.canvas.currentConnection,
			d = c.canvas;
			c.showPortsAndHandlers();
			d.emptyCurrentSelection();
			if (f) {
				f.hidePortsAndHandlers()
			}
			d.currentConnection = c;
			h.stopPropagation()
		}
	};
	a.prototype.stringify = function() {
		var b = {},
		c = {
			decoratorType: this.getDecoratorType(),
			decoratorPrefix: this.getDecoratorPrefix()
		};
		$.extend(true, b, c);
		return b
	};
	a.prototype.getDecoratorType = function() {
		return this.decoratorType
	};
	a.prototype.setDecoratorType = function(b) {
		this.decoratorType = b;
		return this
	};
	a.prototype.getDecoratorPrefix = function() {
		return this.prefix
	};
	a.prototype.setDecoratorPrefix = function(b) {
		this.prefix = b;
		return this
	};
	a.prototype.setParent = function(b) {
		this.parent = b;
		return this
	};
	a.prototype.getParent = function() {
		return this.parent
	};
	a.prototype.setSeparator = function(b) {
		this.separator = b;
		return this
	};
	a.prototype.setSprite = function(b) {
		this.sprite = b;
		return this
	};
	a.prototype.setCssClass = function(b) {
		this.cssClass = b;
		return this
	};
	a.prototype.getCssClass = function() {
		return this.cssClass
	};
	PMUI.extendNamespace("PMUI.draw.ConnectionDecorator", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b);
		this.layerName = null;
		this.priority = null;
		this.parent = null;
		this.visible = null;
		this.resizable = null;
		this.currentZoomClass = "";
		this.zoomSprites = [];
		a.prototype.initObject.call(this, b)
	};
	PMUI.inheritFrom("PMUI.draw.Core", a);
	a.prototype.type = "Layer";
	a.prototype.initObject = function(b) {
		var c = {
			x: 0,
			y: 0,
			parent: null,
			layerName: "defaultLayerName",
			resizable: true,
			priority: 0,
			visible: true,
			zoomSprites: ["", "", "", "", ""]
		};
		$.extend(true, c, b);
		this.setParent(c.parent).setPosition(c.x, c.y).setLayerName(c.layerName).setPriority(c.priority).setVisible(c.visible).setZoomSprites(c.zoomSprites).setProperties().setResizable(c.resizable)
	};
	a.prototype.applyZoom = function() {
		this.setProperties()
	};
	a.prototype.setResizable = function(b) {
		this.resizable = b
	};
	a.prototype.comparisonFunction = function(c, b) {
		if (c.priority > b.priority) {
			return - 1
		} else {
			if (c.priority > b.priority) {
				return 1
			}
		}
		return 0
	};
	a.prototype.createHTML = function(b) {
		this.setProperties();
		a.superclass.prototype.createHTML.call(this, b);
		return this.html
	};
	a.prototype.paint = function() {
		var b = $(this.html),
		c;
		this.style.removeClasses([this.currentZoomClass]);
		c = this.zoomSprites[this.canvas.zoomPropertiesIndex];
		this.style.addClasses([c]);
		this.currentZoomClass = c;
		this.style.applyStyle();
		return this
	};
	a.prototype.setProperties = function() {
		if (!this.parent) {
			return this
		}
		this.id = this.parent.getID() + "Layer-" + this.layerName;
		if ((typeof this.width !== "number") && (typeof this.height !== "number")) {
			this.setDimension(this.parent.getWidth(), this.parent.getHeight())
		} else {
			this.setDimension(this.width, this.height)
		}
		if (this.resizable) {
			this.setDimension(this.parent.getWidth(), this.parent.getHeight())
		}
		this.canvas = this.parent.canvas;
		return this
	};
	a.prototype.getLayerName = function() {
		return this.layerName
	};
	a.prototype.getPriority = function() {
		return this.priority
	};
	a.prototype.setLayerName = function(b) {
		if (typeof b === "string" && b !== "") {
			this.layerName = b
		}
		return this
	};
	a.prototype.setPriority = function(b) {
		if (typeof b === "number") {
			this.priority = b
		}
		return this
	};
	a.prototype.setParent = function(b) {
		if (b) {
			this.parent = b
		}
		return this
	};
	a.prototype.getParent = function() {
		return this.parent
	};
	a.prototype.setZoomSprites = function(b) {
		var c;
		this.zoomSprites = ["", "", "", "", ""];
		for (c = 0; c < b.length; c += 1) {
			this.zoomSprites[c] = b[c]
		}
		return this
	};
	a.prototype.stringify = function() {
		var b = {},
		c = {
			id: this.getID(),
			x: this.getX(),
			y: this.getY(),
			layerName: this.getLayerName(),
			priority: this.getPriority(),
			style: {
				cssClasses: this.style.getClasses()
			},
			zoomSprites: this.zoomSprites
		};
		$.extend(true, b, c);
		return b
	};
	PMUI.extendNamespace("PMUI.draw.Layer", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b);
		this.representation = null;
		this.parent = null;
		this.color = null;
		this.orientation = null
	};
	PMUI.inheritFrom("PMUI.draw.Core", a);
	a.prototype.setParent = function(b) {
		this.parent = b;
		return this
	};
	a.prototype.getParent = function() {
		return this.parent
	};
	a.prototype.setRepresentation = function(b) {
		this.representation = b;
		return this
	};
	a.prototype.getRepresentation = function() {
		return this.representation
	};
	a.prototype.setOrientation = function(b) {
		this.orientation = b;
		return this
	};
	a.prototype.getOrientation = function() {
		return this.orientation
	};
	a.prototype.paint = function() {
		this.representation.paint.call(this);
		this.style.applyStyle();
		return this
	};
	a.prototype.setColor = function(b) {
		this.color = b;
		return this
	};
	a.prototype.getColor = function() {
		return this.color
	};
	PMUI.extendNamespace("PMUI.draw.Handler", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b);
		this.category = null;
		this.visible = false;
		this.resizableStyle = null;
		this.nonResizableStyle = null;
		a.prototype.init.call(this, b)
	};
	PMUI.inheritFrom("PMUI.draw.Handler", a);
	a.prototype.type = "ResizeHandler";
	a.prototype.init = function(b) {
		var c = {
			width: 4,
			height: 4,
			parent: null,
			orientation: null,
			representation: null,
			resizableStyle: {},
			nonResizableStyle: {},
			zOrder: 2
		};
		$.extend(true, c, b);
		if (c.resizableStyle.cssProperties) {
			c.resizableStyle.cssProperties.zIndex = c.zOrder
		}
		if (c.nonResizableStyle.cssProperties) {
			c.nonResizableStyle.cssProperties.zIndex = c.zOrder
		}
		this.setParent(c.parent).setWidth(c.width).setHeight(c.height).setOrientation(c.orientation).setRepresentation(c.representation).setResizableStyle(c.resizableStyle).setNonResizableStyle(c.nonResizableStyle);
		this.id = c.orientation + c.parent.id + "resizehandler"
	};
	a.prototype.setParent = function(b) {
		this.parent = b;
		return this
	};
	a.prototype.getParent = function() {
		return this.parent
	};
	a.prototype.paint = function() {
		if (!this.html) {
			throw new Error("paint():  This handler has no html")
		}
		a.superclass.prototype.paint.call(this);
		this.setVisible(this.visible);
		return this
	};
	a.prototype.setCategory = function(b) {
		if (typeof b === "string") {
			this.category = b
		}
		if (this.category === "resizable") {
			this.color = new PMUI.util.Color(0, 255, 0);
			this.style.addClasses(["ui-resizable-handle", "ui-resizable-" + this.orientation])
		} else {
			this.color = new PMUI.util.Color(255, 255, 255);
			this.style.removeClasses(["ui-resizable-handle", "ui-resizable-" + this.orientation])
		}
		return this
	};
	a.prototype.setResizableStyle = function(b) {
		this.resizableStyle = new PMUI.util.Style({
			belongsTo: this,
			cssProperties: b.cssProperties,
			cssClasses: b.cssClasses
		});
		return this
	};
	a.prototype.setNonResizableStyle = function(b) {
		this.nonResizableStyle = new PMUI.util.Style({
			belongsTo: this,
			cssProperties: b.cssProperties,
			cssClasses: b.cssClasses
		});
		return this
	};
	PMUI.extendNamespace("PMUI.draw.ResizeHandler", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b);
		this.orientation = null;
		this.visible = false;
		this.zOrder = 2;
		a.prototype.init.call(this, b)
	};
	PMUI.inheritFrom("PMUI.draw.Handler", a);
	a.prototype.type = "SegmentMoveHandler";
	a.prototype.init = function(b) {
		var c = {
			width: 4,
			height: 4,
			parent: null,
			orientation: null,
			representation: new PMUI.draw.Rectangle(),
			color: new PMUI.util.Color(0, 255, 0)
		};
		$.extend(true, c, b);
		this.setWidth(c.width).setHeight(c.height).setParent(c.parent).setColor(c.color).setOrientation(c.orientation).setRepresentation(c.representation)
	};
	a.prototype.paint = function() {
		a.superclass.prototype.paint.call(this);
		this.setVisible(this.visible);
		return this
	};
	a.prototype.attachListeners = function(c) {
		var b = $(c.html);
		b.on("click", c.onClick(c));
		b.on("mousedown", c.onMouseDown(c));
		b.draggable({
			start: c.onDragStart(c),
			drag: c.onDrag(c),
			stop: c.onDragEnd(c),
			axis: (c.orientation === c.HORIZONTAL) ? "y": "x"
		});
		return this
	};
	a.prototype.onMouseDown = function(b) {
		return function(d, c) {
			b.parent.parent.canvas.draggingASegmentHandler = true
		}
	};
	a.prototype.onClick = function(b) {
		return function(d, c) {
			d.stopPropagation()
		}
	};
	a.prototype.onDragStart = function(b) {
		return function(j, h) {
			var f = b.parent,
			g, c = f.getParent(),
			d;
			c.savePoints({
				saveToOldPoints: true
			});
			for (d = 0; d < f.parent.lineSegments.getSize(); d += 1) {
				g = f.parent.lineSegments.get(d);
				g.clearIntersections()
			}
			f.parent.clearAllIntersections();
			j.stopPropagation()
		}
	};
	a.prototype.onDrag = function(b) {
		return function(f, d) {
			var c = b.parent;
			c.moveSegment(d.position.left, d.position.top)
		}
	};
	a.prototype.onDragEnd = function(b) {
		return function(h, g) {
			var f = b.parent,
			c = f.getParent(),
			d = c.canvas,
			i;
			d.draggingASegmentHandler = false;
			b.onDrag(b)(h, g);
			c.savePoints();
			i = new PMUI.command.CommandSegmentMove(c, {
				oldPoints: c.getOldPoints(),
				newPoints: c.getPoints()
			});
			i.execute();
			d.commandStack.add(i)
		}
	};
	PMUI.extendNamespace("PMUI.draw.SegmentMoveHandler", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this);
		this.connection = null;
		this.representation = null;
		this.parent = null;
		this.oldParent = null;
		this.direction = null;
		this.percentage = null;
		this.zOrder = 1;
		this.defaultZOrder = 1;
		this.realX = 0;
		this.realY = 0;
		a.prototype.init.call(this, b)
	};
	PMUI.inheritFrom("PMUI.draw.Core", a);
	a.prototype.TOWARDS_CENTER = 5;
	a.prototype.type = "Port";
	a.prototype.init = function(b) {
		var c = {
			width: 4,
			height: 4,
			visible: false,
			parent: null
		};
		$.extend(true, c, b);
		$.extend(true, c, {
			representation: new PMUI.draw.Oval({
				width: c.width,
				height: c.height,
				center: new PMUI.util.Point(0, 0),
				visible: true
			})
		});
		this.setVisible(c.visible).setParent(c.parent).setDimension(c.width, c.height).setRepresentation(c.representation)
	};
	a.prototype.createHTML = function() {
		a.superclass.prototype.createHTML.call(this);
		this.style.addClasses(["port"]);
		return this.html
	};
	a.prototype.applyBorderMargin = function(b) {
		var c = (b) ? 1 : -1;
		this.x += c * this.parent.border[this.direction].x;
		this.y += c * this.parent.border[this.direction].y;
		this.zoomX = this.x;
		this.zoomY = this.y;
		this.setAbsoluteX();
		this.setAbsoluteY();
		if (this.html) {
			this.style.addProperties({
				left: this.zoomX,
				top: this.zoomY
			})
		}
		return this
	};
	a.prototype.setX = function(b) {
		this.x = b;
		this.zoomX = this.x;
		if (this.canvas) {
			this.realX = this.x / this.canvas.zoomFactor
		} else {
			this.realX = this.x
		}
		this.setAbsoluteX();
		if (this.html) {
			this.style.addProperties({
				left: this.zoomX
			})
		}
		return this
	};
	a.prototype.setY = function(b) {
		this.y = b;
		this.zoomY = this.y;
		this.setAbsoluteY();
		if (this.canvas) {
			this.realY = this.y / this.canvas.zoomFactor
		} else {
			this.realY = this.y
		}
		if (this.html) {
			this.style.addProperties({
				top: this.zoomY
			})
		}
		return this
	};
	a.prototype.setWidth = function(b) {
		this.width = b;
		this.zoomWidth = this.width;
		if (this.html) {
			this.style.addProperties({
				width: this.zoomWidth
			})
		}
		return this
	};
	a.prototype.setHeight = function(b) {
		this.height = b;
		this.zoomHeight = this.height;
		if (this.html) {
			this.style.addProperties({
				height: this.zoomHeight
			})
		}
		return this
	};
	a.prototype.paint = function() {
		this.html.appendChild(this.representation.getHTML());
		this.representation.paint();
		this.setVisible(this.visible);
		this.style.applyStyle();
		return this
	};
	a.prototype.repaint = function(b) {
		b.style.addProperties({
			left: b.x,
			top: b.y
		});
		b.connection.connect();
		b.connection.setSegmentMoveHandlers();
		b.connection.checkAndCreateIntersectionsWithAll();
		return this
	};
	a.prototype.onDragStart = function(c, b) {
		return function(f, d) {
			b.moveTowardsTheCenter(true);
			c.moveTowardsTheCenter(true);
			c.connection.disconnect();
			return true
		}
	};
	a.prototype.onDrag = function(c, e, b, d) {
		return function(h, g) {
			var f;
			if (d.connectionSegment) {
				$(d.connectionSegment.getHTML()).remove()
			}
			e.x = h.pageX - d.getX() + d.getLeftScroll() - d.getAbsoluteX();
			e.y = h.pageY - d.getY() + d.getTopScroll() - d.getAbsoluteY();
			f = b.getPoint(false);
			f.x = f.x - d.getAbsoluteX();
			f.y = f.y - d.getAbsoluteY();
			d.connectionSegment = new PMUI.draw.Segment({
				startPoint: f,
				endPoint: e,
				parent: d
			});
			d.connectionSegment.pointsTo = c;
			d.connectionSegment.createHTML();
			d.connectionSegment.paint()
		}
	};
	a.prototype.onDragEnd = function(c, b, d) {
		return function(g, f) {
			if (d.connectionSegment) {
				$(d.connectionSegment.getHTML()).remove()
			}
			c.repaint(c);
			b.moveTowardsTheCenter();
			c.moveTowardsTheCenter();
			c.connection.showMoveHandlers()
		}
	};
	a.prototype.determinePercentage = function() {
		var b, c;
		if (!this.parent) {
			return false
		}
		if (this.direction === this.TOP || this.direction === this.BOTTOM) {
			b = this.parent.getZoomWidth();
			c = this.x + (5 * this.canvas.getZoomFactor())
		} else {
			b = this.parent.getZoomHeight();
			c = this.y + (5 * this.canvas.getZoomFactor())
		}
		this.percentage = Math.round((c / b) * 100);
		return true
	};
	a.prototype.show = function() {
		this.visible = true;
		this.paint();
		this.html.style.zIndex = 3;
		return this
	};
	a.prototype.hide = function() {
		this.visible = false;
		this.paint();
		return this
	};
	a.prototype.saveAndDestroy = function() {
		this.parent.removePort(this);
		this.html = $(this.html).detach()[0];
		return this
	};
	a.prototype.attachListeners = function(d) {
		var b, c;
		b = d.connection.srcPort.getPoint(false).equals(d.getPoint(false)) ? d.connection.destPort: d.connection.srcPort;
		c = {
			start: d.onDragStart(d, b),
			drag: d.onDrag(d, d.getPoint(false), b, d.parent.canvas),
			stop: d.onDragEnd(d, b, d.parent.canvas)
		};
		$(d.html).draggable(c);
		$(d.html).mouseover(function() {
			$(d.html).css("cursor", "Move")
		});
		return d
	};
	a.prototype.moveTowardsTheCenter = function(e) {
		var b = a.prototype.TOWARDS_CENTER,
		d = [0, -b, 0, b],
		c = [b, 0, -b, 0],
		f = 1;
		if (e) {
			f = -1
		}
		this.setPosition(this.x + d[this.direction] * f, this.y + c[this.direction] * f);
		return this
	};
	a.prototype.setDirection = function(b) {
		if (b >= 0 && b < 4) {
			this.direction = b
		} else {
			throw new Error("setDirection():  parameter '" + b + "'is not valid")
		}
		return this
	};
	a.prototype.getDirection = function() {
		return this.direction
	};
	a.prototype.setParent = function(c, b) {
		if (this.canvas && b) {
			this.canvas.updatedElement = {
				id: this.id,
				type: this.type,
				fields: [{
					field: "parent",
					oldVal: this.parent,
					newVal: c
				}]
			};
			$(this.canvas.html).trigger("changeelement")
		}
		this.parent = c;
		return this
	};
	a.prototype.getParent = function() {
		return this.parent
	};
	a.prototype.setOldParent = function(b) {
		this.oldParent = b;
		return this
	};
	a.prototype.getOldParent = function() {
		return this.oldParent
	};
	a.prototype.setConnection = function(b) {
		if (b && b.family === "Connection") {
			this.connection = b
		} else {
			throw new Error("setConnection():  parameter is not valid")
		}
		return this
	};
	a.prototype.getConnection = function() {
		return this.connection
	};
	a.prototype.getRepresentation = function() {
		return this.representation
	};
	a.prototype.setRepresentation = function(b) {
		if (b instanceof PMUI.draw.RegularShape) {
			this.representation = b
		} else {
			throw new Error("setRepresentation():  parameter must be an instance of any regularShape")
		}
		return this
	};
	a.prototype.getPoint = function(c) {
		var b = parseInt(this.parent.style.getProperty("border"), 10) || 0;
		if (c) {
			return new PMUI.util.Point(this.getX() + Math.round(this.getWidth() / 2), this.getY() + Math.round(this.getHeight() / 2))
		}
		return new PMUI.util.Point(this.getAbsoluteX() + Math.round(this.getWidth() / 2), this.getAbsoluteY() + Math.round(this.getHeight() / 2))
	};
	a.prototype.getPercentage = function() {
		return this.percentage
	};
	a.prototype.stringify = function() {
		var b = {},
		c = {
			x: this.getX(),
			y: this.getY(),
			realX: this.realX,
			realY: this.realY,
			parent: this.getParent().getID()
		};
		$.extend(true, b, c);
		return b
	};
	PMUI.extendNamespace("PMUI.draw.Port", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b);
		this.parent = null;
		this.startPoint = null;
		this.endPoint = null;
		this.zOrder = PMUI.draw.Shape.prototype.MAX_ZINDEX;
		this.previousNeighbor = null;
		this.nextNeighbor = null;
		this.orientation = "";
		this.width = 1;
		this.graphics = null;
		this.segmentStyle = null;
		this.segmentColor = null;
		this.moveHandler = null;
		this.intersections = new PMUI.util.ArrayList();
		this.hasMoveHandler = false;
		a.prototype.init.call(this, b)
	};
	PMUI.inheritFrom("PMUI.draw.Core", a);
	a.prototype.type = "Segment";
	a.prototype.init = function(b) {
		var c = {
			startPoint: new PMUI.util.Point(0, 0),
			endPoint: new PMUI.util.Point(0, 0),
			parent: null,
			color: new PMUI.util.Color(0, 0, 0),
			zOrder: 10
		};
		$.extend(true, c, b);
		this.setStartPoint(c.startPoint).setEndPoint(c.endPoint).setColor(c.color).setParent(c.parent).setZOrder(c.zOrder)
	};
	a.prototype.createHTML = function() {
		this.html = document.createElement("div");
		this.html.id = this.id;
		this.html.style.position = "absolute";
		this.html.style.left = "0px";
		this.html.style.top = "0px";
		this.html.style.height = "0px";
		this.html.style.width = "0px";
		this.html.style.zIndex = this.zOrder;
		return this.html
	};
	a.prototype.paint = function() {
		if (this.getHTML() === null) {
			return this
		}
		if (this.graphics === null) {
			this.graphics = new PMUI.draw.Graphics(this.html)
		}
		this.graphics.drawLine(this.startPoint.x, this.startPoint.y, this.endPoint.x, this.endPoint.y, this.segmentStyle, this.segmentColor);
		if (isIE8()) {
			$($(this.html).children().children()[0]).css("background", "#000")
		}
		this.parent.html.appendChild(this.html);
		return this
	};
	a.prototype.destroy = function() {
		$(this.html).remove();
		return this
	};
	a.prototype.paintWithIntersections = function() {
		this.destroy();
		var e, d, f, c, b = false;
		if (this.getHTML() === null) {
			return this
		}
		if (this.graphics === null) {
			this.graphics = new PMUI.draw.Graphics(this.html)
		}
		if (this.hasMoveHandler) {
			$(this.moveHandler.html).remove();
			this.addSegmentMoveHandler()
		}
		if (this.orientation === this.HORIZONTAL) {
			f = new PMUI.util.Point(PMUI.draw.Shape.prototype.DEFAULT_RADIUS, 0);
			if (this.startPoint.x > this.endPoint.x) {
				b = true
			}
			this.intersections.sort(function(h, g) {
				return h.center.x - g.center.x
			})
		} else {
			f = new PMUI.util.Point(0, PMUI.draw.Shape.prototype.DEFAULT_RADIUS);
			if (this.startPoint.y > this.endPoint.y) {
				b = true
			}
			this.intersections.sort(function(h, g) {
				return h.center.y - g.center.y
			})
		}
		this.graphics.graphics.clear();
		e = this.startPoint.clone();
		for (c = 0; c < this.intersections.getSize(); c += 1) {
			if (b) {
				d = this.intersections.get(this.intersections.getSize() - c - 1).center
			} else {
				d = this.intersections.get(c).center
			}
			if (b) {
				d = d.add(f)
			} else {
				d = d.subtract(f)
			}
			this.graphics.drawLine(e.x, e.y, d.x, d.y, this.segmentStyle, this.segmentColor, 0, 0, true);
			if (b) {
				e = d.subtract(f.multiply(2))
			} else {
				e = d.add(f.multiply(2))
			}
		}
		d = this.endPoint.clone();
		this.graphics.drawLine(e.x, e.y, d.x, d.y, this.segmentStyle, this.segmentColor, 0, 0, true);
		this.parent.html.appendChild(this.html);
		return this
	};
	a.prototype.addSegmentMoveHandler = function() {
		var c = (this.startPoint.x + this.endPoint.x) / 2,
		b = (this.startPoint.y + this.endPoint.y) / 2;
		this.moveHandler = new PMUI.draw.SegmentMoveHandler({
			parent: this,
			orientation: this.orientation,
			style: {
				cssProperties: {
					border: "1px solid black"
				}
			}
		});
		c -= this.moveHandler.width / 2;
		b -= this.moveHandler.height / 2;
		this.moveHandler.setPosition(c, b);
		this.html.appendChild(this.moveHandler.getHTML());
		this.moveHandler.paint();
		this.moveHandler.attachListeners(this.moveHandler);
		return this
	};
	a.prototype.getParent = function() {
		return this.parent
	};
	a.prototype.getStartPoint = function() {
		return this.startPoint
	};
	a.prototype.getEndPoint = function() {
		return this.endPoint
	};
	a.prototype.setParent = function(b) {
		this.parent = b;
		return this
	};
	a.prototype.setStartPoint = function(b) {
		this.startPoint = b;
		return this
	};
	a.prototype.setEndPoint = function(b) {
		this.endPoint = b;
		return this
	};
	a.prototype.setStyle = function(b) {
		this.segmentStyle = b;
		return this
	};
	a.prototype.setColor = function(b) {
		this.segmentColor = b;
		return this
	};
	a.prototype.createIntersectionWith = function(f, g) {
		var b, e, d, c = true;
		if (g) {
			e = g
		} else {
			e = PMUI.draw.Geometry.segmentIntersectionPoint(this.startPoint, this.endPoint, f.startPoint, f.endPoint)
		}
		for (d = 0; d < this.intersections.getSize(); d += 1) {
			if (g.equals(this.intersections.get(d).center)) {
				c = false
			}
		}
		if (c) {
			b = new PMUI.draw.Intersection(e, f.parent.getID(), this);
			this.html.appendChild(b.getHTML());
			b.paint();
			this.intersections.insert(b)
		}
		return this
	};
	a.prototype.clearIntersections = function() {
		var c, d, b = this.intersections.getSize();
		while (b > 0) {
			d = this.intersections.get(b - 1);
			$(d.html).remove();
			this.intersections.popLast();
			b -= 1
		}
		return this
	};
	a.prototype.moveSegment = function(b, h) {
		var g = this.moveHandler,
		f = this.previousNeighbor,
		e = this.nextNeighbor,
		d, c;
		if (g.orientation === g.VERTICAL) {
			this.startPoint.x = b + g.width / 2;
			this.endPoint.x = b + g.width / 2;
			f.endPoint.x = this.startPoint.x;
			e.startPoint.x = this.endPoint.x
		} else {
			this.startPoint.y = h + g.height / 2;
			this.endPoint.y = h + g.height / 2;
			f.endPoint.y = this.startPoint.y;
			e.startPoint.y = this.endPoint.y
		}
		if (this.moveHandler) {
			d = (this.startPoint.x + this.endPoint.x) / 2 - this.moveHandler.width / 2;
			c = (this.startPoint.y + this.endPoint.y) / 2 - this.moveHandler.height / 2;
			this.moveHandler.setPosition(d, c)
		}
		f.paint();
		if (f.moveHandler) {
			d = (f.startPoint.x + f.endPoint.x) / 2 - f.moveHandler.width / 2;
			c = (f.startPoint.y + f.endPoint.y) / 2 - f.moveHandler.height / 2;
			f.moveHandler.setPosition(d, c)
		}
		e.paint();
		if (e.moveHandler) {
			d = (e.startPoint.x + e.endPoint.x) / 2 - e.moveHandler.width / 2;
			c = (e.startPoint.y + e.endPoint.y) / 2 - e.moveHandler.height / 2;
			e.moveHandler.setPosition(d, c)
		}
		this.paint();
		return this
	};
	a.prototype.hit = function(f, c) {
		var b, e;
		X1 = this.startPoint.x;
		Y1 = this.startPoint.y;
		X2 = this.endPoint.x;
		Y2 = this.endPoint.y;
		px = c.x;
		py = c.y;
		X2 -= X1;
		Y2 -= Y1;
		px -= X1;
		py -= Y1;
		b = px * X2 + py * Y2;
		if (b <= 0) {
			e = 0
		} else {
			px = X2 - px;
			py = Y2 - py;
			b = px * X2 + py * Y2;
			if (b <= 0) {
				e = 0
			} else {
				e = b * b / (X2 * X2 + Y2 * Y2)
			}
		}
		var d = px * px + py * py - e;
		if (d < 0) {
			d = 0
		}
		return Math.sqrt(d) < f
	};
	PMUI.extendNamespace("PMUI.draw.Segment", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b);
		a.prototype.initObject.call(this, b)
	};
	PMUI.inheritFrom("PMUI.draw.Core", a);
	a.prototype.initObject = function(b) {
		this.createHTML();
		this.attachListeners()
	};
	a.prototype.attachListeners = function() {
		var b = $(this.html);
		b.on("mousedown", this.onMouseDown(this)).on("mouseup", this.onMouseUp(this)).on("mousemove", this.onMouseMove(this)).on("click", this.onClick(this)).droppable({
			accept: "*",
			greedy: true,
			onDrop: function() {
				return false
			}
		})
	};
	a.prototype.onMouseDown = function(b) {
		return function(d, c) {
			d.stopPropagation()
		}
	};
	a.prototype.onMouseUp = function(b) {
		return function(d, c) {
			d.stopPropagation()
		}
	};
	a.prototype.onClick = function(b) {
		return function(d, c) {
			d.stopPropagation()
		}
	};
	a.prototype.onMouseMove = function(b) {
		return function(d, c) {
			d.stopPropagation()
		}
	};
	PMUI.extendNamespace("PMUI.draw.ReadOnlyLayer", a);
	if (typeof exports !== "undefined") {
		module.exports = a
	}
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b);
		this.text = null;
		this.dom = {};
		a.prototype.init.call(this, b)
	};
	PMUI.inheritFrom("PMUI.core.Item", a);
	a.prototype.type = "ToolbarItem";
	a.prototype.init = function(b) {
		var c = {
			text: ""
		};
		jQuery.extend(true, c, b);
		this.setText(c.text)
	};
	a.prototype.setText = function(b) {
		if (typeof b !== "string") {
			throw new Error("setText(): The parameter must be a string.")
		}
		this.text = b;
		if (this.dom.textContainer) {
			this.dom.textContainer = b
		}
		return this
	};
	a.prototype.createHTML = function() {
		if (this.html) {
			return this.html
		}
		a.superclass.prototype.createHTML.call(this);
		this.dom.textContainer = this.html;
		return this.html
	};
	PMUI.extendNamespace("PMUI.toolbar.ToolbarItem", a)
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b);
		this.action = null;
		this.visibleIcon = null;
		this.iconClass = null;
		a.prototype.init.call(this, b)
	};
	PMUI.inheritFrom("PMUI.toolbar.ToolbarItem", a);
	a.prototype.init = function(b) {
		var c = {
			action: null,
			visibleIcon: true,
			iconClass: null,
			elementTag: "li"
		};
		jQuery.extend(true, c, b);
		this.setElementTag(c.elementTag).setAction(c.action).setIconClass(c.iconClass);
		if (c.visibleIcon) {
			this.showIcon()
		} else {
			this.hideIcon()
		}
	};
	a.prototype.setIconClass = function(b) {
		if (! (b === null || typeof b === "string")) {
			throw new Error("setIconClass(): the parameter must be a string or null.")
		}
		this.iconClass = b;
		if (this.dom.iconContainer) {
			this.dom.iconContainer.className = "pmui-toolbaraction-icon " + (b || "")
		}
		return this
	};
	a.prototype.setText = function(b) {
		if (typeof b !== "string") {
			throw new Error("setText(): The parameter must be a string.")
		}
		this.text = b;
		if (this.dom.textContainer) {
			this.dom.textContainer.textContent = b
		}
		return this
	};
	a.prototype.setAction = function(b) {
		if (! (b === null || typeof b === "function")) {
			throw new Error("setAction(): the parameter must be a function or null.")
		}
		this.action = b;
		return this
	};
	a.prototype.showIcon = function() {
		this.visibleIcon = true;
		if (this.dom.iconContainer) {
			this.dom.iconContainer.style.display = ""
		}
		return this
	};
	a.prototype.hideIcon = function() {
		this.visibleIcon = false;
		if (this.dom.iconContainer) {
			this.dom.iconContainer.style.display = "none"
		}
		return this
	};
	a.prototype.attachEventListeners = function() {
		var b = this;
		if (this.html) {
			this.removeEvents();
			this.addEvent("click").listen(this.dom.link,
			function(c) {
				c.preventDefault();
				c.stopPropagation();
				if (typeof b.action === "function") {
					b.action(b)
				}
			})
		}
		return this
	};
	a.prototype.createHTML = function() {
		var c, b, d;
		if (this.html) {
			return this.html
		}
		a.superclass.prototype.createHTML.call(this);
		c = PMUI.createHTMLElement("a");
		c.className = "pmui-toolbaraction-link";
		c.href = "#";
		b = PMUI.createHTMLElement("i");
		b.className = "pmui-toolbaraction-icon";
		d = PMUI.createHTMLElement("span");
		d.className = "pmui-toolbaraction-text";
		c.appendChild(b);
		c.appendChild(d);
		this.dom.iconContainer = b;
		this.dom.link = c;
		this.dom.textContainer = d;
		this.html.appendChild(c);
		this.setText(this.text).setIconClass(this.iconClass);
		this.attachEventListeners();
		return this.html
	};
	PMUI.extendNamespace("PMUI.toolbar.ToolbarAction", a)
} ()); (function() {
	var a = function(b) {
		a.superclass.call(this, b);
		a.prototype.init.call(this, b)
	};
	PMUI.inheritFrom("PMUI.core.Container", a);
	a.prototype.type = "Toolbar";
	a.prototype.init = function(b) {
		var c = {
			elementTag: "ul"
		};
		jQuery(true, c, b);
		this.setElementTag(c.elementTag)
	};
	a.prototype.setFactory = function() {
		this.factory = new PMUI.util.Factory({
			products: {
				toolbaraction: PMUI.toolbar.ToolbarAction
			},
			defaultProduct: "toolbaraction"
		});
		return this
	};
	PMUI.extendNamespace("PMUI.toolbar.Toolbar", a)
} ());
PMUI.init();