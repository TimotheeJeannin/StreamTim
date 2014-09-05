module.exports = function (grunt) {
    grunt.initConfig({
        nodewebkit: {
            options: {
                platforms: ['win', 'osx', 'linux32', 'linux64'],
                buildDir: 'build'
            },
            src: ['./**/*']
        }
    });
    grunt.loadNpmTasks('grunt-node-webkit-builder');
    grunt.registerTask('default', ['nodewebkit']);
};

