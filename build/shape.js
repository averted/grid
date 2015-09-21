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