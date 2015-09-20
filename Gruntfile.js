module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-screeps');

    grunt.initConfig({
        screeps: {
            options: require('./credentials'),
            dist: {
                src: ['src/*.js']
            }
        }
    });
}