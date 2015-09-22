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
      _notification2['default'].render({ type: 'success', msg: 'Shape bonus activated' });
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