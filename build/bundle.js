(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _spark = require('./spark');

var _spark2 = _interopRequireDefault(_spark);

var _notification = require('./notification');

var _notification2 = _interopRequireDefault(_notification);

/**
 * Gem constructor
 */
function Gem(options) {
  this.color = options.color;
  this.img = this.getImage(this.color);
  this.offset = { x: options.offset.x, y: options.offset.y };
  this.Spark = null;
  this.Shape = null;

  this.wrapper = $('<div/>').addClass('grid-shape-gem').css({
    backgroundImage: this.img,
    top: this.offset.y * 128 + 'px',
    left: this.offset.x * 128 + 'px'
  }).on('click', this.handleClick.bind(this));
}

Gem.prototype = {
  constructor: Gem,

  /**
   * Render random spark.
   */
  handleClick: function handleClick(e) {
    var wrap = $(this.wrapper).parent();

    // prevent default click while dragging
    if (wrap.hasClass('shape-dragging')) {
      wrap.removeClass('shape-dragging');
      return false;
    }

    // add spark to gem
    this.addSpark(this.getRandomSpark());
  },

  /**
   * Add Spark to Gem
   *
   * @param spark   Spark object
   */
  addSpark: function addSpark(spark) {
    this.Spark = spark;
    this.wrapper.html(spark.wrapper);

    if (this.Shape.checkComplete()) {
      _notification2['default'].render({ type: 'sucess', msg: 'Shape bonus activated' });
    }

    return true;
  },

  /**
   * Remove Spark from Gem
   *
   * @return true
   */
  removeSpark: function removeSpark() {
    this.Spark = null;
    this.wrapper = null;
  },

  /**
   * Render random spark.
   */
  getRandomSpark: function getRandomSpark() {
    var type = null;

    switch (Math.floor(Math.random() * 3)) {
      case 0:
        type = 'health';break;
      case 1:
        type = 'power';break;
      case 2:
        type = 'haste';break;
    }

    return new _spark2['default'](type);
  },

  /**
   * Get image URL based on gem color
   *
   * @param color    Gem color
   */
  getImage: function getImage(color) {
    var img = 'none';

    switch (color) {
      case 'red':
        img = 'url("img/gem_red.png")';break;
      case 'blue':
        img = 'url("img/gem_blue.png")';break;
      case 'green':
        img = 'url("img/gem_green.png")';break;
      case 'combo':
        img = 'url("img/gem_combo.png")';break;
    }

    return img;
  }
};

exports['default'] = Gem;
module.exports = exports['default'];
},{"./notification":4,"./spark":6}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _notification = require('./notification');

var _notification2 = _interopRequireDefault(_notification);

/**
 * Grid
 */
var Grid = {
  wrapper: $('.grid'),
  availableSpace: 266256,
  matrix: [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],

  /**
   * Build Shape and add it's DOM to Grid
   *
   * @param  shape   Shape object
   */
  addShape: function addShape(shape) {
    if (!Grid.hasSpace(shape)) {
      return _notification2['default'].render({ type: 'error', msg: 'Not enough space' });
    }

    // find starting location for shape
    var coords = Grid.findLocationForShape(shape);
    if (coords) {
      Grid.drawShape(shape, coords);
    } else {
      return _notification2['default'].render({ type: 'error', msg: 'NO SPACE, try re-organizing?' });
    }

    // add offset relative to other shapes in grid
    shape.wrapper.css({
      top: shape.offset.y * 128 + 'px',
      left: shape.offset.x * 128 + 'px'
    });

    // add shape dom to grid
    this.wrapper.append(shape.wrapper);
    shape.enableDrag();
  },

  /**
   * Find space in Grid to fit the shape
   *
   * @param  shape        Shape object
   * @return false | coords   Return X,Y coords if shape can fit in Grid, otherwise false
   */
  findLocationForShape: function findLocationForShape(shape) {
    for (var y = 0; y < 4; y++) {
      for (var x = 0; x < 4; x++) {
        // attempt to draw shape at x, y
        if (Grid.willFitShape(shape, { x: x, y: y })) {
          return { x: x, y: y };
        }

        shape.offset.x++;
        if (x == 3) {
          shape.offset.x = 0;
        }
      }
      shape.offset.y++;
    }

    return false;
  },

  /**
   * Draw a shape in Grid's matrix
   *
   * @param shape     Shape object
   * @param coords    X,Y coords
   * @param flag      Optional flag to remove a shape (default: false)
   */
  drawShape: function drawShape(shape, coords) {
    var remove = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    var x = coords.x,
        y = coords.y;

    shape.cells.forEach(function (item, index, obj) {
      var cell = item.charAt(0),
          direction = item.charAt(1);

      switch (Grid.matrix[y][x]) {
        case '1':
          if (cell === '3') {
            cell = '13';
          }break;
        case '2':
          if (cell === '4') {
            cell = '24';
          }break;
        case '3':
          if (cell === '1') {
            cell = '13';
          }break;
        case '4':
          if (cell === '2') {
            cell = '24';
          }break;
      }

      if (remove) {
        if (Grid.matrix[y][x].length == 2) {
          var first = Grid.matrix[y][x].charAt(0),
              second = Grid.matrix[y][x].charAt(1);

          Grid.matrix[y][x] = first == cell ? second : first;
        } else {
          Grid.matrix[y][x] = cell === '0' ? Grid.matrix[y][x] : 0;
        }
      } else {
        Grid.matrix[y][x] = cell === '0' ? Grid.matrix[y][x] : cell;
      }

      switch (direction) {
        case '1':
          y--;break; // top
        case '2':
          x++;break; // right
        case '3':
          y++;break; // bottom
        case '4':
          x--;break; // left
      }
    });

    shape.coords = { x: coords.x, y: coords.y };

    // manage Grid's available space
    this.availableSpace = remove ? this.availableSpace + shape.area : this.availableSpace - shape.area;
  },

  /**
   * Check if cell can fit into matrix
   *
   * @param cell        Value to check (one of: [ 0, 1, 2, 3, 4, 5 ])
   * @param matrix_cell   Value of current matrix cell
   */
  willFit: function willFit(cell, matrix_cell) {
    if (matrix_cell == 0) {
      return true;
    }

    switch (cell) {
      case '0':
        return true;
      case '1':
        if (matrix_cell == 3) {
          return true;
        }break;
      case '2':
        if (matrix_cell == 4) {
          return true;
        }break;
      case '3':
        if (matrix_cell == 1) {
          return true;
        }break;
      case '4':
        if (matrix_cell == 2) {
          return true;
        }break;
      default:
        return false;
    }

    return false;
  },

  /**
   * Check if whole shape will fit into matrix
   *
   * @param shape   Shape object
   * @param coords  X,Y coordiantes
   */
  willFitShape: function willFitShape(shape, coords) {
    var x = coords.x,
        y = coords.y,
        result = true;

    shape.cells.forEach(function (item, index) {
      var cell = item.charAt(0),
          direction = item.charAt(1);

      if (!result) {
        return false;
      }

      // check if shape is out of grid bounds
      if (y < 0 || y > 3 || x < 0 || x > 3) {
        return result = false;
      }

      // check if cell can physically fit into the matrix
      if (!Grid.willFit(cell, Grid.matrix[y][x])) {
        return result = false;
      }

      switch (direction) {
        case '1':
          y--;break; // top
        case '2':
          x++;break; // right
        case '3':
          y++;break; // bottom
        case '4':
          x--;break; // left
      }
    });

    return result;
  },

  /**
   * Check if Grid has enough available space for specified shape
   *
   * @param shape   Shape object
   */
  hasSpace: function hasSpace(shape) {
    return this.availableSpace - shape.area >= 0 ? true : false;
  }
};

exports['default'] = Grid;
module.exports = exports['default'];
},{"./notification":4}],3:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _grid = require('./grid');

var _grid2 = _interopRequireDefault(_grid);

var _shape = require('./shape');

var _shape2 = _interopRequireDefault(_shape);

/**
 * Define shapes
 */
var shapes = {
  "common": {
    "triangle": {
      "type": "triangle",
      "width": 256,
      "height": 256,
      "area": 32768,
      "cells": ["02", "33", "54", "30"],
      "gems": [{
        "color": "red",
        "offset": { "x": 1, "y": 1 }
      }],
      "img": "img/shape_triangle.png",
      "bonus": "none"
    },

    "square": {
      "type": "square",
      "width": 128,
      "height": 128,
      "area": 16384,
      "cells": ["50"],
      "gems": ["10"],
      "gems": [{
        "color": "blue",
        "offset": { "x": 0, "y": 0 }
      }],
      "img": "img/shape_square.png"
    },

    "square2x": {
      "type": "square2x",
      "width": 256,
      "height": 256,
      "area": 65534,
      "cells": ["52", "53", "54", "50"],
      "gems": [{
        "color": "red",
        "offset": { "x": 0, "y": 0 }
      }, {
        "color": "green",
        "offset": { "x": 1, "y": 0 }
      }, {
        "color": "blue",
        "offset": { "x": 1, "y": 1 }
      }, {
        "color": "combo",
        "offset": { "x": 0, "y": 1 }
      }],
      "img": "img/shape_square2x.png"
    },

    "rectangle": {
      "type": "rectangle",
      "width": 256,
      "height": 128,
      "area": 32768,
      "cells": ["52", "50"],
      "gems": [{
        "color": "red",
        "offset": { "x": 0, "y": 0 }
      }, {
        "color": "green",
        "offset": { "x": 1, "y": 0 }
      }],
      "img": "img/shape_rectangle.png"
    },

    "outrider": {
      "type": "outrider",
      "width": 256,
      "height": 384,
      "area": 65536,
      "cells": ["32", "23", "54", "53", "50"],
      "gems": [{
        "color": "combo",
        "offset": { "x": 0.5, "y": 0.2 }
      }, {
        "color": "green",
        "offset": { "x": 0, "y": 1 }
      }, {
        "color": "green",
        "offset": { "x": 1, "y": 1 }
      }, {
        "color": "combo",
        "offset": { "x": 0, "y": 2 }
      }],
      "img": "img/shape_outrider.png"
    }
  }
};

/**
 * App
 */
(function () {
  $('.shape').on('click', function () {
    var shape_type = $(this).attr('data-type');

    _grid2['default'].addShape(new _shape2['default'](shapes.common[shape_type]));
  });
})();
},{"./grid":2,"./shape":5}],4:[function(require,module,exports){
/**
 * Notification service.
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var Notification = {
  id: 'grid-notifications',
  'class': 'alert',

  render: function render(options) {
    var el = document.getElementById(this.id),
        node = document.createElement('div'),
        msg = document.createElement('span'),
        title = document.createElement('span');

    node.className = this['class'];
    title.className = 'title';
    msg.className = 'msg';

    title.innerHTML = options.type.charAt(0).toUpperCase() + options.type.slice(1);
    msg.innerHTML = options.msg;

    node.appendChild(title);
    node.appendChild(msg);
    el.insertBefore(node, el.firstChild);

    setTimeout(function () {
      node.className += ' ' + options.type;
    }, 100);

    return this.setDuration();
  },

  setDuration: function setDuration(time) {
    return setTimeout(function () {
      Notification.removeAlert();
    }, time || 4000);
  },

  removeAlert: function removeAlert() {
    var alerts = document.getElementsByClassName(this['class']),
        lastAlert = alerts[alerts.length - 1],
        notifications = document.getElementById(this.id);

    notifications.removeChild(lastAlert);
  }
};

exports['default'] = Notification;
module.exports = exports['default'];
},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _gem = require('./gem');

var _gem2 = _interopRequireDefault(_gem);

var _grid = require('./grid');

var _grid2 = _interopRequireDefault(_grid);

/**
 * Shape constructor
 */
function Shape(options) {
  this.offset = { x: 0, y: 0 };
  this.coords = { x: 0, y: 0 };
  this.type = options.type;
  this.area = options.area;
  this.width = options.width;
  this.height = options.height;
  this.img = options.img;
  this.cells = options.cells;
  this.gems = options.gems;
  this.Gems = [];

  var css = {
    width: this.width,
    height: this.height,
    backgroundImage: 'url(' + this.img + ')'
  };

  this.wrapper = $('<div/>').addClass('grid-shape').css(css).on('mousedown', this.rotate.bind(this));

  this.buildGems();
}

Shape.prototype = {
  constructor: Shape,

  /**
   * Build Shape's gems
   */
  buildGems: function buildGems() {
    var _this = this;

    var gems = [];

    this.gems.forEach(function (item, index) {
      var gem = new _gem2['default'](item);

      gem.Shape = _this;
      _this.Gems.push(gem);

      gems.push(gem.wrapper);

      // dereference
      gem = null;
    });

    // add gems to shape dom
    this.wrapper.append(gems);
  },

  /**
   * Rotate Shape
   */
  rotate: function rotate(e) {
    if (e.which === 3) {
      this.rotateWrapper();
      this.rotateMatrix();
    }
  },

  /**
   * Rotate Shape's matrix in Grid
   */
  rotateMatrix: function rotateMatrix() {
    var rotatedCells = [];

    this.cells.forEach(function (item, index, obj) {
      var cell = item.charAt(0),
          newIndex = index + 1 >= obj.length ? 0 : index + 1,
          direction = obj[newIndex].charAt(1);

      switch (cell) {
        case '1':
          cell = '4';break;
        case '2':
          cell = '1';break;
        case '3':
          cell = '2';break;
        case '4':
          cell = '3';break;
      }

      rotatedCells[newIndex] = cell + direction;
    });

    // remove Shape from it's coords and draw a new one on top
    _grid2['default'].drawShape(this, this.coords, 'remove');
    this.cells = rotatedCells;
    _grid2['default'].drawShape(this, this.coords);

    // LOGGING
    _grid2['default'].matrix.forEach(function (item, index) {
      console.log(item);
    });

    return true;
  },

  /**
   * Rotate Shape's wrapper (image)
   */
  rotateWrapper: function rotateWrapper() {
    var angle = 0,
        transform = this.wrapper.css("-webkit-transform") || this.wrapper.css("-moz-transform") || this.wrapper.css("-ms-transform") || this.wrapper.css("-o-transform") || this.wrapper.css("transform");

    if (transform !== 'none') {
      var values = transform.split('(')[1].split(')')[0].split(','),
          a = values[0],
          b = values[1];

      angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
    }

    angle = angle < 0 ? angle += 360 : angle;

    return this.wrapper.css('transform', 'rotate(' + (angle + 90) + 'deg)');
  },

  /**
   * Enable dragging functionality and handle matrix adjustments
   */
  enableDrag: function enableDrag() {
    var shape = this;

    this.wrapper.draggable({
      grid: [128, 128],
      containment: 'parent',

      start: function start(e, ui) {
        var y = ui.originalPosition.top / 128,
            x = ui.originalPosition.left / 128;

        // remove shape from matrix
        _grid2['default'].drawShape(shape, { x: x, y: y }, 'remove');

        // add class to prevent default click event
        $(this).addClass('shape-dragging');
      },

      stop: function stop(e, ui) {
        var y = ui.originalPosition.top / 128,
            x = ui.originalPosition.left / 128,
            newY = ui.position.top / 128,
            newX = ui.position.left / 128;

        // move shape to new coords
        if (_grid2['default'].willFitShape(shape, { x: newX, y: newY })) {
          _grid2['default'].drawShape(shape, { x: newX, y: newY });
        } else {
          shape.destroy();
        }

        // LOGGING
        _grid2['default'].matrix.forEach(function (item, index) {
          console.log(item);
        });
      }
    });
  },

  /**
   * Check if Shape is completely filled with proper Gems
   *
   * @return true|false   Returns true if all gems match their corresponding socket's color
   */
  checkComplete: function checkComplete() {
    var result = true;

    this.Gems.forEach(function (gem, index) {
      if (gem.Spark) {
        if (gem.Spark.color != gem.color && gem.color != 'combo') {
          result = false;
        }
      } else {
        result = false;
      }
    });

    return result;
  },

  /**
   * Destroy shape
   */
  destroy: function destroy() {
    this.gems = null;
    this.Gems = null;
    this.offset = null;
    this.coords = null;

    this.wrapper.remove();
  }
};

exports['default'] = Shape;
module.exports = exports['default'];
},{"./gem":1,"./grid":2}],6:[function(require,module,exports){
/**
 * Spark constructor
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
function Spark(type) {
  this.name = '';
  this.type = type;
  this.color = this.getColorFromType(this.type);
  this.img = this.getImageFromType(this.type);

  this.wrapper = $('<div/>').addClass('grid-shape-gem-spark').css({ backgroundImage: this.img });
}

Spark.prototype = {
  constructor: Spark,

  /**
   * Get image URL based on spark type
   *
   * @param type    Spark type
   */
  getImageFromType: function getImageFromType(type) {
    var img = 'none';

    switch (type) {
      case 'power':
        img = 'url("img/spark_flatPower.png")';break;
      case 'haste':
        img = 'url("img/spark_flatHaste.png")';break;
      case 'health':
        img = 'url("img/spark_flatHealth.png")';break;
    }

    return img;
  },

  /**
   * Get spark color based on type
   *
   * @param type    Spark type
   */
  getColorFromType: function getColorFromType(type) {
    var color = 'none';

    switch (type) {
      case 'power':
        color = 'green';break;
      case 'haste':
        color = 'blue';break;
      case 'health':
        color = 'red';break;
    }

    return color;
  }
};

exports['default'] = Spark;
module.exports = exports['default'];
},{}]},{},[3]);
