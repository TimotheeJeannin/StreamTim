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
        },
        less: {
            compileTheme: {
                files: { "./app/css/theme.css": "bootstrap-theme.less" },
                options: {
                    sourceMap: true,
                    sourceMapURL: 'theme.css.map',
                    sourceMapFilename: './app/css/theme.css.map'
                }

            }
        },
        watch: {
            less: {
                files: "bootstrap-theme.less",
                tasks: ['less'],
                options: {
                    livereload: {
                        port: 35728
                    }
                }
            },
            html: {
                files: "bootstrap-theme-test.html",
                options: {
                    livereload: {
                        port: 35728
                    }
                }
            }
        },
        connect: {
            server: {
                options: {
                    hostname: '*',
                    port: 9002,
                    keepalive: true
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-node-webkit-builder');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('theme', ['less', 'watch']);
    grunt.registerTask('default', ['nodewebkit']);
};

