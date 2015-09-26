module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-screeps');
	var options = require('./credentials');
	
	require('load-grunt-tasks')(grunt);

	options.branch = 'default';

	grunt.initConfig({
		screeps: {
			options: options,
			dist: {
				src: ['src/*.js', 'src/*.js.map']
			}
		},
		eslint: {
			target: ['src/*.js']
		}

	});

	grunt.registerTask('default', ['eslint', 'screeps']);
};