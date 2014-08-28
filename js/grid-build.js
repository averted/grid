'use strict';
/**
 * Extend prototype
 */
if (!Array.prototype.hasOwnProperty('forEach')) {
    Array.prototype.forEach = function (callback, thisArg) {
        var T, k;

        if (this == null) {
          throw new TypeError(" this is null or not defined");
        }

        var O = Object(this);
        var len = O.length >>> 0;

        if (typeof callback !== "function") {
          throw new TypeError(callback + " is not a function");
        }

        if (arguments.length > 1) { T = thisArg; }

        k = 0;

        while (k < len) {
          var kValue;

          if (k in O) {
            kValue = O[k];
            callback.call(T, kValue, k, O);
          }

          k++;
        }
    };
}

/**
 * Grid
 */
var Grid = {
    content: $('.grid'),
    availableSpace: 266256,
    matrix: [ [ 0, 0, 0, 0 ],
              [ 0, 0, 0, 0 ],
              [ 0, 0, 0, 0 ],
              [ 0, 0, 0, 0 ] ],

    /**
     * Build Shape and add it's DOM to Grid
     *
     * @param  shape     Shape object
     */
    addShape: function(shape) {
        // check for available space
        if (!Grid.hasSpace(shape)) { alert('not enough space'); return false; }

        // build shape dom
        shape.init();

        // find starting location for shape 
        var coords = Grid.findLocationForShape(shape);
        if (coords) {
            Grid.drawShape(shape, coords);
        } else {
            alert('NO SPACE, try re-organizing?');
            return false;
        }
        
        // add offset?
        shape.wrapper.css({
            top: shape.offset.y * 128 + 'px',
            left: shape.offset.x * 128 + 'px',
        });

        // add shape dom to grid
        this.content.append(shape.wrapper);
        shape.enableDrag();
    },

    /**
     * Find space in Grid to fit the shape
     *
     * @param  shape                Shape object
     * @return false | coords       Return X,Y coords if shape can fit in Grid, otherwise false
     */
    findLocationForShape: function(shape) {
        for (var y = 0; y < 4; y++) {
            for (var x = 0; x < 4; x++) {
                // attempt to draw shape at x, y
                if (Grid.willFitShape(shape, { x:x, y:y })) {
                    return { x: x, y: y }
                }

                shape.offset.x++;
                if (x == 3) { shape.offset.x = 0; }
            }
            shape.offset.y++;
        }

        return false;
    },

    /**
     * Draw a shape in Grid's matrix
     *
     * @param shape         Shape object
     * @param coords        X,Y coords
     * @param flag          Optional flag to remove a shape (default: false)
     */
    drawShape: function(shape, coords, flag) {
        var x = coords.x,
            y = coords.y,
            remove = flag || false;

        shape.cells.forEach(function(item, index, obj) {
            var cell      = item.charAt(0),
                direction = item.charAt(1);

            switch (Grid.matrix[y][x]) {
                case '1': if (cell === '3') { cell = '13'; } break;
                case '2': if (cell === '4') { cell = '24'; } break;
                case '3': if (cell === '1') { cell = '13'; } break;
                case '4': if (cell === '2') { cell = '24'; } break;
            }

            if (remove) {
                if (Grid.matrix[y][x].length == 2) {
                    var first  = Grid.matrix[y][x].charAt(0),
                        second = Grid.matrix[y][x].charAt(1);

                    Grid.matrix[y][x] = first == cell ? second : first;
                } else {
                    Grid.matrix[y][x] = (cell === '0') ? Grid.matrix[y][x] : 0;
                }
            } else {
                Grid.matrix[y][x] = cell === '0' ? Grid.matrix[y][x] : cell;
            }

            switch (direction) {
                case '1': y--; break; // top
                case '2': x++; break; // right
                case '3': y++; break; // bottom
                case '4': x--; break; // left
            }
        });

        shape.coords = { x:coords.x, y:coords.y };

        // manage Grid's available space
        this.availableSpace = remove ? this.availableSpace + shape.area : this.availableSpace - shape.area;
    },

    /**
     * Check if cell can fit into matrix
     * 
     * @param cell            Value to check (one of: [ 0, 1, 2, 3, 4, 5 ])
     * @param matrix_cell     Value of current matrix cell
     */
    willFit: function(cell, matrix_cell) {
        if (matrix_cell == 0) { return true; }

        switch (cell) {
            case '0': return true;
            case '1': if (matrix_cell == 3) { return true; } break;
            case '2': if (matrix_cell == 4) { return true; } break;
            case '3': if (matrix_cell == 1) { return true; } break;
            case '4': if (matrix_cell == 2) { return true; } break;
            default:
                return false;
        }

        return false;
    },

    /**
     * Check if whole shape will fit into matrix
     * 
     * @param shape     Shape object
     * @param coords    X,Y coordiantes
     */
    willFitShape: function(shape, coords) {
        var x = coords.x,
            y = coords.y,
            result = true;

        shape.cells.forEach(function(item, index) {
            var cell      = item.charAt(0),
                direction = item.charAt(1);

            if (result == false) { return false; }

            // check if shape is out of grid bounds
            if (y < 0 || y > 3 || x < 0 || x > 3) {
                return result = false;
            }

            // check if cell can physically fit into the matrix
            if (!Grid.willFit(cell, Grid.matrix[y][x])) {
                return result = false;
            }

            switch (direction) {
                case '1': y--; break; // top
                case '2': x++; break; // right
                case '3': y++; break; // bottom
                case '4': x--; break; // left
            }
        });

        return result;
    },

    /**
     * Check if Grid has enough available space for specified shape
     *
     * @param shape     Shape object
     */
    hasSpace: function(shape) {
        return this.availableSpace - shape.area >= 0 ? true : false;
    },
};

/**
 * Controls 
 */
var Controls = {
    /**
     * Initialize controls
     */
    init: function() {
        $('.shape').on('click', function() {
            var shape_type = $(this).attr('data-type');

            $.ajax({
                url: '/js/shapes.json',
                dataType: 'json',
                async: false,
                success: function(data) {
                    Grid.addShape(new Shape(data.common[shape_type]));
                }
            });
        });
    },
};

/**
 * Gem constructor
 */
function Gem(options) {
    this.wrapper = '';
    this.color = options.color; 
    this.img = this.getImage(this.color);
    this.offset = { x:options.offset.x, y:options.offset.y };
    this.Spark = null;
    this.Shape = null;
}

Gem.prototype = {
    constructor: Gem,

    /**
     * Build Gem
     */
    init: function() {
        var gem = this;

        this.wrapper = $('<div/>').addClass('grid-shape-gem').css({
            backgroundImage: this.img,
            top: this.offset.y * 128 + 'px',
            left: this.offset.x * 128 + 'px',
        }).on('click', function(e) {
            // prevent default click event while dragging
            var wrap = $(this).parent();
            if (wrap.hasClass('shape-dragging')) {
                wrap.removeClass('shape-dragging');
                return false;
            }

            // get random spark (testing)
            var type = '';
            switch (Math.floor(Math.random() * 3)) {
                case 0: type = 'health'; break;
                case 1: type = 'power'; break;
                case 2: type = 'haste'; break;
            }

            // create new spark
            var spark = new Spark(type);
            spark.init();

            // add spark to gem
            gem.addSpark(spark);

            // dereference
            spark = null;
        });
    },

    /**
     * Add Spark to Gem
     *
     * @param spark     Spark object
     */
    addSpark: function(spark) {
        this.Spark = spark;
        this.wrapper.html(spark.wrapper);

        if (this.Shape.checkComplete()) { alert('Shape bonus activated.'); }

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
     * @param color      Gem color 
     */
    getImage: function(color) {
        var img = 'none';

        switch (color) {
            case 'red':   img = 'url("/img/gem_red.png")'; break;
            case 'blue':  img = 'url("/img/gem_blue.png")'; break;
            case 'green': img = 'url("/img/gem_green.png")'; break;
            case 'combo': img = 'url("/img/gem_combo.png")'; break;
        }

        return img;
    }
}

/**
 * Spark constructor
 */
function Spark(type) {
    this.name = '';
    this.type = type; 
    this.color = this.getColorFromType(this.type);
    this.img = this.getImageFromType(this.type); 
    this.wrapper = '';
}

Spark.prototype = {
    constructor: Spark,

    /**
     * Build Spark
     */
    init: function() {
        this.wrapper = $('<div/>').addClass('grid-shape-gem-spark').css({
            backgroundImage: this.img,
        });
    },

    /**
     * Get image URL based on spark type
     * 
     * @param type      Spark type
     */
    getImageFromType: function(type) {
        var img = 'none';

        switch (type) {
            case 'power':   img = 'url("/img/spark_flatPower.png")'; break;
            case 'haste':   img = 'url("/img/spark_flatHaste.png")'; break;
            case 'health':  img = 'url("/img/spark_flatHealth.png")'; break;
        }

        return img;
    },

    /**
     * Get spark color based on type
     * 
     * @param type      Spark type
     */
    getColorFromType: function(type) {
        var color = 'none';

        switch (type) {
            case 'power':   color = 'green'; break;
            case 'haste':   color = 'blue'; break;
            case 'health':  color = 'red'; break;
        }

        return color;
    }
}

/**
 * Shape constructor
 */
function Shape(options) {
    this.wrapper = '';
    this.offset  = { x:0, y:0 };
    this.coords  = { x:0, y:0 };
    this.type    = options.type;
    this.area    = options.area;
    this.width   = options.width;
    this.height  = options.height;
    this.img     = options.img; 
    this.cells   = options.cells; 
    this.gems    = options.gems;
    this.Gems    = [];
}

Shape.prototype = {
    constructor: Shape,

    /**
     * Build Shape
     */
    init: function() {
        var Shape = this,
            gemArray = [];

        this.wrapper = $('<div/>').addClass('grid-shape').css({
            width: this.width,
            height: this.height,
            backgroundImage: 'url(' + this.img + ')',
        }).on('mousedown', function(e) {
            if (e.which == 3) {
                Shape.rotate();
            }
        });

        // build Shape's gems
        this.gems.forEach(function(item, index) {
            var gem = new Gem(item);

            // build gem and add to gemArray
            gem.init();
            gemArray.push(gem.wrapper);

            // assign Gem to Shape
            gem.Shape = Shape;
            Shape.Gems.push(gem);

            // dereference
            gem = null;
        });

        // add gems to shape dom
        this.wrapper.append(gemArray);
    },

    /**
     * Rotate Shape
     */
    rotate: function() {
        this.rotateWrapper();
        this.rotateMatrix();

        return true;
    },

    /**
     * Rotate Shape's matrix in Grid
     */
    rotateMatrix: function() {
        var rotatedCells = [];

        this.cells.forEach(function(item, index, obj) {
            var cell      = item.charAt(0),
                newIndex  = index + 1 >= obj.length ? 0 : index + 1,
                direction = obj[newIndex].charAt(1);
            
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
        var angle = 0,
            transform = this.wrapper.css("-webkit-transform") ||
                        this.wrapper.css("-moz-transform")    ||
                        this.wrapper.css("-ms-transform")     ||
                        this.wrapper.css("-o-transform")      ||
                        this.wrapper.css("transform");

        if (transform !== 'none') {
            var values = transform.split('(')[1].split(')')[0].split(','),
                a = values[0],
                b = values[1];

            angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
        }

        angle = angle < 0 ? angle += 360 : angle;

        this.wrapper.css('transform', 'rotate(' + (angle + 90) + 'deg)');

        return true;
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
                var y    = (ui.originalPosition.top) / 128,
                    x    = (ui.originalPosition.left) / 128,
                    newY = (ui.offset.top - 1) / 128,
                    newX = (ui.offset.left - 1) / 128;

                // move shape to new coords
                if (Grid.willFitShape(shape, { x: newX, y: newY })) {
                    Grid.drawShape(shape, { x: newX, y: newY });
                } else {
                    $(this).remove();
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
     * @return true|false       Returns true if all gems match their corresponding socket's color
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
    }
};
