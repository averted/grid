import Gem from './gem';
import Grid from './grid';

/**
 * Shape constructor
 */
function Shape(options) {
  this.offset = { x:0, y:0 };
  this.coords = { x:0, y:0 };
  this.type   = options.type;
  this.area   = options.area;
  this.width  = options.width;
  this.height = options.height;
  this.img    = options.img;
  this.cells  = options.cells;
  this.gems   = options.gems;
  this.Gems   = [];

  let css = {
    width: this.width,
    height: this.height,
    backgroundImage: `url(${ this.img })`,
  };

  console.log('css', css)

  this.wrapper = $('<div/>')
    .addClass('grid-shape')
    .css(css)
    .on('mousedown', this.rotate.bind(this));

  this.buildGems();
}

Shape.prototype = {
  constructor: Shape,

  /**
   * Build Shape's gems
   */
  buildGems: function() {
    var gems = [];

    this.gems.forEach((item, index) => {
      var gem = new Gem(item);

      gem.Shape = this;
      this.Gems.push(gem);

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
  rotate: function(e) {
    if (e.which === 3) {
      this.rotateWrapper();
      this.rotateMatrix();
    }
  },

  /**
   * Rotate Shape's matrix in Grid
   */
  rotateMatrix: function() {
    var rotatedCells = [];

    this.cells.forEach(function(item, index, obj) {
      var cell      = item.charAt(0)
        , newIndex  = index + 1 >= obj.length ? 0 : index + 1
        , direction = obj[newIndex].charAt(1);

      switch (cell) {
        case '1': cell = '4'; break;
        case '2': cell = '1'; break;
        case '3': cell = '2'; break;
        case '4': cell = '3'; break;
      }

      rotatedCells[newIndex] = cell + direction;
    });

    // remove Shape from it's coords and draw a new one on top
    Grid.drawShape(this, this.coords, 'remove');
    this.cells = rotatedCells;
    Grid.drawShape(this, this.coords);

    // LOGGING
    Grid.matrix.forEach(function(item, index) {
      console.log(item);
    });

    return true;
  },

  /**
   * Rotate Shape's wrapper (image)
   */
  rotateWrapper: function() {
    var angle = 0
      , transform = this.wrapper.css("-webkit-transform") ||
          this.wrapper.css("-moz-transform")    ||
          this.wrapper.css("-ms-transform")     ||
          this.wrapper.css("-o-transform")      ||
          this.wrapper.css("transform");

    if (transform !== 'none') {
      var values = transform.split('(')[1].split(')')[0].split(',')
        , a = values[0]
        , b = values[1];

      angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
    }

    angle = angle < 0 ? angle += 360 : angle;

    return this.wrapper.css('transform', 'rotate(' + (angle + 90) + 'deg)');
  },

  /**
   * Enable dragging functionality and handle matrix adjustments
   */
  enableDrag: function() {
    var shape = this;

    this.wrapper.draggable({
      grid: [ 128, 128 ],
      containment: 'parent',

      start: function(e, ui) {
        var y = (ui.originalPosition.top) / 128,
          x = (ui.originalPosition.left) / 128;

        // remove shape from matrix
        Grid.drawShape(shape, { x: x, y: y }, 'remove');

        // add class to prevent default click event
        $(this).addClass('shape-dragging');
      },

      stop: function(e, ui) {
        var y  = (ui.originalPosition.top) / 128
          , x  = (ui.originalPosition.left) / 128
          , newY = (ui.position.top) / 128
          , newX = (ui.position.left) / 128;

        // move shape to new coords
        if (Grid.willFitShape(shape, { x: newX, y: newY })) {
          Grid.drawShape(shape, { x: newX, y: newY });
        } else {
          shape.destroy();
        }

        // LOGGING
        Grid.matrix.forEach(function(item, index) {
          console.log(item);
        });
      },
    });
  },

  /**
   * Check if Shape is completely filled with proper Gems
   *
   * @return true|false   Returns true if all gems match their corresponding socket's color
   */
  checkComplete: function() {
    var result = true;

    this.Gems.forEach(function(gem, index) {
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
  destroy: function() {
    this.gems = null;
    this.Gems = null;
    this.offset = null;
    this.coords = null;

    this.wrapper.remove();
  }
};

export default Shape;
