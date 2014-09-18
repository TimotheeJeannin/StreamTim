module.exports = function (grunt) {
    grunt.initConfig({
        nodewebkit: {
            options: {
                platforms: ['linux64', 'win', 'osx'],
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
        "file-creator": {
            "debug": {
                "./app/js/debug.js": function (fs, fd, done) {
                    fs.writeSync(fd, 'var debug = true;');
                    done();
                }
            },
            "release": {
                "./app/js/debug.js": function (fs, fd, done) {
                    fs.writeSync(fd, 'var debug = false;');
                    done();
                }
            }
        },
        less: {
            compileTheme: {
                files: {
                    "./app/css/theme.css": "bootstrap-theme.less",
                    "./web/theme.css": "bootstrap-theme.less"
                },
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
                files: [
                    "bootstrap-theme-test.html",
                    "web/index.html",
                    "app/index.html"
                ],
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
                    hostname: 'localhost',
                    port: 9002,
                    keepalive: true
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-node-webkit-builder');
    grunt.loadNpmTasks('grunt-file-creator');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('theme', ['less', 'watch']);
    grunt.registerTask('release', ['file-creator:release', 'nodewebkit']);
    grunt.registerTask('debug', ['file-creator:debug', 'nodewebkit']);
    grunt.registerTask('default', ['release']);
};

