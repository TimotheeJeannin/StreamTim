module.exports = function (grunt) {
    grunt.initConfig({
        less: {
            compileTheme: {
                files: { "css/theme-bootstrap.css": "less/theme-bootstrap.less" },
                options: {
                    sourceMap: true,
                    sourceMapURL: 'theme-bootstrap.css.map',
                    sourceMapFilename: 'css/theme-bootstrap.css.map'
                }

            },
            compileAdditions: {
                files: { "css/theme-additions.css": "less/theme-additions.less" },
                options: {
                    sourceMap: true,
                    sourceMapURL: 'theme-additions.css.map',
                    sourceMapFilename: 'css/theme-additions.css.map'
                }
            }
        },
        watch: {
            less: {
                files: "less/*.less",
                tasks: ['less'],
                options: {
                    livereload: {
                        port: 35728
                    }
                }
            },
            html: {
                files: "test/*.html",
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
                    port: 9001,
                    keepalive: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.registerTask('default', ['less', 'watch']);
};