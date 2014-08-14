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
 * Shape
 */
function Shape(type) {
    this.type = type;
    this.wrapper = '';
    this.area = 0;
    this.width = 0;
    this.height = 0;
    this.offset = { x:0, y:0 };
    this.src = '';
    this.cells = [];

    switch (type) {
        case 'triangle':
            this.width = 256;
            this.height = 256;
            this.area = (this.width * this.height) / 2;
            this.cells = [ '02', '33', '54', '30' ];   // describes position of each cell
            this.src = '/img/shape_triangle.png';
            break;
        case 'square':
            this.width = 128;
            this.height = 128;
            this.src = '/img/shape_square.png';
            this.cells = [ '50' ];
            this.area = this.width * this.height;
            break;
        case 'square2x':
            this.width = 256;
            this.height = 256;
            this.area = this.width * this.height;
            this.cells = [ '52', '53', '54', '50' ];
            this.src = '/img/shape_square_big.png';
            break;
    }
}

Shape.prototype = {
    constructor: Shape,

    init: function() {
        // click ability, etc...
        this.wrapper = $('<div/>').addClass('grid-shape').css({
            width: this.width,
            height: this.height,
            backgroundImage: 'url(' + this.src + ')',
        }).on('dblclick', function(e) {
            $(this).remove();
        });
    },

    enableDrag: function() {
        var origTop  = this.wrapper.css('top'),
            origLeft = this.wrapper.css('left');

        this.wrapper.draggable({
            grid: [ 128, 128 ],
            containment: 'parent',

            start: function(e, ui) {

            },

            drag: function(e, ui) {

            },

            stop: function(e, ui) {

            },
        });
    }
};

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

    addShape: function(shape) {
        // check for available space
        if (!Grid.hasSpace(shape)) { alert('not enough space'); return false; }

        // build shape
        shape.init();

        // find starting location for shape 
        var coords = Grid.findLocationForShape(shape);
        if (coords) {
            Grid.drawShape(coords, shape);
        } else {
            alert('NO SPACE, try re-organizing?');
            return false;
        }
        
        Grid.matrix.forEach(function(item, index) {
            console.log(item);
        });

        // add offset?
        shape.wrapper.css({
            top: shape.offset.y * 128 + 'px',
            left: shape.offset.x * 128 + 'px',
        });

        // add to grid
        this.content.append(shape.wrapper);
        this.availableSpace -= shape.area;
        shape.enableDrag();
    },

    findLocationForShape: function(shape) {
        for (var y = 0; y < 4; y++) {
            for (var x = 0; x < 4; x++) {
                if (Grid.willFit(shape.cells[0].charAt(0), Grid.matrix[y][x])) {
                    return { x: y, y: x }
                }
                shape.offset.x++;
                if (x == 3) shape.offset.x = 0;
            }
            shape.offset.y++;
        }

        return false;
    },

    updateMatrix: function() {

    },

    drawShape: function(coords, shape) {
        var x = coords.x,
            y = coords.y;

        shape.cells.forEach(function(item, index) {
            var cell      = item.charAt(0),
                direction = item.charAt(1);
            
            Grid.matrix[x][y] = cell; 

            switch (direction) {
                case '1': y--; break; // top
                case '2': x++; break; // right
                case '3': y++; break; // bottom
                case '4': x--; break; // left
            }
        });
    },

    willFit: function(cell, matrix_cell) {
        if (matrix_cell == 0) { return true; }

        switch (cell) {
            case 0: return true;
            case 1: if (matrix_cell == 3) { return true; }
            case 2: if (matrix_cell == 4) { return true; }
            case 3: if (matrix_cell == 1) { return true; }
            case 4: if (matrix_cell == 2) { return true; }
            default:
                return false;
        }
    },

    hasSpace: function(shape) {
        return this.availableSpace - shape.area >= 0 ? true : false;
    },
};

/**
 * Controls 
 */
var Controls = {
    init: function() {
        $('.shape').on('click', function() {
            Grid.addShape(new Shape($(this).attr('data-type')));
        });
    },
};

Controls.init();
























/*
var Shape = {
    width: 0,
    height: 0,
    src: '',

    init: function(type) {
        switch (type) {
            case 'triangle':
                this.width = 256;
                this.height = 256;
                this.src = '/img/shape_triangle.png';
                break;
            case 'square':
                this.width = 128;
                this.height = 128;
                this.src = '/img/shape_square.png';
                break;
            case 'square2x':
                this.width = 256;
                this.height = 256;
                this.src = '/img/shape_square_big.png';
                break;
        }
    },

    factory: function(type) {
        var instance = Object.create(Shape);
        instance.init(type);

        return instance;
    },
};

var shape1 = Shape.factory('triangle');
*/
