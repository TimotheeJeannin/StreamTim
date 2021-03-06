module.exports = function (grunt) {
    var fs = require('fs');
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        aws: fs.existsSync("aws.json") ? grunt.file.readJSON('aws.json') : {},
        sources: [
            'app/**/*',
            'package.json',
            'bower_components/**/*',
            'node_modules/**/*',
            '!node_modules/grunt*/**/*',
            '!node_modules/karma*/**/*'
        ],
        nwjs: {
            options: {
                version: '0.12.3',
                platforms: ['linux', 'win', 'osx'],
                macPlist: 'files/Info.plist'
            },
            shared: {
                options: {
                    buildDir: '/mnt/hgfs/s'
                },
                src: ['<%= sources %>']
            },
            local: {
                options: {
                    buildDir: 'build'
                },
                src: ['<%= sources %>']
            }
        },
        compress: {
            linux64: {
                options: {archive: 'package/<%=pkg.name%>-linux64-<%=pkg.version%>.zip'},
                files: [{expand: true, cwd: 'build/<%=pkg.name%>/linux64', src: ['*'], dest: '<%=pkg.name%>'}]
            },
            linux32: {
                options: {archive: 'package/<%=pkg.name%>-linux32-<%=pkg.version%>.zip'},
                files: [{expand: true, cwd: 'build/<%=pkg.name%>/linux32', src: ['*'], dest: '<%=pkg.name%>'}]
            },
            win64: {
                options: {archive: 'package/<%=pkg.name%>-win64-<%=pkg.version%>.zip'},
                files: [{expand: true, cwd: 'build/<%=pkg.name%>/win64', src: ['*'], dest: '<%=pkg.name%>'}]
            },
            win32: {
                options: {archive: 'package/<%=pkg.name%>-win32-<%=pkg.version%>.zip'},
                files: [{expand: true, cwd: 'build/<%=pkg.name%>/win32', src: ['*'], dest: '<%=pkg.name%>'}]
            },
            osx64: {
                options: {archive: 'package/<%=pkg.name%>-osx64-<%=pkg.version%>.zip'},
                files: [{expand: true, cwd: 'build/<%=pkg.name%>/osx64', src: ['**'], dest: '<%=pkg.name%>'}]
            },
            osx32: {
                options: {archive: 'package/<%=pkg.name%>-osx32-<%=pkg.version%>.zip'},
                files: [{expand: true, cwd: 'build/<%=pkg.name%>/osx32', src: ['**'], dest: '<%=pkg.name%>'}]
            }
        },
        clean: {
            node_modules: [
                'node_modules/**/test',
                'node_modules/**/tests',
                'node_modules/**/README*',
                'node_modules/**/readme*',
                'node_modules/**/*.md',
                'node_modules/**/Gruntfile.js',
                'node_modules/**/example',
                'node_modules/**/doc',
                'node_modules/**/LICENSE*',
                'node_modules/**/.travis.yml'],
            package: ['package'],
            build: ['build']
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
                    "theme/bootstrap-theme.css": "theme/bootstrap-theme.less",
                    "app/css/bootstrap-theme.css": "theme/bootstrap-theme.less",
                    "web/bootstrap-theme.css": "theme/bootstrap-theme.less",
                    "web/style.css": "web/style.less"
                },
                options: {
                    sourceMap: true,
                    sourceMapURL: '../theme/bootstrap-theme.css.map',
                    sourceMapFilename: 'theme/bootstrap-theme.css.map'
                }

            }
        },
        watch: {
            options: {
                livereload: true
            },
            less: {
                files: [
                    "theme/*.less",
                    "web/style.less"
                ],
                tasks: ['less']
            },
            html: {
                files: [
                    "theme/bootstrap-theme-test.html",
                    "web/index.html",
                    "app/index.html"
                ]
            }
        },
        connect: {
            server: {
                options: {
                    hostname: 'localhost',
                    port: 9002
                }
            }
        },
        aws_s3: {
            options: {
                accessKeyId: '<%= aws.AWSAccessKeyId %>', // Use the variables
                secretAccessKey: '<%= aws.AWSSecretKey %>', // You can also use env variables
                region: 'us-west-2',
                bucket: 'www.streamtim.com',
                differential: true
            },
            site: {
                files: [
                    {expand: true, cwd: 'web/', src: ['**'], dest: './'}
                ]
            },
            packages: {
                files: [
                    {expand: true, cwd: 'package/', src: ['**'], dest: './package', stream: true}
                ]
            }
        }
    });
    grunt.loadNpmTasks('grunt-nw-builder');
    grunt.loadNpmTasks('grunt-file-creator');
    grunt.loadNpmTasks('grunt-aws-s3');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('shareDebug', ['nwjs:shared']);
    grunt.registerTask('shareRelease', ['file-creator:release', 'nwjs:shared', 'file-creator:debug']);

    grunt.registerTask('debug', ['nwjs:local']);
    grunt.registerTask('release', ['file-creator:release', 'nwjs:local', 'file-creator:debug']);

    grunt.registerTask('package', ['clean', 'release', 'compress']);
    grunt.registerTask('deploy', ['package', 'aws_s3:packages']);

    grunt.registerTask('site', ['aws_s3:site']);

    grunt.registerTask('default', ['less', 'connect', 'watch']);
};

