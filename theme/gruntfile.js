module.exports = function (grunt) {
    grunt.initConfig({
        less: {
            compileTheme: {
                files: { "../app/css/theme.css": "theme-bootstrap.less" },
                options: {
                    sourceMap: true,
                    sourceMapURL: 'theme.css.map',
                    sourceMapFilename: '../app/css/theme.css.map'
                }

            }
        },
        watch: {
            less: {
                files: "*.less",
                tasks: ['less'],
                options: {
                    livereload: {
                        port: 35728
                    }
                }
            },
            html: {
                files: "*.html",
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
                    port: 9002,
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