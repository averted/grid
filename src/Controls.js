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
