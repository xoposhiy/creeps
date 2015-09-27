module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-screeps');
	grunt.loadNpmTasks('grunt-typescript');

	var options = require('./credentials');
	
	options.branch = 'default';

	grunt.initConfig({
		screeps: {
			options: options,
			dist: {
				src: ['dist/*.*']
			}
		},
		typescript: {
			compile: {
				src: ['src/**/*.ts'],
				dest: 'dist',
				options: {
					module: 'commonjs',
					target: 'es5'
				}
			}
		}

	});

	grunt.registerTask('default', ['typescript', 'screeps']);
	grunt.registerTask('compile', ['typescript']);
};