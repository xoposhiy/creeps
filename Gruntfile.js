module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-screeps');

	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		screeps: {
			options: require('./credentials'),
			dist: {
				src: ['src/*.js']
			}
		},
		eslint: {
			target: ['src/*.js']
		}

	});

	grunt.registerTask('default', ['eslint', 'screeps']);
};