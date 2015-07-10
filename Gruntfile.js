module.exports = function(grunt) {
  grunt.initConfig({
    concat: {
      options: {
        banner:"'use strict';\n"
      },
      dist: {
        src: [
          'util/polyfill',
          'Grid',
          'Controls',
          'Gem',
          'Spark',
          'Shape'
        ].map(function(file) {
          return 'src/'+file+'.js';
        }),
        dest: 'js/grid.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['concat']);
};
