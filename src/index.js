import Grid from './grid';
import Shape from './shape';

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
      "cells": [ "02", "33", "54", "30" ],
      "gems": [
        {
          "color": "red",
          "offset": { "x": 1, "y": 1 }
        }
      ],
      "img": "img/shape_triangle.png",
      "bonus": "none"
    },

    "square": {
      "type": "square",
      "width": 128,
      "height": 128,
      "area": 16384,
      "cells": [ "50" ],
      "gems": [ "10" ],
      "gems": [
        {
          "color": "blue",
          "offset": { "x": 0, "y": 0 }
        }
      ],
      "img": "img/shape_square.png"
    },

    "square2x": {
      "type": "square2x",
      "width": 256,
      "height": 256,
      "area": 65534,
      "cells": [ "52", "53", "54", "50" ],
      "gems": [
        {
          "color": "red",
          "offset": { "x": 0, "y": 0 }
        },
        {
          "color": "green",
          "offset": { "x": 1, "y": 0 }
        },
        {
          "color": "blue",
          "offset": { "x": 1, "y": 1 }
        },
        {
          "color": "combo",
          "offset": { "x": 0, "y": 1 }
        }
      ],
      "img": "img/shape_square2x.png"
    },

    "rectangle": {
      "type": "rectangle",
      "width": 256,
      "height": 128,
      "area": 32768,
      "cells": [ "52", "50" ],
      "gems": [
        {
          "color": "red",
          "offset": { "x": 0, "y": 0 }
        },
        {
          "color": "green",
          "offset": { "x": 1, "y": 0 }
        }
      ],
      "img": "img/shape_rectangle.png"
    },

    "outrider": {
      "type": "outrider",
      "width": 256,
      "height": 384,
      "area": 65536,
      "cells": [ "32", "23", "54", "53", "50" ],
      "gems": [
        {
          "color": "combo",
          "offset": { "x": 0.5, "y": 0.2 }
        },
        {
          "color": "green",
          "offset": { "x": 0, "y": 1 }
        },
        {
          "color": "green",
          "offset": { "x": 1, "y": 1 }
        },
        {
          "color": "combo",
          "offset": { "x": 0, "y": 2 }
        }
      ],
      "img": "img/shape_outrider.png"
    }
  }
};

/**
 * App
 */
(function() {
  $('.shape').on('click', function() {
    var shape_type = $(this).attr('data-type');

    Grid.addShape(new Shape(shapes.common[shape_type]));
  });
})();
