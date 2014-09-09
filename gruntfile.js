module.exports = function (grunt) {
    grunt.initConfig({
        nodewebkit: {
            options: {
                platforms: ['linux64', 'win'],
                buildDir: 'build'
            },
            src: [
                './app/**/*',
                './package.json',
                './bower_components/**/*',
                './node_modules/**/*',
                '!./node_modules/grunt*/**/*',
                '!./node_modules/karma*/**/*'
            ]
        }
    });
    grunt.loadNpmTasks('grunt-node-webkit-builder');
    grunt.registerTask('default', ['nodewebkit']);
};

