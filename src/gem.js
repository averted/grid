import Spark from './spark';
import Notification from './notification';

/**
 * Gem constructor
 */
function Gem(options) {
  this.color = options.color;
  this.img = this.getImage(this.color);
  this.offset = { x:options.offset.x, y:options.offset.y };
  this.Spark = null;
  this.Shape = null;

  this.wrapper = $('<div/>').addClass('grid-shape-gem').css({
    backgroundImage: this.img,
    top: this.offset.y * 128 + 'px',
    left: this.offset.x * 128 + 'px',
  }).on('click', this.handleClick.bind(this));
}

Gem.prototype = {
  constructor: Gem,

  /**
   * Render random spark.
   */
  handleClick(e) {
    let wrap = $(this.wrapper).parent();

    // prevent default click while dragging
    if (wrap.hasClass('shape-dragging')) {
      wrap.removeClass('shape-dragging');
      return false;
    }

    // add spark to gem
    this.addSpark(this.getRandomSpark());
  },

  /**
   * Render random spark.
   */
  getRandomSpark() {
    let type = null;

    switch (Math.floor(Math.random() * 3)) {
      case 0: type = 'health'; break;
      case 1: type = 'power'; break;
      case 2: type = 'haste'; break;
    }

    return new Spark(type);
  },

  /**
   * Add Spark to Gem
   *
   * @param spark   Spark object
   */
  addSpark: function(spark) {
    this.Spark = spark;
    this.wrapper.html(spark.wrapper);

    if (this.Shape.checkComplete()) {
      Notification.render({
        msg: 'Shape bonus activated',
        type: 'success'
      });
    }

    return true;
  },

  /**
   * Remove Spark from Gem
   *
   * @return true
   */
  removeSpark: function() {
    this.Spark = null;
    this.wrapper.html();

    return true;
  },

  /**
   * Get image URL based on gem color
   *
   * @param color    Gem color
   */
  getImage: function(color) {
    var img = 'none';

    switch (color) {
      case 'red':   img = 'url("img/gem_red.png")'; break;
      case 'blue':  img = 'url("img/gem_blue.png")'; break;
      case 'green': img = 'url("img/gem_green.png")'; break;
      case 'combo': img = 'url("img/gem_combo.png")'; break;
    }

    return img;
  }
}

export default Gem;
