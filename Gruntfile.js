module.exports = function(grunt) {
    grunt.initConfig({
        concat: {
            options: {
                banner:"'use strict';\n"
            },
            dist: {
                src: [
                    'util/extend',
                    'Grid',
                    'Controls',
                    'Gem',
                    'Spark',
                    'Shape'
                ].map(function(file) {
                    return 'src/'+file+'.js';
                }),
                dest: 'js/grid-build.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('default', ['concat']);
};
